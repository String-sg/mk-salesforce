'use client';

import React, { useState, useMemo } from 'react';
import SfIcon from '../components/sf/SfIcon';
import SfBadge from '../components/sf/SfBadge';
import { useRole } from '../hooks/useRole';
import { useAssessment } from '../hooks/useAssessment';
import { mkpiDomains } from '../data/indicators';
import { getClassById, mkCentres, getClassesByCentre } from '../data/centres';
import Link from 'next/link';
import type { RatingValue } from '../data/types';

function getRatingAbbrev(rating: RatingValue): string {
  if (rating === 'Achieving') return 'A';
  if (rating === 'Progressing') return 'P';
  if (rating === 'Getting Started') return 'GS';
  return '-';
}

function getRatingCellClass(rating: RatingValue): string {
  if (rating === 'Achieving') return 'text-[var(--sf-text-primary)]';
  if (rating === 'Progressing') return 'text-[var(--sf-text-primary)]';
  if (rating === 'Getting Started') return 'text-[var(--sf-text-primary)]';
  return 'text-[var(--sf-text-muted)]';
}

export default function ReportsPage() {
  const { currentUser, canViewAllClasses, canViewAllCentres } = useRole();
  const { getAssessmentsByClass } = useAssessment();
  const [selectedClass, setSelectedClass] = useState('cl1');
  const [sidebarTab, setSidebarTab] = useState<'outline' | 'filters'>('outline');
  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [groupBy, setGroupBy] = useState<'account' | 'class' | 'domain'>('account');

  const availableClasses = useMemo(() => {
    if (canViewAllCentres) {
      return mkCentres.flatMap(c => getClassesByCentre(c.id));
    }
    if (canViewAllClasses) {
      return getClassesByCentre(currentUser.centreId);
    }
    return currentUser.classIds.map(id => getClassById(id)).filter(Boolean);
  }, [currentUser, canViewAllClasses, canViewAllCentres]);

  const classAssessments = getAssessmentsByClass(selectedClass)
    .filter(a => a.status === 'Approved' || a.status === 'Submitted' || a.status === 'Under Review');

  // All indicator IDs for columns
  const allIndicators = mkpiDomains.flatMap(d =>
    d.subDomains.flatMap(sd => sd.indicators)
  );

  // Compute domain aggregation for chart
  const domainAggs = useMemo(() => {
    return mkpiDomains.map(domain => {
      let achieving = 0, progressing = 0, gettingStarted = 0, notRated = 0;
      classAssessments.forEach(a => {
        domain.subDomains.forEach(sd => {
          sd.indicators.forEach(ind => {
            const val = a.indicatorValues[ind.id];
            if (val === 'Achieving') achieving++;
            else if (val === 'Progressing') progressing++;
            else if (val === 'Getting Started') gettingStarted++;
            else notRated++;
          });
        });
      });
      return { domain: domain.name, domainNum: domain.number, achieving, progressing, gettingStarted, notRated, total: achieving + progressing + gettingStarted + notRated };
    });
  }, [classAssessments]);

  // Max for chart scaling
  const chartMax = Math.max(...domainAggs.map(d => d.total), 1);

  const classInfo = getClassById(selectedClass);

  return (
    <div>
      {/* Salesforce Report Builder header */}
      <div className="bg-white border-b border-[var(--sf-border)] -mx-6 -mt-4 px-6 pt-3 pb-0 mb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-1">
          <p className="text-xs text-[var(--sf-text-muted)]">
            <Link href="/reports" className="hover:underline text-[var(--sf-text-link)]">Reports</Link>
          </p>
          <SfIcon name="chevron-down" size={10} className="text-[var(--sf-text-muted)]" />
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold text-[var(--sf-text-primary)]">
              New MK Assessments Report
            </h1>
            <p className="text-xs text-[var(--sf-text-muted)] mt-0.5">MK Assessments</p>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-[13px] font-medium text-white bg-[var(--sf-blue)] rounded hover:bg-[var(--sf-blue-dark)] cursor-pointer">
              Run
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Save
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Save As
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer flex items-center gap-1">
              <SfIcon name="download" size={14} />
              Export
            </button>
            <Link href="/reports/dashboard" className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer flex items-center gap-1">
              <SfIcon name="chart" size={14} />
              Dashboards
            </Link>
            <button className="p-1.5 text-[var(--sf-text-muted)] hover:bg-gray-50 rounded cursor-pointer">
              <SfIcon name="chevron-down" size={14} />
            </button>
          </div>
        </div>

        {/* Tab: MK Assessments */}
        <div className="flex gap-6">
          <button className="pb-2.5 text-[13px] font-medium cursor-pointer border-b-[3px] border-[var(--sf-blue)] text-[var(--sf-blue)]">
            MK Assessments
          </button>
        </div>
      </div>

      {/* Main content: sidebar + data table */}
      <div className="grid grid-cols-[240px_1fr] gap-0">
        {/* Left sidebar - Outline/Filters */}
        <div className="bg-white border border-[var(--sf-border)] rounded-l-lg shadow-[var(--sf-shadow-card)] border-r-0">
          {/* Sidebar tabs */}
          <div className="flex border-b border-[var(--sf-border)]">
            <button
              onClick={() => setSidebarTab('outline')}
              className={`flex-1 px-3 py-2.5 text-[12px] font-medium cursor-pointer ${
                sidebarTab === 'outline'
                  ? 'text-[var(--sf-blue)] border-b-2 border-[var(--sf-blue)]'
                  : 'text-[var(--sf-text-muted)]'
              }`}
            >
              Outline
            </button>
            <button
              onClick={() => setSidebarTab('filters')}
              className={`flex-1 px-3 py-2.5 text-[12px] font-medium cursor-pointer ${
                sidebarTab === 'filters'
                  ? 'text-[var(--sf-blue)] border-b-2 border-[var(--sf-blue)]'
                  : 'text-[var(--sf-text-muted)]'
              }`}
            >
              Filters
            </button>
          </div>

          {sidebarTab === 'outline' ? (
            <div className="p-3 space-y-4">
              {/* Groups */}
              <div>
                <p className="text-[11px] font-bold text-[var(--sf-text-muted)] uppercase mb-2">Groups</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--sf-text-primary)]">Group Rows by</span>
                  </div>
                  <select
                    value={groupBy}
                    onChange={e => setGroupBy(e.target.value as typeof groupBy)}
                    className="w-full px-2 py-1.5 text-[12px] border border-[var(--sf-border-dark)] rounded bg-white focus:outline-none focus:border-[var(--sf-blue)]"
                  >
                    <option value="account">Account (Child)</option>
                    <option value="class">Class Name</option>
                    <option value="domain">Domain</option>
                  </select>
                </div>
              </div>

              {/* Columns */}
              <div>
                <p className="text-[11px] font-bold text-[var(--sf-text-muted)] uppercase mb-2">Columns</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[12px] text-[var(--sf-text-primary)] py-1 px-2 bg-gray-50 rounded">
                    <SfIcon name="list" size={10} className="text-[var(--sf-text-muted)]" />
                    Assessment Name
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[var(--sf-text-primary)] py-1 px-2 bg-gray-50 rounded">
                    <SfIcon name="list" size={10} className="text-[var(--sf-text-muted)]" />
                    Completion Status
                  </div>
                  {mkpiDomains.slice(0, 4).map(d => (
                    <div key={d.id} className="flex items-center gap-1.5 text-[12px] text-[var(--sf-text-primary)] py-1 px-2 bg-gray-50 rounded">
                      <SfIcon name="list" size={10} className="text-[var(--sf-text-muted)]" />
                      {d.number}. {d.name.length > 18 ? d.name.substring(0, 18) + '...' : d.name}
                    </div>
                  ))}
                  <p className="text-[11px] text-[var(--sf-text-muted)] pl-2">+{mkpiDomains.length - 4} more columns</p>
                </div>
                <button className="mt-2 text-[12px] text-[var(--sf-text-link)] hover:underline cursor-pointer flex items-center gap-1">
                  <SfIcon name="add" size={10} />
                  Add Column
                </button>
              </div>

              {/* Class selector */}
              <div>
                <p className="text-[11px] font-bold text-[var(--sf-text-muted)] uppercase mb-2">Class</p>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full px-2 py-1.5 text-[12px] border border-[var(--sf-border-dark)] rounded bg-white focus:outline-none focus:border-[var(--sf-blue)]"
                >
                  {availableClasses.map(cls => cls && (
                    <option key={cls.id} value={cls.id}>{cls.level} {cls.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-[var(--sf-text-muted)] uppercase mb-2">Filters</p>
                <div className="space-y-2">
                  <div className="text-[12px] text-[var(--sf-text-primary)] p-2 bg-gray-50 rounded border border-[var(--sf-border)]">
                    <span className="font-medium">Status</span> equals
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <SfBadge status="Approved" />
                      <SfBadge status="Submitted" />
                      <SfBadge status="Under Review" />
                    </div>
                  </div>
                  <div className="text-[12px] text-[var(--sf-text-primary)] p-2 bg-gray-50 rounded border border-[var(--sf-border)]">
                    <span className="font-medium">Class Name</span> equals
                    <p className="text-[var(--sf-text-link)] mt-0.5">{classInfo ? `${classInfo.level} ${classInfo.name}` : selectedClass}</p>
                  </div>
                  <div className="text-[12px] text-[var(--sf-text-primary)] p-2 bg-gray-50 rounded border border-[var(--sf-border)]">
                    <span className="font-medium">Period</span> equals
                    <p className="text-[var(--sf-text-muted)] mt-0.5">Mid-Year</p>
                  </div>
                </div>
                <button className="mt-2 text-[12px] text-[var(--sf-text-link)] hover:underline cursor-pointer flex items-center gap-1">
                  <SfIcon name="add" size={10} />
                  Add Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: data table + chart */}
        <div className="bg-white border border-[var(--sf-border)] rounded-r-lg shadow-[var(--sf-shadow-card)] overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-2.5 border-b border-[var(--sf-border)] flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--sf-text-muted)]">{classAssessments.length} records</span>
              <span className="text-[11px] text-[var(--sf-text-muted)]">
                Grouped by {groupBy === 'account' ? 'Account' : groupBy === 'class' ? 'Class Name' : 'Domain'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {/* Chart toggle */}
              <button
                onClick={() => setShowChart(!showChart)}
                className={`px-2.5 py-1 text-[12px] font-medium rounded cursor-pointer flex items-center gap-1 ${
                  showChart ? 'bg-[var(--sf-blue)] text-white' : 'text-[var(--sf-text-muted)] hover:bg-gray-100'
                }`}
              >
                <SfIcon name="chart" size={12} className={showChart ? 'text-white' : ''} />
                Chart
              </button>
              {showChart && (
                <div className="flex items-center border border-[var(--sf-border-dark)] rounded overflow-hidden ml-1">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-2 py-1 text-[11px] cursor-pointer ${chartType === 'bar' ? 'bg-[var(--sf-info-light)] text-[var(--sf-blue)]' : 'text-[var(--sf-text-muted)]'}`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-2 py-1 text-[11px] cursor-pointer border-l border-[var(--sf-border-dark)] ${chartType === 'line' ? 'bg-[var(--sf-info-light)] text-[var(--sf-blue)]' : 'text-[var(--sf-text-muted)]'}`}
                  >
                    Line
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chart overlay */}
          {showChart && (
            <div className="px-4 py-4 border-b border-[var(--sf-border)] bg-white">
              <p className="text-xs font-bold text-[var(--sf-text-primary)] mb-3">
                Sum of Completion Status by Domain
              </p>
              {chartType === 'bar' ? (
                <div className="space-y-2">
                  {domainAggs.map(d => (
                    <div key={d.domainNum} className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--sf-text-muted)] w-6 text-right">{d.domainNum}</span>
                      <div className="flex-1 flex h-5 rounded overflow-hidden bg-gray-100">
                        {d.total > 0 && (
                          <>
                            <div className="bg-[var(--sf-success)] h-full transition-all" style={{ width: `${(d.achieving / chartMax) * 100}%` }} />
                            <div className="bg-[var(--sf-warning)] h-full transition-all" style={{ width: `${(d.progressing / chartMax) * 100}%` }} />
                            <div className="bg-[var(--sf-blue)] h-full transition-all" style={{ width: `${(d.gettingStarted / chartMax) * 100}%` }} />
                            <div className="bg-gray-300 h-full transition-all" style={{ width: `${(d.notRated / chartMax) * 100}%` }} />
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--sf-text-muted)] w-8">{d.total}</span>
                    </div>
                  ))}
                  <div className="flex gap-3 text-[10px] text-[var(--sf-text-muted)] mt-2 pt-2 border-t border-[var(--sf-border)]">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[var(--sf-success)] rounded-sm" />Achieving</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[var(--sf-warning)] rounded-sm" />Progressing</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[var(--sf-blue)] rounded-sm" />Getting Started</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gray-300 rounded-sm" />Not Rated</span>
                  </div>
                </div>
              ) : (
                /* Line chart using SVG */
                <div className="relative">
                  <svg viewBox="0 0 600 180" className="w-full h-44">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(pct => (
                      <g key={pct}>
                        <line x1="30" y1={160 - pct * 1.4} x2="580" y2={160 - pct * 1.4} stroke="#e5e5e5" strokeWidth="1" />
                        <text x="25" y={164 - pct * 1.4} textAnchor="end" fill="#706e6b" fontSize="9">{pct}%</text>
                      </g>
                    ))}
                    {/* Achieving line */}
                    <polyline
                      fill="none"
                      stroke="var(--sf-success)"
                      strokeWidth="2"
                      points={domainAggs.map((d, i) => {
                        const x = 50 + i * ((580 - 50) / (domainAggs.length - 1 || 1));
                        const y = 160 - (d.total > 0 ? (d.achieving / d.total) * 100 : 0) * 1.4;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {/* Progressing line */}
                    <polyline
                      fill="none"
                      stroke="var(--sf-warning)"
                      strokeWidth="2"
                      points={domainAggs.map((d, i) => {
                        const x = 50 + i * ((580 - 50) / (domainAggs.length - 1 || 1));
                        const y = 160 - (d.total > 0 ? (d.progressing / d.total) * 100 : 0) * 1.4;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {/* Getting Started line */}
                    <polyline
                      fill="none"
                      stroke="var(--sf-blue)"
                      strokeWidth="2"
                      points={domainAggs.map((d, i) => {
                        const x = 50 + i * ((580 - 50) / (domainAggs.length - 1 || 1));
                        const y = 160 - (d.total > 0 ? (d.gettingStarted / d.total) * 100 : 0) * 1.4;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {/* Data points */}
                    {domainAggs.map((d, i) => {
                      const x = 50 + i * ((580 - 50) / (domainAggs.length - 1 || 1));
                      return (
                        <g key={d.domainNum}>
                          <circle cx={x} cy={160 - (d.total > 0 ? (d.achieving / d.total) * 100 : 0) * 1.4} r="3" fill="var(--sf-success)" />
                          <circle cx={x} cy={160 - (d.total > 0 ? (d.progressing / d.total) * 100 : 0) * 1.4} r="3" fill="var(--sf-warning)" />
                          <circle cx={x} cy={160 - (d.total > 0 ? (d.gettingStarted / d.total) * 100 : 0) * 1.4} r="3" fill="var(--sf-blue)" />
                          <text x={x} y="175" textAnchor="middle" fill="#706e6b" fontSize="9">D{d.domainNum}</text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="flex gap-3 text-[10px] text-[var(--sf-text-muted)] mt-1">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[var(--sf-success)] inline-block" /> Achieving %</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[var(--sf-warning)] inline-block" /> Progressing %</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[var(--sf-blue)] inline-block" /> Getting Started %</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grouped data table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-[var(--sf-border)]">
                  <th className="px-3 py-2 text-left font-bold text-[var(--sf-text-secondary)] sticky left-0 bg-white z-10 min-w-[140px]">
                    Account
                  </th>
                  <th className="px-2 py-2 text-left font-bold text-[var(--sf-text-secondary)] min-w-[160px]">
                    Assessment Name
                  </th>
                  {mkpiDomains.map(domain => (
                    <th
                      key={domain.id}
                      colSpan={domain.subDomains.reduce((sum, sd) => sum + sd.indicators.length, 0)}
                      className="px-1 py-1 text-center font-bold text-[var(--sf-text-secondary)] border-l border-[var(--sf-border)]"
                    >
                      <span className="truncate block text-[10px]">{domain.number}. {domain.name.split(' ').slice(0, 2).join(' ')}</span>
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-[var(--sf-border)]">
                  <th className="px-3 py-1 sticky left-0 bg-white z-10" />
                  <th className="px-2 py-1" />
                  {allIndicators.map(ind => (
                    <th key={ind.id} className="px-1 py-1 text-center text-[9px] font-normal text-[var(--sf-text-muted)] min-w-[28px] border-l border-[var(--sf-border)]">
                      {ind.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classAssessments.map((a, idx) => {
                  // Check if this is a new group
                  const prevA = idx > 0 ? classAssessments[idx - 1] : null;
                  const isNewGroup = !prevA || prevA.studentName !== a.studentName;
                  return (
                    <React.Fragment key={a.id}>
                      {isNewGroup && (
                        <tr className="bg-[var(--sf-info-light)] border-b border-[var(--sf-border)]">
                          <td colSpan={2 + allIndicators.length} className="px-3 py-1.5 text-[11px] font-bold text-[var(--sf-blue)]">
                            <SfIcon name="chevron-down" size={10} className="inline mr-1 text-[var(--sf-blue)]" />
                            {a.studentName}
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-[var(--sf-border)] hover:bg-gray-50">
                        <td className="px-3 py-1.5 sticky left-0 bg-white z-10 text-[11px] text-[var(--sf-text-primary)] pl-6">
                          {a.studentName}
                        </td>
                        <td className="px-2 py-1.5">
                          <Link href={`/assessments/${a.id}`} className="text-[var(--sf-text-link)] hover:underline text-[11px]">
                            {a.period} {a.year}
                          </Link>
                        </td>
                        {allIndicators.map(ind => (
                          <td key={ind.id} className={`px-1 py-1 text-center text-[10px] border-l border-[var(--sf-border)] ${getRatingCellClass(a.indicatorValues[ind.id])}`}>
                            {getRatingAbbrev(a.indicatorValues[ind.id])}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                })}
                {/* Subtotal row */}
                {classAssessments.length > 0 && (
                  <tr className="border-t-2 border-[var(--sf-border)] bg-gray-50 font-bold">
                    <td className="px-3 py-2 text-[11px] text-[var(--sf-text-primary)] sticky left-0 bg-gray-50 z-10" colSpan={2}>
                      Grand Totals ({classAssessments.length} records)
                    </td>
                    {allIndicators.map(ind => {
                      let a = 0, p = 0, gs = 0;
                      classAssessments.forEach(assess => {
                        const v = assess.indicatorValues[ind.id];
                        if (v === 'Achieving') a++;
                        else if (v === 'Progressing') p++;
                        else if (v === 'Getting Started') gs++;
                      });
                      const dominant = a >= p && a >= gs ? 'A' : p >= gs ? 'P' : 'GS';
                      const total = a + p + gs;
                      return (
                        <td key={ind.id} className="px-1 py-1.5 text-center text-[9px] border-l border-[var(--sf-border)] text-[var(--sf-text-muted)]">
                          {total > 0 ? `${Math.round((a / total) * 100)}%` : '-'}
                        </td>
                      );
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[var(--sf-border)] bg-gray-50 flex items-center justify-between">
            <div className="flex gap-3 text-[10px] text-[var(--sf-text-muted)]">
              <span>A = Achieving</span>
              <span>P = Progressing</span>
              <span>GS = Getting Started</span>
            </div>
            <span className="text-[11px] text-[var(--sf-text-muted)]">
              Rows 1-{classAssessments.length} of {classAssessments.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
