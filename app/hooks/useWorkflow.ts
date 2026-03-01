'use client';

import type { WorkflowStatus } from '../data/types';
import { useAssessmentContext } from '../context/AssessmentContext';
import { useRole } from './useRole';

interface WorkflowAction {
  label: string;
  variant: 'brand' | 'success' | 'destructive' | 'neutral';
  action: () => void;
  disabled?: boolean;
}

export function useWorkflow(assessmentId: string) {
  const { getAssessment, submitForReview, approveAssessment, returnAssessment, startReview } = useAssessmentContext();
  const { currentUser, isTeacher, isReviewer } = useRole();
  const assessment = getAssessment(assessmentId);

  const getAvailableActions = (): WorkflowAction[] => {
    if (!assessment) return [];
    const status = assessment.status;
    const actions: WorkflowAction[] = [];

    if (isTeacher) {
      if (status === 'Draft' || status === 'Returned') {
        actions.push({
          label: 'Submit for Review',
          variant: 'brand',
          action: () => submitForReview(assessmentId),
          disabled: assessment.completionPercentage < 100,
        });
      }
    }

    if (isReviewer) {
      if (status === 'Submitted') {
        actions.push({
          label: 'Start Review',
          variant: 'brand',
          action: () => startReview(assessmentId),
        });
      }
      if (status === 'Submitted' || status === 'Under Review') {
        actions.push({
          label: 'Approve',
          variant: 'success',
          action: () => approveAssessment(assessmentId),
        });
        actions.push({
          label: 'Return to Teacher',
          variant: 'destructive',
          action: () => returnAssessment(assessmentId, '', currentUser.id, currentUser.name),
        });
      }
    }

    return actions;
  };

  const getNextStatus = (): WorkflowStatus | null => {
    if (!assessment) return null;
    const transitions: Record<WorkflowStatus, WorkflowStatus | null> = {
      'Draft': 'Submitted',
      'Submitted': 'Under Review',
      'Under Review': 'Approved',
      'Approved': null,
      'Returned': 'Submitted',
    };
    return transitions[assessment.status];
  };

  const getStatusHistory = () => {
    if (!assessment) return [];
    const history: { status: string; date: string; actor?: string }[] = [];
    history.push({ status: 'Created', date: assessment.createdAt });
    if (assessment.submittedAt) {
      history.push({ status: 'Submitted', date: assessment.submittedAt, actor: assessment.ownerName });
    }
    if (assessment.reviewedAt) {
      history.push({ status: 'Under Review', date: assessment.reviewedAt, actor: assessment.reviewerName });
    }
    if (assessment.approvedAt) {
      history.push({ status: 'Approved', date: assessment.approvedAt, actor: assessment.reviewerName });
    }
    if (assessment.returnedAt) {
      history.push({ status: 'Returned', date: assessment.returnedAt, actor: assessment.reviewerName });
    }
    return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return {
    assessment,
    getAvailableActions,
    getNextStatus,
    getStatusHistory,
  };
}
