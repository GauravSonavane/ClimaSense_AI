import { Home, Map, Calendar, Globe, Settings, LogOut, Sparkles, Plus, Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import climasenseLogo from "@/assets/climasense-logo.png";

const navigationItems = [
  { icon: Home, path: "/dashboard", label: "Dashboard - View current weather and forecasts" },
  { icon: Map, path: "/aqi", label: "AQI Map - Air quality monitoring worldwide" },
  { icon: Calendar, path: "/forecast", label: "Forecast - Detailed weather predictions" },
  { icon: Globe, path: "/alerts", label: "Alerts - Weather warnings and notifications" },
  { icon: Sparkles, path: "/ai-insights", label: "AI Insights - Smart weather analysis" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-48 glass-dark border-r border-white/10 flex-col py-6 z-50 backdrop-blur-xl">
      {/* Logo */}
      <div className="mb-8 w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center mx-auto">
        <img src={climasenseLogo} alt="ClimaSense AI" className="w-full h-full object-contain" />
      </div>

      {/* Grid Menu Icon */}
      <button className="mb-8 w-full h-12 rounded-xl glass hover:bg-white/15 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center justify-center group px-4">
        <div className="grid grid-cols-2 gap-1">
          <div className="w-1.5 h-1.5 rounded-sm bg-white/60 group-hover:bg-white transition-all duration-300"></div>
          <div className="w-1.5 h-1.5 rounded-sm bg-white/60 group-hover:bg-white transition-all duration-300"></div>
          <div className="w-1.5 h-1.5 rounded-sm bg-white/60 group-hover:bg-white transition-all duration-300"></div>
          <div className="w-1.5 h-1.5 rounded-sm bg-white/60 group-hover:bg-white transition-all duration-300"></div>
        </div>
        <span className="ml-3 text-sm font-medium text-white/60 group-hover:text-white transition-colors duration-300">Menu</span>
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full h-12 rounded-xl flex items-center px-4 transition-all duration-300 group relative",
                isActive
                  ? "bg-white/20 text-white shadow-lg shadow-white/20"
                  : "text-white/60 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/20"
              )}
              title={item.label}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <item.icon className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="ml-3 text-sm font-medium relative z-10 group-hover:scale-105 transition-transform duration-300">{item.label.split(' - ')[0]}</span>
            </button>
          );
        })}

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={() => navigate("#add")}
            className="w-full h-12 rounded-xl flex items-center px-4 text-white/60 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/20 transition-all duration-300 group relative mb-2"
            title="Add new location"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-3 text-sm font-medium relative z-10 group-hover:scale-105 transition-transform duration-300">Add</span>
          </button>
          <button
            onClick={() => navigate("#search")}
            className="w-full h-12 rounded-xl flex items-center px-4 text-white/60 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/20 transition-all duration-300 group relative mb-2"
            title="Search locations"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Search className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-3 text-sm font-medium relative z-10 group-hover:scale-105 transition-transform duration-300">Search</span>
          </button>
          <button
            onClick={() => navigate("#notifications")}
            className="w-full h-12 rounded-xl flex items-center px-4 text-white/60 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/20 transition-all duration-300 group relative mb-2 animate-pulse"
            title="View notifications"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Bell className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-3 text-sm font-medium relative z-10 group-hover:scale-105 transition-transform duration-300">Notifications</span>
          </button>
          <button
            onClick={() => navigate("#profile")}
            className="w-full h-12 rounded-xl flex items-center px-4 text-white/60 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/20 transition-all duration-300 group relative"
            title="User profile"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <User className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-3 text-sm font-medium relative z-10 group-hover:scale-105 transition-transform duration-300">Profile</span>
          </button>
        </div>
      </nav>

      {/* Settings & Logout */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/settings")}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group relative",
            location.pathname === "/settings"
              ? "bg-white/20 text-white shadow-lg shadow-white/20"
              : "text-white/60 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/20"
          )}
          title="Settings - Customize your experience"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Settings className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 rounded-xl text-white/60 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center justify-center group relative"
          title="Logout - Sign out of your account"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
