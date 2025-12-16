'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/store';
import { MultiSelectPage } from '@/components/questions/MultiSelectPage';

const COMMON_TOOLS = [
  { key: 'slack', label: 'Slack' },
  { key: 'notion', label: 'Notion' },
  { key: 'airtable', label: 'Airtable' },
  { key: 'zapier', label: 'Zapier' },
  { key: 'make', label: 'Make' },
  { key: 'hubspot', label: 'HubSpot' },
  { key: 'salesforce', label: 'Salesforce' },
  { key: 'clickup', label: 'ClickUp' },
  { key: 'asana', label: 'Asana' },
  { key: 'gmail', label: 'Gmail' },
  { key: 'sheets', label: 'Google Sheets' },
  { key: 'calendly', label: 'Calendly' },
  { key: 'stripe', label: 'Stripe' },
  { key: 'quickbooks', label: 'QuickBooks' },
  { key: 'none', label: 'None / Just getting started' },
];

export default function Step3_5() {
  const router = useRouter();
  const { set } = useQuiz();

  const handleContinue = (selected: string[]) => {
    set('tools', selected);
    router.push('/quiz/4');
  };

  return (
    <MultiSelectPage
      title="What tools do you use regularly?"
      note="Select all that apply. This helps us understand your current tech stack."
      options={COMMON_TOOLS}
      onContinue={handleContinue}
      minSelections={0}
      maxSelections={10}
    />
  );
}
