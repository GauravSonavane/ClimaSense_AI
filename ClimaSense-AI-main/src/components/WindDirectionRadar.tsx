import { Navigation } from "lucide-react";

interface WindDirectionRadarProps {
  windDirection?: number; // degrees (0-360)
  windSpeed?: number;
  className?: string;
}

export const WindDirectionRadar = ({ windDirection = 0, windSpeed = 0, className = "" }: WindDirectionRadarProps) => {
  const compassPoints = [
    { label: 'N', angle: 0 },
    { label: 'NE', angle: 45 },
    { label: 'E', angle: 90 },
    { label: 'SE', angle: 135 },
    { label: 'S', angle: 180 },
    { label: 'SW', angle: 225 },
    { label: 'W', angle: 270 },
    { label: 'NW', angle: 315 },
  ];

  const getWindStrength = (speed: number) => {
    if (speed < 5) return { label: 'Light', color: 'text-green-400', intensity: 0.3 };
    if (speed < 15) return { label: 'Moderate', color: 'text-yellow-400', intensity: 0.6 };
    if (speed < 25) return { label: 'Strong', color: 'text-orange-400', intensity: 0.8 };
    return { label: 'Very Strong', color: 'text-red-400', intensity: 1 };
  };

  const windStrength = getWindStrength(windSpeed);

  return (
    <div className={`relative ${className}`}>
      <div className="text-center mb-2">
        <p className="text-sm font-medium">Wind Direction</p>
        <p className={`text-xs ${windStrength.color}`}>{windStrength.label}</p>
      </div>

      <div className="relative w-24 h-24 mx-auto">
        {/* Compass circle */}
        <div className="absolute inset-0 rounded-full border-2 border-white/20">
          {/* Compass points */}
          {compassPoints.map((point) => (
            <div
              key={point.label}
              className="absolute text-xs text-muted-foreground font-medium"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${point.angle}deg) translateY(-36px) rotate(-${point.angle}deg)`,
              }}
            >
              {point.label}
            </div>
          ))}

          {/* Wind direction arrow */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
            style={{
              transform: `translate(-50%, -50%) rotate(${windDirection}deg)`,
            }}
          >
            <Navigation
              className={`w-6 h-6 ${windStrength.color} animate-pulse`}
              style={{
                filter: `drop-shadow(0 0 ${windStrength.intensity * 8}px currentColor)`,
              }}
            />
          </div>

          {/* Animated wind circles */}
          <div className="absolute inset-0 rounded-full border border-white/10 animate-ping animation-delay-500"></div>
          <div className="absolute inset-2 rounded-full border border-white/5 animate-ping animation-delay-1000"></div>
        </div>
      </div>

      <div className="text-center mt-2">
        <p className="text-lg font-semibold">{windDirection}°</p>
        <p className="text-sm text-muted-foreground">{windSpeed} km/h</p>
      </div>
    </div>
  );
};
