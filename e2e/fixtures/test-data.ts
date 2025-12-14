/**
 * Test data for E2E tests
 */

export const testAnswers = {
  segment: {
    realEstate: 'Real Estate',
    consulting: 'Consulting / Coaching',
    personalBrand: 'Personal Brand / Creator',
    agency: 'Creative / Marketing Agency',
    finance: 'Private Equity / Finance',
    construction: 'Home Construction / Contractor',
    other: 'Other',
  },
  teamSize: {
    solo: 'It\'s just me',
    twoToFive: '2-5 people',
    sixToTwenty: '6-20 people',
    twentyPlus: '20+ people',
  },
  sentiment: {
    skeptical: 'Skeptical 🤨',
    curious: 'Curious 🤔',
    excited: 'Excited 🚀',
  },
  pain: {
    leadGeneration: 'Lead generation',
    followUp: 'Follow-up/nurturing',
    closingDeals: 'Closing deals',
    scaling: 'Scaling ops',
    other: 'Other',
  },
  urgency: {
    notSoon: 'Not soon',
    nextMonth: 'Next month',
    nextWeek: 'Next week',
    asap: 'ASAP',
  },
  valuePerMonth: {
    zeroToFivek: '$0-5k/mo',
    fiveToTwentyk: '$5-20k/mo',
    twentyToFiftyk: '$20-50k/mo',
    fiftykPlus: '$50k+/mo',
  },
};

export const testScenarios = {
  consultant: {
    answers: {
      segment: testAnswers.segment.consulting,
      teamSize: testAnswers.teamSize.twoToFive,
      sentiment: testAnswers.sentiment.excited,
      pain: testAnswers.pain.leadGeneration,
      valuePerMonth: testAnswers.valuePerMonth.fiveToTwentyk,
      urgency: testAnswers.urgency.nextMonth,
    },
    expectedTier: 'Tier 2' | 'Tier 3',
  },
  realEstateAgent: {
    answers: {
      segment: testAnswers.segment.realEstate,
      teamSize: testAnswers.teamSize.solo,
      sentiment: testAnswers.sentiment.curious,
      pain: testAnswers.pain.followUp,
      valuePerMonth: testAnswers.valuePerMonth.twentyToFiftyk,
      urgency: testAnswers.urgency.nextWeek,
    },
    expectedTier: 'Tier 2' | 'Tier 3',
  },
  enterpriseAgency: {
    answers: {
      segment: testAnswers.segment.agency,
      teamSize: testAnswers.teamSize.twentyPlus,
      sentiment: testAnswers.sentiment.excited,
      pain: testAnswers.pain.scaling,
      valuePerMonth: testAnswers.valuePerMonth.fiftykPlus,
      urgency: testAnswers.urgency.asap,
    },
    expectedTier: 'Tier 1' | 'Tier 2',
  },
};
