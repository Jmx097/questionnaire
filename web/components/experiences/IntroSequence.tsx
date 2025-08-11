'use client';
import React,{useEffect,useRef,useState} from 'react';
import { SplitTextHey, type SplitTextControls } from '@/components/text/SplitTextHey';
import { useRouter } from 'next/navigation';

type Phase='BG'|'HEY_IN'|'HEY_OUT'|'DONE';

export function IntroSequence({
  nextHref='/start',
  bgOnlyMs=1200,
  heyHoldMs=800,
  heyDurationMs=1600
}:{nextHref?:string;bgOnlyMs?:number;heyHoldMs?:number;heyDurationMs?:number}) {
  const [phase,setPhase]=useState<Phase>('BG');
  const heyRef=useRef<SplitTextControls>(null);
  const router=useRouter();

  useEffect(()=>{ const t=setTimeout(()=>setPhase('HEY_IN'), bgOnlyMs); return ()=>clearTimeout(t); },[bgOnlyMs]);
  useEffect(()=>{
    if(phase==='HEY_IN'){ heyRef.current?.playIn(); const t=setTimeout(()=>setPhase('HEY_OUT'), heyDurationMs+heyHoldMs); return ()=>clearTimeout(t); }
    if(phase==='HEY_OUT'){ heyRef.current?.reverseOut(()=>setPhase('DONE')); }
    if(phase==='DONE'){ router.push(nextHref); }
  },[phase,heyHoldMs,heyDurationMs,nextHref,router]);

  return (
    <main className="relative min-h-dvh flex items-center justify-center text-white">
      {(phase==='HEY_IN'||phase==='HEY_OUT') && (
        <div className="absolute inset-0 grid place-items-center">
          <SplitTextHey text="Hey!" ref={heyRef} />
        </div>
      )}
    </main>
  );
}
