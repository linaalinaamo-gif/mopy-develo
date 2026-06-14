import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "blurple" | "success" | "warning" | "danger" | "fuchsia";
  trend?: { value: string; up: boolean };
}

const variantStyles = {
  blurple: {
    icon: "bg-discord-blurple/15 text-discord-blurple",
    glow: "border-discord-blurple/20",
    dot: "bg-discord-blurple",
  },
  success: {
    icon: "bg-discord-success/15 text-discord-success",
    glow: "border-discord-success/20",
    dot: "bg-discord-success",
  },
  warning: {
    icon: "bg-discord-warning/15 text-discord-warning",
    glow: "border-discord-warning/20",
    dot: "bg-discord-warning",
  },
  danger: {
    icon: "bg-discord-danger/15 text-discord-danger",
    glow: "border-discord-danger/20",
    dot: "bg-discord-danger",
  },
  fuchsia: {
    icon: "bg-discord-fuchsia/15 text-discord-fuchsia",
    glow: "border-discord-fuchsia/20",
    dot: "bg-discord-fuchsia",
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = "blurple", trend }: StatCardProps) {
  const styles = variantStyles[variant];
  return (
    <div className={`relative rounded-xl bg-card border ${styles.glow} p-5 shadow-card flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-glow-blurple`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-lg ${styles.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </div>
      {trend && (
        <div className={`text-xs font-medium flex items-center gap-1 ${trend.up ? "text-discord-success" : "text-discord-danger"}`}>
          <span>{trend.up ? "↑" : "↓"}</span>
          <span>{trend.value}</span>
        </div>
      )}
      <div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${styles.dot} opacity-60`} />
    </div>
  );
}
