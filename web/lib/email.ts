// Email service integration for sending transactional emails
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.EMAIL_SERVICE_API_KEY;
  const fromEmail = options.from || process.env.EMAIL_FROM || 'noreply@example.com';

  if (!apiKey) {
    console.warn('EMAIL_SERVICE_API_KEY not configured, email will be logged to console');
    return logEmailToConsole(options);
  }

  try {
    // Using Resend as the email service
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}

function logEmailToConsole(options: EmailOptions): EmailResult {
  console.log('=== EMAIL LOG ===');
  console.log('To:', options.to);
  console.log('Subject:', options.subject);
  console.log('HTML Content:', options.html);
  console.log('================');
  
  return {
    success: true,
    messageId: 'console-logged',
  };
}

export function generateEmailTemplate({
  name,
  secureLink,
  segment,
}: {
  name: string;
  secureLink: string;
  segment: string;
}): EmailOptions {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const fullLink = `${appUrl}/quiz/result?${secureLink}`;
  
  const subject = 'Your Personalized AI Automation Report';
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h1>
      
      <p style="font-size: 16px; line-height: 1.6; color: #555;">
        Thanks for completing your AI readiness assessment! Here's your personalized automation report.
      </p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Your Results Summary</h3>
        <p><strong>Business Segment:</strong> ${segment}</p>
        <p><strong>Report Status:</strong> Ready for download</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${fullLink}" 
           style="background: linear-gradient(45deg, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          View Your Complete Report
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        <strong>Important:</strong> This link will expire in 7 days for security. If you need to access your 
        report again, simply visit our website and complete the assessment.
      </p>
      
      <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #333;">🚀 What's Next?</h4>
        <ul style="margin: 0; padding-left: 20px; color: #555;">
          <li>Download your personalized automation plan</li>
          <li>Join our exclusive AI automation community</li>
          <li>Get actionable steps to start automating today</li>
        </ul>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #999; text-align: center;">
        If you have any questions, just reply to this email. We're here to help! <br>
        © 2024 AI Automation Assessment. All rights reserved.
      </p>
    </div>
  `;
  
  const text = `
Hi ${name}!

Thanks for completing your AI readiness assessment! Here's your personalized automation report.

Your Results Summary:
- Business Segment: ${segment}
- Report Status: Ready for download

View your complete report here: ${fullLink}

Important: This link will expire in 7 days for security.

What's Next?
- Download your personalized automation plan
- Join our exclusive AI automation community
- Get actionable steps to start automating today

If you have any questions, just reply to this email. We're here to help!

© 2024 AI Automation Assessment. All rights reserved.
  `;
  
  return {
    to: '', // Will be set by caller
    subject,
    html,
    text,
  };
}