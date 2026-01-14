const { COLLECTIONS } = require('./collections');

const ALLOWED_COLLECTIONS = new Set([
  ...COLLECTIONS.UX,
  ...COLLECTIONS.ADMIN
]);

function assertAllowedCollection(name) {
  if (!ALLOWED_COLLECTIONS.has(name)) {
    const error = new Error(`[firestore] collection not allowed: ${name}`);
    error.code = 'FIRESTORE_COLLECTION_NOT_ALLOWED';
    throw error;
  }
}

function collectionRef(firestore, name) {
  assertAllowedCollection(name);
  return firestore.collection(name);
}

function docRef(firestore, name, docId) {
  assertAllowedCollection(name);
  return firestore.collection(name).doc(docId);
}

module.exports = { collectionRef, docRef, assertAllowedCollection };
