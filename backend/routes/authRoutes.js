const express = require('express');
const router = express.Router();

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: 2,
    username: 'user',
    password: 'user',
    name: 'User',
    email: 'user@example.com',
    role: 'user',
  },
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log("username", username);
  console.log("password", password);

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.status(200).json({ 
      message: 'Login successful', 
      isAdmin: user.role === 'admin', 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;