const express = require('express');
const router = express.Router();

module.exports = (db) => {

  /**
   * @swagger
   * /pedidos:
   *   get:
   *     summary: Obtener todos los pedidos (solo admin)
   *     tags: [Pedidos]
   *     responses:
   *       200:
   *         description: Lista de pedidos con total de items
   *       500:
   *         description: Error del servidor
   */
  router.get('/', (req, res) => {
    const query = `
      SELECT p.*, COUNT(d.id_detalle) AS total_items
      FROM PEDIDO p
      LEFT JOIN DETALLE_PEDIDO d ON p.id_pedido = d.id_pedido
      GROUP BY p.id_pedido
      ORDER BY p.fecha_pedido DESC
    `;
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener pedidos', detalle: err.message });
      }
      res.json(results);
    });
  });

  /**
   * @swagger
   * /pedidos/{id}:
   *   get:
   *     summary: Obtener un pedido con sus detalles
   *     tags: [Pedidos]
   *     parameters:
   *       - in: path
   *         name: id
  *         required: true
   *         schema:
   *           type: integer
   *         description: ID del pedido
   *     responses:
   *       200:
   *         description: Pedido con lista de productos incluidos
   *       404:
   *         description: Pedido no encontrado
   *       500:
   *         description: Error del servidor
   */
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM PEDIDO WHERE id_pedido = ?', [id], (err, pedido) => {
      if (err) return res.status(500).json({ error: 'Error al obtener pedido', detalle: err.message });
      if (pedido.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
      db.query(
        `SELECT d.*, p.nombre AS producto_nombre, p.referencia FROM DETALLE_PEDIDO d JOIN PRODUCTO p ON d.id_producto = p.id_producto WHERE d.id_pedido = ?`,
        [id],
        (err, detalles) => {
          if (err) return res.status(500).json({ error: 'Error al obtener detalles', detalle: err.message });
          res.json({ ...pedido[0], detalles });
        }
      );
    });
  });

  /**
   * @swagger
   * /pedidos:
   *   post:
   *     summary: Crear un nuevo pedido desde el carrito de compras
   *     tags: [Pedidos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre_cliente
   *               - telefono
   *               - direccion_envio
   *               - metodo_pago
   *               - items
   *             properties:
   *               nombre_cliente:
   *                 type: string
   *                 example: María García
   *               telefono:
   *                 type: string
   *                 example: "3109876543"
   *               correo:
   *                 type: string
   *                 example: maria@correo.com
   *               direccion_envio:
   *                 type: string
   *                 example: Carrera 5 # 12-34, Girardot
   *               metodo_pago:
   *                 type: string
   *                 example: contraentrega
   *               notas:
   *                 type: string
   *                 example: Entregar en portería
   *               id_cliente:
   *                 type: integer
   *                 example: null
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id_producto:
   *                       type: integer
   *                       example: 1
   *                     cantidad:
   *                       type: integer
   *                       example: 2
   *                     precio_unitario:
   *                       type: number
   *                       example: 45000
   *     responses:
   *       201:
   *         description: Pedido creado correctamente
   *       400:
   *         description: Campos obligatorios faltantes
   *       500:
   *         description: Error del servidor
   */
  router.post('/', (req, res) => {
    const { nombre_cliente, telefono, correo, direccion_envio, metodo_pago, notas, id_cliente, items } = req.body;
    if (!nombre_cliente || !telefono || !direccion_envio || !metodo_pago || !items || items.length === 0) {
      return res.status(400).json({ error: 'Nombre, teléfono, dirección, método de pago e items son obligatorios' });
    }
    const total = items.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
    db.query(
      `INSERT INTO PEDIDO (nombre_cliente, telefono, correo, direccion_envio, total, metodo_pago, notas, id_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre_cliente, telefono, correo || null, direccion_envio, total, metodo_pago, notas || null, id_cliente || null],
      (err, resultado) => {
        if (err) return res.status(500).json({ error: 'Error al crear pedido', detalle: err.message });
        const id_pedido = resultado.insertId;
        const detalles = items.map(item => [id_pedido, item.id_producto, item.cantidad, item.precio_unitario]);
        db.query('INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario) VALUES ?', [detalles], (err) => {
          if (err) return res.status(500).json({ error: 'Error al guardar detalles', detalle: err.message });
          res.status(201).json({ mensaje: 'Pedido creado correctamente', id_pedido, total });
        });
      }
    );
  });

  /**
   * @swagger
   * /pedidos/{id}/estado:
   *   put:
   *     summary: Actualizar estado de un pedido (solo admin)
   *     tags: [Pedidos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del pedido
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - estado
   *             properties:
   *               estado:
   *                 type: string
   *                 enum: [pendiente, confirmado, enviado, entregado, cancelado]
   *                 example: confirmado
   *     responses:
   *       200:
   *         description: Estado actualizado correctamente
   *       400:
   *         description: Estado no válido
   *       500:
   *         description: Error del servidor
   */
  router.put('/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    db.query('UPDATE PEDIDO SET estado = ? WHERE id_pedido = ?', [estado, id], (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar estado', detalle: err.message });
      res.json({ mensaje: 'Estado del pedido actualizado correctamente' });
    });
  });

  return router;
};