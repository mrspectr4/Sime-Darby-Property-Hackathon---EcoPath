import React, { useState, useEffect, useMemo, useRef } from 'react';
import { EducationalPin, Landmark, ScannedTownshipPlace, LatLngPoint } from '../types';
import {
  LANDMARKS,
  EDUCATIONAL_PINS,
  BARRIER_FREE_NODES,
  SAFENIGHT_LIGHT_POSTS,
  ELMINA_CANOPY_ZONES,
  SCANNED_ELMINA_PLACES,
  DEVELOPER_ESG_BENCHMARKS,
  ELMINA_CENTER
} from '../data/mockData';
import { computeElminaRoutes, getAllTownshipNetworks } from '../utils/elminaRouting';
import { TownshipScannerDrawer } from './map/TownshipScannerDrawer';
import { DraggableCard } from './common/DraggableCard';
import { Icon } from './ui/Icon';
import { ShadeStrip } from './ui/ShadeStrip';

interface TownshipMapProps {
  onOpenEduModal: (pin: EducationalPin) => void;
  onOpenReportModal: () => void;
  onOpenRewardsModal: () => void;
  userPoints: number;
  showToast: (msg: string) => void;
}

// Bounding box for City of Elmina for geometric projection
const BOUNDS = {
  minLat: 3.1705,
  maxLat: 3.1920,
  minLng: 101.5090,
  maxLng: 101.5315
};

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1000;

/**
 * Base map colours. Day is a printed survey sheet: pale land, white roads
 * with an edge line, blue-grey water. Night and terrain are dark variants.
 * Data colours (canopy, lamp, ramp) stay the same on every base.
 */
const BASE = {
  day: {
    land: '#e8eae0', grid: '#d6d8c9', water: '#bed4d3', waterLine: '#8fb2b3', waterText: '#4f7778',
    road: '#fafaf6', roadEdge: '#c3c1b2', roadText: '#6c7476', canopyFill: '#d1e1c8', canopyLine: '#1e6b45',
    label: '#17292b', halo: '#fafaf6'
  },
  night: {
    land: '#0e1b1d', grid: '#162629', water: '#0a2a2d', waterLine: '#1d5a5d', waterText: '#6fa3a5',
    road: '#1a2d30', roadEdge: '#2b4549', roadText: '#7c9598', canopyFill: '#123a28', canopyLine: '#4aa578',
    label: '#ece9de', halo: '#0e1b1d'
  },
  terrain: {
    land: '#27362b', grid: '#2f4034', water: '#2b5251', waterLine: '#4b7f7d', waterText: '#9cc3c0',
    road: '#43544a', roadEdge: '#34443a', roadText: '#b4c4ba', canopyFill: '#33523a', canopyLine: '#7cc59a',
    label: '#eef0e4', halo: '#27362b'
  }
} as const;

const PATH_STYLE = {
  shade: { color: '#1e6b45', dash: undefined as string | undefined, cap: 'round' as const },
  night: { color: '#e8a33a', dash: '10 7', cap: 'butt' as const },
  barrier: { color: '#2a5da8', dash: '0.1 9', cap: 'round' as const }
};

/** Props that make an SVG shape behave like a button for mouse and keyboard. */
function asButton(label: string, onActivate: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': label,
    onClick: onActivate,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    }
  };
}

// Geographic coordinate projection to 2D SVG canvas
function projectPoint(p: LatLngPoint): { x: number; y: number } {
  const normX = (p.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng);
  const normY = (BOUNDS.maxLat - p.lat) / (BOUNDS.maxLat - BOUNDS.minLat);
  return {
    x: Math.round(normX * 1400 + 100),
    y: Math.round(normY * 800 + 100)
  };
}

// Convert points array to SVG path 'd' string
function pointsToSvgPath(pts: LatLngPoint[]): string {
  if (!pts || pts.length === 0) return '';
  const projected = pts.map(projectPoint);
  return projected.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');
}

// Smooth curved path for organic water bodies or roads
function pointsToCurvedSvgPath(pts: LatLngPoint[]): string {
  if (!pts || pts.length === 0) return '';
  const projected = pts.map(projectPoint);
  if (projected.length === 1) return `M ${projected[0].x} ${projected[0].y}`;
  if (projected.length === 2) return `M ${projected[0].x} ${projected[0].y} L ${projected[1].x} ${projected[1].y}`;

  let d = `M ${projected[0].x} ${projected[0].y}`;
  for (let i = 1; i < projected.length - 1; i++) {
    const xc = (projected[i].x + projected[i + 1].x) / 2;
    const yc = (projected[i].y + projected[i + 1].y) / 2;
    d += ` Q ${projected[i].x} ${projected[i].y}, ${xc} ${yc}`;
  }
  const last = projected[projected.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

export const TownshipMap: React.FC<TownshipMapProps> = ({
  onOpenEduModal,
  onOpenReportModal,
  onOpenRewardsModal,
  userPoints,
  showToast
}) => {
  // Layer visibility controls
  const [displayLayers, setDisplayLayers] = useState({
    canopy: true,
    nightLighting: true,
    barrierFree: true,
    townshipMesh: true,
    routes: true,
    landmarks: true,
    eduPins: true
  });

  const [isCleanMapMode, setIsCleanMapMode] = useState(false);
  const [isRouteCardMinimized, setIsRouteCardMinimized] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640
  );
  const [isRouteCardVisible, setIsRouteCardVisible] = useState(true);
  const [showDisplayOptionsModal, setShowDisplayOptionsModal] = useState(false);
  const [selectedRoutePreference, setSelectedRoutePreference] = useState<'shade' | 'night' | 'barrier' | 'all'>('all');

  const [isNightMode, setIsNightMode] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // Interactive Pan and Zoom Transform
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Selected Landmark / Pin for Info Popover
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);

  // Dynamic Route Origin & Destination Waypoints
  const [originId, setOriginId] = useState('elmina-sports-park');
  const [destId, setDestId] = useState('rainbow-bridge');
  const [showWaypointPicker, setShowWaypointPicker] = useState<'origin' | 'dest' | null>(null);

  // Custom Origin & Destination Coordinates (Overrides)
  const [customOriginPos, setCustomOriginPos] = useState<LatLngPoint | null>(null);
  const [customDestPos, setCustomDestPos] = useState<LatLngPoint | null>(null);

  // Live Navigation Simulation
  const [isNavigating, setIsNavigating] = useState(false);
  const [navProgress, setNavProgress] = useState(0);

  // Scanner Drawer State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPlaces] = useState<ScannedTownshipPlace[]>(SCANNED_ELMINA_PLACES);

  // Developer ESG Telemetry Drawer
  const [showDeveloperHud, setShowDeveloperHud] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Compute multi-corridor routes dynamically
  const calculatedRoutes = useMemo(() => {
    return computeElminaRoutes(originId, destId);
  }, [originId, destId]);

  const originLandmark = LANDMARKS.find((l) => l.id === originId) || LANDMARKS[0];
  const destLandmark = LANDMARKS.find((l) => l.id === destId) || LANDMARKS[1];

  const currentOriginPos = customOriginPos || originLandmark.position;
  const currentDestPos = customDestPos || destLandmark.position;

  // Active path to traverse during walk navigation
  const activeNavigationPath = useMemo(() => {
    if (selectedRoutePreference === 'night') return calculatedRoutes.nightPath;
    if (selectedRoutePreference === 'barrier') return calculatedRoutes.barrierPath;
    return calculatedRoutes.shadePath;
  }, [selectedRoutePreference, calculatedRoutes]);

  // Interpolated Walker Position along active path
  const currentWalkerPos = useMemo(() => {
    if (!activeNavigationPath || activeNavigationPath.length === 0) return currentOriginPos;
    if (activeNavigationPath.length === 1) return activeNavigationPath[0];

    const totalSegments = activeNavigationPath.length - 1;
    const globalT = (navProgress / 100) * totalSegments;
    const segmentIndex = Math.min(Math.floor(globalT), totalSegments - 1);
    const segmentT = globalT - segmentIndex;

    const p1 = activeNavigationPath[segmentIndex];
    const p2 = activeNavigationPath[segmentIndex + 1];

    return {
      lat: p1.lat + (p2.lat - p1.lat) * segmentT,
      lng: p1.lng + (p2.lng - p1.lng) * segmentT
    };
  }, [activeNavigationPath, navProgress, currentOriginPos]);

  // Navigation simulation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isNavigating) {
      interval = setInterval(() => {
        setNavProgress((prev) => {
          if (prev >= 100) {
            showToast(`You have arrived at ${destLandmark.name}. +${Math.round(calculatedRoutes.distanceKm * 80)} Eco-Steps.`);
            setIsNavigating(false);
            return 0;
          }
          return prev + 2;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isNavigating, destLandmark.name, calculatedRoutes.distanceKm, showToast]);

  // All background network segments
  const { allCanopySegments, allNightSegments, allBarrierSegments } = useMemo(() => {
    return getAllTownshipNetworks();
  }, []);

  // Pan & Zoom Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on canvas background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'map-canvas') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom((prev) => Math.min(Math.max(0.65, prev * zoomFactor), 3.2));
  };

  const handleRecenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedLandmark(null);
    showToast('Map recentred on Central Park.');
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3.2, prev * 1.25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.65, prev * 0.8));
  };

  const handleReverseRoute = () => {
    setOriginId(destId);
    setDestId(originId);
    setCustomOriginPos(null);
    setCustomDestPos(null);
    setNavProgress(0);
    showToast(`Now walking from ${destLandmark.name} to ${originLandmark.name}.`);
  };

  const handleStartNav = () => {
    if (isNavigating) {
      setIsNavigating(false);
      setNavProgress(0);
      showToast('Walk ended.');
    } else {
      setIsNavigating(true);
      setNavProgress(0);
      showToast(`Walking from ${originLandmark.name} to ${destLandmark.name}: ${calculatedRoutes.distanceKm} km, about ${calculatedRoutes.walkingMinutes} min.`);
    }
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setIsScannerOpen(true);
    showToast('Scanning for shade, lighting and step-free paths nearby.');

    setTimeout(() => {
      setIsScanning(false);
      showToast(`Scan finished. ${SCANNED_ELMINA_PLACES.length} places found.`);
    }, 1200);
  };

  const handleFlyToScannedPlace = (place: ScannedTownshipPlace) => {
    const pt = projectPoint(place.position);
    // Pan so this place is centered
    const targetPanX = (MAP_WIDTH / 2 - pt.x) * 1.5;
    const targetPanY = (MAP_HEIGHT / 2 - pt.y) * 1.5;
    setZoom(1.5);
    setPan({ x: targetPanX, y: targetPanY });
    showToast(`${place.name}: ${place.canopyCoverage}% shade, ${place.luxLevel} lux, ${place.slopeGrade}% slope.`);
  };

  const handleRouteToScannedPlace = (place: ScannedTownshipPlace) => {
    const matched = LANDMARKS.find((l) => l.name.toLowerCase().includes(place.name.toLowerCase().slice(0, 8)));
    if (matched) {
      setDestId(matched.id);
    } else {
      setDestId('rainbow-bridge');
    }
    setCustomDestPos(place.position);
    setIsScannerOpen(false);
    setIsNavigating(true);
    setNavProgress(0);
    showToast(`Walking to ${place.name} by the shaded, step-free route.`);
  };

  // Center coordinate of origin and destination for camera centering
  const originProj = projectPoint(currentOriginPos);
  const destProj = projectPoint(currentDestPos);
  const walkerProj = projectPoint(currentWalkerPos);

  const theme = isNightMode ? BASE.night : mapType === 'satellite' ? BASE.terrain : BASE.day;
  const labelHalo = {
    paintOrder: 'stroke' as const,
    stroke: theme.halo,
    strokeWidth: 3,
    strokeLinejoin: 'round' as const
  };
  const etaMinutes = Math.max(1, Math.round(calculatedRoutes.walkingMinutes * (1 - navProgress / 100)));
  const kmLeft = ((calculatedRoutes.distanceKm * (100 - navProgress)) / 100).toFixed(2);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      className="relative w-full h-[calc(100dvh-3.5rem)] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ background: theme.land, touchAction: 'none' }}
      id="township-viewport"
    >
      {/* Base map: a drawn survey sheet of Elmina, panned and zoomed with the transform below. */}
      <div
        id="map-canvas"
        className="absolute inset-0 flex items-center justify-center origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '100%',
          height: '100%'
        }}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full object-contain pointer-events-auto"
          style={{ minWidth: '1200px', minHeight: '750px' }}
          role="group"
          aria-label="Map of the City of Elmina"
        >
          <defs>
            <radialGradient id="solarLightHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f5e6c4" stopOpacity={isNightMode ? '0.85' : '0.55'} />
              <stop offset="45%" stopColor="#e8a33a" stopOpacity={isNightMode ? '0.4' : '0.22'} />
              <stop offset="100%" stopColor="#e8a33a" stopOpacity="0" />
            </radialGradient>

            {/* Tree crowns, for canopy areas */}
            <pattern id="crowns" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="3.4" fill={theme.canopyLine} fillOpacity="0.38" />
              <circle cx="15" cy="14" r="3" fill={theme.canopyLine} fillOpacity="0.3" />
            </pattern>

            {/* Contour lines on the terrain base */}
            <pattern id="contourPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 0 30 Q 30 10, 60 30 T 120 30" fill="none" stroke="#9cc3a8" strokeWidth="0.8" opacity="0.18" />
              <path d="M 0 60 Q 30 40, 60 60 T 120 60" fill="none" stroke="#9cc3a8" strokeWidth="0.8" opacity="0.12" />
            </pattern>

            {/* Survey graticule */}
            <pattern id="townshipGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke={theme.grid} strokeWidth="1" />
            </pattern>

            {ROADS.map((r) => (
              <path key={r.id} id={r.id} d={r.d} />
            ))}
          </defs>

          {/* Land */}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={theme.land} />
          {mapType === 'satellite' && !isNightMode && (
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#contourPattern)" />
          )}
          {displayLayers.townshipMesh && <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#townshipGrid)" />}

          {/* Roads: an edge line under a lighter fill */}
          <g id="arterial-roads" strokeLinecap="round" fill="none">
            {ROADS.map((r) => (
              <g key={r.id}>
                <path d={r.d} stroke={theme.roadEdge} strokeWidth={r.w + 3} />
                <path d={r.d} stroke={theme.road} strokeWidth={r.w} />
                {r.centre && (
                  <path d={r.d} stroke={theme.roadEdge} strokeWidth="1.5" strokeDasharray="12 9" />
                )}
              </g>
            ))}
            {ROADS.filter((r) => r.label).map((r) => (
              <text
                key={`${r.id}-label`}
                fontSize="11"
                fontWeight="600"
                letterSpacing="1.2"
                fill={theme.roadText}
                dy="3.5"
              >
                <textPath href={`#${r.id}`} startOffset={r.labelAt ?? '50%'} textAnchor="middle">
                  {r.label}
                </textPath>
              </text>
            ))}
          </g>

          {/* Lakes and wetlands */}
          <g id="lakes-and-wetlands">
            <path
              d="M 520 280 C 600 250, 780 270, 880 340 C 960 400, 940 480, 850 510 C 740 540, 620 480, 560 420 C 510 370, 480 300, 520 280 Z"
              fill={theme.water}
              stroke={theme.waterLine}
              strokeWidth="2"
              className="cursor-pointer"
              onClick={() =>
                showToast('Central Park lake. The wetland can absorb a 100-year storm.')
              }
            />
            <path
              d="M 230 240 C 290 220, 360 250, 380 310 C 400 370, 340 410, 270 390 C 220 370, 200 280, 230 240 Z"
              fill={theme.water}
              stroke={theme.waterLine}
              strokeWidth="1.5"
            />
            <text x="745" y="448" textAnchor="middle" fontSize="13" fontStyle="italic" letterSpacing="2" fill={theme.waterText}>
              Central Park lake
            </text>
            <text x="298" y="322" textAnchor="middle" fontSize="12" fontStyle="italic" letterSpacing="1.5" fill={theme.waterText}>
              Marina
            </text>
          </g>

          {/* Canopy areas */}
          {displayLayers.canopy && (
            <g id="canopy-zones">
              {ELMINA_CANOPY_ZONES.map((zone) => {
                const polyPoints = zone.coordinates
                  .map(projectPoint)
                  .map((pt) => `${pt.x},${pt.y}`)
                  .join(' ');
                const onZone = () =>
                  showToast(
                    `${zone.name}: ${zone.coverage}% canopy, ${Math.abs(zone.tempReduction)}°C cooler.`
                  );
                return (
                  <g key={zone.id} className="cursor-pointer" {...asButton(zone.name, onZone)}>
                    <title>{zone.name}</title>
                    <polygon points={polyPoints} fill={theme.canopyFill} fillOpacity="0.92" />
                    <polygon
                      points={polyPoints}
                      fill="url(#crowns)"
                      stroke={theme.canopyLine}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Path network behind the active routes */}
          {displayLayers.townshipMesh && (
            <g id="township-infrastructure-mesh" fill="none" strokeLinecap="round">
              {displayLayers.canopy &&
                allCanopySegments.map((seg, i) => (
                  <path
                    key={`canopy-mesh-${i}`}
                    d={pointsToCurvedSvgPath(seg)}
                    stroke={theme.canopyLine}
                    strokeWidth="2.5"
                    strokeOpacity="0.32"
                  />
                ))}
              {displayLayers.nightLighting &&
                allNightSegments.map((seg, i) => (
                  <path
                    key={`night-mesh-${i}`}
                    d={pointsToCurvedSvgPath(seg)}
                    stroke="#e8a33a"
                    strokeWidth="2.5"
                    strokeOpacity="0.55"
                    strokeDasharray="7 6"
                    strokeLinecap="butt"
                  />
                ))}
              {displayLayers.barrierFree &&
                allBarrierSegments.map((seg, i) => (
                  <path
                    key={`barrier-mesh-${i}`}
                    d={pointsToCurvedSvgPath(seg)}
                    stroke="#2a5da8"
                    strokeWidth="2.5"
                    strokeOpacity="0.5"
                    strokeDasharray="0.1 7"
                  />
                ))}
            </g>
          )}

          {/* SafeNight lights */}
          {displayLayers.nightLighting && (
            <g id="safenight-light-posts">
              {SAFENIGHT_LIGHT_POSTS.map((post) => {
                const pt = projectPoint(post.position);
                const haloRadius = isNightMode ? post.radius * 0.9 : post.radius * 0.55;
                return (
                  <g
                    key={post.id}
                    className="cursor-pointer"
                    {...asButton(post.label, () =>
                      showToast(`${post.label}: ${post.lux} lux, warm 3000K solar LED, safe for birds and turtles.`)
                    )}
                  >
                    <circle cx={pt.x} cy={pt.y} r={haloRadius} fill="url(#solarLightHalo)" />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isNightMode ? 4.5 : 3.5}
                      fill="#f5e6c4"
                      stroke="#7a4f00"
                      strokeWidth="1.2"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Step-free points: a ramp symbol */}
          {displayLayers.barrierFree && (
            <g id="barrier-free-nodes">
              {BARRIER_FREE_NODES.map((node) => {
                const pt = projectPoint(node.position);
                return (
                  <g
                    key={node.id}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer"
                    {...asButton(node.title, () => showToast(`${node.title}: ${node.desc}`))}
                  >
                    <circle r="10" fill="#2a5da8" stroke={theme.halo} strokeWidth="2" />
                    <path d="M -4.5 3.5 L 4.5 3.5 L 4.5 -3.5 Z" fill="#fff" />
                  </g>
                );
              })}
            </g>
          )}

          {/* Routes: solid for shade, dashed for lit, dotted for step-free */}
          {displayLayers.routes && (
            <g id="active-navigation-paths" fill="none" strokeLinejoin="round">
              {displayLayers.barrierFree && calculatedRoutes.barrierPath.length > 1 && (
                <g>
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.barrierPath)}
                    stroke={theme.halo}
                    strokeWidth={selectedRoutePreference === 'barrier' ? 14 : 10}
                    strokeLinecap="round"
                    strokeOpacity="0.9"
                  />
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.barrierPath)}
                    stroke={PATH_STYLE.barrier.color}
                    strokeWidth={selectedRoutePreference === 'barrier' ? 8 : 5}
                    strokeLinecap={PATH_STYLE.barrier.cap}
                    strokeDasharray={PATH_STYLE.barrier.dash}
                    className="cursor-pointer"
                    onClick={() =>
                      showToast(`Step-free route: up to ${calculatedRoutes.maxGradePercent}% slope and no stairs.`)
                    }
                  />
                </g>
              )}

              {displayLayers.nightLighting && calculatedRoutes.nightPath.length > 1 && (
                <g>
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.nightPath)}
                    stroke={theme.halo}
                    strokeWidth={selectedRoutePreference === 'night' ? 14 : 10}
                    strokeLinecap="round"
                    strokeOpacity="0.9"
                  />
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.nightPath)}
                    stroke={PATH_STYLE.night.color}
                    strokeWidth={selectedRoutePreference === 'night' ? 8 : 5}
                    strokeLinecap={PATH_STYLE.night.cap}
                    strokeDasharray={PATH_STYLE.night.dash}
                    className="cursor-pointer"
                    onClick={() =>
                      showToast(`SafeNight route: ${calculatedRoutes.nightLux} lux, lit all the way.`)
                    }
                  />
                </g>
              )}

              {displayLayers.canopy && calculatedRoutes.shadePath.length > 1 && (
                <g>
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.shadePath)}
                    stroke={theme.halo}
                    strokeWidth={selectedRoutePreference === 'shade' ? 14 : 10}
                    strokeLinecap="round"
                    strokeOpacity="0.9"
                  />
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.shadePath)}
                    stroke={PATH_STYLE.shade.color}
                    strokeWidth={selectedRoutePreference === 'shade' ? 8 : 5}
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() =>
                      showToast(
                        `Shade route: ${calculatedRoutes.shadePercent}% shaded, ${calculatedRoutes.temperatureRelief} cooler.`
                      )
                    }
                  />
                </g>
              )}
            </g>
          )}

          {/* Rainbow Bridge */}
          <g
            id="rainbow-bridge-span"
            className="cursor-pointer"
            {...asButton('Elmina Rainbow Bridge', () => onOpenEduModal(EDUCATIONAL_PINS[0]))}
          >
            <path d="M 680 345 Q 720 305, 760 335" fill="none" stroke={theme.halo} strokeWidth="9" strokeLinecap="round" />
            <path d="M 680 345 Q 720 305, 760 335" fill="none" stroke={theme.label} strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Learning points */}
          {displayLayers.eduPins && (
            <g id="educational-pins">
              {EDUCATIONAL_PINS.map((pin) => {
                const pt = projectPoint(pin.position);
                return (
                  <g
                    key={pin.id}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer"
                    {...asButton(pin.name, () => onOpenEduModal(pin))}
                  >
                    <circle r="11" fill={theme.halo} stroke={theme.canopyLine} strokeWidth="2.5" />
                    <text textAnchor="middle" dy="4.5" fontSize="13" fontWeight="700" fill={theme.canopyLine}>
                      i
                    </text>
                    <title>{pin.name}</title>
                  </g>
                );
              })}
            </g>
          )}

          {/* You are here */}
          {isNavigating && (
            <g id="live-walker-avatar" transform={`translate(${walkerProj.x}, ${walkerProj.y})`}>
              <circle r="20" fill="none" stroke={theme.label} strokeWidth="1.5" strokeOpacity="0.35" />
              <circle r="10" fill={theme.label} stroke={theme.halo} strokeWidth="3" />
              <g transform="translate(0, -30)">
                <rect x="-44" y="-12" width="88" height="22" rx="3" fill="#17292b" />
                <text textAnchor="middle" dy="3.5" fontSize="12" fontWeight="600" fill="#fafaf6">
                  {navProgress}% walked
                </text>
              </g>
            </g>
          )}

          {/* Places. A is where you start, B is where you are going. */}
          {displayLayers.landmarks && (
            <g id="township-landmarks">
              {LANDMARKS.map((lm) => {
                const isOrigin = lm.id === originId;
                const isDest = lm.id === destId;
                const pos = isOrigin ? currentOriginPos : isDest ? currentDestPos : lm.position;
                const pt = projectPoint(pos);
                const name = lm.name.length > 30 ? `${lm.name.slice(0, 28)}…` : lm.name;

                return (
                  <g
                    key={lm.id}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer"
                    {...asButton(lm.name, () => setSelectedLandmark(lm))}
                  >
                    {isOrigin ? (
                      <>
                        <circle r="12" fill={theme.label} stroke={theme.halo} strokeWidth="2.5" />
                        <text textAnchor="middle" dy="4.5" fontSize="13" fontWeight="700" fill={theme.halo}>
                          A
                        </text>
                      </>
                    ) : isDest ? (
                      <>
                        <rect x="-12" y="-12" width="24" height="24" rx="3" fill={theme.label} stroke={theme.halo} strokeWidth="2.5" />
                        <text textAnchor="middle" dy="4.5" fontSize="13" fontWeight="700" fill={theme.halo}>
                          B
                        </text>
                      </>
                    ) : (
                      <circle r="6" fill={theme.halo} stroke={theme.label} strokeWidth="2.5" />
                    )}
                    <text
                      x={isOrigin || isDest ? 18 : 12}
                      y="4.5"
                      fontSize={isOrigin || isDest ? 13 : 12}
                      fontWeight={isOrigin || isDest ? 700 : 600}
                      fill={theme.label}
                      {...labelHalo}
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Top left: where from, where to */}
      {!isCleanMapMode && (
        <div className="absolute top-3 left-3 right-3 sm:left-5 sm:right-5 z-30 flex flex-wrap items-start justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto overlay flex items-stretch">
            <WaypointPicker
              kind="origin"
              landmark={originLandmark}
              open={showWaypointPicker === 'origin'}
              onToggle={() => setShowWaypointPicker(showWaypointPicker === 'origin' ? null : 'origin')}
              options={LANDMARKS.filter((l) => l.id !== destId)}
              onPick={(lm) => {
                setOriginId(lm.id);
                setCustomOriginPos(null);
                setShowWaypointPicker(null);
                showToast(`Starting from ${lm.name}.`);
              }}
            />
            <button
              type="button"
              onClick={handleReverseRoute}
              className="icon-btn !w-11 !h-auto border-x border-rule"
              aria-label="Swap start and destination"
              title="Swap start and destination"
            >
              <Icon name="swap_horiz" size={19} />
            </button>
            <WaypointPicker
              kind="dest"
              landmark={destLandmark}
              open={showWaypointPicker === 'dest'}
              onToggle={() => setShowWaypointPicker(showWaypointPicker === 'dest' ? null : 'dest')}
              options={LANDMARKS.filter((l) => l.id !== originId)}
              onPick={(lm) => {
                setDestId(lm.id);
                setCustomDestPos(null);
                setShowWaypointPicker(null);
                showToast(`Heading to ${lm.name}.`);
              }}
            />
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button type="button" onClick={handleTriggerScan} className="btn btn-primary shadow-md" aria-label="Scan area" title="Find shaded, lit and step-free places nearby">
              <Icon name="radar" size={17} />
              <span className="hidden sm:inline">Scan area</span>
            </button>
            <button
              type="button"
              onClick={() => setShowDisplayOptionsModal(!showDisplayOptionsModal)}
              aria-pressed={showDisplayOptionsModal}
              aria-label="Map layers"
              className="map-btn !w-auto px-3 gap-2 text-[14px] font-semibold !h-10"
            >
              <Icon name="layers" size={17} />
              <span className="hidden md:inline">Layers</span>
            </button>
            <button
              type="button"
              onClick={onOpenRewardsModal}
              className="map-btn !w-auto px-3 gap-2 text-[14px] font-semibold !h-10"
              title="Open your rewards pass"
            >
              <Icon name="eco" size={17} />
              <span className="num">{userPoints.toLocaleString()} pts</span>
            </button>
          </div>
        </div>
      )}

      {/* Route options */}
      {!isCleanMapMode && isRouteCardVisible && (
        <div className="absolute top-[7.25rem] sm:top-20 left-3 sm:left-5 z-20 w-[calc(100vw-4.75rem)] sm:w-[26rem] max-w-full">
          <DraggableCard
            title="Route options"
            badge={`${calculatedRoutes.distanceKm} km, ${calculatedRoutes.walkingMinutes} min`}
            isMinimized={isRouteCardMinimized}
            onToggleMinimize={() => setIsRouteCardMinimized(!isRouteCardMinimized)}
            onClose={() => setIsRouteCardVisible(false)}
            minimizedContent={
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold truncate">
                  {originLandmark.name} to {destLandmark.name}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRouteCardMinimized(false)}
                  className="font-semibold underline underline-offset-2 shrink-0"
                >
                  Expand
                </button>
              </div>
            }
          >
            <div className="p-3 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Route type">
                {[
                  {
                    id: 'shade' as const,
                    label: 'Shade',
                    kind: 'solid' as const,
                    color: '#1e6b45',
                    value: `${calculatedRoutes.shadePercent}%`,
                    note: `${calculatedRoutes.temperatureRelief} cooler`,
                    onPick: () => {
                      setSelectedRoutePreference('shade');
                      setDisplayLayers((prev) => ({ ...prev, canopy: true, routes: true }));
                      showToast(
                        `Shade route: ${calculatedRoutes.shadePercent}% shaded, ${calculatedRoutes.temperatureRelief} cooler.`
                      );
                    }
                  },
                  {
                    id: 'night' as const,
                    label: 'SafeNight',
                    kind: 'dash' as const,
                    color: '#e8a33a',
                    value: `${calculatedRoutes.nightLux} lx`,
                    note: 'Lit all the way',
                    onPick: () => {
                      setSelectedRoutePreference('night');
                      setDisplayLayers((prev) => ({ ...prev, nightLighting: true, routes: true }));
                      if (!isNightMode) setIsNightMode(true);
                      showToast(`SafeNight route: ${calculatedRoutes.nightLux} lux, lit all the way.`);
                    }
                  },
                  {
                    id: 'barrier' as const,
                    label: 'Step-free',
                    kind: 'dot' as const,
                    color: '#2a5da8',
                    value: `${calculatedRoutes.maxGradePercent}%`,
                    note: 'No stairs',
                    onPick: () => {
                      setSelectedRoutePreference('barrier');
                      setDisplayLayers((prev) => ({ ...prev, barrierFree: true, routes: true }));
                      showToast(`Step-free route: up to ${calculatedRoutes.maxGradePercent}% slope and no stairs.`);
                    }
                  }
                ].map((m) => {
                  const active = selectedRoutePreference === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={m.onPick}
                      aria-pressed={active}
                      className={`text-left p-2.5 border rounded-sm transition-colors ${
                        active ? 'border-ink bg-wash' : 'border-rule hover:bg-wash/60'
                      }`}
                    >
                      <Swatch kind={m.kind} color={m.color} />
                      <span className="block mt-1.5 text-[14px] font-semibold leading-tight">{m.label}</span>
                      <span className="block figure text-[22px] mt-1">{m.value}</span>
                      <span className="block text-[12px] text-ink-2 leading-tight mt-1">{m.note}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <p className="reading-label mb-1.5">Shade along the {calculatedRoutes.distanceKm} km walk</p>
                <ShadeStrip
                  distanceKm={calculatedRoutes.distanceKm}
                  shadePercent={calculatedRoutes.shadePercent}
                  height={16}
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-rule">
                <button
                  type="button"
                  aria-pressed={selectedRoutePreference === 'all'}
                  onClick={() => {
                    setSelectedRoutePreference('all');
                    setDisplayLayers((prev) => ({
                      ...prev,
                      canopy: true,
                      nightLighting: true,
                      barrierFree: true,
                      routes: true
                    }));
                    showToast('Showing all three routes.');
                  }}
                  className={`btn btn-sm ${selectedRoutePreference === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Show all three
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayLayers((prev) => ({ ...prev, routes: !prev.routes }))}
                  className="btn btn-quiet btn-sm"
                >
                  <Icon name={displayLayers.routes ? 'visibility' : 'visibility_off'} size={16} />
                  {displayLayers.routes ? 'Hide lines' : 'Show lines'}
                </button>
              </div>
            </div>
          </DraggableCard>
        </div>
      )}

      {/* Layers */}
      {showDisplayOptionsModal && (
        <div className="rise-in overlay absolute top-[7.25rem] sm:top-16 right-3 sm:right-[4.25rem] z-40 w-72 max-w-[calc(100vw-1.5rem)]">
          <div className="flex items-center justify-between pl-4 pr-1 h-11 border-b border-rule">
            <h2 className="text-[17px]">Map layers</h2>
            <button
              type="button"
              onClick={() => setShowDisplayOptionsModal(false)}
              className="icon-btn !w-9 !h-9"
              aria-label="Close layers"
            >
              <Icon name="close" size={17} />
            </button>
          </div>

          <ul className="py-1">
            {LAYER_ITEMS.map((item) => (
              <li key={item.key}>
                <label className="flex items-center gap-3 px-4 min-h-10 cursor-pointer hover:bg-wash/60 text-[15px]">
                  <input
                    type="checkbox"
                    checked={displayLayers[item.key]}
                    onChange={(e) => setDisplayLayers({ ...displayLayers, [item.key]: e.target.checked })}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <Swatch kind={item.kind} color={item.color} />
                  <span>{item.label}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between px-3 py-2 border-t border-rule">
            <button
              type="button"
              onClick={() => {
                setDisplayLayers({
                  canopy: true,
                  nightLighting: true,
                  barrierFree: true,
                  townshipMesh: true,
                  routes: true,
                  landmarks: true,
                  eduPins: true
                });
              }}
              className="btn btn-quiet btn-sm"
            >
              Show all
            </button>
            <button
              type="button"
              onClick={() => {
                setDisplayLayers({
                  canopy: false,
                  nightLighting: false,
                  barrierFree: false,
                  townshipMesh: false,
                  routes: false,
                  landmarks: false,
                  eduPins: false
                });
              }}
              className="btn btn-quiet btn-sm"
            >
              Hide all
            </button>
          </div>
        </div>
      )}

      {/* Map tools */}
      <div
        className="absolute right-3 sm:right-5 top-[7.25rem] sm:top-16 flex flex-col gap-2 z-30 pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            setIsCleanMapMode(!isCleanMapMode);
            showToast(isCleanMapMode ? 'Panels restored.' : 'Clean map: panels hidden.');
          }}
          aria-pressed={isCleanMapMode}
          className="map-btn"
          aria-label={isCleanMapMode ? 'Show panels' : 'Hide panels for a clean map'}
          title={isCleanMapMode ? 'Show panels' : 'Hide panels'}
        >
          <Icon name={isCleanMapMode ? 'fullscreen_exit' : 'fullscreen'} size={20} />
        </button>

        <div className="flex flex-col">
          <button type="button" onClick={handleZoomIn} className="map-btn !rounded-b-none" aria-label="Zoom in" title="Zoom in">
            <Icon name="add" size={20} />
          </button>
          <button type="button" onClick={handleZoomOut} className="map-btn !rounded-none !border-t-0" aria-label="Zoom out" title="Zoom out">
            <Icon name="remove" size={20} />
          </button>
          <button type="button" onClick={handleRecenter} className="map-btn !rounded-t-none !border-t-0" aria-label="Recentre on Central Park" title="Recentre on Central Park">
            <Icon name="my_location" size={19} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
            setMapType(nextType);
            showToast(nextType === 'satellite' ? 'Terrain map on.' : 'Street map on.');
          }}
          aria-pressed={mapType === 'satellite'}
          className="map-btn"
          aria-label="Terrain map"
          title="Terrain map"
        >
          <Icon name="satellite_alt" size={20} />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsNightMode(!isNightMode);
            showToast(isNightMode ? 'Day map on.' : 'Night map on. SafeNight lights are highlighted.');
          }}
          aria-pressed={isNightMode}
          className="map-btn"
          aria-label="Night map"
          title="Night map"
        >
          <Icon name={isNightMode ? 'dark_mode' : 'light_mode'} size={20} />
        </button>

        {!isRouteCardVisible && !isCleanMapMode && (
          <button
            type="button"
            onClick={() => setIsRouteCardVisible(true)}
            className="map-btn"
            aria-label="Show route options"
            title="Show route options"
          >
            <Icon name="route" size={20} />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenReportModal}
          className="map-btn !text-laterite-ink"
          aria-label="Report a path problem"
          title="Report a path problem"
        >
          <Icon name="report_problem" size={20} />
        </button>
      </div>

      {/* Walking now, or start walking */}
      {isNavigating ? (
        <div
          role="status"
          className="rise-in absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-1.5rem)] max-w-xl bg-ink text-paper rounded-md shadow-lg px-4 py-3 flex items-center justify-between gap-4 pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="min-w-0">
            <p className="font-display text-[22px] font-semibold leading-tight truncate" style={{ fontStretch: '82%' }}>
              Walking to {destLandmark.name}
            </p>
            <p className="mt-1 flex flex-wrap gap-x-4 text-[14px] text-paper/80 num">
              <span>{etaMinutes} min left</span>
              <span>{kmLeft} km left</span>
              <span>{calculatedRoutes.shadePercent}% shaded</span>
              <span>{calculatedRoutes.stepCount === 0 ? 'No stairs' : `${calculatedRoutes.stepCount} stairs`}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNavigating(false)}
            className="btn btn-sm border-paper/40 text-paper hover:bg-paper/10 shrink-0"
          >
            End walk
          </button>
        </div>
      ) : (
        !isCleanMapMode && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-2"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={handleStartNav} className="btn btn-primary shadow-lg !min-h-12 px-6 text-[15px]">
              <Icon name="directions_walk" size={19} />
              Start walk to {destLandmark.name}
            </button>
          </div>
        )
      )}

      {/* Place details */}
      {selectedLandmark && (
        <div
          className="rise-in overlay absolute bottom-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-sm p-4 pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[24px]">{selectedLandmark.name}</h2>
              <p className="text-[14px] text-ink-2">{selectedLandmark.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedLandmark(null)}
              className="icon-btn !w-9 !h-9 -mr-2 -mt-1"
              aria-label="Close details"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <p className="mt-2 text-[14px] text-ink-2 leading-relaxed">{selectedLandmark.description}</p>

          <dl className="mt-3 grid grid-cols-3 border-y border-rule">
            <div className="py-2 pr-2">
              <dt className="text-[13px] text-ink-2">Shade</dt>
              <dd className="figure text-[24px] text-canopy mt-0.5">{selectedLandmark.shadeScore}%</dd>
            </div>
            <div className="py-2 px-3 border-l border-rule">
              <dt className="text-[13px] text-ink-2">Lighting</dt>
              <dd className="figure text-[24px] text-lamp-ink mt-0.5">{selectedLandmark.lightScore}%</dd>
            </div>
            <div className="py-2 pl-3 border-l border-rule">
              <dt className="text-[13px] text-ink-2">Step-free</dt>
              <dd className="figure text-[24px] text-ramp mt-0.5">{selectedLandmark.barrierFreeScore}%</dd>
            </div>
          </dl>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setOriginId(selectedLandmark.id);
                setCustomOriginPos(null);
                setSelectedLandmark(null);
                showToast(`Starting from ${selectedLandmark.name}.`);
              }}
              className={`btn flex-1 ${originId === selectedLandmark.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              Start here
            </button>
            <button
              type="button"
              onClick={() => {
                setDestId(selectedLandmark.id);
                setCustomDestPos(null);
                setSelectedLandmark(null);
                showToast(`Heading to ${selectedLandmark.name}.`);
              }}
              className={`btn flex-1 ${destId === selectedLandmark.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              Go here
            </button>
          </div>
        </div>
      )}

      <TownshipScannerDrawer
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        isScanning={isScanning}
        onTriggerScan={handleTriggerScan}
        scannedPlaces={scannedPlaces}
        onFlyToPlace={handleFlyToScannedPlace}
        onRouteToPlace={handleRouteToScannedPlace}
      />
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Small pieces used only by the map
--------------------------------------------------------------------------- */

const ROADS: { id: string; d: string; w: number; label?: string; labelAt?: string; centre?: boolean }[] = [
  { id: 'road-e35', d: 'M 180 50 Q 220 350, 310 650 T 420 950', w: 24, label: 'Guthrie Corridor Expressway (E35)', labelAt: '22%', centre: true },
  { id: 'road-elmina', d: 'M 120 320 Q 550 300, 950 360 T 1500 520', w: 18, label: 'Persiaran Elmina', labelAt: '62%' },
  { id: 'road-atmosfera', d: 'M 450 310 L 480 660 L 520 850', w: 14, label: 'Persiaran Atmosfera', labelAt: '60%' },
  { id: 'road-valley', d: 'M 310 650 Q 600 780, 950 720 T 1300 620', w: 12 }
];

type LayerKey = 'canopy' | 'nightLighting' | 'barrierFree' | 'townshipMesh' | 'routes' | 'landmarks' | 'eduPins';
type SwatchKind = 'area' | 'solid' | 'dash' | 'dot' | 'pin' | 'plain';

const LAYER_ITEMS: { key: LayerKey; label: string; kind: SwatchKind; color: string }[] = [
  { key: 'canopy', label: 'Tree canopy', kind: 'area', color: '#1e6b45' },
  { key: 'nightLighting', label: 'SafeNight lighting', kind: 'dash', color: '#e8a33a' },
  { key: 'barrierFree', label: 'Step-free paths', kind: 'dot', color: '#2a5da8' },
  { key: 'townshipMesh', label: 'Path network and grid', kind: 'plain', color: '#5c6c6f' },
  { key: 'routes', label: 'Route lines', kind: 'solid', color: '#17292b' },
  { key: 'landmarks', label: 'Places', kind: 'pin', color: '#17292b' },
  { key: 'eduPins', label: 'Learning points', kind: 'pin', color: '#1e6b45' }
];

/** A tiny sample of how a layer is drawn on the map. */
const Swatch: React.FC<{ kind: SwatchKind; color: string }> = ({ kind, color }) => (
  <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true" className="shrink-0">
    {kind === 'area' && (
      <rect x="1" y="1" width="24" height="10" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5" />
    )}
    {kind === 'solid' && <line x1="2" y1="6" x2="24" y2="6" stroke={color} strokeWidth="4" strokeLinecap="round" />}
    {kind === 'dash' && <line x1="1" y1="6" x2="25" y2="6" stroke={color} strokeWidth="4" strokeDasharray="6 4" />}
    {kind === 'dot' && (
      <line x1="3" y1="6" x2="23" y2="6" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 6.5" />
    )}
    {kind === 'pin' && <circle cx="13" cy="6" r="4.5" fill="#fafaf6" stroke={color} strokeWidth="2" />}
    {kind === 'plain' && <line x1="1" y1="6" x2="25" y2="6" stroke={color} strokeWidth="1.5" strokeDasharray="2 4" />}
  </svg>
);

interface WaypointPickerProps {
  kind: 'origin' | 'dest';
  landmark: Landmark;
  open: boolean;
  onToggle: () => void;
  options: Landmark[];
  onPick: (lm: Landmark) => void;
}

const WaypointPicker: React.FC<WaypointPickerProps> = ({ kind, landmark, open, onToggle, options, onPick }) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="h-full text-left px-3 py-1.5 min-w-[7.5rem] max-w-[11rem] sm:max-w-[14rem] hover:bg-wash transition-colors"
    >
      <span className="block text-[12px] leading-tight text-ink-2">{kind === 'origin' ? 'From' : 'To'}</span>
      <span className="block text-[15px] font-semibold leading-tight truncate">{landmark.name}</span>
    </button>

    {open && (
      <div className="rise-in overlay absolute left-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] z-50">
        <h2 className="px-4 pt-3 pb-2 text-[17px]">{kind === 'origin' ? 'Start from' : 'Walk to'}</h2>
        <ul className="max-h-64 overflow-y-auto border-t border-rule divide-y divide-rule">
          {options.map((lm) => (
            <li key={lm.id}>
              <button
                type="button"
                onClick={() => onPick(lm)}
                className="w-full text-left px-4 py-2.5 hover:bg-wash flex items-baseline justify-between gap-3"
              >
                <span>
                  <span className="block text-[15px] font-semibold leading-snug">{lm.name}</span>
                  <span className="block text-[13px] text-ink-2 leading-snug">{lm.subtitle}</span>
                </span>
                <span className="shrink-0 text-[13px] text-ink-2 num">
                  {kind === 'origin' ? `${lm.shadeScore}% shade` : `${lm.lightScore}% lit`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
