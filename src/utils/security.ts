import DOMPurify from 'dompurify';

/**
 * Security Utility for Cross-Site Scripting (XSS) and MySQL Injection Prevention
 */

/**
 * Escapes HTML characters to prevent XSS in raw string renders
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;');
}

/**
 * Sanitizes HTML string using DOMPurify to eliminate XSS payloads (scripts, iframe, onload, javascript: URIs)
 */
export function sanitizeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  if (typeof window !== 'undefined' && DOMPurify.isSupported) {
    return DOMPurify.sanitize(str, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
      ALLOWED_ATTR: ['href', 'title', 'target', 'class'],
      ALLOW_DATA_ATTR: false,
    });
  }
  return escapeHtml(str);
}

/**
 * Neutralizes potential SQL Injection attack vectors from user text inputs
 * Removes dangerous SQL control patterns like single-quotes, comment tokens (-- /*), semicolons, and DDL/DML keywords
 */
export function sanitizeSqlInput(str: string): string {
  if (typeof str !== 'string') return '';

  let sanitized = str;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Strip multi-line comments /* ... */ and single-line comments -- or #
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');
  sanitized = sanitized.replace(/--.*$/gm, '');
  sanitized = sanitized.replace(/#.*$/gm, '');

  // Replace suspicious SQL injection syntax patterns (case-insensitive)
  const sqlKeywords = [
    /\bUNION\s+ALL\b/gi,
    /\bUNION\s+SELECT\b/gi,
    /\bDROP\s+TABLE\b/gi,
    /\bDROP\s+DATABASE\b/gi,
    /\bTRUNCATE\s+TABLE\b/gi,
    /\bDELETE\s+FROM\b/gi,
    /\bINSERT\s+INTO\b/gi,
    /\bALTER\s+TABLE\b/gi,
    /\bUPDATE\s+.*?\s+SET\b/gi,
    /\bOR\s+['"]?1['"]?\s*=\s*['"]?1\b/gi,
    /\bAND\s+['"]?1['"]?\s*=\s*['"]?1\b/gi,
    /\bEXEC\s*\(?/gi,
    /\bEXECUTE\s*\(?/gi,
  ];

  for (const pattern of sqlKeywords) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Escape single quotes for SQL safety if raw concatenation ever occurs
  sanitized = sanitized.replace(/'/g, "''");

  return sanitized.trim();
}

/**
 * Universal Input Sanitizer
 * Applies both XSS HTML DOMPurify/escaping and MySQL Injection protection
 */
export function sanitizeTextInput(str: string): string {
  if (typeof str !== 'string') return '';
  
  // 1. Trim whitespace
  let clean = str.trim();

  // 2. Strip SQL Injection vectors
  clean = sanitizeSqlInput(clean);

  // 3. Sanitize HTML XSS vectors
  clean = sanitizeHtml(clean);

  return clean;
}

/**
 * Sanitizes search query string for safe matching
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';
  
  // Strip control characters, quotes, and regex special operators
  let clean = query.trim().replace(/['"`;\\()\[\]]/g, '');
  clean = sanitizeSqlInput(clean);
  
  return clean;
}

/**
 * Recursively sanitizes all string properties inside an object or array payload
 * Useful before transmitting payload over network or updating application state
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeTextInput(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const sanitizedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitizedObj[key] = sanitizeObject(value);
    }
    return sanitizedObj as T;
  }

  return obj;
}
