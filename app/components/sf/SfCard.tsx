'use client';

import React from 'react';

interface SfCardProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  icon?: React.ReactNode;
}

export default function SfCard({ children, title, actions, className = '', noPadding = false, icon }: SfCardProps) {
  return (
    <div className={`bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)] ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--sf-border)]">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-bold text-[var(--sf-text-primary)] uppercase tracking-wide">{title}</h3>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'}>{children}</div>
    </div>
  );
}
