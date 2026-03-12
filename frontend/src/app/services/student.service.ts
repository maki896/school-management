import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Mark {
    _id: string;
    subject: { _id: string; name: string; description: string };
    teacher: { _id: string; name: string };
    marks: number;
    remarks: string;
    updatedAt: string;
}

export interface GradeInfo {
    _id: string;
    name: string;
    teachers: { _id: string; name: string; email: string }[];
}

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
    private readonly apiUrl = `${environment.apiUrl}/student`;
    private http = inject(HttpClient);

    getMyMarks(): Observable<Mark[]> {
        return this.http.get<Mark[]>(`${this.apiUrl}/marks`);
    }

    getMyGrade(): Observable<GradeInfo | null> {
        return this.http.get<GradeInfo | null>(`${this.apiUrl}/grade`);
    }
}
