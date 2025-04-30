    const mysql = require('mysql2');
    const dotenv = require('dotenv');

    // Cargar variables de entorno (asegúrate de que .env esté en la raíz del proyecto)
    dotenv.config();

    // Crear un pool de conexiones a la base de datos
    // Un pool es más eficiente que crear una conexión nueva cada vez
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',        // Host de la BD (desde .env o default)
        user: process.env.DB_USER || 'root',             // Usuario de la BD (desde .env o default)
        password: process.env.DB_PASSWORD || '',         // Contraseña de la BD (desde .env)
        database: process.env.DB_NAME || 'ery_db',       // Nombre de la BD (desde .env o default)
        port: process.env.DB_PORT || 3307,               // Puerto de la BD (desde .env o default)
        waitForConnections: true,                        // Esperar si todas las conexiones están en uso
        connectionLimit: 10,                             // Número máximo de conexiones en el pool
        queueLimit: 0                                    // Sin límite en la cola de espera
    });

    // Opcional: Probar la conexión al iniciar (puede ser útil para depurar)
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err.message);
            // Considera terminar la aplicación si la conexión inicial falla
            // process.exit(1);
            return;
        }
        console.log('Conexión a la base de datos MySQL establecida correctamente.');
        // Liberar la conexión de prueba
        connection.release();
    });

    // Exportar el pool de conexiones con soporte para Promises
    // Esto facilita el uso de async/await en los modelos
    module.exports = pool.promise();
