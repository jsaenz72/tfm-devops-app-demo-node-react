const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('node:path');

// Routers
const productosRouter = require('./routes/productos');
const empresaRouter = require('./routes/empresa');
const facturasRouter = require('./routes/facturas');
const itemsRouter = require('./routes/items');

// Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

/* =====================================
   CONFIGURACIÓN DE SWAGGER
===================================== */
const port = process.env.PORT || 3000;
console.log(`http://localhost:${port}`);
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Demo Node.js - TFM",
      version: "1.0.0",
      description: "Documentación de la API del backend para tu proyecto MEAN/Node",
    },
    servers: [
      {
        url: process.env.API_BASE_URL || `http://localhost:${port}`,
      },
    ],
  },
  apis: [
    path.join(__dirname, "routes/*.js") // <-- Swagger documentará tus rutas automáticamente
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


// Ruta de documentación
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =====================================
   RUTAS DE LA API
===================================== */

app.use('/api/items', itemsRouter);
app.use('/api/productos', productosRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/facturas', facturasRouter);

/* =====================================
   FRONTEND (Angular/React/Vue)
===================================== */

app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'));
});

/* =====================================
   SERVER
===================================== */

app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
  console.log(`Swagger disponible en http://localhost:${port}/api-docs`);
});

module.exports = app;
