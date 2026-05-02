const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // GET /tiposervicios — obtener todos los tipos de servicio
  // Esta ruta la usa el formulario de agendamiento para mostrar las opciones
  router.get('/', (req, res) => {
    db.query('SELECT * FROM TIPO_SERVICIO', (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener tipos de servicio', detalle: err.message });
      }
      res.json(results);
    });
  });

  // GET /tiposervicios/:id — obtener un tipo de servicio por ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM TIPO_SERVICIO WHERE id_tipo = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener tipo de servicio', detalle: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Tipo de servicio no encontrado' });
      }
      res.json(results[0]);
    });
  });

  return router;
};