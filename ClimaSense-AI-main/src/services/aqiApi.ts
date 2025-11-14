export interface AQIData {
  location: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  measurements: {
    parameter: string;
    value: number;
    unit: string;
    lastUpdated: string;
  }[];
  aqi: number; // Calculated AQI value
  dominantPollutant: string;
  sourceName: string;
}

export interface AQIMapData {
  locations: AQIData[];
  lastUpdated: string;
}

// AQI breakpoints for US EPA standard
const AQI_BREAKPOINTS = {
  pm25: [
    { min: 0, max: 12.0, aqiMin: 0, aqiMax: 50 },
    { min: 12.1, max: 35.4, aqiMin: 51, aqiMax: 100 },
    { min: 35.5, max: 55.4, aqiMin: 101, aqiMax: 150 },
    { min: 55.5, max: 150.4, aqiMin: 151, aqiMax: 200 },
    { min: 150.5, max: 250.4, aqiMin: 201, aqiMax: 300 },
    { min: 250.5, max: 500.4, aqiMin: 301, aqiMax: 500 },
  ],
  pm10: [
    { min: 0, max: 54, aqiMin: 0, aqiMax: 50 },
    { min: 55, max: 154, aqiMin: 51, aqiMax: 100 },
    { min: 155, max: 254, aqiMin: 101, aqiMax: 150 },
    { min: 255, max: 354, aqiMin: 151, aqiMax: 200 },
    { min: 355, max: 424, aqiMin: 201, aqiMax: 300 },
    { min: 425, max: 604, aqiMin: 301, aqiMax: 500 },
  ],
  o3: [
    { min: 0, max: 0.054, aqiMin: 0, aqiMax: 50 },
    { min: 0.055, max: 0.070, aqiMin: 51, aqiMax: 100 },
    { min: 0.071, max: 0.085, aqiMin: 101, aqiMax: 150 },
    { min: 0.086, max: 0.105, aqiMin: 151, aqiMax: 200 },
    { min: 0.106, max: 0.200, aqiMin: 201, aqiMax: 300 },
    { min: 0.201, max: 0.604, aqiMin: 301, aqiMax: 500 },
  ],
  no2: [
    { min: 0, max: 0.053, aqiMin: 0, aqiMax: 50 },
    { min: 0.054, max: 0.100, aqiMin: 51, aqiMax: 100 },
    { min: 0.101, max: 0.360, aqiMin: 101, aqiMax: 150 },
    { min: 0.361, max: 0.649, aqiMin: 151, aqiMax: 200 },
    { min: 0.650, max: 1.249, aqiMin: 201, aqiMax: 300 },
    { min: 1.250, max: 2.049, aqiMin: 301, aqiMax: 500 },
  ],
  so2: [
    { min: 0, max: 0.035, aqiMin: 0, aqiMax: 50 },
    { min: 0.036, max: 0.075, aqiMin: 51, aqiMax: 100 },
    { min: 0.076, max: 0.185, aqiMin: 101, aqiMax: 150 },
    { min: 0.186, max: 0.304, aqiMin: 151, aqiMax: 200 },
    { min: 0.305, max: 0.604, aqiMin: 201, aqiMax: 300 },
    { min: 0.605, max: 1.004, aqiMin: 301, aqiMax: 500 },
  ],
  co: [
    { min: 0, max: 4.4, aqiMin: 0, aqiMax: 50 },
    { min: 4.5, max: 9.4, aqiMin: 51, aqiMax: 100 },
    { min: 9.5, max: 12.4, aqiMin: 101, aqiMax: 150 },
    { min: 12.5, max: 15.4, aqiMin: 151, aqiMax: 200 },
    { min: 15.5, max: 30.4, aqiMin: 201, aqiMax: 300 },
    { min: 30.5, max: 50.4, aqiMin: 301, aqiMax: 500 },
  ],
};

/**
 * Calculate AQI from pollutant concentration
 */
function calculateAQI(pollutant: string, value: number): number {
  const breakpoints = AQI_BREAKPOINTS[pollutant as keyof typeof AQI_BREAKPOINTS];
  if (!breakpoints) return 0;

  // Convert units if necessary (OpenAQ uses µg/m³, breakpoints expect µg/m³ for most)
  let adjustedValue = value;

  // For CO, convert from µg/m³ to mg/m³ if needed
  if (pollutant === 'co' && value > 50) {
    adjustedValue = value / 1000; // Assume it's in µg/m³, convert to mg/m³
  }

  for (const bp of breakpoints) {
    if (adjustedValue >= bp.min && adjustedValue <= bp.max) {
      return Math.round(
        ((bp.aqiMax - bp.aqiMin) / (bp.max - bp.min)) * (adjustedValue - bp.min) + bp.aqiMin
      );
    }
  }

  // If value exceeds highest breakpoint, return max AQI
  return 500;
}

/**
 * Fetch AQI data from World Air Quality Index API for global cities
 */
export const fetchGlobalAQIData = async (): Promise<AQIMapData> => {
  try {
    // Using World Air Quality Index (WAQI) API - has free tier available
    const url = 'https://api.waqi.info/map/bounds/?latlng=-90,-180,90,180&token=demo';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`WAQI API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'ok' || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response from WAQI API');
    }

    const locations: AQIData[] = data.data
      .filter((station: any) => {
        // Filter for stations with valid coordinates and AQI
        return (
          station.lat &&
          station.lon &&
          station.aqi !== '-' &&
          !isNaN(parseInt(station.aqi))
        );
      })
      .map((station: any) => {
        const aqi = parseInt(station.aqi);
        const measurements = [
          {
            parameter: 'PM2.5',
            value: aqi, // Approximate PM2.5 from AQI
            unit: 'µg/m³',
            lastUpdated: new Date().toISOString(),
          }
        ];

        return {
          location: station.station?.name || 'Unknown Station',
          city: station.station?.name?.split(',')[0] || 'Unknown City',
          country: 'Unknown', // WAQI doesn't provide country in free tier
          coordinates: {
            latitude: parseFloat(station.lat),
            longitude: parseFloat(station.lon),
          },
          measurements,
          aqi,
          dominantPollutant: 'PM2.5',
          sourceName: 'World Air Quality Index',
        };
      })
      .filter((location: AQIData) => location.aqi > 0 && location.aqi <= 500)
      .slice(0, 50); // Limit to 50 locations for performance

    return {
      locations,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch AQI data from WAQI:', error);
    // Return demo data as fallback
    return getDemoAQIData();
  }
};

/**
 * Demo AQI data for fallback when APIs are unavailable
 */
const getDemoAQIData = (): AQIMapData => {
  const demoLocations: AQIData[] = [
    {
      location: 'New York',
      city: 'New York',
      country: 'USA',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      measurements: [{ parameter: 'PM2.5', value: 25, unit: 'µg/m³', lastUpdated: new Date().toISOString() }],
      aqi: 25,
      dominantPollutant: 'PM2.5',
      sourceName: 'Demo Data',
    },
    {
      location: 'London',
      city: 'London',
      country: 'UK',
      coordinates: { latitude: 51.5074, longitude: -0.1278 },
      measurements: [{ parameter: 'PM2.5', value: 35, unit: 'µg/m³', lastUpdated: new Date().toISOString() }],
      aqi: 35,
      dominantPollutant: 'PM2.5',
      sourceName: 'Demo Data',
    },
    {
      location: 'Tokyo',
      city: 'Tokyo',
      country: 'Japan',
      coordinates: { latitude: 35.6762, longitude: 139.6503 },
      measurements: [{ parameter: 'PM2.5', value: 45, unit: 'µg/m³', lastUpdated: new Date().toISOString() }],
      aqi: 45,
      dominantPollutant: 'PM2.5',
      sourceName: 'Demo Data',
    },
    {
      location: 'Delhi',
      city: 'Delhi',
      country: 'India',
      coordinates: { latitude: 28.7041, longitude: 77.1025 },
      measurements: [{ parameter: 'PM2.5', value: 180, unit: 'µg/m³', lastUpdated: new Date().toISOString() }],
      aqi: 180,
      dominantPollutant: 'PM2.5',
      sourceName: 'Demo Data',
    },
    {
      location: 'Beijing',
      city: 'Beijing',
      country: 'China',
      coordinates: { latitude: 39.9042, longitude: 116.4074 },
      measurements: [{ parameter: 'PM2.5', value: 120, unit: 'µg/m³', lastUpdated: new Date().toISOString() }],
      aqi: 120,
      dominantPollutant: 'PM2.5',
      sourceName: 'Demo Data',
    },
    {
      location: 'Los Angeles',
      city: 'Los Angeles',
      country: 'USA',
      coordinates: { latitude: 34.0522, longitude: -118.2437 },
      measurements: [{ parameter: 'PM2.5', value: 55, unit: 'µg/m³', lastUpdated: new Date().toISOString() }],
      aqi: 55,
      dominantPollutant: 'PM2.5',
      sourceName: 'Demo Data',
    },
    {
      location: 'Mumbai',
      city: 'Mumbai',
      country: 'India',
      coordinates: { latitude: 19.0760, longitude: 72.8777 },
      measurements: [{ parameter: 'PM2.5', value: 95, unit: 'µg/m³', lastUpdated: new Date().toISOString() }],
      aqi: 95,
      dominantPollutant: 'PM2.5',
      sourceName: 'Demo Data',
    },
    {
      location: 'São Paulo',
      city: 'São Paulo',
      country: 'Brazil',
      coordinates: { latitude: -23.5505, longitude: -46.6333 },
      measurements: [{ parameter: 'PM2.5', value: 75, unit: 'µg/m³', lastUpdated: new Date().toISOString() }],
      aqi: 75,
      dominantPollutant: 'PM2.5',
      sourceName: 'Demo Data',
    },
  ];

  return {
    locations: demoLocations,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Get AQI color based on value
 */
export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#00e400'; // Good - Green
  if (aqi <= 100) return '#ffff00'; // Moderate - Yellow
  if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return '#ff0000'; // Unhealthy - Red
  if (aqi <= 300) return '#8f3f97'; // Very Unhealthy - Purple
  return '#7e0023'; // Hazardous - Maroon
};

/**
 * Get AQI category name
 */
export const getAQICategory = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

/**
 * Get AQI health advice
 */
export const getAQIHealthAdvice = (aqi: number): string => {
  if (aqi <= 50) return 'Air quality is satisfactory, and air pollution poses little or no risk.';
  if (aqi <= 100) return 'Air quality is acceptable. However, there may be a risk for some people.';
  if (aqi <= 150) return 'Members of sensitive groups may experience health effects.';
  if (aqi <= 200) return 'Everyone may begin to experience health effects.';
  if (aqi <= 300) return 'Health alert: everyone may experience more serious health effects.';
  return 'Health warning of emergency conditions. The entire population is more likely to be affected.';
};
