import express from 'express';
import { readList, writeList } from '../lib/storage.js';
import { generarAutorizacionMock } from '../mocks/claveAcceso.mock.js';

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
 * name: Facturas
 * description: Gestión de facturas
 */

/**
 * @swagger
 * /api/facturas:
 * get:
 * summary: Listado de todas las facturas registradas
 * tags: [Facturas]
 * responses:
 * 200:
 * description: Lista completa de facturas
 * 500:
 * description: Error al cargar facturas
 */
router.get('/', async (req, res) => {
  try {
    const facturas = await readList('facturas');
    res.json(facturas);
  } catch (error) {
    console.error('Error al leer facturas:', error);
    res.status(500).json({ error: 'Error al cargar las facturas' });
  }
});

/**
 * @swagger
 * /api/facturas/rango:
 * get:
 * summary: Listado de facturas en un rango de fechas
 * tags: [Facturas]
 * parameters:
 * - in: query
 * name: inicio
 * schema:
 * type: string
 * format: date
 * - in: query
 * name: fin
 * schema:
 * type: string
 * format: date
 * responses:
 * 200:
 * description: Lista de facturas filtradas
 * 500:
 * description: Error interno
 */
router.get('/rango', async (req, res) => {
  try {
    const facturas = await readList('facturas');
    const { inicio, fin } = req.query;

    if (!inicio || !fin) return res.json(facturas);

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    const resultado = facturas.filter(f => {
      const fechaFactura = new Date(f.audit?.fechaCreacion);
      return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar facturas' });
  }
});

/**
 * @swagger
 * /api/facturas:
 * post:
 * summary: Crear una nueva factura
 * tags: [Facturas]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [cabecera, detalle]
 * properties:
 * cabecera:
 * type: object
 * detalle:
 * type: array
 * items:
 * type: object
 * responses:
 * 201:
 * description: Factura creada exitosamente
 * 400:
 * description: Error de validación (IVA incorrecto, campos faltantes, etc.)
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: "El porcentaje de IVA debe estar entre 0 y 100"
 * 500:
 * description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const factura = req.body;

    if (!factura?.cabecera || !factura?.detalle) {
      return res.status(400).json({ error: 'cabecera y detalle son requeridos' });
    }

    const empresa = await readList('empresa');
    if (!empresa.length) {
      return res.status(400).json({ error: 'No existe información de empresa' });
    }

    const empresaActual = empresa[0];

    // Aquí capturamos los errores de validación dinámicamente
    const porcentajeIVA = validarPorcentajeIVA(empresaActual.porcentajeIVA) / 100;

    if (typeof empresaActual.numeroFactura !== 'number') {
      return res.status(400).json({ error: 'El campo numeroFactura es inválido o no existe' });
    }

    const empresaInfo = {
      nombreEmpresa: empresaActual.nombreEmpresa,
      nombreComercial: empresaActual.nombreComercial,
      ruc: empresaActual.ruc,
      telefono: empresaActual.telefono,
      direccion: empresaActual.direccion,
      puntoEmision: empresaActual.puntoEmision
    };

    const { fecha, formaPago, cliente } = factura.cabecera;

    const nuevoNumeroFactura = empresaActual.numeroFactura + 1;
    empresaActual.numeroFactura = nuevoNumeroFactura;
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

    const { claveAcceso, estado, numeroAutorizacion, fechaAutorizacion, ambiente } = generarAutorizacionMock();

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
      totales: { subtotalConIVA, subtotalSinIVA, ivaTotal, valorTotal },
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

  } catch (error) {
    console.error('Error al procesar factura:', error.message);
    
    // Si el error es una instancia de Error o TypeError, es un fallo de validación esperado (400)
    const isValidationError = error instanceof TypeError || error instanceof Error;
    const status = isValidationError ? 400 : 500;

    res.status(status).json({ 
      error: error.message || 'Error interno al crear factura' 
    });
  }
});

export default router;