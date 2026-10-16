import React, { useState } from 'react';
import { LANDMARKS } from '../data/mockData';

interface CanopyRoutePlannerViewProps {
  onSelectRouteAndNavigate: () => void;
  showToast: (msg: string) => void;
}

export const CanopyRoutePlannerView: React.FC<CanopyRoutePlannerViewProps> = ({
  onSelectRouteAndNavigate,
  showToast
}) => {
  const [origin, setOrigin] = useState('elmina-lakeside-mall');
  const [dest, setDest] = useState('erkc-rainforest');
  const [shadePriority, setShadePriority] = useState(85); // 0 to 100
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);

  // Mode Toggle: Citizen Walk Mode vs Developer & ESG Planner Mode
  const [plannerRole, setPlannerRole] = useState<'citizen' | 'developer'>('developer');

  const routes = [
    {
      id: 'central-park-forest-trail',
      title: 'Elmina Central Park Forest Trail (Recommended)',
      tag: 'GBI Platinum • 300-Acre Wetland Spine',
      distance: '1.8 km',
      time: '18 mins',
      shade: '92%',
      relief: '-3.8°C',
      reward: '+120 Steps',
      grade: 'Max 2.4% (<1:14 ADA)',
      highlights: [
        'Rainbow Bridge shaded arches',
        'Continuous Hopea odorata canopy',
        'Direct connection to ERKC nursery'
      ],
      developerMetrics: {
        gpr: '4.8 (High)',
        carbonOffsetAnnual: '24.2 kg CO₂e / linear meter',
        permeablePavement: '94% Porous aggregate',
        gbiCredits: 'EQ 1.2 (Thermal Comfort) + SM 3.1 (Biodiversity)',
        pedestrianShed: '800m 10-min catchment serves 12,400 residents in Elmina Valley'
      }
    },
    {
      id: 'elmina-valley-active-loop',
      title: 'Elmina Valley 90km Active Mobility Loop (EV1-EV5)',
      tag: 'Dedicated Jogging & Cycling Network',
      distance: '2.4 km',
      time: '24 mins',
      shade: '78%',
      relief: '-2.9°C',
      reward: '+160 Steps',
      grade: 'Max 3.1% (Universal Design)',
      highlights: [
        'Separated bike/pedestrian paths',
        'Micro-cooling mist stations at EV3',
        'Integrated solar lighting poles'
      ],
      developerMetrics: {
        gpr: '3.6 (Medium-High)',
        carbonOffsetAnnual: '18.4 kg CO₂e / linear meter',
        permeablePavement: '88% Porous interlocking',
        gbiCredits: 'EE 2.1 (Active Micro-Mobility Integration)',
        pedestrianShed: '400m 5-min catchment serves EV1, EV2, EV3 residential clusters'
      }
    },
    {
      id: 'lakeside-mall-esplanade',
      title: 'Lakeside Mall Waterfront Esplanade',
      tag: 'Mixed-Use Commercial & Dining Spine',
      distance: '1.1 km',
      time: '11 mins',
      shade: '54%',
      relief: '-1.4°C',
      reward: '+60 Steps',
      grade: 'Flat Boardwalk (0% Grade)',
      highlights: [
        'Open-concept waterfront mall promenade',
        'Bioretention rain gardens',
        'Public art pavilions'
      ],
      developerMetrics: {
        gpr: '2.8 (Moderate)',
        carbonOffsetAnnual: '12.1 kg CO₂e / linear meter',
        permeablePavement: '72% Porous pavers',
        gbiCredits: 'WE 1.1 (Stormwater Sponge Bioretention)',
        pedestrianShed: 'Retail catchment connector for Central Park visitors'
      }
    }
  ];

  const handleExportDeveloperReport = () => {
    showToast('Exported Sime Darby Property GBI & ESG Route Specification (PDF/GeoJSON).');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6cf8bb]/30 flex items-center justify-center text-[#006948] shrink-0 border border-[#6cf8bb]/50">
            <span className="material-symbols-outlined text-[28px]">route</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#131b2e]">
                Canopy Route Planner
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#006948] text-[10px] font-bold border border-[#dae2fd]">
                City of Elmina, Shah Alam
              </span>
            </div>
            <p className="font-sans text-xs text-[#3d4a42] mt-0.5">
              Empowering developers, urban planners, and township citizens with micro-climate routing, Green Plot Ratios, and thermal comfort modeling.
            </p>
          </div>
        </div>

        {/* Mode Switch: Citizen vs Developer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#f2f3ff] p-1 rounded-full border border-[#dae2fd]">
            <button
              type="button"
              onClick={() => setPlannerRole('citizen')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                plannerRole === 'citizen'
                  ? 'bg-[#006948] text-white shadow-xs font-bold'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">directions_walk</span>
              <span>Citizen Walk</span>
            </button>
            <button
              type="button"
              onClick={() => setPlannerRole('developer')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                plannerRole === 'developer'
                  ? 'bg-[#006948] text-white shadow-xs font-bold'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">engineering</span>
              <span>Developer & ESG</span>
            </button>
          </div>

          {plannerRole === 'developer' && (
            <button
              type="button"
              onClick={handleExportDeveloperReport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] font-sans text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export ESG Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Configuration & Route Alternatives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Origin & Destination Configurator */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
              Elmina Waypoints
            </h3>
            <span className="text-[10px] text-[#006948] font-bold bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full">
              Sime Darby Master Plan
            </span>
          </div>

          {/* Origin Picker */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#3d4a42] block mb-1">
              Start Point (City of Elmina)
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#faf8ff] border border-[#dae2fd] text-[#131b2e] font-semibold focus:outline-none focus:ring-2 focus:ring-[#006948]"
            >
              {LANDMARKS.map((lm) => (
                <option key={lm.id} value={lm.id}>
                  {lm.name} ({lm.subtitle})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Picker */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#3d4a42] block mb-1">
              Destination (City of Elmina)
            </label>
            <select
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#faf8ff] border border-[#dae2fd] text-[#131b2e] font-semibold focus:outline-none focus:ring-2 focus:ring-[#006948]"
            >
              {LANDMARKS.map((lm) => (
                <option key={lm.id} value={lm.id}>
                  {lm.name} ({lm.subtitle})
                </option>
              ))}
            </select>
          </div>

          {/* Shade vs Speed Preference Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#131b2e] mb-1">
              <span>Canopy Density Weight</span>
              <span className="text-[#006948] bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full text-[11px]">
                {shadePriority}% Canopy Priority
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={shadePriority}
              onChange={(e) => setShadePriority(Number(e.target.value))}
              className="w-full accent-[#006948] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-[#3d4a42] mt-1">
              <span>Arterial Direct</span>
              <span>Balanced</span>
              <span>Max Rainforest Canopy</span>
            </div>
          </div>

          {plannerRole === 'developer' && (
            <div className="p-3 bg-[#f5fff7] rounded-2xl border border-[#85f8c4]/60 text-xs">
              <span className="font-bold text-[#006948] block mb-1">Developer Target Check:</span>
              <p className="text-[11px] text-[#3d4a42] leading-tight">
                Aligns with Sime Darby Property's commitment to plant 210,000 native rainforest trees and achieve GBI Platinum township accreditation.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onSelectRouteAndNavigate}
            className="w-full mt-2 py-3 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-sans text-xs font-bold shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">navigation</span>
            <span>Simulate & Navigate Route</span>
          </button>
        </div>

        {/* Route Alternatives */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
            Calculated Route Corridors in City of Elmina
          </h3>

          <div className="flex flex-col gap-4">
            {routes.map((route, idx) => {
              const isSelected = selectedRouteIdx === idx;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteIdx(idx)}
                  className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white border-[#006948] shadow-md ring-2 ring-[#006948]/20'
                      : 'bg-white/80 hover:bg-white border-[#eaedff] shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#006948] bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full">
                          {route.tag}
                        </span>
                        {idx === 0 && (
                          <span className="text-[10px] font-bold text-white bg-[#006948] px-2 py-0.5 rounded-full">
                            Optimal Shade
                          </span>
                        )}
                      </div>
                      <h4 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e] mt-1">
                        {route.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#131b2e]">
                          {route.time}
                        </span>
                        <span className="text-xs text-[#3d4a42] block">{route.distance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Standard Citizen Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 py-2.5 bg-[#f2f3ff] rounded-2xl text-center text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#006948]">{route.shade}</span>
                      <span className="text-[10px] text-[#3d4a42]">Canopy Shaded</span>
                    </div>
                    <div className="flex flex-col border-x border-[#dae2fd]/60">
                      <span className="font-bold text-[#006c49]">{route.relief}</span>
                      <span className="text-[10px] text-[#3d4a42]">Selangor Heat Relief</span>
                    </div>
                    <div className="flex flex-col border-r border-[#dae2fd]/60">
                      <span className="font-bold text-[#006948]">{route.reward}</span>
                      <span className="text-[10px] text-[#3d4a42]">Eco-Reward</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#131b2e]">{route.grade}</span>
                      <span className="text-[10px] text-[#3d4a42]">Incline Slope</span>
                    </div>
                  </div>

                  {/* DEVELOPER ESG METRICS PANEL (Shown when Developer Role is selected) */}
                  {plannerRole === 'developer' && (
                    <div className="my-3 p-3.5 bg-[#faf8ff] rounded-2xl border border-[#dae2fd] flex flex-col gap-2">
                      <div className="flex items-center justify-between border-b border-[#eaedff] pb-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#006948] tracking-wider">
                          Sime Darby Developer & ESG GIS Telemetry
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">GBI Platinum Protocol</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Green Plot Ratio (GPR):</span>
                          <strong className="text-[#006948]">{route.developerMetrics.gpr}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Permeable Surface:</span>
                          <strong className="text-[#131b2e]">{route.developerMetrics.permeablePavement}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Annual Carbon Offset:</span>
                          <strong className="text-[#006c49]">{route.developerMetrics.carbonOffsetAnnual}</strong>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#3d4a42] pt-1">
                        <span className="font-semibold text-[#131b2e]">Pedestrian Shed: </span>
                        {route.developerMetrics.pedestrianShed}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#3d4a42]">
                    {route.highlights.map((h, i) => (
                      <span key={i} className="flex items-center gap-1 bg-[#faf8ff] px-2.5 py-1 rounded-lg border border-[#dae2fd]/50">
                        <span className="material-symbols-outlined text-[14px] text-[#006948]">check_circle</span>
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
