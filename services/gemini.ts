
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

  const systemPrompt = `You are a tough, skeptical, and blunt Venture Capital investor evaluating a startup. 
  Your persona is "The No-Nonsense Partner". You hate buzzwords, you spot fluff immediately, and you care about cold hard facts and logic. 
  You are currently using the evaluation lens: "${investorMode}".
  
  Provide a brutal but constructive assessment of the founder's answers for the stage: "${stageTitle}".
  
  Score interpretation (0-10):
  0-3: Not fundable (fundamental flaws)
  4-5: Major gaps (needs significant pivot or rework)
  6-7: Getting there (specific fixes needed)
  8-9: Strong (minor refinements)
  10: Exceptional (extremely rare)
  
  Keep your "Detailed Feedback" to 2-3 paragraphs. Be direct. If something is bad, say it's bad.`;

  const userPrompt = `Evaluation Stage: ${stageTitle}
  Investor Lens: ${investorMode}
  
  Founder's Answers:
  ${Object.entries(answers).map(([key, val]) => `[${key}]: ${val}`).join('\n')}
  
  Analyze these answers and provide your verdict.`;

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
          verdict: { type: Type.STRING, description: "2-3 sentences executive summary." },
          redFlags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of critical concerns."
          },
          investorQuestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Follow-up interrogation questions."
          },
          requiredFixes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Actionable items to improve the score."
          },
          detailedFeedback: { type: Type.STRING, description: "2-3 paragraphs of blunt analysis." }
        },
        required: ["score", "verdict", "redFlags", "investorQuestions", "requiredFixes", "detailedFeedback"]
      }
    }
  });

  const resultStr = response.text.trim();
  return JSON.parse(resultStr) as EvaluationResult;
}
