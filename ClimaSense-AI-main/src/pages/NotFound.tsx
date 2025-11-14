import { WeatherBackground } from "@/components/WeatherBackground";
import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CloudOff, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <WeatherBackground condition="cloudy">
      <Sidebar />
      <MobileMenu />
      <div className="min-h-screen lg:ml-48">
        <main className="p-4 lg:p-8 h-screen">
          <ScrollArea className="h-full">
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center glass-dark rounded-3xl p-12 max-w-md animate-fade-in">
                <CloudOff className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
                <p className="mb-6 text-xl text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-full hover:bg-primary/80 transition-all duration-300 font-semibold"
                >
                  <Home className="h-5 w-5" />
                  Return to Home
                </a>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </WeatherBackground>
  );
};

export default NotFound;
