import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  FolderPlus,
  FileText,
  FileSpreadsheet,
  FilePlus2,
  Folder,
  Trash2,
  RefreshCw,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle } from '../services/googleAuth';
import {
  DriveFile,
  DriveAboutInfo,
  listDriveFiles,
  createDriveFolder,
  createDriveDocument,
  deleteDriveFile,
  getDriveAbout,
} from '../services/driveApi';

interface DriveHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  blueprintContent?: string;
  blueprintTitle?: string;
}

export const DriveHubModal: React.FC<DriveHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  blueprintContent,
  blueprintTitle,
}) => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [aboutInfo, setAboutInfo] = useState<DriveAboutInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'documents' | 'spreadsheets' | 'folders' | 'blueprints'
  >('all');

  // Sub-forms for creating folder / document
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('IDLTech Studio - Project Deliverables');

  const [showDocModal, setShowDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('IDLTech_App_Specification_Blueprint.md');
  const [newDocContent, setNewDocContent] = useState(
    blueprintContent ||
      `# IDLTech Project Blueprint\n\nPlatform: IDLTech Studio (idltech.idlmatch.com)\nTier: Launch Tier Mobile App (Rs. 19,999 + GST)\nTimeline: 7 Days Delivery Guarantee\n\n## Included Architecture:\n- Custom React 19 + Tailwind CSS Frontend\n- Real-time Firestore Database Integration\n- Google Workspace Automation (Gmail, Classroom, Tasks, Drive)\n- Production APK/PWA build with 100% IP ownership\n\nContact: contact@idltech.idlmatch.com`
  );

  // MANDATORY USER CONFIRMATION MODALS (Workspace integration guidelines)
  const [pendingAction, setPendingAction] = useState<{
    type: 'create_folder' | 'create_doc' | 'delete_file';
    title: string;
    description: string;
    action: () => Promise<void>;
  } | null>(null);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadFiles();
      loadAbout();
    }
  }, [isOpen, currentUser, activeFilter]);

  const loadAbout = async () => {
    try {
      const info = await getDriveAbout();
      setAboutInfo(info);
    } catch {
      // Non-fatal if about fails
    }
  };

  const loadFiles = async (queryTerm = searchQuery) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await listDriveFiles({
        query: queryTerm,
        filterType: activeFilter,
        pageSize: 40,
      });
      setFiles(res.files);
    } catch (err: any) {
      setError(err.message || 'Unable to load Google Drive files.');
    } finally {
      setIsLoading(false);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles(searchQuery);
  };

  // 1. Create Folder with confirmation
  const handleInitiateCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setPendingAction({
      type: 'create_folder',
      title: 'Confirm Folder Creation',
      description: `Create a new Google Drive folder named "${newFolderName.trim()}" in your Google Drive root?`,
      action: async () => {
        await createDriveFolder(newFolderName.trim());
        setShowFolderModal(false);
        setNewFolderName('IDLTech Studio - Project Deliverables');
        setActionSuccessMessage(`Folder "${newFolderName}" created successfully.`);
        await loadFiles();
      },
    });
  };

  // 2. Create / Export Document with confirmation
  const handleInitiateCreateDoc = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    setPendingAction({
      type: 'create_doc',
      title: 'Confirm Document Save to Google Drive',
      description: `Save the document "${newDocTitle.trim()}" directly into your Google Drive? This will create a file with your IDLTech app architecture blueprint.`,
      action: async () => {
        await createDriveDocument({
          name: newDocTitle.trim(),
          content: newDocContent,
          mimeType: 'text/markdown',
        });
        setShowDocModal(false);
        setActionSuccessMessage(`Document "${newDocTitle}" successfully saved to your Google Drive!`);
        await loadFiles();
      },
    });
  };

  // 3. Delete file with confirmation
  const handleInitiateDelete = (file: DriveFile) => {
    setPendingAction({
      type: 'delete_file',
      title: 'Confirm File Deletion',
      description: `Are you sure you want to delete "${file.name}" from your Google Drive? This action cannot be undone.`,
      action: async () => {
        await deleteDriveFile(file.id);
        setActionSuccessMessage(`"${file.name}" was deleted from Google Drive.`);
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
      },
    });
  };

  const executePendingAction = async () => {
    if (!pendingAction) return;
    try {
      setIsExecutingAction(true);
      setError(null);
      await pendingAction.action();
      setPendingAction(null);
    } catch (err: any) {
      setError(err.message || 'Operation failed.');
    } finally {
      setIsExecutingAction(false);
    }
  };

  const formatFileSize = (bytesStr?: string) => {
    if (!bytesStr) return '—';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) {
      return <Folder className="w-5 h-5 text-amber-400" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    if (mimeType.includes('document') || mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-cyan-400" />;
    }
    return <FileText className="w-5 h-5 text-indigo-400" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0d1322] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">Google Drive Hub</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Browse project assets, export architecture blueprints &amp; sync client deliverables
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-5 h-5 rounded-full border border-emerald-400"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[130px]">
                  {currentUser.email}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccessMessage && (
          <div className="px-6 py-2.5 bg-emerald-950/60 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-400 hover:text-white"
            >
              &times;
            </button>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="px-6 py-2.5 bg-rose-950/60 border-b border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white"
            >
              &times;
            </button>
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!currentUser ? (
            /* Unauthenticated View: Official Sign In With Google */
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <HardDrive className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white font-display">
                  Connect Google Drive to IDLTech
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Sign in with your Google account with permission to view and organize your Google
                  Drive files, export AI blueprints, and sync 7-day project deliverables.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Permission &amp; Safety Commitment</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  IDLTech accesses Google Drive with permission from the app's users. Your access
                  token is kept in-memory only and never persisted in storage. Mutating operations
                  always require your explicit confirmation.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated Drive Hub View */
            <div className="space-y-6">
              {/* Top Control Bar: Search + Quick Actions */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Google Drive files..."
                    className="w-full pl-10 pr-20 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 rounded bg-emerald-500/10 hover:bg-emerald-500/20"
                  >
                    Search
                  </button>
                </form>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowFolderModal(true)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>New Folder</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (blueprintContent) {
                        setNewDocContent(blueprintContent);
                        if (blueprintTitle) setNewDocTitle(`${blueprintTitle}.md`);
                      }
                      setShowDocModal(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <FilePlus2 className="w-3.5 h-3.5 text-white" />
                    <span>Export App Blueprint</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loadFiles()}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Refresh Files"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
                {[
                  { id: 'all', label: 'All Files' },
                  { id: 'blueprints', label: 'IDLTech Blueprints' },
                  { id: 'documents', label: 'Documents & PDFs' },
                  { id: 'spreadsheets', label: 'Spreadsheets' },
                  { id: 'folders', label: 'Folders' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                      activeFilter === tab.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Storage Overview Bar */}
              {aboutInfo?.storageQuota?.limit && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Drive Storage Quota:</span>
                    <span className="text-slate-200 font-semibold">
                      {formatFileSize(aboutInfo.storageQuota.usage)} / {formatFileSize(aboutInfo.storageQuota.limit)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    IDLTech Rebranded Hub &bull; idltech.idlmatch.com
                  </span>
                </div>
              )}

              {/* Files Table / List */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                {isLoading ? (
                  <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                    <span className="text-xs">Fetching Google Drive directory...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="py-16 px-4 text-center space-y-3">
                    <Folder className="w-10 h-10 text-slate-600 mx-auto" />
                    <h5 className="text-sm font-semibold text-slate-300">No matching files found</h5>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click &ldquo;Export App Blueprint&rdquo; to save an architecture document or &ldquo;New Folder&rdquo; to create your project folder in Google Drive.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowDocModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/50 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Save IDLTech Blueprint to Drive</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    <div className="grid grid-cols-12 px-4 py-2.5 text-[11px] font-mono text-slate-400 font-semibold bg-slate-900">
                      <div className="col-span-6 sm:col-span-5">NAME</div>
                      <div className="hidden sm:block sm:col-span-3">MODIFIED</div>
                      <div className="col-span-3 sm:col-span-2">SIZE</div>
                      <div className="col-span-3 sm:col-span-2 text-right">ACTIONS</div>
                    </div>

                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="grid grid-cols-12 px-4 py-3 items-center hover:bg-slate-800/40 transition-colors text-xs"
                      >
                        {/* Name + Icon */}
                        <div className="col-span-6 sm:col-span-5 flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="shrink-0">{getFileIcon(file.mimeType)}</div>
                          <span
                            className="text-slate-200 font-medium truncate hover:text-white"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                        </div>

                        {/* Modified Time */}
                        <div className="hidden sm:block sm:col-span-3 text-slate-400 text-[11px] font-mono truncate">
                          {file.modifiedTime
                            ? new Date(file.modifiedTime).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </div>

                        {/* Size */}
                        <div className="col-span-3 sm:col-span-2 text-slate-400 text-[11px] font-mono">
                          {formatFileSize(file.size)}
                        </div>

                        {/* Actions */}
                        <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1.5">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleInitiateDelete(file)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#090d16] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px]">Drive API v3 &bull; OAuth Scopes Synchronized</span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                type="button"
                onClick={async () => {
                  await logoutGoogle();
                  onUserChange(null);
                  setFiles([]);
                }}
                className="text-slate-400 hover:text-rose-300 text-xs transition-colors"
              >
                Sign out Google
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* SUB-MODAL: Create Folder */}
      {showFolderModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>Create Google Drive Folder</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInitiateCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. IDLTech Project Assets"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                Will prompt for confirmation before adding this directory to your Drive root.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Create / Export Document */}
      {showDocModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <FilePlus2 className="w-4 h-4 text-emerald-400" />
                <span>Export Blueprint to Google Drive</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInitiateCreateDoc} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Content (Markdown / Specifications)
                </label>
                <textarea
                  rows={8}
                  required
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 leading-relaxed">
                This document will be saved directly to your Google Drive and accessible across your devices.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  Save to Google Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION MODAL (Strictly enforced by workspace-integration guidelines) */}
      {pendingAction && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0f172a] border border-amber-500/40 rounded-2xl p-6 shadow-2xl shadow-amber-500/10 space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{pendingAction.title}</h4>
                <span className="text-[11px] font-mono text-amber-400/90 font-semibold uppercase tracking-wider">
                  Action Requires Authorization
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              {pendingAction.description}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                disabled={isExecutingAction}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executePendingAction}
                disabled={isExecutingAction}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pendingAction.type === 'delete_file'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                } disabled:opacity-50`}
              >
                {isExecutingAction ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : pendingAction.type === 'delete_file' ? (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete File</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Proceed</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
