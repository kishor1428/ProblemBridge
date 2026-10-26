import React, { useState } from 'react';
import { Problem, ConnectionRequest, UserProfile } from '../types';
import {
  X,
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface OwnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  currentUser: UserProfile;
  connectionRequest?: ConnectionRequest | null;
  onRequestConnection: (
    problem: Problem,
    intentType: 'interested' | 'have_solution' | 'general_query',
    customMessage: string
  ) => void;
  onOpenChat: (problem: Problem) => void;
  allProblems?: Problem[];
  onSelectProblem?: (p: Problem) => void;
}

export const OwnerProfileModal: React.FC<OwnerProfileModalProps> = ({
  isOpen,
  onClose,
  problem,
  currentUser,
  connectionRequest,
  onRequestConnection,
  onOpenChat,
  allProblems = [],
  onSelectProblem,
}) => {
  const [selectedIntent, setSelectedIntent] = useState<'interested' | 'have_solution' | 'general_query'>('interested');
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  if (!isOpen || !problem) return null;

  const ownerName = problem.ownerName || problem.mentorName || 'Problem Owner';
  const ownerTitle = problem.ownerTitle || problem.mentorTitle || 'Plant Operations Lead';
  const ownerOrg = problem.ownerOrg || problem.organization || 'Organization';
  const ownerDept = problem.ownerDepartment || 'Engineering & Operations';
  const ownerEmail = problem.ownerEmail || 'contact@organization.org';
  const ownerPhone = problem.ownerPhone || '+91 94420 00000';
  const ownerCity = problem.ownerCity || (problem.location ? problem.location.split(',')[0] : 'Tamil Nadu');
  const ownerState = problem.ownerState || 'Tamil Nadu';
  const ownerBio =
    problem.ownerBio ||
    `${ownerName} oversees technical operations, equipment reliability, and student innovation partnerships at ${ownerOrg}.`;
  const ownerStatus = problem.ownerVerificationStatus || 'Verified Official';
  const responseTime = problem.ownerResponseTime || 'Usually responds in ~1 hour';
  const safePainPoint = problem.painPoint || problem.description || '';
  const safeBudget = typeof problem.budget === 'number' ? problem.budget : Number(problem.budget) || 0;

  const defaultMessages = {
    interested: `Hello ${ownerName}, I am very interested in collaborating on "${problem.title}". I have reviewed your requirements and would appreciate your approval to connect.`,
    have_solution: `Hello ${ownerName}, I have a concrete solution / prototype approach for "${problem.title}" addressing "${safePainPoint.slice(0, 80)}...". Requesting your approval to discuss specifications.`,
    general_query: `Hello ${ownerName}, I have a preliminary technical question about "${problem.title}" and would appreciate your permission to connect.`,
  };

  const currentMessageText = customNote.trim() || defaultMessages[selectedIntent];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onRequestConnection(problem, selectedIntent, currentMessageText);
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackSuccess(true);
    }, 400);
  };

  // Find other problems posted by this same organization or owner
  const relatedProblems = (allProblems || []).filter(
    (p) =>
      p &&
      p.id !== problem.id &&
      ((p.organization && problem.organization && p.organization.toLowerCase() === problem.organization.toLowerCase()) ||
        (p.ownerEmail && p.ownerEmail === problem.ownerEmail))
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E7F3] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-[#14162B] via-[#1E2248] to-[#2B1B54] text-white p-6 sm:p-7 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close owner profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#5B4FE9] to-[#8B7FF5] text-white font-display text-2xl sm:text-3xl font-bold flex items-center justify-center shadow-lg border-2 border-white/20">
                {ownerName
                  .split(' ')
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1FAE7C] border-2 border-[#14162B] flex items-center justify-center text-white" title="Verified Poster">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1FAE7C]/20 text-[#34D399] border border-[#1FAE7C]/40">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{ownerStatus}</span>
                </span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#A59CF8]" />
                  <span>{responseTime}</span>
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {ownerName}
              </h2>

              <p className="text-xs sm:text-sm text-white/80 font-medium">
                {ownerTitle}
              </p>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-white/70 flex-wrap">
                <span className="flex items-center gap-1 truncate">
                  <Building2 className="w-3.5 h-3.5 text-[#A59CF8] shrink-0" />
                  <strong className="text-white font-semibold">{ownerOrg}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A59CF8] shrink-0" />
                  <span>{ownerCity}, {ownerState}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#14162B]">
          
          {/* Contact & Department Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F3]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">
                Department
              </span>
              <span className="text-xs font-semibold text-[#14162B] truncate block">
                {ownerDept}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">
                Verified Email
              </span>
              <span className="text-xs font-semibold text-[#5B4FE9] truncate block flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {ownerEmail}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">
                Official Phone
              </span>
              <span className="text-xs font-semibold text-[#14162B] truncate block flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#1FAE7C]" />
                {ownerPhone}
              </span>
            </div>
          </div>

          {/* Bio / Mission */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#8B8DA3] tracking-wider mb-1.5">
              About the Problem Owner
            </h4>
            <p className="text-xs sm:text-sm text-[#4A4C63] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E8E7F3]">
              {ownerBio}
            </p>
          </div>

          {/* Active Challenge Context */}
          <div className="p-4 rounded-2xl bg-[#EFEDFC]/40 border border-[#D6D4EA]/80">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#5B4FE9] mb-1">
              Referenced Problem Challenge
            </div>
            <div className="text-sm font-bold text-[#14162B] mb-1">
              {problem.title}
            </div>
            <div className="text-xs text-[#6B6D82] line-clamp-2">
              "{safePainPoint}"
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-[#D6D4EA]/60">
              <span className="font-semibold text-[#14162B]">
                Budget: ₹{safeBudget.toLocaleString('en-IN')}
              </span>
              <span className="text-[#8B8DA3]">
                Timeline: {problem.timeline || 'Flexible'}
              </span>
            </div>
          </div>

          {/* ========================================================== */}
          {/* COMMUNICATION & PERMISSION GATE SECTION */}
          {/* ========================================================== */}
          <div className="border-t border-[#E8E7F3] pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#5B4FE9]" />
                <h4 className="text-xs uppercase font-bold text-[#14162B] tracking-wider">
                  Communication & Chat Permission
                </h4>
              </div>
              <span className="text-[11px] text-[#8B8DA3]">
                Owner permission required
              </span>
            </div>

            {/* CASE 1: Connection Request APPROVED */}
            {connectionRequest?.status === 'approved' && (
              <div className="p-4 rounded-2xl bg-[#E4F6EE] border border-[#1FAE7C]/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1FAE7C]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Permission Approved! Direct Messaging Unlocked</span>
                </div>
                <p className="text-xs text-[#285A48]">
                  {ownerName} has approved your request to communicate. You can now chat directly in real-time to discuss solution architecture and project milestones.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat(problem);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#1FAE7C] hover:bg-[#189669] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Direct Chat with {ownerName}</span>
                </button>
              </div>
            )}

            {/* CASE 2: Connection Request PENDING */}
            {connectionRequest?.status === 'pending' && (
              <div className="p-4 rounded-2xl bg-[#FEF6E7] border border-[#F59E0B]/40 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B45309]">
                  <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>Permission Request Sent · Awaiting Owner's Approval</span>
                </div>
                <p className="text-xs text-[#78350F] leading-relaxed">
                  Your message (<strong>"{connectionRequest.intentType === 'have_solution' ? 'I Have a Solution' : 'I am Interested'}"</strong>) was submitted to {ownerName}. To protect industrial problem owners from spam, direct messaging unlocks automatically as soon as the owner approves your inquiry.
                </p>
                <div className="text-[11px] text-[#92400E] bg-white/70 p-2.5 rounded-lg border border-[#F59E0B]/20">
                  Submitted note: "{connectionRequest.message}"
                </div>
              </div>
            )}

            {/* CASE 3: Connection Request DECLINED */}
            {connectionRequest?.status === 'declined' && (
              <div className="p-4 rounded-2xl bg-[#FBE9EC] border border-[#D6455A]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D6455A]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Request Declined by Owner</span>
                </div>
                <p className="text-xs text-[#8A2434]">
                  The problem owner has declined this connection request at this time. You can still review other open challenges or submit a formal proposal through the main portal.
                </p>
              </div>
            )}

            {/* CASE 4: No Request Sent Yet (Send "I'm interested" or "I have a solution") */}
            {!connectionRequest && (
              <form onSubmit={handleSend} className="space-y-4">
                <p className="text-xs text-[#6B6D82]">
                  To initiate contact with {ownerName}, select your intent below. The problem owner will review your profile and approve your chat session.
                </p>

                {/* Quick Intent Selector Buttons */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8B8DA3] uppercase tracking-wider mb-2">
                    Choose Your Intent *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedIntent('interested')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedIntent === 'interested'
                          ? 'border-[#5B4FE9] bg-[#EFEDFC] ring-2 ring-[#5B4FE9]/20'
                          : 'border-[#E8E7F3] bg-white hover:border-[#5B4FE9]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-[#5B4FE9]" />
                        <span className="text-xs font-bold text-[#14162B]">
                          "I'm Interested"
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B6D82]">
                        Request permission to ask technical questions and explore problem scope.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedIntent('have_solution')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedIntent === 'have_solution'
                          ? 'border-[#1FAE7C] bg-[#E4F6EE] ring-2 ring-[#1FAE7C]/20'
                          : 'border-[#E8E7F3] bg-white hover:border-[#1FAE7C]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-[#1FAE7C]" />
                        <span className="text-xs font-bold text-[#14162B]">
                          "I Have a Solution"
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B6D82]">
                        Inform owner you have a working prototype or approach ready to present.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Message / Note */}
                <div>
                  <label className="block text-xs font-semibold text-[#14162B] mb-1">
                    Introduction Message to {ownerName}
                  </label>
                  <textarea
                    rows={3}
                    value={customNote || defaultMessages[selectedIntent]}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Describe your background or solution approach..."
                    className="w-full text-xs p-3 rounded-xl border border-[#D6D4EA] focus:border-[#5B4FE9] focus:ring-2 focus:ring-[#5B4FE9]/20 outline-none resize-none text-[#14162B] bg-white"
                  />
                  <div className="text-[10px] text-[#8B8DA3] mt-1 flex items-center justify-between">
                    <span>Sender Profile: <strong>{currentUser.fullName}</strong> ({currentUser.institution})</span>
                    <span>Direct chat unlocks on approval</span>
                  </div>
                </div>

                {feedbackSuccess ? (
                  <div className="p-3 rounded-xl bg-[#E4F6EE] border border-[#1FAE7C]/40 text-[#1FAE7C] text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Request sent to {ownerName}! Direct chat will open once approved.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#5B4FE9] hover:bg-[#4C40DC] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Permission Request...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Request to {ownerName}</span>
                      </>
                    )}
                  </button>
                )}
              </form>
            )}
          </div>

          {/* Related problems from this organization if any */}
          {relatedProblems.length > 0 && (
            <div className="border-t border-[#E8E7F3] pt-5">
              <h4 className="text-xs uppercase font-bold text-[#8B8DA3] tracking-wider mb-2">
                Other Challenges from {ownerOrg}
              </h4>
              <div className="space-y-2">
                {relatedProblems.map((rp) => (
                  <div
                    key={rp.id}
                    onClick={() => {
                      if (onSelectProblem) {
                        onClose();
                        onSelectProblem(rp);
                      }
                    }}
                    className="p-3 rounded-xl border border-[#E8E7F3] hover:border-[#5B4FE9] hover:bg-[#F8F7FD] cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#14162B]">{rp.title}</div>
                      <div className="text-[11px] text-[#6B6D82]">{rp.category} · Budget: ₹{rp.budget.toLocaleString('en-IN')}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5B4FE9]" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between text-xs text-[#8B8DA3] shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1FAE7C]" />
            <span>ProblemBridge Verified Industrial Partner Program</span>
          </div>
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
