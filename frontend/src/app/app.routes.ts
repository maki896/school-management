import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['Admin'] }
    },
    {
        path: 'teacher',
        loadComponent: () => import('./components/teacher/teacher-dashboard/teacher-dashboard').then(m => m.TeacherDashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['Teacher'] }
    },
    {
        path: 'student',
        loadComponent: () => import('./components/student/student-dashboard/student-dashboard').then(m => m.StudentDashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['Student'] }
    },
    {
        path: '',
        loadComponent: () => import('./components/landing/landing').then(m => m.LandingComponent),
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
