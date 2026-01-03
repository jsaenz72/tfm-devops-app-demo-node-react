import React, { useEffect, useState } from 'react';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';

export default function Empresa() {
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
      .then(j => setForm(j))
      .catch(() => {});
  }, []);

  async function save() {
    const res = await fetch('/api/empresa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) alert('Empresa guardada');
    else alert('Error');
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Datos de la Empresa</Typography>
      <Grid container spacing={2}>
        {Object.keys(form).map(key => (
          <Grid item xs={12} md={6} key={key}>
            <TextField
              label={key}
              fullWidth
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" sx={{ mt: 3 }} onClick={save}>Guardar Cambios</Button>
    </Paper>
  );
}
