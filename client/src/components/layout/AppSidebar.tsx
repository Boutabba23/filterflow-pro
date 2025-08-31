import { Settings, BarChart3, Wrench, Filter, Home, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    description: "Vue d'ensemble",
  },
  {
    title: "Engins",
    url: "/engins",
    icon: Wrench,
    description: "Machines et équipements",
  },
  {
    title: "Filtres",
    url: "/filtres",
    icon: Filter,
    description: "Catalogue des filtres",
  },
  {
    title: "Configuration",
    url: "/config",
    icon: Settings,
    description: "Paramètres système",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200 bg-white shadow-lg" collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-white to-gray-50/80 p-0">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FilterPro
              </h2>
              <p className="text-xs text-gray-500 -mt-1">Gestion Industrielle</p>
            </div>
          </div>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-3 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-12 px-3 rounded-xl group">
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium shadow-sm border-l-4 border-blue-500"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-gradient-to-br from-blue-100 to-purple-100" 
                            : "group-hover:bg-gray-100"
                        }`}>
                          <item.icon className={`h-5 w-5 ${
                            isActive ? "text-blue-600" : "text-gray-500"
                          }`} />
                        </div>
                        <div className="group-data-[collapsible=icon]:hidden">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-gray-400">{item.description}</div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status Section */}
        <div className="mt-auto p-4 border-t border-gray-100 group-data-[collapsible=icon]:hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Système en ligne</span>
            </div>
            <p className="text-xs text-green-600">Toutes les fonctions opérationnelles</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}