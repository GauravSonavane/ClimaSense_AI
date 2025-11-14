import { Plus, Search, Bell, User } from "lucide-react";

interface HeaderProps {
  userName?: string;
}

export const Header = ({ userName = "User" }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 glass-dark border-b border-white/10 flex items-center justify-between px-4 lg:px-8 z-50">
      {/* Welcome Section */}
      <div className="ml-0 lg:ml-0">
        <p className="text-sm text-muted-foreground hidden sm:block">Welcome</p>
        <h2 className="text-lg lg:text-xl font-semibold text-foreground">{userName}</h2>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 lg:gap-3">
        <button className="w-12 h-12 rounded-full glass hover:bg-white/15 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Plus className="h-5 w-5 text-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button className="w-12 h-12 rounded-full glass hover:bg-white/15 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Search className="h-5 w-5 text-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button className="w-12 h-12 rounded-full glass hover:bg-white/15 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center justify-center relative overflow-hidden group animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Bell className="h-5 w-5 text-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button className="w-12 h-12 rounded-full glass hover:bg-white/15 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <User className="h-5 w-5 text-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};
