'use client';

import React from 'react';
import SfPageHeader from '../components/sf/SfPageHeader';
import SfCard from '../components/sf/SfCard';
import SfIcon from '../components/sf/SfIcon';
import { useRole } from '../hooks/useRole';
import { useAssessment } from '../hooks/useAssessment';
import { mkCentres, getClassesByCentre } from '../data/centres';
import { getStudentsByCentre } from '../data/students';

export default function AdminPage() {
  const { isPEB } = useRole();
  const { getAssessmentsByCentre } = useAssessment();

  if (!isPEB) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SfIcon name="error" size={48} className="text-[var(--sf-text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--sf-text-muted)]">Access restricted to PEB (HQ) users.</p>
          <p className="text-xs text-[var(--sf-text-muted)] mt-1">Switch to PEB role to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SfPageHeader
        title="Admin"
        subtitle="PEB Administration"
        icon={<SfIcon name="settings" size={18} color="white" />}
        breadcrumbs={[{ label: 'Home', href: '/home' }, { label: 'Admin' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {mkCentres.map(centre => {
          const classes = getClassesByCentre(centre.id);
          const students = getStudentsByCentre(centre.id);
          const assessments = getAssessmentsByCentre(centre.id);
          const approved = assessments.filter(a => a.status === 'Approved').length;

          return (
            <SfCard key={centre.id} className="!p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[var(--sf-text-primary)]">{centre.name}</h3>
                  <p className="text-xs text-[var(--sf-text-muted)]">Code: {centre.code}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[var(--sf-blue)] flex items-center justify-center">
                  <SfIcon name="home" size={16} color="white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-[var(--sf-text-primary)]">{classes.length}</p>
                  <p className="text-[10px] text-[var(--sf-text-muted)]">Classes</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-[var(--sf-text-primary)]">{students.length}</p>
                  <p className="text-[10px] text-[var(--sf-text-muted)]">Children</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-[var(--sf-success)]">{assessments.length > 0 ? Math.round((approved / assessments.length) * 100) : 0}%</p>
                  <p className="text-[10px] text-[var(--sf-text-muted)]">Approved</p>
                </div>
              </div>
            </SfCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SfCard title="User Management" icon={<SfIcon name="people" size={16} className="text-[var(--sf-blue)]" />}>
          <p className="text-xs text-[var(--sf-text-muted)] text-center py-6">
            User management module - coming soon.
            <br />
            This will allow PEB to manage teacher accounts and role assignments.
          </p>
        </SfCard>
        <SfCard title="Indicator Configuration" icon={<SfIcon name="settings" size={16} className="text-[var(--sf-blue)]" />}>
          <p className="text-xs text-[var(--sf-text-muted)] text-center py-6">
            Indicator configuration module - coming soon.
            <br />
            This will allow PEB to configure MKPI domains, sub-domains, and indicators.
          </p>
        </SfCard>
      </div>
    </div>
  );
}
