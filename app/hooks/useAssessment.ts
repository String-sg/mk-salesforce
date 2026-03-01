'use client';

import { useAssessmentContext } from '../context/AssessmentContext';
import { useRole } from './useRole';

export function useAssessment() {
  const ctx = useAssessmentContext();
  const { currentUser, currentRole, canViewAllClasses, canViewAllCentres } = useRole();

  // Filter assessments based on role
  const getVisibleAssessments = () => {
    if (canViewAllCentres) {
      return ctx.assessments; // PEB sees everything
    }
    if (canViewAllClasses) {
      return ctx.assessments.filter(a => a.centreId === currentUser.centreId); // CH/KAH see centre
    }
    return ctx.assessments.filter(a => currentUser.classIds.includes(a.classId)); // Teachers see own classes
  };

  const getAssessmentsByStatus = (status: string) => {
    return getVisibleAssessments().filter(a => a.status === status);
  };

  const getPendingReviews = () => {
    if (currentRole === 'kah' || currentRole === 'centre_head') {
      return ctx.assessments.filter(a =>
        a.centreId === currentUser.centreId &&
        (a.status === 'Submitted' || a.status === 'Under Review')
      );
    }
    return [];
  };

  const getCompletionStats = (classId?: string) => {
    const filtered = classId
      ? ctx.assessments.filter(a => a.classId === classId)
      : getVisibleAssessments();

    const total = filtered.length;
    const approved = filtered.filter(a => a.status === 'Approved').length;
    const submitted = filtered.filter(a => a.status === 'Submitted').length;
    const draft = filtered.filter(a => a.status === 'Draft').length;
    const returned = filtered.filter(a => a.status === 'Returned').length;
    const underReview = filtered.filter(a => a.status === 'Under Review').length;

    return { total, approved, submitted, draft, returned, underReview };
  };

  return {
    ...ctx,
    getVisibleAssessments,
    getAssessmentsByStatus,
    getPendingReviews,
    getCompletionStats,
  };
}
