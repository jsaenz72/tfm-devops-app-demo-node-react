const request = require('supertest');
const app = require('../src/index');
describe('Health', () => {
  it('GET /api/items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
  });
});
