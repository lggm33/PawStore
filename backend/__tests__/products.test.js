require('dotenv').config();
const request = require('supertest');
const app = require('../app');

let adminToken;
let createdProductId;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' });

  adminToken = res.body.token;

  // Crear producto de prueba para los tests de PUT y DELETE
  const created = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      nombre: 'Producto Test Temporal',
      descripcion: 'Descripción de prueba',
      precio: 9999,
      categoria: 'test',
      imagen: '',
      stock: 5,
    });

  createdProductId = created.body.id;
});

afterAll(async () => {
  if (createdProductId) {
    await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);
  }
});

describe('GET /api/products', () => {
  it('devuelve 200 y un array de productos', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/products/:id', () => {
  it('devuelve 200 y el producto con campos esperados para un ID existente', async () => {
    const res = await request(app).get(`/api/products/${createdProductId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nombre');
    expect(res.body).toHaveProperty('precio');
    expect(res.body.id).toBe(createdProductId);
  });

  it('devuelve 404 para un ID inexistente', async () => {
    const res = await request(app).get('/api/products/99999999');

    expect(res.status).toBe(404);
  });
});

describe('POST /api/products', () => {
  let tempId;

  afterAll(async () => {
    if (tempId) {
      await request(app)
        .delete(`/api/products/${tempId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });

  it('devuelve 401 sin token', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        nombre: 'Sin Auth',
        precio: 1000,
        categoria: 'test',
      });

    expect(res.status).toBe(401);
  });

  it('devuelve 201 y el producto creado con token admin', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Producto POST Test',
        descripcion: 'Creado en test',
        precio: 12500,
        categoria: 'test',
        imagen: '',
        stock: 3,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Producto POST Test');
    tempId = res.body.id;
  });

  it('devuelve 400 cuando faltan campos requeridos', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ descripcion: 'Sin nombre ni precio ni categoria' });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/products/:id', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .send({ nombre: 'Modificado sin auth' });

    expect(res.status).toBe(401);
  });

  it('devuelve 200 y el producto actualizado con token admin', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'Producto Test Actualizado', stock: 10 });

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Producto Test Actualizado');
    expect(res.body.stock).toBe(10);
  });

  it('devuelve 404 para un ID inexistente', async () => {
    const res = await request(app)
      .put('/api/products/99999999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'No existe' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/products/:id', () => {
  let tempDeleteId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Producto para eliminar',
        precio: 500,
        categoria: 'test',
      });
    tempDeleteId = res.body.id;
  });

  it('devuelve 401 sin token', async () => {
    const res = await request(app).delete(`/api/products/${tempDeleteId}`);

    expect(res.status).toBe(401);
  });

  it('elimina correctamente el producto con token admin', async () => {
    const res = await request(app)
      .delete(`/api/products/${tempDeleteId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(tempDeleteId);

    // Verificar que ya no existe
    const check = await request(app).get(`/api/products/${tempDeleteId}`);
    expect(check.status).toBe(404);
  });
});
