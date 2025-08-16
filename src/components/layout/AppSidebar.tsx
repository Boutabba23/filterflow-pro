import { Settings, Wrench, Filter, Link2, BarChart3 } from "lucide-react";
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
    title: "Tableau de bord",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Engins",
    url: "/engins",
    icon: Wrench,
  },
  {
    title: "Filtres",
    url: "/filtres",
    icon: Filter,
  },
  {
    title: "Compatibilités",
    url: "/compatibilites",
    icon: Link2,
  },
  {
    title: "Configuration",
    url: "/config",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-secondary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-secondary-foreground/70 font-semibold">
            FilterFlow Pro
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-secondary-foreground hover:text-accent">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}