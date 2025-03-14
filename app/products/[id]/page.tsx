"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  ArrowDown, 
  ArrowLeft, 
  ArrowUp, 
  Edit, 
  PackageOpen, 
  Trash2 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to get movement type icon and color
const getMovementTypeDisplay = (type: string) => {
  switch (type) {
    case "PURCHASE":
      return {
        icon: <ArrowUp className="mr-1 h-4 w-4 text-green-500" />,
        label: "Entrée",
      };
    case "SALE":
      return {
        icon: <ArrowDown className="mr-1 h-4 w-4 text-red-500" />,
        label: "Sortie",
      };
    case "ADJUSTMENT":
      return {
        icon: <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />,
        label: "Ajustement",
      };
    default:
      return {
        icon: null,
        label: "Inconnu",
      };
  }
};

// Loading skeleton component
const ProductDetailSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-[100px]" />
      <Skeleton className="h-8 w-[100px]" />
      <Skeleton className="h-8 w-[100px]" />
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [stockMovements, setStockMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = params.id;
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch product');
        }
        
        setProduct(data);
        setStockMovements(data.stockMovements || []);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to load product data');
        toast({
          title: 'Error',
          description: error.message || 'Failed to load product data',
          variant: 'destructive',
        });
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    
    fetchProductData();
  }, [id, toast]);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      
      toast({
        title: 'Produit supprimé',
        description: 'Le produit a été supprimé avec succès.',
      });
      
      // Add a small delay before redirecting
      setTimeout(() => {
        router.push('/products');
      }, 1000);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Shell>
        <ProductDetailSkeleton />
      </Shell>
    );
  }
  
  if (!product) {
    return (
      <Shell>
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader heading={product.name ?? "Produit sans nom"} text={`Code: ${product.code ?? "N/A"}`}>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button asChild>
            <Link href={`/products/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement le produit
                  et toutes les données associées de notre base de données.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageHeader>
      
      <Tabs defaultValue="details" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>
                  Détails de base du produit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Code</dt>
                    <dd className="text-sm font-semibold">{product.code ?? "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Nom</dt>
                    <dd className="text-sm font-semibold">{product.name ?? "N/A"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                    <dd className="text-sm">{product.description ?? "Aucune description"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Catégorie</dt>
                    <dd className="text-sm">{product.category ?? "Non catégorisé"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Emplacement</dt>
                    <dd className="text-sm">{product.location ?? "Non spécifié"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Date de création</dt>
                    <dd className="text-sm">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString('fr-FR') : "N/A"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations de stock</CardTitle>
                <CardDescription>
                  Détails sur le stock et le prix
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Prix unitaire</dt>
                    <dd className="text-sm font-semibold">{(product.unitPrice ?? 0).toFixed(2)} €</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Valeur totale</dt>
                    <dd className="text-sm font-semibold">
                      {((product.unitPrice ?? 0) * (product.currentStock ?? 0)).toFixed(2)} €
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Stock actuel</dt>
                    <dd className="text-sm font-semibold">{product.currentStock ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Stock minimum</dt>
                    <dd className="text-sm font-semibold">{product.minimumStock ?? 0}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Statut</dt>
                    <dd className="mt-1">
                      {(product.currentStock ?? 0) > (product.minimumStock ?? 0) ? (
                        <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-500">
                          Stock suffisant
                        </div>
                      ) : (
                        <div className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-500">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Stock critique
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Gérer les mouvements de stock pour ce produit
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button
                asChild
                disabled={isRedirecting || !id}
                onClick={() => setIsRedirecting(true)}
              >
                <Link href={`/movements/new?productId=${params.id}&type=in`}>
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Enregistrer une entrée
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/movements/new?productId=${params.id}&type=out`}>
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Enregistrer une sortie
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href={`/audits/new?productId=${params.id}`}>
                  <PackageOpen className="mr-2 h-4 w-4" />
                  Faire un inventaire
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="movements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mouvements de stock</CardTitle>
              <CardDescription>
                Historique des entrées et sorties pour ce produit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {movement.type === "PURCHASE" && (
                          <div className="flex items-center">
                            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                            <span>Entrée</span>
                          </div>
                        )}
                        {movement.type === "SALE" && (
                          <div className="flex items-center">
                            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                            <span>Sortie</span>
                          </div>
                        )}
                        {movement.type === "ADJUSTMENT" && (
                          <div className="flex items-center">
                            <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
                            <span>Ajustement</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {movement.type === "ADJUSTMENT" && movement.quantity < 0
                          ? movement.quantity
                          : movement.type === "SALE"
                          ? `-${movement.quantity}`
                          : `+${movement.quantity}`}
                      </TableCell>
                      <TableCell>{movement.reason}</TableCell>
                      <TableCell>{movement.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des inventaires</CardTitle>
              <CardDescription>
                Résultats des inventaires physiques pour ce produit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>Aucun inventaire n'a encore été effectué pour ce produit.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}