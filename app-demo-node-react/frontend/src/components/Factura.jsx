import React, { useState } from 'react';
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
  Select,
  MenuItem
} from '@mui/material';

export default function Factura() {
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

  function addLinea() {
    setLineas([
      ...lineas,
      { codigo: '', cantidad: 1, descripcion: '', precioUnitario: 0, iva: 0, descuento: 0 }
    ]);
  }

  function calcular() {
    let subtotal = 0;
    lineas.forEach(l => {
      subtotal += l.precioUnitario * l.cantidad - (l.descuento || 0);
    });
    return { subtotal, total: subtotal };
  }

  const totals = calcular();

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Nueva Factura
      </Typography>

      {/* Datos del cliente */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Nombre completo"
            fullWidth
            value={cliente.nombre}
            onChange={e => setCliente({ ...cliente, nombre: e.target.value })}
          />
          <TextField
            label="Identificación"
            fullWidth
            value={cliente.identificacion}
            onChange={e => setCliente({ ...cliente, identificacion: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Correo electrónico"
            fullWidth
            value={cliente.email}
            onChange={e => setCliente({ ...cliente, email: e.target.value })}
            sx={{ mt: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Button variant="contained" onClick={addLinea} sx={{ mb: 2 }}>
            + Agregar Línea
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>IVA</TableCell>
                <TableCell>Desc.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lineas.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>{l.codigo}</TableCell>
                  <TableCell>{l.cantidad}</TableCell>
                  <TableCell>{l.descripcion}</TableCell>
                  <TableCell>{l.precioUnitario}</TableCell>
                  <TableCell>{l.iva}</TableCell>
                  <TableCell>{l.descuento}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      {/* Resumen */}
      <Typography variant="h6">Resumen</Typography>
      <Typography>Subtotal: ${totals.subtotal.toFixed(2)}</Typography>
      <Typography>Total: ${totals.total.toFixed(2)}</Typography>

      {/* Forma de pago */}
      <Select
        value={formaPago}
        onChange={e => setFormaPago(e.target.value)}
        sx={{ mt: 2 }}
      >
        <MenuItem value="Efectivo">Efectivo</MenuItem>
        <MenuItem value="Tarjeta de Crédito">Tarjeta de Crédito</MenuItem>
        <MenuItem value="Tarjeta de Débito">Tarjeta de Débito</MenuItem>
        <MenuItem value="Transferencia">Transferencia</MenuItem>
      </Select>

      <Button variant="contained" color="primary" sx={{ mt: 3 }}>
        Guardar Factura
      </Button>
    </Paper>
  );
}
