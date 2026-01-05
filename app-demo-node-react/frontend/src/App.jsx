import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import Factura from './components/Factura';
import Productos from './components/Productos';
import Empresa from './components/Empresa';
import Reportes from './components/Reportes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />  
        <Route path="factura" element={<Factura />} />
        <Route path="productos" element={<Productos />} />
        <Route path="empresa" element={<Empresa />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>
    </Routes>
  );
}

export default App;
