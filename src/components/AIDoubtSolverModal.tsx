import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  Copy,
  Check,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Coins,
  Cpu,
  Users
} from 'lucide-react';
import { Problem } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

interface AIDoubtSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProblemContext?: Problem | null;
  onOpenPostProblem?: () => void;
}

export const AIDoubtSolverModal: React.FC<AIDoubtSolverModalProps> = ({
  isOpen,
  onClose,
  activeProblemContext,
  onOpenPostProblem,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Hello! I'm the **ProblemBridge AI Assistant** powered by Gemini 3.8 Flash. 

I can clear any doubts you have about:
- **Posting Problems**: How organizations & students post operational challenges.
- **Honorarium & Budgets**: Milestone disbursements and sensor reimbursements.
- **Applying as a Builder**: How to write winning architecture proposals & form teams.
- **Tech Stack & Hardware**: Sensors, ESP32, React, Raspberry Pi, and field requirements.

What would you like to know?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { text: 'How do I post a problem challenge?', icon: Lightbulb },
    { text: 'How are builder honorariums paid?', icon: Coins },
    { text: 'What hardware/sensors are provided?', icon: Cpu },
    { text: 'Can students apply as a team?', icon: Users },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          problemContext: activeProblemContext
            ? {
                title: activeProblemContext.title,
                domain: activeProblemContext.domain,
                budget: activeProblemContext.budget,
                deliverableType: activeProblemContext.deliverableType,
                organization: activeProblemContext.organization,
              }
            : undefined,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error(`Server returned ${response.status} or static route`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'I am ready to help clear any questions about ProblemBridge.',
        timestamp: 'Just now',
        source: data.source,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('AI Doubt Solver error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `**Here's what you need to know about ProblemBridge:**\n\n- **Posting Problems:** Any registered user can click "+ Post Problem" to post a real challenge with a target honorarium.\n- **Solving Problems:** Builders browse challenges, review acceptance criteria, and submit an architecture proposal with timeline and stack.\n- **Support:** Problem owners provide facility access and test hardware for rapid validation.`,
        timestamp: 'Just now',
        source: 'local_kb',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E8E7F3] animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B4FE9] to-[#8B7FF5] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-semibold text-[#14162B]">
                  ProblemBridge AI
                </h3>
                <span className="text-[10px] font-bold text-[#5B4FE9] bg-[#EFEDFC] px-1.5 py-0.5 rounded-md">
                  Doubt Solver
                </span>
              </div>
              <p className="text-xs text-[#8B8DA3]">
                Ask questions about challenges, honorariums, or posting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
            aria-label="Close AI Doubt Solver"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Context Banner if inspecting a problem */}
        {activeProblemContext && (
          <div className="px-4 py-2 bg-[#EFEDFC]/80 border-b border-[#D6D4EA] flex items-center justify-between text-xs text-[#5B4FE9]">
            <span className="truncate">
              Focus: <strong>{activeProblemContext.title}</strong> (₹{activeProblemContext.budget.toLocaleString('en-IN')})
            </span>
            <span className="text-[10px] font-medium text-[#4A4C63]">Context active</span>
          </div>
        )}

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF9]/40">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#5B4FE9] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#5B4FE9] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-[#14162B] border border-[#E8E7F3] rounded-bl-xs shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.text.split('\n\n').map((para, idx) => (
                      <p key={idx}>
                        {para.split('**').map((chunk, cIdx) =>
                          cIdx % 2 === 1 ? (
                            <strong key={cIdx} className={isUser ? 'text-white' : 'text-[#14162B]'}>
                              {chunk}
                            </strong>
                          ) : (
                            chunk
                          )
                        )}
                      </p>
                    ))}
                  </div>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-[#E8E7F3]/60 flex items-center justify-between text-[11px] text-[#8B8DA3]">
                      <span>{msg.source === 'gemini' ? 'AI Grounded' : 'Platform Knowledge'}</span>
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="hover:text-[#5B4FE9] flex items-center gap-1 transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#1FAE7C]" />
                            <span className="text-[#1FAE7C]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#14162B] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#8B8DA3] p-3 bg-white rounded-xl border border-[#E8E7F3] w-max">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5B4FE9]" />
              <span>ProblemBridge AI is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-white border-t border-[#E8E7F3] overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 w-max">
            {suggestedQuestions.map((q, idx) => {
              const Icon = q.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAFAF9] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] border border-[#E8E7F3] transition-colors whitespace-nowrap text-[#4A4C63]"
                >
                  <Icon className="w-3 h-3 text-[#5B4FE9]" />
                  <span>{q.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#FAFAF9] border-t border-[#E8E7F3] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask any doubt about ProblemBridge, honorariums, tech..."
            disabled={isLoading}
            className="flex-1 bg-white border border-[#E8E7F3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#5B4FE9] focus:ring-2 focus:ring-[#5B4FE9]/10 text-[#14162B] placeholder:text-[#8B8DA3]"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#5B4FE9] text-white hover:bg-[#4C40DC] disabled:opacity-50 transition-colors shadow-xs shrink-0 flex items-center justify-center"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
