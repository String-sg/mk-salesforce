'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRoleContext } from '../../context/RoleContext';
import type { UserRole } from '../../data/types';
import SfIcon from '../sf/SfIcon';

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'teacher_el', label: 'Teacher (EL)', description: 'English Language Teacher' },
  { value: 'teacher_mt', label: 'Teacher (MTL)', description: 'Mother Tongue Language Teacher' },
  { value: 'kah', label: 'Key Appointment Holder', description: 'KAH / Level Head' },
  { value: 'centre_head', label: 'Centre Head', description: 'MK Centre Head' },
  { value: 'peb', label: 'PEB (HQ)', description: 'Pre-school Education Branch' },
];

export default function RoleSwitcher() {
  const { currentRole, currentUser, setRole } = useRoleContext();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = roleOptions.find(r => r.value === currentRole);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
          {currentUser.initials}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-medium text-white leading-tight">{currentUser.name}</div>
          <div className="text-[10px] text-white/70 leading-tight">{currentOption?.label}</div>
        </div>
        <SfIcon name="chevron-down" size={12} className="text-white/70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-[var(--sf-border)] rounded-lg shadow-[var(--sf-shadow-dropdown)] z-[100]">
          <div className="px-3 py-2 border-b border-[var(--sf-border)]">
            <p className="text-xs font-bold text-[var(--sf-text-secondary)] uppercase tracking-wide">Switch Role</p>
          </div>
          <div className="py-1">
            {roleOptions.map(option => (
              <button
                key={option.value}
                onClick={() => { setRole(option.value); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2.5 cursor-pointer transition-colors ${
                  currentRole === option.value
                    ? 'bg-[var(--sf-info-light)] border-l-2 border-[var(--sf-blue)]'
                    : 'hover:bg-gray-50 border-l-2 border-transparent'
                }`}
              >
                <div className={`text-[13px] font-medium ${
                  currentRole === option.value ? 'text-[var(--sf-blue)]' : 'text-[var(--sf-text-primary)]'
                }`}>
                  {option.label}
                </div>
                <div className="text-[11px] text-[var(--sf-text-muted)]">{option.description}</div>
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-[var(--sf-border)] bg-gray-50 rounded-b-lg">
            <p className="text-[10px] text-[var(--sf-text-muted)]">
              Role switching is for prototype demonstration only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
