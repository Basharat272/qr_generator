import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAX_URL_LENGTH } from '../../core/constants/app.constants';
import { ShareLink } from '../../core/models/share-platform';
import { QrCodeService } from '../../core/services/qr-code.service';
import { ShareService } from '../../core/services/share.service';
import { ThemeService } from '../../core/services/theme.service';
import { ToastService } from '../../core/services/toast.service';
import { normalizeUrl, urlValidator } from '../../core/validators/url.validator';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-qr-generator',
  imports: [ReactiveFormsModule, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './qr-generator.html',
  styleUrl: './qr-generator.scss',
})
export class QrGeneratorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly qrCode = inject(QrCodeService);
  private readonly shareService = inject(ShareService);
  private readonly theme = inject(ThemeService);
  private readonly toast = inject(ToastService);

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');

  readonly form = this.fb.nonNullable.group({
    url: ['', [Validators.required, Validators.maxLength(MAX_URL_LENGTH), urlValidator()]],
  });

  readonly isGenerating = signal(false);
  readonly hasQr = signal(false);
  readonly showQr = signal(false);
  readonly currentUrl = signal('');
  readonly submitError = signal('');
  readonly downloadOpen = signal(false);
  readonly shareOpen = signal(false);
  readonly shareLinks = signal<ShareLink[]>([]);
  readonly supportsNativeShare = this.shareService.supportsNativeShare;

  constructor() {
    effect(() => {
      this.theme.theme();
      const url = this.currentUrl();
      if (this.hasQr() && url) {
        void this.renderQr(url, true);
      }
    });
  }

  ngOnInit(): void {
    this.theme.apply(this.theme.theme());
    this.clearErrors();
  }

  @HostListener('window:pageshow', ['$event'])
  onPageShow(event: PageTransitionEvent): void {
    if (event.persisted) {
      this.clearErrors();
    }
  }

  get urlControl() {
    return this.form.controls.url;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDropdowns();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdowns();
  }

  async onSubmit(): Promise<void> {
    this.submitError.set('');
    const raw = this.urlControl.value;
    const result = normalizeUrl(raw);

    if (!result.valid) {
      this.submitError.set(result.error);
      this.urlControl.markAsTouched();
      return;
    }

    this.urlControl.setValue(result.url);
    await this.renderQr(result.url);
  }

  toggleDownload(event: Event): void {
    event.stopPropagation();
    this.shareOpen.set(false);
    this.downloadOpen.update((v) => !v);
  }

  async onDownload(format: 'png' | 'svg', event: Event): Promise<void> {
    event.stopPropagation();
    this.closeDropdowns();

    const url = this.currentUrl();
    if (!url) return;

    try {
      if (format === 'png') {
        const canvas = this.canvasRef()?.nativeElement;
        if (!canvas) return;
        const dataUrl = this.qrCode.toPngDataUrl(canvas);
        this.triggerDownload(dataUrl, `${this.qrCode.sanitizeFilename('qrcode')}.png`);
      } else {
        const svg = await this.qrCode.renderToSvgString(url);
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        this.triggerDownload(blobUrl, `${this.qrCode.sanitizeFilename('qrcode')}.svg`);
        URL.revokeObjectURL(blobUrl);
      }
      this.toast.show(`Downloaded qrcode.${format}`);
    } catch {
      this.toast.show('Download failed — please try again.');
    }
  }

  async onCopyLink(): Promise<void> {
    const url = this.currentUrl();
    if (url) {
      await this.shareService.copyToClipboard(url);
    }
  }

  async onShare(event: Event): Promise<void> {
    event.stopPropagation();
    const url = this.currentUrl();
    if (!url) return;

    if (this.supportsNativeShare) {
      const result = await this.shareService.shareNative(url);
      if (result !== 'unsupported' && result !== 'failed') {
        return;
      }
    }

    this.downloadOpen.set(false);
    this.shareLinks.set(this.shareService.buildShareLinks(url));
    this.shareOpen.update((v) => !v);
  }

  safeShareUrl(href: string) {
    return this.shareService.toSafeUrl(href);
  }

  onInputChange(): void {
    this.clearErrors();
  }

  private clearErrors(): void {
    this.submitError.set('');
    this.urlControl.markAsUntouched();
    this.urlControl.markAsPristine();
  }

  private async renderQr(url: string, silent = false): Promise<void> {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    if (!silent) {
      this.isGenerating.set(true);
    }

    try {
      await this.qrCode.renderToCanvas(canvas, url);
      this.currentUrl.set(url);
      this.hasQr.set(true);
      this.showQr.set(false);
      requestAnimationFrame(() => this.showQr.set(true));
    } catch {
      this.submitError.set('Could not generate QR code. Please try a shorter link.');
    } finally {
      if (!silent) {
        this.isGenerating.set(false);
      }
    }
  }

  private triggerDownload(href: string, filename: string): void {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  private closeDropdowns(): void {
    this.downloadOpen.set(false);
    this.shareOpen.set(false);
  }
}
