import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
  Calendar,
  Layers,
  Sparkles,
  Send,
  FileText,
  Megaphone,
  Check,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle, getAccessToken } from '../services/googleAuth';
import {
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomAnnouncement,
  ClassroomMaterial,
  listClassroomCourses,
  listCourseWork,
  listAnnouncements,
  listCourseWorkMaterials,
  createClassroomCourse,
  postClassroomAnnouncement,
  createClassroomAssignment,
} from '../services/classroomApi';

interface ClassroomHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  initialCourseId?: string;
}

export const ClassroomHubModal: React.FC<ClassroomHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
}) => {
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [courseWork, setCourseWork] = useState<ClassroomCourseWork[]>([]);
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [materials, setMaterials] = useState<ClassroomMaterial[]>([]);
  const [activeCourseTab, setActiveCourseTab] = useState<'work' | 'announcements' | 'materials'>('work');

  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Creation Modals & Forms
  const [showCreateCourseForm, setShowCreateCourseForm] = useState(false);
  const [newCourseName, setNewCourseName] = useState('IDLTech No-Code Automation Masterclass');
  const [newCourseSection, setNewCourseSection] = useState('Live Batch 2026');
  const [newCourseDesc, setNewCourseDesc] = useState('Hands-on enterprise automation pipelines with n8n, Make, Zapier & Gemini AI.');

  const [showPostAnnouncementForm, setShowPostAnnouncementForm] = useState(false);
  const [announcementText, setAnnouncementText] = useState('Welcome to the IDLTech Automation Lab! Please review Module 1 n8n setup guide.');

  const [showPostAssignmentForm, setShowPostAssignmentForm] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('Lab 1: Deploying n8n Webhook Listener');
  const [assignmentDesc, setAssignmentDesc] = useState('Build an incoming webhook that validates JSON payload and triggers a notification.');

  // MANDATORY USER CONFIRMATION MODALS (Workspace integration guidelines)
  const [pendingAction, setPendingAction] = useState<{
    type: 'create_course' | 'post_announcement' | 'create_assignment';
    title: string;
    description: string;
    action: () => Promise<void>;
  } | null>(null);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadCourses();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseDetails(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true);
      setError(null);
      const list = await listClassroomCourses();
      setCourses(list);
      if (list.length > 0 && !selectedCourse) {
        setSelectedCourse(list[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load Google Classroom courses.');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadCourseDetails = async (courseId: string) => {
    try {
      setIsLoadingDetails(true);
      const [cw, ann, mat] = await Promise.all([
        listCourseWork(courseId).catch(() => []),
        listAnnouncements(courseId).catch(() => []),
        listCourseWorkMaterials(courseId).catch(() => []),
      ]);
      setCourseWork(cw);
      setAnnouncements(ann);
      setMaterials(mat);
    } catch (err: any) {
      console.error('Error loading course details:', err);
    } finally {
      setIsLoadingDetails(false);
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
      setError(err.message || 'Google sign in failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // User triggers New Course - Requires explicit confirmation
  const handleInitiateCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    setPendingAction({
      type: 'create_course',
      title: 'Confirm New Classroom Creation',
      description: `Are you sure you want to create the class "${newCourseName}" in your Google Classroom account? This will create an active class on your Google Classroom dashboard with student enrollment codes.`,
      action: async () => {
        const created = await createClassroomCourse({
          name: newCourseName,
          section: newCourseSection,
          description: newCourseDesc,
        });
        setActionSuccessMessage(`Class "${created.name}" created successfully in Google Classroom!`);
        setShowCreateCourseForm(false);
        await loadCourses();
        setSelectedCourse(created);
      },
    });
  };

  // User triggers Post Announcement - Requires explicit confirmation
  const handleInitiatePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !announcementText.trim()) return;

    setPendingAction({
      type: 'post_announcement',
      title: 'Confirm Announcement Posting',
      description: `Post announcement to "${selectedCourse.name}" in Google Classroom? All enrolled students will receive an update in their Classroom stream.`,
      action: async () => {
        await postClassroomAnnouncement(selectedCourse.id, announcementText);
        setActionSuccessMessage('Announcement posted to Google Classroom!');
        setShowPostAnnouncementForm(false);
        setAnnouncementText('');
        await loadCourseDetails(selectedCourse.id);
      },
    });
  };

  // User triggers New Assignment - Requires explicit confirmation
  const handleInitiateCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !assignmentTitle.trim()) return;

    setPendingAction({
      type: 'create_assignment',
      title: 'Confirm Assignment Creation',
      description: `Publish assignment "${assignmentTitle}" to "${selectedCourse.name}" in Google Classroom? Enrolled students will receive assignment notifications and calendar deadlines.`,
      action: async () => {
        await createClassroomAssignment(selectedCourse.id, {
          title: assignmentTitle,
          description: assignmentDesc,
          maxPoints: 100,
        });
        setActionSuccessMessage(`Assignment "${assignmentTitle}" published!`);
        setShowPostAssignmentForm(false);
        await loadCourseDetails(selectedCourse.id);
      },
    });
  };

  const handleConfirmPendingAction = async () => {
    if (!pendingAction) return;
    setIsExecutingAction(true);
    setError(null);
    try {
      await pendingAction.action();
      setPendingAction(null);
    } catch (err: any) {
      setError(err.message || 'Operation failed in Google Classroom.');
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
          aria-label="Close Classroom Hub"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 p-0.5 shadow-lg shadow-emerald-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl font-bold text-white">
                Google Classroom Hub
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Official Classroom API
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Synchronize IDLTech Automation Bootcamp cohorts, coursework, assignments, and announcements directly with Google Classroom.
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
                  className="w-10 h-10 rounded-full border border-emerald-400"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentUser.displayName || 'Google User'}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-800">
                    Classroom Connected
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
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Connect Google Classroom
                </div>
                <div className="text-xs text-slate-400">
                  Sign in with Google to view your classes, assignments, and cohort rosters.
                </div>
              </div>
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadCourses}
                disabled={isLoadingCourses}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCourses ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logoutGoogle();
                  onUserChange(null);
                  setCourses([]);
                  setSelectedCourse(null);
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
            <GraduationCap className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h4 className="font-display font-bold text-lg text-white">
              Google Classroom Sign-in Required
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
              Connect your Google Workspace or personal Google account to view active cohorts, post lab assignments, and synchronize bootcamp students with Google Classroom.
            </p>
            <button
              type="button"
              onClick={handleSignIn}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40"
            >
              Sign in with Google to Access Classroom
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Course Selector & Creation (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Your Classes ({courses.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateCourseForm(true)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/80 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Class</span>
                </button>
              </div>

              {isLoadingCourses ? (
                <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                  Loading courses...
                </div>
              ) : courses.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">No active courses found.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Create your first IDLTech Bootcamp class to link cohorts.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreateCourseForm(true)}
                    className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    Create Cohort Class
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {courses.map((c) => {
                    const isSelected = selectedCourse?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCourse(c)}
                        className={`w-full p-3.5 rounded-xl text-left transition-all border ${
                          isSelected
                            ? 'bg-slate-950 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-semibold text-xs text-white truncate">
                            {c.name}
                          </h5>
                          {c.enrollmentCode && (
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800 shrink-0">
                              {c.enrollmentCode}
                            </span>
                          )}
                        </div>
                        {c.section && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {c.section}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono">
                          <span className="text-emerald-400 font-semibold">{c.courseState}</span>
                          {c.room && <span>• {c.room}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Selected Course Overview, Assignments, & Actions (8 cols) */}
            <div className="lg:col-span-8">
              {selectedCourse ? (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  {/* Selected Course Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                        Selected Google Classroom
                      </div>
                      <h4 className="font-display font-bold text-lg text-white">
                        {selectedCourse.name}
                      </h4>
                      {selectedCourse.descriptionHeading && (
                        <p className="text-xs text-slate-400">
                          {selectedCourse.descriptionHeading} • {selectedCourse.section}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {selectedCourse.alternateLink && (
                        <a
                          href={selectedCourse.alternateLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 flex items-center gap-1.5 transition-colors"
                        >
                          <span>Open in Classroom</span>
                          <ExternalLink className="w-3 h-3 text-cyan-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Sub-Tabs: Assignments, Announcements, Materials */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveCourseTab('work')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          activeCourseTab === 'work'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Assignments ({courseWork.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveCourseTab('announcements')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          activeCourseTab === 'announcements'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        <span>Announcements ({announcements.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveCourseTab('materials')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          activeCourseTab === 'materials'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Materials ({materials.length})</span>
                      </button>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2">
                      {activeCourseTab === 'work' && (
                        <button
                          type="button"
                          onClick={() => setShowPostAssignmentForm(true)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Assignment</span>
                        </button>
                      )}
                      {activeCourseTab === 'announcements' && (
                        <button
                          type="button"
                          onClick={() => setShowPostAnnouncementForm(true)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-300 bg-cyan-950 border border-cyan-800 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Post Update</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tab Content Display */}
                  {isLoadingDetails ? (
                    <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                      Syncing coursework with Google Classroom...
                    </div>
                  ) : activeCourseTab === 'work' ? (
                    courseWork.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No assignments published yet for this course.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {courseWork.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-white">
                                  {item.title}
                                </span>
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                                  {item.state}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              <div className="text-[10px] text-slate-500 font-mono mt-1.5">
                                Max Points: {item.maxPoints || 100} • Type: {item.workType}
                              </div>
                            </div>
                            {item.alternateLink && (
                              <a
                                href={item.alternateLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-cyan-400 p-1"
                                title="Open assignment"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ) : activeCourseTab === 'announcements' ? (
                    announcements.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No announcements posted to this course stream.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {announcements.map((ann) => (
                          <div
                            key={ann.id}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800"
                          >
                            <p className="text-xs text-slate-200 whitespace-pre-wrap">
                              {ann.text}
                            </p>
                            <div className="text-[10px] text-slate-500 font-mono mt-2 flex items-center justify-between">
                              <span>Posted: {ann.creationTime ? new Date(ann.creationTime).toLocaleString() : ''}</span>
                              {ann.alternateLink && (
                                <a
                                  href={ann.alternateLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-400 hover:underline"
                                >
                                  View on Classroom
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    materials.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No reference materials found in this course.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {materials.map((mat) => (
                          <div
                            key={mat.id}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800"
                          >
                            <h5 className="font-semibold text-xs text-white">
                              {mat.title}
                            </h5>
                            {mat.description && (
                              <p className="text-xs text-slate-400 mt-1">
                                {mat.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  Select a class from the left or create a new cohort class to inspect Google Classroom details.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Course Form Modal */}
        {showCreateCourseForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl p-6 text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-base text-white">
                  Create Google Classroom Course
                </h4>
                <button
                  type="button"
                  onClick={() => setShowCreateCourseForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleInitiateCreateCourse} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Section / Cohort
                  </label>
                  <input
                    type="text"
                    value={newCourseSection}
                    onChange={(e) => setNewCourseSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Description Heading
                  </label>
                  <textarea
                    rows={2}
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateCourseForm(false)}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md"
                  >
                    Review &amp; Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Post Announcement Form Modal */}
        {showPostAnnouncementForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl p-6 text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-base text-white">
                  Post to Google Classroom Stream
                </h4>
                <button
                  type="button"
                  onClick={() => setShowPostAnnouncementForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleInitiatePostAnnouncement} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Announcement Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPostAnnouncementForm(false)}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Review &amp; Publish</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Post Assignment Form Modal */}
        {showPostAssignmentForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl p-6 text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-base text-white">
                  Create Classroom Assignment
                </h4>
                <button
                  type="button"
                  onClick={() => setShowPostAssignmentForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleInitiateCreateAssignment} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Instructions &amp; Problem Brief
                  </label>
                  <textarea
                    rows={3}
                    value={assignmentDesc}
                    onChange={(e) => setAssignmentDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPostAssignmentForm(false)}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Review &amp; Publish</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MANDATORY USER CONFIRMATION DIALOG (Per Workspace integration guidelines) */}
        {pendingAction && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl p-6 text-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
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
                  onClick={handleConfirmPendingAction}
                  disabled={isExecutingAction}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-1.5"
                >
                  {isExecutingAction ? (
                    <span>Executing in Classroom...</span>
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
