import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly translate = inject(TranslateService);
  protected readonly currentLang = signal<string>('de');

  ngOnInit(): void {
    this.translate.use('de');
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
  }
}
