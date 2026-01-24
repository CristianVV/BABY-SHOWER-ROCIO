"use client";

import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  value: "EUR" | "COP";
  onChange: (currency: "EUR" | "COP") => void;
  className?: string;
}

export default function CurrencySelector({
  value,
  onChange,
  className,
}: CurrencySelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center bg-background-light rounded-xl p-1",
        className
      )}
    >
      <button
        onClick={() => onChange("EUR")}
        className={cn(
          "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          value === "EUR"
            ? "bg-background-white text-foreground shadow-sm"
            : "text-foreground-muted hover:text-foreground"
        )}
        aria-pressed={value === "EUR"}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-base">EUR</span>
          <span className="text-foreground-muted text-xs">€</span>
        </span>
      </button>
      <button
        onClick={() => onChange("COP")}
        className={cn(
          "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          value === "COP"
            ? "bg-background-white text-foreground shadow-sm"
            : "text-foreground-muted hover:text-foreground"
        )}
        aria-pressed={value === "COP"}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-base">COP</span>
          <span className="text-foreground-muted text-xs">$</span>
        </span>
      </button>
    </div>
  );
}
