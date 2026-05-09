const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a la base de datos
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

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    return;
  }
  console.log('Conectado a la base de datos MySQL en Railway');
  connection.release();
});

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Icolgas',
      version: '1.0.0',
      description: 'Documentación de la API del sistema web de Icolgas - Comercio electrónico y agendamiento de servicios técnicos',
      contact: {
        name: 'Carlos Andrés Betancur Urueña',
        email: 'icolgas@hotmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desarrollo'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
const categoriasRouter = require('./routes/categorias')(db);
const productosRouter = require('./routes/productos')(db);
const agendamientosRouter = require('./routes/agendamientos')(db);
const pedidosRouter = require('./routes/pedidos')(db);
const tiposerviciosRouter = require('./routes/tiposervicios')(db);

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
    empresa: 'Icolgas - Conectamos Futuro...',
    rutas: {
      categorias: '/categorias',
      productos: '/productos',
      agendamientos: '/agendamientos',
      pedidos: '/pedidos',
      tiposervicios: '/tiposervicios',
      swagger: '/api-docs'
    }
  });
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Icolgas corriendo en http://localhost:${PORT}`);
  console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
});