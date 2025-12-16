import type { Answers } from '@/lib/store';
import type { ScoreProfile } from '@/config/scoring';

export interface PersonalizedPlan {
  headline: string;
  summary: string;
  quickWins: string[];
  nextSteps: {
    title: string;
    description: string;
    timeframe: string;
  }[];
  painSolution: {
    problem: string;
    solution: string;
    implementation: string;
  };
  toolRecommendations: string[];
}

export function generatePersonalizedPlan(answers: Answers, score: ScoreProfile): PersonalizedPlan {
  const segment = answers.segment || 'other';
  const pain = answers.pain || 'unknown';
  const teamSize = answers.teamSize || 'solo';
  const tools = answers.tools || [];
  const sentiment = answers.sentiment || 'curious';
  const urgency = answers.urgency || 'research';
  
  // Segment-specific strategies
  const segmentStrategies: Record<string, any> = {
    real_estate: {
      headline: "Transform Your Real Estate Operations with AI",
      quickWins: [
        "Set up automated lead response within 5 minutes of inquiry",
        "Create email templates for common scenarios (showing confirmations, follow-ups)",
        "Implement a simple CRM workflow to track leads automatically"
      ],
      toolRecs: ["Zapier for automations", "HubSpot or Follow Up Boss CRM", "AITable for property databases"]
    },
    consulting: {
      headline: "Scale Your Consulting Practice with Automation",
      quickWins: [
        "Build a proposal template library with AI-powered customization",
        "Automate client onboarding with forms and welcome sequences",
        "Set up time-tracking and invoicing automation"
      ],
      toolRecs: ["Notion for knowledge base", "Dubsado for client management", "Make.com for workflows"]
    },
    personal_brand: {
      headline: "10x Your Content Output Without Burning Out",
      quickWins: [
        "Create a content repurposing system (1 idea → 5+ formats)",
        "Set up a content calendar with AI-assisted drafting",
        "Automate social media cross-posting"
      ],
      toolRecs: ["Notion for content library", "Buffer or Hypefury for scheduling", "ChatGPT for ideation"]
    },
    agency: {
      headline: "Streamline Your Agency Delivery Process",
      quickWins: [
        "Build client reporting templates that update automatically",
        "Create standardized project kickoff workflows",
        "Implement automated status updates for clients"
      ],
      toolRecs: ["ClickUp for project management", "Databox for reporting", "Zapier for client comms"]
    },
    finance: {
      headline: "Accelerate Deal Flow with Intelligent Automation",
      quickWins: [
        "Set up automated deal scoring and triage system",
        "Create data room templates with smart organization",
        "Implement IC memo generation workflows"
      ],
      toolRecs: ["Airtable for deal tracking", "Notion for deal memos", "Make.com for data aggregation"]
    },
    construction: {
      headline: "Modernize Your Construction Business Operations",
      quickWins: [
        "Automate lead follow-up from online ads",
        "Create estimate templates with material cost auto-updates",
        "Set up project status dashboards for clients"
      ],
      toolRecs: ["Buildertrend or CoConstruct", "Google Sheets with scripts", "Calendly for scheduling"]
    },
    other: {
      headline: "Optimize Your Business with Smart Automation",
      quickWins: [
        "Identify your top 3 repetitive tasks and automate one this week",
        "Set up email filters and auto-responses",
        "Create process documentation with AI assistance"
      ],
      toolRecs: ["Zapier for connecting apps", "Notion for documentation", "Loom for training videos"]
    }
  };

  // Pain-specific solutions
  const painSolutions: Record<string, any> = {
    // Real Estate
    lead_followup: {
      problem: "Leads slip through the cracks when you can't respond fast enough",
      solution: "Automated lead routing + instant SMS/email response system",
      implementation: "Set up a Zapier workflow: New lead → Instant SMS → CRM entry → Task created"
    },
    listing_ops: {
      problem: "Too much time spent on listing paperwork and coordination",
      solution: "Digital document workflows + automated reminders for all parties",
      implementation: "Use DocuSign + automated email sequences for each stage of listing process"
    },
    crm_double: {
      problem: "Manually entering the same data into multiple systems",
      solution: "Two-way sync between all your tools",
      implementation: "Connect listings platform → CRM → email → calendar with Zapier or Make.com"
    },
    
    // Consulting
    inbound_triage: {
      problem: "Spending too much time on unqualified leads",
      solution: "Qualification quiz + automated routing",
      implementation: "Build a Typeform that scores leads and sends qualified ones to calendar, others to email sequence"
    },
    proposal: {
      problem: "Proposals take hours to customize each time",
      solution: "Template library + AI-powered customization",
      implementation: "Create modular proposals in Notion/Google Docs + ChatGPT to adapt messaging per client"
    },
    billing: {
      problem: "Chasing invoices is a time drain",
      solution: "Automated invoicing + payment reminders",
      implementation: "Use Stripe Invoicing or QuickBooks with automated reminder sequences"
    },
    
    // Personal Brand
    ideas_to_posts: {
      problem: "Great ideas but content creation feels overwhelming",
      solution: "Content factory system: capture → develop → publish",
      implementation: "Voice memos to Notion → AI expansion → Schedule across platforms"
    },
    newsletter: {
      problem: "Inconsistent newsletter publishing",
      solution: "Content buffer + automated publishing system",
      implementation: "Batch write 4-6 issues → Schedule in ConvertKit/Beehiiv with AI-powered subject lines"
    },
    
    // Generic fallbacks
    repetitive: {
      problem: "Repetitive admin work stealing your focus time",
      solution: "Task automation + delegation workflows",
      implementation: "Document the task → Build a checklist → Create automation or hire VA"
    },
    handoffs: {
      problem: "Information gets lost between tools",
      solution: "Central hub + automated data sync",
      implementation: "Choose one source of truth (Notion/Airtable) + sync everything to it"
    },
    reporting: {
      problem: "Manual report compilation is tedious",
      solution: "Self-updating dashboards",
      implementation: "Connect data sources to Google Sheets/Databox → Auto-generate reports"
    }
  };

  const strategy = segmentStrategies[segment] || segmentStrategies.other;
  const painSol = painSolutions[pain] || painSolutions.repetitive;

  // Urgency-based next steps
  const getNextSteps = () => {
    if (urgency === 'asap' || urgency === '30d') {
      return [
        {
          title: "This Week: Quick Win Implementation",
          description: strategy.quickWins[0],
          timeframe: "1-3 days"
        },
        {
          title: "Next 2 Weeks: Core Automation Setup",
          description: painSol.implementation,
          timeframe: "5-10 hours total"
        },
        {
          title: "Month 1: Systematic Rollout",
          description: "Implement remaining quick wins and refine based on results",
          timeframe: "Ongoing"
        }
      ];
    } else if (urgency === 'quarter') {
      return [
        {
          title: "Month 1: Foundation & Planning",
          description: "Audit current processes, document workflows, select tools",
          timeframe: "2-4 weeks"
        },
        {
          title: "Month 2: Implementation",
          description: painSol.implementation + " + quick wins rollout",
          timeframe: "4-6 weeks"
        },
        {
          title: "Month 3: Optimization",
          description: "Measure results, refine workflows, scale what works",
          timeframe: "Ongoing"
        }
      ];
    } else {
      return [
        {
          title: "Research Phase",
          description: "Explore tools and approaches that fit your needs",
          timeframe: "No rush"
        },
        {
          title: "Pilot Project",
          description: "Start with one small automation when ready",
          timeframe: "When timing is right"
        },
        {
          title: "Expand",
          description: "Build on success once you see results",
          timeframe: "At your pace"
        }
      ];
    }
  };

  // Sentiment-based summary
  const getSummary = () => {
    const baseInsight = teamSize === 'solo' 
      ? "As a solo operator, automation is your secret weapon to punch above your weight."
      : "With your team size, the right systems will multiply everyone's output.";
    
    if (sentiment === 'excited' || sentiment === 'daily') {
      return `${baseInsight} You're already bought into AI—now let's channel that into specific workflows that save hours every week.`;
    } else if (sentiment === 'overwhelmed') {
      return `${baseInsight} Don't worry about the hype—we'll start with one simple automation that actually solves your ${pain} problem.`;
    } else if (sentiment === 'skeptical') {
      return `${baseInsight} Healthy skepticism is good. We'll focus on practical tools with clear ROI, not shiny objects.`;
    } else {
      return `${baseInsight} You're in the right place to learn what actually works for businesses like yours.`;
    }
  };

  return {
    headline: strategy.headline,
    summary: getSummary(),
    quickWins: strategy.quickWins,
    nextSteps: getNextSteps(),
    painSolution: painSol,
    toolRecommendations: strategy.toolRecs
  };
}
