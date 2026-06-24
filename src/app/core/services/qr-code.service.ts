import { Injectable, inject } from '@angular/core';
import QRCode, { QRCodeRenderersOptions } from 'qrcode';
import { ThemeService } from './theme.service';

export interface QrRenderOptions {
  readonly width: number;
  readonly margin: number;
  readonly errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  readonly color: { readonly dark: string; readonly light: string };
}

@Injectable({ providedIn: 'root' })
export class QrCodeService {
  private readonly theme = inject(ThemeService);

  getOptions(): QrRenderOptions {
    const isDark = this.theme.theme() === 'dark';
    return {
      width: 280,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: isDark ? '#f0eeff' : '#1a1633',
        light: isDark ? '#1a1730' : '#ffffff',
      },
    };
  }

  async renderToCanvas(canvas: HTMLCanvasElement, text: string): Promise<void> {
    await QRCode.toCanvas(canvas, text, this.getOptions() as QRCodeRenderersOptions);
  }

  async renderToSvgString(text: string): Promise<string> {
    return QRCode.toString(text, {
      ...this.getOptions(),
      type: 'svg',
    } as QRCodeRenderersOptions);
  }

  toPngDataUrl(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
  }

  /** Sanitize download filename — strips path traversal and unsafe characters. */
  sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 64) || 'qrcode';
  }
}
