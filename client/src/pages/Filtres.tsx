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
  Edit3,
  Trash2,
  Filter,
  Package,
  Building2,
  Euro,
  Wrench,
  TrendingUp,
  Eye,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
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
import { MaintenancePreventive } from "@/components/maintenance/MaintenancePreventive";
import { useFiltres, useCreateFiltre, useDeleteFiltre } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import type { Filtre } from "@shared/schema";

export default function Filtres() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
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

  const { data: filtres = [], isLoading } = useFiltres();
  const createFiltreMutation = useCreateFiltre();
  const deleteFiltreMutation = useDeleteFiltre();

  const filteredFiltres = filtres.filter(
    (filtre) =>
      filtre.reference_principale
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      filtre.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filtre.fabricant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteFiltre = (id: number) => {
    setFiltreToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (filtreToDelete) {
      try {
        await deleteFiltreMutation.mutateAsync(filtreToDelete);
        toast({
          title: "Succès",
          description: "Filtre supprimé avec succès",
        });
        setDeleteDialogOpen(false);
        setFiltreToDelete(null);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newReference) newErrors.reference = "La référence est requise";
    if (!newType) newErrors.type = "Le type est requis";
    if (!newFabricant) newErrors.fabricant = "Le fabricant est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFiltre = async () => {
    if (!validateForm()) return;

    try {
      await createFiltreMutation.mutateAsync({
        reference_principale: newReference,
        type: newType,
        fabricant: newFabricant,
        designation: newDesignation || null,
        prix: newPrix ? Math.round(parseFloat(newPrix) * 100) : null, // Convert to cents
        stock: newStock ? parseInt(newStock) : null,
      });

      toast({
        title: "Succès",
        description: "Filtre ajouté avec succès",
      });

      // Reset form
      setNewReference("");
      setNewType("");
      setNewFabricant("");
      setNewDesignation("");
      setNewPrix("");
      setNewStock("");
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (stock: number | null) => {
    if (!stock || stock === 0) {
      return { badge: <Badge className="bg-red-100 text-red-700 border-red-200">Rupture</Badge>, icon: AlertTriangle };
    } else if (stock < 5) {
      return { badge: <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Stock bas</Badge>, icon: AlertTriangle };
    }
    return { badge: <Badge className="bg-green-100 text-green-700 border-green-200">En stock</Badge>, icon: CheckCircle };
  };

  const formatPrice = (priceInCents: number | null) => {
    if (!priceInCents) return "N/A";
    return `${(priceInCents / 100).toFixed(2)}€`;
  };

  const totalValue = filtres.reduce((sum, filtre) => {
    const price = filtre.prix || 0;
    const stock = filtre.stock || 0;
    return sum + (price * stock);
  }, 0);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Catalogue des Filtres</h1>
                <p className="text-white/90">Gestion des pièces et composants</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="text-center">
                <div className="text-2xl font-bold">{filtres.length}</div>
                <div className="text-sm">Références</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
                <div className="text-sm">Valeur stock</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="catalogue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="catalogue" className="rounded-lg font-medium">
              Catalogue des Filtres
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="rounded-lg font-medium">
              Maintenance Préventive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalogue" className="space-y-6">
            {/* Search and Actions */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Rechercher par référence, type, fabricant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-gray-200 focus:border-emerald-500 rounded-xl"
                    />
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
                        <Plus className="h-5 w-5 mr-2" />
                        Nouveau Filtre
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Plus className="h-5 w-5" />
                          Ajouter un Nouveau Filtre
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="reference">Référence Principale *</Label>
                            <Input
                              id="reference"
                              placeholder="Ex: HF6177"
                              value={newReference}
                              onChange={(e) => setNewReference(e.target.value)}
                              className={errors.reference ? "border-red-500" : ""}
                            />
                            {errors.reference && <p className="text-red-500 text-sm">{errors.reference}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select value={newType} onValueChange={setNewType}>
                              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                                <SelectValue placeholder="Sélectionner le type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Hydraulique">Hydraulique</SelectItem>
                                <SelectItem value="Air">Air</SelectItem>
                                <SelectItem value="Carburant">Carburant</SelectItem>
                                <SelectItem value="Huile">Huile</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fabricant">Fabricant *</Label>
                            <Input
                              id="fabricant"
                              placeholder="Ex: Caterpillar"
                              value={newFabricant}
                              onChange={(e) => setNewFabricant(e.target.value)}
                              className={errors.fabricant ? "border-red-500" : ""}
                            />
                            {errors.fabricant && <p className="text-red-500 text-sm">{errors.fabricant}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="prix">Prix Unitaire (€)</Label>
                            <Input
                              id="prix"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newPrix}
                              onChange={(e) => setNewPrix(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="stock">Stock Initial</Label>
                            <Input
                              id="stock"
                              type="number"
                              placeholder="0"
                              value={newStock}
                              onChange={(e) => setNewStock(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="designation">Description</Label>
                            <Input
                              id="designation"
                              placeholder="Description détaillée"
                              value={newDesignation}
                              onChange={(e) => setNewDesignation(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button 
                          onClick={handleAddFiltre}
                          disabled={createFiltreMutation.isPending}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600"
                        >
                          {createFiltreMutation.isPending ? "Ajout..." : "Ajouter le Filtre"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Filtres Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiltres.map((filtre) => {
                const stockStatus = getStockStatus(filtre.stock);
                const StockIcon = stockStatus.icon;
                
                return (
                  <Card key={filtre.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <Filter className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-gray-900">{filtre.reference_principale}</CardTitle>
                            <p className="text-gray-600 text-sm">{filtre.fabricant}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Badge className="mb-2 bg-blue-100 text-blue-700 border-blue-200">{filtre.type}</Badge>
                        {filtre.designation && (
                          <p className="text-sm text-gray-600">{filtre.designation}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{formatPrice(filtre.prix)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>{filtre.stock || 0} unités</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StockIcon className="h-4 w-4" />
                          {stockStatus.badge}
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/filtres/${filtre.id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-3">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteFiltre(filtre.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredFiltres.length === 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun filtre trouvé</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Aucun filtre ne correspond à votre recherche." : "Commencez par ajouter votre premier filtre."}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => setDialogOpen(true)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un Filtre
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="maintenance">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Wrench className="h-6 w-6 text-purple-600" />
                  Maintenance Préventive
                </CardTitle>
              </CardHeader>
              <MaintenancePreventive />
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce filtre ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteFiltreMutation.isPending}
              >
                {deleteFiltreMutation.isPending ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}