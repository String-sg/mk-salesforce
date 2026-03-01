'use client';

import React, { useState } from 'react';
import SfIcon from './SfIcon';
import SfSearch from './SfSearch';

interface ListViewOption {
  id: string;
  label: string;
}

interface SfListViewProps {
  title: string;
  views: ListViewOption[];
  selectedView: string;
  onViewChange: (viewId: string) => void;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
  itemCount?: number;
  children: React.ReactNode;
  className?: string;
}

export default function SfListView({
  title,
  views,
  selectedView,
  onViewChange,
  onSearch,
  actions,
  itemCount,
  children,
  className = '',
}: SfListViewProps) {
  const [showViewPicker, setShowViewPicker] = useState(false);
  const currentView = views.find(v => v.id === selectedView);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowViewPicker(!showViewPicker)}
              className="flex items-center gap-1 text-base font-semibold text-[var(--sf-text-primary)] hover:text-[var(--sf-blue)] cursor-pointer"
            >
              <SfIcon name="pin" size={16} className="text-[var(--sf-blue)]" />
              {currentView?.label || title}
              <SfIcon name="chevron-down" size={14} />
            </button>
            {showViewPicker && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-dropdown)] z-50">
                <div className="p-2 border-b border-[var(--sf-border)]">
                  <SfSearch placeholder="Search list views..." compact />
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  {views.map(view => (
                    <button
                      key={view.id}
                      onClick={() => { onViewChange(view.id); setShowViewPicker(false); }}
                      className={`w-full text-left px-3 py-2 text-[13px] cursor-pointer hover:bg-[var(--sf-info-light)] ${
                        selectedView === view.id ? 'bg-[var(--sf-info-light)] text-[var(--sf-blue)] font-medium' : 'text-[var(--sf-text-primary)]'
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {itemCount !== undefined && (
            <span className="text-xs text-[var(--sf-text-muted)]">{itemCount} items</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onSearch && (
            <SfSearch placeholder="Search this list..." onSearch={onSearch} className="w-56" />
          )}
        </div>
      </div>
      <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
