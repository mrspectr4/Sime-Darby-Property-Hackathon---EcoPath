import React, { useState } from 'react';
import { ELEVATORS_STATUS } from '../data/mockData';
import { Icon } from './ui/Icon';
import { PageHeader } from './ui/PageHeader';
import { Readings } from './ui/Readings';

interface AccessibilityRadarViewProps {
  showToast: (msg: string) => void;
}

type Profile = 'wheelchair' | 'stroller' | 'vision';

const PROFILES: { id: Profile; label: string }[] = [
  { id: 'wheelchair', label: 'Wheelchair' },
  { id: 'stroller', label: 'Stroller' },
  { id: 'vision', label: 'Low vision' }
];

export const AccessibilityRadarView: React.FC<AccessibilityRadarViewProps> = ({ showToast }) => {
  const [profileMode, setProfileMode] = useState<Profile>('wheelchair');
  const [audioBeaconsActive, setAudioBeaconsActive] = useState(true);

  const handleTestAudioBeacon = () => {
    showToast('Beacon 08, Rainbow Bridge north ramp: "Gentle arched ramp ahead, 2.4% incline, clear path."');
  };

  const handleBookBuggy = () => {
    showToast('An accessible buggy is on its way to Elmina Valley 3. About 4 minutes.');
  };

  const operational = ELEVATORS_STATUS.filter((l) => l.status === 'Operational').length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10 flex flex-col gap-10">
      <PageHeader
        title="Accessibility"
        description="Step-free paths, ramp gradients, tactile paving and lift status across Elmina's 90 km active mobility network."
        actions={
          <div className="seg" role="group" aria-label="Mobility profile">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={profileMode === p.id}
                onClick={() => setProfileMode(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      <Readings
        items={[
          {
            label: 'Step-free track',
            value: '100%',
            tone: 'text-ramp',
            note: 'No kerb drops between the Elmina Valley precincts, Central Park and Lakeside Mall.'
          },
          {
            label: 'Rainbow Bridge slope',
            value: '2.4%',
            tone: 'text-ramp',
            note: 'The ADA maximum is 7.1% (1:14), so a manual wheelchair can cross the lake without help.'
          },
          {
            label: 'Tactile paving',
            value: '98.4%',
            tone: 'text-ramp',
            note: 'Warning studs and guide lines at every road crossing and transit pod.'
          }
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-x-14 gap-y-12">
        {/* Lifts */}
        <section aria-labelledby="lifts-title">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="lifts-title" className="text-[28px]">
              Lifts and ramps
            </h2>
            <p className="text-[15px] font-semibold num">
              {operational} of {ELEVATORS_STATUS.length} working
            </p>
          </div>
          <p className="mt-2 text-[15px] text-ink-2">Checked continuously by Sime Darby Property facilities teams.</p>

          <ul className="mt-4 border-t border-rule-strong">
            {ELEVATORS_STATUS.map((lift) => (
              <li
                key={lift.id}
                className="flex items-start justify-between gap-4 py-3 border-b border-rule"
              >
                <div>
                  <p className="text-[15px] font-semibold leading-snug">{lift.location}</p>
                  <p className="text-[13px] text-ink-2">Last checked {lift.lastCheck}</p>
                </div>
                <p className="shrink-0 inline-flex items-center gap-2 text-[15px]">
                  <span
                    className={`w-2 h-2 rounded-full ${lift.status === 'Operational' ? 'bg-canopy' : 'bg-laterite'}`}
                  />
                  {lift.status === 'Operational' ? 'Working' : lift.status}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Audio beacons and buggy */}
        <section aria-labelledby="audio-title" className="flex flex-col">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="audio-title" className="text-[28px]">
              Audio guidance
            </h2>
            <button
              type="button"
              role="switch"
              aria-checked={audioBeaconsActive}
              onClick={() => setAudioBeaconsActive(!audioBeaconsActive)}
              className="text-[15px] font-semibold underline underline-offset-4 decoration-rule-strong hover:decoration-ink"
            >
              {audioBeaconsActive ? 'Beacons on' : 'Beacons muted'}
            </button>
          </div>
          <p className="mt-2 text-[15px] text-ink-2 max-w-[56ch]">
            Bluetooth beacons speak turn-by-turn directions at Rainbow Bridge, the Central Park boardwalks and the ERKC pavilions.
          </p>

          <figure className="mt-5 border-l-2 border-ramp pl-4">
            <blockquote className="text-[18px] leading-snug">
              &ldquo;Gentle arched ramp ahead, 2.4% incline, clear path.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-[14px] text-ink-2 num">
              Nearest beacon: 08, Rainbow Bridge north ramp. 4.2 m away, signal -42 dBm.
            </figcaption>
          </figure>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={handleTestAudioBeacon} className="btn btn-secondary">
              <Icon name="volume_up" size={17} />
              Play this cue
            </button>
            <button type="button" onClick={handleBookBuggy} className="btn btn-primary">
              <Icon name="electric_rickshaw" size={17} />
              Request a buggy
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
