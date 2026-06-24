import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ALLOWED_URL_PROTOCOLS, MAX_URL_LENGTH } from '../constants/app.constants';
import { UrlValidationResult } from '../models/url-validation-result';

const PROTOCOL_PREFIX_RE = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;

/**
 * Validates and normalizes a raw URL string.
 * Trims whitespace, prepends https:// when missing, and enforces http/https only.
 */
export function normalizeUrl(raw: string): UrlValidationResult {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { valid: false, url: '', error: 'Please enter a link before generating.' };
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    return { valid: false, url: '', error: `URL must be under ${MAX_URL_LENGTH} characters.` };
  }

  let candidate = trimmed;
  if (!PROTOCOL_PREFIX_RE.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);

    if (!ALLOWED_URL_PROTOCOLS.includes(parsed.protocol as (typeof ALLOWED_URL_PROTOCOLS)[number])) {
      return { valid: false, url: '', error: 'Only http and https links are supported.' };
    }

    const host = parsed.hostname;
    if (!host || (!host.includes('.') && host !== 'localhost')) {
      return {
        valid: false,
        url: '',
        error: 'That doesn’t look like a valid URL. Try something like example.com.',
      };
    }

    return { valid: true, url: parsed.href, error: '' };
  } catch {
    return {
      valid: false,
      url: '',
      error: 'That doesn’t look like a valid URL. Try something like example.com.',
    };
  }
}

/** Angular reactive-forms validator wrapping {@link normalizeUrl}. */
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = typeof control.value === 'string' ? control.value : '';
    if (!value.trim()) {
      return null;
    }
    const result = normalizeUrl(value);
    return result.valid ? null : { invalidUrl: result.error };
  };
}
