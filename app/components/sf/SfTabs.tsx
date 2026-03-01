'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  count?: number;
}

interface SfTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export default function SfTabs({ tabs, defaultTab, className = '' }: SfTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <div className={className}>
      <div className="flex border-b border-[var(--sf-border)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-[var(--sf-blue)] text-[var(--sf-blue)]'
                : 'border-transparent text-[var(--sf-text-muted)] hover:text-[var(--sf-text-primary)] hover:border-gray-300'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs text-[var(--sf-text-muted)]">({tab.count})</span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">{activeContent}</div>
    </div>
  );
}
