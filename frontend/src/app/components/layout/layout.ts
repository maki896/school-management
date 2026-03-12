import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <mat-toolbar class="app-toolbar glass-nav">
      <span class="logo-text" routerLink="/" style="cursor: pointer;">SchoolSys</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.currentUser$ | async as user; else noUser">
        <button mat-icon-button class="notification-btn" aria-label="Notifications">
          <mat-icon>notifications</mat-icon>
          <span class="notification-badge"></span>
        </button>
        <span class="user-chip status-chip primary" (click)="goToDashboard()" style="cursor: pointer;" matTooltip="Go to Dashboard">
          <mat-icon inline="true" class="acc-icon">dashboard</mat-icon>
          {{user.name}} 
          <span class="role-badge">{{user.role}}</span>
        </span>
        <button mat-button class="logout-btn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </ng-container>
      <ng-template #noUser>
        <button mat-button routerLink="/login" class="nav-btn">Login</button>
        <button mat-raised-button color="primary" routerLink="/register" class="nav-btn-primary">Get Started</button>
      </ng-template>
    </mat-toolbar>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo-text-small">SchoolSys</span>
          <p>© 2026 EduSmart Platform</p>
        </div>
        <div class="footer-links">
          <a routerLink="/">Home</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
        <div class="footer-status">
          <span class="status-indicator"></span> System Online
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .glass-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.85) !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0 40px;
      height: 72px;
      color: #111827 !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important;
    }
    .logo-text {
      font-weight: 800;
      letter-spacing: -0.5px;
      font-size: 24px;
      background: linear-gradient(135deg, #4f46e5 0%, #c026d3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .main-content {
      padding: 32px 24px;
      min-height: calc(100vh - 72px);
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .notification-btn {
      color: #6b7280;
      margin-right: 16px;
      position: relative;
    }
    .notification-btn:hover {
      color: #111827;
      background: rgba(0,0,0,0.04);
    }
    .notification-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background-color: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
    }
    .user-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-right: 16px;
      background: #f3f4f6 !important;
      color: #111827 !important;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
    }
    .acc-icon {
      font-size: 18px;
      color: #4f46e5;
    }
    .role-badge {
      background: #e0e7ff;
      color: #4338ca;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-left: 4px;
    }
    .logout-btn {
      color: #ef4444 !important;
      font-weight: 500 !important;
    }
    .logout-btn:hover {
      background: #fef2f2 !important;
    }
    .nav-btn {
      color: #374151 !important;
      font-weight: 500 !important;
      margin-right: 8px;
    }
    .nav-btn-primary {
      border-radius: 8px !important;
      padding: 0 24px !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2) !important;
    }
    .app-footer {
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      padding: 40px 0;
      margin-top: auto;
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
    }
    .logo-text-small {
      font-weight: 700;
      color: #4f46e5;
      font-size: 18px;
    }
    .footer-brand p { color: #6b7280; font-size: 13px; margin: 4px 0 0; }
    .footer-links { display: flex; gap: 24px; }
    .footer-links a { color: #4b5563; text-decoration: none; font-size: 14px; font-weight: 500; }
    .footer-links a:hover { color: #4f46e5; }
    .footer-status { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #059669; font-weight: 600; }
    .status-indicator { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
  `]
})
export class LayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
  }

  goToDashboard() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate([`/${user.role.toLowerCase()}`]);
      }
    });
  }
}
