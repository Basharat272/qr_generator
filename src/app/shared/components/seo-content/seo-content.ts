import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-seo-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './seo-content.html',
  styleUrl: './seo-content.scss',
})
export class SeoContentComponent {}
