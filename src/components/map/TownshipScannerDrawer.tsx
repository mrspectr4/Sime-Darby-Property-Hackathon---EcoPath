import React, { useState } from 'react';
import { ScannedTownshipPlace } from '../../types';
import { DraggableCard } from '../common/DraggableCard';
import { Icon } from '../ui/Icon';

interface TownshipScannerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isScanning: boolean;
  onTriggerScan: () => void;
  scannedPlaces: ScannedTownshipPlace[];
  onFlyToPlace: (place: ScannedTownshipPlace) => void;
  onRouteToPlace: (place: ScannedTownshipPlace) => void;
}

type Filter = 'all' | 'canopy' | 'light' | 'barrier_free';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'canopy', label: 'Shade over 80%' },
  { id: 'light', label: 'Over 65 lux' },
  { id: 'barrier_free', label: 'Step-free' }
];

export const TownshipScannerDrawer: React.FC<TownshipScannerDrawerProps> = ({
  isOpen,
  onClose,
  isScanning,
  onTriggerScan,
  scannedPlaces,
  onFlyToPlace,
  onRouteToPlace
}) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const filteredPlaces = scannedPlaces.filter((p) => {
    if (activeFilter === 'canopy' && p.canopyCoverage < 80) return false;
    if (activeFilter === 'light' && p.luxLevel < 65) return false;
    if (activeFilter === 'barrier_free' && (!p.stepFree || p.slopeGrade > 2.5)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="absolute bottom-4 left-3 sm:left-5 z-40 max-w-[calc(100vw-1.5rem)] w-[26rem]">
      <DraggableCard
        title="Nearby places"
        badge={isScanning ? 'Scanning' : `${scannedPlaces.length} found`}
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
        onClose={onClose}
        minimizedContent={
          <div className="flex items-center justify-between">
            <span className="num">{scannedPlaces.length} places scanned</span>
            <button type="button" onClick={() => setIsMinimized(false)} className="font-semibold underline underline-offset-2">
              Expand
            </button>
          </div>
        }
      >
        {isScanning && (
          <p className="px-3 py-2 bg-ink text-paper text-[14px]" role="status">
            Scanning a 320 m radius around Central Park
          </p>
        )}

        <dl className="grid grid-cols-3 border-b border-rule text-[14px]">
          <div className="px-3 py-2.5">
            <dt className="text-ink-2 text-[13px]">Average shade</dt>
            <dd className="figure text-[22px] text-canopy mt-0.5">86.2%</dd>
          </div>
          <div className="px-3 py-2.5 border-l border-rule">
            <dt className="text-ink-2 text-[13px]">Night light</dt>
            <dd className="figure text-[22px] text-lamp-ink mt-0.5">74.5 lx</dd>
          </div>
          <div className="px-3 py-2.5 border-l border-rule">
            <dt className="text-ink-2 text-[13px]">Steepest slope</dt>
            <dd className="figure text-[22px] text-ramp mt-0.5">2.4%</dd>
          </div>
        </dl>

        <div className="px-3 pt-3 pb-2 flex flex-col gap-2.5">
          <label className="relative block">
            <span className="sr-only">Search places</span>
            <Icon name="search" size={17} className="absolute left-3 top-3 text-ink-3" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Rainbow Bridge, the mall, ERKC"
              className="field !pl-9 !min-h-10 text-[14px]"
            />
          </label>

          <div className="seg overflow-x-auto max-w-full self-start" role="group" aria-label="Filter places">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
                className="!min-h-9 !text-[13px]"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="overflow-y-auto max-h-[30vh] border-t border-rule divide-y divide-rule">
          {filteredPlaces.length === 0 ? (
            <li className="px-3 py-6 text-[14px] text-ink-2">No places match. Try a different filter.</li>
          ) : (
            filteredPlaces.map((place) => (
              <li key={place.id} className="px-3 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[18px] leading-tight">{place.name}</h3>
                  <span className="shrink-0 text-[14px] text-ink-2 num">{place.distanceMeters} m</span>
                </div>
                <p className="text-[13px] text-ink-2 line-clamp-1">{place.address}</p>

                <dl className="mt-2 flex gap-x-5 text-[14px] num">
                  <div className="flex gap-1.5">
                    <dt className="text-ink-2">Shade</dt>
                    <dd className="font-semibold text-canopy">{place.canopyCoverage}%</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-ink-2">Night</dt>
                    <dd className="font-semibold text-lamp-ink">{place.luxLevel} lx</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-ink-2">Slope</dt>
                    <dd className="font-semibold text-ramp">{place.slopeGrade}%</dd>
                  </div>
                </dl>

                <p className="mt-1.5 text-[13px] text-ink-2 leading-snug">{place.statusNotes}</p>

                <div className="mt-2.5 flex gap-2">
                  <button type="button" onClick={() => onFlyToPlace(place)} className="btn btn-secondary btn-sm flex-1">
                    Show on map
                  </button>
                  <button type="button" onClick={() => onRouteToPlace(place)} className="btn btn-primary btn-sm flex-1">
                    Walk here
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="px-3 py-2 border-t border-rule flex items-center justify-between text-[13px] text-ink-2">
          <span>Drag the title bar to move</span>
          <button
            type="button"
            onClick={onTriggerScan}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 font-semibold text-ink disabled:text-ink-3"
          >
            <Icon name="refresh" size={15} />
            Scan again
          </button>
        </div>
      </DraggableCard>
    </div>
  );
};
