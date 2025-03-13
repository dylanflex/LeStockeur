"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
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
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { userId, getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!userId) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour créer un produit.",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const productData = {
      code: formData.get('code'),
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      unitPrice: formData.get('unitPrice'),
      initialStock: formData.get('initialStock'),
      minimumStock: formData.get('minimumStock'),
      location: formData.get('location')
    };
    
    try {
      const token = await getToken();
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }
      
      toast({
        title: "Produit créé",
        description: "Le nouveau produit a été ajouté avec succès.",
      });
      router.push("/products");
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du produit",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Shell>
      <PageHeader heading="Ajouter un produit" text="Créer un nouveau produit dans votre catalogue">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </PageHeader>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>
              Entrez les informations de base du produit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Code produit</Label>
                <Input id="code" name="code" placeholder="ex: PRD001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input id="name" name="name" placeholder='ex: Écran LCD 24"' required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description détaillée du produit..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select name="category">
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screens">Écrans</SelectItem>
                    <SelectItem value="peripherals">Périphériques</SelectItem>
                    <SelectItem value="cables">Câbles</SelectItem>
                    <SelectItem value="adapters">Adaptateurs</SelectItem>
                    <SelectItem value="storage">Stockage</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Emplacement</Label>
                <Input id="location" name="location" placeholder="ex: Étagère A3" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informations de stock</CardTitle>
            <CardDescription>
              Définissez les paramètres de gestion du stock
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Prix unitaire (€)</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialStock">Stock initial</Label>
                <Input
                  id="initialStock"
                  name="initialStock"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumStock">Stock minimum</Label>
                <Input
                  id="minimumStock"
                  name="minimumStock"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
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
