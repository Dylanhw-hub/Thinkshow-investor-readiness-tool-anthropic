
import { Stage, InvestorMode } from './types';

export const STAGES: Stage[] = [
  {
    id: 1,
    title: 'The One-Liner',
    description: 'Crystallize your business essence. Investors see thousands of deals; if you cannot explain it in 10 seconds, they will move on.',
    questions: [
      { 
        id: 'q1', 
        text: 'What is your elevator pitch in 20 words or less?', 
        placeholder: 'We are the X for Y that helps Z achieve...',
        jargonBuster: 'Investors look for the "X for Y" analogy because it provides an instant mental model of your business.'
      },
      { 
        id: 'q2', 
        text: 'Who is your absolute core customer?', 
        placeholder: 'Fortune 500 CTOs at manufacturing firms...',
        jargonBuster: 'Avoid saying "everyone." Specificity shows you know exactly whose problem you are solving first.'
      },
      { 
        id: 'q3', 
        text: 'What is the "hair on fire" problem you solve?', 
        placeholder: 'Currently, companies lose $50k/day because of...',
        jargonBuster: 'A "Hair on Fire" problem is a critical pain point that a customer is desperate to solve right now.'
      }
    ]
  },
  {
    id: 2,
    title: 'Business Model',
    description: 'Explain your value capture. This isn\'t just about sales, it\'s about how you turn a problem into a sustainable profit engine.',
    questions: [
      { 
        id: 'q1', 
        text: 'How exactly do you make money?', 
        placeholder: 'SaaS subscription, transaction fee, marketplace commission...',
        jargonBuster: 'SaaS (Software as a Service) means recurring monthly payments. Transaction fees mean you take a cut of every sale.'
      },
      { 
        id: 'q2', 
        text: 'What are your primary revenue streams?', 
        placeholder: 'Tiered pricing starting at $499/mo...',
        jargonBuster: 'Revenue streams are the different "buckets" of money coming in (e.g., subscriptions vs. setup fees).'
      },
      { 
        id: 'q3', 
        text: 'What is your secret sauce for maintaining margins?', 
        placeholder: 'Proprietary automation reduces COGS by 40%...',
        jargonBuster: 'COGS (Cost of Goods Sold) is what it costs you to deliver one unit of your service. Margins are what is left over as profit.'
      }
    ]
  },
  {
    id: 3,
    title: 'Traction & Evidence',
    description: 'Proof over promises. Investors use past data to predict your future success.',
    questions: [
      { 
        id: 'q1', 
        text: 'What are your key growth metrics to date?', 
        placeholder: 'MoM growth, active users, pilot conversions...',
        jargonBuster: 'MoM (Month-over-Month) growth shows your speed. 10-20% MoM is considered "venture scale" for early startups.'
      },
      { 
        id: 'q2', 
        text: 'Provide evidence of customer validation.', 
        placeholder: '15 LOIs, 3 paid pilots, 500-person waitlist...',
        jargonBuster: 'LOI (Letter of Intent) is a non-binding document where a customer says they "intend" to buy if you build it.'
      },
      { 
        id: 'q3', 
        text: 'What is your current monthly burn and runway?', 
        placeholder: '$20k burn, 12 months runway left...',
        jargonBuster: 'Burn is how much cash you lose per month. Runway is how many months you have left until your bank account hits zero.'
      }
    ]
  },
  {
    id: 4,
    title: 'Market & Competition',
    description: 'The world is crowded. You must prove the opportunity is massive and that you can defend your slice of it.',
    questions: [
      { 
        id: 'q1', 
        text: 'What is the TAM, SAM, and SOM?', 
        placeholder: '$10B global, $2B serviceable, $50M target...',
        jargonBuster: 'TAM: Total market if you had no competitors. SAM: Market you can reach. SOM: Market you can actually capture in 2 years.'
      },
      { 
        id: 'q2', 
        text: 'Who are your 3 biggest competitors?', 
        placeholder: 'Incumbent A, Startup B, Legacy process C...',
        jargonBuster: 'Incumbents are the "old giants" in the space. Never say you have no competitors—doing nothing is a competitor.'
      },
      { 
        id: 'q3', 
        text: 'What is your unfair competitive advantage (Moat)?', 
        placeholder: 'Patent-pending algorithm, exclusive data access...',
        jargonBuster: 'A "Moat" is something that makes it hard for others to copy you. Network effects or proprietary data are strong moats.'
      }
    ]
  },
  {
    id: 5,
    title: 'Unit Economics & Pricing',
    description: 'Is this a real business? "Unit Economics" measures the profitability of a single customer relationship.',
    questions: [
      { 
        id: 'q1', 
        text: 'What is your projected LTV and payback period?', 
        placeholder: '$5k LTV with 4-month payback...',
        jargonBuster: 'LTV (Lifetime Value) is the total profit one customer brings in. Payback period is how long it takes to earn back your cost to get them.'
      },
      { 
        id: 'q2', 
        text: 'What is your current CAC across channels?', 
        placeholder: '$200 via LinkedIn, $50 via organic...',
        jargonBuster: 'CAC (Customer Acquisition Cost) is the total sales/marketing spend divided by the number of new customers gained.'
      },
      { 
        id: 'q3', 
        text: 'How did you arrive at your current pricing?', 
        placeholder: 'Value-based pricing benchmarked against ROI...',
        jargonBuster: 'ROI (Return on Investment) is how much money the customer saves or makes by using your product.'
      }
    ]
  },
  {
    id: 6,
    title: 'Financial Projections',
    description: 'Numbers are a story told with math. Show where the money goes and how it brings back more money.',
    questions: [
      { 
        id: 'q1', 
        text: 'What is your Year 3 revenue target?', 
        placeholder: '$12M ARR by year 3...',
        jargonBuster: 'ARR (Annual Recurring Revenue) is the holy grail metric for SaaS. It is your monthly revenue multiplied by 12.'
      },
      { 
        id: 'q2', 
        text: 'What are the top 3 drivers of your financial model?', 
        placeholder: 'Hiring rate, sales cycle length, churn...',
        jargonBuster: 'Churn is the percentage of customers who cancel their subscription every month. High churn kills startups.'
      },
      { 
        id: 'q3', 
        text: 'How much capital are you raising and what is the allocation?', 
        placeholder: '$1.5M for engineering (50%), sales (30%), marketing (20%)...',
        jargonBuster: 'Allocation is "Use of Funds." Investors want to see that most of the money goes toward growth or product, not just rent.'
      }
    ]
  },
  {
    id: 7,
    title: 'Go-To-Market (GTM)',
    description: 'Great products don\'t sell themselves. GTM is your tactical plan for finding and closing customers.',
    questions: [
      { 
        id: 'q1', 
        text: 'What is your primary distribution channel?', 
        placeholder: 'Direct sales, affiliate network, SEO...',
        jargonBuster: 'Distribution is how you get your product into the customer\'s hands. SEO is organic search; Direct Sales is a human caller.'
      },
      { 
        id: 'q2', 
        text: 'Describe your typical sales cycle.', 
        placeholder: '3 months from lead gen to contract signed...',
        jargonBuster: 'The "Cycle" is the time from the first conversation to the money in the bank. Long cycles (6-12 mo) require more cash.'
      },
      { 
        id: 'q3', 
        text: 'What is your strategy for viral growth or network effects?', 
        placeholder: 'Product-led growth with collaboration features...',
        jargonBuster: 'Network Effects occur when a product becomes more valuable as more people use it (like WhatsApp or eBay).'
      }
    ]
  },
  {
    id: 8,
    title: 'Pitch Narrative',
    description: 'The "Why" behind the "What." Investors back founders who can tell a compelling story about the future.',
    questions: [
      { 
        id: 'q1', 
        text: 'Why is now the perfect time for this business?', 
        placeholder: 'Regulatory changes, technology shifts, consumer behavior...',
        jargonBuster: 'The "Why Now" is often more important than the "What." Look for shifts in technology, regulation, or social trends.'
      },
      { 
        id: 'q2', 
        text: 'Why is this the right team to build it?', 
        placeholder: '10 years experience in the industry, technical PhDs...',
        jargonBuster: 'Founders call this "Founder-Market Fit." It means you have a specific, unfair insight into this specific problem.'
      },
      { 
        id: 'q3', 
        text: 'What is the "Big Vision" exit scenario?', 
        placeholder: 'Acquisition by Google or IPO in 7 years...',
        jargonBuster: 'An "Exit" is when the investor gets their money back. IPO (Initial Public Offering) is when you go on the stock market.'
      }
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
