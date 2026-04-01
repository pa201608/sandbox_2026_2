import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Meine App');
  protected readonly description = signal('Willkommen auf dieser einfachen Angular-Seite.');
}
