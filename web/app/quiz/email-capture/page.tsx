'use client';
import React from 'react';
import { EmailCaptureForm } from '@/components/EmailCaptureForm';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/store';

export default function EmailCapture() {
  const router = useRouter();
  const { a } = useQuiz();

  const handleSubmit = async (data: {
    name: string;
    email: string;
    optInEmails: boolean;
    acceptPrivacy: boolean;
  }) => {
    try {
      // Submit to our API endpoint
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          segment: a.segment || 'other', // Get segment from quiz state
          responses: {
            segment: a.segment,
            teamSize: a.teamSize,
            sentiment: a.sentiment,
            pain: a.pain,
            valuePerMonth: a.valuePerMonth,
            urgency: a.urgency,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit email capture');
      }

      const result = await response.json();
      
      // Redirect to results page with confirmation
      router.push(`/quiz/result?emailSent=true&email=${encodeURIComponent(data.email)}&token=${encodeURIComponent(result.secureLink)}`);
    } catch (error) {
      console.error('Error submitting email capture:', error);
      throw error;
    }
  };

  return <EmailCaptureForm onSubmit={handleSubmit} />;
}