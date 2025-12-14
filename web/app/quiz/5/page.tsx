'use client';
import React,{useState} from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/store';
import { QuestionRevealPage } from '@/components/questions/QuestionRevealPage';
export default function Step5(){
  const router=useRouter(); const { set } = useQuiz();
  const [stage,setStage]=useState<'value'|'urgency'>('value');
  if(stage==='value') {
    return (<QuestionRevealPage title="If we fixed that one thing, about how much would it be worth each month?"
    note="A rough guess is perfect—this just helps me right-size."
    answers={[
      {key:'250',label:'$0–$499'},
      {key:'1200',label:'$500–$1.9k'},
      {key:'3000',label:'$2k–$4.9k'},
      {key:'6000',label:'$5k+'},
    ]} onPick={(k)=>{ set('valuePerMonth', Number(k)); setStage('urgency'); }} />);
  }
  return (<QuestionRevealPage title="How soon would you act if the right solution showed up?"
    answers={[
      {key:'asap',label:'ASAP'},
      {key:'30d',label:'Within 30 days'},
      {key:'quarter',label:'This quarter'},
      {key:'research',label:'Just researching'},
    ]} onPick={(k)=>{ set('urgency', k as any); router.push('/quiz/result'); }} />);
}
