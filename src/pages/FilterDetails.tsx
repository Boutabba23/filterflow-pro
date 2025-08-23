import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  ArrowLeft,
  Filter,
  Plus,
  Edit,
  Trash2,
  Package,
  Euro,
  Building2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
import {
  DatabaseCrossReference,
  DatabaseFiltre,
  supabase,
} from "@/lib/database";
import { toast } from "@/components/ui/use-toast";
import {
  createCrossReference,
  deleteCrossReference,
  fetchCrossReferences,
  fetchFiltreById,
} from "@/lib/database-utils";

export default function FilterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [crossFilterToDelete, setCrossFilterToDelete] = useState<number | null>(
    null
  );
  const [newCrossReference, setNewCrossReference] = useState("");
  const [newCrossFabricant, setNewCrossFabricant] = useState("");
  const [newCrossPrix, setNewCrossPrix] = useState("");
  const [newCrossStock, setNewCrossStock] = useState("");
  const [crossErrors, setCrossErrors] = useState<Record<string, string>>({});
  const [editingCrossFilter, setEditingCrossFilter] = useState<any | null>(
    null
  );
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtre, setFiltre] = useState<DatabaseFiltre | null>(null);
  const [crossFilters, setCrossFilters] = useState<DatabaseCrossReference[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount and when id changes
  useEffect(() => {
    if (id) {
      fetchFiltreDetails();
    }
  }, [id]);

  const fetchFiltreDetails = async () => {
    try {
      // Fetch main filter
      const filtreData = await fetchFiltreById(Number(id));
      setFiltre(filtreData);

      // Fetch cross references
      const crossData = await fetchCrossReferences(Number(id));
      setCrossFilters(crossData);
    } catch (error) {
      console.error("Error fetching filtre details:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du filtre",
        variant: "destructive",
      });
      navigate("/filtres");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCrossFilter = (id: number) => {
    setCrossFilterToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Update confirmDeleteCrossFilter
  const confirmDeleteCrossFilter = async () => {
    if (crossFilterToDelete === null) return;

    try {
      await deleteCrossReference(crossFilterToDelete);

      setCrossFilters((prev) =>
        prev.filter((f) => f.id !== crossFilterToDelete)
      );
      setCrossFilterToDelete(null);
      setDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "La référence croisée a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting cross reference:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la référence croisée",
        variant: "destructive",
      });
    }
  };
  const cancelDeleteCrossFilter = () => {
    setCrossFilterToDelete(null);
    setDeleteDialogOpen(false);
  };

  const validateCrossForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newCrossReference.trim()) {
      newErrors.reference = "La référence est requise";
    }
    if (!newCrossFabricant.trim()) {
      newErrors.fabricant = "Le fabricant est requis";
    }
    if (!newCrossPrix.trim()) {
      newErrors.prix = "Le prix est requis";
    } else if (isNaN(Number(newCrossPrix)) || Number(newCrossPrix) < 0) {
      newErrors.prix = "Le prix doit être un nombre positif";
    }
    if (!newCrossStock.trim()) {
      newErrors.stock = "Le stock est requis";
    } else if (
      isNaN(Number(newCrossStock)) ||
      Number(newCrossStock) < 0 ||
      !Number.isInteger(Number(newCrossStock))
    ) {
      newErrors.stock = "Le stock doit être un entier positif";
    }

    setCrossErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Update handleAddCrossFilter
  const handleAddCrossFilter = async () => {
    if (!validateCrossForm() || !filtre) return;

    try {
      const newCrossRef = await createCrossReference({
        filtre_id: filtre.id,
        reference: newCrossReference.trim(),
        fabricant: newCrossFabricant.trim(),
        prix: Number(newCrossPrix),
        stock: Number(newCrossStock),
      });

      setCrossFilters((prev) => [newCrossRef, ...prev]);
      resetCrossForm();
      toast({
        title: "Succès",
        description: "La référence croisée a été ajoutée avec succès",
      });
    } catch (error) {
      console.error("Error adding cross reference:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la référence croisée",
        variant: "destructive",
      });
    }
  };
  const resetCrossForm = () => {
    setNewCrossReference("");
    setNewCrossFabricant("");
    setNewCrossPrix("");
    setNewCrossStock("");
    setCrossErrors({});
    setIsDialogOpen(false);
  };

  const validateEditForm = (formData: Record<string, any>) => {
    const errors: Record<string, string> = {};

    if (!formData.reference?.trim()) {
      errors.reference = "La référence est requise";
    }
    if (!formData.fabricant?.trim()) {
      errors.fabricant = "Le fabricant est requis";
    }
    if (formData.prix === "" || formData.prix === null) {
      errors.prix = "Le prix est requis";
    } else if (isNaN(Number(formData.prix)) || Number(formData.prix) <= 0) {
      errors.prix = "Le prix doit être un nombre positif";
    }
    if (formData.stock === "" || formData.stock === null) {
      errors.stock = "Le stock est requis";
    } else if (
      isNaN(Number(formData.stock)) ||
      Number(formData.stock) < 0 ||
      !Number.isInteger(Number(formData.stock))
    ) {
      errors.stock = "Le stock doit être un entier positif ou zéro";
    }
    return errors;
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingCrossFilter.id,
      reference: formData.get("reference") as string,
      fabricant: formData.get("fabricant") as string,
      prix: Number(formData.get("prix")),
      stock: Number(formData.get("stock")),
    };

    const errors = validateEditForm(data);
    if (Object.keys(errors).length === 0) {
      setCrossFilters(
        crossFilters.map((cf) => (cf.id === data.id ? data : cf))
      );
      setEditingCrossFilter(null);
      setEditErrors({});
    } else {
      setEditErrors(errors);
    }
  };

  const filteredCrossFilters = crossFilters.filter(
    (cross) =>
      (cross.reference &&
        cross.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cross.fabricant &&
        cross.fabricant.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStockStatus = (stock: number) => {
    if (stock <= 5)
      return "bg-destructive/10 text-destructive border-destructive/20";
    if (stock <= 10) return "bg-warning/10 text-warning border-warning/20";
    return "bg-success/10 text-success border-success/20";
  };

  if (!filtre) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Filtre non trouvé
            </h2>
            <p className="text-muted-foreground mb-4">
              Le filtre demandé n'existe pas.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/filtres")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux filtres
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Extracted Edit Dialog Content to avoid repetition
  const editDialogContent = (cross: any) => (
    <form className="px-2 sm:px-0" onSubmit={handleSaveEdit}>
      <div className="grid gap-4 py-4 px-2 sm:px-0">
        <div className="space-y-2">
          <Label htmlFor="edit-cross-ref">Référence</Label>
          <Input
            id="edit-cross-ref"
            name="reference"
            defaultValue={cross.reference}
            className={editErrors.reference ? "border-destructive" : ""}
            onChange={() => setEditErrors({ ...editErrors, reference: "" })}
          />
          {editErrors.reference && (
            <p className="text-sm text-destructive">{editErrors.reference}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-cross-fabricant">Fabricant</Label>
          <Input
            id="edit-cross-fabricant"
            name="fabricant"
            defaultValue={cross.fabricant}
            className={editErrors.fabricant ? "border-destructive" : ""}
            onChange={() => setEditErrors({ ...editErrors, fabricant: "" })}
          />
          {editErrors.fabricant && (
            <p className="text-sm text-destructive">{editErrors.fabricant}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-cross-prix">Prix (DA)</Label>
          <Input
            id="edit-cross-prix"
            name="prix"
            type="number"
            step="0.01"
            defaultValue={cross.prix}
            className={editErrors.prix ? "border-destructive" : ""}
            onChange={() => setEditErrors({ ...editErrors, prix: "" })}
          />
          {editErrors.prix && (
            <p className="text-sm text-destructive">{editErrors.prix}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-cross-stock">Stock</Label>
          <Input
            id="edit-cross-stock"
            name="stock"
            type="number"
            defaultValue={cross.stock}
            className={editErrors.stock ? "border-destructive" : ""}
            onChange={() => setEditErrors({ ...editErrors, stock: "" })}
          />
          {editErrors.stock && (
            <p className="text-sm text-destructive">{editErrors.stock}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setEditingCrossFilter(null);
              setEditErrors({});
            }}
          >
            Annuler
          </Button>
        </DialogClose>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover"
        >
          Sauvegarder
        </Button>
      </div>
    </form>
  );

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/filtres")}
            className="flex items-center gap-2 w-full sm:w-auto justify-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Détails du Filtre - {filtre?.reference_principale || "Non trouvé"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Référence OEM et équivalences
            </p>
          </div>
        </div>

        {/* Filtre OEM Information Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Informations Filtre OEM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2 p-2 sm:p-0 rounded-lg bg-card/50">
                <p className="text-sm text-muted-foreground">Référence OEM</p>
                <p className="font-semibold text-lg break-all">
                  {filtre?.reference_principale}
                </p>
              </div>
              <div className="space-y-2 p-2 sm:p-0 rounded-lg bg-card/50">
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge
                  variant="outline"
                  className="border-primary/20 text-primary"
                >
                  {filtre?.type}
                </Badge>
              </div>
              <div className="space-y-2 p-2 sm:p-0 rounded-lg bg-card/50">
                <p className="text-sm text-muted-foreground">Fabricant</p>
                <div className="flex items-center gap-1">
                  <span className="font-medium truncate">
                    {filtre?.fabricant}
                  </span>
                </div>
              </div>
              <div className="space-y-2 p-2 sm:p-0 rounded-lg bg-card/50">
                <p className="text-sm text-muted-foreground">Prix OEM</p>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-semibold text-lg">
                    {filtre?.prix?.toFixed(2)} DA
                  </span>
                </div>
              </div>
              <div className="space-y-2 p-2 sm:p-0 rounded-lg bg-card/50">
                <p className="text-sm text-muted-foreground">Stock</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getStockStatus(filtre?.stock || 0)}
                  >
                    {filtre?.stock} unités
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cross Filters Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="flex items-center gap-3">
                <span>Références Équivalentes</span>
                <span className="block  text-primary">
                  ({filteredCrossFilters.length})
                </span>
              </CardTitle>
              <div className="w-full sm:w-auto ">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full sm:w-auto bg-primary hover:bg-primary-hover"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">
                        Ajouter Équivalence
                      </span>
                      <span className="sm:hidden">Ajouter</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">
                        Nouvelle Référence Équivalente
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        Ajoutez une référence équivalente pour ce filtre.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 px-2 sm:px-0">
                      <div className="space-y-2">
                        <Label htmlFor="reference">Référence</Label>
                        <Input
                          id="reference"
                          placeholder="ex: HF6177"
                          value={newCrossReference}
                          onChange={(e) => {
                            setNewCrossReference(e.target.value);
                            setCrossErrors({ ...crossErrors, reference: "" });
                          }}
                          className={
                            crossErrors.reference ? "border-destructive" : ""
                          }
                        />
                        {crossErrors.reference && (
                          <p className="text-sm text-destructive">
                            {crossErrors.reference}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fabricant">Fabricant</Label>
                        <Input
                          id="fabricant"
                          placeholder="ex: Fleetguard"
                          value={newCrossFabricant}
                          onChange={(e) => {
                            setNewCrossFabricant(e.target.value);
                            setCrossErrors({ ...crossErrors, fabricant: "" });
                          }}
                          className={
                            crossErrors.fabricant ? "border-destructive" : ""
                          }
                        />
                        {crossErrors.fabricant && (
                          <p className="text-sm text-destructive">
                            {crossErrors.fabricant}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prix">Prix (DA)</Label>
                        <Input
                          id="prix"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newCrossPrix}
                          onChange={(e) => {
                            setNewCrossPrix(e.target.value);
                            setCrossErrors({ ...crossErrors, prix: "" });
                          }}
                          className={
                            crossErrors.prix ? "border-destructive" : ""
                          }
                        />
                        {crossErrors.prix && (
                          <p className="text-sm text-destructive">
                            {crossErrors.prix}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          placeholder="0"
                          value={newCrossStock}
                          onChange={(e) => {
                            setNewCrossStock(e.target.value);
                            setCrossErrors({ ...crossErrors, stock: "" });
                          }}
                          className={
                            crossErrors.stock ? "border-destructive" : ""
                          }
                        />
                        {crossErrors.stock && (
                          <p className="text-sm text-destructive">
                            {crossErrors.stock}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetCrossForm}>
                        Annuler
                      </Button>
                      <Button
                        className="bg-primary hover:bg-primary-hover"
                        onClick={handleAddCrossFilter}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <Input
                placeholder="Rechercher par référence ou fabricant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-full sm:max-w-md"
              />
            </div>

            {/* Desktop Table - Hidden on smaller screens */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Référence</TableHead>
                    <TableHead className="w-[25%]">Fabricant</TableHead>
                    <TableHead className="w-[15%]">Prix</TableHead>
                    <TableHead className="w-[15%]">Stock</TableHead>
                    <TableHead className="w-[25%] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCrossFilters.map((cross) => (
                    <TableRow key={cross.id}>
                      <TableCell className="font-mono font-medium">
                        {cross.reference}
                      </TableCell>
                      <TableCell>{cross.fabricant}</TableCell>
                      <TableCell className="font-mono">
                        {cross.prix.toFixed(2)} DA
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStockStatus(cross.stock)}
                        >
                          {cross.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={editingCrossFilter?.id === cross.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                setEditingCrossFilter(null);
                                setEditErrors({});
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingCrossFilter(cross)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="text-lg sm:text-xl">
                                  Modifier - {cross.reference}
                                </DialogTitle>
                              </DialogHeader>
                              {editDialogContent(cross)}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => handleDeleteCrossFilter(cross.id)}
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

            {/* Mobile Cards - Hidden on medium and larger screens */}
            <div className="md:hidden space-y-4">
              {filteredCrossFilters.map((cross) => (
                <Card key={cross.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-base font-mono">
                          {cross.reference}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {cross.fabricant}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={getStockStatus(cross.stock)}
                      >
                        Stock: {cross.stock}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Prix</span>
                      <span className="font-semibold font-mono">
                        {cross.prix.toFixed(2)} DA
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Dialog
                      open={editingCrossFilter?.id === cross.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingCrossFilter(null);
                          setEditErrors({});
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingCrossFilter(cross)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Modifier - {cross.reference}
                          </DialogTitle>
                        </DialogHeader>
                        {editDialogContent(cross)}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={() => handleDeleteCrossFilter(cross.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md sm:max-w-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Êtes-vous sûr de vouloir supprimer cette référence équivalente ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
            <AlertDialogCancel
              onClick={cancelDeleteCrossFilter}
              className="w-full sm:w-auto"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCrossFilter}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive-hover"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
