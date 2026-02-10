
import { Stage, InvestorMode } from './types';

export const STAGES: Stage[] = [
  {
    id: 1,
    title: 'The One-Liner',
    description: 'If you cannot explain ThinkShow in 10 seconds, an investor has already moved on to the next deck.',
    questions: [
      {
        id: 'q1',
        text: 'Describe ThinkShow in one sentence — what it is, who pays, and why.',
        placeholder: 'ThinkShow is a... that helps... by providing...',
        jargonBuster: 'Investors look for "who pays, for what, and why now" in one breath. If your sentence needs a comma and a sub-clause, it is too long.'
      },
      {
        id: 'q2',
        text: 'What problem does ThinkShow solve that schools cannot solve themselves?',
        placeholder: 'Schools currently struggle with... because...',
        jargonBuster: '"Cannot solve themselves" is key. If a school can just assign a teacher to learn ChatGPT, you do not have a business — you have a nice-to-have.'
      },
      {
        id: 'q3',
        text: 'Why now? What has changed that makes this the right moment for ThinkShow?',
        placeholder: 'The convergence of... means that schools now need...',
        jargonBuster: '"Why Now" is often more important than "What." AI in education is a moment — but moments pass. What makes this urgent, not just interesting?'
      }
    ]
  },
  {
    id: 2,
    title: 'Business Model',
    description: 'How ThinkShow turns a problem into a sustainable, scalable profit engine. Services revenue does not excite investors — recurring software revenue does.',
    questions: [
      {
        id: 'q1',
        text: 'Who is the primary paying customer? Be specific — role, institution type, decision-maker.',
        placeholder: 'The Head of Teaching & Learning at private schools with 500+ learners...',
        jargonBuster: 'Avoid "schools" as your customer. A school is a building. Who inside that building has budget authority and signs the purchase order?'
      },
      {
        id: 'q2',
        text: 'What exactly are they buying? A license? A subscription? A training package? A combination?',
        placeholder: 'An annual school license that includes... plus optional...',
        jargonBuster: 'Investors want to hear "recurring subscription revenue." If the answer is "workshops and training," that is a services business, which is much harder to scale and less attractive to VCs.'
      },
      {
        id: 'q3',
        text: 'What is your pricing structure and how did you arrive at it?',
        placeholder: 'R___/school/year for Tier 1 (up to 30 teachers), R___/school/year for Tier 2...',
        jargonBuster: 'Pricing must be anchored to value, not cost. What is it worth to the school? What are they currently spending on PD (Professional Development) that this replaces?'
      },
      {
        id: 'q4',
        text: 'What does delivery look like? Fully digital? Hybrid? Does it require you or your team on-site?',
        placeholder: 'Phase 1 is a 2-hour onboarding session, then the platform...',
        jargonBuster: 'If delivery requires the founder in the room, it does not scale. Investors want to see a path to "the product sells and delivers itself."'
      },
      {
        id: 'q5',
        text: 'What is the gross margin on each unit sold? If you do not know, say so.',
        placeholder: 'For a R___/year license, delivery costs approximately R___, giving a gross margin of ___%.',
        jargonBuster: 'Gross margin = (Revenue - Cost to Deliver) / Revenue. SaaS businesses typically have 70-85% gross margins. Training/services businesses have 30-50%. This number reveals what kind of business you actually are.'
      }
    ]
  },
  {
    id: 3,
    title: 'Traction & Evidence',
    description: 'Proof over promises. What has actually happened — not what you believe will happen.',
    questions: [
      {
        id: 'q1',
        text: 'What paying customers or active pilots exist today? Be specific: names, amounts, dates.',
        placeholder: 'School X has paid R___ since [date]. Schools Y and Z are in unpaid pilots since...',
        jargonBuster: 'Pilots are not customers. Paid pilots are better than free ones. Paying customers who renewed are the gold standard. Be honest about which category each school falls into.'
      },
      {
        id: 'q2',
        text: 'What is your current monthly or annual revenue?',
        placeholder: 'R___/month from ___ sources. Or: pre-revenue, projecting first payment by [date].',
        jargonBuster: 'Zero revenue is acceptable at pre-seed. Pretending workshops equal recurring revenue is not. State the number honestly.'
      },
      {
        id: 'q3',
        text: 'You trained 36 leaders from 17 schools at Deloitte. What happened next? How many converted to anything?',
        placeholder: 'Of the 36 leaders, ___ expressed interest in..., ___ signed up for..., ___ have paid...',
        jargonBuster: 'A workshop is a marketing event, not revenue. The question investors will ask is: "What was the funnel conversion?" If 36 attended and zero paid for anything afterwards, that is a red flag.'
      },
      {
        id: 'q4',
        text: 'What is your strongest single piece of evidence that ThinkShow works and people will pay for it?',
        placeholder: 'The strongest evidence is...',
        jargonBuster: 'This should be a specific, verifiable fact — not a feeling or a compliment someone gave you. "School X renewed at a higher tier" beats "Teachers loved the workshop."'
      }
    ]
  },
  {
    id: 4,
    title: 'Market & Competition',
    description: 'Every investor will ask: "Why can\'t someone else just do this?" You need a real answer.',
    questions: [
      {
        id: 'q1',
        text: 'Define your addressable market with numbers. How many target schools exist? What is the TAM in Rand?',
        placeholder: 'There are ___ private schools in SA with budgets over R___. At R___/school, TAM = R___.',
        jargonBuster: 'TAM (Total Addressable Market) is the total revenue if you had every possible customer. Be specific: "all schools in Africa" is not a TAM — it is a fantasy.'
      },
      {
        id: 'q2',
        text: 'Who are your competitors? Include "do nothing," "DIY with ChatGPT," and any training companies.',
        placeholder: 'Direct: ___. Indirect: Schools using ChatGPT internally. Status quo: Traditional PD providers like...',
        jargonBuster: '"We have no competitors" is the fastest way to lose an investor. Your biggest competitor is inaction — schools deciding this is not urgent enough to spend money on.'
      },
      {
        id: 'q3',
        text: 'Why can\'t a well-funded competitor copy ThinkShow in 6 months?',
        placeholder: 'Our defensibility comes from...',
        jargonBuster: '"First mover" is not a moat. "We built it with AI" is not a moat — so can they. Moats include: proprietary data, network effects, switching costs, regulatory advantages, or deep embedded relationships.'
      },
      {
        id: 'q4',
        text: 'Why won\'t schools just use ChatGPT plus their existing L&D or PD teams instead of paying ThinkShow?',
        placeholder: 'Because ChatGPT alone does not..., and internal teams cannot...',
        jargonBuster: 'This is the single hardest question for AI-enabled education businesses. If a tech-savvy deputy principal can achieve 80% of what you offer for free, your business has a problem.'
      }
    ]
  },
  {
    id: 5,
    title: 'Unit Economics & Pricing',
    description: 'The maths of one customer relationship. If this does not work for one school, it will not work for a hundred.',
    questions: [
      {
        id: 'q1',
        text: 'What does it cost you all-in to acquire one school as a customer? (Sales time, demos, travel, marketing)',
        placeholder: 'Approximately R___ per school, based on ___ hours of...',
        jargonBuster: 'CAC (Customer Acquisition Cost) includes everything: your time, travel to the school, demo prep, follow-up emails, marketing spend. If you spent 20 hours and your time is worth R500/hr, that is R10,000 CAC.'
      },
      {
        id: 'q2',
        text: 'What is the average annual revenue per school/customer?',
        placeholder: 'R___/year for a standard license.',
        jargonBuster: 'This is your ARPA (Average Revenue Per Account). Combined with CAC, it tells investors how long until each customer becomes profitable.'
      },
      {
        id: 'q3',
        text: 'How long do you expect a school to remain a customer? What is your basis for this estimate?',
        placeholder: '___ years, based on...',
        jargonBuster: 'Customer lifetime drives LTV (Lifetime Value). Be honest — if you have not had a renewal yet, say so. Assuming 5-year retention with zero evidence will get you challenged immediately.'
      },
      {
        id: 'q4',
        text: 'What is your gross margin per customer after all delivery costs?',
        placeholder: 'Revenue R___ minus delivery costs R___ = gross margin of ___%.',
        jargonBuster: 'If your gross margin is below 60%, investors will question whether this is really a software business or a disguised services business.'
      }
    ]
  },
  {
    id: 6,
    title: 'Financial Projections',
    description: 'Numbers are a story told with maths. Investors do not expect accuracy — they expect logic and honesty about assumptions.',
    questions: [
      {
        id: 'q1',
        text: 'How many customers do you expect at end of Year 1, Year 2, Year 3? Show your logic.',
        placeholder: 'Y1: ___ schools (based on ___). Y2: ___ (assuming ___). Y3: ___.',
        jargonBuster: 'Build bottom-up, not top-down. "1% of the market" is lazy. "We can do 2 demos/week, close 30%, so 4 new schools/month" is credible.'
      },
      {
        id: 'q2',
        text: 'What is your expected revenue for Year 1, Year 2, Year 3?',
        placeholder: 'Y1: R___. Y2: R___. Y3: R___. Based on ___ customers at R___/year.',
        jargonBuster: 'ARR (Annual Recurring Revenue) is the key SaaS metric. For South African EdTech, reaching R5M ARR in 3 years would be a meaningful milestone.'
      },
      {
        id: 'q3',
        text: 'What are your major cost categories and estimated monthly burn rate?',
        placeholder: 'Team: R___/mo. Tech/hosting: R___/mo. Marketing: R___/mo. Total burn: R___/mo.',
        jargonBuster: 'Burn rate is how much cash you lose per month. If you are a solo founder with low costs, that is actually an advantage — it means you have long runway.'
      },
      {
        id: 'q4',
        text: 'How much capital are you raising and what specifically will it fund?',
        placeholder: 'Raising R___. Allocation: ___% for product development, ___% for sales, ___% for...',
        jargonBuster: 'Investors want 70%+ going to growth activities (product, sales, marketing). If most goes to salaries and rent, that is a concern.'
      },
      {
        id: 'q5',
        text: 'What milestones will this capital achieve? What does success look like when the money runs out?',
        placeholder: 'With this raise, we will reach ___ schools, R___/month revenue, and be positioned to...',
        jargonBuster: 'Capital must buy you "proof points" for the next raise or profitability. If the money just extends runway without hitting clear milestones, investors will pass.'
      }
    ]
  },
  {
    id: 7,
    title: 'Go-To-Market',
    description: 'How you find, convince, and close schools. A great product with no sales engine is a hobby.',
    questions: [
      {
        id: 'q1',
        text: 'Describe your sales process step by step — from first contact to signed contract.',
        placeholder: 'Step 1: ___. Step 2: ___. Step 3: ___. Average time from first contact to payment: ___.',
        jargonBuster: 'Sales process clarity shows operational maturity. If you cannot describe it in steps, you do not have a process — you have ad hoc conversations.'
      },
      {
        id: 'q2',
        text: 'How long is your sales cycle in schools? Be honest about procurement reality.',
        placeholder: '___ weeks/months from first conversation to signed contract, because...',
        jargonBuster: 'School procurement in SA can take 3-9 months depending on public vs private, budget cycles, and SGB approval. Long cycles mean you need more cash to survive the gap.'
      },
      {
        id: 'q3',
        text: 'Can you scale sales without being personally involved in every deal?',
        placeholder: 'Currently I am involved in every sale. To scale, the plan is...',
        jargonBuster: 'This is a make-or-break question. If the founder must be in every demo and negotiation, revenue is capped by the founder\'s calendar. Investors want to see a path to a repeatable, delegatable sales process.'
      },
      {
        id: 'q4',
        text: 'What is your primary channel for finding new schools? What evidence do you have that it works?',
        placeholder: 'Primary channel: ___. Evidence: ___ leads from this channel in the last ___ months.',
        jargonBuster: 'Channels include: direct outreach, referrals, conferences, partnerships (like Deloitte), content marketing, education department relationships. Which one actually produces leads?'
      },
      {
        id: 'q5',
        text: 'What is the role of the Deloitte partnership in your go-to-market? Is it a channel, a customer, or a one-time event?',
        placeholder: 'Deloitte\'s role is...',
        jargonBuster: 'A corporate partner who hosts one event is not a channel. A corporate partner who refers clients consistently is extremely valuable. Be clear about what this actually is.'
      }
    ]
  },
  {
    id: 8,
    title: 'Pitch Narrative',
    description: 'The story that makes an investor lean forward. Facts inform — stories persuade.',
    questions: [
      {
        id: 'q1',
        text: 'Write your 60-second elevator pitch for ThinkShow.',
        placeholder: 'ThinkShow exists because...',
        jargonBuster: 'Structure: Problem (10 sec) → Solution (10 sec) → Why you (10 sec) → Traction (10 sec) → Ask (10 sec) → Vision (10 sec). Practice saying it out loud.'
      },
      {
        id: 'q2',
        text: 'Why should an investor pick ThinkShow over every other deal they will see this month?',
        placeholder: 'ThinkShow stands out because...',
        jargonBuster: 'Investors see 50-100+ deals per month and fund 1-2. You are not competing against other EdTech companies — you are competing against every startup in every sector for limited capital.'
      },
      {
        id: 'q3',
        text: 'What is the biggest risk to ThinkShow and how are you mitigating it?',
        placeholder: 'The biggest risk is... We are mitigating this by...',
        jargonBuster: 'Naming your own risk shows self-awareness. Every investor will identify risks — the question is whether you have already thought about them. Saying "no major risks" is itself a red flag.'
      },
      {
        id: 'q4',
        text: 'What does ThinkShow look like in 5 years if everything goes right? What is the exit path?',
        placeholder: 'In 5 years, ThinkShow will be... The exit could be...',
        jargonBuster: 'Exit paths for SA EdTech: acquisition by a global EdTech platform (Pearson, Byju\'s successor, etc.), acquisition by a local group (Naspers/Prosus, PSG, etc.), or growing to profitability. Be realistic about which path fits.'
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
