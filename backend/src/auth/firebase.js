const admin = require('firebase-admin');

const DEFAULT_VERIFY_TIMEOUT_MS = 8000;

function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error('[auth] verifyIdToken timeout');
      error.code = 'AUTH_VERIFY_TIMEOUT';
      reject(error);
    }, timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function getAuth(env) {
  if (!admin.apps.length) {
    const options = {};
    if (env && env.GCP_PROJECT_ID) {
      options.projectId = env.GCP_PROJECT_ID;
    }
    admin.initializeApp(options);
  }

  return admin.auth();
}

async function verifyIdToken(env, token) {
  const auth = getAuth(env);
  const timeoutMs = Number.isFinite(Number(env && env.AUTH_VERIFY_TIMEOUT_MS))
    ? Number(env.AUTH_VERIFY_TIMEOUT_MS)
    : DEFAULT_VERIFY_TIMEOUT_MS;
  return withTimeout(auth.verifyIdToken(token), timeoutMs);
}

module.exports = { getAuth, verifyIdToken };
