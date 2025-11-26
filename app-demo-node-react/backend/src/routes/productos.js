const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readList, writeList } = require('../lib/storage');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async (req, res) => {
  const list = await readList('productos');
  res.json(list);
});

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nombre
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               precioUnitario:
 *                 type: number
 *               infoAdicional:
 *                 type: string
 *               tarifaIVA:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/', async (req, res) => {
  const { codigo, nombre, precioUnitario, infoAdicional, tarifaIVA } = req.body;
  if (!codigo || !nombre) return res.status(400).json({ error: 'codigo y nombre son requeridos' });
  const list = await readList('productos');
  const id = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
  const nuevo = { id, codigo, nombre, precioUnitario: Number(precioUnitario||0), infoAdicional: infoAdicional||'', tarifaIVA: tarifaIVA||'0' };
  list.push(nuevo);
  await writeList('productos', list);
  res.status(201).json(nuevo);
});

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const list = await readList('productos');
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  list[idx] = { ...list[idx], ...req.body };
  await writeList('productos', list);
  res.json(list[idx]);
});

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const list = await readList('productos');
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = list.splice(idx,1)[0];
  await writeList('productos', list);
  res.json(deleted);
});

module.exports = router;
