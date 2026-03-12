import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Student {
    _id: string;
    name: string;
    email: string;
}

export interface Subject {
    _id: string;
    name: string;
}

export interface Mark {
    _id: string;
    student: Student;
    subject: Subject;
    marks: number;
    remarks: string;
    updatedAt: string;
}

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TeacherService {
    private readonly apiUrl = `${environment.apiUrl}/teacher`;
    private http = inject(HttpClient);

    getStudents(): Observable<Student[]> {
        return this.http.get<Student[]>(`${this.apiUrl}/students`);
    }

    getSubjects(): Observable<Subject[]> {
        return this.http.get<Subject[]>(`${this.apiUrl}/subjects`);
    }

    assignMarks(data: { studentId: string; subjectId: string; marks: number; remarks?: string }): Observable<Mark> {
        return this.http.post<Mark>(`${this.apiUrl}/marks`, data);
    }

    getMarks(): Observable<Mark[]> {
        return this.http.get<Mark[]>(`${this.apiUrl}/marks`);
    }
}
