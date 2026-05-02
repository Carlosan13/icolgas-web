// Importamos Express y creamos el router
const express = require('express');
const router = express.Router();

// Esta función recibe la conexión a la base de datos
module.exports = (db) => {

  // GET /agendamientos — obtener todos los agendamientos (solo admin)
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

  // GET /agendamientos/:id — obtener un agendamiento por ID
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

  // POST /agendamientos — crear un nuevo agendamiento
  // Esta es la ruta que usa el formulario del sitio web
  router.post('/', (req, res) => {
    const {
      nombre_cliente,
      telefono,
      direccion,
      id_tipo_servicio,
      fecha_solicitada,
      hora_solicitada,
      observaciones,
      id_cliente
    } = req.body;

    // Validamos que los campos obligatorios estén presentes
    if (!nombre_cliente || !telefono || !direccion || !id_tipo_servicio || !fecha_solicitada) {
      return res.status(400).json({
        error: 'Nombre, teléfono, dirección, tipo de servicio y fecha son obligatorios'
      });
    }

    db.query(
      `INSERT INTO AGENDAMIENTO 
        (nombre_cliente, telefono, direccion, id_tipo_servicio, fecha_solicitada, hora_solicitada, observaciones, id_cliente) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_cliente,
        telefono,
        direccion,
        id_tipo_servicio,
        fecha_solicitada,
        hora_solicitada || null,
        observaciones || null,
        id_cliente || null
      ],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al crear agendamiento', detalle: err.message });
        }
        res.status(201).json({
          mensaje: 'Agendamiento registrado correctamente',
          id: results.insertId
        });
      }
    );
  });

  // PUT /agendamientos/:id/estado — actualizar estado del agendamiento (solo admin)
  router.put('/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ['nueva', 'confirmada', 'realizada', 'cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    db.query(
      'UPDATE AGENDAMIENTO SET estado = ? WHERE id_agenda = ?',
      [estado, id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar estado', detalle: err.message });
        }
        res.json({ mensaje: 'Estado actualizado correctamente' });
      }
    );
  });

  return router;
};