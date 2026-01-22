const { createRepository } = require('../firestore/repository');

const CAPTURE_COLLECTION = 'debug_line_users';
const CAPTURE_DOC_ID = 'capture_once';

function isCaptureEnabled(env) {
  return env && (env.CAPTURE_LINE_USERID_ONCE === '1' || env.CAPTURE_LINE_USERID_ONCE === 'true');
}

function extractLineUserId(events) {
  if (!Array.isArray(events)) {
    return null;
  }
  for (const event of events) {
    const userId = event && event.source && event.source.userId;
    if (typeof userId === 'string' && userId.startsWith('U')) {
      return userId;
    }
  }
  return null;
}

async function captureLineUserIdOnce({ env, firestore, events }) {
  if (!isCaptureEnabled(env) || !firestore) {
    return false;
  }
  const lineUserId = extractLineUserId(events);
  if (!lineUserId) {
    return false;
  }

  const repo = createRepository(firestore);
  const existing = await repo.getDocData(CAPTURE_COLLECTION, CAPTURE_DOC_ID);
  if (existing && existing.data && existing.data.lineUserId) {
    return false;
  }

  await repo.setDoc(CAPTURE_COLLECTION, CAPTURE_DOC_ID, {
    lineUserId,
    capturedAt: new Date(),
    note: 'one-shot capture for ops',
    envName: env.ENV_NAME || null
  }, { merge: true });

  console.log('[line.capture] stored userId (one-shot)');
  return true;
}

module.exports = { captureLineUserIdOnce };
