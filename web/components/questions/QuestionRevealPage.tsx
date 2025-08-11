'use client';
import React from 'react';
import { ScrollDownBackdrop } from '@/components/reveal/ScrollDownBackdrop';
import { RevealOnView } from '@/components/reveal/RevealOnView';
import { MagicAnswerBento } from '@/components/questions/MagicAnswerBento';
export type AnswerTile={key:string;label:string;color?:string};
export function QuestionRevealPage({title,note,answers,onPick}:{title:string;note?:string;answers:AnswerTile[];onPick:(key:string)=>void}){
  return (<main className="relative min-h-dvh bg-black text-white">
    <ScrollDownBackdrop />
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-16">
      <RevealOnView><h1 className="text-3xl md:text-4xl font-semibold leading-tight">{title}</h1>{note && <p className="text-white/70 mt-2">{note}</p>}</RevealOnView>
    </section>
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <RevealOnView from="translate-y-6 opacity-0" to="translate-y-0 opacity-100" duration="duration-700">
        <MagicAnswerBento answers={answers} onPick={onPick} />
      </RevealOnView>
    </section>
  </main>);
}
