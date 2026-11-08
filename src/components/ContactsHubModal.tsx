import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  UserPlus,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle } from '../services/googleAuth';
import {
  GoogleContact,
  listGoogleContacts,
  createGoogleContact,
  deleteGoogleContact,
} from '../services/contactsApi';

interface ContactsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  initialContact?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
}

export const ContactsHubModal: React.FC<ContactsHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  initialContact,
}) => {
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Contact Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [givenName, setGivenName] = useState(initialContact?.name?.split(' ')[0] || '');
  const [familyName, setFamilyName] = useState(
    initialContact?.name?.split(' ').slice(1).join(' ') || ''
  );
  const [email, setEmail] = useState(initialContact?.email || '');
  const [phone, setPhone] = useState(initialContact?.phone || '');
  const [company, setCompany] = useState(initialContact?.company || 'IDLTech Client');
  const [jobTitle, setJobTitle] = useState('Founder / Executive');

  // MANDATORY USER CONFIRMATION MODALS (Workspace Integration)
  const [pendingAction, setPendingAction] = useState<{
    type: 'create_contact' | 'delete_contact';
    title: string;
    description: string;
    action: () => Promise<void>;
  } | null>(null);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadContacts();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (initialContact) {
      if (initialContact.name) {
        const parts = initialContact.name.split(' ');
        setGivenName(parts[0] || '');
        setFamilyName(parts.slice(1).join(' ') || '');
      }
      if (initialContact.email) setEmail(initialContact.email);
      if (initialContact.phone) setPhone(initialContact.phone);
      if (initialContact.company) setCompany(initialContact.company);
    }
  }, [initialContact]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await listGoogleContacts({ pageSize: 50 });
      setContacts(res.contacts);
    } catch (err: any) {
      setError(err.message || 'Unable to load Google Contacts.');
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

  // 1. Create Contact with Confirmation
  const handleInitiateCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!givenName.trim()) return;

    const fullName = `${givenName.trim()} ${familyName.trim()}`.trim();

    setPendingAction({
      type: 'create_contact',
      title: 'Confirm New Google Contact',
      description: `Add "${fullName}" (${email || phone || 'No email/phone'}) to your Google Contacts? This will sync across your Google Account and phone contacts.`,
      action: async () => {
        const newContact = await createGoogleContact({
          givenName: givenName.trim(),
          familyName: familyName.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
          jobTitle: jobTitle.trim() || undefined,
        });

        setShowAddForm(false);
        setGivenName('');
        setFamilyName('');
        setEmail('');
        setPhone('');
        setCompany('IDLTech Client');
        setActionSuccessMessage(`Contact "${newContact.name}" added successfully.`);
        await loadContacts();
      },
    });
  };

  // 2. Delete Contact with Confirmation
  const handleInitiateDelete = (contact: GoogleContact) => {
    setPendingAction({
      type: 'delete_contact',
      title: 'Confirm Contact Deletion',
      description: `Permanently delete "${contact.name}" from your Google Contacts? This action cannot be undone.`,
      action: async () => {
        await deleteGoogleContact(contact.resourceName);
        setActionSuccessMessage(`"${contact.name}" was removed from Google Contacts.`);
        setContacts((prev) => prev.filter((c) => c.resourceName !== contact.resourceName));
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

  const filteredContacts = contacts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.jobTitle?.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0d1322] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">Google Contacts Hub</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                  People API v1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sync IDLTech consultation inquiries, client leads &amp; cohort members
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
                    className="w-5 h-5 rounded-full border border-cyan-400"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-cyan-400" />
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

        {/* Error alert */}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!currentUser ? (
            /* Unauthenticated View: Official Sign In */
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/10">
                <Users className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white font-display">
                  Connect Google Contacts to IDLTech
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Sign in with your Google account with permission to view and sync contacts for
                  IDLTech enterprise consultations and Bootcamp attendees.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Permission &amp; Safety Commitment</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  IDLTech accesses Google Contacts with permission from the app's users. Tokens are
                  cached in memory only. Adding or deleting contacts requires explicit user
                  confirmation in the modal before any changes occur.
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
            /* Authenticated Contacts View */
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, company, email..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>New Contact</span>
                  </button>

                  <button
                    type="button"
                    onClick={loadContacts}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Refresh Contacts"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Contacts Grid / List */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                {isLoading ? (
                  <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-xs">Fetching Google Contacts...</span>
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="py-16 px-4 text-center space-y-3">
                    <Users className="w-10 h-10 text-slate-600 mx-auto" />
                    <h5 className="text-sm font-semibold text-slate-300">No contacts found</h5>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {searchQuery
                        ? 'No contacts match your query.'
                        : 'Your Google Contacts directory is currently empty or contains no synchronized connections.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600/30 text-cyan-300 text-xs font-semibold hover:bg-indigo-600/50 transition-colors inline-flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3 h-3 text-cyan-400" />
                      <span>Add First Contact</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    <div className="grid grid-cols-12 px-4 py-2.5 text-[11px] font-mono text-slate-400 font-semibold bg-slate-900">
                      <div className="col-span-5 sm:col-span-4">NAME &amp; COMPANY</div>
                      <div className="col-span-4 sm:col-span-4">EMAIL</div>
                      <div className="hidden sm:block sm:col-span-3">PHONE</div>
                      <div className="col-span-3 sm:col-span-1 text-right">ACTION</div>
                    </div>

                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.resourceName}
                        className="grid grid-cols-12 px-4 py-3 items-center hover:bg-slate-800/40 transition-colors text-xs"
                      >
                        {/* Name + Photo */}
                        <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5 min-w-0 pr-2">
                          {contact.photoUrl ? (
                            <img
                              src={contact.photoUrl}
                              alt={contact.name}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-indigo-500/30 font-bold text-[10px]">
                              {contact.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div className="min-w-0 truncate">
                            <p className="text-white font-medium truncate">{contact.name}</p>
                            {(contact.company || contact.jobTitle) && (
                              <p className="text-[11px] text-slate-400 truncate">
                                {[contact.jobTitle, contact.company].filter(Boolean).join(' • ')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="col-span-4 sm:col-span-4 text-slate-300 truncate pr-2">
                          {contact.email ? (
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:text-cyan-400 inline-flex items-center gap-1.5"
                            >
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{contact.email}</span>
                            </a>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="hidden sm:block sm:col-span-3 text-slate-400 font-mono text-[11px] truncate">
                          {contact.phone ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{contact.phone}</span>
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-3 sm:col-span-1 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleInitiateDelete(contact)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete contact"
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
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-mono text-[11px]">
              IDLTech Studio Directory &bull; idltech.idlmatch.com
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                type="button"
                onClick={async () => {
                  await logoutGoogle();
                  onUserChange(null);
                  setContacts([]);
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

      {/* SUB-MODAL: Add Contact Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Add Contact to Google</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInitiateCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Rahul"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Verma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Director"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 leading-relaxed">
                Will present a confirmation step before committing this contact to your Google directory.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-xs font-bold transition-all"
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION MODAL (Strictly enforced by workspace-integration guidelines) */}
      {pendingAction && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0f172a] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 space-y-4">
            <div className="flex items-center gap-3 text-cyan-400">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{pendingAction.title}</h4>
                <span className="text-[11px] font-mono text-cyan-400/90 font-semibold uppercase tracking-wider">
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
                  pendingAction.type === 'delete_contact'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                } disabled:opacity-50`}
              >
                {isExecutingAction ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : pendingAction.type === 'delete_contact' ? (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Contact</span>
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
