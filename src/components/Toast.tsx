import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-6 z-50 bg-[#283044] text-[#eef0ff] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 font-sans text-xs animate-in slide-in-from-top-2 fade-in duration-200 border border-white/10">
      <span className="material-symbols-outlined text-[#6ffbbe] text-[20px]">check_circle</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};
