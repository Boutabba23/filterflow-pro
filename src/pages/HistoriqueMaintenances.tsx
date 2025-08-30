import { MainLayout } from "@/components/layout/MainLayout";
import { HistoriqueMaintenances } from "@/components/maintenance/HistoriqueMaintenances";
import { Wrench } from "lucide-react";

export default function HistoriqueMaintenancesPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Animated Header Section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-header p-8 shadow-vibrant drop-shadow-xl animate-fade-in mb-8">
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce-in">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in">
                Historique des Maintenances
              </h1>
              <p className="text-white/90 text-lg mb-6 animate-slide-in">
                Consultez et gérez l'historique des maintenances préventives de vos engins
              </p>
            </div>
          </div>
          <HistoriqueMaintenances />
        </div>
      </div>
    </MainLayout>
  );
}
