// Importamos Express y creamos el router
const express = require('express');
const router = express.Router();

// Esta función recibe la conexión a la base de datos
module.exports = (db) => {

  // GET /productos — obtener todos los productos activos
  // Esta ruta la usa la tienda virtual para mostrar el catálogo
  router.get('/', (req, res) => {
    const query = `
      SELECT p.*, c.nombre AS categoria_nombre 
      FROM PRODUCTO p
      JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
      WHERE p.activo = 1
    `;
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener productos', detalle: err.message });
      }
      res.json(results);
    });
  });

  // GET /productos/:id — obtener un producto por su ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT p.*, c.nombre AS categoria_nombre 
      FROM PRODUCTO p
      JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ? AND p.activo = 1
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener producto', detalle: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(results[0]);
    });
  });

  // GET /productos/categoria/:id — obtener productos por categoría
  // Esta ruta la usa el filtro de la tienda
  router.get('/categoria/:id', (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT p.*, c.nombre AS categoria_nombre 
      FROM PRODUCTO p
      JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
      WHERE p.id_categoria = ? AND p.activo = 1
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener productos', detalle: err.message });
      }
      res.json(results);
    });
  });

  // POST /productos — crear un nuevo producto (solo admin)
  router.post('/', (req, res) => {
    const { nombre, referencia, descripcion, precio, stock, imagen_url, id_categoria } = req.body;
    if (!nombre || !referencia || !precio || !id_categoria) {
      return res.status(400).json({ error: 'Nombre, referencia, precio y categoría son obligatorios' });
    }
    db.query(
      'INSERT INTO PRODUCTO (nombre, referencia, descripcion, precio, stock, imagen_url, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, referencia, descripcion || null, precio, stock || 0, imagen_url || null, id_categoria],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al crear producto', detalle: err.message });
        }
        res.status(201).json({ mensaje: 'Producto creado', id: results.insertId });
      }
    );
  });

  // PUT /productos/:id — actualizar un producto (solo admin)
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, referencia, descripcion, precio, stock, imagen_url, id_categoria, activo } = req.body;
    db.query(
      'UPDATE PRODUCTO SET nombre=?, referencia=?, descripcion=?, precio=?, stock=?, imagen_url=?, id_categoria=?, activo=? WHERE id_producto=?',
      [nombre, referencia, descripcion, precio, stock, imagen_url, id_categoria, activo, id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar producto', detalle: err.message });
        }
        res.json({ mensaje: 'Producto actualizado' });
      }
    );
  });

  return router;
};