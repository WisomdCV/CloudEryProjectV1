const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

// Importar rutas
const authRoutes = require('./src/routes/auth.routes'); 
const mainRoutes = require('./src/routes/main.routes'); // Asegúrate de que esta ruta sea correcta
const adminRoutes = require('./src/routes/admin.routes'); // Asegúrate de que esta ruta sea correcta

// Cargar variables de entorno desde .env
dotenv.config();

// Crear la aplicación Express
const app = express();

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
// Especificar la ubicación de las vistas (por defecto es ./views)
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos (CSS, JS del cliente, imágenes)
// Cualquier archivo en la carpeta 'public' será accesible directamente
// Ejemplo: http://localhost:3000/css/style.css buscará public/css/style.css
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear datos de formularios (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Middleware para parsear datos JSON (application/json)
app.use(express.json());

// Configuración de express-session
// IMPORTANTE: Cambia 'TU_SECRETO_MUY_SEGURO' por algo aleatorio y guárdalo en .env
// Puedes generar uno aquí: https://randomkeygen.com/
app.use(session({
    secret: process.env.SESSION_SECRET || 'TU_SECRETO_MUY_SEGURO', // ¡Cambiar y poner en .env!
    resave: false, // No guardar la sesión si no se modificó
    saveUninitialized: false, // No guardar sesiones nuevas vacías
    cookie: {
        // secure: process.env.NODE_ENV === 'production', // Usar true en producción (HTTPS)
        maxAge: 1000 * 60 * 60 * 24 // Tiempo de vida de la cookie (ej: 1 día)
    }
}));

// Registrar las rutas de autenticación
app.use('/', authRoutes);
app.use('/', mainRoutes); // Asegúrate de que esta ruta sea correcta
app.use('/admin', adminRoutes); // Asegúrate de que esta ruta sea correcta

app.use((req, res, next) => {
    // Renderiza la vista 404 y establece el código de estado HTTP correcto
    res.status(404).render('404', {
        pageTitle: 'Página No Encontrada'
         // No necesitamos pasar 'user' aquí ya que es una página de error genérica
    });
});


// Ruta de prueba inicial
app.get('/', (req, res) => {
    // Por ahora, solo envía un mensaje. Más adelante, renderizaremos vistas.
    // Podemos verificar si hay sesión:
    if (req.session.user) {
        res.send(`Hola ${req.session.user.username}! Estás logueado. <a href="/logout">Logout</a>`);
    } else {
         res.send('Bienvenido a Ery! <a href="/login">Login</a>'); // Enlazaremos a login más tarde
    }
});

// Middleware de manejo de errores (básico por ahora)
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err.stack);
    // Podríamos renderizar una vista de error 500 aquí
    res.status(500).send('¡Ups! Algo salió mal en el servidor.');
});


// Definir el puerto
// Lee el puerto desde las variables de entorno o usa 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});