import React, { useEffect, useState } from 'react';
export default function Factura(){
  const [empresa, setEmpresa] = useState(null);
  const [productos, setProductos] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [cliente, setCliente] = useState({ identificacion:'', tipoIdentificacion:'', nombre:'', direccion:'', telefono:'', email:'' });
  const [meta, setMeta] = useState({ numeroFactura:'', fecha: new Date().toISOString().slice(0,10) });

  useEffect(()=>{ fetch('/api/empresa').then(r=>r.json()).then(setEmpresa).catch(()=>{}); fetch('/api/productos').then(r=>r.json()).then(setProductos).catch(()=>{}); },[]);

  function addLinea(){ setLineas([...lineas, { codigo:'', cantidad:1, descripcion:'', precioUnitario:0, iva:0, descuento:0 }]); }
  function updateLinea(i, key, val){ const c = [...lineas]; c[i][key]=key==='cantidad'||key==='precioUnitario'||key==='iva'||key==='descuento'?Number(val):val; setLineas(c); }
  function removeLinea(i){ const c=[...lineas]; c.splice(i,1); setLineas(c); }

  function calcular(){
    let subtotalSinIva=0;
    let subtotalConIva=0;
    let totalDescuento=0;
    lineas.forEach(l=>{
      const lineTotal = (l.precioUnitario * l.cantidad) - (l.descuento||0);
      const iva = (l.iva||0);
      subtotalSinIva += lineTotal;
      subtotalConIva += lineTotal + (lineTotal * iva/100);
      totalDescuento += (l.descuento||0);
    });
    const propina = 0;
    const valorPagar = subtotalConIva + propina;
    return { subtotalSinIva, subtotalConIva, totalDescuento, propina, valorPagar };
  }

  async function save(){
    const resumen = calcular();
    const payload = { cliente, meta, lineas, resumen, formaPago: 'Efectivo' };
    const res = await fetch('/api/facturas',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if(res.ok){ alert('Factura guardada'); setLineas([]); }
    else alert('Error');
  }

  const totals = calcular();

  return (
    <div>
      <h2>Nueva Factura</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex:1 }}>
          <h3>Datos del Cliente</h3>
          <input placeholder="Identificación Cliente" value={cliente.identificacion} onChange={e=>setCliente({...cliente,identificacion:e.target.value})} /> <br/>
          <input placeholder="Tipo Identificación" value={cliente.tipoIdentificacion} onChange={e=>setCliente({...cliente,tipoIdentificacion:e.target.value})} /> <br/>
          <input placeholder="Nombre Cliente" value={cliente.nombre} onChange={e=>setCliente({...cliente,nombre:e.target.value})} /> <br/>
          <input placeholder="Dirección" value={cliente.direccion} onChange={e=>setCliente({...cliente,direccion:e.target.value})} /> <br/>
          <input placeholder="Teléfono" value={cliente.telefono} onChange={e=>setCliente({...cliente,telefono:e.target.value})} /> <br/>
          <input placeholder="Correo" value={cliente.email} onChange={e=>setCliente({...cliente,email:e.target.value})} /> <br/>

          <h3>Metadatos</h3>
          <input placeholder="RUC Empresa" value={empresa?empresa.ruc:''} readOnly /> <br/>
          <input type="date" value={meta.fecha} onChange={e=>setMeta({...meta,fecha:e.target.value})} /> <br/>
          <input placeholder="Número de factura" value={meta.numeroFactura} onChange={e=>setMeta({...meta,numeroFactura:e.target.value})} /> <br/>

        </div>
        <div style={{ flex:2 }}>
          <h3>Productos</h3>
          <button onClick={addLinea}>Agregar producto</button>
          <table border="1" cellPadding="6" style={{ width:'100%', marginTop:10 }}>
            <thead><tr><th>#</th><th>Código</th><th>Cantidad</th><th>Descripción</th><th>Precio</th><th>IVA</th><th>Descuento</th><th>Acciones</th></tr></thead>
            <tbody>
              {lineas.map((l,i)=>(
                <tr key={i}>
                  <td>{i+1}</td>
                  <td><input value={l.codigo} onChange={e=>updateLinea(i,'codigo',e.target.value)} /></td>
                  <td><input type="number" value={l.cantidad} onChange={e=>updateLinea(i,'cantidad',e.target.value)} /></td>
                  <td><input value={l.descripcion} onChange={e=>updateLinea(i,'descripcion',e.target.value)} /></td>
                  <td><input type="number" value={l.precioUnitario} onChange={e=>updateLinea(i,'precioUnitario',e.target.value)} /></td>
                  <td><input type="number" value={l.iva} onChange={e=>updateLinea(i,'iva',e.target.value)} /></td>
                  <td><input type="number" value={l.descuento} onChange={e=>updateLinea(i,'descuento',e.target.value)} /></td>
                  <td><button onClick={()=>removeLinea(i)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Resumen</h3>
          <div>Subtotal sin impuestos: {totals.subtotalSinIva.toFixed(2)}</div>
          <div>Subtotal con impuestos: {totals.subtotalConIva.toFixed(2)}</div>
          <div>Total descuento: {totals.totalDescuento.toFixed(2)}</div>
          <div>Propina: {totals.propina.toFixed(2)}</div>
          <div><strong>Valor a pagar: {totals.valorPagar.toFixed(2)}</strong></div>

          <div style={{ marginTop:10 }}>
            <select>
              <option>Efectivo</option>
              <option>Tarjeta</option>
              <option>Transferencia</option>
            </select>
            <button onClick={save}>Aceptar</button> <button onClick={()=>{ setLineas([]); setCliente({}); }}>Cancelar</button>
          </div>

        </div>
      </div>
    </div>
  )
}
