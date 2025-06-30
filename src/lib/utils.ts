import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BoostSummary } from "./validation"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sistema de colores para indicadores de stock y pricing
export function getCodeColorClass(codigo: string, boostSummary: BoostSummary): string {
  if (!codigo) return '';
  
  const hasStock = boostSummary.products_with_stock.includes(codigo);
  const hasPricing = boostSummary.products_with_pricing.includes(codigo);
  
  if (hasStock && hasPricing) {
    return 'bg-green-100 text-green-800 border-green-200'; // Verde - ambos
  }
  if (hasStock) {
    return 'bg-blue-100 text-blue-800 border-blue-200'; // Azul - solo stock
  }
  if (hasPricing) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Amarillo - solo pricing
  }
  return 'bg-gray-100 text-gray-600 border-gray-200'; // Gris - ninguno
}

// Función para obtener el color hex para Excel
export function getCodeColorHex(codigo: string, boostSummary: BoostSummary): string {
  if (!codigo) return '';
  
  const hasStock = boostSummary.products_with_stock.includes(codigo);
  const hasPricing = boostSummary.products_with_pricing.includes(codigo);
  
  if (hasStock && hasPricing) {
    return 'C6F6D5'; // Verde claro
  }
  if (hasStock) {
    return 'DBEAFE'; // Azul claro
  }
  if (hasPricing) {
    return 'FEF3C7'; // Amarillo claro
  }
  return 'F3F4F6'; // Gris claro
}

// Función para obtener el texto del indicador
export function getIndicatorText(codigo: string, boostSummary: BoostSummary): string {
  if (!codigo) return '';
  
  const hasStock = boostSummary.products_with_stock.includes(codigo);
  const hasPricing = boostSummary.products_with_pricing.includes(codigo);
  
  if (hasStock && hasPricing) {
    return 'Stock + Costos';
  }
  if (hasStock) {
    return 'Solo Stock';
  }
  if (hasPricing) {
    return 'Solo Costos';
  }
  return 'Sin Stock/Costos';
}

// Componente de leyenda de colores
export const COLOR_LEGEND = [
  { color: 'bg-green-100 text-green-800', label: '🟢 Stock + Lista de costos', icon: '●' },
  { color: 'bg-blue-100 text-blue-800', label: '🔵 Solo con stock', icon: '●' },
  { color: 'bg-yellow-100 text-yellow-800', label: '🟡 Solo en lista de costos', icon: '●' },
  { color: 'bg-gray-100 text-gray-600', label: '⚫ Sin stock ni costos', icon: '●' },
];
