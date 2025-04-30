const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
    async create(userData) {
        const { username, email, password, role = 'user' } = userData;
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        const sql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
        const params = [username, email, password_hash, role];
        try {
            const [result] = await db.query(sql, params);
            return result;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    },
    async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        try {
            const [rows] = await db.query(sql, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    },
    async findById(id) {
        const sql = 'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?';
        try {
            const [rows] = await db.query(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    },
    async findAll(searchTerm = '') {
        let sql = 'SELECT id, username, email, role, created_at FROM users';
        const params = [];
        if (searchTerm) {
            sql += ' WHERE username LIKE ? OR email LIKE ?';
            const likeTerm = `%${searchTerm}%`;
            params.push(likeTerm, likeTerm);
        }
        sql += ' ORDER BY username';
        try {
            const [rows] = await db.query(sql, params);
            return rows;
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    },
    async update(id, userData) {
        const { username, email, role, password } = userData;
        let sql = 'UPDATE users SET username = ?, email = ?, role = ?';
        const params = [username, email, role];
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

module.exports = User;
