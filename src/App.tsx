import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ProblemsSection } from './components/ProblemsSection';
import { ProblemDetailModal } from './components/ProblemDetailModal';
import { PostProblemModal } from './components/PostProblemModal';
import { PostProblemPage } from './components/PostProblemPage';
import { ProblemDetailPage } from './components/ProblemDetailPage';
import { ProposalModal } from './components/ProposalModal';
import { MyProposalsModal } from './components/MyProposalsModal';
import { MessagesDrawer } from './components/MessagesDrawer';
import { NotificationsDropdown } from './components/NotificationsDropdown';
import { NavDrawer } from './components/NavDrawer';
import { Footer } from './components/Footer';
import { RegistrationDetailsModal } from './components/RegistrationDetailsModal';
import { AIDoubtSolverModal } from './components/AIDoubtSolverModal';
import { SettingsModal } from './components/SettingsModal';
import { MyPostedProblemsModal } from './components/MyPostedProblemsModal';
import { LoginModal } from './components/LoginModal';
import { AuthGatewayModal } from './components/AuthGatewayModal';
import { AuthPage } from './components/AuthPage';
import { OwnerProfileModal } from './components/OwnerProfileModal';
import { ConnectionRequestsModal } from './components/ConnectionRequestsModal';
import { CollaborationWorkspaceModal } from './components/CollaborationWorkspaceModal';
import { useAuth } from './context/AuthContext';
import {
  subscribeProblems,
  subscribeProjectsForUser,
  createProjectWorkspace,
} from './firebase/dbService';
import {
  INITIAL_PROBLEMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROPOSALS,
  INITIAL_THREADS,
  INITIAL_USER_PROFILE,
  INITIAL_CONNECTION_REQUESTS,
} from './data/mockData';
import { Problem, Proposal, NotificationItem, ChatThread, UserProfile, ConnectionRequest, Project } from './types';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const { userProfile: authProfile, logout: authLogout } = useAuth();
  const [workspaceProjects, setWorkspaceProjects] = useState<Project[]>([]);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [activeWorkspaceProjectId, setActiveWorkspaceProjectId] = useState<string | null>(null);

  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem('pb_problems');
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('pb_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('pb_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('pb_threads');
    return saved ? JSON.parse(saved) : INITIAL_THREADS;
  });

  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(() => {
    const saved = localStorage.getItem('pb_connection_requests');
    return saved ? JSON.parse(saved) : INITIAL_CONNECTION_REQUESTS;
  });

  // User Profile registration state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pb_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // Category and search state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active view routing ('home' | 'post-problem' | 'problem-detail')
  const [currentView, setCurrentView] = useState<'home' | 'post-problem' | 'problem-detail'>('home');
  const [justPublishedProblemId, setJustPublishedProblemId] = useState<string | null>(null);

  // UI Modals and Drawers
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [applyingProblem, setApplyingProblem] = useState<Problem | null>(null);
  const [isPostProblemOpen, setIsPostProblemOpen] = useState(false);
  const [isMyProposalsOpen, setIsMyProposalsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isNewRegistration, setIsNewRegistration] = useState(false);
  const [isAIDoubtSolverOpen, setIsAIDoubtSolverOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMyPostedProblemsOpen, setIsMyPostedProblemsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthGatewayOpen, setIsAuthGatewayOpen] = useState(false);
  const [authGatewayInitialChoice, setAuthGatewayInitialChoice] = useState<'login' | 'register'>('login');
  const [isOwnerProfileModalOpen, setIsOwnerProfileModalOpen] = useState(false);
  const [ownerProfileProblem, setOwnerProfileProblem] = useState<Problem | null>(null);
  const [isConnectionRequestsModalOpen, setIsConnectionRequestsModalOpen] = useState(false);

  // User Authentication state: defaults to active verified profile
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('pb_user_profile');
    if (!saved) return true;
    try {
      const parsed = JSON.parse(saved);
      return parsed.isLoggedIn !== false;
    } catch {
      return true;
    }
  });
  const [authPageInitialMode, setAuthPageInitialMode] = useState<'login' | 'register'>('login');

  // User mode: 'builder' or 'owner'
  const [userRole, setUserRole] = useState<'builder' | 'owner'>(() => {
    return userProfile.role === 'owner' ? 'owner' : 'builder';
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronize with backend database on initial mount
  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        const [probsRes, propsRes, profileRes, threadsRes, notifsRes, connRes] = await Promise.all([
          fetch('/api/problems').catch(() => null),
          fetch('/api/proposals').catch(() => null),
          fetch('/api/user-profile').catch(() => null),
          fetch('/api/threads').catch(() => null),
          fetch('/api/notifications').catch(() => null),
          fetch('/api/connection-requests').catch(() => null),
        ]);

        if (probsRes && probsRes.ok) {
          const data = await probsRes.json();
          if (Array.isArray(data) && data.length > 0) setProblems(data);
        }
        if (propsRes && propsRes.ok) {
          const data = await propsRes.json();
          if (Array.isArray(data)) setProposals(data);
        }
        if (profileRes && profileRes.ok) {
          const data = await profileRes.json();
          if (data && data.fullName) {
            setUserProfile(data);
            if (data.role) setUserRole(data.role);
          }
        }
        if (threadsRes && threadsRes.ok) {
          const data = await threadsRes.json();
          if (Array.isArray(data) && data.length > 0) setChatThreads(data);
        }
        if (notifsRes && notifsRes.ok) {
          const data = await notifsRes.json();
          if (Array.isArray(data) && data.length > 0) setNotifications(data);
        }
        if (connRes && connRes.ok) {
          const data = await connRes.json();
          if (Array.isArray(data) && data.length > 0) setConnectionRequests(data);
        }
      } catch (err) {
        console.warn('Backend database fetch error, using local state:', err);
      }
    };

    fetchDatabase();
  }, []);

  // Synchronize userProfile with Firebase Auth user profile
  useEffect(() => {
    if (authProfile) {
      setUserProfile(authProfile);
      if (authProfile.role) {
        setUserRole(authProfile.role === 'owner' ? 'owner' : 'builder');
      }
      setIsAuthenticated(true);
    }
  }, [authProfile]);

  // Firestore real-time listeners for problems & collaboration workspaces
  useEffect(() => {
    const unsubProblems = subscribeProblems((loaded) => {
      if (loaded.length > 0) {
        setProblems(loaded);
      }
    });

    let unsubProjects = () => {};
    if (userProfile?.id) {
      unsubProjects = subscribeProjectsForUser(userProfile.id, (loaded) => {
        setWorkspaceProjects(loaded);
      });
    }

    return () => {
      unsubProblems();
      unsubProjects();
    };
  }, [userProfile?.id]);

  // Sync to localStorage as backup
  useEffect(() => {
    localStorage.setItem('pb_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('pb_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('pb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pb_threads', JSON.stringify(chatThreads));
  }, [chatThreads]);

  useEffect(() => {
    localStorage.setItem('pb_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('pb_connection_requests', JSON.stringify(connectionRequests));
  }, [connectionRequests]);

  // Handlers
  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    if (updatedProfile.role) {
      setUserRole(updatedProfile.role === 'owner' ? 'owner' : 'builder');
    }
    showToast(`Registration details saved! Problem posting is enabled for ${updatedProfile.fullName}.`);
    try {
      await fetch('/api/user-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
    } catch (e) {
      console.warn('Backend save profile error:', e);
    }
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setUserRole(profile.role === 'owner' ? 'owner' : 'builder');
    setIsAuthenticated(true);
    showToast(`Welcome back, ${profile.fullName}! Signed in successfully.`);
    try {
      fetch('/api/user-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.warn('Backend save profile error:', e);
    }
  };

  const handleExploreAsGuest = () => {
    setIsAuthenticated(true);
    showToast('Browsing ProblemBridge as guest. Sign in or register anytime.');
  };

  const handleLogout = () => {
    authLogout().catch(() => {});
    const updated = {
      ...userProfile,
      isLoggedIn: false,
    };
    setUserProfile(updated);
    setIsAuthenticated(false);
    setAuthPageInitialMode('login');
    showToast('Signed out. Redirected to Login & Registration gateway.');
    fetch('/api/user-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const handleLogoutToLogin = () => {
    authLogout().catch(() => {});
    const updated = {
      ...userProfile,
      isLoggedIn: false,
    };
    setUserProfile(updated);
    setIsAuthenticated(false);
    setAuthPageInitialMode('login');
    showToast('Signed out. Redirected to Sign In page.');
    fetch('/api/user-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const handleLogoutToRegister = () => {
    authLogout().catch(() => {});
    const updated = {
      ...userProfile,
      isLoggedIn: false,
    };
    setUserProfile(updated);
    setIsAuthenticated(false);
    setAuthPageInitialMode('register');
    showToast('Signed out. Redirected to Registration page.');
    fetch('/api/user-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const handleLoginSuccess = (email: string, name?: string, role?: 'builder' | 'owner') => {
    const assignedRole = role || (email.toLowerCase().includes('owner') || email.toLowerCase().includes('erode') ? 'owner' : 'builder');
    const restored: UserProfile = {
      ...INITIAL_USER_PROFILE,
      email,
      fullName: name || userProfile.fullName || 'Sanjay Verma',
      role: assignedRole,
      accountType: assignedRole === 'owner' ? 'Problem Owner / Organization' : 'Student Builder / Innovator',
      isLoggedIn: true,
      canPostProblems: true,
    };
    setUserProfile(restored);
    setUserRole(assignedRole);
    showToast(`Welcome back, ${restored.fullName}! Signed in successfully.`);
    fetch('/api/user-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restored),
    }).catch(() => {});
  };

  const handleLogin = () => {
    handleLoginSuccess('enbarajenba21@gmail.com', 'Sanjay Verma', 'builder');
  };

  const handleOpenPostProblemFlow = () => {
    setCurrentView('post-problem');
    window.location.hash = '#/post-problem';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setJustPublishedProblemId(null);
    setCurrentView('problem-detail');
    window.location.hash = `#/problem/${problem.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProblemCreatedAndRedirect = (newProblem: Problem) => {
    setSelectedProblem(newProblem);
    setJustPublishedProblemId(newProblem.id);
    setCurrentView('problem-detail');
    window.location.hash = `#/problem/${newProblem.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Redirected to "${newProblem.title}"! Challenge is live.`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.location.hash = '#/problems';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // URL Hash synchronization
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#/post-problem') {
        setCurrentView('post-problem');
      } else if (hash.startsWith('#/problem/')) {
        const id = hash.replace('#/problem/', '');
        const target = problems.find((p) => p.id === id);
        if (target) {
          setSelectedProblem(target);
          setCurrentView('problem-detail');
        }
      } else if (hash === '#/' || hash === '#/problems' || hash === '') {
        if (currentView !== 'home') {
          setCurrentView('home');
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [problems]);

  const handleAddProblem = async (newProblem: Problem) => {
    setProblems((prev) => [newProblem, ...prev.filter((p) => p.id !== newProblem.id)]);
    showToast(`Challenge "${newProblem.title}" published successfully!`);
    
    // Save to database backend
    try {
      await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProblem),
      });
    } catch (e) {
      console.warn('Backend save problem error:', e);
    }

    // Notify user
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Problem Published',
      message: `Your challenge "${newProblem.title}" is now live for builder proposals.`,
      time: 'Just now',
      read: false,
      type: 'update',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateProblemStatus = async (problemId: string, newStatus: Problem['status']) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, status: newStatus } : p))
    );
    showToast(`Problem status updated to "${newStatus}"!`);

    try {
      await fetch(`/api/problems/${problemId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.warn('Backend update problem status error:', e);
    }

    // Add status update notification
    const statusNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Problem Status Updated',
      message: `Challenge status changed to "${newStatus}".`,
      time: 'Just now',
      read: false,
      type: 'update',
    };
    setNotifications((prev) => [statusNotif, ...prev]);
  };

  const handleAcceptProposal = async (problem: Problem, proposal: Proposal) => {
    try {
      setProposals((prev) =>
        prev.map((p) => (p.id === proposal.id ? { ...p, status: 'Accepted' } : p))
      );
      handleUpdateProblemStatus(problem.id, 'In Progress');

      const createdProject = await createProjectWorkspace(problem, proposal);
      if (createdProject) {
        setWorkspaceProjects((prev) => [createdProject, ...prev]);
        setActiveWorkspaceProjectId(createdProject.id);
        setIsMyPostedProblemsOpen(false);
        setIsWorkspaceOpen(true);
        showToast(`Proposal accepted! Collaboration Workspace for "${problem.title}" is ready.`);
      }
    } catch (err) {
      console.error('Error accepting proposal:', err);
    }
  };

  const handleSubmitProposal = async (newProposal: Proposal) => {
    setProposals((prev) => [newProposal, ...prev]);
    
    // Increment interested count on the problem
    setProblems((prev) =>
      prev.map((p) =>
        p.id === newProposal.problemId
          ? { ...p, interestedCount: p.interestedCount + 1 }
          : p
      )
    );

    // Save proposal to database backend
    try {
      await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProposal),
      });
    } catch (e) {
      console.warn('Backend save proposal error:', e);
    }

    // Create or locate chat thread with the owner
    const existingThread = chatThreads.find(
      (t) => t.problemId === newProposal.problemId
    );
    const targetProblem = problems.find((p) => p.id === newProposal.problemId);

    if (!existingThread && targetProblem) {
      const newThread: ChatThread = {
        id: `th-${Date.now()}`,
        problemId: targetProblem.id,
        problemTitle: targetProblem.title,
        counterpartName: targetProblem.mentorName,
        counterpartRole: targetProblem.mentorTitle,
        counterpartOrg: targetProblem.organization,
        counterpartAvatar: targetProblem.mentorName[0] || 'M',
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: `Hello ${targetProblem.mentorName}! I have submitted a proposal for "${targetProblem.title}": "${newProposal.solutionSummary.slice(0, 100)}..."`,
            timestamp: 'Just now',
          },
        ],
      };
      setChatThreads((prev) => [newThread, ...prev]);
    }

    showToast(`Proposal submitted for "${newProposal.problemTitle}"!`);
  };

  const handleSendMessage = async (threadId: string, text: string) => {
    setChatThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                id: `m-${Date.now()}`,
                sender: 'user',
                text,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return t;
      })
    );

    // Persist to backend database
    try {
      await fetch(`/api/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sender: 'user' }),
      });
    } catch (e) {
      console.warn('Backend send message error:', e);
    }

    // Simulate friendly owner reply after 1.5 seconds if offline/local
    setTimeout(() => {
      setChatThreads((prev) =>
        prev.map((t) => {
          if (t.id === threadId) {
            return {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: `m-${Date.now() + 1}`,
                  sender: 'owner',
                  text: `Thank you ${userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Builder'}! That sounds promising. We are reviewing the component list and will get back to you with the site schedule.`,
                  timestamp: 'Just now',
                },
              ],
            };
          }
          return t;
        })
      );
    }, 1500);
  };

  const handleStartChatForProblem = (problem: Problem) => {
    const thread = chatThreads.find((t) => t.problemId === problem.id);
    if (thread) {
      setActiveThreadId(thread.id);
    } else {
      // Create new thread
      const newThread: ChatThread = {
        id: `th-${Date.now()}`,
        problemId: problem.id,
        problemTitle: problem.title,
        counterpartName: problem.mentorName,
        counterpartRole: problem.mentorTitle,
        counterpartOrg: problem.organization,
        counterpartAvatar: problem.mentorName[0] || 'O',
        unreadCount: 0,
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: 'owner',
            text: `Hello! I'm ${problem.mentorName} from ${problem.organization}. Feel free to ask any technical questions regarding "${problem.title}".`,
            timestamp: 'Just now',
          },
        ],
      };
      setChatThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
    }
    setIsMessagesOpen(true);
  };

  const handleOpenOwnerProfile = (problem: Problem) => {
    setOwnerProfileProblem(problem);
    setIsOwnerProfileModalOpen(true);
  };

  const handleRequestConnection = async (
    problem: Problem,
    intentType: 'interested' | 'have_solution' | 'general_query',
    customMessage: string
  ) => {
    const ownerName = problem.ownerName || problem.mentorName || 'Problem Owner';
    const newReq: ConnectionRequest = {
      id: `req-${Date.now()}`,
      problemId: problem.id,
      problemTitle: problem.title,
      senderId: userProfile.id || 'usr-builder',
      senderName: userProfile.fullName || 'Student Builder',
      senderEmail: userProfile.email || 'builder@example.com',
      senderRole: userRole,
      senderInstitution: userProfile.institution || 'College of Engineering',
      senderDegree: userProfile.degree || '',
      senderDepartment: userProfile.department || '',
      senderSkills: userProfile.skills || ['React', 'Node.js', 'Python'],
      senderBio: userProfile.bio || '',
      senderGithub: userProfile.githubUrl || '',
      senderLinkedin: userProfile.linkedinUrl || '',
      senderPhone: userProfile.phone || '',
      ownerId: problem.ownerId || 'usr-owner',
      ownerName,
      ownerEmail: problem.ownerEmail || 'owner@example.org',
      intentType,
      message: customMessage,
      status: 'pending',
      createdAt: 'Just now',
    };

    setConnectionRequests((prev) => [newReq, ...prev.filter((r) => r.problemId !== problem.id)]);

    // Notify the problem owner immediately in the Notification Bell
    const newReqNotif: NotificationItem = {
      id: `notif-req-${Date.now()}`,
      title: `Permission Request: ${userProfile.fullName || 'Innovator'}`,
      message: `${userProfile.fullName || 'A candidate'} requested permission to connect regarding "${problem.title}". Intent: "${intentType === 'have_solution' ? 'I Have a Solution' : "I'm Interested"}". Analyze their profile to approve or reject.`,
      time: 'Just now',
      read: false,
      type: 'connection_request',
      connectionRequestId: newReq.id,
    };
    setNotifications((prev) => [newReqNotif, ...prev]);

    showToast(`Request sent to ${ownerName}! The owner has been notified to analyze your profile.`);

    // Persist to backend database
    try {
      await fetch('/api/connection-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq),
      });
    } catch (err) {
      console.warn('Backend connection request error:', err);
    }
  };

  const handleApproveConnectionRequest = async (requestId: string, responseNote?: string) => {
    setConnectionRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'approved', respondedAt: 'Just now' } : r
      )
    );

    // Update corresponding notification
    setNotifications((prev) =>
      prev.map((n) =>
        n.connectionRequestId === requestId
          ? { ...n, read: true, message: `${n.message} (Approved & Unlocked)` }
          : n
      )
    );

    const req = connectionRequests.find((r) => r.id === requestId);
    if (req) {
      const targetProblem = problems.find((p) => p.id === req.problemId);
      // Unlock/create chat thread
      let existingThread = chatThreads.find((t) => t.problemId === req.problemId);
      if (!existingThread && targetProblem) {
        const newThread: ChatThread = {
          id: `th-conn-${Date.now()}`,
          problemId: targetProblem.id,
          problemTitle: targetProblem.title,
          counterpartName: req.ownerName,
          counterpartRole: targetProblem.ownerTitle || targetProblem.mentorTitle,
          counterpartOrg: targetProblem.organization,
          counterpartAvatar: req.ownerName.slice(0, 2).toUpperCase(),
          unreadCount: 1,
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: 'user',
              text: req.message,
              timestamp: req.createdAt,
            },
            {
              id: `msg-resp-${Date.now() + 1}`,
              sender: 'owner',
              text:
                responseNote ||
                `Hello ${req.senderName}! I have reviewed and approved your profile. Direct messaging is now active. Let's discuss your ideas!`,
              timestamp: 'Just now',
            },
          ],
        };
        setChatThreads((prev) => [newThread, ...prev]);
        setActiveThreadId(newThread.id);
      }
      showToast(`Approved request from ${req.senderName}! Direct messaging unlocked.`);
    }

    try {
      await fetch(`/api/connection-requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseMessage: responseNote }),
      });
    } catch (err) {
      console.warn('Backend approve request error:', err);
    }
  };

  const handleDeclineConnectionRequest = async (requestId: string) => {
    setConnectionRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'declined', respondedAt: 'Just now' } : r
      )
    );

    // Update corresponding notification
    setNotifications((prev) =>
      prev.map((n) =>
        n.connectionRequestId === requestId
          ? { ...n, read: true, message: `${n.message} (Declined)` }
          : n
      )
    );

    showToast('Connection request declined.');

    try {
      await fetch(`/api/connection-requests/${requestId}/decline`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.warn('Backend decline request error:', err);
    }
  };

  const handleOpenChatForProblemId = (problemId: string) => {
    const prob = problems.find((p) => p.id === problemId);
    if (prob) {
      handleStartChatForProblem(prob);
    } else {
      setIsMessagesOpen(true);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
    } catch (e) {
      console.warn('Backend mark notifications error:', e);
    }
  };

  const scrollToProblems = () => {
    const el = document.getElementById('problems-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const unreadMessagesCount = chatThreads.reduce(
    (acc, t) => acc + (t.unreadCount || 0),
    0
  );

  const userPostedProblemsCount = problems.filter((p) => {
    const isOwnerByEmail = p.ownerEmail && userProfile.email && p.ownerEmail.toLowerCase() === userProfile.email.toLowerCase();
    const isOwnerById = p.ownerId && userProfile.id && p.ownerId === userProfile.id;
    const isOwnerByName = p.mentorName && userProfile.fullName && p.mentorName.toLowerCase().includes(userProfile.fullName.toLowerCase());
    const isOwnerByOrg = p.organization && userProfile.institution && p.organization.toLowerCase() === userProfile.institution.toLowerCase();
    return isOwnerByEmail || isOwnerById || isOwnerByName || isOwnerByOrg;
  }).length;

  if (!isAuthenticated) {
    return (
      <>
        {toastMessage && (
          <div className="fixed top-5 right-5 z-[100] max-w-md bg-[#14162B] text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#1FAE7C] shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
        )}
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          onExploreAsGuest={handleExploreAsGuest}
          initialMode={authPageInitialMode}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAFAF9] text-[#14162B] flex flex-col font-body selection:bg-[#EFEDFC] selection:text-[#5B4FE9]">
      
      {/* Toast Notification Banner (offset so it doesn't obstruct the round floating AI button) */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#14162B] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#1FAE7C] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating AI Doubt Solver Button (Round Shape with AI Sparkles Icon) */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <button
          onClick={() => setIsAIDoubtSolverOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5B4FE9] via-[#6F63F2] to-[#8B7FF5] text-white shadow-[0_10px_28px_rgba(91,79,233,0.45)] hover:shadow-[0_14px_36px_rgba(91,79,233,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center border-2 border-white/40 cursor-pointer relative"
          aria-label="Open ProblemBridge AI Doubt Solver"
          title="ProblemBridge AI — Ask questions & clear doubts"
        >
          {/* Active online pulse pip */}
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1FAE7C] border-2 border-white"></span>
          </span>
          <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-200 drop-shadow-xs" />
        </button>

        {/* Floating Tooltip Pill on Hover */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-[#14162B] text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl shadow-lg border border-slate-700">
          Ask AI Doubt Solver
        </div>
      </div>

      {/* Sticky Header with profile dropdown showing personal registration info & logout */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateHome={handleBackToHome}
        onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
        onOpenMessages={() => setIsMessagesOpen((prev) => !prev)}
        onOpenNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        isNotificationsOpen={isNotificationsOpen}
        isMessagesOpen={isMessagesOpen}
        onOpenPostProblem={handleOpenPostProblemFlow}
        onOpenMyProposals={() => setIsMyProposalsOpen(true)}
        onOpenPostedProblems={() => setIsMyPostedProblemsOpen(true)}
        postedProblemsCount={userPostedProblemsCount}
        onOpenWorkspace={() => setIsWorkspaceOpen(true)}
        activeWorkspaceProjectsCount={workspaceProjects.length}
        onOpenConnectionRequests={() => setIsConnectionRequestsModalOpen(true)}
        pendingRequestsCount={connectionRequests.filter((r) => r.status === 'pending').length}
        onOpenRegistrationModal={() => {
          setIsNewRegistration(false);
          setIsRegistrationModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRegisterNewAccount={() => {
          setIsNewRegistration(true);
          setIsRegistrationModalOpen(true);
        }}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        userProfile={userProfile}
        notifications={notifications}
        unreadMessagesCount={unreadMessagesCount}
        userRole={userRole}
        onToggleUserRole={() => {
          const next = userRole === 'builder' ? 'owner' : 'builder';
          setUserRole(next);
          setUserProfile((prev) => ({
            ...prev,
            role: next,
            accountType: next === 'builder' ? 'Student Builder / Innovator' : 'Problem Owner / Organization',
          }));
          showToast(`Switched to ${next === 'builder' ? 'Builder' : 'Organization'} Mode`);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'post-problem' ? (
          <PostProblemPage
            onAddProblem={handleAddProblem}
            userProfile={userProfile}
            onNavigateHome={handleBackToHome}
            onProblemCreatedAndRedirect={handleProblemCreatedAndRedirect}
          />
        ) : currentView === 'problem-detail' && selectedProblem ? (
          <ProblemDetailPage
            problem={selectedProblem}
            onBack={handleBackToHome}
            onApply={(p) => setApplyingProblem(p)}
            onStartChat={(p) => handleStartChatForProblem(p)}
            connectionRequest={connectionRequests.find((r) => r.problemId === selectedProblem?.id)}
            onRequestConnection={handleRequestConnection}
            currentUser={userProfile}
            onOpenOwnerProfileModal={handleOpenOwnerProfile}
            justPublished={justPublishedProblemId === selectedProblem?.id}
            onPostAnother={handleOpenPostProblemFlow}
            onViewMyChallenges={() => setIsMyPostedProblemsOpen(true)}
          />
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreProblems={scrollToProblems}
              onPostProblem={handleOpenPostProblemFlow}
            />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Featured Problems Section */}
            <ProblemsSection
              problems={problems}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              onSelectProblem={handleSelectProblem}
              onQuickApply={(p, e) => {
                e.stopPropagation();
                setApplyingProblem(p);
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onPostProblem={handleOpenPostProblemFlow}
              onViewOwnerProfile={handleOpenOwnerProfile}
              connectionRequests={connectionRequests}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPostProblem={handleOpenPostProblemFlow}
        onExploreProblems={() => {
          if (currentView !== 'home') setCurrentView('home');
          scrollToProblems();
        }}
      />

      {/* Modals and Drawers */}
      <ProblemDetailModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
        onApply={(p) => setApplyingProblem(p)}
        onStartChat={(p) => handleStartChatForProblem(p)}
        connectionRequest={connectionRequests.find((r) => r.problemId === selectedProblem?.id)}
        onRequestConnection={handleRequestConnection}
        currentUser={userProfile}
        onOpenOwnerProfileModal={handleOpenOwnerProfile}
      />

      {/* Dedicated Problem Owner Profile Modal with Contact & Permission Request */}
      <OwnerProfileModal
        isOpen={isOwnerProfileModalOpen}
        onClose={() => setIsOwnerProfileModalOpen(false)}
        problem={ownerProfileProblem}
        currentUser={userProfile}
        connectionRequest={connectionRequests.find((r) => r.problemId === ownerProfileProblem?.id)}
        onRequestConnection={handleRequestConnection}
        onOpenChat={(prob) => handleStartChatForProblem(prob)}
        allProblems={problems}
        onSelectProblem={(p) => handleSelectProblem(p)}
      />

      {/* Connection & Permission Requests Management Modal */}
      <ConnectionRequestsModal
        isOpen={isConnectionRequestsModalOpen}
        onClose={() => setIsConnectionRequestsModalOpen(false)}
        requests={connectionRequests}
        onApprove={handleApproveConnectionRequest}
        onDecline={handleDeclineConnectionRequest}
        onOpenChatForProblem={handleOpenChatForProblemId}
      />

      <ProposalModal
        problem={applyingProblem}
        onClose={() => setApplyingProblem(null)}
        onSubmitProposal={handleSubmitProposal}
      />

      {/* Post a Problem Modal prefilled with registered user identity */}
      <PostProblemModal
        isOpen={isPostProblemOpen}
        onClose={() => setIsPostProblemOpen(false)}
        onAddProblem={handleAddProblem}
        userProfile={userProfile}
        onProblemCreatedAndRedirect={handleProblemCreatedAndRedirect}
        onOpenFullPagePost={() => {
          setIsPostProblemOpen(false);
          handleOpenPostProblemFlow();
        }}
      />

      <MyProposalsModal
        isOpen={isMyProposalsOpen}
        onClose={() => setIsMyProposalsOpen(false)}
        proposals={proposals}
        onOpenChatForProblem={(probId) => {
          const prob = problems.find((p) => p.id === probId);
          if (prob) handleStartChatForProblem(prob);
        }}
      />

      <MessagesDrawer
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        threads={chatThreads}
        activeThreadId={activeThreadId || chatThreads[0]?.id || null}
        onSelectThread={(id) => setActiveThreadId(id)}
        onSendMessage={handleSendMessage}
      />

      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        connectionRequests={connectionRequests}
        onApproveRequest={handleApproveConnectionRequest}
        onDeclineRequest={handleDeclineConnectionRequest}
        onOpenChatForProblem={handleOpenChatForProblemId}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onOpenPostedProblems={() => setIsMyPostedProblemsOpen(true)}
        onNotificationClick={(item) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
          );
          if (item.type === 'message') {
            setIsNotificationsOpen(false);
            setIsMessagesOpen(true);
          } else if (item.type === 'proposal') {
            setIsNotificationsOpen(false);
            setIsMyPostedProblemsOpen(true);
          } else if (item.type === 'update') {
            setIsNotificationsOpen(false);
            setIsMyPostedProblemsOpen(true);
          }
        }}
      />

      {/* Normal Hamburger Navigation Drawer */}
      <NavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        onNavigateToProblems={() => {
          if (currentView !== 'home') setCurrentView('home');
          scrollToProblems();
        }}
        onNavigateHome={handleBackToHome}
        onOpenPostProblem={handleOpenPostProblemFlow}
        onOpenMyProposals={() => setIsMyProposalsOpen(true)}
        onOpenPostedProblems={() => setIsMyPostedProblemsOpen(true)}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onOpenAIDoubtSolver={() => setIsAIDoubtSolverOpen(true)}
        onOpenWorkspace={() => {
          setIsNavDrawerOpen(false);
          setIsWorkspaceOpen(true);
        }}
        activeWorkspaceProjectsCount={workspaceProjects.length}
      />

      {/* Registration Details & Personal Information Modal */}
      <RegistrationDetailsModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onOpenPostProblem={() => setIsPostProblemOpen(true)}
        isNewRegistration={isNewRegistration}
        onOpenLogin={() => {
          setIsRegistrationModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* AI Doubt Solver Drawer/Modal */}
      <AIDoubtSolverModal
        isOpen={isAIDoubtSolverOpen}
        onClose={() => setIsAIDoubtSolverOpen(false)}
        activeProblemContext={selectedProblem}
        onOpenPostProblem={handleOpenPostProblemFlow}
      />

      {/* Account Settings & Preferences Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        userRole={userRole}
        onToggleUserRole={() => {
          const next = userRole === 'builder' ? 'owner' : 'builder';
          setUserRole(next);
          setUserProfile((prev) => ({
            ...prev,
            role: next,
            accountType: next === 'builder' ? 'Student Builder / Innovator' : 'Problem Owner / Organization',
          }));
          showToast(`Switched to ${next === 'builder' ? 'Builder' : 'Organization'} Mode`);
        }}
        onOpenAccountDetails={() => {
          setIsNewRegistration(false);
          setIsRegistrationModalOpen(true);
        }}
        onOpenPostedProblems={() => setIsMyPostedProblemsOpen(true)}
        onLogout={handleLogout}
        onLogoutToLogin={handleLogoutToLogin}
        onLogoutToRegister={handleLogoutToRegister}
      />

      {/* My Posted Challenges & Live Status Tracker Modal */}
      <MyPostedProblemsModal
        isOpen={isMyPostedProblemsOpen}
        onClose={() => setIsMyPostedProblemsOpen(false)}
        problems={problems}
        proposals={proposals}
        userProfile={userProfile}
        onOpenPostProblem={handleOpenPostProblemFlow}
        onUpdateProblemStatus={handleUpdateProblemStatus}
        onSelectProblem={(p) => setSelectedProblem(p)}
        onOpenChatForProblem={(p) => handleStartChatForProblem(p)}
        onAcceptProposal={handleAcceptProposal}
      />

      {/* Real Collaboration Workspace Modal */}
      <CollaborationWorkspaceModal
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        projects={workspaceProjects}
        currentUserProfile={userProfile}
        initialProjectId={activeWorkspaceProjectId}
        onOpenMessages={(threadId) => {
          setIsWorkspaceOpen(false);
          setIsMessagesOpen(true);
          if (threadId) setActiveThreadId(threadId);
        }}
      />

      {/* Dedicated Sign In / Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenRegister={() => {
          setIsLoginModalOpen(false);
          setIsNewRegistration(true);
          setIsRegistrationModalOpen(true);
        }}
      />

      {/* Redirected Auth Gateway Modal: Shows clear choices to Log In or Register */}
      <AuthGatewayModal
        isOpen={isAuthGatewayOpen}
        onClose={() => setIsAuthGatewayOpen(false)}
        initialChoice={authGatewayInitialChoice}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleSaveProfile}
      />

    </div>
  );
}
