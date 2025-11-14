import { useEffect, useState } from "react";
import stormBg from "@/assets/weather-storm.jpg";
import sunnyBg from "@/assets/weather-sunny.jpg";
import rainyBg from "@/assets/weather-rainy.jpg";
import cloudyBg from "@/assets/weather-cloudy.jpg";
import { WeatherParticles } from "./WeatherParticles";

interface WeatherBackgroundProps {
  condition?: "storm" | "sunny" | "rainy" | "cloudy" | "default";
  children: React.ReactNode;
}

const backgrounds = {
  storm: stormBg,
  sunny: sunnyBg,
  rainy: rainyBg,
  cloudy: cloudyBg,
  default: cloudyBg,
};

export const WeatherBackground = ({ condition = "default", children }: WeatherBackgroundProps) => {
  const [loaded, setLoaded] = useState(false);
  const bgImage = backgrounds[condition];

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = bgImage;
    img.onload = () => setLoaded(true);
  }, [bgImage]);

  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      {/* Background Image with Cover */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Parallax Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-32 right-20 w-40 h-24 bg-white/8 rounded-full blur-2xl animate-float-slower"></div>
        <div className="absolute bottom-40 left-1/4 w-28 h-16 bg-white/6 rounded-full blur-lg animate-float"></div>
      </div>

      {/* Sunlight Glow for Sunny Weather */}
      {condition === 'sunny' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      )}

      {/* Semi-transparent Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

      {/* Weather Particles */}
      {condition === 'rainy' && <WeatherParticles type="rain" intensity={60} />}
      {condition === 'storm' && <WeatherParticles type="rain" intensity={100} />}
      {condition === 'cloudy' && <WeatherParticles type="clouds" intensity={8} />}

      {/* Content Container - positioned above background */}
      <div className="relative z-0 w-full">
        {children}
      </div>
    </div>
  );
};
