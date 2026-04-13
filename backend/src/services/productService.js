const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

async function getAll() {
  return prisma.product.findMany();
}

async function getById(id) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
}

async function create(data) {
  return prisma.product.create({ data });
}

async function update(id, data) {
  const existing = await getById(id);
  const { nombre, descripcion, precio, categoria, imagen, stock } = data;
  return prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      nombre: nombre ?? existing.nombre,
      descripcion: descripcion ?? existing.descripcion,
      precio: precio ?? existing.precio,
      categoria: categoria ?? existing.categoria,
      imagen: imagen ?? existing.imagen,
      stock: stock ?? existing.stock,
    },
  });
}

async function remove(id) {
  await getById(id); // Throws if not exist
  return prisma.product.delete({ where: { id: parseInt(id) } });
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
