import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Filter,
  Wrench,
  Package,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight,
  Zap,
  Target,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardOverview() {
  // Mock data
  const stats = [
    {
      title: "Total Filtres",
      value: "1,247",
      icon: Filter,
      trend: { value: "+12%", isPositive: true },
      variant: "default" as const,
    },
    {
      title: "Engins Actifs", 
      value: "89",
      icon: Wrench,
      trend: { value: "+3%", isPositive: true },
      variant: "success" as const,
    },
    {
      title: "Stock Critique",
      value: "23", 
      icon: AlertTriangle,
      trend: { value: "-8%", isPositive: false },
      variant: "warning" as const,
    },
    {
      title: "Maintenances",
      value: "156",
      icon: Package,
      trend: { value: "+15%", isPositive: true },
      variant: "default" as const,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Filtre ajouté",
      item: "HF6177 - Filtre hydraulique",
      time: "Il y a 2h",
      status: "success",
    },
    {
      id: 2,
      type: "Maintenance",
      item: "A03010236 - Bull D8R",
      time: "Il y a 4h",
      status: "warning",
    },
    {
      id: 3,
      type: "Stock faible",
      item: "FF5421 - Filtre carburant",
      time: "Il y a 6h",
      status: "error",
    },
  ];

  const upcomingMaintenance = [
    {
      code: "A03010236",
      designation: "Bull D8R",
      type: "Préventive",
      date: "2024-12-30",
      priority: "Haute",
    },
    {
      code: "A01020672",
      designation: "Pelle R944CL",
      type: "Curative",
      date: "2024-12-28",
      priority: "Moyenne",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success/10 text-success border-success/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Haute":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Moyenne":
        return "bg-warning/10 text-warning border-warning/20";
      case "Basse":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-header p-8 shadow-glow animate-fade-in">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce-in">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in">
                  Tableau de Bord
                </h1>
                <p className="text-white/90 text-lg animate-slide-in">
                  Vue d'ensemble de votre système de gestion
                </p>
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
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in">
          {stats.map((stat, index) => (
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
                        <h3 className="font-semibold text-foreground">Gérer Filtres</h3>
                        <p className="text-sm text-muted-foreground">Catalogue complet</p>
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
                        <h3 className="font-semibold text-foreground">Parc Engins</h3>
                        <p className="text-sm text-muted-foreground">89 engins actifs</p>
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
                      <p className="text-sm text-muted-foreground">Analytics détaillés</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-success ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="shadow-glow bg-gradient-card border-0 animate-fade-in">
            <CardHeader className="bg-gradient-industrial text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-background to-muted/20 hover:shadow-card transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.type}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.item}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Maintenance */}
          <Card className="shadow-glow bg-gradient-card border-0 animate-fade-in">
            <CardHeader className="bg-gradient-rainbow text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                Maintenances Planifiées
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Engin</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priorité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingMaintenance.map((maintenance, index) => (
                      <TableRow 
                        key={maintenance.code}
                        className="animate-slide-in hover:bg-muted/30 transition-colors"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-primary hover:text-primary-hover">
                              {maintenance.code}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {maintenance.designation}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-accent/20 text-accent">
                            {maintenance.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {new Date(maintenance.date).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(maintenance.priority)}>
                            {maintenance.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}