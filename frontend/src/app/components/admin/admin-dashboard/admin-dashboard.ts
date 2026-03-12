import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule
  ],
  template: `
    <div class="page-container dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">System overview and management console</p>
      </div>
      
      <mat-tab-group #tabGroup class="custom-tabs" animationDuration="0ms">
        <!-- Overview Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">dashboard</mat-icon> Overview
          </ng-template>
          <div class="tab-content">
            <h3 class="section-title">System Overview</h3>
            <div class="stats-grid">
              <mat-card class="stat-card glass-card">
                <div class="stat-content">
                  <div class="stat-info">
                    <p class="stat-label">Total Users</p>
                    <h2 class="stat-value">{{users.length}}</h2>
                  </div>
                  <div class="stat-icon-wrapper blue">
                    <mat-icon>people</mat-icon>
                  </div>
                </div>
                <div class="stat-footer">
                  <span class="trend up"><mat-icon>trending_up</mat-icon> +12%</span> vs last month
                </div>
              </mat-card>

              <mat-card class="stat-card glass-card">
                <div class="stat-content">
                  <div class="stat-info">
                    <p class="stat-label">Total Subjects</p>
                    <h2 class="stat-value">{{subjects.length}}</h2>
                  </div>
                  <div class="stat-icon-wrapper purple">
                    <mat-icon>menu_book</mat-icon>
                  </div>
                </div>
                <div class="stat-footer">
                  <span class="trend up"><mat-icon>trending_up</mat-icon> +5%</span> vs last month
                </div>
              </mat-card>

              <mat-card class="stat-card glass-card">
                <div class="stat-content">
                  <div class="stat-info">
                    <p class="stat-label">Active Classes</p>
                    <h2 class="stat-value">{{grades.length}}</h2>
                  </div>
                  <div class="stat-icon-wrapper green">
                    <mat-icon>class</mat-icon>
                  </div>
                </div>
                <div class="stat-footer">
                  <span class="trend neutral"><mat-icon>trending_flat</mat-icon> 0%</span> vs last month
                </div>
              </mat-card>
            </div>
            
            <div class="overview-grid mt-4">
              <mat-card class="glass-card wide-card">
                 <h3 class="card-title">Recent Activity</h3>
                 <div class="activity-list">
                    <div *ngFor="let activity of recentActivity" class="activity-item">
                       <mat-icon [color]="activity.type === 'user' ? 'primary' : 'accent'">{{activity.icon}}</mat-icon>
                       <div class="activity-info">
                         <span class="activity-text">{{activity.msg}}</span>
                         <small class="activity-time">{{activity.time | date:'shortTime'}}</small>
                       </div>
                    </div>
                 </div>
                 <div *ngIf="recentActivity.length === 0" class="muted-text text-center p-4">No recent activity detected.</div>
              </mat-card>

              <mat-card class="glass-card wide-card">
                 <h3 class="card-title">Quick Actions</h3>
                 <div class="quick-actions-list">
                    <button mat-button class="quick-btn" (click)="switchTab(1)"><mat-icon>person_add</mat-icon> Add User</button>
                    <button mat-button class="quick-btn" (click)="switchTab(2)"><mat-icon>post_add</mat-icon> New Subject</button>
                    <button mat-button class="quick-btn" (click)="switchTab(3)"><mat-icon>groups</mat-icon> Classes</button>
                 </div>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- User Management -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">people</mat-icon> Users
          </ng-template>
          <div class="tab-content">
            <h3 class="section-title">Manage System Users</h3>
            
            <div class="user-controls-row">
              <mat-card class="glass-card search-card">
                <mat-form-field appearance="outline" class="search-field">
                  <mat-label>Search Users</mat-label>
                  <mat-icon matPrefix>search</mat-icon>
                  <input matInput [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Search by name or email...">
                </mat-form-field>
                <mat-form-field appearance="outline" class="filter-field">
                  <mat-label>Role Filter</mat-label>
                  <mat-select [(ngModel)]="roleFilter" (selectionChange)="applyFilter()">
                    <mat-option value="All">All Roles</mat-option>
                    <mat-option value="Teacher">Teachers</mat-option>
                    <mat-option value="Student">Students</mat-option>
                  </mat-select>
                </mat-form-field>
              </mat-card>

              <mat-card class="glass-card form-card">
                <form [formGroup]="userForm" (ngSubmit)="addUser()" class="inline-form">
                  <mat-form-field appearance="outline" class="form-field-flex">
                    <mat-label>Full Name</mat-label>
                    <mat-icon matPrefix>badge</mat-icon>
                    <input matInput formControlName="name" placeholder="John Doe">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="form-field-flex">
                    <mat-label>Email Address</mat-label>
                    <mat-icon matPrefix>email</mat-icon>
                    <input matInput formControlName="email" type="email" placeholder="user@example.com">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="form-field-flex">
                    <mat-label>Password</mat-label>
                    <mat-icon matPrefix>lock</mat-icon>
                    <input matInput formControlName="password" type="password">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="form-field-flex role-select">
                    <mat-label>Role</mat-label>
                    <mat-icon matPrefix>manage_accounts</mat-icon>
                    <mat-select formControlName="role">
                      <mat-option value="Teacher">Teacher</mat-option>
                      <mat-option value="Student">Student</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <button mat-raised-button color="primary" [disabled]="userForm.invalid" class="add-btn">
                    <mat-icon>person_add</mat-icon> Add
                  </button>
                </form>
              </mat-card>
            </div>

            <mat-card class="glass-card table-wrapper">
              <table mat-table [dataSource]="filteredUsers" class="custom-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef> Name </th>
                  <td mat-cell *matCellDef="let user"> <strong>{{user.name}}</strong> </td>
                </ng-container>
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef> Email </th>
                  <td mat-cell *matCellDef="let user" class="muted-text"> {{user.email}} </td>
                </ng-container>
                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef> Role </th>
                  <td mat-cell *matCellDef="let user"> 
                    <span class="status-chip" [ngClass]="user.role === 'Teacher' ? 'primary' : 'success'">
                      {{user.role}}
                    </span>
                  </td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="actions-col"> Actions </th>
                  <td mat-cell *matCellDef="let user" class="actions-col">
                    <button mat-icon-button color="warn" (click)="deleteUser(user._id)" matTooltip="Delete User">
                      <mat-icon>delete_outline</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: userColumns;" class="table-row-hover"></tr>
              </table>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Subject Management -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">menu_book</mat-icon> Subjects
          </ng-template>
          <div class="tab-content">
            <h3 class="section-title">Manage Curriculum Subjects</h3>
            <mat-card class="glass-card form-card">
              <form [formGroup]="subjectForm" (ngSubmit)="addSubject()" class="inline-form">
                <mat-form-field appearance="outline" class="form-field-flex">
                  <mat-label>Subject Name</mat-label>
                  <mat-icon matPrefix>science</mat-icon>
                  <input matInput formControlName="name" placeholder="E.g. Mathematics">
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field-flex flex-grow">
                  <mat-label>Description (Optional)</mat-label>
                  <mat-icon matPrefix>description</mat-icon>
                  <input matInput formControlName="description">
                </mat-form-field>
                <button mat-raised-button color="primary" [disabled]="subjectForm.invalid" class="add-btn">
                  <mat-icon>add_circle</mat-icon> Add Subject
                </button>
              </form>
            </mat-card>

            <mat-card class="glass-card table-wrapper">
              <table mat-table [dataSource]="subjects" class="custom-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef> Subject Name </th>
                  <td mat-cell *matCellDef="let sub"> <strong>{{sub.name}}</strong> </td>
                </ng-container>
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef> Description </th>
                  <td mat-cell *matCellDef="let sub" class="muted-text"> {{sub.description || 'No description provided.'}} </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['name', 'description']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'description'];" class="table-row-hover"></tr>
              </table>
              
              <div *ngIf="subjects.length === 0" class="empty-state">
                <mat-icon>library_books</mat-icon>
                <p>No subjects added yet.</p>
              </div>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Grade Management -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">class</mat-icon> Classes & Groups
          </ng-template>
          <div class="tab-content">
            <h3 class="section-title">Manage Classes and Assignments</h3>
            <mat-card class="glass-card form-card">
              <div class="flex-form">
                <mat-form-field appearance="outline" class="form-field-flex">
                  <mat-label>Create New Class</mat-label>
                  <mat-icon matPrefix>meeting_room</mat-icon>
                  <input matInput #gradeNameInput placeholder="E.g. Grade 10A">
                </mat-form-field>
                <button mat-raised-button color="primary" class="add-btn" (click)="addGrade(gradeNameInput.value); gradeNameInput.value=''">
                  <mat-icon>add</mat-icon> Create Class
                </button>
              </div>
            </mat-card>

            <div class="grades-grid">
              <mat-card *ngFor="let grade of grades" class="glass-card grade-card">
                <mat-card-header class="grade-header">
                  <div mat-card-avatar class="grade-avatar">
                    <mat-icon>groups</mat-icon>
                  </div>
                  <mat-card-title class="grade-title">{{grade.name}}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="grade-stats">
                    <div class="stat-item">
                      <mat-icon>group</mat-icon>
                      <span class="stat-val">{{grade.students.length}} Students</span>
                    </div>
                    <div class="stat-item">
                      <mat-icon>book</mat-icon>
                      <span class="stat-val">{{grade.teachers.length}} Teachers</span>
                    </div>
                  </div>
                  
                  <div class="divider"></div>
                  
                  <div class="assign-title">Assign Member</div>
                  <div class="assign-form">
                    <mat-form-field appearance="outline" class="small-field">
                      <mat-label>Select User</mat-label>
                      <mat-select #userSelect>
                        <mat-option *ngFor="let u of users" [value]="u">
                          {{u.name}} <small class="muted-text">({{u.role}})</small>
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                    <button mat-flat-button color="accent" class="assign-action-btn" (click)="assignToGrade(grade._id, userSelect.value)">
                      <mat-icon>person_add</mat-icon> Assign
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div *ngIf="grades.length === 0" class="empty-state">
              <mat-icon>domain</mat-icon>
              <p>No classes created yet. Create a class to get started.</p>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .dashboard-header {
      margin-bottom: 24px;
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
    .tab-icon {
      margin-right: 8px;
    }
    .custom-tabs ::ng-deep .mat-mdc-tab-labels {
      background: white;
      border-radius: 12px;
      padding: 4px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      margin-bottom: 20px;
    }
    .custom-tabs ::ng-deep .mat-mdc-tab {
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    .custom-tabs ::ng-deep .mat-mdc-tab:hover {
      background: #f3f4f6;
    }
    .tab-content { padding: 10px 0 40px; }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 20px 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }
    .stat-card {
      padding: 24px;
    }
    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
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
    
    .stat-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #6b7280;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }
    .trend {
      display: inline-flex;
      align-items: center;
      font-weight: 600;
    }
    .trend mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 2px;
    }
    .trend.up { color: #059669; }
    .trend.neutral { color: #6b7280; }
    
    .mt-4 { margin-top: 24px; }
    .card-title {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #111827;
    }
    .quick-actions-list {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .quick-btn {
      background: rgba(255,255,255,0.5);
      border: 1px solid #e5e7eb;
      color: #374151;
      padding: 0 20px;
      border-radius: 8px;
    }
    .quick-btn mat-icon {
      color: #4f46e5;
    }
    
    .form-card { 
      padding: 24px; 
      margin-bottom: 32px; 
    }
    .inline-form { 
      display: flex; 
      gap: 16px; 
      flex-wrap: wrap; 
      align-items: flex-start; 
    }
    .form-field-flex {
      flex: 1;
      min-width: 200px;
      margin-bottom: 0 !important;
    }
    .flex-grow {
      flex: 2;
    }
    .role-select {
      max-width: 200px;
    }
    .add-btn {
      height: 54px;
      border-radius: 8px;
      font-weight: 600;
      padding: 0 16px;
    }
    .user-controls-row {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
    }
    .search-card {
      display: flex;
      gap: 16px;
      padding: 16px 24px;
      align-items: center;
      flex-wrap: wrap;
    }
    .search-field {
      flex: 2;
      min-width: 250px;
      margin-bottom: 0 !important;
    }
    .filter-field {
      flex: 1;
      min-width: 150px;
      margin-bottom: 0 !important;
    }
    .flex-form { 
      display: flex; 
      gap: 16px; 
      align-items: center; 
      flex-wrap: wrap;
    }
    .flex-form .form-field-flex {
      max-width: 400px;
    }
    .table-wrapper {
      padding: 0;
      overflow: hidden;
    }
    .custom-table {
      width: 100%;
    }
    .muted-text {
      color: #6b7280;
    }
    .actions-col { 
      width: 80px; 
      text-align: center; 
    }
    .table-row-hover:hover {
      background: #f9fafb;
    }
    .grades-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); 
      gap: 24px; 
    }
    .grade-card { 
      padding: 24px; 
      display: flex;
      flex-direction: column;
    }
    .grade-header {
      margin-bottom: 16px;
    }
    .grade-avatar {
      background: #e0e7ff;
      color: #4338ca;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .grade-title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin: 8px 0 0;
    }
    .grade-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      background: rgba(255,255,255,0.5);
      padding: 12px;
      border-radius: 8px;
    }
    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #4b5563;
      font-size: 14px;
      font-weight: 500;
    }
    .stat-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #6b7280;
    }
    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 16px 0;
    }
    .assign-title {
      font-size: 14px;
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 12px;
    }
    .assign-form { 
      display: flex; 
      align-items: flex-start; 
      gap: 12px; 
    }
    .small-field { 
      flex: 1; 
      margin-bottom: 0 !important;
    }
    .assign-action-btn {
      height: 54px;
      border-radius: 8px;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      color: #9ca3af;
      text-align: center;
    }
    .empty-state mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    .activity-list { display: flex; flex-direction: column; gap: 12px; }
    .activity-item { display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(0,0,0,0.02); border-radius: 8px; }
    .activity-info { display: flex; flex-direction: column; }
    .activity-text { font-size: 14px; font-weight: 500; }
    .activity-time { font-size: 12px; color: #9ca3af; }
    .text-center { text-align: center; }
    .p-4 { padding: 16px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  users: any[] = [];
  filteredUsers: any[] = [];
  subjects: any[] = [];
  grades: any[] = [];
  recentActivity: any[] = [];

  searchTerm: string = '';
  roleFilter: string = 'All';

  userColumns = ['name', 'email', 'role', 'actions'];
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Student', Validators.required]
  });

  subjectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
      this.applyFilter();
      this.generateActivity();
    });
    this.adminService.getSubjects().subscribe(data => this.subjects = data);
    this.adminService.getGrades().subscribe(data => this.grades = data);
  }

  generateActivity() {
    this.recentActivity = this.users
      .slice(0, 3)
      .map(u => ({
        type: 'user',
        icon: 'person_add',
        msg: `New ${u.role} "${u.name}" was registered`,
        time: new Date()
      }));
    if (this.subjects.length > 0) {
      this.recentActivity.push({
        type: 'subject',
        icon: 'menu_book',
        msg: `Subject "${this.subjects[0].name}" updated`,
        time: new Date()
      });
    }
  }

  applyFilter() {
    this.filteredUsers = this.users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.roleFilter === 'All' || u.role === this.roleFilter;
      return matchesSearch && matchesRole;
    });
  }

  addUser() {
    if (this.userForm.valid) {
      // Cast the form value to match the expected service parameter type
      const userData = this.userForm.value as any;
      this.adminService.addUser(userData).subscribe({
        next: () => {
          this.snackBar.open('User added', 'Close', { duration: 2000 });
          this.userForm.reset({ role: 'Student' });
          this.loadData();
        }
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure?')) {
      this.adminService.deleteUser(id).subscribe(() => this.loadData());
    }
  }

  addSubject() {
    if (this.subjectForm.valid) {
      // Cast the form value to match the expected service parameter type
      const subjectData = this.subjectForm.value as any;
      this.adminService.addSubject(subjectData).subscribe({
        next: () => {
          this.snackBar.open('Subject added', 'Close', { duration: 2000 });
          this.subjectForm.reset();
          this.loadData();
        }
      });
    }
  }

  addGrade(name: string) {
    if (name) {
      this.adminService.addGrade(name).subscribe(() => this.loadData());
    }
  }

  assignToGrade(gradeId: string, user: any) {
    if (user) {
      this.adminService.assignToGrade(gradeId, user._id, user.role).subscribe(() => {
        this.snackBar.open('User assigned', 'Close', { duration: 2000 });
        this.loadData();
      });
    }
  }

  // Define ViewChild to access the tab group if necessary
  // Or simply rely on DOM for quick navigation
  switchTab(index: number) {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = index;
    }
  }
}
