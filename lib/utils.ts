import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatString: string = 'dd/MM/yyyy') {
  return format(new Date(date), formatString, { locale: fr });
}

export function formatCurrency(amount: number, currency: string = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getStockStatus(currentStock: number, minimumStock: number) {
  if (currentStock <= 0) {
    return {
      label: 'Rupture',
      color: 'destructive',
    };
  }
  
  if (currentStock < minimumStock) {
    return {
      label: 'Critique',
      color: 'destructive',
    };
  }
  
  if (currentStock < minimumStock * 1.5) {
    return {
      label: 'Faible',
      color: 'amber',
    };
  }
  
  return {
    label: 'OK',
    color: 'green',
  };
}

export function getMovementTypeLabel(type: string) {
  const types: Record<string, string> = {
    PURCHASE: 'Achat',
    PRODUCTION: 'Production',
    SALE: 'Vente',
    INTERNAL_USE: 'Usage interne',
    ADJUSTMENT: 'Ajustement',
    RETURN: 'Retour',
    WASTE: 'Mise au rebut',
  };
  
  return types[type] || type;
}

export function getMovementTypeColor(type: string) {
  const colors: Record<string, string> = {
    PURCHASE: 'green',
    PRODUCTION: 'green',
    SALE: 'red',
    INTERNAL_USE: 'red',
    ADJUSTMENT: 'amber',
    RETURN: 'green',
    WASTE: 'red',
  };
  
  return colors[type] || 'muted';
}

export function getUserRoleLabel(role: string) {
  const roles: Record<string, string> = {
    ADMIN: 'Administrateur',
    MANAGER: 'Responsable',
    USER: 'Utilisateur',
  };
  
  return roles[role] || role;
}

export function getUserRoleColor(role: string) {
  const colors: Record<string, string> = {
    ADMIN: 'destructive',
    MANAGER: 'amber',
    USER: 'muted',
  };
  
  return colors[role] || 'muted';
}

export function generateProductCode(category: string, id: number) {
  const categoryPrefix = category.substring(0, 3).toUpperCase();
  const idPadded = id.toString().padStart(4, '0');
  return `${categoryPrefix}${idPadded}`;
}