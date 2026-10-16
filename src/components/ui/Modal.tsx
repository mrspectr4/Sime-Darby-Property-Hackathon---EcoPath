import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  title: string;
  /** One line under the title. */
  description?: string;
  onClose: () => void;
  /** Tailwind max-width class for the panel. */
  widthClass?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Shared dialog shell: closes on Escape and on a click outside,
 * moves focus into the panel, and gives it a labelled dialog role.
 */
export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  onClose,
  widthClass = 'max-w-lg',
  children,
  footer
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-ink/55 p-0 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`rise-in w-full ${widthClass} max-h-[92vh] overflow-y-auto bg-paper border border-rule-strong sm:rounded-md shadow-2xl outline-none`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-rule">
          <div>
            <h2 id={titleId} className="text-[26px]">
              {title}
            </h2>
            {description && <p className="mt-1.5 text-[15px] text-ink-2">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="icon-btn -mr-2 -mt-1" aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4 border-t border-rule bg-ground/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
