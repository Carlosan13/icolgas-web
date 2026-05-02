import React, { useEffect, useState } from 'react';
import { getTiposServicio, getCategorias } from '../services/api';

function Inicio() {
  const [tiposServicio, setTiposServicio] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // useEffect se ejecuta cuando el componente carga
  // Es como un "al abrir la página, haz esto"
  useEffect(() => {
    getTiposServicio().then(res => setTiposServicio(res.data));
    getCategorias().then(res => setCategorias(res.data));
  }, []);

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
          <a href="/agendar" className="hover:text-orange-400 transition">Agendar</a>
          <a href="/contacto" className="hover:text-orange-400 transition">Contacto</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-blue-800 text-white py-16 px-6 text-center">
        <p className="text-blue-300 text-sm mb-2">Más de 21 años de experiencia en Girardot</p>
        <h1 className="text-3xl font-bold mb-4">
          Ingeniería de redes internas para gas natural y propano
        </h1>
        <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
          Servicios técnicos certificados — Materiales PE AL PE — Revisiones quinquenales obligatorias
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/agendar"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition">
            Agendar servicio
          </a>
          <a href="/tienda"
            className="border border-white text-white hover:bg-white hover:text-blue-900 px-6 py-3 rounded-lg font-semibold transition">
            Ver materiales
          </a>
        </div>
      </div>

      {/* SERVICIOS */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Nuestros servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiposServicio.slice(0, 3).map(servicio => (
            <div key={servicio.id_tipo}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-900 font-bold text-lg">🔧</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{servicio.nombre}</h3>
              <p className="text-gray-500 text-sm mb-3">{servicio.descripcion}</p>
              <p className="text-orange-500 font-semibold">
                Desde ${Number(servicio.precio_base).toLocaleString('es-CO')}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="/agendar"
            className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition inline-block">
            Ver todos los servicios
          </a>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Materiales disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categorias.map(cat => (
              <a key={cat.id_categoria} href="/tienda"
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:border-blue-900 hover:bg-blue-50 transition">
                <p className="font-semibold text-gray-700 text-sm">{cat.nombre}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACTO */}
      <div className="bg-blue-900 text-white py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">¿Necesitas un servicio de gas?</h3>
            <p className="text-blue-300 text-sm">NIT: 51981915-8 | Barrio La Colina, Girardot</p>
          </div>
          <div className="flex gap-4">
            <a href="https://wa.me/573118479208"
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold transition">
              WhatsApp
            </a>
            <a href="/agendar"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition">
              Agendar
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm">
        © 2026 Icolgas — Ing. de Redes Internas para Gas Natural | Girardot, Cundinamarca
      </footer>

    </div>
  );
}

export default Inicio;