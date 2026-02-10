import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// __dirname no existe en ESM, lo reconstruimos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta de datos - usa variable de entorno para Kubernetes
// En desarrollo: usa carpeta local 'data'
// En producción/K8s: usa volumen montado en /app/data
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

// Si estamos en modo test, usar sufijo ".test.json"
function filePath(name) {
  const suffix = process.env.NODE_ENV === 'test' ? '.test.json' : '.json';
  return path.join(DATA_DIR, `${name}${suffix}`);
}

/**
 * Lee una lista desde un archivo JSON.
 * Siempre devuelve un array.
 */
export async function readList(name) {
  const p = filePath(name);

  try {
    // Asegurar que el directorio existe (importante en K8s)
    await fs.ensureDir(DATA_DIR);

    const exists = await fs.pathExists(p);
    if (!exists) {
      await fs.writeJson(p, [], { spaces: 2 });
      console.log(`[${new Date().toISOString()}] Archivo creado: ${p}`);
      return [];
    }

    const data = await fs.readJson(p);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`[${new Date().toISOString()}] readList error en ${p}:`, err);
    // En K8s, si hay error de permisos o volumen, es crítico
    if (err.code === 'EACCES' || err.code === 'EROFS') {
      console.error('ERROR CRÍTICO: Problemas de permisos en volumen persistente');
    }
    return [];
  }
}

/**
 * Escribe una lista en un archivo JSON.
 * Reemplaza completamente el contenido.
 */
export async function writeList(name, list) {
  if (!Array.isArray(list)) {
    throw new TypeError(`writeList: se esperaba un array, recibido ${typeof list}`);
  }

  const p = filePath(name);

  try {
    // Asegurar que el directorio existe
    await fs.ensureDir(DATA_DIR);
    
    // Escribir de forma atómica para evitar corrupción
    await fs.writeJson(p, list, { spaces: 2 });
    
    console.log(`[${new Date().toISOString()}] Datos guardados en: ${p}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] writeList error en ${p}:`, err);
    
    // Diagnóstico adicional para K8s
    if (err.code === 'EACCES') {
      console.error('ERROR: Sin permisos de escritura. Verifica el usuario y permisos del volumen.');
    } else if (err.code === 'EROFS') {
      console.error('ERROR: Sistema de archivos de solo lectura. Verifica el PVC.');
    } else if (err.code === 'ENOSPC') {
      console.error('ERROR: Sin espacio en disco. Aumenta el tamaño del PVC.');
    }
    
    throw err;
  }
}

/**
 * Inicializa un archivo vacío (opcional).
 */
export async function initFile(name) {
  const p = filePath(name);
  
  try {
    await fs.ensureDir(DATA_DIR);

    if (!(await fs.pathExists(p))) {
      await fs.writeJson(p, [], { spaces: 2 });
      console.log(`[${new Date().toISOString()}] Archivo inicializado: ${p}`);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] initFile error:`, err);
    throw err;
  }
}

/**
 * Verifica que el directorio de datos es escribible (útil para healthcheck)
 */
export async function checkDataDirWritable() {
  try {
    await fs.ensureDir(DATA_DIR);
    const testFile = path.join(DATA_DIR, '.write-test');
    await fs.writeFile(testFile, 'test');
    await fs.remove(testFile);
    return true;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] DATA_DIR no es escribible:`, err);
    return false;
  }
}

// Log al inicio para confirmar dónde se guardan los datos
console.log(`[${new Date().toISOString()}] DATA_DIR configurado en: ${DATA_DIR}`);
console.log(`[${new Date().toISOString()}] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);