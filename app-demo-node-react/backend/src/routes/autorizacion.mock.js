import express from 'express';
import {generarClaveAccesoMock} from  '../mocks/claveAcceso.mock.js';

const router = express.Router();

/**
 * @swagger
 * /api/mock/autorizacion:
 *   get:
 *     summary: Autorizar comprobante electrónico (Mock SRI)
 *     description: |
 *       Simula la autorización de un comprobante electrónico del SRI.
 *       Endpoint mock utilizado exclusivamente para pruebas y TFM.
 *     tags: [Autorización (Mock)]
 *     responses:
 *       200:
 *         description: Comprobante autorizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: AUTORIZADO
 *                 numeroAutorizacion:
 *                   type: string
 *                   example: 0912202501099141757500120010080006776221234567819
 *                 claveAcceso:
 *                   type: string
 *                   example: 0912202501099141757500120010080006776221234567819
 *                 fechaAutorizacion:
 *                   type: string
 *                   format: date-time
 *                 ambiente:
 *                   type: string
 *                   example: PRODUCCIÓN
 *                 mensaje:
 *                   type: string
 *                   example: Autorización generada mediante mock (TFM)
 *       500:
 *         description: Error interno del servidor
 */

// GET: simula autorización del comprobante
router.get('/autorizacion', (req, res) => {
  try {
    const claveAcceso = generarClaveAccesoMock();

    res.status(200).json({
      estado: 'AUTORIZADO',
      numeroAutorizacion: claveAcceso,
      claveAcceso: claveAcceso,
      fechaAutorizacion: new Date().toISOString(),
      ambiente: 'PRODUCCIÓN',
      mensaje: 'Autorización generada mediante mock (TFM)'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al generar autorización mock'
    });
  }
});

export default router;
