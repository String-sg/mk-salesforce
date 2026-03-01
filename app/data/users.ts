import type { User } from './types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    email: 'sarah.chen@moe.gov.sg',
    role: 'teacher_el',
    centreId: 'c1',
    classIds: ['cl1'],
    initials: 'SC',
  },
  {
    id: 'u2',
    name: 'Nur Aisyah',
    email: 'nur.aisyah@moe.gov.sg',
    role: 'teacher_mt',
    centreId: 'c1',
    classIds: ['cl1'],
    initials: 'NA',
  },
  {
    id: 'u3',
    name: 'Andrew Yap',
    email: 'andrew.yap@moe.gov.sg',
    role: 'kah',
    centreId: 'c1',
    classIds: ['cl1', 'cl2', 'cl3'],
    initials: 'AY',
  },
  {
    id: 'u4',
    name: 'Mrs Lim Wei Lin',
    email: 'lim.weilin@moe.gov.sg',
    role: 'centre_head',
    centreId: 'c1',
    classIds: ['cl1', 'cl2', 'cl3'],
    initials: 'LW',
  },
  {
    id: 'u5',
    name: 'Dr Tan Mei Ling',
    email: 'tan.meiling@moe.gov.sg',
    role: 'peb',
    centreId: '',
    classIds: [],
    initials: 'TM',
  },
];

export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

export function getUsersByRole(role: string): User[] {
  return mockUsers.filter(u => u.role === role);
}
