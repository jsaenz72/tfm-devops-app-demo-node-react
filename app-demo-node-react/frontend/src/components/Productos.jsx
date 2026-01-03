import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ codigo: '', nombre: '', precioUnitario: '', iva: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

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
      setFeedback({ open: true, message: 'Producto guardado ✅', severity: 'success' });
    } else {
      setFeedback({ open: true, message: 'Error al guardar ❌', severity: 'error' });
    }
  }

  function addOrUpdate() {
    if (!form.codigo || !form.nombre) {
      setFeedback({ open: true, message: 'Completa los campos requeridos ⚠️', severity: 'warning' });
      return;
    }

    if (editIndex !== null) {
      const updated = [...productos];
      updated[editIndex] = form;
      setProductos(updated);
      setEditIndex(null);
      setFeedback({ open: true, message: 'Producto actualizado ✏️', severity: 'info' });
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
    setFeedback({ open: true, message: 'Producto eliminado 🗑️', severity: 'info' });
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>

      {/* Formulario */}
      <Typography variant="h6" gutterBottom>
        {editIndex !== null ? 'Editar Producto' : 'Nuevo Producto'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Código *"
            fullWidth
            value={form.codigo}
            onChange={e => setForm({ ...form, codigo: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre *"
            fullWidth
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Precio unitario"
            type="number"
            fullWidth
            value={form.precioUnitario}
            onChange={e => setForm({ ...form, precioUnitario: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="IVA (%)"
            type="number"
            fullWidth
            value={form.iva}
            onChange={e => setForm({ ...form, iva: e.target.value })}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="contained" color="success" onClick={addOrUpdate}>
            {editIndex !== null ? 'Actualizar' : 'Agregar'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setForm({ codigo: '', nombre: '', precioUnitario: '', iva: '' });
              setEditIndex(null);
            }}
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>

      {/* Tabla */}
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>IVA</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map((p, i) => (
            <TableRow key={i}>
              <TableCell>{p.codigo}</TableCell>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>${p.precioUnitario}</TableCell>
              <TableCell>{p.iva}%</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => edit(i)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => remove(i)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {productos.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No hay productos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Feedback */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert severity={feedback.severity} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
