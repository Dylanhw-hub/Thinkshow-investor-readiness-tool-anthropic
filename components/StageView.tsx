
import React, { useState, useRef, useEffect } from 'react';
import { Stage, AppState, Action, AIMode } from '../types';
import { evaluateStage, refineDraft, consultOnPoint, coachMe, coachDraftAnswer } from '../services/gemini';
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BrainCircuit,
  Info,
  Target,
  Zap,
  BarChart3,
  ArrowUpRight,
  ShieldAlert,
  Globe,
  Mic,
  Square,
  Sparkles,
  Shield,
  MessageCircle,
  PenTool
} from 'lucide-react';

interface StageViewProps {
  stage: Stage;
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StageView: React.FC<StageViewProps> = ({ stage, state, dispatch }) => {
  const stageState = state.stages[stage.id] || { answers: {}, isSkipped: false };
  const { answers, evaluation } = stageState;
  const { isEvaluating } = state;
  
  // Voice State
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [activeQId, setActiveQId] = useState<string | null>(null);
  const [interimText, setInterimText] = useState("");

  // Feedback Enhancement State
  const [expandedFeedback, setExpandedFeedback] = useState<{
    type: 'fix' | 'flag' | 'question';
    index: number;
    content: string;
    isLoading: boolean;
  } | null>(null);
  const [feedbackCache, setFeedbackCache] = useState<Record<string, string>>({});

  // AI Mode State
  const [aiMode, setAiMode] = useState<AIMode>('coach');

  // Coach State
  const [coachPanel, setCoachPanel] = useState<{
    questionId: string;
    content: string;
    isLoading: boolean;
    type: 'help' | 'draft';
  } | null>(null);
  const [coachCache, setCoachCache] = useState<Record<string, string>>({});

  const recognitionRef = useRef<any>(null);
  const answersRef = useRef(answers);
  const activeQIdRef = useRef<string | null>(null);
  const interimTextRef = useRef("");

  // Sync refs with state to avoid stale closures in recognition callbacks
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    activeQIdRef.current = activeQId;
  }, [activeQId]);

  useEffect(() => {
    interimTextRef.current = interimText;
  }, [interimText]);

  const handleAnswerChange = (qId: string, value: string) => {
    dispatch({ type: 'SET_ANSWER', stageId: stage.id, questionId: qId, value });
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-ZA'; 

      recognition.onresult = (event: any) => {
        const qId = activeQIdRef.current;
        if (!qId) return;

        let finalBatch = '';
        let interimBatch = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalBatch += event.results[i][0].transcript;
          } else {
            interimBatch += event.results[i][0].transcript;
          }
        }

        setInterimText(interimBatch);

        if (finalBatch) {
          const currentText = answersRef.current[qId] || '';
          const space = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
          handleAnswerChange(qId, currentText + space + finalBatch.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        stopRecording();
      };

      recognition.onend = () => {
        // Final safety check: if there's leftover interim text when the mic closes, commit it.
        const qId = activeQIdRef.current;
        const leftover = interimTextRef.current;
        if (qId && leftover) {
          const currentText = answersRef.current[qId] || '';
          const space = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
          handleAnswerChange(qId, currentText + space + leftover.trim());
        }
        
        setIsRecordingActive(false);
        setActiveQId(null);
        setInterimText("");
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = (qId: string) => {
    if (recognitionRef.current) {
      try {
        setActiveQId(qId);
        setIsRecordingActive(true);
        recognitionRef.current.start();
      } catch (e) {
        console.error("Recognition already started", e);
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      // Note: onend will handle the cleanup of states
    }
  };

  const toggleRecording = (qId: string) => {
    if (activeQId === qId) {
      stopRecording();
    } else {
      if (activeQId) stopRecording();
      setTimeout(() => startRecording(qId), 100);
    }
  };

  const handleShowMe = async (
    type: 'fix' | 'flag' | 'question',
    index: number,
    itemText: string
  ) => {
    const cacheKey = `${type}-${index}`;

    // If already cached, just show it
    if (feedbackCache[cacheKey]) {
      setExpandedFeedback({ type, index, content: feedbackCache[cacheKey], isLoading: false });
      return;
    }

    // Show loading state
    setExpandedFeedback({ type, index, content: '', isLoading: true });

    try {
      let result: string;

      if (type === 'question') {
        // For investor questions, use refineDraft to draft an answer
        const bestAnswer = Object.values(answers).sort((a, b) => b.length - a.length)[0] || '';
        result = await refineDraft(itemText, bestAnswer, state.investorMode);
      } else {
        // For fixes and flags, use consultOnPoint for deeper explanation
        const context = Object.entries(answers)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n');
        result = await consultOnPoint(
          type === 'fix' ? 'Required Fix' : 'Red Flag',
          itemText,
          context
        );
      }

      setFeedbackCache(prev => ({ ...prev, [cacheKey]: result }));
      setExpandedFeedback({ type, index, content: result, isLoading: false });
    } catch (e) {
      setExpandedFeedback({ type, index, content: 'Failed to generate. Try again.', isLoading: false });
    }
  };

  const handleCoachHelp = async (questionId: string, questionText: string) => {
    const cacheKey = `help-${questionId}-${(answers[questionId] || '').length}`;

    if (coachCache[cacheKey]) {
      setCoachPanel({ questionId, content: coachCache[cacheKey], isLoading: false, type: 'help' });
      return;
    }

    setCoachPanel({ questionId, content: '', isLoading: true, type: 'help' });

    try {
      const result = await coachMe(questionText, answers[questionId] || '', stage.title);
      setCoachCache(prev => ({ ...prev, [cacheKey]: result }));
      setCoachPanel({ questionId, content: result, isLoading: false, type: 'help' });
    } catch (e) {
      setCoachPanel({ questionId, content: 'Coach unavailable. Try again.', isLoading: false, type: 'help' });
    }
  };

  const handleCoachDraft = async (questionId: string, questionText: string) => {
    const cacheKey = `draft-${questionId}-${(answers[questionId] || '').length}`;

    if (coachCache[cacheKey]) {
      setCoachPanel({ questionId, content: coachCache[cacheKey], isLoading: false, type: 'draft' });
      return;
    }

    setCoachPanel({ questionId, content: '', isLoading: true, type: 'draft' });

    try {
      const result = await coachDraftAnswer(questionText, answers[questionId] || '', stage.title);
      setCoachCache(prev => ({ ...prev, [cacheKey]: result }));
      setCoachPanel({ questionId, content: result, isLoading: false, type: 'draft' });
    } catch (e) {
      setCoachPanel({ questionId, content: 'Draft generation failed. Try again.', isLoading: false, type: 'draft' });
    }
  };

  const handleUseDraft = (questionId: string, draftText: string) => {
    handleAnswerChange(questionId, draftText);
    setCoachPanel(null);
  };

  const handleSubmit = async () => {
    const allAnswersFilled = stage.questions.every(q => (answers[q.id]?.length || 0) >= 10);
    if (!allAnswersFilled) {
      alert("Please provide more detail for each question before submitting.");
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

  const cleanText = (text: string) => {
    return text.replace(/\*\*|###|#/g, '').trim();
  };

  const CoachExpander = ({
    content,
    isLoading,
    type,
    questionId,
    onClose,
    onUseDraft
  }: {
    content: string;
    isLoading: boolean;
    type: 'help' | 'draft';
    questionId: string;
    onClose: () => void;
    onUseDraft?: (qId: string, text: string) => void;
  }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <div className="mt-3 bg-[#0A1A0F] border-l-2 border-green-500/30 rounded-r-lg p-4 animate-in slide-in-from-top-2 duration-300">
        {isLoading ? (
          <div className="flex items-center gap-2 text-green-500/70 text-sm">
            <Loader2 size={14} className="animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              {type === 'draft' ? 'Drafting answer...' : 'Thinking...'}
            </span>
          </div>
        ) : (
          <>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-800/50">
              <button
                onClick={handleCopy}
                className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-green-400 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy text'}
              </button>
              {type === 'draft' && onUseDraft && (
                <button
                  onClick={() => onUseDraft(questionId, content)}
                  className="text-[10px] font-mono uppercase tracking-widest text-green-500 hover:text-green-400 transition-colors border border-green-500/30 px-2 py-1 rounded"
                >
                  Use This Draft
                </button>
              )}
              <button
                onClick={onClose}
                className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const FeedbackExpander = ({ content, isLoading, onClose }: { content: string; isLoading: boolean; onClose: () => void }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <div className="mt-3 bg-[#0F0F1A] border-l-2 border-[#D4A843]/30 rounded-r-lg p-4 animate-in slide-in-from-top-2 duration-300">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 size={14} className="animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Generating suggestion...</span>
          </div>
        ) : (
          <>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-800/50">
              <button
                onClick={handleCopy}
                className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-[#D4A843] transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy text'}
              </button>
              <button
                onClick={onClose}
                className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const formatStructuredFeedback = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const upperLine = line.toUpperCase();
      
      if (upperLine.includes('OBJECTION:')) {
        return (
          <div key={idx} className="mt-6 p-4 bg-red-500/5 border-l-2 border-red-500 rounded-r-lg">
            <div className="flex items-center gap-2 text-red-400 font-mono text-[10px] uppercase tracking-widest mb-1">
              <ShieldAlert size={12} /> Objection
            </div>
            <p className="text-gray-200 text-base leading-relaxed">{cleanText(line.replace(/.*OBJECTION:/i, ''))}</p>
          </div>
        );
      }
      if (upperLine.includes('BENCHMARK:')) {
        return (
          <div key={idx} className="mt-2 p-4 bg-blue-500/5 border-l-2 border-blue-500 rounded-r-lg">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] uppercase tracking-widest mb-1">
              <BarChart3 size={12} /> Benchmark
            </div>
            <p className="text-gray-300 text-sm italic leading-relaxed">{cleanText(line.replace(/.*BENCHMARK:/i, ''))}</p>
          </div>
        );
      }
      if (upperLine.includes('CONSEQUENCE:')) {
        return (
          <div key={idx} className="mt-2 p-4 bg-orange-500/5 border-l-2 border-orange-500 rounded-r-lg">
            <div className="flex items-center gap-2 text-orange-400 font-mono text-[10px] uppercase tracking-widest mb-1">
              <Zap size={12} /> Consequence
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{cleanText(line.replace(/.*CONSEQUENCE:/i, ''))}</p>
          </div>
        );
      }
      if (upperLine.includes('FIX:')) {
        const fixText = cleanText(line.replace(/.*FIX:/i, ''));
        return (
          <div key={idx}>
            <div className="mt-2 mb-4 p-4 bg-green-500/10 border-l-2 border-green-500 rounded-r-lg shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase tracking-widest mb-1">
                    <ArrowUpRight size={12} /> Recommended Fix
                  </div>
                  <p className="text-white font-medium leading-relaxed">{fixText}</p>
                </div>
                <button
                  onClick={() => handleShowMe('fix', 100 + idx, fixText)}
                  className="shrink-0 mt-1 text-[10px] font-mono uppercase tracking-widest text-green-500/50 hover:text-green-400 transition-colors px-2 py-1 border border-transparent hover:border-green-500/30 rounded"
                >
                  {expandedFeedback?.type === 'fix' && expandedFeedback?.index === (100 + idx) && expandedFeedback?.isLoading
                    ? '...'
                    : 'Show Me'}
                </button>
              </div>
            </div>
            {expandedFeedback?.type === 'fix' && expandedFeedback?.index === (100 + idx) && (
              <FeedbackExpander
                content={expandedFeedback.content}
                isLoading={expandedFeedback.isLoading}
                onClose={() => setExpandedFeedback(null)}
              />
            )}
          </div>
        );
      }
      
      const trimmedLine = cleanText(line);
      return trimmedLine ? <p key={idx} className="text-gray-400 my-4 leading-relaxed font-medium">{trimmedLine}</p> : null;
    });
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
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 gold-gradient tracking-tight">
            {stage.title}
          </h1>
          {evaluation && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-full">
              <Globe size={10} className="text-green-500" />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">ZA Calibrated</span>
            </div>
          )}
        </div>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
          {stage.description}
        </p>
      </div>

      {/* AI Mode Toggle */}
      <div className="mt-8 flex items-center gap-2 p-1 bg-[#0F0F1A] rounded-xl border border-gray-800 w-fit">
        <button
          onClick={() => setAiMode('coach')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
            aiMode === 'coach'
              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
              : 'text-gray-500 hover:text-gray-300 border border-transparent'
          }`}
        >
          <Sparkles size={14} /> Coach Me
        </button>
        <button
          onClick={() => setAiMode('investor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
            aiMode === 'investor'
              ? 'bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/30'
              : 'text-gray-500 hover:text-gray-300 border border-transparent'
          }`}
        >
          <Shield size={14} /> Investor Mode
        </button>
      </div>

      <div className="space-y-16">
        {stage.questions.map((q) => {
          const charCount = (answers[q.id] || '').length;
          const isEnough = charCount >= 50;
          const isCurrentRecording = activeQId === q.id;

          return (
            <div key={q.id} className="group relative">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors flex items-center gap-2">
                  {q.text}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleRecording(q.id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all shadow-lg ${
                      isCurrentRecording 
                        ? 'bg-red-600 text-white ring-4 ring-red-500/20' 
                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {isCurrentRecording ? <Square size={12} fill="currentColor" /> : <Mic size={12} />}
                    {isCurrentRecording ? 'Stop Recording' : 'Voice Dictate'}
                  </button>
                  <div className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${isEnough ? 'bg-green-500/10 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                    {charCount} chars
                  </div>
                </div>
              </div>

              {q.jargonBuster && (
                <div className="mb-4 p-3 bg-gray-900/50 border border-gray-800/50 rounded-lg flex gap-3 items-start group/insight hover:border-[#D4A843]/30 transition-colors">
                  <Info size={14} className="text-[#D4A843] mt-0.5 shrink-0" />
                  <p className="text-[11px] font-mono text-gray-500 leading-relaxed group-hover/insight:text-gray-300">
                    <span className="text-[#D4A843]/70 font-bold mr-1 uppercase">Investor Insight:</span>
                    {q.jargonBuster}
                  </p>
                </div>
              )}

              <div className="relative">
                {/* Visual Interim Results Overlay */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6 text-lg leading-relaxed z-10 overflow-hidden">
                  <span className="text-transparent opacity-0">{(answers[q.id] || '')} </span>
                  <span className="text-gray-500 italic">{isCurrentRecording ? interimText : ''}</span>
                </div>
                
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder={isCurrentRecording ? 'Speak now... I am listening' : q.placeholder}
                  className={`w-full h-40 bg-[#0F0F1A] border rounded-xl p-6 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4A843]/20 transition-all resize-y shadow-inner text-lg leading-relaxed ${
                    isCurrentRecording ? 'border-red-500 ring-4 ring-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-gray-800 focus:border-[#D4A843]'
                  }`}
                />
                
                {isCurrentRecording && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold">Live Audio</span>
                  </div>
                )}
              </div>

              {/* Coach Buttons — only visible in coach mode */}
              {aiMode === 'coach' && (
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleCoachHelp(q.id, q.text)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest text-green-500/60 hover:text-green-400 border border-green-500/20 hover:border-green-500/40 transition-all"
                  >
                    <MessageCircle size={12} />
                    {coachPanel?.questionId === q.id && coachPanel?.type === 'help' && coachPanel?.isLoading
                      ? 'Thinking...'
                      : 'Help Me With This'}
                  </button>
                  <button
                    onClick={() => handleCoachDraft(q.id, q.text)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest text-green-500/60 hover:text-green-400 border border-green-500/20 hover:border-green-500/40 transition-all"
                  >
                    <PenTool size={12} />
                    {coachPanel?.questionId === q.id && coachPanel?.type === 'draft' && coachPanel?.isLoading
                      ? 'Drafting...'
                      : 'Draft Answer For Me'}
                  </button>
                </div>
              )}

              {/* Coach Response Panel */}
              {coachPanel?.questionId === q.id && (
                <CoachExpander
                  content={coachPanel.content}
                  isLoading={coachPanel.isLoading}
                  type={coachPanel.type}
                  questionId={q.id}
                  onClose={() => setCoachPanel(null)}
                  onUseDraft={coachPanel.type === 'draft' ? handleUseDraft : undefined}
                />
              )}
            </div>
          );
        })}
      </div>

      {evaluation && (
        <div className="mt-16 border-t border-gray-800 pt-16 space-y-12 animate-in zoom-in-95 duration-700">
          {/* Mode reminder */}
          {aiMode === 'coach' && (
            <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg mb-6">
              <Sparkles size={14} className="text-green-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-green-400/70">
                Coach mode is active — use the coaching tools on each question above to improve your answers, then re-evaluate
              </span>
            </div>
          )}

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
                <AlertTriangle size={16} /> Critical Red Flags
              </h4>
              <ul className="space-y-3">
                {evaluation.redFlags.map((flag, i) => (
                  <li key={i}>
                    <div className="text-gray-400 text-sm flex gap-3 items-start">
                      <span className="text-red-500/50 mt-0.5">•</span>
                      <span className="flex-1">{flag}</span>
                      <button
                        onClick={() => handleShowMe('flag', i, flag)}
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-gray-600 hover:text-red-400 transition-colors px-2 py-1 border border-transparent hover:border-gray-700 rounded"
                      >
                        {expandedFeedback?.type === 'flag' && expandedFeedback?.index === i && expandedFeedback?.isLoading
                          ? '...'
                          : 'Tell Me More'}
                      </button>
                    </div>
                    {expandedFeedback?.type === 'flag' && expandedFeedback?.index === i && (
                      <FeedbackExpander
                        content={expandedFeedback.content}
                        isLoading={expandedFeedback.isLoading}
                        onClose={() => setExpandedFeedback(null)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-2xl p-6">
              <h4 className="text-[#D4A843] font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <BrainCircuit size={16} /> Strategy Interrogation
              </h4>
              <ul className="space-y-3">
                {evaluation.investorQuestions.map((q, i) => (
                  <li key={i}>
                    <div className="text-gray-400 text-sm flex gap-3 items-start">
                      <span className="text-[#D4A843]/50 mt-0.5">?</span>
                      <span className="flex-1">{q}</span>
                      <button
                        onClick={() => handleShowMe('question', i, q)}
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-gray-600 hover:text-[#D4A843] transition-colors px-2 py-1 border border-transparent hover:border-gray-700 rounded"
                      >
                        {expandedFeedback?.type === 'question' && expandedFeedback?.index === i && expandedFeedback?.isLoading
                          ? '...'
                          : 'Draft Answer'}
                      </button>
                    </div>
                    {expandedFeedback?.type === 'question' && expandedFeedback?.index === i && (
                      <FeedbackExpander
                        content={expandedFeedback.content}
                        isLoading={expandedFeedback.isLoading}
                        onClose={() => setExpandedFeedback(null)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-gray-200 font-mono text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Target size={16} className="text-[#D4A843]" /> Evidence-Based Analysis (ZA Context)
            </h4>
            <div className="space-y-1">
              {formatStructuredFeedback(evaluation.detailedFeedback)}
            </div>
          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
            <h4 className="text-yellow-500 font-mono text-sm uppercase tracking-widest mb-4">Strategic Correction Roadmap</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluation.requiredFixes.map((fix, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 p-3 bg-black/20 rounded-lg">
                    <CheckCircle size={16} className="text-yellow-500/50 mt-1 shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-300 text-sm leading-snug">{fix}</span>
                    </div>
                    <button
                      onClick={() => handleShowMe('fix', i, fix)}
                      className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-gray-600 hover:text-[#D4A843] transition-colors px-2 py-1 border border-transparent hover:border-gray-700 rounded"
                    >
                      {expandedFeedback?.type === 'fix' && expandedFeedback?.index === i && expandedFeedback?.isLoading
                        ? '...'
                        : 'Show Me'}
                    </button>
                  </div>
                  {expandedFeedback?.type === 'fix' && expandedFeedback?.index === i && (
                    <FeedbackExpander
                      content={expandedFeedback.content}
                      isLoading={expandedFeedback.isLoading}
                      onClose={() => setExpandedFeedback(null)}
                    />
                  )}
                </div>
              ))}
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
          {evaluation ? 'Continue to Next Stage' : 'Skip Stage'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isEvaluating}
          className="px-10 py-4 rounded-xl font-bold gold-bg-gradient text-black flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isEvaluating ? (
            <>
              <Loader2 className="animate-spin" />
              Processing Evaluation...
            </>
          ) : (
            <>
              {evaluation ? 'Re-Evaluate' : 'Submit for Evaluation'}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StageView;
