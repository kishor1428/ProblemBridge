import React, { useState, useRef, useEffect } from 'react';
import { ChatThread } from '../types';
import { X, Send, Search, MessageSquare, Check, UserCheck, Sparkles } from 'lucide-react';

interface MessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
}

export const MessagesDrawer: React.FC<MessagesDrawerProps> = ({
  isOpen,
  onClose,
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [threadSearch, setThreadSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, currentThread?.messages]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentThread) return;
    onSendMessage(currentThread.id, inputText.trim());
    setInputText('');
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.counterpartName.toLowerCase().includes(threadSearch.toLowerCase()) ||
      t.problemTitle.toLowerCase().includes(threadSearch.toLowerCase()) ||
      t.counterpartOrg.toLowerCase().includes(threadSearch.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E8E7F3] animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-[#14162B] leading-tight">
                Discussions & Mentor Chats
              </h3>
              <p className="text-xs text-[#8B8DA3]">
                Collaborate with industry problem owners and builders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
            aria-label="Close messages drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Threads Strip */}
        <div className="p-2.5 bg-white border-b border-[#E8E7F3] flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#8B8DA3] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={threadSearch}
              onChange={(e) => setThreadSearch(e.target.value)}
              placeholder="Search chats by mentor or problem..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#E8E7F3] bg-[#FAFAF9] outline-none focus:bg-white focus:border-[#5B4FE9]"
            />
          </div>
        </div>

        {/* Thread Selector Strip (Horizontal Pill Tabs) */}
        <div className="flex border-b border-[#E8E7F3] bg-[#FAFAF9]/50 overflow-x-auto scrollbar-none p-2 gap-1.5">
          {filteredThreads.map((thread) => {
            const isSelected = currentThread?.id === thread.id;
            return (
              <button
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#5B4FE9] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#4A4C63] border border-[#E8E7F3] hover:border-[#5B4FE9]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isSelected ? 'bg-white text-[#5B4FE9]' : 'bg-[#EFEDFC] text-[#5B4FE9]'
                  }`}
                >
                  {thread.counterpartAvatar}
                </span>
                <span className="truncate max-w-[130px]">{thread.counterpartName}</span>
              </button>
            );
          })}
        </div>

        {currentThread ? (
          <>
            {/* Active Thread Meta Card */}
            <div className="px-4 py-3 bg-[#FAFAF9] border-b border-[#E8E7F3] flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#14162B] truncate">
                    {currentThread.counterpartName}
                  </h4>
                  <span className="text-[10px] text-[#8B8DA3]">·</span>
                  <span className="text-[11px] text-[#4A4C63] truncate">
                    {currentThread.counterpartRole}
                  </span>
                </div>
                <p className="text-[11px] text-[#5B4FE9] truncate font-medium">
                  Challenge: {currentThread.problemTitle}
                </p>
                <p className="text-[10px] text-[#8B8DA3]">
                  {currentThread.counterpartOrg}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAF9]/40">
              {currentThread.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-[#8B8DA3] mb-1 px-1">
                      {isUser ? 'You' : currentThread.counterpartName}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#5B4FE9] text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-[#14162B] border border-[#E8E7F3] rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#8B8DA3] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#E8E7F3] bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message, query, or milestone update..."
                  className="flex-1 text-xs sm:text-sm p-3 bg-[#FAFAF9] border border-[#E8E7F3] rounded-xl outline-none focus:bg-white focus:border-[#5B4FE9]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 bg-[#5B4FE9] text-white rounded-xl hover:bg-[#4C40DC] disabled:opacity-40 transition-colors shadow-xs flex items-center justify-center shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-[#8B8DA3]">
            <MessageSquare className="w-10 h-10 text-[#D6D4EA] mb-2" />
            <p className="font-semibold text-[#14162B]">No Conversation Selected</p>
            <p className="mt-1">Apply to a problem challenge or post a challenge to start discussions.</p>
          </div>
        )}
      </div>
    </div>
  );
};
