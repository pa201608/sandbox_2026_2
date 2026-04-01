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
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: InlineLoader,
    }),
  ],
};
