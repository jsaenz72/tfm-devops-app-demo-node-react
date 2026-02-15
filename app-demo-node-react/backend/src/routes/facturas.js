import express from 'express';
import { readList, writeList } from '../lib/storage.js';
import { generarAutorizacionMock } from '../mocks/claveAcceso.mock.js';

const router = express.Router();

/**
 * Valida que el porcentaje de IVA sea numérico y esté entre 0 y 100
 */
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
 *   - name: Facturas
 *     description: Gestión de facturas
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
      return res.json(facturas);
    }

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    const resultado = facturas.filter(f => {
      if (!f.audit?.fechaCreacion) return false;

      const fechaFactura = new Date(f.audit.fechaCreacion);
      if (Number.isNaN(fechaFactura.getTime())) return false;

      return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
    });

    res.json(resultado);
  } catch (error) {
    console.error('Error al leer facturas por rango:', error);
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
  let mensaje = 'Inicio';

  try {
    mensaje = 'Validando body';

    const factura = req.body;

    if (
      !factura?.cabecera ||
      !Array.isArray(factura?.detalle) ||
      factura.detalle.length === 0
    ) {
      return res.status(400).json({
        error: 'cabecera y detalle (array no vacío) son requeridos'
      });
    }

    mensaje = 'Leyendo empresa';

    const empresa = await readList('empresa');

    if (!empresa.length) {
      return res.status(400).json({
        error: 'No existe información de empresa'
      });
    }

    const empresaActual = empresa[0];

    if (typeof empresaActual.porcentajeIVA !== 'number') {
      return res.status(400).json({
        error: 'El campo porcentajeIVA es inválido o no existe'
      });
    }

    if (typeof empresaActual.numeroFactura !== 'number') {
      return res.status(400).json({
        error: 'El campo numeroFactura es inválido o no existe'
      });
    }

    mensaje = 'Construyendo empresaInfo';

    const empresaInfo = {
      nombreEmpresa: empresaActual.nombreEmpresa,
      nombreComercial: empresaActual.nombreComercial,
      ruc: empresaActual.ruc,
      telefono: empresaActual.telefono,
      direccion: empresaActual.direccion,
      puntoEmision: empresaActual.puntoEmision
    };

    const porcentajeIVA = validarPorcentajeIVA(
      empresaActual.porcentajeIVA
    ) / 100;

    const { fecha, formaPago, cliente } = factura.cabecera;

    mensaje = 'Calculando totales';

    const subtotalConIVA = factura.detalle
      .filter(d => d.pagaIVA)
      .reduce(
        (acc, d) =>
          acc +
          (d.precioTotal ??
            (Number(d.cantidad) * Number(d.precioUnitario))),
        0
      );

    const subtotalSinIVA = factura.detalle
      .filter(d => !d.pagaIVA)
      .reduce(
        (acc, d) =>
          acc +
          (d.precioTotal ??
            (Number(d.cantidad) * Number(d.precioUnitario))),
        0
      );

    const ivaTotal = subtotalConIVA * porcentajeIVA;
    const valorTotal = subtotalConIVA + subtotalSinIVA + ivaTotal;

    mensaje = 'Generando autorización';

    const {
      claveAcceso,
      estado,
      numeroAutorizacion,
      fechaAutorizacion,
      ambiente
    } = generarAutorizacionMock();

    mensaje = 'Generando ID y número factura';

    const list = await readList('facturas');

    const id = list.length
      ? Math.max(...list.map(f => Number(f.id) || 0)) + 1
      : 1;

    const nuevoNumeroFactura = empresaActual.numeroFactura + 1;

    const now = new Date().toISOString();

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

    mensaje = 'Guardando factura';

    list.push(newFactura);
    await writeList('facturas', list);

    mensaje = 'Actualizando número factura empresa';

    empresaActual.numeroFactura = nuevoNumeroFactura;
    await writeList('empresa', empresa);

    res.status(201).json(newFactura);

  } catch (error) {
    console.error('Error al crear factura:', error);

    res.status(500).json({
      error: 'Error interno al crear factura',
      paso: mensaje,
      detalle: error.message
    });
  }
});

export default router;
