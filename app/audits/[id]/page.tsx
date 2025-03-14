"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();

  const [audit, setAudit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const response = await fetch(`/api/audits/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch audit');
        }
        
        setAudit(data);
        setReviewNotes(data.reviewNotes || "");
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAudit();
  }, [params.id]);

  const updateAuditStatus = async (newStatus: string) => {
    setIsSubmitting(true);
    try {
      const endpoint = newStatus === 'APPROVED' ? `/api/audits/${params.id}/approve` :
                      newStatus === 'REJECTED' ? `/api/audits/${params.id}/reject` :
                      `/api/audits/${params.id}`;
      
      const response = await fetch(endpoint, {
        method: newStatus === 'APPROVED' || newStatus === 'REJECTED' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          reviewNotes,
          reviewerId: "user_id" // TODO: Get from auth context
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update audit');
      }

      setAudit(data);
      toast({
        title: "Audit mis à jour",
        description: `Le statut a été changé en ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Shell>
        <PageHeader 
          heading="Détails de l'inventaire" 
          text="Consultez et validez les détails de l'inventaire"
        >
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </PageHeader>
        <div className="mt-6 flex items-center justify-center">
          <p className="text-muted-foreground">Chargement des détails...</p>
        </div>
      </Shell>
    );
  }

  if (error || !audit) {
    return (
      <Shell>
        <PageHeader 
          heading="Détails de l'inventaire" 
          text="Consultez et validez les détails de l'inventaire"
        >
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </PageHeader>
        <div className="mt-6 flex items-center justify-center">
          <p className="text-destructive">Erreur: {error || 'Audit non trouvé'}</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader 
        heading="Détails de l'inventaire" 
        text="Consultez et validez les détails de l'inventaire"
      >
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </PageHeader>

      <div className="mt-6 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Détails de base de l'inventaire</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                <dd className="text-sm">{new Date(audit.date).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${audit.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      audit.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      audit.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {audit.status}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Opérateur</dt>
                <dd className="text-sm">{audit.user?.name || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Validateur</dt>
                <dd className="text-sm">{audit.reviewer?.name || "N/A"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits inventoriés</CardTitle>
            <CardDescription>Liste des produits et leurs différences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audit.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">{item.product.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Théorique: {item.theoreticalStock}</p>
                    <p className="text-sm">Réel: {item.actualStock}</p>
                    <p className={`font-medium ${item.difference < 0 ? "text-red-500" : item.difference > 0 ? "text-green-500" : ""}`}>
                      Différence: {item.difference}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation</CardTitle>
            <CardDescription>Gérez le statut de l'inventaire</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes de validation</label>
                <Textarea
                  placeholder="Ajoutez des notes de validation..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  disabled={audit.status !== 'DRAFT' && audit.status !== 'PENDING'}
                />
              </div>

              <div className="flex gap-2">
                {audit.status === 'DRAFT' && (
                  <Button
                    onClick={() => updateAuditStatus('PENDING')}
                    disabled={isSubmitting}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Soumettre pour validation
                  </Button>
                )}

                {audit.status === 'PENDING' && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => updateAuditStatus('APPROVED')}
                      disabled={isSubmitting}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approuver
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateAuditStatus('REJECTED')}
                      disabled={isSubmitting}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeter
                    </Button>
                  </>
                )}

                {(audit.status === 'APPROVED' || audit.status === 'REJECTED') && (
                  <Button
                    variant="outline"
                    onClick={() => updateAuditStatus('DRAFT')}
                    disabled={isSubmitting}
                  >
                    Repasser en brouillon
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}