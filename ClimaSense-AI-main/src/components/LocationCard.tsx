import { Cloud, CloudRain, Sun, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LocationCardProps {
  country: string;
  city: string;
  condition: string;
  temperature: number;
  icon?: "cloudy" | "rainy" | "sunny";
  aqi?: number;
  lastUpdated?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const weatherIcons = {
  cloudy: Cloud,
  rainy: CloudRain,
  sunny: Sun,
};

const getAQIColor = (aqi?: number) => {
  if (!aqi) return "bg-gray-400";
  if (aqi <= 50) return "bg-green-400";
  if (aqi <= 100) return "bg-yellow-400";
  if (aqi <= 150) return "bg-orange-400";
  if (aqi <= 200) return "bg-red-400";
  return "bg-purple-400";
};

export const LocationCard = ({
  country,
  city,
  condition,
  temperature,
  icon = "cloudy",
  aqi,
  lastUpdated = "2 min ago",
  isFavorite = false,
  onFavoriteToggle,
}: LocationCardProps) => {
  const Icon = weatherIcons[icon];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="glass rounded-3xl p-4 hover:bg-white/15 hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{country}</p>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-0.5">{city}</h3>
          <p className="text-xs text-muted-foreground">{condition}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.();
          }}
          className="p-1 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          <Star
            className={cn(
              "h-4 w-4 transition-all duration-200",
              isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-400"
            )}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-light text-foreground">{temperature}°</span>
          <Icon className="h-8 w-8 text-white/70 group-hover:animate-pulse" />
        </div>

        {aqi && (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">AQI</span>
              <div className={cn("w-3 h-3 rounded-full", getAQIColor(aqi))}></div>
            </div>
            <span className="text-xs text-muted-foreground">{aqi}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
