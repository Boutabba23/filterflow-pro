import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, HourglassIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface EnginCardProps {
  engin: {
    id: number;
    code: string;
    désignation: string;
    marque: string;
    type: string;
    heures: number;
    statut: string;
    derniereMaintenancePréventive: string;
  };
  onEdit: (engin: any) => void;
  onDelete: (id: number) => void;
}

export function EnginCard({ engin, onEdit, onDelete }: EnginCardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <Link
                to={`/engins/${engin.id}`}
                className="text-primary hover:text-primary-hover underline-offset-4 hover:underline font-medium text-lg"
              >
                {engin.code}
              </Link>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {engin.désignation}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-primary/20 text-primary ml-2"
            >
              {engin.type}
            </Badge>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Marque:</span>
              <p className="font-medium">{engin.marque}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Heures:</span>
              <div className="flex items-center gap-1">
                <HourglassIcon className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono font-medium">{engin.heures.toLocaleString()}h</span>
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="text-sm">
            <span className="text-muted-foreground">Dernière maintenance:</span>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">
                {new Date(engin.derniereMaintenancePréventive).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(engin)}
            >
              <Edit className="h-3 w-3 mr-2" />
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={() => onDelete(engin.id)}
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}