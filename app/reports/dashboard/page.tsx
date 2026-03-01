'use client';

import React from 'react';
import SfPageHeader from '../../components/sf/SfPageHeader';
import SfCard from '../../components/sf/SfCard';
import SfIcon from '../../components/sf/SfIcon';
import SfTabs from '../../components/sf/SfTabs';
import { useRole } from '../../hooks/useRole';
import { useAssessment } from '../../hooks/useAssessment';
import { mkpiDomains } from '../../data/indicators';
import { mkCentres, getClassesByCentre } from '../../data/centres';

function BarChart({ data, maxVal }: { data: { label: string; value: number; color: string }[]; maxVal: number }) {
  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--sf-text-muted)] w-24 text-right truncate">{item.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-4">
            <div
              className={`${item.color} h-4 rounded-full text-[10px] text-white flex items-center justify-end pr-1.5 font-medium`}
              style={{ width: `${maxVal > 0 ? (item.value / maxVal) * 100 : 0}%`, minWidth: item.value > 0 ? '24px' : '0' }}
            >
              {item.value > 0 ? `${item.value}%` : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ values, labels, colors }: { values: number[]; labels: string[]; colors: string[] }) {
  const total = values.reduce((s, v) => s + v, 0);
  let cumulative = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {values.map((val, idx) => {
            const pct = total > 0 ? (val / total) * 100 : 0;
            const offset = cumulative;
            cumulative += pct;
            return (
              <circle
                key={idx}
                r="15.915"
                cx="18"
                cy="18"
                fill="transparent"
                stroke={colors[idx]}
                strokeWidth="4"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={`${-offset}`}
                className="transition-all"
              />
            );
          })}
          <text x="18" y="19" textAnchor="middle" className="fill-[var(--sf-text-primary)] text-[5px] font-bold">
            {total}
          </text>
          <text x="18" y="23" textAnchor="middle" className="fill-[var(--sf-text-muted)] text-[2.5px]">
            Total
          </text>
        </svg>
      </div>
      <div className="space-y-1.5">
        {labels.map((label, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }}></span>
            <span className="text-xs text-[var(--sf-text-primary)]">{label}: <strong>{values[idx]}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { currentUser, isTeacher, isReviewer, isPEB, canViewAllCentres } = useRole();
  const { getVisibleAssessments, getCompletionStats, getAssessmentsByClass, getAssessmentsByCentre } = useAssessment();

  const allVisible = getVisibleAssessments();
  const stats = getCompletionStats();

  // Domain-level distribution
  const domainStats = mkpiDomains.map(domain => {
    let achieving = 0, progressing = 0, gettingStarted = 0, total = 0;
    allVisible.filter(a => a.status === 'Approved').forEach(a => {
      domain.subDomains.forEach(sd => {
        sd.indicators.forEach(ind => {
          const val = a.indicatorValues[ind.id];
          if (val) total++;
          if (val === 'Achieving') achieving++;
          else if (val === 'Progressing') progressing++;
          else if (val === 'Getting Started') gettingStarted++;
        });
      });
    });
    return {
      domain: domain.name,
      short: domain.number,
      achieving: total > 0 ? Math.round((achieving / total) * 100) : 0,
      progressing: total > 0 ? Math.round((progressing / total) * 100) : 0,
      gettingStarted: total > 0 ? Math.round((gettingStarted / total) * 100) : 0,
    };
  });

  const teacherDashboard = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SfCard title="Completion Status">
          <DonutChart
            values={[stats.approved, stats.submitted, stats.underReview, stats.draft, stats.returned]}
            labels={['Approved', 'Submitted', 'Under Review', 'Draft', 'Returned']}
            colors={['#2e844a', '#0176d3', '#fe9339', '#b0adab', '#ea001e']}
          />
        </SfCard>
        <SfCard title="Quick Stats">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[var(--sf-success)]">{stats.approved}</p>
              <p className="text-xs text-[var(--sf-text-muted)]">Approved</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[var(--sf-warning)]">{stats.submitted + stats.underReview}</p>
              <p className="text-xs text-[var(--sf-text-muted)]">Pending</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[var(--sf-text-primary)]">{stats.draft}</p>
              <p className="text-xs text-[var(--sf-text-muted)]">Drafts</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[var(--sf-error)]">{stats.returned}</p>
              <p className="text-xs text-[var(--sf-text-muted)]">Returned</p>
            </div>
          </div>
        </SfCard>
      </div>

      <SfCard title="Domain Performance Distribution">
        <div className="space-y-4">
          {domainStats.map(ds => (
            <div key={ds.short}>
              <p className="text-xs font-medium text-[var(--sf-text-primary)] mb-1">{ds.short}. {ds.domain}</p>
              <div className="w-full bg-gray-200 rounded-full h-5 flex overflow-hidden">
                <div className="bg-[var(--sf-success)] h-5 flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${ds.achieving}%` }}>
                  {ds.achieving > 10 ? `${ds.achieving}%` : ''}
                </div>
                <div className="bg-[var(--sf-warning)] h-5 flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${ds.progressing}%` }}>
                  {ds.progressing > 10 ? `${ds.progressing}%` : ''}
                </div>
                <div className="bg-[var(--sf-blue)] h-5 flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${ds.gettingStarted}%` }}>
                  {ds.gettingStarted > 10 ? `${ds.gettingStarted}%` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SfCard>
    </div>
  );

  const centreHeadDashboard = (
    <div className="space-y-6">
      <SfCard title="Cross-Class Comparison">
        <div className="space-y-4">
          {getClassesByCentre(currentUser.centreId).map(cls => {
            const clsStats = getCompletionStats(cls.id);
            return (
              <div key={cls.id} className="flex items-center gap-3">
                <span className="text-xs text-[var(--sf-text-primary)] w-36 truncate font-medium">{cls.level} {cls.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[var(--sf-success)] h-4 rounded-full text-[10px] text-white flex items-center justify-end pr-1 font-medium"
                    style={{ width: `${clsStats.total > 0 ? (clsStats.approved / clsStats.total) * 100 : 0}%`, minWidth: clsStats.approved > 0 ? '20px' : '0' }}
                  >
                    {clsStats.total > 0 ? `${Math.round((clsStats.approved / clsStats.total) * 100)}%` : ''}
                  </div>
                </div>
                <span className="text-xs text-[var(--sf-text-muted)] w-20 text-right">{clsStats.approved}/{clsStats.total}</span>
              </div>
            );
          })}
        </div>
      </SfCard>
      {teacherDashboard}
    </div>
  );

  const pebDashboard = (
    <div className="space-y-6">
      <SfCard title="Cross-MK Centre Overview">
        <div className="space-y-4">
          {mkCentres.map(centre => {
            const centreAssessments = getAssessmentsByCentre(centre.id);
            const approved = centreAssessments.filter(a => a.status === 'Approved').length;
            const total = centreAssessments.length;
            return (
              <div key={centre.id} className="flex items-center gap-3">
                <span className="text-xs text-[var(--sf-text-primary)] w-48 truncate font-medium">{centre.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[var(--sf-blue)] h-4 rounded-full text-[10px] text-white flex items-center justify-end pr-1 font-medium"
                    style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%`, minWidth: approved > 0 ? '20px' : '0' }}
                  >
                    {total > 0 ? `${Math.round((approved / total) * 100)}%` : ''}
                  </div>
                </div>
                <span className="text-xs text-[var(--sf-text-muted)] w-20 text-right">{approved}/{total}</span>
              </div>
            );
          })}
        </div>
      </SfCard>
      {teacherDashboard}
    </div>
  );

  const tabs = [
    { id: 'teacher', label: 'Teacher View', content: teacherDashboard },
    { id: 'centre', label: 'Centre Head View', content: centreHeadDashboard },
    ...(isPEB ? [{ id: 'peb', label: 'PEB View', content: pebDashboard }] : []),
  ];

  return (
    <div>
      <SfPageHeader
        title="Dashboards"
        subtitle="Data Visualization & Analytics"
        icon={<SfIcon name="chart" size={18} color="white" />}
        breadcrumbs={[{ label: 'Home', href: '/home' }, { label: 'Reports', href: '/reports' }, { label: 'Dashboards' }]}
      />

      <SfTabs tabs={tabs} defaultTab={isPEB ? 'peb' : isReviewer ? 'centre' : 'teacher'} />
    </div>
  );
}
