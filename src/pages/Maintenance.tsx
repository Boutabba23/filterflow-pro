import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Search,
  Wrench,
  Cog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchMaintenances, createMaintenance } from "@/lib/database-maintenance"; // Assuming this file exists or will be created

export default function Maintenance() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    engin_code: "",
    type_maintenance: "",
    date_maintenance: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaintenances();
  }, []);

  const loadMaintenances = async () => {
    try {
      const data = await fetchMaintenances();
      setMaintenances(data);
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les maintenances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors({ ...errors, [id]: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.engin_code.trim()) {
      newErrors.engin_code = "Le code engin est requis";
    }
    if (!formData.type_maintenance.trim()) {
      newErrors.type_maintenance = "Le type de maintenance est requis";
    }
    if (!formData.date_maintenance.trim()) {
      newErrors.date_maintenance = "La date de maintenance est requise";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMaintenance = async () => {
    if (!validateForm()) return;

    try {
      const newMaintenance = await createMaintenance(formData);
      setMaintenances((prev) => [newMaintenance, ...prev]);
      setAddDialogOpen(false);
      setFormData({
        engin_code: "",
        type_maintenance: "",
        date_maintenance: "",
        description: "",
      });
      setErrors({});
      toast({
        title: "Succès",
        description: "La maintenance a été ajoutée avec succès",
      });
    } catch (error) {
      console.error("Error adding maintenance:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la maintenance",
        variant: "destructive",
      });
    }
  };

  const filteredMaintenances = maintenances.filter(
    (maintenance) =>
      maintenance.engin_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.type_maintenance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="space-y-8">
          {/* Animated Header Section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-header p-8 shadow-vibrant drop-shadow-xl animate-fade-in">
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce-in">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in">
                Gestion des Maintenances
              </h1>
              <p className="text-white/90 text-lg mb-6 animate-slide-in">
                Gérez les opérations de maintenance de vos engins
              </p>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-vibrant animate-scale-in"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouvelle Maintenance
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`${isMobile ? "w-[95%] max-w-none" : "max-w-2xl"}`}
                >
                  <DialogHeader>
                    <DialogTitle>Ajouter une Nouvelle Maintenance</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div
                      className={`${
                        isMobile ? "grid grid-cols-1" : "grid grid-cols-2"
                      } gap-4`}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="engin_code">Code Engin</Label>
                        <Input
                          id="engin_code"
                          placeholder="ex: A03010236"
                          value={formData.engin_code}
                          onChange={handleInputChange}
                          className={errors.engin_code ? "border-destructive" : ""}
                        />
                        {errors.engin_code && (
                          <p className="text-sm text-destructive">
                            {errors.engin_code}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type_maintenance">Type de Maintenance</Label>
                        <Input
                          id="type_maintenance"
                          placeholder="ex: Préventive"
                          value={formData.type_maintenance}
                          onChange={handleInputChange}
                          className={errors.type_maintenance ? "border-destructive" : ""}
                        />
                        {errors.type_maintenance && (
                          <p className="text-sm text-destructive">
                            {errors.type_maintenance}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_maintenance">Date de Maintenance</Label>
                      <Input
                        id="date_maintenance"
                        type="date"
                        value={formData.date_maintenance}
                        onChange={handleInputChange}
                        className={errors.date_maintenance ? "border-destructive" : ""}
                      />
                      {errors.date_maintenance && (
                        <p className="text-sm text-destructive">
                          {errors.date_maintenance}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="ex: Changement d'huile et filtres"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={errors.description ? "border-destructive" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Annuler
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
                      onClick={handleAddMaintenance}
                    >
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Animated Search Section */}
          <Card className="shadow-vibrant bg-gradient-card border-0 overflow-hidden animate-fade-in">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
                  <Input
                    placeholder="Rechercher par code engin, type de maintenance..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 max-sm:text-sm text-lg border-primary/20 focus:border-primary 
                     focus:ring-primary/20 transition-all duration-300 hover:shadow-glow"
                  />
                </div>
                <Select>
                  <SelectTrigger
                    className="w-full lg:w-56 h-12 border-accent/20
                   focus:border-accent hover:shadow-vibrant transition-all duration-300"
                  >
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-card">
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="preventive">Préventive</SelectItem>
                    <SelectItem value="curative">Curative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Animated Maintenances Grid */}
          <Card className="shadow-glow bg-gradient-card border-0 overflow-hidden animate-fade-in">
            <CardHeader className="bg-gradient-rainbow text-white">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Cog className="h-6 w-6" />
                </div>
                Historique des Maintenances ({filteredMaintenances.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <p>Chargement des maintenances...</p>
              ) : filteredMaintenances.length === 0 ? (
                <p>Aucune maintenance trouvée.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMaintenances.map((maintenance, index) => (
                    <div
                      key={maintenance.id} // Assuming maintenance objects have an 'id'
                      className="group relative bg-white dark:bg-card rounded-2xl p-6 shadow-card hover:shadow-vibrant transition-all duration-500 hover:scale-105 animate-scale-in border border-primary/5 hover:border-primary/20"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Gradient Background Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="text-lg font-bold text-primary mb-2">
                          {maintenance.engin_code}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          Type: {maintenance.type_maintenance}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          Date: {maintenance.date_maintenance}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Description: {maintenance.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
