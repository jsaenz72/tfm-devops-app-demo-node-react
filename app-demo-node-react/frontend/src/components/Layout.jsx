import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Receipt, Store, Business, Home } from '@mui/icons-material';
import { Link, Outlet } from 'react-router-dom';

const API_URL = __API_URL__;

export default function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">TFM Facturación</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: 240, [`& .MuiDrawer-paper`]: { width: 240 } }}>
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem button component={Link} to="/factura">
            <ListItemIcon><Receipt /></ListItemIcon>
            <ListItemText primary="Nueva Factura" />
          </ListItem>
          <ListItem button component={Link} to="/productos">
            <ListItemIcon><Store /></ListItemIcon>
            <ListItemText primary="Productos" />
          </ListItem>
          <ListItem button component={Link} to="/empresa">
            <ListItemIcon><Business /></ListItemIcon>
            <ListItemText primary="Empresa" />
          </ListItem>
          <ListItem button component={Link} to="/reportes">
            <ListItemIcon><Business /></ListItemIcon>
            <ListItemText primary="Reportes" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
