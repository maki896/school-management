import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
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
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="register-container">
      <div class="overlay"></div>
      <mat-card class="register-card glass-card">
        <mat-card-header class="header-center">
          <div mat-card-avatar class="logo-avatar">
            <mat-icon>person_add</mat-icon>
          </div>
          <mat-card-title class="modern-title">Create Account</mat-card-title>
          <mat-card-subtitle class="modern-subtitle">Join the School Management System</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <mat-form-field appearance="outline" class="modern-input">
              <mat-label>Full Name</mat-label>
              <mat-icon matPrefix class="input-icon">badge</mat-icon>
              <input matInput formControlName="name" placeholder="Enter name">
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="modern-input">
              <mat-label>Email Address</mat-label>
              <mat-icon matPrefix class="input-icon">email</mat-icon>
              <input matInput formControlName="email" type="email" placeholder="Enter email">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Invalid email format</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="modern-input">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix class="input-icon">lock</mat-icon>
              <input matInput formControlName="password" type="password" placeholder="Create password">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="modern-input">
              <mat-label>Select Role</mat-label>
              <mat-icon matPrefix class="input-icon">groups</mat-icon>
              <mat-select formControlName="role">
                <mat-option value="Admin">Admin</mat-option>
                <mat-option value="Teacher">Teacher</mat-option>
                <mat-option value="Student">Student</mat-option>
              </mat-select>
              <mat-error *ngIf="registerForm.get('role')?.hasError('required')">Role is required</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid" class="submit-btn">
              Create Account
            </button>
          </form>
        </mat-card-content>
        <mat-card-footer class="register-footer">
          <p class="login-text">Already have an account? <a routerLink="/login" class="login-link">Sign In</a></p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      position: relative;
      padding: 24px;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 80% 80%, rgba(67, 56, 202, 0.1) 0%, transparent 60%);
      pointer-events: none;
    }
    .register-card {
      width: 440px;
      padding: 32px 24px 24px;
      z-index: 1;
      border: 1px solid rgba(255,255,255,0.8);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      background: rgba(255,255,255,0.9);
      max-height: 90vh;
      overflow-y: auto;
    }
    .header-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
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
      margin-bottom: 12px;
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
      margin-bottom: 6px;
    }
    .modern-subtitle {
      color: #6b7280;
      font-size: 14px;
    }
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .modern-input {
      width: 100%;
    }
    .input-icon {
      color: #9ca3af;
      margin-right: 8px;
    }
    .submit-btn {
      margin-top: 12px;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      background: #4338ca;
    }
    .register-footer {
      text-align: center;
      margin-top: 24px;
      padding: 16px 0 0;
      border-top: 1px solid #f3f4f6;
    }
    .login-text {
      color: #6b7280;
      font-size: 14px;
    }
    .login-link {
      color: #4338ca;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    .login-link:hover {
      color: #3730a3;
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.snackBar.open('Registration Successful. Please Login.', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.snackBar.open(err.error.msg || 'Registration Failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
