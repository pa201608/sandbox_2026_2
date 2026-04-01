import { Component, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  imports: [TranslocoDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly transloco = inject(TranslocoService);
  protected readonly currentLang = signal<string>('de');

  switchLang(lang: string): void {
    this.transloco.setActiveLang(lang);
    this.currentLang.set(lang);
  }
}
