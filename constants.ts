
import { Stage, InvestorMode } from './types';

export const STAGES: Stage[] = [
  {
    id: 1,
    title: 'The One-Liner',
    description: 'Crystallize your business essence into a single, punchy sentence that investors will remember.',
    questions: [
      { id: 'q1', text: 'What is your elevator pitch in 20 words or less?', placeholder: 'We are the X for Y that helps Z achieve...' },
      { id: 'q2', text: 'Who is your absolute core customer?', placeholder: 'Fortune 500 CTOs at manufacturing firms...' },
      { id: 'q3', text: 'What is the "hair on fire" problem you solve?', placeholder: 'Currently, companies lose $50k/day because of...' }
    ]
  },
  {
    id: 2,
    title: 'Business Model',
    description: 'Explain exactly how you capture value and ensure the math works at scale.',
    questions: [
      { id: 'q1', text: 'How exactly do you make money?', placeholder: 'SaaS subscription, transaction fee, marketplace commission...' },
      { id: 'q2', text: 'What are your primary revenue streams?', placeholder: 'Tiered pricing starting at $499/mo...' },
      { id: 'q3', text: 'What is your secret sauce for maintaining margins?', placeholder: 'Proprietary automation reduces COGS by 40%...' }
    ]
  },
  {
    id: 3,
    title: 'Traction & Evidence',
    description: 'Show us the proof. Data speaks louder than dreams.',
    questions: [
      { id: 'q1', text: 'What are your key growth metrics to date?', placeholder: 'MoM growth, active users, pilot conversions...' },
      { id: 'q2', text: 'Provide evidence of customer validation.', placeholder: '15 LOIs, 3 paid pilots, 500-person waitlist...' },
      { id: 'q3', text: 'What is your current monthly burn and runway?', placeholder: '$20k burn, 12 months runway left...' }
    ]
  },
  {
    id: 4,
    title: 'Market & Competition',
    description: 'The world is a crowded place. Why will you win against incumbents?',
    questions: [
      { id: 'q1', text: 'What is the TAM, SAM, and SOM?', placeholder: '$10B global, $2B serviceable, $50M target...' },
      { id: 'q2', text: 'Who are your 3 biggest competitors?', placeholder: 'Incumbent A, Startup B, Legacy process C...' },
      { id: 'q3', text: 'What is your unfair competitive advantage?', placeholder: 'Patent-pending algorithm, exclusive data access...' }
    ]
  },
  {
    id: 5,
    title: 'Unit Economics & Pricing',
    description: 'Is this a business or an expensive hobby? Prove the LTV/CAC ratio.',
    questions: [
      { id: 'q1', text: 'What is your projected LTV and payback period?', placeholder: '$5k LTV with 4-month payback...' },
      { id: 'q2', text: 'What is your current CAC across channels?', placeholder: '$200 via LinkedIn, $50 via organic...' },
      { id: 'q3', text: 'How did you arrive at your current pricing?', placeholder: 'Value-based pricing benchmarked against ROI...' }
    ]
  },
  {
    id: 6,
    title: 'Financial Projections',
    description: 'The 3-year plan. Don’t just make up numbers; build a model.',
    questions: [
      { id: 'q1', text: 'What is your Year 3 revenue target?', placeholder: '$12M ARR by year 3...' },
      { id: 'q2', text: 'What are the top 3 drivers of your financial model?', placeholder: 'Hiring rate, sales cycle length, churn...' },
      { id: 'q3', text: 'How much capital are you raising and what is the allocation?', placeholder: '$1.5M for engineering (50%), sales (30%), marketing (20%)...' }
    ]
  },
  {
    id: 7,
    title: 'Go-To-Market',
    description: 'How do you go from zero to one million users without going bankrupt?',
    questions: [
      { id: 'q1', text: 'What is your primary distribution channel?', placeholder: 'Direct sales, affiliate network, SEO...' },
      { id: 'q2', text: 'Describe your typical sales cycle.', placeholder: '3 months from lead gen to contract signed...' },
      { id: 'q3', text: 'What is your strategy for viral growth or network effects?', placeholder: 'Product-led growth with collaboration features...' }
    ]
  },
  {
    id: 8,
    title: 'Pitch Narrative',
    description: 'The story that ties it all together. Why now? Why you?',
    questions: [
      { id: 'q1', text: 'Why is now the perfect time for this business?', placeholder: 'Regulatory changes, technology shifts, consumer behavior...' },
      { id: 'q2', text: 'Why is this the right team to build it?', placeholder: '10 years experience in the industry, technical PhDs...' },
      { id: 'q3', text: 'What is the "Big Vision" exit scenario?', placeholder: 'Acquisition by Google or IPO in 7 years...' }
    ]
  }
];

export const INVESTOR_MODES_INFO = {
  [InvestorMode.STANDARD]: 'A balanced approach focusing on overall business health and risk mitigation.',
  [InvestorMode.PITCH_REVIEW]: 'Focuses on narrative clarity, differentiation, and the wow-factor for first impressions.',
  [InvestorMode.FINANCIAL_DILIGENCE]: 'A brutal look at unit economics, margins, burn rate, and financial feasibility.',
  [InvestorMode.MARKET_SKEPTIC]: 'Challenges the "why now," the competitive landscape, and defensibility of your moat.',
  [InvestorMode.INVESTMENT_COMMITTEE]: 'The final boss mode. High-level strategic reasoning and "deal-breaker" analysis.',
  [InvestorMode.GTM_REALITY_CHECK]: 'Tests the friction in your sales funnel and the reality of your customer acquisition costs.'
};
