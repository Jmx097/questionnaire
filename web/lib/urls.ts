import type { Answers } from '@/lib/store';
import type { ScoreProfile } from '@/config/scoring';
export function buildSkoolLink(a: Answers, s: ScoreProfile, leadId: string, joinCode: string){
  const base = process.env.NEXT_PUBLIC_SKOOL_URL || 'https://www.skool.com/citizen-developer-revenue-lab-4104';
  const params = new URLSearchParams({
    utm_source:'quiz', utm_medium:'web', utm_campaign:'skool_onboarding',
    utm_content:`${a.segment ?? 'unknown'}_${a.pain ?? 'na'}`,
    lead:leadId, code:joinCode, tier:s.tier, offer:s.offer
  });
  return `${base}?${params.toString()}`;
}
