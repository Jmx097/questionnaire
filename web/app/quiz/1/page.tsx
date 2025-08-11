'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/store';
import { QuestionRevealPage } from '@/components/questions/QuestionRevealPage';
export default function Step1(){
  const router=useRouter(); const { set } = useQuiz();
  return (<QuestionRevealPage title="Hey — quick intro. What kind of business are you building?" note="Pick the closest match. I’ll tailor everything after this to you."
    answers={[
      {key:'real_estate',label:'Real Estate'},
      {key:'consulting',label:'Consulting / Coaching'},
      {key:'personal_brand',label:'Personal Brand / Creator'},
      {key:'agency',label:'Creative / Marketing Agency'},
      {key:'finance',label:'Private Equity / Finance'},
      {key:'construction',label:'Home Construction / Contractor'},
      {key:'other',label:'Other'},
    ]} onPick={(k)=>{ set('segment', k as any); router.push('/quiz/2'); }} />);
}
