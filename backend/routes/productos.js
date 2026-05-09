const express = require('express');
const router = express.Router();

module.exports = (db) => {

  /**
   * @swagger
   * /productos:
   *   get:
   *     summary: Obtener todos los productos activos
   *     tags: [Productos]
   *     responses:
   *       200:
   *         description: Lista de productos activos con su categoría
   *       500:
   *         description: Error del servidor
   */
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

  /**
   * @swagger
   * /productos/{id}:
   *   get:
   *     summary: Obtener un producto por ID
   *     tags: [Productos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del producto
   *     responses:
   *       200:
   *         description: Producto encontrado
   *       404:
   *         description: Producto no encontrado
   *       500:
   *         description: Error del servidor
   */
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

  /**
   * @swagger
   * /productos/categoria/{id}:
   *   get:
   *     summary: Obtener productos por categoría
   *     tags: [Productos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la categoría
   *     responses:
   *       200:
   *         description: Lista de productos de esa categoría
   *       500:
   *         description: Error del servidor
   */
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

  /**
   * @swagger
   * /productos:
   *   post:
   *     summary: Crear un nuevo producto (solo admin)
   *     tags: [Productos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre
   *               - referencia
   *               - precio
   *               - id_categoria
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: Válvula de gas 1/2
   *               referencia:
   *                 type: string
   *                 example: VG-001
   *               descripcion:
   *                 type: string
   *                 example: Válvula de cierre rápido para instalaciones de gas
   *               precio:
   *                 type: number
   *                 example: 45000
   *               stock:
   *                 type: integer
   *                 example: 50
   *               imagen_url:
   *                 type: string
   *                 example: https://ejemplo.com/imagen.jpg
   *               id_categoria:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       201:
   *         description: Producto creado exitosamente
   *       400:
   *         description: Campos obligatorios faltantes
   *       500:
   *         description: Error del servidor
   */
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

  /**
   * @swagger
   * /productos/{id}:
   *   put:
   *     summary: Actualizar un producto (solo admin)
   *     tags: [Productos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del producto a actualizar
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *               referencia:
   *                 type: string
   *               descripcion:
   *                 type: string
   *               precio:
   *                 type: number
   *               stock:
   *                 type: integer
   *               imagen_url:
   *                 type: string
   *               id_categoria:
   *                 type: integer
   *               activo:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Producto actualizado exitosamente
   *       500:
   *         description: Error del servidor
   */
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, referencia, descripcion, precio, stock, imagen_url, id_categoria, activo } = req.body;
    db.query(
      'UPDATE PRODUCTO SET nombre=?, referencia=?, descripcion=?, precio=?, stock=?, imagen_url=?, id_categoria=?, activo=? WHERE id_producto=?',
      [nombre, referencia, descripcion, precio, stock, imagen_url, id_categoria, activo, id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar producto', detalle: err.message });
        }
        res.json({ mensaje: 'Producto actualizado' });
      }
    );
  });

  return router;
};