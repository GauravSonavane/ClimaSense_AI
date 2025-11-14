import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export const GlassCard = ({ children, className, hover = false, style }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass-dark rounded-3xl p-6 shadow-lg transition-all duration-300",
        hover && "hover:scale-105 hover:shadow-2xl",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};
