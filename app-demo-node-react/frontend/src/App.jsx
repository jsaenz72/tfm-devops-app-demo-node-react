import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Empresa from './components/Empresa';
import Factura from './components/Factura';
import Productos from './components/Productos';

export default function App({ toggleColorMode, mode }) {
  return (
    <Layout toggleColorMode={toggleColorMode} mode={mode}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/factura" element={<Factura />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </Layout>
  );
}
