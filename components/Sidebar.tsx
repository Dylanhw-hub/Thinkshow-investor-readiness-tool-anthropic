
import React from 'react';
import { AppState, Action, InvestorMode, StageState } from '../types';
import { STAGES } from '../constants';
import { 
  LayoutDashboard, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  Target
} from 'lucide-react';

interface SidebarProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Sidebar: React.FC<SidebarProps> = ({ state, dispatch }) => {
  const { currentStageId, sidebarCollapsed, stages, investorMode } = state;

  const calculateOverallScore = () => {
    // Fix: Explicitly cast to StageState[] to avoid "unknown" type errors in filter/map
    const scores = (Object.values(stages) as StageState[])
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

  return (
    <div 
      className={`h-screen transition-all duration-300 flex flex-col border-r border-gray-800 bg-[#0F0F1A] ${
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
          className="p-1.5 hover:bg-gray-800 rounded-md transition-colors ml-auto"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Investor Mode Selector */}
      {!sidebarCollapsed && (
        <div className="p-4">
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

      {/* Stages List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {STAGES.map((stage) => {
          const stageState = stages[stage.id];
          const hasEvaluation = !!stageState?.evaluation;
          const isCurrent = currentStageId === stage.id;
          
          return (
            <button
              key={stage.id}
              onClick={() => dispatch({ type: 'SET_CURRENT_STAGE', id: stage.id })}
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
          <div className="mt-2 w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full gold-bg-gradient transition-all duration-1000"
              style={{ width: `${Number(overallScore) * 10}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
