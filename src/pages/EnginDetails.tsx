import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Wrench,
  Calendar,
  HourglassIcon,
  Filter,
  ExternalLink,
  Plus,
  Euro, // Added for price icon
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Mock data - will be replaced by Supabase data
const initialEnginData = {
  id: 1,
  code: "A03010236",
  désignation: "BULL SUR CHENILLE",
  marque: "Caterpillar",
  type: "D8R",
  heures: 2450,
  derniereMaintenancePréventive: "2024-01-15",
  prochaineMaintenance: "2024-08-15",
  localisation: "Chantier Nord",
  filtres: [
    {
      id: 1,
      référence: "1R-0750",
      type: "Huile",
      fabricant: "Caterpillar",
      prix: 45.5,
      stock: 15,
      position: "Moteur principal",
      fréquence: 250,
      unité: "heures",
      dernierChangement: "2024-01-15",
      prochainChangement: "2024-06-15",
      statut: "OK",
    },
    {
      id: 2,
      référence: "1R-0739",
      type: "Carburant",
      fabricant: "Caterpillar",
      prix: 32.0,
      stock: 8,
      position: "Réservoir principal",
      fréquence: 500,
      unité: "heures",
      dernierChangement: "2024-01-15",
      prochainChangement: "2024-08-15",
      statut: "À changer",
    },
    {
      id: 3,
      référence: "126-1813",
      type: "Air",
      fabricant: "Donaldson",
      prix: 78.9,
      stock: 2,
      position: "Admission air",
      fréquence: 1000,
      unité: "heures",
      dernierChangement: "2023-12-01",
      prochainChangement: "2024-12-01",
      statut: "OK",
    },
  ],
};

const initialNewFilterState = {
  reference: "",
  type: "",
  fabricant: "",
  prix: "",
  stock: "",
};

export default function EnginDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [engin, setEngin] = useState(initialEnginData);
  const [isAddFilterDialogOpen, setIsAddFilterDialogOpen] = useState(false);
  const [newFilter, setNewFilter] = useState(initialNewFilterState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewFilter((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSelectChange = (value: string) => {
    setNewFilter((prev) => ({ ...prev, type: value }));
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newFilter.reference.trim())
      newErrors.reference = "La référence est requise.";
    if (!newFilter.type) newErrors.type = "Le type est requis.";
    if (!newFilter.fabricant.trim())
      newErrors.fabricant = "Le fabricant est requis.";
    if (Number(newFilter.prix) <= 0)
      newErrors.prix = "Le prix doit être positif.";
    if (
      Number(newFilter.stock) < 0 ||
      !Number.isInteger(Number(newFilter.stock))
    )
      newErrors.stock = "Le stock doit être un entier positif.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFilter = () => {
    if (!validateForm()) return;

    const filterToAdd = {
      id: Date.now(),
      référence: newFilter.reference,
      type: newFilter.type,
      fabricant: newFilter.fabricant,
      prix: Number(newFilter.prix),
      stock: Number(newFilter.stock),
      position: "N/A",
      fréquence: 0,
      unité: "heures",
      dernierChangement: new Date().toISOString().split("T")[0],
      prochainChangement: "N/A",
      statut: "OK",
    };

    setEngin((prev) => ({ ...prev, filtres: [...prev.filtres, filterToAdd] }));
    setNewFilter(initialNewFilterState);
    setIsAddFilterDialogOpen(false);
  };

  const getFilterStatusColor = (statut: string) => {
    // ... (status color logic remains the same)
    return "";
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0)
      return "bg-destructive/10 text-destructive border-destructive/20";
    if (stock <= 5) return "bg-warning/10 text-warning border-warning/20";
    return "bg-success/10 text-success border-success/20";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header and Engin Info Card (unchanged) */}
        {/* ... */}

        {/* Filtres OEM */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Filtres OEM ({engin.filtres.length})
              </CardTitle>
              <Dialog
                open={isAddFilterDialogOpen}
                onOpenChange={setIsAddFilterDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Filtre OEM
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ajouter un Filtre OEM</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations pour ajouter un filtre.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reference">Référence OEM</Label>
                        <Input
                          id="reference"
                          placeholder="ex: 1R-0750"
                          value={newFilter.reference}
                          onChange={handleInputChange}
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
                        <Label htmlFor="type">Type</Label>
                        <Select
                          onValueChange={handleSelectChange}
                          value={newFilter.type}
                        >
                          <SelectTrigger
                            className={errors.type ? "border-destructive" : ""}
                          >
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Huile">Huile</SelectItem>
                            <SelectItem value="Carburant">Carburant</SelectItem>
                            <SelectItem value="Hydraulique">
                              Hydraulique
                            </SelectItem>
                            <SelectItem value="Transmission">
                              Transmission
                            </SelectItem>
                            <SelectItem value="Air">Air</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <p className="text-sm text-destructive">
                            {errors.type}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fabricant">Fabricant</Label>
                        <Input
                          id="fabricant"
                          placeholder="ex: Caterpillar"
                          value={newFilter.fabricant}
                          onChange={handleInputChange}
                          className={
                            errors.fabricant ? "border-destructive" : ""
                          }
                        />
                        {errors.fabricant && (
                          <p className="text-sm text-destructive">
                            {errors.fabricant}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prix">Prix OEM (€)</Label>
                        <Input
                          id="prix"
                          type="number"
                          placeholder="0.00"
                          value={newFilter.prix}
                          onChange={handleInputChange}
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
                          value={newFilter.stock}
                          onChange={handleInputChange}
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
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddFilterDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button onClick={handleAddFilter}>Ajouter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence OEM</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fabricant</TableHead>
                    <TableHead>Prix OEM</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {engin.filtres.map((filtre) => (
                    <TableRow key={filtre.id}>
                      <TableCell>
                        <Link
                          to={`/filtres/${filtre.id}`}
                          className="text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                        >
                          {filtre.référence}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{filtre.type}</Badge>
                      </TableCell>
                      <TableCell>{filtre.fabricant}</TableCell>
                      <TableCell className="font-mono">
                        {filtre.prix.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStockStatusColor(filtre.stock)}
                        >
                          {filtre.stock} unités
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/filtres/${filtre.id}`}>Détails</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {engin.filtres.map((filtre) => (
                <Card key={filtre.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-base mb-1">
                          <Link
                            to={`/filtres/${filtre.id}`}
                            className="text-primary hover:text-primary-hover flex items-center gap-1"
                          >
                            {filtre.référence}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </CardTitle>
                        <Badge variant="outline">{filtre.type}</Badge>
                      </div>
                      <Badge className={getStockStatusColor(filtre.stock)}>
                        {filtre.stock} en stock
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fabricant</span>
                      <span className="font-medium">{filtre.fabricant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix OEM</span>
                      <span className="font-mono font-semibold">
                        {filtre.prix.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Dernier changement
                      </span>
                      <span>
                        {new Date(filtre.dernierChangement).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link to={`/filtres/${filtre.id}`}>Voir les détails</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
