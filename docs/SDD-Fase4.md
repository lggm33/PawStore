# Software Design Document (SDD)
## PawStore – Fase 4: SPA Completa + Backend Reestructurado + PostgreSQL + JWT

---

## 1. Introducción

### 1.1 Propósito
Este documento describe el diseño y los requisitos de software para la Fase 4 del proyecto PawStore. Cubre el módulo final de frontend (SPA completa con React Router y Zustand) y las mejoras estructurales del backend: separación en capas, autenticación con JWT, y migración a PostgreSQL.

### 1.2 Alcance
La aplicación PawStore es una tienda en línea de productos para mascotas. Esta fase:
- Transforma el frontend en una SPA completa con enrutamiento basado en URL (React Router).
- Introduce **Zustand** como solución de estado global (carrito + autenticación).
- Implementa **JWT** para autenticación stateless: el backend emite tokens, el frontend los almacena y envía en cada request protegido.
- Reestructura el backend en capas (routes / controllers / services / config / middlewares).
- Migra la base de datos de SQLite a **PostgreSQL en Railway**.

### 1.3 Contexto del proyecto

| Etapa | Estado | Descripción |
|-------|--------|-------------|
| 1 | ✅ Completada | Estructura base, componentes estáticos y lectura de JSON |
| 2 | ✅ Completada | Módulo administrativo, formularios y CRUD en memoria |
| 3 | ✅ Completada | Conexión con backend (API) y autenticación |
| **4** | 🎯 **Actual** | SPA + Zustand + JWT + checkout + backend reestructurado + PostgreSQL |

---

## 2. Definiciones y Siglas

- **SPA:** Single Page Application — aplicación web que navega sin recargar el documento.
- **Zustand:** Librería de estado global minimalista para React. No requiere Provider ni boilerplate.
- **Store:** Unidad de estado global en Zustand. Cada store encapsula estado + acciones.
- **React Router:** Librería de enrutamiento del lado del cliente para React.
- **JWT:** JSON Web Token — token firmado que el backend emite al autenticar y el frontend envía en cada request para identificarse.
- **Checkout:** Proceso final de compra donde el usuario confirma su pedido.
- **Controller:** Capa que recibe el request HTTP, delega al service y devuelve el response.
- **Service:** Capa que contiene la lógica de negocio e interactúa con la base de datos.
- **Prisma:** ORM para Node.js que gestiona migraciones y acceso a base de datos.
- **bcrypt:** Algoritmo de hashing de contraseñas. Se usa `bcryptjs` (pure JS) para evitar problemas de compilación nativa en Railway.

---

## 3. Requisitos del Sistema

### 3.1 Requisitos Funcionales

#### RF-01 – Enrutamiento SPA
La aplicación debe implementar navegación basada en rutas sin recargar la página.

| Ruta | Vista | Protección |
|------|-------|------------|
| `/` | Página de Inicio | Pública |
| `/productos` | Catálogo de productos | Pública |
| `/productos/:id` | Detalle de un producto | Pública |
| `/contacto` | Página de Contacto | Pública |
| `/login` | Inicio de sesión | Pública |
| `/checkout` | Página de Checkout | Requiere autenticación |
| `/admin` | Administración de productos | Requiere rol admin |
| `/admin/editar/:id` | Edición de un producto | Requiere rol admin |
| `/carrito` *(opcional)* | Vista dedicada del carrito | Pública |
| `*` (wildcard) | Página 404 – ruta no encontrada | — |

#### RF-02 – Navegación sin recarga
El cambio entre secciones no debe provocar una recarga completa del documento. La URL del navegador debe reflejar la sección actual en todo momento. Acceder directamente a una URL válida (e.g., `/productos/3`) debe renderizar la vista correspondiente.

#### RF-03 – Estado Global con Zustand
Se deben definir dos stores de Zustand:

**`useAuthStore`**
- `usuario`: objeto con datos del usuario autenticado y el JWT (o `null`).
- `token`: JWT recibido del backend al hacer login.
- `login(datos, token)`: guarda el usuario y el token en el store.
- `logout()`: limpia el estado de sesión y el token.

**`useCartStore`**
- `items`: array de productos en el carrito.
- `agregarAlCarrito(producto)`: agrega o incrementa cantidad.
- `modificarCantidad(id, cantidad)`: actualiza la cantidad de un producto.
- `quitarDelCarrito(id)`: elimina un producto.
- `vaciarCarrito()`: vacía todos los productos.
- `total`: valor calculado del total de la compra.

> El carrito y la sesión persisten entre recargas usando el middleware `persist` de Zustand con `localStorage`. Esto satisface RNF-02 y RNF-03 sin código adicional.

El encabezado consume ambos stores para mostrar el estado de sesión y el contador del carrito.

#### RF-04 – Carrito de Compras
El carrito debe ser accesible desde el encabezado en cualquier página. Cada ítem:

- `id` del producto
- `nombre`
- `precio`
- `cantidad`
- `subtotal` (precio × cantidad)

**Comportamiento al agregar:**
- Producto no existe → se agrega con `cantidad: 1`.
- Producto ya existe → se incrementa `cantidad` en 1.

**Operaciones:**
- Ver listado de productos en el carrito.
- Incrementar o decrementar la cantidad.
- Eliminar un producto (botón: **"Quitar"**).
- Ver subtotal por producto y total general.
- Mensaje cuando vacío: `"Tu carrito está vacío."`

#### RF-05 – Checkout
Accesible desde el carrito mediante el botón **"Ir al checkout"**. Requiere autenticación — si el usuario no está autenticado, se redirige a `/login`.

La vista contiene:
- Título: `"Checkout"`
- Subtítulo *(opcional)*: `"Revisa los detalles de tu compra y completa la información necesaria para finalizar el pedido."`
- Resumen: lista de productos (nombre, cantidad, precio unitario, subtotal) y total general.
- Formulario:

| Campo | Etiqueta |
|-------|----------|
| Nombre del comprador | `Nombre completo` |
| Correo electrónico | `Correo electrónico` |
| Dirección de envío | `Dirección de envío` |

- Botón de confirmación: **"Confirmar compra"**

**Al confirmar, el frontend envía al backend:**
- Header `Authorization: Bearer <token>` con el JWT.
- Datos del comprador (nombre, correo, dirección).
- Contenido del carrito (productos y cantidades).
- Total de la compra.

#### RF-06 – Integración con Backend
- Los productos se obtienen desde la API existente.
- El registro de la compra en el backend es obligatorio.
- El backend envía el correo de confirmación al comprador.
- El frontend maneja éxito o error según la respuesta.

#### RF-07 – Confirmación de Compra
Tras checkout exitoso:
- Título: `"¡Gracias por tu compra!"`
- Texto: `"Hemos enviado un correo de confirmación con los detalles de tu pedido."`
- Botón: **"Volver al catálogo"**
- El carrito se vacía automáticamente.

#### RF-08 – Manejo de Errores en Checkout
En caso de fallo: `"Ocurrió un problema al procesar tu compra. Por favor intenta de nuevo."`

#### RF-09 – Página 404
- Título: `"Página no encontrada"`
- Texto: `"La página que estás buscando no existe o ha sido movida."`
- Enlace: **"Volver al inicio"**

Si `/productos/:id` recibe un ID inexistente, la app no debe romperse.

#### RF-10 – Control de Acceso por Roles
Las rutas `/admin` y `/admin/editar/:id` requieren rol administrador. El control se aplica en dos niveles:
- **Frontend:** componente `PrivateRoute` que lee `useAuthStore` y redirige si el usuario no tiene rol admin.
- **Backend:** middleware `authMiddleware` que valida el JWT y verifica el rol antes de procesar la request.

#### RF-11 – Autenticación con JWT
El endpoint `POST /api/auth/login` valida las credenciales con bcrypt y, si son correctas, emite un JWT firmado.

**Flujo:**
1. Usuario envía `{ username, password }` al endpoint de login.
2. Backend busca el usuario por `username`, compara el password con `bcrypt.compare()`.
3. Si válido: firma y devuelve un JWT con payload `{ id, username, rol }`.
4. El frontend guarda el token en `useAuthStore` (persiste en `localStorage`).
5. Cada request a rutas protegidas incluye `Authorization: Bearer <token>`.
6. El middleware `authMiddleware` valida la firma del token antes de pasar al controller.

**Token:**
- Firmado con `jsonwebtoken` y una clave secreta en `JWT_SECRET` (variable de entorno).
- Expiración: `24h`.
- Payload: `{ id, username, rol }`.

---

### 3.2 Requisitos No Funcionales

| ID | Requisito |
|----|-----------|
| RNF-01 | La navegación entre rutas no debe causar recarga completa. |
| RNF-02 | El estado del carrito persiste entre recargas (garantizado por Zustand `persist` + `localStorage`). |
| RNF-03 | La información del usuario autenticado está disponible en el encabezado y el checkout. |
| RNF-04 | La interfaz mantiene coherencia visual con fases anteriores. |
| RNF-05 | Los formularios de checkout deben ser legibles y usables. |
| RNF-06 | El flujo completo (ver producto → carrito → checkout → confirmación) debe ser intuitivo. |
| RNF-07 | El backend debe tener separación clara de responsabilidades entre capas. |
| RNF-08 | La base de datos debe ser PostgreSQL en Railway; la conexión se configura via `DATABASE_URL`. |
| RNF-09 | Los passwords deben almacenarse hasheados con bcrypt. Nunca en texto plano. |
| RNF-10 | El JWT_SECRET debe configurarse como variable de entorno. Nunca hardcodeado en código. |

---

### 3.3 Requisitos Fuera de Alcance

- Validación avanzada campo por campo en el formulario de checkout.
- Animaciones de transición entre rutas.
- Múltiples direcciones de envío.
- Métodos de pago reales.
- Cupones de descuento.
- Refresh tokens / rotación de JWT.
- Input validation con zod/joi.
- TypeScript en backend.
- Tests (unitarios o de integración).
- Rate limiting, CORS hardening, helmet.
- Logging estructurado (pino/winston).
- Versionado de API.
- CI/CD pipeline.

---

## 4. Arquitectura del Sistema

### 4.1 Estructura de Rutas (React Router)
```
App
├── Layout (Header + Outlet)
│   ├── / → <Home />
│   ├── /productos → <Catalogo />
│   ├── /productos/:id → <DetalleProducto />
│   ├── /contacto → <Contacto />
│   ├── /login → <Login />
│   ├── /checkout → <PrivateRoute> → <Checkout />
│   ├── /admin → <PrivateRoute rol="admin"> → <Admin />
│   ├── /admin/editar/:id → <PrivateRoute rol="admin"> → <EditarProducto />
│   └── * → <NotFound />
```

`PrivateRoute` lee `useAuthStore`. Si no hay sesión activa, redirige a `/login`. Si el rol no es suficiente, redirige a `/`.

### 4.2 Estado Global — Zustand Stores

```
src/
└── stores/
    ├── useAuthStore.js   ← estado de sesión + JWT
    └── useCartStore.js   ← estado del carrito de compras
```

**`useAuthStore`**
```js
// stores/useAuthStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      login: (datos, token) => set({ usuario: datos, token }),
      logout: () => set({ usuario: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

**`useCartStore`**
```js
// stores/useCartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      agregarAlCarrito: (producto) => { /* upsert por id */ },
      modificarCantidad: (id, cantidad) => { /* actualiza o elimina si cantidad === 0 */ },
      quitarDelCarrito: (id) => { /* filtra el item */ },
      vaciarCarrito: () => set({ items: [] }),
      get total() {
        return get().items.reduce((acc, i) => acc + i.subtotal, 0)
      },
    }),
    { name: 'cart-storage' }
  )
)
```

### 4.3 Arquitectura del Backend — Capas

El backend se reestructura en capas con responsabilidades claras. Ninguna capa conoce los detalles de implementación de la capa siguiente.

```
backend/
├── prisma/
│   ├── schema.prisma          ← provider: postgresql
│   ├── migrations/            ← generado con prisma migrate dev
│   └── seed.js                ← passwords hasheados con bcrypt
└── src/
    ├── config/
    │   ├── prisma.js          ← instancia singleton de PrismaClient
    │   └── env.js             ← valida DATABASE_URL y JWT_SECRET al iniciar
    ├── routes/
    │   ├── productRoutes.js   ← solo mapea HTTP verbs/paths → controller
    │   ├── authRoutes.js
    │   └── orderRoutes.js
    ├── controllers/
    │   ├── productController.js  ← parsea req, llama service, devuelve res
    │   ├── authController.js
    │   └── orderController.js
    ├── services/
    │   ├── productService.js     ← lógica de negocio + acceso a Prisma
    │   ├── authService.js        ← bcrypt.compare + emit JWT
    │   └── orderService.js
    └── middlewares/
        ├── authMiddleware.js  ← valida JWT; adjunta payload a req.user
        └── errorHandler.js   ← middleware centralizado de errores Express
├── server.js                 ← setup Express, monta rutas + error middleware
└── package.json
```

**Responsabilidades por capa:**

| Capa | Hace | NO hace |
|------|------|---------|
| `routes/` | Mapea HTTP verbs/paths a middlewares + controller | Accede a `req.body`, llama Prisma, contiene lógica |
| `controllers/` | Parsea `req`, llama service, formatea `res`, llama `next(err)` en fallo | Contiene reglas de negocio, importa Prisma directamente |
| `services/` | Ejecuta lógica de negocio, llama Prisma, lanza errores tipados | Accede a objetos `req` o `res` |
| `config/` | Exporta instancia de Prisma, valida env vars | Contiene lógica de rutas o negocio |
| `middlewares/authMiddleware.js` | Valida JWT, adjunta `req.user`, llama `next()` o retorna 401 | Contiene lógica de negocio |
| `middlewares/errorHandler.js` | Captura errores, formatea respuesta de error | Contiene lógica de negocio |

**Shape de respuesta de error (errorHandler):**
```json
{ "error": { "message": "Unauthorized", "status": 401 } }
```
Errores no reconocidos devuelven 500 con mensaje genérico en producción.

### 4.4 Flujo de Autenticación (JWT)

```
[Login Page]
  ↓ POST /api/auth/login { username, password }
[authController] → [authService]
  ↓ findFirst({ where: { username } })
  ↓ bcrypt.compare(password, usuario.passwordHash)
  ↓ jwt.sign({ id, username, rol }, JWT_SECRET, { expiresIn: '24h' })
[Response] → { token, usuario: { id, username, rol } }
  ↓
[useAuthStore.login(usuario, token)]  ← persiste en localStorage
  ↓
Requests protegidos → Authorization: Bearer <token>
  ↓
[authMiddleware] → jwt.verify(token, JWT_SECRET) → req.user = payload → next()
```

### 4.5 Base de Datos — PostgreSQL en Railway

La base de datos migra de SQLite a **PostgreSQL** disponible en Railway.

**Reglas de migración:**
- Conexión via variable de entorno `DATABASE_URL` (nunca hardcodeada).
- Usar `prisma migrate dev` en desarrollo local.
- Usar `prisma migrate deploy` en Railway (no `prisma db push`).
- El `package.json` debe incluir `postinstall: "prisma generate"` para que Railway genere el cliente.
- Los datos existentes de SQLite **no se migran** — re-seed requerido al hacer el deploy inicial.

**Cambio en `schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Passwords:** Almacenados con `bcryptjs` (pure JS, API-compatible con bcrypt). Nunca en texto plano.

### 4.6 Flujo de Compra

```
[Catálogo / Detalle de Producto]
        ↓ "Agregar al carrito"  →  useCartStore.agregarAlCarrito()
[Carrito de Compras]
        ↓ "Ir al checkout"  (si no autenticado → redirige a /login)
[Checkout] → POST /api/orders { Authorization: Bearer <token>, items, total, comprador }
        ↓ authMiddleware valida JWT
        ↓ orderController → orderService → Prisma → PostgreSQL
        ↓ Respuesta exitosa
[Pantalla de Confirmación] → useCartStore.vaciarCarrito()
        ↓ "Volver al catálogo"
[Catálogo]
```

---

## 5. Decisiones Técnicas

### 5.1 Controller + Service vs. Solo Controller

**Decisión:** Split controller/service.

| Opción | Pros | Contras |
|--------|------|---------|
| **Controller + Service** | Services testeables sin mock de HTTP; controllers thin; features nuevas no inflan un solo archivo | Más archivos para una app pequeña |
| **Solo Controller** | Menos archivos | Misma mezcla de concerns que hoy, solo renombrada |

**Razón:** El código actual demuestra el dolor de mezclar concerns en route handlers. La capa de service se justifica desde el momento que `authService` necesita lógica de bcrypt y JWT que no es HTTP-específica.

### 5.2 JWT vs. Sesiones

**Decisión:** **JWT stateless** con `jsonwebtoken`.

| Opción | Pros | Contras |
|--------|------|---------|
| **JWT** | Stateless; compatible con Railway sin sticky sessions; estándar para APIs REST | Tokens no revocables hasta expiración (aceptable con expiración corta) |
| **Sesiones con express-session** | Revocación inmediata | Requiere session store (Redis/DB) — introduce una dependencia adicional |

**Razón:** Railway no garantiza sticky sessions. JWT es la opción correcta para un backend stateless en este entorno. La expiración de 24h es suficiente para el contexto de la app. Refresh tokens quedan fuera de scope.

### 5.3 Password Hashing: bcryptjs vs. Argon2

**Decisión:** **bcryptjs** (pure JavaScript).

| Opción | Pros | Contras |
|--------|------|---------|
| **bcryptjs** | Sin dependencias nativas; no falla en Railway; battle-tested | Levemente más lento que bcrypt nativo |
| **Argon2** | Más memory-hard; ganador del PHC | Requiere compilación nativa; puede fallar en Railway |

**Razón:** Para esta app, bcryptjs con cost factor 10-12 es suficiente. El riesgo de build nativo en Railway supera el beneficio marginal de Argon2.

### 5.4 Error Handling: Middleware Centralizado

**Decisión:** Middleware centralizado en `errorHandler.js`.

Los services lanzan `Error` objects (o un `AppError` liviano con `statusCode`). Los controllers usan `try/catch` y reenvían via `next(err)`. El middleware en `errorHandler.js` devuelve shape consistente.

**Importante (Express 4):** Express 4 NO captura promesas rechazadas automáticamente. El `try/catch + next(err)` en cada controller async es **obligatorio**, no opcional.

### 5.5 Estrategia de Migración: `migrate dev` vs. `db push`

| Comando | Cuándo usar |
|---------|-------------|
| `prisma migrate dev` | Desarrollo local — crea archivos de migración con historial |
| `prisma db push` | Solo prototipado — sin historial, NO para producción |
| `prisma migrate deploy` | Railway/producción — aplica pendientes sin generar nuevas |

---

## 6. Pasos de Migración a PostgreSQL

### Paso 1 — Actualizar `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"   // era "sqlite"
  url      = env("DATABASE_URL")
}
```
Los modelos actuales (`Product`, `User`) usan tipos básicos que mapean limpiamente a PostgreSQL.

### Paso 2 — Reescribir `database.js` → `src/config/prisma.js`
Eliminar toda la lógica de auto-init con `execSync`. Reemplazar con:
```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
```
Actualizar todos los `require('../database')` existentes a `require('../config/prisma')`.

### Paso 3 — Crear `src/config/env.js`
Valida que `DATABASE_URL` y `JWT_SECRET` existan al arrancar. Falla rápido si faltan.

### Paso 4 — Generar baseline de migración
Localmente, con una instancia de PostgreSQL corriendo:
1. Eliminar `prisma/migrations/` (contiene migraciones de SQLite).
2. Setear `DATABASE_URL` a la connection string de PostgreSQL local.
3. Correr `npx prisma migrate dev --name init`.
4. Commitear los archivos de migración generados.

### Paso 5 — Actualizar `seed.js`
- Importar `bcryptjs`.
- Hashear passwords con `bcrypt.hash(plainText, 10)` antes de insertar usuarios.
- Hacer el seed idempotente (usar `upsert` o delete-then-create).

### Paso 6 — Actualizar scripts en `package.json`
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "prisma migrate deploy",
    "seed": "prisma db seed",
    "postinstall": "prisma generate"
  }
}
```
En Railway, configurar el build command: `npm install && npm run migrate`.

### Paso 7 — Configurar variables de entorno en Railway
- `DATABASE_URL`: inyectada automáticamente por el plugin de PostgreSQL de Railway.
- `JWT_SECRET`: configurar manualmente en Railway → Variables.

---

## 7. Riesgos y Consideraciones

| # | Riesgo | Severidad | Mitigación |
|---|--------|-----------|------------|
| 1 | **Password enviado a la DB como parámetro de búsqueda.** `authRoutes.js` hace `where: { username, password }` — el password viaja en texto plano en la query y puede aparecer en logs de PostgreSQL. | **CRÍTICO** | Buscar solo por `username` y comparar con `bcrypt.compare()` en `authService.js`. Nunca buscar por password en la DB. |
| 2 | **JWT_SECRET no configurado en Railway.** Si falta, el servidor no debe arrancar. | **CRÍTICO** | Validar en `config/env.js` al iniciar. Lanzar error explícito si no está presente. |
| 3 | **Token JWT expuesto en localStorage.** Vulnerable a XSS. | **MEDIO** | Mitigación: evitar `dangerouslySetInnerHTML` en el frontend. En producción, considerar `httpOnly` cookies (fuera de scope de esta fase). |
| 4 | **Data loss en la migración.** SQLite no migra automáticamente a PostgreSQL. | **ALTO** | Clean start con seed. Si hay datos reales, escribir script de migración one-time. |
| 5 | **Usuarios existentes no pueden loguear.** Los passwords almacenados en texto plano se invalidan al pasar a bcrypt. | **ALTO** | Re-seed de todos los usuarios con passwords hasheados. Aceptable en pre-producción. |
| 6 | **Route handlers sin `try/catch`.** En Express 4, una promesa rechazada no se propaga al error middleware — el servidor crashea o no responde. | **MEDIO** | Todos los controllers deben usar `try/catch` + `next(err)`. Obligatorio, no opcional. |
| 7 | **Build en Railway falla por timing de Prisma generate.** | **MEDIO** | El hook `postinstall` en `package.json` garantiza que `prisma generate` corra después de `npm install`. |
| 8 | **Módulo nativo de bcrypt falla en Railway.** | **BAJO** | Usar `bcryptjs` (pure JS, API-compatible) en lugar de `bcrypt`. |

---

## 8. Archivos Críticos para la Implementación

| Archivo | Acción |
|---------|--------|
| `backend/prisma/schema.prisma` | Cambiar provider a `postgresql` |
| `backend/database.js` | Eliminar; reemplazar con `src/config/prisma.js` |
| `backend/src/config/env.js` | Crear — valida `DATABASE_URL` y `JWT_SECRET` |
| `backend/src/middlewares/authMiddleware.js` | Crear — valida JWT, adjunta `req.user` |
| `backend/src/middlewares/errorHandler.js` | Crear — middleware centralizado de errores |
| `backend/routes/authRoutes.js` | Mover lógica a `authController` + `authService` |
| `backend/routes/productRoutes.js` | Mover lógica a `productController` + `productService` |
| `backend/server.js` | Actualizar imports, agregar middlewares |
| `backend/prisma/seed.js` | Hashear passwords con bcryptjs |
| `backend/package.json` | Agregar scripts de Railway + dependencias |
| `frontend/src/stores/useAuthStore.js` | Crear — incluir `token` en el estado |
| `frontend/src/stores/useCartStore.js` | Crear — persist con localStorage |
| `frontend/src/components/PrivateRoute.jsx` | Crear — protege rutas por sesión y rol |

---

## 9. Textos Oficiales Obligatorios

| Elemento | Texto |
|----------|-------|
| Botón agregar al carrito | `Agregar al carrito` |
| Enlace al carrito en header | `Carrito` |
| Botón ir al checkout | `Ir al checkout` |
| Botón eliminar del carrito | `Quitar` |
| Carrito vacío | `Tu carrito está vacío.` |
| Título checkout | `Checkout` |
| Botón confirmar compra | `Confirmar compra` |
| Error en checkout | `Ocurrió un problema al procesar tu compra. Por favor intenta de nuevo.` |
| Título confirmación | `¡Gracias por tu compra!` |
| Texto confirmación | `Hemos enviado un correo de confirmación con los detalles de tu pedido.` |
| Botón volver al catálogo | `Volver al catálogo` |
| Título 404 | `Página no encontrada` |
| Texto 404 | `La página que estás buscando no existe o ha sido movida.` |
| Enlace 404 | `Volver al inicio` |

---

## 10. Wireframes de Referencia

Los diseños visuales de referencia (pixel perfect) incluyen:

1. Página de Inicio
2. Carrito de compras (previo al checkout)
3. Resumen del pedido (Checkout)
4. Compra finalizada (Confirmación)
5. Página no encontrada (404)

*(Disponibles en el directorio `docs/` del repositorio y en la plataforma Lyfter Learning.)*

---

*Documento consolidado – Fase 4: SPA + Zustand + JWT + backend por capas + PostgreSQL en Railway.*
