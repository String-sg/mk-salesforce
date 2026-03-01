'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SfPageHeader from '../components/sf/SfPageHeader';
import SfCard from '../components/sf/SfCard';
import SfIcon from '../components/sf/SfIcon';
import SfSearch from '../components/sf/SfSearch';
import { useRole } from '../hooks/useRole';
import { useAssessment } from '../hooks/useAssessment';
import { mockStudents, getStudentsByClass, getStudentsByCentre } from '../data/students';
import { getClassById } from '../data/centres';

export default function StudentsPage() {
  const { currentUser, canViewAllClasses, canViewAllCentres } = useRole();
  const { getAssessmentsByStudent } = useAssessment();
  const [searchQuery, setSearchQuery] = useState('');

  const visibleStudents = useMemo(() => {
    let students = mockStudents;
    if (canViewAllCentres) {
      // PEB sees all
    } else if (canViewAllClasses) {
      students = getStudentsByCentre(currentUser.centreId);
    } else {
      students = currentUser.classIds.flatMap(cid => getStudentsByClass(cid));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      students = students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.classId.toLowerCase().includes(q)
      );
    }

    return students;
  }, [currentUser, canViewAllClasses, canViewAllCentres, searchQuery]);

  return (
    <div>
      <SfPageHeader
        title="Children"
        subtitle="Child Directory"
        icon={<SfIcon name="people" size={18} color="white" />}
        breadcrumbs={[{ label: 'Home', href: '/home' }, { label: 'Children' }]}
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--sf-text-muted)]">{visibleStudents.length} children</p>
        <SfSearch placeholder="Search children..." onSearch={setSearchQuery} className="w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleStudents.map(student => {
          const classInfo = getClassById(student.classId);
          const assessments = getAssessmentsByStudent(student.id);
          const latestAssessment = assessments[0];

          return (
            <Link key={student.id} href={`/students/${student.id}`}>
              <SfCard className="hover:shadow-md transition-shadow cursor-pointer !p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--sf-blue)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--sf-text-link)]">{student.name}</p>
                    <p className="text-xs text-[var(--sf-text-muted)]">
                      {classInfo ? `${classInfo.level} ${classInfo.name}` : student.classId}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[var(--sf-text-muted)]">
                      <span>{student.gender}</span>
                      <span>{student.motherTongue}</span>
                      {latestAssessment && (
                        <span className={`font-medium ${
                          latestAssessment.status === 'Approved' ? 'text-[var(--sf-success)]' :
                          latestAssessment.status === 'Draft' ? 'text-[var(--sf-text-muted)]' :
                          'text-[var(--sf-blue)]'
                        }`}>
                          {latestAssessment.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </SfCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
