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
  const [isRouteCardMinimized, setIsRouteCardMinimized] = useState(false);
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
            showToast(`Destination Reached: ${destLandmark.name}! +${Math.round(calculatedRoutes.distanceKm * 80)} Eco-Steps awarded!`);
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
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'map-canvas') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
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
    showToast('Centered on City of Elmina Central Park & Rainbow Bridge.');
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
    showToast(`Route reversed: ${destLandmark.name} ↔ ${originLandmark.name}`);
  };

  const handleStartNav = () => {
    if (isNavigating) {
      setIsNavigating(false);
      setNavProgress(0);
      showToast('Walk navigation ended.');
    } else {
      setIsNavigating(true);
      setNavProgress(0);
      showToast(`Navigation active: ${originLandmark.name} → ${destLandmark.name} (${calculatedRoutes.distanceKm} km, ~${calculatedRoutes.walkingMinutes} mins)!`);
    }
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setIsScannerOpen(true);
    showToast('LiDAR Radar Scanning Elmina precincts for canopies, solar smart lights & step-free paths...');

    setTimeout(() => {
      setIsScanning(false);
      showToast(`Scan complete: Identified ${SCANNED_ELMINA_PLACES.length} certified biophilic locations!`);
    }, 1200);
  };

  const handleFlyToScannedPlace = (place: ScannedTownshipPlace) => {
    const pt = projectPoint(place.position);
    // Pan so this place is centered
    const targetPanX = (MAP_WIDTH / 2 - pt.x) * 1.5;
    const targetPanY = (MAP_HEIGHT / 2 - pt.y) * 1.5;
    setZoom(1.5);
    setPan({ x: targetPanX, y: targetPanY });
    showToast(`Focused on: ${place.name} (${place.canopyCoverage}% Canopy, ${place.luxLevel} Lux, ${place.slopeGrade}% Slope)`);
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
    showToast(`Routing to ${place.name} via optimal shaded & barrier-free corridor!`);
  };

  // Center coordinate of origin and destination for camera centering
  const originProj = projectPoint(currentOriginPos);
  const destProj = projectPoint(currentDestPos);
  const walkerProj = projectPoint(currentWalkerPos);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-[calc(100vh-5.75rem)] overflow-hidden select-none transition-colors duration-700 cursor-grab active:cursor-grabbing ${
        isNightMode ? 'bg-[#0d1527]' : mapType === 'satellite' ? 'bg-[#18261f]' : 'bg-[#eaf1ed]'
      }`}
      id="township-viewport"
    >
      {/* ========================================================================= */}
      {/* HIGH-FIDELITY INTERACTIVE VECTOR TOWNSHIP MAP ENGINE (SVG & GIS CANVAS)   */}
      {/* ========================================================================= */}
      <div
        id="map-canvas"
        className="absolute inset-0 flex items-center justify-center transition-transform duration-75 origin-center"
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
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="lakeGradientDay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b4e4dd" />
              <stop offset="50%" stopColor="#81d3c5" />
              <stop offset="100%" stopColor="#62c4b4" />
            </linearGradient>

            <linearGradient id="lakeGradientNight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b2c28" />
              <stop offset="50%" stopColor="#073a34" />
              <stop offset="100%" stopColor="#04231f" />
            </linearGradient>

            <linearGradient id="shadeGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#006948" />
              <stop offset="100%" stopColor="#85f8c4" />
            </linearGradient>

            <linearGradient id="nightGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb95f" />
              <stop offset="100%" stopColor="#ffddb8" />
            </linearGradient>

            <linearGradient id="barrierGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#005137" />
              <stop offset="100%" stopColor="#ffaa44" />
            </linearGradient>

            {/* Radial Gradients for SafeNight Solar Pillars */}
            <radialGradient id="solarLightHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffddb8" stopOpacity={isNightMode ? "0.9" : "0.6"} />
              <stop offset="40%" stopColor="#ffb95f" stopOpacity={isNightMode ? "0.45" : "0.25"} />
              <stop offset="100%" stopColor="#ffb95f" stopOpacity="0" />
            </radialGradient>

            {/* Radial Gradient for Walker Position Pulse */}
            <radialGradient id="walkerPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#85f8c4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#006948" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#006948" stopOpacity="0" />
            </radialGradient>

            {/* Topographic Contour Pattern for Satellite Mode */}
            <pattern id="contourPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 0 30 Q 30 10, 60 30 T 120 30" fill="none" stroke="#2a4535" strokeWidth="0.8" opacity="0.3" />
              <path d="M 0 60 Q 30 40, 60 60 T 120 60" fill="none" stroke="#2a4535" strokeWidth="0.8" opacity="0.2" />
            </pattern>

            {/* Township Green Mesh Grid */}
            <pattern id="townshipGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="none" stroke={isNightMode ? "#1a2540" : "#d8e6df"} strokeWidth="1" strokeDasharray="3 3" />
            </pattern>
          </defs>

          {/* 1. BASE BACKGROUND & TERRAIN */}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={isNightMode ? "#0d1527" : mapType === 'satellite' ? "#14251b" : "#edf5f0"} />

          {/* Optional Satellite Contour lines */}
          {mapType === 'satellite' && (
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#contourPattern)" />
          )}

          {/* Background Township Grid Mesh */}
          {displayLayers.townshipMesh && (
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#townshipGrid)" opacity={isNightMode ? 0.6 : 0.8} />
          )}

          {/* 2. REGIONAL HIGHWAY & ARTERIAL CORRIDORS (Guthrie Corridor Expressway & Persiaran Elmina) */}
          <g id="arterial-roads" opacity={isNightMode ? 0.7 : 0.85}>
            {/* Guthrie Corridor Expressway (E35) on the west */}
            <path
              d="M 180 50 Q 220 350, 310 650 T 420 950"
              fill="none"
              stroke={isNightMode ? "#253352" : mapType === 'satellite' ? "#2d3b32" : "#cfded5"}
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M 180 50 Q 220 350, 310 650 T 420 950"
              fill="none"
              stroke={isNightMode ? "#ffddb8" : "#fbf0d8"}
              strokeWidth="2"
              strokeDasharray="12 8"
            />

            {/* Persiaran Elmina East-West Spine */}
            <path
              d="M 120 320 Q 550 300, 950 360 T 1500 520"
              fill="none"
              stroke={isNightMode ? "#1e2a44" : mapType === 'satellite' ? "#27372b" : "#dceae1"}
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Persiaran Atmosfera to Sports Park */}
            <path
              d="M 450 310 L 480 660 L 520 850"
              fill="none"
              stroke={isNightMode ? "#1e2a44" : mapType === 'satellite' ? "#27372b" : "#dceae1"}
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Elmina Valley Connector Loop */}
            <path
              d="M 310 650 Q 600 780, 950 720 T 1300 620"
              fill="none"
              stroke={isNightMode ? "#1a253e" : mapType === 'satellite' ? "#243328" : "#e2ede6"}
              strokeWidth="12"
              strokeLinecap="round"
            />
          </g>

          {/* 3. CENTRAL PARK BIORETENTION LAKES & WETLANDS */}
          <g id="lakes-and-wetlands">
            {/* Central Park North Lake & Bioretention basin */}
            <path
              d="M 520 280 C 600 250, 780 270, 880 340 C 960 400, 940 480, 850 510 C 740 540, 620 480, 560 420 C 510 370, 480 300, 520 280 Z"
              fill={isNightMode ? "url(#lakeGradientNight)" : "url(#lakeGradientDay)"}
              stroke={isNightMode ? "#006948" : "#56bbae"}
              strokeWidth="2"
              opacity={isNightMode ? 0.85 : 0.95}
              className="cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => showToast('Elmina Central Park Wetland Lake: 100-year storm sponge capacity & bioretention reed beds.')}
            />

            {/* Lakeside Mall Waterfront Marina Bay */}
            <path
              d="M 230 240 C 290 220, 360 250, 380 310 C 400 370, 340 410, 270 390 C 220 370, 200 280, 230 240 Z"
              fill={isNightMode ? "url(#lakeGradientNight)" : "url(#lakeGradientDay)"}
              stroke={isNightMode ? "#006948" : "#56bbae"}
              strokeWidth="1.5"
              opacity={0.8}
            />

            {/* Water Ripple Details */}
            <ellipse cx="720" cy="380" rx="90" ry="25" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity={isNightMode ? 0.15 : 0.4} />
            <ellipse cx="780" cy="420" rx="60" ry="18" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity={isNightMode ? 0.12 : 0.3} />
          </g>

          {/* 4. CANOPY FORESTRY ZONES (POLYGONS ACROSS ELMINA) */}
          {displayLayers.canopy && (
            <g id="canopy-zones">
              {ELMINA_CANOPY_ZONES.map((zone) => {
                const polyPoints = zone.coordinates.map(projectPoint).map((pt) => `${pt.x},${pt.y}`).join(' ');
                return (
                  <polygon
                    key={zone.id}
                    points={polyPoints}
                    fill={isNightMode ? '#003a27' : zone.color}
                    fillOpacity={isNightMode ? 0.35 : 0.22}
                    stroke={zone.color}
                    strokeWidth={isNightMode ? 2 : 1.5}
                    strokeDasharray="6 3"
                    className="cursor-pointer transition-all hover:fill-opacity-50"
                    onClick={() =>
                      showToast(`${zone.name}: ${zone.coverage}% Canopy Coverage • ${zone.tempReduction}°C Thermal Relief`)
                    }
                  >
                    <title>{zone.name}</title>
                  </polygon>
                );
              })}
            </g>
          )}

          {/* 5. BACKGROUND TOWNSHIP CONNECTOR NETWORKS */}
          {displayLayers.townshipMesh && (
            <g id="township-infrastructure-mesh">
              {/* Shaded Canopy Mesh Network */}
              {displayLayers.canopy &&
                allCanopySegments.map((seg, i) => (
                  <path
                    key={`canopy-mesh-${i}`}
                    d={pointsToCurvedSvgPath(seg)}
                    fill="none"
                    stroke={isNightMode ? '#00855d' : '#22996d'}
                    strokeWidth={isNightMode ? 4 : 3}
                    strokeOpacity={isNightMode ? 0.4 : 0.3}
                    strokeDasharray="4 2"
                  />
                ))}

              {/* SafeNight Lighting Mesh Network */}
              {displayLayers.nightLighting &&
                allNightSegments.map((seg, i) => (
                  <path
                    key={`night-mesh-${i}`}
                    d={pointsToCurvedSvgPath(seg)}
                    fill="none"
                    stroke="#ffb95f"
                    strokeWidth={isNightMode ? 3.5 : 2.5}
                    strokeOpacity={isNightMode ? 0.6 : 0.35}
                    strokeDasharray="3 3"
                  />
                ))}

              {/* Barrier-Free Step-Free Mesh Network */}
              {displayLayers.barrierFree &&
                allBarrierSegments.map((seg, i) => (
                  <path
                    key={`barrier-mesh-${i}`}
                    d={pointsToCurvedSvgPath(seg)}
                    fill="none"
                    stroke="#005137"
                    strokeWidth={isNightMode ? 3 : 2}
                    strokeOpacity={0.4}
                  />
                ))}
            </g>
          )}

          {/* 6. SAFENIGHT SOLAR SMART LIGHTING HALOS & POSTS */}
          {displayLayers.nightLighting && (
            <g id="safenight-light-posts">
              {SAFENIGHT_LIGHT_POSTS.map((post) => {
                const pt = projectPoint(post.position);
                const haloRadius = isNightMode ? post.radius * 0.9 : post.radius * 0.55;
                return (
                  <g
                    key={post.id}
                    className="cursor-pointer group"
                    onClick={() => showToast(`${post.label}: ${post.lux} Lux • Eco-Friendly 3000K Amber Turtle/Bird-Safe Solar LED`)}
                  >
                    {/* Glowing Illumination Halo */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={haloRadius}
                      fill="url(#solarLightHalo)"
                      className="transition-all group-hover:scale-125 origin-center"
                    />
                    {/* Core Lamp Post Pin */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isNightMode ? 4.5 : 3.5}
                      fill="#ffddb8"
                      stroke="#ff9f1c"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* 7. BARRIER-FREE ACCESSIBLE NODES (RAMPS, RESTROOMS, ACOUSTICS) */}
          {displayLayers.barrierFree && (
            <g id="barrier-free-nodes">
              {BARRIER_FREE_NODES.map((node) => {
                const pt = projectPoint(node.position);
                return (
                  <g
                    key={node.id}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer group"
                    onClick={() => showToast(`${node.title}: ${node.desc}`)}
                  >
                    <circle r="12" fill="#005137" stroke="#85f8c4" strokeWidth="1.5" />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="10"
                      fill="#ffffff"
                      fontWeight="bold"
                    >
                      ♿
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 8. ACTIVE DYNAMIC NAVIGATION PATHS (SHADE / NIGHT / BARRIER-FREE) */}
          {displayLayers.routes && (
            <g id="active-navigation-paths">
              {/* 1. Shade Canopy Active Path */}
              {displayLayers.canopy && calculatedRoutes.shadePath.length > 1 && (
                <g>
                  {/* Outer Glow Halo */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.shadePath)}
                    fill="none"
                    stroke="#006948"
                    strokeWidth={selectedRoutePreference === 'shade' ? 16 : 9}
                    strokeOpacity={selectedRoutePreference === 'shade' ? 0.45 : 0.25}
                    strokeLinecap="round"
                  />
                  {/* Core Polyline */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.shadePath)}
                    fill="none"
                    stroke="#00855d"
                    strokeWidth={selectedRoutePreference === 'shade' ? 6 : 4}
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() =>
                      showToast(`Active Shade Canopy Route: ${calculatedRoutes.shadePercent}% Shaded (${calculatedRoutes.temperatureRelief})`)
                    }
                  />
                  {/* Inner Filament */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.shadePath)}
                    fill="none"
                    stroke="#85f8c4"
                    strokeWidth={2}
                    strokeDasharray={selectedRoutePreference === 'shade' ? '8 4' : 'none'}
                  />
                </g>
              )}

              {/* 2. SafeNight Lit Active Path */}
              {displayLayers.nightLighting && calculatedRoutes.nightPath.length > 1 && (
                <g>
                  {/* Outer Glow Halo */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.nightPath)}
                    fill="none"
                    stroke="#ffb95f"
                    strokeWidth={selectedRoutePreference === 'night' ? 16 : 8}
                    strokeOpacity={selectedRoutePreference === 'night' ? 0.5 : 0.25}
                    strokeLinecap="round"
                  />
                  {/* Core Polyline */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.nightPath)}
                    fill="none"
                    stroke="#d98200"
                    strokeWidth={selectedRoutePreference === 'night' ? 6 : 3.5}
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() =>
                      showToast(`Active SafeNight Route: ${calculatedRoutes.nightLux} Lux Solar LED Grid (100% lit)`)
                    }
                  />
                  {/* Inner Golden Filament */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.nightPath)}
                    fill="none"
                    stroke="#ffddb8"
                    strokeWidth={2}
                    strokeDasharray={selectedRoutePreference === 'night' ? '6 3' : 'none'}
                  />
                </g>
              )}

              {/* 3. Barrier-Free Step-Free Active Path */}
              {displayLayers.barrierFree && calculatedRoutes.barrierPath.length > 1 && (
                <g>
                  {/* Outer Glow Halo */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.barrierPath)}
                    fill="none"
                    stroke="#005137"
                    strokeWidth={selectedRoutePreference === 'barrier' ? 16 : 8}
                    strokeOpacity={selectedRoutePreference === 'barrier' ? 0.45 : 0.22}
                    strokeLinecap="round"
                  />
                  {/* Core Polyline */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.barrierPath)}
                    fill="none"
                    stroke="#006c49"
                    strokeWidth={selectedRoutePreference === 'barrier' ? 6 : 3.5}
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() =>
                      showToast(`Active Barrier-Free Route: Max ${calculatedRoutes.maxGradePercent}% slope, zero stairs`)
                    }
                  />
                  {/* Inner Tactile Filament */}
                  <path
                    d={pointsToCurvedSvgPath(calculatedRoutes.barrierPath)}
                    fill="none"
                    stroke="#ffb95f"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </g>
              )}
            </g>
          )}

          {/* 9. RAINBOW BRIDGE ARCHITECTURAL ICON SPANNING THE LAKE */}
          <g id="rainbow-bridge-span" className="cursor-pointer" onClick={() => onOpenEduModal(EDUCATIONAL_PINS[0])}>
            {/* The iconic multi-color arc */}
            <path
              d="M 680 340 Q 720 310, 760 330"
              fill="none"
              stroke="#ff3366"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 680 343 Q 720 313, 760 333"
              fill="none"
              stroke="#ffaa00"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 680 346 Q 720 316, 760 336"
              fill="none"
              stroke="#00bb77"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 680 349 Q 720 319, 760 339"
              fill="none"
              stroke="#0088ff"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <text x="720" y="300" textAnchor="middle" fontSize="11" fontWeight="bold" fill={isNightMode ? "#85f8c4" : "#006948"}>
              🌈 Rainbow Bridge
            </text>
          </g>

          {/* 10. LIVE WALKER GPS NAVIGATION AVATAR */}
          {isNavigating && (
            <g id="live-walker-avatar" transform={`translate(${walkerProj.x}, ${walkerProj.y})`}>
              {/* Animated Radar Pulse */}
              <circle r="36" fill="url(#walkerPulse)" className="animate-ping" opacity="0.6" />
              <circle r="18" fill="#006948" stroke="#ffffff" strokeWidth="3" className="drop-shadow-md" />
              {/* Walker Icon */}
              <text textAnchor="middle" dy="5" fontSize="14" fill="#ffffff" fontWeight="bold">
                🚶
              </text>
              {/* Floating ETA badge above walker */}
              <g transform="translate(0, -28)">
                <rect x="-42" y="-14" width="84" height="20" rx="10" fill="#002114" stroke="#85f8c4" strokeWidth="1" />
                <text textAnchor="middle" dy="0" fontSize="10" fill="#85f8c4" fontWeight="bold">
                  {navProgress}% Walked
                </text>
              </g>
            </g>
          )}

          {/* 11. EDUCATIONAL MECHANISM PINS */}
          {displayLayers.eduPins && (
            <g id="educational-pins">
              {EDUCATIONAL_PINS.map((pin) => {
                const pt = projectPoint(pin.position);
                return (
                  <g
                    key={pin.id}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer group"
                    onClick={() => onOpenEduModal(pin)}
                  >
                    {/* Pulsing ring */}
                    <circle r="16" fill="#006948" opacity="0.25" className="animate-ping" />
                    {/* Pin body */}
                    <circle r="12" fill="#ffffff" stroke="#006948" strokeWidth="2.5" />
                    <text textAnchor="middle" dy="4" fontSize="11">
                      {pin.icon === 'palette' ? '🎨' : pin.icon === 'forest' ? '🌲' : pin.icon === 'water_drop' ? '💧' : '🛡️'}
                    </text>
                    {/* Badge Label */}
                    <rect
                      x={-pin.name.length * 3.5}
                      y="16"
                      width={pin.name.length * 7}
                      height="16"
                      rx="8"
                      fill="#002114"
                      opacity="0.85"
                    />
                    <text textAnchor="middle" y="28" fontSize="9" fill="#85f8c4" fontWeight="bold">
                      {pin.name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 12. ALL ELMINA TOWNSHIP LANDMARKS */}
          {displayLayers.landmarks && (
            <g id="township-landmarks">
              {LANDMARKS.map((lm) => {
                const isOrigin = lm.id === originId;
                const isDest = lm.id === destId;
                const pos = isOrigin ? currentOriginPos : isDest ? currentDestPos : lm.position;
                const pt = projectPoint(pos);

                return (
                  <g
                    key={lm.id}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedLandmark(lm)}
                  >
                    {/* Background Tag */}
                    <g transform="translate(-65, -36)">
                      <rect
                        width="130"
                        height="30"
                        rx="15"
                        fill={
                          isOrigin
                            ? '#006948'
                            : isDest
                            ? '#a36700'
                            : lm.id === 'rainbow-bridge'
                            ? '#005137'
                            : isNightMode
                            ? '#1a2540'
                            : '#ffffff'
                        }
                        stroke={
                          isOrigin
                            ? '#85f8c4'
                            : isDest
                            ? '#ffddb8'
                            : isNightMode
                            ? '#2d3e66'
                            : '#dae2fd'
                        }
                        strokeWidth={isOrigin || isDest ? "2.5" : "1.2"}
                        filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.18))"
                      />
                      {/* Icon */}
                      <text x="14" y="20" fontSize="13">
                        {isOrigin ? '🟢' : isDest ? '🏁' : lm.category === 'nature' ? '🌳' : lm.category === 'civic' ? '🏛️' : lm.category === 'commercial' ? '🛍️' : '🏃'}
                      </text>
                      {/* Title */}
                      <text
                        x="34"
                        y="19"
                        fontSize="10"
                        fontWeight="bold"
                        fill={isOrigin || isDest ? '#ffffff' : isNightMode ? '#ffffff' : '#131b2e'}
                      >
                        {isOrigin ? '[Origin] ' : isDest ? '[Dest] ' : ''}
                        {lm.name.length > 13 ? lm.name.slice(0, 11) + '..' : lm.name}
                      </text>
                    </g>
                    {/* Pointer Triangle */}
                    <polygon
                      points="-5,-6 5,-6 0,0"
                      fill={isOrigin ? '#006948' : isDest ? '#a36700' : isNightMode ? '#1a2540' : '#ffffff'}
                    />
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING TOP BAR: WAYPOINT SELECTORS & SCANNER TRIGGER                     */}
      {/* ========================================================================= */}
      {!isCleanMapMode && (
        <div className="absolute top-4 left-4 sm:left-6 right-4 sm:right-6 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none animate-in fade-in duration-200">
          {/* Waypoint Origin & Destination Selector Pill */}
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-xl px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-lg border border-[#dae2fd]/70">
            {/* Origin Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWaypointPicker(showWaypointPicker === 'origin' ? null : 'origin')}
                className="flex items-center gap-2 pr-2 hover:opacity-80 transition-opacity text-left"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#006948] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold leading-none">
                    Origin
                  </span>
                  <span className="font-sans text-xs text-[#131b2e] font-bold truncate max-w-[120px] sm:max-w-none">
                    {originLandmark.name}
                  </span>
                </div>
              </button>

              {showWaypointPicker === 'origin' && (
                <div className="absolute left-0 mt-3 w-80 bg-white rounded-3xl p-3 shadow-2xl border border-[#dae2fd] z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-1">
                      Select Origin Landmark
                    </span>
                    <span className="text-[10px] text-[#006948] font-bold">8 Elmina Hubs</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {LANDMARKS.filter((l) => l.id !== destId).map((lm) => (
                      <button
                        key={lm.id}
                        onClick={() => {
                          setOriginId(lm.id);
                          setCustomOriginPos(null);
                          setShowWaypointPicker(null);
                          showToast(`Origin changed: ${lm.name}`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-2xl text-xs hover:bg-[#eaedff] flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-[#006948] group-hover:scale-110 transition-transform">
                            {lm.icon}
                          </span>
                          <div>
                            <div className="font-semibold text-[#131b2e]">{lm.name}</div>
                            <div className="text-[10px] text-slate-400">{lm.subtitle}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#006948] bg-[#f5fff7] px-2 py-0.5 rounded-full">
                          {lm.shadeScore}% Shade
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleReverseRoute}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] transition-transform active:scale-90"
              title="Swap Origin and Destination"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
            </button>

            {/* Destination Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWaypointPicker(showWaypointPicker === 'dest' ? null : 'dest')}
                className="flex items-center gap-2 pl-1 pr-2 hover:opacity-80 transition-opacity text-left"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#a36700] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold leading-none">
                    Destination
                  </span>
                  <span className="font-sans text-xs text-[#a36700] font-bold truncate max-w-[120px] sm:max-w-none">
                    {destLandmark.name}
                  </span>
                </div>
              </button>

              {showWaypointPicker === 'dest' && (
                <div className="absolute left-0 mt-3 w-80 bg-white rounded-3xl p-3 shadow-2xl border border-[#dae2fd] z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-1">
                      Select Destination Landmark
                    </span>
                    <span className="text-[10px] text-[#006948] font-bold">8 Elmina Hubs</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {LANDMARKS.filter((l) => l.id !== originId).map((lm) => (
                      <button
                        key={lm.id}
                        onClick={() => {
                          setDestId(lm.id);
                          setCustomDestPos(null);
                          setShowWaypointPicker(null);
                          showToast(`Destination changed: ${lm.name}`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-2xl text-xs hover:bg-[#eaedff] flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-[#006948] group-hover:scale-110 transition-transform">
                            {lm.icon}
                          </span>
                          <div>
                            <div className="font-semibold text-[#131b2e]">{lm.name}</div>
                            <div className="text-[10px] text-slate-400">{lm.subtitle}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#a36700] bg-[#fffbff] px-2 py-0.5 rounded-full">
                          {lm.lightScore}% Lux
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Floating Actions: Scan Area, Display Options & Eco-Steps */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* SCAN TOWNSHIP RADAR BUTTON */}
            <button
              type="button"
              onClick={handleTriggerScan}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#006948] to-[#00855d] text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.03] active:scale-[0.98] border border-[#85f8c4]/40 font-bold text-xs"
              title="Scan Elmina for shaded canopies, light poles, and accessible paths"
            >
              <span className="material-symbols-outlined text-[18px] text-[#85f8c4] animate-pulse">
                radar
              </span>
              <span className="hidden sm:inline">Scan Elmina Area</span>
            </button>

            {/* DISPLAY / VISIBILITY OPTIONS BUTTON */}
            <button
              type="button"
              onClick={() => setShowDisplayOptionsModal(!showDisplayOptionsModal)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-sans text-xs font-bold shadow-md transition-all ${
                showDisplayOptionsModal
                  ? 'bg-[#006948] text-white'
                  : 'bg-white/95 text-[#3d4a42] hover:bg-[#eaedff] border border-[#dae2fd]/70'
              }`}
              title="Layer Visibility & Display Filters"
            >
              <span className="material-symbols-outlined text-[18px]">layers</span>
              <span className="hidden md:inline">Display Layers</span>
            </button>

            {/* ECO-STEPS REWARDS BADGE */}
            <button
              type="button"
              onClick={onOpenRewardsModal}
              className="flex items-center gap-2 bg-white/95 hover:bg-white px-3.5 py-2 rounded-full text-[#131b2e] shadow-lg border border-[#dae2fd] transition-all transform hover:scale-[1.02]"
              title="Open Eco-Steps Rewards"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006948]">eco</span>
              <div className="flex flex-col text-left">
                <span className="font-sans text-[9px] text-[#006948] leading-none uppercase tracking-wider font-extrabold">
                  Eco-Steps
                </span>
                <span className="font-sans text-xs font-bold text-[#131b2e]">
                  {userPoints.toLocaleString()} pts
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAGGABLE & MINIMIZABLE MULTI-CORRIDOR ROUTING CARD                       */}
      {/* ========================================================================= */}
      {!isCleanMapMode && isRouteCardVisible && (
        <div className="absolute top-20 left-4 sm:left-6 z-30 max-w-[calc(100vw-2rem)] sm:w-[410px]">
          <DraggableCard
            title="Connected Multi-Corridor Routing"
            icon="hub"
            badge={`${calculatedRoutes.distanceKm} km`}
            isMinimized={isRouteCardMinimized}
            onToggleMinimize={() => setIsRouteCardMinimized(!isRouteCardMinimized)}
            onClose={() => setIsRouteCardVisible(false)}
            minimizedContent={
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#006948] shrink-0" />
                  <span className="font-bold text-[#131b2e] truncate">
                    {originLandmark.name} → {destLandmark.name}
                  </span>
                  <span className="text-slate-400 shrink-0">({calculatedRoutes.distanceKm} km)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRouteCardMinimized(false)}
                  className="text-[11px] font-bold text-[#006948] underline shrink-0 ml-2"
                >
                  Expand
                </button>
              </div>
            }
          >
            <div className="p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#3d4a42] font-semibold">
                  Walking ETA: ~{calculatedRoutes.walkingMinutes} mins
                </span>
                <button
                  type="button"
                  onClick={() => setDisplayLayers((prev) => ({ ...prev, routes: !prev.routes }))}
                  className={`text-[11px] font-bold flex items-center gap-1 ${
                    displayLayers.routes ? 'text-[#006948]' : 'text-slate-400'
                  }`}
                  title="Toggle display of route lines on map"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {displayLayers.routes ? 'visibility' : 'visibility_off'}
                  </span>
                  <span>{displayLayers.routes ? 'Displaying Routes' : 'Routes Hidden'}</span>
                </button>
              </div>

              {/* 3 Candidate Simultaneous Paths */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* 1. Shade Route */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoutePreference('shade');
                    setDisplayLayers((prev) => ({ ...prev, canopy: true, routes: true }));
                    showToast(`Focused on Shade Canopy Route (${calculatedRoutes.shadePercent}% Shaded, ${calculatedRoutes.temperatureRelief})`);
                  }}
                  className={`p-2 rounded-2xl flex flex-col text-left transition-all border ${
                    selectedRoutePreference === 'shade'
                      ? 'bg-[#f5fff7] border-[#006948] ring-2 ring-[#006948]/20 shadow-xs'
                      : 'bg-[#faf8ff] border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[#006948] font-bold text-xs mb-0.5">
                    <span className="material-symbols-outlined text-[15px]">forest</span>
                    <span>Canopy</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#131b2e]">
                    {calculatedRoutes.shadePercent}% Shade
                  </span>
                  <span className="text-[9px] text-[#00855d] font-semibold">
                    {calculatedRoutes.temperatureRelief} cooling
                  </span>
                </button>

                {/* 2. SafeNight Route */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoutePreference('night');
                    setDisplayLayers((prev) => ({ ...prev, nightLighting: true, routes: true }));
                    if (!isNightMode) setIsNightMode(true);
                    showToast(`Focused on SafeNight Corridor (${calculatedRoutes.nightLux} Lux, 100% solar LED lighting)`);
                  }}
                  className={`p-2 rounded-2xl flex flex-col text-left transition-all border ${
                    selectedRoutePreference === 'night'
                      ? 'bg-[#fffbff] border-[#a36700] ring-2 ring-[#a36700]/20 shadow-xs'
                      : 'bg-[#faf8ff] border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[#a36700] font-bold text-xs mb-0.5">
                    <span className="material-symbols-outlined text-[15px]">light_mode</span>
                    <span>SafeNight</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#131b2e]">
                    {calculatedRoutes.nightLux} Lux
                  </span>
                  <span className="text-[9px] text-[#825100] font-semibold">
                    Continuous solar
                  </span>
                </button>

                {/* 3. Barrier-Free Route */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoutePreference('barrier');
                    setDisplayLayers((prev) => ({ ...prev, barrierFree: true, routes: true }));
                    showToast(`Focused on Barrier-Free Accessible Route (Max ${calculatedRoutes.maxGradePercent}% grade, zero stairs)`);
                  }}
                  className={`p-2 rounded-2xl flex flex-col text-left transition-all border ${
                    selectedRoutePreference === 'barrier'
                      ? 'bg-[#f2f3ff] border-[#005137] ring-2 ring-[#005137]/20 shadow-xs'
                      : 'bg-[#faf8ff] border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[#005137] font-bold text-xs mb-0.5">
                    <span className="material-symbols-outlined text-[15px]">accessible</span>
                    <span>Step-Free</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#131b2e]">
                    {calculatedRoutes.maxGradePercent}% Grade
                  </span>
                  <span className="text-[9px] text-[#006c49] font-semibold">
                    0 steps • tactile
                  </span>
                </button>
              </div>

              {/* Show All Paths Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoutePreference('all');
                    setDisplayLayers((prev) => ({
                      ...prev,
                      canopy: true,
                      nightLighting: true,
                      barrierFree: true,
                      routes: true
                    }));
                    showToast('Displaying all 3 routes concurrently on the map!');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    selectedRoutePreference === 'all'
                      ? 'bg-[#006948] text-white shadow-xs'
                      : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">hub</span>
                  <span>Show All 3 Candidate Routes</span>
                </button>

                <span className="text-[10px] text-slate-400">
                  Drag card to reposition
                </span>
              </div>
            </div>
          </DraggableCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DISPLAY LAYERS VISIBILITY MODAL                                           */}
      {/* ========================================================================= */}
      {showDisplayOptionsModal && (
        <div className="absolute top-20 right-4 sm:right-20 z-40 w-72 bg-white/98 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-[#dae2fd] animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
            <span className="font-headline font-bold text-xs text-[#131b2e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006948]">visibility</span>
              Display & Visibility Options
            </span>
            <button
              type="button"
              onClick={() => setShowDisplayOptionsModal(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            {/* Toggle Canopy */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <span className="flex items-center gap-2 text-[#131b2e] font-medium">
                <span>🌲</span> Tree Canopies & Forests
              </span>
              <input
                type="checkbox"
                checked={displayLayers.canopy}
                onChange={(e) => setDisplayLayers({ ...displayLayers, canopy: e.target.checked })}
                className="accent-[#006948] w-4 h-4 cursor-pointer"
              />
            </label>

            {/* Toggle SafeNight */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <span className="flex items-center gap-2 text-[#131b2e] font-medium">
                <span>💡</span> SafeNight Lighting Grid
              </span>
              <input
                type="checkbox"
                checked={displayLayers.nightLighting}
                onChange={(e) => setDisplayLayers({ ...displayLayers, nightLighting: e.target.checked })}
                className="accent-[#a36700] w-4 h-4 cursor-pointer"
              />
            </label>

            {/* Toggle Barrier-Free */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <span className="flex items-center gap-2 text-[#131b2e] font-medium">
                <span>♿</span> Barrier-Free Step-Free Paths
              </span>
              <input
                type="checkbox"
                checked={displayLayers.barrierFree}
                onChange={(e) => setDisplayLayers({ ...displayLayers, barrierFree: e.target.checked })}
                className="accent-[#005137] w-4 h-4 cursor-pointer"
              />
            </label>

            {/* Toggle Background Mesh */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <span className="flex items-center gap-2 text-[#131b2e] font-medium">
                <span>🌐</span> Background Township Mesh
              </span>
              <input
                type="checkbox"
                checked={displayLayers.townshipMesh}
                onChange={(e) => setDisplayLayers({ ...displayLayers, townshipMesh: e.target.checked })}
                className="accent-[#006948] w-4 h-4 cursor-pointer"
              />
            </label>

            {/* Toggle Route Polylines */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <span className="flex items-center gap-2 text-[#131b2e] font-medium">
                <span>🛣️</span> Active Navigation Routes
              </span>
              <input
                type="checkbox"
                checked={displayLayers.routes}
                onChange={(e) => setDisplayLayers({ ...displayLayers, routes: e.target.checked })}
                className="accent-[#006948] w-4 h-4 cursor-pointer"
              />
            </label>

            {/* Toggle Landmarks */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <span className="flex items-center gap-2 text-[#131b2e] font-medium">
                <span>📍</span> Landmark Pins
              </span>
              <input
                type="checkbox"
                checked={displayLayers.landmarks}
                onChange={(e) => setDisplayLayers({ ...displayLayers, landmarks: e.target.checked })}
                className="accent-[#006948] w-4 h-4 cursor-pointer"
              />
            </label>

            {/* Toggle Edu Pins */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <span className="flex items-center gap-2 text-[#131b2e] font-medium">
                <span>🎓</span> Educational Mechanism Nodes
              </span>
              <input
                type="checkbox"
                checked={displayLayers.eduPins}
                onChange={(e) => setDisplayLayers({ ...displayLayers, eduPins: e.target.checked })}
                className="accent-[#006948] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px]">
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
                showToast('All map display layers enabled.');
              }}
              className="text-[#006948] font-bold hover:underline"
            >
              Show All
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
                showToast('All map display layers hidden.');
              }}
              className="text-slate-500 font-bold hover:underline"
            >
              Hide All
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING MAP TOOLS & CAMERA CONTROLLER (RIGHT SIDE)                       */}
      {/* ========================================================================= */}
      <div className="absolute right-4 sm:right-6 top-20 flex flex-col gap-2 z-30 pointer-events-auto">
        {/* Master Clean View (Zen Mode) Toggle */}
        <button
          type="button"
          onClick={() => {
            setIsCleanMapMode(!isCleanMapMode);
            showToast(isCleanMapMode ? 'Full UI Mode Restored' : 'Clean Map Mode Enabled (Panels Hidden)');
          }}
          className={`w-11 h-11 rounded-2xl shadow-xl border flex items-center justify-center transition-transform active:scale-90 ${
            isCleanMapMode
              ? 'bg-[#006948] text-white border-[#85f8c4] ring-2 ring-[#85f8c4]'
              : 'bg-white/95 text-[#131b2e] border-[#dae2fd] hover:bg-[#eaedff]'
          }`}
          title={isCleanMapMode ? 'Exit Clean Map Mode' : 'Clean View (Hide UI Panels)'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isCleanMapMode ? 'fullscreen_exit' : 'fullscreen'}
          </span>
        </button>

        {/* Recenter */}
        <button
          type="button"
          onClick={handleRecenter}
          className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#dae2fd] flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-transform active:scale-90"
          title="Recenter on Elmina Central Park"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#dae2fd] flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-transform active:scale-90"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#dae2fd] flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-transform active:scale-90"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-[20px]">remove</span>
        </button>

        {/* Satellite / Roadmap Toggle */}
        <button
          type="button"
          onClick={() => {
            const nextType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
            setMapType(nextType);
            showToast(`Map mode: ${nextType === 'satellite' ? 'Aerial Satellite Topography' : 'Eco-Roadmap'}`);
          }}
          className={`w-11 h-11 rounded-2xl shadow-lg border flex items-center justify-center transition-transform active:scale-90 ${
            mapType === 'satellite'
              ? 'bg-[#006948] text-white border-[#85f8c4]'
              : 'bg-white/95 text-[#131b2e] border-[#dae2fd] hover:bg-[#eaedff]'
          }`}
          title="Toggle Satellite Aerial Imagery"
        >
          <span className="material-symbols-outlined text-[20px]">satellite_alt</span>
        </button>

        {/* Night / Day Styling Toggle */}
        <button
          type="button"
          onClick={() => {
            setIsNightMode(!isNightMode);
            showToast(isNightMode ? 'Day Biophilic Mode' : 'Night SafeNight Vision');
          }}
          className={`w-11 h-11 rounded-2xl shadow-lg border flex items-center justify-center transition-transform active:scale-90 ${
            isNightMode
              ? 'bg-[#1c2541] text-[#ffb95f] border-[#ffb95f]'
              : 'bg-white/95 text-[#131b2e] border-[#dae2fd] hover:bg-[#eaedff]'
          }`}
          title="Toggle Night Vision Mode"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isNightMode ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* Re-open Route Card if closed */}
        {!isRouteCardVisible && !isCleanMapMode && (
          <button
            type="button"
            onClick={() => setIsRouteCardVisible(true)}
            className="w-11 h-11 rounded-2xl bg-[#006948] text-white shadow-lg flex items-center justify-center hover:bg-[#00855d] transition-transform active:scale-90"
            title="Display Route Panel"
          >
            <span className="material-symbols-outlined text-[20px]">route</span>
          </button>
        )}

        {/* Report Civic Defect Trigger */}
        <button
          type="button"
          onClick={onOpenReportModal}
          className="w-11 h-11 rounded-2xl bg-[#fffbff] border border-[#ffddb8] shadow-lg flex items-center justify-center text-[#825100] hover:bg-[#ffddb8]/40 transition-transform active:scale-90"
          title="Report Broken Streetlight or Path Defect"
        >
          <span className="material-symbols-outlined text-[20px]">report_problem</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE NAVIGATION LIVE HUD BANNER                                         */}
      {/* ========================================================================= */}
      {isNavigating && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-xl bg-[#006948] text-white px-5 py-3.5 rounded-3xl shadow-2xl flex items-center justify-between border border-[#85f8c4]/40 animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#85f8c4] text-[#002114] flex items-center justify-center font-bold shadow-md">
              <span className="material-symbols-outlined text-[22px]">turn_slight_right</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">
                {originLandmark.name} → {destLandmark.name}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-[#85f8c4] mt-0.5">
                <span>ETA: {Math.max(1, Math.round(calculatedRoutes.walkingMinutes * (1 - navProgress / 100)))} mins</span>
                <span>•</span>
                <span>{((calculatedRoutes.distanceKm * (100 - navProgress)) / 100).toFixed(2)} km left</span>
                <span>•</span>
                <span className="bg-[#6cf8bb]/30 px-1.5 py-0.2 rounded text-white font-bold">
                  {calculatedRoutes.shadePercent}% Shaded • 0 Steps
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNavigating(false)}
            className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold text-white transition-colors"
          >
            End
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* START NAVIGATION FLOATING ACTION BUTTON (WHEN NOT NAVIGATING)            */}
      {/* ========================================================================= */}
      {!isNavigating && !isCleanMapMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleStartNav}
            className="px-6 py-3 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-sm shadow-2xl flex items-center gap-2.5 border border-[#85f8c4]/50 transform hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#85f8c4]">
              directions_walk
            </span>
            <span>Navigate: {originLandmark.name} → {destLandmark.name}</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerScan}
            className="px-4 py-3 rounded-full bg-white/95 hover:bg-white text-[#131b2e] font-bold text-xs shadow-xl flex items-center gap-1.5 border border-[#dae2fd] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006948]">
              radar
            </span>
            <span>View Scanner</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANDMARK DETAIL POPUP CARD                                                */}
      {/* ========================================================================= */}
      {selectedLandmark && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-sm bg-white/98 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-[#dae2fd] animate-in slide-in-from-bottom-4 duration-200 pointer-events-auto">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006948] text-[22px]">
                {selectedLandmark.icon}
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#131b2e]">{selectedLandmark.name}</h4>
                <p className="text-[11px] text-[#3d4a42]">{selectedLandmark.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedLandmark(null)}
              className="text-slate-400 hover:text-slate-700"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-600 my-2 leading-relaxed">
            {selectedLandmark.description}
          </p>

          {/* Microclimate telemetry scores */}
          <div className="grid grid-cols-3 gap-1.5 mb-3 text-center text-[10px]">
            <div className="bg-[#f5fff7] p-1.5 rounded-xl border border-[#85f8c4]">
              <span className="text-slate-500 block">Canopy</span>
              <strong className="text-[#006948] font-bold">{selectedLandmark.shadeScore}%</strong>
            </div>
            <div className="bg-[#fffbff] p-1.5 rounded-xl border border-[#ffddb8]">
              <span className="text-slate-500 block">Lighting</span>
              <strong className="text-[#a36700] font-bold">{selectedLandmark.lightScore}%</strong>
            </div>
            <div className="bg-[#f2f3ff] p-1.5 rounded-xl border border-[#dae2fd]">
              <span className="text-slate-500 block">Step-Free</span>
              <strong className="text-[#005137] font-bold">{selectedLandmark.barrierFreeScore}%</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setOriginId(selectedLandmark.id);
                setCustomOriginPos(null);
                setSelectedLandmark(null);
                showToast(`Origin set to ${selectedLandmark.name}`);
              }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-colors ${
                originId === selectedLandmark.id
                  ? 'bg-[#006948] text-white'
                  : 'bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e]'
              }`}
            >
              Set Origin
            </button>
            <button
              type="button"
              onClick={() => {
                setDestId(selectedLandmark.id);
                setCustomDestPos(null);
                setSelectedLandmark(null);
                showToast(`Destination set to ${selectedLandmark.name}`);
              }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-colors ${
                destId === selectedLandmark.id
                  ? 'bg-[#a36700] text-white'
                  : 'bg-[#006948] hover:bg-[#00855d] text-white shadow-xs'
              }`}
            >
              Set Destination
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOWNSHIP ECO-SCANNER RESULTS DRAWER                                       */}
      {/* ========================================================================= */}
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
