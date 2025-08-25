import { MainLayout } from "@/components/layout/MainLayout";
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
} from "lucide-react";
import { useState } from "react";
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

  // Mock data - sera remplacé par les données Supabase
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

  const filteredFiltres = filtres.filter(
    (filtre) =>
      filtre.referencePrincipale
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      filtre.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filtre.fabricant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filtre.referencesCompatibles.some((ref) =>
        ref.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleDeleteFiltre = (id: number) => {
    setFiltreToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFiltre = () => {
    if (filtreToDelete !== null) {
      setFiltres(filtres.filter((filtre) => filtre.id !== filtreToDelete));
      setFiltreToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const cancelDeleteFiltre = () => {
    setFiltreToDelete(null);
    setDeleteDialogOpen(false);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newReference.trim()) {
      newErrors.reference = "La référence est requise";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFiltre = () => {
    if (!validateForm()) return;

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
      description: newDesignation.trim(),
      referencesCompatibles: [] as string[],
      enginCompatibles: 0,
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
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="space-y-8">
          {/* Animated Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-header p-8 shadow-glow animate-fade-in">
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce-in">
                <Filter className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in">
                Gestion des Filtres
              </h1>
              <p className="text-white/90 text-lg mb-6 animate-slide-in">
                Gérez vos références de filtres et compatibilités
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-vibrant animate-scale-in"
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

          {/* Animated Search Section */}
          <Card className="shadow-vibrant bg-gradient-card border-0 overflow-hidden animate-fade-in">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
                  <Input
                    placeholder="Rechercher par référence, type, fabricant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:shadow-glow"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full lg:w-56 h-12 border-accent/20 focus:border-accent hover:shadow-vibrant transition-all duration-300">
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-card">
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="hydraulique">🔧 Hydraulique</SelectItem>
                    <SelectItem value="air">💨 Air</SelectItem>
                    <SelectItem value="carburant">⛽ Carburant</SelectItem>
                    <SelectItem value="huile">🛢️ Huile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Animated Filters Grid */}
          <Card className="shadow-glow bg-gradient-card border-0 overflow-hidden animate-fade-in">
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredFiltres.length === 0 && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-vibrant rounded-full flex items-center justify-center">
                    <Filter className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Aucun filtre trouvé</h3>
                  <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </CardContent>
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