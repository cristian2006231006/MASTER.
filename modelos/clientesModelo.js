const db = require('../config/db');


// Función para registrar un nuevo cliente
const registrarCliente = (clienteData, callback) => {
    const { nombres, apellidos, correo, contrasena, direccion, celular } = clienteData;
    const fechaRegistro = new Date();
    const sql = `INSERT INTO clientes (nombres, apellidos, correo, contrasena, direccion, fechaRegistro, celular) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [nombres, apellidos, correo, contrasena, direccion, fechaRegistro, celular], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

// Función para autenticar un cliente
const autenticarCliente = (correo, contrasena, callback) => {
    const sql = `SELECT * FROM clientes WHERE correo = ? AND contrasena = ?`;
    db.query(sql, [correo, contrasena], (err, result) => {
        if (err) {
            return callback(err);
        }
        if (result.length > 0) {
            callback(null, result[0]);  // Usuario encontrado
        } else {
            callback(null, null);  // Usuario no encontrado
        }
    });
};

// Función para actualizar la contraseña de un cliente
const actualizarContrasena = (correo, nuevaContrasena, callback) => {
    const sql = `UPDATE clientes SET contrasena = ? WHERE correo = ?`;
    db.query(sql, [nuevaContrasena, correo], (err, result) => {
        if (err) {
            return callback(err);
        }
        // Callback con el resultado de la actualización
        callback(null, result);
    });
};

// Función para obtener todos los clientes (ejemplo adicional)
const obtenerClientes = (callback) => {
    const sql = `SELECT * FROM clientes`;
    db.query(sql, (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

// Exportar las funciones para su uso en otros módulos
module.exports = {
    registrarCliente,
    autenticarCliente,
    actualizarContrasena,
    obtenerClientes
};