import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Timezone-invariant date formatter.
 * Guarantees identical output on both SSR (Node.js) and Browser regardless of client timezone.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    // If it's formatted as YYYY-MM-DD (e.g. 2026-10-24)
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = match[1];
      const monthIdx = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[monthIdx]} ${day}, ${year}`;
    }

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Strict en-US number formatter.
 * Prevents OS locale mismatch (e.g. 1,000 vs 1.000).
 */
export function formatNumber(num: number): string {
  if (num === null || num === undefined) return '0';
  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString('en-US');
}

/**
 * Strict USD currency formatter.
 */
export function formatCurrency(amount: number): string {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number, includeSign = false): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Client-side CSV Exporter.
 */
export function exportToCSV<T extends Record<string, any>>(filename: string, rows: T[]): void {
  if (typeof window === 'undefined') return;
  if (!rows || !rows.length) {
    console.warn('[CSV Export] No data available to export');
    return;
  }

  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toISOString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
