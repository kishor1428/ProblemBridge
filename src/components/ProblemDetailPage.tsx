import React, { useState } from 'react';
import { Problem, ConnectionRequest, UserProfile } from '../types';
import {
  ArrowLeft,
  Building2,
  MapPin,
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
  Lock,
  ChevronRight,
  Share2,
  Copy,
  Check,
  Bookmark
} from 'lucide-react';

interface ProblemDetailPageProps {
  problem: Problem;
  onBack: () => void;
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
  justPublished?: boolean;
  onPostAnother?: () => void;
  onViewMyChallenges?: () => void;
}

export const ProblemDetailPage: React.FC<ProblemDetailPageProps> = ({
  problem,
  onBack,
  onApply,
  onStartChat,
  connectionRequest,
  onRequestConnection,
  currentUser,
  onOpenOwnerProfileModal,
  justPublished = false,
  onPostAnother,
  onViewMyChallenges,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deliverables' | 'mentor'>('overview');
  const [selectedIntent, setSelectedIntent] = useState<'interested' | 'have_solution' | 'general_query'>('interested');
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSentSuccess, setRequestSentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const ownerName = problem.ownerName || problem.mentorName || 'Problem Owner';
  const ownerTitle = problem.ownerTitle || problem.mentorTitle || 'Plant Operations Lead';
  const ownerOrg = problem.ownerOrg || problem.organization || 'Organization';
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

  const handleCopyShareLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-24">
      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="bg-white border-b border-[#E8E7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#8B8DA3]">
              <button
                onClick={onBack}
                className="hover:text-[#5B4FE9] transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Explore Challenges</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#D6D4EA]" />
              <span className="text-[#14162B] font-semibold truncate max-w-xs sm:max-w-md">
                {problem.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D6D4EA] text-xs font-semibold text-[#4A4C63] hover:text-[#5B4FE9] hover:bg-[#EFEDFC]/40 transition-colors cursor-pointer"
                title="Copy challenge link to share with teammates"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[#1FAE7C]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              {onPostAnother && (
                <button
                  onClick={onPostAnother}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFEDFC] text-xs font-bold text-[#5B4FE9] hover:bg-[#E0DCFC] transition-colors cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Post Another</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Prominent Success Banner if Redirected after posting */}
        {justPublished && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-[#E4F6EE] via-[#EDFAF3] to-[#F3FCF7] border border-[#1FAE7C]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1FAE7C] text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#14162B]">
                  🎉 Challenge Published & Live on ProblemBridge!
                </h3>
                <p className="text-xs text-[#285A48] mt-0.5 max-w-2xl leading-relaxed">
                  Your operational problem <strong>"{problem.title}"</strong> is now live in the verified challenges catalog. Over 1,200+ student innovators and developers have been notified to review criteria and submit working proposals.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
              {onViewMyChallenges && (
                <button
                  onClick={onViewMyChallenges}
                  className="px-4 py-2 bg-[#1FAE7C] hover:bg-[#189669] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Track in My Challenges
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main 2-Column Split: Details on Left (8 cols) & Action Box on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: Comprehensive Problem Narrative & Specs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Header Hero Card */}
            <div className="bg-white border border-[#E8E7F3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              {/* Category & Status Tags */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-3 py-1 rounded-full font-bold bg-[#EFEDFC] text-[#5B4FE9]">
                  {problem.category || 'IoT'}
                </span>
                <span className="text-[#8B8DA3]">·</span>
                <span className="font-semibold text-[#5B4FE9]">
                  {problem.domain || `${problem.category} Systems`}
                </span>
                <span className="text-[#8B8DA3]">·</span>
                <span className="text-[#8B8DA3] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Posted {problem.postedTime || 'Just now'}
                </span>
                <span className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5F7F0] text-[#1FAE7C]">
                  Status: {problem.status || 'Open'}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14162B] leading-tight">
                {problem.title}
              </h1>

              {/* Organization & Location Meta */}
              <div className="flex items-center gap-4 flex-wrap text-xs sm:text-sm text-[#4A4C63] pt-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#14162B]">
                  <Building2 className="w-4 h-4 text-[#5B4FE9]" />
                  <span>{problem.organization}</span>
                  {problem.organizationType && (
                    <span className="text-[11px] font-normal text-[#8B8DA3]">
                      ({problem.organizationType})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[#6B6D82]">
                  <MapPin className="w-4 h-4 text-[#8B8DA3]" />
                  <span>{problem.location}</span>
                </div>
              </div>

              {/* Key Metric Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAF9] p-4 rounded-2xl border border-[#E8E7F3] pt-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8B8DA3]">
                    Honorarium Budget
                  </span>
                  <strong className="text-xl font-bold text-[#14162B] tabular-nums">
                    ₹{safeBudget.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8B8DA3]">
                    Target Timeline
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-[#14162B]">
                    <Clock className="w-3.5 h-3.5 text-[#5B4FE9]" />
                    <span>{problem.timeline || 'Flexible'}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8B8DA3]">
                    Urgency
                  </span>
                  <span className="inline-block text-xs font-bold text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-md mt-0.5">
                    {problem.urgency || 'Immediate'}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8B8DA3]">
                    Interest & Applicants
                  </span>
                  <span className="text-sm font-bold text-[#14162B]">
                    {problem.interestedCount ?? 0} Solvers Applied
                  </span>
                </div>
              </div>
            </div>

            {/* Tab Navigation for Problem Sections */}
            <div className="bg-white border border-[#E8E7F3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center border-b border-[#E8E7F3] gap-6 text-sm">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'overview'
                      ? 'border-[#5B4FE9] text-[#5B4FE9]'
                      : 'border-transparent text-[#6B6D82] hover:text-[#14162B]'
                  }`}
                >
                  Operational Context
                </button>
                <button
                  onClick={() => setActiveTab('deliverables')}
                  className={`py-3 font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'deliverables'
                      ? 'border-[#5B4FE9] text-[#5B4FE9]'
                      : 'border-transparent text-[#6B6D82] hover:text-[#14162B]'
                  }`}
                >
                  Deliverables & Specs ({safeDeliverables.length})
                </button>
                <button
                  onClick={() => setActiveTab('mentor')}
                  className={`py-3 font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                    activeTab === 'mentor'
                      ? 'border-[#5B4FE9] text-[#5B4FE9]'
                      : 'border-transparent text-[#6B6D82] hover:text-[#14162B]'
                  }`}
                >
                  <span>Problem Owner Profile</span>
                  {connectionRequest?.status === 'approved' && (
                    <span className="w-2 h-2 rounded-full bg-[#1FAE7C]" />
                  )}
                </button>
              </div>

              {/* TAB 1: OVERVIEW & BOTTLENECK */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-xs uppercase font-bold text-[#8B8DA3] tracking-wider mb-2">
                      The Operational Challenge & Root Causes
                    </h3>
                    <p className="text-sm text-[#4A4C63] leading-relaxed whitespace-pre-line">
                      {problem.description}
                    </p>
                  </div>

                  {/* Impact & Pain Point Highlight Card */}
                  <div className="bg-[#EFEDFC]/70 p-5 rounded-2xl border border-[#D6D4EA] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#5B4FE9] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Operational & Financial Impact</span>
                    </div>
                    <p className="text-sm font-semibold text-[#14162B] leading-relaxed">
                      "{problem.painPoint || problem.description}"
                    </p>
                  </div>

                  {/* Required Competencies */}
                  <div>
                    <h3 className="text-xs uppercase font-bold text-[#8B8DA3] tracking-wider mb-2.5">
                      Required Competencies & Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {safeSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F4F4F7] text-[#14162B] border border-[#E8E7F3]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DELIVERABLES & SPECS */}
              {activeTab === 'deliverables' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs uppercase font-bold text-[#8B8DA3] tracking-wider">
                        Primary Deliverable Type
                      </h3>
                      <span className="text-xs font-bold text-[#5B4FE9] bg-[#EFEDFC] px-3 py-1 rounded-full">
                        {problem.deliverableType || 'Prototype'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6D82]">
                      The solution must meet verified industry benchmarks before the final honorarium signoff.
                    </p>
                  </div>

                  {/* Tangible deliverables list */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-[#8B8DA3] tracking-wider mb-3">
                      Tangible Deliverables Checklist
                    </h4>
                    <div className="space-y-3">
                      {safeDeliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#FAFAF9] border border-[#E8E7F3] flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#1FAE7C] shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-[#14162B] font-medium leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Facility Access Provided */}
                  {problem.hardwareProvided && (
                    <div className="p-4 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F3] space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#5B4FE9]">
                        <Cpu className="w-4 h-4" />
                        <span>Facilities, Hardware & Field Access Provided</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#4A4C63] leading-relaxed">
                        {problem.hardwareProvided}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MENTOR & OWNER PROFILE */}
              {activeTab === 'mentor' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E8E7F3] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B4FE9] to-[#8B7FF5] text-white font-display text-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
                        {ownerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-[#14162B]">{ownerName}</h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{ownerStatus}</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#6B6D82] mt-0.5">{ownerTitle}</p>
                        <p className="text-xs text-[#5B4FE9] font-medium">
                          {ownerOrg} · {ownerCity}, {ownerState}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E8E7F3] text-xs">
                      <div>
                        <span className="text-[10px] text-[#8B8DA3] uppercase font-bold block">Department</span>
                        <span className="font-semibold text-[#14162B] truncate block">{ownerDept}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8B8DA3] uppercase font-bold block">Official Email</span>
                        <span className="font-semibold text-[#5B4FE9] truncate block flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {ownerEmail}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8B8DA3] uppercase font-bold block">Official Phone</span>
                        <span className="font-semibold text-[#14162B] truncate block flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#1FAE7C]" />
                          {ownerPhone}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#4A4C63] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E8E7F3]">
                      {ownerBio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Sticky Action Sidebar */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            
            {/* Primary Action Box: Submit Proposal & Connect */}
            <div className="bg-white border border-[#E8E7F3] rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B8DA3] block">
                  Honorarium Reward
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-[#14162B] tabular-nums mt-0.5">
                  ₹{safeBudget.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#1FAE7C] font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Milestone-protected escrow
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onApply(problem)}
                  className="w-full py-3.5 rounded-2xl bg-[#5B4FE9] hover:bg-[#4C40DC] active:scale-98 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg shadow-[#5B4FE9]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Submit Solution Proposal</span>
                </button>

                {connectionRequest?.status === 'approved' ? (
                  <button
                    type="button"
                    onClick={() => onStartChat(problem)}
                    className="w-full py-3 rounded-2xl bg-[#1FAE7C] hover:bg-[#189669] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Direct Chat with {ownerName}</span>
                  </button>
                ) : connectionRequest?.status === 'pending' ? (
                  <div className="p-3 rounded-2xl bg-[#FEF6E7] border border-[#F59E0B]/30 text-xs text-[#B45309] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 animate-pulse" />
                    <span>Awaiting Owner Chat Permission</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('mentor')}
                    className="w-full py-2.5 rounded-2xl bg-white border border-[#D6D4EA] hover:border-[#5B4FE9] text-xs font-bold text-[#14162B] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#5B4FE9]" />
                    <span>Request Chat Permission</span>
                  </button>
                )}
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-3 border-t border-[#F0EFF8] space-y-2 text-xs text-[#6B6D82]">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#1FAE7C]" />
                  <span>Verified organization with dedicated mentor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#5B4FE9]" />
                  <span>Expected completion: {problem.timeline || '3 - 4 weeks'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#8B7FF5]" />
                  <span>Format: {problem.deliverableType || 'Hardware Prototype'}</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Box */}
            <div className="bg-[#FAFAF9] border border-[#E8E7F3] rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#14162B] uppercase tracking-wider">
                Explore More on ProblemBridge
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={onBack}
                  className="w-full text-left p-2 rounded-xl hover:bg-white text-[#4A4C63] hover:text-[#5B4FE9] transition-colors flex items-center justify-between"
                >
                  <span>Browse All Live Challenges</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                {onViewMyChallenges && (
                  <button
                    onClick={onViewMyChallenges}
                    className="w-full text-left p-2 rounded-xl hover:bg-white text-[#4A4C63] hover:text-[#5B4FE9] transition-colors flex items-center justify-between"
                  >
                    <span>My Posted Challenges & Status</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
