'use client';

import React, { useEffect } from 'react';
import SfIcon from './SfIcon';
import SfButton from './SfButton';

interface SfModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export default function SfModal({ isOpen, onClose, title, children, footer, size = 'medium' }: SfModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-[var(--sf-shadow-modal)] w-full ${sizeStyles[size]} mx-4 max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--sf-border)]">
          <h2 className="text-base font-bold text-[var(--sf-text-primary)]">{title}</h2>
          <SfButton variant="icon" onClick={onClose} title="Close">
            <SfIcon name="close" size={18} />
          </SfButton>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[var(--sf-border)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
