const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');

describe('RBAC Access Tests', () => {
    let adminToken, teacherToken, studentToken;
    jest.setTimeout(20000);

    beforeAll(async () => {
        // Ensure Roles exist
        const roles = [
            { roleName: 'Admin', permissions: ['manage_all'] },
            { roleName: 'Teacher', permissions: ['manage_student_marks'] },
            { roleName: 'Student', permissions: ['view_own_grades'] }
        ];
        for (const r of roles) {
            await Role.findOneAndUpdate({ roleName: r.roleName }, r, { upsert: true });
        }

        // Create/Login Admin
        await request(app).post('/api/auth/register').send({
            name: 'Admin User',
            email: 'admin_test@test.com',
            password: 'password123',
            role: 'Admin'
        });
        const adminRes = await request(app).post('/api/auth/login').send({
            email: 'admin_test@test.com',
            password: 'password123'
        });
        adminToken = adminRes.body.token;

        // Create/Login Teacher
        await request(app).post('/api/auth/register').send({
            name: 'Teacher User',
            email: 'teacher_test@test.com',
            password: 'password123',
            role: 'Teacher'
        });
        const teacherRes = await request(app).post('/api/auth/login').send({
            email: 'teacher_test@test.com',
            password: 'password123'
        });
        teacherToken = teacherRes.body.token;

        // Create/Login Student
        await request(app).post('/api/auth/register').send({
            name: 'Student User',
            email: 'student_test@test.com',
            password: 'password123',
            role: 'Student'
        });
        const studentRes = await request(app).post('/api/auth/login').send({
            email: 'student_test@test.com',
            password: 'password123'
        });
        studentToken = studentRes.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({ email: { $in: ['admin_test@test.com', 'teacher_test@test.com', 'student_test@test.com'] } });
        await mongoose.connection.close();
    });

    it('Admin should access admin routes', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('x-auth-token', adminToken);
        expect(res.statusCode).toEqual(200);
    });

    it('Teacher should NOT access admin routes', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('x-auth-token', teacherToken);
        expect(res.statusCode).toEqual(403);
    });

    it('Student should NOT access teacher routes', async () => {
        const res = await request(app)
            .get('/api/teacher/students')
            .set('x-auth-token', studentToken);
        expect(res.statusCode).toEqual(403);
    });

    it('Teacher should access teacher routes', async () => {
        const res = await request(app)
            .get('/api/teacher/students')
            .set('x-auth-token', teacherToken);
        expect(res.statusCode).toEqual(200);
    });

    it('Student should access student routes', async () => {
        const res = await request(app)
            .get('/api/student/marks')
            .set('x-auth-token', studentToken);
        expect(res.statusCode).toEqual(200);
    });
});
