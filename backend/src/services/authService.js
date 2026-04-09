const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { JWT_SECRET } = require('../config/env');
const AppError = require('../utils/AppError');

function buildUserPayload(user) {
  return { id: user.id, username: user.username, role: user.role };
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

async function register({ username, password, name, email }) {
  const existingByUsername = await prisma.user.findUnique({ where: { username } });
  if (existingByUsername) {
    throw new AppError('Username already taken', 409);
  }

  const existingByEmail = await prisma.user.findFirst({ where: { email } });
  if (existingByEmail) {
    throw new AppError('Email already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash, name, email }
  });

  const payload = buildUserPayload(user);
  return { token: signToken(payload), usuario: payload };
}

async function login(username, password) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email: username }
      ]
    }
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid credentials', 401);
  }

  const payload = buildUserPayload(user);
  return { token: signToken(payload), usuario: payload };
}

module.exports = { login, register };
