
import React, { useReducer, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import StageView from './components/StageView';
import ReportView from './components/ReportView';
import { AppState, Action, InvestorMode } from './types';
import { STAGES } from './constants';
import { Search, FileText, ChevronLeft } from 'lucide-react';

const STORAGE_KEY = 'thinkshow_investor_readiness_v1';

const initialState: AppState = {
  currentStageId: 1,
  investorMode: InvestorMode.STANDARD,
  sidebarCollapsed: false,
  stages: {},
  isEvaluating: false
};

function reducer(state: AppState, action: Action): AppState {
  let newState: AppState;
  switch (action.type) {
    case 'SET_CURRENT_STAGE':
      newState = { ...state, currentStageId: action.id };
      break;
    case 'SET_INVESTOR_MODE':
      newState = { ...state, investorMode: action.mode };
      break;
    case 'SET_ANSWER':
      newState = {
        ...state,
        stages: {
          ...state.stages,
          [action.stageId]: {
            ...state.stages[action.stageId],
            answers: {
              ...state.stages[action.stageId]?.answers,
              [action.questionId]: action.value
            },
            isSkipped: false
          }
        }
      };
      break;
    case 'SET_EVALUATION':
      newState = {
        ...state,
        stages: {
          ...state.stages,
          [action.stageId]: {
            ...state.stages[action.stageId],
            evaluation: action.result,
            isSkipped: false
          }
        }
      };
      break;
    case 'SKIP_STAGE':
      newState = {
        ...state,
        stages: {
          ...state.stages,
          [action.stageId]: {
            ...state.stages[action.stageId],
            isSkipped: true
          }
        }
      };
      break;
    case 'TOGGLE_SIDEBAR':
      newState = { ...state, sidebarCollapsed: !state.sidebarCollapsed };
      break;
    case 'SET_EVALUATING':
      newState = { ...state, isEvaluating: action.status };
      break;
    default:
      return state;
  }
  
  // Save to localStorage on every state change
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

const App: React.FC = () => {
  // Initialize state from localStorage if available
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure we reset transient states like isEvaluating
        return { ...parsed, isEvaluating: false };
      } catch (e) {
        return initial;
      }
    }
    return initial;
  });

  const [view, setView] = useState<'assessment' | 'report'>('assessment');
  const currentStage = STAGES.find(s => s.id === state.currentStageId) || STAGES[0];

  const toggleView = () => setView(prev => prev === 'assessment' ? 'report' : 'assessment');

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        state={state} 
        dispatch={dispatch} 
        onViewReport={toggleView} 
        isReportView={view === 'report'}
      />
      
      <main className="flex-1 h-screen overflow-y-auto relative bg-[#0A0A0F]">
        {/* Top bar */}
        <div className="sticky top-0 z-50 px-8 py-4 bg-[#0A0A0F]/80 backdrop-blur-md flex items-center justify-between border-b border-gray-800/50">
          <div className="flex items-center gap-4">
            {view === 'report' ? (
              <button 
                onClick={toggleView}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4A843] transition-colors font-mono uppercase tracking-widest"
              >
                <ChevronLeft size={16} /> Back to Assessment
              </button>
            ) : (
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[#D4A843] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search frameworks..." 
                  className="bg-gray-900 border border-gray-800 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-[#D4A843] w-48 transition-all focus:w-64"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-gray-500 hidden md:flex">
               <span>Autosave: <span className="text-green-500">Cloud Ready</span></span>
               <span className="w-px h-3 bg-gray-800"></span>
               <span>Mode: <span className="text-white">{state.investorMode}</span></span>
            </div>
            <button 
              onClick={toggleView}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                view === 'report' 
                  ? 'bg-[#D4A843] text-black border-[#D4A843]' 
                  : 'bg-gray-900 text-gray-300 border-gray-800 hover:border-[#D4A843]'
              }`}
            >
              <FileText size={14} /> {view === 'report' ? 'Viewing Report' : 'Master Report'}
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="pb-32">
          {view === 'assessment' ? (
            <StageView stage={currentStage} state={state} dispatch={dispatch} />
          ) : (
            <ReportView state={state} />
          )}
        </div>
        
        {/* Background Accents */}
        <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-[#D4A843] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-[#D4A843] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      </main>
    </div>
  );
};

export default App;
