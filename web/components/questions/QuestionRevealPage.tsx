'use client';
import React from 'react';
import { ScrollDownBackdrop } from '@/components/reveal/ScrollDownBackdrop';
import { RevealOnView } from '@/components/reveal/RevealOnView';
import { MagicAnswerBento } from '@/components/questions/MagicAnswerBento';

export type AnswerTile={key:string;label:string;color?:string};

export function QuestionRevealPage({title,note,answers,onPick}:{title:string;note?:string;answers:AnswerTile[];onPick:(key:string)=>void}){
  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center">
      <ScrollDownBackdrop />
      <section className="w-full max-w-4xl px-6 py-12">
        <RevealOnView>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center mb-4">
            {title}
          </h1>
          {note && <p className="text-white/70 text-center text-lg md:text-xl max-w-2xl mx-auto">{note}</p>}
        </RevealOnView>
      </section>
      <section className="w-full max-w-6xl px-6 pb-12">
        <RevealOnView from="translate-y-4 opacity-0" to="translate-y-0 opacity-100" duration="duration-300">
          <MagicAnswerBento answers={answers} onPick={onPick} />
        </RevealOnView>
      </section>
    </main>
  );
}
