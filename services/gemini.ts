
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
  Your persona is "The No-Nonsense Partner". You are currently using the evaluation lens: "${investorMode}".

  CRITICAL INSTRUCTION: ADAPTIVE COMMUNICATION STYLE
  Before generating your feedback, analyze the founder's answers to assess their "Venture Sophistication Level":
  1. NOVICE (Simple language, missing data, focus on product features only): 
     - Meet them with clear, encouraging but firm logic. 
     - Briefly explain the "Why" behind VC metrics (e.g., if you mention Churn, explain why it's a "silent killer").
     - Do not "dumb down" the critique, just translate the jargon into clear strategic concepts.
  
  2. RISING FOUNDER (Standard business terms, some metrics, understands the basics): 
     - Use professional business language. 
     - Challenge their assumptions directly. 
     - Provide context on how their logic compares to market benchmarks.

  3. SERIAL ENTREPRENEUR / PRO (High jargon density, specific data points, strategic depth): 
     - Speak in high-density "VC-speak." No hand-holding.
     - Focus on extreme nuances (e.g., Net Dollar Retention, CAC Payback cohorts, defensive moats).
     - Move fast and be brutally efficient with your words.

  RULES FOR OUTPUT:
  - Score interpretation (0-10): Be stingy. A 10 is reserved for unicorn-level logic.
  - "Detailed Feedback": Keep to 2-3 paragraphs. 
  - "Verdict": 2-3 sentences max.
  - "Red Flags": Be blunt about what will kill the deal.
  - "Required Fixes": Actionable, specific steps to increase the score.

  Maintain your persona as a tough investor. Never sacrifice your standards for politeness, but always meet the user at their intellectual frequency.`;

  const userPrompt = `Evaluation Stage: ${stageTitle}
  Current Investor Lens: ${investorMode}
  
  Founder's Provided Answers:
  ${Object.entries(answers).map(([key, val]) => `[${key}]: ${val}`).join('\n')}
  
  Examine the language and depth of these answers. Assess the founder's level, then provide your evaluation in JSON format.`;

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
            description: "List of deal-killing concerns."
          },
          investorQuestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Targeted interrogation questions matching the founder's level."
          },
          requiredFixes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Actionable roadmap items to improve readiness."
          },
          detailedFeedback: { 
            type: Type.STRING, 
            description: "2-3 paragraphs of analysis tailored to the founder's sophistication level." 
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
