"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  ArrowDownIcon, 
  ArrowUpIcon, 
  BoxIcon, 
  PackageOpen, 
  TrendingDown, 
  TrendingUp 
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  stockValue: number;
  monthlyInflow: {
    count: number;
    percentage: number;
  };
  monthlyOutflow: {
    count: number;
    percentage: number;
  };
}

interface StockMovement {
  id: string;
  type: 'in' | 'out' | 'adjustment';
  productName: string;
  quantity: number;
  date: string;
  reason: string;
}

interface LowStockProduct {
  name: string;
  currentStock: number;
  minStock: number;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMovements, setRecentMovements] = useState<StockMovement[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        const statsResponse = await fetch('/api/dashboard/stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch recent movements
        const movementsResponse = await fetch('/api/stock-movements/recent');
        const movementsData = await movementsResponse.json();
        setRecentMovements(movementsData || []);

        // Fetch low stock products
        const lowStockResponse = await fetch('/api/products/low-stock');
        const lowStockData = await lowStockResponse.json();
        setLowStockProducts(Array.isArray(lowStockData) ? lowStockData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(null);
        setRecentMovements([]);
        setLowStockProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader heading="Tableau de bord" text="Aperçu de votre inventaire et des activités récentes" />
      
      <Tabs defaultValue="overview" className="mt-6 space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total des produits
                </CardTitle>
                <BoxIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Mise à jour en temps réel
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valeur du stock
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.stockValue ? stats.stockValue.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }) : '0 F CFA'}</div>
                <p className="text-xs text-muted-foreground">
                  Mise à jour en temps réel
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Entrées (mois)
                </CardTitle>
                <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.monthlyInflow.count || 0}</div>
                <div className="flex items-center pt-1">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">
                    {stats?.monthlyInflow?.percentage > 0 
                      ? `+${stats?.monthlyInflow?.percentage}%` 
                      : `${stats?.monthlyInflow?.percentage}%`}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs mois précédent</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sorties (mois)
                </CardTitle>
                <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.monthlyOutflow.count || 0}</div>
                <div className="flex items-center pt-1">
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">{stats?.monthlyOutflow.percentage}%</span>
                  <span className="text-xs text-muted-foreground ml-1">vs mois précédent</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Mouvements de stock récents</CardTitle>
                <CardDescription>
                  Les 5 derniers mouvements enregistrés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(recentMovements) && recentMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center">
                      <div className={`mr-4 rounded-full p-2 ${movement.type === 'in' ? 'bg-green-100 dark:bg-green-900/20' : movement.type === 'out' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-amber-100 dark:bg-amber-900/20'}`}>
                        {movement.type === 'in' ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-500" />
                        ) : movement.type === 'out' ? (
                          <ArrowDownIcon className="h-4 w-4 text-red-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {movement.type === 'in' ? 'Entrée: ' : movement.type === 'out' ? 'Sortie: ' : 'Ajustement: '}
                          {movement.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantité: {movement.quantity} • {new Date(movement.date).toLocaleDateString('fr-FR')} • {movement.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Produits à réapprovisionner</CardTitle>
                <CardDescription>
                  Produits sous le seuil minimal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.name} className="flex items-center">
                      <div className="mr-4 rounded-full bg-destructive/10 p-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.currentStock} / Minimum: {product.minStock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyses de stock</CardTitle>
              <CardDescription>
                Visualisation des tendances et des métriques clés
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Les graphiques d'analyse seront affichés ici</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertes actives</CardTitle>
              <CardDescription>
                Notifications importantes concernant votre inventaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.length > 0 && (
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-destructive/10 p-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Stock critique: {lowStockProducts.length} produits sous le seuil minimal
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Il est recommandé de réapprovisionner ces produits rapidement
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-amber-100 p-2 dark:bg-amber-900/20">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Inventaire requis: Dernier inventaire il y a plus de 30 jours
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Planifiez un inventaire pour assurer l'exactitude des données
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}