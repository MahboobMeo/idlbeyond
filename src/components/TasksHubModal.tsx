import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  Square,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User as UserIcon,
  Calendar,
  Clock,
  Sparkles,
  Trash2,
  ListTodo,
  FolderPlus,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle } from '../services/googleAuth';
import {
  GoogleTaskList,
  GoogleTaskItem,
  listTaskLists,
  createTaskList,
  listTasks,
  createGoogleTask,
  updateGoogleTaskStatus,
  deleteGoogleTask,
} from '../services/tasksApi';

interface TasksHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
}

export const TasksHubModal: React.FC<TasksHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
}) => {
  const [taskLists, setTaskLists] = useState<GoogleTaskList[]>([]);
  const [selectedList, setSelectedList] = useState<GoogleTaskList | null>(null);
  const [tasks, setTasks] = useState<GoogleTaskItem[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  // New list form state
  const [newListTitle, setNewListTitle] = useState('IDLTech Project Milestones');
  const [showNewListForm, setShowNewListForm] = useState(false);

  // MANDATORY USER CONFIRMATION MODALS (Workspace guidelines)
  const [pendingAction, setPendingAction] = useState<{
    type: 'create_task' | 'toggle_status' | 'delete_task' | 'sync_roadmap';
    title: string;
    description: string;
    action: () => Promise<void>;
  } | null>(null);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadTaskLists();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (selectedList) {
      loadTasksForList(selectedList.id);
    }
  }, [selectedList]);

  const loadTaskLists = async () => {
    try {
      setIsLoadingLists(true);
      setError(null);
      const lists = await listTaskLists();
      setTaskLists(lists);
      if (lists.length > 0 && !selectedList) {
        setSelectedList(lists[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load Google Task lists.');
    } finally {
      setIsLoadingLists(false);
    }
  };

  const loadTasksForList = async (listId: string) => {
    try {
      setIsLoadingTasks(true);
      const items = await listTasks(listId, true);
      setTasks(items);
    } catch (err: any) {
      setError(err.message || 'Unable to load tasks.');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onUserChange(result.user);
      }
    } catch (err: any) {
      setError(err.message || 'Google sign in failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Add Task with Confirmation
  const handleInitiateCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedList || !newTaskTitle.trim()) return;

    setPendingAction({
      type: 'create_task',
      title: 'Confirm New Task Creation',
      description: `Add "${newTaskTitle}" to your Google Tasks list "${selectedList.title}"? This will sync directly with your Google Tasks and Google Calendar.`,
      action: async () => {
        await createGoogleTask(selectedList.id, {
          title: newTaskTitle,
          notes: newTaskNotes,
        });
        setActionSuccessMessage(`Task "${newTaskTitle}" added to Google Tasks!`);
        setShowNewTaskForm(false);
        setNewTaskTitle('');
        setNewTaskNotes('');
        await loadTasksForList(selectedList.id);
      },
    });
  };

  // Toggle Task Status with Confirmation
  const handleInitiateToggleTask = (task: GoogleTaskItem) => {
    if (!selectedList) return;
    const targetStatus = task.status === 'completed' ? 'needsAction' : 'completed';
    const actionLabel = targetStatus === 'completed' ? 'mark as completed' : 'mark as uncompleted';

    setPendingAction({
      type: 'toggle_status',
      title: 'Confirm Task Update',
      description: `Do you want to ${actionLabel} "${task.title}" in your Google Tasks?`,
      action: async () => {
        await updateGoogleTaskStatus(selectedList.id, task.id, targetStatus);
        setActionSuccessMessage(`Task "${task.title}" updated.`);
        await loadTasksForList(selectedList.id);
      },
    });
  };

  // Delete Task with Confirmation
  const handleInitiateDeleteTask = (task: GoogleTaskItem) => {
    if (!selectedList) return;

    setPendingAction({
      type: 'delete_task',
      title: 'Confirm Task Deletion',
      description: `Permanently delete task "${task.title}" from your Google Tasks list "${selectedList.title}"? This action cannot be undone.`,
      action: async () => {
        await deleteGoogleTask(selectedList.id, task.id);
        setActionSuccessMessage(`Task "${task.title}" deleted.`);
        await loadTasksForList(selectedList.id);
      },
    });
  };

  // 1-Click Sync 7-Day Roadmap to Google Tasks
  const handleInitiateSyncRoadmap = () => {
    setPendingAction({
      type: 'sync_roadmap',
      title: 'Confirm 7-Day Delivery Roadmap Sync',
      description: 'Create a dedicated "IDLTech 7-Day Delivery Roadmap" list in your Google Tasks with 4 milestone tasks (Map, See, Build, Launch)?',
      action: async () => {
        const newList = await createTaskList('IDLTech 7-Day App Roadmap');
        const milestones = [
          { title: 'Day 1: Map & Architecture Blueprint Sign-off', notes: 'Review user journey diagram and database schema with IDLTech engineering team.' },
          { title: 'Day 3: See - Approve Clickable Mobile Prototype', notes: 'Test interactive screens with brand typography and UPI flow on device.' },
          { title: 'Day 5: Build - Complete Webhook & Backend Integration', notes: 'Verify real-time database, WhatsApp alerts, and payment receipts.' },
          { title: 'Day 7: Launch - Google Play Store & iOS App Store Binary Submission', notes: 'Review store console listings, privacy policies, and begin 30-day warranty.' },
        ];
        for (const m of milestones) {
          await createGoogleTask(newList.id, m);
        }
        setActionSuccessMessage('7-Day Roadmap synced to Google Tasks successfully!');
        await loadTaskLists();
        setSelectedList(newList);
      },
    });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    setIsExecutingAction(true);
    setError(null);
    try {
      await pendingAction.action();
      setPendingAction(null);
    } catch (err: any) {
      setError(err.message || 'Operation failed in Google Tasks.');
      setPendingAction(null);
    } finally {
      setIsExecutingAction(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close Tasks Hub"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl font-bold text-white">
                Google Tasks Hub
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Official Tasks API
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Synchronize your IDLTech project deliverables, 7-day app development milestones, and bootcamp action items directly with Google Tasks.
            </p>
          </div>
        </div>

        {/* User Auth Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Google User'}
                  className="w-10 h-10 rounded-full border border-cyan-400"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyan-600/30 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentUser.displayName || 'Google User'}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.2 rounded border border-cyan-800">
                    Tasks Connected
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {currentUser.email}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Connect Google Tasks
                </div>
                <div className="text-xs text-slate-400">
                  Sign in with Google to view and sync your task lists and project deadlines.
                </div>
              </div>
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadTaskLists}
                disabled={isLoadingLists}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLists ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logoutGoogle();
                  onUserChange(null);
                  setTaskLists([]);
                  setSelectedList(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {actionSuccessMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccessMessage(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {!currentUser ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <CheckSquare className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h4 className="font-display font-bold text-lg text-white">
              Google Tasks Authentication Required
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
              Connect your Google account to automatically track your app development deliverables, set reminders, and export milestone schedules to your task list.
            </p>
            <button
              type="button"
              onClick={handleSignIn}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-950/40"
            >
              Sign in with Google to Open Tasks
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick 1-Click Sync Templates */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-indigo-950/50 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    IDLTech 7-Day App Roadmap Sync
                  </h4>
                  <p className="text-xs text-slate-300">
                    Export the complete 4-stage delivery timeline directly to a new Google Tasks list.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInitiateSyncRoadmap}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Export 7-Day Roadmap to Tasks</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Task Lists (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Task Lists ({taskLists.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNewListForm(true)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800/80 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New List</span>
                  </button>
                </div>

                {isLoadingLists ? (
                  <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                    Loading task lists...
                  </div>
                ) : taskLists.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <ListTodo className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-300">No task lists found.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {taskLists.map((list) => {
                      const isSelected = selectedList?.id === list.id;
                      return (
                        <button
                          key={list.id}
                          type="button"
                          onClick={() => setSelectedList(list)}
                          className={`w-full p-3.5 rounded-xl text-left transition-all border ${
                            isSelected
                              ? 'bg-slate-950 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-xs text-white truncate">
                              {list.title}
                            </h5>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            )}
                          </div>
                          {list.updated && (
                            <div className="text-[10px] text-slate-500 font-mono mt-1">
                              Updated {new Date(list.updated).toLocaleDateString()}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Tasks in Selected List (8 cols) */}
              <div className="lg:col-span-8">
                {selectedList ? (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                          Selected Task List
                        </div>
                        <h4 className="font-display font-bold text-lg text-white">
                          {selectedList.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowNewTaskForm(true)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Task</span>
                      </button>
                    </div>

                    {isLoadingTasks ? (
                      <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                        Fetching tasks from Google Tasks API...
                      </div>
                    ) : tasks.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No tasks in this list yet. Click "Add Task" to create one.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                        {tasks.map((task) => {
                          const isDone = task.status === 'completed';
                          return (
                            <div
                              key={task.id}
                              className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                                isDone
                                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                                  : 'bg-slate-900 border-slate-800'
                              }`}
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  type="button"
                                  onClick={() => handleInitiateToggleTask(task)}
                                  className="mt-0.5 text-slate-400 hover:text-cyan-400"
                                  title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                                >
                                  {isDone ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                                <div>
                                  <h5 className={`font-semibold text-xs ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                    {task.title}
                                  </h5>
                                  {task.notes && (
                                    <p className="text-[11px] text-slate-400 mt-0.5 whitespace-pre-wrap">
                                      {task.notes}
                                    </p>
                                  )}
                                  {task.due && (
                                    <div className="text-[10px] text-indigo-300 font-mono mt-1 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>Due: {new Date(task.due).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleInitiateDeleteTask(task)}
                                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                    Select a task list to inspect items.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Task Form Modal */}
        {showNewTaskForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl p-6 text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-base text-white">
                  Add Task to Google Tasks
                </h4>
                <button
                  type="button"
                  onClick={() => setShowNewTaskForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleInitiateCreateTask} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Test UPI webhook integration"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Notes / Description
                  </label>
                  <textarea
                    rows={3}
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    placeholder="Extra task details or URLs..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTaskForm(false)}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md"
                  >
                    Review &amp; Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MANDATORY USER CONFIRMATION MODAL FOR TASKS MUTATIONS */}
        {pendingAction && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl p-6 text-slate-100">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-white text-center">
                {pendingAction.title}
              </h4>
              <p className="text-xs text-slate-300 text-center mt-2 leading-relaxed">
                {pendingAction.description}
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  disabled={isExecutingAction}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  disabled={isExecutingAction}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md flex items-center gap-1.5"
                >
                  {isExecutingAction ? (
                    <span>Executing in Tasks...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Execute</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
