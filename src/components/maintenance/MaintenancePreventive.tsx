import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Wrench, Clock, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useEngins, useFiltres, useMaintenancePreventive, useCreateMaintenancePreventive } from "@/hooks/useSupabase";
import type { Engin, Filtre, MaintenancePreventive } from "@/lib/supabase";

// Define the gamme schedule data
const GAMMES_ENTRETIEN = [
  { id: 1, gamme: 'C', sequence_order: 1, heures_interval: 500 },
  { id: 2, gamme: 'D', sequence_order: 2, heures_interval: 1000 },
  { id: 3, gamme: 'C', sequence_order: 3, heures_interval: 1500 },
  { id: 4, gamme: 'E', sequence_order: 4, heures_interval: 2000 },
  { id: 5, gamme: 'C', sequence_order: 5, heures_interval: 2500 },
  { id: 6, gamme: 'D', sequence_order: 6, heures_interval: 3000 },
  { id: 7, gamme: 'C', sequence_order: 7, heures_interval: 3500 },
  { id: 8, gamme: 'F', sequence_order: 8, heures_interval: 4000 },
];

export function MaintenancePreventive() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form states
  const [selectedEngin, setSelectedEngin] = useState("");
  const [selectedGamme, setSelectedGamme] = useState("");
  const [selectedFiltres, setSelectedFiltres] = useState<number[]>([]);
  const [heuresService, setHeuresService] = useState("");
  
  // Use API hooks
  const { data: engins = [], isLoading: enginsLoading } = useEngins();
  const { data: filtres = [] } = useFiltres();
  const { data: maintenanceRecords = [], refetch: refetchMaintenance } = useMaintenancePreventive();
  const createMaintenanceMutation = useCreateMaintenancePreventive();

  const getNextGamme = (enginId: number) => {
    const enginMaintenances = maintenanceRecords.filter(
      (record) => record.engin_id === enginId
    );
    
    if (enginMaintenances.length === 0) {
      // Premier entretien, commencer par C (sequence_order = 1)
      return GAMMES_ENTRETIEN.find(g => g.sequence_order === 1) || null;
    }

    // Trouver la dernière maintenance
    const lastMaintenance = enginMaintenances
      .sort((a, b) => new Date(b.date_execution || '').getTime() - new Date(a.date_execution || '').getTime())[0];
    
    // Find the corresponding gamme entry
    const lastGamme = GAMMES_ENTRETIEN.find(g => g.id === lastMaintenance.gamme_id);
    if (!lastGamme) return GAMMES_ENTRETIEN[0];
    
    // Trouver la prochaine gamme dans le cycle
    const nextSequence = lastGamme.sequence_order >= 8 ? 1 : lastGamme.sequence_order + 1;
    return GAMMES_ENTRETIEN.find(g => g.sequence_order === nextSequence) || null;
  };

  const calculateRemainingHours = (engin: Engin): number => {
    const nextGamme = getNextGamme(engin.id);
    if (!nextGamme) return 0;

    const enginMaintenances = maintenanceRecords.filter(
      (record) => record.engin_id === engin.id
    );

    if (enginMaintenances.length === 0) {
      // Premier entretien à nextGamme.heures_interval
      return Math.max(0, nextGamme.heures_interval - (engin.heures || 0));
    }

    // Calculer les heures depuis la dernière maintenance
    const lastMaintenance = enginMaintenances
      .sort((a, b) => new Date(b.date_execution || '').getTime() - new Date(a.date_execution || '').getTime())[0];
    const lastGamme = GAMMES_ENTRETIEN.find(g => g.id === lastMaintenance.gamme_id);
    
    if (!lastGamme) return 0;
    
    const heuresDepuisDerniere = (engin.heures || 0) - lastMaintenance.heures_service;
    const intervalleProchaine = nextGamme.heures_interval - lastGamme.heures_interval;
    
    return Math.max(0, intervalleProchaine - heuresDepuisDerniere);
  };

  const handleAddMaintenance = async () => {
    if (!selectedEngin || !selectedGamme || !heuresService) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMaintenanceMutation.mutateAsync({
        engin_id: parseInt(selectedEngin),
        gamme_id: parseInt(selectedGamme),
        heures_service: parseInt(heuresService),
        filtres_remplaces: selectedFiltres,
      });

      toast({
        title: "Succès",
        description: "Maintenance enregistrée avec succès",
      });

      // Reset form and refresh data
      setSelectedEngin("");
      setSelectedGamme("");
      setSelectedFiltres([]);
      setHeuresService("");
      setDialogOpen(false);
      refetchMaintenance();
    } catch (error) {
      console.error('Error adding maintenance:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la maintenance",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (engin: Engin) => {
    const remainingHours = calculateRemainingHours(engin);
    if (remainingHours === 0) {
      return <Badge variant="destructive">Maintenance Due</Badge>;
    } else if (remainingHours <= 50) {
      return <Badge className="bg-warning text-warning-foreground">Proche</Badge>;
    }
    return <Badge variant="secondary">À jour</Badge>;
  };

  const filteredEngins = engins.filter(engin =>
    engin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engin.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engin.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (enginsLoading) {
    return (
      <CardContent className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6 space-y-6">
      {/* Search and Add Button */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
          <Input
            placeholder="Rechercher par code, marque, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-lg border-primary/20 focus:border-primary focus:ring-primary/20"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className={isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}>
            <DialogHeader>
              <DialogTitle>Enregistrer une Maintenance Exécutée</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code Engin</Label>
                  <Select value={selectedEngin} onValueChange={setSelectedEngin}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un engin" />
                    </SelectTrigger>
                    <SelectContent>
                      {engins.map((engin) => (
                        <SelectItem key={engin.id} value={engin.id.toString()}>
                          {engin.code} - {engin.marque} ({engin.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gamme à Exécuter</Label>
                  <Select value={selectedGamme} onValueChange={setSelectedGamme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une gamme" />
                    </SelectTrigger>
                    <SelectContent>
                      {GAMMES_ENTRETIEN.map((gamme) => (
                        <SelectItem key={gamme.id} value={gamme.id.toString()}>
                          Gamme {gamme.gamme} ({gamme.heures_interval}h)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Heures de Service</Label>
                <Input
                  type="number"
                  placeholder="Heures lors de l'exécution"
                  value={heuresService}
                  onChange={(e) => setHeuresService(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Filtres à Remplacer (optionnel)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner les filtres" />
                  </SelectTrigger>
                  <SelectContent>
                    {filtres.map((filtre) => (
                      <SelectItem key={filtre.id} value={filtre.id.toString()}>
                        {filtre.reference_principale} - {filtre.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleAddMaintenance}
                disabled={createMaintenanceMutation.isPending}
              >
                {createMaintenanceMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Maintenance Table */}
      <Card>
        <CardHeader className="bg-gradient-header text-white">
          <CardTitle className="flex items-center gap-3">
            <Wrench className="h-6 w-6" />
            Maintenance Préventive ({filteredEngins.length} engins)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prochaine Gamme</TableHead>
                  <TableHead>Heures Service</TableHead>
                  <TableHead>Heures Restantes</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEngins.map((engin) => {
                  const nextGamme = getNextGamme(engin.id);
                  const remainingHours = calculateRemainingHours(engin);
                  
                  return (
                    <TableRow key={engin.id}>
                      <TableCell className="font-medium">{engin.code}</TableCell>
                      <TableCell>{engin.marque}</TableCell>
                      <TableCell>{engin.type}</TableCell>
                      <TableCell>
                        {nextGamme ? (
                          <Badge variant="outline">
                            Gamme {nextGamme.gamme}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {engin.heures || 0}h
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {remainingHours <= 50 && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                          {remainingHours}h
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(engin)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </CardContent>
  );
}