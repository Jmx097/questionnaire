'use client';
import React,{useState} from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/store';

export default function Step5(){
  const router=useRouter(); 
  const { set } = useQuiz();
  const [stage,setStage]=useState<'value'|'urgency'>('value');
  
  if(stage==='value') {
    return (
      <main className="min-h-dvh bg-black text-white">
        <section className="mx-auto max-w-3xl px-6 pt-24 pb-16">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            If we fixed that one thing, about how much would it be worth each month?
          </h1>
          <p className="text-white/70 mt-2">A rough guess is perfect—this just helps me right-size.</p>
        </section>
        
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 auto-rows-[140px]">
            {[
              {key:'250',label:'$0–$499'},
              {key:'1200',label:'$500–$1.9k'},
              {key:'3000',label:'$2k–$4.9k'},
              {key:'6000',label:'$5k+'},
            ].map((answer, i) => (
              <button 
                key={answer.key}
                className="bg-emerald-600 group bento-tile relative overflow-hidden rounded-2xl border border-white/10 p-5 text-left transition will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={() => { 
                  console.log('Value answer clicked:', answer.key);
                  set('valuePerMonth', Number(answer.key)); 
                  setStage('urgency'); 
                }}
              >
                <div className="relative z-10 flex h-full w-full items-center justify-center text-center text-lg font-semibold text-white drop-shadow">
                  <span>{answer.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }
  
  return (
    <main className="min-h-dvh bg-black text-white">
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          How soon would you act if the right solution showed up?
        </h1>
      </section>
      
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 auto-rows-[140px]">
          {[
            {key:'asap',label:'ASAP'},
            {key:'30d',label:'Within 30 days'},
            {key:'quarter',label:'This quarter'},
            {key:'research',label:'Just researching'},
          ].map((answer, i) => (
            <button 
              key={answer.key}
              className="bg-cyan-600 group bento-tile relative overflow-hidden rounded-2xl border border-white/10 p-5 text-left transition will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => { 
                console.log('Urgency answer clicked:', answer.key);
                set('urgency', answer.key as any); 
                console.log('About to navigate to email-capture');
                router.push('/quiz/email-capture'); 
              }}
            >
              <div className="relative z-10 flex h-full w-full items-center justify-center text-center text-lg font-semibold text-white drop-shadow">
                <span>{answer.label}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            Debug: Click an answer above to test navigation
          </p>
        </div>
      </section>
    </main>
  );
}
