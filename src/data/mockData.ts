import { EducationalPin, Landmark, RewardItem, SensorNode, ScannedTownshipPlace, LatLngPoint } from '../types';

export const ELMINA_CENTER: LatLngPoint = {
  lat: 3.1818,
  lng: 101.5175
};

export const LANDMARKS: Landmark[] = [
  {
    id: 'elmina-lakeside-mall',
    name: 'Elmina Lakeside Mall',
    subtitle: 'Waterfront Retail & Dining Concourse',
    x: 240,
    y: 280,
    position: { lat: 3.1782, lng: 101.5135 },
    category: 'commercial',
    icon: 'storefront',
    shadeScore: 65,
    lightScore: 95,
    barrierFreeScore: 100,
    description: 'Premier lakeside lifestyle mall featuring seamless zero-step boardwalks, solar canopy promenades, and direct park trail access.',
    facilities: ['Accessible Restrooms', 'Tactile Paving', 'EV Charging', 'Stroller Ramps']
  },
  {
    id: 'rainbow-bridge',
    name: 'Elmina Rainbow Bridge',
    subtitle: 'Iconic Arched Pedestrian Walkway',
    x: 620,
    y: 340,
    position: { lat: 3.1843, lng: 101.5190 },
    category: 'civic',
    icon: 'palette',
    shadeScore: 82,
    lightScore: 100,
    barrierFreeScore: 98,
    description: 'Iconic multi-hued pedestrian bridge spanning the lake with 2.4% ADA-compliant slope, integrated solar LED illumination, and cooling mist nozzles.',
    facilities: ['2.4% Gentle Grade Ramp', 'High-Lux Amber LED Arc', 'Misting Cooling Jets', 'Acoustic Signals']
  },
  {
    id: 'elmina-central-park',
    name: 'Elmina Central Park',
    subtitle: '300-Acre Urban Wetland & Spine',
    x: 880,
    y: 420,
    position: { lat: 3.1818, lng: 101.5175 },
    category: 'nature',
    icon: 'park',
    shadeScore: 94,
    lightScore: 88,
    barrierFreeScore: 96,
    description: 'Heart of Elmina with 300 acres of bioretention lakes, continuous native dipterocarp forest corridors, and step-free rubberized fitness trails.',
    facilities: ['Forest Canopy Trails', 'Solar SOS Emergency Pillars', 'Rest Pods', 'Tactile Guidance']
  },
  {
    id: 'erkc-rainforest',
    name: 'Elmina Rainforest Knowledge Centre (ERKC)',
    subtitle: 'Urban Biodiversity & Native Tree Nursery',
    x: 1320,
    y: 500,
    position: { lat: 3.1885, lng: 101.5285 },
    category: 'nature',
    icon: 'forest',
    shadeScore: 98,
    lightScore: 78,
    barrierFreeScore: 92,
    description: 'Partnership between Sime Darby Property & TRCRC cultivating 210,000 IUCN Red List trees with deep shade cover and educational biodiversity trails.',
    facilities: ['Native Arboreta', 'Shaded Research Pavilions', 'Elevated Step-Free Boardwalk', 'Tree Adoption']
  },
  {
    id: 'elmina-valley-spine',
    name: 'Elmina Valley Greenway (EV3)',
    subtitle: 'Active Mobility Corridor & Rest Pods',
    x: 960,
    y: 700,
    position: { lat: 3.1755, lng: 101.5120 },
    category: 'wellness',
    icon: 'directions_walk',
    shadeScore: 85,
    lightScore: 92,
    barrierFreeScore: 97,
    description: 'Dedicated 90km jogging and cycle track winding through residential clusters with continuous shade trees, solar lighting, and rest pavilions.',
    facilities: ['Dual Cycle/Jog Track', 'Solar Lighting Pillars', 'Water Refill Stations', 'Level Crossings']
  },
  {
    id: 'elmina-sports-park',
    name: 'Elmina Sports Park & Velodrome',
    subtitle: 'Community Athletics & Pump Track',
    x: 420,
    y: 680,
    position: { lat: 3.1738, lng: 101.5195 },
    category: 'civic',
    icon: 'sports_soccer',
    shadeScore: 70,
    lightScore: 96,
    barrierFreeScore: 95,
    description: 'Township athletic complex with pump track, velodrome loops, covered spectator stands, and universally accessible playing fields.',
    facilities: ['Accessible Bleachers', 'Solar Floodlights', 'Universal Changing Rooms', 'Smooth Tracks']
  },
  {
    id: 'temu-hub',
    name: 'Temu Commercial Promenade',
    subtitle: 'Bustling Neighborhood Artisan & Retail Hub',
    x: 750,
    y: 250,
    position: { lat: 3.1795, lng: 101.5245 },
    category: 'commercial',
    icon: 'store',
    shadeScore: 72,
    lightScore: 94,
    barrierFreeScore: 95,
    description: 'Vibrant dining and retail destination connected via tree-lined avenues with drop-kerb crossings and shaded street-side seating.',
    facilities: ['Covered Arcades', 'Street Level Drop-Kerbs', 'Bright Night Facades', 'Outdoor Mist Fans']
  },
  {
    id: 'elmina-pavilion',
    name: 'Central Park Pavilion & Wetland Pier',
    subtitle: 'Panoramic Lake Viewpoint & Event Lawn',
    x: 820,
    y: 380,
    position: { lat: 3.1828, lng: 101.5212 },
    category: 'nature',
    icon: 'wb_sunny',
    shadeScore: 89,
    lightScore: 90,
    barrierFreeScore: 100,
    description: 'Iconic open-air timber shelter with wide shade overhangs and barrier-free wooden boardwalks reaching into the wetland reeds.',
    facilities: ['Timber Shade Pergola', 'Lake Boardwalk', 'Wheelchair Rest Pads', 'Wildlife Viewing Hub']
  }
];

export const EDUCATIONAL_PINS: EducationalPin[] = [
  {
    id: 'pin-rainbow-bridge',
    name: 'Elmina Rainbow Bridge',
    badge: 'Iconic Arched Walkway • Civic Art',
    title: 'Elmina Rainbow Bridge & Shaded Arches',
    body: 'Spanning the Elmina Central Park lake, this landmark pedestrian bridge features vibrant steel parabolic arches with integrated night photocells and misting jets, offering 100% step-free crossing for wheelchair and stroller commuters.',
    stat: 'Step-Free Grade: 2.4% (Universal Access)',
    icon: 'palette',
    x: 620,
    y: 340,
    position: { lat: 3.1843, lng: 101.5190 },
    color: '#006948'
  },
  {
    id: 'pin-erkc-nursery',
    name: 'ERKC Rainforest Sanctuary',
    badge: 'Native Flora Conservation Hub',
    title: 'Elmina Rainforest Knowledge Centre (ERKC)',
    body: 'In partnership with TRCRC (Tropical Rainforest Conservation & Research Centre), ERKC cultivates over 210,000 endangered IUCN Red List dipterocarp saplings to restore natural canopy density across the township of Shah Alam.',
    stat: 'IUCN Threatened Trees: 37 Native Species',
    icon: 'forest',
    x: 1320,
    y: 500,
    position: { lat: 3.1885, lng: 101.5285 },
    color: '#006c49'
  },
  {
    id: 'pin-lakeside-bioretention',
    name: 'Lakeside Bioretention Wetland',
    badge: 'Nature-Based Sustainable Drainage',
    title: 'Central Park Stormwater Sponge & Lake',
    body: 'Naturally retains 100-year storm flood volumes from the Sungai Buloh basin, filtering urban runoff through native reed beds and lowering ambient surface temperatures by up to 3.8°C.',
    stat: 'Water Purification: 94.2% Runoff Filtered',
    icon: 'water_drop',
    x: 880,
    y: 420,
    position: { lat: 3.1818, lng: 101.5175 },
    color: '#00855d'
  },
  {
    id: 'pin-gce-acoustic-buffer',
    name: 'GCE Forest Acoustic Buffer',
    badge: 'Expressway Multi-Tier Bio-Shield',
    title: 'Guthrie Corridor Expressway Bio-Shield',
    body: 'A 50-meter dense multi-canopy buffer along the Guthrie Corridor Expressway (E35) absorbs 18dB of vehicular sound and sequesters 42 tonnes of PM10 highway emissions annually.',
    stat: 'Acoustic Attenuation: -18 dB Decibel Drop',
    icon: 'nature_people',
    x: 360,
    y: 190,
    position: { lat: 3.1870, lng: 101.5130 },
    color: '#a36700'
  }
];

export const SENSOR_NODES: SensorNode[] = [
  {
    id: 'node-elmina-mall',
    zone: 'Zone 1 (Lakeside Mall Concourse)',
    name: 'Mall Esplanade Microclimate Node',
    temp: 32.8,
    underCanopyTemp: 29.4,
    humidity: 68,
    aqi: 22,
    uv: 4.2,
    canopyCover: 65,
    status: 'optimal',
    x: 240,
    y: 280,
    position: { lat: 3.1782, lng: 101.5135 }
  },
  {
    id: 'node-rainbow-bridge',
    zone: 'Zone 2 (Rainbow Bridge & Lake North)',
    name: 'Rainbow Bridge Mist Sensor',
    temp: 31.9,
    underCanopyTemp: 28.2,
    humidity: 74,
    aqi: 20,
    uv: 3.8,
    canopyCover: 82,
    status: 'optimal',
    x: 620,
    y: 340,
    position: { lat: 3.1843, lng: 101.5190 }
  },
  {
    id: 'node-central-park-core',
    zone: 'Zone 3 (Elmina Central Park 300-Acre)',
    name: 'Central Wetland Banyan Pod',
    temp: 30.4,
    underCanopyTemp: 26.8,
    humidity: 76,
    aqi: 17,
    uv: 2.4,
    canopyCover: 94,
    status: 'optimal',
    x: 880,
    y: 420,
    position: { lat: 3.1818, lng: 101.5175 }
  },
  {
    id: 'node-erkc-canopy',
    zone: 'Zone 4 (ERKC Rainforest Conservation)',
    name: 'Dipterocarp Deep Forest Station',
    temp: 29.8,
    underCanopyTemp: 26.2,
    humidity: 82,
    aqi: 14,
    uv: 1.8,
    canopyCover: 98,
    status: 'optimal',
    x: 1320,
    y: 500,
    position: { lat: 3.1885, lng: 101.5285 }
  },
  {
    id: 'node-elmina-valley',
    zone: 'Zone 5 (Elmina Valley EV1-EV5)',
    name: 'EV3 Active Spine Weather Beacon',
    temp: 31.5,
    underCanopyTemp: 28.1,
    humidity: 71,
    aqi: 21,
    uv: 3.2,
    canopyCover: 85,
    status: 'optimal',
    x: 960,
    y: 700,
    position: { lat: 3.1755, lng: 101.5120 }
  },
  {
    id: 'node-gce-corridor',
    zone: 'Zone 6 (Guthrie Corridor Expressway E35)',
    name: 'GCE Highway Acoustic & Heat Node',
    temp: 34.6,
    underCanopyTemp: 30.5,
    humidity: 62,
    aqi: 38,
    uv: 4.8,
    canopyCover: 46,
    status: 'warning',
    x: 360,
    y: 190,
    position: { lat: 3.1870, lng: 101.5130 }
  }
];

// HIGH PRECISION ROUTE PATHS ALIGNED WITH ACTUAL ROADS AND TRAILS OF CITY OF ELMINA
export const SHADE_CANOPY_PATH: LatLngPoint[] = [
  { lat: 3.1782, lng: 101.5135 }, // Lakeside Mall Prom
  { lat: 3.1794, lng: 101.5146 }, // Shaded Lakeside Walk
  { lat: 3.1808, lng: 101.5160 }, // Wetland Willow Pier
  { lat: 3.1822, lng: 101.5173 }, // Central Park Banyan Grove
  { lat: 3.1834, lng: 101.5182 }, // Lake Narrowing Approach
  { lat: 3.1843, lng: 101.5190 }, // Rainbow Bridge Arches
  { lat: 3.1853, lng: 101.5205 }, // North Shore Tree Canopy
  { lat: 3.1864, lng: 101.5228 }, // Urban Agro-Forestry Trail
  { lat: 3.1874, lng: 101.5252 }, // Dipterocarp Avenue
  { lat: 3.1885, lng: 101.5285 }  // ERKC Rainforest Sanctuary
];

export const SAFENIGHT_LIT_PATH: LatLngPoint[] = [
  { lat: 3.1782, lng: 101.5135 }, // Mall Waterfront Concourse (70 lux)
  { lat: 3.1798, lng: 101.5152 }, // Solar LED Promenade Track (55 lux)
  { lat: 3.1816, lng: 101.5170 }, // Illuminated Central Plaza (65 lux)
  { lat: 3.1832, lng: 101.5182 }, // Bridge South Light Tower (60 lux)
  { lat: 3.1843, lng: 101.5190 }, // Rainbow Bridge Glowing Neon Arch (80 lux)
  { lat: 3.1856, lng: 101.5212 }, // North Bank Illuminated Spine (58 lux)
  { lat: 3.1870, lng: 101.5245 }, // Active Corridors LED Path (52 lux)
  { lat: 3.1885, lng: 101.5285 }  // ERKC Night Research Pavilion (60 lux)
];

export const BARRIER_FREE_PATH: LatLngPoint[] = [
  { lat: 3.1782, lng: 101.5135 }, // Mall Step-Free Terrace (0.0% grade)
  { lat: 3.1795, lng: 101.5147 }, // Anti-slip Tactile Paving (0.8% grade)
  { lat: 3.1812, lng: 101.5165 }, // Wetland Boardwalk Wheelchair Turnabout (1.2% grade)
  { lat: 3.1828, lng: 101.5178 }, // Universal Access Ramp (1.8% grade)
  { lat: 3.1843, lng: 101.5190 }, // Rainbow Bridge Arch (Gentle 2.4% grade, ADA certified)
  { lat: 3.1858, lng: 101.5218 }, // Dropped Kerb Crossing with Acoustic Beacon
  { lat: 3.1872, lng: 101.5250 }, // Continuous Guideway Tactile Line
  { lat: 3.1885, lng: 101.5285 }  // ERKC Flush Entrance & Automatic Sliders
];

// REAL SOLAR LIGHTING POSTS ALONG THE ELMINA SPINE
export const SAFENIGHT_LIGHT_POSTS = [
  { id: 'lp-1', position: { lat: 3.1782, lng: 101.5135 }, lux: 72, radius: 45, label: 'Mall West Solar Pole' },
  { id: 'lp-2', position: { lat: 3.1795, lng: 101.5148 }, lux: 58, radius: 40, label: 'Lakeside Track Light #12' },
  { id: 'lp-3', position: { lat: 3.1810, lng: 101.5162 }, lux: 62, radius: 42, label: 'Wetland Boardwalk Mast' },
  { id: 'lp-4', position: { lat: 3.1825, lng: 101.5176 }, lux: 68, radius: 50, label: 'Central Plaza High-Mast' },
  { id: 'lp-5', position: { lat: 3.1837, lng: 101.5185 }, lux: 64, radius: 45, label: 'Rainbow Bridge South Pylon' },
  { id: 'lp-6', position: { lat: 3.1843, lng: 101.5190 }, lux: 85, radius: 55, label: 'Rainbow Bridge Arch Illuminator' },
  { id: 'lp-7', position: { lat: 3.1852, lng: 101.5208 }, lux: 56, radius: 40, label: 'North Shore Smart Column' },
  { id: 'lp-8', position: { lat: 3.1866, lng: 101.5235 }, lux: 54, radius: 42, label: 'Agro-Trail Solar Beacon' },
  { id: 'lp-9', position: { lat: 3.1878, lng: 101.5262 }, lux: 59, radius: 45, label: 'ERKC Forest Portal Mast' },
  { id: 'lp-10', position: { lat: 3.1885, lng: 101.5285 }, lux: 65, radius: 48, label: 'ERKC Security Beacon' },
  { id: 'lp-11', position: { lat: 3.1755, lng: 101.5120 }, lux: 60, radius: 45, label: 'Elmina Valley EV3 Solar Pillar' },
  { id: 'lp-12', position: { lat: 3.1738, lng: 101.5195 }, lux: 78, radius: 55, label: 'Sports Park Floodlight Node' }
];

// CANOPY FORESTRY ZONES (POLYGONS ON GOOGLE MAP)
export const ELMINA_CANOPY_ZONES = [
  {
    id: 'zone-erkc-sanctuary',
    name: 'ERKC Native Rainforest Conservation Grove',
    coverage: 98,
    tempReduction: -4.6,
    color: '#006948',
    coordinates: [
      { lat: 3.1870, lng: 101.5260 },
      { lat: 3.1905, lng: 101.5275 },
      { lat: 3.1900, lng: 101.5315 },
      { lat: 3.1865, lng: 101.5305 },
      { lat: 3.1860, lng: 101.5275 }
    ]
  },
  {
    id: 'zone-central-park-wetlands',
    name: 'Central Park 300-Acre Tree Canopy Belt',
    coverage: 88,
    tempReduction: -3.8,
    color: '#00855d',
    coordinates: [
      { lat: 3.1800, lng: 101.5150 },
      { lat: 3.1835, lng: 101.5165 },
      { lat: 3.1855, lng: 101.5210 },
      { lat: 3.1830, lng: 101.5235 },
      { lat: 3.1805, lng: 101.5190 }
    ]
  },
  {
    id: 'zone-ev-greenway',
    name: 'Elmina Valley Linear Forest Corridors (EV1 - EV5)',
    coverage: 82,
    tempReduction: -3.2,
    color: '#006c49',
    coordinates: [
      { lat: 3.1735, lng: 101.5100 },
      { lat: 3.1775, lng: 101.5115 },
      { lat: 3.1770, lng: 101.5140 },
      { lat: 3.1730, lng: 101.5125 }
    ]
  }
];

// BARRIER-FREE SPECIFIC ACCESSIBILITY NODES
export const BARRIER_FREE_NODES = [
  {
    id: 'bf-1',
    position: { lat: 3.1843, lng: 101.5190 },
    type: 'ramp',
    title: 'Rainbow Bridge Gentle Ramp',
    grade: '2.4% Grade',
    desc: 'ADA-compliant continuous smooth grade with dual-height stainless handrails and slip-resistant grip pavers.'
  },
  {
    id: 'bf-2',
    position: { lat: 3.1782, lng: 101.5135 },
    type: 'elevator',
    title: 'Mall Waterfront Accessible Pier Lift',
    grade: '0.0% Grade',
    desc: 'Audio-announced priority elevator with low tactile control buttons and wide doors for power wheelchairs.'
  },
  {
    id: 'bf-3',
    position: { lat: 3.1818, lng: 101.5175 },
    type: 'tactile',
    title: 'Central Park Continuous Tactile Spur',
    grade: '1.2% Grade',
    desc: 'Directional blister and stripe tactile paving for visually impaired pedestrians leading directly to rest pavilions.'
  },
  {
    id: 'bf-4',
    position: { lat: 3.1828, lng: 101.5212 },
    type: 'restroom',
    title: 'Universal Access Restroom Pod #4',
    grade: 'Flush Sill',
    desc: 'Adult changing table, emergency alarm pull cord, automatic outward doors, and sensory gentle illumination.'
  },
  {
    id: 'bf-5',
    position: { lat: 3.1885, lng: 101.5285 },
    type: 'acoustic',
    title: 'ERKC Acoustic Signal Crossing',
    grade: 'Zero-step drop kerb',
    desc: 'Audible chirp and tactile push-button signal with 30-second safe pedestrian crossing phase across Persiaran Elmina.'
  }
];

// SCANNED TOWNSHIP PLACES RESULTING FROM LIVE ELMINA SCAN
export const SCANNED_ELMINA_PLACES: ScannedTownshipPlace[] = [
  {
    id: 'scan-1',
    name: 'Elmina Rainbow Bridge (Jambatan Pelangi)',
    category: 'canopy',
    position: { lat: 3.1843, lng: 101.5190 },
    distanceMeters: 380,
    canopyCoverage: 88,
    luxLevel: 85,
    slopeGrade: 2.4,
    stepFree: true,
    tactilePaving: true,
    solarLighting: true,
    coolingDelta: -3.5,
    address: 'Elmina Central Park, Seksyen U15, Shah Alam',
    statusNotes: 'Active misting nozzles, 100% step-free arched crossing, bright ambient amber LEDs.',
    rating: 4.9
  },
  {
    id: 'scan-2',
    name: 'Elmina Lakeside Mall Promenade',
    category: 'commercial',
    position: { lat: 3.1782, lng: 101.5135 },
    distanceMeters: 620,
    canopyCoverage: 72,
    luxLevel: 95,
    slopeGrade: 0.5,
    stepFree: true,
    tactilePaving: true,
    solarLighting: true,
    coolingDelta: -2.2,
    address: 'Persiaran Elmina, City of Elmina, 40160 Shah Alam',
    statusNotes: 'Complete ground floor step-free accessibility with Jaya Grocer and lakeside cafes.',
    rating: 4.7
  },
  {
    id: 'scan-3',
    name: 'Elmina Rainforest Knowledge Centre (ERKC)',
    category: 'canopy',
    position: { lat: 3.1885, lng: 101.5285 },
    distanceMeters: 1420,
    canopyCoverage: 98,
    luxLevel: 75,
    slopeGrade: 1.8,
    stepFree: true,
    tactilePaving: true,
    solarLighting: true,
    coolingDelta: -4.8,
    address: 'Forestry Buffer, City of Elmina, 40160 Shah Alam',
    statusNotes: '210,000 indigenous trees, continuous deep shade canopy, level research decks.',
    rating: 4.9
  },
  {
    id: 'scan-4',
    name: 'Central Park Wetland Boardwalk Pier',
    category: 'barrier_free',
    position: { lat: 3.1818, lng: 101.5175 },
    distanceMeters: 120,
    canopyCoverage: 94,
    luxLevel: 68,
    slopeGrade: 1.2,
    stepFree: true,
    tactilePaving: true,
    solarLighting: true,
    coolingDelta: -3.9,
    address: 'Central Lake, Seksyen U15, Shah Alam',
    statusNotes: 'Non-slip recycled composite decking, 1.2% slope, tactile edge buffers over wetland reeds.',
    rating: 4.8
  },
  {
    id: 'scan-5',
    name: 'Elmina Valley EV3 Active Mobility Pod',
    category: 'light',
    position: { lat: 3.1755, lng: 101.5120 },
    distanceMeters: 850,
    canopyCoverage: 84,
    luxLevel: 70,
    slopeGrade: 1.5,
    stepFree: true,
    tactilePaving: true,
    solarLighting: true,
    coolingDelta: -3.1,
    address: 'Elmina Valley 3 Greenway, Shah Alam',
    statusNotes: '90km jogging/cycling track spur with solar smart poles and water refill stations.',
    rating: 4.8
  },
  {
    id: 'scan-6',
    name: 'Elmina Sports Park Velodrome & Pump Track',
    category: 'civic',
    position: { lat: 3.1738, lng: 101.5195 },
    distanceMeters: 1100,
    canopyCoverage: 68,
    luxLevel: 88,
    slopeGrade: 1.0,
    stepFree: true,
    tactilePaving: true,
    solarLighting: true,
    coolingDelta: -1.9,
    address: 'Persiaran Atmosfera, Seksyen U16, Shah Alam',
    statusNotes: 'Fully illuminated evening running tracks and barrier-free spectator plazas.',
    rating: 4.7
  },
  {
    id: 'scan-7',
    name: 'Temu Commercial Artisan Strip',
    category: 'commercial',
    position: { lat: 3.1795, lng: 101.5245 },
    distanceMeters: 780,
    canopyCoverage: 65,
    luxLevel: 92,
    slopeGrade: 0.8,
    stepFree: true,
    tactilePaving: true,
    solarLighting: true,
    coolingDelta: -1.6,
    address: 'Jalan Temu 1, City of Elmina, 40160 Shah Alam',
    statusNotes: 'Bright street-level dining with zero-barrier dropped kerbs and covered arcades.',
    rating: 4.6
  },
  {
    id: 'scan-8',
    name: 'Elmina Central Park Lake Pavilion & Lawn',
    category: 'canopy',
    position: { lat: 3.1828, lng: 101.5212 },
    distanceMeters: 410,
    canopyCoverage: 91,
    luxLevel: 80,
    slopeGrade: 1.4,
    stepFree: true,
    tactilePaving: true,
    solarLighting: true,
    coolingDelta: -3.7,
    address: 'Lakeside Central, City of Elmina, 40160 Shah Alam',
    statusNotes: 'Timber pergola with 88% solar shade screening and panoramic water views.',
    rating: 4.8
  }
];

export const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'RM20 Voucher at Elmina Lakeside Mall',
    merchant: 'Sime Darby Property • Lakeside Mall',
    points: 400,
    category: 'food',
    description: 'Valid across participating lakeside promenade cafes, grocers (Jaya Grocer), and restaurants at Elmina Lakeside Mall.',
    expiryMinutes: 45,
    code: 'ELMINA-MALL-20RM-VAL'
  },
  {
    id: 'rew-2',
    title: 'Adopt an Endangered Dipterocarp Tree at ERKC',
    merchant: 'Elmina Rainforest Knowledge Centre (ERKC)',
    points: 500,
    category: 'nature',
    description: 'Fund the planting of a native Shorea/Meranti sapling in Central Park with your personalized GPS tag & digital certificate.',
    expiryMinutes: 1440,
    code: 'ERKC-ADOPT-TREE-SHOREA'
  },
  {
    id: 'rew-3',
    title: 'Elmina 90km Dedicated Track Bike Share Day Pass',
    merchant: 'Sime Darby Active Mobility Hub',
    points: 250,
    category: 'transit',
    description: 'Unlimited access to smart e-bikes across Elmina Valley, Rainbow Bridge, and Sports Park docking pods.',
    expiryMinutes: 120,
    code: 'ELMINA-BIKE-90KM-PASS'
  },
  {
    id: 'rew-4',
    title: 'Artisanal Cold Drip at Lakeside Pavilion Cafe',
    merchant: 'Elmina Waterfront Dining Concourse',
    points: 150,
    category: 'food',
    description: 'Complimentary single-origin iced coffee or organic pandan lemongrass cooler overlooking the Central Park lake.',
    expiryMinutes: 60,
    code: 'ELMINA-CAFE-DRIP-99'
  }
];

export const LEADERBOARD = [
  { rank: 1, name: 'Khairul Anwar (EV3)', steps: '31,200', savedCo2: '26.8 kg', badge: 'Elmina Forest Pioneer' },
  { rank: 2, name: 'Siti Nurhaliza (EV1)', steps: '26,450', savedCo2: '22.4 kg', badge: 'Canopy Steward' },
  { rank: 3, name: 'You (Danish - EV2)', steps: '14,280', savedCo2: '14.2 kg', badge: 'Canopy Steward' },
  { rank: 4, name: 'Kavitha Nathan (Ridge)', steps: '13,100', savedCo2: '11.8 kg', badge: 'Green Walker' },
  { rank: 5, name: 'Tan Wei Loon (Green)', steps: '11,400', savedCo2: '9.6 kg', badge: 'Active Citizen' }
];

export const ELEVATORS_STATUS = [
  { id: 'el-1', location: 'Elmina Lakeside Mall West Waterfront Lift', status: 'Operational', lastCheck: '3m ago' },
  { id: 'el-2', location: 'Rainbow Bridge South Promenade Ramp & Lift', status: 'Operational', lastCheck: '8m ago' },
  { id: 'el-3', location: 'ERKC Biodiversity Observation Tower Lift', status: 'Operational', lastCheck: '2m ago' },
  { id: 'el-4', location: 'Elmina Valley 3 Pedestrian Overpass Elevator', status: 'Operational', lastCheck: '14m ago' },
  { id: 'el-5', location: 'Elmina Sports Park Velodrome Ramp Access', status: 'Operational', lastCheck: '1m ago' },
  { id: 'el-6', location: 'Central Park Wetland Boardwalk Accessible Pier', status: 'Operational', lastCheck: '6m ago' }
];

export const DEVELOPER_ESG_BENCHMARKS = {
  township: 'City of Elmina, Shah Alam, Selangor',
  masterDeveloper: 'Sime Darby Property Berhad',
  totalArea: '5,000 Acres',
  centralParkSize: '300 Acres',
  joggingCyclingTrack: '90 Kilometers (Longest continuous in Malaysia)',
  nativeTreesTarget: '210,000 Native Rainforest Trees',
  currentCanopyCoverage: '68.4%',
  gbiRating: 'Green Building Index (GBI) Platinum Precinct',
  meanRadiantTempReduction: '-3.8°C (Peak 2:00 PM)',
  annualCarbonOffset: '14,800 Tonnes CO₂e'
};

