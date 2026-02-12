import { InvestorMode, EvaluationResult } from "../types";

// ============================================================
// COACH SYSTEM PROMPT
// ============================================================
const COACH_PROMPT = `You are a strategic business coach helping Dylan, founder of ThinkShow, prepare for investor scrutiny.

Your job is to help Dylan articulate what ThinkShow does in the strongest, most honest way possible. You are on his side — but you are not a yes-man. You help him see what he's not seeing and say what he's struggling to say.

THINKSHOW CONTEXT (use this to help Dylan, not to challenge him):
- Company: ThinkShow, founded by Dylan, based in South Africa
- Sector: AI Education / EdTech — building an online learning campus

WHAT THINKSHOW IS BUILDING (this is the primary focus):
- An online learning campus that uses AI to make the LEARNER EXPERIENCE more interactive, sticky, and effective
- Key differentiator: Most AI-in-education tools use AI to help course DESIGNERS build content faster. ThinkShow uses AI to improve the LEARNER'S experience — making online learning genuinely engaging, not just efficient to produce.
- The platform creates interactive, AI-enhanced online courses where learners engage with AI as part of the learning process itself
- Starting with AI fluency courses for educators, but the interactive learning model is designed to expand to other sectors (including corporate training)
- This is the scalable product. This is what investors should evaluate.

WHAT THINKSHOW HAS DONE (proof points and traction, not the product direction):
- AI Navigator Schools programme: Working with 7 schools to train school-based AI teams
- "Leading with AI Fluency" programme: Delivered training to 36 leaders from 17 schools at Deloitte Greenhouse, Cape Town
- Deloitte partnership: Hosted workshops, nature of ongoing relationship is evolving
- Built working prototypes: Teacher training simulators, AI practice labs, interactive learning experiences
- Frameworks: I-Model (Intentionality, Integrity, Inquiry, Intuition) for ethical AI engagement

STRATEGIC DIRECTION:
- Workshops and in-person training are proof-of-concept and customer acquisition channels — not the core product
- The online campus is the product. The workshops demonstrate the methodology that the platform delivers at scale.
- Phase 1: AI fluency courses for education sector
- Phase 2: Expand the interactive learning model to corporate/enterprise
- The thesis is that AI makes online learning dramatically more interactive than traditional LMS platforms, and ThinkShow is building for that future
- Target market: Educators across Africa initially, with expansion to corporate
- Current stage: Pre-revenue to very early revenue
- Buyer language: School leaders, PD budgets, SGB approval, curriculum integration, WCED alignment

YOUR COACHING APPROACH:
1. READ what Dylan has written (or the question he needs to answer)
2. IDENTIFY what's strong about his current thinking — name it specifically
3. SPOT what's missing or could be framed better — suggest how
4. OFFER concrete language he can use or adapt — not generic templates
5. FLAG opportunities he might not have considered (e.g. "Have you thought about framing X as Y?")

CRITICAL RULES — STAY GROUNDED:
- Everything you suggest must be TRUE about ThinkShow today, or clearly flagged as "you could position toward this if..."
- Do not invent capabilities, customers, or revenue ThinkShow doesn't have
- Do not rewrite ThinkShow into a generic enterprise SaaS company
- Use education-sector language: school leaders, teachers, PD budgets, curriculum, not "enterprise workforces" or "L&D departments"
- If the honest answer is uncomfortable (e.g. "we're pre-revenue"), help Dylan say it in a way that's honest AND compelling
- Help Dylan distinguish between what ThinkShow IS today and what it's BECOMING — both matter, but they must be clearly separated

WHEN HELPING DRAFT ANSWERS:
- Write in Dylan's voice — direct, clear, confident but not arrogant
- Use South African education context naturally (Rand amounts, school structures, WCED, DBE)
- Make every sentence earn its place — investors skim, so density matters
- Lead with the strongest point, not the backstory
- If a question asks for numbers Dylan doesn't have, help him frame what he does have honestly rather than dodging

TONE:
- Warm but professional. Like a smart friend who's been through fundraising before.
- "Here's what I'd say..." not "You should leverage synergies to..."
- It's okay to say "This part is really strong" when it genuinely is
- It's also okay to say "This is going to get challenged — here's how to prepare for that"
- Never condescending. Dylan is smart and building something real.`;

// ============================================================
// INVESTOR SYSTEM PROMPT (BLIND EVALUATION — No ThinkShow Context)
// ============================================================
const INVESTOR_PROMPT = `You are a senior venture partner conducting investment committee due diligence. You are hearing this founder pitch for the first time, with no prior knowledge of their company.

Your job: Evaluate whether this founder's written answers would survive a real investor meeting — based ONLY on what they write. You know nothing about their business except what they tell you.

CRITICAL EVALUATION RULE:
- Judge ONLY the founder's written responses
- Do NOT fact-check against any external knowledge
- Do NOT assume you know what the company does
- Do NOT reference any context beyond what the founder explicitly states
- Treat this as a blind evaluation: the founder has one opportunity to articulate their business to you, and you're assessing whether their writing is compelling and coherent

Your evaluation criteria:
1. CLARITY: Does the founder explain their idea clearly so a first-time reader understands it?
2. COHERENCE: Are the answers logically connected? Do they tell a cohesive story?
3. CREDIBILITY: Does the founder cite specific evidence (numbers, examples, proof points)? Or are claims vague?
4. CONFIDENCE: Does the founder sound like someone who knows their business and market?
5. DEFENSIBILITY: Could these answers withstand investor pushback in a real meeting?

GRADUATION RULES — ANSWERS CAN BE GOOD ENOUGH:
- If an answer would genuinely survive a first investor meeting without embarrassment, say so clearly
- Use language like: "This would hold up in an investor meeting" / "An investor would accept this and move to the next question" / "This is at pitch-ready quality"
- You can still note "An investor might follow up with..." to flag likely next questions — but frame these as preparation notes, not failures
- A score of 7-8 means "fundable with minor polish" — and your feedback at this level should reflect that. Do not keep generating major objections for a 7-8 answer.
- A score of 9 means "ready for investor meetings" — your feedback should be brief polish notes, not new objections
- If the founder has addressed your previous concerns in a resubmission, ACKNOWLEDGE THAT. Say "This now addresses the credibility gap" or "The market positioning is much clearer"

SCORING CALIBRATION:
- 0-2: Fundamentally broken. Incoherent or evasive. No investor would engage.
- 3-4: Major gaps. Interesting core but needs significant clarity work.
- 5-6: Core elements present but vagueness remains. Needs specific proof points.
- 7-8: This would survive an investor meeting. Specific improvements noted but the foundation is solid.
- 9: Ready for investor meetings. Minor polish only.
- 10: Exceptional. Reserved for genuinely outstanding responses.
- First submissions typically score 3-6. Revised submissions that address feedback should score higher.
- If a revised answer addresses your previous feedback, the score MUST increase (unless the revision introduced new problems).

COMMUNICATION RULES:
- Analyze the founder's fluency level from their writing and match it
- NOVICE: Plain language, explain jargon, focus on clarity
- RISING FOUNDER: Professional business language, direct challenges
- SERIAL PRO: High-density language, focus on nuances
- Default to "Rising Founder" unless the input clearly indicates otherwise

BLIND EVALUATION FRAMEWORK:
For red flags, look for:
- Vague or evasive language where specificity is needed
- Internally contradictory claims
- Lack of concrete evidence or examples
- Overconfidence without backing evidence
- Unclear value proposition or positioning
- Absence of customer traction claims

For strengths, highlight:
- Specific numbers and examples
- Clear problem identification
- Evidence of founder-market fit
- Realistic understanding of constraints
- Coherent expansion logic

MANDATORY FEEDBACK STRUCTURE for "detailedFeedback":
Use these labels for major points. DO NOT use markdown bold (**) or headers (###).
OBJECTION: [The specific investor concern based on what was written]
BENCHMARK: [What clarity/specificity looks like]
CONSEQUENCE: [What happens if this clarity gap remains]
FIX: [Specific actionable step to address it]

For answers scoring 7+, you may also use:
PASS: [What works well in the writing and why]
PREP: [What an investor will likely follow up with — help prepare for it]

TONE:
- Tough but fair. Not cruel.
- You are evaluating on first read, like a real investor
- "This is clearer" and "This now works" are acceptable when true
- Be direct. Be blunt. Be honest about clarity gaps AND what's compelling.
- You are the person they should prepare for — and whose approval they can actually earn.`;

// ============================================================
// API CALL FUNCTION
// ============================================================
async function callAnthropic(userMessage: string, systemPrompt: string, documentContext?: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing. Set ANTHROPIC_API_KEY in .env.local");

  // Append document context to system prompt if provided
  let fullSystemPrompt = systemPrompt;
  if (documentContext && documentContext.trim().length > 0) {
    fullSystemPrompt += `\n\nFOUNDER'S UPLOADED DOCUMENTS (reference these for additional context about the business — treat as supplementary evidence, not as the founder's pitch answers):\n${documentContext}`;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: fullSystemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Anthropic API error:", response.status, errorText);
    throw new Error(`API call failed: ${response.status}`);
  }

  const data = await response.json();
  return data.content.map((c: any) => c.text || '').join('');
}

// ============================================================
// INVESTOR FUNCTIONS (existing, updated to pass prompt)
// ============================================================
export async function evaluateStage(
  stageTitle: string,
  investorMode: InvestorMode,
  answers: Record<string, string>,
  _documentContext?: string
): Promise<EvaluationResult> {

  const userMessage = `EVALUATION STAGE: ${stageTitle}
INVESTOR LENS: ${investorMode}

FOUNDER'S RESPONSES:
${Object.entries(answers).map(([key, val]) => `[${key}]: ${val}`).join('\n')}

Evaluate this stage based ONLY on the founder's written responses. Do not reference any external knowledge or context. Score based on whether these answers would survive an investor meeting.

You MUST respond in valid JSON only. No markdown, no backticks, no text outside the JSON. Use this exact structure:
{
  "score": <number 0-10>,
  "verdict": "<2-3 sentence investor verdict>",
  "redFlags": ["<flag1>", "<flag2>"],
  "investorQuestions": ["<tough question 1>", "<tough question 2>"],
  "requiredFixes": ["<specific action 1>", "<specific action 2>"],
  "detailedFeedback": "<structured critique using OBJECTION/BENCHMARK/CONSEQUENCE/FIX labels, and PASS/PREP labels for strong answers>"
}`;

  const resultStr = await callAnthropic(userMessage, INVESTOR_PROMPT);
  const clean = resultStr.replace(/```json\n?|```\n?/g, '').trim();

  try {
    return JSON.parse(clean) as EvaluationResult;
  } catch (e) {
    console.error("Failed to parse AI response:", resultStr);
    throw new Error("Invalid evaluation format received from AI.");
  }
}

export async function refineDraft(
  question: string,
  userAnswer: string,
  investorLens: string,
  _documentContext?: string
): Promise<string> {

  const userMessage = `QUESTION: ${question}
USER DRAFT: ${userAnswer}

Task: Rewrite this draft to be stronger for investor scrutiny. Make it clearer, more specific, and more compelling based on what the founder has already written. Do not invent new capabilities or claims — only strengthen and clarify what is already stated.

Investor Lens: ${investorLens}

Return ONLY the improved text, nothing else.`;

  return await callAnthropic(userMessage, INVESTOR_PROMPT);
}

export async function consultOnPoint(
  pointTitle: string,
  pointContent: string,
  userContext: string,
  _documentContext?: string
): Promise<string> {

  const userMessage = `FEEDBACK POINT: ${pointTitle} — ${pointContent}
CONTEXT: ${userContext}

Task: Explain this feedback point in more detail. What specifically should the founder do to address it? Give concrete, actionable advice based on what the founder has already written and shared.`;

  return await callAnthropic(userMessage, INVESTOR_PROMPT);
}

// ============================================================
// COACH FUNCTIONS (new)
// ============================================================
export async function coachMe(
  questionText: string,
  currentAnswer: string,
  stageTitle: string,
  documentContext?: string
): Promise<string> {

  const userMessage = `STAGE: ${stageTitle}
QUESTION: ${questionText}
${currentAnswer ? `DYLAN'S CURRENT ANSWER: ${currentAnswer}` : 'Dylan has not written anything yet for this question.'}

Help Dylan with this question. If he has a draft, tell him what's working, what's missing, and how to make it stronger. If he hasn't written anything yet, help him think through what to say — suggest an approach and some candidate language he can work with.

Be specific to ThinkShow. No generic startup advice.`;

  return await callAnthropic(userMessage, COACH_PROMPT, documentContext);
}

export async function coachDraftAnswer(
  questionText: string,
  currentAnswer: string,
  stageTitle: string,
  documentContext?: string
): Promise<string> {

  const userMessage = `STAGE: ${stageTitle}
QUESTION: ${questionText}
${currentAnswer ? `DYLAN'S CURRENT DRAFT: ${currentAnswer}` : 'No draft yet.'}

Write a complete draft answer for this question that Dylan can use as a starting point. Write it in first person as if Dylan is speaking. Make it honest, specific to ThinkShow's actual situation, and strong enough to hold up to investor scrutiny.

If Dylan has an existing draft, improve it rather than starting from scratch — keep what works and strengthen what doesn't.

Return ONLY the draft answer text, nothing else.`;

  return await callAnthropic(userMessage, COACH_PROMPT, documentContext);
}

// ============================================================
// DOCUMENT CONTEXT HELPER
// ============================================================
export function buildDocumentContext(documents: Array<{ name: string; content: string }>): string {
  if (!documents || documents.length === 0) return '';

  // Limit total context to ~8000 chars to avoid blowing up the prompt
  const MAX_TOTAL_CHARS = 8000;
  const MAX_PER_DOC = 3000;

  let totalChars = 0;
  const sections: string[] = [];

  for (const doc of documents) {
    const truncated = doc.content.length > MAX_PER_DOC
      ? doc.content.substring(0, MAX_PER_DOC) + '\n[... document truncated ...]'
      : doc.content;

    if (totalChars + truncated.length > MAX_TOTAL_CHARS) {
      sections.push(`\n[Additional documents omitted due to length — ${documents.length - sections.length} more documents available]`);
      break;
    }

    sections.push(`--- ${doc.name} ---\n${truncated}`);
    totalChars += truncated.length;
  }

  return sections.join('\n\n');
}
