'use client';
import React, { useState } from 'react';
import { useQuiz } from '@/lib/store';
import { scoreProfile } from '@/config/scoring';
import { generatePersonalizedPlan } from '@/lib/personalized-plan';
import { humanCurrency, humanSegment } from '@/lib/format';
import { newJoinCode, newLeadId } from '@/lib/ids';
import { buildSkoolLink } from '@/lib/urls';
import { useSearchParams } from 'next/navigation';
import { ResultsBento } from '@/components/results/ResultsBento';

export default function Result(){
  const { a } = useQuiz();
  const searchParams = useSearchParams();
  const score = scoreProfile(a);
  const plan = generatePersonalizedPlan(a, score);
  const leadId = newLeadId();
  const joinCode = newJoinCode();
  const skoolUrl = buildSkoolLink(a, score, leadId, joinCode);
  const emailWebhook = process.env.NEXT_PUBLIC_EMAIL_WEBHOOK || 'https://example.com/collect';

  const emailLink = `${emailWebhook}?lead=${encodeURIComponent(leadId)}&segment=${encodeURIComponent(a.segment||'unknown')}&pain=${encodeURIComponent(a.pain||'na')}&tier=${score.tier}&offer=${encodeURIComponent(score.offer)}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const invite1 = `${appUrl}/?ref=${encodeURIComponent(leadId)}-1`;
  const invite2 = `${appUrl}/?ref=${encodeURIComponent(leadId)}-2`;
  const invite3 = `${appUrl}/?ref=${encodeURIComponent(leadId)}-3`;
  
  // Check if user came from email capture
  const emailSent = searchParams.get('emailSent');
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const handleDownloadPDF = () => {
    // Generate PDF content or link to PDF generation service
    const pdfUrl = `${appUrl}/api/generate-pdf?token=${encodeURIComponent(token || '')}`;
    window.open(pdfUrl, '_blank');
  };

  const copySecureLink = () => {
    const secureLink = `${appUrl}/quiz/result?${token}`;
    navigator.clipboard.writeText(secureLink);
    alert('Secure link copied to clipboard!');
  };

  return (
    <main className="min-h-dvh bg-black text-white">
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-10">
        <h1 className="text-3xl md:text-4xl font-semibold">Your personalized plan</h1>
        <p className="text-white/70 mt-2">Here's a quick snapshot of what you told me and where I recommend we start.</p>
        
        {/* Email confirmation */}
        {emailSent && email && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mt-6">
            <h2 className="text-green-400 font-semibold mb-2">✅ Email sent successfully!</h2>
            <p className="text-white/80">
              We've sent your complete automation report to <strong>{email}</strong>
            </p>
            <p className="text-white/70 text-sm mt-1">
              The email contains a secure link to access your full results for 7 days.
            </p>
          </div>
        )}
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
          { label:'Score', value: `${score.score}/100` },
        ]} />
      </section>
      
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-4">
        {emailSent && token ? (
          <>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white w-full justify-center"
            >
              📄 Download PDF Report
            </button>
            <button
              onClick={copySecureLink}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 text-white px-5 py-3 font-semibold hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white w-full justify-center"
            >
              🔗 Copy Secure Link
            </button>
            <div className="text-center">
              <p className="text-white/60 text-sm">
                🔐 This secure link expires in 7 days and contains your personalized data.
              </p>
            </div>
          </>
        ) : (
          <>
            <a className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-5 py-3 font-semibold hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" href={skoolUrl} target="_blank" rel="noreferrer">Join the Skool group</a>
            <div><a className="text-white/80 underline" href={emailLink} target="_blank" rel="noreferrer">Email this plan to me</a></div>
          </>
        )}
        
        {!emailSent && (
          <div className="text-white/60 text-sm">Invite 3 friends: 
            <button className="ml-2 underline" onClick={()=>navigator.clipboard.writeText(invite1)}>Copy link 1</button> • 
            <button className="ml-2 underline" onClick={()=>navigator.clipboard.writeText(invite2)}>Copy link 2</button> • 
            <button className="ml-2 underline" onClick={()=>navigator.clipboard.writeText(invite3)}>Copy link 3</button>
          </div>
        )}
      </section>
    </main>
  );
}
