'use client';

import React, { useState } from 'react';
import SfIcon from './SfIcon';

interface SfAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  subtitle?: string;
}

export default function SfAccordion({ title, children, defaultOpen = true, className = '', subtitle }: SfAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-[var(--sf-border)] rounded-lg bg-white ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <SfIcon
          name={isOpen ? 'chevron-down' : 'chevron-right'}
          size={16}
          className="text-[var(--sf-text-muted)] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold text-[var(--sf-text-primary)]">{title}</span>
          {subtitle && (
            <span className="ml-2 text-xs text-[var(--sf-text-muted)]">{subtitle}</span>
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[var(--sf-border)]">
          {children}
        </div>
      )}
    </div>
  );
}
