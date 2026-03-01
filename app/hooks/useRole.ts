'use client';

import { useRoleContext } from '../context/RoleContext';
import type { UserRole } from '../data/types';

export function useRole() {
  const { currentRole, currentUser, setRole } = useRoleContext();

  const isTeacher = currentRole === 'teacher_el' || currentRole === 'teacher_mt';
  const isKAH = currentRole === 'kah';
  const isCentreHead = currentRole === 'centre_head';
  const isPEB = currentRole === 'peb';
  const isReviewer = isKAH || isCentreHead;

  const canEdit = isTeacher;
  const canReview = isReviewer;
  const canApprove = isReviewer;
  const canViewAllCentres = isPEB;
  const canViewAllClasses = isCentreHead || isKAH || isPEB;

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      teacher_el: 'Teacher (EL)',
      teacher_mt: 'Teacher (MTL)',
      kah: 'Key Appointment Holder',
      centre_head: 'Centre Head',
      peb: 'PEB (HQ)',
    };
    return labels[role];
  };

  return {
    currentRole,
    currentUser,
    setRole,
    isTeacher,
    isKAH,
    isCentreHead,
    isPEB,
    isReviewer,
    canEdit,
    canReview,
    canApprove,
    canViewAllCentres,
    canViewAllClasses,
    getRoleLabel,
  };
}
