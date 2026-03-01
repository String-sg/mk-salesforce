'use client';

import React from 'react';
import SfIcon from './SfIcon';

interface SfFormFieldProps {
  label: string;
  children: React.ReactNode;
  helpText?: string;
  required?: boolean;
  className?: string;
  horizontal?: boolean;
}

export default function SfFormField({ label, children, helpText, required = false, className = '', horizontal = false }: SfFormFieldProps) {
  return (
    <div className={`${horizontal ? 'flex items-start gap-4' : ''} ${className}`}>
      <div className={`flex items-center gap-1 mb-1 ${horizontal ? 'w-1/3 pt-1.5 justify-end' : ''}`}>
        <label className="text-xs font-bold text-[var(--sf-text-secondary)]">
          {label}
          {required && <span className="text-[var(--sf-error)] ml-0.5">*</span>}
        </label>
        {helpText && (
          <div className="sf-tooltip inline-flex">
            <SfIcon name="info" size={14} className="text-[var(--sf-text-muted)] cursor-help" />
            <div className="sf-tooltip-content">{helpText}</div>
          </div>
        )}
      </div>
      <div className={horizontal ? 'flex-1' : ''}>{children}</div>
    </div>
  );
}
