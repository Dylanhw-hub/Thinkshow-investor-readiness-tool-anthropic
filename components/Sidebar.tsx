
import React from 'react';
import { AppState, Action, InvestorMode, StageState } from '../types';
import { STAGES } from '../constants';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  Target,
  FileText,
  Trash2
} from 'lucide-react';

interface SidebarProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  onViewReport: () => void;
  isReportView: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ state, dispatch, onViewReport, isReportView }) => {
  const { currentStageId, sidebarCollapsed, stages, investorMode } = state;

  const calculateOverallScore = () => {
    const stageArray = Object.values(stages) as StageState[];
    const scores = stageArray
      .filter(s => s.evaluation !== undefined)
      .map(s => s.evaluation!.score);
    
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return (sum / scores.length).toFixed(1);
  };

  const overallScore = calculateOverallScore();

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    if (score >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  const handleClearProgress = () => {
    if (confirm("Are you sure you want to delete all your answers and evaluations? This cannot be undone.")) {
      localStorage.removeItem('thinkshow_investor_readiness_v1');
      window.location.reload();
    }
  };

  return (
    <div 
      className={`h-screen transition-all duration-300 flex flex-col border-r border-gray-800 bg-[#0F0F1A] z-50 ${
        sidebarCollapsed ? 'w-16' : 'w-56 lg:w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <Target className="text-[#D4A843] w-6 h-6" />
            <span className="font-mono font-bold text-sm tracking-tighter gold-gradient">THINKSHOW</span>
          </div>
        )}
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="p-1.5 hover:bg-gray-800 rounded-md transition-colors ml-auto text-gray-400"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Investor Mode Selector */}
      {!sidebarCollapsed && !isReportView && (
        <div className="p-4 animate-in fade-in duration-500">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2 block">
            Investor Lens
          </label>
          <select 
            value={investorMode}
            onChange={(e) => dispatch({ type: 'SET_INVESTOR_MODE', mode: e.target.value as InvestorMode })}
            className="w-full bg-[#0A0A0F] border border-gray-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#D4A843] transition-colors"
          >
            {Object.values(InvestorMode).map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Options */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <div className="mb-2">
          <button
            onClick={() => {
              if (isReportView) onViewReport();
            }}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
              !isReportView ? 'bg-gray-800/50 text-[#D4A843]' : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <CheckCircle2 size={18} />
            {!sidebarCollapsed && <span className="text-xs font-mono uppercase tracking-widest">Assessment</span>}
          </button>
        </div>

        {STAGES.map((stage) => {
          const stageState = stages[stage.id];
          const hasEvaluation = !!stageState?.evaluation;
          const isCurrent = currentStageId === stage.id && !isReportView;
          
          return (
            <button
              key={stage.id}
              onClick={() => {
                if (isReportView) onViewReport();
                dispatch({ type: 'SET_CURRENT_STAGE', id: stage.id });
              }}
              className={`w-full group flex items-center gap-3 p-2 rounded-lg transition-all ${
                isCurrent 
                  ? 'bg-gradient-to-r from-gray-800 to-transparent border-l-2 border-[#D4A843]' 
                  : 'hover:bg-gray-900 border-l-2 border-transparent'
              }`}
            >
              <div className="flex-shrink-0">
                {hasEvaluation ? (
                  <CheckCircle2 size={18} className="text-[#D4A843]" />
                ) : (
                  <Circle size={18} className="text-gray-600 group-hover:text-gray-400" />
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col items-start overflow-hidden">
                  <span className={`text-xs font-medium truncate w-full text-left ${isCurrent ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {stage.title}
                  </span>
                  {hasEvaluation && (
                    <span className={`text-[10px] font-mono ${getScoreColor(stageState.evaluation!.score)}`}>
                      Score: {stageState.evaluation!.score}/10
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        <div className="mt-6 pt-4 border-t border-gray-800/50">
          <button
            onClick={onViewReport}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
              isReportView ? 'bg-[#D4A843]/10 text-[#D4A843]' : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <FileText size={18} />
            {!sidebarCollapsed && <span className="text-xs font-mono uppercase tracking-widest">Master Report</span>}
          </button>
        </div>
      </div>

      {/* Footer Overall Score */}
      <div className="p-4 border-t border-gray-800 bg-[#0A0A0F]/50">
        <div className="flex items-center justify-between mb-2">
          {!sidebarCollapsed && (
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
              Overall Readiness
            </span>
          )}
          <TrendingUp size={16} className="text-[#D4A843]" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-mono font-bold text-white">{overallScore}</span>
          {!sidebarCollapsed && <span className="text-xs text-gray-500">/ 10</span>}
        </div>
        {!sidebarCollapsed && (
          <div className="mt-2 w-full bg-gray-800 h-1 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full gold-bg-gradient transition-all duration-1000"
              style={{ width: `${Number(overallScore) * 10}%` }}
            />
          </div>
        )}
        {!sidebarCollapsed && (
          <button 
            onClick={handleClearProgress}
            className="flex items-center gap-2 text-[10px] font-mono text-red-500/50 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            <Trash2 size={12} /> Clear All Data
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
