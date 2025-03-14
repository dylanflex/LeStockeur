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
  switch (type) {
    case "ACHAT":
      return "Achat";
    case "PRODUCTION":
      return "Production";
    case "VENTE":
      return "Vente";
    case "UTILISATION_INTERNE":
      return "Utilisation interne";
    case "AJUSTEMENT":
      return "Ajustement";
    case "RETOUR":
      return "Retour";
    case "PERTE":
      return "Mise au rebut";
    default:
      return type;
  }
}

export function getMovementTypeColor(type: string) {
  const colors: Record<string, string> = {
    ACHAT: 'green',
    PRODUCTION: 'green',
    VENTE: 'red',
    UTILISATION_INTERNE: 'red',
    AJUSTEMENT: 'amber',
    RETOUR: 'green',
    PERTE: 'red',
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