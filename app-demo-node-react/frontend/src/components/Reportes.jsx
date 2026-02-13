import React, { useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Grid
} from '@mui/material';

const API_URL = __API_URL__;

export default function Reportes() {
  const [facturas, setFacturas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Cargar todas las facturas
  const cargarTodas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/facturas`);
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar todas las facturas:', error);
      setFacturas([]);
    }
  };

  // Buscar facturas por rango de fechas
  const buscarFacturas = async () => {
    try {
      const url = `${API_URL}/api/facturas/rango?inicio=${fechaInicio}&fin=${fechaFin}`;
      console.log("Consultando:", url);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const data = await res.json();
      console.log("Facturas recibidas:", data);

      setFacturas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar facturas por rango:', error);
      setFacturas([]);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Reporte de Facturas
      </Typography>

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Fecha Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Fecha Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={buscarFacturas}
            disabled={!fechaInicio || !fechaFin}
          >
            Buscar por rango
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={cargarTodas}
          >
            Ver todas
          </Button>
        </Grid>
      </Grid>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Número Factura</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Subtotal con IVA</TableCell>
              <TableCell align="right">Subtotal sin IVA</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.id}</TableCell>
                <TableCell>{f.numeroFactura}</TableCell>
                <TableCell>{f.cabecera?.cliente?.nombre || 'N/A'}</TableCell>
                <TableCell>{f.audit?.fechaCreacion}</TableCell>
                <TableCell align="right">{f.totales?.subtotalConIVA}</TableCell>
                <TableCell align="right">{f.totales?.subtotalSinIVA}</TableCell>
                <TableCell align="right">{f.totales?.valorTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
