import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AQIData, AQIMapData, fetchGlobalAQIData, getAQIColor, getAQICategory, getAQIHealthAdvice } from '@/services/aqiApi';
import { normalizeAQIData, getMarkerSize, getMarkerTooltip, debounce, isValidCoordinates, getDefaultMapCenter, getDefaultMapZoom, calculateBounds } from '@/lib/aqiUtils';
import { GlassCard } from '@/components/GlassCard';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon creator
const createAQIMarker = (aqi: number, size: number = 12) => {
  const color = getAQIColor(aqi);
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.5}px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.7);
      ">
        ${aqi}
      </div>
    `,
    className: 'custom-aqi-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to fit bounds when data loads
const FitBounds = ({ locations }: { locations: AQIData[] }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = calculateBounds(locations);
      if (bounds) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [locations, map]);

  return null;
};

interface AQIMapProps {
  className?: string;
}

const AQIMap = ({ className = '' }: AQIMapProps) => {
  const [data, setData] = useState<AQIMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<AQIData | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const loadAQIData = async () => {
    try {
      setLoading(true);
      setError(null);
      const aqiData = await fetchGlobalAQIData();
      setData(aqiData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load air quality data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAQIData();
  }, []);

  const handleRefresh = debounce(() => {
    loadAQIData();
  }, 1000);

  if (loading) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading air quality data...</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-muted-foreground text-center">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </GlassCard>
    );
  }

  const locations = data?.locations || [];

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Interactive AQI Map</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg hover:bg-white/10 transition-colors text-sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {data?.lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <MapContainer
          center={getDefaultMapCenter()}
          zoom={getDefaultMapZoom()}
          style={{ height: '400px', width: '100%' }}
          className="rounded-lg"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location, index) => {
            const normalized = normalizeAQIData(location);
            if (!isValidCoordinates(normalized.coordinates.latitude, normalized.coordinates.longitude)) {
              return null;
            }

            return (
              <Marker
                key={`${location.city}-${index}`}
                position={[normalized.coordinates.latitude, normalized.coordinates.longitude]}
                icon={createAQIMarker(location.aqi, getMarkerSize(location.aqi))}
                eventHandlers={{
                  click: () => setSelectedLocation(location),
                }}
              >
                <Popup>
                  <div className="p-3 max-w-sm">
                    <h4 className="font-semibold text-sm mb-2">{normalized.displayName}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: normalized.color }}
                      />
                      <span className="text-lg font-bold">{location.aqi}</span>
                      <span className="text-xs text-muted-foreground">{normalized.category}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Dominant Pollutant: {location.dominantPollutant.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Source: {location.sourceName}
                    </div>
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      {getAQIHealthAdvice(location.aqi)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <FitBounds locations={locations} />
        </MapContainer>

        {/* AQI Legend */}
        <div className="absolute top-4 right-4 glass rounded-lg p-3 z-[1000]">
          <h4 className="text-sm font-semibold mb-2">AQI Legend</h4>
          <div className="space-y-1">
            {[
              { range: '0-50', label: 'Good', color: '#00e400' },
              { range: '51-100', label: 'Moderate', color: '#ffff00' },
              { range: '101-150', label: 'Unhealthy for Sensitive', color: '#ff7e00' },
              { range: '151-200', label: 'Unhealthy', color: '#ff0000' },
              { range: '201-300', label: 'Very Unhealthy', color: '#8f3f97' },
              { range: '301+', label: 'Hazardous', color: '#7e0023' },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.range}: {item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Info */}
        <div className="absolute bottom-4 left-4 glass rounded-lg p-3 z-[1000]">
          <div className="text-xs text-muted-foreground">
            Showing {locations.length} locations worldwide
          </div>
          <div className="text-xs text-muted-foreground">
            Data from OpenAQ Network
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default AQIMap;
