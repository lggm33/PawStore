const orderService = require('../services/orderService');

async function createOrder(req, res, next) {
  try {
    const { nombre, correo, direccion, telefono, items, total } = req.body;
    const order = await orderService.createOrder({ nombre, correo, direccion, telefono, items, total });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder };
