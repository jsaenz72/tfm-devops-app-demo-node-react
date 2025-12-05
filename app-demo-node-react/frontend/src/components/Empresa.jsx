import React, { useEffect, useState } from 'react';

export default function Empresa() {
  const [empresa, setEmpresa] = useState(null);
  const [form, setForm] = useState({
    nombreEmpresa: '',
    nombreComercial: '',
    ruc: '',
    telefono: '',
    direccion: '',
    puntoEmision: '',
    numeroFactura: ''
  });

  useEffect(() => {
    fetch('/api/empresa')
      .then(r => r.json())
      .then(j => {
        setEmpresa(j);
        if (j) setForm(j);
      })
      .catch(() => {});
  }, []);

  async function save() {
    const res = await fetch('/api/empresa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setEmpresa(await res.json());
      alert('Empresa guardada');
    } else {
      alert('Error');
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Datos de la Empresa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Ingrese el nombre"
              value={form.nombreEmpresa}
              onChange={e => setForm({ ...form, nombreEmpresa: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Comercial
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Ingrese el nombre comercial"
              value={form.nombreComercial}
              onChange={e => setForm({ ...form, nombreComercial: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RUC</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Ingrese el RUC"
              value={form.ruc}
              onChange={e => setForm({ ...form, ruc: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Ingrese el teléfono"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Ingrese la dirección"
              value={form.direccion}
              onChange={e => setForm({ ...form, direccion: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Punto de Emisión
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Ej: 001-001"
              value={form.puntoEmision}
              onChange={e => setForm({ ...form, puntoEmision: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Factura
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Número inicial"
              value={form.numeroFactura}
              onChange={e => setForm({ ...form, numeroFactura: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={save}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-md hover:shadow-lg"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() =>
              setForm({
                nombreEmpresa: '',
                nombreComercial: '',
                ruc: '',
                telefono: '',
                direccion: '',
                puntoEmision: '',
                numeroFactura: ''
              })
            }
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancelar
          </button>
        </div>

        {empresa && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Empresa Guardada</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Nombre:</span>
                <p className="text-gray-800">{empresa.nombreEmpresa}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">RUC:</span>
                <p className="text-gray-800">{empresa.ruc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}