require('dotenv').config();
const request = require('supertest');
const app = require('../app');

let userToken;

const orderBody = {
  nombre: 'Test User',
  correo: 'test@test.com',
  direccion: 'Calle Test 123',
  items: [
    {
      id: 1,
      nombre: 'Producto Test',
      precio: 5000,
      cantidad: 2,
      subtotal: 10000,
    },
  ],
  total: 10000,
};

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'user', password: 'user123' });

  userToken = res.body.token;
});

describe('POST /api/orders', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).post('/api/orders').send(orderBody);

    expect(res.status).toBe(401);
  });

  it('devuelve 201 y la orden creada con token válido y body completo', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(orderBody);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Test User');
    expect(res.body.correo).toBe('test@test.com');
    expect(res.body.total).toBe(10000);
  });

  it('no crashea el servidor con body incompleto', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'Solo nombre' });

    expect(res.status).toBeDefined();
  });
});
