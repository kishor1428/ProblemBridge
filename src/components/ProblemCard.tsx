import React from 'react';
import { Problem, ConnectionRequest } from '../types';
import { Building, ArrowUpRight, Users, User, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  onSelect: (problem: Problem) => void;
  onQuickApply: (problem: Problem, e: React.MouseEvent) => void;
  onViewOwnerProfile?: (problem: Problem, e: React.MouseEvent) => void;
  connectionRequest?: ConnectionRequest | null;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onSelect,
  onQuickApply,
  onViewOwnerProfile,
  connectionRequest,
}) => {
  const ownerName = problem.ownerName || problem.mentorName || 'Problem Owner';
  const ownerTitle = problem.ownerTitle || problem.mentorTitle || 'Plant Operations Lead';
  const ownerInitials = (ownerName || 'PO')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('') || 'PO';

  const skillsList = Array.isArray(problem.skills) ? problem.skills : [];
  const safeBudget = typeof problem.budget === 'number' ? problem.budget : Number(problem.budget) || 0;

  return (
    <div
      onClick={() => onSelect(problem)}
      className="bg-white border border-[#E8E7F3] hover:border-[#5B4FE9]/60 rounded-2xl p-5 shadow-[0_1px_3px_rgba(20,22,43,0.03),0_8px_20px_-8px_rgba(20,22,43,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(20,22,43,0.12)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between text-xs text-[#8B8DA3] mb-2.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-[#5B4FE9]">{problem.category || 'General'}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{problem.location || 'Tamil Nadu'}</span>
          </div>
          <span className="shrink-0">{problem.postedTime || 'Recently'}</span>
        </div>

        {/* Problem Title */}
        <h3 className="font-display text-base sm:text-lg font-bold text-[#14162B] group-hover:text-[#5B4FE9] transition-colors leading-snug mb-2 line-clamp-2">
          {problem.title}
        </h3>

        {/* Organization Name with icon */}
        <div className="flex items-center gap-1.5 text-xs text-[#4A4C63] font-medium mb-3 truncate">
          <Building className="w-3.5 h-3.5 text-[#8B8DA3] shrink-0" />
          <span className="truncate">{problem.organization || 'Organization'}</span>
        </div>

        {/* Short description or pain point snippet */}
        <p className="text-xs text-[#6B6D82] line-clamp-2 mb-3 leading-relaxed">
          {problem.painPoint || problem.description || 'Challenge description'}
        </p>

        {/* Skills List */}
        <div className="flex gap-1.5 flex-wrap mb-3.5">
          {skillsList.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F4F4F7] text-[#4A4C63] border border-[#E8E7F3]/60"
            >
              {skill}
            </span>
          ))}
          {skillsList.length > 3 && (
            <span className="text-[10px] text-[#8B8DA3] self-center">
              +{skillsList.length - 3} more
            </span>
          )}
        </div>

        {/* Problem Owner Profile Snippet & Quick Connect */}
        <div
          onClick={(e) => {
            if (onViewOwnerProfile) {
              e.stopPropagation();
              onViewOwnerProfile(problem, e);
            }
          }}
          className="p-2.5 rounded-xl bg-[#F8F7FD] hover:bg-[#EFEDFC] border border-[#E8E7F3] hover:border-[#5B4FE9]/40 transition-colors flex items-center justify-between gap-2.5 mb-3.5 cursor-pointer group/owner"
          title="Click to check problem owner profile and send message request"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#5B4FE9] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {ownerInitials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#14162B] group-hover/owner:text-[#5B4FE9] transition-colors truncate">
                  {ownerName}
                </span>
                <ShieldCheck className="w-3 h-3 text-[#1FAE7C] shrink-0" />
              </div>
              <div className="text-[10px] text-[#6B6D82] truncate">
                {ownerTitle}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1">
            {connectionRequest?.status === 'approved' ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4F6EE] text-[#1FAE7C] border border-[#1FAE7C]/30 flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Chat Ready</span>
              </span>
            ) : connectionRequest?.status === 'pending' ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF6E7] text-[#B45309] border border-[#F59E0B]/30 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                <span>Pending</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold text-[#5B4FE9] hover:underline flex items-center gap-0.5">
                <span>View Profile</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Honorarium Budget & Apply Actions */}
      <div className="flex items-center justify-between border-t border-[#F0EFF8] pt-3 mt-auto">
        <div>
          <div className="text-[10px] uppercase font-semibold tracking-wider text-[#8B8DA3]">
            Honorarium
          </div>
          <div className="text-base font-bold text-[#14162B] tabular-nums">
            ₹{safeBudget.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#8B8DA3] flex items-center gap-1">
            <Users className="w-3 h-3 text-[#8B8DA3]" />
            <span>{problem.interestedCount ?? 0}</span>
          </span>

          <button
            type="button"
            onClick={(e) => onQuickApply(problem, e)}
            className="text-xs font-bold text-[#5B4FE9] bg-[#EFEDFC] hover:bg-[#5B4FE9] hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Apply</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
