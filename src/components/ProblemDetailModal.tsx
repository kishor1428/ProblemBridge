import React, { useState } from 'react';
import { Problem, ConnectionRequest, UserProfile } from '../types';
import {
  X,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  Cpu,
  UserCheck,
  MessageSquare,
  ShieldCheck,
  Mail,
  Phone,
  Sparkles,
  Briefcase,
  Send,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';

interface ProblemDetailModalProps {
  problem: Problem | null;
  onClose: () => void;
  onApply: (problem: Problem) => void;
  onStartChat: (problem: Problem) => void;
  connectionRequest?: ConnectionRequest | null;
  onRequestConnection: (
    problem: Problem,
    intentType: 'interested' | 'have_solution' | 'general_query',
    customMessage: string
  ) => void;
  currentUser: UserProfile;
  onOpenOwnerProfileModal?: (problem: Problem) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  onClose,
  onApply,
  onStartChat,
  connectionRequest,
  onRequestConnection,
  currentUser,
  onOpenOwnerProfileModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deliverables' | 'mentor'>('overview');
  const [selectedIntent, setSelectedIntent] = useState<'interested' | 'have_solution' | 'general_query'>('interested');
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSentSuccess, setRequestSentSuccess] = useState(false);

  if (!problem) return null;

  const ownerName = problem.ownerName || problem.mentorName || 'Problem Owner';
  const ownerTitle = problem.ownerTitle || problem.mentorTitle || 'Plant Operations Lead';
  const ownerOrg = problem.ownerOrg || problem.organization || 'Partner Organization';
  const ownerDept = problem.ownerDepartment || 'Technical & Plant Operations';
  const ownerEmail = problem.ownerEmail || 'contact@organization.org';
  const ownerPhone = problem.ownerPhone || '+91 94432 00000';
  const ownerCity = problem.ownerCity || (problem.location ? problem.location.split(',')[0] : 'Tamil Nadu');
  const ownerState = problem.ownerState || 'Tamil Nadu';
  const ownerBio =
    problem.ownerBio ||
    `${ownerName} manages industrial machinery, process quality, and student technical collaborations at ${ownerOrg}.`;
  const ownerStatus = problem.ownerVerificationStatus || 'Verified Official';
  const responseTime = problem.ownerResponseTime || 'Usually responds in ~1 hour';
  const safeBudget = typeof problem.budget === 'number' ? problem.budget : Number(problem.budget) || 0;
  const safeSkills = Array.isArray(problem.skills) ? problem.skills : [];
  const safeDeliverables = Array.isArray(problem.deliverables) ? problem.deliverables : [];

  const defaultMessages = {
    interested: `Hello ${ownerName}, I am interested in collaborating on "${problem.title}". I would appreciate your approval to connect and discuss technical details.`,
    have_solution: `Hello ${ownerName}, I have a working solution / prototype for "${problem.title}" addressing your pain points. Requesting your permission to connect and share specs.`,
    general_query: `Hello ${ownerName}, I have a query regarding "${problem.title}" and would like to connect.`,
  };

  const handleSendConnectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const msg = customNote.trim() || defaultMessages[selectedIntent];
    onRequestConnection(problem, selectedIntent, msg);
    setTimeout(() => {
      setIsSubmitting(false);
      setRequestSentSuccess(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E7F3] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-[#E8E7F3] bg-[#FAFAF9]/80 flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EFEDFC] text-[#5B4FE9]">
                {problem.category}
              </span>
              <span className="text-xs font-medium text-[#8B8DA3]">·</span>
              <span className="text-xs font-medium text-[#5B4FE9]">
                {problem.domain}
              </span>
              <span className="text-xs font-medium text-[#8B8DA3]">·</span>
              <span className="text-xs text-[#8B8DA3]">
                Posted {problem.postedTime}
              </span>
            </div>

            <h2 id="modal-title" className="font-display text-2xl sm:text-3xl font-semibold text-[#14162B] leading-snug">
              {problem.title}
            </h2>

            <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-[#4A4C63] flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-[#8B7FF5]" />
                {problem.organization}
              </span>
              <span className="flex items-center gap-1.5 text-[#8B8DA3]">
                <MapPin className="w-4 h-4 text-[#8B8DA3]" />
                {problem.location}
              </span>
              
              {/* Clickable Quick Owner pill */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenOwnerProfileModal) {
                    onOpenOwnerProfileModal(problem);
                  } else {
                    setActiveTab('mentor');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFEDFC] hover:bg-[#5B4FE9] hover:text-white text-[#5B4FE9] text-xs font-bold transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Posted by: {ownerName}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors shrink-0"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#E8E7F3] px-6 bg-white gap-6 text-sm shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#4A4C63] hover:text-[#14162B]'
            }`}
          >
            Problem Context
          </button>
          <button
            onClick={() => setActiveTab('deliverables')}
            className={`py-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'deliverables'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#4A4C63] hover:text-[#14162B]'
            }`}
          >
            Deliverables & Resources
          </button>
          <button
            onClick={() => setActiveTab('mentor')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mentor'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#4A4C63] hover:text-[#14162B]'
            }`}
          >
            <span>Owner Profile & Connect</span>
            {connectionRequest?.status === 'approved' ? (
              <span className="w-2 h-2 rounded-full bg-[#1FAE7C]" />
            ) : connectionRequest?.status === 'pending' ? (
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            ) : null}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#14162B] flex-1">
          
          {/* Key Metric Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAF9] p-4 rounded-xl border border-[#E8E7F3]">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#8B8DA3]">
                Honorarium Budget
              </span>
              <strong className="text-lg font-bold text-[#14162B]">
                ₹{safeBudget.toLocaleString('en-IN')}
              </strong>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#8B8DA3]">
                Estimated Timeline
              </span>
              <div className="flex items-center gap-1 text-sm font-semibold text-[#14162B]">
                <Clock className="w-3.5 h-3.5 text-[#5B4FE9]" />
                {problem.timeline || 'Flexible'}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#8B8DA3]">
                Urgency
              </span>
              <span className="inline-block text-xs font-semibold text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-md mt-0.5">
                {problem.urgency || 'Flexible'}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#8B8DA3]">
                Builders Interested
              </span>
              <span className="text-sm font-semibold text-[#14162B]">
                {problem.interestedCount ?? 0} Applied
              </span>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs uppercase font-semibold text-[#8B8DA3] tracking-wider mb-2">
                  The Operational Challenge
                </h4>
                <p className="text-sm text-[#4A4C63] leading-relaxed">
                  {problem.description}
                </p>
              </div>

              <div className="bg-[#EFEDFC]/60 p-4 rounded-xl border border-[#D6D4EA]/60">
                <h4 className="text-xs uppercase font-semibold text-[#5B4FE9] tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span>Current Impact & Pain Point</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#14162B] font-medium leading-relaxed">
                  "{problem.painPoint || problem.description}"
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-[#8B8DA3] tracking-wider mb-2">
                  Required Competencies & Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {safeSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#F1F1F5] text-[#14162B] border border-[#E8E7F3]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deliverables' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs uppercase font-semibold text-[#8B8DA3] tracking-wider mb-2">
                  Deliverable Type: <span className="text-[#5B4FE9] font-bold">{problem.deliverableType || 'Prototype'}</span>
                </h4>
                <ul className="space-y-2.5">
                  {safeDeliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A4C63]">
                      <CheckCircle2 className="w-4 h-4 text-[#1FAE7C] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {problem.hardwareProvided && (
                <div className="bg-[#FAFAF9] p-4 rounded-xl border border-[#E8E7F3]">
                  <h4 className="text-xs uppercase font-semibold text-[#14162B] tracking-wider mb-1 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#5B4FE9]" />
                    Facility & Hardware Access Provided
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A4C63]">
                    {problem.hardwareProvided}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* OWNER PROFILE & COMMUNICATION TAB */}
          {/* ========================================================== */}
          {activeTab === 'mentor' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Owner Profile Card */}
              <div className="bg-[#FAFAF9] p-5 rounded-2xl border border-[#E8E7F3] space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B4FE9] to-[#8B7FF5] text-white font-display text-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
                      {ownerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-[#14162B]">
                          {ownerName}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-full border border-[#1FAE7C]/30">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{ownerStatus}</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#8B8DA3]">
                        {ownerTitle}
                      </p>
                      <p className="text-xs text-[#5B4FE9] font-medium mt-0.5">
                        {ownerOrg} · {ownerCity}, {ownerState}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-[#8B8DA3] flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#E8E7F3]">
                    <Clock className="w-3.5 h-3.5 text-[#5B4FE9]" />
                    <span>{responseTime}</span>
                  </div>
                </div>

                {/* Owner details badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#E8E7F3] text-xs">
                  <div>
                    <span className="text-[10px] text-[#8B8DA3] block font-bold uppercase">Department</span>
                    <span className="font-medium text-[#14162B] truncate block">{ownerDept}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8DA3] block font-bold uppercase">Official Email</span>
                    <span className="font-medium text-[#5B4FE9] truncate block flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {ownerEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8DA3] block font-bold uppercase">Official Phone</span>
                    <span className="font-medium text-[#14162B] truncate block flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#1FAE7C]" />
                      {ownerPhone}
                    </span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs sm:text-sm text-[#4A4C63] leading-relaxed bg-white p-3 rounded-xl border border-[#E8E7F3]">
                  {ownerBio}
                </p>
              </div>

              {/* Communication Permission Gate Section */}
              <div className="p-5 rounded-2xl border border-[#E8E7F3] bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#5B4FE9]" />
                    <h4 className="text-xs uppercase font-bold text-[#14162B] tracking-wider">
                      Communication Permission & Chat
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#8B8DA3]">
                    Approval required before chatting
                  </span>
                </div>

                {/* Case 1: Approved */}
                {connectionRequest?.status === 'approved' ? (
                  <div className="p-4 rounded-xl bg-[#E4F6EE] border border-[#1FAE7C]/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1FAE7C]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Permission Approved by {ownerName}! Direct Chat is Open</span>
                    </div>
                    <p className="text-xs text-[#285A48]">
                      You have permission to communicate directly with {ownerName} regarding this challenge.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onStartChat(problem);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#1FAE7C] hover:bg-[#189669] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open Direct Chat with {ownerName}</span>
                    </button>
                  </div>
                ) : connectionRequest?.status === 'pending' ? (
                  /* Case 2: Pending */
                  <div className="p-4 rounded-xl bg-[#FEF6E7] border border-[#F59E0B]/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#B45309]">
                      <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                      <span>Permission Request Sent · Awaiting Owner's Approval</span>
                    </div>
                    <p className="text-xs text-[#78350F] leading-relaxed">
                      You submitted: <strong>"{connectionRequest.intentType === 'have_solution' ? 'I Have a Solution' : 'I am Interested'}"</strong>.
                      Direct messaging will unlock automatically once {ownerName} reviews and accepts your request.
                    </p>
                    <div className="text-[11px] text-[#92400E] bg-white/70 p-2 rounded-lg border border-[#F59E0B]/20">
                      Note: "{connectionRequest.message}"
                    </div>
                  </div>
                ) : connectionRequest?.status === 'declined' ? (
                  /* Case 3: Declined */
                  <div className="p-4 rounded-xl bg-[#FBE9EC] border border-[#D6455A]/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#D6455A]">
                      <AlertCircle className="w-4 h-4" />
                      <span>Connection Request Declined by Owner</span>
                    </div>
                  </div>
                ) : (
                  /* Case 4: No request sent yet */
                  <form onSubmit={handleSendConnectionRequest} className="space-y-3.5">
                    <p className="text-xs text-[#6B6D82]">
                      Send an introductory inquiry to {ownerName}. Select your intent below:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedIntent('interested')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedIntent === 'interested'
                            ? 'border-[#5B4FE9] bg-[#EFEDFC] ring-2 ring-[#5B4FE9]/20'
                            : 'border-[#E8E7F3] bg-[#FAFAF9] hover:border-[#5B4FE9]/50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#14162B] mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#5B4FE9]" />
                          <span>"I'm Interested"</span>
                        </div>
                        <p className="text-[11px] text-[#6B6D82]">
                          Request approval to explore requirements and ask questions.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedIntent('have_solution')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedIntent === 'have_solution'
                            ? 'border-[#1FAE7C] bg-[#E4F6EE] ring-2 ring-[#1FAE7C]/20'
                            : 'border-[#E8E7F3] bg-[#FAFAF9] hover:border-[#1FAE7C]/50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#14162B] mb-1">
                          <Briefcase className="w-3.5 h-3.5 text-[#1FAE7C]" />
                          <span>"I Have a Solution"</span>
                        </div>
                        <p className="text-[11px] text-[#6B6D82]">
                          Notify owner you have a viable prototype or method ready.
                        </p>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#14162B] mb-1">
                        Message to {ownerName}
                      </label>
                      <textarea
                        rows={3}
                        value={customNote || defaultMessages[selectedIntent]}
                        onChange={(e) => setCustomNote(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-[#D6D4EA] focus:border-[#5B4FE9] focus:ring-2 focus:ring-[#5B4FE9]/20 outline-none resize-none text-[#14162B] bg-white"
                      />
                    </div>

                    {requestSentSuccess ? (
                      <div className="p-3 rounded-xl bg-[#E4F6EE] border border-[#1FAE7C]/40 text-[#1FAE7C] text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Request sent! The owner will review and unlock chat permission.</span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 rounded-xl bg-[#5B4FE9] hover:bg-[#4C40DC] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending Request...
                          </span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Request Chat Permission from {ownerName}</span>
                          </>
                        )}
                      </button>
                    )}
                  </form>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#E8E7F3] bg-[#FAFAF9]/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#8B8DA3] flex items-center gap-1">
            <UserCheck className="w-4 h-4 text-[#1FAE7C]" />
            <span>Verified Industry Challenge · Owner Permission-Gated Chat</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Ask Owner / Permission Status Button */}
            {connectionRequest?.status === 'approved' ? (
              <button
                onClick={() => {
                  onClose();
                  onStartChat(problem);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1FAE7C] text-white text-xs font-semibold hover:bg-[#189669] transition-colors shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Owner</span>
              </button>
            ) : connectionRequest?.status === 'pending' ? (
              <button
                disabled
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#F59E0B]/40 bg-[#FEF6E7] text-xs font-semibold text-[#B45309] cursor-not-allowed opacity-90"
              >
                <Clock className="w-4 h-4" />
                <span>Awaiting Owner Approval</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('mentor')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D6D4EA] text-xs font-semibold text-[#14162B] hover:bg-white transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#5B4FE9]" />
                <span>Connect with Owner</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onApply(problem);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#5B4FE9] text-white text-xs sm:text-sm font-semibold hover:bg-[#4C40DC] transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Submit Solution Proposal</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
