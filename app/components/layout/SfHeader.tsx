'use client';

import React from 'react';
import SfIcon from '../sf/SfIcon';
import RoleSwitcher from './RoleSwitcher';

export default function SfHeader() {
  return (
    <header className="h-[44px] bg-[var(--sf-header-bg)] flex items-center justify-between px-4 flex-shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Salesforce waffle/app launcher icon */}
        <button className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer">
          <SfIcon name="grid" size={20} className="text-white" />
        </button>
        {/* App identity - MOE Kindergarten logo */}
        <div className="flex items-center gap-1.5">
          {/* Kite icon */}
          <svg viewBox="0 0 32 40" width="18" height="22" className="flex-shrink-0">
            <polygon points="16,0 28,16 16,28 4,16" fill="#9B3A8D" />
            <polygon points="16,0 28,16 16,16" fill="#F5A623" />
            <polygon points="16,0 4,16 16,16" fill="#00B3A4" />
            <polygon points="16,16 28,16 16,28" fill="#00B3A4" />
            <polygon points="16,16 4,16 16,28" fill="#F5A623" />
            <path d="M16,28 Q20,32 18,36 Q22,33 24,36" fill="none" stroke="#00B3A4" strokeWidth="1.5" />
            <path d="M16,28 Q12,33 14,36 Q10,33 8,36" fill="none" stroke="#9B3A8D" strokeWidth="1.5" />
          </svg>
          {/* MOE text */}
          <div className="flex items-baseline gap-0">
            <span className="text-[15px] font-bold tracking-wide">
              <span style={{ color: '#9B3A8D' }}>m</span>
              <span style={{ color: '#00B3A4' }}>o</span>
              <span style={{ color: '#F5A623' }}>e</span>
            </span>
            <span className="text-[9px] font-semibold text-white/90 tracking-[0.15em] ml-1.5 uppercase">Kindergarten</span>
          </div>
        </div>
      </div>

      {/* Center section - Global Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <SfIcon name="search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:bg-white/15 focus:border-white/40"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors cursor-pointer relative">
          <SfIcon name="bell" size={18} className="text-white" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[var(--sf-error)] rounded-full"></span>
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors cursor-pointer">
          <SfIcon name="help" size={18} className="text-white" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors cursor-pointer">
          <SfIcon name="settings" size={18} className="text-white" />
        </button>
        <div className="w-px h-6 bg-white/20 mx-1"></div>
        <RoleSwitcher />
      </div>
    </header>
  );
}
