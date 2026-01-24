import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}: StatsCardProps) {
  const variantStyles = {
    default: "bg-background-white",
    success: "bg-state-success/10 border-state-success/20",
    warning: "bg-state-pending/10 border-state-pending/20",
    info: "bg-accent-yellow/10 border-accent-yellow/20",
  };

  const iconStyles = {
    default: "bg-foreground/10 text-foreground",
    success: "bg-state-success/20 text-state-success",
    warning: "bg-state-pending/20 text-foreground",
    info: "bg-accent-yellow/20 text-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-foreground/10 p-6",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground-secondary">{title}</p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-foreground-muted">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl",
            iconStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
