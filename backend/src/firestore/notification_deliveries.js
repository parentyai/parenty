const { createRepository } = require('./repository');
const { assertPolicyDecisionShape } = require('../policy/decision_shape');
const { assertNoRawText } = require('../logging/pii_guard');

function requireString(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    const error = new Error(`[notification_deliveries] ${fieldName} is required`);
    error.code = 'DELIVERY_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireValue(value, fieldName) {
  if (value === null || value === undefined) {
    const error = new Error(`[notification_deliveries] ${fieldName} is required`);
    error.code = 'DELIVERY_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireObject(value, fieldName) {
  if (!value || typeof value !== 'object') {
    const error = new Error(`[notification_deliveries] ${fieldName} is required`);
    error.code = 'DELIVERY_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function assertNotificationDeliveryShape(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('[notification_deliveries] payload is required');
    error.code = 'DELIVERY_INVALID_PAYLOAD';
    throw error;
  }

  assertNoRawText(payload, 'notification_deliveries');

  requireString(payload.householdId, 'householdId');
  requireString(payload.notificationId, 'notificationId');
  requireString(payload.dedupeKey, 'dedupeKey');
  requireString(payload.status, 'status');
  requireString(payload.contentId, 'contentId');
  requireString(payload.templateId, 'templateId');
  requireValue(payload.policyDecision, 'policyDecision');
  assertPolicyDecisionShape(payload.policyDecision);
  requireValue(payload.sentAt, 'sentAt');
  const trace = requireObject(payload.trace, 'trace');
  requireString(trace.runId, 'trace.runId');

  return payload;
}

function createNotificationDeliveryStore(db) {
  const repo = createRepository(db);

  async function createNotificationDelivery(payload) {
    return repo.addDoc('notification_deliveries', assertNotificationDeliveryShape(payload));
  }

  async function getNotificationDelivery(deliveryId) {
    return repo.getDocData('notification_deliveries', deliveryId);
  }

  return {
    createNotificationDelivery,
    getNotificationDelivery,
    assertNotificationDeliveryShape
  };
}

module.exports = { createNotificationDeliveryStore, assertNotificationDeliveryShape };
