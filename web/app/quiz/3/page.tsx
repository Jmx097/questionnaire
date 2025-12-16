'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/store';
import { QuestionRevealPage } from '@/components/questions/QuestionRevealPage';
export default function Step3(){
  const router=useRouter(); const { set } = useQuiz();
  return (<QuestionRevealPage title="How are you feeling about AI right now?" note="No wrong answers. I just want to meet you where you are."
    answers={[
      {key:'excited',label:'Excited'},
      {key:'curious',label:'Curious'},
      {key:'overwhelmed',label:'Overwhelmed'},
      {key:'skeptical',label:'Skeptical'},
      {key:'daily',label:'Using it daily'},
      {key:'starting',label:'Just getting started'},
    ]} onPick={(k)=>{ set('sentiment', k as any); router.push('/quiz/3.5'); }} />);
}
