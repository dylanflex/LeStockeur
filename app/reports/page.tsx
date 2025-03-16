"use client";

import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Download, 
  LineChart, 
  PieChart, 
  TrendingUp,
  FileDown
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReportData {
  type: string;
  generatedAt: string;
  results: any[];
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchReport = async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: type,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
      } else {
        setError(data.error || 'Failed to load report data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: activeTab,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
          exportFormat: format
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export report');
    }
  };

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab]);

  const handleRetry = () => {
    fetchReport(activeTab);
  };

  if (loading) {
    return (
      <Shell>
        <PageHeader
          heading="Reports"
          description="View and analyze your inventory data"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading report data...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <PageHeader
          heading="Reports"
          description="View and analyze your inventory data"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-destructive text-center">
              <p className="text-lg font-semibold">Error loading report</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={handleRetry} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader 
        heading="Rapports et analyses" 
        text="Visualisez et analysez les données de votre inventaire"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')}>Excel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <div>Chargement des données...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition du stock par catégorie</CardTitle>
                  <CardDescription>
                    Distribution des produits par catégorie
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {reportData?.results?.stockByCategory && (
                    <pre>{JSON.stringify(reportData.results.stockByCategory, null, 2)}</pre>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Valeur du stock par catégorie</CardTitle>
                  <CardDescription>
                    Répartition de la valeur financière
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {reportData?.results?.valueByCategory && (
                    <pre>{JSON.stringify(reportData.results.valueByCategory, null, 2)}</pre>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          {loading ? (
            <div>Chargement des données...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Historique des mouvements</CardTitle>
                <CardDescription>
                  Tous les mouvements de stock sur la période
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportData?.results && (
                  <pre>{JSON.stringify(reportData.results, null, 2)}</pre>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          {loading ? (
            <div>Chargement des données...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>État actuel du stock</CardTitle>
                <CardDescription>
                  Vue détaillée de l'inventaire actuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportData?.results && (
                  <pre>{JSON.stringify(reportData.results, null, 2)}</pre>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {loading ? (
            <div>Chargement des données...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Valeur totale du stock</CardTitle>
                  <CardDescription>
                    Montant total de l'inventaire
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData?.results?.totalValue && (
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
                        .format(reportData.results.totalValue)}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Mouvements financiers</CardTitle>
                  <CardDescription>
                    Historique des transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData?.results?.movements && (
                    <pre>{JSON.stringify(reportData.results.movements, null, 2)}</pre>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Shell>
  );
}