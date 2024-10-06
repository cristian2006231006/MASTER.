const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración para el análisis del cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de sesiones
app.use(session({
    secret: 'tu-secreto-aqui',
    resave: false,
    saveUninitialized: true
}));

// Configuración para servir archivos HTML
app.use(express.static(path.join(__dirname, 'vistas')));

// Importar Rutas
const clientesRutas = require ('./rutas/clientesRutas');


app.use('/clientes', clientesRutas);


// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'index.html'));
});

// Ruta para otros archivos HTML
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'login.html'));
});

app.get('/eventos', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'eventos.html'));
});

app.get('/reservas', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'reservas.html'));
});

app.get('/cotizar', (req, res) => {
  res.sendFile(path.join(__dirname, 'vistas', 'cotizar.html'));
});

// Manejador de errores 404
app.use((req, res, next) => {
    const error = new Error('Página no encontrada');
    error.status = 404;
    next(error);  // Pasar el error al siguiente middleware de manejo de errores
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    // Establecer el estado HTTP del error (usar 500 si no está definido)
    const statusCode = err.status || 500;
    res.status(statusCode);

    // Mostrar más detalles en el entorno de desarrollo
    res.json({
        status: statusCode,
        message: err.message,
        // Mostrar la pila de errores solo si estás en desarrollo
        stack: app.get('env') === 'development' ? err.stack : {}
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 500, message: 'Error del servidor', error: err.stack });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
