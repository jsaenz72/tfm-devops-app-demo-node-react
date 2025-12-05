import React, { useEffect, useState } from 'react';
export default function Productos(){
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ codigo:'', nombre:'', precioUnitario:'', infoAdicional:'', tarifaIVA:'' });

  useEffect(()=>{ fetch('/api/productos').then(r=>r.json()).then(setProductos).catch(()=>setProductos([])); },[]);

  async function save(){
    const res = await fetch('/api/productos',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)});
    if(res.ok){ setForm({ codigo:'', nombre:'', precioUnitario:'', infoAdicional:'', tarifaIVA:'' }); setProductos(await (await fetch('/api/productos')).json()); }
    else { alert('Error al guardar'); }
  }

  return (
    <div>
      <h2>Productos</h2>
      <div style={{ marginBottom: 10 }}>
        <input placeholder="Codigo" value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value})} />{' '}
        <input placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />{' '}
        <input placeholder="Precio Unitario" value={form.precioUnitario} onChange={e=>setForm({...form,precioUnitario:e.target.value})} />{' '}
        <input placeholder="Tarifa IVA" value={form.tarifaIVA} onChange={e=>setForm({...form,tarifaIVA:e.target.value})} />{' '}
        <button onClick={save}>Aceptar</button>{' '}
        <button onClick={()=>setForm({ codigo:'', nombre:'', precioUnitario:'', infoAdicional:'', tarifaIVA:'' })}>Cancelar</button>
      </div>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Codigo</th><th>Nombre</th><th>Precio</th><th>IVA</th></tr></thead>
        <tbody>
          {productos.map(p=> (
            <tr key={p.id}><td>{p.id}</td><td>{p.codigo}</td><td>{p.nombre}</td><td>{p.precioUnitario}</td><td>{p.tarifaIVA}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
