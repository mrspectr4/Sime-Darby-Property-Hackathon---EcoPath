export type NavigationTab = 
  | 'township-map'
  | 'climate-sensors'
  | 'canopy-planner'
  | 'rewards'
  | 'accessibility'
  | 'settings';

export type RouteMode = 'shade' | 'night' | 'barrier';

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface Landmark {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  position: LatLngPoint;
  category: 'transit' | 'civic' | 'commercial' | 'wellness' | 'nature';
  icon: string;
  shadeScore?: number;
  lightScore?: number;
  barrierFreeScore?: number;
  description?: string;
  facilities?: string[];
}

export interface EducationalPin {
  id: string;
  name: string;
  badge: string;
  title: string;
  body: string;
  stat: string;
  icon: string;
  x: number;
  y: number;
  position: LatLngPoint;
  color: string;
}

export interface SensorNode {
  id: string;
  zone: string;
  name: string;
  temp: number;
  underCanopyTemp: number;
  humidity: number;
  aqi: number;
  uv: number;
  canopyCover: number;
  status: 'optimal' | 'warning' | 'active';
  x: number;
  y: number;
  position: LatLngPoint;
}

export interface ScannedTownshipPlace {
  id: string;
  name: string;
  category: 'canopy' | 'light' | 'barrier_free' | 'park' | 'civic' | 'commercial';
  position: LatLngPoint;
  distanceMeters: number;
  canopyCoverage: number; // percentage, e.g. 88%
  luxLevel: number; // lux at night, e.g. 58 lux
  slopeGrade: number; // grade percentage, e.g. 2.1%
  stepFree: boolean;
  tactilePaving: boolean;
  solarLighting: boolean;
  coolingDelta: number; // -3.8 °C
  address: string;
  statusNotes: string;
  rating?: number;
}

export interface RewardItem {
  id: string;
  title: string;
  merchant: string;
  points: number;
  category: 'food' | 'transit' | 'nature' | 'merchandise';
  description: string;
  expiryMinutes: number;
  code: string;
  redeemed?: boolean;
}

export interface PathIssueReport {
  id: string;
  category: string;
  location: string;
  zone: string;
  status: 'pending' | 'in_review' | 'resolved';
  timestamp: string;
  notes?: string;
}

