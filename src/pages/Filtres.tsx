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
import { Plus, Search, Edit, Trash2, Package, Wrench, Cog } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  deleteFiltre,
  fetchEngins,
  fetchFiltres,
  updateFiltre,
} from "@/lib/database-utils";
import { toast } from "sonner";
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

interface Filtre {
  id: number;
  referencePrincipale: string;
  type: string;
  fabricant: string;
  description: string;
  referencesCompatibles: string[];
  enginCompatibles: number;
  stock: number;
  prixUnitaire: number;
}

const Filtres = () => {
  const [filtres, setFiltres] = useState<Filtre[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    loadFiltres();
  }, []);

  const loadFiltres = async () => {
    try {
      const data = await fetchFiltres();
      setFiltres(data);
    } catch (error) {
      console.error("Error fetching filtres:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les filtres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filtreToDelete, setFiltreToDelete] = useState<number | null>(null);
  const [editFiltre, setEditFiltre] = useState<Filtre | null>(null);

  // Form states
  const [newReference, setNewReference] = useState("");
  const [newType, setNewType] = useState("");
  const [newFabricant, setNewFabricant] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newPrix, setNewPrix] = useState("");
  const [newStock, setNewStock] = useState("");
  const [selectedEngins, setSelectedEngins] = useState<number[]>([]);
  const [editSelectedEngins, setEditSelectedEngins] = useState<number[]>([]);
  const [engins, setEngins] = useState<any[]>([]);

  // Edit form states
  const [editReference, setEditReference] = useState("");
  const [editType, setEditType] = useState("");
  const [editFabricant, setEditFabricant] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editPrix, setEditPrix] = useState("");
  const [editStock, setEditStock] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    // Charger la liste des engins
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
      }
    };

    loadEngins();

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Réinitialiser les engins sélectionnés lorsque le dialogue d'ajout est ouvert
  useEffect(() => {
    if (dialogOpen) {
      setSelectedEngins([]);
    }
  }, [dialogOpen]);

  // Réinitialiser les engins sélectionnés lorsque le dialogue d'édition est ouvert
  useEffect(() => {
    if (editDialogOpen) {
      setEditSelectedEngins([]);
    }
  }, [editDialogOpen]);

  const filteredFiltres = filtres.filter(
    (filtre) =>
      (filtre.referencePrincipale &&
        filtre.referencePrincipale
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (filtre.type &&
        filtre.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (filtre.fabricant &&
        filtre.fabricant.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteFiltre = (id: number) => {
    setFiltreToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFiltre = async () => {
    if (filtreToDelete !== null) {
      try {
        await deleteFiltre(filtreToDelete);
        setFiltres(filtres.filter((f) => f.id !== filtreToDelete));
        setDeleteDialogOpen(false);
        setFiltreToDelete(null);
        toast.success("Filtre supprime avec succes");
      } catch (error) {
        console.error("Error deleting filtre:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le filtre",
          variant: "destructive",
        });
      }
    }
  };

  const cancelDeleteFiltre = () => {
    setDeleteDialogOpen(false);
    setFiltreToDelete(null);
  };

  const handleAddFiltre = () => {
    const newErrors: Record<string, string> = {};

    if (!newReference.trim()) {
      newErrors.reference = "La reference est requise";
    }
    if (!newType.trim()) {
      newErrors.type = "Le type est requis";
    }

    if (!newDesignation.trim()) {
      newErrors.designation = "La designation est requise";
    }
    if (!newPrix.trim()) {
      newErrors.prix = "Le prix est requis";
    }
    if (!newStock.trim()) {
      newErrors.stock = "Le stock est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const typeMap: Record<string, string> = {
      hydraulique: "Hydraulique",
      air: "Air",
      carburant: "Carburant",
      huile: "Huile",
      transmission: "Transmission",
      cabine: "Cabine",
    };

    const newItem = {
      id: Date.now(),
      referencePrincipale: newReference.trim(),
      type: typeMap[newType] || newType || "Hydraulique",
      fabricant: newFabricant.trim(),

      referencesCompatibles: [],
      enginCompatibles: selectedEngins.length,
      stock: Number(newStock) || 0,
      prixUnitaire: Number(newPrix) || 0,
    };

    setFiltres((prev) => [newItem, ...prev]);
    setNewDesignation("");
    setNewReference("");
    setNewType("");
    setNewFabricant("");
    setNewPrix("");
    setNewStock("");
    setErrors({});
    setDialogOpen(false);
    toast.success("Filtre ajoute avec succes");
  };

  const handleSaveEdit = async () => {
    if (!editFiltre) return;

    const newErrors: Record<string, string> = {};

    if (!editReference.trim()) {
      newErrors.reference = "La reference est requise";
    }
    if (!editType.trim()) {
      newErrors.type = "Le type est requis";
    }
    if (!editFabricant.trim()) {
      newErrors.fabricant = "Le fabricant est requis";
    }
    if (!editDesignation.trim()) {
      newErrors.designation = "La designation est requise";
    }
    if (!editPrix.trim()) {
      newErrors.prix = "Le prix est requis";
    }
    if (!editStock.trim()) {
      newErrors.stock = "Le stock est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const typeMap: Record<string, string> = {
      hydraulique: "Hydraulique",
      air: "Air",
      carburant: "Carburant",
      huile: "Huile",
      transmission: "Transmission",
      cabine: "Cabine",
    };

    try {
      const updates = {
        reference_principale: editReference.trim(),
        type: typeMap[editType] || editType || "Hydraulique",
        fabricant: editFabricant.trim(),
        description: editDesignation.trim(),
        stock: Number(editStock) || 0,
        prix_unitaire: Number(editPrix) || 0,
        engin_compatibles: editSelectedEngins.length,
      };

      const updatedFiltre = await updateFiltre(editFiltre.id, updates);
      setFiltres((prev) =>
        prev.map((f) => (f.id === editFiltre.id ? updatedFiltre : f))
      );
      setEditDialogOpen(false);
      setEditFiltre(null);
      toast.success("Filtre modifie avec succes");
    } catch (error) {
      console.error("Error updating filtre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le filtre",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "hydraulique":
        return "bg-blue-100 text-blue-800";
      case "air":
        return "bg-green-100 text-green-800";
      case "carburant":
        return "bg-yellow-100 text-yellow-800";
      case "huile":
        return "bg-red-100 text-red-800";
      case "transmission":
        return "bg-purple-100 text-purple-800";
      case "cabine":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "hydraulique":
        return "H";
      case "air":
        return "A";
      case "carburant":
        return "C";
      case "huile":
        return "O";
      case "transmission":
        return "T";
      case "cabine":
        return "C";
      default:
        return "F";
    }
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
                Gestion des Filtres
              </h1>
              <p className="text-white/90 text-lg mb-6 animate-slide-in">
                Consultez et gérez votre catalogue de filtres
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-vibrant"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau Filtre
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`${isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}`}
                >
                  <DialogHeader>
                    <DialogTitle>Ajouter un Nouveau Filtre</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div
                      className={`${
                        isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                      } gap-4`}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference Principale</Label>
                        <Input
                          id="reference"
                          placeholder="ex: FF5321"
                          value={newReference}
                          onChange={(e) => {
                            setNewReference(e.target.value);
                            setErrors({ ...errors, reference: "" });
                          }}
                          className={
                            errors.reference ? "border-destructive" : ""
                          }
                        />
                        {errors.reference && (
                          <p className="text-sm text-destructive">
                            {errors.reference}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          placeholder="ex: Filtre a huile moteur"
                          value={newDesignation}
                          onChange={(e) => {
                            setNewDesignation(e.target.value);
                            setErrors({ ...errors, designation: "" });
                          }}
                          className={
                            errors.designation ? "border-destructive" : ""
                          }
                        />
                        {errors.designation && (
                          <p className="text-sm text-destructive">
                            {errors.designation}
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
                        <Label htmlFor="type">Type</Label>
                        <Select value={newType} onValueChange={setNewType}>
                          <SelectTrigger
                            className={errors.type ? "border-destructive" : ""}
                          >
                            1
                            <SelectValue placeholder="Selectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hydraulique">
                              Hydraulique
                            </SelectItem>
                            <SelectItem value="air">Air</SelectItem>
                            <SelectItem value="carburant">Carburant</SelectItem>
                            <SelectItem value="huile">Huile</SelectItem>
                            <SelectItem value="transmission">
                              Transmission
                            </SelectItem>
                            <SelectItem value="cabine">Cabine</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <p className="text-sm text-destructive">
                            {errors.type}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="engins">Engins compatibles</Label>
                        <div className="space-y-2">
                          {engins.map((engin) => (
                            <div
                              key={engin.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`engin-${engin.id}`}
                                checked={selectedEngins.includes(engin.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedEngins([
                                      ...selectedEngins,
                                      engin.id,
                                    ]);
                                  } else {
                                    setSelectedEngins(
                                      selectedEngins.filter(
                                        (id) => id !== engin.id
                                      )
                                    );
                                  }
                                }}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label
                                htmlFor={`engin-${engin.id}`}
                                className="text-sm"
                              >
                                {engin.code} - {engin.type} ({engin.marque})
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${
                        isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                      } gap-4`}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="prix">Prix Unitaire (DA)</Label>
                        <Input
                          id="prix"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newPrix}
                          onChange={(e) => {
                            setNewPrix(e.target.value);
                            setErrors({ ...errors, prix: "" });
                          }}
                          className={errors.prix ? "border-destructive" : ""}
                        />
                        {errors.prix && (
                          <p className="text-sm text-destructive">
                            {errors.prix}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          placeholder="0"
                          value={newStock}
                          onChange={(e) => {
                            setNewStock(e.target.value);
                            setErrors({ ...errors, stock: "" });
                          }}
                          className={errors.stock ? "border-destructive" : ""}
                        />
                        {errors.stock && (
                          <p className="text-sm text-destructive">
                            {errors.stock}
                          </p>
                        )}
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
                      onClick={handleAddFiltre}
                    >
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Animated Search Section */}
            <Card className="shadow-vibrant bg-gradient-card border-0 overflow-hidden animate-fade-in">
              <CardContent className="p-6">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
                  <Input
                    placeholder="Rechercher par reference, type, fabricant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 max-sm:text-sm text-lg border-primary/20 focus:border-primary
                     focus:ring-primary/20 transition-all duration-300 hover:shadow-glow"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Animated Filters Grid */}
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
                Catalogue des Filtres ({filteredFiltres.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium mb-2">
                    Chargement des filtres...
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Veuillez patienter pendant que nous récupérons les données
                  </p>
                </div>
              ) : filteredFiltres.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Aucun filtre trouve
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Essayez de modifier vos criteres de recherche
                  </p>
                </div>
              ) : (
                <div
                  className="grid grid-cols-1
           md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
                >
                  {filteredFiltres.map((filtre, index) => (
                    <div
                      key={filtre.id}
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
                            <div>
                              <Link
                                to={`/filtres/${filtre.id}`}
                                className="text-lg font-bold text-primary hover:text-primary-hover
                                 transition-colors duration-200 hover:underline"
                              >
                                {filtre.referencePrincipale || "N/A"}
                              </Link>
                              <Badge
                                className={`ml-2 ${getTypeColor(
                                  filtre.type || ""
                                )} text-xs animate-pulse`}
                              >
                                {filtre.type || "N/A"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditFiltre(filtre);
                                setEditReference(
                                  filtre.referencePrincipale || ""
                                );
                                setEditType(
                                  Object.entries({
                                    hydraulique: "Hydraulique",
                                    air: "Air",
                                    carburant: "Carburant",
                                    huile: "Huile",
                                    transmission: "Transmission",
                                    cabine: "Cabine",
                                  }).find(
                                    ([_, value]) => value === filtre.type
                                  )?.[0] || (filtre.type || "").toLowerCase()
                                );
                                setEditFabricant(filtre.fabricant || "");
                                setEditDesignation(filtre.description || "");
                                setEditPrix(
                                  (filtre.prixUnitaire || 0).toString()
                                );
                                setEditStock((filtre.stock || 0).toString());
                                // Initialiser les engins sélectionnés pour l'édition
                                // Note: Dans une application réelle, vous devriez récupérer les engins compatibles depuis la base de données
                                setEditSelectedEngins([]);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteFiltre(filtre.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Fabricant
                              </p>
                              <p className="font-medium">
                                {filtre.fabricant || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Engins compatibles
                              </p>
                              <p className="font-medium">
                                {filtre.enginCompatibles || 0} modeles
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Stock
                              </p>
                              <p className="font-medium">
                                {filtre.stock || 0} unites
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Prix
                              </p>
                              <p className="font-medium">
                                {filtre.prixUnitaire
                                  ? filtre.prixUnitaire.toFixed(2)
                                  : "0.00"}{" "}
                                DA
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent
            className={`${isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}`}
          >
            <DialogHeader>
              <DialogTitle>Modifier le Filtre - {editReference}</DialogTitle>
            </DialogHeader>
            <div
              className={`${
                isMobile ? "grid grid-cols-1" : "grid grid-cols-3"
              } gap-4`}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-reference">Reference Principale</Label>
                <Input
                  id="edit-reference"
                  placeholder="ex: FF5321"
                  value={editReference}
                  onChange={(e) => {
                    setEditReference(e.target.value);
                    setErrors({ ...errors, reference: "" });
                  }}
                  className={errors.reference ? "border-destructive" : ""}
                />
                {errors.reference && (
                  <p className="text-sm text-destructive">{errors.reference}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-designation">Designation</Label>
                <Input
                  id="edit-designation"
                  placeholder="ex: Filtre a huile moteur"
                  value={editDesignation}
                  onChange={(e) => {
                    setEditDesignation(e.target.value);
                    setErrors({ ...errors, designation: "" });
                  }}
                  className={errors.designation ? "border-destructive" : ""}
                />
                {errors.designation && (
                  <p className="text-sm text-destructive">
                    {errors.designation}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={editType} onValueChange={setEditType}>
                  <SelectTrigger
                    className={errors.type ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hydraulique">Hydraulique</SelectItem>
                    <SelectItem value="air">Air</SelectItem>
                    <SelectItem value="carburant">Carburant</SelectItem>
                    <SelectItem value="huile">Huile</SelectItem>
                    <SelectItem value="transmission">Transmission</SelectItem>
                    <SelectItem value="cabine">Cabine</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-fabricant">Fabricant</Label>
                <Input
                  id="edit-fabricant"
                  placeholder="ex: Caterpillar, Fleetguard..."
                  value={editFabricant}
                  onChange={(e) => {
                    setEditFabricant(e.target.value);
                    setErrors({ ...errors, fabricant: "" });
                  }}
                  className={errors.fabricant ? "border-destructive" : ""}
                />
                {errors.fabricant && (
                  <p className="text-sm text-destructive">{errors.fabricant}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-prix">Prix Unitaire (DA)</Label>
                <Input
                  id="edit-prix"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editPrix}
                  onChange={(e) => {
                    setEditPrix(e.target.value);
                    setErrors({ ...errors, prix: "" });
                  }}
                  className={errors.prix ? "border-destructive" : ""}
                />
                {errors.prix && (
                  <p className="text-sm text-destructive">{errors.prix}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  placeholder="0"
                  value={editStock}
                  onChange={(e) => {
                    setEditStock(e.target.value);
                    setErrors({ ...errors, stock: "" });
                  }}
                  className={errors.stock ? "border-destructive" : ""}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-engins">Engins compatibles</Label>
              <div className="space-y-2">
                {engins.map((engin) => (
                  <div key={engin.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-engin-${engin.id}`}
                      checked={editSelectedEngins.includes(engin.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditSelectedEngins([
                            ...editSelectedEngins,
                            engin.id,
                          ]);
                        } else {
                          setEditSelectedEngins(
                            editSelectedEngins.filter((id) => id !== engin.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`edit-engin-${engin.id}`}
                      className="text-sm"
                    >
                      {engin.code} - {engin.type} ({engin.marque})
                    </label>
                  </div>
                ))}
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
                Enregistrer
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
                Etes-vous sur de vouloir supprimer ce filtre ? Cette action est
                irreversible et supprimera toutes les donnees associees.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteFiltre}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteFiltre}
                className="bg-destructive hover:bg-destructive-hover"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default Filtres;
