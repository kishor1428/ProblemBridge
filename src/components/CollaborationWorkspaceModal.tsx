import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  FileText,
  Users,
  CheckSquare,
  Sparkles,
  ExternalLink,
  Trash2,
  Calendar,
  Layers,
  FolderOpen,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Project, ProjectTask, ProjectFile, ProjectMilestone, UserProfile } from '../types';
import {
  subscribeProjectTasks,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
  subscribeProjectFiles,
  addProjectFile,
  updateProblem,
} from '../firebase/dbService';

interface CollaborationWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentUserProfile: UserProfile;
  initialProjectId?: string | null;
  onOpenMessages?: (threadId?: string) => void;
}

export const CollaborationWorkspaceModal: React.FC<CollaborationWorkspaceModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentUserProfile,
  initialProjectId,
  onOpenMessages,
}) => {
  const [activeProjectId, setActiveProjectId] = useState<string>(
    initialProjectId || (projects.length > 0 ? projects[0].id : '')
  );
  const [activeTab, setActiveTab] = useState<'tasks' | 'milestones' | 'files' | 'team'>('tasks');

  // Task form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // File form state
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileSize, setNewFileSize] = useState('');

  // Active project tasks and files via Firestore
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  useEffect(() => {
    if (initialProjectId) {
      setActiveProjectId(initialProjectId);
    } else if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [initialProjectId, projects]);

  useEffect(() => {
    if (!activeProject) return;

    const unsubTasks = subscribeProjectTasks(activeProject.id, (loadedTasks) => {
      setTasks(loadedTasks);
    });

    const unsubFiles = subscribeProjectFiles(activeProject.id, (loadedFiles) => {
      setFiles(loadedFiles);
    });

    return () => {
      unsubTasks();
      unsubFiles();
    };
  }, [activeProject?.id]);

  if (!isOpen) return null;

  if (projects.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl">
          <div className="w-16 h-16 bg-[#EFEDFC] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#5B4FE9]">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-[#14162B] mb-2">No Active Workspaces Yet</h3>
          <p className="text-sm text-[#4A4C63] mb-6">
            Workspaces are automatically created when a Problem Owner accepts a solution proposal. Explore problems to submit a proposal or publish a challenge!
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#5B4FE9] hover:bg-[#493EC8] text-white font-medium rounded-xl text-sm transition-colors cursor-pointer"
          >
            Close Workspace
          </button>
        </div>
      </div>
    );
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeProject) return;

    try {
      await createProjectTask({
        projectId: activeProject.id,
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim() || undefined,
        priority: newTaskPriority,
        dueDate: newTaskDueDate.trim() || 'Flexible',
        status: 'todo',
        assigneeId: currentUserProfile.id,
        assigneeName: currentUserProfile.fullName,
      });

      setNewTaskTitle('');
      setNewTaskDesc('');
      setIsAddingTask(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleToggleTaskStatus = async (task: ProjectTask) => {
    if (!activeProject) return;
    const nextStatus = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo';
    try {
      await updateProjectTask(activeProject.id, task.id, { status: nextStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!activeProject) return;
    try {
      await deleteProjectTask(activeProject.id, taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !newFileUrl.trim() || !activeProject) return;

    try {
      await addProjectFile({
        projectId: activeProject.id,
        fileName: newFileName.trim(),
        fileUrl: newFileUrl.trim(),
        fileSize: newFileSize.trim() || 'PDF / Link',
        uploadedBy: currentUserProfile.id,
        uploaderName: currentUserProfile.fullName,
      });

      setNewFileName('');
      setNewFileUrl('');
      setNewFileSize('');
      setIsAddingFile(false);
    } catch (err) {
      console.error('Failed to add file:', err);
    }
  };

  const handleAskAIAdvice = async () => {
    if (!activeProject) return;
    setAiAssistantLoading(true);
    setAiAdvice(null);

    try {
      const res = await fetch('/api/ai/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Give me a concise 3-step action plan and potential technical risks for the project: "${activeProject.title}" with current tasks: ${tasks.map((t) => t.title).join(', ')}.`,
          problemContext: {
            title: activeProject.title,
            tasksCount: tasks.length,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAdvice(data.answer);
      }
    } catch (err) {
      console.error('AI Advice error:', err);
    } finally {
      setAiAssistantLoading(false);
    }
  };

  const completedMilestonesCount = activeProject.milestones?.filter((m) => m.completed).length || 0;
  const totalMilestonesCount = activeProject.milestones?.length || 1;
  const progressPercent = Math.round((completedMilestonesCount / totalMilestonesCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[92vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden border border-[#E8E7F3]">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E8E7F3] bg-[#FBFBFE] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#5B4FE9] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B4FE9] bg-[#EFEDFC] px-2 py-0.5 rounded-full">
                  Collaboration Workspace
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E5F7F0] text-[#1FAE7C]">
                  {activeProject.status.toUpperCase()}
                </span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#14162B] truncate mt-0.5">
                {activeProject.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {projects.length > 1 && (
              <select
                value={activeProjectId}
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="text-xs font-medium bg-white border border-[#D6D4EA] rounded-lg px-2.5 py-1.5 text-[#14162B] focus:ring-2 focus:ring-[#5B4FE9] outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#EFEDFC] transition-colors cursor-pointer"
              aria-label="Close workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress & Quick Stats Ribbon */}
        <div className="px-6 py-3 bg-white border-b border-[#E8E7F3] flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[#8B8DA3]">Organization / Owner:</span>{' '}
              <strong className="text-[#14162B]">{activeProject.ownerName || 'Verified Partner'}</strong>
            </div>
            <div>
              <span className="text-[#8B8DA3]">Assigned Solvers:</span>{' '}
              <strong className="text-[#5B4FE9]">
                {activeProject.solverNames?.join(', ') || 'Student Innovators'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#4A4C63] font-medium">Milestone Progress: {progressPercent}%</span>
            <div className="w-32 h-2.5 bg-[#F4F4F7] rounded-full overflow-hidden border border-[#E8E7F3]">
              <div
                className="h-full bg-[#1FAE7C] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 border-b border-[#E8E7F3] bg-white shrink-0">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'tasks'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#6B6D82] hover:text-[#14162B]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Task Board ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'milestones'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#6B6D82] hover:text-[#14162B]'
            }`}
          >
            <Clock className="w-4 h-4" />
            Milestones ({activeProject.milestones?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'files'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#6B6D82] hover:text-[#14162B]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Project Vault & Files ({files.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`py-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'team'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#6B6D82] hover:text-[#14162B]'
            }`}
          >
            <Users className="w-4 h-4" />
            Team Directory
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8F8FB]">
          {/* TAB 1: TASKS BOARD */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-display font-bold text-base text-[#14162B]">Collaborative Deliverables & Tasks</h3>
                  <p className="text-xs text-[#6B6D82]">
                    Track implementation milestones, hardware wiring, and software deliverables.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAskAIAdvice}
                    disabled={aiAssistantLoading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#EFEDFC] hover:bg-[#E3E0FA] text-[#5B4FE9] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    {aiAssistantLoading ? 'Analyzing...' : 'AI Sprint Advice'}
                  </button>
                  <button
                    onClick={() => setIsAddingTask(!isAddingTask)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#5B4FE9] hover:bg-[#493EC8] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    New Task
                  </button>
                </div>
              </div>

              {/* AI Advice Callout */}
              {aiAdvice && (
                <div className="p-4 bg-white border border-[#C5BFFB] rounded-2xl shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#5B4FE9]">
                      <Sparkles className="w-4 h-4" />
                      Gemini Sprint Assistant Recommendation
                    </div>
                    <button
                      onClick={() => setAiAdvice(null)}
                      className="text-[#8B8DA3] hover:text-[#14162B] text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="text-xs text-[#35374E] leading-relaxed whitespace-pre-line">{aiAdvice}</div>
                </div>
              )}

              {/* New Task Inline Form */}
              {isAddingTask && (
                <form onSubmit={handleCreateTask} className="p-4 bg-white rounded-2xl border border-[#D6D4EA] shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-[#14162B] uppercase tracking-wider">Create New Workspace Task</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Task Title (e.g. Solder ultrasonic sensor bracket)..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D4EA] rounded-xl outline-none focus:border-[#5B4FE9]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Target Due Date (e.g. In 4 days)..."
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D4EA] rounded-xl outline-none focus:border-[#5B4FE9]"
                    />
                  </div>
                  <textarea
                    placeholder="Technical description or acceptance criteria..."
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-xs border border-[#D6D4EA] rounded-xl outline-none focus:border-[#5B4FE9]"
                  ></textarea>
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B6D82]">Priority:</span>
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewTaskPriority(p)}
                          className={`px-2 py-1 rounded-lg text-xs capitalize font-medium ${
                            newTaskPriority === p
                              ? p === 'high'
                                ? 'bg-red-100 text-red-700 font-bold'
                                : p === 'medium'
                                ? 'bg-amber-100 text-amber-700 font-bold'
                                : 'bg-emerald-100 text-emerald-700 font-bold'
                              : 'bg-[#F4F4F7] text-[#6B6D82]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingTask(false)}
                        className="px-3 py-1.5 text-xs text-[#6B6D82] hover:bg-[#F4F4F7] rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold bg-[#5B4FE9] hover:bg-[#493EC8] text-white rounded-lg shadow-xs cursor-pointer"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Task Columns Grid (Kanban Inspired) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['todo', 'in_progress', 'done'] as const).map((colStatus) => {
                  const colTasks = tasks.filter((t) => t.status === colStatus);
                  const colTitle = colStatus === 'todo' ? 'To Do' : colStatus === 'in_progress' ? 'In Progress' : 'Completed';
                  const colBadgeColor =
                    colStatus === 'todo' ? 'bg-[#F4F4F7] text-[#6B6D82]' : colStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700';

                  return (
                    <div key={colStatus} className="bg-white rounded-2xl p-4 border border-[#E8E7F3] shadow-xs flex flex-col h-[480px]">
                      <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F7] mb-3 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#14162B]">{colTitle}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colBadgeColor}`}>
                            {colTasks.length}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                        {colTasks.length === 0 ? (
                          <div className="text-center py-10 text-xs text-[#A0A2B5] italic">
                            No tasks in this lane
                          </div>
                        ) : (
                          colTasks.map((task) => (
                            <div
                              key={task.id}
                              className="p-3 bg-[#FBFBFE] hover:bg-white border border-[#E8E7F3] hover:border-[#C5BFFB] rounded-xl transition-all shadow-xs group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  onClick={() => handleToggleTaskStatus(task)}
                                  className={`text-xs font-semibold text-[#14162B] hover:text-[#5B4FE9] cursor-pointer ${
                                    task.status === 'done' ? 'line-through text-[#8B8DA3]' : ''
                                  }`}
                                >
                                  {task.title}
                                </h4>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-[#8B8DA3] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                                  title="Delete task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {task.description && (
                                <p className="text-[11px] text-[#6B6D82] mt-1 line-clamp-2">{task.description}</p>
                              )}

                              <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#F0EFFF] text-[10px]">
                                <span
                                  className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                                    task.priority === 'high'
                                      ? 'bg-red-50 text-red-600'
                                      : task.priority === 'medium'
                                      ? 'bg-amber-50 text-amber-600'
                                      : 'bg-emerald-50 text-emerald-600'
                                  }`}
                                >
                                  {task.priority}
                                </span>
                                <div className="flex items-center gap-1 text-[#8B8DA3]">
                                  <Calendar className="w-3 h-3" />
                                  <span>{task.dueDate || 'Ongoing'}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-center mb-6">
                <h3 className="font-display font-bold text-lg text-[#14162B]">Project Milestone Roadmap</h3>
                <p className="text-xs text-[#6B6D82]">
                  Agreed phases required for honorarium disbursement and deliverable sign-off.
                </p>
              </div>

              <div className="space-y-3">
                {activeProject.milestones?.map((milestone, idx) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      milestone.completed
                        ? 'bg-[#E5F7F0]/40 border-[#A3E5CB]'
                        : 'bg-white border-[#E8E7F3] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          milestone.completed ? 'bg-[#1FAE7C] text-white' : 'bg-[#EFEDFC] text-[#5B4FE9]'
                        }`}
                      >
                        {milestone.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${milestone.completed ? 'text-[#0F6F4C]' : 'text-[#14162B]'}`}>
                          {milestone.title}
                        </h4>
                        <span className="text-[11px] text-[#6B6D82]">Target: {milestone.dueDate}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        milestone.completed ? 'bg-[#E5F7F0] text-[#1FAE7C]' : 'bg-[#FFF8E6] text-[#D97706]'
                      }`}
                    >
                      {milestone.completed ? 'Verified & Completed' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FILES VAULT */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-display font-bold text-base text-[#14162B]">Project Vault & Shared Documents</h3>
                  <p className="text-xs text-[#6B6D82]">
                    Pin schematics, API docs, code repositories, sensor pinouts, and field test data.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingFile(!isAddingFile)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#5B4FE9] hover:bg-[#493EC8] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Attach Document / Link
                </button>
              </div>

              {isAddingFile && (
                <form onSubmit={handleAddFile} className="p-4 bg-white rounded-2xl border border-[#D6D4EA] shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-[#14162B] uppercase tracking-wider">Add Shared File or Spec</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="File Name (e.g. Tank Sensor Wiring Spec)..."
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D4EA] rounded-xl outline-none focus:border-[#5B4FE9]"
                      required
                    />
                    <input
                      type="url"
                      placeholder="URL or GitHub Link (https://...)..."
                      value={newFileUrl}
                      onChange={(e) => setNewFileUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D4EA] rounded-xl outline-none focus:border-[#5B4FE9]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Format (e.g. PDF / GitHub Repo / 2.4 MB)..."
                      value={newFileSize}
                      onChange={(e) => setNewFileSize(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D4EA] rounded-xl outline-none focus:border-[#5B4FE9]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingFile(false)}
                      className="px-3 py-1.5 text-xs text-[#6B6D82] hover:bg-[#F4F4F7] rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-[#5B4FE9] hover:bg-[#493EC8] text-white rounded-lg shadow-xs cursor-pointer"
                    >
                      Save Attachment
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {files.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-xs text-[#8B8DA3] bg-white rounded-2xl border border-dashed border-[#D6D4EA]">
                    No files attached yet. Share GitHub repo links or technical specs!
                  </div>
                ) : (
                  files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 bg-white rounded-2xl border border-[#E8E7F3] hover:border-[#C5BFFB] transition-all shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-[#14162B] truncate">{file.fileName}</h4>
                          <span className="text-[10px] text-[#8B8DA3]">{file.fileSize || 'Link'}</span>
                        </div>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-[#5B4FE9] hover:bg-[#EFEDFC] rounded-lg transition-colors shrink-0"
                        title="Open file link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM DIRECTORY */}
          {activeTab === 'team' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-[#E8E7F3] shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5B4FE9] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {activeProject.ownerName ? activeProject.ownerName.slice(0, 2).toUpperCase() : 'PO'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#14162B]">{activeProject.ownerName || 'Problem Owner'}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFEDFC] text-[#5B4FE9]">
                        Problem Owner & Mentor
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6D82] mt-0.5">Authorizes milestones and provides test site access</p>
                  </div>
                </div>
              </div>

              {activeProject.solverNames?.map((solverName, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-2xl border border-[#E8E7F3] shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1FAE7C] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {solverName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#14162B]">{solverName}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F7F0] text-[#1FAE7C]">
                          Lead Solution Engineer
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B6D82] mt-0.5">Primary innovator driving code & hardware deliverables</p>
                    </div>
                  </div>

                  {onOpenMessages && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenMessages();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F4F7] hover:bg-[#EFEDFC] hover:text-[#5B4FE9] text-[#4A4C63] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Chat
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
