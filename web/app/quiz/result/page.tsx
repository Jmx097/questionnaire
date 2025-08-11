'use client';
import React from 'react';
import { useQuiz } from '@/lib/store';
import { scoreProfile } from '@/config/scoring';
import { humanCurrency, humanSegment } from '@/lib/format';
import { ResultsBento } from '@/components/results/ResultsBento';
import { newJoinCode, newLeadId } from '@/lib/ids';
import { buildSkoolLink } from '@/lib/urls';
export default function Result(){
  const { a } = useQuiz();
  const score = scoreProfile(a);
  const leadId = newLeadId();
  const joinCode = newJoinCode();
  const skoolUrl = buildSkoolLink(a, score, leadId, joinCode);
  const emailWebhook = process.env.NEXT_PUBLIC_EMAIL_WEBHOOK || 'https://example.com/collect';
  const emailLink = `${emailWebhook}?lead=${encodeURIComponent(leadId)}&segment=${encodeURIComponent(a.segment||'unknown')}&pain=${encodeURIComponent(a.pain||'na')}&tier=${score.tier}&offer=${encodeURIComponent(score.offer)}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const invite1 = `${appUrl}/?ref=${encodeURIComponent(leadId)}-1`;
  const invite2 = `${appUrl}/?ref=${encodeURIComponent(leadId)}-2`;
  const invite3 = `${appUrl}/?ref=${encodeURIComponent(leadId)}-3`;
  return (
    <main className="min-h-dvh bg-black text-white">
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-10">
        <h1 className="text-3xl md:text-4xl font-semibold">Your personalized plan</h1>
        <p className="text-white/70 mt-2">Here’s a quick snapshot of what you told me and where I recommend we start.</p>
      </section>
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <ResultsBento items={[
          { label:'Segment', value: humanSegment(a.segment) },
          { label:'Team size', value: a.teamSize || '—' },
          { label:'AI feel', value: a.sentiment || '—' },
          { label:'Top pain', value: a.pain || '—' },
          { label:'Value / mo', value: humanCurrency(a.valuePerMonth) },
          { label:'Urgency', value: a.urgency || '—' },
          { label:'Tier', value: score.tier },
          { label:'Offer', value: score.offer },
        ]} />
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-4">
        <a className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-5 py-3 font-semibold hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" href={skoolUrl} target="_blank" rel="noreferrer">Join the Skool group</a>
        <div><a className="text-white/80 underline" href={emailLink} target="_blank" rel="noreferrer">Email this plan to me</a></div>
        <div className="text-white/60 text-sm">Invite 3 friends: 
          <button className="ml-2 underline" onClick={()=>navigator.clipboard.writeText(invite1)}>Copy link 1</button> • 
          <button className="ml-2 underline" onClick={()=>navigator.clipboard.writeText(invite2)}>Copy link 2</button> • 
          <button className="ml-2 underline" onClick={()=>navigator.clipboard.writeText(invite3)}>Copy link 3</button>
        </div>
      </section>
    </main>
  );
}
