'use client';

import React, { useState, useRef, useEffect } from 'react';
import SfIcon from './SfIcon';

interface SfDropdownOption {
  value: string;
  label: string;
}

interface SfDropdownProps {
  options: SfDropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function SfDropdown({
  options,
  value,
  onChange,
  placeholder = '\u2014None\u2014',
  label,
  className = '',
  disabled = false,
}: SfDropdownProps) {
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

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[var(--sf-text-secondary)] mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-1.5 text-[13px] bg-white border rounded cursor-pointer transition-colors
          ${isOpen ? 'border-[var(--sf-blue)] shadow-[0_0_0_1px_var(--sf-blue)]' : 'border-[var(--sf-border-dark)]'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-[var(--sf-blue)]'}
          ${!value ? 'text-[var(--sf-text-muted)]' : 'text-[var(--sf-text-primary)]'}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <SfIcon name="chevron-down" size={14} className="flex-shrink-0 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--sf-border)] rounded shadow-[var(--sf-shadow-dropdown)] max-h-60 overflow-y-auto">
          <div
            onClick={() => { onChange(''); setIsOpen(false); }}
            className="px-3 py-2 text-[13px] text-[var(--sf-text-muted)] cursor-pointer hover:bg-[var(--sf-info-light)]"
          >
            {placeholder}
          </div>
          {options.map(option => (
            <div
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-[var(--sf-info-light)] ${
                value === option.value ? 'bg-[var(--sf-info-light)] text-[var(--sf-blue)] font-medium' : 'text-[var(--sf-text-primary)]'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
