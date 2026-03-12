import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'Teacher' | 'Student';
    createdAt: string;
}

export interface Subject {
    _id: string;
    name: string;
    description: string;
}

export interface Grade {
    _id: string;
    name: string;
    teachers: { _id: string; name: string; email: string }[];
    students: { _id: string; name: string; email: string }[];
}

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
    private readonly apiUrl = `${environment.apiUrl}/admin`;
    private http = inject(HttpClient);

    // ─── Users ────────────────────────────────────────────────────────────────
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    addUser(userData: Partial<User> & { password: string }): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users`, userData);
    }

    deleteUser(id: string): Observable<{ msg: string }> {
        return this.http.delete<{ msg: string }>(`${this.apiUrl}/users/${id}`);
    }

    // ─── Subjects ─────────────────────────────────────────────────────────────
    getSubjects(): Observable<Subject[]> {
        return this.http.get<Subject[]>(`${this.apiUrl}/subjects`);
    }

    addSubject(data: { name: string; description?: string }): Observable<Subject> {
        return this.http.post<Subject>(`${this.apiUrl}/subjects`, data);
    }

    // ─── Grades / Classes ─────────────────────────────────────────────────────
    getGrades(): Observable<Grade[]> {
        return this.http.get<Grade[]>(`${this.apiUrl}/grades`);
    }

    addGrade(name: string): Observable<Grade> {
        return this.http.post<Grade>(`${this.apiUrl}/grades`, { name });
    }

    assignToGrade(gradeId: string, userId: string, type: 'Teacher' | 'Student'): Observable<Grade> {
        return this.http.put<Grade>(
            `${this.apiUrl}/grades/${gradeId}/assign`,
            { userId, type }
        );
    }
}
