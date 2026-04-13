const productService = require('../services/productService');
const AppError = require('../utils/AppError');

async function getAll(req, res, next) {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const product = await productService.getById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;

    if (!nombre || !precio || !categoria) {
      throw new AppError('Missing required fields: nombre, precio, categoria', 400);
    }

    const newProduct = await productService.create({
      nombre, 
      descripcion: descripcion || '', 
      precio, 
      categoria, 
      imagen: imagen || '', 
      stock: stock || 0
    });

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await productService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await productService.remove(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
