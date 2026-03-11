const express = require('express');
const router = express.Router();

let products = require('../data/products.json');
let nextId = products.length + 1;

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

router.post('/', (req, res) => {
  const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: 'Missing required fields: nombre, precio, categoria' });
  }

  const newProduct = {
    id: nextId++,
    nombre,
    descripcion: descripcion || '',
    precio,
    categoria,
    imagen: imagen || '',
    stock: stock || 0,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;

  products[productIndex] = {
    ...products[productIndex],
    nombre: nombre ?? products[productIndex].nombre,
    descripcion: descripcion ?? products[productIndex].descripcion,
    precio: precio ?? products[productIndex].precio,
    categoria: categoria ?? products[productIndex].categoria,
    imagen: imagen ?? products[productIndex].imagen,
    stock: stock ?? products[productIndex].stock,
  };

  res.json(products[productIndex]);
});

router.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = products.splice(productIndex, 1);
  res.json(deleted[0]);
});

module.exports = router;
