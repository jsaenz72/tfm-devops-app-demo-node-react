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
  Alert,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = __API_URL__;

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ codigo: '', nombre: '', precioUnitario: '', pagaIVA: false });
  const [editIndex, setEditIndex] = useState(null);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const API_URL = process.env.API_URL;

  useEffect(() => {
    fetch(`/api/productos`)
      .then(r => r.json())
      .then(setProductos)
      .catch(err => console.error('Error en fetch:', err));
  }, []);

  async function save() {
    const res = await fetch(`/api/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newProduct = await res.json();
      setProductos([...productos, newProduct]);
      setForm({ codigo: '', nombre: '', precioUnitario: '', pagaIVA: false });
      setFeedback({ open: true, message: 'Producto guardado ✅', severity: 'success' });
    } else {
      setFeedback({ open: true, message: 'Error al guardar ❌', severity: 'error' });
    }
  }

  async function update(id) {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updatedProduct = await res.json();
      setProductos(productos.map(p => p.id === id ? updatedProduct : p));
      setFeedback({ open: true, message: 'Producto actualizado ✏️', severity: 'info' });
    } else {
      setFeedback({ open: true, message: 'Error al actualizar ❌', severity: 'error' });
    }
  }

  function addOrUpdate() {
    if (!form.codigo || !form.nombre) {
      setFeedback({ open: true, message: 'Completa los campos requeridos ⚠️', severity: 'warning' });
      return;
    }

    if (editIndex === null) {
      save();
    } else {
      update(productos[editIndex].id); // 👈 ahora sí llama al backend
      setEditIndex(null);      
    }
    setForm({ codigo: '', nombre: '', precioUnitario: '', pagaIVA: false });
  }

  function edit(i) {
    setForm(productos[i]);
    setEditIndex(i);
  }

  async function remove(producto) {
    const res = await fetch(`/api/productos/${producto.id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setProductos(productos.filter(p => p.id !== producto.id));
      setFeedback({ open: true, message: 'Producto eliminado 🗑️', severity: 'info' });
    } else {
      setFeedback({ open: true, message: 'Error al eliminar ❌', severity: 'error' });
    }
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>

      {/* Formulario */}
      <Typography variant="h6" gutterBottom>
        {editIndex === null ? 'Nuevo Producto' : 'Editar Producto' }
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
          <FormControlLabel
            control={
              <Checkbox
                checked={form.pagaIVA}
                onChange={e => setForm({ ...form, pagaIVA: e.target.checked })}
              />
            }
            label="Paga IVA"
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
              setForm({ codigo: '', nombre: '', precioUnitario: '', pagaIVA: false });
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
            <TableCell>Paga IVA</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map((p, i) => (
            <TableRow key={i}>
              <TableCell>{p.codigo}</TableCell>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>${p.precioUnitario}</TableCell>
              <TableCell>{p.pagaIVA ? 'Sí' : 'No'}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => edit(i)}>
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    setProductoAEliminar(p);
                    setConfirmOpen(true);
                  }}
                >
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

      {/* Dialog de confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar el producto
          <strong> {productoAEliminar?.codigo} - {productoAEliminar?.nombre}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (productoAEliminar) remove(productoAEliminar);
              setConfirmOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
