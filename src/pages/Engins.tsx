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
  Plus,
  Search,
  Edit3,
  Trash2,
  Wrench,
  Calendar,
  MapPin,
  Clock,
  Filter,
  MoreVertical,
  Eye,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEngins, useCreateEngin, useUpdateEngin, useDeleteEngin } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import type { Engin } from "@/lib/supabase";

export default function Engins() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [currentEngin, setCurrentEngin] = useState<Engin | null>(null);
  const [editFormData, setEditFormData] = useState({
    code: "",
    designation: "",
    marque: "",
    type: "",
    heures: 0,
  });

  const [formData, setFormData] = useState({
    code: "",
    designation: "",
    marque: "",
    type: "",
    heures: 0,
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enginToDelete, setEnginToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: engins = [], isLoading } = useEngins();
  const createEnginMutation = useCreateEngin();
  const updateEnginMutation = useUpdateEngin();
  const deleteEnginMutation = useDeleteEngin();

  const filteredEngins = engins.filter(
    (engin) =>
      engin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engin.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engin.marque.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (engin: Engin) => {
    setCurrentEngin(engin);
    setEditFormData({
      code: engin.code,
      designation: engin.designation,
      marque: engin.marque,
      type: engin.type,
      heures: engin.heures || 0,
    });
    setEditOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = id.replace("edit-", "");
    setEditFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "heures" ? Number(value) : value,
    }));
    setErrors({ ...errors, [id]: "" });
  };

  const handleSaveEdit = async () => {
    if (currentEngin) {
      try {
        await updateEnginMutation.mutateAsync({
          id: currentEngin.id,
          engin: editFormData,
        });
        toast({
          title: "Succès",
          description: "Engin modifié avec succès",
        });
        setEditOpen(false);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la modification",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteEngin = (id: number) => {
    setEnginToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (enginToDelete) {
      try {
        await deleteEnginMutation.mutateAsync(enginToDelete);
        toast({
          title: "Succès",
          description: "Engin supprimé avec succès",
        });
        setDeleteDialogOpen(false);
        setEnginToDelete(null);
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
    if (!formData.code) newErrors.code = "Le code est requis";
    if (!formData.designation) newErrors.designation = "La désignation est requise";
    if (!formData.marque) newErrors.marque = "La marque est requise";
    if (!formData.type) newErrors.type = "Le type est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEngin = async () => {
    if (!validateForm()) return;

    try {
      await createEnginMutation.mutateAsync(formData);
      toast({
        title: "Succès",
        description: "Engin ajouté avec succès",
      });
      setFormData({
        code: "",
        designation: "",
        marque: "",
        type: "",
        heures: 0,
      });
      setAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (engin: Engin) => {
    const hours = engin.heures || 0;
    if (hours > 5000) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Haute utilisation</Badge>;
    } else if (hours > 2000) {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Utilisation normale</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-green-200">Bon état</Badge>;
  };

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
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gestion des Engins</h1>
                <p className="text-white/90">Parc d'équipements et machines</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">{engins.length} engins actifs</span>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher par code, marque, type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Nouvel Engin
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Ajouter un Nouvel Engin
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Code Engin *</Label>
                        <Input
                          id="code"
                          placeholder="Ex: A03010236"
                          value={formData.code}
                          onChange={handleInputChange}
                          className={errors.code ? "border-red-500" : ""}
                        />
                        {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="marque">Marque *</Label>
                        <Input
                          id="marque"
                          placeholder="Ex: Caterpillar"
                          value={formData.marque}
                          onChange={handleInputChange}
                          className={errors.marque ? "border-red-500" : ""}
                        />
                        {errors.marque && <p className="text-red-500 text-sm">{errors.marque}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Input
                          id="type"
                          placeholder="Ex: D8R"
                          value={formData.type}
                          onChange={handleInputChange}
                          className={errors.type ? "border-red-500" : ""}
                        />
                        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="heures">Heures de Service</Label>
                        <Input
                          id="heures"
                          type="number"
                          placeholder="0"
                          value={formData.heures}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Désignation *</Label>
                      <Input
                        id="designation"
                        placeholder="Ex: BULL SUR CHENILLE"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className={errors.designation ? "border-red-500" : ""}
                      />
                      {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button 
                      onClick={handleAddEngin}
                      disabled={createEnginMutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {createEnginMutation.isPending ? "Ajout..." : "Ajouter l'Engin"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Engins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEngins.map((engin) => (
            <Card key={engin.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{engin.code}</CardTitle>
                      <p className="text-gray-600 text-sm">{engin.marque} {engin.type}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">{engin.designation}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {engin.heures || 0}h
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {engin.derniere_maintenance_preventive ? 
                      new Date(engin.derniere_maintenance_preventive).toLocaleDateString('fr-FR') : 
                      'Aucune'
                    }
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {getStatusBadge(engin)}
                  <div className="flex gap-2">
                    <Link to={`/engins/${engin.id}`}>
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3"
                      onClick={() => handleEditClick(engin)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Éditer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteEngin(engin.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEngins.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun engin trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Aucun engin ne correspond à votre recherche." : "Commencez par ajouter votre premier engin."}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setAddDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un Engin
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Modifier l'Engin
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Code Engin</Label>
                  <Input
                    id="edit-code"
                    value={editFormData.code}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-marque">Marque</Label>
                  <Input
                    id="edit-marque"
                    value={editFormData.marque}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Input
                    id="edit-type"
                    value={editFormData.type}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-heures">Heures de Service</Label>
                  <Input
                    id="edit-heures"
                    type="number"
                    value={editFormData.heures}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-designation">Désignation</Label>
                <Input
                  id="edit-designation"
                  value={editFormData.designation}
                  onChange={handleEditInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleSaveEdit}
                disabled={updateEnginMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {updateEnginMutation.isPending ? "Modification..." : "Sauvegarder"}
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
                Êtes-vous sûr de vouloir supprimer cet engin ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteEnginMutation.isPending}
              >
                {deleteEnginMutation.isPending ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}