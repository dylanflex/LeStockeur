"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { 
  ArrowDown, 
  ArrowLeft, 
  ArrowUp, 
  Save 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewMovementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [movementType, setMovementType] = useState(
    searchParams.get("type") === "out" ? "out" : "in"
  );
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const productId = searchParams.get("productId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch products');
        }
        
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;
    const quantityStr = formData.get('quantity') as string;
    const productId = formData.get('product') as string;
    const notes = formData.get('notes') as string;
    const date = formData.get('date') as string;
    
    // Validate required fields
    if (!productId) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un produit.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!reason) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un motif.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!quantityStr || isNaN(parseInt(quantityStr)) || parseInt(quantityStr) <= 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez entrer une quantité valide supérieure à 0.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const quantity = parseInt(quantityStr);
    
    // Determine the movement type based on reason and direction
    let type;
    if (movementType === "in") {
      switch (reason) {
        case "purchase":
          type = "ACHAT";
          break;
        case "production":
          type = "PRODUCTION";
          break;
        case "return":
          type = "RETOUR";
          break;
        case "adjustment":
          type = "AJUSTEMENT";
          break;
        default:
          throw new Error("Invalid movement type");
      }
    } else {
      switch (reason) {
        case "sale":
          type = "VENTE";
          break;
        case "internal":
          type = "UTILISATION_INTERNE";
          break;
        case "waste":
          type = "PERTE";
          break;
        case "adjustment":
          type = "AJUSTEMENT";
          break;
        default:
          throw new Error("Invalid movement type");
      }
    }

    // Calculate the final quantity based on movement type
    const finalQuantity = type === "ADJUSTMENT" ? quantity : (movementType === "out" ? -quantity : quantity);
    
    try {
      const response = await fetch('/api/stock-movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          quantity: finalQuantity,
          productId,
          reason,
          notes,
          date: date || new Date().toISOString(),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create movement');
      }
      
      toast({
        title: "Mouvement enregistré",
        description: "Le mouvement de stock a été enregistré avec succès.",
      });
      router.push("/movements");
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de l'enregistrement du mouvement: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Shell>
        <PageHeader 
          heading="Nouveau mouvement de stock" 
          text="Enregistrer une entrée ou une sortie de stock"
        >
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </PageHeader>
        <div className="mt-6 flex items-center justify-center">
          <p className="text-muted-foreground">Chargement des produits...</p>
        </div>
      </Shell>
    );
  }
  
  return (
    <Shell>
      <PageHeader 
        heading="Nouveau mouvement de stock" 
        text="Enregistrer une entrée ou une sortie de stock"
      >
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </PageHeader>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations du mouvement</CardTitle>
            <CardDescription>
              Sélectionnez le type de mouvement et le produit concerné
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type de mouvement</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={movementType === "in" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setMovementType("in")}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Entrée
                  </Button>
                  <Button
                    type="button"
                    variant={movementType === "out" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setMovementType("out")}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Sortie
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product">Produit</Label>
              <Select name="product" defaultValue={productId || undefined}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder="1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Motif</Label>
              <Select name="reason">
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent>
                  {movementType === "in" ? (
                    <>
                      <SelectItem value="purchase">Achat</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="return">Retour</SelectItem>
                      <SelectItem value="adjustment">Ajustement</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="sale">Vente</SelectItem>
                      <SelectItem value="internal">Usage interne</SelectItem>
                      <SelectItem value="waste">Mise au rebut</SelectItem>
                      <SelectItem value="adjustment">Ajustement</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Informations complémentaires..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Enregistrement...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Shell>
  );
}