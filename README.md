# Ery Project

Sistema de gestión de usuarios con autenticación y panel de administración.

## Estructura y funcionamiento de los archivos principales

### server.js
Archivo principal que inicia la aplicación Express, configura middlewares, sesiones, rutas y manejo de errores.

### package.json
Define las dependencias, scripts y metadatos del proyecto Node.js.

### src/config/database.js
Configura la conexión a la base de datos MySQL usando variables de entorno.

### src/models/user.model.js
Contiene funciones para crear, buscar, actualizar y eliminar usuarios en la base de datos.

### src/controllers/
- **auth.controller.js**: Lógica para login, logout y renderizado de la vista de login.
- **main.controller.js**: Renderiza la página principal y home según el estado de sesión.
- **admin.controller.js**: Lógica para listar, crear, editar y eliminar usuarios (solo admin).

### src/middlewares/auth.middleware.js
Middlewares para verificar si el usuario está autenticado y si es administrador.

### src/routes/
- **auth.routes.js**: Rutas para login y logout.
- **main.routes.js**: Rutas para home y raíz.
- **admin.routes.js**: Rutas protegidas para gestión de usuarios (solo admin).

### views/
Vistas EJS para renderizar las páginas:
- **auth/login.ejs**: Formulario de inicio de sesión.
- **home.ejs**: Página principal tras login.
- **admin/user_list.ejs**: Listado y búsqueda de usuarios (admin).
- **admin/user_form.ejs**: Formulario para crear/editar usuarios (admin).
- **404.ejs**: Página de error 404.

### public/
Archivos estáticos (CSS, JS del cliente, imágenes).

### tests/
Pruebas unitarias y utilidades para el proyecto.

---

**Variables sensibles** deben ir en un archivo `.env` (no incluido en el repositorio).

**Para iniciar:**
1. Instala dependencias: `npm install`
2. Configura `.env` con tus credenciales de base de datos y secreto de sesión.
3. Ejecuta: `npm start` o `npm run dev` (con nodemon)
