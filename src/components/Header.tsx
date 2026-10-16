import React, { useState } from 'react';

interface HeaderProps {
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onOpenFilter?: () => void;
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenProfile,
  onOpenFilter,
  onToggleMobileNav,
  isMobileNavOpen
}) => {
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const notifications = [
    { id: 1, title: 'Zone 4 Mist Actuators Active', desc: 'Pedestrian thermal relief cooling initiated (-3.2°C)', time: '2m ago', icon: 'cool_to_dry', color: 'text-secondary' },
    { id: 2, title: 'SafeNight Photocell Calibration', desc: 'All 84 adaptive LED arrays synced for 19:30 dusk transition', time: '14m ago', icon: 'lightbulb', color: 'text-tertiary-container' },
    { id: 3, title: 'Eco-Steps Daily Milestone', desc: 'Township citizens exceeded 14,000 steps today!', time: '1h ago', icon: 'award_star', color: 'text-primary' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onToggleMobileNav} 
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-[#eaedff] transition-colors"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileNavOpen ? 'close' : 'menu'}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <img 
              alt="EcoPath Logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1UA-DZRmFYdkp8RRQgfE8Ubn3rSm8Ze4ho5UdlCBveNNzyuDpqJuBWVzMK9hQ2tbQ1LygSGF6v5PzIZvurRIuhdpwVSJRyk9sKpRMNz38Jwf2VI9OXJBVYozedOGRafTtawT884BUT-xdMxDQV7Zgj94nA8-A1p-8AFWQxErx6ZRseUrMlofmYZOlzoYUVZFrDO9VxT09AOu5WIAfZx-RkiPldMtyjJGSsxkJbe8liKq6Oujh3DJ-NvVw" 
            />
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#006948] tracking-tight leading-tight">EcoPath</span>
              <span className="font-sans text-[10px] text-[#3d4a42] uppercase tracking-wider font-semibold">City of Elmina • Shah Alam</span>
            </div>
          </div>
        </div>

        {/* Environmental Micro-Telemetry HUD Bar */}
        <div className="hidden xl:flex items-center gap-4 bg-[#f2f3ff] px-4 py-1.5 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)] border border-[#dae2fd]/50">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006c49] text-[18px]">air</span>
            <span className="font-sans text-xs text-[#131b2e]">
              Selangor AQI: <strong className="text-[#006c49]">20 (Good)</strong>
            </span>
          </div>

          <div className="w-1 h-3 bg-[#bccac0]/40 rounded-full"></div>

          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a36700] text-[18px]">wb_sunny</span>
            <span className="font-sans text-xs text-[#131b2e]">
              UV: <strong className="text-[#131b2e]">Moderate (3.4)</strong>
            </span>
          </div>

          <div className="w-1 h-3 bg-[#bccac0]/40 rounded-full"></div>

          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006948] text-[18px]">park</span>
            <span className="font-sans text-xs text-[#131b2e]">
              Canopy Cover: <strong className="text-[#006948]">68.4% (300-Acre Park)</strong>
            </span>
          </div>

          <div className="w-1 h-3 bg-[#bccac0]/40 rounded-full"></div>

          <div className="flex items-center gap-1.5 bg-[#6cf8bb] px-2.5 py-0.5 rounded-full text-[#00714d] font-sans text-[11px] font-bold shadow-xs">
            <span className="material-symbols-outlined text-[14px]">directions_walk</span>
            <span>+14,280 Eco-Steps Today</span>
          </div>
        </div>

        {/* Top Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Button */}
          <div className="relative">
            <button 
              type="button" 
              onClick={() => {
                setShowNotificationDrawer(!showNotificationDrawer);
                setShowProfileDrawer(false);
              }}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] transition-colors"
              title="Civic & Sensor Alerts"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00855d] ring-2 ring-white"></span>
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationDrawer && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl p-4 shadow-2xl border border-[#dae2fd] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#f2f3ff]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006948] text-[20px]">notifications_active</span>
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#131b2e]">Civic Notifications</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#006948] bg-[#6cf8bb]/40 px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="flex flex-col gap-2.5 mt-3 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2.5 bg-[#faf8ff] hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer flex gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${n.color} shrink-0 mt-0.5`}>{n.icon}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#131b2e]">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#3d4a42] mt-0.5 leading-snug">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Filter / Tune Button */}
          <button 
            type="button" 
            onClick={onOpenFilter}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] transition-colors"
            title="Layer Filters & Display"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          {/* User Profile Capsule */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => {
                setShowProfileDrawer(!showProfileDrawer);
                setShowNotificationDrawer(false);
              }}
              className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-[#eaedff] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#006948] flex items-center justify-center text-white shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#131b2e] leading-tight">Danish D.</span>
                <span className="text-[10px] text-[#006948] font-semibold">Canopy Steward</span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileDrawer && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl p-4 shadow-2xl border border-[#dae2fd] z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-[#f2f3ff]">
                  <div className="w-10 h-10 rounded-full bg-[#006948] flex items-center justify-center text-white font-bold text-base">
                    DD
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#131b2e]">Danish Delwar</span>
                    <span className="text-xs text-[#006948] font-medium">Tier: Canopy Steward</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 py-2 bg-[#f2f3ff] rounded-xl text-center">
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-[#006948]">1,420</span>
                    <span className="text-[10px] text-[#3d4a42] font-medium">Eco-Points</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-[#006c49]">14.2 kg</span>
                    <span className="text-[10px] text-[#3d4a42] font-medium">CO₂ Avoided</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <button 
                    onClick={() => {
                      setShowProfileDrawer(false);
                      if (onOpenProfile) onOpenProfile();
                    }} 
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eaedff] text-[#131b2e] font-medium flex items-center justify-between"
                  >
                    <span>View Rewards Passport</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
