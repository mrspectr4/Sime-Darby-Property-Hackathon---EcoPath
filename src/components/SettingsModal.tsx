import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, showToast }) => {
  const [defaultMode, setDefaultMode] = useState('shade');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [soundAnnouncements, setSoundAnnouncements] = useState(true);
  const [uvThreshold, setUvThreshold] = useState('moderate');
  const [circadianNight, setCircadianNight] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    showToast('Preferences saved successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="settings-title"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eaedff] text-[#131b2e] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </div>
            <div>
              <h3 id="settings-title" className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#131b2e]">
                Settings & Preferences
              </h3>
              <p className="font-sans text-xs text-[#3d4a42]">
                Configure navigation defaults, alerts, and accessibility modes.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          {/* Default Routing Mode */}
          <div>
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#3d4a42] font-bold block mb-1.5">
              Default Route Optimization
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDefaultMode('shade')}
                className={`py-2 px-3 rounded-xl font-semibold transition-all ${
                  defaultMode === 'shade'
                    ? 'bg-[#006948] text-white'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Max Shade
              </button>
              <button
                type="button"
                onClick={() => setDefaultMode('safe-night')}
                className={`py-2 px-3 rounded-xl font-semibold transition-all ${
                  defaultMode === 'safe-night'
                    ? 'bg-[#006948] text-white'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                SafeNight
              </button>
              <button
                type="button"
                onClick={() => setDefaultMode('barrier-free')}
                className={`py-2 px-3 rounded-xl font-semibold transition-all ${
                  defaultMode === 'barrier-free'
                    ? 'bg-[#006948] text-white'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Zero-Steps
              </button>
            </div>
          </div>

          {/* Temperature Unit */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
            <div>
              <span className="font-semibold text-[#131b2e] block">Temperature Units</span>
              <span className="text-[11px] text-[#3d4a42]">Used across sensor displays and route thermal metrics</span>
            </div>
            <div className="flex items-center bg-[#eaedff] p-0.5 rounded-lg font-bold">
              <button
                type="button"
                onClick={() => setTempUnit('C')}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  tempUnit === 'C' ? 'bg-white text-[#006948] shadow-xs' : 'text-[#3d4a42]'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setTempUnit('F')}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  tempUnit === 'F' ? 'bg-white text-[#006948] shadow-xs' : 'text-[#3d4a42]'
                }`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Circadian Night Lighting */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
            <div>
              <span className="font-semibold text-[#131b2e] block">Circadian Low-Glare Night Mode</span>
              <span className="text-[11px] text-[#3d4a42]">Soft warm amber luminescence to minimize light pollution</span>
            </div>
            <input
              type="checkbox"
              checked={circadianNight}
              onChange={(e) => setCircadianNight(e.target.checked)}
              className="w-4 h-4 accent-[#006948] cursor-pointer"
            />
          </div>

          {/* Audio Wayfinding Announcements */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
            <div>
              <span className="font-semibold text-[#131b2e] block">Spoken Audio Wayfinding</span>
              <span className="text-[11px] text-[#3d4a42]">Audio alerts when approaching mist zones or ramps</span>
            </div>
            <input
              type="checkbox"
              checked={soundAnnouncements}
              onChange={(e) => setSoundAnnouncements(e.target.checked)}
              className="w-4 h-4 accent-[#006948] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f2f3ff]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-sans text-xs font-semibold text-[#3d4a42] hover:bg-[#eaedff] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-sans text-xs font-bold shadow-md transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
