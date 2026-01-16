const { loadEnv } = require('../src/config/env');
const { getFirestoreStatus } = require('../src/firestore/preflight');
const { createFirestoreClient } = require('../src/firestore/client');
const { createRepository } = require('../src/firestore/repository');

async function main() {
  let env;
  try {
    env = loadEnv();
  } catch (error) {
    console.error('[firestore.preflight] env error', { message: error.message });
    process.exit(2);
  }

  const status = getFirestoreStatus(env);
  if (!status.configured) {
    console.error('[firestore.preflight] not configured');
    process.exit(2);
  }

  const firestore = createFirestoreClient(env);
  const repository = createRepository(firestore);
  repository.collection('audit_logs');

  const start = Date.now();
  try {
    const collections = await firestore.listCollections();
    console.log('[firestore.preflight] ok', {
      projectId: env.GCP_PROJECT_ID,
      databaseId: env.FIRESTORE_DATABASE_ID,
      collectionCount: collections.length,
      elapsedMs: Date.now() - start
    });
  } catch (error) {
    console.error('[firestore.preflight] failed', {
      message: error.message,
      code: error.code || 'unknown'
    });
    process.exit(1);
  }
}

main();
