import React, { useState } from 'react';
import { ConnectionRequest } from '../types';
import {
  X,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  Sparkles,
  Briefcase,
  User,
  GraduationCap,
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';

interface ConnectionRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ConnectionRequest[];
  onApprove: (requestId: string, responseNote?: string) => void;
  onDecline: (requestId: string) => void;
  onOpenChatForProblem: (problemId: string) => void;
}

export const ConnectionRequestsModal: React.FC<ConnectionRequestsModalProps> = ({
  isOpen,
  onClose,
  requests,
  onApprove,
  onDecline,
  onOpenChatForProblem,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredRequests = requests.filter((r) => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E7F3] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-[#14162B]">
                  Connection & Permission Requests
                </h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F59E0B] text-white">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8B8DA3]">
                Manage builder inquiries and grant direct messaging permission
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Strip */}
        <div className="px-6 py-2.5 bg-white border-b border-[#E8E7F3] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[#14162B] text-white'
                : 'text-[#6B6D82] hover:bg-[#F4F4F7]'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-[#F59E0B] text-white'
                : 'text-[#6B6D82] hover:bg-[#F4F4F7]'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'approved'
                ? 'bg-[#1FAE7C] text-white'
                : 'text-[#6B6D82] hover:bg-[#F4F4F7]'
            }`}
          >
            Approved ({requests.filter((r) => r.status === 'approved').length})
          </button>
        </div>

        {/* List of Requests */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-[#8B8DA3]">
              <MessageSquare className="w-10 h-10 mx-auto text-[#D6D4EA] mb-2" />
              <p className="text-sm font-semibold text-[#14162B]">No requests in this view</p>
              <p className="text-xs text-[#8B8DA3] mt-1">
                When builders send "I'm Interested" or "I Have a Solution", they appear here for your approval.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-[#E8E7F3] bg-white hover:border-[#D6D4EA] transition-all space-y-3"
              >
                {/* Top Row: Sender Info & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EFEDFC] text-[#5B4FE9] font-bold text-sm flex items-center justify-center shrink-0">
                      {req.senderName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#14162B]">
                          {req.senderName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F0F7] text-[#4A4C63] font-medium">
                          {req.senderRole === 'builder' ? 'Student Builder' : 'Problem Owner'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B6D82] flex items-center gap-1.5 mt-0.5">
                        <GraduationCap className="w-3 h-3 text-[#8B8DA3]" />
                        <span>{req.senderInstitution || req.senderEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {req.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF6E7] text-[#B45309] border border-[#F59E0B]/30">
                        <Clock className="w-3 h-3" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E4F6EE] text-[#1FAE7C] border border-[#1FAE7C]/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approved & Unlocked</span>
                      </span>
                    )}
                    {req.status === 'declined' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FBE9EC] text-[#D6455A] border border-[#D6455A]/30">
                        <XCircle className="w-3 h-3" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Challenge & Intent Pill */}
                <div className="p-3 rounded-xl bg-[#F8F7FD] border border-[#E8E7F3]/70">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[11px] font-bold text-[#5B4FE9]">
                      Challenge: {req.problemTitle}
                    </span>
                    <span className="text-[10px] text-[#8B8DA3]">
                      Requested {req.createdAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {req.intentType === 'have_solution' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-md">
                        <Briefcase className="w-3 h-3" />
                        Intent: "I Have a Solution"
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B4FE9] bg-[#EFEDFC] px-2 py-0.5 rounded-md">
                        <Sparkles className="w-3 h-3" />
                        Intent: "I'm Interested"
                      </span>
                    )}
                    <span className="text-[11px] text-[#8B8DA3]">· To Owner: {req.ownerName}</span>
                  </div>
                  <p className="text-xs text-[#14162B] mt-2 italic bg-white p-2.5 rounded-lg border border-[#E8E7F3]">
                    "{req.message}"
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onDecline(req.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-[#E8E7F3] text-xs font-semibold text-[#6B6D82] hover:bg-[#F4F4F7] hover:text-[#D6455A] transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setApprovingId(req.id);
                          onApprove(req.id);
                          setTimeout(() => setApprovingId(null), 500);
                        }}
                        disabled={approvingId === req.id}
                        className="px-4 py-1.5 rounded-xl bg-[#1FAE7C] hover:bg-[#189669] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{approvingId === req.id ? 'Approving...' : 'Approve & Open Chat'}</span>
                      </button>
                    </>
                  ) : req.status === 'approved' ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenChatForProblem(req.problemId);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-[#5B4FE9] hover:bg-[#4C40DC] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Direct Chat Thread</span>
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between text-xs text-[#8B8DA3] shrink-0">
          <span>Protected direct communication channel</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#D6D4EA] text-xs font-semibold text-[#14162B] hover:bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
