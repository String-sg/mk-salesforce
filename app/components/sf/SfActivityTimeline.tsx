'use client';

import React from 'react';
import SfIcon from './SfIcon';

interface TimelineItem {
  id: string;
  type: 'task' | 'event' | 'note' | 'status_change';
  title: string;
  description?: string;
  date: string;
  user?: string;
}

interface SfActivityTimelineProps {
  items: TimelineItem[];
  className?: string;
}

const typeConfig: Record<string, { color: string; icon: 'task' | 'calendar' | 'note' | 'check' }> = {
  task: { color: 'bg-[var(--sf-blue)]', icon: 'task' },
  event: { color: 'bg-[var(--sf-success)]', icon: 'calendar' },
  note: { color: 'bg-[var(--sf-warning)]', icon: 'note' },
  status_change: { color: 'bg-[var(--sf-info)]', icon: 'check' },
};

export default function SfActivityTimeline({ items, className = '' }: SfActivityTimelineProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-bold text-[var(--sf-text-primary)] uppercase tracking-wide mb-3">Activity</h3>
      <div className="space-y-0">
        {items.length === 0 ? (
          <p className="text-xs text-[var(--sf-text-muted)] py-4">No activities to show.</p>
        ) : (
          items.map((item, idx) => {
            const config = typeConfig[item.type];
            return (
              <div key={item.id} className="flex gap-3 pb-4 relative">
                {idx < items.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[var(--sf-border)]" />
                )}
                <div className={`w-6 h-6 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
                  <SfIcon name={config.icon} size={12} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--sf-text-primary)]">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-[var(--sf-text-muted)] mt-0.5">{item.description}</p>
                  )}
                  <p className="text-xs text-[var(--sf-text-muted)] mt-0.5">
                    {item.user && `${item.user} \u00b7 `}{item.date}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
