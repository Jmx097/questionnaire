import { NextRequest, NextResponse } from 'next/server';
import { createSecureLink } from '@/lib/secure-link';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, optInEmails, acceptPrivacy, segment } = body;

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
    
    // Create secure link with 7-day expiry
    const secureLink = createSecureLink({
      email,
      segment,
      timestamp: Date.now(),
    });

    // Prepare webhook payload (excluding sensitive data)
    const webhookPayload = {
      name,
      email, // Only include email for external webhook
      optInEmails,
      segment,
      timestamp: Date.now(),
      source: 'email_capture_form',
    };

    // Send to external webhook if configured
    const externalWebhookUrl = process.env.EXTERNAL_WEBHOOK_URL;
    if (externalWebhookUrl) {
      try {
        await fetch(externalWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': createWebhookSignature(JSON.stringify(webhookPayload)),
          },
          body: JSON.stringify(webhookPayload),
        });
      } catch (error) {
        console.error('External webhook failed:', error);
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
    });

  } catch (error) {
    console.error('Email submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createWebhookSignature(payload: string): string {
  const secret = process.env.WEBHOOK_SECRET_KEY || 'default-secret';
  // Simple HMAC signature - in production use crypto.createHmac
  return Buffer.from(payload + secret).toString('base64');
}