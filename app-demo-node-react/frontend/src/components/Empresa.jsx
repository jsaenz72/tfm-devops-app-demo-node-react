import React, { useEffect, useState } from 'react';
export default function Empresa(){
  const [empresa, setEmpresa] = useState(null);
  const [form, setForm] = useState({ nombreEmpresa:'', nombreComercial:'', ruc:'', telefono:'', direccion:'', puntoEmision:'', numeroFactura:'' });

  useEffect(()=>{ fetch('/api/empresa').then(r=>r.json()).then(j=>{ setEmpresa(j); if(j) setForm(j); }).catch(()=>{}); },[]);

  async function save(){
    const res = await fetch('/api/empresa',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)});
    if(res.ok){ setEmpresa(await res.json()); alert('Empresa guardada'); }
    else alert('Error');
  }

  return (
    <div>
      <h2>Empresa</h2>
      <div style={{ marginBottom: 10 }}>
        <div><input placeholder="Nombre empresa" value={form.nombreEmpresa} onChange={e=>setForm({...form,nombreEmpresa:e.target.value})} /></div>
        <div><input placeholder="Nombre comercial" value={form.nombreComercial} onChange={e=>setForm({...form,nombreComercial:e.target.value})} /></div>
        <div><input placeholder="RUC" value={form.ruc} onChange={e=>setForm({...form,ruc:e.target.value})} /></div>
        <div><input placeholder="Telefono" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} /></div>
        <div><input placeholder="Direccion" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} /></div>
        <div><input placeholder="Punto de emision" value={form.puntoEmision} onChange={e=>setForm({...form,puntoEmision:e.target.value})} /></div>
        <div><input placeholder="Numero de factura" value={form.numeroFactura} onChange={e=>setForm({...form,numeroFactura:e.target.value})} /></div>
        <div style={{ marginTop: 8 }}>
          <button onClick={save}>Aceptar</button>{' '}
          <button onClick={()=>{ setForm({ nombreEmpresa:'', nombreComercial:'', ruc:'', telefono:'', direccion:'', puntoEmision:'', numeroFactura:'' }); }}>Cancelar</button>
        </div>
      </div>
      {empresa && <div style={{ marginTop: 10 }}>
        <h3>Empresa guardada</h3>
        <pre>{JSON.stringify(empresa, null, 2)}</pre>
      </div>}
    </div>
  )
}
