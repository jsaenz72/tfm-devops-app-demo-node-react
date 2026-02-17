import express from 'express';
import fs from 'fs-extra';
import path from 'node:path';

const router = express.Router();
const DATA_DIR = process.env.DATA_DIR || '/app/data';

/**
 * @swagger
 * /storage:
 *   get:
 *     summary: Información del volumen persistente
 *     responses:
 *       200:
 *         description: Estado del volumen
 */
router.get('/storage', async (req, res) => {
  try {
    await fs.ensureDir(DATA_DIR);
    const files = await fs.readdir(DATA_DIR);

    res.json({
      dataDir: DATA_DIR,
      writable: true,
      files
    });
  } catch (err) {
    res.status(500).json({
      dataDir: DATA_DIR,
      writable: false,
      error: err.message
    });
  }
});

export default router;
