import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveTable,
  MobileCard,
  ResponsiveTableHeader,
  ResponsiveTableBody,
} from "@/components/ui/responsive-table";
import {
  ResponsiveContainer,
  ResponsiveStack,
} from "@/components/ui/responsive-container";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Package,
  Link as LinkIcon,
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
    // Only close the dialog if validation passes
    setDialogOpen(false);
  };

  return (
    <MainLayout>
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
                        <SelectItem value="cabine">Cabine</SelectItem>
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
                    <Label htmlFor="prix">Prix Unitaire (€)</Label>
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

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div
              className={`${
                isMobile ? "flex flex-col space-y-4" : "flex items-center"
              } gap-4`}
            >
              <div className={`${isMobile ? "w-full" : "flex-1"} relative`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par référence, type, fabricant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className={`${isMobile ? "w-full" : "w-48"}`}>
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="hydraulique">Hydraulique</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="carburant">Carburant</SelectItem>
                  <SelectItem value="huile">Huile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Filtres Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Catalogue des Filtres ({filteredFiltres.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fabricant</TableHead>
                    <TableHead>Compatibilités</TableHead>
                    <TableHead>Engins</TableHead>
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
                            {filtre.referencePrincipale}
                          </Link>
                          <div className="text-sm text-muted-foreground max-w-48 truncate">
                            {filtre.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(filtre.type)}>
                          {filtre.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {filtre.fabricant}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {filtre.referencesCompatibles.length} ref.
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
                                {filtre.referencesCompatibles.map(
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
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          {filtre.enginCompatibles}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStockStatus(filtre.stock)}>
                          {filtre.stock} unités
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {filtre.prixUnitaire.toFixed(2)} €
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Modifier le filtre -{" "}
                                  {filtre.referencePrincipale}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-ref">
                                      Référence Principale
                                    </Label>
                                    <Input
                                      id="edit-ref"
                                      defaultValue={filtre.referencePrincipale}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-type">Type</Label>
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
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-fabricant">
                                      Fabricant
                                    </Label>
                                    <Input
                                      id="edit-fabricant"
                                      defaultValue={filtre.fabricant}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-prix">
                                      Prix Unitaire (€)
                                    </Label>
                                    <Input
                                      id="edit-prix"
                                      type="number"
                                      step="0.01"
                                      defaultValue={filtre.prixUnitaire}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-stock">Stock</Label>
                                    <Input
                                      id="edit-stock"
                                      type="number"
                                      defaultValue={filtre.stock}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-engins">
                                      Engins Compatibles
                                    </Label>
                                    <Input
                                      id="edit-engins"
                                      type="number"
                                      defaultValue={filtre.enginCompatibles}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">
                                    Description
                                  </Label>
                                  <Input
                                    id="edit-description"
                                    defaultValue={filtre.description}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Annuler</Button>
                                </DialogClose>
                                <Button className="bg-primary hover:bg-primary-hover">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredFiltres.map((filtre) => (
                <Card key={filtre.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/filtres/${filtre.id}`}
                            className="text-primary hover:text-primary-hover underline-offset-4 hover:underline font-medium font-mono text-lg"
                          >
                            {filtre.referencePrincipale}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {filtre.description}
                          </p>
                        </div>
                        <Badge className={getTypeColor(filtre.type)}>
                          {filtre.type}
                        </Badge>
                      </div>

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
                            {filtre.prixUnitaire.toFixed(2)} €
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
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {filtre.referencesCompatibles.length} réf.
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
                                {filtre.referencesCompatibles.map(
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
                                    Prix Unitaire (€)
                                  </Label>
                                  <Input
                                    id="edit-prix-mobile"
                                    type="number"
                                    step="0.01"
                                    defaultValue={filtre.prixUnitaire}
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
