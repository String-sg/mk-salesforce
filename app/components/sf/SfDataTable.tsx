'use client';

import React, { useState } from 'react';
import SfIcon from './SfIcon';

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface SfDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
  stickyHeader?: boolean;
}

export default function SfDataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  onRowClick,
  className = '',
  emptyMessage = 'No records to display.',
  stickyHeader = false,
}: SfDataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = String(a[sortKey] ?? '');
        const bVal = String(b[sortKey] ?? '');
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      })
    : data;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className={`border-b-2 border-[var(--sf-border)] ${stickyHeader ? 'sticky top-0 bg-white z-10' : ''}`}>
            {columns.map(col => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`px-4 py-2 text-left text-xs font-bold text-[var(--sf-text-secondary)] uppercase tracking-wide ${
                  col.sortable ? 'cursor-pointer hover:text-[var(--sf-text-primary)]' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <SfIcon name={sortDir === 'asc' ? 'chevron-down' : 'chevron-right'} size={12} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[var(--sf-text-muted)]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((item, idx) => (
              <tr
                key={String(item[keyField]) || idx}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-[var(--sf-border)] transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-[var(--sf-info-light)]' : 'hover:bg-gray-50'
                }`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-2.5 text-[13px] text-[var(--sf-text-primary)]">
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
