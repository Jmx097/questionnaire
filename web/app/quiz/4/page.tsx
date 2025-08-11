'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/store';
import { QuestionRevealPage } from '@/components/questions/QuestionRevealPage';
import { PAIN_OPTIONS, SEGMENT_PROMPTS } from '@/config/questions';
export default function Step4(){
  const router=useRouter(); const { a, set } = useQuiz();
  const seg = a.segment ?? 'other';
  const options = (PAIN_OPTIONS as any)[seg] ?? PAIN_OPTIONS.other;
  const prompt = SEGMENT_PROMPTS[seg] ?? SEGMENT_PROMPTS.other;
  return (<QuestionRevealPage title={prompt} note="Pick the one that stings most. We’ll solve for that first."
    answers={options.map(o=>({key:o.key,label:o.label}))}
    onPick={(k)=>{ set('pain', k as any); router.push('/quiz/5'); }} />);
}
