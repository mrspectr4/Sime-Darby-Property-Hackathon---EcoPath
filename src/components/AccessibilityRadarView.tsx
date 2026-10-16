import React, { useState } from 'react';
import { ELEVATORS_STATUS } from '../data/mockData';

interface AccessibilityRadarViewProps {
  showToast: (msg: string) => void;
}

export const AccessibilityRadarView: React.FC<AccessibilityRadarViewProps> = ({ showToast }) => {
  const [profileMode, setProfileMode] = useState<'wheelchair' | 'stroller' | 'vision'>('wheelchair');
  const [audioBeaconsActive, setAudioBeaconsActive] = useState(true);

  const handleTestAudioBeacon = () => {
    showToast('Elmina Beacon #08 (Rainbow Bridge Approach): "Approaching gentle arched ramp, incline 2.4%, clear biophilic promenade ahead."');
  };

  const handleBookBuggy = () => {
    showToast('Elmina Accessible Electric Buggy dispatched to Elmina Valley 3! Arriving in 4 minutes.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6cf8bb]/30 flex items-center justify-center text-[#006948] shrink-0 border border-[#6cf8bb]/50">
            <span className="material-symbols-outlined text-[28px]">accessible</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#131b2e]">
                Universal Accessibility Radar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#006948] text-[10px] font-bold border border-[#dae2fd]">
                City of Elmina • Wellness Township
              </span>
            </div>
            <p className="font-sans text-xs text-[#3d4a42] mt-0.5">
              Monitoring Malaysia's premier 90km barrier-free active mobility network, continuous tactile paving, and municipal lift telemetry.
            </p>
          </div>
        </div>

        {/* Mobility Profile Switch */}
        <div className="flex items-center bg-[#f2f3ff] p-1 rounded-full border border-[#dae2fd]">
          <button
            type="button"
            onClick={() => setProfileMode('wheelchair')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              profileMode === 'wheelchair'
                ? 'bg-[#006948] text-white shadow-xs font-bold'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">accessible</span>
            <span>Wheelchair</span>
          </button>

          <button
            type="button"
            onClick={() => setProfileMode('stroller')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              profileMode === 'stroller'
                ? 'bg-[#006948] text-white shadow-xs font-bold'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">child_care</span>
            <span>Family Stroller</span>
          </button>

          <button
            type="button"
            onClick={() => setProfileMode('vision')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              profileMode === 'vision'
                ? 'bg-[#006948] text-white shadow-xs font-bold'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>Low-Vision</span>
          </button>
        </div>
      </div>

      {/* Incline & Grade Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#eaedff]">
          <div className="flex items-center justify-between text-[#3d4a42]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">90km Track Continuity</span>
            <span className="material-symbols-outlined text-[#006948] text-[20px]">check_circle</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#006948] mt-2 block">100% Step-Free</span>
          <p className="text-xs text-[#3d4a42] mt-1">
            Zero curb drop-offs between Elmina Valley residential precincts, Central Park, and Lakeside Mall.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#eaedff]">
          <div className="flex items-center justify-between text-[#3d4a42]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Rainbow Bridge Slope</span>
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">trending_up</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#006c49] mt-2 block">2.4% Incline</span>
          <p className="text-xs text-[#3d4a42] mt-1">
            Far below the 7.1% (1:14) maximum ADA standard, allowing effortless manual wheelchair transit across lake.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#eaedff]">
          <div className="flex items-center justify-between text-[#3d4a42]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Tactile Paving Coverage</span>
            <span className="material-symbols-outlined text-[#a36700] text-[20px]">settings_accessibility</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#a36700] mt-2 block">98.4% Continuous</span>
          <p className="text-xs text-[#3d4a42] mt-1">
            Hazard warning studs and directional lines installed along all Elmina road crossings and transit pods.
          </p>
        </div>
      </div>

      {/* Real-time Elevator Status & Audio Beacons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Elevator Status Panel */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
              Elmina Civic Elevators & Ramp Telemetry
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-[10px] font-bold">
              6 of 6 Operational
            </span>
          </div>
          <p className="text-xs text-[#3d4a42]">
            Continuous IoT telemetry monitored by Sime Darby Property facility teams.
          </p>

          <div className="flex flex-col gap-2 mt-1">
            {ELEVATORS_STATUS.map((lift) => (
              <div
                key={lift.id}
                className="p-3 bg-[#faf8ff] rounded-2xl border border-[#eaedff] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006948] text-[20px]">elevator</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#131b2e]">{lift.location}</span>
                    <span className="text-[10px] text-[#3d4a42]">Heartbeat ping {lift.lastCheck}</span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[11px] text-[#006948] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
                  {lift.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Beacon Wayfinding & Community Electric Buggy */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff] flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
                Bluetooth Audio Wayfinding & Community Buggy
              </h3>
              <button
                type="button"
                onClick={() => setAudioBeaconsActive(!audioBeaconsActive)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  audioBeaconsActive
                    ? 'bg-[#006948] text-white'
                    : 'bg-[#eaedff] text-[#3d4a42]'
                }`}
              >
                {audioBeaconsActive ? 'Audio Beacons: Active' : 'Beacons: Muted'}
              </button>
            </div>
            <p className="text-xs text-[#3d4a42] mt-1">
              Provides spoken turn-by-turn guidance at Rainbow Bridge, Central Park bioretention boardwalks, and ERKC pavilions.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd]/70 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#006948]">
                Nearest Active Beacon: Pod #08 (Rainbow Bridge North Ramp)
              </span>
              <p className="text-xs text-[#131b2e] italic">
                "Approaching gentle arched ramp, incline 2.4%, clear biophilic promenade ahead."
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#3d4a42] mt-1">
                <span>Signal: -42 dBm (Optimal)</span>
                <span>•</span>
                <span>Distance: 4.2 meters</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleTestAudioBeacon}
              className="w-full sm:w-1/2 py-2.5 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] font-sans text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
              <span>Test Audio Cue</span>
            </button>

            <button
              type="button"
              onClick={handleBookBuggy}
              className="w-full sm:w-1/2 py-2.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-sans text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">electric_rickshaw</span>
              <span>Request Elmina Buggy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
