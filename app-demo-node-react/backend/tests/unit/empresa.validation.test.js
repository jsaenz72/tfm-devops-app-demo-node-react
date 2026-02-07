import { validarEmpresa } from '../../src/routes/empresa.js';

describe('Validación de Empresa', () => {

  test('Debe ser válido cuando todos los campos existen', () => {
    const data = {
      nombreEmpresa: 'Empresa X',
      nombreComercial: 'Comercial X',
      ruc: '123',
      telefono: '099',
      direccion: 'Quito',
      puntoEmision: '001',
      numeroFactura: 1,
      porcentajeIVA: 12,
      usuarioActualizacion: 'admin'
    };

    const result = validarEmpresa(data);

    expect(result.esValido).toBe(true);
    expect(result.faltantes).toHaveLength(0);
  });

  test('Debe detectar campos faltantes', () => {
    const result = validarEmpresa({});

    expect(result.esValido).toBe(false);
    expect(result.faltantes).toContain('nombreEmpresa');
    expect(result.faltantes).toContain('ruc');
  });

});
