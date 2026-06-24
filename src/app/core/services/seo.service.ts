import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_CONFIG } from '../constants/seo.constants';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  applyDefaults(): void {
    const pageTitle = `${SITE_CONFIG.tagline} | Generate QR Free Online — ${SITE_CONFIG.name}`;
    const canonical = SITE_CONFIG.url;

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ name: 'description', content: SITE_CONFIG.description });
    this.meta.updateTag({ name: 'keywords', content: SITE_CONFIG.keywords.join(', ') });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    this.meta.updateTag({ name: 'author', content: SITE_CONFIG.name });
    this.meta.updateTag({ name: 'application-name', content: SITE_CONFIG.name });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_CONFIG.name });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: SITE_CONFIG.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:locale', content: SITE_CONFIG.locale });
    this.meta.updateTag({ property: 'og:image', content: `${canonical}/og-image.svg` });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: SITE_CONFIG.description });
    this.meta.updateTag({ name: 'twitter:image', content: `${canonical}/og-image.svg` });

    this.setCanonical(canonical);
    this.injectStructuredData(canonical, pageTitle);
  }

  private setCanonical(url: string): void {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private injectStructuredData(url: string, pageTitle: string): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${url}/#website`,
          url,
          name: SITE_CONFIG.name,
          description: SITE_CONFIG.description,
          inLanguage: 'en-US',
        },
        {
          '@type': 'WebApplication',
          '@id': `${url}/#app`,
          name: SITE_CONFIG.name,
          url,
          description: SITE_CONFIG.description,
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: [
            'Free QR code generation',
            'PNG and SVG download',
            'No signup required',
            '100% client-side and private',
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': `${url}/#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How do I generate a QR code for free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Paste any URL into GenQR and click Generate QR Code. Your QR code is created instantly in your browser with no signup and no cost.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is this QR generator really free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. GenQR is a completely free QR code generator with no watermarks, no limits, and no account required.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is my data private when I generate a QR code?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. GenQR runs 100% in your browser. Your links are never sent to a server.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I download my QR code as PNG or SVG?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. After generating, you can download your QR code as a PNG image or SVG vector file.',
              },
            },
          ],
        },
        {
          '@type': 'WebPage',
          '@id': `${url}/#webpage`,
          url,
          name: pageTitle,
          description: SITE_CONFIG.description,
          isPartOf: { '@id': `${url}/#website` },
          about: { '@id': `${url}/#app` },
        },
      ],
    };

    const scriptId = 'genqr-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }
}
