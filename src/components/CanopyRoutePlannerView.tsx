import React, { useState } from 'react';
import { LANDMARKS } from '../data/mockData';
import { Icon } from './ui/Icon';
import { PageHeader } from './ui/PageHeader';
import { ShadeStrip } from './ui/ShadeStrip';

interface CanopyRoutePlannerViewProps {
  onSelectRouteAndNavigate: () => void;
  showToast: (msg: string) => void;
}

interface RouteOption {
  id: string;
  title: string;
  tag: string;
  distanceKm: number;
  distance: string;
  time: string;
  shadePercent: number;
  relief: string;
  reward: string;
  grade: string;
  highlights: string[];
  developerMetrics: {
    gpr: string;
    carbonOffsetAnnual: string;
    permeablePavement: string;
    gbiCredits: string;
    pedestrianShed: string;
  };
}

const ROUTES: RouteOption[] = [
  {
    id: 'central-park-forest-trail',
    title: 'Central Park forest trail',
    tag: '300-acre wetland spine',
    distanceKm: 1.8,
    distance: '1.8 km',
    time: '18 min',
    shadePercent: 92,
    relief: '-3.8°C',
    reward: '+120',
    grade: 'Up to 2.4%',
    highlights: [
      'Shaded arches on Rainbow Bridge',
      'Unbroken Hopea odorata canopy',
      'Leads straight to the ERKC nursery'
    ],
    developerMetrics: {
      gpr: '4.8 (high)',
      carbonOffsetAnnual: '24.2 kg CO₂e per metre',
      permeablePavement: '94% porous aggregate',
      gbiCredits: 'EQ 1.2 (thermal comfort), SM 3.1 (biodiversity)',
      pedestrianShed: '800 m, 10-minute catchment serves 12,400 residents in Elmina Valley'
    }
  },
  {
    id: 'elmina-valley-active-loop',
    title: 'Elmina Valley active loop (EV1 to EV5)',
    tag: 'Jogging and cycling network',
    distanceKm: 2.4,
    distance: '2.4 km',
    time: '24 min',
    shadePercent: 78,
    relief: '-2.9°C',
    reward: '+160',
    grade: 'Up to 3.1%',
    highlights: [
      'Bike and walking paths kept apart',
      'Cooling mist stations at EV3',
      'Solar lighting poles along the loop'
    ],
    developerMetrics: {
      gpr: '3.6 (medium-high)',
      carbonOffsetAnnual: '18.4 kg CO₂e per metre',
      permeablePavement: '88% porous interlocking',
      gbiCredits: 'EE 2.1 (active micro-mobility)',
      pedestrianShed: '400 m, 5-minute catchment serves the EV1, EV2 and EV3 residential clusters'
    }
  },
  {
    id: 'lakeside-mall-esplanade',
    title: 'Lakeside Mall waterfront esplanade',
    tag: 'Shops and dining',
    distanceKm: 1.1,
    distance: '1.1 km',
    time: '11 min',
    shadePercent: 54,
    relief: '-1.4°C',
    reward: '+60',
    grade: 'Flat',
    highlights: [
      'Open waterfront promenade',
      'Rain gardens that soak up storm water',
      'Public art pavilions'
    ],
    developerMetrics: {
      gpr: '2.8 (moderate)',
      carbonOffsetAnnual: '12.1 kg CO₂e per metre',
      permeablePavement: '72% porous pavers',
      gbiCredits: 'WE 1.1 (stormwater bioretention)',
      pedestrianShed: 'Connects retail to Central Park visitors'
    }
  }
];

export const CanopyRoutePlannerView: React.FC<CanopyRoutePlannerViewProps> = ({
  onSelectRouteAndNavigate,
  showToast
}) => {
  const [origin, setOrigin] = useState('elmina-lakeside-mall');
  const [dest, setDest] = useState('erkc-rainforest');
  const [shadePriority, setShadePriority] = useState(85);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [plannerRole, setPlannerRole] = useState<'citizen' | 'developer'>('developer');

  const isDeveloper = plannerRole === 'developer';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10 flex flex-col gap-10">
      <PageHeader
        title="Route planner"
        description="Compare walking routes by shade, heat relief and slope. Switch to the developer view for green plot ratio and GBI credits."
        actions={
          <>
            <div className="seg" role="group" aria-label="Who is planning">
              <button type="button" aria-pressed={!isDeveloper} onClick={() => setPlannerRole('citizen')}>
                Walking
              </button>
              <button type="button" aria-pressed={isDeveloper} onClick={() => setPlannerRole('developer')}>
                Developer and ESG
              </button>
            </div>
            {isDeveloper && (
              <button
                type="button"
                onClick={() => showToast('ESG route report exported as PDF and GeoJSON.')}
                className="btn btn-secondary"
              >
                <Icon name="download" size={17} />
                Export ESG report
              </button>
            )}
          </>
        }
      />

      <div className="grid lg:grid-cols-[18rem_1fr] gap-x-12 gap-y-10 items-start">
        {/* Waypoints */}
        <form
          className="flex flex-col gap-5 lg:sticky lg:top-24"
          onSubmit={(e) => {
            e.preventDefault();
            onSelectRouteAndNavigate();
          }}
        >
          <h2 className="text-[24px]">Your walk</h2>

          <label className="block">
            <span className="reading-label block mb-1.5">From</span>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="field">
              {LANDMARKS.map((lm) => (
                <option key={lm.id} value={lm.id}>
                  {lm.name} ({lm.subtitle})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="reading-label block mb-1.5">To</span>
            <select value={dest} onChange={(e) => setDest(e.target.value)} className="field">
              {LANDMARKS.map((lm) => (
                <option key={lm.id} value={lm.id}>
                  {lm.name} ({lm.subtitle})
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="shade-priority" className="reading-label">
                How much to favour shade
              </label>
              <span className="figure text-[22px] text-canopy">{shadePriority}%</span>
            </div>
            <input
              id="shade-priority"
              type="range"
              min="0"
              max="100"
              value={shadePriority}
              onChange={(e) => setShadePriority(Number(e.target.value))}
              className="mt-2 w-full accent-canopy cursor-pointer"
            />
            <div className="flex justify-between text-[13px] text-ink-2">
              <span>Shortest</span>
              <span>Most shade</span>
            </div>
          </div>

          {isDeveloper && (
            <p className="text-[14px] text-ink-2 leading-relaxed border-l-2 border-canopy pl-3">
              Supports Sime Darby Property&rsquo;s goal of planting 210,000 native rainforest trees and holding GBI Platinum for the township.
            </p>
          )}

          <button type="submit" className="btn btn-primary mt-1">
            <Icon name="navigation" size={17} />
            Open on map
          </button>
        </form>

        {/* Routes */}
        <section aria-labelledby="routes-title">
          <h2 id="routes-title" className="text-[24px]">
            Routes between these points
          </h2>

          <ul className="mt-4 border-t border-rule-strong">
            {ROUTES.map((route, idx) => {
              const isSelected = selectedRouteIdx === idx;
              return (
                <li key={route.id} className="border-b border-rule-strong">
                  <div
                    onClick={() => setSelectedRouteIdx(idx)}
                    className={`relative px-4 sm:px-5 py-5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-paper' : 'hover:bg-paper/60'
                    }`}
                  >
                    {isSelected && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-ink" />}

                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 className="text-[24px]">
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRouteIdx(idx);
                            }}
                            className="text-left"
                          >
                            {route.title}
                          </button>
                        </h3>
                        <p className="mt-1 text-[14px] text-ink-2">
                          {route.tag}
                          {idx === 0 && <span className="ml-2 font-semibold text-canopy">Most shade</span>}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="figure text-[32px]">{route.time}</p>
                        <p className="text-[14px] text-ink-2 num">{route.distance}</p>
                      </div>
                    </div>

                    <ShadeStrip
                      className="mt-4"
                      distanceKm={route.distanceKm}
                      shadePercent={route.shadePercent}
                      animate={idx === 0}
                    />

                    <dl className="mt-4 grid grid-cols-3 gap-x-4 text-[15px]">
                      <div>
                        <dt className="reading-label">Heat relief</dt>
                        <dd className="font-semibold num mt-0.5">{route.relief}</dd>
                      </div>
                      <div>
                        <dt className="reading-label">Eco-Steps</dt>
                        <dd className="font-semibold num mt-0.5">{route.reward}</dd>
                      </div>
                      <div>
                        <dt className="reading-label">Slope</dt>
                        <dd className="font-semibold num mt-0.5">{route.grade}</dd>
                      </div>
                    </dl>
                  </div>

                  {isSelected && (
                    <div className="bg-paper px-4 sm:px-5 pb-5 flex flex-col gap-5">
                      <ul className="grid sm:grid-cols-3 gap-x-5 gap-y-2 text-[14px] text-ink-2 leading-snug">
                        {route.highlights.map((h) => (
                          <li key={h} className="flex gap-2">
                            <Icon name="check" size={16} className="mt-0.5 shrink-0 text-canopy" strokeWidth={2.2} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      {isDeveloper && (
                        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 pt-4 border-t border-rule text-[15px]">
                          <div>
                            <dt className="reading-label">Green plot ratio</dt>
                            <dd className="font-semibold">{route.developerMetrics.gpr}</dd>
                          </div>
                          <div>
                            <dt className="reading-label">Permeable surface</dt>
                            <dd className="font-semibold">{route.developerMetrics.permeablePavement}</dd>
                          </div>
                          <div>
                            <dt className="reading-label">Carbon offset each year</dt>
                            <dd className="font-semibold">{route.developerMetrics.carbonOffsetAnnual}</dd>
                          </div>
                          <div>
                            <dt className="reading-label">GBI credits</dt>
                            <dd className="font-semibold">{route.developerMetrics.gbiCredits}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="reading-label">Pedestrian shed</dt>
                            <dd className="font-semibold">{route.developerMetrics.pedestrianShed}</dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};
