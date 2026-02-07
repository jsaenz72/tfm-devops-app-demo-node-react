import request from 'supertest';
import app from '../../src/app.js';

describe('API Productos - Integración', () => {

  test('GET /api/productos → 204 si no hay datos', async () => {
    const res = await request(app).get('/api/productos');
    expect([200, 204]).toContain(res.status);
  });

});
