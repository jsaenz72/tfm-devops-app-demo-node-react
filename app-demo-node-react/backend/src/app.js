import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Routers
import productosRouter from './routes/productos.js';
import empresaRouter from './routes/empresa.js';
import facturasRouter from './routes/facturas.js';
import mockRouter from './routes/autorizacion.mock.js';

// Swagger
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

/* =====================================
   MIDDLEWARES
===================================== */
app.use(cors());
app.use(bodyParser.json());

/* =====================================
   CONFIGURACIÓN DE SWAGGER
===================================== */
const port = process.env.PORT || 3000;

// reconstruir __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Demo Node.js - TFM',
      version: '1.0.0',
      description: 'Documentación de la API del backend para tu proyecto Node/React',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || `http://localhost:${port}`,
      },
    ],
  },
  apis: [path.join(__dirname, 'routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =====================================
   RUTAS DE LA API
===================================== */
app.use('/api/productos', productosRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/facturas', facturasRouter);
app.use('/api/mocks', mockRouter);

/* =====================================
   FRONTEND (React build)
===================================== */
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html')
  );
});

export default app;
