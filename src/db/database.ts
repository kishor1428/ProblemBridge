import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Problem, Proposal, UserProfile, ChatThread, NotificationItem, ConnectionRequest } from '../types';
import {
  INITIAL_PROBLEMS,
  INITIAL_PROPOSALS,
  INITIAL_THREADS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER_PROFILE,
  INITIAL_CONNECTION_REQUESTS,
  INITIAL_USERS,
} from '../data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, 'db.json');

export interface DatabaseSchema {
  users: UserProfile[];
  problems: Problem[];
  proposals: Proposal[];
  connectionRequests: ConnectionRequest[];
  userProfile: UserProfile;
  threads: ChatThread[];
  notifications: NotificationItem[];
}

function getDefaultDatabase(): DatabaseSchema {
  return {
    users: INITIAL_USERS,
    problems: INITIAL_PROBLEMS,
    proposals: INITIAL_PROPOSALS,
    connectionRequests: INITIAL_CONNECTION_REQUESTS,
    userProfile: INITIAL_USER_PROFILE,
    threads: INITIAL_THREADS,
    notifications: INITIAL_NOTIFICATIONS,
  };
}

export function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getDefaultDatabase();
      writeDatabase(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Ensure all required fields exist (schema migration / resilience)
    return {
      users: parsed.users || INITIAL_USERS,
      problems: parsed.problems || INITIAL_PROBLEMS,
      proposals: parsed.proposals || INITIAL_PROPOSALS,
      connectionRequests: parsed.connectionRequests || INITIAL_CONNECTION_REQUESTS,
      userProfile: parsed.userProfile || INITIAL_USER_PROFILE,
      threads: parsed.threads || INITIAL_THREADS,
      notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
    };
  } catch (err) {
    console.error('Failed reading database file, using defaults:', err);
    return getDefaultDatabase();
  }
}

export function writeDatabase(data: DatabaseSchema): void {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing database file:', err);
  }
}

// ================= User Operations =================
export function getUsers(): UserProfile[] {
  return readDatabase().users;
}

export function getUserById(id: string): UserProfile | null {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}

export function saveUser(user: UserProfile): UserProfile {
  const db = readDatabase();
  const index = db.users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    db.users[index] = { ...db.users[index], ...user };
  } else {
    db.users.push(user);
  }
  // Also update active session profile if matching
  if (db.userProfile.id === user.id || db.userProfile.email.toLowerCase() === user.email.toLowerCase()) {
    db.userProfile = { ...db.userProfile, ...user };
  }
  writeDatabase(db);
  return user;
}

// ================= Problem Operations =================
export function getProblems(): Problem[] {
  return readDatabase().problems;
}

export function getProblemById(id: string): Problem | null {
  const db = readDatabase();
  return db.problems.find((p) => p.id === id) || null;
}

export function addProblem(newProblem: Problem): Problem {
  const db = readDatabase();
  db.problems.unshift(newProblem);
  
  // Create system notification
  const notif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: 'New Problem Published',
    message: `Challenge "${newProblem.title}" has been published by ${newProblem.organization}.`,
    time: 'Just now',
    read: false,
    type: 'update',
  };
  db.notifications.unshift(notif);
  
  writeDatabase(db);
  return newProblem;
}

export function updateProblemStatus(problemId: string, status: Problem['status']): Problem | null {
  const db = readDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) return null;
  problem.status = status;
  writeDatabase(db);
  return problem;
}

// ================= Proposal (Solution) Operations =================
export function getProposals(): Proposal[] {
  return readDatabase().proposals;
}

export function addProposal(proposal: Proposal): Proposal {
  const db = readDatabase();
  db.proposals.unshift(proposal);
  
  // Increment interested count on corresponding problem
  const prob = db.problems.find((p) => p.id === proposal.problemId);
  if (prob) {
    prob.interestedCount = (prob.interestedCount || 0) + 1;
  }

  // Create or add chat thread
  let thread = db.threads.find((t) => t.problemId === proposal.problemId);
  if (!thread && prob) {
    thread = {
      id: `th-${Date.now()}`,
      problemId: prob.id,
      problemTitle: prob.title,
      counterpartName: prob.ownerName || prob.mentorName,
      counterpartRole: prob.ownerTitle || prob.mentorTitle,
      counterpartOrg: prob.organization,
      counterpartAvatar: (prob.ownerName || prob.mentorName)[0] || 'M',
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: `Hello ${prob.ownerName || prob.mentorName}! I have submitted a proposal for "${prob.title}": "${proposal.solutionSummary.slice(0, 100)}..."`,
          timestamp: 'Just now',
        },
      ],
    };
    db.threads.unshift(thread);
  }

  // Add notification
  const notif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: 'Solution Proposal Submitted',
    message: `Your proposal for "${prob?.title || 'Problem'}" has been delivered to ${prob?.organization || 'the owner'}.`,
    time: 'Just now',
    read: false,
    type: 'proposal',
  };
  db.notifications.unshift(notif);

  writeDatabase(db);
  return proposal;
}

// ================= Connection Requests Operations =================
export function getConnectionRequests(): ConnectionRequest[] {
  return readDatabase().connectionRequests;
}

export function addConnectionRequest(request: ConnectionRequest): ConnectionRequest {
  const db = readDatabase();
  
  // Check if request already exists from this sender for this problem
  const existing = db.connectionRequests.find(
    (r) => r.problemId === request.problemId && r.senderEmail.toLowerCase() === request.senderEmail.toLowerCase()
  );

  if (existing) {
    existing.message = request.message;
    existing.intentType = request.intentType;
    existing.createdAt = 'Just now';
    writeDatabase(db);
    return existing;
  }

  db.connectionRequests.unshift(request);

  // Add notification for the problem owner
  const notif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: request.intentType === 'have_solution' ? 'Solution Inquiry Received' : 'Builder Interest Request',
    message: `${request.senderName} (${request.senderInstitution}) sent a connection request for "${request.problemTitle}". Approval required to open chat.`,
    time: 'Just now',
    read: false,
    type: 'message',
  };
  db.notifications.unshift(notif);

  writeDatabase(db);
  return request;
}

export function updateConnectionRequestStatus(
  requestId: string,
  status: 'approved' | 'declined',
  responseMessage?: string
): ConnectionRequest | null {
  const db = readDatabase();
  const req = db.connectionRequests.find((r) => r.id === requestId);
  if (!req) return null;

  req.status = status;
  req.respondedAt = 'Just now';

  if (status === 'approved') {
    // Locate corresponding problem
    const prob = db.problems.find((p) => p.id === req.problemId);

    // Create or unlock two-way chat thread
    let thread = db.threads.find((t) => t.problemId === req.problemId);
    if (!thread) {
      const threadId = `th-conn-${Date.now()}`;
      thread = {
        id: threadId,
        problemId: req.problemId,
        problemTitle: req.problemTitle,
        counterpartName: req.ownerName,
        counterpartRole: prob?.ownerTitle || prob?.mentorTitle || 'Problem Owner',
        counterpartOrg: prob?.organization || 'Organization',
        counterpartAvatar: req.ownerName.slice(0, 2).toUpperCase(),
        unreadCount: 1,
        messages: [
          {
            id: `msg-req-${Date.now()}`,
            sender: 'user',
            text: req.message,
            timestamp: req.createdAt,
          },
          {
            id: `msg-resp-${Date.now() + 1}`,
            sender: 'owner',
            text: responseMessage || `Hello ${req.senderName}! I have reviewed and approved your request. Let's discuss your ideas for "${req.problemTitle}".`,
            timestamp: 'Just now',
          },
        ],
      };
      db.threads.unshift(thread);
      req.chatThreadId = threadId;
    } else {
      req.chatThreadId = thread.id;
      thread.messages.push({
        id: `msg-resp-${Date.now()}`,
        sender: 'owner',
        text: responseMessage || `Hello ${req.senderName}! I have approved your connection request. Direct messaging is now unlocked.`,
        timestamp: 'Just now',
      });
    }

    // Add notification for the builder
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Connection Request Approved!',
      message: `${req.ownerName} approved your connection request for "${req.problemTitle}". You can now chat directly!`,
      time: 'Just now',
      read: false,
      type: 'message',
    });
  } else {
    // Add notification for declined
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Connection Request Status',
      message: `${req.ownerName} has declined the connection request for "${req.problemTitle}".`,
      time: 'Just now',
      read: false,
      type: 'system',
    });
  }

  writeDatabase(db);
  return req;
}

// ================= User Profile operations =================
export function getUserProfile(): UserProfile {
  return readDatabase().userProfile;
}

export function updateUserProfile(updated: Partial<UserProfile>): UserProfile {
  const db = readDatabase();
  db.userProfile = {
    ...db.userProfile,
    ...updated,
  };
  // Also sync in users list
  const idx = db.users.findIndex((u) => u.id === db.userProfile.id || u.email.toLowerCase() === db.userProfile.email.toLowerCase());
  if (idx >= 0) {
    db.users[idx] = db.userProfile;
  } else {
    db.users.push(db.userProfile);
  }

  writeDatabase(db);
  return db.userProfile;
}

// ================= Chat Thread operations =================
export function getThreads(): ChatThread[] {
  return readDatabase().threads;
}

export function addMessageToThread(threadId: string, text: string, sender: 'user' | 'owner' = 'user'): ChatThread | null {
  const db = readDatabase();
  const thread = db.threads.find((t) => t.id === threadId);
  if (!thread) return null;

  thread.messages.push({
    id: `m-${Date.now()}`,
    sender,
    text,
    timestamp: 'Just now',
  });

  writeDatabase(db);
  return thread;
}

// ================= Notifications operations =================
export function getNotifications(): NotificationItem[] {
  return readDatabase().notifications;
}

export function markAllNotificationsRead(): void {
  const db = readDatabase();
  db.notifications.forEach((n) => {
    n.read = true;
  });
  writeDatabase(db);
}

// ================= Database Stats =================
export function getDatabaseStats() {
  const db = readDatabase();
  return {
    status: 'online',
    filePath: DB_FILE,
    counts: {
      users: db.users.length,
      problems: db.problems.length,
      proposals: db.proposals.length,
      connectionRequests: db.connectionRequests.length,
      threads: db.threads.length,
      notifications: db.notifications.length,
    },
    lastUpdated: new Date().toISOString(),
  };
}
