const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',  
  port: 3306,         
  user: 'root',       
  password: '',        
  database: 'prueba',
  connectTimeout: 1000000
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:');
    console.error('Código de error:', err.code);
    console.error('Número de error:', err.errno);
    console.error('Mensaje:', err.message);
    return;
  }
  console.log('Conexión a la base de datos');
});


module.exports = connection;
