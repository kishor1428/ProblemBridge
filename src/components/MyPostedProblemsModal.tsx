import React, { useState } from 'react';
import { Problem, Proposal, UserProfile } from '../types';
import {
  X,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ExternalLink,
  Filter,
  Search,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Building
} from 'lucide-react';

interface MyPostedProblemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: Problem[];
  proposals: Proposal[];
  userProfile: UserProfile;
  onOpenPostProblem: () => void;
  onUpdateProblemStatus: (problemId: string, newStatus: Problem['status']) => void;
  onSelectProblem: (problem: Problem) => void;
  onOpenChatForProblem?: (problem: Problem) => void;
  onAcceptProposal?: (problem: Problem, proposal: Proposal) => void;
}

export const MyPostedProblemsModal: React.FC<MyPostedProblemsModalProps> = ({
  isOpen,
  onClose,
  problems,
  proposals,
  userProfile,
  onOpenPostProblem,
  onUpdateProblemStatus,
  onSelectProblem,
  onOpenChatForProblem,
  onAcceptProposal,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Open' | 'Under Review' | 'In Progress' | 'Completed'>('All');
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusChangeFeedback, setStatusChangeFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter problems belonging to the current user
  const userProblems = (problems || []).filter((p) => {
    if (!p) return false;
    const isOwnerByEmail = p.ownerEmail && userProfile.email && p.ownerEmail.toLowerCase() === userProfile.email.toLowerCase();
    const isOwnerById = p.ownerId && userProfile.id && p.ownerId === userProfile.id;
    const isOwnerByName = p.mentorName && userProfile.fullName && p.mentorName.toLowerCase().includes(userProfile.fullName.toLowerCase());
    const isOwnerByOrg = p.organization && userProfile.institution && p.organization.toLowerCase() === userProfile.institution.toLowerCase();
    return Boolean(isOwnerByEmail || isOwnerById || isOwnerByName || isOwnerByOrg);
  });

  // Filter by status tab & search term
  const displayedProblems = userProblems.filter((p) => {
    const matchesTab = activeFilter === 'All' || p.status === activeFilter;
    const searchLower = searchFilter.toLowerCase();
    const matchesSearch =
      searchFilter === '' ||
      (p.title && p.title.toLowerCase().includes(searchLower)) ||
      (p.category && p.category.toLowerCase().includes(searchLower)) ||
      (p.domain && p.domain.toLowerCase().includes(searchLower));
    return Boolean(matchesTab && matchesSearch);
  });

  const countByStatus = {
    All: userProblems.length,
    Open: userProblems.filter((p) => p.status === 'Open').length,
    'Under Review': userProblems.filter((p) => p.status === 'Under Review').length,
    'In Progress': userProblems.filter((p) => p.status === 'In Progress').length,
    Completed: userProblems.filter((p) => p.status === 'Completed').length,
  };

  const handleStatusChange = (problemId: string, newStatus: Problem['status']) => {
    onUpdateProblemStatus(problemId, newStatus);
    setStatusChangeFeedback(`Problem status updated to "${newStatus}"`);
    setTimeout(() => setStatusChangeFeedback(null), 3000);
  };

  const getStatusColor = (status: Problem['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-[#E4F6EE] text-[#1FAE7C] border-[#1FAE7C]/20';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress':
        return 'bg-[#EFEDFC] text-[#5B4FE9] border-[#D6D4EA]';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#E8E7F3] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-[#14162B]">
                  My Posted Challenges & Live Status
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFEDFC] text-[#5B4FE9]">
                  {userProblems.length} {userProblems.length === 1 ? 'Problem' : 'Problems'}
                </span>
              </div>
              <p className="text-xs text-[#8B8DA3] mt-0.5">
                Track proposal submissions, review student solutions, and update progress milestones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenPostProblem();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#5B4FE9] hover:bg-[#4C40DC] rounded-xl transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Problem</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusChangeFeedback && (
          <div className="px-6 py-2.5 bg-[#E4F6EE] border-b border-[#1FAE7C]/30 text-[#1FAE7C] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusChangeFeedback}</span>
          </div>
        )}

        {/* Quick Filter Strip & Search */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-[#E8E7F3] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            {(['All', 'Open', 'Under Review', 'In Progress', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeFilter === tab
                    ? 'bg-[#5B4FE9] text-white shadow-xs font-semibold'
                    : 'text-[#4A4C63] hover:bg-[#F4F4F7]'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeFilter === tab ? 'bg-white/20 text-white' : 'bg-[#EFEDFC] text-[#5B4FE9]'
                  }`}
                >
                  {countByStatus[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search box within user's challenges */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#8B8DA3] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search your challenges..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#E8E7F3] bg-[#FAFAF9] outline-none focus:bg-white focus:border-[#5B4FE9]"
            />
          </div>
        </div>

        {/* Problems List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAFAF9]/60">
          {displayedProblems.length === 0 ? (
            <div className="py-12 px-4 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center mx-auto mb-3 border border-[#D6D4EA]">
                <Briefcase className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-semibold text-[#14162B]">
                {userProblems.length === 0
                  ? 'No Problems Posted Yet'
                  : 'No Problems Match Selected Filter'}
              </h4>
              <p className="text-xs text-[#8B8DA3] mt-1.5 leading-relaxed">
                {userProblems.length === 0
                  ? 'You are verified and authorized to post real industrial or campus problem challenges. Once posted, you can review builder proposals and manage project milestones here.'
                  : 'Try selecting a different status tab or clearing your search term.'}
              </p>
              {userProblems.length === 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPostProblem();
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#5B4FE9] hover:bg-[#4C40DC] rounded-xl transition-colors shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Your First Problem</span>
                </button>
              )}
            </div>
          ) : (
            displayedProblems.map((prob) => {
              const problemProposals = proposals.filter((p) => p.problemId === prob.id);
              const isExpanded = expandedProblemId === prob.id;

              return (
                <div
                  key={prob.id}
                  className="bg-white border border-[#E8E7F3] rounded-2xl p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-md"
                >
                  {/* Problem Top Row: Title, Category & Current Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#E8E7F3]">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-xs text-[#8B8DA3] mb-1">
                        <span className="font-medium text-[#5B4FE9]">{prob.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{prob.domain}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#8B8DA3]" />
                          {prob.location}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8B8DA3]" />
                          Posted {prob.postedTime}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#14162B] hover:text-[#5B4FE9] transition-colors cursor-pointer" onClick={() => onSelectProblem(prob)}>
                        {prob.title}
                      </h4>
                    </div>

                    {/* Status Badge & Interactive Status Selector */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-[#FAFAF9] border border-[#E8E7F3] p-1 rounded-xl">
                        <span className="text-[11px] text-[#8B8DA3] font-medium pl-1 hidden sm:inline">
                          Status:
                        </span>
                        <select
                          value={prob.status}
                          onChange={(e) =>
                            handleStatusChange(prob.id, e.target.value as Problem['status'])
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${getStatusColor(
                            prob.status
                          )}`}
                          aria-label={`Change status for ${prob.title}`}
                        >
                          <option value="Open">Open for Proposals</option>
                          <option value="Under Review">Under Review</option>
                          <option value="In Progress">In Progress / Assigned</option>
                          <option value="Completed">Handover Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Problem Description Snippet */}
                  <p className="text-xs text-[#4A4C63] mt-3 line-clamp-2 leading-relaxed">
                    {prob.description}
                  </p>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-[#E8E7F3]/70 bg-[#FAFAF9] p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">
                        Honorarium / Budget
                      </span>
                      <strong className="text-xs sm:text-sm font-semibold text-[#14162B]">
                        ₹{(typeof prob.budget === 'number' ? prob.budget : Number(prob.budget) || 0).toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">
                        Proposals Received
                      </span>
                      <strong className="text-xs sm:text-sm font-semibold text-[#5B4FE9] flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {problemProposals.length} Solution{problemProposals.length !== 1 ? 's' : ''}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">
                        Deliverable Type
                      </span>
                      <span className="text-xs font-medium text-[#14162B] truncate block">
                        {prob.deliverableType}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">
                        Target Timeline
                      </span>
                      <span className="text-xs font-medium text-[#14162B] block">
                        {prob.timeline}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Row: Proposals Accordion Toggle & Detail Link */}
                  <div className="mt-3 pt-2 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      onClick={() => setExpandedProblemId(isExpanded ? null : prob.id)}
                      className="text-xs font-semibold text-[#5B4FE9] hover:text-[#4C40DC] flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-[#EFEDFC] transition-colors"
                    >
                      <span>
                        {isExpanded
                          ? 'Hide Submitted Proposals'
                          : `View ${problemProposals.length} Submitted Proposal${problemProposals.length !== 1 ? 's' : ''}`}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      {onOpenChatForProblem && (
                        <button
                          onClick={() => onOpenChatForProblem(prob)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#4A4C63] bg-[#F4F4F7] hover:bg-[#E5E4EE] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#5B4FE9]" />
                          <span>Applicants Chat</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectProblem(prob)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#5B4FE9] bg-[#EFEDFC] hover:bg-[#E0DCFC] rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Proposals Drawer */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#E8E7F3] space-y-2.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#14162B]">
                        <span>Builder Submissions for "{prob.title}"</span>
                        <span className="text-[#8B8DA3] font-normal">
                          {problemProposals.length} received
                        </span>
                      </div>

                      {problemProposals.length === 0 ? (
                        <div className="p-4 bg-[#FAFAF9] rounded-xl text-center text-xs text-[#8B8DA3] border border-dashed border-[#D6D4EA]">
                          No proposals submitted yet for this challenge. As students apply, their solutions will appear here for your review and approval.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {problemProposals.map((prop) => (
                            <div
                              key={prop.id}
                              className="p-3 bg-[#FAFAF9] border border-[#E8E7F3] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <strong className="text-xs font-bold text-[#14162B]">
                                    {prop.builderName}
                                  </strong>
                                  <span className="text-[10px] text-[#8B8DA3]">·</span>
                                  <span className="text-[11px] text-[#4A4C63]">
                                    {prop.builderInstitution}
                                  </span>
                                  <span className="text-[10px] bg-[#EFEDFC] text-[#5B4FE9] font-medium px-2 py-0.5 rounded-full">
                                    {prop.teamType}
                                  </span>
                                </div>
                                <p className="text-xs text-[#4A4C63] leading-snug">
                                  {prop.solutionSummary}
                                </p>
                                <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-[#8B8DA3] pt-0.5">
                                  <span>Tech: {prop.techStack.join(', ')}</span>
                                  <span>·</span>
                                  <span>Est: {prop.estimatedWeeks} weeks</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${
                                  prop.status === 'Accepted'
                                    ? 'bg-[#E5F7F0] text-[#1FAE7C]'
                                    : 'bg-[#EFEDFC] text-[#5B4FE9]'
                                }`}>
                                  {prop.status}
                                </span>

                                {onAcceptProposal && prop.status !== 'Accepted' && (
                                  <button
                                    onClick={() => onAcceptProposal(prob, prop)}
                                    className="px-2.5 py-1 text-xs font-semibold text-white bg-[#1FAE7C] hover:bg-[#188B63] rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                                    title="Accept proposal and initialize collaboration workspace"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Accept & Launch Workspace</span>
                                  </button>
                                )}

                                {onOpenChatForProblem && (
                                  <button
                                    onClick={() => onOpenChatForProblem(prob)}
                                    className="px-2.5 py-1 text-xs font-semibold text-[#14162B] bg-[#F4F4F7] hover:bg-[#E5E4EE] rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    <MessageSquare className="w-3 h-3 text-[#5B4FE9]" />
                                    <span>Chat</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <span className="text-xs text-[#8B8DA3]">
            Logged in as <strong className="text-[#14162B]">{userProfile.fullName}</strong> ({userProfile.institution})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#D6D4EA] text-xs font-semibold text-[#14162B] hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
