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
