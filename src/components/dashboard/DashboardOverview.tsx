import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Wrench,
  Package,
  AlertTriangle,
  Calendar,
  Plus,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle,
  Users,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEngins, useFiltres } from "@/hooks/useSupabase";

export function DashboardOverview() {
  const { data: engins = [] } = useEngins();
  const { data: filtres = [] } = useFiltres();

  // Calculate real stats from API data
  const stats = [
    {
      title: "Total Filtres",
      value: filtres.length.toString(),
      icon: Filter,
      trend: { value: "+12%", isPositive: true },
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Engins Actifs", 
      value: engins.length.toString(),
      icon: Wrench,
      trend: { value: "+3%", isPositive: true },
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
    },
    {
      title: "Stock Total",
      value: filtres.reduce((sum, f) => sum + (f.stock || 0), 0).toString(), 
      icon: Package,
      trend: { value: "-2%", isPositive: false },
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
    },
    {
      title: "Alertes Actives",
      value: filtres.filter(f => (f.stock || 0) < 5).length.toString(),
      icon: AlertTriangle,
      trend: { value: "+5%", isPositive: false },
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Nouveau filtre ajouté",
      item: "AF25424 - Filtre à air",
      time: "Il y a 2h",
      status: "success",
      icon: Plus,
    },
    {
      id: 2,
      action: "Maintenance planifiée",
      item: "A03010236 - Bull D8R",
      time: "Il y a 4h",
      status: "warning",
      icon: Calendar,
    },
    {
      id: 3,
      action: "Stock critique",
      item: "HF6177 - Stock: 2 unités",
      time: "Il y a 6h",
      status: "error",
      icon: AlertTriangle,
    },
  ];

  const quickActions = [
    {
      title: "Ajouter un Filtre",
      description: "Nouveau référence au catalogue",
      icon: Filter,
      link: "/filtres",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Nouvel Engin",
      description: "Enregistrer un équipement",
      icon: Wrench,
      link: "/engins",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
    },
    {
      title: "Planifier Maintenance",
      description: "Programmer une intervention",
      icon: Calendar,
      link: "/filtres",
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
              <p className="text-white/90 text-lg">Vue d'ensemble de votre système de gestion</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/filtres">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Filtre
              </Button>
            </Link>
            <Link to="/engins">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                <Wrench className="h-4 w-4 mr-2" />
                Gérer Engins
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`}></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.trend.value}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <Activity className="h-6 w-6 text-blue-600" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.link}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Activity className="h-6 w-6 text-emerald-600" />
              Activités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <CheckCircle className="h-6 w-6 text-purple-600" />
              État du Système
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-800">Base de données</span>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">En ligne</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-blue-800">API Services</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Opérationnel</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-purple-800">Synchronisation</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}