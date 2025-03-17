"use client"

import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  currentStock: number;
}

interface AuditItem {
  id: number;
  productId: string;
  theoreticalStock: number;
  actualStock: number;
  notes?: string;
}

export default function NewAuditPage() {
  const router = useRouter();
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setAvailableProducts(data.data);
        } else {
          setAvailableProducts([]);
          throw new Error("Invalid data format received from API");
        }
      } catch (error) {
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const addProduct = () => {
    setAuditItems([...auditItems, {
      id: auditItems.length + 1,
      productId: "",
      theoreticalStock: 0,
      actualStock: 0
    }]);
  };

  const updateAuditItem = (index: number, field: keyof AuditItem, value: any) => {
    const updatedItems = [...auditItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = availableProducts.find(p => p.id === value);
      if (product) {
        updatedItems[index].theoreticalStock = product.currentStock;
      }
    }
    
    setAuditItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(),
          notes,
          items: auditItems.map(({ id, ...item }) => item)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create audit");
      }

      toast.success("Audit created successfully");
      router.push("/audits");
    } catch (error) {
      toast.error("Failed to create audit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Shell>
      <PageHeader
        heading="Nouvel Audit"
        text="Créer un nouvel audit d'inventaire"
      />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Détails de l'Audit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Produits à Auditer</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProduct}
                >
                  Ajouter un produit
                </Button>
              </div>

              {auditItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 gap-4 items-end border-b pb-4"
                >
                  <div className="space-y-2">
                    <Label>Produit</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => updateAuditItem(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Théorique</Label>
                    <Input
                      type="number"
                      value={item.theoreticalStock}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantité Comptée</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.actualStock}
                      onChange={(e) => updateAuditItem(index, 'actualStock', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes ou commentaires sur l'audit"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.push('/audits')}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || auditItems.length === 0}
              >
                {isSubmitting ? "Création en cours..." : "Créer l'Audit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Shell>
  );
}