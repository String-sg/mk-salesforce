'use client';

import React, { useState } from 'react';
import SfIcon from './SfIcon';

interface SfSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  compact?: boolean;
}

export default function SfSearch({ placeholder = 'Search...', onSearch, className = '', compact = false }: SfSearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <SfIcon
        name="search"
        size={16}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--sf-text-muted)]"
      />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full pl-8 pr-3 ${compact ? 'py-1 text-xs' : 'py-1.5 text-[13px]'} border border-[var(--sf-border-dark)] rounded bg-white text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] focus:outline-none focus:border-[var(--sf-blue)] focus:shadow-[0_0_0_1px_var(--sf-blue)]`}
      />
    </div>
  );
}
