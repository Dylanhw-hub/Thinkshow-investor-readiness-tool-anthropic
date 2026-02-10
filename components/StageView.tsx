
import React, { useState } from 'react';
import { Stage, AppState, Action } from '../types';
import { evaluateStage } from '../services/gemini';
import { Loader2, AlertTriangle, CheckCircle, ArrowRight, BrainCircuit, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface StageViewProps {
  stage: Stage;
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StageView: React.FC<StageViewProps> = ({ stage, state, dispatch }) => {
  const stageState = state.stages[stage.id] || { answers: {}, isSkipped: false };
  const { answers, evaluation } = stageState;
  const { isEvaluating } = state;

  const handleAnswerChange = (qId: string, value: string) => {
    dispatch({ type: 'SET_ANSWER', stageId: stage.id, questionId: qId, value });
  };

  const handleSubmit = async () => {
    const allAnswersFilled = stage.questions.every(q => (answers[q.id]?.length || 0) >= 10);
    if (!allAnswersFilled) {
      alert("Please provide at least some basic detail for each question before submitting for evaluation.");
      return;
    }

    dispatch({ type: 'SET_EVALUATING', status: true });
    try {
      const result = await evaluateStage(stage.title, state.investorMode, answers);
      dispatch({ type: 'SET_EVALUATION', stageId: stage.id, result });
      dispatch({ type: 'SET_EVALUATING', status: false });
    } catch (error) {
      console.error(error);
      alert("Evaluation failed. Please try again.");
      dispatch({ type: 'SET_EVALUATING', status: false });
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'SKIP_STAGE', stageId: stage.id });
    if (stage.id < 8) {
      dispatch({ type: 'SET_CURRENT_STAGE', id: stage.id + 1 });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500/10 border-green-500/50 text-green-500';
    if (score >= 6) return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500';
    if (score >= 4) return 'bg-orange-500/10 border-orange-500/50 text-orange-500';
    return 'bg-red-500/10 border-red-500/50 text-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/30 uppercase tracking-widest">
            Stage 0{stage.id}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 gold-gradient tracking-tight">
          {stage.title}
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
          {stage.description}
        </p>
      </div>

      <div className="space-y-16">
        {stage.questions.map((q) => {
          const charCount = (answers[q.id] || '').length;
          const isEnough = charCount >= 50;

          return (
            <div key={q.id} className="group relative">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors flex items-center gap-2">
                  {q.text}
                </label>
                <div className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${isEnough ? 'bg-green-500/10 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                  {isEnough ? '✓ Sufficient' : '💡 Detail needed'} ({charCount} chars)
                </div>
              </div>

              {/* Jargon Buster / Investor Context */}
              {q.jargonBuster && (
                <div className="mb-4 p-3 bg-gray-900/50 border border-gray-800/50 rounded-lg flex gap-3 items-start group/insight hover:border-[#D4A843]/30 transition-colors">
                  <Info size={14} className="text-[#D4A843] mt-0.5 shrink-0" />
                  <p className="text-[11px] font-mono text-gray-500 leading-relaxed group-hover/insight:text-gray-300">
                    <span className="text-[#D4A843]/70 font-bold mr-1">INVESTOR INSIGHT:</span>
                    {q.jargonBuster}
                  </p>
                </div>
              )}

              <textarea
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                className="w-full h-40 bg-[#0F0F1A] border border-gray-800 rounded-xl p-6 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843]/20 transition-all resize-y shadow-inner text-lg leading-relaxed"
              />
            </div>
          );
        })}
      </div>

      {/* Evaluation Results Section */}
      {evaluation && (
        <div className="mt-16 border-t border-gray-800 pt-16 space-y-12 animate-in zoom-in-95 duration-700">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-[#0F0F1A] rounded-2xl p-8 border border-gray-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <BrainCircuit size={120} />
             </div>
             <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(evaluation.score)} shadow-2xl`}>
               <span className="text-5xl font-mono font-bold leading-none">{evaluation.score}</span>
               <span className="text-xs font-mono uppercase tracking-widest mt-1 opacity-70">Readiness</span>
             </div>
             <div className="flex-1">
               <h3 className="text-xl font-bold text-white mb-2 font-mono flex items-center gap-2">
                 Investor Verdict
               </h3>
               <p className="text-gray-300 italic text-lg leading-relaxed border-l-4 border-[#D4A843] pl-6 py-2">
                 "{evaluation.verdict}"
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h4 className="text-red-400 font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={16} /> Red Flags
              </h4>
              <ul className="space-y-3">
                {evaluation.redFlags.map((flag, i) => (
                  <li key={i} className="text-gray-400 text-sm flex gap-3">
                    <span className="text-red-500/50">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-2xl p-6">
              <h4 className="text-[#D4A843] font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <BrainCircuit size={16} /> Key Investor Questions
              </h4>
              <ul className="space-y-3">
                {evaluation.investorQuestions.map((q, i) => (
                  <li key={i} className="text-gray-400 text-sm flex gap-3">
                    <span className="text-[#D4A843]/50">?</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
            <h4 className="text-yellow-500 font-mono text-sm uppercase tracking-widest mb-4">Required Fixes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluation.requiredFixes.map((fix, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-black/20 rounded-lg">
                  <CheckCircle size={16} className="text-yellow-500/50 mt-1 shrink-0" />
                  <span className="text-gray-300 text-sm leading-snug">{fix}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h4 className="text-gray-200 font-mono text-sm uppercase tracking-widest mb-4">Detailed Analysis</h4>
            <div className="text-gray-400 text-lg leading-relaxed space-y-4">
              {evaluation.detailedFeedback.split('\n').map((para, i) => para && <p key={i}>{para}</p>)}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-8 mt-16 flex flex-col sm:flex-row gap-4 justify-center bg-[#0A0A0F]/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-2xl">
        <button
          onClick={handleSkip}
          className="px-8 py-4 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-gray-900 border border-gray-800 transition-all"
        >
          {evaluation ? 'Continue to Next Stage' : 'Skip & Continue'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isEvaluating}
          className="px-10 py-4 rounded-xl font-bold gold-bg-gradient text-black flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isEvaluating ? (
            <>
              <Loader2 className="animate-spin" />
              Evaluating Plan...
            </>
          ) : (
            <>
              {evaluation ? 'Re-Evaluate Plan' : 'Submit for Evaluation'}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StageView;
