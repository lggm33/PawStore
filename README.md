# PawStore

Tienda en línea de productos para mascotas. Frontend construido con React 19 y Vite 7.

## Estado del proyecto

### Fase 1 - Estructura base

- Layout general: Header con navegación, contenido principal y Footer.
- Página de inicio con presentación de la tienda.
- Catálogo de productos con vista en grid.
- Vista de detalle por producto.

### Fase 2 - Administración

- Panel de administración con tabla de productos.
- Formulario para agregar nuevos productos.
- Edición de productos existentes.
- Eliminación de productos.
- Estado gestionado en memoria con Zustand (sin persistencia).

### Fase 3 - Integración con backend y autenticación (en desarrollo)

- Conexión con API REST del backend.
- Reemplazo de datos estáticos por llamadas al servidor.
- Sistema de autenticación con roles de usuario.

## Stack técnico

| Herramienta | Uso |
|---|---|
| React 19 | UI con componentes funcionales |
| Vite 7 | Bundler y dev server |
| Zustand | Manejo de estado global |
| SWC | Compilación rápida de JSX |
| ESLint 9 | Linting con flat config |
| vite-plugin-svgr | Importar SVGs como componentes |

## Estructura del proyecto

```
frontend/
├── src/
│   ├── App.jsx              # Routing y layout principal
│   ├── main.jsx             # Entry point
│   ├── index.css            # Variables CSS y estilos globales
│   ├── assets/              # Imágenes y data.json (datos estáticos)
│   ├── components/          # Header, Footer
│   ├── pages/               # Home, Products, Details, Administration, EditProduct
│   └── store/               # Zustand store (useProductStore)
```

## Rutas

| URL | Página | Descripción |
|---|---|---|
| `/` | Home | Bienvenida y presentación |
| `/products` | Products | Catálogo en grid |
| `/details?id=X` | Details | Detalle de un producto |
| `/administration` | Administration | Gestión de productos (tabla + formulario) |
| `/edit?id=X` | EditProduct | Edición de un producto |

El routing es una implementación custom con `pushState` y `popstate` (sin React Router).

## Datos

Los productos usan campos en español (`nombre`, `descripcion`, `precio`, `categoria`, `imagen`, `stock`). Los precios están en colones costarricenses (₡).

## Inicio rápido

```bash
cd frontend
npm install
npm run dev
```

## Scripts disponibles

```
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run lint      # Ejecutar ESLint
npm run preview   # Preview del build
```
