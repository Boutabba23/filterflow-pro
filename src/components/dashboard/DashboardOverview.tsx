import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Filter, Link2, AlertTriangle, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardOverview() {
  // Mock data - will be replaced with real data from Supabase
  const stats = [
    {
      title: "Total Engins",
      value: "47",
      icon: Wrench,
      trend: { value: "+3 ce mois", isPositive: true },
      variant: "default" as const,
    },
    {
      title: "Références Filtres",
      value: "342",
      icon: Filter,
      trend: { value: "+12 nouvelles", isPositive: true },
      variant: "success" as const,
    },
    {
      title: "Compatibilités",
      value: "1,247",
      icon: Link2,
      trend: { value: "+89 mappées", isPositive: true },
      variant: "accent" as const,
    },
    {
      title: "Alertes Stock",
      value: "8",
      icon: AlertTriangle,
      trend: { value: "À traiter", isPositive: false },
      variant: "warning" as const,
    },
  ];

  const recentActivities = [
    { type: "Ajout", item: "Pelle CAT 320D", time: "Il y a 2h" },
    { type: "Modification", item: "Filtre hydraulique HF6177", time: "Il y a 4h" },
    { type: "Compatibilité", item: "Bulldozer D6T ↔ Filtre air AF25424", time: "Il y a 6h" },
    { type: "Alerte", item: "Stock filtre HF6177 bas", time: "Il y a 1j" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tableau de Bord</h2>
          <p className="text-muted-foreground">Vue d'ensemble de votre parc d'engins et filtres</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="w-64" />
          </div>
          <Button className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel engin
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'Alerte' ? 'bg-warning' : 
                      activity.type === 'Ajout' ? 'bg-success' : 
                      activity.type === 'Compatibilité' ? 'bg-accent' : 'bg-primary'
                    }`} />
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        activity.type === 'Alerte' ? 'bg-warning/10 text-warning' :
                        activity.type === 'Ajout' ? 'bg-success/10 text-success' :
                        activity.type === 'Compatibilité' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                      }`}>
                        {activity.type}
                      </span>
                      <p className="text-sm text-foreground mt-1">{activity.item}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
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
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Wrench className="h-4 w-4 mr-2" />
              Ajouter un engin
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Nouvelle référence filtre
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Link2 className="h-4 w-4 mr-2" />
              Mapper compatibilité
            </Button>
            <Button variant="outline" className="w-full justify-start border-warning/20 text-warning hover:bg-warning/10" size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Voir alertes stock
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}