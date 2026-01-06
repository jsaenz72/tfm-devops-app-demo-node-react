import express from 'express';
import { readList, writeList } from '../lib/storage.js';

const router = express.Router();

/**
 * Función de validación reutilizable (TESTEABLE)
 */
function validarEmpresa(data) {
  const camposRequeridos = [
    'nombreEmpresa',
    'nombreComercial',
    'ruc',
    'telefono',
    'direccion',
    'puntoEmision',
    'numeroFactura',
    'porcentajeIVA',
    'usuarioActualizacion'
  ];

  const faltantes = camposRequeridos.filter(
    campo => data[campo] === undefined || data[campo] === null || data[campo] === ''
  );

  return {
    esValido: faltantes.length === 0,
    faltantes
  };
}

/**
 * @swagger
 * /api/empresa:
 *   get:
 *     summary: Obtener información de la empresa
 *     tags: [Empresa]
 *     responses:
 *       200:
 *         description: Información de la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       204:
 *         description: No existe información registrada
 *       500:
 *         description: Error interno del servidor
 */
// GET: obtiene la información de la empresa
router.get('/', async (req, res) => {
  try {
    const list = await readList('empresa');

    if (!list.length) {
      return res.status(204).send();
    }

    res.status(200).json(list[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empresa' });
  }
});

// POST: crea la información de la empresa
/**
 * @swagger
 * /api/empresa:
 *   post:
 *     summary: Crear información de la empresa
 *     tags: [Empresa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreEmpresa
 *               - nombreComercial
 *               - ruc
 *               - telefono
 *               - direccion
 *               - puntoEmision
 *               - numeroFactura
 *               - porcentajeIVA
 *               - usuarioCreacion
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
 *                 type: integer
 *               porcentajeIVA:
 *                 type: number
 *               usuarioCreacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empresa creada correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno
 */

router.post('/', async (req, res) => {
  try {
    const validacion = validarEmpresa({
      ...req.body,
      usuarioActualizacion: req.body.usuarioCreacion
    });

    if (!validacion.esValido) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios',
        camposFaltantes: validacion.faltantes
      });
    }

    const now = new Date().toISOString();

    const empresa = {
      ...req.body,
      fechaCreacion: now,
      fechaActualizacion: now,
      usuarioActualizacion: req.body.usuarioCreacion
    };

    await writeList('empresa', [empresa]);
    res.status(201).json(empresa);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear empresa' });
  }
});


// PUT: actualiza la información de la empresa
/**
 * @swagger
 * /api/empresa:
 *   put:
 *     summary: Actualizar información de la empresa
 *     tags: [Empresa]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Empresa actualizada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error interno
 */

router.put('/', async (req, res) => {
  try {
    const list = await readList('empresa');

    if (!list.length) {
      return res.status(404).json({ error: 'No existe empresa' });
    }

    const validacion = validarEmpresa(req.body);

    if (!validacion.esValido) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios para actualización',
        camposFaltantes: validacion.faltantes
      });
    }

    const empresaActual = list[0];
    const now = new Date().toISOString();

    const empresaActualizada = {
      nombreEmpresa: req.body.nombreEmpresa,
      nombreComercial: req.body.nombreComercial,
      ruc: req.body.ruc,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      puntoEmision: req.body.puntoEmision,
      numeroFactura: req.body.numeroFactura,
      porcentajeIVA: req.body.porcentajeIVA,

      // metadatos
      fechaCreacion: empresaActual.fechaCreacion,
      usuarioCreacion: empresaActual.usuarioCreacion,
      fechaActualizacion: now,
      usuarioActualizacion: req.body.usuarioActualizacion
    };

    await writeList('empresa', [empresaActualizada]);
    res.status(200).json(empresaActualizada);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar empresa' });
  }
});

export default router;
