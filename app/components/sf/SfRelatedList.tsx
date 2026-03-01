'use client';

import React, { useState } from 'react';
import SfIcon from './SfIcon';

interface RelatedListColumn {
  key: string;
  label: string;
}

interface SfRelatedListProps {
  title: string;
  columns: RelatedListColumn[];
  data: Record<string, string | number>[];
  count?: number;
  className?: string;
  onViewAll?: () => void;
}

export default function SfRelatedList({ title, columns, data, count, className = '', onViewAll }: SfRelatedListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`border border-[var(--sf-border)] rounded-lg bg-white ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <SfIcon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={14} className="text-[var(--sf-text-muted)]" />
          <span className="text-sm font-bold text-[var(--sf-text-primary)]">{title}</span>
          {count !== undefined && (
            <span className="text-xs text-[var(--sf-text-muted)]">({count})</span>
          )}
        </div>
        {onViewAll && (
          <span
            onClick={(e) => { e.stopPropagation(); onViewAll(); }}
            className="text-xs text-[var(--sf-text-link)] hover:underline"
          >
            View All
          </span>
        )}
      </button>
      {isExpanded && (
        <div className="border-t border-[var(--sf-border)]">
          {data.length === 0 ? (
            <p className="px-4 py-6 text-xs text-[var(--sf-text-muted)] text-center">No records to display.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--sf-border)]">
                  {columns.map(col => (
                    <th key={col.key} className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)] uppercase">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-[var(--sf-border)] last:border-b-0 hover:bg-gray-50">
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)]">
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
