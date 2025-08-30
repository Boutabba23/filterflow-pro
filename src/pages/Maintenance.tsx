import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { HistoriqueMaintenances } from "@/components/maintenance/HistoriqueMaintenances";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  Cog,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";
import {
  fetchMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "@/lib/database-maintenance";
import { testMaintenanceConnection } from "@/lib/test-maintenance";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Maintenance() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [currentMaintenance, setCurrentMaintenance] = useState(null);
  const [editFormData, setEditFormData] = useState({
    engin_code: "",
    type_maintenance: "",
    date_maintenance: "",
    heures_gamme: "",
    filtres: [],
  });

  const [formData, setFormData] = useState({
    engin_code: "",
    type_maintenance: "",
    date_maintenance: "",
    heures_gamme: "",
    filtres: [],
  });

  const [engins, setEngins] = useState([]);
  const [gammes, setGammes] = useState([]);
  const [filtres, setFiltres] = useState([]);

  const resetForm = () => {
    setFormData({
      engin_code: "",
      type_maintenance: "",
      date_maintenance: "",
      heures_gamme: "",
      filtres: [],
    });
    setErrors({});
  };

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<number | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaintenances();
    loadEngins();
    loadGammes();
    loadFiltres();
  }, []);

  const loadEngins = async () => {
    try {
      const { data, error } = await supabase
        .from("engins")
        .select("*")
        .order("code");

      if (error) throw error;
      setEngins(data || []);
    } catch (error) {
      console.error("Error fetching engins:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les engins",
        variant: "destructive",
      });
    }
  };

  const loadGammes = async () => {
    try {
      const { data, error } = await supabase
        .from("gammes_entretien")
        .select("*")
        .order("sequence_order");

      if (error) throw error;
      setGammes(data || []);
    } catch (error) {
      console.error("Error fetching gammes:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les gammes",
        variant: "destructive",
      });
    }
  };

  const loadFiltres = async () => {
    try {
      const { data, error } = await supabase
        .from("filtres")
        .select("*")
        .order("reference_principale");

      if (error) throw error;
      setFiltres(data || []);
    } catch (error) {
      console.error("Error fetching filtres:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les filtres",
        variant: "destructive",
      });
    }
  };

  const loadMaintenances = async () => {
    setLoading(true);
    try {
      console.log("Fetching maintenances...");
      // Test the connection first
      const connectionTest = await testMaintenanceConnection();
      console.log("Connection test result:", connectionTest);

      if (!connectionTest.success) {
        throw new Error(
          connectionTest.error || "Failed to connect to database"
        );
      }

      const data = await fetchMaintenances();
      console.log("Maintenances data received:", data);
      setMaintenances(data || []);
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      toast({
        title: "Erreur",
        description: `Impossible de charger les maintenances: ${error.message}`,
        variant: "destructive",
      });
      setMaintenances([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaintenances = maintenances.filter((maintenance) => {
    // Trouver l'engin et la gamme correspondants
    const engin = engins.find((e) => e.id === maintenance.engin_id);
    const gamme = gammes.find((g) => g.id === maintenance.gamme_id);

    return (
      (engin &&
        engin.code &&
        engin.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (gamme &&
        gamme.gamme &&
        gamme.gamme.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleEditClick = (maintenance) => {
    setCurrentMaintenance(maintenance);

    // Trouver l'engin et la gamme correspondants
    const engin = engins.find((e) => e.id === maintenance.engin_id);
    const gamme = gammes.find((g) => g.id === maintenance.gamme_id);

    setEditFormData({
      engin_code: engin ? engin.code : "",
      type_maintenance: gamme ? gamme.gamme : "",
      date_maintenance: maintenance.date_execution || "",
      heures_gamme: maintenance.heures_service
        ? maintenance.heures_service.toString()
        : "",
      filtres: maintenance.filtres_remplaces || [],
    });
    setEditOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace("edit-", "");
    setEditFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setErrors({ ...errors, [fieldName]: "" });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors({ ...errors, [id]: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.engin_code.trim()) {
      newErrors.engin_code = "Le code engin est requis";
    }
    if (!formData.type_maintenance.trim()) {
      newErrors.type_maintenance = "La gamme de maintenance est requise";
    }
    if (!formData.date_maintenance.trim()) {
      newErrors.date_maintenance = "La date de maintenance est requise";
    }
    if (!formData.heures_gamme.trim()) {
      newErrors.heures_gamme = "Les heures de gamme sont requises";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMaintenance = async () => {
    if (!validateForm()) return;

    try {
      // Convertir les données pour correspondre à la structure de la base de données
      // Trouver l'ID de l'engin à partir du code
      const engin = engins.find((e) => e.code === formData.engin_code);
      // Trouver l'ID de la gamme à partir du type de maintenance
      const gamme = gammes.find((g) => g.gamme === formData.type_maintenance);

      const maintenanceData = {
        engin_id: engin ? engin.id : null,
        gamme_id: gamme ? gamme.id : null,
        date_execution: formData.date_maintenance,
        heures_service: parseInt(formData.heures_gamme) || 0,
        filtres_remplaces: formData.filtres || [],
      };

      const newMaintenance = await createMaintenance(maintenanceData);
      setMaintenances((prev) => [newMaintenance, ...prev]);
      resetForm();
      setAddDialogOpen(false);
      toast({
        title: "Succès",
        description: "La maintenance a été ajoutée avec succès",
      });
    } catch (error) {
      console.error("Error adding maintenance:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la maintenance",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!currentMaintenance) return;

    try {
      // Convertir les données pour correspondre à la structure de la base de données
      // Trouver l'ID de l'engin à partir du code
      const engin = engins.find((e) => e.code === editFormData.engin_code);
      // Trouver l'ID de la gamme à partir du type de maintenance
      const gamme = gammes.find(
        (g) => g.gamme === editFormData.type_maintenance
      );

      const maintenanceData = {
        engin_id: engin ? engin.id : null,
        gamme_id: gamme ? gamme.id : null,
        date_execution: editFormData.date_maintenance,
        heures_service: parseInt(editFormData.heures_gamme) || 0,
        filtres_remplaces: editFormData.filtres || [],
      };

      const updatedMaintenance = await updateMaintenance(
        currentMaintenance.id,
        maintenanceData
      );

      setMaintenances((prev) =>
        prev.map((m) =>
          m.id === currentMaintenance.id ? updatedMaintenance : m
        )
      );
      setEditOpen(false);
      toast({
        title: "Succès",
        description: "La maintenance a été modifiée avec succès",
      });
    } catch (error) {
      console.error("Error updating maintenance:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la maintenance",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMaintenance = (id: number) => {
    setMaintenanceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMaintenance = async () => {
    if (maintenanceToDelete === null) return;

    try {
      await deleteMaintenance(maintenanceToDelete);

      setMaintenances((prev) =>
        prev.filter((m) => m.id !== maintenanceToDelete)
      );
      setMaintenanceToDelete(null);
      setDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "La maintenance a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la maintenance",
        variant: "destructive",
      });
    }
  };

  const cancelDeleteMaintenance = () => {
    setMaintenanceToDelete(null);
    setDeleteDialogOpen(false);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "préventive":
        return "bg-success/10 text-success border-success/20";
      case "curative":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getMaintenanceIcon = (type: string) => {
    if (type.toLowerCase().includes("préventive")) return "🔧";
    if (type.toLowerCase().includes("curative")) return "⚠️";
    return "🔧";
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="space-y-8">
          {/* Animated Header Section */}
          <div
            className="relative overflow-hidden rounded-xl
           bg-gradient-header p-8 shadow-vibrant drop-shadow-xl animate-fade-in"
          >
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce-in">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in">
                Gestion des Maintenances
              </h1>
              <p className="text-white/90 text-lg mb-6 animate-slide-in">
                Gérez les opérations de maintenance de vos engins
              </p>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-vibrant animate-scale-in"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouvelle Maintenance
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`${isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}`}
                >
                  <DialogHeader>
                    <DialogTitle>Ajouter une Nouvelle Maintenance</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div
                      className={`${
                        isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                      } gap-4`}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="engin_code">Code Engin</Label>
                        <Select
                          value={formData.engin_code}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { id: "engin_code", value },
                            })
                          }
                        >
                          <SelectTrigger
                            className={
                              errors.engin_code ? "border-destructive" : ""
                            }
                          >
                            <SelectValue placeholder="Sélectionner un engin" />
                          </SelectTrigger>
                          <SelectContent>
                            {engins.map((engin) => (
                              <SelectItem key={engin.id} value={engin.code}>
                                {engin.code} - {engin.marque} ({engin.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.engin_code && (
                          <p className="text-sm text-destructive">
                            {errors.engin_code}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type_maintenance">
                          Gamme de Maintenance
                        </Label>
                        <Select
                          value={formData.type_maintenance}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { id: "type_maintenance", value },
                            })
                          }
                        >
                          <SelectTrigger
                            className={
                              errors.type_maintenance
                                ? "border-destructive"
                                : ""
                            }
                          >
                            <SelectValue placeholder="Sélectionner une gamme" />
                          </SelectTrigger>
                          <SelectContent>
                            {gammes.map((gamme) => (
                              <SelectItem key={gamme.id} value={gamme.gamme}>
                                Gamme {gamme.gamme} ({gamme.heures_interval}h)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.type_maintenance && (
                          <p className="text-sm text-destructive">
                            {errors.type_maintenance}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_maintenance">
                        Date de Maintenance
                      </Label>
                      <Input
                        id="date_maintenance"
                        type="date"
                        value={formData.date_maintenance}
                        onChange={handleInputChange}
                        className={
                          errors.date_maintenance ? "border-destructive" : ""
                        }
                      />
                      {errors.date_maintenance && (
                        <p className="text-sm text-destructive">
                          {errors.date_maintenance}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heures_gamme">Heures de Gamme</Label>
                      <Input
                        id="heures_gamme"
                        type="number"
                        placeholder="Heures lors de l'exécution"
                        value={formData.heures_gamme || ""}
                        onChange={handleInputChange}
                        className={
                          errors.heures_gamme ? "border-destructive" : ""
                        }
                      />
                      {errors.heures_gamme && (
                        <p className="text-sm text-destructive">
                          {errors.heures_gamme}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Filtres à Remplacer (optionnel)</Label>
                      <div className="flex flex-wrap gap-2">
                        {filtres.map((filtre) => (
                          <div
                            key={filtre.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`filtre-${filtre.id}`}
                              checked={
                                formData.filtres
                                  ? formData.filtres.includes(
                                      filtre.id.toString()
                                    )
                                  : false
                              }
                              onChange={(e) => {
                                const filtreId = filtre.id.toString();
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    filtres: [
                                      ...(prev.filtres || []),
                                      filtreId,
                                    ],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    filtres: (prev.filtres || []).filter(
                                      (id) => id !== filtreId
                                    ),
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor={`filtre-${filtre.id}`}
                              className="text-sm"
                            >
                              {filtre.reference_principale} - {filtre.type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Annuler
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
                      onClick={handleAddMaintenance}
                    >
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Animated Search Section */}
          <Card className="shadow-vibrant bg-gradient-card border-0 overflow-hidden animate-fade-in">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
                  <Input
                    placeholder="Rechercher par code engin, type de maintenance..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 max-sm:text-sm text-lg border-primary/20 focus:border-primary
                     focus:ring-primary/20 transition-all duration-300 hover:shadow-glow"
                  />
                </div>
                <Select>
                  <SelectTrigger
                    className="w-full lg:w-56 h-12 border-accent/20
                   focus:border-accent hover:shadow-vibrant transition-all duration-300"
                  >
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-card">
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="preventive">Préventive</SelectItem>
                    <SelectItem value="curative">Curative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Animated Maintenances Grid */}

          <HistoriqueMaintenances onEdit={handleEditClick} />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className={`${isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}`}
        >
          <DialogHeader>
            <DialogTitle>
              Modifier la maintenance - {editFormData.engin_code}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div
              className={`${
                isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
              } gap-4`}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-engin_code">Code Engin</Label>
                <Select
                  value={editFormData.engin_code}
                  onValueChange={(value) =>
                    handleEditInputChange({
                      target: { id: "edit-engin_code", value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un engin" />
                  </SelectTrigger>
                  <SelectContent>
                    {engins.map((engin) => (
                      <SelectItem key={engin.id} value={engin.code}>
                        {engin.code} - {engin.marque} ({engin.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type_maintenance">
                  Gamme de Maintenance
                </Label>
                <Select
                  value={editFormData.type_maintenance}
                  onValueChange={(value) =>
                    handleEditInputChange({
                      target: { id: "edit-type_maintenance", value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une gamme" />
                  </SelectTrigger>
                  <SelectContent>
                    {gammes.map((gamme) => (
                      <SelectItem key={gamme.id} value={gamme.gamme}>
                        Gamme {gamme.gamme} ({gamme.heures_interval}h)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date_maintenance">Date de Maintenance</Label>
              <Input
                id="edit-date_maintenance"
                type="date"
                value={editFormData.date_maintenance}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-heures_gamme">Heures de Gamme</Label>
              <Input
                id="edit-heures_gamme"
                type="number"
                placeholder="Heures lors de l'exécution"
                value={editFormData.heures_gamme || ""}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Filtres à Remplacer (optionnel)</Label>
              <div className="flex flex-wrap gap-2">
                {filtres.map((filtre) => (
                  <div key={filtre.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-filtre-${filtre.id}`}
                      checked={
                        editFormData.filtres
                          ? editFormData.filtres.includes(filtre.id.toString())
                          : false
                      }
                      onChange={(e) => {
                        const filtreId = filtre.id.toString();
                        if (e.target.checked) {
                          setEditFormData((prev) => ({
                            ...prev,
                            filtres: [...(prev.filtres || []), filtreId],
                          }));
                        } else {
                          setEditFormData((prev) => ({
                            ...prev,
                            filtres: (prev.filtres || []).filter(
                              (id) => id !== filtreId
                            ),
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`edit-filtre-${filtre.id}`}
                      className="text-sm"
                    >
                      {filtre.reference_principale} - {filtre.type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Annuler
              </Button>
            </DialogClose>
            <Button
              className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
              onClick={handleSaveEdit}
            >
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette maintenance ? Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteMaintenance}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMaintenance}
              className="bg-destructive hover:bg-destructive-hover"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
