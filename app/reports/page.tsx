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

export default function ReportsPage() {
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition du stock par catégorie</CardTitle>
                <CardDescription>
                  Distribution des produits par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <PieChart className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Le graphique sera affiché ici</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Valeur du stock par catégorie</CardTitle>
                <CardDescription>
                  Répartition de la valeur financière
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Le graphique sera affiché ici</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la valeur du stock</CardTitle>
              <CardDescription>
                Tendance sur les 12 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Le graphique sera affiché ici</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="movements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrées vs Sorties</CardTitle>
                <CardDescription>
                  Comparaison mensuelle
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Le graphique sera affiché ici</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top 5 des produits sortants</CardTitle>
                <CardDescription>
                  Produits avec le plus de sorties
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Le graphique sera affiché ici</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des mouvements</CardTitle>
              <CardDescription>
                Tendance sur les 12 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Le graphique sera affiché ici</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produits sous le seuil minimal</CardTitle>
              <CardDescription>
                Liste des produits à réapprovisionner
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Le graphique sera affiché ici</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Écarts d'inventaire</CardTitle>
              <CardDescription>
                Analyse des écarts constatés lors des inventaires
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Le graphique sera affiché ici</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Valeur du stock</CardTitle>
                <CardDescription>
                  Évolution mensuelle
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Le graphique sera affiché ici</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rotation des stocks</CardTitle>
                <CardDescription>
                  Taux de rotation par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Le graphique sera affiché ici</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Capital immobilisé</CardTitle>
              <CardDescription>
                Analyse du capital immobilisé dans le stock
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <PieChart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Le graphique sera affiché ici</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}