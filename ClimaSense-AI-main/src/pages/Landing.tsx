import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Cloud, Droplets, Wind, Sun } from "lucide-react";
import climasenseLogo from "@/assets/climasense-logo-new.png";
import sunnyBg from "@/assets/weather-sunny.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${sunnyBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <ScrollArea className="h-screen">
          <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen text-center">
          {/* Logo */}
          <div className="mb-12 animate-fade-in">
            <img 
              src={climasenseLogo} 
              alt="ClimaSense AI" 
              className="w-64 h-64 mx-auto object-contain drop-shadow-2xl animate-[scale-in_1s_ease-out] hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Title */}
          <h1 className="text-6xl lg:text-8xl font-bold text-white drop-shadow-2xl mb-6 animate-fade-in animation-delay-200">
            ClimaSense AI
          </h1>

          {/* Tagline */}
          <p className="text-xl lg:text-2xl text-white/90 mb-4 max-w-2xl animate-fade-in animation-delay-300 drop-shadow-lg">
            Intelligent Climate & Air Quality Insights
          </p>

          <p className="text-lg text-white/80 mb-12 animate-fade-in animation-delay-400 drop-shadow-lg">
            Powered by Advanced AI
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all animate-fade-in animation-delay-500 hover:scale-105"
          >
            Get Started
          </Button>

          {/* Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 max-w-4xl">
            <div className="flex flex-col items-center glass-dark p-6 rounded-2xl animate-fade-in animation-delay-600 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Cloud className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-white">Real-time Weather</p>
            </div>
            <div className="flex flex-col items-center glass-dark p-6 rounded-2xl animate-fade-in animation-delay-700 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Droplets className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-white">Air Quality</p>
            </div>
            <div className="flex flex-col items-center glass-dark p-6 rounded-2xl animate-fade-in animation-delay-800 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Wind className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-white">Wind Analysis</p>
            </div>
            <div className="flex flex-col items-center glass-dark p-6 rounded-2xl animate-fade-in animation-delay-900 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Sun className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-white">7-Day Forecast</p>
            </div>
          </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Landing;
