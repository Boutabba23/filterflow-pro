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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Wrench,
  Calendar,
  MapPin,
  HourglassIcon,
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
import { EnginCard } from "@/components/engins/EnginCard";

export default function Engins() {
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

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enginToDelete, setEnginToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - sera remplacé par les données Supabase
  const [engins, setEngins] = useState([
    {
      id: 1,
      code: "A03010236",
      désignation: "BULL SUR CHENILLE",
      marque: "Caterpillar",
      type: "D8R",
      heures: 2450,
      statut: "Actif",
      derniereMaintenancePréventive: "2024-01-15",
    },
    {
      id: 2,
      code: "A01020672",
      désignation: "PELLE SUR CHENILLE",
      marque: "LIBHERR",
      type: "R944CL",
      heures: 5450,
      statut: "Actif",
      derniereMaintenancePréventive: "2024-04-15",
    },
  ]);

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
    // Clear error when user starts typing
    setErrors({ ...errors, [id]: "" });
  };

  const handleSaveEdit = () => {
    if (currentEngin) {
      const updatedEngins = engins.map((engin) =>
        engin.id === currentEngin.id
          ? {
              ...engin,
              code: editFormData.code,
              désignation: editFormData.désignation,
              marque: editFormData.marque,
              type: editFormData.type,
              heures: Number(editFormData.heures),
            }
          : engin
      );
      setEngins(updatedEngins);
      setEditOpen(false);
    }
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

  const handleAddEngin = () => {
    if (!validateForm()) return;

    const newEngin = {
      id: engins.length > 0 ? Math.max(...engins.map((e) => e.id)) + 1 : 1,
      code: formData.code,
      désignation: formData.désignation,
      marque: formData.marque,
      type: formData.type,
      heures: Number(formData.heures),
      statut: "Actif",
      derniereMaintenancePréventive: new Date().toISOString().split("T")[0],
    };

    setEngins([...engins, newEngin]);
    setFormData({
      code: "",
      désignation: "",
      marque: "",
      type: "",
      heures: 0,
    });
    setErrors({});
    setAddDialogOpen(false);
  };

  const handleDeleteEngin = (id: number) => {
    setEnginToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEngin = () => {
    if (enginToDelete !== null) {
      setEngins(engins.filter((engin) => engin.id !== enginToDelete));
      setEnginToDelete(null);
      setDeleteDialogOpen(false);
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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Gestion des Engins
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gérez votre parc d'engins de chantier
            </p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nouvel Engin</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouvel Engin</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
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
                      <p className="text-sm text-destructive">{errors.code}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="désignation">Désignation</Label>
                    <Input
                      id="désignation"
                      placeholder="ex: BULL SUR CHENILLE"
                      value={formData.désignation}
                      onChange={handleInputChange}
                      className={errors.désignation ? "border-destructive" : ""}
                    />
                    {errors.désignation && (
                      <p className="text-sm text-destructive">
                        {errors.désignation}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                      <p className="text-sm text-destructive">{errors.type}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-hover"
                  onClick={handleAddEngin}
                >
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par modèle, type ou fabricant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reparation">Réparation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Engins List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Liste des Engins ({filteredEngins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Désignation</TableHead>
                      <TableHead>Marque</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Heures</TableHead>
                      <TableHead>Dernière Maintenance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEngins.map((engin) => (
                      <TableRow key={engin.id}>
                        <TableCell>
                          <Link
                            to={`/engins/${engin.id}`}
                            className="text-primary hover:text-primary-hover underline-offset-4 hover:underline font-medium"
                          >
                            {engin.code}
                          </Link>
                        </TableCell>
                        <TableCell>{engin.désignation}</TableCell>
                        <TableCell>{engin.marque}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-primary/20 text-primary"
                          >
                            {engin.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          <div className="flex items-center gap-1">
                            <HourglassIcon className="h-3 w-3 text-muted-foreground" />
                            {engin.heures.toLocaleString()}h
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(
                              engin.derniereMaintenancePréventive
                            ).toLocaleDateString("fr-FR")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog
                              open={currentEngin?.id === engin.id && editOpen}
                              onOpenChange={(open) =>
                                !open && setEditOpen(false)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditClick(engin)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Modifier l'engin - {currentEngin?.code}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-code">
                                        Code Engin
                                      </Label>
                                      <Input
                                        id="edit-code"
                                        value={editFormData.code}
                                        onChange={handleEditInputChange}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-désignation">
                                        Désignation
                                      </Label>
                                      <Input
                                        id="edit-désignation"
                                        value={editFormData.désignation}
                                        onChange={handleEditInputChange}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-marque">
                                        Marque
                                      </Label>
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
                                    <Label htmlFor="edit-heures">
                                      Heures de Service
                                    </Label>
                                    <Input
                                      id="edit-heures"
                                      type="number"
                                      value={editFormData.heures}
                                      onChange={handleEditInputChange}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={() => setEditOpen(false)}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
                                    onClick={handleSaveEdit}
                                  >
                                    Sauvegarder
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive/20 hover:bg-destructive/10"
                              onClick={() => handleDeleteEngin(engin.id)}
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
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredEngins.map((engin) => (
                <EnginCard
                  key={engin.id}
                  engin={engin}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteEngin}
                />
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
