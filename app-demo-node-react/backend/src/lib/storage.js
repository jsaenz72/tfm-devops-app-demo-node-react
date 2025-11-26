const fs = require('fs-extra');
const path = require('path');

function filePath(name) {
  return path.join(__dirname, '..', 'data', name + '.json');
}

async function readList(name) {
  const p = filePath(name);
  try {
    const exists = await fs.pathExists(p);
    if (!exists) return [];
    const txt = await fs.readFile(p, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (err) {
    console.error('readList error', err);
    return [];
  }
}

async function writeList(name, list) {
  const p = filePath(name);
  await fs.ensureDir(path.dirname(p));
  await fs.writeFile(p, JSON.stringify(list, null, 2), 'utf8');
}

module.exports = { readList, writeList };
