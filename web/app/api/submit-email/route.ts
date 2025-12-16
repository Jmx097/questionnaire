import { NextRequest, NextResponse } from 'next/server';
import { createSecureLink } from '@/lib/secure-link';
import { scoreProfile } from '@/config/scoring';
import type { Answers } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, optInEmails, acceptPrivacy, segment, quizData } = body;

    // Validate required fields
    if (!name || !email || !acceptPrivacy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Rate limiting check (simple in-memory for demo)
    const clientIP = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    
    // Calculate score profile from quiz data
    const scoreData = quizData ? scoreProfile(quizData as Answers) : null;
    
    // Create secure link with 7-day expiry
    const secureLink = createSecureLink({
      email,
      segment,
      timestamp: Date.now(),
    });

    // Prepare comprehensive Make webhook payload
    const webhookPayload = {
      // User information
      name,
      email,
      optInEmails,
      
      // Quiz responses (Q1-Q5)
      quiz: {
        segment: quizData?.segment || segment,
        teamSize: quizData?.teamSize,
        sentiment: quizData?.sentiment,
        tools: quizData?.tools || [],
        pain: quizData?.pain,
        pain_other: quizData?.pain_other,
        valuePerMonth: quizData?.valuePerMonth,
        urgency: quizData?.urgency,
      },
      
      // Calculated profile and score
      profile: {
        segment: segment,
        score: scoreData?.score || 0,
        tier: scoreData?.tier || 'low',
        offer: scoreData?.offer || 'Plinko Pocket',
        identity_maturity: scoreData?.identity_maturity || 0,
        integration_score: scoreData?.integration_score || 0,
        pain_intensity: scoreData?.pain_intensity || 0,
        budget_score: scoreData?.budget_score || 0,
        urgency_score: scoreData?.urgency_score || 0,
      },
      
      // Metadata
      timestamp: new Date().toISOString(),
      source: 'email_capture_form',
      clientIP,
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Send to Make webhook with retry logic
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeWebhookUrl) {
      try {
        await sendToMakeWebhook(makeWebhookUrl, webhookPayload);
      } catch (error) {
        console.error('Make webhook failed after retries:', error);
        // Continue processing even if webhook fails
      }
    }

    // Send email with secure link
    try {
      await fetch(`${request.nextUrl.origin}/api/email-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          name,
          secureLink,
          segment,
          score: scoreData?.score,
          tier: scoreData?.tier,
        }),
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email submitted successfully',
      secureLink,
      webhookSent: !!makeWebhookUrl,
    });

  } catch (error) {
    console.error('Email submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send payload to Make webhook with retry logic
 */
async function sendToMakeWebhook(url: string, payload: any): Promise<void> {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Source': 'questionnaire-app',
          'X-Webhook-Timestamp': new Date().toISOString(),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`Make webhook sent successfully (attempt ${attempt})`);
        return;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Make webhook attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw new Error(`Make webhook failed after ${maxRetries} attempts: ${error}`);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
}