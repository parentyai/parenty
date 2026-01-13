function getFirestoreStatus(env) {
  const required = ['GCP_PROJECT_ID', 'FIRESTORE_DATABASE_ID'];
  if (env.ENV_NAME === 'local') {
    required.push('GOOGLE_APPLICATION_CREDENTIALS');
  }

  const configured = required.every((key) => {
    const value = env[key];
    return value && String(value).trim() !== '';
  });

  return {
    configured
  };
}

module.exports = { getFirestoreStatus };
