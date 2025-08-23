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
  Save,
  Filter,
  Search,
  Plus,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";
import { fetchEnginById, fetchFiltres } from "@/lib/database-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function AddFilterToEngin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [engin, setEngin] = useState<any>(null);
  const [filtres, setFiltres] = useState<any[]>([]);
  const [selectedFiltre, setSelectedFiltre] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Types de filtres possibles
  const filterTypes = [
    "Filtre à huile",
    "Filtre à carburant",
    "Filtre à air",
    "Filtre hydraulique",
    "Filtre de cabine"
  ];

  // Fetch data on component mount and when id changes
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const enginData = await fetchEnginById(Number(id));
      const filtresData = await fetchFiltres();

      setEngin(enginData);
      setFiltres(filtresData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
      navigate("/engins");
    } finally {
      setLoading(false);
    }
  };

  // Afficher un indicateur de chargement si les données ne sont pas encore disponibles
  if (loading || !engin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Filtrer les filtres en fonction du terme de recherche
  const filteredFiltres = filtres.filter(filtre => 
    filtre.reference_principale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filtre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filtre.fabricant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFilter = async () => {
    if (!selectedFiltre || !filterType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un filtre et un type",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ajouter la relation entre l'engin et le filtre
      const { error } = await supabase
        .from('engin_filtre_compatibility')
        .insert([{
          engin_id: Number(id),
          filtre_id: Number(selectedFiltre),
          type: filterType
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le filtre a été ajouté avec succès",
      });

      // Rediriger vers la page de détails de l'engin
      navigate(`/engins/${id}`);
    } catch (error) {
      console.error("Error adding filter to engin:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le filtre",
        variant: "destructive",
      });
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
            onClick={() => navigate(`/engins/${id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Ajouter un filtre OEM - {engin.code}
            </h2>
            <p className="text-sm text-muted-foreground">
              Sélectionnez un filtre existant à associer à cet engin
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélection du type de filtre */}
          <Card className="shadow-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Type de filtre
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAddFilter} 
                className="w-full flex items-center gap-2"
                disabled={!selectedFiltre || !filterType}
              >
                <Save className="h-4 w-4" />
                Ajouter le filtre
              </Button>
            </CardFooter>
          </Card>

          {/* Liste des filtres disponibles */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtres disponibles
              </CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Rechercher un filtre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredFiltres.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Fabricant</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiltres.map((filtre) => (
                      <TableRow key={filtre.id}>
                        <TableCell className="font-medium">{filtre.reference_principale}</TableCell>
                        <TableCell>{filtre.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-primary/20 text-primary">
                            {filtre.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{filtre.fabricant}</TableCell>
                        <TableCell>
                          <Badge className={filtre.stock > 10 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                            {filtre.stock} unités
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={selectedFiltre === filtre.id.toString() ? "default" : "outline"}
                            onClick={() => setSelectedFiltre(filtre.id.toString())}
                            className="flex items-center gap-1"
                          >
                            {selectedFiltre === filtre.id.toString() ? (
                              <>
                                <span>Sélectionné</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3" />
                                <span>Sélectionner</span>
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucun filtre trouvé correspondant à votre recherche.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
