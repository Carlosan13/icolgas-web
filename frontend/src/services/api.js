// Este archivo centraliza todas las llamadas al backend
// En lugar de escribir la URL del backend en cada componente,
// la escribimos una sola vez aquí

import axios from 'axios';

// Tomamos la URL del backend del archivo .env
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000'
});

// Categorías
export const getCategorias = () => API.get('/categorias');

// Productos
export const getProductos = () => API.get('/productos');
export const getProducto = (id) => API.get(`/productos/${id}`);
export const getProductosPorCategoria = (id) => API.get(`/productos/categoria/${id}`);
export const crearProducto = (data) => API.post('/productos', data);
export const actualizarProducto = (id, data) => API.put(`/productos/${id}`, data);

// Tipos de servicio
export const getTiposServicio = () => API.get('/tiposervicios');

// Agendamientos
export const getAgendamientos = () => API.get('/agendamientos');
export const crearAgendamiento = (data) => API.post('/agendamientos', data);
export const actualizarEstadoAgendamiento = (id, estado) => API.put(`/agendamientos/${id}/estado`, { estado });

// Pedidos
export const getPedidos = () => API.get('/pedidos');
export const getPedido = (id) => API.get(`/pedidos/${id}`);
export const crearPedido = (data) => API.post('/pedidos', data);
export const actualizarEstadoPedido = (id, estado) => API.put(`/pedidos/${id}/estado`, { estado });