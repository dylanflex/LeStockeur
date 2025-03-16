'use client';

import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SettingsPage() {
  const { toast } = useToast();
  // Company Settings State
  const [companySettings, setCompanySettings] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    website: ''
  });

  // App Preferences State
  const [preferences, setPreferences] = useState({
    language: 'fr',
    dateFormat: 'dd/mm/yyyy',
    currency: 'eur',
    itemsPerPage: 10
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    stockAlerts: true,
    criticalAlerts: true,
    expiryAlerts: false,
    emailEnabled: true,
    appEnabled: true,
    smsEnabled: false
  });

  // Categories State
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  // Fetch Initial Data
  useEffect(() => {
    fetchCompanySettings();
    fetchPreferences();
    fetchNotificationSettings();
    fetchCategories();
  }, []);

  // Fetch Functions
  const fetchCompanySettings = async () => {
    try {
      const response = await fetch('/api/settings/company');
      const data = await response.json();
      if (data) setCompanySettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load company settings",
        variant: "destructive"
      });
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/settings/preferences');
      const data = await response.json();
      if (data) setPreferences(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load preferences",
        variant: "destructive"
      });
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch('/api/settings/notifications');
      const data = await response.json();
      if (data) setNotificationSettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive"
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/settings/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    }
  };

  // Save Functions
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the user ID from the session or local storage
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        if (session?.user?.id) {
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    getCurrentUser();
  }, []);

  const saveCompanySettings = async () => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...companySettings, userId })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Les paramètres de l'entreprise ont été enregistrés avec succès",
          variant: "success"
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement des paramètres de l'entreprise",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...preferences, userId })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Les préférences ont été enregistrées avec succès",
          variant: "success"
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement des préférences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notificationSettings, userId })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Les paramètres de notification ont été enregistrés avec succès",
          variant: "success"
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement des paramètres de notification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Category Management Functions
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('/api/settings/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory })
      });

      if (response.ok) {
        setNewCategory('');
        fetchCategories();
        toast({
          title: "Success",
          description: "Category added successfully"
        });
      } else {
        throw new Error('Failed to add category');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive"
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/settings/categories?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCategories();
        toast({
          title: "Success",
          description: "Category deleted successfully"
        });
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  return (
    <Shell>
      <PageHeader 
        heading="Paramètres" 
        text="Configurez les paramètres de l'application"
      />
      
      <Tabs defaultValue="general" className="mt-6 space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Ces informations apparaîtront sur les rapports et les documents exportés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input 
                    id="companyName" 
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input 
                    id="contactEmail" 
                    type="email" 
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input 
                    id="website" 
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveCompanySettings} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'affichage</CardTitle>
              <CardDescription>
                Personnalisez l'interface utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select 
                    value={preferences.language}
                    onValueChange={(value) => setPreferences({...preferences, language: value})}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Format de date</Label>
                  <Select 
                    value={preferences.dateFormat}
                    onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Sélectionner un format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">JJ/MM/AAAA</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/JJ/AAAA</SelectItem>
                      <SelectItem value="yyyy-mm-dd">AAAA-MM-JJ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select 
                    value={preferences.currency}
                    onValueChange={(value) => setPreferences({...preferences, currency: value})}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="usd">Dollar US ($)</SelectItem>
                      <SelectItem value="gbp">Livre Sterling (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemsPerPage">Éléments par page</Label>
                  <Select 
                    value={preferences.itemsPerPage.toString()}
                    onValueChange={(value) => setPreferences({...preferences, itemsPerPage: parseInt(value)})}
                  >
                    <SelectTrigger id="itemsPerPage">
                      <SelectValue placeholder="Sélectionner un nombre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={savePreferences} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des notifications</CardTitle>
              <CardDescription>
                Configurez les alertes et les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Types d'alertes</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stockAlerts">Alertes de stock</Label>
                    <Switch
                      id="stockAlerts"
                      checked={notificationSettings.stockAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, stockAlerts: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="criticalAlerts">Alertes critiques</Label>
                    <Switch
                      id="criticalAlerts"
                      checked={notificationSettings.criticalAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, criticalAlerts: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expiryAlerts">Alertes d'expiration</Label>
                    <Switch
                      id="expiryAlerts"
                      checked={notificationSettings.expiryAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, expiryAlerts: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canaux de notification</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailEnabled">Notifications par email</Label>
                    <Switch
                      id="emailEnabled"
                      checked={notificationSettings.emailEnabled}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, emailEnabled: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appEnabled">Notifications dans l'application</Label>
                    <Switch
                      id="appEnabled"
                      checked={notificationSettings.appEnabled}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, appEnabled: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsEnabled">Notifications par SMS</Label>
                    <Switch
                      id="smsEnabled"
                      checked={notificationSettings.smsEnabled}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, smsEnabled: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveNotificationSettings} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des catégories</CardTitle>
              <CardDescription>
                Gérez les catégories de produits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nouvelle catégorie"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={addCategory}>Ajouter</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category: any) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sauvegarde</CardTitle>
              <CardDescription>
                Configurez les sauvegardes automatiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cette fonctionnalité sera disponible prochainement
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}