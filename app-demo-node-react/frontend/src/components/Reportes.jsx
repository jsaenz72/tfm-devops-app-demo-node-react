import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

export default function Reportes() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const res = await fetch('/api/facturas');
        const data = await res.json();
        setFacturas(data);
      } catch (error) {
        console.error('Error al cargar facturas:', error);
      }
    };
    fetchFacturas();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Reporte de Facturas
      </Typography>
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
                <TableCell>{f.cabecera?.cliente || 'N/A'}</TableCell>
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
