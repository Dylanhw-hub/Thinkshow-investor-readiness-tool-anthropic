
export enum InvestorMode {
  STANDARD = 'Standard Due Diligence',
  PITCH_REVIEW = 'Pitch Review',
  FINANCIAL_DILIGENCE = 'Financial Diligence',
  MARKET_SKEPTIC = 'Market Skeptic',
  INVESTMENT_COMMITTEE = 'Investment Committee',
  GTM_REALITY_CHECK = 'GTM Reality Check'
}

export interface Question {
  id: string;
  text: string;
  placeholder: string;
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export interface EvaluationResult {
  score: number;
  verdict: string;
  redFlags: string[];
  investorQuestions: string[];
  requiredFixes: string[];
  detailedFeedback: string;
}

export interface StageState {
  answers: Record<string, string>;
  evaluation?: EvaluationResult;
  isSkipped: boolean;
}

export interface AppState {
  currentStageId: number;
  investorMode: InvestorMode;
  sidebarCollapsed: boolean;
  stages: Record<number, StageState>;
  isEvaluating: boolean;
}

export type Action =
  | { type: 'SET_CURRENT_STAGE'; id: number }
  | { type: 'SET_INVESTOR_MODE'; mode: InvestorMode }
  | { type: 'SET_ANSWER'; stageId: number; questionId: string; value: string }
  | { type: 'SET_EVALUATION'; stageId: number; result: EvaluationResult }
  | { type: 'SKIP_STAGE'; stageId: number }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_EVALUATING'; status: boolean };
