"use client";

import { useState, useEffect, use } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Edit, 
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
import { format } from "date-fns";

export default function MovementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [movement, setMovement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const movementId = use(params).id;
  
  useEffect(() => {
    const fetchMovementData = async () => {
      try {
        const response = await fetch(`/api/stock-movements/${movementId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch movement');
        }
        
        setMovement(data);
      } catch (error) {
        console.error('Error fetching movement:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données du mouvement',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovementData();
  }, [movementId, toast]);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/stock-movements/${movementId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete movement');
      }
      
      toast({
        title: 'Mouvement supprimé',
        description: 'Le mouvement a été supprimé avec succès.',
      });
      router.push('/movements');
    } catch (error) {
      console.error('Error deleting movement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le mouvement',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </Shell>
    );
  }
  
  if (!movement) {
    return (
      <Shell>
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Movement not found</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader 
        heading={`Mouvement ${movement.type}`} 
        text={`Quantité: ${movement.quantity}`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button asChild>
            <Link href={`/movements/${params.id}/edit`}>
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
                  Cette action ne peut pas être annulée. Cela supprimera définitivement le mouvement
                  de notre base de données.
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="product">Produit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du mouvement</CardTitle>
              <CardDescription>
                Détails du mouvement de stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                  <dd className="text-sm font-semibold">{movement.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Quantité</dt>
                  <dd className="text-sm font-semibold">{movement.quantity}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                  <dd className="text-sm font-semibold">{format(new Date(movement.date), "PPP")}</dd>
                </div>
                {movement.reason && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Raison</dt>
                    <dd className="text-sm font-semibold">{movement.reason}</dd>
                  </div>
                )}
                {movement.notes && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                    <dd className="text-sm font-semibold">{movement.notes}</dd>
                  </div>
                )}
                {movement.user && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Effectué par</dt>
                    <dd className="text-sm font-semibold">{movement.user.name}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du produit</CardTitle>
              <CardDescription>
                Détails du produit concerné
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Nom</dt>
                  <dd className="text-sm font-semibold">{movement.product.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Code</dt>
                  <dd className="text-sm font-semibold">{movement.product.code}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Stock actuel</dt>
                  <dd className="text-sm font-semibold">{movement.product.currentStock}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Emplacement</dt>
                  <dd className="text-sm font-semibold">{movement.product.location || '-'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}