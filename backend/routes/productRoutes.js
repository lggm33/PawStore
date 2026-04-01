const express = require('express');
const router = express.Router();
const prisma = require('../database');

router.get('/', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

router.post('/', async (req, res) => {
  const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: 'Missing required fields: nombre, precio, categoria' });
  }

  const newProduct = await prisma.product.create({
    data: { nombre, descripcion: descripcion || '', precio, categoria, imagen: imagen || '', stock: stock || 0 },
  });

  res.status(201).json(newProduct);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      nombre: nombre ?? existing.nombre,
      descripcion: descripcion ?? existing.descripcion,
      precio: precio ?? existing.precio,
      categoria: categoria ?? existing.categoria,
      imagen: imagen ?? existing.imagen,
      stock: stock ?? existing.stock,
    },
  });

  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = await prisma.product.delete({ where: { id } });
  res.json(deleted);
});

module.exports = router;
