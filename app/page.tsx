import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Gestion d'inventaire simplifiée
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Magasinkat
                </h1>
                <p className="mx-auto max-w-[90%] sm:max-w-[85%] md:max-w-[700px] text-base sm:text-lg text-muted-foreground md:text-xl">
                  La solution complète pour gérer votre inventaire, suivre les mouvements de stock et optimiser votre chaîne d'approvisionnement.
                </p>
              </div>
              <div className="flex flex-col w-full sm:w-auto gap-3 sm:flex-row sm:gap-4 justify-center px-4 sm:px-0">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/dashboard">
                    <PackageOpen className="mr-2 h-5 w-5" />
                    Accéder au tableau de bord
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/products">
                    Voir les produits
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <PackageOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Gestion des produits</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Créez et gérez votre catalogue de produits avec tous les détails nécessaires.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
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
                    <h3 className="text-lg sm:text-xl font-bold">Suivi des mouvements</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Enregistrez toutes les entrées et sorties de stock avec une traçabilité complète.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
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
                    <h3 className="text-lg sm:text-xl font-bold">Rapports et analyses</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Générez des rapports détaillés pour prendre des décisions éclairées.
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