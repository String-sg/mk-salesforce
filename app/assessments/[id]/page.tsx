'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SfBadge from '../../components/sf/SfBadge';
import SfButton from '../../components/sf/SfButton';
import SfIcon from '../../components/sf/SfIcon';
import SfModal from '../../components/sf/SfModal';
import { useAssessmentContext } from '../../context/AssessmentContext';
import { useRole } from '../../hooks/useRole';
import { useWorkflow } from '../../hooks/useWorkflow';
import { mkpiDomains } from '../../data/indicators';
import { mockStudents } from '../../data/students';
import type { RatingValue } from '../../data/types';

const mtTeacherMap: Record<string, string> = {
  'Chinese': 'Wang Li Hua',
  'Malay': 'Siti Aminah',
  'Tamil': 'Priya Raman',
};

const ratingOptions = [
  { value: '', label: '\u2014None\u2014' },
  { value: 'Getting Started', label: 'Getting Started' },
  { value: 'Progressing', label: 'Progressing' },
  { value: 'Achieving', label: 'Achieving' },
  { value: 'Not Applicable', label: 'Not Applicable' },
];

const ratingColors: Record<string, string> = {
  'Getting Started': 'border-[var(--sf-blue)] bg-blue-50',
  'Progressing': 'border-[var(--sf-warning)] bg-amber-50',
  'Achieving': 'border-[var(--sf-success)] bg-green-50',
};

function IndicatorDropdown({ value, onChange, disabled }: {
  value: RatingValue; onChange: (val: RatingValue) => void; disabled: boolean;
}) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange((e.target.value || null) as RatingValue)}
      disabled={disabled}
      className={`w-full px-2 py-1.5 text-[13px] border rounded transition-colors cursor-pointer
        ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-70' : 'hover:border-[var(--sf-blue)]'}
        ${value ? ratingColors[value] || 'border-[var(--sf-border-dark)]' : 'border-[var(--sf-border-dark)] bg-white'}
        focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)]`}
    >
      {ratingOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export default function AssessmentDetailPage() {
  const params = useParams();
  const assessmentId = params.id as string;
  const { getAssessment, updateIndicator, updateComments, updateMtComments, updateAnnotation, saveAssessment } = useAssessmentContext();
  const { isTeacher, isReviewer } = useRole();
  const { getAvailableActions, getStatusHistory } = useWorkflow(assessmentId);
  const [activeTab, setActiveTab] = useState<'details' | 'docgen'>('details');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnComment, setReturnComment] = useState('');
  const [openDomains, setOpenDomains] = useState<Record<string, boolean>>({});
  const [openSubDomains, setOpenSubDomains] = useState<Record<string, boolean>>({});
  const [editAll, setEditAll] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<string | null>(null);
  const [editingComments, setEditingComments] = useState(false);

  const assessment = getAssessment(assessmentId);
  const workflowActions = getAvailableActions();
  const statusHistory = getStatusHistory();

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SfIcon name="error" size={48} className="text-[var(--sf-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--sf-text-muted)]">Assessment not found.</p>
          <Link href="/assessments" className="text-[var(--sf-text-link)] text-sm hover:underline mt-2 block">
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = isTeacher && (assessment.status === 'Draft' || assessment.status === 'Returned');
  const student = mockStudents.find(s => s.id === assessment.studentId);
  const mtTeacher = student ? (mtTeacherMap[student.motherTongue] || '—') : '—';
  const handleReturnAction = workflowActions.find(a => a.label === 'Return to Teacher');

  const toggleDomain = (id: string) => setOpenDomains(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSubDomain = (id: string) => setOpenSubDomains(prev => ({ ...prev, [id]: !prev[id] }));
  const isDomainOpen = (id: string) => openDomains[id] !== false;
  const isSubDomainOpen = (id: string) => openSubDomains[id] !== false;

  const getDomainAgg = (domainId: string) => {
    const domain = mkpiDomains.find(d => d.id === domainId);
    if (!domain) return '0.00';
    let total = 0, count = 0;
    domain.subDomains.forEach(sd => {
      sd.indicators.forEach(ind => {
        const val = assessment.indicatorValues[ind.id];
        if (val === 'Achieving') { total += 3; count++; }
        else if (val === 'Progressing') { total += 2; count++; }
        else if (val === 'Getting Started') { total += 1; count++; }
      });
    });
    return count > 0 ? (total / count).toFixed(2) : '0.00';
  };

  return (
    <div>
      {/* ===== Salesforce Record Page Header (matches slide 3) ===== */}
      <div className="bg-white border-b border-[var(--sf-border)] -mx-6 -mt-4 px-6 py-3 mb-4">
        <p className="text-xs text-[var(--sf-text-muted)] mb-1">MK Assessment</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--sf-blue)] rounded flex items-center justify-center flex-shrink-0">
              <SfIcon name="assignment" size={18} color="white" />
            </div>
            <h1 className="text-lg font-semibold text-[var(--sf-text-primary)]">
              {assessment.studentName} - {assessment.period} Assessment {assessment.year}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <SfBadge status={assessment.status} />
            <button onClick={() => setEditAll(true)} className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-text-primary)] border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer">Edit</button>
            <button className="px-2 py-1.5 border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer">
              <SfIcon name="chevron-down" size={14} className="text-[var(--sf-text-muted)]" />
            </button>
          </div>
        </div>
        {/* Tab bar: Details | DocGen */}
        <div className="flex items-center mt-3 -mb-3">
          {(['details', 'docgen'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-[3px] cursor-pointer transition-colors ${
                activeTab === tab
                  ? 'border-[var(--sf-blue)] text-[var(--sf-blue)]'
                  : 'border-transparent text-[var(--sf-text-muted)] hover:text-[var(--sf-text-primary)]'
              }`}
            >
              {tab === 'details' ? 'Details' : 'Report'}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 2-column layout: Main + Activity Sidebar (matches slide 3) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Main content */}
        <div>
          {/* ===== DETAILS TAB ===== */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Assessment Fields - read-only record detail */}
              <div className="bg-white border border-[var(--sf-border)] rounded-lg p-5">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <RecordField label="Assessment Name" value={`${assessment.studentName} - ${assessment.period} Assessment ${assessment.year}`} />
                  <RecordField label="Child" value={assessment.studentName} link={`/students/${assessment.studentId}`} />
                  <RecordField label="Class Name" value={assessment.className} />
                  <RecordField label="Teachers" value={`EL: ${assessment.ownerName} | MT: ${mtTeacher}`} />
                  <RecordField label="Required Date of Completion" value="" />
                </div>
              </div>

              {/* Qualitative Comments - read-only with pen icon, editable in edit mode */}
              <div className="bg-white border border-[var(--sf-border)] rounded-lg p-5">
                <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] mb-4">Qualitative Comments</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-[var(--sf-text-muted)]">English Language Teacher Comments</label>
                      {!(canEdit || editAll || editingComments) && (
                        <button onClick={() => setEditingComments(true)} className="cursor-pointer flex-shrink-0">
                          <SfIcon name="edit" size={14} className="text-[var(--sf-text-muted)]" />
                        </button>
                      )}
                    </div>
                    {(canEdit || editAll || editingComments) ? (
                      <textarea
                        value={assessment.overallComments}
                        onChange={e => updateComments(assessmentId, e.target.value)}
                        placeholder="Enter English Language teacher comments..."
                        className="w-full h-20 px-3 py-2 text-[13px] border border-[var(--sf-border-dark)] rounded bg-white focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)] resize-y"
                      />
                    ) : (
                      <p className="text-[13px] text-[var(--sf-text-primary)]">{assessment.overallComments || '—'}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-[var(--sf-text-muted)]">Mother Tongue Language Teacher Comments</label>
                      {!(canEdit || editAll || editingComments) && (
                        <button onClick={() => setEditingComments(true)} className="cursor-pointer flex-shrink-0">
                          <SfIcon name="edit" size={14} className="text-[var(--sf-text-muted)]" />
                        </button>
                      )}
                    </div>
                    {(canEdit || editAll || editingComments) ? (
                      <textarea
                        value={assessment.mtComments}
                        onChange={e => updateMtComments(assessmentId, e.target.value)}
                        placeholder="Enter Mother Tongue Language teacher comments..."
                        className="w-full h-20 px-3 py-2 text-[13px] border border-[var(--sf-border-dark)] rounded bg-white focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)] resize-y"
                      />
                    ) : (
                      <p className="text-[13px] text-[var(--sf-text-primary)]">{assessment.mtComments || '—'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Domain sections - collapsible with sub-domains (slides 4-5) */}
              {mkpiDomains.map(domain => (
                <div key={domain.id} className="bg-white border border-[var(--sf-border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleDomain(domain.id)}
                    className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-gray-50 cursor-pointer"
                  >
                    <SfIcon name={isDomainOpen(domain.id) ? 'chevron-down' : 'chevron-right'} size={14} className="text-[var(--sf-text-muted)]" />
                    <span className="text-sm font-semibold text-[var(--sf-text-primary)]">{domain.number}. {domain.name}</span>
                  </button>

                  {isDomainOpen(domain.id) && (
                    <div className="px-5 pb-4">
                      <div className="mb-3 text-xs text-[var(--sf-text-muted)]">
                        {domain.name} Agg: <span className="font-medium">{getDomainAgg(domain.id)}</span>
                      </div>

                      {domain.subDomains.map(subDomain => (
                        <div key={subDomain.id} className="mb-4">
                          <button
                            onClick={() => toggleSubDomain(subDomain.id)}
                            className="flex items-center gap-2 mb-3 cursor-pointer"
                          >
                            <SfIcon name={isSubDomainOpen(subDomain.id) ? 'chevron-down' : 'chevron-right'} size={12} className="text-[var(--sf-text-muted)]" />
                            <span className="text-sm font-semibold text-[var(--sf-text-primary)]">{subDomain.number} {subDomain.name}</span>
                          </button>

                          {isSubDomainOpen(subDomain.id) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 ml-5">
                              {subDomain.indicators.map(indicator => {
                                const val = assessment.indicatorValues[indicator.id];
                                const isEditing = editAll || editingIndicator === indicator.id;
                                return (
                                  <div key={indicator.id} className="relative">
                                    <label className="text-xs text-[var(--sf-text-secondary)] mb-1 block">
                                      {indicator.id} {indicator.descriptor}
                                    </label>
                                    {isEditing ? (
                                      <IndicatorDropdown
                                        value={val}
                                        onChange={v => {
                                          updateIndicator(assessmentId, indicator.id, v);
                                          if (!editAll) setEditingIndicator(null);
                                        }}
                                        disabled={false}
                                      />
                                    ) : (
                                      <div className="flex items-center justify-between">
                                        <p className="text-[13px] text-[var(--sf-text-primary)]">{val || '\u2014'}</p>
                                        <button onClick={() => setEditingIndicator(indicator.id)} className="cursor-pointer flex-shrink-0">
                                          <SfIcon name="edit" size={14} className="text-[var(--sf-text-muted)]" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Reviewer Annotation (conditional) */}
              {(isReviewer || assessment.annotation) && (
                <div className="bg-white border border-[var(--sf-border)] rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] mb-3">Reviewer Annotation</h3>
                  <textarea
                    value={assessment.annotation || ''}
                    onChange={e => updateAnnotation(assessmentId, e.target.value)}
                    disabled={!isReviewer}
                    placeholder="Add reviewer annotations..."
                    className="w-full h-16 px-3 py-2 text-[13px] border border-[var(--sf-border-dark)] rounded bg-white focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)] resize-y disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}

              {/* Created By / Last Modified By (slide 4 bottom) */}
              <div className="bg-white border border-[var(--sf-border)] rounded-lg p-5">
                <div className="grid grid-cols-2 gap-x-8">
                  <div>
                    <label className="text-xs text-[var(--sf-text-muted)]">Created By</label>
                    <p className="text-[13px] text-[var(--sf-text-link)] mt-0.5">
                      {assessment.ownerName}, {new Date(assessment.createdAt).toLocaleDateString('en-SG')}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--sf-text-muted)]">Last Modified By</label>
                    <p className="text-[13px] text-[var(--sf-text-link)] mt-0.5">
                      {assessment.ownerName}, {new Date(assessment.updatedAt).toLocaleDateString('en-SG')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancel / Save buttons - only in edit mode; workflow actions always visible */}
              {((editAll || editingIndicator || editingComments) || workflowActions.length > 0) && (
                <div className="flex items-center justify-center gap-3 py-4">
                  {(editAll || editingIndicator || editingComments) && (
                    <>
                      <button onClick={() => { setEditAll(false); setEditingIndicator(null); setEditingComments(false); }} className="px-5 py-2 text-[13px] font-medium text-[var(--sf-text-primary)] border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer">
                        Cancel
                      </button>
                      <button onClick={() => { saveAssessment(assessmentId); setEditAll(false); setEditingIndicator(null); setEditingComments(false); }} className="px-5 py-2 text-[13px] font-medium text-white bg-[var(--sf-error)] rounded hover:bg-red-700 cursor-pointer">
                        Save
                      </button>
                    </>
                  )}
                  {workflowActions.map(action => {
                    if (action.label === 'Return to Teacher') {
                      return (
                        <SfButton key={action.label} variant={action.variant} onClick={() => setShowReturnModal(true)}>{action.label}</SfButton>
                      );
                    }
                    return (
                      <SfButton key={action.label} variant={action.variant} onClick={action.action} disabled={action.disabled}
                        title={action.disabled ? 'Complete all indicators before submitting' : undefined}>
                        {action.label}
                      </SfButton>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== DOCGEN TAB ===== */}
          {activeTab === 'docgen' && (
            <DocGenWizard assessment={assessment} />
          )}
        </div>

        {/* ===== Activity Sidebar (matches slide 3 right panel) ===== */}
        <div className="space-y-4">
          <div className="bg-white border border-[var(--sf-border)] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] mb-3">Activity</h3>
            <div className="flex items-center gap-2 mb-3">
              <button className="w-8 h-8 rounded-full bg-[var(--sf-success)] flex items-center justify-center cursor-pointer hover:opacity-80" title="Log a Call"><SfIcon name="phone" size={14} color="white" /></button>
              <button className="w-8 h-8 rounded-full bg-[var(--sf-blue)] flex items-center justify-center cursor-pointer hover:opacity-80" title="New Task"><SfIcon name="task" size={14} color="white" /></button>
              <button className="w-8 h-8 rounded-full bg-[var(--sf-warning)] flex items-center justify-center cursor-pointer hover:opacity-80" title="New Event"><SfIcon name="calendar" size={14} color="white" /></button>
              <button className="w-8 h-8 rounded-full bg-[var(--sf-error)] flex items-center justify-center cursor-pointer hover:opacity-80" title="Email"><SfIcon name="email" size={14} color="white" /></button>
              <button className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer hover:opacity-80" title="More"><SfIcon name="more" size={14} color="white" /></button>
            </div>
            <p className="text-[11px] text-[var(--sf-text-muted)] mb-2">Filters: All time &middot; All activities &middot; All types</p>
            <div className="flex items-center gap-2 text-[11px] text-[var(--sf-text-link)] mb-4">
              <button className="hover:underline cursor-pointer">Refresh</button>
              <span className="text-[var(--sf-text-muted)]">&middot;</span>
              <button className="hover:underline cursor-pointer">Expand All</button>
              <span className="text-[var(--sf-text-muted)]">&middot;</span>
              <button className="hover:underline cursor-pointer">View All</button>
            </div>
            <div className="border-t border-[var(--sf-border)] pt-3">
              <button className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--sf-text-primary)] mb-2 cursor-pointer">
                <SfIcon name="chevron-down" size={12} /> Upcoming &amp; Overdue
              </button>
              <p className="text-xs text-[var(--sf-text-muted)] mb-2">No activities to show.</p>
              <p className="text-xs text-[var(--sf-text-muted)] mb-4">Get started by sending an email, scheduling a task, and more.</p>
            </div>
            {statusHistory.length > 0 && (
              <div className="border-t border-[var(--sf-border)] pt-3">
                <p className="text-xs font-semibold text-[var(--sf-text-secondary)] mb-2">Status History</p>
                <div className="space-y-2">
                  {statusHistory.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                        h.status === 'Approved' ? 'bg-[var(--sf-success)]' :
                        h.status === 'Returned' ? 'bg-[var(--sf-error)]' :
                        h.status === 'Submitted' ? 'bg-[var(--sf-blue)]' :
                        'bg-gray-400'
                      }`} />
                      <div>
                        <span className="font-medium text-[var(--sf-text-primary)]">{h.status}</span>
                        {h.actor && <span className="text-[var(--sf-text-muted)]"> by {h.actor}</span>}
                        <p className="text-[var(--sf-text-muted)]">{new Date(h.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-[var(--sf-text-muted)] mt-4">No past activity. Past meetings and tasks marked as done show up here.</p>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      <SfModal isOpen={showReturnModal} title="Return Assessment to Teacher" onClose={() => setShowReturnModal(false)} size="medium"
        footer={
          <div className="flex justify-end gap-2">
            <SfButton variant="neutral" onClick={() => setShowReturnModal(false)}>Cancel</SfButton>
            <SfButton variant="destructive" onClick={() => { if (handleReturnAction) handleReturnAction.action(); setShowReturnModal(false); }}>Return to Teacher</SfButton>
          </div>
        }
      >
        <div>
          <label className="text-xs font-bold text-[var(--sf-text-secondary)] block mb-1">Return Comment <span className="text-[var(--sf-error)]">*</span></label>
          <textarea value={returnComment} onChange={e => setReturnComment(e.target.value)}
            placeholder="Provide feedback to the teacher about what needs to be revised..."
            className="w-full h-24 px-3 py-2 text-[13px] border border-[var(--sf-border-dark)] rounded bg-white focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)] resize-y" />
        </div>
      </SfModal>
    </div>
  );
}

/* Record field component matching Salesforce Lightning field layout */
function RecordField({ label, value, link, editable, hasAvatar, isEditing, onEdit, onSave }: {
  label: string; value: string; link?: string; editable?: boolean; hasAvatar?: boolean;
  isEditing?: boolean; onEdit?: () => void; onSave?: (val: string) => void;
}) {
  const [localValue, setLocalValue] = React.useState(value);
  React.useEffect(() => { setLocalValue(value); }, [value]);

  if (isEditing && editable) {
    return (
      <div>
        <label className="text-xs text-[var(--sf-text-muted)]">{label}</label>
        <div className="mt-0.5 flex items-center gap-1">
          <input
            type="text"
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            className="flex-1 px-2 py-1 text-[13px] border border-[var(--sf-blue)] rounded bg-white focus:outline-none focus:shadow-[0_0_0_1px_var(--sf-blue)]"
          />
          <button onClick={() => onSave?.(localValue)} className="p-1 text-[var(--sf-blue)] hover:bg-blue-50 rounded cursor-pointer" title="Save">
            <SfIcon name="check" size={12} />
          </button>
          <button onClick={() => { setLocalValue(value); onSave?.(value); }} className="p-1 text-[var(--sf-text-muted)] hover:bg-gray-100 rounded cursor-pointer" title="Cancel">
            <SfIcon name="close" size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs text-[var(--sf-text-muted)]">{label}</label>
      <div className="flex items-center gap-1.5 mt-0.5 group">
        {hasAvatar && (
          <div className="w-5 h-5 rounded-full bg-[var(--sf-blue)] flex items-center justify-center flex-shrink-0">
            <SfIcon name="user" size={10} color="white" />
          </div>
        )}
        {link ? (
          <Link href={link} className="text-[13px] text-[var(--sf-text-link)] hover:underline">{value}</Link>
        ) : (
          <p className="text-[13px] text-[var(--sf-text-primary)]">{value || '\u2014'}</p>
        )}
        {editable && (
          <button onClick={onEdit} className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <SfIcon name="edit" size={12} className="text-[var(--sf-text-muted)]" />
          </button>
        )}
      </div>
    </div>
  );
}

/* DocGen Wizard — Salesforce-style interactive document generation */
function DocGenWizard({ assessment }: { assessment: { id: string; studentName: string; period: string; year: number; className: string; centreName: string; status: string; overallComments: string } }) {
  const [step, setStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('MK Performance Indicator Report');
  const [outputFormat, setOutputFormat] = useState('docx_pdf');
  const [fontSource, setFontSource] = useState('rte');
  const [docTitle, setDocTitle] = useState(`${assessment.studentName} PI Report`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(80);
  const totalPages = 4;

  const templates = [
    { id: 'mkpi', name: 'MK Performance Indicator Report', desc: 'Full MKPI framework report with all 7 domains, indicators and ratings' },
    { id: 'summary', name: 'Summary Progress Report', desc: 'Condensed progress summary for parent-teacher conferences' },
    { id: 'letter', name: 'Parent Communication Letter', desc: 'Formatted letter to parents with key highlights and comments' },
  ];

  const steps = [
    { num: 1, label: 'Specify Record ID & Template' },
    { num: 2, label: 'Select a Template' },
    { num: 3, label: 'Set Document Generation Options' },
    { num: 4, label: 'Generate Document' },
  ];

  const goNext = () => {
    const next = step + 1;
    setStep(next);
    setHighestStep(h => Math.max(h, next));
  };

  const goBack = () => { if (step > 1) setStep(step - 1); };

  const goToStep = (target: number) => {
    if (target <= highestStep) {
      setStep(target);
      if (target < 4) { setIsGenerated(false); setIsGenerating(false); }
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenProgress(0);
    setHighestStep(h => Math.max(h, 4));
    const interval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setIsGenerating(false); setIsGenerated(true); return 100; }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const handleGenerateAnother = () => {
    setStep(1);
    setHighestStep(1);
    setIsGenerated(false);
    setIsGenerating(false);
    setGenProgress(0);
    setPdfPage(1);
  };

  return (
    <div className="bg-white border border-[var(--sf-border)] rounded-lg p-5">
      <div className="grid grid-cols-[1fr_260px] gap-8">
        {/* Main content area */}
        <div>
          {/* Step 1: Specify Record ID & Template */}
          {step === 1 && (
            <div>
              <h3 className="text-base font-semibold text-[var(--sf-text-primary)] mb-4">Specify Record ID &amp; Template</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[var(--sf-text-secondary)] block mb-1">Record ID</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded border border-[var(--sf-border)]">
                    <SfIcon name="assignment" size={14} className="text-[var(--sf-blue)]" />
                    <span className="text-[13px] text-[var(--sf-text-primary)] font-medium">{assessment.studentName} - {assessment.period} Assessment {assessment.year}</span>
                  </div>
                  <p className="text-[11px] text-[var(--sf-text-muted)] mt-1">The document will be generated from this assessment record.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--sf-text-secondary)] block mb-1">Object Type</label>
                  <p className="text-[13px] text-[var(--sf-text-primary)] px-3 py-1.5 bg-gray-50 rounded border border-[var(--sf-border)]">MK Assessment</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--sf-text-secondary)] block mb-1">Template Type</label>
                  <select className="w-full px-3 py-1.5 text-[13px] border border-[var(--sf-border-dark)] rounded focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)] cursor-pointer">
                    <option>Microsoft Word Template (.docx)</option>
                    <option>Microsoft PowerPoint Template (.pptx)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button disabled className="px-4 py-2 text-[13px] text-[var(--sf-text-muted)] border border-[var(--sf-border)] rounded opacity-50 cursor-not-allowed">Previous</button>
                <button onClick={goNext} className="px-5 py-2 text-[13px] font-medium text-white bg-[var(--sf-blue)] rounded hover:brightness-90 cursor-pointer">Next</button>
              </div>
            </div>
          )}

          {/* Step 2: Select a Template */}
          {step === 2 && (
            <div>
              <h3 className="text-base font-semibold text-[var(--sf-text-primary)] mb-4">Select a Template</h3>
              <p className="text-xs text-[var(--sf-text-muted)] mb-3">Choose a document template to generate from this assessment record.</p>
              <div className="space-y-2">
                {templates.map(tmpl => (
                  <label
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.name)}
                    className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${
                      selectedTemplate === tmpl.name
                        ? 'border-[var(--sf-blue)] bg-blue-50 shadow-[0_0_0_1px_var(--sf-blue)]'
                        : 'border-[var(--sf-border)] hover:border-[var(--sf-blue)] hover:bg-gray-50'
                    }`}
                  >
                    <input type="radio" name="template" checked={selectedTemplate === tmpl.name} onChange={() => setSelectedTemplate(tmpl.name)} className="accent-[var(--sf-blue)] mt-0.5" />
                    <div>
                      <span className="text-[13px] text-[var(--sf-text-primary)] font-medium">{tmpl.name}</span>
                      <p className="text-[11px] text-[var(--sf-text-muted)] mt-0.5">{tmpl.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={goBack} className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)] border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer">Previous</button>
                <button onClick={goNext} className="px-5 py-2 text-[13px] font-medium text-white bg-[var(--sf-blue)] rounded hover:brightness-90 cursor-pointer">Next</button>
              </div>
            </div>
          )}

          {/* Step 3: Set Document Generation Options */}
          {step === 3 && (
            <div>
              <h3 className="text-base font-semibold text-[var(--sf-text-primary)] mb-4">Set Document Generation Options</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[var(--sf-text-secondary)]">*Document Generation Type</label>
                  <select className="w-full mt-1 px-3 py-1.5 text-[13px] border border-[var(--sf-border-dark)] rounded focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)] cursor-pointer">
                    <option>Server Side Document Generation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--sf-text-secondary)]">*Output File Format</label>
                  <select
                    value={outputFormat}
                    onChange={e => setOutputFormat(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-[13px] border border-[var(--sf-border-dark)] rounded focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)] cursor-pointer"
                  >
                    <option value="docx_pdf">Microsoft Word or Microsoft PowerPoint &amp; PDF</option>
                    <option value="pdf">PDF Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--sf-text-secondary)]">Font Source</label>
                  <div className="flex items-center gap-4 mt-1">
                    <label className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                      <input type="radio" name="font" checked={fontSource === 'rte'} onChange={() => setFontSource('rte')} className="accent-[var(--sf-blue)]" /> Rich Text Editor Font
                    </label>
                    <label className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                      <input type="radio" name="font" checked={fontSource === 'doc'} onChange={() => setFontSource('doc')} className="accent-[var(--sf-blue)]" /> Document Font
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--sf-text-secondary)]">Document Title</label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={e => setDocTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-[13px] border border-[var(--sf-border-dark)] rounded focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)]"
                  />
                </div>
                <p className="text-xs text-[var(--sf-text-link)] cursor-pointer hover:underline mt-1">Save for later</p>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={goBack} className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)] border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer">Previous</button>
                <button onClick={goNext} className="px-5 py-2 text-[13px] font-medium text-white bg-[var(--sf-blue)] rounded hover:brightness-90 cursor-pointer">Next</button>
              </div>
            </div>
          )}

          {/* Step 4: Generate Document */}
          {step === 4 && (
            <div>
              <h3 className="text-base font-semibold text-[var(--sf-text-primary)] mb-4">Generate Document</h3>

              {/* Pre-generation: summary & generate button */}
              {!isGenerating && !isGenerated && (
                <div>
                  <div className="bg-gray-50 rounded-lg border border-[var(--sf-border)] p-4 mb-4">
                    <h4 className="text-xs font-bold text-[var(--sf-text-secondary)] mb-3 uppercase tracking-wide">Generation Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-[13px]">
                      <div><span className="text-[var(--sf-text-muted)] text-xs">Record:</span><p className="text-[var(--sf-text-primary)] font-medium">{assessment.studentName}</p></div>
                      <div><span className="text-[var(--sf-text-muted)] text-xs">Period:</span><p className="text-[var(--sf-text-primary)] font-medium">{assessment.period} {assessment.year}</p></div>
                      <div><span className="text-[var(--sf-text-muted)] text-xs">Template:</span><p className="text-[var(--sf-text-primary)] font-medium">{selectedTemplate}</p></div>
                      <div><span className="text-[var(--sf-text-muted)] text-xs">Output:</span><p className="text-[var(--sf-text-primary)] font-medium">{outputFormat === 'pdf' ? 'PDF Only' : 'DOCX & PDF'}</p></div>
                      <div><span className="text-[var(--sf-text-muted)] text-xs">Document Title:</span><p className="text-[var(--sf-text-primary)] font-medium">{docTitle}</p></div>
                      <div><span className="text-[var(--sf-text-muted)] text-xs">Font Source:</span><p className="text-[var(--sf-text-primary)] font-medium">{fontSource === 'rte' ? 'Rich Text Editor Font' : 'Document Font'}</p></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button onClick={goBack} className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)] border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer">Previous</button>
                    <button onClick={handleGenerate} className="px-5 py-2 text-[13px] font-medium text-white bg-[var(--sf-success)] rounded hover:brightness-90 cursor-pointer flex items-center gap-2">
                      <SfIcon name="assignment" size={14} color="white" /> Generate Document
                    </button>
                  </div>
                </div>
              )}

              {/* Generating: progress bar animation */}
              {isGenerating && (
                <div className="py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-3 border-[var(--sf-blue)] border-t-transparent animate-spin" />
                    <p className="text-sm font-medium text-[var(--sf-text-primary)]">Generating document...</p>
                    <div className="w-full max-w-sm">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--sf-blue)] rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.min(genProgress, 100)}%` }} />
                      </div>
                      <p className="text-xs text-[var(--sf-text-muted)] text-center mt-2">Processing {selectedTemplate}...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated: PDF preview */}
              {isGenerated && (
                <div>
                  {/* Success banner */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <SfIcon name="check" size={16} className="text-[var(--sf-success)]" />
                    <span className="text-[13px] text-green-800 font-medium">Document generated successfully!</span>
                  </div>
                  {/* PDF viewer */}
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-700 text-white text-xs">
                      <span className="bg-gray-600 px-2 py-1 rounded truncate max-w-[120px]">{docTitle}.pdf</span>
                      <span className="text-gray-400">|</span>
                      <button onClick={() => setPdfPage(p => Math.max(1, p - 1))} disabled={pdfPage <= 1} className="p-0.5 hover:bg-gray-600 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">&lsaquo;</button>
                      <span>{pdfPage} / {totalPages}</span>
                      <button onClick={() => setPdfPage(p => Math.min(totalPages, p + 1))} disabled={pdfPage >= totalPages} className="p-0.5 hover:bg-gray-600 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">&rsaquo;</button>
                      <span className="text-gray-400">|</span>
                      <span>{pdfZoom}%</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <button onClick={() => setPdfZoom(z => Math.min(150, z + 10))} className="px-1.5 py-0.5 hover:bg-gray-600 rounded cursor-pointer text-sm">+</button>
                        <button onClick={() => setPdfZoom(z => Math.max(50, z - 10))} className="px-1.5 py-0.5 hover:bg-gray-600 rounded cursor-pointer text-sm">&minus;</button>
                      </div>
                    </div>
                    <div className="p-6 flex justify-center overflow-auto" style={{ maxHeight: '480px' }}>
                      <div className="bg-white rounded shadow-lg p-8 w-full transition-transform origin-top" style={{ maxWidth: `${pdfZoom * 5}px` }}>
                        {pdfPage === 1 && (
                          <>
                            <div className="text-center mb-4 pb-3 border-b border-gray-300">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Ministry of Education</p>
                              <h3 className="text-sm font-bold text-gray-800 mt-1">MOE KINDERGARTEN @ {assessment.centreName.replace('MOE K @ ', '').toUpperCase()}</h3>
                              <p className="text-xs text-gray-600 mt-1">{assessment.period} Performance Indicator Report {assessment.year}</p>
                            </div>
                            <div className="mb-3">
                              <h4 className="text-xs font-bold text-gray-700 mb-1">Preamble for Parents</h4>
                              <p className="text-[10px] text-gray-600 leading-relaxed">This document reports a holistic view of your child&apos;s learning and development based on the MOE Kindergarten Performance Indicators framework. It covers seven domains that reflect the key competencies children develop during their kindergarten years.</p>
                            </div>
                            <div className="text-[10px] text-gray-600 space-y-1 mt-4">
                              <p><strong>Child:</strong> {assessment.studentName}</p>
                              <p><strong>Class:</strong> {assessment.className}</p>
                              <p><strong>Period:</strong> {assessment.period} {assessment.year}</p>
                              <p><strong>Centre:</strong> {assessment.centreName}</p>
                            </div>
                          </>
                        )}
                        {pdfPage === 2 && (
                          <>
                            <h4 className="text-xs font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">Domain 1: Social &amp; Emotional Competencies</h4>
                            <div className="space-y-2">
                              {['1.1 Self-Awareness', '1.2 Self-Management', '1.3 Social Awareness', '1.4 Relationship Management', '1.5 Responsible Decision-Making'].map(item => (
                                <div key={item} className="flex items-center justify-between text-[10px] py-1 border-b border-gray-100">
                                  <span className="text-gray-700">{item}</span>
                                  <span className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">Progressing</span>
                                </div>
                              ))}
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200 mt-4">Domain 2: Language &amp; Literacy (EL)</h4>
                            <div className="space-y-2">
                              {['2.1 Listening &amp; Viewing', '2.2 Speaking &amp; Representing', '2.3 Reading &amp; Viewing', '2.4 Writing &amp; Representing'].map(item => (
                                <div key={item} className="flex items-center justify-between text-[10px] py-1 border-b border-gray-100">
                                  <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
                                  <span className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">Achieving</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        {pdfPage === 3 && (
                          <>
                            <h4 className="text-xs font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">Domain 4: Numeracy</h4>
                            <div className="space-y-2">
                              {['4.1 Number Sense', '4.2 Spatial Sense', '4.3 Measurement', '4.4 Patterning'].map(item => (
                                <div key={item} className="flex items-center justify-between text-[10px] py-1 border-b border-gray-100">
                                  <span className="text-gray-700">{item}</span>
                                  <span className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">Progressing</span>
                                </div>
                              ))}
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200 mt-4">Domain 5: Motor Skills Development</h4>
                            <div className="space-y-2">
                              {['5.1 Gross Motor Skills', '5.2 Fine Motor Skills'].map(item => (
                                <div key={item} className="flex items-center justify-between text-[10px] py-1 border-b border-gray-100">
                                  <span className="text-gray-700">{item}</span>
                                  <span className="text-gray-500 font-medium bg-green-100 px-2 py-0.5 rounded text-green-700">Achieving</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        {pdfPage === 4 && (
                          <>
                            <h4 className="text-xs font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">Teacher Comments</h4>
                            <div className="mb-4">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">English Language Teacher</p>
                              <p className="text-[10px] text-gray-600 leading-relaxed">{assessment.overallComments || 'No comments recorded.'}</p>
                            </div>
                            <div className="mb-4">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">Mother Tongue Language Teacher</p>
                              <p className="text-[10px] text-gray-600 leading-relaxed">Student shows good progress in oral communication and is beginning to recognise common characters.</p>
                            </div>
                            <div className="mt-6 pt-3 border-t border-gray-200 text-[9px] text-gray-400 text-center">
                              <p>Generated on {new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              <p>MOE Kindergarten &middot; Ministry of Education, Singapore</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-center gap-3 mt-4">
                    <button className="px-4 py-2 text-[13px] font-medium text-white bg-[var(--sf-blue)] rounded hover:brightness-90 cursor-pointer flex items-center gap-2">
                      <SfIcon name="download" size={14} color="white" /> Download PDF
                    </button>
                    {outputFormat === 'docx_pdf' && (
                      <button className="px-4 py-2 text-[13px] font-medium text-[var(--sf-text-primary)] border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                        <SfIcon name="download" size={14} /> Download DOCX
                      </button>
                    )}
                    <button onClick={handleGenerateAnother} className="px-4 py-2 text-[13px] font-medium text-[var(--sf-text-primary)] border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer">
                      Generate Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Steps sidebar — clickable navigation */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--sf-text-primary)] mb-3">Steps</h4>
          <div className="space-y-1">
            {steps.map(s => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              const isClickable = s.num <= highestStep;
              return (
                <button
                  key={s.num}
                  onClick={() => isClickable && goToStep(s.num)}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors ${
                    isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
                  } ${isCurrent ? 'bg-blue-50' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors ${
                    isCompleted ? 'bg-[var(--sf-success)] text-white' : isCurrent ? 'bg-[var(--sf-blue)] text-white' : 'bg-gray-200 text-[var(--sf-text-muted)]'
                  }`}>
                    {isCompleted ? <SfIcon name="check" size={12} color="white" /> : s.num}
                  </div>
                  <span className={`text-xs ${isCurrent ? 'text-[var(--sf-blue)] font-semibold' : isCompleted ? 'text-[var(--sf-text-primary)] font-medium' : 'text-[var(--sf-text-muted)]'}`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
