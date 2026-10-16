import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  /** Controls aligned to the right of the title on wide screens. */
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => (
  <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pb-6 border-b border-rule-strong">
    <div className="max-w-[62ch]">
      <h1 className="text-[40px] sm:text-[48px]">{title}</h1>
      <p className="mt-3 text-[16px] text-ink-2 leading-relaxed">{description}</p>
    </div>
    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
  </header>
);
