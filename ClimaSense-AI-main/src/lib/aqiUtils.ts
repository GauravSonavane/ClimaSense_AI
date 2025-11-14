import { AQIData, getAQIColor, getAQICategory } from '@/services/aqiApi';

/**
 * Normalize AQI data for consistent display
 */
export const normalizeAQIData = (data: AQIData) => {
  return {
    ...data,
    displayName: `${data.city}, ${data.country}`,
    color: getAQIColor(data.aqi),
    category: getAQICategory(data.aqi),
    // Ensure coordinates are valid numbers
    coordinates: {
      latitude: Number(data.coordinates.latitude) || 0,
      longitude: Number(data.coordinates.longitude) || 0,
    },
  };
};

/**
 * Get marker size based on AQI severity
 */
export const getMarkerSize = (aqi: number): number => {
  if (aqi <= 50) return 8; // Good
  if (aqi <= 100) return 10; // Moderate
  if (aqi <= 150) return 12; // Unhealthy for Sensitive
  if (aqi <= 200) return 14; // Unhealthy
  if (aqi <= 300) return 16; // Very Unhealthy
  return 18; // Hazardous
};

/**
 * Format AQI value for display
 */
export const formatAQI = (aqi: number): string => {
  return aqi.toString();
};

/**
 * Get tooltip content for map markers
 */
export const getMarkerTooltip = (data: AQIData): string => {
  const normalized = normalizeAQIData(data);
  return `
    <div class="p-2 max-w-xs">
      <div class="font-semibold text-sm mb-1">${normalized.displayName}</div>
      <div class="flex items-center gap-2 mb-2">
        <div class="w-3 h-3 rounded-full" style="background-color: ${normalized.color}"></div>
        <span class="text-lg font-bold">${formatAQI(data.aqi)}</span>
        <span class="text-xs">${normalized.category}</span>
      </div>
      <div class="text-xs text-gray-600">
        Dominant: ${data.dominantPollutant.toUpperCase()}
      </div>
      <div class="text-xs text-gray-500 mt-1">
        Source: ${data.sourceName}
      </div>
    </div>
  `;
};

/**
 * Debounce function for map interactions
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Check if coordinates are valid
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};

/**
 * Get default map center (global view)
 */
export const getDefaultMapCenter = (): [number, number] => {
  return [20, 0]; // Center of the world
};

/**
 * Get default map zoom level
 */
export const getDefaultMapZoom = (): number => {
  return 2; // World view
};

/**
 * Calculate bounds for multiple locations
 */
export const calculateBounds = (locations: AQIData[]): [[number, number], [number, number]] | null => {
  if (locations.length === 0) return null;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  locations.forEach(location => {
    const lat = location.coordinates.latitude;
    const lng = location.coordinates.longitude;

    if (isValidCoordinates(lat, lng)) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }
  });

  if (minLat === Infinity || maxLat === -Infinity) return null;

  // Add padding
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;

  return [
    [minLat - latPadding, minLng - lngPadding],
    [maxLat + latPadding, maxLng + lngPadding],
  ];
};
