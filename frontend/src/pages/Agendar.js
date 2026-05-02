import React, { useEffect, useState } from 'react';
import { getTiposServicio, crearAgendamiento } from '../services/api';

function Agendar() {
  const [tiposServicio, setTiposServicio] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nombre_cliente: '',
    telefono: '',
    direccion: '',
    id_tipo_servicio: '',
    fecha_solicitada: '',
    hora_solicitada: '',
    observaciones: ''
  });

  useEffect(() => {
    getTiposServicio().then(res => setTiposServicio(res.data));
  }, []);

  // Esta función actualiza el formulario cuando el usuario escribe
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Esta función se ejecuta cuando el usuario envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await crearAgendamiento(form);
      setExito(true);
      setForm({
        nombre_cliente: '',
        telefono: '',
        direccion: '',
        id_tipo_servicio: '',
        fecha_solicitada: '',
        hora_solicitada: '',
        observaciones: ''
      });
    } catch (err) {
      setError('Hubo un error al enviar la solicitud. Por favor intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wide">ICOLGAS</span>
          <span className="text-blue-300 text-sm">Conectamos Futuro...</span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="/" className="hover:text-orange-400 transition">Inicio</a>
          <a href="/servicios" className="hover:text-orange-400 transition">Servicios</a>
          <a href="/tienda" className="hover:text-orange-400 transition">Tienda</a>
          <a href="/agendar" className="text-orange-400 font-semibold">Agendar</a>
          <a href="/contacto" className="hover:text-orange-400 transition">Contacto</a>
        </div>
      </nav>

      {/* ENCABEZADO */}
      <div className="bg-blue-800 text-white py-10 px-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Agenda tu servicio técnico</h1>
        <p className="text-blue-200 text-sm">
          Llena el formulario y nos comunicaremos contigo para confirmar la visita
        </p>
      </div>

      {/* FORMULARIO */}
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Mensaje de éxito */}
        {exito && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
            ✅ Tu solicitud fue enviada correctamente. Nos comunicaremos contigo pronto por WhatsApp.
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              name="nombre_cliente"
              value={form.nombre_cliente}
              onChange={handleChange}
              required
              placeholder="Ej: Juan Carlos Pérez"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Teléfono / WhatsApp *
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              placeholder="Ej: 311 000 0000"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dirección donde se realizará el servicio *
            </label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              placeholder="Ej: Calle 10 # 5-32, Barrio Centro, Girardot"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de servicio *
            </label>
            <select
              name="id_tipo_servicio"
              value={form.id_tipo_servicio}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-900"
            >
              <option value="">Selecciona un servicio</option>
              {tiposServicio.map(tipo => (
                <option key={tipo.id_tipo} value={tipo.id_tipo}>
                  {tipo.nombre} — Desde ${Number(tipo.precio_base).toLocaleString('es-CO')}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha preferida *
              </label>
              <input
                type="date"
                name="fecha_solicitada"
                value={form.fecha_solicitada}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora preferida
              </label>
              <input
                type="time"
                name="hora_solicitada"
                value={form.hora_solicitada}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observaciones (opcional)
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              placeholder="Ej: La red tiene 5 años instalada, la casa tiene dos pisos..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50">
            {enviando ? 'Enviando...' : 'Enviar solicitud de agendamiento'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Recibirás confirmación por WhatsApp al número ingresado
          </p>

        </form>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm">
        © 2026 Icolgas — Ing. de Redes Internas para Gas Natural | Girardot, Cundinamarca
      </footer>

    </div>
  );
}

export default Agendar;