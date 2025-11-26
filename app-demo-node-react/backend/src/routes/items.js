const express = require('express');
const router = express.Router();
let items = require('../data.json');

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Gestión de items
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Lista todos los items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Lista de items
 */
router.get('/', (req, res) => {
  res.json(items);
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtiene un item por ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const it = items.find(i => i.id === id);
  if (!it) return res.status(404).json({ error: 'Not found' });
  res.json(it);
});

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Crea un item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item creado
 */
router.post('/', (req, res) => {
  const { name, description } = req.body;
  const id = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { id, name, description };
  items.push(newItem);
  res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Actualiza un item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Elimina un item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Item eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = items.splice(idx, 1)[0];
  res.json(deleted);
});

module.exports = router;
