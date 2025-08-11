'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/store';
import { QuestionRevealPage } from '@/components/questions/QuestionRevealPage';
export default function Step2(){
  const router=useRouter(); const { set } = useQuiz();
  return (<QuestionRevealPage title="Beautiful. How big is your team right now?" note="This helps me right-size recommendations so they actually fit your world."
    answers={[
      {key:'solo',label:'Just me'},
      {key:'2-5',label:'2–5'},
      {key:'6-20',label:'6–20'},
      {key:'21+',label:'21+'},
    ]} onPick={(k)=>{ set('teamSize', k as any); router.push('/quiz/3'); }} />);
}
