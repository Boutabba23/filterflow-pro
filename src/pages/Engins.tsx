import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Wrench, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

export default function Engins() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - sera remplacé par les données Supabase
  const engins = [
    {
      id: 1,
      modele: "CAT 320D",
      serie: "320D2L",
      type: "Pelle hydraulique",
      fabricant: "Caterpillar",
      annee: 2020,
      heures: 2450,
      statut: "Actif",
      chantier: "Autoroute A89",
      derniereMaintenance: "2024-01-15"
    },
    {
      id: 2,
      modele: "D6T",
      serie: "D6TXL",
      type: "Bulldozer",
      fabricant: "Caterpillar",
      annee: 2019,
      heures: 3200,
      statut: "Maintenance",
      chantier: "ZAC des Jardins",
      derniereMaintenance: "2024-01-10"
    },
    {
      id: 3,
      modele: "PC210",
      serie: "PC210LC-11",
      type: "Pelle hydraulique",
      fabricant: "Komatsu",
      annee: 2021,
      heures: 1800,
      statut: "Actif",
      chantier: "Pont de Loire",
      derniereMaintenance: "2024-01-20"
    },
    {
      id: 4,
      modele: "928M",
      serie: "928MZ",
      type: "Chargeuse",
      fabricant: "Caterpillar",
      annee: 2018,
      heures: 4100,
      statut: "Réparation",
      chantier: "Dépôt",
      derniereMaintenance: "2023-12-28"
    }
  ];

  const filteredEngins = engins.filter(engin =>
    engin.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engin.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engin.fabricant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "Actif": return "bg-success/10 text-success border-success/20";
      case "Maintenance": return "bg-warning/10 text-warning border-warning/20";
      case "Réparation": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestion des Engins</h2>
            <p className="text-muted-foreground">Gérez votre parc d'engins de chantier</p>
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
                    <Label htmlFor="modele">Modèle</Label>
                    <Input id="modele" placeholder="ex: CAT 320D" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serie">Série</Label>
                    <Input id="serie" placeholder="ex: 320D2L" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pelle">Pelle hydraulique</SelectItem>
                        <SelectItem value="bulldozer">Bulldozer</SelectItem>
                        <SelectItem value="chargeuse">Chargeuse</SelectItem>
                        <SelectItem value="compacteur">Compacteur</SelectItem>
                        <SelectItem value="niveleuse">Niveleuse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fabricant">Fabricant</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner fabricant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caterpillar">Caterpillar</SelectItem>
                        <SelectItem value="komatsu">Komatsu</SelectItem>
                        <SelectItem value="liebherr">Liebherr</SelectItem>
                        <SelectItem value="volvo">Volvo</SelectItem>
                        <SelectItem value="jcb">JCB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annee">Année</Label>
                    <Input id="annee" type="number" placeholder="2024" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heures">Heures</Label>
                    <Input id="heures" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chantier">Chantier Actuel</Label>
                  <Input id="chantier" placeholder="ex: Autoroute A89" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Annuler</Button>
                <Button className="bg-primary hover:bg-primary-hover">Ajouter</Button>
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
                  <TableHead>Engin</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Heures</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Chantier</TableHead>
                  <TableHead>Dernière Maintenance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEngins.map((engin) => (
                  <TableRow key={engin.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{engin.modele}</div>
                        <div className="text-sm text-muted-foreground">
                          {engin.fabricant} • {engin.serie} • {engin.annee}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {engin.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{engin.heures.toLocaleString()}h</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(engin.statut)}>
                        {engin.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {engin.chantier}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(engin.derniereMaintenance).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
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