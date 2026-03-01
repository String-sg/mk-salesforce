import type { Assessment, RatingValue, Task, CalendarEvent } from './types';
import { getAllIndicatorIds } from './indicators';

// Indicator IDs in CSV column order (maps CSV columns to our indicator IDs)
const indicatorOrder: string[] = [
  '1.1.1', '1.2.1', '1.2.2', '1.3.1', '1.3.2', '1.4.1', '1.4.2', '1.5.1', '1.5.2',
  '2.1.1', '2.2.1', '2.3.1', '2.4.1', '2.5.1', '2.6.1',
  '3.1.1', '3.1.2', '3.2.1', '3.2.2',
  '4.1.1', '4.2.1',
  '5.1.1', '5.2.1', '5.3.1', '5.4.1', '5.5.1',
  '6A.1.1', '6A.2.1', '6A.2.2', '6A.2.3', '6A.3.1', '6A.3.2', '6A.3.3', '6A.3.4', '6A.3.5', '6A.3.6',
  '6B.1.1', '6B.1.2', '6B.2.1', '6B.2.2', '6B.2.3', '6B.3.1', '6B.3.2',
  '7.1.1', '7.1.2', '7.1.3', '7.2.1', '7.2.2', '7.2.3', '7.2.4', '7.2.5', '7.2.6', '7.3.1', '7.3.2',
];

type R = RatingValue;
const A: R = 'Achieving';
const P: R = 'Progressing';
const G: R = 'Getting Started';

function buildIndicatorValues(ratings: R[]): Record<string, RatingValue> {
  const values: Record<string, RatingValue> = {};
  // Initialize all indicators as null
  for (const id of getAllIndicatorIds()) {
    values[id] = null;
  }
  // Fill in from ratings array
  ratings.forEach((rating, idx) => {
    if (idx < indicatorOrder.length) {
      values[indicatorOrder[idx]] = rating;
    }
  });
  return values;
}

function calcCompletion(values: Record<string, RatingValue>): number {
  const total = Object.keys(values).length;
  if (total === 0) return 0;
  const filled = Object.values(values).filter(v => v !== null).length;
  return Math.round((filled / total) * 100);
}

// Actual data from CSV: COURAGE (A) Mid-Year 2025
const studentData: { sid: string; name: string; ratings: R[]; comments: string }[] = [
  {
    sid: 's1', name: 'Ayhan',
    ratings: [A,A,P,P,P,P,A,P,P, P,P,A,P,A,P, P,P,P,P, A,A, A,P,A,P,P, A,A,A,A,A,A,A,A,P,A, P,P,A,A,P,A,P, A,A,A,A,A,A,P,P,P,P],
    comments: 'Ayhan is confident in working with his friends to complete group tasks. He displays good reading skills and displays his curiosity by asking questions to understand how things work.',
  },
  {
    sid: 's2', name: 'Ayna',
    ratings: [A,A,P,P,P,P,A,P,A, P,P,A,P,A,P, P,P,P,P, A,A, A,P,A,P,P, P,A,A,A,P,P,P,P,P,P, P,P,P,P,P,G,P, P,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Ayna displays her curiosity by asking questions to find out more about how things work. She displays confidence as she works together with her group to complete tasks.',
  },
  {
    sid: 's3', name: 'Elana',
    ratings: [A,A,A,P,P,P,A,P,A, P,A,A,P,A,P, P,P,P,P, A,A, A,P,P,P,P, A,A,A,A,A,A,A,A,A,A, P,P,P,A,A,A,A, P,A,A,A,A,A,A,A,A,P,P,P],
    comments: 'Elana displays her curiosity by asking questions to find out more about how things work. She displays confidence as she works together with her group to complete tasks.',
  },
  {
    sid: 's4', name: 'Dhani',
    ratings: [P,A,P,P,P,P,A,P,A, P,P,A,P,P,P, P,P,P,P, P,A, A,P,A,P,P, P,A,A,A,P,A,A,P,A,P, G,P,P,G,G,P,P, A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Dhani is an active boy who enjoys engaging in outdoor activities with his peers. During group tasks, he displays confidence in communicating his ideas with his friends.',
  },
  {
    sid: 's5', name: 'Harper',
    ratings: [P,P,P,P,P,P,A,P,P, P,P,A,P,P,P, P,P,P,P, P,P, P,P,P,P,P, P,P,A,A,P,P,P,P,P,P, P,P,P,P,A,A,P, P,P,P,P,P,P,P,P,P,P,P,P],
    comments: 'Harper enjoys listening to stories and participating in pretend play activities during learning centre time. She enjoys doing art and craft with her peers.',
  },
  {
    sid: 's6', name: 'Ilhan',
    ratings: [P,A,P,P,P,P,A,P,A, P,P,A,P,P,P, P,P,P,P, P,A, A,P,A,P,P, P,A,A,A,P,P,P,P,P,P, P,P,P,A,P,P,P, P,A,A,A,P,P,P,A,P,P,P,P],
    comments: 'Ilhan is an active boy who enjoys engaging in outdoor activities with his peers. During group tasks, he displays confidence in communicating his ideas with his friends.',
  },
  {
    sid: 's7', name: 'Isabelle',
    ratings: [P,A,P,P,P,P,A,P,A, P,P,A,P,A,P, P,P,P,P, P,A, A,P,A,P,P, P,A,A,A,P,A,P,P,P,P, P,P,P,A,P,P,P, P,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Isabelle enjoys listening to stories and participating in pretend play activities during learning centre time. She enjoys working with her peers to complete group tasks together.',
  },
  {
    sid: 's8', name: 'Laiq',
    ratings: [P,A,P,P,P,P,A,P,A, P,P,A,P,P,P, P,P,P,P, P,A, A,P,A,P,P, P,A,P,P,P,A,A,P,P,P, G,P,G,G,G,P,P, A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Laiq enjoys listening to stories and participating in pretend play activities during learning centre time. He enjoys working with his peers to complete group tasks together.',
  },
  {
    sid: 's9', name: 'Dalton',
    ratings: [P,A,P,P,P,P,A,P,P, P,P,P,P,A,P, P,P,P,P, A,A, A,P,A,P,P, P,A,A,A,P,A,A,P,P,P, P,P,P,A,P,P,P, P,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Dalton is an active boy who enjoys engaging in outdoor activities with his peers. During group tasks, he displays confidence in communicating his ideas with his friends.',
  },
  {
    sid: 's10', name: 'Uzair',
    ratings: [P,A,P,P,P,P,A,P,A, P,P,A,P,A,P, P,P,P,P, A,A, A,P,A,P,P, P,A,A,A,P,P,P,P,P,P, P,A,A,A,A,A,P, P,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Uzair enjoys listening to stories and participating in pretend play activities during learning centre time. He enjoys working with his peers to complete group tasks together.',
  },
  {
    sid: 's11', name: 'Zaafir',
    ratings: [P,A,P,P,P,P,A,P,A, P,P,A,P,A,P, P,P,P,P, P,A, A,P,A,P,P, P,A,A,A,P,P,P,P,P,P, P,A,A,A,A,A,G, P,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Zaafir is an active boy who enjoys engaging in outdoor activities with his peers. During group tasks, he displays confidence in communicating his ideas with his friends.',
  },
  {
    sid: 's12', name: 'Nayra',
    ratings: [A,A,P,P,P,P,A,P,A, P,A,A,P,A,P, P,P,P,P, A,A, A,P,P,P,P, P,A,A,A,P,A,A,P,A,P, G,P,P,G,G,P,P, A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Nayra displays her curiosity by asking questions to find out more about how things work. She displays confidence as she works together with her group to complete tasks.',
  },
  {
    sid: 's13', name: 'Nuramili',
    ratings: [A,A,P,P,P,P,A,P,A, P,A,A,P,A,P, P,P,P,P, A,A, A,P,A,P,P, P,A,A,A,P,A,A,P,A,P, P,P,P,A,P,P,A, P,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Nuramili displays her curiosity by asking questions to find out more about how things work. She displays confidence as she works together with her group to complete tasks.',
  },
  {
    sid: 's14', name: 'Shasmeen',
    ratings: [A,A,P,P,P,P,A,P,A, P,P,A,P,A,P, P,P,P,P, A,A, A,P,A,P,P, P,A,A,A,P,A,A,P,A,P, G,P,P,G,G,P,P, A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Shasmeen engages in creating art and craft for her friends and family during learning centre time. She is able to work with her groupmates to complete tasks together.',
  },
  {
    sid: 's15', name: 'Shreya',
    ratings: [P,A,P,P,P,P,A,P,A, P,P,A,P,A,P, P,P,P,P, P,A, A,P,A,P,P, P,A,A,A,P,A,P,P,A,P, A,A,P,P,P,P,P, A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Shreya displays her curiosity by asking questions to find out more about how things work. She displays confidence as she works together with her group to complete tasks.',
  },
  {
    sid: 's16', name: 'Rana',
    ratings: [P,A,P,P,P,P,P,P,P, P,P,P,P,P,P, P,P,P,P, P,A, A,P,A,P,P, P,P,P,P,P,P,P,P,P,P, A,P,P,G,G,G,P, A,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Rana is an active boy who enjoys engaging in outdoor activities. He displays his curiosity by asking questions about why and how things work.',
  },
  {
    sid: 's17', name: 'Zion',
    ratings: [P,A,A,P,P,P,A,P,A, P,P,A,P,P,P, P,P,P,P, P,A, A,P,P,P,P, P,A,P,P,P,A,A,P,A,A, P,P,P,G,G,G,P, A,A,A,A,A,A,A,P,P,P,P],
    comments: 'Zion enjoys engaging in outdoor activities with his peers. During group tasks, he actively communicates his ideas with his friends to complete tasks.',
  },
  {
    sid: 's18', name: 'Xaelyn',
    ratings: [P,A,P,P,P,P,A,P,A, P,A,A,P,A,P, P,P,P,P, A,A, A,P,A,P,P, P,A,A,A,P,A,A,P,P,P, P,P,P,A,A,P,P, P,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Xaelyn enjoys participating in outdoor activities with her peers. During learning centre time, she engages in creating art and craft for her friends and family.',
  },
  {
    sid: 's19', name: 'Dolcie',
    ratings: [A,A,A,P,P,P,A,P,A, P,A,A,P,A,P, P,P,P,P, A,A, A,P,A,P,P, A,A,A,A,A,A,A,A,A,A, A,P,A,A,A,P,A, P,A,A,A,A,A,A,A,A,P,P,P],
    comments: 'Dolcie is confident in leading her friends to complete group tasks. She displays good reading skills and displays her curiosity by asking questions to understand how things work.',
  },
  {
    sid: 's20', name: 'Dylan',
    ratings: [P,A,P,P,P,P,A,P,A, P,P,A,P,A,P, P,P,P,P, A,A, A,P,A,P,P, P,A,A,A,P,A,P,P,P,P, P,P,P,A,A,P,P, P,A,A,A,A,P,P,A,P,P,P,P],
    comments: 'Dylan is an active boy who enjoys engaging in outdoor activities with his peers. During group tasks, he displays confidence in communicating his ideas with his friends.',
  },
];

// Students from demo screenshots (BRAVERY class)
const braveryStudentData: { sid: string; name: string; comments: string }[] = [
  { sid: 's21', name: 'Evelyn Wilson', comments: 'Evelyn is a cheerful girl who enjoys learning new things.' },
  { sid: 's22', name: 'Jane Oneil', comments: 'Jane is inconsistent in her focus.' },
  { sid: 's23', name: 'Sofia Tye', comments: 'Sofia shows strong interest in reading and creative arts.' },
  { sid: 's24', name: 'Winston Martin', comments: '' },
];

// Inherit indicator values from a previous assessment with slight progress
function inheritWithProgress(myValues: Record<string, RatingValue>): Record<string, RatingValue> {
  const eoyValues: Record<string, RatingValue> = {};
  for (const [id, val] of Object.entries(myValues)) {
    // ~20% chance a Progressing bumps to Achieving, ~30% chance GS bumps to Progressing
    const r = Math.random();
    if (val === 'Progressing' && r < 0.2) {
      eoyValues[id] = 'Achieving';
    } else if (val === 'Getting Started' && r < 0.3) {
      eoyValues[id] = 'Progressing';
    } else {
      eoyValues[id] = val;
    }
  }
  return eoyValues;
}

// Build assessments
function buildAssessments(): Assessment[] {
  const assessments: Assessment[] = [];

  // COURAGE (A) - Mid-Year 2025 - All approved (main data)
  studentData.forEach((sd, idx) => {
    const values = buildIndicatorValues(sd.ratings);
    const status = 'Approved' as const;

    assessments.push({
      id: `a-my-${sd.sid}`,
      studentId: sd.sid,
      studentName: sd.name,
      period: 'Mid-Year',
      year: 2025,
      classId: 'cl1',
      className: 'K2 COURAGE (A)',
      centreId: 'c1',
      centreName: 'MOE K @ PASIR PANJANG',
      status,
      ownerId: 'u1',
      ownerName: 'Sarah Chen',
      reviewerId: 'u3',
      reviewerName: 'Andrew Yap',
      indicatorValues: values,
      overallComments: sd.comments,
      mtComments: '',
      annotation: '',
      createdAt: '2025-03-15T08:00:00Z',
      updatedAt: '2025-06-20T14:30:00Z',
      submittedAt: '2025-06-18T10:00:00Z',
      reviewedAt: '2025-06-19T09:00:00Z',
      approvedAt: '2025-06-20T14:30:00Z',
      reviewComments: [],
      completionPercentage: calcCompletion(values),
    });
  });

  // COURAGE (A) - End-Year 2025 - Mix of Draft and Submitted (inherits from Mid-Year)
  studentData.forEach((sd, idx) => {
    const myValues = buildIndicatorValues(sd.ratings);
    const eoyValues = inheritWithProgress(myValues);
    const eoyStatus = idx < 8 ? 'Submitted' as const : 'Draft' as const;

    assessments.push({
      id: `a-ey-${sd.sid}`,
      studentId: sd.sid,
      studentName: sd.name,
      period: 'End-Year',
      year: 2025,
      classId: 'cl1',
      className: 'K2 COURAGE (A)',
      centreId: 'c1',
      centreName: 'MOE K @ PASIR PANJANG',
      status: eoyStatus,
      ownerId: 'u1',
      ownerName: 'Sarah Chen',
      indicatorValues: eoyValues,
      overallComments: '',
      mtComments: '',
      annotation: '',
      createdAt: '2025-09-15T08:00:00Z',
      updatedAt: eoyStatus === 'Submitted' ? '2025-10-20T10:00:00Z' : '2025-09-15T08:00:00Z',
      submittedAt: eoyStatus === 'Submitted' ? '2025-10-20T10:00:00Z' : undefined,
      reviewComments: [],
      completionPercentage: calcCompletion(eoyValues),
    });
  });

  // BRAVERY (B) - Mid-Year 2025 - Mixed statuses
  const braveryMyValues: Record<string, RatingValue>[] = [];
  braveryStudentData.forEach((sd, idx) => {
    const allIds = getAllIndicatorIds();
    const values: Record<string, RatingValue> = {};
    allIds.forEach(id => {
      // Generate semi-random but realistic ratings
      const r = Math.random();
      values[id] = idx === 3 ? null : // Winston has incomplete assessment
                   r < 0.15 ? 'Getting Started' :
                   r < 0.55 ? 'Progressing' : 'Achieving';
    });
    braveryMyValues.push(values);

    const status = 'Approved' as const;

    assessments.push({
      id: `a-my-${sd.sid}`,
      studentId: sd.sid,
      studentName: sd.name,
      period: 'Mid-Year',
      year: 2025,
      classId: 'cl2',
      className: 'K2 BRAVERY (B)',
      centreId: 'c1',
      centreName: 'MOE K @ PASIR PANJANG',
      status,
      ownerId: 'u1',
      ownerName: 'Sarah Chen',
      reviewerId: 'u3',
      reviewerName: 'Andrew Yap',
      indicatorValues: values,
      overallComments: sd.comments,
      mtComments: '',
      annotation: '',
      createdAt: '2025-03-15T08:00:00Z',
      updatedAt: '2025-06-15T11:00:00Z',
      submittedAt: '2025-06-14T10:00:00Z',
      approvedAt: '2025-06-15T11:00:00Z',
      reviewComments: idx === 1 ? [{
        id: 'rc1',
        authorId: 'u3',
        authorName: 'Andrew Yap',
        text: 'Please review the MTL indicators - some seem inconsistent with classroom observations.',
        createdAt: '2025-06-14T15:00:00Z',
      }] : [],
      completionPercentage: calcCompletion(values),
    });
  });

  // BRAVERY (B) - End-Year 2025 - Mix of Draft and Submitted (inherits from Mid-Year)
  braveryStudentData.forEach((sd, idx) => {
    const eoyValues = inheritWithProgress(braveryMyValues[idx]);
    const eoyStatus = idx < 2 ? 'Submitted' as const : 'Draft' as const;

    assessments.push({
      id: `a-ey-${sd.sid}`,
      studentId: sd.sid,
      studentName: sd.name,
      period: 'End-Year',
      year: 2025,
      classId: 'cl2',
      className: 'K2 BRAVERY (B)',
      centreId: 'c1',
      centreName: 'MOE K @ PASIR PANJANG',
      status: eoyStatus,
      ownerId: 'u1',
      ownerName: 'Sarah Chen',
      indicatorValues: eoyValues,
      overallComments: '',
      mtComments: '',
      annotation: '',
      createdAt: '2025-09-15T08:00:00Z',
      updatedAt: eoyStatus === 'Submitted' ? '2025-10-20T10:00:00Z' : '2025-09-15T08:00:00Z',
      submittedAt: eoyStatus === 'Submitted' ? '2025-10-20T10:00:00Z' : undefined,
      reviewComments: [],
      completionPercentage: calcCompletion(eoyValues),
    });
  });

  // Punggol Coast - Mid-Year 2025 (for cross-MK views)
  const punggolNames = ['Arjun Krishnan', 'Li Mei Xuan'];
  const punggolMyValues: Record<string, RatingValue>[] = [];
  ['s25', 's26'].forEach((sid, idx) => {
    const allIds = getAllIndicatorIds();
    const values: Record<string, RatingValue> = {};
    allIds.forEach(id => {
      const r = Math.random();
      values[id] = r < 0.1 ? 'Getting Started' : r < 0.45 ? 'Progressing' : 'Achieving';
    });
    punggolMyValues.push(values);

    assessments.push({
      id: `a-my-${sid}`,
      studentId: sid,
      studentName: punggolNames[idx],
      period: 'Mid-Year',
      year: 2025,
      classId: 'cl4',
      className: 'K2 INTEGRITY (A)',
      centreId: 'c2',
      centreName: 'MOE K @ PUNGGOL COAST',
      status: 'Approved',
      ownerId: 'u1',
      ownerName: 'Teacher',
      indicatorValues: values,
      overallComments: 'Student is making good progress across all learning areas.',
      mtComments: '',
      annotation: '',
      createdAt: '2025-03-15T08:00:00Z',
      updatedAt: '2025-06-20T14:30:00Z',
      submittedAt: '2025-06-18T10:00:00Z',
      approvedAt: '2025-06-20T14:30:00Z',
      reviewComments: [],
      completionPercentage: calcCompletion(values),
    });
  });

  // Punggol Coast - End-Year 2025 - Mix of Draft and Submitted (inherits from Mid-Year)
  ['s25', 's26'].forEach((sid, idx) => {
    const eoyValues = inheritWithProgress(punggolMyValues[idx]);
    const eoyStatus = idx < 1 ? 'Submitted' as const : 'Draft' as const;

    assessments.push({
      id: `a-ey-${sid}`,
      studentId: sid,
      studentName: punggolNames[idx],
      period: 'End-Year',
      year: 2025,
      classId: 'cl4',
      className: 'K2 INTEGRITY (A)',
      centreId: 'c2',
      centreName: 'MOE K @ PUNGGOL COAST',
      status: eoyStatus,
      ownerId: 'u1',
      ownerName: 'Teacher',
      indicatorValues: eoyValues,
      overallComments: '',
      mtComments: '',
      annotation: '',
      createdAt: '2025-09-15T08:00:00Z',
      updatedAt: eoyStatus === 'Submitted' ? '2025-10-20T10:00:00Z' : '2025-09-15T08:00:00Z',
      submittedAt: eoyStatus === 'Submitted' ? '2025-10-20T10:00:00Z' : undefined,
      reviewComments: [],
      completionPercentage: calcCompletion(eoyValues),
    });
  });

  return assessments;
}

export const initialAssessments: Assessment[] = buildAssessments();

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: "Complete Zion's Mid-Year Assessment",
    status: 'Not Started',
    priority: 'High',
    dueDate: '2025-06-25',
    relatedTo: 'Zion - Mid Year Assessment 2025',
    relatedType: 'Assessment',
    assignedTo: 'u1',
  },
  {
    id: 't2',
    title: "Review Dylan's Mid-Year Assessment",
    status: 'Not Started',
    priority: 'High',
    dueDate: '2025-06-26',
    relatedTo: 'Dylan - Mid Year Assessment 2025',
    relatedType: 'Assessment',
    assignedTo: 'u3',
  },
  {
    id: 't3',
    title: "Call Ayhan's Parents",
    status: 'In Progress',
    priority: 'Normal',
    dueDate: '2025-06-27',
    relatedTo: 'Ayhan',
    relatedType: 'Student',
    assignedTo: 'u1',
  },
  {
    id: 't4',
    title: 'Generate Mid-Year PI Reports for COURAGE (A)',
    status: 'Not Started',
    priority: 'Normal',
    dueDate: '2025-06-30',
    relatedTo: 'COURAGE (A)',
    relatedType: 'Report',
    assignedTo: 'u4',
  },
  {
    id: 't5',
    title: "Review Winston Martin's incomplete assessment",
    status: 'Not Started',
    priority: 'High',
    dueDate: '2025-06-24',
    relatedTo: 'Winston Martin - Mid Year Assessment 2025',
    relatedType: 'Assessment',
    assignedTo: 'u1',
  },
];

// Mock Events
export const mockEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Mid-Year Assessment Submission Deadline',
    startDate: '2025-06-28',
    endDate: '2025-06-28',
    type: 'Deadline',
  },
  {
    id: 'e3',
    title: 'End-Year Assessment Period Begins',
    startDate: '2025-10-01',
    endDate: '2025-10-01',
    type: 'Reminder',
  },
  {
    id: 'e4',
    title: 'K2 COURAGE (A) Review Meeting',
    startDate: '2025-06-30',
    endDate: '2025-06-30',
    type: 'Meeting',
  },
];
