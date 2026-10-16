import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './ui/Icon';

interface HeaderProps {
  userPoints: number;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Cooling mist is running in Zone 4',
    desc: 'Walkways there are about 3.2°C cooler.',
    time: '2 min ago'
  },
  {
    id: 2,
    title: 'SafeNight lights are set for dusk',
    desc: 'All 84 lights will switch on at 19:30.',
    time: '14 min ago'
  },
  {
    id: 3,
    title: 'Residents passed 14,000 Eco-Steps today',
    desc: 'Thanks to everyone walking the shaded routes.',
    time: '1 h ago'
  }
];

export const Header: React.FC<HeaderProps> = ({
  userPoints,
  onOpenProfile,
  onToggleMobileNav,
  isMobileNavOpen
}) => {
  const [openMenu, setOpenMenu] = useState<'alerts' | 'profile' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 z-40 h-14 bg-paper border-b border-rule-strong">
      <div className="h-full px-3 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="icon-btn lg:hidden"
            aria-label={isMobileNavOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMobileNavOpen}
          >
            <Icon name={isMobileNavOpen ? 'close' : 'menu'} size={22} />
          </button>
          <span className="lg:hidden figure text-[22px]" style={{ fontStretch: '82%' }}>
            EcoPath
          </span>

          {/* Conditions right now. Label then value, no containers. */}
          <dl className="hidden md:flex items-baseline gap-x-7 text-[14px]">
            <div className="flex items-baseline gap-1.5">
              <dt className="text-ink-2">Air quality</dt>
              <dd className="num"><span className="font-semibold">20</span> <span className="text-ink-2">good</span></dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-ink-2">UV index</dt>
              <dd className="num"><span className="font-semibold">3.4</span> <span className="text-ink-2">moderate</span></dd>
            </div>
            <div className="hidden xl:flex items-baseline gap-1.5">
              <dt className="text-ink-2">Canopy cover</dt>
              <dd className="font-semibold text-canopy num">68.4%</dd>
            </div>
            <div className="hidden 2xl:flex items-baseline gap-1.5">
              <dt className="text-ink-2">Eco-Steps today</dt>
              <dd className="font-semibold text-ink num">14,280</dd>
            </div>
          </dl>
        </div>

        <div ref={menuRef} className="flex items-center gap-1 sm:gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'alerts' ? null : 'alerts')}
              className="icon-btn relative"
              aria-label="Climate alerts, 3 new"
              aria-expanded={openMenu === 'alerts'}
            >
              <Icon name="notifications" size={21} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-laterite ring-2 ring-paper" />
            </button>

            {openMenu === 'alerts' && (
              <div className="rise-in overlay absolute right-0 mt-2 w-[min(22rem,calc(100vw-1.5rem))] z-50">
                <h2 className="px-4 pt-3 pb-2 text-[18px]">Climate alerts</h2>
                <ul className="divide-y divide-rule border-t border-rule">
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[14px] font-semibold leading-snug">{n.title}</span>
                        <span className="shrink-0 text-[12px] text-ink-3">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-[14px] text-ink-2 leading-snug">{n.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}
              className="flex items-center gap-2.5 h-10 pl-1.5 pr-2 rounded-sm hover:bg-wash transition-colors"
              aria-expanded={openMenu === 'profile'}
              aria-label="Your profile"
            >
              <span className="w-8 h-8 rounded-sm bg-ink text-paper grid place-items-center text-[13px] font-semibold">
                DD
              </span>
              <span className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[14px] font-semibold">Danish D.</span>
                <span className="text-[12px] text-ink-2 num">{userPoints.toLocaleString()} pts</span>
              </span>
            </button>

            {openMenu === 'profile' && (
              <div className="rise-in overlay absolute right-0 mt-2 w-72 z-50">
                <div className="px-4 pt-4 pb-3">
                  <p className="font-display text-[20px] font-semibold" style={{ fontStretch: '82%' }}>
                    Danish Delwar
                  </p>
                  <p className="text-[14px] text-ink-2">Canopy Steward</p>
                </div>
                <dl className="grid grid-cols-2 border-y border-rule">
                  <div className="px-4 py-3">
                    <dt className="reading-label">Eco-Steps</dt>
                    <dd className="figure text-[24px] mt-1">{userPoints.toLocaleString()}</dd>
                  </div>
                  <div className="px-4 py-3 border-l border-rule">
                    <dt className="reading-label">CO₂ avoided</dt>
                    <dd className="figure text-[24px] mt-1">
                      14.2<span className="ml-1 text-[14px] text-ink-2 font-normal">kg</span>
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenu(null);
                    onOpenProfile?.();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-[14px] font-semibold hover:bg-wash"
                >
                  <span>Open rewards pass</span>
                  <Icon name="chevron_right" size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
