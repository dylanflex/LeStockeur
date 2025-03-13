"use client";

import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertTriangle, 
  ArrowDown, 
  ArrowUp, 
  Download, 
  Plus, 
  Search 
} from "lucide-react";


import { useState, useEffect } from "react";

export default function MovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await fetch('/api/stock-movements');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch movements');
        }
        
        setMovements(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovements();
  }, []);

  if (isLoading) {
    return (
      <Shell>
        <PageHeader 
          heading="Mouvements de stock" 
          text="Suivez toutes les entrées et sorties de votre inventaire"
        >
          <div className="flex items-center gap-2">
            <Button disabled>Chargement...</Button>
          </div>
        </PageHeader>
        <div className="mt-6 flex items-center justify-center">
          <p className="text-muted-foreground">Chargement des mouvements...</p>
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <PageHeader 
          heading="Mouvements de stock" 
          text="Suivez toutes les entrées et sorties de votre inventaire"
        >
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/movements/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau mouvement
              </Link>
            </Button>
          </div>
        </PageHeader>
        <div className="mt-6 flex items-center justify-center">
          <p className="text-destructive">Erreur: {error}</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader 
        heading="Mouvements de stock" 
        text="Suivez toutes les entrées et sorties de votre inventaire"
      >
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/movements/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau mouvement
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </PageHeader>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des mouvements..."
            className="w-full pl-8"
          />
        </div>
      </div>
      
      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Aucun mouvement trouvé
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{new Date(movement.date).toLocaleDateString()}</TableCell>
                  <TableCell>{movement.product.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {movement.type === "PURCHASE" || movement.type === "PRODUCTION" || movement.type === "RETURN" ? (
                        <>
                          <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>Entrée</span>
                        </>
                      ) : movement.type === "SALE" || movement.type === "INTERNAL_USE" || movement.type === "WASTE" ? (
                        <>
                          <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                          <span>Sortie</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
                          <span>Ajustement</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                  <TableCell>{movement.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/movements/${movement.id}`}>Détails</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Shell>
  );
}