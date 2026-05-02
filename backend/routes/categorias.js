// Importamos Express y creamos el router
const express = require('express');
const router = express.Router();

// Esta función recibe la conexión a la base de datos
module.exports = (db) => {

  // GET /categorias — obtener todas las categorías
  // Esta ruta la usa la tienda para mostrar los filtros de productos
  router.get('/', (req, res) => {
    db.query('SELECT * FROM CATEGORIA WHERE activa = 1', (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener categorías', detalle: err.message });
      }
      res.json(results);
    });
  });

  // GET /categorias/:id — obtener una categoría por su ID
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

  // POST /categorias — crear una nueva categoría (solo admin)
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