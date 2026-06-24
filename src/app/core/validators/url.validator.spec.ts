import { describe, expect, it } from 'vitest';
import { normalizeUrl } from './url.validator';

describe('normalizeUrl', () => {
  it('rejects empty input', () => {
    expect(normalizeUrl('   ').valid).toBe(false);
  });

  it('prepends https:// when protocol is missing', () => {
    const result = normalizeUrl('example.com');
    expect(result.valid).toBe(true);
    expect(result.url).toBe('https://example.com/');
  });

  it('accepts explicit https URLs', () => {
    const result = normalizeUrl('https://github.com/angular');
    expect(result.valid).toBe(true);
    expect(result.url).toBe('https://github.com/angular');
  });

  it('rejects dangerous schemes', () => {
    expect(normalizeUrl('javascript:alert(1)').valid).toBe(false);
    expect(normalizeUrl('data:text/html,hello').valid).toBe(false);
  });

  it('accepts localhost', () => {
    expect(normalizeUrl('http://localhost:4200').valid).toBe(true);
  });
});
