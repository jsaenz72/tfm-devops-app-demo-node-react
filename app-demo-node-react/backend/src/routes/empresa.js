const express = require('express');
const { readList, writeList } = require('../lib/storage');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Empresa
 *   description: Gestión de información de la empresa
 */

/**
 * @swagger
 * /api/empresa:
 *   get:
 *     summary: Obtiene la información de la empresa
 *     tags: [Empresa]
 *     responses:
 *       200:
 *         description: Datos de la empresa
 */
router.get('/', async (req, res) => {
  const list = await readList('empresa');
  res.json(list[0] || null);
});

/**
 * @swagger
 * /api/empresa:
 *   post:
 *     summary: Crea o reemplaza la información de la empresa
 *     tags: [Empresa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombreEmpresa, ruc]
 *             properties:
 *               nombreEmpresa:
 *                 type: string
 *               nombreComercial:
 *                 type: string
 *               ruc:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               puntoEmision:
 *                 type: string
 *               numeroFactura:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empresa creada
 */
router.post('/', async (req, res) => {
  const { nombreEmpresa, nombreComercial, ruc, telefono, direccion, puntoEmision, numeroFactura } = req.body;
  if (!nombreEmpresa || !ruc) return res.status(400).json({ error: 'nombreEmpresa y ruc son requeridos' });
  const obj = { nombreEmpresa, nombreComercial, ruc, telefono, direccion, puntoEmision, numeroFactura };
  await writeList('empresa', [obj]);
  res.status(201).json(obj);
});

/**
 * @swagger
 * /api/empresa:
 *   put:
 *     summary: Actualiza la información de la empresa
 *     tags: [Empresa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Empresa actualizada
 *       404:
 *         description: No existe empresa
 */
router.put('/', async (req, res) => {
  const list = await readList('empresa');
  if (!list.length) return res.status(404).json({ error: 'No existe empresa' });
  const updated = { ...list[0], ...req.body };
  await writeList('empresa', [updated]);
  res.json(updated);
});

module.exports = router;
