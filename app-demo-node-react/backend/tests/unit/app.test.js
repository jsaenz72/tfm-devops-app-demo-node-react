import app from '../../src/app.js';

describe('App load', () => {
  it('should load express app', () => {
    expect(app).toBeDefined();
  });
});