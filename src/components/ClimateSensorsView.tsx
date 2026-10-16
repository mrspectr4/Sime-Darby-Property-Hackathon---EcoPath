import React, { useState } from 'react';
import { SENSOR_NODES } from '../data/mockData';
import { SensorNode } from '../types';
import { PageHeader } from './ui/PageHeader';
import { Readings } from './ui/Readings';

interface ClimateSensorsViewProps {
  showToast: (msg: string) => void;
}

const ZONES = ['all', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'];

/** Temperature scale for the tarmac versus canopy comparison. */
const SCALE_MIN = 24;
const SCALE_MAX = 38;
const BANDS = [
  '#cfe0cc', '#d9e4c8', '#e6e8c1', '#efe0b4', '#f0cfa3', '#eebb97', '#e8a38a'
];

const pos = (t: number) => ((t - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

const STATUS_LABEL: Record<SensorNode['status'], string> = {
  optimal: 'Normal',
  active: 'Cooling on',
  warning: 'Check'
};

export const ClimateSensorsView: React.FC<ClimateSensorsViewProps> = ({ showToast }) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [isMistingActive, setIsMistingActive] = useState(true);

  const filteredSensors =
    selectedZone === 'all' ? SENSOR_NODES : SENSOR_NODES.filter((s) => s.zone.includes(selectedZone));

  const handleToggleMisting = () => {
    const next = !isMistingActive;
    setIsMistingActive(next);
    showToast(
      next
        ? 'Cooling mist is on at Rainbow Bridge and the mall. Expect about 3.8°C relief.'
        : 'Cooling mist is paused to save water.'
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10 flex flex-col gap-10">
      <PageHeader
        title="Climate"
        description="128 sensors across six zones measure heat, air quality and tree cover in Elmina. Readings update live."
        actions={
          <button
            type="button"
            role="switch"
            aria-checked={isMistingActive}
            onClick={handleToggleMisting}
            className="flex items-center gap-3 min-h-10 text-[15px] font-semibold"
          >
            <span>Cooling mist</span>
            <span
              className={`relative inline-block w-11 h-6 rounded-full border transition-colors ${
                isMistingActive ? 'bg-ink border-ink' : 'bg-paper border-rule-strong'
              }`}
            >
              <span
                className={`absolute top-0.5 rounded-full transition-all ${
                  isMistingActive ? 'left-[22px] bg-paper' : 'left-0.5 bg-ink-3'
                }`}
                style={{ width: 18, height: 18 }}
              />
            </span>
            <span className="w-12 text-ink-2 font-normal">{isMistingActive ? 'On' : 'Paused'}</span>
          </button>
        }
      />

      <Readings
        items={[
          {
            label: 'Canopy cooling',
            value: '-3.8',
            unit: '°C',
            tone: 'text-canopy',
            note: 'Central Park canopy against highway tarmac'
          },
          {
            label: 'Air quality index',
            value: '20',
            note: 'Good. Clean air across Shah Alam'
          },
          {
            label: 'Water released by trees',
            value: '310',
            unit: 'L/hr',
            note: 'From 210,000 native trees'
          },
          {
            label: 'Solar power',
            value: '168',
            unit: 'kW',
            note: 'Lakeside Mall and park pergolas'
          }
        ]}
      />

      {/* Tarmac versus canopy, on one temperature scale */}
      <section aria-labelledby="heat-title">
        <h2 id="heat-title" className="text-[28px]">
          Highway or canopy, 2:00 PM
        </h2>
        <p className="mt-2 text-[16px] text-ink-2 max-w-[62ch]">
          Surface heat on the Guthrie Corridor Expressway (E35) against the air under the Central Park and ERKC canopy.
        </p>

        <div className="mt-8 relative px-2 pb-2" role="img" aria-label="Temperature scale from 24 to 38 degrees. Under the canopy it is 26.2 degrees. On the expressway tarmac it is 36.8 degrees.">
          {/* markers above the scale */}
          <div className="relative h-16">
            <div className="absolute bottom-0 -translate-x-1/2 text-center" style={{ left: `${pos(26.2)}%` }}>
              <p className="figure text-[34px] text-canopy">26.2°C</p>
              <span className="block mx-auto w-px h-3 bg-canopy" />
            </div>
            <div className="absolute bottom-0 -translate-x-1/2 text-center" style={{ left: `${pos(36.8)}%` }}>
              <p className="figure text-[34px] text-laterite-ink">36.8°C</p>
              <span className="block mx-auto w-px h-3 bg-laterite" />
            </div>
          </div>

          <div className="flex h-4 border border-rule-strong">
            {BANDS.map((c) => (
              <span key={c} className="flex-1" style={{ background: c }} />
            ))}
          </div>
          <div className="flex justify-between mt-1.5 text-[13px] text-ink-2 num">
            {[24, 26, 28, 30, 32, 34, 36, 38].map((t) => (
              <span key={t}>{t}°</span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-6">
          <div className="border-t-2 border-canopy pt-3">
            <h3 className="text-[20px]">Elmina Central Park and ERKC canopy</h3>
            <p className="mt-1.5 text-[15px] text-ink-2 leading-relaxed">
              Under-canopy air, 4.6°C below the open. 94% canopy density with native Shorea trees, lake breeze, and a 50 m green buffer along the highway.
            </p>
          </div>
          <div className="border-t-2 border-laterite pt-3">
            <h3 className="text-[20px]">Guthrie Expressway (E35) tarmac</h3>
            <p className="mt-1.5 text-[15px] text-ink-2 leading-relaxed">
              Dark asphalt with no shade absorbs and re-radiates heat. Noise reaches 78 dB where there is no planted buffer.
            </p>
          </div>
        </div>
      </section>

      {/* Sensors */}
      <section aria-labelledby="sensors-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="sensors-title" className="text-[28px]">
            Sensors by zone
          </h2>
          <div className="seg overflow-x-auto max-w-full" role="group" aria-label="Filter by zone">
            {ZONES.map((z) => (
              <button key={z} type="button" aria-pressed={selectedZone === z} onClick={() => setSelectedZone(z)}>
                {z === 'all' ? 'All zones' : z}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto border-y border-rule-strong">
          <table className="w-full min-w-[760px] text-left text-[15px]">
            <caption className="sr-only">Live sensor readings. Under-canopy temperature, cooling, canopy cover, air quality, humidity and UV.</caption>
            <thead>
              <tr className="text-[13px] text-ink-2 border-b border-rule-strong">
                <th scope="col" className="py-3 pr-4 font-medium">Sensor</th>
                <th scope="col" className="py-3 px-3 font-medium text-right">Under canopy</th>
                <th scope="col" className="py-3 px-3 font-medium text-right">Cooler by</th>
                <th scope="col" className="py-3 px-3 font-medium text-right">Canopy cover</th>
                <th scope="col" className="py-3 px-3 font-medium text-right">AQI</th>
                <th scope="col" className="py-3 px-3 font-medium text-right">Humidity</th>
                <th scope="col" className="py-3 px-3 font-medium text-right">UV</th>
                <th scope="col" className="py-3 pl-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {filteredSensors.map((node) => {
                const cooling = (node.temp - node.underCanopyTemp).toFixed(1);
                return (
                  <tr key={node.id} className="align-top hover:bg-paper">
                    <th scope="row" className="py-3.5 pr-4 font-normal">
                      <span className="block font-semibold leading-snug">{node.name}</span>
                      <span className="block text-[13px] text-ink-2">{node.zone}</span>
                    </th>
                    <td className="py-3.5 px-3 text-right num">{node.underCanopyTemp}°C</td>
                    <td className="py-3.5 px-3 text-right num text-canopy font-semibold">{cooling}°C</td>
                    <td className="py-3.5 px-3 text-right num">{node.canopyCover}%</td>
                    <td className="py-3.5 px-3 text-right num">{node.aqi}</td>
                    <td className="py-3.5 px-3 text-right num">{node.humidity}%</td>
                    <td className="py-3.5 px-3 text-right num">{node.uv}</td>
                    <td className="py-3.5 pl-3">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            node.status === 'warning' ? 'bg-laterite' : 'bg-canopy'
                          }`}
                        />
                        {STATUS_LABEL[node.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredSensors.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-ink-2">
                    No sensors in this zone yet. Pick another zone to see readings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
