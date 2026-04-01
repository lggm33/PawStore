const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const dbPath = path.join(__dirname, 'prisma', 'pawstore.db');

// Set absolute path so Prisma resolves the DB consistently for reads and writes
process.env.DATABASE_URL = `file:${dbPath}`;

// Auto-initialize the DB if it doesn't exist yet
if (!fs.existsSync(dbPath)) {
  console.log('Database not found. Initializing...');
  execSync('npx prisma db push', { cwd: __dirname, stdio: 'inherit' });
  execSync('node prisma/seed.js', { cwd: __dirname, stdio: 'inherit' });
}

const prisma = new PrismaClient();

module.exports = prisma;
