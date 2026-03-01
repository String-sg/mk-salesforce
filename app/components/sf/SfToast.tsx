'use client';

import React, { useEffect } from 'react';
import SfIcon from './SfIcon';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface SfToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const typeStyles: Record<string, { bg: string; icon: 'success' | 'error' | 'warning' | 'info' }> = {
  success: { bg: 'bg-[var(--sf-success)]', icon: 'success' },
  error: { bg: 'bg-[var(--sf-error)]', icon: 'error' },
  warning: { bg: 'bg-[var(--sf-warning)]', icon: 'warning' },
  info: { bg: 'bg-[var(--sf-blue)]', icon: 'info' },
};

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const style = typeStyles[toast.type];

  return (
    <div className={`${style.bg} text-white rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 min-w-[320px] max-w-md`}>
      <SfIcon name={style.icon} size={20} color="white" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.message && <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={() => onDismiss(toast.id)} className="text-white/80 hover:text-white cursor-pointer">
        <SfIcon name="close" size={16} color="currentColor" />
      </button>
    </div>
  );
}

export default function SfToast({ toasts, onDismiss }: SfToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
