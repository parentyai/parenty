const path = require('path');
const dotenv = require('dotenv');

function loadEnv() {
  if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  }

  const required = [
    'PORT',
    'ENV_NAME',
    'PUBLIC_BASE_URL',
    'LINE_CHANNEL_SECRET',
    'LINE_CHANNEL_ACCESS_TOKEN',
    'LINE_REPLY_CONTENT_ID'
  ];

  const missing = required.filter((key) => {
    const value = process.env[key];
    return !value || String(value).trim() === '';
  });

  if (missing.length) {
    const message = `[ENV] Missing required variables: ${missing.join(', ')}`;
    const error = new Error(message);
    error.missing = missing;
    throw error;
  }

  return {
    PORT: process.env.PORT,
    ENV_NAME: process.env.ENV_NAME,
    PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL,
    LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET,
    LINE_CHANNEL_ACCESS_TOKEN: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    LINE_REPLY_CONTENT_ID: process.env.LINE_REPLY_CONTENT_ID || '',
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID || '',
    FIRESTORE_DATABASE_ID: process.env.FIRESTORE_DATABASE_ID || '',
    FIRESTORE_LOCATION: process.env.FIRESTORE_LOCATION || '',
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    POLICY_REASON_CODE_INDEX_PATH: process.env.POLICY_REASON_CODE_INDEX_PATH || ''
  };
}

module.exports = { loadEnv };
