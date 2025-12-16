import type { Answers } from '@/lib/store';
import type { ScoreProfile } from '@/config/scoring';

export function buildSkoolLink(a: Answers, s: ScoreProfile, leadId: string, joinCode: string){
  // Base Skool community link with ref parameter
  const base = 'https://www.skool.com/citizen-developer-1179/about';
  const refParam = '44c264a6664e4f4c9e5bd6b756d4d956';
  
  const params = new URLSearchParams({
    ref: refParam,
    utm_source:'quiz', 
    utm_medium:'web', 
    utm_campaign:'skool_onboarding',
    utm_content:`${a.segment ?? 'unknown'}_${a.pain ?? 'na'}`,
    lead:leadId, 
    code:joinCode, 
    tier:s.tier, 
    offer:s.offer
  });
  
  return `${base}?${params.toString()}`;
}
