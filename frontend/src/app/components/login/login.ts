import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <div class="overlay"></div>
      <mat-card class="login-card glass-card">
        <mat-card-header class="header-center">
          <div mat-card-avatar class="logo-avatar">
            <mat-icon>school</mat-icon>
          </div>
          <mat-card-title class="modern-title">Welcome Back</mat-card-title>
          <mat-card-subtitle class="modern-subtitle">Sign in to School Management System</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="modern-input">
              <mat-label>Email Address</mat-label>
              <mat-icon matPrefix class="input-icon">email</mat-icon>
              <input matInput formControlName="email" type="email" placeholder="Enter email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="modern-input">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix class="input-icon">lock</mat-icon>
              <input matInput formControlName="password" type="password" placeholder="Enter password">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid" class="submit-btn">
              Sign In
            </button>
          </form>
        </mat-card-content>
        <mat-card-footer class="login-footer">
          <p class="register-text">Don't have an account? <a routerLink="/register" class="register-link">Create one</a></p>
        </mat-card-footer>

        <div class="demo-selector-panel">
          <p class="demo-label">Demo Credentials (Click to fill)</p>
          <div class="demo-chips">
             <button type="button" mat-stroked-button color="accent" (click)="fillDemo('Admin')" class="demo-btn">Admin</button>
             <button type="button" mat-stroked-button color="accent" (click)="fillDemo('Teacher')" class="demo-btn">Teacher</button>
             <button type="button" mat-stroked-button color="accent" (click)="fillDemo('Student')" class="demo-btn">Student</button>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      position: relative;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 50% 0%, rgba(67, 56, 202, 0.1) 0%, transparent 60%);
      pointer-events: none;
    }
    .login-card {
      width: 420px;
      padding: 40px 24px 24px;
      z-index: 1;
      border: 1px solid rgba(255,255,255,0.8);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      background: rgba(255,255,255,0.9);
    }
    .header-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 32px;
      text-align: center;
    }
    .logo-avatar {
      background: #e0e7ff;
      color: #4338ca;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .logo-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .modern-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    .modern-subtitle {
      color: #6b7280;
      font-size: 14px;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .modern-input {
      width: 100%;
    }
    .input-icon {
      color: #9ca3af;
      margin-right: 8px;
    }
    .submit-btn {
      margin-top: 16px;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      background: #4338ca;
    }
    .login-footer {
      text-align: center;
      margin-top: 24px;
      padding: 16px 0 0;
      border-top: 1px solid #f3f4f6;
    }
    .register-text {
      color: #6b7280;
      font-size: 14px;
    }
    .register-link {
      color: #4338ca;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    .register-link:hover {
      color: #3730a3;
      text-decoration: underline;
    }
    .demo-selector-panel {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px dashed #e5e7eb;
      text-align: center;
    }
    .demo-label {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    .demo-chips {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .demo-btn {
      font-size: 11px !important;
      height: 32px !important;
      line-height: 32px !important;
      padding: 0 12px !important;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  fillDemo(role: string) {
    const creds: any = {
      'Admin': { email: 'admin@school.com', pass: 'admin123' },
      'Teacher': { email: 'teacher@school.com', pass: 'teacher123' },
      'Student': { email: 'student@school.com', pass: 'student123' }
    };
    const c = creds[role];
    this.loginForm.patchValue({ email: c.email, password: c.pass });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Login Successful', 'Close', { duration: 3000 });
          const role = res.user.role;
          if (role === 'Admin') this.router.navigate(['/admin']);
          else if (role === 'Teacher') this.router.navigate(['/teacher']);
          else this.router.navigate(['/student']);
        },
        error: (err) => {
          this.snackBar.open(err.error.msg || 'Login Failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
