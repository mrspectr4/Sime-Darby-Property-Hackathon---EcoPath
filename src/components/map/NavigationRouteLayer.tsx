import React, { useEffect, useRef, useState } from 'react';
import { useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { LatLngPoint } from '../../types';

interface NavigationRouteLayerProps {
  isNavigating: boolean;
  navProgress: number; // 0 to 100
  routePath: LatLngPoint[];
}

export const NavigationRouteLayer: React.FC<NavigationRouteLayerProps> = ({
  isNavigating,
  navProgress,
  routePath
}) => {
  const map = useMap();
  const navLineRef = useRef<google.maps.Polyline | null>(null);

  // Compute intermediate walker coordinate by interpolating along the path points
  const getInterpolatedPosition = (progress: number): LatLngPoint => {
    if (!routePath || routePath.length === 0) return { lat: 3.1818, lng: 101.5175 };
    if (routePath.length === 1) return routePath[0];

    const totalSegments = routePath.length - 1;
    const globalT = (progress / 100) * totalSegments;
    const segmentIndex = Math.min(Math.floor(globalT), totalSegments - 1);
    const segmentT = globalT - segmentIndex;

    const p1 = routePath[segmentIndex];
    const p2 = routePath[segmentIndex + 1];

    return {
      lat: p1.lat + (p2.lat - p1.lat) * segmentT,
      lng: p1.lng + (p2.lng - p1.lng) * segmentT
    };
  };

  const currentWalkerPos = getInterpolatedPosition(navProgress);

  // Update navigation polyline
  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (navLineRef.current) {
      navLineRef.current.setMap(null);
      navLineRef.current = null;
    }

    if (isNavigating && routePath.length > 1) {
      navLineRef.current = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#006948',
        strokeOpacity: 0.95,
        strokeWeight: 8,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3.5,
              strokeColor: '#FFFFFF',
              fillColor: '#85F8C4',
              fillOpacity: 1
            },
            offset: '100%',
            repeat: '60px'
          }
        ],
        map,
        zIndex: 35
      });
    }

    return () => {
      if (navLineRef.current) {
        navLineRef.current.setMap(null);
        navLineRef.current = null;
      }
    };
  }, [map, isNavigating, routePath]);

  // Optionally pan smoothly to follow walker
  useEffect(() => {
    if (isNavigating && map && navProgress % 10 === 0) {
      map.panTo(currentWalkerPos);
    }
  }, [isNavigating, map, navProgress, currentWalkerPos]);

  if (!isNavigating) return null;

  return (
    <AdvancedMarker position={currentWalkerPos} title="Your Live GPS Position">
      <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* Animated Radar Pulse */}
        <div className="absolute w-12 h-12 rounded-full bg-[#006948]/30 animate-ping" />
        {/* Outer Ring */}
        <div className="w-9 h-9 rounded-full bg-[#006948] border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs">
          <span className="material-symbols-outlined text-[18px]">directions_walk</span>
        </div>
        {/* Live Tracking Label */}
        <div className="absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded-md bg-[#002114] text-[#85f8c4] text-[10px] font-bold shadow-md">
          {navProgress}% Traversed
        </div>
      </div>
    </AdvancedMarker>
  );
};
