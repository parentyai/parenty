const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');
const path = require('path');

function normalize(index) {
  const fields = index.fields.filter((field) => field.fieldPath !== '__name__');
  return {
    collectionGroup: index.collectionGroup,
    queryScope: index.queryScope,
    fields
  };
}

function serialize(item) {
  return JSON.stringify(item);
}

function resolveIndexesPath() {
  const candidates = [
    path.resolve(process.cwd(), 'firestore.indexes.json'),
    path.resolve(process.cwd(), '..', 'firestore.indexes.json')
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  const error = new Error('[firestore.index.audit] firestore.indexes.json not found');
  error.code = 'FIRESTORE_INDEXES_NOT_FOUND';
  throw error;
}

function loadLocalIndexes() {
  const raw = readFileSync(resolveIndexesPath(), 'utf8');
  const data = JSON.parse(raw);
  return data.indexes.map(normalize);
}

function loadRemoteIndexes() {
  const raw = execSync('firebase firestore:indexes', { encoding: 'utf8' });
  const data = JSON.parse(raw);
  return data.indexes.map(normalize);
}

function diffIndexes(local, remote) {
  const remoteSet = new Set(remote.map(serialize));
  const localSet = new Set(local.map(serialize));

  const missing = local.filter((item) => !remoteSet.has(serialize(item)));
  const extra = remote.filter((item) => !localSet.has(serialize(item)));

  return { missing, extra };
}

function main() {
  const local = loadLocalIndexes();
  const remote = loadRemoteIndexes();
  const { missing, extra } = diffIndexes(local, remote);

  if (!missing.length && !extra.length) {
    console.log('[firestore.index.audit] ok');
    return;
  }

  if (missing.length) {
    console.error('[firestore.index.audit] missing', JSON.stringify(missing, null, 2));
  }
  if (extra.length) {
    console.error('[firestore.index.audit] extra', JSON.stringify(extra, null, 2));
  }
  process.exit(1);
}

main();
