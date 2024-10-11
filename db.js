const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '172.17.0.2', // Porque el contenedor está en la misma máquina EC2
  user: 'root',      // El usuario por defecto en MySQL
  password: 'admin', // La contraseña que configuraste
  database: 'proyecto', // Asegúrate de haber creado esta base de datos
  port: 3306         // El puerto de MySQL
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Successful connection to MySQL');
});

module.exports = connection;