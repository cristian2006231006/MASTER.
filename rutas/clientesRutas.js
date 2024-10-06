const express = require('express');
const router = express.Router();
const clientesControlador = require('../controladores/clientesControlador');
const clientesModelo = require('../modelos/clientesModelo');

// Ruta para inicio de sesión
router.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json ({ message: 'Correo y contraseña son requeridos.' });
    }

    clientesModelo.autenticarCliente(correo, contrasena, (err, cliente) => {
        if (err) {
            console.error('Error autenticando cliente:', err);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }
        if (!cliente) {
            return res.status(401).json({ message: 'Datos incorrectas.' });
        }

        // Aquí podrías establecer una sesión o token
        res.status(200).json({ message: 'Inicio de sesión exitoso.' });
    });
});

// Ruta para registrarse
router.post('/registro', (req, res) => {
    const { nombres, apellidos, correo, contrasena, direccion, celular } = req.body;

    // Verificar si todos los campos están completos
    if (!nombres || !apellidos || !correo || !contrasena || !direccion || !celular) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    // Crear el objeto cliente con los datos proporcionados y la fecha actual
    const nuevoCliente = {
        nombres,
        apellidos,
        correo,
        contrasena, // Recuerda que deberías cifrar la contraseña antes de guardarla
        direccion,
        celular,
        fechaRegistro: new Date()
    };

    // Registrar el cliente en la base de datos
    clientesModelo.registrarCliente(nuevoCliente, (err, result) => {
        if (err) {
            // Verificar si el error es por duplicación de correo
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Este correo ya está registrado.' });
            }
            console.error('Error registrando cliente:', err);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }

        // Enviar respuesta exitosa
        res.status(200).json({ message: 'Cliente registrado con éxito.' });
    });
});


// Ruta para recuperar contraseña
router.post('/recuperar-contrasena', (req, res) => {
    const { correo, nueva_contrasena, repita_contrasena } = req.body;

    // Verificar que todos los campos estén completos
    if (!correo || !nueva_contrasena || !repita_contrasena) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    // Verificar que las contraseñas coincidan
    if (nueva_contrasena !== repita_contrasena) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
    }

    // Llamar a la función del modelo para actualizar la contraseña
    clientesModelo.actualizarContrasena(correo, nueva_contrasena, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor.' });
        }

        // Verificar si se actualizó alguna fila
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró un cliente con ese correo.' });
        }

        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    });
});

module.exports = router;