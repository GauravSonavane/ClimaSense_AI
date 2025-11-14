import { WeatherBackground } from "@/components/WeatherBackground";
import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { GlassCard } from "@/components/GlassCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wind, Droplets } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useSettings } from "@/hooks/useSettings";
import { getWeatherCondition } from "@/services/weatherApi";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Forecast = () => {
  const { settings } = useSettings();
  const { weather, forecast, loading } = useWeather();

  const tempUnit = settings.units === 'metric' ? '°C' : '°F';

  if (loading || !forecast) {
    return (
      <WeatherBackground condition="cloudy">
        <Sidebar />
        <MobileMenu />
        <div className="lg:ml-48 min-h-screen p-4 lg:p-8 flex items-center justify-center">
          <div className="glass-dark rounded-3xl p-8">
            <div className="animate-pulse">Loading forecast data...</div>
          </div>
        </div>
      </WeatherBackground>
    );
  }

  const condition = weather ? getWeatherCondition(weather.condition) : "cloudy";

  const hourlyChartData = forecast.hourly.map(h => ({
    name: h.time,
    temp: h.temp,
  }));

  const dailyChartData = forecast.daily.map(d => ({
    name: d.date.slice(0, 3),
    temp: d.temp,
    min: d.tempMin,
    max: d.tempMax,
  }));

  return (
    <WeatherBackground condition={condition}>
      <Sidebar />
      <MobileMenu />
      <div className="min-h-screen lg:ml-48">
        <main className="p-4 lg:p-8 h-screen">
          <ScrollArea className="h-full">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 animate-fade-in">7-Day Forecast</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4 mb-8 animate-fade-in">
            {forecast.daily.map((day, index) => (
              <GlassCard key={index} className="p-3 lg:p-4 hover:scale-105 transition-transform cursor-pointer">
                <h3 className="text-sm lg:text-lg font-semibold text-foreground mb-1 truncate">{day.date}</h3>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.condition}
                  className="h-10 lg:h-12 w-10 lg:w-12 mx-auto mb-2"
                />
                <p className="text-xs text-muted-foreground text-center mb-2 truncate">{day.condition}</p>
                <div className="flex justify-between text-xs lg:text-sm gap-2">
                  <span className="text-foreground font-semibold">{day.tempMax}°</span>
                  <span className="text-muted-foreground">{day.tempMin}°</span>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <GlassCard className="p-4 lg:p-6 animate-fade-in">
              <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">Temperature Trend (24h)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hourlyChartData}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                    formatter={(value: number) => [`${value}${tempUnit}`, 'Temperature']}
                  />
                  <Area type="monotone" dataKey="temp" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className="p-4 lg:p-6 animate-fade-in">
              <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">7-Day Temperature Range</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                    formatter={(value: number) => [`${value}${tempUnit}`]}
                  />
                  <Line type="monotone" dataKey="max" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4 }} name="High" />
                  <Line type="monotone" dataKey="min" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} name="Low" />
                  <Line type="monotone" dataKey="temp" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} name="Avg" />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          <GlassCard className="p-4 lg:p-6 animate-fade-in">
            <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">Detailed Forecast</h3>
            <div className="space-y-3 lg:space-y-4">
              {forecast.daily.map((day, index) => (
                <div key={index} className="glass rounded-xl p-3 lg:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3 lg:gap-4 flex-1">
                    <img 
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.condition}
                      className="h-10 lg:h-12 w-10 lg:w-12"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm lg:text-base font-semibold text-foreground">{day.date}</h4>
                      <p className="text-xs lg:text-sm text-muted-foreground">{day.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 lg:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-primary" />
                      <span className="text-xs lg:text-sm text-muted-foreground">{day.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-accent" />
                      <span className="text-xs lg:text-sm text-muted-foreground">{day.wind} {settings.units === 'metric' ? 'km/h' : 'mph'}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-base lg:text-lg font-semibold text-foreground">{day.tempMax}°</span>
                      <span className="text-sm lg:text-base text-muted-foreground">{day.tempMin}°</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          </ScrollArea>
        </main>
      </div>
    </WeatherBackground>
  );
};

export default Forecast;
