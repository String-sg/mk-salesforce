import type { MKCentre, ClassGroup } from './types';

export const mkCentres: MKCentre[] = [
  { id: 'c1', name: 'MK @ PASIR PANJANG', code: 'MKPP' },
  { id: 'c2', name: 'MK @ PUNGGOL COAST', code: 'MKPC' },
];

export const classGroups: ClassGroup[] = [
  // MK @ PASIR PANJANG
  { id: 'cl1', name: 'COURAGE (A)', level: 'K2', centreId: 'c1', teacherIds: ['u1', 'u2'], year: 2025 },
  { id: 'cl2', name: 'BRAVERY (B)', level: 'K2', centreId: 'c1', teacherIds: ['u1', 'u2'], year: 2025 },
  { id: 'cl3', name: 'KINDNESS (A)', level: 'K1', centreId: 'c1', teacherIds: ['u1', 'u2'], year: 2025 },
  // MK @ PUNGGOL COAST
  { id: 'cl4', name: 'INTEGRITY (A)', level: 'K2', centreId: 'c2', teacherIds: [], year: 2025 },
  { id: 'cl5', name: 'RESPECT (B)', level: 'K1', centreId: 'c2', teacherIds: [], year: 2025 },
];

export function getCentreById(id: string): MKCentre | undefined {
  return mkCentres.find(c => c.id === id);
}

export function getClassById(id: string): ClassGroup | undefined {
  return classGroups.find(c => c.id === id);
}

export function getClassesByCentre(centreId: string): ClassGroup[] {
  return classGroups.filter(c => c.centreId === centreId);
}

export function getClassDisplayName(classGroup: ClassGroup): string {
  const centre = getCentreById(classGroup.centreId);
  return `${centre?.name || 'Unknown'} - ${classGroup.level} ${classGroup.name}`;
}
