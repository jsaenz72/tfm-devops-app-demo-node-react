const express = require('express');
const router = express.Router();
let items = require('../data.json');

// List
router.get('/', (req, res) => {
  res.json(items);
});

// Get by id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const it = items.find(i => i.id === id);
  if (!it) return res.status(404).json({ error: 'Not found' });
  res.json(it);
});

// Create
router.post('/', (req, res) => {
  const { name, description } = req.body;
  const id = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { id, name, description };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Update
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

// Delete
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = items.splice(idx, 1)[0];
  res.json(deleted);
});

module.exports = router;
