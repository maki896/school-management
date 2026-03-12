import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Teacher' | 'Student';
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY  = 'user';

    private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
    public currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {}

    get currentUserValue(): AuthUser | null {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return !!this.currentUserValue && !!this.getToken();
    }

    getRole(): string {
        return this.currentUserValue?.role ?? '';
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    login(credentials: { email: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => this.setSession(res))
        );
    }

    register(userData: { name: string; email: string; password: string; role: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/register`, userData);
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    // ─── Private Helpers ───────────────────────────────────────────────────────
    private setSession(res: LoginResponse): void {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
    }

    private loadUser(): AuthUser | null {
        try {
            const raw = localStorage.getItem(this.USER_KEY);
            return raw ? (JSON.parse(raw) as AuthUser) : null;
        } catch {
            return null;
        }
    }
}
