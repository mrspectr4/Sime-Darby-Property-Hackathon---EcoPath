import React, { useState } from 'react';
import { SENSOR_NODES } from '../data/mockData';
import { SensorNode } from '../types';

interface ClimateSensorsViewProps {
  showToast: (msg: string) => void;
}

export const ClimateSensorsView: React.FC<ClimateSensorsViewProps> = ({ showToast }) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [isMistingActive, setIsMistingActive] = useState(true);

  const filteredSensors = selectedZone === 'all' 
    ? SENSOR_NODES 
    : SENSOR_NODES.filter(s => s.zone.includes(selectedZone));

  const handleToggleMisting = () => {
    setIsMistingActive(!isMistingActive);
    showToast(!isMistingActive ? 'Rainbow Bridge & Mall Mist Actuators Activated (-3.8°C thermal relief)' : 'Elmina Mist Actuators Paused (Water conservation mode)');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6cf8bb]/30 flex items-center justify-center text-[#006948] shrink-0 border border-[#6cf8bb]/50">
            <span className="material-symbols-outlined text-[28px]">thermostat</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#131b2e]">
                Micro-Climate Mesh & Telemetry
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#006948] text-[10px] font-bold border border-[#dae2fd]">
                City of Elmina • Shah Alam
              </span>
            </div>
            <p className="font-sans text-xs text-[#3d4a42] mt-0.5">
              128 environmental IoT sensor nodes monitoring tropical heat stress, canopy cooling, and stormwater bioretention across Elmina.
            </p>
          </div>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleMisting}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-xs font-bold transition-all shadow-sm ${
              isMistingActive
                ? 'bg-[#006948] text-white'
                : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMistingActive ? 'cool_to_dry' : 'air'}
            </span>
            <span>{isMistingActive ? 'Elmina Mist Pods: Active' : 'Mist Pods: Standby'}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Micro-Climate Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#dae2fd]/70 flex flex-col">
          <div className="flex items-center justify-between text-[#3d4a42]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Canopy Cooling Delta</span>
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">park</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#006c49] mt-2">-3.8°C</span>
          <span className="text-[11px] text-[#3d4a42] mt-1">Central Park Canopy vs Highway Tarmac</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#dae2fd]/70 flex flex-col">
          <div className="flex items-center justify-between text-[#3d4a42]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Shah Alam AQI</span>
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">air</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#006c49] mt-2">20</span>
          <span className="text-[11px] text-[#006c49] font-semibold mt-1">Good (Clean Rainforest Air)</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#dae2fd]/70 flex flex-col">
          <div className="flex items-center justify-between text-[#3d4a42]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Rainforest Evapotranspiration</span>
            <span className="material-symbols-outlined text-[#006948] text-[20px]">water_drop</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#006948] mt-2">310 L/hr</span>
          <span className="text-[11px] text-[#3d4a42] mt-1">210,000 Native Trees Transpiration</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#dae2fd]/70 flex flex-col">
          <div className="flex items-center justify-between text-[#3d4a42]">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Solar Clean Energy</span>
            <span className="material-symbols-outlined text-[#a36700] text-[20px]">solar_power</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#a36700] mt-2">168 kW</span>
          <span className="text-[11px] text-[#3d4a42] mt-1">Lakeside Mall & Park Pergola Solar</span>
        </div>
      </div>

      {/* Heat Island Mitigation Comparison Diagram */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff]">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e] mb-1">
          Selangor Urban Heat Island Comparison
        </h3>
        <p className="font-sans text-xs text-[#3d4a42] mb-4">
          Surface heat measurement comparing Guthrie Corridor Expressway (GCE E35) highway versus Elmina Central Park & ERKC deep canopy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GCE Asphalt Corridor */}
          <div className="p-4 rounded-2xl bg-[#ffdad6]/20 border border-[#ffdad6] flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-[#ba1a1a]">Guthrie Expressway (E35) Tarmac</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] font-bold">Unshaded Highway</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#ba1a1a]">36.8°C</span>
              <span className="text-xs text-[#3d4a42]">Surface Heat Index (2:00 PM)</span>
            </div>
            <p className="text-xs text-[#3d4a42] mt-2">
              High thermal absorption in dark asphalt corridor. Acoustic levels reach 78 dB without bio-shielding.
            </p>
          </div>

          {/* Elmina Central Park & ERKC Sanctuary */}
          <div className="p-4 rounded-2xl bg-[#6cf8bb]/15 border border-[#6cf8bb] flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-[#006948]">Elmina Central Park & ERKC Canopy</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#006948] text-white font-bold">-4.6°C Delta</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#006948]">26.2°C</span>
              <span className="text-xs text-[#006948] font-bold">Under-Canopy Microclimate</span>
            </div>
            <p className="text-xs text-[#3d4a42] mt-2">
              94% canopy density with native Shorea species + lake bioretention breeze + 50m highway green acoustic buffer.
            </p>
          </div>
        </div>
      </div>

      {/* Sensor Zone Filter & Live Mesh Nodes */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
            Live Sensor Telemetry Across City of Elmina Zones
          </h3>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedZone === z
                    ? 'bg-[#006948] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#dae2fd]'
                }`}
              >
                {z === 'all' ? 'All 6 Zones' : z}
              </button>
            ))}
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSensors.map((node: SensorNode) => {
            const coolingDelta = (node.temp - node.underCanopyTemp).toFixed(1);
            return (
              <div
                key={node.id}
                className="p-4 rounded-2xl bg-[#faf8ff] hover:bg-[#f2f3ff] transition-all border border-[#dae2fd]/60 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#006948] font-bold uppercase tracking-wider">{node.zone}</span>
                    <h4 className="font-sans text-xs font-bold text-[#131b2e] mt-0.5">{node.name}</h4>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] bg-[#6cf8bb]/40 text-[#00714d] px-2 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#dae2fd]/40 text-center">
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-[#131b2e]">{node.underCanopyTemp}°C</span>
                    <span className="text-[10px] text-[#3d4a42]">Canopy Temp</span>
                  </div>
                  <div className="flex flex-col border-x border-[#dae2fd]/40">
                    <span className="text-base font-bold text-[#006c49]">-{coolingDelta}°C</span>
                    <span className="text-[10px] text-[#006c49] font-bold">Relief</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-[#006948]">{node.canopyCover}%</span>
                    <span className="text-[10px] text-[#3d4a42]">Coverage</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#3d4a42]">
                  <span>AQI: <strong className="text-[#006948]">{node.aqi}</strong></span>
                  <span>Humidity: {node.humidity}%</span>
                  <span>UV Index: {node.uv}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
