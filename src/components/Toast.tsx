import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="rise-in fixed z-[70] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm bg-ink text-paper px-4 py-3 rounded-sm border-l-4 border-canopy shadow-lg text-[14px] leading-snug"
    >
      {message}
    </div>
  );
};
