import React from 'react';
import {
  X,
  Home,
  Compass,
  Layers,
  PlusCircle,
  FileText,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Info,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Briefcase
} from 'lucide-react';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProblems: () => void;
  onOpenPostProblem: () => void;
  onOpenMyProposals: () => void;
  onOpenPostedProblems?: () => void;
  onOpenMessages: () => void;
  onOpenAIDoubtSolver: () => void;
  onOpenWorkspace?: () => void;
  activeWorkspaceProjectsCount?: number;
  onNavigateHome?: () => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToProblems,
  onOpenPostProblem,
  onOpenMyProposals,
  onOpenPostedProblems,
  onOpenMessages,
  onOpenAIDoubtSolver,
  onOpenWorkspace,
  activeWorkspaceProjectsCount = 0,
  onNavigateHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col border-r border-[#E8E7F3] animate-in slide-in-from-left duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 shrink-0"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="7" cy="16" r="5" fill="#5B4FE9" />
              <circle cx="25" cy="16" r="5" fill="#1FAE7C" />
              <rect x="11" y="14.5" width="10" height="3" rx="1.5" fill="#8B7FF5" />
            </svg>
            <div>
              <span className="font-display text-lg font-semibold text-[#14162B] block leading-tight">
                ProblemBridge
              </span>
              <span className="text-xs text-[#8B8DA3]">
                Navigation Menu
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B4FE9]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Normal Navigation Links List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Section 1: Main Platform Navigation */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8B8DA3]">
              Menu
            </div>
            <nav className="space-y-1">
              {/* Home */}
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateHome) onNavigateHome();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] group-hover:bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                    <Home className="w-4 h-4" />
                  </div>
                  <span>Home</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Browse Problems */}
              <button
                onClick={() => {
                  onClose();
                  onNavigateToProblems();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] group-hover:bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span>Browse Problems</span>
                </div>
                <span className="text-xs font-semibold text-[#5B4FE9] bg-[#EFEDFC] px-2 py-0.5 rounded-full shrink-0">
                  180+
                </span>
              </button>

              {/* How It Works */}
              <a
                href="#how-it-works"
                onClick={onClose}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] group-hover:bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>How It Works</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>
            </nav>
          </div>

          {/* Section 2: Workspace & Actions */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8B8DA3]">
              Workspace
            </div>
            <nav className="space-y-1">
              {/* Post a Problem */}
              <button
                onClick={() => {
                  onClose();
                  onOpenPostProblem();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 group-hover:bg-[#5B4FE9] group-hover:text-white transition-colors">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <span>Post a Problem</span>
                </div>
                <span className="text-[10px] font-bold text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-full shrink-0">
                  Open to All
                </span>
              </button>

              {/* My Proposals */}
              <button
                onClick={() => {
                  onClose();
                  onOpenMyProposals();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] group-hover:bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>My Proposals & Submissions</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Collaboration Workspace */}
              {onOpenWorkspace && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenWorkspace();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block leading-tight">Collaboration Workspace</span>
                      <span className="text-[10px] text-[#8B8DA3]">Tasks, milestones & files</span>
                    </div>
                  </div>
                  {activeWorkspaceProjectsCount > 0 ? (
                    <span className="text-[10px] font-bold text-white bg-[#1FAE7C] px-2 py-0.5 rounded-full shrink-0">
                      {activeWorkspaceProjectsCount} Active
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </button>
              )}

              {/* My Posted Challenges & Status */}
              {onOpenPostedProblems && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPostedProblems();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] group-hover:bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span>My Posted Challenges & Status</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              )}

              {/* Messages */}
              <button
                onClick={() => {
                  onClose();
                  onOpenMessages();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] group-hover:bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Messages & Mentors</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </nav>
          </div>

          {/* Section 3: AI Assistant & Support */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8B8DA3]">
              Assistance & Info
            </div>
            <nav className="space-y-1">
              {/* Ask AI Doubt Solver */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAIDoubtSolver();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#5B4FE9] bg-[#EFEDFC]/60 hover:bg-[#EFEDFC] border border-[#D6D4EA]/60 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#5B4FE9] border border-[#D6D4EA] flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>AI Doubt Solver</span>
                </div>
                <span className="text-[10px] font-bold bg-[#5B4FE9] text-white px-2 py-0.5 rounded-md">
                  Gemini AI
                </span>
              </button>

              {/* About ProblemBridge */}
              <a
                href="#how-it-works"
                onClick={onClose}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] group-hover:bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                    <Info className="w-4 h-4" />
                  </div>
                  <span>About ProblemBridge</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>

              {/* Help & FAQs */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAIDoubtSolver();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] group-hover:bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 transition-colors">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>Help & FAQs</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </nav>
          </div>

        </div>

        {/* Drawer Footer with Quick Post Button */}
        <div className="p-4 border-t border-[#E8E7F3] bg-[#FAFAF9] space-y-3">
          <button
            onClick={() => {
              onClose();
              onOpenPostProblem();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5B4FE9] text-white text-xs sm:text-sm font-semibold hover:bg-[#4C40DC] transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Problem Challenge</span>
          </button>
          
          <div className="flex items-center justify-between text-[11px] text-[#8B8DA3] px-1">
            <span>ProblemBridge Network</span>
            <span>v2.4 • Open Platform</span>
          </div>
        </div>

      </div>
    </div>
  );
};
