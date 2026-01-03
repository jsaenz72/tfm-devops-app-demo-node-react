const express = require('express');
const { readList, writeList } = require('../lib/storage');
const router = express.Router();

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
 *     summary: Lista todas las facturas
 *     tags: [Facturas]
 *     responses:
 *       200:
 *         description: Lista de facturas
 */
router.get('/', async (req, res) => {
  const list = await readList('facturas');
  res.json(list);
});

/**
 * @swagger
 * /api/facturas:
 *   post:
 *     summary: Crea una nueva factura
 *     tags: [Facturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cabecera, detalle]
 *             properties:
 *               cabecera:
 *                 type: object
 *                 description: Información principal de la factura (cliente, fecha, etc.)
 *               detalle:
 *                 type: array
 *                 description: Lista de ítems de la factura
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *                     precioUnitario:
 *                       type: number
 *                     pagaIVA:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Factura creada
 */
router.post('/', async (req, res) => {
  const factura = req.body;

  // Validación mínima (numeroFactura ya no se envía, se genera automáticamente)
  if (!factura?.cabecera || !factura?.detalle) {
    return res.status(400).json({ error: 'cabecera y detalle son requeridos' });
  }

  // Leer empresa.json para obtener el consecutivo
  const empresa = await readList('empresa');
  let numeroFacturaActual = empresa?.[0]?.numeroFactura || 0;

  // Incrementar consecutivo
  const nuevoNumeroFactura = numeroFacturaActual + 1;

  // Actualizar empresa.json con el nuevo consecutivo
  empresa[0].numeroFactura = nuevoNumeroFactura;
  await writeList('empresa', empresa);

  // Leer lista de facturas
  const list = await readList('facturas');
  const id = list.length ? Math.max(...list.map(f => f.id)) + 1 : 1;
  const now = new Date().toISOString();

  // Cálculo de totales
  const subtotalConIVA = factura.detalle
    .filter(d => d.pagaIVA)
    .reduce((acc, d) => acc + (d.precioTotal || d.cantidad * d.precioUnitario), 0);

  const subtotalSinIVA = factura.detalle
    .filter(d => !d.pagaIVA)
    .reduce((acc, d) => acc + (d.precioTotal || d.cantidad * d.precioUnitario), 0);

  const valorTotal = subtotalConIVA + subtotalSinIVA;

  const newFactura = {
    id,
    numeroFactura: nuevoNumeroFactura, // ← generado automáticamente
    cabecera: factura.cabecera,
    detalle: factura.detalle,
    totales: {
      subtotalConIVA,
      subtotalSinIVA,
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

/**
 * @swagger
 * /api/facturas/{id}:
 *   get:
 *     summary: Obtiene una factura por ID
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Factura encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const list = await readList('facturas');
  const it = list.find(f => f.id === id);
  if (!it) return res.status(404).json({ error: 'Not found' });
  res.json(it);
});

module.exports = router;
