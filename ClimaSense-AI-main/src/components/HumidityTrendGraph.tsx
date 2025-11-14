import { Droplets } from "lucide-react";

interface HumidityTrendGraphProps {
  humidityData?: number[];
  className?: string;
}

export const HumidityTrendGraph = ({ humidityData = [45, 50, 55, 60, 58, 62, 65, 63], className = "" }: HumidityTrendGraphProps) => {
  const maxHumidity = Math.max(...humidityData);
  const minHumidity = Math.min(...humidityData);

  const points = humidityData.map((humidity, index) => {
    const x = (index / (humidityData.length - 1)) * 100;
    const y = 100 - ((humidity - minHumidity) / (maxHumidity - minHumidity || 1)) * 80;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Droplets className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium">Humidity Trend</span>
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-16">
        {/* Background gradient */}
        <defs>
          <linearGradient id="humidityBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="humidityLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#humidityBg)" rx="4" />

        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />

        {/* Humidity line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#humidityLine)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-line"
        />

        {/* Data points */}
        {points.map((point, index) => {
          const [x, y] = point.split(',').map(Number);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="#3b82f6"
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          );
        })}
      </svg>

      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{minHumidity}%</span>
        <span>{maxHumidity}%</span>
      </div>
    </div>
  );
};
