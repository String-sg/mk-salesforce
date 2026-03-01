'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SfBadge from '../../components/sf/SfBadge';
import SfIcon from '../../components/sf/SfIcon';
import { useAssessment } from '../../hooks/useAssessment';
import { getStudentById } from '../../data/students';
import { getClassById, getCentreById } from '../../data/centres';
import { mkpiDomains } from '../../data/indicators';

// ─── Note data model (matches Salesforce Notes) ───
interface Note {
  id: string;
  title: string;
  body: string;
  createdBy: string;
  lastModified: string;
  relatedTo: string;
}

function getMockNotes(studentName: string): Note[] {
  return [
    { id: 'n1', title: 'Attendance Discussion', body: 'Conversations with parent regarding recent attendance patterns. Father mentioned that the child has been feeling unwell in the mornings. Agreed to monitor for the next two weeks and follow up.', createdBy: 'Sarah Chen', lastModified: '3/23/2025, 12:27 PM', relatedTo: studentName },
    { id: 'n2', title: 'Behavior Discussion', body: "Mother noted improvements in the child's behavior at home, particularly around sharing with siblings. This aligns with our classroom observations of improved social interactions.", createdBy: 'Sarah Chen', lastModified: '3/23/2025, 10:21 AM', relatedTo: studentName },
    { id: 'n3', title: 'Literacy Progress Update', body: 'Child demonstrated significant improvement in letter recognition during this week\'s assessment. Can now identify 22 out of 26 uppercase letters independently, up from 15 last month.', createdBy: 'Sarah Chen', lastModified: '3/15/2025, 2:45 PM', relatedTo: studentName },
    { id: 'n4', title: 'Social Skills Observation', body: 'Observed positive group play interactions during outdoor time. Initiated a cooperative building activity with three peers and demonstrated turn-taking without adult prompting.', createdBy: 'Ahmad Razali', lastModified: '3/10/2025, 9:30 AM', relatedTo: studentName },
    { id: 'n5', title: 'Fine Motor Skills Progress', body: 'Notable improvement in fine motor control during art activities. Successfully cut along curved lines and completed a detailed drawing with recognizable shapes and figures.', createdBy: 'Ahmad Razali', lastModified: '2/28/2025, 3:15 PM', relatedTo: studentName },
  ];
}

// ─── Reusable RecordField (label/value with pencil-on-hover) ───
function RecordField({ label, value, isLink, href }: { label: string; value: string; isLink?: boolean; href?: string }) {
  return (
    <div className="group py-2">
      <label className="text-xs text-[var(--sf-text-muted)] block mb-0.5">{label}</label>
      <div className="flex items-center gap-1">
        {isLink && href ? (
          <Link href={href} className="text-[13px] text-[var(--sf-text-link)] hover:underline">{value}</Link>
        ) : (
          <span className="text-[13px] text-[var(--sf-text-primary)]">{value || '\u2014'}</span>
        )}
        <SfIcon name="edit" size={12} className="text-[var(--sf-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
      </div>
    </div>
  );
}

// ─── Rich Text Toolbar Button ───
function ToolbarBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick?: () => void }) {
  return (
    <button
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center text-[#706e6b] hover:bg-gray-100 border border-transparent hover:border-[var(--sf-border)] rounded cursor-pointer"
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

// Strip HTML tags for text preview in table
function stripHtml(html: string): string {
  return html.replace(/<img[^>]*>/gi, ' [image] ').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

// Inline SVG icons matching the Salesforce rich text toolbar exactly
function BoldIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h5a3.5 3.5 0 0 1 2.5 5.95A3.5 3.5 0 0 1 9.5 14H4V2zm2 2v3.5h3a1.5 1.5 0 1 0 0-3H6zm0 5.5V12h3.5a1.5 1.5 0 1 0 0-3H6z"/></svg>; }
function ItalicIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M6 2h6v2h-2.2l-2.6 8H9v2H3v-2h2.2l2.6-8H6V2z"/></svg>; }
function UnderlineIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3 13h10v1.5H3V13zM5 2v6a3 3 0 0 0 6 0V2h2v6a5 5 0 0 1-10 0V2h2z"/></svg>; }
function StrikethroughIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3 7h10v1.5H3V7zm2.5-5H11v2H8.5v3h-2V4H5V2h.5zM6.5 9h2v5H5v-2h1.5V9z"/></svg>; }
function BulletListIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM5.5 3h9v1h-9V3zm0 4h9v1h-9V7zm0 4h9v1h-9v-1zM2 7.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM2 11.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/></svg>; }
function NumberedListIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h1.5v3H2.2V3.2H1.5V2.5h.5V2zm0 5h1.8l-1.6 2H3.5v.8H1V9l1.5-2H1.2V6.2H3V7H2zm0 4.2h1.5v.5h-.8v.5h.8v.5H2v.5h1.8v.8H1.2v-3.3H2v.5zM5.5 3h9v1h-9V3zm0 4h9v1h-9V7zm0 4h9v1h-9v-1z"/></svg>; }
function IndentIncreaseIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2h14v1.5H1V2zm4 3h10v1.5H5V5zm0 3h10v1.5H5V8zM1 11h14v1.5H1V11zM1 5.5l3 2-3 2v-4z"/></svg>; }
function IndentDecreaseIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2h14v1.5H1V2zm4 3h10v1.5H5V5zm0 3h10v1.5H5V8zM1 11h14v1.5H1V11zM4 5.5l-3 2 3 2v-4z"/></svg>; }
function ImageIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2zm0 1.5h12V10l-3-3-2 2-3-3-4 4V4.5zM5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>; }

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const { getAssessmentsByStudent } = useAssessment();
  const student = getStudentById(studentId);
  const assessments = getAssessmentsByStudent(studentId);

  const [activeTab, setActiveTab] = useState('profile');
  const [notes, setNotes] = useState<Note[]>(() => getMockNotes(student?.name || 'Child'));
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [editorKey, setEditorKey] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync contentEditable initial content when editor opens
  useEffect(() => {
    if ((editingNote !== null || isCreatingNote) && editorRef.current) {
      editorRef.current.innerHTML = noteBody;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorKey]);

  // Execute rich text formatting command
  const execCommand = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, []);

  // Handle image upload from file picker
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (editorRef.current) {
        editorRef.current.focus();
        // Insert image at cursor position
        document.execCommand('insertImage', false, dataUrl);
        // Style inserted images
        const imgs = editorRef.current.querySelectorAll('img');
        imgs.forEach(img => {
          img.style.maxWidth = '100%';
          img.style.borderRadius = '4px';
          img.style.margin = '8px 0';
          img.style.display = 'block';
        });
        // Update state
        setNoteBody(editorRef.current.innerHTML);
      }
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  }, []);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--sf-text-muted)]">Child not found.</p>
      </div>
    );
  }

  const classInfo = getClassById(student.classId);
  const centreInfo = getCentreById(student.centreId);
  const latestAssessment = assessments.find(a => a.status === 'Approved') || assessments[0];

  // Domain summaries for performance overview
  const domainSummaries = mkpiDomains.map(domain => {
    if (!latestAssessment) return { domain: domain.name, domainNum: domain.number, achieving: 0, progressing: 0, gettingStarted: 0, total: 0 };
    let achieving = 0, progressing = 0, gettingStarted = 0, total = 0;
    domain.subDomains.forEach(sd => {
      sd.indicators.forEach(ind => {
        const val = latestAssessment.indicatorValues[ind.id];
        total++;
        if (val === 'Achieving') achieving++;
        else if (val === 'Progressing') progressing++;
        else if (val === 'Getting Started') gettingStarted++;
      });
    });
    return { domain: domain.name, domainNum: domain.number, achieving, progressing, gettingStarted, total };
  });

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'notes', label: 'Notes' },
    { id: 'assessments', label: 'Assessments' },
  ];

  // Open note editor
  const openNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteBody(note.body);
    setIsCreatingNote(false);
    setEditorKey(k => k + 1);
  };

  const openNewNote = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteBody('');
    setIsCreatingNote(true);
    setEditorKey(k => k + 1);
  };

  const closeEditor = () => {
    // Save content from contentEditable before closing
    const finalBody = editorRef.current?.innerHTML || '';
    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(n =>
        n.id === editingNote.id
          ? { ...n, title: noteTitle || 'Untitled Note', body: finalBody, lastModified: new Date().toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) }
          : n
      ));
    } else if (isCreatingNote && (noteTitle || finalBody)) {
      // Create new note
      const newNote: Note = {
        id: `n${Date.now()}`,
        title: noteTitle || 'Untitled Note',
        body: finalBody,
        createdBy: 'Sarah Chen',
        lastModified: new Date().toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
        relatedTo: student?.name || 'Child',
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setEditingNote(null);
    setIsCreatingNote(false);
    setNoteTitle('');
    setNoteBody('');
  };

  const showEditor = editingNote !== null || isCreatingNote;

  return (
    <div>
      {/* ─── Record page header ─── */}
      <div className="bg-white border-b border-[var(--sf-border)] -mx-6 -mt-4 px-6 pt-3 pb-0 mb-4">
        {/* Breadcrumb */}
        <p className="text-xs text-[var(--sf-text-muted)] mb-1">
          <Link href="/students" className="hover:underline text-[var(--sf-text-link)]">Children</Link>
        </p>

        {/* Title + actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--sf-blue)] flex items-center justify-center text-white font-semibold text-sm">
              {student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[var(--sf-text-primary)]">{student.name}</h1>
              <p className="text-xs text-[var(--sf-text-muted)]">
                {classInfo ? `${classInfo.level} ${classInfo.name}` : student.classId}
                {centreInfo ? ` \u00b7 ${centreInfo.name}` : ''}
              </p>
            </div>
            {latestAssessment && <SfBadge status={latestAssessment.status} />}
          </div>

          <div className="flex items-center gap-1">
            <button onClick={openNewNote} className="px-3 py-1.5 text-[13px] font-medium text-white bg-[var(--sf-blue)] rounded hover:bg-[var(--sf-blue-dark)] cursor-pointer">
              New Note
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Edit
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-50 rounded cursor-pointer">
              Change Owner
            </button>
            <button className="p-1.5 text-[var(--sf-text-muted)] hover:bg-gray-50 rounded cursor-pointer">
              <SfIcon name="chevron-down" size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6">
          {tabs.map(tab => (
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
              {tab.id === 'notes' && <span className="ml-1 text-[11px]">({notes.length})</span>}
              {tab.id === 'assessments' && <span className="ml-1 text-[11px]">({assessments.length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content area: 2-column ─── */}
      <div className="grid grid-cols-[1fr_340px] gap-4">
        {/* Left content */}
        <div className="relative">
          {/* ═══ Profile Tab ═══ */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)]">
                <div className="px-4 py-3 border-b border-[var(--sf-border)]">
                  <h3 className="text-sm font-bold text-[var(--sf-text-primary)]">Child Information</h3>
                </div>
                <div className="px-4 py-2 grid grid-cols-2 gap-x-8">
                  <RecordField label="Full Name" value={student.name} />
                  <RecordField label="Mother Tongue Name" value={student.motherTongueName} />
                  <RecordField label="NRIC" value={student.nric} />
                  <RecordField label="Date of Birth" value={student.dateOfBirth} />
                  <RecordField label="Gender" value={student.gender} />
                  <RecordField label="Mother Tongue" value={student.motherTongue} />
                  <RecordField label="Class" value={classInfo ? `${classInfo.level} ${classInfo.name}` : student.classId} />
                  <RecordField label="Centre" value={centreInfo?.name || student.centreId} />
                  <RecordField label="Centre Code" value={centreInfo?.code || '\u2014'} />
                </div>
              </div>

              <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)] overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--sf-border)]">
                  <h3 className="text-sm font-bold text-[var(--sf-text-primary)]">Performance Overview</h3>
                  {latestAssessment && (
                    <p className="text-[11px] text-[var(--sf-text-muted)] mt-0.5">
                      Based on <Link href={`/assessments/${latestAssessment.id}`} className="text-[var(--sf-text-link)] hover:underline">{latestAssessment.period} {latestAssessment.year} Assessment</Link>
                    </p>
                  )}
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[var(--sf-border)]">
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Domain</th>
                      <th className="px-4 py-2 text-right text-xs font-bold text-[var(--sf-text-secondary)]">Achieving</th>
                      <th className="px-4 py-2 text-right text-xs font-bold text-[var(--sf-text-secondary)]">Progressing</th>
                      <th className="px-4 py-2 text-right text-xs font-bold text-[var(--sf-text-secondary)]">Getting Started</th>
                      <th className="px-4 py-2 text-right text-xs font-bold text-[var(--sf-text-secondary)]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domainSummaries.map((ds, idx) => (
                      <tr key={idx} className="border-b border-[var(--sf-border)] hover:bg-[var(--sf-info-light)]">
                        <td className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)]">{ds.domainNum}. {ds.domain}</td>
                        <td className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)] text-right">{ds.achieving}</td>
                        <td className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)] text-right">{ds.progressing}</td>
                        <td className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)] text-right">{ds.gettingStarted}</td>
                        <td className="px-4 py-2 text-[13px] text-[var(--sf-text-primary)] text-right font-medium">{ds.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)]">
                <div className="px-4 py-2 grid grid-cols-2 gap-x-8">
                  <RecordField label="Created By" value="System Admin, 01/01/2025" />
                  <RecordField label="Last Modified By" value="Ms Sarah Chen, 12/06/2025" />
                </div>
              </div>
            </div>
          )}

          {/* ═══ Notes Tab (Salesforce Notes pattern) ═══ */}
          {activeTab === 'notes' && (
            <div className="relative">
              <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)]">
                {/* Header: notepad icon + Notes (N) + New button */}
                <div className="px-4 py-3 border-b border-[var(--sf-border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SfIcon name="note" size={16} className="text-[var(--sf-warning)]" />
                    <h3 className="text-sm font-bold text-[var(--sf-text-primary)]">Notes ({notes.length})</h3>
                  </div>
                  <button
                    onClick={openNewNote}
                    className="px-3 py-1 text-[13px] font-medium text-[var(--sf-blue)] border border-[var(--sf-border-dark)] rounded hover:bg-gray-50 cursor-pointer"
                  >
                    New
                  </button>
                </div>

                {/* Notes table */}
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--sf-border)]">
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Text Preview</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Created By</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map(note => (
                      <tr key={note.id} className="border-b border-[var(--sf-border)] hover:bg-[var(--sf-info-light)] transition-colors">
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => openNote(note)}
                            className="text-[13px] text-[var(--sf-text-link)] hover:underline cursor-pointer text-left max-w-[180px] truncate block"
                          >
                            {note.title}
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-muted)] max-w-[200px] truncate">
                          {stripHtml(note.body)}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[13px] text-[var(--sf-text-link)]">{note.createdBy}</span>
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">
                          {note.lastModified}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* View All link */}
                <div className="px-4 py-2.5 text-center border-t border-[var(--sf-border)]">
                  <button className="text-xs text-[var(--sf-text-link)] hover:underline cursor-pointer">View All</button>
                </div>
              </div>

              {/* ─── Inline Note Editor Overlay (Screenshot 2) ─── */}
              {showEditor && (
                <div className="absolute top-8 left-16 right-4 z-50 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-[var(--sf-border)] flex flex-col max-h-[520px]">
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--sf-border)] bg-white rounded-t-lg">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <SfIcon name="note" size={16} className="text-[var(--sf-warning)] flex-shrink-0" />
                      <span className="text-[13px] font-medium text-[var(--sf-text-primary)] truncate">
                        {noteTitle || 'Untitled Note'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button className="p-1 text-[var(--sf-text-muted)] hover:bg-gray-100 rounded cursor-pointer" title="Expand">
                        <SfIcon name="forward" size={14} />
                      </button>
                      <button onClick={closeEditor} className="p-1 text-[var(--sf-text-muted)] hover:bg-gray-100 rounded cursor-pointer" title="Close">
                        <SfIcon name="close" size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Title + visibility */}
                  <div className="px-4 pt-3 pb-1 flex items-start justify-between">
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={e => setNoteTitle(e.target.value)}
                      placeholder="Untitled Note"
                      className="text-lg font-semibold text-[var(--sf-text-primary)] bg-transparent border-none focus:outline-none flex-1 placeholder:text-gray-300"
                    />
                    <div className="flex items-center gap-1 text-[11px] text-[var(--sf-text-muted)] flex-shrink-0 mt-1">
                      <SfIcon name="eye" size={12} />
                      <span>Visibility Set by Record</span>
                    </div>
                  </div>

                  {/* Rich text toolbar — all buttons are functional */}
                  <div className="mx-4 py-1.5 flex items-center border border-[var(--sf-border)] rounded bg-white">
                    <ToolbarBtn title="Bold" onClick={() => execCommand('bold')}><BoldIcon /></ToolbarBtn>
                    <ToolbarBtn title="Italic" onClick={() => execCommand('italic')}><ItalicIcon /></ToolbarBtn>
                    <ToolbarBtn title="Underline" onClick={() => execCommand('underline')}><UnderlineIcon /></ToolbarBtn>
                    <ToolbarBtn title="Strikethrough" onClick={() => execCommand('strikeThrough')}><StrikethroughIcon /></ToolbarBtn>
                    <div className="w-px h-5 bg-[var(--sf-border)] mx-0.5" />
                    <ToolbarBtn title="Bulleted List" onClick={() => execCommand('insertUnorderedList')}><BulletListIcon /></ToolbarBtn>
                    <ToolbarBtn title="Numbered List" onClick={() => execCommand('insertOrderedList')}><NumberedListIcon /></ToolbarBtn>
                    <ToolbarBtn title="Increase Indent" onClick={() => execCommand('indent')}><IndentIncreaseIcon /></ToolbarBtn>
                    <ToolbarBtn title="Decrease Indent" onClick={() => execCommand('outdent')}><IndentDecreaseIcon /></ToolbarBtn>
                    <div className="w-px h-5 bg-[var(--sf-border)] mx-0.5" />
                    <ToolbarBtn title="Upload Image" onClick={() => fileInputRef.current?.click()}><ImageIcon /></ToolbarBtn>
                  </div>

                  {/* Hidden file input for image upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Rich text body (contentEditable) */}
                  <div className="flex-1 overflow-y-auto px-4 py-3">
                    <div
                      key={editorKey}
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={() => {
                        if (editorRef.current) setNoteBody(editorRef.current.innerHTML);
                      }}
                      data-placeholder="Write your note here..."
                      className="w-full min-h-[150px] text-[13px] text-[var(--sf-text-primary)] leading-relaxed bg-transparent border-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 [&_img]:max-w-full [&_img]:rounded [&_img]:my-2 [&_img]:block [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5"
                    />
                  </div>

                  {/* Related to */}
                  <div className="px-4 py-2 border-t border-[var(--sf-border)]">
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="text-[var(--sf-text-muted)]">Related to</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-[var(--sf-text-primary)]">
                        <SfIcon name="folder" size={12} className="text-[var(--sf-warning)]" />
                        {student.name}
                      </span>
                    </div>
                  </div>

                  {/* Footer buttons */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--sf-border)] bg-gray-50 rounded-b-lg">
                    <button className="text-[13px] text-[var(--sf-error)] hover:underline cursor-pointer">Delete</button>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-100 rounded cursor-pointer">Share</button>
                      <button className="px-3 py-1.5 text-[13px] font-medium text-[var(--sf-blue)] hover:bg-gray-100 rounded cursor-pointer">Add to Records</button>
                      <button
                        onClick={closeEditor}
                        className="px-4 py-1.5 text-[13px] font-medium text-white bg-[var(--sf-blue)] rounded hover:bg-[var(--sf-blue-dark)] cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ Assessments Tab ═══ */}
          {activeTab === 'assessments' && (
            <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--sf-border)] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--sf-text-primary)]">Assessment Records ({assessments.length})</h3>
              </div>
              {assessments.length === 0 ? (
                <p className="text-xs text-[var(--sf-text-muted)] text-center py-8 px-4">No assessments found.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[var(--sf-border)]">
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Assessment Name</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Period</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Owner</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)]">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map(a => (
                      <tr key={a.id} className="border-b border-[var(--sf-border)] hover:bg-[var(--sf-info-light)] transition-colors">
                        <td className="px-4 py-2.5">
                          <Link href={`/assessments/${a.id}`} className="text-[13px] text-[var(--sf-text-link)] hover:underline">
                            {a.studentName} - {a.period} {a.year}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{a.period} {a.year}</td>
                        <td className="px-4 py-2.5"><SfBadge status={a.status} /></td>
                        <td className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">{a.ownerName}</td>
                        <td className="px-4 py-2.5">
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
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>

        {/* ─── Right sidebar ─── */}
        <div className="space-y-4">
          {/* Activity panel */}
          <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)]">
            <div className="px-4 py-3 border-b border-[var(--sf-border)]">
              <h3 className="text-sm font-bold text-[var(--sf-text-primary)]">Activity</h3>
            </div>
            <div className="px-4 py-3 border-b border-[var(--sf-border)]">
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center cursor-pointer" title="Log a Call">
                  <SfIcon name="phone" size={14} className="text-white" />
                </button>
                <button className="w-8 h-8 rounded-full bg-[var(--sf-blue)] flex items-center justify-center cursor-pointer" title="New Task">
                  <SfIcon name="check" size={14} className="text-white" />
                </button>
                <button className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center cursor-pointer" title="New Event">
                  <SfIcon name="calendar" size={14} className="text-white" />
                </button>
                <button className="w-8 h-8 rounded-full bg-[var(--sf-error)] flex items-center justify-center cursor-pointer" title="Email">
                  <SfIcon name="email" size={14} className="text-white" />
                </button>
              </div>
            </div>
            <div className="px-4 py-2 border-b border-[var(--sf-border)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--sf-text-muted)]">
                <span className="text-[var(--sf-text-link)] cursor-pointer hover:underline">Refresh</span>
                {' \u00b7 '}
                <span className="text-[var(--sf-text-link)] cursor-pointer hover:underline">Expand All</span>
                {' \u00b7 '}
                <span className="text-[var(--sf-text-link)] cursor-pointer hover:underline">View All</span>
              </span>
            </div>
            <div className="px-4 py-3 space-y-3">
              <p className="text-[11px] font-bold text-[var(--sf-text-muted)] uppercase">Upcoming & Overdue</p>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[var(--sf-warning)] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] text-[var(--sf-text-primary)]">Complete Mid-Year Assessment</p>
                  <p className="text-[11px] text-[var(--sf-text-muted)]">Task \u00b7 Due 30/06/2025</p>
                </div>
              </div>
              <p className="text-[11px] font-bold text-[var(--sf-text-muted)] uppercase mt-4">Recent Activity</p>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[var(--sf-success)] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] text-[var(--sf-text-primary)]">Assessment updated</p>
                  <p className="text-[11px] text-[var(--sf-text-muted)]">Ms Sarah Chen \u00b7 12/06/2025</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[var(--sf-success)] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] text-[var(--sf-text-primary)]">Note added</p>
                  <p className="text-[11px] text-[var(--sf-text-muted)]">Mr Ahmad Razali \u00b7 05/06/2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-card)]">
            <div className="px-4 py-3 border-b border-[var(--sf-border)]">
              <h3 className="text-sm font-bold text-[var(--sf-text-primary)]">Quick Links</h3>
            </div>
            <div className="px-4 py-3 space-y-2">
              {assessments.slice(0, 3).map(a => (
                <Link key={a.id} href={`/assessments/${a.id}`} className="block text-[13px] text-[var(--sf-text-link)] hover:underline">
                  {a.period} {a.year} Assessment
                </Link>
              ))}
              <Link href="/reports" className="block text-[13px] text-[var(--sf-text-link)] hover:underline">
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
