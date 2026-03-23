const express = require('express');
const router = express.Router();
const prisma = require('../database');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { username, password },
  });

  if (user) {
    res.status(200).json({
      message: 'Login successful',
      isAdmin: user.role === 'admin',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
