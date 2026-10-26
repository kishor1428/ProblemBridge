import React, { useState } from 'react';
import { ConnectionRequest } from '../types';
import {
  X,
  CheckCircle2,
  XCircle,
  MessageSquare,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Briefcase,
  Clock,
  Code,
  Github,
  Linkedin,
  MapPin,
  Check
} from 'lucide-react';

interface CandidateProfileAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ConnectionRequest | null;
  onApprove: (requestId: string, note?: string) => void;
  onDecline: (requestId: string) => void;
  onOpenChat: (problemId: string) => void;
}

export const CandidateProfileAnalysisModal: React.FC<CandidateProfileAnalysisModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onDecline,
  onOpenChat,
}) => {
  const [responseNote, setResponseNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [justApproved, setJustApproved] = useState(false);

  if (!isOpen || !request) return null;

  const initials = request.senderName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleApproveClick = () => {
    setIsProcessing(true);
    onApprove(request.id, responseNote.trim() || undefined);
    setTimeout(() => {
      setIsProcessing(false);
      setJustApproved(true);
    }, 350);
  };

  const handleDeclineClick = () => {
    onDecline(request.id);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E7F3] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header Banner */}
        <div className="relative bg-gradient-to-r from-[#14162B] via-[#1E2046] to-[#2E1E57] text-white p-5 sm:p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close candidate analysis"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5B4FE9]/40 text-[#C7C3FA] border border-[#5B4FE9]/60">
              <ShieldCheck className="w-3 h-3 text-[#1FAE7C]" />
              <span>Candidate Profile Analysis</span>
            </span>
            <span className="text-white/40 text-xs">·</span>
            <span className="text-xs text-white/70">Review credentials before granting chat access</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#5B4FE9] to-[#8B7FF5] text-white font-display text-2xl font-bold flex items-center justify-center shadow-lg border-2 border-white/20">
                {initials}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1FAE7C] border-2 border-[#14162B] flex items-center justify-center text-white shadow-xs"
                title="Verified Student Innovator"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                  {request.senderName}
                </h2>
                <span className="text-[10px] font-bold bg-[#1FAE7C]/20 text-[#34D399] border border-[#1FAE7C]/40 px-2 py-0.5 rounded-full">
                  Verified Builder
                </span>
              </div>

              <p className="text-xs sm:text-sm text-white/80 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
                <GraduationCap className="w-3.5 h-3.5 text-[#A59CF8] shrink-0" />
                <span>{request.senderDegree || 'Student Engineer'}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/90">{request.senderInstitution}</span>
              </p>

              <div className="flex items-center gap-2 mt-2">
                {request.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF6E7] text-[#B45309]">
                    <Clock className="w-3 h-3 text-[#F59E0B]" />
                    <span>Requires Your Approval</span>
                  </span>
                )}
                {request.status === 'approved' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E4F6EE] text-[#1FAE7C]">
                    <CheckCircle2 className="w-3 h-3 text-[#1FAE7C]" />
                    <span>Approved & Chat Unlocked</span>
                  </span>
                )}
                {request.status === 'declined' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FBE9EC] text-[#D6455A]">
                    <XCircle className="w-3 h-3 text-[#D6455A]" />
                    <span>Request Declined</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#14162B] flex-1">
          
          {/* Target Challenge & Builder's Pitch Message */}
          <div className="p-4 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F3]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B4FE9] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Applied For: {request.problemTitle}</span>
              </span>
              <span className="text-[10px] text-[#8B8DA3]">Requested {request.createdAt}</span>
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              {request.intentType === 'have_solution' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1FAE7C] bg-[#E4F6EE] px-2.5 py-1 rounded-lg border border-[#1FAE7C]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Intent: "I Have a Working Solution"
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B4FE9] bg-[#EFEDFC] px-2.5 py-1 rounded-lg border border-[#5B4FE9]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Intent: "I'm Interested in Solving This"
                </span>
              )}
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E8E7F3] text-xs text-[#14162B] leading-relaxed shadow-2xs">
              <strong className="block text-[11px] font-semibold text-[#8B8DA3] mb-1 uppercase">Candidate Note to Owner:</strong>
              <p className="italic">"{request.message}"</p>
            </div>
          </div>

          {/* Academic & Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-[#E8E7F3] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">Institution & Dept</span>
                <p className="text-xs font-semibold text-[#14162B] truncate">{request.senderInstitution}</p>
                <p className="text-[11px] text-[#6B6D82] truncate">{request.senderDepartment || 'Engineering Faculty'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E8E7F3] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E4F6EE] text-[#1FAE7C] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#8B8DA3] block">Verified Email</span>
                <p className="text-xs font-semibold text-[#14162B] truncate">{request.senderEmail}</p>
                <p className="text-[11px] text-[#1FAE7C] font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Institutional verified
                </p>
              </div>
            </div>
          </div>

          {/* Technical Skills & Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B8DA3] mb-2 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#5B4FE9]" />
              <span>Demonstrated Skills & Tech Stack</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(request.senderSkills && request.senderSkills.length > 0
                ? request.senderSkills
                : ['Python', 'Sensors', 'ESP32', 'React Native', 'Low-power Firmware', 'MQTT']
              ).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FAFAF9] text-[#14162B] border border-[#E8E7F3] shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bio & Background */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B8DA3] mb-1.5">
              Innovator Background
            </h4>
            <p className="text-xs text-[#4A4C63] leading-relaxed bg-[#FAFAF9] p-3.5 rounded-xl border border-[#E8E7F3]">
              {request.senderBio ||
                'Final-year student innovator with proven project work in IoT, hardware prototypes, and embedded system design for rural and MSME applications.'}
            </p>
          </div>

          {/* External Verification Links */}
          <div className="flex items-center gap-3 pt-1">
            {request.senderGithub && (
              <a
                href={request.senderGithub}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFAF9] border border-[#E8E7F3] hover:border-[#14162B] text-xs font-semibold text-[#14162B] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repositories</span>
                <ExternalLink className="w-3 h-3 text-[#8B8DA3]" />
              </a>
            )}
            {request.senderLinkedin && (
              <a
                href={request.senderLinkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFAF9] border border-[#E8E7F3] hover:border-[#0077B5] text-xs font-semibold text-[#0077B5] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 text-[#8B8DA3]" />
              </a>
            )}
          </div>

          {/* Optional Response Note from Owner */}
          {request.status === 'pending' && (
            <div className="pt-2 border-t border-[#E8E7F3]">
              <label className="block text-xs font-semibold text-[#14162B] mb-1">
                Welcome / Response Note (Optional)
              </label>
              <input
                type="text"
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder="e.g., Happy to connect! Please share your schematic or project repo."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8E7F3] bg-[#FAFAF9] focus:bg-white focus:border-[#5B4FE9] focus:outline-none transition-all"
              />
            </div>
          )}

        </div>

        {/* Modal Decision Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D6D4EA] text-xs font-semibold text-[#4A4C63] hover:bg-white transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {request.status === 'pending' ? (
              <>
                <button
                  type="button"
                  onClick={handleDeclineClick}
                  className="px-4 py-2 rounded-xl border border-[#D6455A]/30 hover:border-[#D6455A] hover:bg-[#FBE9EC] text-xs font-semibold text-[#D6455A] transition-all cursor-pointer"
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  onClick={handleApproveClick}
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-[#1FAE7C] hover:bg-[#189669] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Granting Permission...' : 'Approve & Unlock Direct Chat'}</span>
                </button>
              </>
            ) : request.status === 'approved' ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChat(request.problemId);
                }}
                className="px-5 py-2 rounded-xl bg-[#5B4FE9] hover:bg-[#4C40DC] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Direct Chat Thread</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApproveClick}
                className="px-4 py-2 rounded-xl border border-[#1FAE7C] text-[#1FAE7C] hover:bg-[#E4F6EE] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Re-Approve Request</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
