import React, { useEffect, useState } from 'react';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ codigo: '', nombre: '', precioUnitario: '', iva: '' });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetch('/api/productos')
      .then(r => r.json())
      .then(setProductos)
      .catch(() => {});
  }, []);

  async function save() {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newProduct = await res.json();
      setProductos([...productos, newProduct]);
      setForm({ codigo: '', nombre: '', precioUnitario: '', iva: '' });
      alert('Producto guardado');
    } else {
      alert('Error');
    }
  }

  function addOrUpdate() {
    if (!form.codigo || !form.nombre) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (editIndex !== null) {
      const updated = [...productos];
      updated[editIndex] = form;
      setProductos(updated);
      setEditIndex(null);
    } else {
      save();
    }
    setForm({ codigo: '', nombre: '', precioUnitario: '', iva: '' });
  }

  function edit(i) {
    setForm(productos[i]);
    setEditIndex(i);
  }

  function remove(i) {
    const updated = [...productos];
    updated.splice(i, 1);
    setProductos(updated);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Productos</h2>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editIndex !== null ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="Código del producto *"
              value={form.codigo}
              onChange={e => setForm({ ...form, codigo: e.target.value })}
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="Nombre del producto *"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              type="number"
              step="0.01"
              placeholder="Precio unitario"
              value={form.precioUnitario}
              onChange={e => setForm({ ...form, precioUnitario: e.target.value })}
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              type="number"
              step="0.01"
              placeholder="IVA (%)"
              value={form.iva}
              onChange={e => setForm({ ...form, iva: e.target.value })}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addOrUpdate}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md hover:shadow-lg"
            >
              {editIndex !== null ? 'Actualizar' : 'Agregar'}
            </button>
            <button
              onClick={() => {
                setForm({ codigo: '', nombre: '', precioUnitario: '', iva: '' });
                setEditIndex(null);
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Código</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IVA</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800">{p.codigo}</td>
                  <td className="px-6 py-4 text-gray-800">{p.nombre}</td>
                  <td className="px-6 py-4 text-gray-800">${p.precioUnitario}</td>
                  <td className="px-6 py-4 text-gray-800">{p.iva}%</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => edit(i)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition mr-2 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => remove(i)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hay productos registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}