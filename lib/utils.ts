import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parse a number from string, returning default value on error
 */
export function safeParseFloat(value: string | number, defaultValue: number = 0): number {
  if (typeof value === 'number') return isNaN(value) ? defaultValue : value;
  if (!value || typeof value !== 'string') return defaultValue;
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parse an integer from string, returning default value on error
 */
export function safeParseInt(value: string | number, defaultValue: number = 0): number {
  if (typeof value === 'number') return isNaN(value) ? defaultValue : Math.floor(value);
  if (!value || typeof value !== 'string') return defaultValue;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Format currency with proper decimals
 */
export function formatCurrency(value: number | string, decimals: number = 2): string {
  const num = safeParseFloat(value);
  return num.toFixed(decimals);
}

/**
 * Truncate string to max length with ellipsis
 */
export function truncate(str: string, maxLength: number = 50): string {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
