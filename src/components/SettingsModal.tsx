import React, { useState } from 'react';
import { Modal } from './ui/Modal';

interface SettingsModalProps {
  onClose: () => void;
  showToast: (msg: string) => void;
}

const MODES = [
  { id: 'shade', label: 'Most shade' },
  { id: 'safe-night', label: 'SafeNight' },
  { id: 'barrier-free', label: 'Step-free' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, showToast }) => {
  const [defaultMode, setDefaultMode] = useState('shade');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [soundAnnouncements, setSoundAnnouncements] = useState(true);
  const [circadianNight, setCircadianNight] = useState(true);

  const handleSave = () => {
    showToast('Settings saved.');
    onClose();
  };

  return (
    <Modal
      title="Settings"
      description="Route defaults, units and audio."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-quiet">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn btn-primary">
            Save settings
          </button>
        </>
      }
    >
      <div className="flex flex-col divide-y divide-rule -my-1">
        <fieldset className="py-4">
          <legend className="text-[15px] font-semibold">Route me for</legend>
          <div className="seg mt-2.5" role="group">
            {MODES.map((m) => (
              <button key={m.id} type="button" aria-pressed={defaultMode === m.id} onClick={() => setDefaultMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="py-4 flex items-center justify-between gap-4">
          <div>
            <legend className="text-[15px] font-semibold">Temperature</legend>
            <p className="text-[14px] text-ink-2">For sensors and route heat relief.</p>
          </div>
          <div className="seg" role="group">
            <button type="button" aria-pressed={tempUnit === 'C'} onClick={() => setTempUnit('C')}>
              °C
            </button>
            <button type="button" aria-pressed={tempUnit === 'F'} onClick={() => setTempUnit('F')}>
              °F
            </button>
          </div>
        </fieldset>

        <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
          <span>
            <span className="block text-[15px] font-semibold">Low-glare night map</span>
            <span className="block text-[14px] text-ink-2">Warm amber lighting to cut light pollution.</span>
          </span>
          <input
            type="checkbox"
            checked={circadianNight}
            onChange={(e) => setCircadianNight(e.target.checked)}
            className="w-5 h-5 accent-ink"
          />
        </label>

        <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
          <span>
            <span className="block text-[15px] font-semibold">Spoken directions</span>
            <span className="block text-[14px] text-ink-2">Announces mist zones and ramps as you approach.</span>
          </span>
          <input
            type="checkbox"
            checked={soundAnnouncements}
            onChange={(e) => setSoundAnnouncements(e.target.checked)}
            className="w-5 h-5 accent-ink"
          />
        </label>
      </div>
    </Modal>
  );
};
