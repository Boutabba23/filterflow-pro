import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Filter,
  Link2,
  AlertTriangle,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/database";

export function DashboardOverview() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigation = (path: string, message: string) => {
    navigate(path);
    toast({
      title: "Navigation",
      description: message,
    });
  };

  const [stats, setStats] = useState({
    totalEngins: 0,
    totalFiltres: 0,
    lowStockFiltres: 0,
    enginsEnMaintenance: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch engins count
      const { count: enginsCount, error: enginsError } = await supabase
        .from("engins")
        .select("*", { count: "exact", head: true });

      if (enginsError) throw enginsError;

      // Fetch filtres count
      const { count: filtresCount, error: filtresError } = await supabase
        .from("filtres")
        .select("*", { count: "exact", head: true });

      if (filtresError) throw filtresError;

      // Fetch low stock filtres
      const { count: lowStockCount, error: lowStockError } = await supabase
        .from("filtres")
        .select("*", { count: "exact", head: true })
        .lt("stock", 10);

      if (lowStockError) throw lowStockError;

      // Fetch engins in maintenance
      const { count: maintenanceCount, error: maintenanceError } =
        await supabase
          .from("engins")
          .select("*", { count: "exact", head: true })
          .eq("statut", "Maintenance");

      if (maintenanceError) throw maintenanceError;

      setStats({
        totalEngins: enginsCount || 0,
        totalFiltres: filtresCount || 0,
        lowStockFiltres: lowStockCount || 0,
        enginsEnMaintenance: maintenanceCount || 0,
      });

      // Note: For recent activities, you would need to create an activity log table
      // and fetch data from it. For now, we'll keep it as an empty array.
      setRecentActivities([]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Tableau de Bord
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Vue d'ensemble de votre parc d'engins et filtres
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="w-full sm:w-64" />
          </div>
          <Button
            className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
            onClick={() =>
              handleNavigation(
                "/engins",
                "Redirection vers la gestion des engins"
              )
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Nouvel engin</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[
          { title: "Total Engins", value: stats.totalEngins, icon: Wrench },
          { title: "Total Filtres", value: stats.totalFiltres, icon: Filter },
          { title: "Filtres en Stock Faible", value: stats.lowStockFiltres, icon: AlertTriangle, variant: "warning" as const },
          { title: "Engins en Maintenance", value: stats.enginsEnMaintenance, icon: Wrench, variant: "accent" as const }
        ].map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "Alerte"
                          ? "bg-warning"
                          : activity.type === "Ajout"
                          ? "bg-success"
                          : activity.type === "Compatibilité"
                          ? "bg-accent"
                          : "bg-primary"
                      }`}
                    />
                    <div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          activity.type === "Alerte"
                            ? "bg-warning/10 text-warning"
                            : activity.type === "Ajout"
                            ? "bg-success/10 text-success"
                            : activity.type === "Compatibilité"
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {activity.type}
                      </span>
                      <p className="text-sm text-foreground mt-1">
                        {activity.item}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() =>
                handleNavigation(
                  "/engins",
                  "Redirection vers la gestion des engins"
                )
              }
            >
              <Wrench className="h-4 w-4 mr-2" />
              Ajouter un engin
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() =>
                handleNavigation(
                  "/filtres",
                  "Redirection vers la gestion des filtres"
                )
              }
            >
              <Filter className="h-4 w-4 mr-2" />
              Nouvelle référence filtre
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-warning/20 text-warning hover:bg-warning/10"
              size="sm"
              onClick={() =>
                toast({
                  title: "Alertes Stock",
                  description: "8 articles nécessitent votre attention",
                  variant: "destructive",
                })
              }
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Voir alertes stock
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
