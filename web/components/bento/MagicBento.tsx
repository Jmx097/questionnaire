'use client';
import React,{useState} from 'react';
import { cn } from '@/lib/utils';
type Tile={key:string; title:string; subtitle?:string; icon?:React.ReactNode; className?:string};
export function MagicBento({tiles,onContinue,revealDelayMs=600}:{tiles:Tile[];onContinue:(key:string)=>void;revealDelayMs?:number}){
  const [revealed,setRevealed]=useState<string|null>(null);
  return (<div className="relative mx-auto max-w-5xl px-6 py-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px]">
      {tiles.map(t=>{ const isClicked=revealed===t.key; return (
        <button key={t.key}
          className={cn('bento-tile group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm transition transform hover:border-white/20 hover:bg-white/[.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-white', t.className)}
          onClick={()=>{ if(revealed) return; setRevealed(t.key); setTimeout(()=>onContinue(t.key), revealDelayMs); }}
        >
          <div className={cn('absolute inset-0 transition', isClicked?'backdrop-blur-0 grayscale-0 opacity-0':'backdrop-blur-[2px] grayscale opacity-100')} aria-hidden />
          <div className={cn('relative z-10 flex h-full flex-col justify-between text-white transition-transform duration-500', isClicked?'scale-[1.02]':'scale-100')}>
            <div className="flex items-center gap-3">{t.icon && <span className="text-xl opacity-80">{t.icon}</span>}<h3 className="text-lg font-semibold">{t.title}</h3></div>
            {t.subtitle && <p className="text-sm text-white/70">{t.subtitle}</p>}
            <div className="pointer-events-none absolute -inset-10 rotate-6 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl" />
          </div>
        </button>
      );})}
    </div>
  </div>);
}
