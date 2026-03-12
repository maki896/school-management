import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="page-container dashboard-container">
      <div class="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p class="subtitle">Manage grading and view student performance</p>
      </div>
      
      <!-- Stats Grid -->
      <div class="stats-grid">
        <mat-card class="stat-card glass-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Students Assigned</p>
              <h2 class="stat-value">{{students.length}}</h2>
            </div>
            <div class="stat-icon-wrapper blue">
              <mat-icon>groups</mat-icon>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card glass-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Subjects Taught</p>
              <h2 class="stat-value">{{subjects.length}}</h2>
            </div>
            <div class="stat-icon-wrapper purple">
              <mat-icon>menu_book</mat-icon>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card glass-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Class Average</p>
              <h2 class="stat-value">{{classAverage}}%</h2>
            </div>
            <div class="stat-icon-wrapper green">
              <mat-icon>trending_up</mat-icon>
            </div>
          </div>
        </mat-card>
      </div>

      <div class="insights-row mt-4">
        <mat-card class="glass-card wide-card insight-card">
          <div class="insight-content">
             <div class="insight-icon highlighting">
               <mat-icon>emoji_events</mat-icon>
             </div>
             <div class="insight-text">
               <p class="insight-label">Top Performer</p>
               <h4 class="insight-val">{{topStudent?.name || 'N/A'}} <span class="badge">{{topStudent?.score || 0}}%</span></h4>
             </div>
          </div>
        </mat-card>
      </div>

      <div class="marks-layout">
        <mat-card class="glass-card form-section">
          <mat-card-header>
            <div mat-card-avatar class="form-avatar">
              <mat-icon>grading</mat-icon>
            </div>
            <mat-card-title class="card-title">Assign Marks</mat-card-title>
            <mat-card-subtitle>Record new student grades</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content class="form-content">
            <form [formGroup]="markForm" (ngSubmit)="assignMarks()" class="marks-form">
              <mat-form-field appearance="outline" class="modern-input">
                <mat-label>Student</mat-label>
                <mat-icon matPrefix class="input-icon">person</mat-icon>
                <mat-select formControlName="studentId">
                  <mat-option *ngFor="let s of students" [value]="s._id">
                    {{s.name}}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="modern-input">
                <mat-label>Subject</mat-label>
                <mat-icon matPrefix class="input-icon">menu_book</mat-icon>
                <mat-select formControlName="subjectId">
                  <mat-option *ngFor="let sub of subjects" [value]="sub._id">
                    {{sub.name}}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="modern-input">
                <mat-label>Marks</mat-label>
                <mat-icon matPrefix class="input-icon">score</mat-icon>
                <input matInput type="number" formControlName="marks" min="0" max="100">
              </mat-form-field>

              <mat-form-field appearance="outline" class="modern-input">
                <mat-label>Remarks (Optional)</mat-label>
                <mat-icon matPrefix class="input-icon">comment</mat-icon>
                <input matInput formControlName="remarks" placeholder="e.g. Excellent progress">
              </mat-form-field>

              <button mat-raised-button color="primary" [disabled]="markForm.invalid" class="submit-btn" type="submit">
                Submit Marks
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <div class="list-section">
          <div class="section-header">
            <h3 class="section-title"><mat-icon inline="true">history</mat-icon> Recent Grading History</h3>
            <mat-form-field appearance="outline" class="history-search">
              <mat-label>Filter history...</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input matInput [(ngModel)]="historySearch" (input)="filterHistory()">
            </mat-form-field>
          </div>
          <mat-card class="glass-card table-card">
            <table mat-table [dataSource]="filteredMarks" class="marks-table">
              <ng-container matColumnDef="student">
                <th mat-header-cell *matHeaderCellDef> Student </th>
                <td mat-cell *matCellDef="let m"> <strong>{{m.student?.name}}</strong> </td>
              </ng-container>
              <ng-container matColumnDef="subject">
                <th mat-header-cell *matHeaderCellDef> Subject </th>
                <td mat-cell *matCellDef="let m"> {{m.subject?.name}} </td>
              </ng-container>
              <ng-container matColumnDef="marks">
                <th mat-header-cell *matHeaderCellDef> Marks </th>
                <td mat-cell *matCellDef="let m">
                  <span class="status-chip primary">{{m.marks}}</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['student', 'subject', 'marks']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['student', 'subject', 'marks'];"></tr>
            </table>
            
            <div *ngIf="assignedMarks.length === 0" class="no-data">
              <mat-icon>folder_open</mat-icon>
              <p>No marks have been recorded yet.</p>
            </div>
          </mat-card>
        </div>
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
    .stat-icon-wrapper.green { background: #d1fae5; color: #059669; }

    .marks-layout { 
      display: flex; 
      gap: 32px; 
      flex-wrap: wrap; 
      align-items: flex-start;
    }
    .form-section { 
      flex: 1; 
      min-width: 320px; 
      max-width: 400px; 
      padding: 0;
    }
    .form-avatar {
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
    .form-content {
      padding: 24px;
    }
    .marks-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
    }
    .list-section { 
      flex: 2; 
      min-width: 400px; 
    }
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
    .mt-4 { margin-top: 24px; }
    .wide-card { width: 100%; margin-bottom: 32px; }
    .insight-card { border-left: 4px solid #facc15 !important; }
    .insight-content { display: flex; align-items: center; gap: 20px; padding: 20px; }
    .highlighting { color: #eab308; background: #fefce8; border-radius: 50%; padding: 12px; }
    .insight-text { display: flex; flex-direction: column; }
    .insight-label { color: #6b7280; font-size: 13px; font-weight: 600; margin: 0 0 4px 0; }
    .insight-val { margin: 0; font-size: 18px; font-weight: 700; color: #111827; }
    .badge { background: #d1fae5; color: #065f46; font-size: 12px; padding: 2px 8px; border-radius: 12px; margin-left: 8px; }
    
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .history-search { width: 250px; margin-bottom: 0 !important; }
    .history-search ::ng-deep .mat-mdc-text-field-wrapper { height: 44px; }
  `]
})
export class TeacherDashboardComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  students: any[] = [];
  subjects: any[] = [];
  assignedMarks: any[] = [];
  filteredMarks: any[] = [];
  
  classAverage: number | string = 0;
  topStudent: any = null;
  historySearch: string = '';

  markForm = this.fb.group({
    studentId: ['', Validators.required],
    subjectId: ['', Validators.required],
    marks: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    remarks: ['']
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.teacherService.getStudents().subscribe(data => this.students = data);
    this.teacherService.getSubjects().subscribe(data => this.subjects = data);
    this.teacherService.getMarks().subscribe(data => {
      this.assignedMarks = data;
      this.calculateInsights();
      this.filterHistory();
    });
  }

  calculateInsights() {
    if (this.assignedMarks.length > 0) {
      const sum = this.assignedMarks.reduce((acc, curr) => acc + curr.marks, 0);
      this.classAverage = (sum / this.assignedMarks.length).toFixed(1);
      
      const top = [...this.assignedMarks].sort((a, b) => b.marks - a.marks)[0];
      this.topStudent = { name: top.student?.name, score: top.marks };
    } else {
      this.classAverage = 0;
      this.topStudent = null;
    }
  }

  filterHistory() {
    if (!this.historySearch) {
      this.filteredMarks = [...this.assignedMarks];
    } else {
      const term = this.historySearch.toLowerCase();
      this.filteredMarks = this.assignedMarks.filter(m => 
        m.student?.name.toLowerCase().includes(term) || 
        m.subject?.name.toLowerCase().includes(term)
      );
    }
  }

  assignMarks() {
    if (this.markForm.valid) {
      this.teacherService.assignMarks(this.markForm.value as any).subscribe({
        next: () => {
          this.snackBar.open('Marks assigned successfully', 'Close', { duration: 3000 });
          this.markForm.reset({ marks: 0 });
          this.loadData();
        },
        error: (err) => {
          this.snackBar.open(err.error.msg || 'Error assigning marks', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
