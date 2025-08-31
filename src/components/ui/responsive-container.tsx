import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={cn(
      "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { default: 1, sm: 2, md: 3, lg: 4 }
}: ResponsiveGridProps) {
  const gridClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      gridClasses,
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal-mobile" | "horizontal-always";
  spacing?: "sm" | "md" | "lg";
}

export function ResponsiveStack({ 
  children, 
  className,
  direction = "vertical",
  spacing = "md"
}: ResponsiveStackProps) {
  const spacingClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8"
  };

  const directionClasses = {
    vertical: "flex flex-col",
    "horizontal-mobile": "flex flex-col sm:flex-row sm:items-center",
    "horizontal-always": "flex flex-row items-center"
  };

  return (
    <div className={cn(
      directionClasses[direction],
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
}