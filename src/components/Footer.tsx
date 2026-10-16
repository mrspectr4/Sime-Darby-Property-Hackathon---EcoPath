import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-7 z-50 bg-[#e2e7ff]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between text-[#3d4a42] font-sans text-[11px] shadow-[0_-1px_6px_rgba(0,0,0,0.03)] border-t border-[#dae2fd]/60">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
          Telemetry: <strong className="text-[#006948]">Active</strong>
        </span>
        <span className="hidden sm:inline text-slate-400">•</span>
        <span className="hidden sm:inline font-medium">
          City of Elmina, Shah Alam (Selangor) • Zone 3 (Central Park & ERKC)
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden md:inline text-slate-400">Last Sync: Just now</span>
        <span className="font-semibold text-[#006948]">
          Sime Darby Property • GBI Platinum Resilient Grid
        </span>
      </div>
    </footer>
  );
};
