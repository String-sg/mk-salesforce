'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SfIcon from '../sf/SfIcon';
import type { IconName } from '../sf/SfIcon';
import { useRole } from '../../hooks/useRole';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  roles?: string[];
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/home', icon: 'home' },
];

export default function SfNavBar() {
  const pathname = usePathname();
  const { currentRole } = useRole();

  const visibleItems = navItems.filter(item =>
    !item.roles || item.roles.includes(currentRole)
  );

  return (
    <nav className="h-[40px] bg-white border-b border-[var(--sf-border)] flex items-center px-4 flex-shrink-0 overflow-x-auto">
      {/* App name */}
      <div className="flex items-center h-full mr-2 pr-3 border-r border-[var(--sf-border)]">
        <span className="text-[13px] font-bold text-[var(--sf-text-primary)] whitespace-nowrap">Child Success</span>
      </div>
      {/* Navigation tabs */}
      <div className="flex items-center h-full gap-0">
        {visibleItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-1.5 px-4 h-full text-[13px] font-medium transition-colors relative whitespace-nowrap
                ${isActive
                  ? 'text-[var(--sf-blue)]'
                  : 'text-[var(--sf-text-secondary)] hover:text-[var(--sf-text-primary)] hover:bg-gray-50'
                }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--sf-blue)] rounded-t" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
