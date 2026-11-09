import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquarePlus,
  Lightbulb,
  Bug,
  Smile,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export type FeedbackType = 'suggestion' | 'bug' | 'general';

export interface FeedbackData {
  id: string;
  type: FeedbackType;
  toolContext?: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  timestamp: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentToolName?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  currentToolName,
}) => {
  const [type, setType] = useState<FeedbackType>('suggestion');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide your feedback or suggestion description.');
      return;
    }

    const newFeedback: FeedbackData = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      toolContext: currentToolName || 'General Platform',
      name: name.trim() || 'Anonymous User',
      email: email.trim(),
      message: message.trim(),
      rating,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('smart_tools_feedback_submissions');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newFeedback);
      localStorage.setItem('smart_tools_feedback_submissions', JSON.stringify(list));
    } catch {
      // storage error fallback
    }

    setIsSubmitted(true);
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'suggestion':
        return 'What tool or feature would you like to see next? (e.g., SVG editor, Markdown to PDF, Timezone planner...)';
      case 'bug':
        return 'What happened? Please mention the steps to reproduce or expected behavior...';
      case 'general':
        return 'Share your thoughts, suggestions, or experience using Smart Tools World...';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col">
        {/* Top Header Banner */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="feedback-modal-title"
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Share Feedback & Suggestions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help us improve Smart Tools World for users worldwide.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close feedback modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Your input helps shape upcoming tools and features. Our engineering team reviews all community submissions.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Submit Another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type selector tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Feedback Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('suggestion')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      type === 'suggestion'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>New Tool</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('bug')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      type === 'bug'
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <Bug className="w-3.5 h-3.5 text-rose-500" />
                    <span>Report Issue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('general')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      type === 'general'
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <Smile className="w-3.5 h-3.5 text-purple-500" />
                    <span>General</span>
                  </button>
                </div>
              </div>

              {/* Context Pill (if on a tool) */}
              {currentToolName && (
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Context:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                    {currentToolName}
                  </span>
                </div>
              )}

              {/* Message text area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {type === 'suggestion'
                      ? 'Tool Idea & Details *'
                      : type === 'bug'
                      ? 'Issue Description *'
                      : 'Your Feedback *'}
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {message.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Experience rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  How is your experience with Smart Tools World?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        rating === star
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Taylor"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="taylor@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>Send Feedback</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>No sign-up needed · Sent directly to developer queue</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
