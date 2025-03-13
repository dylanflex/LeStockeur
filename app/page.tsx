import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Gestion d'inventaire simplifiée
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  StockMaster
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  La solution complète pour gérer votre inventaire, suivre les mouvements de stock et optimiser votre chaîne d'approvisionnement.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    <PackageOpen className="mr-2 h-5 w-5" />
                    Accéder au tableau de bord
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/products">
                    Voir les produits
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <PackageOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Gestion des produits</h3>
                    <p className="text-muted-foreground">
                      Créez et gérez votre catalogue de produits avec tous les détails nécessaires.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 2v20" />
                      <path d="M2 5h20" />
                      <path d="M3 3v2" />
                      <path d="M7 3v2" />
                      <path d="M11 3v2" />
                      <path d="M15 3v2" />
                      <path d="M19 3v2" />
                      <path d="m2 10 10 5 10-5" />
                      <path d="m2 15 10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Suivi des mouvements</h3>
                    <p className="text-muted-foreground">
                      Enregistrez toutes les entrées et sorties de stock avec une traçabilité complète.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Rapports et analyses</h3>
                    <p className="text-muted-foreground">
                      Générez des rapports détaillés et visualisez les tendances de votre inventaire.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}