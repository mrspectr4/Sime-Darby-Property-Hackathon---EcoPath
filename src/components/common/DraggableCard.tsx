import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '../ui/Icon';

interface DraggableCardProps {
  id?: string;
  title: string;
  /** Short reading shown after the title, e.g. "1.8 km". */
  badge?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
  minimizedContent?: React.ReactNode;
}

/** A map panel the person can drag out of the way. The title bar is the handle. */
export const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  badge,
  isMinimized = false,
  onToggleMinimize,
  onClose,
  className = '',
  children,
  minimizedContent
}) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      className={`overlay overflow-hidden pointer-events-auto select-none ${className}`}
    >
      <div className="pl-3 pr-1 h-11 border-b border-rule flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2 min-w-0">
          <Icon name="drag_indicator" size={16} className="text-ink-3 shrink-0 -ml-1" />
          <h2 className="text-[17px] truncate">{title}</h2>
          {badge && <span className="text-[14px] text-ink-2 num shrink-0">{badge}</span>}
        </div>

        <div className="flex items-center shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          {onToggleMinimize && (
            <button
              type="button"
              onClick={onToggleMinimize}
              className="icon-btn !w-9 !h-9"
              aria-label={isMinimized ? 'Expand panel' : 'Collapse panel'}
            >
              <Icon name={isMinimized ? 'unfold_more' : 'unfold_less'} size={17} />
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className="icon-btn !w-9 !h-9" aria-label="Hide panel">
              <Icon name="close" size={17} />
            </button>
          )}
        </div>
      </div>

      {isMinimized ? (
        minimizedContent ? <div className="px-3 py-2 text-[14px]">{minimizedContent}</div> : null
      ) : (
        <div className="overflow-hidden">{children}</div>
      )}
    </motion.div>
  );
};
