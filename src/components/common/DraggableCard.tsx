import React, { useRef } from 'react';
import { motion } from 'motion/react';

interface DraggableCardProps {
  id?: string;
  title: string;
  icon?: string;
  badge?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
  minimizedContent?: React.ReactNode;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  icon,
  badge,
  isMinimized = false,
  onToggleMinimize,
  onClose,
  className = '',
  children,
  minimizedContent
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      drag
      dragMomentum={false}
      dragElastic={0.08}
      whileDrag={{ scale: 1.01, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      className={`bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#dae2fd] overflow-hidden pointer-events-auto transition-all select-none ${className}`}
    >
      {/* Draggable Header Bar with Grab Handle */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#f5fff7] via-white to-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing group">
        <div className="flex items-center gap-2 min-w-0">
          {/* Visual Grab Handle Dots */}
          <div className="flex flex-col gap-0.5 text-slate-400 group-hover:text-[#006948] transition-colors shrink-0">
            <span className="material-symbols-outlined text-[14px] leading-none">drag_indicator</span>
          </div>

          {icon && (
            <div className="w-6 h-6 rounded-lg bg-[#006948] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[14px]">{icon}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 truncate">
            <span className="font-headline font-bold text-xs text-[#131b2e] truncate">
              {title}
            </span>
            {badge && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#6cf8bb] text-[#002114] text-[9px] font-extrabold uppercase shrink-0">
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Window Controls: Minimize & Close */}
        <div className="flex items-center gap-1 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          {onToggleMinimize && (
            <button
              type="button"
              onClick={onToggleMinimize}
              className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors"
              title={isMinimized ? 'Expand panel' : 'Minimize to compact dock'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isMinimized ? 'unfold_more' : 'unfold_less'}
              </span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors"
              title="Hide panel"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Body: Full or Minimized */}
      {isMinimized ? (
        minimizedContent ? (
          <div className="p-2 text-xs">{minimizedContent}</div>
        ) : null
      ) : (
        <div className="overflow-hidden">{children}</div>
      )}
    </motion.div>
  );
};
