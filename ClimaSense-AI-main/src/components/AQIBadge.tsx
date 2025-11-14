import { cn } from "@/lib/utils";

interface AQIBadgeProps {
  value: number;
  size?: "sm" | "md" | "lg";
}

const getAQILevel = (value: number) => {
  if (value <= 50) return { level: "Good", color: "bg-aqi-good", textColor: "text-aqi-good" };
  if (value <= 100) return { level: "Moderate", color: "bg-aqi-moderate", textColor: "text-aqi-moderate" };
  if (value <= 150) return { level: "Unhealthy for Sensitive", color: "bg-aqi-unhealthySensitive", textColor: "text-aqi-unhealthySensitive" };
  if (value <= 200) return { level: "Unhealthy", color: "bg-aqi-unhealthy", textColor: "text-aqi-unhealthy" };
  if (value <= 300) return { level: "Very Unhealthy", color: "bg-aqi-veryUnhealthy", textColor: "text-aqi-veryUnhealthy" };
  return { level: "Hazardous", color: "bg-aqi-hazardous", textColor: "text-aqi-hazardous" };
};

export const AQIBadge = ({ value, size = "md" }: AQIBadgeProps) => {
  const { level, color, textColor } = getAQILevel(value);
  
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("rounded-full font-semibold text-white", color, sizeClasses[size])}>
        AQI {value}
      </div>
      <span className={cn("text-xs font-medium", textColor)}>{level}</span>
    </div>
  );
};
