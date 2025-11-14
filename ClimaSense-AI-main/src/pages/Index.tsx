import { WeatherBackground } from "@/components/WeatherBackground";
import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { GlassCard } from "@/components/GlassCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Cloud, MapPin, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <WeatherBackground condition="sunny">
      <Sidebar />
      <MobileMenu />
      <div className="min-h-screen lg:ml-48">
        <main className="p-4 lg:p-8 h-screen">
          <ScrollArea className="h-full">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">Welcome to ClimaSense AI</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Your intelligent weather companion powered by AI. Get accurate forecasts, air quality insights, and personalized climate recommendations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <GlassCard className="p-6 hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Cloud className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Weather Dashboard</h3>
                </div>
                <p className="text-muted-foreground">Real-time weather data with beautiful visualizations and hourly forecasts.</p>
              </GlassCard>

              <GlassCard className="p-6 hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">AQI Monitoring</h3>
                </div>
                <p className="text-muted-foreground">Track air quality index with detailed pollutant breakdown and health recommendations.</p>
              </GlassCard>

              <GlassCard className="p-6 hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Insights</h3>
                </div>
                <p className="text-muted-foreground">Smart weather analysis and personalized recommendations powered by AI.</p>
              </GlassCard>
            </div>

            <GlassCard className="p-8 text-center animate-fade-in">
              <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Get Started</h2>
              <p className="text-muted-foreground mb-6">Navigate to the dashboard to explore your weather data or configure your settings for a personalized experience.</p>
              <a
                href="/dashboard"
                className="inline-block px-8 py-3 bg-primary rounded-full hover:bg-primary/80 transition-all duration-300 font-semibold"
              >
                Go to Dashboard
              </a>
            </GlassCard>
          </ScrollArea>
        </main>
      </div>
    </WeatherBackground>
  );
};

export default Index;
