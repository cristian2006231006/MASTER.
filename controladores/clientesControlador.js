const clientesModelo = require('../modelos/clientesModelo');


// Registrar un nuevo cliente
const registrarCliente = (req, res) => {
    const clienteData = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        direccion: req.body.direccion || 'No proporcionada'
    };
    
    clientesModelo.registrarCliente(clienteData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al registrar' });
        }
        res.redirect('/login');
    });
};

// Iniciar sesión
const iniciarSesion = (req, res) => {
    const { correo, contrasena } = req.body;

    clientesModelo.autenticarCliente(correo, contrasena, (err, usuario) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        if (!usuario) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Iniciar sesión correctamente
        req.session.usuario = usuario;

        // Verificar si el correo y la contraseña coinciden con los valores específicos
        if (correo === 'cristianalcastiblanco7@gmail.com' && contrasena === 'Cristian200623') {
            // Redirigir al administrador
            res.redirect('/administrador/inicio2');
        } else if (correo === 'joseborda30@gmail.com' && contrasena === 'Borda.25.') {
            // Redirigir al empleado
            res.redirect('/empleado/inicio');
        } else {
            // Para otros usuarios, redirigir a la página principal
            res.redirect('/inicio1');
        }
    });
};


// Recuperar contraseña
const recuperarContrasena = (req, res) => {
    const { correo, nueva_contrasena } = req.body;

    clientesModelo.actualizarContrasena(correo, nueva_contrasena, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar la contraseña' });
        }
        res.redirect('/login');
    });
};

module.exports = {
    registrarCliente,
    iniciarSesion,
    recuperarContrasena
};
