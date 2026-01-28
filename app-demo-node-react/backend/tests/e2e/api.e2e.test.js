import { jest } from '@jest/globals';
import request from 'supertest';

/**
 * Base de datos en memoria para los tests E2E
 */
const mockDB = {
  empresas: [],
  productos: [],
  facturas: []
};

/**
 * Mock CORRECTO del módulo storage (ESM)
 * Se define ANTES de importar app
 */
jest.unstable_mockModule('../../src/lib/storage.js', () => ({
  readList: jest.fn(async (name) => {
    return mockDB[name] ?? [];
  }),
  writeList: jest.fn(async (name, list) => {
    mockDB[name] = [...list];
  })
}));

/**
 * Importación dinámica obligatoria en ESM
 */
const { default: app } = await import('../../src/app.js');

describe('API E2E – Flujo completo de facturación', () => {

  beforeEach(() => {
    // Limpiar estado entre tests
    mockDB.empresas = [];
    mockDB.productos = [];
    mockDB.facturas = [];
  });

  test('Crear empresa → crear producto → listar productos', async () => {

    // Crear producto
    const productoRes = await request(app)
      .post('/api/productos')
      .send({
        codigo: 'P001',
        nombre: 'Producto Test',
        precioUnitario: 10,
        pagaIVA: true
      });

    expect(productoRes.status).toBe(201);
    expect(mockDB.productos.length).toBe(1);

    // Listar productos
    const listRes = await request(app)
      .get('/api/productos');

    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].codigo).toBe('P001');
  });

});
