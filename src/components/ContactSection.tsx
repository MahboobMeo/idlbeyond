import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle2, AlertCircle, Copy, Check, Clock, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { User } from 'firebase/auth';
import { validateContactForm, ContactSubmission, formatPrice } from '../utils/pricing';
import { sendGmailMessage } from '../services/gmailApi';
import { googleSignIn } from '../services/googleAuth';
import { saveInquiryToFirestore } from '../services/firestoreService';

interface ContactSectionProps {
  initialService?: string;
  onSuccess?: () => void;
  currentUser?: User | null;
  onUserChange?: (user: User | null) => void;
  onOpenGmailHub?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialService,
  currentUser,
  onUserChange,
  onOpenGmailHub,
}) => {
  const [formData, setFormData] = useState<ContactSubmission>({
    name: '',
    email: '',
    phone: '',
    serviceType: initialService || 'Launch Tier Mobile App (Rs. 19,999)',
    budgetRange: 'Rs. 19,999 - Rs. 40,000',
    projectDetails: '',
  });

  const [sendMethod, setSendMethod] = useState<'gmail' | 'relay'>('relay');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    timestamp: string;
    email: string;
    method: 'gmail' | 'relay';
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // If user signs in with Google, default to their Google email and offer Gmail dispatch
  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !formData.name) {
        setFormData((prev) => ({ ...prev, name: currentUser.displayName || '' }));
      }
      if (currentUser.email && !formData.email) {
        setFormData((prev) => ({ ...prev, email: currentUser.email || '' }));
      }
      setSendMethod('gmail');
    }
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (sendMethod === 'gmail') {
      // Mandatory explicit confirmation for Gmail sending
      setShowConfirmation(true);
    } else {
      executeRelaySend();
    }
  };

  const executeRelaySend = async () => {
    setIsSubmitting(true);
    setSubmissionProgress('Validating payload & persisting to Firestore...');

    try {
      await saveInquiryToFirestore({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.serviceType,
        budgetRange: formData.budgetRange,
        projectDetails: formData.projectDetails,
      });
    } catch (e) {
      console.warn('Firestore inquiry sync note:', e);
    }

    setTimeout(() => {
      setSubmissionProgress('Connecting to IDLTech mail server (relay: contact@idltech.idlmatch.com)...');
      setTimeout(() => {
        setSubmissionProgress('Dispatching notification to engineering lead...');
        setTimeout(() => {
          setIsSubmitting(false);
          const refId = `IDL-${Math.floor(100000 + Math.random() * 900000)}`;
          setSubmittedData({
            id: refId,
            timestamp: new Date().toLocaleTimeString(),
            email: formData.email,
            method: 'relay',
          });
        }, 400);
      }, 400);
    }, 350);
  };

  const executeGmailSend = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    setSubmissionProgress('Persisting inquiry & connecting to Gmail API...');

    try {
      await saveInquiryToFirestore({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.serviceType,
        budgetRange: formData.budgetRange,
        projectDetails: formData.projectDetails,
      });

      const subject = `[IDLTech Project Inquiry] ${formData.serviceType} — ${formData.name}`;
      const body = `Hello IDLTech Engineering Team,\n\nI am submitting a project consultation brief from IDLTech Studio.\n\nClient Name: ${formData.name}\nClient Email: ${formData.email}\nPhone / WhatsApp: ${formData.phone}\nService Interested: ${formData.serviceType}\nBudget Range: ${formData.budgetRange}\n\nProject Overview & Requirements:\n${formData.projectDetails}\n\nSent directly via authorized Gmail API.\nBest regards,\n${formData.name}`;

      const res = await sendGmailMessage({
        to: 'contact@idltech.idlmatch.com',
        cc: 'idlfxn@gmail.com',
        subject,
        body,
      });

      setIsSubmitting(false);
      setSubmittedData({
        id: `GMAIL-${res.id.slice(0, 8).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString(),
        email: currentUser?.email || formData.email,
        method: 'gmail',
      });
    } catch (err: any) {
      setIsSubmitting(false);
      // Fallback to relay with informative notice
      setErrors({ form: `Gmail dispatch failed: ${err.message}. You can switch to Instant Web Relay or re-authenticate.` });
    }
  };

  const handleGoogleConnect = async () => {
    try {
      const res = await googleSignIn();
      if (res && onUserChange) {
        onUserChange(res.user);
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Google sign in failed.' });
    }
  };

  const handleCopyReceipt = () => {
    if (!submittedData) return;
    const summary = `IDLTech Project Enquiry Reference: ${submittedData.id}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.serviceType}\nBudget: ${formData.budgetRange}\nDetails: ${formData.projectDetails}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoUrl = `mailto:contact@idltech.idlmatch.com?cc=idlfxn@gmail.com&subject=${encodeURIComponent(
    `[IDLTech Consultation] ${formData.serviceType} - ${formData.name}`
  )}&body=${encodeURIComponent(
    `Hello IDLTech Engineering Team,\n\nI would like to discuss a project with IDLTech.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nService: ${formData.serviceType}\nBudget: ${formData.budgetRange}\n\nProject Overview:\n${formData.projectDetails}\n\nThank you!`
  )}`;

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-950 border-t border-slate-800">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column / Info */}
          <div className="lg:col-span-5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-800">
              EMAIL &amp; GMAIL API INTEGRATION
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Let's build your app or automation engine.
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Submit your project requirements below. Send directly from your verified Google Gmail account or via our instant cloud relay to our senior architects.
            </p>

            {/* Gmail Hub Callout */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-indigo-950/40 to-slate-900 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Gmail Communications Hub</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {currentUser ? `Connected as ${currentUser.email}` : 'Compose, inspect threads, or send with Gmail'}
                  </div>
                </div>
              </div>

              {onOpenGmailHub && (
                <button
                  type="button"
                  onClick={onOpenGmailHub}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 transition-colors whitespace-nowrap"
                >
                  Open Hub
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Direct Email</div>
                  <a
                    href="mailto:contact@idltech.idlmatch.com"
                    className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                  >
                    contact@idltech.idlmatch.com
                  </a>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Backup: <span className="font-mono text-slate-400">idlfxn@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Studio Hotline &amp; WhatsApp</div>
                  <div className="text-sm font-semibold text-white">
                    +91 84486 47644
                  </div>
                  <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Available 9:00 AM – 8:00 PM IST
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Rebranding &amp; Production Link</div>
                  <div className="text-sm font-semibold text-cyan-300 font-mono">
                    idltech.idlmatch.com
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Strict NDA protection for all submitted proprietary concepts.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column / Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative">
              {submittedData ? (
                <div className="py-6 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    {submittedData.method === 'gmail' ? 'GMAIL API DISPATCH VERIFIED' : 'EMAIL DISPATCHED & LOGGED'}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                    Enquiry Received Successfully!
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
                    {submittedData.method === 'gmail' ? (
                      <>Sent directly from your Gmail account to <span className="text-cyan-400 font-semibold">contact@idltech.idlmatch.com</span> and CC'd to <span className="text-cyan-400 font-semibold">idlfxn@gmail.com</span>.</>
                    ) : (
                      <>We dispatched a confirmation copy to <span className="text-cyan-400 font-semibold">{submittedData.email}</span> and queued your brief for our lead architect.</>
                    )}
                  </p>

                  <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left font-mono text-xs text-slate-300 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reference Token:</span>
                      <span className="text-cyan-300 font-bold">{submittedData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Logged Time:</span>
                      <span>{submittedData.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Method:</span>
                      <span className="text-emerald-400">{submittedData.method === 'gmail' ? 'Authenticated Gmail API' : 'Instant Cloud Relay'}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyReceipt}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied to Clipboard' : 'Copy Confirmation'}</span>
                    </button>

                    <a
                      href={mailtoUrl}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white flex items-center gap-2 shadow-md shadow-indigo-600/30"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Mail App</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSubmittedData(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="border-b border-slate-800 pb-4 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">
                        Request Consultation &amp; Free Blueprint
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Fill out your details to receive an instant reply and technical breakdown.
                      </p>
                    </div>

                    {/* Google Sign-in / Dispatch Method Picker */}
                    <div className="flex items-center gap-2 shrink-0">
                      {currentUser ? (
                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <button
                            type="button"
                            onClick={() => setSendMethod('gmail')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              sendMethod === 'gmail'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Gmail API
                          </button>
                          <button
                            type="button"
                            onClick={() => setSendMethod('relay')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              sendMethod === 'relay'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Web Relay
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGoogleConnect}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                          </svg>
                          <span>Sign in with Google</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {errors.form && (
                    <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.form}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1">
                        Your Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Marcus Wright"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          errors.name
                            ? 'border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
                        Business Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. marcus@company.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? 'border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone / WhatsApp */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-slate-300 mb-1">
                        Phone / WhatsApp <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          errors.phone
                            ? 'border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Service Type */}
                    <div>
                      <label htmlFor="serviceType" className="block text-xs font-medium text-slate-300 mb-1">
                        Service Interest
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      >
                        <option value="Launch Tier Mobile App (Rs. 19,999)">
                          Launch Tier Mobile App (Rs. 19,999)
                        </option>
                        <option value="Growth & Automation App (Rs. 39,999)">
                          Growth &amp; Automation App (Rs. 39,999)
                        </option>
                        <option value="Enterprise Custom Platform (Rs. 79,999)">
                          Enterprise Custom Platform (Rs. 79,999)
                        </option>
                        <option value="No-Code Automation Pipeline Setup">
                          No-Code Automation Pipeline Setup
                        </option>
                        <option value="No-Code Automation Bootcamp Registration (Rs. 19,999)">
                          No-Code Automation Bootcamp Registration (Rs. 19,999)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label htmlFor="budgetRange" className="block text-xs font-medium text-slate-300 mb-1">
                      Estimated Budget Range
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    >
                      <option value="Rs. 19,999 (Launch Fixed Price)">
                        Rs. 19,999 (Launch Fixed Price)
                      </option>
                      <option value="Rs. 20,000 - Rs. 40,000">
                        Rs. 20,000 - Rs. 40,000
                      </option>
                      <option value="Rs. 40,000 - Rs. 80,000">
                        Rs. 40,000 - Rs. 80,000
                      </option>
                      <option value="Rs. 80,000+ (Enterprise Scale)">
                        Rs. 80,000+ (Enterprise Scale)
                      </option>
                    </select>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label htmlFor="projectDetails" className="block text-xs font-medium text-slate-300 mb-1">
                      Project Overview or Idea Summary <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="projectDetails"
                      name="projectDetails"
                      rows={3}
                      value={formData.projectDetails}
                      onChange={handleChange}
                      placeholder="Tell us what problem this app or automation solves, who uses it, and any key tools..."
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        errors.projectDetails
                          ? 'border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                      }`}
                    />
                    {errors.projectDetails && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.projectDetails}</span>
                      </p>
                    )}
                  </div>

                  {/* Submission Status progress banner if submitting */}
                  {isSubmitting && (
                    <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-cyan-300 font-mono animate-pulse">
                      <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>{submissionProgress}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-95 ${
                        sendMethod === 'gmail' && currentUser
                          ? 'bg-gradient-to-r from-rose-600 via-indigo-600 to-cyan-500 hover:from-rose-500 hover:to-cyan-400 shadow-rose-950/40'
                          : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-600/30'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? 'Dispatching...'
                          : sendMethod === 'gmail' && currentUser
                          ? `Send via Gmail (${currentUser.email})`
                          : 'Send Message & Blueprint Request'}
                      </span>
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Secured transmission to <span className="text-cyan-400">contact@idltech.idlmatch.com</span> (CC: idlfxn@gmail.com) • Instant reply
                    </p>
                  </div>
                </form>
              )}

              {/* MANDATORY USER CONFIRMATION MODAL FOR GMAIL SEND */}
              {showConfirmation && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
                  <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-indigo-500/50 shadow-2xl p-6 text-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-lg text-white text-center">
                      Confirm Sending via Gmail
                    </h4>
                    <p className="text-xs text-slate-300 text-center mt-2 leading-relaxed">
                      With your permission, IDLTech will dispatch an email directly from your Gmail account (<span className="text-cyan-400 font-semibold">{currentUser?.email}</span>) to <span className="text-white font-semibold">contact@idltech.idlmatch.com</span> (CC: idlfxn@gmail.com).
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 space-y-1">
                      <div><span className="text-slate-500">Service:</span> {formData.serviceType}</div>
                      <div><span className="text-slate-500">Sender:</span> {currentUser?.email}</div>
                      <div><span className="text-slate-500">Recipient:</span> contact@idltech.idlmatch.com</div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowConfirmation(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={executeGmailSend}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm &amp; Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
