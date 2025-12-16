import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, name, secureLink, segment } = body;

    // Validate required fields
    if (!to || !name || !secureLink || !segment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate email template
    const emailOptions = generateEmailTemplate({
      name,
      secureLink,
      segment,
    });

    // Send email
    const result = await sendEmail({
      ...emailOptions,
      to,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully',
    });

  } catch (error) {
    console.error('Email report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}