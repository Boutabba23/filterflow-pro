import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b bg-gradient-header backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
          <div className="relative z-10 flex w-full items-center gap-2 px-2 sm:px-4">
            <SidebarTrigger className="-ml-1 text-primary-foreground hover:bg-white/20" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/20" />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="hidden sm:block text-lg font-semibold text-white truncate">
                  Système de Gestion des Filtres
                </h1>
                <h1 className="sm:hidden text-base font-semibold text-white truncate">
                  Gestion Filtres
                </h1>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <ThemeToggle />
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/10 border-white/20 hover:bg-white/20 text-white">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/10 border-white/20 hover:bg-white/20 text-white">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-gradient-subtle min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}