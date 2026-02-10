
import React, { useState } from 'react';
import { AppState, StageState } from '../types';
import { STAGES } from '../constants';
import { CheckCircle, Copy, FileText, Share2, Target, TrendingUp, AlertCircle } from 'lucide-react';

interface ReportViewProps {
  state: AppState;
}

const ReportView: React.FC<ReportViewProps> = ({ state }) => {
  const [copied, setCopied] = useState(false);

  const calculateOverallScore = () => {
    const stageArray = Object.values(state.stages) as StageState[];
    const scores = stageArray
      .filter(s => s.evaluation !== undefined)
      .map(s => s.evaluation!.score);
    
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return (sum / scores.length).toFixed(1);
  };

  const overallScore = calculateOverallScore();

  const handleCopyReport = () => {
    let reportText = `THINKSHOW INVESTOR READINESS REPORT\n`;
    reportText += `Overall Score: ${overallScore}/10\n`;
    reportText += `Investor Lens: ${state.investorMode}\n`;
    reportText += `==========================================\n\n`;

    STAGES.forEach(stage => {
      const stageState = state.stages[stage.id];
      if (!stageState) return;

      reportText += `STAGE ${stage.id}: ${stage.title.toUpperCase()}\n`;
      if (stageState.evaluation) {
        reportText += `Readiness Score: ${stageState.evaluation.score}/10\n`;
        reportText += `Investor Verdict: ${stageState.evaluation.verdict}\n`;
      }
      
      reportText += `\nREFINED WORDING:\n`;
      stage.questions.forEach(q => {
        reportText += `${q.text}\n`;
        reportText += `${stageState.answers[q.id] || '(No answer provided)'}\n\n`;
      });
      reportText += `------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-2 gold-gradient tracking-tight">
            Readiness Report
          </h1>
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Target size={14} className="text-[#D4A843]" /> Prepared for Venture Fundraising
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleCopyReport}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all font-bold ${
              copied 
                ? 'bg-green-500/10 border-green-500 text-green-500' 
                : 'bg-[#D4A843] text-black border-[#D4A843] hover:scale-105 active:scale-95'
            }`}
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            {copied ? 'Copied to Clipboard' : 'Copy Full Document'}
          </button>
        </div>
      </div>

      {/* Summary Score Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#0F0F1A] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} />
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Confidence Level</span>
          <span className="text-5xl font-mono font-bold text-white leading-none">{overallScore}</span>
          <span className="text-xs text-gray-500 mt-2">Overall Rank</span>
        </div>
        <div className="md:col-span-2 bg-[#0F0F1A] border border-gray-800 rounded-2xl p-6 flex flex-col justify-center">
          <h3 className="text-sm font-mono text-[#D4A843] uppercase tracking-widest mb-3">Executive Summary</h3>
          <p className="text-gray-400 italic text-sm leading-relaxed">
            This document represents a self-guided due diligence process using the <span className="text-white">"{state.investorMode}"</span> lens. 
            The scores and wording below are refined through recursive feedback from AI Investment models to ensure maximum clarity and defensive logic.
          </p>
        </div>
      </div>

      {/* The Report Body */}
      <div className="space-y-16">
        {STAGES.map((stage) => {
          const stageState = state.stages[stage.id];
          if (!stageState) return null;

          return (
            <section key={stage.id} className="border-t border-gray-800 pt-12 animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${stage.id * 100}ms` }}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-[#D4A843] font-mono text-lg">0{stage.id}.</span> {stage.title}
                  </h2>
                </div>
                {stageState.evaluation && (
                  <div className={`px-4 py-1.5 rounded-lg border font-mono text-sm ${
                    stageState.evaluation.score >= 7 ? 'bg-green-500/5 border-green-500/30 text-green-500' : 'bg-orange-500/5 border-orange-500/30 text-orange-500'
                  }`}>
                    SCORE: {stageState.evaluation.score}/10
                  </div>
                )}
              </div>

              {/* Refined Content */}
              <div className="space-y-8">
                {stage.questions.map((q) => (
                  <div key={q.id} className="bg-[#0F0F1A]/50 rounded-xl p-6 border border-gray-800/30">
                    <h4 className="text-[11px] font-mono text-[#D4A843]/60 uppercase tracking-widest mb-4">
                      {q.text}
                    </h4>
                    <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                      {stageState.answers[q.id] || (
                        <span className="text-gray-600 italic font-mono text-sm flex items-center gap-2">
                          <AlertCircle size={14} /> Section not yet completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {stageState.evaluation && (
                <div className="mt-8 p-6 bg-black/20 rounded-xl border-l-4 border-[#D4A843]/50">
                  <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Investor Closing Thoughts</h4>
                  <p className="text-gray-400 text-sm italic leading-relaxed">
                    "{stageState.evaluation.verdict}"
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-20 pt-12 border-t border-gray-800 text-center">
        <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.2em] mb-4">
          End of Strategic Readiness Report
        </p>
        <button 
          onClick={() => window.print()}
          className="text-gray-500 hover:text-[#D4A843] transition-colors text-xs font-mono uppercase underline decoration-dashed"
        >
          Generate PDF for Pitch Deck Appendix
        </button>
      </div>
    </div>
  );
};

export default ReportView;
