import React, { useEffect, useState } from 'react';
import { getProductos, getCategorias } from '../services/api';

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    getProductos().then(res => setProductos(res.data));
    getCategorias().then(res => setCategorias(res.data));
  }, []);

  // Filtra productos por categoría seleccionada
  const productosFiltrados = categoriaSeleccionada === 'todas'
    ? productos
    : productos.filter(p => p.id_categoria === parseInt(categoriaSeleccionada));

  // Agrega un producto al carrito
  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id_producto === producto.id_producto);
    if (existe) {
      setCarrito(carrito.map(item =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Elimina un producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id_producto !== id));
  };

  // Calcula el total del carrito
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wide">ICOLGAS</span>
          <span className="text-blue-300 text-sm">Conectamos Futuro...</span>
        </div>
        <div className="flex gap-6 text-sm items-center">
          <a href="/" className="hover:text-orange-400 transition">Inicio</a>
          <a href="/servicios" className="hover:text-orange-400 transition">Servicios</a>
          <a href="/tienda" className="text-orange-400 font-semibold">Tienda</a>
          <a href="/agendar" className="hover:text-orange-400 transition">Agendar</a>
          <button
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold transition">
            🛒 Carrito ({carrito.length})
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        <h1 className="text-2xl font-bold text-blue-900 mb-6">Materiales para redes de gas</h1>

        {/* FILTROS */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setCategoriaSeleccionada('todas')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              categoriaSeleccionada === 'todas'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-900'
            }`}>
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id_categoria}
              onClick={() => setCategoriaSeleccionada(String(cat.id_categoria))}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                categoriaSeleccionada === String(cat.id_categoria)
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-900'
              }`}>
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* PRODUCTOS */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No hay productos en esta categoría todavía.</p>
            <p className="text-sm mt-2">Próximamente agregaremos el catálogo completo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productosFiltrados.map(producto => (
              <div key={producto.id_producto}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="bg-gray-50 h-40 flex items-center justify-center">
                  {producto.imagen_url
                    ? <img src={producto.imagen_url} alt={producto.nombre} className="h-full object-contain p-4" />
                    : <span className="text-5xl">🔩</span>
                  }
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{producto.categoria_nombre}</p>
                  <h3 className="font-semibold text-gray-800 mb-1">{producto.nombre}</h3>
                  <p className="text-xs text-gray-500 mb-3">Ref: {producto.referencia}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-bold">
                      ${Number(producto.precio).toLocaleString('es-CO')}
                    </span>
                    <button
                      onClick={() => agregarAlCarrito(producto)}
                      className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-sm transition">
                      + Carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CARRITO LATERAL */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900">Tu carrito</h2>
              <button onClick={() => setMostrarCarrito(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            {carrito.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">Tu carrito está vacío</p>
            ) : (
              <>
                {carrito.map(item => (
                  <div key={item.id_producto}
                    className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{item.nombre}</p>
                      <p className="text-xs text-gray-400">
                        {item.cantidad} × ${Number(item.precio).toLocaleString('es-CO')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-orange-500">
                        ${Number(item.precio * item.cantidad).toLocaleString('es-CO')}
                      </span>
                      <button onClick={() => eliminarDelCarrito(item.id_producto)}
                        className="text-red-400 hover:text-red-600 text-sm">✕</button>
                    </div>
                  </div>
                ))}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-800">Total:</span>
                    <span className="font-bold text-orange-500 text-lg">
                      ${total.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Pago por Nequi, Daviplata o transferencia bancaria
                  </p>
                  <a href="/checkout"
                    className="block w-full bg-blue-900 hover:bg-blue-800 text-white text-center py-3 rounded-lg font-semibold transition">
                    Hacer pedido
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm mt-10">
        © 2026 Icolgas — Ing. de Redes Internas para Gas Natural | Girardot, Cundinamarca
      </footer>

    </div>
  );
}

export default Tienda;