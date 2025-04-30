    const db = require('../config/database'); // Importar el pool de conexiones promise-based
    const bcrypt = require('bcrypt'); // Importar bcrypt para hashear contraseñas

    const User = {
        /**
         * Crea un nuevo usuario en la base de datos.
         * @param {object} userData - Datos del usuario { username, email, password, role }
         * @returns {Promise<object>} - Resultado de la inserción (ej: { insertId: newUserId })
         */
        async create(userData) {
            const { username, email, password, role = 'user' } = userData; // Rol por defecto 'user'

            // Hashear la contraseña antes de guardarla
            const saltRounds = 10; // Factor de costo para bcrypt
            const password_hash = await bcrypt.hash(password, saltRounds);

            const sql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
            const params = [username, email, password_hash, role];

            try {
                // Usamos [result] para obtener solo el primer elemento del array devuelto por query
                const [result] = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error al crear usuario:', error);
                // Relanzar el error para que el controlador lo maneje
                throw error;
            }
        },

        /**
         * Busca un usuario por su dirección de correo electrónico.
         * @param {string} email - Correo electrónico del usuario a buscar.
         * @returns {Promise<object|null>} - Objeto del usuario si se encuentra, null si no.
         */
        async findByEmail(email) {
            const sql = 'SELECT * FROM users WHERE email = ?';
            try {
                const [rows] = await db.query(sql, [email]);
                // rows es un array, devolvemos el primer elemento o null si está vacío
                return rows.length > 0 ? rows[0] : null;
            } catch (error) {
                console.error('Error al buscar usuario por email:', error);
                throw error;
            }
        },

        /**
         * Busca un usuario por su ID.
         * @param {number} id - ID del usuario a buscar.
         * @returns {Promise<object|null>} - Objeto del usuario si se encuentra, null si no.
         */
        async findById(id) {
            const sql = 'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?'; // Excluir password_hash por seguridad
            try {
                const [rows] = await db.query(sql, [id]);
                return rows.length > 0 ? rows[0] : null;
            } catch (error) {
                console.error('Error al buscar usuario por ID:', error);
                throw error;
            }
        },

        /**
         * Obtiene todos los usuarios, opcionalmente filtrados por un término de búsqueda.
         * @param {string} [searchTerm=''] - Término para buscar en username o email.
         * @returns {Promise<Array<object>>} - Array de objetos de usuario.
         */
        async findAll(searchTerm = '') {
            let sql = 'SELECT id, username, email, role, created_at FROM users';
            const params = [];

            if (searchTerm) {
                sql += ' WHERE username LIKE ? OR email LIKE ?';
                const likeTerm = `%${searchTerm}%`; // Añadir comodines para búsqueda parcial
                params.push(likeTerm, likeTerm);
            }

            sql += ' ORDER BY username'; // Ordenar alfabéticamente por nombre de usuario

            try {
                const [rows] = await db.query(sql, params);
                return rows;
            } catch (error) {
                console.error('Error al obtener todos los usuarios:', error);
                throw error;
            }
        },

        /**
         * Actualiza los datos de un usuario existente por su ID.
         * @param {number} id - ID del usuario a actualizar.
         * @param {object} userData - Datos a actualizar { username, email, role, password } (password es opcional)
         * @returns {Promise<object>} - Resultado de la actualización (ej: { affectedRows: 1 })
         */
        async update(id, userData) {
            const { username, email, role, password } = userData;
            let sql = 'UPDATE users SET username = ?, email = ?, role = ?';
            const params = [username, email, role];

            // Si se proporciona una nueva contraseña, hashearla y añadirla a la consulta
            if (password) {
                const saltRounds = 10;
                const password_hash = await bcrypt.hash(password, saltRounds);
                sql += ', password_hash = ?';
                params.push(password_hash);
            }

            sql += ' WHERE id = ?';
            params.push(id);

            try {
                const [result] = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
                throw error;
            }
        },

        /**
         * Elimina un usuario por su ID.
         * @param {number} id - ID del usuario a eliminar.
         * @returns {Promise<object>} - Resultado de la eliminación (ej: { affectedRows: 1 })
         */
        async deleteById(id) {
            const sql = 'DELETE FROM users WHERE id = ?';
            try {
                const [result] = await db.query(sql, [id]);
                return result;
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                throw error;
            }
        }
    };

    module.exports = User; // Exportar el objeto User con todos los métodos
    