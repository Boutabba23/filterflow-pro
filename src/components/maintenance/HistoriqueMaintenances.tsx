import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Wrench, Clock, Calendar, Edit, Trash2, Cog } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/database";
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

interface HistoriqueMaintenancesProps {
  onEdit?: (maintenance: any) => void;
}

export function HistoriqueMaintenances({
  onEdit,
}: HistoriqueMaintenancesProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form states
  const [selectedEngin, setSelectedEngin] = useState("");
  const [selectedGamme, setSelectedGamme] = useState("");
  const [selectedFiltres, setSelectedFiltres] = useState<number[]>([]);
  const [heuresService, setHeuresService] = useState("");
  const [dateGamme, setDateGamme] = useState("");

  // Edit mode state
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

  // Data states
  const [engins, setEngins] = useState<Engin[]>([]);
  const [filtres, setFiltres] = useState<Filtre[]>([]);
  const [gammes, setGammes] = useState<GammeEntretien[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all necessary data
      const [enginsRes, filtresRes, gammesRes, maintenanceRes] =
        await Promise.all([
          supabase.from("engins").select("*").order("code"),
          supabase.from("filtres").select("*").order("reference_principale"),
          supabase.from("gammes_entretien").select("*").order("sequence_order"),
          supabase
            .from("maintenance_preventive")
            .select(
              `
            *,
            engin:engins(*),
            gamme:gammes_entretien(*)
          `
            )
            .order("date_execution", { ascending: false }),
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
      console.error("Error fetching data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaintenance = async () => {
    if (!selectedEngin || !selectedGamme || !heuresService || !dateGamme) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRecordId) {
        // Update existing record
        const { error } = await supabase
          .from("maintenance_preventive")
          .update({
            engin_id: parseInt(selectedEngin),
            gamme_id: parseInt(selectedGamme),
            heures_service: parseInt(heuresService),
            date_execution: dateGamme,
            filtres_remplaces: selectedFiltres,
          })
          .eq("id", editingRecordId);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Maintenance mise à jour avec succès",
        });
      } else {
        // Create new record
        const { error } = await supabase.from("maintenance_preventive").insert({
          engin_id: parseInt(selectedEngin),
          gamme_id: parseInt(selectedGamme),
          heures_service: parseInt(heuresService),
          date_execution: dateGamme,
          filtres_remplaces: selectedFiltres,
        });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Maintenance enregistrée avec succès",
        });
      }

      // Reset form and refresh data
      setSelectedEngin("");
      setSelectedGamme("");
      setSelectedFiltres([]);
      setHeuresService("");
      setDateGamme("");
      setEditingRecordId(null);
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving maintenance:", error);
      toast({
        title: "Erreur",
        description: editingRecordId
          ? "Impossible de mettre à jour la maintenance"
          : "Impossible d'enregistrer la maintenance",
        variant: "destructive",
      });
    }
  };

  const getNextGamme = (enginId: number): GammeEntretien | null => {
    const enginMaintenances = maintenanceRecords.filter(
      (record) => record.engin.id === enginId
    );

    if (enginMaintenances.length === 0) {
      // Premier entretien, commencer par C (sequence_order = 1)
      return gammes.find((g) => g.sequence_order === 1) || null;
    }

    // Trouver la dernière maintenance
    const lastMaintenance = enginMaintenances[0]; // Déjà trié par date desc
    const lastSequence = lastMaintenance.gamme.sequence_order;

    // Définir la séquence personnalisée: C(1),D(2),C(3),E(4),C(5),D(6),C(7),F(8)
    const customSequence = [1, 2, 1, 4, 1, 2, 1, 8]; // Correspond à C,D,C,E,C,D,C,F

    // Trouver la position actuelle dans la séquence personnalisée
    const currentPosition = customSequence.indexOf(lastSequence);

    // Calculer la prochaine position dans la séquence
    const nextPosition = (currentPosition + 1) % customSequence.length;

    // Obtenir le sequence_order de la prochaine gamme
    const nextSequence = customSequence[nextPosition];

    return gammes.find((g) => g.sequence_order === nextSequence) || null;
  };

  const calculateRemainingHours = (engin: Engin): number => {
    const nextGamme = getNextGamme(engin.id);
    if (!nextGamme) return 0;

    const enginMaintenances = maintenanceRecords.filter(
      (record) => record.engin.id === engin.id
    );

    if (enginMaintenances.length === 0) {
      // Premier entretien à 250h
      return Math.max(0, 250 - engin.heures);
    }

    // Calculer les heures depuis la dernière maintenance
    const lastMaintenance = enginMaintenances[0];
    const heuresDepuisDerniere = engin.heures - lastMaintenance.heures_service;
    // Intervalle constant de 250h entre chaque gamme
    const intervalleProchaine = 250;

    return Math.max(0, intervalleProchaine - heuresDepuisDerniere);
  };

  const getStatusBadge = (engin: Engin) => {
    const remainingHours = calculateRemainingHours(engin);
    if (remainingHours === 0) {
      return <Badge variant="destructive">Maintenance Due</Badge>;
    } else if (remainingHours <= 50) {
      return (
        <Badge className="bg-warning text-warning-foreground">Proche</Badge>
      );
    }
    return <Badge variant="secondary">À jour</Badge>;
  };

  const getEnginIcon = (engin: Engin) => {
    if (!engin.type) return "🔧";
    if (engin.type.toLowerCase().includes("bulldozer")) return "🚜";
    if (engin.type.toLowerCase().includes("pelleteuse")) return "🚧";
    if (engin.type.toLowerCase().includes("chargeuse")) return "🏗️";
    return "🔧";
  };

  const filteredMaintenanceRecords = maintenanceRecords.filter(
    (record) =>
      record.engin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.engin.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.engin.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.gamme.gamme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <CardContent className="">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CardContent>
    );
  }

  return (
    <Card
      className="shadow-glow bg-gradient-card 
          border-0 overflow-hidden animate-fade-in"
    >
      <CardHeader className="bg-gradient-rainbow text-white">
        <CardTitle
          className="flex items-center gap-3 
          text-2xl"
        >
          <div
            className="w-10 h-10 bg-white/20 
            rounded-full flex items-center justify-center 
            animate-pulse"
          >
            <Cog className="h-6 w-6" />
          </div>
          Historique des Maintenances ({filteredMaintenanceRecords.length})
        </CardTitle>
      </CardHeader>

      <div>
        {filteredMaintenanceRecords.length === 0 ? (
          <Card className="border-dashed border-2 border-muted-foreground/25 mb-6">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <Wrench className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Aucun enregistrement de maintenance trouvé
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {searchTerm
                  ? "Aucun enregistrement ne correspond à votre recherche."
                  : "Commencez par ajouter un nouvel enregistrement de maintenance."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className="grid grid-cols-1
           md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
          >
            {filteredMaintenanceRecords.map((record) => (
              <Card
                key={record.id}
                className="group relative bg-white dark:bg-card 
                    rounded-2xl p-6 shadow-card hover:shadow-vibrant 
                    transition-all duration-500 hover:scale-105 
                    animate-scale-in border border-primary/5
                    hover:border-primary/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">
                        {getEnginIcon(record.engin)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {record.engin.code}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {record.engin.marque} {record.engin.type}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {record.gamme.gamme}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(record.date_execution).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{record.heures_service} heures</span>
                    </div>
                    {record.filtres_remplaces &&
                      record.filtres_remplaces.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Cog className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {record.filtres_remplaces.length} filtre(s)
                            remplacé(s)
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between items-center pt-2">
                      {getStatusBadge(record.engin)}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (onEdit) {
                              onEdit(record);
                            } else {
                              setSelectedEngin(record.engin.id.toString());
                              setSelectedGamme(record.gamme.id.toString());
                              setHeuresService(
                                record.heures_service.toString()
                              );
                              setDateGamme(record.date_execution);
                              setSelectedFiltres(
                                record.filtres_remplaces || []
                              );
                              setEditingRecordId(record.id);
                              setDialogOpen(true);
                            }
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            try {
                              await supabase
                                .from("maintenance_preventive")
                                .delete()
                                .eq("id", record.id);
                              fetchData();
                              toast({
                                title: "Succès",
                                description:
                                  "Maintenance supprimée avec succès",
                              });
                            } catch (error) {
                              console.error(
                                "Error deleting maintenance:",
                                error
                              );
                              toast({
                                title: "Erreur",
                                description:
                                  "Impossible de supprimer la maintenance",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
