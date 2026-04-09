require('dotenv').config();
const request = require('supertest');
const app = require('../app');

describe('POST /api/auth/login', () => {
  it('devuelve 200 y token con credenciales correctas de admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario.username).toBe('admin');
  });

  it('devuelve 200 y token con credenciales correctas de user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'user', password: 'user123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.username).toBe('user');
  });

  it('devuelve 401 con password incorrecto', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong_password' });

    expect(res.status).toBe(401);
  });

  it('devuelve 401 con usuario inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'noexiste', password: 'cualquiera' });

    expect(res.status).toBe(401);
  });

  it('no crashea el servidor con body vacío', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBeDefined();
  });
});

describe('POST /api/auth/register', () => {
  it('registra un nuevo usuario correctamente', async () => {
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const res = await request(app)
      .post('/api/auth/register')
      .send({ 
        username: `testuser_${randomSuffix}`, 
        email: `testuser_${randomSuffix}@example.com`,
        name: 'Test User',
        password: 'testPassword123' 
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.username).toBe(`testuser_${randomSuffix}`);
  });

  it('falla al registrar un usuario con nombre de usuario existente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ 
        username: 'admin', // Asumiendo que 'admin' existe por el seed
        email: 'admin_duplicate@example.com',
        name: 'Admin Clone',
        password: 'testPassword123' 
      });

    expect(res.status).toBe(409);
  });
});
