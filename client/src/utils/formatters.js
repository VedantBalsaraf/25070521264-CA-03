import { format, formatDistanceToNow, parseISO, isValid, differenceInDays } from 'date-fns';

export function formatDate(date, pattern = 'MMM d, yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Invalid date';
  return format(d, pattern);
}

export function formatRelativeTime(date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Invalid date';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDateTime(date) {
  return formatDate(date, 'MMM d, yyyy h:mm a');
}

export function formatShortDate(date) {
  return formatDate(date, 'MMM d');
}

export function formatTime(date) {
  return formatDate(date, 'h:mm a');
}

export function daysUntil(date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 0;
  return differenceInDays(d, new Date());
}

export function isOverdue(date) {
  return daysUntil(date) < 0;
}

export function truncate(text, length) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text) {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatCompactCurrency(amount, currency = 'INR') {
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'K';
  return '₹' + amount.toString();
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateAvatarColor(name) {
  const colors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function debounce(func, wait) {
  let timeout = null;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle(func, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function cn(...inputs) {
  return inputs
    .flatMap(input => {
      if (typeof input === 'string') return [input];
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([, value]) => value)
          .map(([key]) => key);
      }
      return [];
    })
    .join(' ');
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(data, filename, type = 'text/plain') {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseQueryString(query) {
  const params = new URLSearchParams(query);
  const result = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

export function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry(fn, retries = 3, delay = 1000) {
  return fn().catch(err => {
    if (retries <= 0) throw err;
    return sleep(delay).then(() => retry(fn, retries - 1, delay * 2));
  });
}