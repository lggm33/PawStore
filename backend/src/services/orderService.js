const prisma = require('../config/prisma');
const nodemailer = require('nodemailer');

// Singleton para Ethereal Email (Transporte falso para desarrollo)
let transporter = null;

async function getTransporter() {
  if (!transporter) {
    const account = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }
  return transporter;
}

async function createOrder({ nombre, correo, direccion, telefono, items, total }) {
  const order = await prisma.order.create({
    data: { nombre, correo, direccion, telefono, items, total },
  });


  if (process.env.NODE_ENV !== 'test') {
    getTransporter().then(tp => {
      return tp.sendMail({
        from: '"PawStore DEV" <no-reply@pawstore.local>',
        to: correo,
        subject: 'Confirmación de tu pedido en PawStore',
        text: `¡Hola ${nombre}!\n\nHemos recibido tu pedido por un total de $${total}.\nLo enviaremos pronto a la dirección: ${direccion}.\n\n¡Gracias por tu compra!`,
      });
    }).then(info => {
      console.log('\n======================================================');
      console.log('📧 ¡CORREO DE PRUEBA ENVIADO CON ÉXITO!');
      console.log(`Destinatario: ${correo}`);
      console.log('👉 Hace Ctrl + Clic acá para ver cómo quedó el correo:');
      console.log(nodemailer.getTestMessageUrl(info));
      console.log('======================================================\n');
    }).catch(err => {
      console.error('Error enviando correo falso:', err.message);
    });
  }

  return order;
}

module.exports = { createOrder };
