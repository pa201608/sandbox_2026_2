import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import de from './de.json';
import en from './en.json';

type Translations = Record<string, string>;

const translations: Record<string, Translations> = {
  de: de as Translations,
  en: en as Translations,
};

/**
 * Custom TranslateLoader that bundles all translation files directly
 * into the app — no HTTP request is made at runtime.
 */
export class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<Translations> {
    return of(translations[lang] ?? translations['de']);
  }
}
