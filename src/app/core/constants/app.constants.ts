/** Allowed URL schemes — blocks javascript:, data:, file:, etc. */
export const ALLOWED_URL_PROTOCOLS = ['http:', 'https:'] as const;

/** Theme persistence key (namespaced to avoid collisions). */
export const THEME_STORAGE_KEY = 'genqr-theme';

/** Maximum URL length accepted for QR encoding (prevents abuse / oversized payloads). */
export const MAX_URL_LENGTH = 2048;

/** QR pattern background (local asset preferred over hotlinking). */
export const BACKGROUND_PATTERN_URL = 'assets/bg-pattern.jpg';
