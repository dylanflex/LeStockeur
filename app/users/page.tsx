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
  Plus, 
  Search, 
  Shield, 
  ShieldAlert, 
  User 
} from "lucide-react";

export default function UsersPage() {
  return (
    <Shell>
      <PageHeader 
        heading="Utilisateurs" 
        text="Gérez les utilisateurs et leurs droits d'accès"
      >
        <Button asChild>
          <Link href="/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Link>
        </Button>
      </PageHeader>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des utilisateurs..."
            className="w-full pl-8"
          />
        </div>
      </div>
      
      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Jean Dupont</span>
                </div>
              </TableCell>
              <TableCell>jean.dupont@example.com</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <ShieldAlert className="mr-1 h-4 w-4 text-destructive" />
                  <span>Administrateur</span>
                </div>
              </TableCell>
              <TableCell>15/01/2025</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/users/user1">Détails</Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Marie Martin</span>
                </div>
              </TableCell>
              <TableCell>marie.martin@example.com</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Shield className="mr-1 h-4 w-4 text-amber-500" />
                  <span>Responsable</span>
                </div>
              </TableCell>
              <TableCell>20/01/2025</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/users/user2">Détails</Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Pierre Durand</span>
                </div>
              </TableCell>
              <TableCell>pierre.durand@example.com</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>Utilisateur</span>
                </div>
              </TableCell>
              <TableCell>25/01/2025</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/users/user3">Détails</Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Sophie Petit</span>
                </div>
              </TableCell>
              <TableCell>sophie.petit@example.com</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>Utilisateur</span>
                </div>
              </TableCell>
              <TableCell>01/02/2025</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/users/user4">Détails</Link>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Shell>
  );
}