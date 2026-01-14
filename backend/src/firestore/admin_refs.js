const { collectionRef, docRef } = require('./refs');

function adminUsersCollection(db) {
  return collectionRef(db, 'admin_users');
}

function adminUserDoc(db, adminId) {
  return docRef(db, 'admin_users', adminId);
}

function templatesCollection(db) {
  return collectionRef(db, 'templates');
}

function templateDoc(db, templateId) {
  return docRef(db, 'templates', templateId);
}

function globalFlagsCollection(db) {
  return collectionRef(db, 'global_flags');
}

function globalFlagDoc(db, flagId) {
  return docRef(db, 'global_flags', flagId);
}

function dataRequestsCollection(db) {
  return collectionRef(db, 'data_requests');
}

function dataRequestDoc(db, requestId) {
  return docRef(db, 'data_requests', requestId);
}

function sourcesCollection(db) {
  return collectionRef(db, 'sources');
}

function sourceDoc(db, sourceId) {
  return docRef(db, 'sources', sourceId);
}

function experienceSourcesCollection(db) {
  return collectionRef(db, 'experience_sources');
}

function experienceSourceDoc(db, sourceId) {
  return docRef(db, 'experience_sources', sourceId);
}

function experienceFragmentsCollection(db) {
  return collectionRef(db, 'experience_fragments');
}

function experienceFragmentDoc(db, fragmentId) {
  return docRef(db, 'experience_fragments', fragmentId);
}

function experienceUsageLogsCollection(db) {
  return collectionRef(db, 'experience_usage_logs');
}

function experienceUsageLogDoc(db, usageId) {
  return docRef(db, 'experience_usage_logs', usageId);
}

function reviewSourcesCollection(db) {
  return collectionRef(db, 'review_sources');
}

function reviewSourceDoc(db, sourceId) {
  return docRef(db, 'review_sources', sourceId);
}

function reviewsCollection(db) {
  return collectionRef(db, 'reviews');
}

function reviewDoc(db, reviewId) {
  return docRef(db, 'reviews', reviewId);
}

function opsConfigsCollection(db) {
  return collectionRef(db, 'ops_configs');
}

function opsConfigDoc(db, configId) {
  return docRef(db, 'ops_configs', configId);
}

function auditLogsCollection(db) {
  return collectionRef(db, 'audit_logs');
}

function auditLogDoc(db, auditId) {
  return docRef(db, 'audit_logs', auditId);
}

function incidentRecordsCollection(db) {
  return collectionRef(db, 'incident_records');
}

function incidentRecordDoc(db, incidentId) {
  return docRef(db, 'incident_records', incidentId);
}

function adminViewsCollection(db) {
  return collectionRef(db, 'admin_views');
}

function adminViewDoc(db, viewId) {
  return docRef(db, 'admin_views', viewId);
}

module.exports = {
  adminUsersCollection,
  adminUserDoc,
  templatesCollection,
  templateDoc,
  globalFlagsCollection,
  globalFlagDoc,
  dataRequestsCollection,
  dataRequestDoc,
  sourcesCollection,
  sourceDoc,
  experienceSourcesCollection,
  experienceSourceDoc,
  experienceFragmentsCollection,
  experienceFragmentDoc,
  experienceUsageLogsCollection,
  experienceUsageLogDoc,
  reviewSourcesCollection,
  reviewSourceDoc,
  reviewsCollection,
  reviewDoc,
  opsConfigsCollection,
  opsConfigDoc,
  auditLogsCollection,
  auditLogDoc,
  incidentRecordsCollection,
  incidentRecordDoc,
  adminViewsCollection,
  adminViewDoc
};
