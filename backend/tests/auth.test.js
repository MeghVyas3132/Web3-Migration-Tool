const request = require('supertest');
const app = require('../src/server');
const User = require('../src/models/User');

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should not register user with existing email', async () => {
      await User.create({
        username: 'existing',
        email: 'test@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'newuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login existing user', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
