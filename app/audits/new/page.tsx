"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const auditFormSchema = z.object({
  productId: z.string().optional(),
  quantity: z.number().min(0, "La quantité doit être positive"),
  notes: z.string().optional(),
});

type AuditFormValues = z.infer<typeof auditFormSchema>;

export default function NewAuditPage({
  searchParams,
}: {
  searchParams: { productId?: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      productId: searchParams.productId,
      quantity: 0,
      notes: "",
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!searchParams.productId) return;

      try {
        const response = await fetch(`/api/products/${searchParams.productId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch product");
        }

        setProduct(data);
      } catch (error: any) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load product data",
          variant: "destructive",
        });
      }
    };

    fetchProduct();
  }, [searchParams.productId, toast]);

  async function onSubmit(data: AuditFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create audit");
      }

      toast({
        title: "Inventaire enregistré",
        description: "L'inventaire a été enregistré avec succès.",
      });

      router.push(`/products/${searchParams.productId}`);
    } catch (error: any) {
      console.error("Error creating audit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create audit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Shell>
      <PageHeader
        heading="Nouvel inventaire"
        text={product ? `Produit: ${product.name}` : "Sélectionnez un produit"}
      >
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informations d'inventaire</CardTitle>
            <CardDescription>
              Entrez les détails de l'inventaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité physique</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Entrez la quantité physique constatée
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ajoutez des notes sur l'inventaire..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Enregistrement..." : "Enregistrer l'inventaire"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {product && (
          <Card>
            <CardHeader>
              <CardTitle>Informations produit</CardTitle>
              <CardDescription>Détails du produit sélectionné</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Code
                  </dt>
                  <dd className="text-sm font-semibold">
                    {product.code ?? "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Stock théorique
                  </dt>
                  <dd className="text-sm font-semibold">
                    {product.currentStock ?? 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Emplacement
                  </dt>
                  <dd className="text-sm">{product.location ?? "Non spécifié"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </Shell>
  );
}