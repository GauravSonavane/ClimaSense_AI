import { Sun, Sunrise, Sunset } from "lucide-react";

interface SunriseSunsetCardProps {
  sunrise?: string;
  sunset?: string;
  className?: string;
}

export const SunriseSunsetCard = ({ sunrise = "6:30 AM", sunset = "7:15 PM", className = "" }: SunriseSunsetCardProps) => {
  // Calculate sun position based on current time (simplified)
  const now = new Date();
  const sunriseTime = new Date();
  sunriseTime.setHours(6, 30, 0);
  const sunsetTime = new Date();
  sunsetTime.setHours(19, 15, 0);

  const totalDaylight = sunsetTime.getTime() - sunriseTime.getTime();
  const elapsed = now.getTime() - sunriseTime.getTime();
  const sunPosition = Math.max(0, Math.min(1, elapsed / totalDaylight));

  const sunAngle = sunPosition * 180; // 0 to 180 degrees
  const sunX = 50 + 40 * Math.cos((sunAngle - 90) * Math.PI / 180);
  const sunY = 80 - 60 * Math.sin(sunAngle * Math.PI / 180);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Sun className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium">Sun Position</span>
      </div>

      <div className="relative">
        {/* Sun arc path */}
        <svg viewBox="0 0 100 100" className="w-full h-20">
          <defs>
            <linearGradient id="sunArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Arc background */}
          <path
            d="M 10 80 Q 50 20 90 80"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="2"
          />

          {/* Sun position indicator */}
          <circle
            cx={sunX}
            cy={sunY}
            r="4"
            fill="url(#sunArc)"
            className="animate-pulse"
          />

          {/* Sun rays */}
          <g className="animate-spin-slow" style={{ transformOrigin: `${sunX}px ${sunY}px` }}>
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45) * Math.PI / 180;
              const rayX = sunX + Math.cos(angle) * 8;
              const rayY = sunY + Math.sin(angle) * 8;
              return (
                <line
                  key={i}
                  x1={sunX}
                  y1={sunY}
                  x2={rayX}
                  y2={rayY}
                  stroke="#fbbf24"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
              );
            })}
          </g>
        </svg>

        {/* Time labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Sunrise className="w-3 h-3" />
            <span>{sunrise}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sunset className="w-3 h-3" />
            <span>{sunset}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
