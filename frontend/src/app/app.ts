import { Component } from '@angular/core';
import { LayoutComponent } from './components/layout/layout';
import { LoadingComponent } from './components/loading/loading';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, LoadingComponent],
  template: `
    <app-loading></app-loading>
    <app-layout></app-layout>
  `,
  styleUrl: './app.css',
})
export class App {
  readonly title = 'School Management System';
}
