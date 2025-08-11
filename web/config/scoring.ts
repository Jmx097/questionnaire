import type { Answers } from '@/lib/store';
export type ScoreProfile = {
  identity_maturity:number; integration_score:number; pain_intensity:number; budget_score:number; urgency_score:number;
  tier:'low'|'mid'|'high'; offer:'Plinko Pocket'|'Playbook Pro'|'Playbook Plus';
};
export function scoreProfile(a: Answers): ScoreProfile {
  const identity_maturity = a.teamSize==='solo'?0 : a.teamSize==='2-5'?1 : (a.teamSize==='6-20'||a.teamSize==='21+')?2 : 0;
  const integration_score = (a.tools?.length??0)>=3 || a.sentiment==='daily' ? 3 : (a.tools?.length??0)>=1 ? 2 : 1;
  const pain_intensity = 2;
  const budget = a.valuePerMonth ?? 0;
  const budget_score = budget>=5000?3 : budget>=2000?2 : budget>=500?1 : 0;
  const urgency_score = (a.urgency==='asap'||a.urgency==='30d')?2 : a.urgency==='quarter'?1 : 0;
  const total = identity_maturity+integration_score+pain_intensity+budget_score+urgency_score;
  const tier = total<=4?'low' : total<=7?'mid' : 'high';
  const offer = tier==='low'?'Plinko Pocket' : tier==='mid'?'Playbook Pro' : 'Playbook Plus';
  return { identity_maturity, integration_score, pain_intensity, budget_score, urgency_score, tier, offer };
}
