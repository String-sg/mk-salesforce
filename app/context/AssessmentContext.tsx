'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Assessment, RatingValue, WorkflowStatus, ReviewComment } from '../data/types';
import { initialAssessments } from '../data/assessments';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AssessmentContextType {
  assessments: Assessment[];
  getAssessment: (id: string) => Assessment | undefined;
  getAssessmentsByStudent: (studentId: string) => Assessment[];
  getAssessmentsByClass: (classId: string) => Assessment[];
  getAssessmentsByCentre: (centreId: string) => Assessment[];
  updateIndicator: (assessmentId: string, indicatorId: string, value: RatingValue) => void;
  updateComments: (assessmentId: string, comments: string) => void;
  updateMtComments: (assessmentId: string, comments: string) => void;
  updateAnnotation: (assessmentId: string, annotation: string) => void;
  saveAssessment: (assessmentId: string) => void;
  submitForReview: (assessmentId: string) => void;
  approveAssessment: (assessmentId: string) => void;
  returnAssessment: (assessmentId: string, comment: string, reviewerId: string, reviewerName: string) => void;
  startReview: (assessmentId: string) => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getAssessment = useCallback((id: string) => {
    return assessments.find(a => a.id === id);
  }, [assessments]);

  const getAssessmentsByStudent = useCallback((studentId: string) => {
    return assessments.filter(a => a.studentId === studentId);
  }, [assessments]);

  const getAssessmentsByClass = useCallback((classId: string) => {
    return assessments.filter(a => a.classId === classId);
  }, [assessments]);

  const getAssessmentsByCentre = useCallback((centreId: string) => {
    return assessments.filter(a => a.centreId === centreId);
  }, [assessments]);

  const updateAssessment = useCallback((id: string, updates: Partial<Assessment>) => {
    setAssessments(prev => prev.map(a =>
      a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    ));
  }, []);

  const updateIndicator = useCallback((assessmentId: string, indicatorId: string, value: RatingValue) => {
    setAssessments(prev => prev.map(a => {
      if (a.id !== assessmentId) return a;
      const newValues = { ...a.indicatorValues, [indicatorId]: value };
      const total = Object.keys(newValues).length;
      const filled = Object.values(newValues).filter(v => v !== null).length;
      const completionPercentage = Math.round((filled / total) * 100);
      return { ...a, indicatorValues: newValues, completionPercentage, updatedAt: new Date().toISOString() };
    }));
  }, []);

  const updateComments = useCallback((assessmentId: string, comments: string) => {
    updateAssessment(assessmentId, { overallComments: comments });
  }, [updateAssessment]);

  const updateMtComments = useCallback((assessmentId: string, comments: string) => {
    updateAssessment(assessmentId, { mtComments: comments });
  }, [updateAssessment]);

  const updateAnnotation = useCallback((assessmentId: string, annotation: string) => {
    updateAssessment(assessmentId, { annotation });
  }, [updateAssessment]);

  const saveAssessment = useCallback((assessmentId: string) => {
    updateAssessment(assessmentId, {});
    addToast('success', 'Assessment saved successfully.');
  }, [updateAssessment, addToast]);

  const submitForReview = useCallback((assessmentId: string) => {
    updateAssessment(assessmentId, {
      status: 'Submitted' as WorkflowStatus,
      submittedAt: new Date().toISOString(),
    });
    addToast('success', 'Assessment submitted for review.');
  }, [updateAssessment, addToast]);

  const startReview = useCallback((assessmentId: string) => {
    updateAssessment(assessmentId, {
      status: 'Under Review' as WorkflowStatus,
      reviewedAt: new Date().toISOString(),
    });
  }, [updateAssessment]);

  const approveAssessment = useCallback((assessmentId: string) => {
    updateAssessment(assessmentId, {
      status: 'Approved' as WorkflowStatus,
      approvedAt: new Date().toISOString(),
    });
    addToast('success', 'Assessment approved.');
  }, [updateAssessment, addToast]);

  const returnAssessment = useCallback((assessmentId: string, comment: string, reviewerId: string, reviewerName: string) => {
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) return;
    const newComment: ReviewComment = {
      id: `rc-${Date.now()}`,
      authorId: reviewerId,
      authorName: reviewerName,
      text: comment,
      createdAt: new Date().toISOString(),
    };
    updateAssessment(assessmentId, {
      status: 'Returned' as WorkflowStatus,
      returnedAt: new Date().toISOString(),
      reviewComments: [...assessment.reviewComments, newComment],
    });
    addToast('warning', 'Assessment returned to teacher.');
  }, [assessments, updateAssessment, addToast]);

  return (
    <AssessmentContext.Provider value={{
      assessments,
      getAssessment,
      getAssessmentsByStudent,
      getAssessmentsByClass,
      getAssessmentsByCentre,
      updateIndicator,
      updateComments,
      updateMtComments,
      updateAnnotation,
      saveAssessment,
      submitForReview,
      approveAssessment,
      returnAssessment,
      startReview,
      toasts,
      addToast,
      removeToast,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessmentContext must be used within an AssessmentProvider');
  }
  return context;
}
