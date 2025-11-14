import { WeatherBackground } from "@/components/WeatherBackground";
import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { LocationCard } from "@/components/LocationCard";
import { AnimatedWeatherIcon } from "@/components/AnimatedWeatherIcon";
import { HourlyTemperatureGraph } from "@/components/HourlyTemperatureGraph";
import { WindDirectionRadar } from "@/components/WindDirectionRadar";
import { HumidityTrendGraph } from "@/components/HumidityTrendGraph";
import { SunriseSunsetCard } from "@/components/SunriseSunsetCard";
import { AirQualityBreakdown } from "@/components/AirQualityBreakdown";
import { HealthRecommendation } from "@/components/HealthRecommendation";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Droplets, Wind, MapPin, Eye, Thermometer, Gauge, Cloud, ChevronUp } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useSettings } from "@/hooks/useSettings";
import { getWeatherCondition } from "@/services/weatherApi";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { settings } = useSettings();
  const { weather, forecast, airPollution, loading, error } = useWeather();
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  const condition = weather ? getWeatherCondition(weather.condition) : "cloudy";
  const tempUnit = settings.units === 'metric' ? '°C' : '°F';
  const speedUnit = settings.units === 'metric' ? 'km/h' : 'mph';

  // Update timestamp every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated("Just now");
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <WeatherBackground condition="cloudy">
        <Sidebar />
        <MobileMenu />

        <div className="lg:ml-48 p-4 lg:p-8 h-screen flex items-center justify-center">
          <div className="glass-dark rounded-3xl p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Unable to Load Weather</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <a
              href="/settings"
              className="inline-block px-6 py-3 bg-primary rounded-full hover:bg-primary/80 transition-all"
            >
              Go to Settings
            </a>
          </div>
        </div>
      </WeatherBackground>
    );
  }

  if (loading || !weather || !forecast) {
    return (
      <WeatherBackground condition="cloudy">
        <Sidebar />
        <MobileMenu />

        <div className="lg:ml-48 p-4 lg:p-8 h-screen">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto pb-8">
            <div className="lg:col-span-2 space-y-12">
              <LoadingSkeleton type="weather" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold px-2">Favorite Locations</h3>
              <LoadingSkeleton type="sidebar" />
            </div>
            </div>
          </ScrollArea>
        </div>
      </WeatherBackground>
    );
  }

  return (
    <WeatherBackground condition={condition}>
      <Sidebar />
      <MobileMenu />

      <div className="lg:ml-48 p-4 lg:p-8 h-screen">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto pb-8">
          {/* Main Weather Card */}
          <div className="lg:col-span-2 space-y-12">
            {/* Primary Weather Info */}
            <div className="glass-dark rounded-[2rem] lg:rounded-[2.5rem] p-6 relative overflow-hidden animate-fade-in hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

              <div className="relative z-10">
                <div className="inline-block px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-6">
                  Weather Forecast
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left: Main Weather */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <AnimatedWeatherIcon condition={weather.condition} size={48} />
                      <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 leading-tight">
                          {weather.condition}
                        </h1>
                        <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm lg:text-base">
                      {weather.description}. Humidity at {weather.humidity}%.
                    </p>
                  </div>

                  {/* Right: Temperature & Location */}
                  <div className="flex flex-col justify-between">
                    <div className="lg:text-right">
                      <div className="flex items-center lg:justify-end gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">{weather.city}, {weather.country}</span>
                      </div>
                      <div className="text-6xl lg:text-8xl font-light mb-4">
                        {weather.temperature}{tempUnit}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Feels like {weather.feelsLike}{tempUnit}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>10 km visibility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <span>{weather.pressure} hPa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-muted-foreground" />
                          <span>{weather.wind} {speedUnit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-muted-foreground" />
                          <span>{weather.humidity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hourly Temperature Graph */}
                <div className="mb-0">
                  <h3 className="text-lg font-semibold mb-4">24-Hour Temperature Trend</h3>
                  <HourlyTemperatureGraph hourlyData={forecast.hourly} />
                </div>
              </div>
            </div>

            {/* Weekly Forecast */}
            <div className="glass-dark rounded-[2rem] lg:rounded-[2.5rem] p-6 animate-fade-in hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10 transition-all duration-500">
              <h3 className="text-xl font-semibold mb-6">7-Day Forecast</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {forecast.daily.map((day, index) => (
                  <div
                    key={index}
                    className="text-center glass rounded-2xl p-4 hover:bg-white/10 hover:scale-105 transition-all duration-300 animate-slide-up group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mb-3">
                      <AnimatedWeatherIcon condition={day.condition} size={32} />
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground mb-2 truncate">{day.date}</p>
                    <p className="text-lg lg:text-xl font-light mb-1">{day.temp}°</p>
                    <p className="text-xs text-muted-foreground mb-2">{day.condition}</p>
                    {/* Mini temperature graph */}
                    <div className="flex justify-center items-end gap-1 h-6">
                      <div className="w-1 bg-blue-400 rounded-full" style={{ height: `${Math.max(20, (day.tempMin / day.tempMax) * 100)}%` }}></div>
                      <div className="w-1 bg-red-400 rounded-full" style={{ height: `${Math.max(20, (day.temp / day.tempMax) * 100)}%` }}></div>
                      <div className="w-1 bg-orange-400 rounded-full" style={{ height: `${Math.max(20, (day.tempMax / (day.tempMax + 10)) * 100)}%` }}></div>
                    </div>
                    <div className="flex justify-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <WindDirectionRadar
                windDirection={Math.floor(Math.random() * 360)}
                windSpeed={weather.wind}
                className="glass-dark rounded-2xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300"
              />

              <HumidityTrendGraph className="glass-dark rounded-2xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300" />

              <SunriseSunsetCard className="glass-dark rounded-2xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300" />

              <AirQualityBreakdown
                components={airPollution?.components}
                className="glass-dark rounded-2xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 xl:col-span-2"
              />

              <HealthRecommendation
                aqi={weather.aqi}
                temperature={weather.temperature}
                className="glass-dark rounded-2xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300"
              />
            </div>
          </div>

          {/* Favorite Locations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold px-2">Favorite Locations</h3>
            {settings.favoriteLocations.slice(0, 3).map((location, index) => (
              <LocationCard
                key={index}
                country="IN"
                city={location}
                condition={weather.condition}
                temperature={weather.temperature + Math.floor(Math.random() * 10) - 5}
                icon={condition === "storm" || condition === "default" ? "cloudy" : condition}
                aqi={weather.aqi}
                lastUpdated="5 min ago"
                isFavorite={true}
                onFavoriteToggle={() => {}}
              />
            ))}
          </div>
          </div>
        </ScrollArea>
      </div>
    </WeatherBackground>
  );
};

export default Dashboard;
