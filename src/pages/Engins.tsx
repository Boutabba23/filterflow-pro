import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  MapPin,
  HourglassIcon,
  Building2,
  Cog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { EnginCard } from "@/components/engins/EnginCard";
import { supabase } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";
import {
  createEngin,
  deleteEngin,
  fetchEngins,
  updateEngin,
} from "@/lib/database-utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Engins() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [currentEngin, setCurrentEngin] = useState(null);
  const [editFormData, setEditFormData] = useState({
    code: "",
    désignation: "",
    marque: "",
    type: "",
    heures: 0,
  });

  const [formData, setFormData] = useState({
    code: "",
    désignation: "",
    marque: "",
    type: "",
    heures: 0,
  });
  const resetForm = () => {
    setFormData({
      code: "",
      désignation: "",
      marque: "",
      type: "",
      heures: 0,
    });
    setErrors({});
  };

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enginToDelete, setEnginToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - sera remplacé par les données Supabase
  const [engins, setEngins] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch data on component mount
  useEffect(() => {
    loadEngins();
  }, []);
  const loadEngins = async () => {
    try {
      const data = await fetchEngins();
      setEngins(data);
    } catch (error) {
      console.error("Error fetching engins:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les engins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const filteredEngins = engins.filter(
    (engin) =>
      engin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engin.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engin.marque.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (engin) => {
    setCurrentEngin(engin);
    setEditFormData({
      code: engin.code,
      désignation: engin.désignation,
      marque: engin.marque,
      type: engin.type,
      heures: engin.heures,
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
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "heures" ? Number(value) : value,
    }));
    setErrors({ ...errors, [id]: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Le code est requis";
    }
    if (!formData.désignation.trim()) {
      newErrors.désignation = "La désignation est requise";
    }
    if (!formData.marque.trim()) {
      newErrors.marque = "La marque est requise";
    }
    if (!formData.type.trim()) {
      newErrors.type = "Le type est requis";
    }
    if (isNaN(Number(formData.heures)) || Number(formData.heures) < 0) {
      newErrors.heures = "Les heures doivent être un nombre positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update handleAddEngin
  const handleAddEngin = async () => {
    if (!validateForm()) return;

    try {
      const newEngin = await createEngin({
        code: formData.code,
        designation: formData.désignation,
        marque: formData.marque,
        type: formData.type,
        heures: Number(formData.heures),

        filtres: undefined,
        derniere_maintenance_preventive: "",
      });

      setEngins((prev) => [newEngin, ...prev]);
      resetForm();
      toast({
        title: "Succès",
        description: "L'engin a été ajouté avec succès",
      });
    } catch (error) {
      console.error("Error adding engin:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'engin",
        variant: "destructive",
      });
    }
  };

  // Update handleSaveEdit
  const handleSaveEdit = async () => {
    if (!currentEngin) return;

    try {
      const updatedEngin = await updateEngin(currentEngin.id, {
        code: editFormData.code,
        designation: editFormData.désignation,
        marque: editFormData.marque,
        type: editFormData.type,
        heures: Number(editFormData.heures),
      });

      setEngins((prev) =>
        prev.map((e) => (e.id === currentEngin.id ? updatedEngin : e))
      );
      setEditOpen(false);
      toast({
        title: "Succès",
        description: "L'engin a été modifié avec succès",
      });
    } catch (error) {
      console.error("Error updating engin:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'engin",
        variant: "destructive",
      });
    }
  };
  const handleDeleteEngin = (id: number) => {
    setEnginToDelete(id);
    setDeleteDialogOpen(true);
  };
  // Update confirmDeleteEngin
  const confirmDeleteEngin = async () => {
    if (enginToDelete === null) return;

    try {
      await deleteEngin(enginToDelete);

      setEngins((prev) => prev.filter((e) => e.id !== enginToDelete));
      setEnginToDelete(null);
      setDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "L'engin a été supprimé avec succès",
      });
    } catch (error) {
      console.error("Error deleting engin:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'engin",
        variant: "destructive",
      });
    }
  };
  const cancelDeleteEngin = () => {
    setEnginToDelete(null);
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "Actif":
        return "bg-success/10 text-success border-success/20";
      case "Maintenance":
        return "bg-warning/10 text-warning border-warning/20";
      case "Réparation":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getEnginIcon = (designation: string | undefined) => {
    if (!designation) return "🔧";
    if (designation.includes("BULL")) return "🚜";
    if (designation.includes("PELLE")) return "🚧";
    if (designation.includes("CHARGEUSE")) return "🏗️";
    return "🔧";
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="space-y-8">
          {/* Animated Header Section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-header p-8 shadow-vibrant drop-shadow-xl animate-fade-in">
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce-in">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in">
                Gestion des Engins
              </h1>
              <p className="text-white/90 text-lg mb-6 animate-slide-in">
                Gérez votre parc d'engins de chantier
              </p>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-vibrant animate-scale-in"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouvel Engin
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`${isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}`}
                >
                  <DialogHeader>
                    <DialogTitle>Ajouter un Nouvel Engin</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div
                      className={`${
                        isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                      } gap-4`}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                          id="code"
                          placeholder="ex: A03010236"
                          value={formData.code}
                          onChange={handleInputChange}
                          className={errors.code ? "border-destructive" : ""}
                        />
                        {errors.code && (
                          <p className="text-sm text-destructive">
                            {errors.code}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="désignation">Désignation</Label>
                        <Input
                          id="désignation"
                          placeholder="ex: BULL SUR CHENILLE"
                          value={formData.désignation}
                          onChange={handleInputChange}
                          className={
                            errors.désignation ? "border-destructive" : ""
                          }
                        />
                        {errors.désignation && (
                          <p className="text-sm text-destructive">
                            {errors.désignation}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`${
                        isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                      } gap-4`}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="marque">Marque</Label>
                        <Input
                          id="marque"
                          placeholder="ex: Caterpillar"
                          value={formData.marque}
                          onChange={handleInputChange}
                          className={errors.marque ? "border-destructive" : ""}
                        />
                        {errors.marque && (
                          <p className="text-sm text-destructive">
                            {errors.marque}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Input
                          id="type"
                          placeholder="ex: D8R"
                          value={formData.type}
                          onChange={handleInputChange}
                          className={errors.type ? "border-destructive" : ""}
                        />
                        {errors.type && (
                          <p className="text-sm text-destructive">
                            {errors.type}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heures">Heures</Label>
                      <Input
                        id="heures"
                        type="number"
                        placeholder="0"
                        value={formData.heures}
                        onChange={handleInputChange}
                        className={errors.heures ? "border-destructive" : ""}
                      />
                      {errors.heures && (
                        <p className="text-sm text-destructive">
                          {errors.heures}
                        </p>
                      )}
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
                      onClick={handleAddEngin}
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
                    placeholder="Rechercher par code, type, marque..."
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
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-card">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="actif">✅ Actif</SelectItem>
                    <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                    <SelectItem value="reparation">⚠️ Réparation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Animated Engins Grid */}
          <Card
            className="shadow-glow bg-gradient-card 
          border-0 overflow-hidden animate-fade-in"
          >
            <CardHeader
              className="bg-gradient-rainbow 
            text-white"
            >
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div
                  className="w-10 h-10 bg-white/20 rounded-full 
                flex items-center justify-center animate-pulse"
                >
                  <Cog className="h-6 w-6" />
                </div>
                Parc d'Engins ({filteredEngins.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Modern Grid Layout */}
              <div
                className="grid grid-cols-1
               md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredEngins.map((engin, index) => (
                  <div
                    key={engin.id}
                    className="group relative bg-white dark:bg-card 
                    rounded-2xl p-6 shadow-card hover:shadow-vibrant 
                    transition-all duration-500 hover:scale-105 
                    animate-scale-in border border-primary/5
                    hover:border-primary/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-2xl">
                            {getEnginIcon(engin.désignation)}
                          </div>
                          <div>
                            <Link
                              to={`/engins/${engin.id}`}
                              className="text-lg font-bold text-primary hover:text-primary-hover transition-colors duration-200 hover:underline"
                            >
                              {engin.code}
                            </Link>
                            <Badge
                              className={`ml-2 ${getStatusColor(
                                engin.statut
                              )} text-xs animate-pulse`}
                            >
                              {engin.statut}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Description & Type */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-foreground mb-1">
                          {engin.désignation}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs bg-accent/10 border-accent/20 text-accent"
                        >
                          {engin.type}
                        </Badge>
                      </div>

                      {/* Manufacturer & Hours */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {engin.marque}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-success/10 px-3 py-1 rounded-full">
                          <HourglassIcon className="h-4 w-4 text-success" />
                          <span className="font-bold text-success">
                            {engin.heures.toLocaleString()}h
                          </span>
                        </div>
                      </div>

                      {/* Last Maintenance */}
                      <div className="flex items-center gap-2 mb-4 p-2 bg-muted/30 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">
                          Dernière maintenance:{" "}
                          <span className="font-bold text-primary">
                            {engin.derniere_maintenance_preventive
                              ? new Date(
                                  engin.derniere_maintenance_preventive
                                ).toLocaleDateString("fr-FR")
                              : "Non définie"}
                          </span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-accent/10 text-accent border-accent/20 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105"
                          onClick={() => handleEditClick(engin)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEngin(engin.id)}
                          className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredEngins.length === 0 && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-vibrant rounded-full flex items-center justify-center">
                    <Wrench className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Aucun engin trouvé
                  </h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className={`${isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}`}
        >
          <DialogHeader>
            <DialogTitle>Modifier l'engin - {currentEngin?.code}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div
              className={`${
                isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
              } gap-4`}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code Engin</Label>
                <Input
                  id="edit-code"
                  value={editFormData.code}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-désignation">Désignation</Label>
                <Input
                  id="edit-désignation"
                  value={editFormData.désignation}
                  onChange={handleEditInputChange}
                />
              </div>
            </div>
            <div
              className={`${
                isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
              } gap-4`}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-marque">Marque</Label>
                <Input
                  id="edit-marque"
                  value={editFormData.marque}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Input
                  id="edit-type"
                  value={editFormData.type}
                  onChange={handleEditInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-heures">Heures</Label>
              <Input
                id="edit-heures"
                type="number"
                value={editFormData.heures}
                onChange={handleEditInputChange}
              />
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
              Êtes-vous sûr de vouloir supprimer cet engin ? Cette action est
              irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteEngin}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEngin}
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
