import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/site-header";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className={cn("flex-1 container py-6", className)} {...props}>
        {children}
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2024 StockMaster. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}