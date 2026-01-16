const { createFirestoreClient } = require('./client');
const { getFirestoreStatus } = require('./preflight');
const { COLLECTIONS } = require('./collections');
const { collectionRef, docRef, assertAllowedCollection } = require('./refs');
const { createRepository } = require('./repository');
const { createAuditLogStore } = require('./audit_logs');
const { createFaqLogStore } = require('./faq_logs');
const { createNotificationStore } = require('./notifications');
const { createNotificationDeliveryStore } = require('./notification_deliveries');
const { createIncidentRecordStore } = require('./incident_records');
const { createExperienceUsageLogStore } = require('./experience_usage_logs');
const { createReviewUsageLogStore } = require('./review_usage_logs');
const { createInsightReactionStore } = require('./insight_reactions');
const { createIncidentWithAudit } = require('./system_ops');
const uxRefs = require('./ux_refs');
const adminRefs = require('./admin_refs');

module.exports = {
  createFirestoreClient,
  getFirestoreStatus,
  COLLECTIONS,
  collectionRef,
  docRef,
  assertAllowedCollection,
  createRepository,
  createAuditLogStore,
  createFaqLogStore,
  createNotificationStore,
  createNotificationDeliveryStore,
  createIncidentRecordStore,
  createExperienceUsageLogStore,
  createReviewUsageLogStore,
  createInsightReactionStore,
  createIncidentWithAudit,
  uxRefs,
  adminRefs
};
