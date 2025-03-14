"use client";

import { useState, useEffect } from "react";
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
  CheckCircle2, 
  ClipboardList, 
  Download, 
  Plus, 
  Search 
} from "lucide-react";

interface Audit {
  id: string;
  date: string;
  type: string;
  productsChecked: number;
  discrepancies: number;
  status: 'completed' | 'in_progress' | 'planned';
}

export default function AuditsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await fetch('/api/audits');
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const formattedAudits = result.data.map((audit: any) => ({
            id: audit.id,
            date: new Date(audit.date).toLocaleDateString(),
            type: audit.status || 'N/A',
            productsChecked: audit.items?.length || 0,
            discrepancies: audit.items?.filter((item: any) => item.difference !== 0).length || 0,
            status: audit.status?.toLowerCase() || 'planned'
          }));
          setAudits(formattedAudits);
        } else {
          console.error('Invalid response format:', result);
          setAudits([]);
        }
      } catch (error) {
        console.error('Error fetching audits:', error);
        setAudits([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudits();
  }, []);

  const filteredAudits = audits.filter(audit =>
    audit.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader 
        heading="Inventaires" 
        text="Gérez et suivez les inventaires physiques"
      >
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/audits/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel inventaire
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
            placeholder="Rechercher des inventaires..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Produits vérifiés</TableHead>
              <TableHead>Écarts détectés</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAudits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun inventaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredAudits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell>{new Date(audit.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{audit.type}</TableCell>
                  <TableCell>{audit.productsChecked}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {audit.discrepancies > 0 ? (
                        <>
                          <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
                          <span>{audit.discrepancies} écarts</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                          <span>Aucun écart</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-500">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {audit.status === 'completed' ? 'Complété' : 
                       audit.status === 'in_progress' ? 'En cours' : 'Planifié'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/audits/${audit.id}`}>Détails</Link>
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