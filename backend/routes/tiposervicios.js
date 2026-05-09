const express = require('express');
const router = express.Router();

module.exports = (db) => {

  /**
   * @swagger
   * /tiposervicios:
   *   get:
   *     summary: Obtener todos los tipos de servicio
   *     tags: [Tipos de Servicio]
   *     responses:
   *       200:
   *         description: Lista de tipos de servicio disponibles
   *       500:
   *         description: Error del servidor
   */
  router.get('/', (req, res) => {
    db.query('SELECT * FROM TIPO_SERVICIO', (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener tipos de servicio', detalle: err.message });
      }
      res.json(results);
    });
  });

  /**
   * @swagger
   * /tiposervicios/{id}:
   *   get:
   *     summary: Obtener un tipo de servicio por ID
   *     tags: [Tipos de Servicio]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del tipo de servicio
   *     responses:
   *       200:
   *         description: Tipo de servicio encontrado
   *       404:
   *         description: Tipo de servicio no encontrado
   *       500:
   *         description: Error del servidor
   */
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