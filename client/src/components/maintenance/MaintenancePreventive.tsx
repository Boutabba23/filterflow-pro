import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Engin {
  id: number;
  code: string;
  marque: string;
  type: string;
  heures: number;
}

interface Filtre {
  id: number;
  reference_principale: string;
  type: string;
  fabricant: string;
}

interface GammeEntretien {
  id: number;
  gamme: string;
  sequence_order: number;
  heures_interval: number;
}

interface MaintenanceRecord {
  id: number;
  engin: Engin;
  gamme: GammeEntretien;
  heures_service: number;
  date_execution: string;
  filtres_remplaces: number[];
}

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
  
  // Data states
  const [engins, setEngins] = useState<Engin[]>([]);
  const [filtres, setFiltres] = useState<Filtre[]>([]);
  const [gammes, setGammes] = useState<GammeEntretien[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all necessary data
      const [enginsRes, filtresRes, gammesRes, maintenanceRes] = await Promise.all([
        supabase.from('engins').select('*').order('code'),
        supabase.from('filtres').select('*').order('reference_principale'),
        supabase.from('gammes_entretien').select('*').order('sequence_order'),
        supabase
          .from('maintenance_preventive')
          .select(`
            *,
            engin:engins(*),
            gamme:gammes_entretien(*)
          `)
          .order('date_execution', { ascending: false })
      ]);

      if (enginsRes.error) throw enginsRes.error;
      if (filtresRes.error) throw filtresRes.error;
      if (gammesRes.error) throw gammesRes.error;
      if (maintenanceRes.error) throw maintenanceRes.error;

      setEngins(enginsRes.data || []);
      setFiltres(filtresRes.data || []);
      setGammes(gammesRes.data || []);
      setMaintenanceRecords(maintenanceRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getNextGamme = (enginId: number): GammeEntretien | null => {
    const enginMaintenances = maintenanceRecords.filter(
      (record) => record.engin.id === enginId
    );
    
    if (enginMaintenances.length === 0) {
      // Premier entretien, commencer par C (sequence_order = 1)
      return gammes.find(g => g.sequence_order === 1) || null;
    }

    // Trouver la dernière maintenance
    const lastMaintenance = enginMaintenances[0]; // Déjà trié par date desc
    const lastSequence = lastMaintenance.gamme.sequence_order;
    
    // Trouver la prochaine gamme dans le cycle
    const nextSequence = lastSequence >= 8 ? 1 : lastSequence + 1;
    return gammes.find(g => g.sequence_order === nextSequence) || null;
  };

  const calculateRemainingHours = (engin: Engin): number => {
    const nextGamme = getNextGamme(engin.id);
    if (!nextGamme) return 0;

    const enginMaintenances = maintenanceRecords.filter(
      (record) => record.engin.id === engin.id
    );

    if (enginMaintenances.length === 0) {
      // Premier entretien à nextGamme.heures_interval
      return Math.max(0, nextGamme.heures_interval - engin.heures);
    }

    // Calculer les heures depuis la dernière maintenance
    const lastMaintenance = enginMaintenances[0];
    const heuresDepuisDerniere = engin.heures - lastMaintenance.heures_service;
    const intervalleProchaine = nextGamme.heures_interval - lastMaintenance.gamme.heures_interval;
    
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
      const { error } = await supabase
        .from('maintenance_preventive')
        .insert({
          engin_id: parseInt(selectedEngin),
          gamme_id: parseInt(selectedGamme),
          heures_service: parseInt(heuresService),
          filtres_remplaces: selectedFiltres,
        });

      if (error) throw error;

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
      fetchData();
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

  if (loading) {
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
                      {gammes.map((gamme) => (
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
              <Button onClick={handleAddMaintenance}>
                Enregistrer
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
                          {engin.heures}h
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