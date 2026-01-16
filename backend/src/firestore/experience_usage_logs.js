const { createRepository } = require('./repository');
const { assertNoRawText } = require('../logging/pii_guard');
const { assertPolicyDecisionShape } = require('../policy/decision_shape');

const ALLOWED_FEATURES = new Set(['faq', 'notification', 'scenario', 'roadmap']);

function requireString(value, fieldName) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    const error = new Error(`[experience_usage_logs] ${fieldName} is required`);
    error.code = 'EXPERIENCE_USAGE_LOG_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireValue(value, fieldName) {
  if (value === null || value === undefined) {
    const error = new Error(`[experience_usage_logs] ${fieldName} is required`);
    error.code = 'EXPERIENCE_USAGE_LOG_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireObject(value, fieldName) {
  if (!value || typeof value !== 'object') {
    const error = new Error(`[experience_usage_logs] ${fieldName} is required`);
    error.code = 'EXPERIENCE_USAGE_LOG_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireFeature(value) {
  requireString(value, 'feature');
  if (!ALLOWED_FEATURES.has(value)) {
    const error = new Error(`[experience_usage_logs] feature not allowed: ${value}`);
    error.code = 'EXPERIENCE_USAGE_LOG_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function assertFragmentIds(value) {
  if (value === undefined || value === null) {
    return value;
  }
  if (!Array.isArray(value)) {
    const error = new Error('[experience_usage_logs] fragmentIds must be an array');
    error.code = 'EXPERIENCE_USAGE_LOG_INVALID_PAYLOAD';
    throw error;
  }
  value.forEach((id, index) => {
    if (!id || typeof id !== 'string') {
      const error = new Error(`[experience_usage_logs] fragmentIds[${index}] must be a string`);
      error.code = 'EXPERIENCE_USAGE_LOG_INVALID_PAYLOAD';
      throw error;
    }
  });
  return value;
}

function assertExperienceUsageLogShape(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('[experience_usage_logs] payload is required');
    error.code = 'EXPERIENCE_USAGE_LOG_INVALID_PAYLOAD';
    throw error;
  }

  assertNoRawText(payload, 'experience_usage_logs');

  requireString(payload.usageId, 'usageId');
  requireString(payload.householdId, 'householdId');
  requireFeature(payload.feature);
  assertFragmentIds(payload.fragmentIds);
  const policyDecision = requireObject(payload.policyDecision, 'policyDecision');
  assertPolicyDecisionShape(policyDecision);
  requireObject(payload.policyTrace, 'policyTrace');
  requireValue(payload.createdAt, 'createdAt');

  return payload;
}

function createExperienceUsageLogStore(db) {
  const repo = createRepository(db);

  async function createExperienceUsageLog(payload) {
    return repo.addDoc('experience_usage_logs', assertExperienceUsageLogShape(payload));
  }

  async function getExperienceUsageLog(usageId) {
    return repo.getDocData('experience_usage_logs', usageId);
  }

  return {
    createExperienceUsageLog,
    getExperienceUsageLog,
    assertExperienceUsageLogShape
  };
}

module.exports = { createExperienceUsageLogStore, assertExperienceUsageLogShape };
