const express = require('express');
const router = express.Router();

module.exports = (db) => {

  /**
   * @swagger
   * /agendamientos:
   *   get:
   *     summary: Obtener todos los agendamientos (solo admin)
   *     tags: [Agendamientos]
   *     responses:
   *       200:
   *         description: Lista de agendamientos ordenados por fecha
   *       500:
   *         description: Error del servidor
   */
  router.get('/', (req, res) => {
    const query = `
      SELECT a.*, ts.nombre AS tipo_servicio_nombre
      FROM AGENDAMIENTO a
      JOIN TIPO_SERVICIO ts ON a.id_tipo_servicio = ts.id_tipo
      ORDER BY a.fecha_registro DESC
    `;
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener agendamientos', detalle: err.message });
      }
      res.json(results);
    });
  });

  /**
   * @swagger
   * /agendamientos/{id}:
   *   get:
   *     summary: Obtener un agendamiento por ID
   *     tags: [Agendamientos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del agendamiento
   *     responses:
   *       200:
   *         description: Agendamiento encontrado
   *       404:
   *         description: Agendamiento no encontrado
   *       500:
   *         description: Error del servidor
   */
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT a.*, ts.nombre AS tipo_servicio_nombre
      FROM AGENDAMIENTO a
      JOIN TIPO_SERVICIO ts ON a.id_tipo_servicio = ts.id_tipo
      WHERE a.id_agenda = ?
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener agendamiento', detalle: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Agendamiento no encontrado' });
      }
      res.json(results[0]);
    });
  });

  /**
   * @swagger
   * /agendamientos:
   *   post:
   *     summary: Crear un nuevo agendamiento de servicio técnico
   *     tags: [Agendamientos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre_cliente
   *               - telefono
   *               - direccion
   *               - id_tipo_servicio
   *               - fecha_solicitada
   *             properties:
   *               nombre_cliente:
   *                 type: string
   *                 example: Juan Pérez
   *               telefono:
   *                 type: string
   *                 example: "3001234567"
   *               direccion:
   *                 type: string
   *                 example: Calle 10 # 5-23, Girardot
   *               id_tipo_servicio:
   *                 type: integer
   *                 example: 1
   *               fecha_solicitada:
   *                 type: string
   *                 format: date
   *                 example: "2026-05-20"
   *               hora_solicitada:
   *                 type: string
   *                 example: "09:00"
   *               observaciones:
   *                 type: string
   *                 example: Instalación en apartamento piso 3
   *               id_cliente:
   *                 type: integer
   *                 example: null
   *     responses:
   *       201:
   *         description: Agendamiento registrado correctamente
   *       400:
   *         description: Campos obligatorios faltantes
   *       500:
   *         description: Error del servidor
   */
  router.post('/', (req, res) => {
    const { nombre_cliente, telefono, direccion, id_tipo_servicio, fecha_solicitada, hora_solicitada, observaciones, id_cliente } = req.body;
    if (!nombre_cliente || !telefono || !direccion || !id_tipo_servicio || !fecha_solicitada) {
      return res.status(400).json({ error: 'Nombre, teléfono, dirección, tipo de servicio y fecha son obligatorios' });
    }
    db.query(
      `INSERT INTO AGENDAMIENTO (nombre_cliente, telefono, direccion, id_tipo_servicio, fecha_solicitada, hora_solicitada, observaciones, id_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre_cliente, telefono, direccion, id_tipo_servicio, fecha_solicitada, hora_solicitada || null, observaciones || null, id_cliente || null],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al crear agendamiento', detalle: err.message });
        }
        res.status(201).json({ mensaje: 'Agendamiento registrado correctamente', id: results.insertId });
      }
    );
  });

  /**
   * @swagger
   * /agendamientos/{id}/estado:
   *   put:
   *     summary: Actualizar estado de un agendamiento (solo admin)
   *     tags: [Agendamientos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del agendamiento
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
   *                 enum: [nueva, confirmada, realizada, cancelada]
   *                 example: confirmada
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
    const estadosValidos = ['nueva', 'confirmada', 'realizada', 'cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    db.query('UPDATE AGENDAMIENTO SET estado = ? WHERE id_agenda = ?', [estado, id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar estado', detalle: err.message });
      }
      res.json({ mensaje: 'Estado actualizado correctamente' });
    });
  });

  return router;
};