import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Filter, Package, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Filtres() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - sera remplacé par les données Supabase
  const filtres = [
    {
      id: 1,
      referencePrincipale: "HF6177",
      type: "Hydraulique",
      fabricant: "Caterpillar",
      description: "Filtre hydraulique haute pression",
      referencesCompatibles: ["HF6177", "P550388", "BT8851-MPG"],
      enginCompatibles: 12,
      stock: 8,
      prixUnitaire: 45.90
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
      prixUnitaire: 67.50
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
      prixUnitaire: 89.20
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
      prixUnitaire: 28.75
    }
  ];

  const filteredFiltres = filtres.filter(filtre =>
    filtre.referencePrincipale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filtre.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filtre.fabricant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filtre.referencesCompatibles.some(ref => 
      ref.toLowerCase().includes(searchTerm.toLowerCase())
    )
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

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return "bg-destructive/10 text-destructive border-destructive/20";
    if (stock <= 10) return "bg-warning/10 text-warning border-warning/20";
    return "bg-success/10 text-success border-success/20";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestion des Filtres</h2>
            <p className="text-muted-foreground">Gérez vos références de filtres et compatibilités</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Filtre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Filtre</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reference">Référence Principale</Label>
                    <Input id="reference" placeholder="ex: HF6177" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de Filtre</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hydraulique">Hydraulique</SelectItem>
                        <SelectItem value="air">Air</SelectItem>
                        <SelectItem value="carburant">Carburant</SelectItem>
                        <SelectItem value="huile">Huile</SelectItem>
                        <SelectItem value="transmission">Transmission</SelectItem>
                        <SelectItem value="cabine">Cabine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fabricant">Fabricant</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner fabricant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caterpillar">Caterpillar</SelectItem>
                        <SelectItem value="fleetguard">Fleetguard</SelectItem>
                        <SelectItem value="donaldson">Donaldson</SelectItem>
                        <SelectItem value="mann">Mann Filter</SelectItem>
                        <SelectItem value="wix">WIX Filters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix Unitaire (€)</Label>
                    <Input id="prix" type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Description détaillée du filtre..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compatibles">Références Compatibles</Label>
                  <Textarea 
                    id="compatibles" 
                    placeholder="Entrez les références compatibles séparées par des virgules&#10;ex: HF6177, P550388, BT8851-MPG" 
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Initial</Label>
                  <Input id="stock" type="number" placeholder="0" />
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
                  placeholder="Rechercher par référence, type, fabricant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
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
                    <TableCell className="text-foreground">{filtre.fabricant}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {filtre.referencesCompatibles.length} ref.
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-5 px-2 text-xs">
                              Voir
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Références Compatibles - {filtre.referencePrincipale}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              {filtre.referencesCompatibles.map((ref, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span className="font-mono">{ref}</span>
                                  {index === 0 && (
                                    <Badge variant="outline" className="text-xs">Principal</Badge>
                                  )}
                                </div>
                              ))}
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
                              <DialogTitle>Modifier le filtre - {filtre.referencePrincipale}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-ref">Référence Principale</Label>
                                  <Input id="edit-ref" defaultValue={filtre.referencePrincipale} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-type">Type</Label>
                                  <Select defaultValue={filtre.type.toLowerCase().replace(' ', '-')}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="huile-moteur">Huile moteur</SelectItem>
                                      <SelectItem value="carburant">Carburant</SelectItem>
                                      <SelectItem value="air">Air</SelectItem>
                                      <SelectItem value="hydraulique">Hydraulique</SelectItem>
                                      <SelectItem value="transmission">Transmission</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-fabricant">Fabricant</Label>
                                  <Input id="edit-fabricant" defaultValue={filtre.fabricant} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-prix">Prix Unitaire (€)</Label>
                                  <Input id="edit-prix" type="number" step="0.01" defaultValue={filtre.prixUnitaire} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-stock">Stock</Label>
                                  <Input id="edit-stock" type="number" defaultValue={filtre.stock} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-delai">Engins Compatibles</Label>
                                  <Input id="edit-delai" type="number" defaultValue={filtre.enginCompatibles} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Input id="edit-description" defaultValue={filtre.description} />
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