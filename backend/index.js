// Importamos las librerías que instalamos
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargamos las variables del archivo .env
dotenv.config();

// Creamos la aplicación Express
const app = express();

// Middlewares — son funciones que se ejecutan antes de cada petición
app.use(cors()); // Permite que React se comunique con este servidor
app.use(express.json()); // Permite recibir datos en formato JSON

// Primera ruta — sirve para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor de Icolgas funcionando correctamente',
    version: '1.0.0',
    empresa: 'Icolgas — Conectamos Futuro...'
  });
});

// Iniciamos el servidor en el puerto definido en .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Icolgas corriendo en http://localhost:${PORT}`);
});