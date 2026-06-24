import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { QrGeneratorComponent } from './features/qr-generator/qr-generator';
import { SeoService } from './core/services/seo.service';
import { SeoContentComponent } from './shared/components/seo-content/seo-content';
import { ToastComponent } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [QrGeneratorComponent, SeoContentComponent, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.applyDefaults();
  }
}
