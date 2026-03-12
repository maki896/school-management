import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="landing-container">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      
      <div class="hero-content">
        <h1 class="hero-title">
          The Next Generation<br>
          <span class="text-gradient">School Management</span>
        </h1>
        <p class="hero-subtitle">
          Streamline your educational institution with our powerful, intuitive, and modern platform designed for administrators, teachers, and students.
        </p>
        
        <div class="hero-actions">
          <button mat-raised-button color="primary" class="action-btn primary-action" routerLink="/register">
            Get Started <mat-icon>arrow_forward</mat-icon>
          </button>
          <button mat-button class="action-btn secondary-action" routerLink="/login">
            Sign In
          </button>
        </div>
        
        <div class="features-grid">
          <div class="feature-card glass-card">
            <div class="feature-icon"><mat-icon>admin_panel_settings</mat-icon></div>
            <h3>Smart Administration</h3>
            <p>Effortlessly manage users, classes, and subjects from a centralized dashboard.</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon"><mat-icon>psychology</mat-icon></div>
            <h3>Teacher Intelligence</h3>
            <p>Grade seamlessly and communicate with students using advanced tools.</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon"><mat-icon>school</mat-icon></div>
            <h3>Student Success</h3>
            <p>Access grades, track progress, and stay updated with class announcements.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      position: relative;
      min-height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
      padding: 40px 24px;
      margin-top: -32px; /* offset layout padding */
    }
    
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: -1;
      opacity: 0.6;
    }
    
    .blob-1 {
      width: 400px;
      height: 400px;
      background: rgba(67, 56, 202, 0.4);
      top: -100px;
      left: -100px;
      animation: float1 10s infinite alternate;
    }
    
    .blob-2 {
      width: 500px;
      height: 500px;
      background: rgba(147, 51, 234, 0.3);
      bottom: -150px;
      right: -100px;
      animation: float2 12s infinite alternate;
    }
    
    @keyframes float1 {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(50px, 50px) scale(1.1); }
    }
    
    @keyframes float2 {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-50px, -50px) scale(1.1); }
    }
    
    .hero-content {
      max-width: 1000px;
      width: 100%;
      z-index: 1;
      animation: slideUp 0.8s ease-out;
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .hero-title {
      font-size: 56px;
      line-height: 1.1;
      font-weight: 800;
      color: #111827;
      margin-bottom: 24px;
      letter-spacing: -0.03em;
    }
    
    .text-gradient {
      background: linear-gradient(135deg, #4f46e5 0%, #c026d3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 20px;
      color: #4b5563;
      max-width: 600px;
      margin: 0 auto 40px;
      line-height: 1.6;
    }
    
    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 80px;
    }
    
    .action-btn {
      height: 56px;
      padding: 0 32px;
      font-size: 18px;
      font-weight: 600;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .primary-action {
      background: #4f46e5;
      color: white;
      box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .primary-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(79, 70, 229, 0.4);
    }
    
    .secondary-action {
      border: 2px solid #e5e7eb;
      background: white;
      color: #374151;
      transition: border-color 0.2s, background 0.2s;
    }
    
    .secondary-action:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .feature-card {
      padding: 32px;
      text-align: left;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }
    
    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .feature-icon {
      width: 48px;
      height: 48px;
      background: #e0e7ff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      color: #4f46e5;
    }
    
    .feature-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .feature-card h3 {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 12px 0;
    }
    
    .feature-card p {
      margin: 0;
      color: #6b7280;
      line-height: 1.5;
    }
  `]
})
export class LandingComponent {}
