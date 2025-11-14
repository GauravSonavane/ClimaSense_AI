import { Sun, Cloud, CloudRain, Zap, Snowflake } from "lucide-react";

interface AnimatedWeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export const AnimatedWeatherIcon = ({ condition, size = 24, className = "" }: AnimatedWeatherIconProps) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
    return (
      <div className={`relative ${className}`}>
        <Sun className="text-yellow-400 animate-pulse" size={size} />
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute top-1/4 right-0 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-100"></div>
          <div className="absolute bottom-0 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-200"></div>
          <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-300"></div>
        </div>
      </div>
    );
  }

  if (lowerCondition.includes('cloud')) {
    return (
      <div className={`relative ${className}`}>
        <Cloud className="text-gray-300" size={size} />
        <div className="absolute inset-0 animate-float">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (lowerCondition.includes('rain')) {
    return (
      <div className={`relative ${className}`}>
        <CloudRain className="text-blue-400" size={size} />
        <div className="absolute bottom-0 left-1/4 w-0.5 h-4 bg-blue-300 rounded-full animate-rain-drop"></div>
        <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-blue-300 rounded-full animate-rain-drop animation-delay-200"></div>
        <div className="absolute bottom-0 right-1/4 w-0.5 h-5 bg-blue-300 rounded-full animate-rain-drop animation-delay-400"></div>
      </div>
    );
  }

  if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
    return (
      <div className={`relative ${className}`}>
        <Zap className="text-yellow-500 animate-pulse" size={size} />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  if (lowerCondition.includes('snow')) {
    return (
      <div className={`relative ${className}`}>
        <Snowflake className="text-blue-200 animate-spin-slow" size={size} />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-float animation-delay-300"></div>
        </div>
      </div>
    );
  }

  // Default to cloud
  return <Cloud className="text-gray-300" size={size} />;
};
