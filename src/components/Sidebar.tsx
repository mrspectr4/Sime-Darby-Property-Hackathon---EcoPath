import React from 'react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
  onOpenSettings
}) => {
  const navItems = [
    {
      id: 'township-map' as NavigationTab,
      label: 'Township Map',
      icon: 'map',
      badge: 'Live'
    },
    {
      id: 'climate-sensors' as NavigationTab,
      label: 'Climate & Sensors',
      icon: 'thermostat',
      badge: '128 Nodes'
    },
    {
      id: 'canopy-planner' as NavigationTab,
      label: 'Canopy Route Planner',
      icon: 'route',
      badge: '88% Shade'
    },
    {
      id: 'rewards' as NavigationTab,
      label: 'Eco-Steps Rewards',
      icon: 'award_star',
      badge: '1,420 pts'
    },
    {
      id: 'accessibility' as NavigationTab,
      label: 'Accessibility Radar',
      icon: 'accessible',
      badge: 'Zero-Step'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-7 w-72 bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border-r border-[#eaedff] z-40 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="px-2 pt-1 flex items-center justify-between">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#3d4a42] font-bold">
              Navigation Modules
            </span>
            <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left font-sans text-sm ${
                    isActive
                      ? 'bg-[#00855d] text-white font-bold shadow-[0_4px_12px_rgba(0,105,72,0.18)] translate-x-1'
                      : 'text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-[#006948]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#85f8c4]"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status & Settings Trigger */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#eaedff]">
          <div className="p-2.5 bg-[#f2f3ff] rounded-xl flex items-center justify-between border border-[#dae2fd]/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] animate-ping opacity-75"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] -ml-4.5"></span>
              <span className="font-sans text-xs text-[#3d4a42] font-medium">IoT Mesh Online</span>
            </div>
            <span className="font-sans text-xs text-[#006948] font-bold">128 Nodes</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl font-sans text-xs text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="font-medium">Settings & Preferences</span>
          </button>
        </div>
      </aside>
    </>
  );
};
