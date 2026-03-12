const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API Tests', () => {
    let testUser;

    beforeAll(async () => {
        // Ensure connected to test db? We're connected to MONGODB_URI from server.js.
        // Let's create a test user
        testUser = new User({
            name: 'Test Tester',
            email: 'test@tester.com',
            password: 'password123',
            role: 'Student'
        });
        await testUser.save();
    });

    afterAll(async () => {
        // Clean up
        await User.deleteOne({ email: 'test@tester.com' });
        await mongoose.connection.close();
    });

    it('should register a new user successfully', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'New User',
            email: 'new@user.com',
            password: 'password123',
            role: 'Student'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'new@user.com');

        // Cleanup the newly created user
        await User.deleteOne({ email: 'new@user.com' });
    });

    it('should login an existing user successfully', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@tester.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'test@tester.com');
    });

    it('should fail to login with wrong password', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@tester.com',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
    });
});
