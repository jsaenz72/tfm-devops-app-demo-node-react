import dotenv from 'dotenv';


/**
 * Mock generador de Clave de Acceso (49 dígitos)
 */
dotenv.config();

function calcularModulo11(cadena) {
  const factores = [2, 3, 4, 5, 6, 7];
  let suma = 0;
  let factorIndex = 0;

  for (let i = cadena.length - 1; i >= 0; i--) {
    const digito = Number(cadena[i]); // más claro que parseInt
    suma += digito * factores[factorIndex];
    factorIndex = (factorIndex + 1) % factores.length;
  }

  const residuo = suma % 11;
  const digito = 11 - residuo;

    let resultado;
    if (digito === 11) {
    resultado = 0;
    } else if (digito === 10) {
    resultado = 1;
    } else {
    resultado = digito;
    }
    return resultado;
}


export function generarClaveAccesoMock( ) {
  const fecha = process.env.SRI_FECHA_COMPROBANTE;
  const tipoComprobante = process.env.SRI_TIPO_COMPROBANTE;
  const ruc = process.env.SRI_RUC;
  const ambiente = process.env.SRI_AMBIENTE_CODIGO;
  const serie = process.env.SRI_SERIE;
  const secuencial = process.env.SRI_SECUENCIAL;
  const codigoNumerico = process.env.SRI_CODIGO_NUMERICO;
  const tipoEmision = process.env.SRI_TIPO_EMISION;

  const base =
    fecha +
    tipoComprobante +
    ruc +
    ambiente +
    serie +
    secuencial +
    codigoNumerico +
    tipoEmision;

  const digitoVerificador = String(calcularModulo11(base)).padStart(4, '0');

  // Fuerza string desde aquí
  const claveAcceso = base + digitoVerificador;

  if (claveAcceso.length !== 49) {
    throw new Error(
      `Clave de acceso inválida. Longitud esperada 49, obtenida ${claveAcceso.length}`
    );
  }

  return String(claveAcceso); 
}

export function generarAutorizacionMock() {
  const claveAcceso = generarClaveAccesoMock();
  return {
    claveAcceso,
    estado: process.env.SRI_ESTADO_AUTORIZACION,
    numeroAutorizacion: claveAcceso,
    fechaAutorizacion: new Date().toISOString(),
    ambiente: process.env.SRI_AMBIENTE
  };
}
  