import { Settings, BarChart3, Wrench } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import filterImage from "@/images/filter.png";
import pelleImage from "@/images/excavator.png";
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
    icon: "image",
    image: pelleImage,
  },
  {
    title: "Filtres",
    url: "/filtres",
    icon: "image",
    image: filterImage,
  },
  {
    title: "Maintenance",
    url: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Configuration",
    url: "/config",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r bg-secondary/50 backdrop-blur-sm" collapsible="icon">
      <SidebarContent className="bg-secondary/90 p-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-secondary-foreground/70 font-semibold text-base sm:text-lg px-2 py-1">
            FilterFlow Pro
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 sm:h-12 px-2 sm:px-3 justify-start">
                    <Link
                      to={item.url}
                      className={`text-secondary-foreground hover:text-accent flex items-center gap-2 ${
                        location.pathname === item.url
                          ? "bg-accent/10 text-accent font-medium"
                          : ""
                      }`}
                    >
                      {item.icon === "image" ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                      ) : (
                        <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                      <span className="text-sm sm:text-base truncate">{item.title}</span>
                    </Link>
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