import React from 'react';
import { EducationalPin } from '../types';

interface EduModalProps {
  pin: EducationalPin | null;
  onClose: () => void;
}

export const EduModal: React.FC<EduModalProps> = ({ pin, onClose }) => {
  if (!pin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#dae2fd] transition-all transform animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="edu-modal-title"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6cf8bb]/30 flex items-center justify-center text-[#006948] shrink-0 border border-[#6cf8bb]/50">
              <span className="material-symbols-outlined text-[26px]">{pin.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[11px] uppercase font-bold text-[#006c49] tracking-wider">
                {pin.badge}
              </span>
              <h4 id="edu-modal-title" className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#131b2e] leading-snug">
                {pin.title}
              </h4>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-sans text-sm text-[#3d4a42] mt-3 leading-relaxed">
          {pin.body}
        </p>

        <div className="mt-5 pt-3 flex items-center justify-between bg-[#f2f3ff] px-4 py-3 rounded-2xl border border-[#dae2fd]/60">
          <span className="font-sans text-xs text-[#3d4a42] font-medium">EcoPath Benchmark</span>
          <span className="font-sans text-xs font-bold text-[#006948] bg-white px-2.5 py-1 rounded-full shadow-xs">
            {pin.stat}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-sans text-xs font-bold transition-colors shadow-sm"
          >
            Got it, continue exploring
          </button>
        </div>
      </div>
    </div>
  );
};
