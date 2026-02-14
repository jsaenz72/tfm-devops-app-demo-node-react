import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';

export default function Factura() {
  const [empresa, setEmpresa] = useState({});
  const [productos, setProductos] = useState([]);
  const [lineas, setLineas] = useState([]);

  const [cabecera, setCabecera] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    cliente: {
      identificacion: '',
      nombre: '',
      direccion: '',
      telefono: '',
      correoElectronico: ''
    }
  });

  const [formaPago, setFormaPago] = useState('Efectivo');
  const [porcentajeIVA, setPorcentajeIVA] = useState(0);

  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const API_URL = __API_URL__;

  /* ===============================
     CARGA INICIAL
     =============================== */

  useEffect(() => {
    fetch(`/api/productos`)
      .then(r => r.json())
      .then(setProductos)
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  useEffect(() => {
    fetch(`/api/empresa`)
      .then(r => r.json())
      .then(data => {
        setEmpresa(data);
        setPorcentajeIVA(Number(data.porcentajeIVA));
      })
      .catch(err =>
        console.error('Error cargando porcentajeIVA de empresa:', err)
      );
  }, []);

  /* ===============================
     LÍNEAS DE FACTURA
     =============================== */

  function addLinea() {
    setLineas([
      ...lineas,
      { productoId: '', cantidad: 1, precioUnitario: 0, pagaIVA: false, descuento: 0 }
    ]);
  }

  function updateLinea(index, field, value) {
    const updated = [...lineas];
    updated[index][field] = value;

    if (field === 'productoId') {
      const prod = productos.find(p => p.id === value);
      if (prod) {
        updated[index].precioUnitario = prod.precioUnitario;
        updated[index].pagaIVA = prod.pagaIVA;
      }
    }

    setLineas(updated);
  }

  /* ===============================
     CÁLCULOS
     =============================== */

  function calcularTotales() {
    let subtotal = 0;
    let iva = 0;
    const ivaRate = porcentajeIVA / 100;

    lineas.forEach(l => {
      const base = l.precioUnitario * l.cantidad - (l.descuento || 0);
      subtotal += base;
      if (l.pagaIVA) {
        iva += base * ivaRate;
      }
    });

    return {
      subtotal,
      iva,
      total: subtotal + iva
    };
  }

  const totals = calcularTotales();

  /* ===============================
     VALIDACIONES
     =============================== */

  function validarCliente() {
    const c = cabecera.cliente;

    if (!c.nombre.trim()) return 'El nombre completo es obligatorio';
    if (!c.identificacion.trim()) return 'La identificación es obligatoria';
    if (!c.direccion.trim()) return 'La dirección es obligatoria';
    if (!c.telefono.trim()) return 'El teléfono es obligatorio';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(c.correoElectronico))
      return 'Correo electrónico inválido';

    return null;
  }

  /* ===============================
     GUARDAR FACTURA
     =============================== */

  async function guardarFactura() {
    const error = validarCliente();
    if (error) {
      setFeedback({ open: true, message: error, severity: 'error' });
      return;
    }

    const factura = {
      cabecera: {
        fecha: cabecera.fecha,
        formaPago,
        cliente: cabecera.cliente
      },
      detalle: lineas.map(l => ({
        codigo: l.productoId,
        cantidad: l.cantidad,
        descripcion: productos.find(p => p.id === l.productoId)?.nombre || '',
        precioUnitario: l.precioUnitario,
        pagaIVA: l.pagaIVA,
        precioTotal: l.precioUnitario * l.cantidad - (l.descuento || 0)
      }))
    };

    try {
      const res = await fetch(`/api/facturas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factura)
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const data = await res.json();

      setFeedback({
        open: true,
        message: `Factura N.º ${data.cabecera.numeroFactura} guardada correctamente`,
        severity: 'success'
      });

      setLineas([]);

    } catch (err) {
      setFeedback({
        open: true,
        message: `Error al guardar factura: ${err.message}`,
        severity: 'error'
      });
    }
  }

  /* ===============================
     RENDER
     =============================== */

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Nueva Factura
      </Typography>

      {/* DATOS DEL CLIENTE */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Nombre completo *"
            fullWidth
            value={cabecera.cliente.nombre}
            onChange={e =>
              setCabecera({
                ...cabecera,
                cliente: { ...cabecera.cliente, nombre: e.target.value }
              })
            }
          />

          <TextField
            label="Identificación *"
            fullWidth
            sx={{ mt: 2 }}
            value={cabecera.cliente.identificacion}
            onChange={e =>
              setCabecera({
                ...cabecera,
                cliente: { ...cabecera.cliente, identificacion: e.target.value }
              })
            }
          />

          <TextField
            label="Correo electrónico *"
            fullWidth
            sx={{ mt: 2 }}
            value={cabecera.cliente.correoElectronico}
            onChange={e =>
              setCabecera({
                ...cabecera,
                cliente: { ...cabecera.cliente, correoElectronico: e.target.value }
              })
            }
          />

          <TextField
            label="Dirección *"
            fullWidth
            sx={{ mt: 2 }}
            value={cabecera.cliente.direccion}
            onChange={e =>
              setCabecera({
                ...cabecera,
                cliente: { ...cabecera.cliente, direccion: e.target.value }
              })
            }
          />

          <TextField
            label="Teléfono *"
            fullWidth
            sx={{ mt: 2 }}
            value={cabecera.cliente.telefono}
            onChange={e =>
              setCabecera({
                ...cabecera,
                cliente: { ...cabecera.cliente, telefono: e.target.value }
              })
            }
          />
        </Grid>

        {/* DETALLE */}
        <Grid item xs={12} md={8}>
          <Button variant="contained" onClick={addLinea} sx={{ mb: 2 }}>
            + Agregar Línea
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>IVA</TableCell>
                <TableCell>Desc.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lineas.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Select
                      value={l.productoId}
                      onChange={e => updateLinea(i, 'productoId', e.target.value)}
                      fullWidth
                    >
                      {productos.map(p => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.codigo} - {p.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      value={l.cantidad}
                      onChange={e => updateLinea(i, 'cantidad', Number(e.target.value))}
                      fullWidth
                    />
                  </TableCell>

                  <TableCell>${l.precioUnitario.toFixed(2)}</TableCell>
                  <TableCell>{l.pagaIVA ? 'Sí' : 'No'}</TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      value={l.descuento}
                      onChange={e => updateLinea(i, 'descuento', Number(e.target.value))}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      {/* RESUMEN */}
      <Typography variant="h6">Resumen</Typography>
      <Typography>Subtotal: ${totals.subtotal.toFixed(2)}</Typography>
      <Typography>IVA: ${totals.iva.toFixed(2)}</Typography>
      <Typography>Total: ${totals.total.toFixed(2)}</Typography>

      {/* FORMA DE PAGO */}
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
      <Typography variant="h6">Pago</Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={guardarFactura}>
        Guardar Factura
      </Button>

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