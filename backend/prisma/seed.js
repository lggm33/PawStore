require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminHash,
      name: 'Admin',
      email: 'admin@pawstore.com',
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      passwordHash: userHash,
      name: 'User',
      email: 'user@pawstore.com',
      role: 'user',
    },
  });

  // Re-seed products if empty
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { nombre: 'Collar de cuero', descripcion: 'Collar resistente para perros de todos los tamaños.', precio: 8500, categoria: 'Perros', imagen: '/src/assets/collar-de-cuero.jpeg', stock: 12 },
        { nombre: 'Cama suave para gatos', descripcion: 'Cama acolchada y cómoda para gatos de interior.', precio: 12000, categoria: 'Gatos', imagen: '/src/assets/cama-para-gatos.jpeg', stock: 5 },
        { nombre: 'Pelota de goma', descripcion: 'Pelota duradera ideal para juegos al aire libre.', precio: 2500, categoria: 'Perros', imagen: '/src/assets/pelota-de-goma.jpeg', stock: 30 },
        { nombre: 'Rascador compacto', descripcion: 'Rascador vertical que ayuda a cuidar las uñas de tu gato.', precio: 15000, categoria: 'Gatos', imagen: '/src/assets/rascador.jpeg', stock: 7 },
        { nombre: 'Casita de mascotas', descripcion: 'Casita resistente para exteriores, ideal para climas lluviosos.', precio: 28000, categoria: 'Perros', imagen: '/src/assets/casita.jpeg', stock: 3 },
        { nombre: 'Arenero cubierto', descripcion: 'Arenero cerrado que ayuda a controlar los olores.', precio: 18000, categoria: 'Gatos', imagen: '/src/assets/arenero.jpeg', stock: 10 },
        { nombre: 'Correa extensible', descripcion: 'Correa de 5 metros ideal para paseos largos.', precio: 7000, categoria: 'Perros', imagen: '/src/assets/correa.jpeg', stock: 20 },
        { nombre: 'Plato doble', descripcion: 'Plato doble para agua y comida, fácil de limpiar.', precio: 5000, categoria: 'Accesorios', imagen: '/src/assets/plato-doble.jpeg', stock: 25 },
      ],
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
