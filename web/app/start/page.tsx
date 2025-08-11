'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { LightRaysBackground } from '@/components/backgrounds/LightRays';
import { TargetCursor } from '@/components/cursor/TargetCursor';
import { MagicBento } from '@/components/bento/MagicBento';
export default function StartPage(){
  const router=useRouter();
  return (<main className="relative min-h-dvh bg-black text-white">
    <LightRaysBackground /><TargetCursor />
    <div className="mx-auto max-w-3xl px-6 pt-16 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Choose your portal</h1>
      <p className="text-white/70 mt-2">Any tile will take you into the journey.</p>
    </div>
    <MagicBento tiles={[
      {key:'identity',title:'Identity',subtitle:'Who you are + goals',className:'md:col-span-2'},
      {key:'architecture',title:'Architecture',subtitle:'Your tools + systems',className:'md:row-span-2'},
      {key:'experience',title:'Experience',subtitle:'Pain points + outcomes'},
      {key:'get-started',title:'Get Started',subtitle:'Jump right in',className:'md:col-span-2'}
    ]} onContinue={()=>router.push('/quiz/1')} />
  </main>);
}
