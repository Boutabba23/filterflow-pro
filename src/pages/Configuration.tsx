import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Database, Shield, Download, Upload, RotateCcw } from "lucide-react";

export default function Configuration() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Configuration Système</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Paramètres et préférences de l'application</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <RotateCcw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Réinitialiser</span>
              <span className="sm:hidden">Reset</span>
            </Button>
            <Button className="bg-primary hover:bg-primary-hover w-full sm:w-auto">
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profil Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom complet</Label>
                <Input id="nom" defaultValue="Jean Dupont" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@entreprise.fr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poste">Poste</Label>
                <Input id="poste" defaultValue="Ingénieur Maintenance Préventive" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle système</Label>
                <Select defaultValue="admin">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="manager">Responsable</SelectItem>
                    <SelectItem value="tech">Technicien</SelectItem>
                    <SelectItem value="view">Lecture seule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif" className="text-sm font-medium">
                    Notifications email
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recevoir les alertes par email
                  </p>
                </div>
                <Switch id="email-notif" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stock-alert" className="text-sm font-medium">
                    Alertes stock bas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Alerte quand stock &lt; seuil
                  </p>
                </div>
                <Switch id="stock-alert" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seuil-stock">Seuil stock critique</Label>
                <Input id="seuil-stock" type="number" defaultValue="5" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance-alert" className="text-sm font-medium">
                    Rappels maintenance
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Rappel avant échéance
                  </p>
                </div>
                <Switch id="maintenance-alert" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delai-rappel">Délai de rappel (jours)</Label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 jours</SelectItem>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="14">14 jours</SelectItem>
                    <SelectItem value="30">30 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Paramètres Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="langue">Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select defaultValue="europe-paris">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                    <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                    <SelectItem value="america-newyork">America/New_York (UTC-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="devise">Devise</Label>
                <Select defaultValue="eur">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">Euro (€)</SelectItem>
                    <SelectItem value="usd">Dollar ($)</SelectItem>
                    <SelectItem value="gbp">Livre (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save" className="text-sm font-medium">
                    Sauvegarde automatique
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Sauvegarder les modifications
                  </p>
                </div>
                <Switch id="auto-save" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security & Permissions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Sécurité & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Permissions actuelles</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-success/10 text-success border-success/20">
                    Lecture
                  </Badge>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Écriture
                  </Badge>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Suppression
                  </Badge>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    Administration
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor" className="text-sm font-medium">
                    Authentification 2FA
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Double authentification
                  </p>
                </div>
                <Switch id="two-factor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Timeout session (minutes)</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                    <SelectItem value="480">8 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="w-full">
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Gestion des Données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Sauvegarde & Restauration</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les données
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer les données
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Dernière sauvegarde: 15/01/2024 à 14:30
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Statistiques Base de Données</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-foreground">Engins</div>
                    <div className="text-muted-foreground">47 enregistrements</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Filtres</div>
                    <div className="text-muted-foreground">342 références</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Compatibilités</div>
                    <div className="text-muted-foreground">1,247 associations</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Espace utilisé</div>
                    <div className="text-muted-foreground">45.2 MB</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}