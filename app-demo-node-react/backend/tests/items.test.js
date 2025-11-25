const request = require('supertest');
const app = require('../src/index');

describe('Items API', () => {
  let server;
  beforeAll(() => {
    // app already listens; supertest can use the exported app
  });

  it('GET /api/items should return array', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/items should create item', async () => {
    const res = await request(app).post('/api/items').send({ name: 'X', description: 'Y' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('X');
  });

  afterAll(done => {
  const server = require('../src/index.js');
  server.close(done);
});
});


