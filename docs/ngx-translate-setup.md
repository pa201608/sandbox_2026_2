# ngx-translate Setup – Angular 21

## Overview

This guide describes the complete integration of **ngx-translate v17** into an Angular 21 standalone project using a **Custom Loader** that provides translations as bundled JSON objects — no HTTP requests at runtime.

---

## 1. Install the package

```bash
npm install @ngx-translate/core@17 --save
```

> `@ngx-translate/http-loader` is **not required** since we use a custom loader.

---

## 2. TypeScript: enable `resolveJsonModule`

Add `resolveJsonModule` to `tsconfig.json` so that JSON files can be imported directly as ES modules:

```json
// tsconfig.json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

---

## 3. Create translation files

Create one JSON file per language under `src/app/i18n/`.

**`src/app/i18n/de.json`**
```json
{
  "TITLE": "Meine App",
  "DESCRIPTION": "Willkommen auf dieser einfachen Angular-Seite.",
  "LANG_SWITCH": "Switch to English"
}
```

**`src/app/i18n/en.json`**
```json
{
  "TITLE": "My App",
  "DESCRIPTION": "Welcome to this simple Angular page.",
  "LANG_SWITCH": "Zu Deutsch wechseln"
}
```

> Keys are named in SCREAMING_SNAKE_CASE (e.g. `TITLE`, `NAV.HOME`). For nested structures use dot notation (e.g. `{ "NAV": { "HOME": "Home" } }` → `'NAV.HOME' | translate`).

---

## 4. Implement the Custom Loader

**`src/app/i18n/custom-translate-loader.ts`**

```typescript
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import de from './de.json';
import en from './en.json';

type Translations = Record<string, string>;

const translations: Record<string, Translations> = {
  de: de as Translations,
  en: en as Translations,
};

export class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<Translations> {
    return of(translations[lang] ?? translations['de']);
  }
}
```

### Why no HTTP?

The default `HttpLoader` fetches `/assets/i18n/de.json` at runtime via HTTP. This means:
- A network round-trip on first load
- A dependency on a web server and the `assets` path
- Potential race conditions during app startup

The Custom Loader imports the JSON files **statically at build time**. They are embedded in the JavaScript bundle — no request, no latency, no external dependency.

---

## 5. Register TranslateService in `app.config.ts`

**`src/app/app.config.ts`**

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from './i18n/custom-translate-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
      },
      defaultLanguage: 'de',
    }),
  ],
};
```

`provideTranslateService` is the standalone API introduced in ngx-translate v15. No `TranslateModule.forRoot()` needed.

---

## 6. Update the component

**`src/app/app.ts`**

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [TranslatePipe],     // <-- TranslatePipe must be in imports
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly translate = inject(TranslateService);
  protected readonly currentLang = signal<string>('de');

  ngOnInit(): void {
    this.translate.use('de');   // set initial language
  }

  switchLang(lang: string): void {
    this.translate.use(lang);   // switch language
    this.currentLang.set(lang); // signal for active button styling
  }
}
```

`TranslatePipe` must be listed in the standalone component's `imports` array — no NgModule required.

---

## 7. Template: use the `translate` pipe

**`src/app/app.html`**

```html
<main>
  <nav>
    <button [class.active]="currentLang() === 'de'" (click)="switchLang('de')">DE</button>
    <button [class.active]="currentLang() === 'en'" (click)="switchLang('en')">EN</button>
  </nav>

  <h1>{{ 'TITLE' | translate }}</h1>
  <p>{{ 'DESCRIPTION' | translate }}</p>
</main>
```

The `translate` pipe looks up the given key in the active translations object. After `translate.use('en')`, `'TITLE' | translate` resolves to `"My App"`.

---

## 8. Directory structure

```
src/app/
├── i18n/
│   ├── custom-translate-loader.ts   ← Custom Loader (no HTTP)
│   ├── de.json                      ← German translations
│   └── en.json                      ← English translations
├── app.config.ts                    ← provideTranslateService(...)
├── app.ts                           ← TranslatePipe + switchLang()
├── app.html                         ← translate pipe in template
└── app.css                          ← styles incl. language switcher
```

---

## 9. Adding a new language

1. Create a new file: `src/app/i18n/fr.json`
2. Import it in `custom-translate-loader.ts` and add it to `translations`:
   ```typescript
   import fr from './fr.json';
   const translations = { de, en, fr };
   ```
3. Add a button to the template: `<button (click)="switchLang('fr')">FR</button>`

---

## 10. Run and verify

```bash
npm start
```

Open `http://localhost:4200`. The page starts in German. Clicking **EN** switches to English instantly without a page reload — no HTTP request is fired (the Network tab in DevTools stays empty for i18n requests).
