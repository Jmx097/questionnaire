'use client';
import React,{useState} from 'react';
import { cn } from '@/lib/utils';
export function MagicAnswerBento({answers,onPick,revealDelayMs=400}:{answers:{key:string;label:string;color?:string}[];onPick:(key:string)=>void;revealDelayMs?:number}){
  const [clicked,setClicked]=useState<string|null>(null); const base=['bg-emerald-600','bg-cyan-600','bg-indigo-600','bg-fuchsia-600','bg-rose-600','bg-amber-600','bg-lime-600','bg-sky-600'];
  return (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 auto-rows-[140px]">
    {answers.map((a,i)=>{ const isClicked=clicked===a.key; const color=a.color??base[i%base.length]; return (
      <button key={a.key} className={cn('group bento-tile relative overflow-hidden rounded-2xl border border-white/10 p-5 text-left transition will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white', color)}
        onClick={()=>{ if(clicked) return; setClicked(a.key); setTimeout(()=>onPick(a.key), revealDelayMs); }}>
        <div className={cn('absolute inset-0 backdrop-blur-[2px] grayscale transition-opacity', isClicked?'opacity-0':'opacity-100')} aria-hidden />
        <div className="relative z-10 flex h-full w-full items-center justify-center text-center text-lg font-semibold text-white drop-shadow"><span>{a.label}</span></div>
        <div className="pointer-events-none absolute -inset-16 rotate-6 bg-white/10 blur-2xl" />
      </button>
    );})}
  </div>);
}
