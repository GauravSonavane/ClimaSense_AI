import { Shield, Sun, Wind, Users } from "lucide-react";

interface HealthRecommendationProps {
  aqi?: number;
  uvIndex?: number;
  temperature?: number;
  windSpeed?: number;
  className?: string;
}

export const HealthRecommendation = ({
  aqi = 45,
  uvIndex = 6,
  temperature = 25,
  windSpeed = 10,
  className = ""
}: HealthRecommendationProps) => {
  const getRecommendations = () => {
    const recommendations = [];

    // AQI-based recommendations
    if (aqi > 100) {
      recommendations.push({
        icon: Shield,
        text: "Wear a mask outdoors",
        type: "warning",
        color: "text-red-400"
      });
    }

    // UV Index recommendations
    if (uvIndex > 7) {
      recommendations.push({
        icon: Sun,
        text: "High UV - Use sunscreen",
        type: "warning",
        color: "text-orange-400"
      });
    }

    // Temperature recommendations
    if (temperature > 30) {
      recommendations.push({
        icon: Sun,
        text: "Stay hydrated, avoid heat",
        type: "caution",
        color: "text-yellow-400"
      });
    } else if (temperature < 5) {
      recommendations.push({
        icon: Wind,
        text: "Dress warmly",
        type: "caution",
        color: "text-blue-400"
      });
    }

    // Wind recommendations
    if (windSpeed > 20) {
      recommendations.push({
        icon: Wind,
        text: "Strong winds - Take care",
        type: "info",
        color: "text-gray-400"
      });
    }

    // General outdoor activity
    if (aqi <= 50 && uvIndex <= 5 && temperature >= 15 && temperature <= 25) {
      recommendations.push({
        icon: Sun,
        text: "Perfect for outdoor activities",
        type: "good",
        color: "text-green-400"
      });
    }

    // Sensitive groups
    if (aqi > 50 || uvIndex > 6) {
      recommendations.push({
        icon: Users,
        text: "Sensitive groups: Take precautions",
        type: "warning",
        color: "text-purple-400"
      });
    }

    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const recommendations = getRecommendations();

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium">Health Recommendations</span>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Icon className={`w-4 h-4 ${rec.color} animate-pulse`} />
              <span className="text-sm text-foreground">{rec.text}</span>
            </div>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-4">
          <Sun className="w-8 h-8 text-green-400 mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-muted-foreground">Conditions are generally good today</p>
        </div>
      )}
    </div>
  );
};
