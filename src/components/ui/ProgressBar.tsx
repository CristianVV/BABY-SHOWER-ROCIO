"use client";

import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  labelClassName?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = "md",
  className,
  labelClassName,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const getColorClass = () => {
    if (percentage >= 100) return "bg-state-success";
    if (percentage >= 50) return "bg-accent-yellow";
    return "bg-accent-green";
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full bg-foreground/10 rounded-full overflow-hidden",
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getColorClass()
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div
          className={cn(
            "mt-1.5 flex justify-between text-xs text-foreground-muted",
            labelClassName
          )}
        >
          <span>{Math.round(percentage)}% financiado</span>
          {percentage >= 100 && (
            <span className="text-state-success font-medium">Completado</span>
          )}
        </div>
      )}
    </div>
  );
}
