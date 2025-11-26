import React from 'react';
import './style/output.css';
import { Routes, Route, Link } from 'react-router-dom';
import Productos from './components/Productos';
import Empresa from './components/Empresa';
import Factura from './components/Factura';
import Home from './components/Home';

export default function App(){
  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>App Demo - Facturación</h1>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> | {' '}
        <Link to="/factura">Nueva Factura</Link> | {' '}
        <Link to="/productos">Productos</Link> | {' '}
        <Link to="/empresa">Empresa</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/productos" element={<Productos/>} />
        <Route path="/empresa" element={<Empresa/>} />
        <Route path="/factura" element={<Factura/>} />
      </Routes>
    </div>
  )
}
