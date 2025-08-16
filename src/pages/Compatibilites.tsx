import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Link2, ArrowRight, Calendar, Wrench, Filter } from "lucide-react";
import { useState } from "react";

export default function Compatibilites() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - sera remplacé par les données Supabase
  const compatibilites = [
    {
      id: 1,
      engin: { modele: "CAT 320D", type: "Pelle hydraulique" },
      filtre: { reference: "HF6177", type: "Hydraulique" },
      position: "Circuit hydraulique principal",
      frequenceChangement: 250,
      uniteFrequence: "heures",
      dernierChangement: "2024-01-15",
      prochainChangement: "2024-04-15",
      priorite: "Haute"
    },
    {
      id: 2,
      engin: { modele: "CAT 320D", type: "Pelle hydraulique" },
      filtre: { reference: "AF25424", type: "Air" },
      position: "Moteur - air primaire",
      frequenceChangement: 500,
      uniteFrequence: "heures",
      dernierChangement: "2024-01-10",
      prochainChangement: "2024-06-10",
      priorite: "Moyenne"
    },
    {
      id: 3,
      engin: { modele: "D6T", type: "Bulldozer" },
      filtre: { reference: "FF5421", type: "Carburant" },
      position: "Réservoir carburant",
      frequenceChangement: 1000,
      uniteFrequence: "heures",
      dernierChangement: "2023-12-20",
      prochainChangement: "2024-08-20",
      priorite: "Basse"
    },
    {
      id: 4,
      engin: { modele: "PC210", type: "Pelle hydraulique" },
      filtre: { reference: "LF3000", type: "Huile" },
      position: "Moteur - carter d'huile",
      frequenceChangement: 300,
      uniteFrequence: "heures",
      dernierChangement: "2024-01-20",
      prochainChangement: "2024-04-20",
      priorite: "Haute"
    },
    {
      id: 5,
      engin: { modele: "928M", type: "Chargeuse" },
      filtre: { reference: "HF6177", type: "Hydraulique" },
      position: "Circuit hydraulique direction",
      frequenceChangement: 400,
      uniteFrequence: "heures",
      dernierChangement: "2023-11-15",
      prochainChangement: "2024-03-15",
      priorite: "Haute"
    }
  ];

  const filteredCompatibilites = compatibilites.filter(comp =>
    comp.engin.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.filtre.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Hydraulique": return "bg-primary/10 text-primary border-primary/20";
      case "Air": return "bg-accent/10 text-accent border-accent/20";
      case "Carburant": return "bg-warning/10 text-warning border-warning/20";
      case "Huile": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case "Haute": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Moyenne": return "bg-warning/10 text-warning border-warning/20";
      case "Basse": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Compatibilités Engins-Filtres</h2>
            <p className="text-muted-foreground">Gérez les associations et planifiez la maintenance</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Compatibilité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter une Compatibilité</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engin">Engin</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un engin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cat320d">CAT 320D - Pelle hydraulique</SelectItem>
                        <SelectItem value="d6t">D6T - Bulldozer</SelectItem>
                        <SelectItem value="pc210">PC210 - Pelle hydraulique</SelectItem>
                        <SelectItem value="928m">928M - Chargeuse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filtre">Filtre</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un filtre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hf6177">HF6177 - Hydraulique</SelectItem>
                        <SelectItem value="af25424">AF25424 - Air</SelectItem>
                        <SelectItem value="ff5421">FF5421 - Carburant</SelectItem>
                        <SelectItem value="lf3000">LF3000 - Huile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position/Emplacement</Label>
                  <Input id="position" placeholder="ex: Circuit hydraulique principal" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequence">Fréquence</Label>
                    <Input id="frequence" type="number" placeholder="250" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unite">Unité</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Unité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heures">Heures</SelectItem>
                        <SelectItem value="mois">Mois</SelectItem>
                        <SelectItem value="km">Kilomètres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priorite">Priorité</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="haute">Haute</SelectItem>
                        <SelectItem value="moyenne">Moyenne</SelectItem>
                        <SelectItem value="basse">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dernier">Date Dernier Changement</Label>
                  <Input id="dernier" type="date" />
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
                  placeholder="Rechercher par engin, filtre ou position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="moyenne">Moyenne</SelectItem>
                  <SelectItem value="basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Planning */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Urgent (7 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">3</div>
              <p className="text-sm text-muted-foreground">Maintenances à prévoir</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-warning/20 bg-warning/5">
            <CardHeader>
              <CardTitle className="text-warning flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Prochainement (30 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">8</div>
              <p className="text-sm text-muted-foreground">Maintenances planifiées</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="text-success flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{compatibilites.length}</div>
              <p className="text-sm text-muted-foreground">Compatibilités actives</p>
            </CardContent>
          </Card>
        </div>

        {/* Compatibilités Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Matrice de Compatibilité ({filteredCompatibilites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Association</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Dernier Change.</TableHead>
                  <TableHead>Prochain Change.</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompatibilites.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Wrench className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-foreground">{comp.engin.modele}</span>
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <div className="flex items-center gap-1">
                            <Filter className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono text-sm">{comp.filtre.reference}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {comp.engin.type}
                        </Badge>
                        <Badge className={`text-xs ${getTypeColor(comp.filtre.type)}`}>
                          {comp.filtre.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                      {comp.position}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {comp.frequenceChangement} {comp.uniteFrequence}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(comp.dernierChangement).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {new Date(comp.prochainChangement).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPrioriteColor(comp.priorite)}>
                        {comp.priorite}
                      </Badge>
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