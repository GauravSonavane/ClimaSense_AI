import { WeatherBackground } from "@/components/WeatherBackground";
import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { AQIBadge } from "@/components/AQIBadge";
import { GlassCard } from "@/components/GlassCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wind, Factory, Car, Leaf, ShieldAlert } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import AQIMap from "@/components/AQIMap";

// Helper function to get pollutant status based on value and type
const getPollutantStatus = (name: string, value: number): string => {
  // WHO Air Quality Guidelines thresholds
  switch (name) {
    case "PM2.5":
      if (value <= 12) return "Good";
      if (value <= 35) return "Moderate";
      if (value <= 55) return "Unhealthy for Sensitive";
      if (value <= 150) return "Unhealthy";
      return "Very Unhealthy";
    case "PM10":
      if (value <= 20) return "Good";
      if (value <= 50) return "Moderate";
      if (value <= 100) return "Unhealthy for Sensitive";
      if (value <= 250) return "Unhealthy";
      return "Very Unhealthy";
    case "O3":
      if (value <= 100) return "Good";
      if (value <= 160) return "Moderate";
      if (value <= 200) return "Unhealthy for Sensitive";
      if (value <= 300) return "Unhealthy";
      return "Very Unhealthy";
    case "NO2":
      if (value <= 40) return "Good";
      if (value <= 80) return "Moderate";
      if (value <= 180) return "Unhealthy for Sensitive";
      if (value <= 280) return "Unhealthy";
      return "Very Unhealthy";
    case "SO2":
      if (value <= 20) return "Good";
      if (value <= 80) return "Moderate";
      if (value <= 250) return "Unhealthy for Sensitive";
      if (value <= 350) return "Unhealthy";
      return "Very Unhealthy";
    case "CO":
      // CO can be in µg/m³ (from API) or ppb (in demo data)
      // If value is > 100, assume it's in ppb, otherwise assume µg/m³
      let coValue;
      if (value > 100) {
        // Value is in ppb, convert to approximate µg/m³ (1 ppb CO ≈ 1.15 µg/m³)
        coValue = (value * 1.15) / 1000; // Convert to mg/m³
      } else {
        // Value is in µg/m³, convert to mg/m³
        coValue = value / 1000;
      }
      if (coValue <= 4.5) return "Good";
      if (coValue <= 9) return "Moderate";
      if (coValue <= 15) return "Unhealthy for Sensitive";
      if (coValue <= 30) return "Unhealthy";
      return "Very Unhealthy";
    default:
      return "Good";
  }
};

// Demo values as fallback - Based on Nashik, Maharashtra data
// AQI: 162 (Unhealthy)
const getDemoPollutants = () => [
  { name: "PM2.5", value: 72, unit: "µg/m³", status: "Unhealthy" },
  { name: "PM10", value: 97, unit: "µg/m³", status: "Unhealthy" },
  { name: "O3", value: 14, unit: "ppb", status: "Good" },
  { name: "NO2", value: 7, unit: "ppb", status: "Good" },
  { name: "SO2", value: 2, unit: "ppb", status: "Good" },
  { name: "CO", value: 272, unit: "ppb", status: "Moderate" },
];

const AQI = () => {
  const { weather, airPollution, loading, error } = useWeather();

  // Force demo mode - Set to true to always show demo data (Nashik, Maharashtra)
  const FORCE_DEMO_MODE = true; // Set to true to always show demo data (Nashik, Maharashtra)
  
  // Determine if we have real API data (only if not forcing demo mode)
  const hasApiData = FORCE_DEMO_MODE ? false : !!airPollution?.components;
  const hasApiAQI = FORCE_DEMO_MODE ? false : !!(weather?.aqi || airPollution?.aqi);

  // Use real data if available, otherwise use demo values
  const pollutants = hasApiData
    ? [
        { name: "PM2.5", value: airPollution.components.pm2_5, unit: "µg/m³", status: getPollutantStatus("PM2.5", airPollution.components.pm2_5) },
        { name: "PM10", value: airPollution.components.pm10, unit: "µg/m³", status: getPollutantStatus("PM10", airPollution.components.pm10) },
        { name: "O3", value: airPollution.components.o3, unit: "µg/m³", status: getPollutantStatus("O3", airPollution.components.o3) },
        { name: "NO2", value: airPollution.components.no2, unit: "µg/m³", status: getPollutantStatus("NO2", airPollution.components.no2) },
        { name: "SO2", value: airPollution.components.so2, unit: "µg/m³", status: getPollutantStatus("SO2", airPollution.components.so2) },
        { name: "CO", value: airPollution.components.co, unit: "µg/m³", status: getPollutantStatus("CO", airPollution.components.co) },
      ]
    : getDemoPollutants();

  // Use real AQI if available, otherwise use demo value (162 = Unhealthy - Nashik, Maharashtra)
  const currentAQI = hasApiAQI ? (weather?.aqi || airPollution?.aqi || 162) : 162;

  const sources = [
    { name: "Vehicular Emissions", percentage: 45, icon: Car },
    { name: "Industrial", percentage: 30, icon: Factory },
    { name: "Dust & Construction", percentage: 15, icon: Wind },
    { name: "Other Sources", percentage: 10, icon: Leaf },
  ];

  if (loading) {
    return (
      <WeatherBackground condition="cloudy">
        <Sidebar />
        <MobileMenu />
        <div className="lg:ml-48 min-h-screen p-4 lg:p-8 flex items-center justify-center">
          <div className="glass-dark rounded-3xl p-8"><div className="animate-pulse">Loading AQI data...</div></div>
        </div>
      </WeatherBackground>
    );
  }

  return (
    <WeatherBackground condition="cloudy">
      <Sidebar />
      <MobileMenu />
      <div className="min-h-screen lg:ml-48">
        <main className="p-4 lg:p-8 h-screen">
          <ScrollArea className="h-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground animate-fade-in">Air Quality Index</h1>
            {hasApiData ? (
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                <span className="text-green-400">●</span>
                <span className="text-sm text-foreground">Live Data</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                <span className="text-yellow-400">●</span>
                <span className="text-sm text-foreground">Demo Data</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <GlassCard className="lg:col-span-2 p-6 lg:p-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">
                    {weather?.city || (hasApiData ? "Your City" : "Nashik, Maharashtra")}
                  </h2>
                  <p className="text-muted-foreground text-sm lg:text-base">Current Air Quality</p>
                  {error && !hasApiData && (
                    <p className="text-xs text-yellow-500 mt-1">
                      ⚠️ {error} - Showing demo data
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <AQIBadge value={currentAQI} size="lg" />
                  {!hasApiAQI && (
                    <span className="text-xs text-muted-foreground/60">Demo AQI (Nashik, Maharashtra)</span>
                  )}
                </div>
              </div>
              <AQIMap className="mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                {pollutants.map((pollutant) => {
                  // Determine color based on status
                  const getStatusColor = (status: string) => {
                    if (status.includes("Good")) return "text-aqi-good";
                    if (status.includes("Moderate")) return "text-aqi-moderate";
                    if (status.includes("Sensitive")) return "text-aqi-unhealthySensitive";
                    if (status.includes("Unhealthy") && !status.includes("Very")) return "text-aqi-unhealthy";
                    if (status.includes("Very Unhealthy")) return "text-aqi-veryUnhealthy";
                    return "text-aqi-hazardous";
                  };

                  return (
                    <div key={pollutant.name} className="glass rounded-xl p-3 lg:p-4">
                      <h3 className="text-xs lg:text-sm font-semibold text-foreground mb-1">{pollutant.name}</h3>
                      <p className="text-xl lg:text-2xl font-bold text-foreground">{pollutant.value}</p>
                      <p className="text-xs text-muted-foreground">{pollutant.unit}</p>
                      <span className={`text-xs font-medium mt-1 inline-block ${getStatusColor(pollutant.status)}`}>
                        {pollutant.status}
                      </span>
                      {!hasApiData && (
                        <span className="text-xs text-muted-foreground/60 block mt-1" title="Using demo data - Configure API key for real-time data">
                          📊 Demo data
                        </span>
                      )}
                      {hasApiData && (
                        <span className="text-xs text-aqi-good/60 block mt-1" title="Real-time data from OpenWeatherMap API">
                          ✅ Live data
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
            <GlassCard className="p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="h-5 lg:h-6 w-5 lg:w-6 text-aqi-moderate" />
                <h3 className="text-lg lg:text-xl font-semibold text-foreground">Health Advice</h3>
              </div>
              <div className="space-y-4">
                {(() => {
                  // Dynamic health advice based on AQI
                  let generalAdvice = "";
                  let sensitiveAdvice = "";
                  
                  if (currentAQI <= 50) {
                    generalAdvice = "Air quality is excellent. Everyone can enjoy outdoor activities safely.";
                    sensitiveAdvice = "Air quality is good. Sensitive individuals may enjoy normal outdoor activities.";
                  } else if (currentAQI <= 100) {
                    generalAdvice = "Air quality is acceptable. Most people can enjoy outdoor activities.";
                    sensitiveAdvice = "Unusually sensitive people should consider reducing prolonged outdoor exertion.";
                  } else if (currentAQI <= 150) {
                    generalAdvice = "Sensitive individuals may experience health effects. The general public is less likely to be affected.";
                    sensitiveAdvice = "People with respiratory conditions, children, and older adults should limit outdoor activities.";
                  } else if (currentAQI <= 200) {
                    generalAdvice = "Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.";
                    sensitiveAdvice = "People with heart or lung disease, older adults, and children should avoid outdoor activities.";
                  } else if (currentAQI <= 300) {
                    generalAdvice = "Health alert: Everyone may experience more serious health effects.";
                    sensitiveAdvice = "Sensitive groups should avoid all outdoor activities. Others should limit outdoor exertion.";
                  } else {
                    generalAdvice = "Health warning of emergency conditions. The entire population is likely to be affected.";
                    sensitiveAdvice = "Everyone should avoid all outdoor activities. Stay indoors with air purifiers if possible.";
                  }
                  
                  return (
                    <>
                      <div className="glass rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2 text-sm lg:text-base">General Public</h4>
                        <p className="text-xs lg:text-sm text-muted-foreground">{generalAdvice}</p>
                      </div>
                      <div className="glass rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2 text-sm lg:text-base">Sensitive Groups</h4>
                        <p className="text-xs lg:text-sm text-muted-foreground">{sensitiveAdvice}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </GlassCard>
          </div>
          <GlassCard className="p-6 lg:p-8 animate-fade-in">
            <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-6">Pollution Sources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {sources.map((source, index) => {
                const Icon = source.icon;
                return (
                  <div key={index} className="glass rounded-xl p-4 lg:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                      </div>
                      <span className="text-2xl lg:text-3xl font-bold text-foreground">{source.percentage}%</span>
                    </div>
                    <p className="text-xs lg:text-sm font-medium text-foreground">{source.name}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
          </ScrollArea>
        </main>
      </div>
    </WeatherBackground>
  );
};

export default AQI;
