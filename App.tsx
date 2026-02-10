
import React, { useReducer } from 'react';
import Sidebar from './components/Sidebar';
import StageView from './components/StageView';
import { AppState, Action, InvestorMode } from './types';
import { STAGES } from './constants';
import { Search } from 'lucide-react';

const initialState: AppState = {
  currentStageId: 1,
  investorMode: InvestorMode.STANDARD,
  sidebarCollapsed: false,
  stages: {},
  isEvaluating: false
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_CURRENT_STAGE':
      return { ...state, currentStageId: action.id };
    case 'SET_INVESTOR_MODE':
      return { ...state, investorMode: action.mode };
    case 'SET_ANSWER':
      return {
        ...state,
        stages: {
          ...state.stages,
          [action.stageId]: {
            ...state.stages[action.stageId],
            answers: {
              ...state.stages[action.stageId]?.answers,
              [action.questionId]: action.value
            }
          }
        }
      };
    case 'SET_EVALUATION':
      return {
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
    case 'SKIP_STAGE':
      return {
        ...state,
        stages: {
          ...state.stages,
          [action.stageId]: {
            ...state.stages[action.stageId],
            isSkipped: true
          }
        }
      };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_EVALUATING':
      return { ...state, isEvaluating: action.status };
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const currentStage = STAGES.find(s => s.id === state.currentStageId) || STAGES[0];

  return (
    <div className="flex min-h-screen">
      <Sidebar state={state} dispatch={dispatch} />
      
      <main className="flex-1 h-screen overflow-y-auto relative">
        {/* Top bar */}
        <div className="sticky top-0 z-50 px-8 py-4 bg-[#0A0A0F]/80 backdrop-blur-md flex items-center justify-between border-b border-gray-800/50">
          <div className="flex items-center gap-4">
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[#D4A843] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search frameworks..." 
                 className="bg-gray-900 border border-gray-800 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-[#D4A843] w-48 transition-all focus:w-64"
               />
             </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-gray-500">
             <span>Market Status: <span className="text-green-500">Volatile</span></span>
             <span className="w-px h-3 bg-gray-800"></span>
             <span>Network: <span className="text-white">Active</span></span>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="pb-32">
          <StageView stage={currentStage} state={state} dispatch={dispatch} />
        </div>
        
        {/* Background Accents */}
        <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-[#D4A843] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-[#D4A843] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      </main>
    </div>
  );
};

export default App;
