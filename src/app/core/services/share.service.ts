import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ShareLink, SharePlatform } from '../models/share-platform';
import { ToastService } from './toast.service';

/** Trusted share endpoint origins — only these are used when building share URLs. */
const SHARE_ORIGINS: Record<SharePlatform, string> = {
  whatsapp: 'https://wa.me/',
  twitter: 'https://twitter.com/intent/tweet',
  facebook: 'https://www.facebook.com/sharer/sharer.php',
  linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
};

@Injectable({ providedIn: 'root' })
export class ShareService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toast = inject(ToastService);

  readonly supportsNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  buildShareLinks(url: string): ShareLink[] {
    const encoded = encodeURIComponent(url);
    return [
      {
        platform: 'whatsapp',
        label: 'WhatsApp',
        href: `${SHARE_ORIGINS.whatsapp}?text=${encoded}`,
      },
      {
        platform: 'twitter',
        label: 'X / Twitter',
        href: `${SHARE_ORIGINS.twitter}?url=${encoded}`,
      },
      {
        platform: 'facebook',
        label: 'Facebook',
        href: `${SHARE_ORIGINS.facebook}?u=${encoded}`,
      },
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        href: `${SHARE_ORIGINS.linkedin}?url=${encoded}`,
      },
    ];
  }

  /** Sanitize external share URLs before binding to [href]. */
  toSafeUrl(href: string): SafeUrl {
    const allowed = Object.values(SHARE_ORIGINS).some((origin) => href.startsWith(origin));
    if (!allowed) {
      return this.sanitizer.bypassSecurityTrustUrl('about:blank');
    }
    return this.sanitizer.bypassSecurityTrustUrl(href);
  }

  async shareNative(url: string): Promise<'shared' | 'cancelled' | 'unsupported' | 'failed'> {
    if (!this.supportsNativeShare) {
      return 'unsupported';
    }
    try {
      await navigator.share({ title: 'Check this out', url });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'cancelled';
      }
      return 'failed';
    }
  }

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      this.toast.show('Copied!');
      return true;
    } catch {
      return this.copyFallback(text);
    }
  }

  private copyFallback(text: string): boolean {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.cssText = 'position:fixed;left:-9999px;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      this.toast.show(ok ? 'Copied!' : 'Copy failed — select the URL manually.');
      return ok;
    } catch {
      this.toast.show('Copy not supported in this browser.');
      return false;
    }
  }
}
