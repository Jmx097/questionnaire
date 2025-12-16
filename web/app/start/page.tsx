'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { TargetCursor } from '@/components/cursor/TargetCursor';
import { MagicBento } from '@/components/bento/MagicBento';

export default function StartPage(){
  const router=useRouter();
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center text-white bg-black overflow-hidden px-6">
      <TargetCursor />
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-4">Choose your portal</h1>
        <p className="text-white/70 text-lg md:text-xl">Any tile will take you into the journey.</p>
      </div>
      <div className="max-w-5xl w-full">
        <MagicBento
          tiles={[
            {key:'identity',title:'Identity',subtitle:'Who you are + goals',className:'md:col-span-2'},
            {key:'architecture',title:'Architecture',subtitle:'Your tools + systems',className:'md:row-span-2'},
            {key:'experience',title:'Experience',subtitle:'Pain points + outcomes'},
            {key:'get-started',title:'Get Started',subtitle:'Jump right in',className:'md:col-span-2'}
          ]}
          onContinue={()=>router.push('/quiz/1')}
        />
      </div>
    </main>
  );
}
