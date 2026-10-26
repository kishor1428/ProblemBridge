import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Bell,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Building,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Edit3,
  UserPlus,
  FileText,
  PlusCircle,
  Repeat,
  LogOut,
  LogIn,
  Sparkles,
  User,
  Settings,
  Briefcase,
  Plus
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNavDrawer: () => void;
  onOpenMessages: () => void;
  onOpenNotifications: () => void;
  onOpenPostProblem: () => void;
  onOpenMyProposals: () => void;
  onOpenPostedProblems: () => void;
  onOpenRegistrationModal: () => void;
  onOpenSettings: () => void;
  onRegisterNewAccount: () => void;
  onLogout: () => void;
  onLogin: () => void;
  onOpenLogin: () => void;
  userProfile: UserProfile;
  notifications: NotificationItem[];
  unreadMessagesCount: number;
  userRole: 'builder' | 'owner';
  onToggleUserRole: () => void;
  isNotificationsOpen?: boolean;
  isMessagesOpen?: boolean;
  postedProblemsCount?: number;
  onOpenConnectionRequests?: () => void;
  pendingRequestsCount?: number;
  onOpenWorkspace?: () => void;
  activeWorkspaceProjectsCount?: number;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenNavDrawer,
  onOpenMessages,
  onOpenNotifications,
  onOpenPostProblem,
  onOpenMyProposals,
  onOpenPostedProblems,
  onOpenRegistrationModal,
  onOpenSettings,
  onRegisterNewAccount,
  onLogout,
  onLogin,
  onOpenLogin,
  userProfile,
  notifications,
  unreadMessagesCount,
  userRole,
  onToggleUserRole,
  isNotificationsOpen = false,
  isMessagesOpen = false,
  postedProblemsCount = 0,
  onOpenConnectionRequests,
  pendingRequestsCount = 0,
  onOpenWorkspace,
  activeWorkspaceProjectsCount = 0,
  onNavigateHome,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const isLoggedIn = userProfile.isLoggedIn !== false;

  const initials = userProfile.fullName
    ? userProfile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SV';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E7F3] min-h-[64px] sm:h-[72px]">
      <div className="w-full h-16 sm:h-[72px] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
        
        {/* Left Zone: Hamburger + ProblemBridge Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenNavDrawer}
            className="p-2 rounded-lg text-[#14162B] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] transition-colors flex flex-col justify-center gap-[5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4FE9] cursor-pointer"
            aria-label="Open navigation drawer"
            title="Menu"
          >
            <span className="block w-5 h-[2px] bg-current rounded-full"></span>
            <span className="block w-5 h-[2px] bg-current rounded-full"></span>
            <span className="block w-5 h-[2px] bg-current rounded-full"></span>
          </button>

          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
              else window.location.hash = '#/';
            }}
            className="flex items-center gap-2 sm:gap-2.5 text-decoration-none group cursor-pointer bg-transparent border-none p-0 text-left"
            title="ProblemBridge Home"
          >
            {/* Exact SVG Brand Mark */}
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 transition-transform duration-200 group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="7" cy="16" r="5" fill="#5B4FE9" />
              <circle cx="25" cy="16" r="5" fill="#1FAE7C" />
              <rect x="11" y="14.5" width="10" height="3" rx="1.5" fill="#8B7FF5" />
            </svg>
            <span className="font-display text-lg sm:text-2xl font-semibold text-[#14162B] tracking-tight whitespace-nowrap">
              ProblemBridge
            </span>
          </button>
        </div>

        {/* Center Zone: Expanded & Longer Search Bar */}
        <div className="flex-1 max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-2 sm:mx-4 md:mx-6 relative hidden sm:block">
          <div className="flex items-center gap-3 bg-[#F4F4F7] border border-[#E8E7F3] rounded-full px-4 py-2.5 transition-all duration-200 focus-within:bg-white focus-within:border-[#5B4FE9] focus-within:ring-4 focus-within:ring-[#5B4FE9]/10 focus-within:shadow-sm">
            <Search className="w-[18px] h-[18px] text-[#8B8DA3] shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search real problems, domains, categories, or skills (e.g. IoT, React, Agritech)..."
              className="w-full bg-transparent border-none outline-none font-body text-sm text-[#14162B] placeholder:text-[#8B8DA3]"
              aria-label="Search problems, domains, or skills"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="w-5 h-5 rounded-full bg-[#E5E4EE] text-[#4A4C63] hover:bg-[#D6D4EA] flex items-center justify-center text-xs shrink-0 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Zone: Notifications, Messages, and Profile Avatar Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          {/* Quick Post a Problem Header Action */}
          <button
            onClick={onOpenPostProblem}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B4FE9] hover:bg-[#4C40DC] active:scale-95 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            title="Post an operational challenge"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Problem</span>
          </button>


          {/* Notification Button with Badge (Includes updates and permission requests) */}
          <button
            onClick={onOpenNotifications}
            className={`relative p-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4FE9] cursor-pointer ${
              isNotificationsOpen
                ? 'bg-[#EFEDFC] text-[#5B4FE9] ring-2 ring-[#5B4FE9]/40'
                : 'text-[#4A4C63] hover:text-[#5B4FE9] hover:bg-[#EFEDFC]'
            }`}
            aria-label="Notifications and Connection Requests"
            title={
              pendingRequestsCount > 0
                ? `${pendingRequestsCount} pending permission request${pendingRequestsCount > 1 ? 's' : ''} & ${unreadNotifCount} notification${unreadNotifCount !== 1 ? 's' : ''}`
                : `${unreadNotifCount} new notification${unreadNotifCount !== 1 ? 's' : ''}`
            }
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-5 h-5" />
            {(unreadNotifCount + pendingRequestsCount) > 0 && (
              <span
                className={`absolute top-1.5 right-1.5 text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                  pendingRequestsCount > 0 ? 'bg-[#F59E0B] animate-pulse' : 'bg-[#5B4FE9]'
                }`}
              >
                {unreadNotifCount + pendingRequestsCount}
              </span>
            )}
          </button>

          {/* Messages Button with Badge */}
          <button
            onClick={onOpenMessages}
            className={`relative p-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4FE9] cursor-pointer ${
              isMessagesOpen
                ? 'bg-[#EFEDFC] text-[#5B4FE9] ring-2 ring-[#5B4FE9]/40'
                : 'text-[#4A4C63] hover:text-[#5B4FE9] hover:bg-[#EFEDFC]'
            }`}
            aria-label="Messages"
            title="Messages"
            aria-expanded={isMessagesOpen}
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#1FAE7C] text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar as Interactive Dropdown Trigger */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className={`flex items-center gap-2 p-1.5 rounded-full sm:rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4FE9] ${
                showProfileMenu
                  ? 'bg-[#EFEDFC] ring-2 ring-[#5B4FE9]'
                  : 'hover:bg-[#F4F4F7]'
              }`}
              title={
                isLoggedIn
                  ? `${userProfile.fullName} - Account, Settings & Logout`
                  : 'Click to Sign In or Register'
              }
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              {isLoggedIn ? (
                <div className="w-9 h-9 rounded-full bg-[#5B4FE9] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {initials}
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#F4F4F7] text-[#8B8DA3] font-semibold text-xs flex items-center justify-center border border-[#D6D4EA]">
                  Guest
                </div>
              )}
              <ChevronDown className={`w-3.5 h-3.5 text-[#8B8DA3] hidden sm:block transition-transform duration-200 ${showProfileMenu ? 'rotate-180 text-[#5B4FE9]' : ''}`} />
            </button>

            {/* Profile Dropdown Menu - Account Details, Settings & Logout (Scrollable & Responsive) */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2.5 w-[min(360px,calc(100vw-20px))] max-h-[min(80vh,560px)] overflow-y-auto overscroll-contain bg-white rounded-2xl shadow-[0_16px_40px_rgba(20,22,43,0.18)] border border-[#E8E7F3] z-50 animate-in fade-in slide-in-from-top-2 duration-150 touch-pan-y divide-y divide-[#E8E7F3]">
                
                {isLoggedIn ? (
                  <div>
                    {/* 1. Account Identity Header */}
                    <div className="p-4 bg-[#FAFAF9] border-b border-[#E8E7F3]">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#5B4FE9] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-[#14162B] truncate">
                              {userProfile.fullName}
                            </h4>
                            <span title="Verified Member" className="shrink-0 flex items-center">
                              <ShieldCheck className="w-4 h-4 text-[#1FAE7C]" />
                            </span>
                          </div>
                          <p className="text-xs text-[#8B8DA3] truncate mt-0.5">
                            {userProfile.email}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-semibold text-[#5B4FE9] bg-[#EFEDFC] px-2 py-0.5 rounded-full">
                              {userRole === 'builder' ? 'Student Builder' : 'Problem Owner'}
                            </span>
                            <span className="text-[10px] font-medium text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-full">
                              Can Post Problems
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Account Details & Settings Action Options */}
                    <div className="p-2 space-y-1">
                      
                      {/* Option: Account Details (Redirects to Account Details modal) */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenRegistrationModal();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F4F7] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 group-hover:bg-[#5B4FE9] group-hover:text-white transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-xs font-semibold text-[#14162B] block leading-tight">
                              Account Details
                            </strong>
                            <span className="text-[11px] text-[#8B8DA3]">
                              View & edit personal, academic, & skills info
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>

                      {/* Option: Settings (Redirects to Settings modal) */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenSettings();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F4F7] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] text-[#4A4C63] flex items-center justify-center shrink-0 group-hover:bg-[#EFEDFC] group-hover:text-[#5B4FE9] transition-colors">
                            <Settings className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-xs font-semibold text-[#14162B] block leading-tight">
                              Settings
                            </strong>
                            <span className="text-[11px] text-[#8B8DA3]">
                              Preferences, alerts & switch role mode
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>

                      {/* Option: Collaboration Workspace */}
                      {onOpenWorkspace && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onOpenWorkspace();
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F4F7] transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 group-hover:bg-[#5B4FE9] group-hover:text-white transition-colors">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <strong className="text-xs font-semibold text-[#14162B] block leading-tight">
                                  Collaboration Workspace
                                </strong>
                                {activeWorkspaceProjectsCount > 0 && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#1FAE7C] text-white rounded-full">
                                    {activeWorkspaceProjectsCount} Active
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#8B8DA3]">
                                Tasks, milestones & project files
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#8B8DA3] group-hover:text-[#5B4FE9] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      )}

                      {/* Option: My Proposals (Redirects to My Proposals modal) */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenMyProposals();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F4F7] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F4F4F7] text-[#4A4C63] flex items-center justify-center shrink-0 group-hover:bg-[#EFEDFC] group-hover:text-[#5B4FE9] transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-xs font-semibold text-[#14162B] block leading-tight">
                              My Proposals
                            </strong>
                            <span className="text-[11px] text-[#8B8DA3]">
                              Track submitted challenge solutions
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#E4F6EE] text-[#1FAE7C] font-semibold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </button>

                      {/* Option: My Posted Challenges (Redirects to My Posted Problems modal) */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenPostedProblems();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F4F7] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0 group-hover:bg-[#5B4FE9] group-hover:text-white transition-colors">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-xs font-semibold text-[#14162B] block leading-tight">
                              My Posted Challenges & Status
                            </strong>
                            <span className="text-[11px] text-[#8B8DA3]">
                              Check live status, proposals & applicants
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#EFEDFC] text-[#5B4FE9] font-bold px-2 py-0.5 rounded-full">
                          {postedProblemsCount > 0 ? `${postedProblemsCount} Posted` : 'Status'}
                        </span>
                      </button>

                      {/* Option: Connection & Permission Requests */}
                      {onOpenConnectionRequests && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onOpenConnectionRequests();
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F4F7] transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#FEF6E7] text-[#D97706] flex items-center justify-center shrink-0 group-hover:bg-[#F59E0B] group-hover:text-white transition-colors">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs font-semibold text-[#14162B] block leading-tight">
                                Connection & Permission Requests
                              </strong>
                              <span className="text-[11px] text-[#8B8DA3]">
                                Review & approve builder direct chat requests
                              </span>
                            </div>
                          </div>
                          {pendingRequestsCount > 0 ? (
                            <span className="text-[10px] bg-[#F59E0B] text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                              {pendingRequestsCount} Pending
                            </span>
                          ) : (
                            <span className="text-[10px] bg-[#F4F4F7] text-[#8B8DA3] font-semibold px-2 py-0.5 rounded-full">
                              View
                            </span>
                          )}
                        </button>
                      )}

                      {/* Option: Post a Problem Challenge (Redirects to Post Problem) */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenPostProblem();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-[#EFEDFC]/60 hover:bg-[#EFEDFC] transition-colors flex items-center justify-between group border border-[#D6D4EA]/60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#5B4FE9] text-white flex items-center justify-center shrink-0">
                            <PlusCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-xs font-semibold text-[#5B4FE9] block leading-tight">
                              Post a Problem
                            </strong>
                            <span className="text-[11px] text-[#4A4C63]">
                              All registered users can post challenges
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-white text-[#5B4FE9] font-bold px-2 py-0.5 rounded-md border border-[#D6D4EA]">
                          Post
                        </span>
                      </button>
                    </div>

                    {/* 3. Single Log Out Button (Redirects to Auth Gateway for Login/Register choices) */}
                    <div className="p-3 border-t border-[#E8E7F3] bg-[#FAFAF9]">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FBE9EC] border border-[#D6455A]/30 hover:border-[#D6455A] text-[#D6455A] text-xs font-semibold transition-all flex items-center justify-center gap-2 group shadow-2xs cursor-pointer"
                        title="Log out of your current session"
                      >
                        <LogOut className="w-4 h-4 text-[#D6455A] group-hover:-translate-x-0.5 transition-transform" />
                        <span>Log Out</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  /* GUEST / LOGGED-OUT STATE DROPDOWN */
                  <div className="p-4 space-y-3">
                    <div className="text-center py-2">
                      <div className="w-12 h-12 rounded-full bg-[#EFEDFC] text-[#5B4FE9] font-bold text-base flex items-center justify-center mx-auto mb-2 border border-[#D6D4EA]">
                        PB
                      </div>
                      <h4 className="text-sm font-semibold text-[#14162B]">
                        Welcome to ProblemBridge
                      </h4>
                      <p className="text-xs text-[#8B8DA3] mt-1">
                        Sign in or register to post problems and apply to solve challenges.
                      </p>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onRegisterNewAccount();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5B4FE9] text-white text-xs font-semibold hover:bg-[#4C40DC] transition-colors shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Register New Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenLogin();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#FAFAF9] border border-[#D6D4EA] text-xs font-semibold text-[#14162B] hover:bg-slate-100 transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#5B4FE9]" />
                        <span>Sign In to Account</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Search Row (visible on small viewports) */}
      <div className="sm:hidden px-4 pb-2.5 pt-1 bg-white border-b border-[#E8E7F3]">
        <div className="flex items-center gap-2 bg-[#F4F4F7] border border-[#E8E7F3] rounded-full px-3 py-1.5">
          <Search className="w-4 h-4 text-[#8B8DA3] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems, IoT, React, Agritech..."
            className="w-full bg-transparent border-none outline-none font-body text-xs text-[#14162B] placeholder:text-[#8B8DA3]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="w-4 h-4 rounded-full bg-[#E5E4EE] text-[#4A4C63] flex items-center justify-center text-xs"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
