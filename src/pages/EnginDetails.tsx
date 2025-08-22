import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MapPin,
  HourglassIcon,
  Filter,
  ExternalLink,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function EnginDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - sera remplacé par les données Supabase
  const engin = {
    id: 1,
    code: "A03010236",
    désignation: "BULL SUR CHENILLE",
    marque: "Caterpillar",
    type: "D8R",
    heures: 2450,
    statut: "Actif",
    derniereMaintenancePréventive: "2024-01-15",
    prochaineMaintenance: "2024-08-15",
    localisation: "Chantier Nord",
    filtres: [
      {
        id: 1,
        référence: "1R-0750",
        type: "Huile moteur",
        position: "Moteur principal",
        fréquence: 250,
        unité: "heures",
        dernierChangement: "2024-01-15",
        prochainChangement: "2024-06-15",
        statut: "OK",
      },
      {
        id: 2,
        référence: "1R-0739",
        type: "Carburant",
        position: "Réservoir principal",
        fréquence: 500,
        unité: "heures",
        dernierChangement: "2024-01-15",
        prochainChangement: "2024-08-15",
        statut: "À changer",
      },
      {
        id: 3,
        référence: "126-1813",
        type: "Air",
        position: "Admission air",
        fréquence: 1000,
        unité: "heures",
        dernierChangement: "2023-12-01",
        prochainChangement: "2024-12-01",
        statut: "OK",
      },
    ],
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
            <h2 className="text-2xl font-bold text-foreground">
              Détails de l'Engin - {engin.code}
            </h2>
            <p className="text-muted-foreground">
              Informations complètes et filtres OEM
            </p>
          </div>
        </div>

        {/* Engin Information Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
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
                <p className="font-medium">{engin.désignation}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Marque</p>
                <p className="font-medium">{engin.marque}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="outline" className="border-primary/20 text-primary">
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
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge variant="outline" className={getStatusColor(engin.statut)}>
                  {engin.statut}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Localisation</p>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{engin.localisation}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Dernière Maintenance</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(engin.derniereMaintenancePréventive).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Prochaine Maintenance</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(engin.prochaineMaintenance).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres OEM Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filtres OEM ({engin.filtres.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence OEM</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Dernier Changement</TableHead>
                  <TableHead>Prochain Changement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engin.filtres.map((filtre) => (
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
                      <Badge variant="outline" className="border-accent/20 text-accent">
                        {filtre.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{filtre.position}</TableCell>
                    <TableCell className="font-mono">
                      {filtre.fréquence} {filtre.unité}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(filtre.dernierChangement).toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(filtre.prochainChangement).toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getFilterStatusColor(filtre.statut)}
                      >
                        {filtre.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/filtres/${filtre.id}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
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