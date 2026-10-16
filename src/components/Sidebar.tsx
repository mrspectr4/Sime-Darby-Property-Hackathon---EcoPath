import React from 'react';
import { NavigationTab } from '../types';
import { Icon } from './ui/Icon';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenSettings?: () => void;
  userPoints: number;
}

/** The wordmark: a tree canopy over a dashed path. */
const Mark: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
    <rect width="32" height="32" rx="4" fill="var(--color-ink)" />
    <path d="M5 16 Q16 3 27 16" fill="none" stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" />
    <path
      d="M5 25 H27"
      stroke="var(--color-canopy-tint)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="2 5"
    />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
  onOpenSettings,
  userPoints
}) => {
  const navItems: { id: NavigationTab; label: string; icon: string; note?: string }[] = [
    { id: 'township-map', label: 'Map', icon: 'map' },
    { id: 'climate-sensors', label: 'Climate', icon: 'thermostat', note: '128 sensors' },
    { id: 'canopy-planner', label: 'Route planner', icon: 'route' },
    { id: 'rewards', label: 'Rewards', icon: 'award_star', note: `${userPoints.toLocaleString()} pts` },
    { id: 'accessibility', label: 'Accessibility', icon: 'accessible' }
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 bg-ink/50 z-40"
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Main"
        className={`fixed left-0 top-0 bottom-0 w-60 bg-paper border-r border-rule-strong z-50 flex flex-col transition-transform duration-200 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 h-14 flex items-center gap-3 border-b border-rule">
          <Mark />
          <div className="leading-tight">
            <p className="figure text-[24px]" style={{ fontStretch: '82%' }}>
              EcoPath
            </p>
          </div>
        </div>

        <p className="px-5 pt-4 pb-2 text-[14px] text-ink-2 leading-snug">
          City of Elmina,
          <br />
          Shah Alam
        </p>

        <nav className="flex-1 px-2 py-2">
          <ul className="flex flex-col">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile?.();
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative w-full flex items-center gap-3 pl-4 pr-3 min-h-11 text-left text-[15px] transition-colors ${
                      isActive
                        ? 'bg-wash text-ink font-semibold'
                        : 'text-ink-2 hover:bg-wash/60 hover:text-ink'
                    }`}
                  >
                    {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-ink" />}
                    <Icon name={item.icon} size={19} className={isActive ? 'text-ink' : 'text-ink-3'} />
                    <span className="flex-1">{item.label}</span>
                    {item.note && <span className="text-[13px] text-ink-3 num font-normal">{item.note}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-2 pb-3 border-t border-rule pt-2">
          <button
            type="button"
            onClick={() => {
              onOpenSettings?.();
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-3 pl-4 pr-3 min-h-11 text-left text-[15px] text-ink-2 hover:bg-wash/60 hover:text-ink"
          >
            <Icon name="settings" size={19} className="text-ink-3" />
            <span>Settings</span>
          </button>
          <p className="px-4 pt-3 text-[13px] leading-snug text-ink-3">
            By Sime Darby Property.
            <br />
            GBI Platinum township.
          </p>
        </div>
      </aside>
    </>
  );
};
