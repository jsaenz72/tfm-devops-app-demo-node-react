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
 *             required: [numeroFactura]
 *             properties:
 *               numeroFactura:
 *                 type: string
 *     responses:
 *       201:
 *         description: Factura creada
 */
router.post('/', async (req, res) => {
  const factura = req.body;
  if (!factura || !factura.numeroFactura)
    return res.status(400).json({ error: 'numeroFactura es requerido' });

  const list = await readList('facturas');
  const id = list.length ? Math.max(...list.map(f => f.id)) + 1 : 1;
  const now = new Date().toISOString();
  const newFactura = { id, createdAt: now, ...factura };

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
