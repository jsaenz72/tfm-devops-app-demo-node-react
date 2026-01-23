import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';

// mock del módulo completo
jest.mock('../../src/lib/storage.js', () => ({
  readList: jest.fn(),
  writeList: jest.fn()
}));

describe('Flujo completo de facturación (E2E)', () => {

  test('Crear empresa → producto → factura', async () => {

    const empresaRes = await request(app)
      .post('/api/empresa')
      .send({
        nombreEmpresa: 'Empresa E2E',
        nombreComercial: 'Comercial E2E',
        ruc: '0999999999',
        telefono: '099999999',
        direccion: 'Quito',
        puntoEmision: '001',
        numeroFactura: 1,
        porcentajeIVA: 12,
        usuarioCreacion: 'tester'
      });

    expect(empresaRes.status).toBe(201);

    const productoRes = await request(app)
      .post('/api/productos')
      .send({
        codigo: 'P001',
        nombre: 'Producto Test',
        precioUnitario: 10,
        pagaIVA: true
      });

    expect(productoRes.status).toBe(201);
  });

});
