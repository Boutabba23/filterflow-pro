import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Filter,
  Link2,
  AlertTriangle,
  Plus,
  Search,
  Link,
  Zap,
  ArrowRight,
  Target,
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
          {
            title: "Filtres en Stock Faible",
            value: stats.lowStockFiltres,
            icon: AlertTriangle,
            variant: "warning" as const,
          },
          {
            title: "Engins en Maintenance",
            value: stats.enginsEnMaintenance,
            icon: Wrench,
            variant: "accent" as const,
          },
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
                <>
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
                  <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in">
                    Tableau de Bord
                  </h1>
                  <p className="text-white/90 text-lg animate-slide-in">
                    Vue d'ensemble de votre système de gestion
                  </p>
                </>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 animate-scale-in">
              <Link to="/filtres">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Filtre
                </Button>
              </Link>
              <Link to="/engins">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Wrench className="h-4 w-4 mr-2" />
                  Voir Engins
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in">
        {[
          { title: "Total Engins", value: stats.totalEngins, icon: Wrench },
          { title: "Total Filtres", value: stats.totalFiltres, icon: Filter },
          {
            title: "Filtres en Stock Faible",
            value: stats.lowStockFiltres,
            icon: AlertTriangle,
            variant: "warning" as const,
          },
          {
            title: "Engins en Maintenance",
            value: stats.enginsEnMaintenance,
            icon: Wrench,
            variant: "accent" as const,
          },
        ].map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-vibrant bg-gradient-card border-0 overflow-hidden animate-fade-in">
        <CardHeader className="bg-gradient-maintenance text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/filtres">
              <Card className="group cursor-pointer hover:shadow-vibrant transition-all duration-300 hover:scale-105 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10 hover:border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Gérer Filtres
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Catalogue complet
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/engins">
              <Card className="group cursor-pointer hover:shadow-vibrant transition-all duration-300 hover:scale-105 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/10 hover:border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Wrench className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Parc Engins
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        89 engins actifs
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-accent ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="group cursor-pointer hover:shadow-vibrant transition-all duration-300 hover:scale-105 bg-gradient-to-br from-success/5 to-success/10 border-success/10 hover:border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center group-hover:bg-success/20 transition-colors">
                    <Target className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Rapports</h3>
                    <p className="text-sm text-muted-foreground">
                      Analytics détaillés
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-success ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
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
  );
}
