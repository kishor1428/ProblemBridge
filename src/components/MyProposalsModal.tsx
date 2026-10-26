import React from 'react';
import { Proposal } from '../types';
import { X, CheckCircle, Clock, ExternalLink, MessageSquare } from 'lucide-react';

interface MyProposalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: Proposal[];
  onOpenChatForProblem: (problemId: string) => void;
}

export const MyProposalsModal: React.FC<MyProposalsModalProps> = ({
  isOpen,
  onClose,
  proposals,
  onOpenChatForProblem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-[#E8E7F3] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#5B4FE9]">
              Builder Workspace
            </div>
            <h3 className="font-display text-lg font-semibold text-[#14162B]">
              My Submitted Solution Proposals ({proposals.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {proposals.length === 0 ? (
            <div className="text-center py-12 text-[#8B8DA3]">
              <p>You haven't submitted any solution proposals yet.</p>
              <p className="text-xs mt-1">Explore problems and click "Apply" to submit your technical approach.</p>
            </div>
          ) : (
            proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-[#FAFAF9] border border-[#E8E7F3] rounded-xl p-4.5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-display font-semibold text-sm sm:text-base text-[#14162B]">
                      {proposal.problemTitle}
                    </h4>
                    <span className="text-xs text-[#8B8DA3]">
                      Submitted {proposal.submittedAt} · {proposal.teamType} · {proposal.estimatedWeeks} weeks estimate
                    </span>
                  </div>

                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      proposal.status === 'Shortlisted'
                        ? 'bg-[#E4F6EE] text-[#1FAE7C]'
                        : proposal.status === 'Accepted'
                        ? 'bg-[#EFEDFC] text-[#5B4FE9]'
                        : 'bg-[#FBF1DF] text-[#C9861A]'
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>

                <p className="text-xs text-[#4A4C63] leading-relaxed line-clamp-3 bg-white p-3 rounded-lg border border-[#E8E7F3]">
                  "{proposal.solutionSummary}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E8E7F3]/70">
                  <div className="flex gap-1.5 flex-wrap">
                    {proposal.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium bg-white text-[#4A4C63] px-2 py-0.5 rounded-md border border-[#E8E7F3]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenChatForProblem(proposal.problemId);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B4FE9] hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Owner Chat</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[#E8E7F3] bg-[#FAFAF9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-[#D6D4EA] text-[#14162B] hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
