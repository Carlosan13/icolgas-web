import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Agendar from './pages/Agendar';
import Tienda from './pages/Tienda';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/tienda" element={<Tienda />} />
      </Routes>
    </Router>
  );
}

export default App;