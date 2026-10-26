import React, { useState } from 'react';
import {
  X,
  Settings,
  Bell,
  Shield,
  User,
  Sliders,
  LogOut,
  CheckCircle2,
  Volume2,
  Mail,
  Repeat,
  Sparkles,
  Briefcase,
  Globe,
  Lock,
  Download,
  Trash2,
  Smartphone,
  Eye,
  FileText,
  BadgeCheck,
  Check,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  userRole: 'builder' | 'owner';
  onToggleUserRole: () => void;
  onOpenAccountDetails: () => void;
  onOpenPostedProblems: () => void;
  onLogout: () => void;
  onLogoutToLogin?: () => void;
  onLogoutToRegister?: () => void;
}

type SettingsTab =
  | 'profile'
  | 'role'
  | 'notifications'
  | 'challenges'
  | 'privacy'
  | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  userRole,
  onToggleUserRole,
  onOpenAccountDetails,
  onOpenPostedProblems,
  onLogout,
  onLogoutToLogin,
  onLogoutToRegister,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('role');
  
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [proposalAlerts, setProposalAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopPush, setDesktopPush] = useState(false);
  const [digestFrequency, setDigestFrequency] = useState<'realtime' | 'daily' | 'weekly'>('realtime');
  
  // Preferences
  const [regionalCluster, setRegionalCluster] = useState('Coimbatore & Western Tamil Nadu');
  const [currency, setCurrency] = useState('INR');
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  
  // Privacy
  const [publicProfile, setPublicProfile] = useState(true);
  const [hideRollNumber, setHideRollNumber] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Feedback toast
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback(null);
    }, 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `problembridge_profile_${userProfile.fullName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerFeedback('Profile JSON exported successfully!');
  };

  const handleClearCache = () => {
    localStorage.removeItem('pb_threads');
    localStorage.removeItem('pb_notifications');
    triggerFeedback('Temporary chat and notification cache cleared!');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#E8E7F3] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-[#14162B] leading-tight">
                Settings & Preferences
              </h3>
              <p className="text-xs text-[#8B8DA3]">
                Manage role mode, notification digests, privacy, and posted challenge tracking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {feedback && (
          <div className="px-6 py-2 bg-[#E4F6EE] border-b border-[#1FAE7C]/30 text-[#1FAE7C] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Modal Layout: Sidebar Tabs + Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Navigation Sidebar */}
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#E8E7F3] bg-[#FAFAF9]/60 p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
            <button
              onClick={() => setActiveTab('role')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap shrink-0 w-full ${
                activeTab === 'role'
                  ? 'bg-[#5B4FE9] text-white shadow-xs'
                  : 'text-[#4A4C63] hover:bg-[#EFEDFC]/60 hover:text-[#5B4FE9]'
              }`}
            >
              <Repeat className="w-4 h-4 shrink-0" />
              <span>Platform Mode & Role</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap shrink-0 w-full ${
                activeTab === 'challenges'
                  ? 'bg-[#5B4FE9] text-white shadow-xs'
                  : 'text-[#4A4C63] hover:bg-[#EFEDFC]/60 hover:text-[#5B4FE9]'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Posted Challenges</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap shrink-0 w-full ${
                activeTab === 'notifications'
                  ? 'bg-[#5B4FE9] text-white shadow-xs'
                  : 'text-[#4A4C63] hover:bg-[#EFEDFC]/60 hover:text-[#5B4FE9]'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Alerts & Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap shrink-0 w-full ${
                activeTab === 'profile'
                  ? 'bg-[#5B4FE9] text-white shadow-xs'
                  : 'text-[#4A4C63] hover:bg-[#EFEDFC]/60 hover:text-[#5B4FE9]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Account & Identity</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap shrink-0 w-full ${
                activeTab === 'privacy'
                  ? 'bg-[#5B4FE9] text-white shadow-xs'
                  : 'text-[#4A4C63] hover:bg-[#EFEDFC]/60 hover:text-[#5B4FE9]'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Privacy & Security</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap shrink-0 w-full ${
                activeTab === 'data'
                  ? 'bg-[#5B4FE9] text-white shadow-xs'
                  : 'text-[#4A4C63] hover:bg-[#EFEDFC]/60 hover:text-[#5B4FE9]'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Data & Session</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* TAB 1: Role & Platform Mode */}
            {activeTab === 'role' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-sm font-bold text-[#14162B]">
                    Active Platform Role & Experience
                  </h4>
                  <p className="text-xs text-[#8B8DA3] mt-0.5">
                    Toggle your operational view between solution builder and challenge host
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      if (userRole !== 'builder') onToggleUserRole();
                      triggerFeedback('Switched to Student Builder Mode');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      userRole === 'builder'
                        ? 'border-[#5B4FE9] bg-[#EFEDFC]/40 ring-2 ring-[#5B4FE9]/20'
                        : 'border-[#E8E7F3] bg-white hover:bg-[#FAFAF9]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5B4FE9]">
                        Student Builder Mode
                      </span>
                      {userRole === 'builder' && (
                        <span className="w-5 h-5 rounded-full bg-[#5B4FE9] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#4A4C63] mt-2 leading-relaxed">
                      Discover problems, submit hardware & software proposals, receive honorariums, and build with mentors.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      if (userRole !== 'owner') onToggleUserRole();
                      triggerFeedback('Switched to Organization / Challenge Host Mode');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      userRole === 'owner'
                        ? 'border-[#5B4FE9] bg-[#EFEDFC]/40 ring-2 ring-[#5B4FE9]/20'
                        : 'border-[#E8E7F3] bg-white hover:bg-[#FAFAF9]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5B4FE9]">
                        Problem Owner / Host Mode
                      </span>
                      {userRole === 'owner' && (
                        <span className="w-5 h-5 rounded-full bg-[#5B4FE9] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#4A4C63] mt-2 leading-relaxed">
                      Post operational bottlenecks, set prototype budgets, review builder submissions, and inspect milestone deliverables.
                    </p>
                  </div>
                </div>

                {/* Regional Cluster Selector */}
                <div className="p-4 rounded-2xl border border-[#E8E7F3] bg-[#FAFAF9] space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#5B4FE9]" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#14162B]">
                      Preferred Regional Innovation Cluster
                    </h5>
                  </div>
                  <p className="text-xs text-[#8B8DA3]">
                    Prioritize local hardware testing facilities and industrial visits in your state.
                  </p>
                  <select
                    value={regionalCluster}
                    onChange={(e) => {
                      setRegionalCluster(e.target.value);
                      triggerFeedback(`Regional cluster set to: ${e.target.value}`);
                    }}
                    className="w-full text-xs font-medium p-2.5 bg-white border border-[#D6D4EA] rounded-xl outline-none focus:border-[#5B4FE9]"
                  >
                    <option value="Coimbatore & Western Tamil Nadu">Coimbatore & Western Tamil Nadu (Industrial Corridor)</option>
                    <option value="Chennai & Sriperumbudur">Chennai & Sriperumbudur (Automotive & Electronics)</option>
                    <option value="Bangalore Urban & Rural">Bangalore (Tech & Aerospace Hub)</option>
                    <option value="All India & Global">All India & Nationwide Remote</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 2: Posted Challenges Tracking Quick Link */}
            {activeTab === 'challenges' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-sm font-bold text-[#14162B]">
                    Posted Challenges & Status Management
                  </h4>
                  <p className="text-xs text-[#8B8DA3] mt-0.5">
                    Track the lifecycle and applicant milestones for every problem you have published
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#EFEDFC] via-[#FAFAF9] to-white border border-[#D6D4EA] space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B4FE9] bg-white px-2 py-0.5 rounded-md border border-[#D6D4EA]">
                        Live Tracker
                      </span>
                      <h5 className="text-base font-bold text-[#14162B] mt-2">
                        My Posted Challenges Dashboard
                      </h5>
                      <p className="text-xs text-[#4A4C63] mt-1 max-w-lg leading-relaxed">
                        View all submitted problems, switch statuses (Open, Under Review, In Progress, Handover Completed), and review applicant proposals directly.
                      </p>
                    </div>
                    <Briefcase className="w-8 h-8 text-[#5B4FE9] shrink-0" />
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenPostedProblems();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#5B4FE9] text-white text-xs font-semibold hover:bg-[#4C40DC] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Open My Posted Problem Status Tracker</span>
                  </button>
                </div>

                {/* Posting preferences */}
                <div className="p-4 rounded-2xl border border-[#E8E7F3] space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#14162B]">
                    Submission & Draft Preferences
                  </h5>
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAFAF9] cursor-pointer">
                    <div>
                      <strong className="text-xs text-[#14162B] block">Auto-save Drafts</strong>
                      <span className="text-[11px] text-[#8B8DA3]">Retain problem draft text locally during typing</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoSaveDrafts}
                      onChange={(e) => {
                        setAutoSaveDrafts(e.target.checked);
                        triggerFeedback('Auto-save preference saved');
                      }}
                      className="w-4 h-4 accent-[#5B4FE9] rounded"
                    />
                  </label>

                  <div className="p-2 flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-[#14162B] block">Default Honorarium Currency</strong>
                      <span className="text-[11px] text-[#8B8DA3]">Standard currency for milestone payouts</span>
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => {
                        setCurrency(e.target.value);
                        triggerFeedback(`Currency updated to ${e.target.value}`);
                      }}
                      className="text-xs font-medium px-2.5 py-1.5 bg-[#FAFAF9] border border-[#D6D4EA] rounded-lg outline-none"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Alerts & Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-sm font-bold text-[#14162B]">
                    Alerts & Notification Channels
                  </h4>
                  <p className="text-xs text-[#8B8DA3] mt-0.5">
                    Customize how and when you receive communications from problem hosts and solvers
                  </p>
                </div>

                <div className="space-y-2 border border-[#E8E7F3] rounded-2xl p-4 bg-white">
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAFAF9] cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-[#5B4FE9] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-xs text-[#14162B] block">Email Notifications</strong>
                        <span className="text-[11px] text-[#8B8DA3]">
                          Alerts when proposals are submitted, reviewed, or approved
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#5B4FE9] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAFAF9] cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Bell className="w-4 h-4 text-[#5B4FE9] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-xs text-[#14162B] block">Chat & Direct Message Alerts</strong>
                        <span className="text-[11px] text-[#8B8DA3]">
                          Real-time notification when a mentor or builder replies in discussion
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={proposalAlerts}
                      onChange={(e) => setProposalAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#5B4FE9] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAFAF9] cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Volume2 className="w-4 h-4 text-[#5B4FE9] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-xs text-[#14162B] block">In-App Audio Chimes</strong>
                        <span className="text-[11px] text-[#8B8DA3]">
                          Play subtle acoustic sound when new messages or notifications arrive
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#5B4FE9] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAFAF9] cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-4 h-4 text-[#5B4FE9] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-xs text-[#14162B] block">Browser Desktop Push</strong>
                        <span className="text-[11px] text-[#8B8DA3]">
                          Receive desktop push banner when background tab is idle
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={desktopPush}
                      onChange={(e) => {
                        setDesktopPush(e.target.checked);
                        if (e.target.checked && 'Notification' in window) {
                          Notification.requestPermission();
                        }
                      }}
                      className="w-4 h-4 accent-[#5B4FE9] rounded"
                    />
                  </label>
                </div>

                {/* Digest Frequency */}
                <div className="p-4 rounded-2xl border border-[#E8E7F3] bg-[#FAFAF9] space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#14162B]">
                    Email Digest Frequency
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'realtime', label: 'Real-time Instant' },
                      { id: 'daily', label: 'Daily Digest' },
                      { id: 'weekly', label: 'Weekly Summary' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setDigestFrequency(item.id as any);
                          triggerFeedback(`Digest frequency set to ${item.label}`);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          digestFrequency === item.id
                            ? 'bg-white text-[#5B4FE9] border-[#5B4FE9] shadow-xs'
                            : 'bg-white/60 text-[#4A4C63] border-[#E8E7F3] hover:bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Account & Identity */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-sm font-bold text-[#14162B]">
                    Account & Verified Identity
                  </h4>
                  <p className="text-xs text-[#8B8DA3] mt-0.5">
                    Your institutional credentials and builder portfolio links
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E8E7F3] bg-[#FAFAF9] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#5B4FE9] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {userProfile.fullName ? userProfile.fullName.slice(0, 2).toUpperCase() : 'SV'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-sm font-bold text-[#14162B]">
                          {userProfile.fullName}
                        </h5>
                        <BadgeCheck className="w-4 h-4 text-[#1FAE7C]" />
                      </div>
                      <p className="text-xs text-[#8B8DA3]">
                        {userProfile.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E8E7F3]">
                    <div>
                      <span className="text-[#8B8DA3] block text-[10px] uppercase font-bold">Institution</span>
                      <strong className="text-[#14162B]">{userProfile.institution}</strong>
                    </div>
                    <div>
                      <span className="text-[#8B8DA3] block text-[10px] uppercase font-bold">Roll / ID Number</span>
                      <strong className="text-[#14162B]">{userProfile.rollNo}</strong>
                    </div>
                    <div>
                      <span className="text-[#8B8DA3] block text-[10px] uppercase font-bold">Department</span>
                      <strong className="text-[#14162B]">{userProfile.department}</strong>
                    </div>
                    <div>
                      <span className="text-[#8B8DA3] block text-[10px] uppercase font-bold">Posting Authorization</span>
                      <strong className="text-[#1FAE7C]">Full Posting Rights Enabled</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenAccountDetails();
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-white border border-[#D6D4EA] text-[#5B4FE9] text-xs font-semibold hover:border-[#5B4FE9] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Edit Personal & Registration Details</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: Privacy & Security */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-sm font-bold text-[#14162B]">
                    Privacy & Profile Visibility
                  </h4>
                  <p className="text-xs text-[#8B8DA3] mt-0.5">
                    Control what external mentors and peer builders can view on your public submissions
                  </p>
                </div>

                <div className="space-y-2 border border-[#E8E7F3] rounded-2xl p-4 bg-white">
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAFAF9] cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Eye className="w-4 h-4 text-[#5B4FE9] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-xs text-[#14162B] block">Public Builder Portfolio</strong>
                        <span className="text-[11px] text-[#8B8DA3]">
                          Allow verified problem owners to view your verified skills and past solutions
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={publicProfile}
                      onChange={(e) => {
                        setPublicProfile(e.target.checked);
                        triggerFeedback(`Public profile ${e.target.checked ? 'enabled' : 'hidden'}`);
                      }}
                      className="w-4 h-4 accent-[#5B4FE9] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAFAF9] cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-[#5B4FE9] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-xs text-[#14162B] block">Mask Roll Number on Public Proposals</strong>
                        <span className="text-[11px] text-[#8B8DA3]">
                          Only show college name without exact student registration roll number
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hideRollNumber}
                      onChange={(e) => {
                        setHideRollNumber(e.target.checked);
                        triggerFeedback(`Roll number masking ${e.target.checked ? 'activated' : 'deactivated'}`);
                      }}
                      className="w-4 h-4 accent-[#5B4FE9] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAFAF9] cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Lock className="w-4 h-4 text-[#5B4FE9] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-xs text-[#14162B] block">Institutional Two-Factor Authentication</strong>
                        <span className="text-[11px] text-[#8B8DA3]">
                          Verify via college OTP or biometric authentication on new device sign-ins
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => {
                        setTwoFactorAuth(e.target.checked);
                        triggerFeedback(`Two-factor auth ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                      className="w-4 h-4 accent-[#5B4FE9] rounded"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 6: Data, Storage & Session */}
            {activeTab === 'data' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-sm font-bold text-[#14162B]">
                    Data Export & Local Storage
                  </h4>
                  <p className="text-xs text-[#8B8DA3] mt-0.5">
                    Manage cached discussions, offline storage, and session termination
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E8E7F3] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-[#14162B] block">Export Profile & Records</strong>
                      <span className="text-[11px] text-[#8B8DA3]">Download your verified profile as standard JSON</span>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#D6D4EA] text-xs font-semibold text-[#14162B] hover:border-[#5B4FE9] hover:text-[#5B4FE9] transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#5B4FE9]" />
                      <span>Export JSON</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E8E7F3]">
                    <div>
                      <strong className="text-xs text-[#14162B] block">Clear Discussion Cache</strong>
                      <span className="text-[11px] text-[#8B8DA3]">Refresh stored local chat threads & notifications</span>
                    </div>
                    <button
                      onClick={handleClearCache}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#D6D4EA] text-xs font-semibold text-[#4A4C63] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#8B8DA3]" />
                      <span>Clear Cache</span>
                    </button>
                  </div>
                </div>

                {/* Session Sign Out */}
                <div className="p-4 rounded-2xl border border-[#D6455A]/30 bg-[#FBE9EC]/40 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-[#D6455A] uppercase tracking-wider">
                      Current Session & Redirection
                    </h5>
                    <p className="text-xs text-[#4A4C63] mt-0.5">
                      Logged in as <strong>{userProfile.fullName}</strong> ({userProfile.email})
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#D6455A] hover:bg-[#C0374C] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Session</span>
                    </button>
                    <p className="text-[11px] text-[#8B8DA3] text-center mt-1.5">
                      Redirects to the gateway to choose between Sign In or Registering a new account.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <span className="text-[11px] text-[#8B8DA3]">
            ProblemBridge Platform Settings
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#D6D4EA] text-xs font-semibold text-[#4A4C63] hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                triggerFeedback('All preferences saved successfully!');
                setTimeout(onClose, 600);
              }}
              className="px-4 py-2 rounded-xl bg-[#5B4FE9] text-white text-xs font-semibold hover:bg-[#4C40DC] transition-colors shadow-xs"
            >
              Save All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
