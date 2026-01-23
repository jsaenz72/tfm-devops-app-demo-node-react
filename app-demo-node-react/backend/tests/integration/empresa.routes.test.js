import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

/**
 * 1️⃣ Mock del módulo ANTES de importarlo
 */
jest.unstable_mockModule('../../src/lib/storage.js', () => ({
  readList: jest.fn(),
  writeList: jest.fn()
}));

/**
 * 2️⃣ Importaciones DESPUÉS del mock
 */
const { readList, writeList } = await import('../../src/lib/storage.js');
const empresaRouter = (await import('../../src/routes/empresa.js')).default;

const app = express();
app.use(express.json());
app.use('/api/empresa', empresaRouter);

describe('API Empresa - Integración', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/empresa → 204 si no hay datos', async () => {
    readList.mockResolvedValue([]);

    const res = await request(app).get('/api/empresa');

    expect(res.status).toBe(204);
  });

  test('POST /api/empresa → crea empresa', async () => {
    writeList.mockResolvedValue();

    const res = await request(app)
      .post('/api/empresa')
      .send({
        nombreEmpresa: 'Empresa X',
        nombreComercial: 'Comercial X',
        ruc: '123',
        telefono: '099',
        direccion: 'Quito',
        puntoEmision: '001',
        numeroFactura: 1,
        porcentajeIVA: 12,
        usuarioCreacion: 'admin'
      });

    expect(res.status).toBe(201);
    expect(writeList).toHaveBeenCalled();
    expect(res.body.nombreEmpresa).toBe('Empresa X');
  });

});
