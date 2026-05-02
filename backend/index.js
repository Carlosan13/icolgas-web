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

// Conexión a la base de datos MySQL en Railway usando pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 30000
});

// Verificamos que la conexión funcione
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    return;
  }
  console.log('Conectado a la base de datos MySQL en Railway');
  connection.release();
});

// Importamos las rutas y les pasamos la conexión a la base de datos
const categoriasRouter = require('./routes/categorias')(db);
const productosRouter = require('./routes/productos')(db);
const agendamientosRouter = require('./routes/agendamientos')(db);
const pedidosRouter = require('./routes/pedidos')(db);
const tiposerviciosRouter = require('./routes/tiposervicios')(db);

// Registramos las rutas en el servidor
app.use('/categorias', categoriasRouter);
app.use('/productos', productosRouter);
app.use('/agendamientos', agendamientosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/tiposervicios', tiposerviciosRouter);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor de Icolgas funcionando correctamente',
    version: '1.0.0',
    empresa: 'Icolgas — Conectamos Futuro...',
    rutas: {
      categorias: '/categorias',
      productos: '/productos',
      agendamientos: '/agendamientos',
      pedidos: '/pedidos',
      tiposervicios: '/tiposervicios',
      test_db: '/db-test'
    }
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