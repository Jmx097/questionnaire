export const SEGMENTS = [
  { key:'real_estate', label:'Real Estate' },
  { key:'consulting', label:'Consulting / Coaching' },
  { key:'personal_brand', label:'Personal Brand / Creator' },
  { key:'agency', label:'Creative / Marketing Agency' },
  { key:'finance', label:'Private Equity / Finance' },
  { key:'construction', label:'Home Construction / Contractor' },
  { key:'other', label:'Other' }
] as const;

export const PAIN_OPTIONS: Record<string, {key:string,label:string}[]> = {
  real_estate: [
    { key:'lead_followup', label:'Responding fast to new leads' },
    { key:'listing_ops', label:'Listing paperwork and coordination' },
    { key:'crm_double', label:'Double data entry between tools' },
    { key:'showing_sched', label:'Showings scheduling & reminders' },
    { key:'content', label:'Consistent content + GMB posts' },
  ],
  consulting: [
    { key:'inbound_triage', label:'Sorting inbound requests & fit' },
    { key:'proposal', label:'Proposals & scope take too long' },
    { key:'billing', label:'Invoicing & chasing payments' },
    { key:'kb', label:'No central knowledge base' },
    { key:'content', label:'Content cadence is inconsistent' },
  ],
  personal_brand: [
    { key:'ideas_to_posts', label:'Turning ideas into posts' },
    { key:'newsletter', label:'Newsletter cadence' },
    { key:'ops', label:'Sponsor & collab ops' },
    { key:'offers', label:'Packaging offers' },
  ],
  agency: [
    { key:'client_onboarding', label:'Client onboarding repeat work' },
    { key:'reporting', label:'Report creation is manual' },
    { key:'handoffs', label:'Handoffs across tools' },
    { key:'scheduling', label:'Scheduling & follow-ups' },
  ],
  finance: [
    { key:'dealflow', label:'Triage inbound deal flow' },
    { key:'dd', label:'Data room & DD tasking' },
    { key:'memos', label:'IC memos & updates' },
    { key:'ops', label:'Portfolio ops reporting' },
  ],
  construction: [
    { key:'lead_response', label:'Contacting new leads from ads' },
    { key:'estimates', label:'Manual estimates & take-offs' },
    { key:'data_scatter', label:'Project data scattered across tools' },
    { key:'proposals', label:'Proposal creation slow & manual' },
    { key:'invoicing', label:'Invoicing progress payments & chasing overdue' },
    { key:'gmb', label:'Social / Google My Business posting' },
    { key:'vendor_po_mismatch', label:'Vendor invoice not matching the PO' }
  ],
  other: [
    { key:'repetitive', label:'Repetitive admin work' },
    { key:'handoffs', label:'Handoffs across tools' },
    { key:'reporting', label:'Reporting compilation' },
  ]
};

export const SEGMENT_PROMPTS: Record<string,string> = {
  construction: "Which day-to-day operational headache slows your construction business the most?",
  real_estate: "What’s the bottleneck that costs you the most momentum each week?",
  consulting: "Which part of your client flow do you most want to streamline?",
  personal_brand: "What would make your creative week feel lighter?",
  agency: "What’s the one step in delivery that always drags?",
  finance: "Which part of your deal flow could be 10x smoother?",
  other: "What’s the task you’d love to never do again?"
};
