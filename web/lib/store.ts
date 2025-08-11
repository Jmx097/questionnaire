'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type Segment = 'real_estate'|'consulting'|'personal_brand'|'agency'|'finance'|'construction'|'other';
export type Answers = {
  segment?: Segment;
  teamSize?: 'solo'|'2-5'|'6-20'|'21+';
  sentiment?: 'excited'|'curious'|'overwhelmed'|'skeptical'|'daily'|'starting';
  tools?: string[];
  pain?: string;
  pain_other?: string;
  valuePerMonth?: number;
  urgency?: 'asap'|'30d'|'quarter'|'research';
  email?: string;
  name?: string;
};
type State = { a: Answers; set:<K extends keyof Answers>(k:K,v:Answers[K])=>void; reset:()=>void; };
export const useQuiz = create<State>()(persist(
  (set,get)=>({ a:{}, set:(k,v)=>set({ a:{...get().a, [k]:v} }), reset:()=>set({ a:{} }) }),
  { name:'ai-quiz-funnel-v3' }
));
