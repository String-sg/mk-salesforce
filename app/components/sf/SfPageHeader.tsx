'use client';

import React from 'react';
import SfIcon from './SfIcon';

interface SfPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export default function SfPageHeader({ title, subtitle, icon, breadcrumbs, actions, meta, className = '' }: SfPageHeaderProps) {
  return (
    <div className={`bg-white border-b border-[var(--sf-border)] -mx-6 -mt-4 px-6 py-3 mb-4 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1 mb-1">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <SfIcon name="chevron-right" size={12} className="text-[var(--sf-text-muted)]" />}
              {crumb.href ? (
                <a href={crumb.href} className="text-xs text-[var(--sf-text-link)] hover:underline">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-xs text-[var(--sf-text-muted)]">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="w-8 h-8 bg-[var(--sf-blue)] rounded flex items-center justify-center text-white">{icon}</div>}
          <div>
            <h1 className="text-lg font-semibold text-[var(--sf-text-primary)]">{title}</h1>
            {subtitle && <p className="text-xs text-[var(--sf-text-muted)] mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {meta && <div className="mt-2">{meta}</div>}
    </div>
  );
}
