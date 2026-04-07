# PawStore

Tienda en línea de productos para mascotas. SPA completa con React Router, Zustand, autenticación JWT y backend en Express + PostgreSQL en Railway.

## Stack técnico

| Capa | Herramienta |
|------|-------------|
| Frontend | React 19, Vite 7, React Router v7, Zustand |
| Backend | Express 5, Prisma ORM, JWT, bcryptjs |
| Base de datos | PostgreSQL en Railway |
| Compilación | SWC, ESLint 9 |

## Estructura del proyecto

```
PawStore/
├── frontend/          # React SPA
│   └── src/
│       ├── stores/    # useAuthStore, useCartStore
│       ├── components/# Header, Footer, PrivateRoute, Layout
│       └── pages/     # Todas las vistas
└── backend/           # API REST
    ├── src/
    │   ├── config/    # env.js, prisma.js
    │   ├── middlewares/# authMiddleware, errorHandler
    │   ├── services/  # authService, orderService
    │   ├── controllers/# authController, orderController
    │   └── routes/    # orderRoutes
    ├── routes/        # productRoutes, authRoutes
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.js
    │   └── migrations/
    └── server.js
```

---

## Inicio rápido

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

---

## Configuración del backend

### 1. Variables de entorno

Crear `backend/.env` con las siguientes variables:

```env
DATABASE_URL=postgresql://<usuario>:<password>@<host>:<puerto>/<db>
JWT_SECRET=un_secreto_largo_y_aleatorio
PORT=3000
```

Para obtener la `DATABASE_URL` del proyecto en Railway:

```bash
# Primero linkeá el proyecto (solo la primera vez)
cd backend
railway link
# Seleccioná: Lyfter Pawstore → Postgres

# Luego listá las variables
railway variables
# Copiá DATABASE_PUBLIC_URL al .env como DATABASE_URL
```

### 2. Base de datos — Railway CLI

Instalar Railway CLI si no lo tenés:

```bash
npm install -g @railway/cli
railway login
```

#### Linkear el proyecto

```bash
cd backend
railway link
# Seleccioná: Lyfter Pawstore → Postgres
```

#### Verificar que apunta al proyecto correcto

```bash
railway status
# Debe mostrar: Project: Lyfter Pawstore
```

### 3. Migraciones

```bash
cd backend

# Primera vez / reset completo (elimina migraciones anteriores)
rm -rf prisma/migrations
npx prisma migrate dev --name init

# Aplicar migraciones existentes (en CI o Railway)
npm run migrate   # alias de: prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status
```

### 4. Seed — cargar datos iniciales

```bash
cd backend
node prisma/seed.js
```

Crea los siguientes usuarios:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | admin |
| `user` | `user123` | user |

### 5. Verificar que el servidor funciona

```bash
cd backend
node server.js

# En otra terminal — probar login
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Respuesta esperada:
```json
{
  "token": "eyJ...",
  "usuario": { "id": 1, "username": "admin", "role": "admin" }
}
```

---

## API — Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | — | Login, devuelve JWT |
| `GET` | `/api/products` | — | Lista todos los productos |
| `GET` | `/api/products/:id` | — | Detalle de un producto |
| `POST` | `/api/products` | Admin | Crear producto |
| `PUT` | `/api/products/:id` | Admin | Editar producto |
| `DELETE` | `/api/products/:id` | Admin | Eliminar producto |
| `POST` | `/api/orders` | Usuario | Registrar compra |

Las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

---

## Scripts disponibles

### Frontend

```bash
npm run dev       # Servidor de desarrollo (con proxy a backend)
npm run build     # Build de producción
npm run lint      # ESLint
npm run preview   # Preview del build
```

### Backend

```bash
npm run dev       # nodemon server.js
npm run start     # node server.js
npm run migrate   # prisma migrate deploy
npm run seed      # node prisma/seed.js
```

---
