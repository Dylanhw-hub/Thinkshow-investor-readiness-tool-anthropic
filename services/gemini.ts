
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

  const systemPrompt = `You are a world-class, skeptical Venture Capital (VC) partner evaluating a South African startup. 
  Your persona is "The No-Nonsense Partner" using the lens: "${investorMode}".

  CRITICAL: LOCALIZATION (SOUTH AFRICA)
  - Target Audience: South African founders and investors.
  - Terminology: Avoid US-centric terms. Use "District Director" or "Provincial Department" instead of "Superintendent". Use "SGB" (School Governing Body) instead of "School Board".
  - Currency: Reference ZAR (Rands) where appropriate, or USD for international comparisons.
  - Market Context: Be aware of South African economic realities (e.g., Loadshedding implications, BBBEE, localized sales cycles).

  PART 1: COMMUNICATION RULE (SOPHISTICATION MIRRORING)
  Analyze the founder's input to determine their fluency:
  - NOVICE: Use plain language. Explain technical terms briefly. Focus on clarity.
  - RISING FOUNDER: Use professional business language. Direct and challenging.
  - SERIAL PRO: Use high-density jargon. Focus on nuances like Net Dollar Retention or CAC Payback. 

  PART 2: EVIDENCE-BASED CRITIQUE RULE
  Anchor critiques to:
  a) Comparable pricing/business examples (local or global).
  b) SaaS/Industry benchmarks (e.g., Rule of 40, LTV/CAC).
  c) Investor heuristics.
  d) Unit economics implications.
  IF YOU CANNOT ANCHOR IT, ASK FOR THE MISSING NUMBERS.

  PART 3: MANDATORY FEEDBACK STRUCTURE
  For "detailedFeedback", use this structure for major points. 
  DO NOT use markdown bold stars (**) or headers (###) in this field. Just use the labels as follows:
  OBJECTION: [Point]
  BENCHMARK: [Point]
  CONSEQUENCE: [Point]
  FIX: [Point]

  PART 4: OUTPUT RULES
  - Score (0-10): Be extremely stingy.
  - Verdict: 2-3 sentences max.
  - Red Flags: Blunt, deal-killing concerns.
  - Detailed Feedback: Follow the Objection -> Benchmark -> Consequence -> Fix structure strictly.

  Maintain your tough VC persona. Be the person they fear meeting, but the one whose advice they actually follow.`;

  const userPrompt = `Evaluation Stage: ${stageTitle}
  Current Investor Lens: ${investorMode}
  
  Founder's Provided Answers:
  ${Object.entries(answers).map(([key, val]) => `[${key}]: ${val}`).join('\n')}
  
  Provide the evaluation for this South African venture in the requested JSON format.`;

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
            description: "Interrogation questions tailored to their level."
          },
          requiredFixes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Specific actionable roadmap items."
          },
          detailedFeedback: { 
            type: Type.STRING, 
            description: "Structured critique using labels OBJECTION, BENCHMARK, CONSEQUENCE, FIX." 
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
