"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  BarChart3, 
  BoxIcon, 
  ClipboardList, 
  Home, 
  Menu, 
  PackageOpen, 
  Settings, 
  Users 
} from "lucide-react";

const mobileNavItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Produits",
    href: "/products",
    icon: BoxIcon,
  },
  {
    title: "Mouvements",
    href: "/movements",
    icon: PackageOpen,
  },
  {
    title: "Inventaires",
    href: "/audits",
    icon: ClipboardList,
  },
  {
    title: "Rapports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-4">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}