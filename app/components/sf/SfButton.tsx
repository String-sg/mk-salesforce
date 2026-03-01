'use client';

import React from 'react';

interface SfButtonProps {
  children: React.ReactNode;
  variant?: 'brand' | 'neutral' | 'destructive' | 'outline' | 'success' | 'icon';
  size?: 'small' | 'medium';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  title?: string;
}

const variantStyles: Record<string, string> = {
  brand: 'bg-[var(--sf-blue)] text-white hover:bg-[var(--sf-blue-dark)] border-[var(--sf-blue)]',
  neutral: 'bg-white text-[var(--sf-text-primary)] hover:bg-gray-50 border-[var(--sf-border-dark)]',
  destructive: 'bg-[var(--sf-error)] text-white hover:bg-red-700 border-[var(--sf-error)]',
  outline: 'bg-transparent text-[var(--sf-blue)] hover:bg-blue-50 border-[var(--sf-blue)]',
  success: 'bg-[var(--sf-success)] text-white hover:bg-green-700 border-[var(--sf-success)]',
  icon: 'bg-transparent text-[var(--sf-text-muted)] hover:bg-gray-100 border-transparent p-1',
};

export default function SfButton({
  children,
  variant = 'neutral',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  title,
}: SfButtonProps) {
  const sizeStyles = size === 'small' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-[13px]';
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 rounded font-normal border transition-colors duration-150 cursor-pointer whitespace-nowrap';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
