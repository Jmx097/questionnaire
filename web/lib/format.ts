export function humanSegment(seg?: string){
  const map:Record<string,string>={ real_estate:'Real Estate', consulting:'Consulting / Coaching', personal_brand:'Personal Brand / Creator', agency:'Creative / Marketing Agency', finance:'Private Equity / Finance', construction:'Home Construction / Contractor', other:'Other' };
  return seg ? (map[seg] ?? seg) : 'Unknown';
}
export function humanCurrency(n?: number){ return typeof n==='number' ? `$${n.toLocaleString()}` : '$0'; }
