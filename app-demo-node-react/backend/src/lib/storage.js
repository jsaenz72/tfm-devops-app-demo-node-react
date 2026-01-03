const fs = require('fs-extra');
const path = require('node:path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

/**
 * Lee una lista desde un archivo JSON.
 * Siempre devuelve un array.
 */
async function readList(name) {
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
async function writeList(name, list) {
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
async function initFile(name) {
  const p = filePath(name);
  await fs.ensureDir(DATA_DIR);

  if (!(await fs.pathExists(p))) {
    await fs.writeJson(p, [], { spaces: 2 });
  }
}

module.exports = { readList, writeList, initFile };
