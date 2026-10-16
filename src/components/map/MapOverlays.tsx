import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { LatLngPoint } from '../../types';
import {
  SAFENIGHT_LIGHT_POSTS,
  ELMINA_CANOPY_ZONES,
  BARRIER_FREE_NODES
} from '../../data/mockData';
import { getAllTownshipNetworks, ELMINA_CORRIDOR_SEGMENTS } from '../../utils/elminaRouting';

interface MapOverlaysProps {
  showShade: boolean;
  showNight: boolean;
  showBarrierFree: boolean;
  showTownshipMesh?: boolean;
  showRoutes?: boolean;
  isNightTheme: boolean;
  // Dynamic routes computed for the selected origin -> destination
  activeShadePath: LatLngPoint[];
  activeNightPath: LatLngPoint[];
  activeBarrierPath: LatLngPoint[];
  selectedMode: 'shade' | 'night' | 'barrier' | 'all';
  onSelectNode?: (title: string, info: string) => void;
}

export const MapOverlays: React.FC<MapOverlaysProps> = ({
  showShade,
  showNight,
  showBarrierFree,
  showTownshipMesh = true,
  showRoutes = true,
  isNightTheme,
  activeShadePath,
  activeNightPath,
  activeBarrierPath,
  selectedMode,
  onSelectNode
}) => {
  const map = useMap();

  // Storage for Google Maps overlay instances
  const networkCanopyPolylines = useRef<google.maps.Polyline[]>([]);
  const networkNightPolylines = useRef<google.maps.Polyline[]>([]);
  const networkBarrierPolylines = useRef<google.maps.Polyline[]>([]);

  const activeRoutePolylines = useRef<google.maps.Polyline[]>([]);
  const canopyPolygonsRef = useRef<google.maps.Polygon[]>([]);
  const nightCirclesRef = useRef<google.maps.Circle[]>([]);

  const { allCanopySegments, allNightSegments, allBarrierSegments } = getAllTownshipNetworks();

  // 1. RENDER CANOPY POLYGONS (Forest zones across Elmina)
  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    canopyPolygonsRef.current.forEach((poly) => poly.setMap(null));
    canopyPolygonsRef.current = [];

    if (!showShade) return;

    ELMINA_CANOPY_ZONES.forEach((zone) => {
      const polygon = new google.maps.Polygon({
        paths: zone.coordinates,
        strokeColor: '#006948',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: zone.color,
        fillOpacity: isNightTheme ? 0.22 : 0.35,
        map,
        zIndex: 10
      });

      polygon.addListener('click', () => {
        if (onSelectNode) {
          onSelectNode(
            zone.name,
            `Canopy Coverage: ${zone.coverage}% • Urban Heat Island Relief: ${zone.tempReduction}°C • Native Dipterocarp Conservation.`
          );
        }
      });

      canopyPolygonsRef.current.push(polygon);
    });

    return () => {
      canopyPolygonsRef.current.forEach((poly) => poly.setMap(null));
      canopyPolygonsRef.current = [];
    };
  }, [map, showShade, isNightTheme, onSelectNode]);

  // 2. RENDER SAFENIGHT ILLUMINATION POST CIRCLES
  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    nightCirclesRef.current.forEach((c) => c.setMap(null));
    nightCirclesRef.current = [];

    if (!showNight) return;

    SAFENIGHT_LIGHT_POSTS.forEach((post) => {
      const circle = new google.maps.Circle({
        strokeColor: '#FFB95F',
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        fillColor: '#FFB95F',
        fillOpacity: isNightTheme ? 0.26 : 0.16,
        map,
        center: post.position,
        radius: post.radius,
        zIndex: 12
      });

      circle.addListener('click', () => {
        if (onSelectNode) {
          onSelectNode(
            post.label,
            `Illumination: ${post.lux} Lux • Eco-Friendly 3000K Amber Turtle/Bird-Safe Solar LED Column.`
          );
        }
      });

      nightCirclesRef.current.push(circle);
    });

    return () => {
      nightCirclesRef.current.forEach((c) => c.setMap(null));
      nightCirclesRef.current = [];
    };
  }, [map, showNight, isNightTheme, onSelectNode]);

  // 3. RENDER ALL TOWNSHIP-WIDE INFRASTRUCTURE NETWORKS
  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    // Clear previous township network lines
    networkCanopyPolylines.current.forEach((p) => p.setMap(null));
    networkCanopyPolylines.current = [];
    networkNightPolylines.current.forEach((p) => p.setMap(null));
    networkNightPolylines.current = [];
    networkBarrierPolylines.current.forEach((p) => p.setMap(null));
    networkBarrierPolylines.current = [];

    // A. ALL Shaded Canopy Network Lines throughout Elmina
    if (showTownshipMesh && showShade) {
      allCanopySegments.forEach((segment) => {
        const line = new google.maps.Polyline({
          path: segment,
          geodesic: true,
          strokeColor: '#00855D',
          strokeOpacity: isNightTheme ? 0.35 : 0.55,
          strokeWeight: 5,
          map,
          zIndex: 15
        });
        networkCanopyPolylines.current.push(line);
      });
    }

    // B. ALL SafeNight Lighting Grid Lines throughout Elmina
    if (showTownshipMesh && showNight) {
      allNightSegments.forEach((segment) => {
        const line = new google.maps.Polyline({
          path: segment,
          geodesic: true,
          strokeColor: '#FFB95F',
          strokeOpacity: isNightTheme ? 0.65 : 0.45,
          strokeWeight: 4,
          map,
          zIndex: 16
        });
        networkNightPolylines.current.push(line);
      });
    }

    // C. ALL Barrier-Free Universal Accessible Network Lines throughout Elmina
    if (showTownshipMesh && showBarrierFree) {
      allBarrierSegments.forEach((segment) => {
        const line = new google.maps.Polyline({
          path: segment,
          geodesic: true,
          strokeColor: '#005137',
          strokeOpacity: 0.5,
          strokeWeight: 5,
          map,
          zIndex: 17
        });
        networkBarrierPolylines.current.push(line);
      });
    }

    return () => {
      networkCanopyPolylines.current.forEach((p) => p.setMap(null));
      networkCanopyPolylines.current = [];
      networkNightPolylines.current.forEach((p) => p.setMap(null));
      networkNightPolylines.current = [];
      networkBarrierPolylines.current.forEach((p) => p.setMap(null));
      networkBarrierPolylines.current = [];
    };
  }, [
    map,
    showShade,
    showNight,
    showBarrierFree,
    showTownshipMesh,
    isNightTheme,
    allCanopySegments,
    allNightSegments,
    allBarrierSegments
  ]);

  // 4. RENDER DYNAMIC ACTIVE NAVIGATION PATHS CONNECTING SELECTED ORIGIN & DESTINATION
  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    activeRoutePolylines.current.forEach((p) => p.setMap(null));
    activeRoutePolylines.current = [];

    if (!showRoutes) return;

    // Helper to add an active emphasized route
    const addActiveRoute = (
      path: LatLngPoint[],
      strokeColor: string,
      innerColor: string,
      weight: number,
      zIndex: number,
      title: string,
      details: string
    ) => {
      if (!path || path.length < 2) return;

      // Glow halo
      const halo = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor,
        strokeOpacity: 0.4,
        strokeWeight: weight + 6,
        map,
        zIndex: zIndex - 1
      });

      // Core line
      const core = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor,
        strokeOpacity: 0.95,
        strokeWeight: weight,
        map,
        zIndex
      });

      // Inner accent filament
      const filament = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: innerColor,
        strokeOpacity: 1,
        strokeWeight: Math.max(2, weight / 2.5),
        map,
        zIndex: zIndex + 1
      });

      core.addListener('click', () => {
        if (onSelectNode) onSelectNode(title, details);
      });

      activeRoutePolylines.current.push(halo, core, filament);
    };

    // Render ALL active candidate routes simultaneously between origin and destination!
    // 1. Shaded Canopy Active Route
    if (showShade && activeShadePath && activeShadePath.length > 1) {
      addActiveRoute(
        activeShadePath,
        '#006948',
        '#85F8C4',
        selectedMode === 'shade' ? 8 : 5,
        selectedMode === 'shade' ? 30 : 25,
        'Active Canopy Corridor',
        'Prioritizes 88%+ continuous native dipterocarp tree shade, lowering ambient temperature by up to 3.8°C.'
      );
    }

    // 2. SafeNight Radiant Active Route
    if (showNight && activeNightPath && activeNightPath.length > 1) {
      addActiveRoute(
        activeNightPath,
        '#A36700',
        '#FFB95F',
        selectedMode === 'night' ? 8 : 5,
        selectedMode === 'night' ? 31 : 26,
        'Active SafeNight Illuminated Route',
        'Prioritizes 100% solar LED smart pole lighting with zero dark pockets and average 75 lux illuminance.'
      );
    }

    // 3. Barrier-Free Universal Active Route
    if (showBarrierFree && activeBarrierPath && activeBarrierPath.length > 1) {
      addActiveRoute(
        activeBarrierPath,
        '#005137',
        '#F59E0B',
        selectedMode === 'barrier' ? 8 : 5,
        selectedMode === 'barrier' ? 32 : 27,
        'Active Barrier-Free Wayfinding Route',
        '100% zero-step path with max gradient 2.4%, blister tactile paving, dropped kerbs, and accessible rest pads.'
      );
    }

    return () => {
      activeRoutePolylines.current.forEach((p) => p.setMap(null));
      activeRoutePolylines.current = [];
    };
  }, [
    map,
    showShade,
    showNight,
    showBarrierFree,
    activeShadePath,
    activeNightPath,
    activeBarrierPath,
    selectedMode,
    onSelectNode
  ]);

  return null;
};
