const { createRepository } = require('./repository');
const { assertPolicyDecisionShape } = require('../policy/decision_shape');
const { assertNoRawText } = require('../logging/pii_guard');

function requireString(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    const error = new Error(`[notifications] ${fieldName} is required`);
    error.code = 'NOTIFICATION_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireValue(value, fieldName) {
  if (value === null || value === undefined) {
    const error = new Error(`[notifications] ${fieldName} is required`);
    error.code = 'NOTIFICATION_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function assertNotificationShape(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('[notifications] payload is required');
    error.code = 'NOTIFICATION_INVALID_PAYLOAD';
    throw error;
  }

  assertNoRawText(payload, 'notifications');

  requireString(payload.householdId, 'householdId');
  requireString(payload.type, 'type');
  requireString(payload.templateId, 'templateId');
  requireString(payload.status, 'status');
  requireValue(payload.policyDecision, 'policyDecision');
  assertPolicyDecisionShape(payload.policyDecision);

  return payload;
}

function createNotificationStore(db) {
  const repo = createRepository(db);

  async function createNotification(payload) {
    return repo.addDoc('notifications', assertNotificationShape(payload));
  }

  async function getNotification(notificationId) {
    return repo.getDocData('notifications', notificationId);
  }

  return {
    createNotification,
    getNotification,
    assertNotificationShape
  };
}

module.exports = { createNotificationStore, assertNotificationShape };
