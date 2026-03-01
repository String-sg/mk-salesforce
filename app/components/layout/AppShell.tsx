'use client';

import React from 'react';
import SfHeader from './SfHeader';
import SfNavBar from './SfNavBar';
import { useAssessmentContext } from '../../context/AssessmentContext';
import SfToast from '../sf/SfToast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useAssessmentContext();

  return (
    <div className="h-screen flex flex-col bg-[var(--sf-page-bg)]">
      <SfHeader />
      <SfNavBar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          {children}
        </div>
      </main>

      {/* Toast container */}
      <SfToast
        toasts={toasts.map(t => ({ id: t.id, type: t.type, title: t.message }))}
        onDismiss={removeToast}
      />
    </div>
  );
}
