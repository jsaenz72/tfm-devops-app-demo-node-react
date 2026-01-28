import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// __dirname no existe en ESM, lo reconstruimos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta de datos
const DATA_DIR = path.join(__dirname, '..', 'data');

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
    await fs.ensureDir(DATA_DIR);

    const exists = await fs.pathExists(p);
    if (!exists) {
      await fs.writeJson(p, [], { spaces: 2 });
      return [];
    }

    const data = await fs.readJson(p);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`[${new Date().toISOString()}] readList error en ${p}:`, err);
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
    await fs.ensureDir(DATA_DIR);
    await fs.writeJson(p, list, { spaces: 2 });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] writeList error en ${p}:`, err);
    throw err;
  }
}

/**
 * Inicializa un archivo vacío (opcional).
 */
export async function initFile(name) {
  const p = filePath(name);
  await fs.ensureDir(DATA_DIR);

  if (!(await fs.pathExists(p))) {
    await fs.writeJson(p, [], { spaces: 2 });
  }
}
