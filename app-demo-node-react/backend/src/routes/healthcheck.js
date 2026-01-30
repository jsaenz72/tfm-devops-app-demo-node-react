import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Estado y monitoreo del servicio
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificación del estado del servicio (Health Check)
 *     description: Permite comprobar que la API está operativa. Usado por Docker, Kubernetes o balanceadores.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servicio disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 service:
 *                   type: string
 *                   example: backend-api
 *       503:
 *         description: Servicio no disponible
 */

router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'backend-api'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;
