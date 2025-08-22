import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState } from "react";

export default function FilterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - sera remplacé par les données Supabase
  const filtre = {
    id: 1,
    référenceOEM: "1R-0750",
    type: "Huile moteur",
    fabricant: "Caterpillar",
    prix: 45.80,
    description: "Filtre à huile moteur haute performance pour engins Caterpillar",
    stock: 25,
    crossFilters: [
      {
        id: 1,
        référence: "HF6177",
        fabricant: "Fleetguard",
        prix: 38.50,
        stock: 12,
        fiabilité: "Haute",
        delaiLivraison: "24-48h",
      },
      {
        id: 2,
        référence: "P551712",
        fabricant: "Donaldson",
        prix: 42.20,
        stock: 8,
        fiabilité: "Haute",
        delaiLivraison: "48-72h",
      },
      {
        id: 3,
        référence: "WP928/80",
        fabricant: "Mann Filter",
        prix: 35.90,
        stock: 15,
        fiabilité: "Moyenne",
        delaiLivraison: "3-5 jours",
      },
      {
        id: 4,
        référence: "OC974",
        fabricant: "Mahle",
        prix: 40.75,
        stock: 20,
        fiabilité: "Haute",
        delaiLivraison: "24-48h",
      },
    ],
  };

  const filteredCrossFilters = filtre.crossFilters.filter(
    (cross) =>
      cross.référence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cross.fabricant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return "bg-destructive/10 text-destructive border-destructive/20";
    if (stock <= 10) return "bg-warning/10 text-warning border-warning/20";
    return "bg-success/10 text-success border-success/20";
  };

  const getFiabiliteColor = (fiabilité: string) => {
    switch (fiabilité) {
      case "Haute":
        return "bg-success/10 text-success border-success/20";
      case "Moyenne":
        return "bg-warning/10 text-warning border-warning/20";
      case "Faible":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/filtres")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Détails du Filtre - {filtre.référenceOEM}
            </h2>
            <p className="text-muted-foreground">
              Référence OEM et équivalences
            </p>
          </div>
        </div>

        {/* Filtre OEM Information Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Informations Filtre OEM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Référence OEM</p>
                <p className="font-semibold text-lg">{filtre.référenceOEM}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="outline" className="border-primary/20 text-primary">
                  {filtre.type}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Fabricant</p>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{filtre.fabricant}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Prix OEM</p>
                <div className="flex items-center gap-1">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-semibold text-lg">
                    {filtre.prix.toFixed(2)} €
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Stock</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className={getStockStatus(filtre.stock)}>
                    {filtre.stock} unités
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{filtre.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cross Filters Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Références Équivalentes ({filteredCrossFilters.length})
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-hover">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Équivalence
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nouvelle Référence Équivalente</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="référence">Référence</Label>
                      <Input id="référence" placeholder="ex: HF6177" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fabricant">Fabricant</Label>
                      <Input id="fabricant" placeholder="ex: Fleetguard" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prix">Prix (€)</Label>
                      <Input id="prix" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input id="stock" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delai">Délai de Livraison</Label>
                      <Input id="delai" placeholder="ex: 24-48h" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Annuler</Button>
                    <Button className="bg-primary hover:bg-primary-hover">
                      Ajouter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <Input
                placeholder="Rechercher par référence ou fabricant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Cross Filters Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Fabricant</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Économie</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Fiabilité</TableHead>
                  <TableHead>Délai</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCrossFilters.map((cross) => {
                  const économie = filtre.prix - cross.prix;
                  const économiePourcentage = ((économie / filtre.prix) * 100).toFixed(1);
                  
                  return (
                    <TableRow key={cross.id}>
                      <TableCell className="font-mono font-medium">
                        {cross.référence}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          {cross.fabricant}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Euro className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono">
                            {cross.prix.toFixed(2)} €
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {économie > 0 ? (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            -{économie.toFixed(2)}€ (-{économiePourcentage}%)
                          </Badge>
                        ) : économie < 0 ? (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            +{Math.abs(économie).toFixed(2)}€ (+{Math.abs(Number(économiePourcentage))}%)
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Même prix
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStockStatus(cross.stock)}>
                          {cross.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getFiabiliteColor(cross.fiabilité)}
                        >
                          {cross.fiabilité}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cross.delaiLivraison}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Modifier la référence - {cross.référence}</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-cross-ref">Référence</Label>
                                  <Input id="edit-cross-ref" defaultValue={cross.référence} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-cross-fabricant">Fabricant</Label>
                                  <Input id="edit-cross-fabricant" defaultValue={cross.fabricant} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-cross-prix">Prix (€)</Label>
                                  <Input id="edit-cross-prix" type="number" step="0.01" defaultValue={cross.prix} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-cross-stock">Stock</Label>
                                  <Input id="edit-cross-stock" type="number" defaultValue={cross.stock} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-cross-delai">Délai de Livraison</Label>
                                  <Input id="edit-cross-delai" defaultValue={cross.delaiLivraison} />
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">Annuler</Button>
                                <Button className="bg-primary hover:bg-primary-hover">
                                  Sauvegarder
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/20 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}