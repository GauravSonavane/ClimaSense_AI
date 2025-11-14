import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface AirQualityBreakdownProps {
  components?: {
    pm2_5: number;
    pm10: number;
    o3: number;
    co: number;
    no2: number;
  };
  className?: string;
}

export const AirQualityBreakdown = ({
  components = { pm2_5: 12, pm10: 25, o3: 45, co: 300, no2: 15 },
  className = ""
}: AirQualityBreakdownProps) => {
  const pollutants = [
    { name: 'PM2.5', value: components.pm2_5, unit: 'µg/m³', good: 10, moderate: 25, unhealthy: 50 },
    { name: 'PM10', value: components.pm10, unit: 'µg/m³', good: 20, moderate: 50, unhealthy: 100 },
    { name: 'Ozone', value: components.o3, unit: 'µg/m³', good: 40, moderate: 80, unhealthy: 120 },
    { name: 'CO', value: components.co, unit: 'µg/m³', good: 1000, moderate: 2000, unhealthy: 10000 },
    { name: 'NO₂', value: components.no2, unit: 'µg/m³', good: 20, moderate: 40, unhealthy: 100 },
  ];

  const getStatus = (value: number, good: number, moderate: number) => {
    if (value <= good) return { status: 'good', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (value <= moderate) return { status: 'moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { status: 'unhealthy', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-medium">Air Quality Breakdown</span>
      </div>

      <div className="space-y-2">
        {pollutants.map((pollutant) => {
          const status = getStatus(pollutant.value, pollutant.good, pollutant.moderate);
          const percentage = Math.min(100, (pollutant.value / pollutant.unhealthy) * 100);

          return (
            <div key={pollutant.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium w-8">{pollutant.name}</span>
                <div className="flex-1 bg-white/10 rounded-full h-1.5 w-16">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${status.bg.replace('bg-', 'bg-')}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${status.color}`}>
                  {pollutant.value}
                </span>
                <span className="text-xs text-muted-foreground">{pollutant.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-white/10">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span>Good</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-yellow-400" />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <XCircle className="w-3 h-3 text-red-400" />
          <span>Unhealthy</span>
        </div>
      </div>
    </div>
  );
};
