const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

// Importar rutas
const authRoutes = require('./src/routes/auth.routes'); 
const mainRoutes = require('./src/routes/main.routes'); 
const adminRoutes = require('./src/routes/admin.routes');

dotenv.config();

// Crear la aplicación Express
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear datos de formularios (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Middleware para parsear datos JSON (application/json)
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'TU_SECRETO_MUY_SEGURO', 
    resave: false,
    saveUninitialized: false, // No guardar sesiones nuevas vacías
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

app.use('/', authRoutes);
app.use('/', mainRoutes); 
app.use('/admin', adminRoutes); 

app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Página No Encontrada'
        
    });
});


// Ruta de prueba inicial
app.get('/', (req, res) => {
    if (req.session.user) {
        res.send(`Hola ${req.session.user.username}! Estás logueado. <a href="/logout">Logout</a>`);
    } else {
        res.send('Bienvenido a Ery! <a href="/login">Login</a>'); 
    }
});

app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err.stack);
    res.status(500).send('¡Ups! Algo salió mal en el servidor.');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});