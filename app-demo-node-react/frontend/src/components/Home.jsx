import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Receipt, Store, Business, TrendingUp } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const API_URL = __API_URL__;

export default function Home() {
  return (
    <Grid container spacing={3}>
      {/* Hero */}
      <Grid item xs={12}>
        <Card sx={{ bgcolor: 'primary.main', color: 'white', p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido al Sistema de Facturación
          </Typography>
          <Typography variant="body1" gutterBottom>
            Administra facturación, inventarios y tu empresa desde una interfaz moderna y optimizada.
          </Typography>
          <Button component={Link} to="/factura" variant="contained" color="secondary" startIcon={<Receipt />}>
            Crear Factura
          </Button>
          <Button component={Link} to="/productos" variant="outlined" sx={{ ml: 2 }} startIcon={<Store />}>
            Ver Productos
          </Button>
        </Card>
      </Grid>

      {/* Métricas */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <TrendingUp color="primary" />
            <Typography variant="h6">Facturación</Typography>
            <Typography variant="h4">+120</Typography>
            <Typography color="text.secondary">Facturas este mes</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Store color="success" />
            <Typography variant="h6">Gestión</Typography>
            <Typography variant="h4">Completa</Typography>
            <Typography color="text.secondary">Todo lo que necesitas</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Business color="secondary" />
            <Typography variant="h6">Ambiente</Typography>
            <Typography variant="h4">Pruebas</Typography>
            <Typography color="text.secondary">{API_URL}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
