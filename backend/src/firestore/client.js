const { Firestore } = require('@google-cloud/firestore');
const { getFirestoreStatus } = require('./preflight');

function createFirestoreClient(env) {
  const status = getFirestoreStatus(env);
  if (!status.configured) {
    const error = new Error('[firestore] not configured');
    error.code = 'FIRESTORE_NOT_CONFIGURED';
    throw error;
  }

  return new Firestore({
    projectId: env.GCP_PROJECT_ID,
    databaseId: env.FIRESTORE_DATABASE_ID
  });
}

module.exports = { createFirestoreClient };
