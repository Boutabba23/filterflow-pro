import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
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
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Package,
  Building2,
  Euro,
  Wrench,
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
import { useIsMobile } from "@/hooks/use-mobile";
<<<<<<< HEAD
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/database";
import { createFiltre, deleteFiltre, fetchFiltres } from "@/lib/database-utils";
=======
import { MaintenancePreventive } from "@/components/maintenance/MaintenancePreventive";
>>>>>>> a87fe9648a27cc715c1ad5dcd3d4acbd7c996438

export default function Filtres() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filtreToDelete, setFiltreToDelete] = useState<number | null>(null);
  const [newDesignation, setNewDesignation] = useState("");
  const [newReference, setNewReference] = useState("");
  const [newType, setNewType] = useState("");
  const [newFabricant, setNewFabricant] = useState("");
  const [newPrix, setNewPrix] = useState("");
  const [newStock, setNewStock] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEngin, setSelectedEngin] = useState<string>("none");
  const [engins, setEngins] = useState<any[]>([]);

  // Mock data - sera remplacé par les données Supabase
<<<<<<< HEAD
  const [filtres, setFiltres] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour le formulaire de modification
  const [editFiltreId, setEditFiltreId] = useState<number | null>(null);
  const [editReference, setEditReference] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editType, setEditType] = useState("");
  const [editFabricant, setEditFabricant] = useState("");
  const [editPrix, setEditPrix] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editSelectedEngin, setEditSelectedEngin] = useState("none");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setNewReference("");
    setNewDesignation("");
    setNewType("");
    setNewFabricant("");
    setNewPrix("");
    setNewStock("");
    setSelectedEngin("");
    setErrors({});
  };
  // Fetch data on component mount
  useEffect(() => {
    loadFiltres();
    loadEngins();
  }, []);

  const loadEngins = async () => {
    try {
      const { data, error } = await supabase.from("engins").select("*");

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

  const loadFiltres = async () => {
    console.log("Début du chargement des filtres");
    try {
      // Tester la connexion à Supabase
      const { data: testData, error: testError } = await supabase.from('filtres').select('count', { count: 'exact', head: true });
      if (testError) {
        console.error('Erreur de connexion à Supabase:', testError);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter à la base de données",
          variant: "destructive",
        });
        return;
      }
      console.log('Connexion à Supabase réussie');
      
      // Récupérer les filtres avec leurs engins associés
      console.log("Tentative de récupération des filtres");
      const { data: filtresData, error } = await supabase
        .from("filtres")
        .select(
          `
          *,
          engin_filtre_compatibility (
            engin_id,
            engin:engin_id (
              id,
              code,
              designation
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transformer les données pour inclure le nom de l'engin associé
      const filtresWithEngin = filtresData.map((filtre) => {
        // Extraire le nom de l'engin s'il existe
        const enginAssocie =
          filtre.engin_filtre_compatibility &&
          filtre.engin_filtre_compatibility.length > 0
            ? filtre.engin_filtre_compatibility[0]?.engin
            : null;

        return {
          ...filtre,
          enginNom: enginAssocie
            ? `${enginAssocie.code} - ${enginAssocie.designation}`
            : null,
        };
      });

      setFiltres(filtresWithEngin);
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
=======
  const [filtres, setFiltres] = useState([
    {
      id: 1,
      referencePrincipale: "HF6177",
      type: "Hydraulique",
      fabricant: "Caterpillar",
      description: "Filtre hydraulique haute pression",
      referencesCompatibles: ["HF6177", "P550388", "BT8851-MPG"],
      enginCompatibles: 12,
      stock: 8,
      prixUnitaire: 45.9,
    },
    {
      id: 2,
      referencePrincipale: "AF25424",
      type: "Air",
      fabricant: "Donaldson",
      description: "Filtre à air primaire moteur",
      referencesCompatibles: ["AF25424", "PA3688", "C15165/3"],
      enginCompatibles: 8,
      stock: 15,
      prixUnitaire: 67.5,
    },
    {
      id: 3,
      referencePrincipale: "FF5421",
      type: "Carburant",
      fabricant: "Fleetguard",
      description: "Filtre carburant séparateur eau",
      referencesCompatibles: ["FF5421", "FS19532", "P551329"],
      enginCompatibles: 6,
      stock: 3,
      prixUnitaire: 89.2,
    },
    {
      id: 4,
      referencePrincipale: "LF3000",
      type: "Huile",
      fabricant: "Fleetguard",
      description: "Filtre à huile moteur standard",
      referencesCompatibles: ["LF3000", "P554004", "W712/93"],
      enginCompatibles: 18,
      stock: 25,
      prixUnitaire: 28.75,
    },
  ]);

>>>>>>> a87fe9648a27cc715c1ad5dcd3d4acbd7c996438
  const filteredFiltres = filtres.filter(
    (filtre) =>
      (filtre.referencePrincipale &&
        filtre.referencePrincipale
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (filtre.designation &&
        filtre.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (filtre.type &&
        filtre.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (filtre.fabricant &&
        filtre.fabricant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (filtre.referencesCompatibles &&
        filtre.referencesCompatibles.some(
          (ref) => ref && ref.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const handleDeleteFiltre = (id: number) => {
    setFiltreToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Update confirmDeleteFiltre
  const confirmDeleteFiltre = async () => {
    if (filtreToDelete === null) return;

    try {
      await deleteFiltre(filtreToDelete);

      setFiltres((prev) => prev.filter((f) => f.id !== filtreToDelete));
      setFiltreToDelete(null);
      setDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "Le filtre a été supprimé avec succès",
      });
    } catch (error) {
      console.error("Error deleting filtre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le filtre",
        variant: "destructive",
      });
    }
  };

  const cancelDeleteFiltre = () => {
    setFiltreToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Fonction pour ouvrir le dialogue de modification avec les données du filtre
  const handleEditFiltre = (filtre: any) => {
    setEditFiltreId(filtre.id);
    setEditReference(filtre.reference_principale);
    setEditDesignation(filtre.description || filtre.designation || "");
    setEditType(filtre.type);
    setEditFabricant(filtre.fabricant);
    setEditPrix(filtre.prix?.toString() || "");
    setEditStock(filtre.stock?.toString() || "");

    // Récupérer l'engin associé s'il existe
    if (
      filtre.engin_filtre_compatibility &&
      filtre.engin_filtre_compatibility.length > 0
    ) {
      setEditSelectedEngin(
        filtre.engin_filtre_compatibility[0].engin_id.toString()
      );
    } else {
      setEditSelectedEngin("none");
    }

    setEditDialogOpen(true);
  };

  // Fonction pour réinitialiser le formulaire de modification
  const resetEditForm = () => {
    setEditFiltreId(null);
    setEditReference("");
    setEditDesignation("");
    setEditType("");
    setEditFabricant("");
    setEditPrix("");
    setEditStock("");
    setEditSelectedEngin("none");
    setEditErrors({});
  };

  // Fonction pour sauvegarder les modifications du filtre
  const handleUpdateFiltre = async () => {
    try {
      // Valider les champs
      const newErrors: Record<string, string> = {};

      if (!editReference.trim()) {
        newErrors.reference = "La référence est requise";
      }

      if (!editDesignation.trim()) {
        newErrors.designation = "La désignation est requise";
      }

      if (!editType.trim()) {
        newErrors.type = "Le type est requis";
      }

      if (!editFabricant.trim()) {
        newErrors.fabricant = "Le fabricant est requis";
      }

      if (Object.keys(newErrors).length > 0) {
        setEditErrors(newErrors);
        return;
      }

      // Convertir les valeurs numériques
      const prixValue = Number(editPrix);
      const stockValue = Number(editStock);

      if (isNaN(prixValue) || prixValue < 0) {
        setEditErrors({ prix: "Le prix doit être un nombre positif" });
        return;
      }

      if (
        isNaN(stockValue) ||
        stockValue < 0 ||
        !Number.isInteger(stockValue)
      ) {
        setEditErrors({ stock: "Le stock doit être un entier positif" });
        return;
      }

      // Mettre à jour le filtre
      console.log("Tentative de mise à jour du filtre avec ID:", editFiltreId);
      const { error } = await supabase
        .from("filtres")
        .update({
          reference_principale: editReference.trim(),
          designation: editDesignation.trim(),
          type: editType.trim(),
          fabricant: editFabricant.trim(),
          prix: prixValue,
          stock: stockValue,
        })
        .eq("id", editFiltreId);

      if (error) throw error;

      // Supprimer l'ancienne relation engin-filtre si elle existe
      await supabase
        .from("engin_filtre_compatibility")
        .delete()
        .eq("filtre_id", editFiltreId);

      // Créer la nouvelle relation si un engin est sélectionné
      if (editSelectedEngin && editSelectedEngin !== "none") {
        const enginId = Number(editSelectedEngin);
        if (!isNaN(enginId)) {
          const { error: compatibilityError } = await supabase
            .from("engin_filtre_compatibility")
            .insert([
              {
                engin_id: enginId,
                filtre_id: editFiltreId,
              },
            ]);

          if (compatibilityError) {
            console.error("Error creating compatibility:", compatibilityError);
          }
        }
      }

      // Fermer le dialogue et rafraîchir la liste
      await loadFiltres();
      resetEditForm();

      toast({
        title: "Succès",
        description: "Le filtre a été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating filtre:", error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le filtre: ${
          error.message || "Erreur inconnue"
        }`,
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Hydraulique":
        return "bg-primary/10 text-primary border-primary/20";
      case "Air":
        return "bg-accent/10 text-accent border-accent/20";
      case "Carburant":
        return "bg-warning/10 text-warning border-warning/20";
      case "Huile":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 5)
      return "bg-destructive/10 text-destructive border-destructive/20";
    if (stock <= 10) return "bg-warning/10 text-warning border-warning/20";
    return "bg-success/10 text-success border-success/20";
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (!newReference.trim()) {
      newErrors.reference = "La référence est requise";
    }

    // Vérifier si la référence existe déjà
    if (newReference.trim()) {
      const { data: existingFiltre, error } = await supabase
        .from("filtres")
        .select("id")
        .eq("reference_principale", newReference.trim());

      if (!error && existingFiltre && existingFiltre.length > 0) {
        newErrors.reference = "Cette référence existe déjà";
      }
    }

    if (!newDesignation.trim()) {
      newErrors.designation = "La désignation est requise";
    }
    if (!newFabricant.trim()) {
      newErrors.fabricant = "Le fabricant est requis";
    }
    if (!newType.trim()) {
      newErrors.type = "Le type est requis";
    }
    if (!newPrix.trim()) {
      newErrors.prix = "Le prix est requis";
    } else if (isNaN(Number(newPrix)) || Number(newPrix) < 0) {
      newErrors.prix = "Le prix doit être un nombre positif";
    }
    if (!newStock.trim()) {
      newErrors.stock = "Le stock est requis";
    } else if (
      isNaN(Number(newStock)) ||
      Number(newStock) < 0 ||
      !Number.isInteger(Number(newStock))
    ) {
      newErrors.stock = "Le stock doit être un entier positif";
    }
    if (!selectedEngin || selectedEngin === "none") {
      newErrors.engin = "Veuillez sélectionner un engin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update handleAddFiltre
  const handleAddFiltre = async () => {
    if (!(await validateForm())) return;

    try {
      // Vérifier que tous les champs requis sont valides
      if (
        !newReference.trim() ||
        !newDesignation.trim() ||
        !newType.trim() ||
        !newFabricant.trim()
      ) {
        throw new Error("Tous les champs obligatoires doivent être remplis");
      }

      // Convertir les valeurs numériques
      const prixValue = Number(newPrix);
      const stockValue = Number(newStock);

<<<<<<< HEAD
      if (isNaN(prixValue) || prixValue < 0) {
        throw new Error("Le prix doit être un nombre positif");
      }

      if (
        isNaN(stockValue) ||
        stockValue < 0 ||
        !Number.isInteger(stockValue)
      ) {
        throw new Error("Le stock doit être un entier positif");
      }

      // Créer le filtre
      const newFiltre = await createFiltre({
        reference_principale: newReference.trim(),
        designation: newDesignation.trim(), // Utiliser 'description' au lieu de 'designation'
        type: newType.trim(),
        fabricant: newFabricant.trim(),
        prix: prixValue,
        stock: stockValue,
      });

      // Si un engin est sélectionné, créer la relation
      if (selectedEngin && selectedEngin !== "none") {
        const enginId = Number(selectedEngin);
        if (isNaN(enginId)) {
          throw new Error("ID d'engin invalide");
        }

        const { error: compatibilityError } = await supabase
          .from("engin_filtre_compatibility")
          .insert([
            {
              engin_id: enginId,
              filtre_id: newFiltre.id,
            },
          ]);

        if (compatibilityError) {
          console.error("Error creating compatibility:", compatibilityError);
          // Continuer même si la relation n'a pas pu être créée
        }
      }

      // Rafraîchir la liste des filtres pour inclure les informations sur l'engin associé
      await loadFiltres();
      resetForm();
      toast({
        title: "Succès",
        description: "Le filtre a été ajouté avec succès",
      });
    } catch (error) {
      console.error("Error adding filtre:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible d'ajouter le filtre",
        variant: "destructive",
      });
    }
=======
    setFiltres((prev) => [newItem, ...prev]);
    setNewDesignation("");
    setNewReference("");
    setNewType("");
    setNewFabricant("");
    setNewPrix("");
    setNewStock("");
    setErrors({});
    setDialogOpen(false);
>>>>>>> a87fe9648a27cc715c1ad5dcd3d4acbd7c996438
  };

  return (
    <MainLayout>
<<<<<<< HEAD
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Gestion des Filtres
            </h2>
            <p className="text-muted-foreground">
              Gérez vos références de filtres et compatibilités
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-hover w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
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
                <div className="space-y-2">
                  <Label htmlFor="designation">Désignation</Label>
                  <Input
                    id="designation"
                    placeholder="ex: Filtre à huile moteur"
                    value={newDesignation}
                    onChange={(e) => {
                      setNewDesignation(e.target.value);
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
                <div
                  className={`${
                    isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                  } gap-4`}
                >
                  <div className="space-y-2">
                    <Label htmlFor="reference">Référence Principale</Label>
                    <Input
                      id="reference"
                      placeholder="ex: HF6177"
                      value={newReference}
                      onChange={(e) => {
                        setNewReference(e.target.value);
                        setErrors({ ...errors, reference: "" });
                      }}
                      className={errors.reference ? "border-destructive" : ""}
                    />
                    {errors.reference && (
                      <p className="text-sm text-destructive">
                        {errors.reference}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de Filtre</Label>
                    <Select
                      value={newType}
                      onValueChange={(value) => {
                        setNewType(value);
                        setErrors({ ...errors, type: "" });
                      }}
                    >
                      <SelectTrigger
                        className={errors.type ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hydraulique">Hydraulique</SelectItem>
                        <SelectItem value="air">Air</SelectItem>
                        <SelectItem value="carburant">Carburant</SelectItem>
                        <SelectItem value="huile">Huile</SelectItem>
                        <SelectItem value="transmission">
                          Transmission
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type}</p>
                    )}
                  </div>
                </div>
                <div
                  className={`${
                    isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                  } gap-4`}
                >
                  <div className="space-y-2">
                    <Label htmlFor="fabricant">Fabricant</Label>
                    <Input
                      id="fabricant"
                      placeholder="ex: Caterpillar, Fleetguard..."
                      value={newFabricant}
                      onChange={(e) => {
                        setNewFabricant(e.target.value);
                        setErrors({ ...errors, fabricant: "" });
                      }}
                      className={errors.fabricant ? "border-destructive" : ""}
                    />
                    {errors.fabricant && (
                      <p className="text-sm text-destructive">
                        {errors.fabricant}
                      </p>
                    )}
                  </div>
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
                      <p className="text-sm text-destructive">{errors.prix}</p>
                    )}
                  </div>
                </div>
                <div
                  className={`${
                    isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                  } gap-4`}
                >
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Initial</Label>
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
                      <p className="text-sm text-destructive">{errors.stock}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engin">Associer à un engin *</Label>
                    <Select
                      value={selectedEngin}
                      onValueChange={(value) => {
                        setSelectedEngin(value);
                        setErrors({ ...errors, engin: "" });
                      }}
                    >
                      <SelectTrigger
                        className={errors.engin ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Sélectionner un engin" />
                      </SelectTrigger>
                      <SelectContent>
                        {engins.map((engin) => (
                          <SelectItem
                            key={engin.id}
                            value={engin.id.toString()}
                          >
                            {engin.code} - {engin.designation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.engin && (
                      <p className="text-sm text-destructive">{errors.engin}</p>
                    )}
                  </div>
                </div>
=======
      <div className="min-h-screen bg-gradient-subtle">
        <div className="space-y-8">
          {/* Animated Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-header p-8 shadow-glow animate-fade-in">
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce-in">
                <Filter className="h-8 w-8 text-white" />
>>>>>>> a87fe9648a27cc715c1ad5dcd3d4acbd7c996438
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in">
                Gestion des Filtres & Maintenance
              </h1>
              <p className="text-white/90 text-lg mb-6 animate-slide-in">
                Gérez vos filtres et suivez la maintenance préventive
              </p>
            </div>
          </div>

<<<<<<< HEAD
        {/* Filtres Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Catalogue des Filtres (
              {filteredFiltres ? filteredFiltres.length : 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Désignation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fabricant</TableHead>
                    <TableHead>Engin associé</TableHead>
                    <TableHead>Compatibilités</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiltres.map((filtre) => (
                    <TableRow key={filtre.id}>
                      <TableCell>
                        <div>
                          <Link
                            to={`/filtres/${filtre.id}`}
                            className="text-primary hover:text-primary-hover underline-offset-4 hover:underline font-medium font-mono"
                          >
                            {filtre.reference_principale}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>{filtre.designation}</TableCell>
                      <TableCell className="text-foreground">
                        <Badge className={getTypeColor(filtre.type)}>
                          {filtre.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{filtre.fabricant}</TableCell>
                      <TableCell>
                        {filtre.enginNom ? (
                          <Link
                            to={`/engins/${filtre.engin_filtre_compatibility?.[0]?.engin_id}`}
                            className="text-primary hover:text-primary-hover underline-offset-4 hover:underline"
                          >
                            {filtre.enginNom.split(" - ")[0]}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Non associé
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {filtre.referencesCompatibles
                              ? filtre.referencesCompatibles.length
                              : 0}{" "}
                            ref.
                          </span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-5 px-2 text-xs"
                              >
                                Voir
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Références Compatibles -{" "}
                                  {filtre.referencePrincipale}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-2">
                                {filtre.referencesCompatibles &&
                                  filtre.referencesCompatibles.map(
                                    (ref, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-muted/20 rounded"
                                      >
                                        <span className="font-mono">{ref}</span>
                                        {index === 0 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Principal
                                          </Badge>
                                        )}
                                      </div>
                                    )
                                  )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={getStockStatus(filtre.stock)}>
                          {filtre.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {filtre.prix ? filtre.prix.toFixed(2) : "0.00"} DA
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditFiltre(filtre)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent
                              className={`${
                                isMobile ? "w-[95%] max-w-none" : "max-w-2xl"
                              }`}
                            >
                              <DialogHeader>
                                <DialogTitle>Modifier le filtre</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-designation">
                                    Désignation
                                  </Label>
                                  <Input
                                    id="edit-designation"
                                    placeholder="ex: Filtre à huile moteur"
                                    value={editDesignation}
                                    onChange={(e) => {
                                      setEditDesignation(e.target.value);
                                      setEditErrors({
                                        ...editErrors,
                                        designation: "",
                                      });
                                    }}
                                    className={
                                      editErrors.designation
                                        ? "border-destructive"
                                        : ""
                                    }
                                  />
                                  {editErrors.designation && (
                                    <p className="text-sm text-destructive">
                                      {editErrors.designation}
                                    </p>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    isMobile
                                      ? "grid grid-cols-1"
                                      : "grid grid-cols-2"
                                  } gap-4`}
                                >
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-reference">
                                      Référence Principale
                                    </Label>
                                    <Input
                                      id="edit-reference"
                                      placeholder="ex: HF6177"
                                      value={editReference}
                                      onChange={(e) => {
                                        setEditReference(e.target.value);
                                        setEditErrors({
                                          ...editErrors,
                                          reference: "",
                                        });
                                      }}
                                      className={
                                        editErrors.reference
                                          ? "border-destructive"
                                          : ""
                                      }
                                    />
                                    {editErrors.reference && (
                                      <p className="text-sm text-destructive">
                                        {editErrors.reference}
                                      </p>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-type">
                                      Type de Filtre
                                    </Label>
                                    <Select
                                      value={editType}
                                      onValueChange={(value) => {
                                        setEditType(value);
                                        setEditErrors({
                                          ...editErrors,
                                          type: "",
                                        });
                                      }}
                                    >
                                      <SelectTrigger
                                        className={
                                          editErrors.type
                                            ? "border-destructive"
                                            : ""
                                        }
                                      >
                                        <SelectValue placeholder="Sélectionner le type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="hydraulique">
                                          Hydraulique
                                        </SelectItem>
                                        <SelectItem value="air">Air</SelectItem>
                                        <SelectItem value="carburant">
                                          Carburant
                                        </SelectItem>
                                        <SelectItem value="huile">
                                          Huile
                                        </SelectItem>
                                        <SelectItem value="transmission">
                                          Transmission
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {editErrors.type && (
                                      <p className="text-sm text-destructive">
                                        {editErrors.type}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    isMobile
                                      ? "grid grid-cols-1"
                                      : "grid grid-cols-2"
                                  } gap-4`}
                                >
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-fabricant">
                                      Fabricant
                                    </Label>
                                    <Input
                                      id="edit-fabricant"
                                      placeholder="ex: Caterpillar, Fleetguard..."
                                      value={editFabricant}
                                      onChange={(e) => {
                                        setEditFabricant(e.target.value);
                                        setEditErrors({
                                          ...editErrors,
                                          fabricant: "",
                                        });
                                      }}
                                      className={
                                        editErrors.fabricant
                                          ? "border-destructive"
                                          : ""
                                      }
                                    />
                                    {editErrors.fabricant && (
                                      <p className="text-sm text-destructive">
                                        {editErrors.fabricant}
                                      </p>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-prix">
                                      Prix Unitaire (DA)
                                    </Label>
                                    <Input
                                      id="edit-prix"
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={editPrix}
                                      onChange={(e) => {
                                        setEditPrix(e.target.value);
                                        setEditErrors({
                                          ...editErrors,
                                          prix: "",
                                        });
                                      }}
                                      className={
                                        editErrors.prix
                                          ? "border-destructive"
                                          : ""
                                      }
                                    />
                                    {editErrors.prix && (
                                      <p className="text-sm text-destructive">
                                        {editErrors.prix}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    isMobile
                                      ? "grid grid-cols-1"
                                      : "grid grid-cols-2"
                                  } gap-4`}
                                >
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-stock">Stock</Label>
                                    <Input
                                      id="edit-stock"
                                      type="number"
                                      placeholder="0"
                                      value={editStock}
                                      onChange={(e) => {
                                        setEditStock(e.target.value);
                                        setEditErrors({
                                          ...editErrors,
                                          stock: "",
                                        });
                                      }}
                                      className={
                                        editErrors.stock
                                          ? "border-destructive"
                                          : ""
                                      }
                                    />
                                    {editErrors.stock && (
                                      <p className="text-sm text-destructive">
                                        {editErrors.stock}
                                      </p>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-engin">
                                      Associer à un engin *
                                    </Label>
                                    <Select
                                      value={editSelectedEngin}
                                      onValueChange={(value) => {
                                        setEditSelectedEngin(value);
                                        setEditErrors({
                                          ...editErrors,
                                          engin: "",
                                        });
                                      }}
                                    >
                                      <SelectTrigger
                                        className={
                                          editErrors.engin
                                            ? "border-destructive"
                                            : ""
                                        }
                                      >
                                        <SelectValue placeholder="Sélectionner un engin" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">
                                          Aucun engin
                                        </SelectItem>
                                        {engins.map((engin) => (
                                          <SelectItem
                                            key={engin.id}
                                            value={engin.id.toString()}
                                          >
                                            {engin.code} - {engin.designation}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {editErrors.engin && (
                                      <p className="text-sm text-destructive">
                                        {editErrors.engin}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={resetEditForm}
                                  >
                                    Annuler
                                  </Button>
                                </DialogClose>
                                <Button
                                  className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
                                  onClick={handleUpdateFiltre}
                                >
                                  Mettre à jour
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
=======
          {/* Tabs Section */}
          <Card className="shadow-vibrant bg-gradient-card border-0 overflow-hidden animate-fade-in">
            <Tabs defaultValue="filtres" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="filtres" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Maintenance Préventive
                </TabsTrigger>
              </TabsList>

              <TabsContent value="filtres" className="mt-0">
                {/* Search and Add Button */}
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
                      <Input
                        placeholder="Rechercher par référence, type, fabricant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 text-lg border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:shadow-glow"
                      />
                    </div>
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
                      <DialogContent className={`${isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}`}>
                        <DialogHeader>
                          <DialogTitle>Ajouter un Nouveau Filtre</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="designation">Désignation</Label>
                            <Input
                              id="designation"
                              placeholder="ex: Filtre à huile moteur"
                              value={newDesignation}
                              onChange={(e) => {
                                setNewDesignation(e.target.value);
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
                          <div className={`${isMobile ? "grid grid-cols-1" : "grid grid-cols-2"} gap-4`}>
                            <div className="space-y-2">
                              <Label htmlFor="reference">Référence Principale</Label>
                              <Input
                                id="reference"
                                placeholder="ex: HF6177"
                                value={newReference}
                                onChange={(e) => {
                                  setNewReference(e.target.value);
                                  setErrors({ ...errors, reference: "" });
                                }}
                                className={errors.reference ? "border-destructive" : ""}
                              />
                              {errors.reference && (
                                <p className="text-sm text-destructive">
                                  {errors.reference}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="type">Type de Filtre</Label>
                              <Select
                                value={newType}
                                onValueChange={(value) => {
                                  setNewType(value);
                                  setErrors({ ...errors, type: "" });
                                }}
                              >
                                <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                                  <SelectValue placeholder="Sélectionner le type" />
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
                          </div>
                          <div className={`${isMobile ? "grid grid-cols-1" : "grid grid-cols-2"} gap-4`}>
                            <div className="space-y-2">
                              <Label htmlFor="fabricant">Fabricant</Label>
                              <Input
                                id="fabricant"
                                placeholder="ex: Caterpillar, Fleetguard..."
                                value={newFabricant}
                                onChange={(e) => {
                                  setNewFabricant(e.target.value);
                                  setErrors({ ...errors, fabricant: "" });
                                }}
                                className={errors.fabricant ? "border-destructive" : ""}
                              />
                              {errors.fabricant && (
                                <p className="text-sm text-destructive">
                                  {errors.fabricant}
                                </p>
                              )}
                            </div>
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
                                <p className="text-sm text-destructive">{errors.prix}</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stock">Stock Initial</Label>
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
                              <p className="text-sm text-destructive">{errors.stock}</p>
                            )}
                          </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline" className="w-full sm:w-auto">
                              Annuler
                            </Button>
                          </DialogClose>
>>>>>>> a87fe9648a27cc715c1ad5dcd3d4acbd7c996438
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
                </CardContent>

                {/* Filters Grid */}
                <CardHeader className="bg-gradient-rainbow text-white">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                      <Package className="h-6 w-6" />
                    </div>
                    Catalogue des Filtres ({filteredFiltres.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Modern Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFiltres.map((filtre, index) => (
                      <div 
                        key={filtre.id}
                        className="group relative bg-white rounded-2xl p-6 shadow-card hover:shadow-vibrant transition-all duration-500 hover:scale-105 animate-scale-in border border-primary/5 hover:border-primary/20"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Gradient Background Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(filtre.type)}`}>
                                {filtre.type === "Hydraulique" && "🔧"}
                                {filtre.type === "Air" && "💨"}
                                {filtre.type === "Carburant" && "⛽"}
                                {filtre.type === "Huile" && "🛢️"}
                              </div>
                              <div>
                                <Link
                                  to={`/filtres/${filtre.id}`}
                                  className="text-lg font-bold text-primary hover:text-primary-hover transition-colors duration-200 hover:underline"
                                >
                                  {filtre.referencePrincipale}
                                </Link>
                                <Badge 
                                  className={`ml-2 ${getTypeColor(filtre.type)} text-xs animate-pulse`}
                                >
                                  {filtre.type}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={`${getStockStatus(filtre.stock)} animate-pulse`}>
                              {filtre.stock}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                            {filtre.description}
                          </p>

<<<<<<< HEAD
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Fabricant:
                          </span>
                          <p className="font-medium">{filtre.fabricant}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Prix:</span>
                          <p className="font-mono font-medium">
                            {filtre.prix ? filtre.prix.toFixed(2) : "0.00"} DA
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stock:</span>
                          <Badge className={getStockStatus(filtre.stock)}>
                            {filtre.stock} unités
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Engins:</span>
                          <p className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {filtre.enginCompatibles}
                          </p>
=======
                          {/* Manufacturer & Price */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{filtre.fabricant}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-success/10 px-3 py-1 rounded-full">
                              <Euro className="h-4 w-4 text-success" />
                              <span className="font-bold text-success">{filtre.prixUnitaire.toFixed(2)} DA</span>
                            </div>
                          </div>

                          {/* Compatibility References */}
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Références compatibles:</p>
                            <div className="flex flex-wrap gap-1">
                              {filtre.referencesCompatibles.slice(0, 3).map((ref, idx) => (
                                <Badge
                                  key={ref}
                                  variant="outline"
                                  className="text-xs font-mono bg-primary/5 border-primary/20 text-primary"
                                  style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                  {ref}
                                </Badge>
                              ))}
                              {filtre.referencesCompatibles.length > 3 && (
                                <Badge variant="outline" className="text-xs bg-accent/10 border-accent/20 text-accent">
                                  +{filtre.referencesCompatibles.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Engine Compatibility */}
                          <div className="flex items-center gap-2 mb-4 p-2 bg-muted/30 rounded-lg">
                            <Package className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">
                              Compatible avec <span className="font-bold text-primary">{filtre.enginCompatibles}</span> engins
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-accent/10 text-accent border-accent/20 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteFiltre(filtre.id)}
                              className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-105"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
>>>>>>> a87fe9648a27cc715c1ad5dcd3d4acbd7c996438
                        </div>
                      </div>
                    ))}
                  </div>

<<<<<<< HEAD
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {filtre.referencesCompatibles
                              ? filtre.referencesCompatibles.length
                              : 0}{" "}
                            réf.
                          </span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                              >
                                Voir
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Références Compatibles -{" "}
                                  {filtre.referencePrincipale}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-2">
                                {filtre.referencesCompatibles &&
                                  filtre.referencesCompatibles.map(
                                    (ref, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-muted/20 rounded"
                                      >
                                        <span className="font-mono">{ref}</span>
                                        {index === 0 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Principal
                                          </Badge>
                                        )}
                                      </div>
                                    )
                                  )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95%] max-w-none">
                              <DialogHeader>
                                <DialogTitle>
                                  Modifier le filtre -{" "}
                                  {filtre.referencePrincipale}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-ref-mobile">
                                    Référence Principale
                                  </Label>
                                  <Input
                                    id="edit-ref-mobile"
                                    defaultValue={filtre.referencePrincipale}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-type-mobile">Type</Label>
                                  <Select
                                    defaultValue={filtre.type
                                      .toLowerCase()
                                      .replace(" ", "-")}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="huile-moteur">
                                        Huile moteur
                                      </SelectItem>
                                      <SelectItem value="carburant">
                                        Carburant
                                      </SelectItem>
                                      <SelectItem value="air">Air</SelectItem>
                                      <SelectItem value="hydraulique">
                                        Hydraulique
                                      </SelectItem>
                                      <SelectItem value="transmission">
                                        Transmission
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-fabricant-mobile">
                                    Fabricant
                                  </Label>
                                  <Input
                                    id="edit-fabricant-mobile"
                                    defaultValue={filtre.fabricant}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-prix-mobile">
                                    Prix Unitaire (DA)
                                  </Label>
                                  <Input
                                    id="edit-prix-mobile"
                                    type="number"
                                    step="0.01"
                                    defaultValue={filtre.prix}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-stock-mobile">
                                    Stock
                                  </Label>
                                  <Input
                                    id="edit-stock-mobile"
                                    type="number"
                                    defaultValue={filtre.stock}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-engins-mobile">
                                    Engins Compatibles
                                  </Label>
                                  <Input
                                    id="edit-engins-mobile"
                                    type="number"
                                    defaultValue={filtre.enginCompatibles}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description-mobile">
                                    Description
                                  </Label>
                                  <Input
                                    id="edit-description-mobile"
                                    defaultValue={filtre.description}
                                  />
                                </div>
                              </div>
                              <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                  >
                                    Annuler
                                  </Button>
                                </DialogClose>
                                <Button className="bg-primary hover:bg-primary-hover w-full sm:w-auto">
                                  Sauvegarder
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => handleDeleteFiltre(filtre.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
=======
                  {/* Empty State */}
                  {filteredFiltres.length === 0 && (
                    <div className="text-center py-16 animate-fade-in">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-vibrant rounded-full flex items-center justify-center">
                        <Filter className="h-12 w-12 text-white" />
>>>>>>> a87fe9648a27cc715c1ad5dcd3d4acbd7c996438
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Aucun filtre trouvé</h3>
                      <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                    </div>
                  )}
                </CardContent>
              </TabsContent>

              <TabsContent value="maintenance" className="mt-0">
                <MaintenancePreventive />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce filtre ? Cette action est
              irréversible et supprimera toutes les données associées.
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
    </MainLayout>
  );
}