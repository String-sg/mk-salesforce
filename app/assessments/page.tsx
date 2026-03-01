'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import SfBadge from '../components/sf/SfBadge';
import SfIcon from '../components/sf/SfIcon';
import { useRole } from '../hooks/useRole';
import { useAssessment } from '../hooks/useAssessment';
import { mkCentres, classGroups, getClassDisplayName } from '../data/centres';

// Generate list views from centres/classes - matching Salesforce screenshot pattern
function getListViews(canViewAllCentres: boolean, canViewAllClasses: boolean, centreId: string, classIds: string[]) {
  const views: { id: string; label: string; pinned?: boolean }[] = [];

  if (canViewAllCentres) {
    // PEB sees all centres and classes
    mkCentres.forEach(centre => {
      classGroups.filter(c => c.centreId === centre.id).forEach(cls => {
        views.push({ id: cls.id, label: `${centre.name} - ${cls.level}-${cls.name}` });
      });
    });
  } else if (canViewAllClasses) {
    // Centre head sees all classes in their centre
    classGroups.filter(c => c.centreId === centreId).forEach(cls => {
      const centre = mkCentres.find(ct => ct.id === centreId);
      views.push({ id: cls.id, label: `${centre?.name || ''} - ${cls.level}-${cls.name}` });
    });
  } else {
    // Teacher sees only their assigned classes
    classIds.forEach(cid => {
      const cls = classGroups.find(c => c.id === cid);
      if (cls) {
        const centre = mkCentres.find(ct => ct.id === cls.centreId);
        views.push({ id: cls.id, label: `${centre?.name || ''} - ${cls.level}-${cls.name}` });
      }
    });
  }

  return [
    { id: 'recent', label: 'Recently Viewed', pinned: true },
    ...views,
    { id: 'all', label: 'All MK Assessments' },
  ];
}

export default function AssessmentsPage() {
  const { currentUser, isTeacher, isReviewer, canViewAllClasses, canViewAllCentres } = useRole();
  const { getVisibleAssessments } = useAssessment();
  const [selectedView, setSelectedView] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewPicker, setShowViewPicker] = useState(false);
  const [viewSearch, setViewSearch] = useState('');
  const [sortCol, setSortCol] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const listViews = useMemo(() =>
    getListViews(canViewAllCentres, canViewAllClasses, currentUser.centreId, currentUser.classIds),
    [canViewAllCentres, canViewAllClasses, currentUser.centreId, currentUser.classIds]
  );

  const currentView = listViews.find(v => v.id === selectedView) || listViews[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowViewPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allAssessments = getVisibleAssessments();

  const filteredAssessments = useMemo(() => {
    let filtered = allAssessments;

    // Apply view filter
    if (selectedView !== 'recent' && selectedView !== 'all') {
      filtered = filtered.filter(a => a.classId === selectedView);
    }

    // Apply search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.studentName.toLowerCase().includes(q) ||
        a.className.toLowerCase().includes(q) ||
        a.ownerName.toLowerCase().includes(q)
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      let valA = '', valB = '';
      switch (sortCol) {
        case 'name': valA = `${a.studentName} - ${a.period}`; valB = `${b.studentName} - ${b.period}`; break;
        case 'account': valA = a.studentName; valB = b.studentName; break;
        case 'class': valA = a.className; valB = b.className; break;
        case 'owner': valA = a.ownerName; valB = b.ownerName; break;
        case 'status': valA = a.status; valB = b.status; break;
        case 'completion': return sortDir === 'asc' ? a.completionPercentage - b.completionPercentage : b.completionPercentage - a.completionPercentage;
      }
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return filtered;
  }, [allAssessments, selectedView, searchQuery, sortCol, sortDir]);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const filteredViews = listViews.filter(v =>
    v.label.toLowerCase().includes(viewSearch.toLowerCase())
  );

  return (
    <div>
      {/* Salesforce-style page header with breadcrumb */}
      <div className="bg-white border-b border-[var(--sf-border)] -mx-6 -mt-4 px-6 pt-3 pb-0 mb-4">
        {/* Breadcrumb */}
        <p className="text-xs text-[var(--sf-text-muted)] mb-1">MK Assessments</p>

        {/* Title row with view selector and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="relative" ref={dropdownRef}>
            {/* View selector button - matches Salesforce "Recently Viewed ▼" pattern */}
            <button
              onClick={() => setShowViewPicker(!showViewPicker)}
              className="flex items-center gap-1.5 text-lg font-semibold text-[var(--sf-text-primary)] hover:text-[var(--sf-blue)] cursor-pointer group"
            >
              <SfIcon name="pin" size={18} className="text-[var(--sf-blue)]" />
              <span>{currentView?.label || 'Recently Viewed'}</span>
              <SfIcon name="chevron-down" size={16} className="text-[var(--sf-text-muted)] group-hover:text-[var(--sf-blue)]" />
            </button>

            {/* Dropdown - Salesforce list view picker */}
            {showViewPicker && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-dropdown)] z-50">
                <div className="p-2 border-b border-[var(--sf-border)]">
                  <div className="relative">
                    <SfIcon name="search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--sf-text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search list views..."
                      value={viewSearch}
                      onChange={e => setViewSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-[var(--sf-border-dark)] rounded bg-white focus:outline-none focus:border-[var(--sf-blue)]"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="py-1 max-h-64 overflow-y-auto">
                  <p className="px-3 py-1 text-[11px] font-bold text-[var(--sf-text-muted)] uppercase">Recent List Views</p>
                  {filteredViews.map(view => (
                    <button
                      key={view.id}
                      onClick={() => { setSelectedView(view.id); setShowViewPicker(false); setViewSearch(''); }}
                      className={`w-full text-left px-3 py-2 text-[13px] cursor-pointer hover:bg-[var(--sf-info-light)] flex items-center gap-2 ${
                        selectedView === view.id ? 'bg-[var(--sf-info-light)] text-[var(--sf-blue)] font-medium' : 'text-[var(--sf-text-primary)]'
                      }`}
                    >
                      {selectedView === view.id && <SfIcon name="check" size={14} className="text-[var(--sf-blue)]" />}
                      {view.pinned && <SfIcon name="pin" size={12} className="text-[var(--sf-text-muted)]" />}
                      <span>{view.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons - matching Salesforce layout */}
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-[13px] font-medium text-white bg-[var(--sf-blue)] rounded hover:bg-[var(--sf-blue-dark)] cursor-pointer">
              New
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Import
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Change Owner
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Printable View
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Assign Label
            </button>
          </div>
        </div>

        {/* Sub-header row: item count + search */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--sf-text-muted)]">{filteredAssessments.length} items</span>
            {selectedView !== 'recent' && selectedView !== 'all' && (
              <span className="text-xs text-[var(--sf-text-muted)]">
                Sorted by Assessment Name · Filtered by Class Name · Updated a few seconds ago
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SfIcon name="search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--sf-text-muted)]" />
              <input
                type="text"
                placeholder="Search this list..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[13px] border border-[var(--sf-border-dark)] rounded bg-white w-52 focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)]"
              />
            </div>
            {/* View mode toggles */}
            <div className="flex items-center border border-[var(--sf-border-dark)] rounded overflow-hidden">
              <button className="p-1.5 bg-[var(--sf-info-light)] border-r border-[var(--sf-border-dark)]">
                <SfIcon name="list" size={14} className="text-[var(--sf-blue)]" />
              </button>
              <button className="p-1.5 hover:bg-gray-50 cursor-pointer">
                <SfIcon name="chart" size={14} className="text-[var(--sf-text-muted)]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data table - matching Salesforce Lightning table */}
      <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[var(--sf-border)]">
              <th className="w-10 px-2 py-2">
                <input type="checkbox" className="accent-[var(--sf-blue)]" />
              </th>
              <ThSortable label="Assessment Name" col="name" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <ThSortable label="Account" col="account" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <ThSortable label="Class Name" col="class" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <ThSortable label="Owner" col="owner" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <th className="px-3 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Alias</th>
              <ThSortable label="Mid-Year" col="status" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <ThSortable label="Completion%" col="completion" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {filteredAssessments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-[var(--sf-text-muted)]">
                  No assessments found.
                </td>
              </tr>
            ) : (
              filteredAssessments.map((a, idx) => (
                <tr key={a.id} className={`border-b border-[var(--sf-border)] hover:bg-[var(--sf-info-light)] transition-colors ${idx % 2 === 0 ? '' : ''}`}>
                  <td className="w-10 px-2 py-2">
                    <input type="checkbox" className="accent-[var(--sf-blue)]" />
                  </td>
                  <td className="px-3 py-2.5">
                    <Link href={`/assessments/${a.id}`} className="text-[13px] text-[var(--sf-text-link)] hover:underline">
                      {a.studentName} - {a.period} Assessment {a.year}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{a.studentName}</td>
                  <td className="px-3 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{a.className}</td>
                  <td className="px-3 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{a.ownerName}</td>
                  <td className="px-3 py-2.5 text-[13px] text-[var(--sf-text-muted)]">$free</td>
                  <td className="px-3 py-2.5">
                    {a.overallComments ? (
                      <span className="text-[13px] text-[var(--sf-text-primary)] line-clamp-1">{a.overallComments}</span>
                    ) : (
                      <span className="text-[13px] text-[var(--sf-text-muted)]"></span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${a.completionPercentage === 100 ? 'bg-[var(--sf-success)]' : 'bg-[var(--sf-blue)]'}`}
                          style={{ width: `${a.completionPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--sf-text-muted)]">{a.completionPercentage}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Sortable table header component
function ThSortable({ label, col, sortCol, sortDir, onSort }: {
  label: string; col: string; sortCol: string; sortDir: 'asc' | 'desc'; onSort: (col: string) => void;
}) {
  const isActive = sortCol === col;
  return (
    <th
      className="px-3 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)] cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => onSort(col)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {isActive && (
          <SfIcon name={sortDir === 'asc' ? 'chevron-up' : 'chevron-down'} size={10} className="text-[var(--sf-blue)]" />
        )}
      </div>
    </th>
  );
}
