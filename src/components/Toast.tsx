import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/95 border border-amber-500/30 text-white text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-md">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
