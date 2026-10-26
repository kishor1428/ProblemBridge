import React, { useState } from 'react';
import { NotificationItem, ConnectionRequest } from '../types';
import {
  X,
  Bell,
  MessageSquare,
  Briefcase,
  FileText,
  CheckCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  UserCheck,
  GraduationCap,
  Eye,
  Check
} from 'lucide-react';
import { CandidateProfileAnalysisModal } from './CandidateProfileAnalysisModal';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  connectionRequests?: ConnectionRequest[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (item: NotificationItem) => void;
  onApproveRequest?: (requestId: string, note?: string) => void;
  onDeclineRequest?: (requestId: string) => void;
  onOpenChatForProblem?: (problemId: string) => void;
  onOpenMessages?: () => void;
  onOpenPostedProblems?: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  connectionRequests = [],
  onMarkAllAsRead,
  onNotificationClick,
  onApproveRequest,
  onDeclineRequest,
  onOpenChatForProblem,
  onOpenMessages,
  onOpenPostedProblems,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');
  const [analyzingRequest, setAnalyzingRequest] = useState<ConnectionRequest | null>(null);

  if (!isOpen) return null;

  const pendingRequests = connectionRequests.filter((r) => r.status === 'pending');
  const unreadNotifs = notifications.filter((n) => !n.read);
  const totalAlerts = unreadNotifs.length + pendingRequests.length;

  const handleInspectRequest = (req: ConnectionRequest) => {
    setAnalyzingRequest(req);
  };

  const handleNotificationItemClick = (item: NotificationItem) => {
    if (item.type === 'connection_request' || item.connectionRequestId) {
      const targetReq =
        connectionRequests.find((r) => r.id === item.connectionRequestId) ||
        connectionRequests.find((r) => item.message.toLowerCase().includes(r.senderName.toLowerCase())) ||
        connectionRequests[0];
      if (targetReq) {
        setAnalyzingRequest(targetReq);
        return;
      }
    }
    onNotificationClick(item);
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 sm:pr-8 sm:pt-20 bg-black/25 backdrop-blur-2xs animate-in fade-in duration-150"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[420px] sm:max-w-[480px] bg-white rounded-3xl shadow-2xl border border-[#E8E7F3] overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-4 sm:p-4.5 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#14162B]">
                    Notifications & Alerts
                  </h3>
                  {pendingRequests.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B] text-white animate-pulse">
                      {pendingRequests.length} Request{pendingRequests.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8B8DA3]">
                  {totalAlerts > 0
                    ? `${totalAlerts} pending item${totalAlerts > 1 ? 's' : ''} requiring attention`
                    : 'All notifications caught up'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadNotifs.length > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-[#5B4FE9] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs: All Notifications vs Permission Requests */}
          <div className="flex items-center border-b border-[#E8E7F3] bg-white px-3 py-1.5 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-[#14162B] text-white shadow-xs'
                  : 'text-[#6B6D82] hover:bg-[#F4F4F7]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>All Notifications</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-[#EFEDFC] text-[#5B4FE9]'}`}>
                {notifications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-[#5B4FE9] text-white shadow-xs'
                  : 'text-[#6B6D82] hover:bg-[#F4F4F7]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Permission Requests</span>
              {pendingRequests.length > 0 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F59E0B] text-white font-bold">
                  {pendingRequests.length}
                </span>
              ) : (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-[#FAFAF9] text-[#8B8DA3]'}`}>
                  {connectionRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Pending Connection Requests Banner in 'all' tab if requests exist */}
          {activeTab === 'all' && pendingRequests.length > 0 && (
            <div className="p-3 bg-gradient-to-r from-[#FEF6E7] to-[#FFFBEB] border-b border-[#F59E0B]/30 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#92400E] leading-tight">
                    {pendingRequests.length} Permission Request{pendingRequests.length > 1 ? 's' : ''} Pending
                  </p>
                  <p className="text-[11px] text-[#B45309] truncate">
                    Review candidate profiles to grant or decline direct messaging
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#F59E0B]/40 text-[11px] font-bold text-[#B45309] hover:bg-[#FEF6E7] transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                Review Now
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className="overflow-y-auto flex-1 divide-y divide-[#E8E7F3]/70">
            {activeTab === 'requests' ? (
              /* TAB: Connection & Permission Requests */
              connectionRequests.length === 0 ? (
                <div className="p-10 text-center text-xs text-[#8B8DA3]">
                  <ShieldCheck className="w-10 h-10 mx-auto text-[#D6D4EA] mb-2" />
                  <p className="font-semibold text-sm text-[#14162B]">No permission requests yet</p>
                  <p className="text-xs text-[#8B8DA3] mt-1">
                    When student innovators request to connect via "I'm Interested" or "I Have a Solution", they appear here.
                  </p>
                </div>
              ) : (
                <div className="p-3 space-y-3">
                  {connectionRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                        req.status === 'pending'
                          ? 'border-[#F59E0B]/50 bg-gradient-to-b from-[#FFFDF9] to-white shadow-2xs'
                          : req.status === 'approved'
                          ? 'border-[#1FAE7C]/30 bg-[#F7FCF9]'
                          : 'border-[#E8E7F3] bg-white opacity-85'
                      }`}
                    >
                      {/* Top Row: Builder Identity & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B4FE9] to-[#8B7FF5] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {req.senderName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-[#14162B] truncate">
                                {req.senderName}
                              </h4>
                              <span title="Verified Builder" className="shrink-0 flex items-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1FAE7C]" />
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6B6D82] truncate flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-[#8B8DA3]" />
                              <span>{req.senderInstitution}</span>
                            </p>
                          </div>
                        </div>

                        <div>
                          {req.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF6E7] text-[#B45309] border border-[#F59E0B]/30 whitespace-nowrap">
                              <Clock className="w-2.5 h-2.5 text-[#F59E0B]" />
                              <span>Pending</span>
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E4F6EE] text-[#1FAE7C] border border-[#1FAE7C]/30 whitespace-nowrap">
                              <Check className="w-2.5 h-2.5" />
                              <span>Approved</span>
                            </span>
                          )}
                          {req.status === 'declined' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FBE9EC] text-[#D6455A] border border-[#D6455A]/30 whitespace-nowrap">
                              <X className="w-2.5 h-2.5" />
                              <span>Declined</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pitch & Challenge Context */}
                      <div className="p-2.5 rounded-xl bg-[#F8F7FD] border border-[#E8E7F3]/70 text-xs">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[11px] font-bold text-[#5B4FE9] truncate">
                            {req.problemTitle}
                          </span>
                          <span className="text-[10px] text-[#8B8DA3] shrink-0">{req.createdAt}</span>
                        </div>
                        <div className="mb-1.5">
                          {req.intentType === 'have_solution' ? (
                            <span className="text-[10px] font-bold text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              "I Have a Solution"
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-[#5B4FE9] bg-[#EFEDFC] px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              "I'm Interested"
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#4A4C63] italic line-clamp-2">
                          "{req.message}"
                        </p>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-1 gap-2">
                        {/* Primary Button: Analyze Profile */}
                        <button
                          type="button"
                          onClick={() => handleInspectRequest(req)}
                          className="px-3 py-1.5 rounded-xl bg-[#EFEDFC] hover:bg-[#5B4FE9] text-[#5B4FE9] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          title="Analyze candidate academic details, skills & portfolio"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Analyze Profile</span>
                        </button>

                        {/* Quick Action Decision Buttons */}
                        {req.status === 'pending' ? (
                          <div className="flex items-center gap-1.5">
                            {onDeclineRequest && (
                              <button
                                type="button"
                                onClick={() => onDeclineRequest(req.id)}
                                className="px-2.5 py-1.5 rounded-xl border border-[#D6455A]/30 text-xs font-semibold text-[#D6455A] hover:bg-[#FBE9EC] transition-colors cursor-pointer"
                                title="Reject connection request"
                              >
                                Reject
                              </button>
                            )}
                            {onApproveRequest && (
                              <button
                                type="button"
                                onClick={() => onApproveRequest(req.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#1FAE7C] hover:bg-[#189669] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                                title="Approve permission & unlock direct chat"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}
                          </div>
                        ) : req.status === 'approved' ? (
                          onOpenChatForProblem && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenChatForProblem(req.problemId);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#5B4FE9] hover:bg-[#4C40DC] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Open Chat</span>
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] text-[#8B8DA3]">Request Declined</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* TAB: All Notifications */
              notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8B8DA3]">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((item) => {
                  const isProposal = item.type === 'proposal';
                  const isMessage = item.type === 'message';
                  const isConnReq = item.type === 'connection_request';

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationItemClick(item)}
                      className={`p-3.5 sm:p-4 transition-colors cursor-pointer hover:bg-[#F4F4F7] flex items-start gap-3 ${
                        !item.read ? 'bg-[#EFEDFC]/35' : 'bg-white'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isConnReq ? (
                          <div className="w-8 h-8 rounded-xl bg-[#FEF6E7] text-[#D97706] border border-[#F59E0B]/30 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        ) : isMessage ? (
                          <div className="w-8 h-8 rounded-xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                        ) : isProposal ? (
                          <div className="w-8 h-8 rounded-xl bg-[#E4F6EE] text-[#1FAE7C] flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-[#FAFAF9] text-[#4A4C63] border border-[#D6D4EA] flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-[#5B4FE9]" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-[#14162B] leading-tight">
                            {item.title}
                          </h4>
                          {!item.read && (
                            <span className="w-2 h-2 rounded-full bg-[#5B4FE9] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-[#4A4C63] mt-1 leading-snug">
                          {item.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-[#8B8DA3]">
                            {item.time}
                          </span>
                          <span className="text-[11px] text-[#5B4FE9] font-bold hover:underline flex items-center gap-1">
                            {isConnReq ? 'Analyze & Approve →' : isMessage ? 'Open Chat →' : isProposal ? 'Inspect Proposal →' : 'View Details →'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>

          {/* Footer Quick Navigation */}
          <div className="p-3 bg-[#FAFAF9] border-t border-[#E8E7F3] flex items-center justify-between gap-2">
            {onOpenPostedProblems && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPostedProblems();
                }}
                className="text-xs font-semibold text-[#5B4FE9] hover:text-[#4C40DC] flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-[#EFEDFC] transition-colors cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>My Challenges</span>
              </button>
            )}

            {onOpenMessages && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMessages();
                }}
                className="text-xs font-semibold text-[#4A4C63] hover:text-[#5B4FE9] flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#5B4FE9]" />
                <span>Open Chats</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Profile Analysis Modal (invoked from notification item or Analyze Profile button) */}
      <CandidateProfileAnalysisModal
        isOpen={!!analyzingRequest}
        onClose={() => setAnalyzingRequest(null)}
        request={analyzingRequest}
        onApprove={(reqId, note) => {
          if (onApproveRequest) onApproveRequest(reqId, note);
        }}
        onDecline={(reqId) => {
          if (onDeclineRequest) onDeclineRequest(reqId);
        }}
        onOpenChat={(probId) => {
          setAnalyzingRequest(null);
          onClose();
          if (onOpenChatForProblem) onOpenChatForProblem(probId);
        }}
      />
    </>
  );
};
