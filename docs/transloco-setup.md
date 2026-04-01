# Transloco Setup – Angular 21

## Overview

This guide describes the complete integration of **@jsverse/transloco** into an Angular 21 standalone project using an **inline loader** inside `app.config.ts` that bundles translations as JSON objects — no separate loader file, no HTTP requests at runtime.

> Transloco is the successor to `@ngneat/transloco` (deprecated). The current package is `@jsverse/transloco`.

---

## 1. Install the package

```bash
npm install @jsverse/transloco --save
```

> `@jsverse/transloco-http-loader` and `provideHttpClient` are **not required** since we use an inline loader.

---

## 2. TypeScript: enable `resolveJsonModule`

Add `resolveJsonModule` to `tsconfig.json` so that JSON files can be imported directly:

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

> Keys are named in SCREAMING_SNAKE_CASE. Nested structures use dot notation:
> `{ "NAV": { "HOME": "Home" } }` → `t('NAV.HOME')`.

---

## 4. Register Transloco in `app.config.ts`

The `TranslocoLoader` interface requires a `getTranslation(lang)` method that returns an `Observable`. Instead of a separate file, define the loader as an inline class directly in `app.config.ts`. The JSON imports are bundled at build time — no HTTP call is made.

**`src/app/app.config.ts`**

```typescript
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import de from './i18n/de.json';
import en from './i18n/en.json';

const translations: Record<string, Record<string, string>> = { de, en };

class InlineLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Record<string, string>> {
    return of(translations[lang] ?? translations['de']);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideTransloco({
      config: {
        availableLangs: ['de', 'en'],
        defaultLang: 'de',
        reRenderOnLangChange: true,  // re-renders on language switch
        prodMode: !isDevMode(),
      },
      loader: InlineLoader,
    }),
  ],
};
```

`provideTransloco` is the standalone API — no `TranslocoModule.forRoot()` needed.

Key config options:

| Option | Description |
|---|---|
| `availableLangs` | List of supported language codes |
| `defaultLang` | Initial and fallback language |
| `reRenderOnLangChange` | Triggers view update when language changes |
| `prodMode` | Disables missing-key warnings in production |

---

## 5. Update the component

**`src/app/app.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  imports: [TranslocoDirective],   // <-- structural directive
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly transloco = inject(TranslocoService);
  protected readonly currentLang = signal<string>('de');

  switchLang(lang: string): void {
    this.transloco.setActiveLang(lang);  // switch language
    this.currentLang.set(lang);          // signal for active button styling
  }
}
```

Import `TranslocoDirective` (for `*transloco`) or `TranslocoPipe` (for `| transloco`) in the standalone component's `imports` array.

---

## 6. Template: use the `*transloco` structural directive

**`src/app/app.html`**

```html
<main *transloco="let t">
  <nav>
    <button [class.active]="currentLang() === 'de'" (click)="switchLang('de')">DE</button>
    <button [class.active]="currentLang() === 'en'" (click)="switchLang('en')">EN</button>
  </nav>

  <h1>{{ t('TITLE') }}</h1>
  <p>{{ t('DESCRIPTION') }}</p>
</main>
```

`*transloco="let t"` creates a single subscription for the entire template block and exposes `t` as the translation function. When `setActiveLang('en')` is called, the whole block re-renders automatically.

### Alternative: pipe syntax

If you prefer the pipe (import `TranslocoPipe` instead of `TranslocoDirective`):

```html
<h1>{{ 'TITLE' | transloco }}</h1>
<p>{{ 'DESCRIPTION' | transloco }}</p>
```

The structural directive is recommended for templates with multiple keys as it creates only one subscription.

---

## 7. TranslocoService API reference

```typescript
// Switch the active language
this.transloco.setActiveLang('en');

// Get the currently active language
const lang = this.transloco.getActiveLang();

// React to language changes
this.transloco.langChanges$.subscribe(lang => console.log(lang));

// Translate imperatively (outside templates)
const label = this.transloco.translate('TITLE');
```

---

## 8. Directory structure

```
src/app/
├── i18n/
│   ├── de.json          ← German translations
│   └── en.json          ← English translations
├── app.config.ts        ← InlineLoader + provideTransloco(...)
├── app.ts               ← TranslocoDirective + switchLang()
├── app.html             ← *transloco structural directive
└── app.css              ← styles incl. language switcher
```

---

## 9. Adding a new language

1. Create a new file: `src/app/i18n/fr.json`
2. Import it in `app.config.ts` and add it to `translations`:
   ```typescript
   import fr from './i18n/fr.json';
   const translations = { de, en, fr };
   ```
3. Add `'fr'` to `availableLangs` in `provideTransloco`
4. Add a button to the template: `<button (click)="switchLang('fr')">FR</button>`

---

## 10. Run and verify

```bash
npm start
```

Open `http://localhost:4200`. The page starts in German. Clicking **EN** switches to English instantly — no HTTP request is fired (the Network tab in DevTools stays empty for i18n requests).
