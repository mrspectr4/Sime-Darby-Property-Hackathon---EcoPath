import React from 'react';

export interface ReadingItem {
  label: string;
  value: string;
  /** Smaller unit shown after the value, e.g. "kW". */
  unit?: string;
  note?: string;
  /** Colour class for the value, e.g. "text-canopy". Defaults to ink. */
  tone?: string;
}

interface ReadingsProps {
  items: ReadingItem[];
  className?: string;
}

/**
 * A row of headline figures separated by rules. Replaces a grid of
 * identical cards: the figures are the content, so they get the space.
 */
export const Readings: React.FC<ReadingsProps> = ({ items, className = '' }) => (
  <dl
    className={`grid grid-cols-2 border-b border-rule-strong ${
      items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'
    } ${className}`}
  >
    {items.map((item, i) => (
      <div
        key={item.label}
        className={`py-5 pr-5 ${i % 2 === 1 ? 'pl-5 border-l border-rule' : ''} ${
          i >= 2 ? 'border-t border-rule md:border-t-0' : ''
        } ${i > 0 ? 'md:pl-5 md:border-l md:border-rule' : ''}`}
      >
        <dt className="reading-label">{item.label}</dt>
        <dd className="mt-1.5">
          <span className={`figure text-[34px] sm:text-[40px] ${item.tone ?? 'text-ink'}`}>
            {item.value}
          </span>
          {item.unit && <span className="ml-1.5 text-[15px] text-ink-2">{item.unit}</span>}
          {item.note && <p className="mt-1.5 text-[14px] leading-snug text-ink-2">{item.note}</p>}
        </dd>
      </div>
    ))}
  </dl>
);
