'use client';

import React from 'react';
import type { WorkflowStatus, RatingValue } from '@/app/data/types';

interface SfBadgeProps {
  status?: WorkflowStatus;
  rating?: RatingValue;
  label?: string;
  className?: string;
}

const statusStyles: Record<WorkflowStatus, string> = {
  Draft: 'bg-[var(--sf-badge-draft)] text-[var(--sf-badge-draft-text)]',
  Submitted: 'bg-[var(--sf-badge-submitted)] text-white',
  'Under Review': 'bg-[var(--sf-badge-review)] text-white',
  Approved: 'bg-[var(--sf-badge-approved)] text-white',
  Returned: 'bg-[var(--sf-badge-returned)] text-white',
};

const ratingStyles: Record<string, string> = {
  'Getting Started': 'bg-[var(--sf-info-light)] text-[var(--sf-info)]',
  Progressing: 'bg-[var(--sf-warning-light)] text-[var(--sf-warning)]',
  Achieving: 'bg-[var(--sf-success-light)] text-[var(--sf-success)]',
};

export default function SfBadge({ status, rating, label, className = '' }: SfBadgeProps) {
  let styles = 'bg-gray-100 text-gray-600';
  let text = label || '';

  if (status) {
    styles = statusStyles[status];
    text = status;
  } else if (rating) {
    styles = ratingStyles[rating] || styles;
    text = rating;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${styles} ${className}`}>
      {text}
    </span>
  );
}
