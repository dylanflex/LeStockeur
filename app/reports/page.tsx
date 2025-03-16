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
  TrendingUp 
} from "lucide-react";
import { useEffect, useState } from "react";

interface ReportData {
  type: string;
  generatedAt: string;
  results: any[];
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchReport('inventory_status');
  }, []);

  return (
    <Shell>
      <PageHeader 
        heading="Rapports et analyses" 
        text="Visualisez et analysez les données de votre inventaire"
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>
      
      <Tabs defaultValue="overview" className="mt-6 space-y-4">
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
                  {reportData?.results && (
                    <pre>{JSON.stringify(reportData.results, null, 2)}</pre>
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
                  {reportData?.results && (
                    <pre>{JSON.stringify(reportData.results, null, 2)}</pre>
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