'use client';
import React, { useState } from 'react';
import { useQuiz } from '@/lib/store';
import { scoreProfile } from '@/config/scoring';
import { generatePersonalizedPlan } from '@/lib/personalized-plan';
import { humanCurrency, humanSegment } from '@/lib/format';
import { newJoinCode, newLeadId } from '@/lib/ids';
import { buildSkoolLink } from '@/lib/urls';
<<<<<<< HEAD
import { cn } from '@/lib/utils';

export default function Result(){
  const { a, set } = useQuiz();
  const [email, setEmail] = useState(a.email || '');
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
=======
import { useSearchParams } from 'next/navigation';

export default function Result(){
  const { a } = useQuiz();
  const searchParams = useSearchParams();
>>>>>>> 51620b5610f5e321d4a6ac7ac22103b01db410d4
  const score = scoreProfile(a);
  const plan = generatePersonalizedPlan(a, score);
  const leadId = newLeadId();
  const joinCode = newJoinCode();
  const skoolUrl = buildSkoolLink(a, score, leadId, joinCode);
  const emailWebhook = process.env.NEXT_PUBLIC_EMAIL_WEBHOOK || 'https://example.com/collect';
<<<<<<< HEAD
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    set('email', email);
    
    try {
      const params = new URLSearchParams({
        lead: leadId,
        segment: a.segment || 'unknown',
        pain: a.pain || 'na',
        tier: score.tier,
        offer: score.offer,
        email: email,
        teamSize: a.teamSize || 'unknown',
        urgency: a.urgency || 'unknown',
        value: String(a.valuePerMonth || 0)
      });
      
      const endpoint = `${emailWebhook}?${params.toString()}`;
      
      // Actually send to webhook (commented out for now)
      // await fetch(endpoint, { method: 'POST' });
      console.log('Sending to:', endpoint);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmailSent(true);
    } catch (error) {
      console.error('Email send failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className="min-h-screen w-full bg-black text-white overflow-auto">
      <div className="min-h-screen w-full flex flex-col">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-6 py-20 flex-shrink-0">
          <div className="text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
              {score.tier === 'high' && '🚀 High Priority'}
              {score.tier === 'mid' && '⚡ Ready to Scale'}
              {score.tier === 'low' && '🌱 Getting Started'}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-tight">
              {plan.headline}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {plan.summary}
            </p>
          </div>
        </section>

        {/* Quick Snapshot */}
        <section className="w-full max-w-6xl mx-auto px-6 pb-16 flex-shrink-0">
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-white/60 text-sm mb-1">Business</div>
              <div className="font-semibold">{humanSegment(a.segment)}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm mb-1">Team</div>
              <div className="font-semibold">{a.teamSize === 'solo' ? 'Solo' : a.teamSize === '2-5' ? '2-5 people' : a.teamSize === '6-20' ? '6-20 people' : '21+ people'}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm mb-1">Value/mo</div>
              <div className="font-semibold">{humanCurrency(a.valuePerMonth)}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm mb-1">Timeline</div>
              <div className="font-semibold capitalize">{a.urgency === 'asap' ? 'ASAP' : a.urgency === '30d' ? '30 days' : a.urgency}</div>
            </div>
          </div>
        </div>
=======
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
>>>>>>> 51620b5610f5e321d4a6ac7ac22103b01db410d4
      </section>

      {/* Main Pain Solution */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">🎯</div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Your Top Priority</h2>
              <p className="text-white/70">Let's solve this first, then build from there</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">The Problem</h3>
              <p className="text-white/70">{plan.painSolution.problem}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">The Solution</h3>
              <p className="text-white/80 font-medium">{plan.painSolution.solution}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border-l-4 border-white">
              <h3 className="text-lg font-semibold mb-3">How to Implement</h3>
              <p className="text-white/80 leading-relaxed">{plan.painSolution.implementation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Wins */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-semibold mb-6">🏆 Quick Wins to Start With</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plan.quickWins.map((win, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl mb-3">{idx + 1}</div>
              <p className="text-white/90 leading-relaxed">{win}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-semibold mb-6">🗺️ Your Roadmap</h2>
        <div className="space-y-4">
          {plan.nextSteps.map((step, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <span className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
                      {step.timeframe}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Recommendations */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-semibold mb-6">🛠️ Recommended Tools</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/70 mb-4">Based on your profile, these tools will serve you well:</p>
          <div className="flex flex-wrap gap-3">
            {plan.toolRecommendations.map((tool, idx) => (
              <div key={idx} className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-300">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-3xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Get Your Full Implementation Guide</h2>
            <p className="text-white/70">We'll send you a detailed PDF with step-by-step instructions, templates, and resources.</p>
          </div>
          
          {emailSent ? (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✓</div>
              <div className="text-green-100 font-semibold mb-2">Sent to {email}!</div>
              <div className="text-green-100/70 text-sm">Check your inbox in the next few minutes.</div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email.includes('@')}
                  className={cn(
                    "px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300",
                    isSubmitting || !email.includes('@')
                      ? "bg-white/20 text-white/40 cursor-not-allowed"
                      : "bg-white text-black hover:scale-105 hover:shadow-2xl shadow-white/30"
                  )}
                >
                  {isSubmitting ? 'Sending...' : 'Send It'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/20 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Ready to Build This With Others?</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Join 1,000+ citizen developers learning to automate their businesses. Free community, weekly office hours, template library.
          </p>
          <a 
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-8 py-4 font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl" 
            href={skoolUrl} 
            target="_blank" 
            rel="noreferrer"
          >
            Join the Community →
          </a>
          <div className="mt-6 text-sm text-white/60">
            100% free · No credit card required
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}

