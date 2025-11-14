import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wind,
  Calendar,
  Bell,
  Sparkles,
  Plus,
  Search,
  User
} from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  icon: "layout-dashboard" | "wind" | "calendar" | "bell" | "sparkles" | "plus" | "search" | "user";
  label: string;
  onClick?: () => void;
}

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "wind": Wind,
  "calendar": Calendar,
  "bell": Bell,
  "sparkles": Sparkles,
  "plus": Plus,
  "search": Search,
  "user": User,
};

export const SidebarNavItem = ({ to, icon, label, onClick }: SidebarNavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const Icon = iconMap[icon];

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
        isActive
          ? "bg-white/20 text-white shadow-lg shadow-white/20"
          : "text-white/60 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/20"
      }`}
      title={label}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
      )}
    </Link>
  );
};
