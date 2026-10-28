# GraffiArt - Frontend

React + Vite. Estilos con Tailwind, rutas con React Router, estado con Zustand, peticiones con Axios y validaciones con Yup.

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

La variable `VITE_API_URL` apunta al backend (por defecto `http://localhost:3000/api`).

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run lint`: revisión de código

## Estructura (`src/`)

- `api/`: cliente de Axios (agrega el token a cada request)
- `components/`: una carpeta por componente
- `constants/`: rutas, textos, formularios y datos estáticos
- `hooks/`: custom hooks (carga de datos, CRUD, perfil, diseños, configurador)
- `pages/`: una carpeta por página
- `schemas/`: validaciones con Yup
- `services/`: llamadas a la API
- `store/`: estado global con Zustand (sesión y carrito)
- `utils/`: funciones auxiliares
- `router.jsx`: rutas de la aplicación
