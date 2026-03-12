import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div class="loading-overlay" *ngIf="loadingService.isLoading()">
      <mat-progress-bar mode="indeterminate" color="primary"></mat-progress-bar>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
      pointer-events: none;
    }
  `]
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
