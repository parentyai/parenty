const admin = require('firebase-admin');

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
  return auth.verifyIdToken(token);
}

module.exports = { getAuth, verifyIdToken };
