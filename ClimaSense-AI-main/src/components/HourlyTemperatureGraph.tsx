import { useMemo } from "react";

interface HourlyTemperatureGraphProps {
  hourlyData: { time: string; temp: number }[];
  className?: string;
}

export const HourlyTemperatureGraph = ({ hourlyData, className = "" }: HourlyTemperatureGraphProps) => {
  const { pathData, minTemp, maxTemp } = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return { pathData: "", minTemp: 0, maxTemp: 0 };

    const temps = hourlyData.map(h => h.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = maxTemp - minTemp || 1;

    const points = hourlyData.map((hour, index) => {
      const x = (index / (hourlyData.length - 1)) * 100;
      const y = 100 - ((hour.temp - minTemp) / range) * 80; // 80% height for better visibility
      return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;
    return { pathData, minTemp, maxTemp };
  }, [hourlyData]);

  if (!hourlyData || hourlyData.length === 0) {
    return <div className={`text-xs text-muted-foreground ${className}`}>No data</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-8">
        {/* Grid lines */}
        <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />

        {/* Temperature line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#tempGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-line"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Temperature labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{minTemp}°</span>
        <span>{maxTemp}°</span>
      </div>
    </div>
  );
};
