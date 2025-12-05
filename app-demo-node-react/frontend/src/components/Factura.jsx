import React, { useEffect, useState } from 'react';

export default function Factura() {
  const [empresa, setEmpresa] = useState(null);
  const [productos, setProductos] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [cliente, setCliente] = useState({
    identificacion: '',
    tipoIdentificacion: '',
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });
  const [meta, setMeta] = useState({
    numeroFactura: '',
    fecha: new Date().toISOString().slice(0, 10)
  });
  const [formaPago, setFormaPago] = useState('Efectivo');

  useEffect(() => {
    fetch('/api/empresa')
      .then(r => r.json())
      .then(setEmpresa)
      .catch(() => {});
    fetch('/api/productos')
      .then(r => r.json())
      .then(setProductos)
      .catch(() => {});
  }, []);

  function addLinea() {
    setLineas([
      ...lineas,
      {
        codigo: '',
        cantidad: 1,
        descripcion: '',
        precioUnitario: 0,
        iva: 0,
        descuento: 0
      }
    ]);
  }

  function updateLinea(i, key, val) {
    const c = [...lineas];
    c[i][key] =
      key === 'cantidad' || key === 'precioUnitario' || key === 'iva' || key === 'descuento'
        ? Number(val)
        : val;
    setLineas(c);
  }

  function removeLinea(i) {
    const c = [...lineas];
    c.splice(i, 1);
    setLineas(c);
  }

  function calcular() {
    let subtotalSinIva = 0;
    let subtotalConIva = 0;
    let totalDescuento = 0;

    lineas.forEach(l => {
      const lineTotal = l.precioUnitario * l.cantidad - (l.descuento || 0);
      const iva = l.iva || 0;
      subtotalSinIva += lineTotal;
      subtotalConIva += lineTotal + (lineTotal * iva) / 100;
      totalDescuento += l.descuento || 0;
    });

    const propina = 0;
    const valorPagar = subtotalConIva + propina;
    return { subtotalSinIva, subtotalConIva, totalDescuento, propina, valorPagar };
  }

  async function save() {
    const resumen = calcular();
    const payload = { cliente, meta, lineas, resumen, formaPago };
    const res = await fetch('/api/facturas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert('Factura guardada');
      setLineas([]);
      setCliente({
        identificacion: '',
        tipoIdentificacion: '',
        nombre: '',
        direccion: '',
        telefono: '',
        email: ''
      });
    } else {
      alert('Error');
    }
  }

  const totals = calcular();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Nueva Factura</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Cliente Section */}
          <div className="lg:col-span-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos del Cliente</h3>
            <div className="space-y-3">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                placeholder="Identificación"
                value={cliente.identificacion}
                onChange={e => setCliente({ ...cliente, identificacion: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                placeholder="Tipo ID (RUC/Cédula)"
                value={cliente.tipoIdentificacion}
                onChange={e => setCliente({ ...cliente, tipoIdentificacion: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                placeholder="Nombre completo"
                value={cliente.nombre}
                onChange={e => setCliente({ ...cliente, nombre: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                placeholder="Dirección"
                value={cliente.direccion}
                onChange={e => setCliente({ ...cliente, direccion: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                placeholder="Teléfono"
                value={cliente.telefono}
                onChange={e => setCliente({ ...cliente, telefono: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                placeholder="Correo electrónico"
                type="email"
                value={cliente.email}
                onChange={e => setCliente({ ...cliente, email: e.target.value })}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-300">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Información de Factura</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">RUC Empresa</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                    value={empresa ? empresa.ruc : ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Fecha</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    type="date"
                    value={meta.fecha}
                    onChange={e => setMeta({ ...meta, fecha: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Número de factura</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    placeholder="Número"
                    value={meta.numeroFactura}
                    onChange={e => setMeta({ ...meta, numeroFactura: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Productos y Servicios</h3>
              <button
                onClick={addLinea}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-md"
              >
                + Agregar Línea
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-200">
                    <th className="px-3 py-3 text-left font-semibold text-gray-700">#</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Código</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Cant.</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Descripción</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Precio</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700">IVA%</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Desc.</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.map((l, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">{i + 1}</td>
                      <td className="px-3 py-2">
                        <input
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                          value={l.codigo}
                          onChange={e => updateLinea(i, 'codigo', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                          type="number"
                          value={l.cantidad}
                          onChange={e => updateLinea(i, 'cantidad', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                          value={l.descripcion}
                          onChange={e => updateLinea(i, 'descripcion', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                          type="number"
                          step="0.01"
                          value={l.precioUnitario}
                          onChange={e => updateLinea(i, 'precioUnitario', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                          type="number"
                          step="0.01"
                          value={l.iva}
                          onChange={e => updateLinea(i, 'iva', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                          type="number"
                          step="0.01"
                          value={l.descuento}
                          onChange={e => updateLinea(i, 'descuento', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeLinea(i)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lineas.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No hay productos agregados. Haz clic en "Agregar Línea" para comenzar.
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Factura</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal sin impuestos:</span>
                  <span className="font-medium text-gray-800">
                    ${totals.subtotalSinIva.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total descuento:</span>
                  <span className="font-medium text-red-600">
                    -${totals.totalDescuento.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal con impuestos:</span>
                  <span className="font-medium text-gray-800">
                    ${totals.subtotalConIva.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Propina:</span>
                  <span className="font-medium text-gray-800">${totals.propina.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-blue-200">
                  <span className="text-lg font-bold text-gray-800">Total a pagar:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${totals.valorPagar.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de Pago
                  </label>
                  <select
                    value={formaPago}
                    onChange={e => setFormaPago(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option>Efectivo</option>
                    <option>Tarjeta de Crédito</option>
                    <option>Tarjeta de Débito</option>
                    <option>Transferencia</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={save}
                    className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
                  >
                    Guardar Factura
                  </button>
                  <button
                    onClick={() => {
                      setLineas([]);
                      setCliente({
                        identificacion: '',
                        tipoIdentificacion: '',
                        nombre: '',
                        direccion: '',
                        telefono: '',
                        email: ''
                      });
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}