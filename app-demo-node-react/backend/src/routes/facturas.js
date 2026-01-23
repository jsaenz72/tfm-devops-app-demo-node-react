import express from 'express';
import { readList, writeList } from '../lib/storage.js'; // 👈 usa import
import {generarAutorizacionMock} from  '../mocks/claveAcceso.mock.js';

const router = express.Router();

function validarPorcentajeIVA(valor) {
  if (valor === undefined || valor === null || valor === '') {
    throw new Error('El porcentaje de IVA es obligatorio');
  }

  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    throw new TypeError('El porcentaje de IVA debe ser numérico');
  }

  if (numero < 0 || numero > 100) {
    throw new Error('El porcentaje de IVA debe estar entre 0 y 100');
  }

  return numero;
}

/**
 * @swagger
 * tags:
 *   name: Facturas
 *   description: Gestión de facturas
 */

/**
 * @swagger
 * /api/facturas:
 *   get:
 *     summary: Listado de todas las facturas registradas
 *     tags: [Facturas]
 *     responses:
 *       200:
 *         description: Lista completa de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error al cargar facturas
 */
router.get('/', async (req, res) => {
  try {
    const facturas = await readList('facturas');
    res.json(facturas);
  } catch (error) {
    console.error('Error al leer facturas:', error);
    res.status(500).json([]);
  }
});

/**
 * @swagger
 * /api/facturas/rango:
 *   get:
 *     summary: Listado de facturas en un rango de fechas
 *     tags: [Facturas]
 *     parameters:
 *       - in: query
 *         name: inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango
 *       - in: query
 *         name: fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango
 *     responses:
 *       200:
 *         description: Lista de facturas filtradas por rango de fechas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error al cargar facturas
 */
router.get('/rango', async (req, res) => {
  try {
    const facturas = await readList('facturas');
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res.json(facturas); // si no hay filtros, devuelve todas
    }

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    const resultado = facturas.filter(f => {
      const fechaFactura = new Date(f.audit?.fechaCreacion);
      return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
    });

    res.json(resultado);
  } catch (error) {
    console.error('Error al leer facturas:', error);
    res.status(500).json([]);
  }
});

// POST: crear nueva factura
/**
 * @swagger
 * /api/facturas:
 *   post:
 *     summary: Crear una nueva factura
 *     tags: [Facturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cabecera
 *               - detalle
 *             properties:
 *               cabecera:
 *                 type: object
 *               detalle:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 *       400:
 *         description: Datos inválidos (cabecera y detalle requeridos)
 */

router.post('/', async (req, res) => {
  const factura = req.body;

  if (!factura?.cabecera || !factura?.detalle) {
    return res.status(400).json({ error: 'cabecera y detalle son requeridos' });
  }

// Recuperar empresa
const empresa = await readList('empresa');
if (!empresa.length) {
  return res.status(400).json({ error: 'No existe información de empresa' });
}
// Seleccionar solo los campos necesarios
const empresaInfo = {
  nombreEmpresa: empresa[0].nombreEmpresa,
  nombreComercial: empresa[0].nombreComercial,
  ruc: empresa[0].ruc,
  telefono: empresa[0].telefono,
  direccion: empresa[0].direccion,
  puntoEmision: empresa[0].puntoEmision
};
// % del IVA
let porcentajeIVA = 0; 
try {
  porcentajeIVA = validarPorcentajeIVA(empresa[0].porcentajeIVA) / 100;
} catch (error) {
  return res.status(400).json({ error: error.message });
}

const {
  fecha,
  formaPago,
  cliente
} = factura.cabecera;

  let numeroFacturaActual = empresa?.[0]?.numeroFactura || 0;
  const nuevoNumeroFactura = numeroFacturaActual + 1;

  empresa[0].numeroFactura = nuevoNumeroFactura;
  await writeList('empresa', empresa);

  const list = await readList('facturas');
  const id = list.length ? Math.max(...list.map(f => f.id)) + 1 : 1;
  const now = new Date().toISOString();

  const subtotalConIVA = factura.detalle
    .filter(d => d.pagaIVA)
    .reduce((acc, d) => acc + (d.precioTotal || d.cantidad * d.precioUnitario), 0);

  const subtotalSinIVA = factura.detalle
    .filter(d => !d.pagaIVA)
    .reduce((acc, d) => acc + (d.precioTotal || d.cantidad * d.precioUnitario), 0);

  const ivaTotal = subtotalConIVA * porcentajeIVA;
  const valorTotal = subtotalConIVA + subtotalSinIVA + ivaTotal;
  
  const {
    claveAcceso,
    estado,
    numeroAutorizacion,
    fechaAutorizacion,
    ambiente
    } = generarAutorizacionMock();


  const newFactura = {
    id,
    empresa: empresaInfo,
    cliente,
    cabecera: {
      numeroFactura: nuevoNumeroFactura,
      claveAcceso,
      estado,
      numeroAutorizacion,
      fechaAutorizacion,
      ambiente,
      fecha,
      formaPago
    },
    detalle: factura.detalle,
    totales: {
      subtotalConIVA,
      subtotalSinIVA,
      ivaTotal,
      valorTotal
    },
    audit: {
      fechaCreacion: now,
      usuarioCreacion: req.user?.username || 'system',
      fechaActualizacion: null,
      usuarioActualizacion: null
    }
  };

  list.push(newFactura);
  await writeList('facturas', list);
  res.status(201).json(newFactura);
});


export default router; // 👈 exportación ESM
