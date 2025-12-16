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
    quizData?: any;
  }) => {
    try {
      // Submit to our API endpoint with comprehensive data for Make webhook
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          optInEmails: data.optInEmails,
          acceptPrivacy: data.acceptPrivacy,
          segment: a.segment || 'other',
          quizData: data.quizData || a, // Use quizData from form or fallback to store state
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit email capture');
      }

      const result = await response.json();
      
      // Redirect to results page with confirmation
      router.push(`/quiz/result?emailSent=true&email=${encodeURIComponent(data.email)}&token=${encodeURIComponent(result.secureLink)}&webhook=${result.webhookSent ? 'true' : 'false'}`);
    } catch (error) {
      console.error('Error submitting email capture:', error);
      throw error;
    }
  };

  return <EmailCaptureForm onSubmit={handleSubmit} />;
}