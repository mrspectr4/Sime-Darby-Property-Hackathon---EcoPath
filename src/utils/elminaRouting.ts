import { LatLngPoint, Landmark } from '../types';
import { LANDMARKS } from '../data/mockData';

// Spatial nodes in City of Elmina for graph routing
export interface RouteCalculationResult {
  shadePath: LatLngPoint[];
  nightPath: LatLngPoint[];
  barrierPath: LatLngPoint[];
  distanceKm: number;
  walkingMinutes: number;
  shadePercent: number;
  temperatureRelief: string;
  nightLux: number;
  maxGradePercent: number;
  stepCount: number;
  originName: string;
  destName: string;
}

// Distance helper (Haversine formula in kilometers)
export function calculateDistanceKm(p1: LatLngPoint, p2: LatLngPoint): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Waypoint intermediate connectors between nodes in City of Elmina
interface SegmentDefinition {
  from: string;
  to: string;
  canopyPath: LatLngPoint[];
  nightPath: LatLngPoint[];
  barrierPath: LatLngPoint[];
}

export const ELMINA_CORRIDOR_SEGMENTS: SegmentDefinition[] = [
  // 1. Lakeside Mall <-> Elmina Valley EV3
  {
    from: 'elmina-lakeside-mall',
    to: 'elmina-valley-spine',
    canopyPath: [
      { lat: 3.1782, lng: 101.5135 },
      { lat: 3.1772, lng: 101.5128 },
      { lat: 3.1764, lng: 101.5124 },
      { lat: 3.1755, lng: 101.5120 }
    ],
    nightPath: [
      { lat: 3.1782, lng: 101.5135 },
      { lat: 3.1770, lng: 101.5131 },
      { lat: 3.1760, lng: 101.5125 },
      { lat: 3.1755, lng: 101.5120 }
    ],
    barrierPath: [
      { lat: 3.1782, lng: 101.5135 },
      { lat: 3.1771, lng: 101.5129 },
      { lat: 3.1762, lng: 101.5123 },
      { lat: 3.1755, lng: 101.5120 }
    ]
  },

  // 2. Lakeside Mall <-> Central Park
  {
    from: 'elmina-lakeside-mall',
    to: 'elmina-central-park',
    canopyPath: [
      { lat: 3.1782, lng: 101.5135 },
      { lat: 3.1794, lng: 101.5146 },
      { lat: 3.1808, lng: 101.5160 },
      { lat: 3.1818, lng: 101.5175 }
    ],
    nightPath: [
      { lat: 3.1782, lng: 101.5135 },
      { lat: 3.1798, lng: 101.5152 },
      { lat: 3.1812, lng: 101.5166 },
      { lat: 3.1818, lng: 101.5175 }
    ],
    barrierPath: [
      { lat: 3.1782, lng: 101.5135 },
      { lat: 3.1795, lng: 101.5147 },
      { lat: 3.1810, lng: 101.5162 },
      { lat: 3.1818, lng: 101.5175 }
    ]
  },

  // 3. Central Park <-> Rainbow Bridge
  {
    from: 'elmina-central-park',
    to: 'rainbow-bridge',
    canopyPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1828, lng: 101.5180 },
      { lat: 3.1838, lng: 101.5186 },
      { lat: 3.1843, lng: 101.5190 }
    ],
    nightPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1830, lng: 101.5182 },
      { lat: 3.1840, lng: 101.5188 },
      { lat: 3.1843, lng: 101.5190 }
    ],
    barrierPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1829, lng: 101.5181 },
      { lat: 3.1839, lng: 101.5187 },
      { lat: 3.1843, lng: 101.5190 }
    ]
  },

  // 4. Rainbow Bridge <-> ERKC Rainforest
  {
    from: 'rainbow-bridge',
    to: 'erkc-rainforest',
    canopyPath: [
      { lat: 3.1843, lng: 101.5190 },
      { lat: 3.1853, lng: 101.5205 },
      { lat: 3.1864, lng: 101.5228 },
      { lat: 3.1874, lng: 101.5252 },
      { lat: 3.1885, lng: 101.5285 }
    ],
    nightPath: [
      { lat: 3.1843, lng: 101.5190 },
      { lat: 3.1856, lng: 101.5212 },
      { lat: 3.1868, lng: 101.5238 },
      { lat: 3.1878, lng: 101.5262 },
      { lat: 3.1885, lng: 101.5285 }
    ],
    barrierPath: [
      { lat: 3.1843, lng: 101.5190 },
      { lat: 3.1858, lng: 101.5218 },
      { lat: 3.1872, lng: 101.5250 },
      { lat: 3.1885, lng: 101.5285 }
    ]
  },

  // 5. Central Park <-> Central Park Pavilion
  {
    from: 'elmina-central-park',
    to: 'elmina-pavilion',
    canopyPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1822, lng: 101.5192 },
      { lat: 3.1825, lng: 101.5204 },
      { lat: 3.1828, lng: 101.5212 }
    ],
    nightPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1821, lng: 101.5190 },
      { lat: 3.1826, lng: 101.5206 },
      { lat: 3.1828, lng: 101.5212 }
    ],
    barrierPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1823, lng: 101.5194 },
      { lat: 3.1828, lng: 101.5212 }
    ]
  },

  // 6. Pavilion <-> Temu Commercial Hub
  {
    from: 'elmina-pavilion',
    to: 'temu-hub',
    canopyPath: [
      { lat: 3.1828, lng: 101.5212 },
      { lat: 3.1815, lng: 101.5224 },
      { lat: 3.1804, lng: 101.5235 },
      { lat: 3.1795, lng: 101.5245 }
    ],
    nightPath: [
      { lat: 3.1828, lng: 101.5212 },
      { lat: 3.1816, lng: 101.5222 },
      { lat: 3.1802, lng: 101.5238 },
      { lat: 3.1795, lng: 101.5245 }
    ],
    barrierPath: [
      { lat: 3.1828, lng: 101.5212 },
      { lat: 3.1814, lng: 101.5225 },
      { lat: 3.1803, lng: 101.5236 },
      { lat: 3.1795, lng: 101.5245 }
    ]
  },

  // 7. Central Park <-> Sports Park
  {
    from: 'elmina-central-park',
    to: 'elmina-sports-park',
    canopyPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1790, lng: 101.5180 },
      { lat: 3.1762, lng: 101.5188 },
      { lat: 3.1738, lng: 101.5195 }
    ],
    nightPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1788, lng: 101.5182 },
      { lat: 3.1758, lng: 101.5190 },
      { lat: 3.1738, lng: 101.5195 }
    ],
    barrierPath: [
      { lat: 3.1818, lng: 101.5175 },
      { lat: 3.1789, lng: 101.5181 },
      { lat: 3.1760, lng: 101.5189 },
      { lat: 3.1738, lng: 101.5195 }
    ]
  },

  // 8. Sports Park <-> Temu Commercial
  {
    from: 'elmina-sports-park',
    to: 'temu-hub',
    canopyPath: [
      { lat: 3.1738, lng: 101.5195 },
      { lat: 3.1755, lng: 101.5212 },
      { lat: 3.1776, lng: 101.5230 },
      { lat: 3.1795, lng: 101.5245 }
    ],
    nightPath: [
      { lat: 3.1738, lng: 101.5195 },
      { lat: 3.1758, lng: 101.5215 },
      { lat: 3.1778, lng: 101.5232 },
      { lat: 3.1795, lng: 101.5245 }
    ],
    barrierPath: [
      { lat: 3.1738, lng: 101.5195 },
      { lat: 3.1756, lng: 101.5214 },
      { lat: 3.1777, lng: 101.5231 },
      { lat: 3.1795, lng: 101.5245 }
    ]
  },

  // 9. Pavilion <-> ERKC Rainforest
  {
    from: 'elmina-pavilion',
    to: 'erkc-rainforest',
    canopyPath: [
      { lat: 3.1828, lng: 101.5212 },
      { lat: 3.1848, lng: 101.5238 },
      { lat: 3.1868, lng: 101.5262 },
      { lat: 3.1885, lng: 101.5285 }
    ],
    nightPath: [
      { lat: 3.1828, lng: 101.5212 },
      { lat: 3.1850, lng: 101.5240 },
      { lat: 3.1870, lng: 101.5265 },
      { lat: 3.1885, lng: 101.5285 }
    ],
    barrierPath: [
      { lat: 3.1828, lng: 101.5212 },
      { lat: 3.1849, lng: 101.5239 },
      { lat: 3.1869, lng: 101.5264 },
      { lat: 3.1885, lng: 101.5285 }
    ]
  },

  // 10. Temu Commercial <-> ERKC Rainforest
  {
    from: 'temu-hub',
    to: 'erkc-rainforest',
    canopyPath: [
      { lat: 3.1795, lng: 101.5245 },
      { lat: 3.1825, lng: 101.5260 },
      { lat: 3.1858, lng: 101.5274 },
      { lat: 3.1885, lng: 101.5285 }
    ],
    nightPath: [
      { lat: 3.1795, lng: 101.5245 },
      { lat: 3.1828, lng: 101.5262 },
      { lat: 3.1860, lng: 101.5275 },
      { lat: 3.1885, lng: 101.5285 }
    ],
    barrierPath: [
      { lat: 3.1795, lng: 101.5245 },
      { lat: 3.1826, lng: 101.5261 },
      { lat: 3.1859, lng: 101.5274 },
      { lat: 3.1885, lng: 101.5285 }
    ]
  }
];

// Helper to build adjacency map for graph routing
const adjacencyMap: Record<string, string[]> = {};
ELMINA_CORRIDOR_SEGMENTS.forEach((seg) => {
  if (!adjacencyMap[seg.from]) adjacencyMap[seg.from] = [];
  if (!adjacencyMap[seg.to]) adjacencyMap[seg.to] = [];
  adjacencyMap[seg.from].push(seg.to);
  adjacencyMap[seg.to].push(seg.from);
});

// Breadth-First-Search (BFS) shortest path on the township network graph
function findNodePath(startId: string, endId: string): string[] {
  if (startId === endId) return [startId];
  const queue: string[][] = [[startId]];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    const neighbors = adjacencyMap[node] || [];
    for (const neighbor of neighbors) {
      if (neighbor === endId) {
        return [...path, neighbor];
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [startId, endId]; // fallback
}

// Find segment between 2 directly adjacent nodes
function getSegmentBetween(u: string, v: string): SegmentDefinition | null {
  for (const seg of ELMINA_CORRIDOR_SEGMENTS) {
    if (seg.from === u && seg.to === v) return seg;
    if (seg.from === v && seg.to === u) {
      // Reverse waypoints
      return {
        from: u,
        to: v,
        canopyPath: [...seg.canopyPath].reverse(),
        nightPath: [...seg.nightPath].reverse(),
        barrierPath: [...seg.barrierPath].reverse()
      };
    }
  }
  return null;
}

// Compute custom multi-mode paths between ANY two landmarks in City of Elmina
export function computeElminaRoutes(originId: string, destId: string): RouteCalculationResult {
  const origin = LANDMARKS.find((l) => l.id === originId) || LANDMARKS[0];
  const dest = LANDMARKS.find((l) => l.id === destId) || LANDMARKS[1];

  const nodeSequence = findNodePath(origin.id, dest.id);

  const shadePath: LatLngPoint[] = [];
  const nightPath: LatLngPoint[] = [];
  const barrierPath: LatLngPoint[] = [];

  for (let i = 0; i < nodeSequence.length - 1; i++) {
    const u = nodeSequence[i];
    const v = nodeSequence[i + 1];
    const seg = getSegmentBetween(u, v);

    if (seg) {
      // Avoid duplicating vertex if not first segment
      const cPoints = i === 0 ? seg.canopyPath : seg.canopyPath.slice(1);
      const nPoints = i === 0 ? seg.nightPath : seg.nightPath.slice(1);
      const bPoints = i === 0 ? seg.barrierPath : seg.barrierPath.slice(1);

      shadePath.push(...cPoints);
      nightPath.push(...nPoints);
      barrierPath.push(...bPoints);
    } else {
      // Fallback straight vector
      const uLm = LANDMARKS.find((l) => l.id === u);
      const vLm = LANDMARKS.find((l) => l.id === v);
      if (uLm && vLm) {
        if (i === 0) {
          shadePath.push(uLm.position);
          nightPath.push(uLm.position);
          barrierPath.push(uLm.position);
        }
        shadePath.push(vLm.position);
        nightPath.push(vLm.position);
        barrierPath.push(vLm.position);
      }
    }
  }

  // Calculate actual line length
  let totalDistKm = 0;
  for (let i = 0; i < shadePath.length - 1; i++) {
    totalDistKm += calculateDistanceKm(shadePath[i], shadePath[i + 1]);
  }
  totalDistKm = Math.max(0.4, Number(totalDistKm.toFixed(2)));

  const walkingMinutes = Math.max(3, Math.round((totalDistKm / 4.8) * 60)); // ~4.8 km/h pedestrian pace

  // Specific microclimate scores based on landmarks involved
  const isErkc = originId === 'erkc-rainforest' || destId === 'erkc-rainforest';
  const isPark = originId === 'elmina-central-park' || destId === 'elmina-central-park';
  const isRainbow = originId === 'rainbow-bridge' || destId === 'rainbow-bridge';

  const shadePercent = isErkc ? 96 : isPark || isRainbow ? 91 : 84;
  const temperatureRelief = isErkc ? '-4.5°C' : isPark ? '-3.8°C' : '-3.1°C';
  const nightLux = isRainbow ? 82 : 72;
  const maxGradePercent = isRainbow ? 2.4 : 1.8;

  return {
    shadePath,
    nightPath,
    barrierPath,
    distanceKm: totalDistKm,
    walkingMinutes,
    shadePercent,
    temperatureRelief,
    nightLux,
    maxGradePercent,
    stepCount: 0,
    originName: origin.name,
    destName: dest.name
  };
}

// Get ALL township-wide paths for the comprehensive infrastructure mesh
export function getAllTownshipNetworks() {
  const allCanopySegments = ELMINA_CORRIDOR_SEGMENTS.map((s) => s.canopyPath);
  const allNightSegments = ELMINA_CORRIDOR_SEGMENTS.map((s) => s.nightPath);
  const allBarrierSegments = ELMINA_CORRIDOR_SEGMENTS.map((s) => s.barrierPath);

  return {
    allCanopySegments,
    allNightSegments,
    allBarrierSegments
  };
}
