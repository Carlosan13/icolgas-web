const express = require('express');
const router = express.Router();

module.exports = (db) => {

  /**
   * @swagger
   * /categorias:
   *   get:
   *     summary: Obtener todas las categorías activas
   *     tags: [Categorías]
   *     responses:
   *       200:
   *         description: Lista de categorías activas
   *       500:
   *         description: Error del servidor
   */
  router.get('/', (req, res) => {
    db.query('SELECT * FROM CATEGORIA WHERE activa = 1', (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener categorías', detalle: err.message });
      }
      res.json(results);
    });
  });

  /**
   * @swagger
   * /categorias/{id}:
   *   get:
   *     summary: Obtener una categoría por ID
   *     tags: [Categorías]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la categoría
   *     responses:
   *       200:
   *         description: Categoría encontrada
   *       404:
   *         description: Categoría no encontrada
   *       500:
   *         description: Error del servidor
   */
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM CATEGORIA WHERE id_categoria = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener categoría', detalle: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      res.json(results[0]);
    });
  });

  /**
   * @swagger
   * /categorias:
   *   post:
   *     summary: Crear una nueva categoría (solo admin)
   *     tags: [Categorías]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: Tuberías
   *               descripcion:
   *                 type: string
   *                 example: Materiales para instalación de tuberías de gas
   *     responses:
   *       201:
   *         description: Categoría creada exitosamente
   *       400:
   *         description: El nombre es obligatorio
   *       500:
   *         description: Error del servidor
   */
  router.post('/', (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    db.query(
      'INSERT INTO CATEGORIA (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al crear categoría', detalle: err.message });
        }
        res.status(201).json({ mensaje: 'Categoría creada', id: results.insertId });
      }
    );
  });

  return router;
};