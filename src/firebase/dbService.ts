import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './error';
import {
  Problem,
  Proposal,
  ConnectionRequest,
  Project,
  ProjectTask,
  ProjectFile,
  ProjectMilestone,
  NotificationItem,
} from '../types';

// ======================= PROBLEMS SERVICE =======================

export function subscribeProblems(callback: (problems: Problem[]) => void): () => void {
  const colRef = collection(db, 'problems');
  const q = query(colRef);
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Problem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Problem, 'id'>) });
      });
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'problems');
    }
  );
}

export async function createProblem(problemData: Omit<Problem, 'id'>): Promise<Problem> {
  const id = `pb-${Date.now()}`;
  const docRef = doc(db, 'problems', id);
  const newProblem: Problem = {
    ...problemData,
    id,
    postedTime: 'Just now',
    interestedCount: 0,
    status: problemData.status || 'Open',
  };

  try {
    await setDoc(docRef, {
      ...newProblem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newProblem;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `problems/${id}`);
    return newProblem;
  }
}

export async function updateProblem(id: string, updates: Partial<Problem>): Promise<void> {
  const docRef = doc(db, 'problems', id);
  try {
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `problems/${id}`);
  }
}

export async function deleteProblem(id: string): Promise<void> {
  const docRef = doc(db, 'problems', id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `problems/${id}`);
  }
}

export async function incrementProblemInterested(id: string): Promise<void> {
  const docRef = doc(db, 'problems', id);
  try {
    await updateDoc(docRef, {
      interestedCount: increment(1),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `problems/${id}`);
  }
}

// ======================= PROPOSALS SERVICE =======================

export function subscribeProposalsForUser(userId: string, role: 'owner' | 'builder' | 'admin', callback: (proposals: Proposal[]) => void): () => void {
  const colRef = collection(db, 'proposals');
  let q = query(colRef);
  if (role === 'builder') {
    q = query(colRef, where('solverId', '==', userId));
  } else if (role === 'owner') {
    q = query(colRef, where('ownerId', '==', userId));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Proposal[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Proposal, 'id'>) });
      });
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'proposals');
    }
  );
}

export async function createProposal(
  proposalData: Omit<Proposal, 'id'> & { ownerId: string; solverId: string }
): Promise<Proposal> {
  const id = `prop-${Date.now()}`;
  const docRef = doc(db, 'proposals', id);
  const newProposal: Proposal = {
    ...proposalData,
    id,
    submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Submitted',
  };

  try {
    await setDoc(docRef, {
      ...newProposal,
      createdAt: new Date().toISOString(),
    });

    // Notify the problem owner
    await createNotification({
      recipientId: proposalData.ownerId,
      title: 'New Proposal Received',
      message: `${proposalData.builderName} submitted a proposal for "${proposalData.problemTitle}"`,
      time: 'Just now',
      read: false,
      type: 'proposal',
    });

    return newProposal;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `proposals/${id}`);
    return newProposal;
  }
}

export async function updateProposalStatus(
  id: string,
  status: Proposal['status'],
  proposal?: Proposal,
  problem?: Problem
): Promise<void> {
  const docRef = doc(db, 'proposals', id);
  try {
    await updateDoc(docRef, { status });

    // If accepted, also auto-create a Collaboration Project Workspace!
    if (status === 'Accepted' && proposal && problem) {
      await createProjectWorkspace(problem, proposal);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `proposals/${id}`);
  }
}

// ======================= COLLABORATION WORKSPACE =======================

export async function createProjectWorkspace(problem: Problem, proposal: Proposal): Promise<Project> {
  const projectId = `proj-${Date.now()}`;
  const projectRef = doc(db, 'projects', projectId);

  const initialMilestones: ProjectMilestone[] = [
    { id: 'm-1', title: 'Architecture & System Design Alignment', dueDate: 'Week 1', completed: true },
    { id: 'm-2', title: 'Core Prototype / MVP Implementation', dueDate: 'Week 3', completed: false },
    { id: 'm-3', title: 'Field Testing & Deliverable Validation', dueDate: 'Week 5', completed: false },
    { id: 'm-4', title: 'Final Handover & Signoff', dueDate: 'Week 6', completed: false },
  ];

  const solverId = (proposal as any).solverId || 'solver-id';
  const newProject: Project = {
    id: projectId,
    problemId: problem.id,
    title: problem.title,
    ownerId: problem.ownerId || 'owner-id',
    ownerName: problem.ownerName || problem.organization,
    acceptedProposalId: proposal.id,
    solverIds: [solverId],
    solverNames: [proposal.builderName],
    status: 'in_progress',
    milestones: initialMilestones,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(projectRef, newProject);

    // Seed initial welcome task
    const taskRef = doc(collection(db, `projects/${projectId}/tasks`), `task-1`);
    await setDoc(taskRef, {
      id: 'task-1',
      projectId,
      title: 'Review specifications and schedule kickoff meeting',
      description: 'Align on repository access, meeting schedule, and hardware or data access needs.',
      assigneeId: solverId,
      assigneeName: proposal.builderName,
      status: 'in_progress',
      priority: 'high',
      dueDate: 'In 3 days',
      createdAt: new Date().toISOString(),
    });

    // Notify solver
    if (solverId) {
      await createNotification({
        recipientId: solverId,
        title: 'Proposal Accepted! Workspace Initialized',
        message: `Your proposal for "${problem.title}" was accepted. Workspace has been created!`,
        time: 'Just now',
        read: false,
        type: 'update',
      });
    }

    return newProject;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `projects/${projectId}`);
    return newProject;
  }
}

export function subscribeProjectsForUser(userId: string, callback: (projects: Project[]) => void): () => void {
  const colRef = collection(db, 'projects');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Project[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Project;
        if (data.ownerId === userId || (data.solverIds && data.solverIds.includes(userId))) {
          list.push({ ...data, id: docSnap.id });
        }
      });
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'projects');
    }
  );
}

export function subscribeProjectTasks(projectId: string, callback: (tasks: ProjectTask[]) => void): () => void {
  const colRef = collection(db, `projects/${projectId}/tasks`);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ProjectTask[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<ProjectTask, 'id'>) });
      });
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `projects/${projectId}/tasks`);
    }
  );
}

export async function createProjectTask(taskData: Omit<ProjectTask, 'id' | 'createdAt'>): Promise<ProjectTask> {
  const taskId = `task-${Date.now()}`;
  const docRef = doc(db, `projects/${taskData.projectId}/tasks`, taskId);
  const newTask: ProjectTask = {
    ...taskData,
    id: taskId,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, newTask);
    return newTask;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `projects/${taskData.projectId}/tasks/${taskId}`);
    return newTask;
  }
}

export async function updateProjectTask(
  projectId: string,
  taskId: string,
  updates: Partial<ProjectTask>
): Promise<void> {
  const docRef = doc(db, `projects/${projectId}/tasks`, taskId);
  try {
    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}/tasks/${taskId}`);
  }
}

export async function deleteProjectTask(projectId: string, taskId: string): Promise<void> {
  const docRef = doc(db, `projects/${projectId}/tasks`, taskId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}/tasks/${taskId}`);
  }
}

export function subscribeProjectFiles(projectId: string, callback: (files: ProjectFile[]) => void): () => void {
  const colRef = collection(db, `projects/${projectId}/files`);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ProjectFile[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<ProjectFile, 'id'>) });
      });
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `projects/${projectId}/files`);
    }
  );
}

export async function addProjectFile(fileData: Omit<ProjectFile, 'id' | 'uploadedAt'>): Promise<ProjectFile> {
  const fileId = `file-${Date.now()}`;
  const docRef = doc(db, `projects/${fileData.projectId}/files`, fileId);
  const newFile: ProjectFile = {
    ...fileData,
    id: fileId,
    uploadedAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, newFile);
    return newFile;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `projects/${fileData.projectId}/files/${fileId}`);
    return newFile;
  }
}

// ======================= CONNECTION REQUESTS =======================

export function subscribeConnectionRequests(
  userId: string,
  callback: (requests: ConnectionRequest[]) => void
): () => void {
  const colRef = collection(db, 'connection_requests');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ConnectionRequest[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ConnectionRequest;
        if (data.senderId === userId || data.ownerId === userId) {
          list.push({ ...data, id: docSnap.id });
        }
      });
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'connection_requests');
    }
  );
}

export async function createConnectionRequest(
  data: Omit<ConnectionRequest, 'id'>
): Promise<ConnectionRequest> {
  const id = `req-${Date.now()}`;
  const docRef = doc(db, 'connection_requests', id);
  const newReq: ConnectionRequest = {
    ...data,
    id,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'pending',
  };

  try {
    await setDoc(docRef, newReq);

    // Notify the owner
    await createNotification({
      recipientId: data.ownerId,
      title: 'New Connection Request',
      message: `${data.senderName} requested to connect regarding "${data.problemTitle}"`,
      time: 'Just now',
      read: false,
      type: 'connection_request',
      connectionRequestId: id,
    });

    return newReq;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `connection_requests/${id}`);
    return newReq;
  }
}

export async function updateConnectionRequestStatus(
  id: string,
  status: ConnectionRequest['status'],
  threadId?: string
): Promise<void> {
  const docRef = doc(db, 'connection_requests', id);
  try {
    await updateDoc(docRef, {
      status,
      respondedAt: new Date().toISOString(),
      ...(threadId ? { chatThreadId: threadId } : {}),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `connection_requests/${id}`);
  }
}

// ======================= NOTIFICATIONS =======================

export function subscribeNotifications(
  userId: string,
  callback: (items: NotificationItem[]) => void
): () => void {
  const colRef = collection(db, 'notifications');
  const q = query(colRef, where('recipientId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: NotificationItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<NotificationItem, 'id'>) });
      });
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'notifications');
    }
  );
}

export async function createNotification(
  notification: Omit<NotificationItem, 'id'> & { recipientId: string }
): Promise<void> {
  const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const docRef = doc(db, 'notifications', id);
  try {
    await setDoc(docRef, {
      ...notification,
      id,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `notifications/${id}`);
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const docRef = doc(db, 'notifications', id);
  try {
    await updateDoc(docRef, { read: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `notifications/${id}`);
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const colRef = collection(db, 'notifications');
  const q = query(colRef, where('recipientId', '==', userId), where('read', '==', false));
  try {
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.forEach((docSnap) => {
      batch.update(docSnap.ref, { read: true });
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, 'notifications');
  }
}
