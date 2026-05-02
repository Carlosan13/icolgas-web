// Importamos las librerías que instalamos
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');

// Cargamos las variables del archivo .env
dotenv.config();

// Creamos la aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos MySQL en Railway usando URL
const db = mysql.createPool(process.env.DB_URL + '?ssl={"rejectUnauthorized":false}');

// Verificamos que la conexión funcione
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    return;
  }
  console.log('Conectado a la base de datos MySQL en Railway');
  connection.release();
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor de Icolgas funcionando correctamente',
    version: '1.0.0',
    empresa: 'Icolgas — Conectamos Futuro...'
  });
});

// Ruta para verificar la conexión a la base de datos
app.get('/db-test', (req, res) => {
  db.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos', detalle: err.message });
    }
    res.json({
      mensaje: 'Base de datos conectada correctamente',
      resultado: results[0].resultado
    });
  });
});

// Iniciamos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Icolgas corriendo en http://localhost:${PORT}`);
});