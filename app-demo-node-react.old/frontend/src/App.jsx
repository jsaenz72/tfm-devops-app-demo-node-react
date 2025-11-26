import React, { useEffect, useState } from 'react';

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/items')
      .then(r => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function create() {
    if(!name) return;
    await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description: '' }) });
    setName('');
    const res = await fetch('/api/items');
    setItems(await res.json());
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>App Demo</h1>
      <div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" />
        <button onClick={create}>Crear</button>
      </div>
      <ul>
        {items.map(i => <li key={i.id}>{i.id} - {i.name}</li>)}
      </ul>
    </div>
  );
}
