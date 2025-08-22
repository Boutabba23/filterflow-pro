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

export default function Engins() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - sera remplacé par les données Supabase
  const engins = [
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
  ];

  const filteredEngins = engins.filter(
    (engin) =>
      engin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engin.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engin.marque.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Gestion des Engins
            </h2>
            <p className="text-muted-foreground">
              Gérez votre parc d'engins de chantier
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Engin
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
                    <Input id="code" placeholder="ex: A03010236" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="désignation">Désignation</Label>
                    <Input
                      id="désignation"
                      placeholder="ex: BULL SUR CHENILLE"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marque">Marque</Label>
                    <Input id="marque" placeholder="ex: Caterpillar" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input id="type" placeholder="ex: Caterpillar" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heures">Heures</Label>
                    <Input id="heures" type="number" placeholder="0" />
                  </div>
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

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
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
                <SelectTrigger className="w-48">
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

        {/* Engins Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Liste des Engins ({filteredEngins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                      <div className="flex items-center gap-1">
                        <Link 
                          to={`/engins/${engin.id}`}
                          className="text-primary hover:text-primary-hover underline-offset-4 hover:underline font-medium"
                        >
                          {engin.code}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {engin.désignation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {engin.marque}
                      </div>
                    </TableCell>

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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Modifier l'engin - {engin.code}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-code">Code Engin</Label>
                                  <Input id="edit-code" defaultValue={engin.code} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-modele">Désignation</Label>
                                  <Input id="edit-modele" defaultValue={engin.désignation} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-fabricant">Marque</Label>
                                  <Input id="edit-fabricant" defaultValue={engin.marque} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-annee">Type</Label>
                                  <Input id="edit-annee" defaultValue={engin.type} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-heures">Heures de Service</Label>
                                  <Input id="edit-heures" type="number" defaultValue={engin.heures} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-statut">Statut</Label>
                                  <Select defaultValue={engin.statut.toLowerCase()}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="actif">Actif</SelectItem>
                                      <SelectItem value="maintenance">En Maintenance</SelectItem>
                                      <SelectItem value="inactif">Inactif</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
