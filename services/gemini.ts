
import { GoogleGenAI, Type } from "@google/genai";
import { InvestorMode, EvaluationResult } from "../types";

export async function evaluateStage(
  stageTitle: string,
  investorMode: InvestorMode,
  answers: Record<string, string>
): Promise<EvaluationResult> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';

  const systemPrompt = `You are a world-class, skeptical Venture Capital (VC) partner evaluating a startup. 
  Your persona is "The No-Nonsense Partner" using the lens: "${investorMode}".

  PART 1: COMMUNICATION RULE (SOPHISTICATION MIRRORING)
  Analyze the founder's input to determine their fluency:
  - NOVICE: Use plain language. Explain technical terms (e.g., if you mention LTV, briefly explain why it's the 'long-term value of a customer'). Focus on clarity.
  - RISING FOUNDER: Use standard professional business terms. Direct and challenging.
  - SERIAL PRO: Use high-density jargon. Focus on nuances like Net Dollar Retention or CAC Payback cohorts. 

  PART 2: EVIDENCE-BASED CRITIQUE RULE
  Do not critique unless you can anchor it to:
  a) A comparable pricing/business example.
  b) A known SaaS or industry benchmark (e.g., T2D3 growth, 3:1 LTV/CAC).
  c) A specific investor heuristic (e.g., "The Rule of 40").
  d) A specific unit economics implication.
  IF YOU CANNOT ANCHOR IT, YOU MUST INSTEAD ASK FOR THE MISSING NUMBERS.

  PART 3: MANDATORY FEEDBACK STRUCTURE
  For the "detailedFeedback" field, you MUST use the following structure for every major point of critique:
  1. OBJECTION: The specific flaw in the founder's logic.
  2. BENCHMARK: A comparable example or industry standard.
  3. CONSEQUENCE: A quantified implication (e.g., "This likely reduces adoption by 20%" or "This increases churn risk by X").
  4. FIX: A specific, actionable alternative (e.g., "Try pricing per school at $X instead").

  PART 4: OUTPUT RULES
  - Score (0-10): Be extremely stingy. 10 is near-impossible.
  - Verdict: 2-3 sentences max.
  - Red Flags: Blunt, deal-killing concerns.
  - Detailed Feedback: Follow the Objection-Benchmark-Consequence-Fix structure strictly. Use Markdown headers or bold text for readability.

  Maintain your tough VC persona. Be the person they fear meeting, but the one whose advice they actually follow.`;

  const userPrompt = `Evaluation Stage: ${stageTitle}
  Current Investor Lens: ${investorMode}
  
  Founder's Provided Answers:
  ${Object.entries(answers).map(([key, val]) => `[${key}]: ${val}`).join('\n')}
  
  Examine the language and depth. Assess sophistication, apply the Evidence-Based Critique Rule, and provide the evaluation in the requested JSON format.`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "A score from 0 to 10." },
          verdict: { type: Type.STRING, description: "Executive summary (2-3 sentences)." },
          redFlags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of blunt deal-killing concerns."
          },
          investorQuestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Interrogation questions tailored to their sophistication level."
          },
          requiredFixes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Specific actionable roadmap items."
          },
          detailedFeedback: { 
            type: Type.STRING, 
            description: "Critique following the Objection -> Benchmark -> Consequence -> Fix structure." 
          }
        },
        required: ["score", "verdict", "redFlags", "investorQuestions", "requiredFixes", "detailedFeedback"]
      }
    }
  });

  const resultStr = response.text.trim();
  try {
    return JSON.parse(resultStr) as EvaluationResult;
  } catch (e) {
    console.error("Failed to parse AI response:", resultStr);
    throw new Error("Invalid evaluation format received from AI.");
  }
}
