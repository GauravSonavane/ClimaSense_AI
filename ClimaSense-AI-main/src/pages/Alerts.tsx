import { WeatherBackground } from "@/components/WeatherBackground";
import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { GlassCard } from "@/components/GlassCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CloudRain, Wind, Bell, Zap, Droplets } from "lucide-react";
import { format } from "date-fns";

interface Alert {
  id: string;
  type: 'thunderstorm' | 'heavy_rain' | 'wind' | 'aqi' | 'heat' | 'cold';
  severity: 'warning' | 'advisory' | 'watch' | 'emergency';
  title: string;
  description: string;
  location: string;
  date: Date;
  icon: React.ComponentType<{ className?: string }>;
}

// Generate demo alerts from the previous month
const getDemoAlerts = (): Alert[] => {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  // Alert 1: Thunderstorm - 3 weeks ago
  const thunderstormDate = new Date(oneMonthAgo);
  thunderstormDate.setDate(oneMonthAgo.getDate() + 7);
  
  // Alert 2: Heavy Rain - 2 weeks ago
  const heavyRainDate = new Date(oneMonthAgo);
  heavyRainDate.setDate(oneMonthAgo.getDate() + 14);
  
  return [
    {
      id: '1',
      type: 'thunderstorm',
      severity: 'warning',
      title: 'Severe Thunderstorm Warning',
      description: 'Severe thunderstorms with frequent lightning, heavy rainfall (50-75mm), and strong winds up to 60 km/h expected. Stay indoors and avoid open areas. Power outages possible.',
      location: 'Nashik, Maharashtra',
      date: thunderstormDate,
      icon: Zap,
    },
    {
      id: '2',
      type: 'heavy_rain',
      severity: 'advisory',
      title: 'Heavy Rainfall Advisory',
      description: 'Heavy rainfall warning with expected precipitation of 40-60mm over 6 hours. Risk of localized flooding in low-lying areas. Avoid unnecessary travel and be cautious on roads.',
      location: 'Nashik, Maharashtra',
      date: heavyRainDate,
      icon: Droplets,
    },
  ];
};

const getSeverityColor = (severity: Alert['severity']) => {
  switch (severity) {
    case 'emergency':
      return 'text-red-500 bg-red-500/20 border-red-500/30';
    case 'warning':
      return 'text-orange-500 bg-orange-500/20 border-orange-500/30';
    case 'watch':
      return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
    case 'advisory':
      return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
    default:
      return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
  }
};

const getSeverityLabel = (severity: Alert['severity']) => {
  switch (severity) {
    case 'emergency':
      return 'Emergency';
    case 'warning':
      return 'Warning';
    case 'watch':
      return 'Watch';
    case 'advisory':
      return 'Advisory';
    default:
      return 'Alert';
  }
};

const Alerts = () => {
  const demoAlerts = getDemoAlerts();
  const hasAlerts = demoAlerts.length > 0;

  return (
    <WeatherBackground condition="storm">
      <Sidebar />
      <MobileMenu />
      <div className="min-h-screen lg:ml-48">
        <main className="p-4 lg:p-8 h-screen">
          <ScrollArea className="h-full">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 animate-fade-in">Climate & AQI Alerts</h1>
          
          {hasAlerts ? (
            <div className="space-y-4 animate-fade-in">
              {demoAlerts.map((alert) => {
                const Icon = alert.icon;
                const severityStyle = getSeverityColor(alert.severity);
                
                return (
                  <GlassCard key={alert.id} className="p-6 lg:p-8 border-l-4" style={{ borderLeftColor: severityStyle.includes('red') ? '#ef4444' : severityStyle.includes('orange') ? '#f97316' : severityStyle.includes('yellow') ? '#eab308' : '#3b82f6' }}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full ${severityStyle} flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold text-foreground">{alert.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityStyle}`}>
                                {getSeverityLabel(alert.severity)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.location}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(alert.date, 'MMM dd, yyyy')}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">{alert.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          ) : (
            <GlassCard className="p-6 lg:p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <Bell className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">No active alerts</h3>
              </div>
              <p className="text-muted-foreground">You'll be notified when climate conditions require attention.</p>
            </GlassCard>
          )}
          </ScrollArea>
        </main>
      </div>
    </WeatherBackground>
  );
};

export default Alerts;
