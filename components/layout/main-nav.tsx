"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect } from 'react'
import { 
  BarChart3, 
  BoxIcon, 
  ClipboardList, 
  Home, 
  PackageOpen, 
  Settings, 
  Users 
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { checkAndAddUser } from "@/lib/actions";

const mainNavItems = [
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

export function MainNav() {
  const {user} = useUser()
  const pathname = usePathname();

  useEffect(() => {
    if(user?.primaryEmailAddress?.emailAddress && user.fullName && user.id){
       checkAndAddUser(user?.primaryEmailAddress?.emailAddress, user.fullName, user.id)
    }
} , [user])

  return (
    <div className="mr-4 hidden md:flex">
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
      </nav>
    </div>
  );
}