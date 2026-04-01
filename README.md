# SandboxApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.5.

---

## i18n — Two approaches explored

This project went through two iterations of internationalisation. Both are documented under [`docs/`](./docs/).

### Branch 1 · ngx-translate

**Package:** `@ngx-translate/core`
**Goal:** Quick integration of a well-known i18n library using a Custom Loader that bundles translations at build time (no HTTP calls).

The approach worked, but ngx-translate is a legacy library with limited standalone-API support. It was replaced in the second iteration.

### Branch 2 · Transloco ← current

**Package:** `@jsverse/transloco`
**Goal:** Modern replacement for ngx-translate, designed for Angular standalone apps. Translations are bundled as an inline loader directly in `app.config.ts` — no separate loader file, no HTTP calls.

Key differences from Branch 1:

| | ngx-translate | Transloco |
|---|---|---|
| Provider | `provideTranslateService()` | `provideTransloco()` |
| Template | `'KEY' \| translate` pipe | `*transloco="let t"` directive |
| Service | `TranslateService.use()` | `TranslocoService.setActiveLang()` |
| Loader file | separate class file | inline class in `app.config.ts` |

See [`docs/transloco-setup.md`](./docs/transloco-setup.md) for the full setup guide.

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
