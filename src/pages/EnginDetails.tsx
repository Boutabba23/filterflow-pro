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
  ArrowLeft,
  Wrench,
  Calendar,
  HourglassIcon,
  Filter,
  ExternalLink,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DatabaseEngin, supabase } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchEnginById } from "@/lib/database-utils";

// Composant pour ajouter un filtre OEM
function AddFilterDialog({ enginId }: { enginId: number }) {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState("");
  const [designation, setDesignation] = useState("");
  const [prix, setPrix] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  // Types de filtres possibles
  const filterTypes = [
    "Filtre à huile",
    "Filtre à carburant",
    "Filtre à air",
    "Filtre hydraulique",
    "Filtre de cabine"
  ];

  const handleAddFilter = async () => {
    if (!reference || !designation || !filterType) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // D'abord, créer le filtre
      const { data: newFiltre, error: filtreError } = await supabase
        .from('filtres')
        .insert([{
          reference_principale: reference,
          description: designation,
          prix: prix ? parseFloat(prix) : null,
          stock: parseInt(stock) || 0,
          type: filterType,
          fabricant: "OEM" // Par défaut, on marque comme OEM
        }])
        .select()
        .single();
      
      if (filtreError) throw filtreError;
      
      // Ensuite, ajouter la relation entre l'engin et le filtre
      const { error: compatibilityError } = await supabase
        .from('engin_filtre_compatibility')
        .insert([{
          engin_id: enginId,
          filtre_id: newFiltre.id,
          type: filterType
        }]);

      if (compatibilityError) throw compatibilityError;

      toast({
        title: "Succès",
        description: "Le filtre a été ajouté avec succès",
      });

      // Fermer le dialogue et recharger la page
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding filter to engin:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le filtre",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ajouter un filtre OEM</DialogTitle>
          <DialogDescription>
            Sélectionnez un filtre existant à associer à cet engin
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Référence <span className="text-red-500">*</span></h3>
              <Input
                placeholder="Référence du filtre"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Désignation <span className="text-red-500">*</span></h3>
              <Input
                placeholder="Désignation du filtre"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Type de filtre <span className="text-red-500">*</span></h3>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de filtre" />
                </SelectTrigger>
                <SelectContent>
                  {filterTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Prix (€)</h3>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Stock</h3>
                <Input
                  type="number"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleAddFilter} 
            className="flex items-center gap-2"
            disabled={loading || !reference || !designation || !filterType}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Ajout en cours...
              </>
            ) : (
              "Ajouter le filtre"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function EnginDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data on component mount and when id changes
  useEffect(() => {
    if (id) {
      fetchEnginDetails();
    }
  }, [id]);
  const fetchEnginDetails = async () => {
    try {
      const data = await fetchEnginById(Number(id));
      setEngin(data);
    } catch (error) {
      console.error("Error fetching engin details:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de l'engin",
        variant: "destructive",
      });
      navigate("/engins");
    } finally {
      setLoading(false);
    }
  };
  const [engin, setEngin] = useState<DatabaseEngin | null>(null);
  const [loading, setLoading] = useState(true);

  const getFilterStatusColor = (statut: string) => {
    switch (statut) {
      case "OK":
        return "bg-success/10 text-success border-success/20";
      case "À changer":
        return "bg-warning/10 text-warning border-warning/20";
      case "Urgent":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  // Afficher un indicateur de chargement si les données ne sont pas encore disponibles
  if (loading || !engin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des détails de l'engin...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/engins")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Détails de l'Engin - {engin ? engin.code : "Chargement..."}
            </h2>
            <p className="text-sm text-muted-foreground">
              Informations complètes et filtres OEM
            </p>
          </div>
        </div>

        {/* Engin Information Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Informations Générales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="font-semibold text-lg">{engin.code}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Désignation</p>
                <p className="font-medium">{engin.designation}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Marque</p>
                <p className="font-medium">{engin.marque}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge
                  variant="outline"
                  className="border-primary/20 text-primary"
                >
                  {engin.type}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Heures</p>
                <div className="flex items-center gap-1">
                  <HourglassIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-semibold">
                    {engin.heures.toLocaleString()}h
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dernière Maintenance
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(
                      engin.derniere_maintenance_preventive
                    ).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres OEM */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Filtres OEM ({engin.filtres ? engin.filtres.length : 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table - Hidden on smaller screens */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence OEM</TableHead>
                    <TableHead>Type</TableHead>

                    <TableHead>Dernier Changement</TableHead>

                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {engin.filtres && engin.filtres.map((filtre) => (
                    <TableRow key={filtre.id}>
                      <TableCell>
                        <Link
                          to={`/filtres/${filtre.id}`}
                          className="text-primary hover:text-primary-hover underline-offset-4 hover:underline font-medium flex items-center gap-1"
                        >
                          {filtre.référence}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-accent/20 text-accent"
                        >
                          {filtre.type}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(
                            filtre.dernierChangement
                          ).toLocaleDateString("fr-FR")}
                        </div>
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

            {/* Mobile Cards - Hidden on medium and larger screens */}
            <div className="md:hidden space-y-4">
              {engin.filtres && engin.filtres.map((filtre) => (
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
                        <Badge
                          variant="outline"
                          className="border-accent/20 text-accent"
                        >
                          {filtre.type}
                        </Badge>
                      </div>
                      <Badge className={getFilterStatusColor(filtre.statut)}>
                        {filtre.statut}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position</span>
                      <span className="font-medium">{filtre.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fréquence</span>
                      <span className="font-mono">
                        {filtre.fréquence} {filtre.unité}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dernier</span>
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
