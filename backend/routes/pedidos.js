const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // GET /pedidos — obtener todos los pedidos (solo admin)
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

  // GET /pedidos/:id — obtener un pedido con sus detalles
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query(
      'SELECT * FROM PEDIDO WHERE id_pedido = ?',
      [id],
      (err, pedido) => {
        if (err) {
          return res.status(500).json({ error: 'Error al obtener pedido', detalle: err.message });
        }
        if (pedido.length === 0) {
          return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        // Obtenemos los detalles del pedido
        db.query(
          `SELECT d.*, p.nombre AS producto_nombre, p.referencia 
           FROM DETALLE_PEDIDO d
           JOIN PRODUCTO p ON d.id_producto = p.id_producto
           WHERE d.id_pedido = ?`,
          [id],
          (err, detalles) => {
            if (err) {
              return res.status(500).json({ error: 'Error al obtener detalles', detalle: err.message });
            }
            res.json({
              ...pedido[0],
              detalles: detalles
            });
          }
        );
      }
    );
  });

  // POST /pedidos — crear un nuevo pedido
  // Esta ruta la usa el carrito de compras del sitio web
  router.post('/', (req, res) => {
    const {
      nombre_cliente,
      telefono,
      correo,
      direccion_envio,
      metodo_pago,
      notas,
      id_cliente,
      items
    } = req.body;

    // Validamos campos obligatorios
    if (!nombre_cliente || !telefono || !direccion_envio || !metodo_pago || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Nombre, teléfono, dirección, método de pago e items son obligatorios'
      });
    }

    // Calculamos el total del pedido
    const total = items.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);

    // Insertamos el pedido
    db.query(
      `INSERT INTO PEDIDO 
        (nombre_cliente, telefono, correo, direccion_envio, total, metodo_pago, notas, id_cliente) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre_cliente, telefono, correo || null, direccion_envio, total, metodo_pago, notas || null, id_cliente || null],
      (err, resultado) => {
        if (err) {
          return res.status(500).json({ error: 'Error al crear pedido', detalle: err.message });
        }

        const id_pedido = resultado.insertId;

        // Insertamos cada item del pedido en DETALLE_PEDIDO
        const detalles = items.map(item => [
          id_pedido,
          item.id_producto,
          item.cantidad,
          item.precio_unitario
        ]);

        db.query(
          'INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario) VALUES ?',
          [detalles],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Error al guardar detalles', detalle: err.message });
            }
            res.status(201).json({
              mensaje: 'Pedido creado correctamente',
              id_pedido: id_pedido,
              total: total
            });
          }
        );
      }
    );
  });

  // PUT /pedidos/:id/estado — actualizar estado del pedido (solo admin)
  router.put('/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    db.query(
      'UPDATE PEDIDO SET estado = ? WHERE id_pedido = ?',
      [estado, id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar estado', detalle: err.message });
        }
        res.json({ mensaje: 'Estado del pedido actualizado correctamente' });
      }
    );
  });

  return router;
};