import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  Inbox,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle, getAccessToken } from '../services/googleAuth';
import {
  sendGmailMessage,
  listGmailMessages,
  getGmailUserProfile,
  GmailMessageSummary,
  SendEmailPayload,
} from '../services/gmailApi';

interface GmailHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  initialRecipient?: string;
  initialSubject?: string;
  initialBody?: string;
}

export const GmailHubModal: React.FC<GmailHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  initialRecipient = 'contact@idltech.idlmatch.com',
  initialSubject = 'Inquiry: Mobile App & Automation Architecture — IDLTech',
  initialBody = '',
}) => {
  const [activeTab, setActiveTab] = useState<'compose' | 'inbox'>('compose');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Compose State
  const [to, setTo] = useState(initialRecipient);
  const [cc, setCc] = useState('idlfxn@gmail.com');
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody || 'Hello IDLTech Team,\n\nI would like to discuss building an app and automation pipeline for my business.\n\nBest regards,');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Destructive/Mutating Action Confirmation State (MANDATORY per Workspace guidelines)
  const [showSendConfirmation, setShowSendConfirmation] = useState(false);

  // Inbox State
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [inboxError, setInboxError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('IDLTech OR blueprint OR app');
  const [userProfile, setUserProfile] = useState<{ emailAddress: string; messagesTotal: number } | null>(null);

  useEffect(() => {
    if (initialSubject) setSubject(initialSubject);
    if (initialRecipient) setTo(initialRecipient);
    if (initialBody) setBody(initialBody);
  }, [initialSubject, initialRecipient, initialBody]);

  // Load user profile & messages when signed in
  useEffect(() => {
    if (isOpen && currentUser) {
      loadUserProfileAndInbox();
    }
  }, [isOpen, currentUser]);

  const loadUserProfileAndInbox = async () => {
    try {
      setIsLoadingMessages(true);
      setInboxError(null);
      const token = await getAccessToken();
      if (!token) return;

      const profile = await getGmailUserProfile().catch(() => null);
      if (profile) setUserProfile(profile);

      const msgs = await listGmailMessages(searchQuery, 8);
      setMessages(msgs);
    } catch (err: any) {
      setInboxError(err.message || 'Unable to load Gmail messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onUserChange(result.user);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in was interrupted. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    onUserChange(null);
    setMessages([]);
    setUserProfile(null);
  };

  // Pre-send validation before showing confirmation modal
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    setSendSuccess(null);

    if (!to || !to.includes('@')) {
      setSendError('Please provide a valid recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setSendError('Please provide a subject line for your email.');
      return;
    }
    if (!body.trim()) {
      setSendError('Please write an email body message.');
      return;
    }

    // Trigger explicit confirmation dialog
    setShowSendConfirmation(true);
  };

  // Confirmed execution of send operation
  const handleConfirmedSend = async () => {
    setShowSendConfirmation(false);
    setIsSending(true);
    setSendError(null);
    try {
      const payload: SendEmailPayload = {
        to,
        subject,
        body,
        cc: cc.trim() || undefined,
      };
      const res = await sendGmailMessage(payload);
      setSendSuccess(`Email dispatched successfully via your Gmail account! (Message ID: ${res.id})`);
      setTimeout(() => {
        loadUserProfileAndInbox();
      }, 1000);
    } catch (err: any) {
      setSendError(err.message || 'Failed to dispatch email via Gmail API.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close Gmail Hub"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-500 p-0.5 shadow-lg shadow-rose-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Mail className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl font-bold text-white">
                IDLTech Gmail Hub
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                Official API
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Directly send blueprints, inquiry emails, and inspect communication via your authorized Gmail account.
            </p>
          </div>
        </div>

        {/* Authentication State Card */}
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
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-cyan-400 flex items-center justify-center border border-indigo-500/30">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentUser.displayName || 'Google User'}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-800">
                    Connected
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
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Connect Your Google Account
                </div>
                <div className="text-xs text-slate-400">
                  Authenticate to send verified emails with permission from your Gmail inbox.
                </div>
              </div>
            </div>
          )}

          {currentUser ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              Disconnect
            </button>
          ) : (
            /* Official Google Sign-In Button as required by Workspace Integration skill */
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
              <span>{isSigningIn ? 'Connecting Google...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('compose')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'compose'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Compose &amp; Send Email</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inbox')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'inbox'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Gmail Activity &amp; Threads</span>
          </button>
        </div>

        {/* Tab 1: Compose Email via Gmail API */}
        {activeTab === 'compose' && (
          <div>
            {!currentUser ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Mail className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h4 className="font-display font-bold text-lg text-white">
                  Google Authentication Required
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                  To send verified emails through the Gmail API on your behalf, please sign in with your Google account above.
                </p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Sign in with Google to Compose
                </button>
              </div>
            ) : (
              <form onSubmit={handleInitiateSend} className="space-y-4">
                {sendSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{sendSuccess}</span>
                  </div>
                )}

                {sendError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{sendError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Recipient To:
                    </label>
                    <input
                      type="email"
                      required
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Carbon Copy (Cc):
                    </label>
                    <input
                      type="text"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="optional cc address"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subject Line:
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject of the email"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Message Body:
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your email message..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sends directly via Google's official Gmail API</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending via Gmail...' : 'Review & Send via Gmail'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Inbox & Threads */}
        {activeTab === 'inbox' && (
          <div>
            {!currentUser ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Inbox className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h4 className="font-display font-bold text-lg text-white">
                  Please Sign in to View Gmail Messages
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                  Sign in with Google to browse recent emails, inquiry threads, and notifications from your Gmail account.
                </p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-semibold"
                >
                  Sign in with Google
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                    <Search className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search query (e.g., IDLTech, quote, booking)..."
                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={loadUserProfileAndInbox}
                      disabled={isLoadingMessages}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {inboxError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{inboxError}</span>
                  </div>
                )}

                {isLoadingMessages ? (
                  <div className="py-12 text-center text-xs text-slate-400 animate-pulse flex flex-col items-center gap-2">
                    <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
                    <span>Fetching threads from Gmail API...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400">
                    No matching messages found for this query in your Gmail inbox.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900/80 border border-slate-800 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h5 className="font-semibold text-xs text-white truncate flex-1">
                            {msg.subject}
                          </h5>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {msg.date ? new Date(msg.date).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-400 font-mono mb-1 truncate">
                          From: {msg.from}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {msg.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MANDATORY USER CONFIRMATION MODAL FOR DESTRUCTIVE/MUTATING WORKSPACE OPERATIONS */}
        {showSendConfirmation && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-indigo-500/50 shadow-2xl p-6 text-slate-100">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-white text-center">
                Confirm Gmail Dispatch
              </h4>
              <p className="text-xs text-slate-300 text-center mt-2 leading-relaxed">
                Are you sure you want to send this email message directly from your Gmail account (<span className="text-cyan-400 font-semibold">{currentUser?.email}</span>) to <span className="text-white font-semibold">{to}</span>?
              </p>

              <div className="mt-4 p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 space-y-1">
                <div><span className="text-slate-500">Subject:</span> {subject}</div>
                <div><span className="text-slate-500">Recipient:</span> {to}</div>
                {cc && <div><span className="text-slate-500">Cc:</span> {cc}</div>}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSendConfirmation(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmedSend}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Send Email</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
