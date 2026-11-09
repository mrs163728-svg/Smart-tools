import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface FloatingFeedbackButtonProps {
  onClick: () => void;
}

export const FloatingFeedbackButton: React.FC<FloatingFeedbackButtonProps> = ({ onClick }) => {
  return (
    <aside aria-label="Quick feedback action" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
      <button
        onClick={onClick}
        aria-label="Give Feedback or Suggest a Tool"
        className="group flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
      >
        <span className="relative flex items-center justify-center">
          <MessageSquarePlus className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:rotate-6" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
          </span>
        </span>
        <span className="text-xs sm:text-sm font-bold tracking-tight">
          Feedback
        </span>
      </button>
    </aside>
  );
};
