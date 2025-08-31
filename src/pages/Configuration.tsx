import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  User, 
  Bell, 
  Database, 
  Shield, 
  Download, 
  Upload, 
  RotateCcw,
  Save,
  CheckCircle,
  Clock,
  HardDrive,
  Users,
  Lock,
  Globe,
  Palette,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Configuration() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configuration sauvegardée",
      description: "Tous les paramètres ont été mis à jour avec succès.",
    });
    
    setIsSaving(false);
  };

  const handleReset = () => {
    toast({
      title: "Configuration réinitialisée",
      description: "Les paramètres par défaut ont été restaurés.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Configuration Système</h1>
                <p className="text-white/90">Paramètres et préférences de l'application</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              <Button 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Profile */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                Profil Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Jean Dupont</h3>
                  <p className="text-gray-600 text-sm">Administrateur Système</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet</Label>
                  <Input id="nom" defaultValue="Jean Dupont" className="border-gray-200 focus:border-blue-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input id="email" type="email" defaultValue="jean.dupont@entreprise.fr" className="border-gray-200 focus:border-blue-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poste">Fonction</Label>
                  <Input id="poste" defaultValue="Ingénieur Maintenance Préventive" className="border-gray-200 focus:border-blue-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Niveau d'accès</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-red-500" />
                          Administrateur
                        </div>
                      </SelectItem>
                      <SelectItem value="manager">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-orange-500" />
                          Responsable
                        </div>
                      </SelectItem>
                      <SelectItem value="tech">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-blue-500" />
                          Technicien
                        </div>
                      </SelectItem>
                      <SelectItem value="view">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          Lecture seule
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                Centre de Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Notifications actives</Label>
                    <p className="text-xs text-gray-600">Système opérationnel</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">En ligne</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notif" className="text-sm font-medium">
                      Notifications par email
                    </Label>
                    <p className="text-xs text-gray-600">
                      Recevoir les alertes importantes
                    </p>
                  </div>
                  <Switch id="email-notif" defaultChecked />
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stock-alert" className="text-sm font-medium">
                      Alertes de stock critique
                    </Label>
                    <p className="text-xs text-gray-600">
                      Notification quand stock ≤ seuil défini
                    </p>
                  </div>
                  <Switch id="stock-alert" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seuil-stock">Seuil critique (unités)</Label>
                  <Input 
                    id="seuil-stock" 
                    type="number" 
                    defaultValue="5" 
                    className="border-gray-200 focus:border-emerald-500" 
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-alert" className="text-sm font-medium">
                      Rappels de maintenance
                    </Label>
                    <p className="text-xs text-gray-600">
                      Alertes avant échéances
                    </p>
                  </div>
                  <Switch id="maintenance-alert" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delai-rappel">Délai d'anticipation</Label>
                  <Select defaultValue="7">
                    <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 jours avant</SelectItem>
                      <SelectItem value="7">1 semaine avant</SelectItem>
                      <SelectItem value="14">2 semaines avant</SelectItem>
                      <SelectItem value="30">1 mois avant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                Préférences Système
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="langue">Langue d'interface</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger className="border-gray-200 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select defaultValue="europe-paris">
                    <SelectTrigger className="border-gray-200 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                      <SelectItem value="america-newyork">America/New_York (UTC-5)</SelectItem>
                      <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="devise">Devise par défaut</Label>
                  <Select defaultValue="eur">
                    <SelectTrigger className="border-gray-200 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">💶 Euro (EUR)</SelectItem>
                      <SelectItem value="usd">💵 Dollar US (USD)</SelectItem>
                      <SelectItem value="gbp">💷 Livre Sterling (GBP)</SelectItem>
                      <SelectItem value="chf">🇨🇭 Franc Suisse (CHF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Mode sombre automatique</Label>
                    <p className="text-xs text-gray-600">Suivre les préférences système</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sauvegarde automatique</Label>
                    <p className="text-xs text-gray-600">Sauvegarder les modifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Access */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                Sécurité & Accès
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Accès sécurisé actif</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">Lecture</Badge>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Écriture</Badge>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Modification</Badge>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">Administration</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Authentification à deux facteurs</Label>
                    <p className="text-xs text-gray-600">Sécurité renforcée (recommandé)</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Expiration de session</Label>
                  <Select defaultValue="60">
                    <SelectTrigger className="border-gray-200 focus:border-red-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="240">4 heures</SelectItem>
                      <SelectItem value="480">8 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                  <Lock className="h-4 w-4 mr-2" />
                  Modifier le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4 text-white" />
              </div>
              Gestion des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Backup & Export */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-indigo-600" />
                    Sauvegarde & Export
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter toutes les données
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Importer des données
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50">
                      <Clock className="h-4 w-4 mr-2" />
                      Planifier une sauvegarde
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Dernière sauvegarde</span>
                  </div>
                  <p className="text-xs text-gray-600">15 janvier 2024 à 14:30</p>
                  <p className="text-xs text-gray-500 mt-1">Sauvegarde automatique réussie</p>
                </div>
              </div>

              {/* Database Statistics */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-600" />
                    Statistiques de la Base
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="text-2xl font-bold text-blue-700">47</div>
                      <div className="text-sm text-blue-600">Engins</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                      <div className="text-2xl font-bold text-emerald-700">342</div>
                      <div className="text-sm text-emerald-600">Filtres</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="text-2xl font-bold text-purple-700">1,247</div>
                      <div className="text-sm text-purple-600">Compatibilités</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                      <div className="text-2xl font-bold text-orange-700">45.2</div>
                      <div className="text-sm text-orange-600">MB utilisés</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800">Base de données en ligne</span>
                  </div>
                  <p className="text-xs text-green-600">Toutes les opérations fonctionnent normalement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}