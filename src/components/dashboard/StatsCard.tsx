import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "accent";
}

export function StatsCard({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) {
  // Vérifier si Icon est une fonction valide avant de l'utiliser comme composant
  const isValidIcon = typeof Icon === 'function';

  // Composant d'icône sécurisé
  const SafeIcon = isValidIcon ? Icon : () => null;
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-success/5";
      case "warning":
        return "border-warning/20 bg-warning/5";
      case "accent":
        return "border-accent/20 bg-accent/5";
      default:
        return "border-primary/20 bg-primary/5";
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "accent":
        return "text-accent";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className={`shadow-card ${getVariantClasses()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <SafeIcon className={`h-4 w-4 ${getIconClasses()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className={`text-xs ${
            trend.isPositive ? "text-success" : "text-destructive"
          }`}>
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}