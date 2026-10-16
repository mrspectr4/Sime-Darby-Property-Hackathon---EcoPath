import React, { useState } from 'react';
import { ScannedTownshipPlace } from '../../types';
import { DraggableCard } from '../common/DraggableCard';

interface TownshipScannerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isScanning: boolean;
  onTriggerScan: () => void;
  scannedPlaces: ScannedTownshipPlace[];
  onFlyToPlace: (place: ScannedTownshipPlace) => void;
  onRouteToPlace: (place: ScannedTownshipPlace) => void;
}

export const TownshipScannerDrawer: React.FC<TownshipScannerDrawerProps> = ({
  isOpen,
  onClose,
  isScanning,
  onTriggerScan,
  scannedPlaces,
  onFlyToPlace,
  onRouteToPlace
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'canopy' | 'light' | 'barrier_free'>('all');
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
    <div className="absolute bottom-6 left-4 sm:left-6 z-40 max-w-[calc(100vw-2rem)] sm:w-[460px]">
      <DraggableCard
        title="Township Eco-Scanner"
        icon="radar"
        badge={isScanning ? 'Scanning...' : 'LiDAR Ground Radar'}
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
        onClose={onClose}
        minimizedContent={
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[11px] font-bold text-[#006948] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse" />
              {scannedPlaces.length} Locations Scanned (Canopy • Lux • Step-Free)
            </span>
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="text-[11px] font-bold text-[#006948] underline hover:opacity-80"
            >
              Expand
            </button>
          </div>
        }
      >
        {/* Radar Progress Banner if Scanning */}
        {isScanning && (
          <div className="px-4 py-2.5 bg-[#006948] text-white flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#85f8c4] animate-ping" />
              <span>Scanning Elmina Central Park & Corridors (LiDAR Mesh)...</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#85f8c4]">320m Radius</span>
          </div>
        )}

        {/* Quick Summary Pill Telemetry */}
        <div className="px-4 pt-3 pb-2 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd]/50">
            <span className="text-[10px] text-[#3d4a42] font-semibold block uppercase">Avg Canopy</span>
            <span className="font-headline font-bold text-sm text-[#006948]">86.2%</span>
            <span className="text-[9px] text-[#00855d] block">-3.4°C relief</span>
          </div>
          <div className="p-2 rounded-2xl bg-[#fffbff] border border-[#ffddb8]/60">
            <span className="text-[10px] text-[#825100] font-semibold block uppercase">SafeNight Lux</span>
            <span className="font-headline font-bold text-sm text-[#a36700]">74.5 Lux</span>
            <span className="text-[9px] text-[#825100] block">100% solar LED</span>
          </div>
          <div className="p-2 rounded-2xl bg-[#f5fff7] border border-[#85f8c4]/60">
            <span className="text-[10px] text-[#00714d] font-semibold block uppercase">Step-Free</span>
            <span className="font-headline font-bold text-sm text-[#006c49]">100% ADA</span>
            <span className="text-[9px] text-[#006c49] block">Max 2.4% slope</span>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="px-4 py-2 flex flex-col gap-2">
          <div className="relative">
            <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places (Rainbow Bridge, Mall, ERKC)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f2f3ff] rounded-xl border border-[#dae2fd] focus:outline-none focus:ring-1 focus:ring-[#006948]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#006948] text-white shadow-xs'
                  : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#dae2fd]'
              }`}
            >
              All Scanned ({scannedPlaces.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('canopy')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeFilter === 'canopy'
                  ? 'bg-[#006948] text-white shadow-xs'
                  : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#dae2fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">forest</span>
              <span>Canopy &gt;80%</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('light')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeFilter === 'light'
                  ? 'bg-[#a36700] text-white shadow-xs'
                  : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#dae2fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">light_mode</span>
              <span>SafeNight &gt;65 Lux</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('barrier_free')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeFilter === 'barrier_free'
                  ? 'bg-[#005137] text-white shadow-xs'
                  : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#dae2fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">accessible</span>
              <span>Zero-Steps Ramp</span>
            </button>
          </div>
        </div>

        {/* Scanned Locations List */}
        <div className="overflow-y-auto px-4 py-2 space-y-2 max-h-[38vh]">
          {filteredPlaces.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No scanned locations match your filter.
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="p-3 bg-white rounded-2xl border border-[#dae2fd] hover:border-[#006948]/50 shadow-xs hover:shadow-md transition-all flex flex-col gap-1.5 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-xs sm:text-sm text-[#131b2e] group-hover:text-[#006948] transition-colors">
                        {place.name}
                      </span>
                      {place.rating && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#825100] bg-[#ffddb8]/60 px-1.5 py-0.2 rounded-md">
                          ★ {place.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{place.address}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold text-[#006948] bg-[#f5fff7] px-2 py-0.5 rounded-full border border-[#85f8c4]">
                      {place.distanceMeters}m away
                    </span>
                  </div>
                </div>

                {/* Badges of Live Scanned Features */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded-xl bg-[#f5fff7] flex items-center justify-between">
                    <span className="text-slate-500">Canopy:</span>
                    <strong className="text-[#006948] font-bold">{place.canopyCoverage}%</strong>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#fffbff] flex items-center justify-between">
                    <span className="text-slate-500">Night:</span>
                    <strong className="text-[#a36700] font-bold">{place.luxLevel} lx</strong>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between">
                    <span className="text-slate-500">Grade:</span>
                    <strong className="text-[#005137] font-bold">{place.slopeGrade}%</strong>
                  </div>
                </div>

                <p className="text-[10px] text-[#3d4a42] bg-[#faf8ff] p-1.5 rounded-xl border border-[#dae2fd]/60 leading-relaxed">
                  {place.statusNotes}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onFlyToPlace(place)}
                    className="flex-1 py-1.5 px-3 bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[15px]">my_location</span>
                    <span>View On Map</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRouteToPlace(place)}
                    className="flex-1 py-1.5 px-3 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[15px]">directions_walk</span>
                    <span>Route Here</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            Drag header to reposition anywhere
          </span>
          <button
            type="button"
            onClick={onTriggerScan}
            disabled={isScanning}
            className="flex items-center gap-1 font-bold text-[#006948] hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Re-Scan Area</span>
          </button>
        </div>
      </DraggableCard>
    </div>
  );
};
