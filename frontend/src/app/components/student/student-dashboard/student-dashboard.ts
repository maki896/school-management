import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule
  ],
  template: `
    <div class="page-container dashboard-container">
      <div class="dashboard-header">
        <h1>Student Dashboard</h1>
        <p class="subtitle">View your class details and academic performance</p>
      </div>
      
      <!-- Student Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card glass-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Average Mark</p>
              <h2 class="stat-value">{{averageMark}}%</h2>
            </div>
            <div class="stat-icon-wrapper purple">
              <mat-icon>analytics</mat-icon>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card glass-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Subjects Enrolled</p>
              <h2 class="stat-value">{{marks.length}}</h2>
            </div>
            <div class="stat-icon-wrapper blue">
              <mat-icon>menu_book</mat-icon>
            </div>
          </div>
        </mat-card>
      </div>

      <div class="student-info">
        <mat-card *ngIf="grade" class="glass-card grade-info">
          <mat-card-header>
            <div mat-card-avatar class="class-avatar">
              <mat-icon>class</mat-icon>
            </div>
            <div class="grade-title-box">
              <mat-card-title class="card-title">Current Class: {{grade.name}}</mat-card-title>
              <mat-card-subtitle>Class information and assigned teachers</mat-card-subtitle>
            </div>
          </mat-card-header>
          <mat-card-content>
            <div class="teachers-title">
              <mat-icon inline="true">groups</mat-icon> Assigned Teachers
            </div>
            <ul class="teacher-list">
              <li *ngFor="let t of grade.teachers">
                <mat-icon inline="true" class="list-icon">person</mat-icon>
                <span>{{t.name}}</span> <span class="teacher-email">({{t.email}})</span>
              </li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="marks-list">
        <h3 class="section-title"><mat-icon inline="true">assessment</mat-icon> My Marks</h3>
        <mat-card class="glass-card table-card">
          <table mat-table [dataSource]="marks" class="marks-table">
            <ng-container matColumnDef="subject">
              <th mat-header-cell *matHeaderCellDef> Subject </th>
              <td mat-cell *matCellDef="let m"> <strong>{{m.subject?.name}}</strong> </td>
            </ng-container>
            <ng-container matColumnDef="marks">
              <th mat-header-cell *matHeaderCellDef> Marks </th>
              <td mat-cell *matCellDef="let m"> 
                <span class="status-chip success">{{m.marks}}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="remarks">
              <th mat-header-cell *matHeaderCellDef> Remarks </th>
              <td mat-cell *matCellDef="let m" class="remarks-text"> {{m.remarks || '—'}} </td>
            </ng-container>
            <ng-container matColumnDef="teacher">
              <th mat-header-cell *matHeaderCellDef> Teacher </th>
              <td mat-cell *matCellDef="let m"> {{m.teacher?.name}} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="['subject', 'marks', 'remarks', 'teacher']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['subject', 'marks', 'remarks', 'teacher'];"></tr>
          </table>
          
          <div *ngIf="marks.length === 0" class="no-data">
            <mat-icon>sentiment_dissatisfied</mat-icon>
            <p>You haven't been assigned any marks yet.</p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      margin-bottom: 32px;
    }
    .dashboard-header h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
    }
    .subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 16px;
    }
    .grade-info {
      margin-bottom: 32px;
    }
    .class-avatar {
      background: #e0e7ff;
      color: #4338ca;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-title {
      font-size: 18px;
      font-weight: 600;
    }
    .teachers-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #374151;
      margin: 20px 0 12px;
      font-size: 15px;
    }
    .teacher-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .teacher-list li {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      background: rgba(255,255,255,0.5);
      border-radius: 8px;
      margin-bottom: 8px;
      gap: 8px;
      font-size: 14px;
    }
    .list-icon {
      color: #9ca3af;
      font-size: 18px;
    }
    .teacher-email {
      color: #6b7280;
      font-size: 13px;
    }
    .grade-title-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 16px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    .stat-card {
      padding: 24px;
    }
    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      color: #6b7280;
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-value {
      font-size: 36px;
      font-weight: 800;
      color: #111827;
      margin: 0;
      line-height: 1;
    }
    .stat-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon-wrapper mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .stat-icon-wrapper.blue { background: #e0e7ff; color: #4338ca; }
    .stat-icon-wrapper.purple { background: #f3e8ff; color: #7e22ce; }
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      color: #111827;
      margin: 0 0 16px 0;
    }
    .table-card {
      padding: 0;
      overflow: hidden;
    }
    .remarks-text {
      color: #6b7280;
      font-style: italic;
    }
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      color: #9ca3af;
      text-align: center;
    }
    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  private studentService = inject(StudentService);

  marks: any[] = [];
  grade: any = null;
  averageMark: number | string = 0;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.studentService.getMyMarks().subscribe(data => {
      this.marks = data;
      if (this.marks && this.marks.length > 0) {
        const sum = this.marks.reduce((acc, curr) => acc + curr.marks, 0);
        this.averageMark = (sum / this.marks.length).toFixed(1);
      } else {
        this.averageMark = 0;
      }
    });
    this.studentService.getMyGrade().subscribe(data => this.grade = data);
  }
}
