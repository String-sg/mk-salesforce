'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, User } from '../data/types';
import { mockUsers } from '../data/users';

interface RoleContextType {
  currentRole: UserRole;
  currentUser: User;
  setRole: (role: UserRole) => void;
  allUsers: User[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

function getUserForRole(role: UserRole): User {
  return mockUsers.find(u => u.role === role) || mockUsers[0];
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher_el');
  const [currentUser, setCurrentUser] = useState<User>(getUserForRole('teacher_el'));

  // Persist role in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mkpi-role');
    if (saved && ['teacher_el', 'teacher_mt', 'kah', 'centre_head', 'peb'].includes(saved)) {
      setCurrentRole(saved as UserRole);
      setCurrentUser(getUserForRole(saved as UserRole));
    }
  }, []);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(getUserForRole(role));
    localStorage.setItem('mkpi-role', role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, currentUser, setRole, allUsers: mockUsers }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
}
