# School Management System (MEAN Stack)

A modern, full-featured Educational Intelligence Platform built on the MEAN stack (MongoDB, Express, Angular, Node.js).

## 🚀 Overview

This platform streamlines educational processes for three primary user roles:
- **Administrators**: Manage students, teachers, classes, and subjects.
- **Teachers**: Record academic performance and track student progress.
- **Students**: View academic records and classroom assignments.

## ✨ Key Features

- **RBAC (Role-Based Access Control)**: Secure access using JWT and permission-based middleware.
- **Responsive Web Design**: Stunning, interactive interface with Glassmorphism aesthetics.
- **Dynamic Dashboards**: Centralized overview for all roles.
- **Academic Grading**: Comprehensive mark management for teachers and students.

## 🛠 Tech Stack

- **Frontend**: Angular (Standalone Components, RxJS, Material UI)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Token (JWT), Bcrypt password hashing
- **Styling**: Vanilla CSS with modern utility patterns

## 📦 Project Structure

```text
├── backend
│   ├── config/      # DB configurations
│   ├── controllers/ # Logic handlers
│   ├── middleware/  # Auth & Role verification
│   ├── models/      # Mongoose Schemas
│   ├── routes/      # Express API endpoints
│   └── seed.js      # Initial database population
└── frontend
    └── src/app
        ├── components/ # Angular View components
        ├── guards/     # Auth Guards
        ├── services/   # API Communication services
        └── models/     # Data interfaces
```

## 🛠 Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [MongoDB](https://www.mongodb.com/) (running instance)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm run seed  # Seed the database with default users
npm run dev   # Start development server on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start     # Serve Angular application locally on port 4200
```

## 🔐 Default Credentials

| Role    | Email             | Password   |
|---------|-------------------|------------|
| Admin   | admin@school.com   | admin123   |
| Teacher | teacher@school.com | teacher123 |
| Student | student@school.com | student123 |

## 📜 License

This project is licensed under the MIT License.
