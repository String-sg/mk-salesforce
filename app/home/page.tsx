'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SfBadge from '../components/sf/SfBadge';
import SfIcon from '../components/sf/SfIcon';
import { useRole } from '../hooks/useRole';
import { useAssessment } from '../hooks/useAssessment';
import { mockStudents } from '../data/students';
import { getClassById, getClassesByCentre, getCentreById, classGroups, mkCentres } from '../data/centres';
import { mkpiDomains } from '../data/indicators';

const mtTeacherMap: Record<string, string> = {
  'Chinese': 'Wang Li Hua',
  'Malay': 'Siti Aminah',
  'Tamil': 'Priya Raman',
};

function getMtTeacher(studentId: string): string {
  const student = mockStudents.find(s => s.id === studentId);
  return student ? (mtTeacherMap[student.motherTongue] || '—') : '—';
}

export default function HomePage() {
  const { currentUser, canViewAllClasses, canViewAllCentres } = useRole();
  const { getAssessmentsByClass, getVisibleAssessments } = useAssessment();

  // Determine available classes for this user
  const availableClasses = useMemo(() => {
    if (canViewAllCentres) {
      return mkCentres.flatMap(c => getClassesByCentre(c.id));
    }
    if (canViewAllClasses) {
      return getClassesByCentre(currentUser.centreId);
    }
    return currentUser.classIds.map(id => getClassById(id)).filter(Boolean) as typeof classGroups;
  }, [currentUser, canViewAllClasses, canViewAllCentres]);

  const [selectedClassId, setSelectedClassId] = useState(availableClasses[0]?.id || 'cl1');
  const [activeTab, setActiveTab] = useState<'children' | 'assessments'>('children');
  const [assessmentSearch, setAssessmentSearch] = useState('');

  const selectedClass = getClassById(selectedClassId);
  const selectedCentre = selectedClass ? getCentreById(selectedClass.centreId) : null;

  // Students in selected class
  const classStudents = mockStudents.filter(s => s.classId === selectedClassId);

  // Assessments for selected class
  const classAssessments = getAssessmentsByClass(selectedClassId);

  return (
    <div>
      {/* Page header with class toggle */}
      <div className="bg-white border-b border-[var(--sf-border)] -mx-6 -mt-4 px-6 pt-3 pb-0 mb-4">
        {/* Class selector row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--sf-blue)] rounded flex items-center justify-center">
              <SfIcon name="people" size={18} color="white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="text-lg font-semibold text-[var(--sf-text-primary)] bg-transparent border-none focus:outline-none cursor-pointer pr-6 appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'%23706e6b\'%3E%3Cpath d=\'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
                >
                  {availableClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.level} {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-[var(--sf-text-muted)]">
                {selectedCentre?.name || ''} &middot; {classStudents.length} children
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Printable View
            </button>
          </div>
        </div>

        {/* Tabs: Children | Dashboard */}
        <div className="flex gap-6">
          {([
            { id: 'children' as const, label: 'Children' },
            { id: 'assessments' as const, label: 'Assessments' },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 text-[13px] font-medium cursor-pointer border-b-[3px] transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--sf-blue)] text-[var(--sf-blue)]'
                  : 'border-transparent text-[var(--sf-text-muted)] hover:text-[var(--sf-text-primary)]'
              }`}
            >
              {tab.label}
              {tab.id === 'children' && <span className="ml-1 text-[11px]">({classStudents.length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ===== CHILDREN TAB ===== */}
      {activeTab === 'children' && (
        <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)] overflow-hidden">
          {/* Table toolbar */}
          <div className="px-4 py-2.5 border-b border-[var(--sf-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--sf-text-muted)]">{classStudents.length} children</span>
            <div className="relative">
              <SfIcon name="search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--sf-text-muted)]" />
              <input
                type="text"
                placeholder="Search children..."
                className="pl-8 pr-3 py-1.5 text-[13px] border border-[var(--sf-border-dark)] rounded bg-white w-48 focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)]"
              />
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[var(--sf-border)]">
                <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Child Name</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">MT Name</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Gender</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">NRIC</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map(student => {
                return (
                  <tr key={student.id} className="border-b border-[var(--sf-border)] hover:bg-[var(--sf-info-light)] transition-colors">
                    <td className="px-4 py-2.5">
                      <Link href={`/students/${student.id}`} className="text-[13px] text-[var(--sf-text-link)] hover:underline font-medium">
                        {student.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{student.motherTongueName}</td>
                    <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{student.gender}</td>
                    <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{student.nric}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== ASSESSMENTS TAB ===== */}
      {activeTab === 'assessments' && (() => {
        const filtered = classAssessments
          .filter(a => !assessmentSearch || a.studentName.toLowerCase().includes(assessmentSearch.toLowerCase()))
          .sort((a, b) => {
            // EOY first, then Mid-Year
            const periodOrder = (p: string) => p === 'End-Year' ? 0 : 1;
            const pDiff = periodOrder(a.period) - periodOrder(b.period);
            if (pDiff !== 0) return pDiff;
            return a.studentName.localeCompare(b.studentName);
          });
        return (
          <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--sf-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--sf-text-muted)]">{filtered.length} assessments</span>
              <div className="relative">
                <SfIcon name="search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--sf-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={assessmentSearch}
                  onChange={e => setAssessmentSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-[13px] border border-[var(--sf-border-dark)] rounded bg-white w-48 focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)]"
                />
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[var(--sf-border)]">
                  <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Assessment Name</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Child</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">EL Teacher</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">MT Teacher</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-[var(--sf-border)] hover:bg-[var(--sf-info-light)] transition-colors">
                    <td className="px-4 py-2.5">
                      <Link href={`/assessments/${a.id}`} className="text-[13px] text-[var(--sf-text-link)] hover:underline font-medium">
                        {a.studentName} - {a.period} Assessment {a.year}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{a.studentName}</td>
                    <td className="px-4 py-2.5"><SfBadge status={a.status} /></td>
                    <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{a.ownerName}</td>
                    <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{getMtTeacher(a.studentId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}

    </div>
  );
}
