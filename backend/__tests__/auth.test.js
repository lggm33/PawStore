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
