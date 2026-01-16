const { createRepository } = require('./repository');
const { assertNoRawText } = require('../logging/pii_guard');
const { assertPolicyDecisionShape } = require('../policy/decision_shape');

const ALLOWED_FEATURES = new Set(['faq', 'notification', 'scenario', 'roadmap']);
const ALLOWED_INSIGHT_KINDS = new Set([
  'CAUTION',
  'MISUNDERSTANDING_GUARD',
  'DECISION_SUPPORT'
]);
const ALLOWED_USER_ACTIONS = new Set([
  'DISMISSED',
  'ACKNOWLEDGED',
  'OPENED_MORE_INFO',
  'OPENED_SETTINGS',
  'ASKED_FOLLOWUP'
]);
const FORBIDDEN_FIELDS = ['vendorId', 'businessId', 'rating'];

function requireString(value, fieldName) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    const error = new Error(`[insight_reactions] ${fieldName} is required`);
    error.code = 'INSIGHT_REACTION_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireValue(value, fieldName) {
  if (value === null || value === undefined) {
    const error = new Error(`[insight_reactions] ${fieldName} is required`);
    error.code = 'INSIGHT_REACTION_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireObject(value, fieldName) {
  if (!value || typeof value !== 'object') {
    const error = new Error(`[insight_reactions] ${fieldName} is required`);
    error.code = 'INSIGHT_REACTION_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireEnum(value, allowed, fieldName) {
  requireString(value, fieldName);
  if (!allowed.has(value)) {
    const error = new Error(`[insight_reactions] ${fieldName} not allowed: ${value}`);
    error.code = 'INSIGHT_REACTION_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireFeature(value) {
  return requireEnum(value, ALLOWED_FEATURES, 'feature');
}

function assertNoForbiddenFields(payload) {
  for (const field of FORBIDDEN_FIELDS) {
    if (payload[field] !== undefined) {
      const error = new Error(`[insight_reactions] ${field} is forbidden`);
      error.code = 'INSIGHT_REACTION_INVALID_PAYLOAD';
      throw error;
    }
  }
}

function assertFlowChanged(value) {
  if (value === undefined || value === null) {
    return value;
  }
  if (typeof value !== 'boolean') {
    const error = new Error('[insight_reactions] flowChanged must be a boolean');
    error.code = 'INSIGHT_REACTION_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function assertInsightReactionShape(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('[insight_reactions] payload is required');
    error.code = 'INSIGHT_REACTION_INVALID_PAYLOAD';
    throw error;
  }

  assertNoRawText(payload, 'insight_reactions');
  assertNoForbiddenFields(payload);

  requireString(payload.reactionId, 'reactionId');
  requireString(payload.householdId, 'householdId');
  requireFeature(payload.feature);
  requireEnum(payload.insightKind, ALLOWED_INSIGHT_KINDS, 'insightKind');
  requireEnum(payload.userAction, ALLOWED_USER_ACTIONS, 'userAction');
  assertFlowChanged(payload.flowChanged);
  const policyDecision = requireObject(payload.policyDecision, 'policyDecision');
  assertPolicyDecisionShape(policyDecision);
  requireObject(payload.policyTrace, 'policyTrace');
  requireValue(payload.createdAt, 'createdAt');

  return payload;
}

function createInsightReactionStore(db) {
  const repo = createRepository(db);

  async function createInsightReaction(payload) {
    return repo.addDoc('insight_reactions', assertInsightReactionShape(payload));
  }

  async function getInsightReaction(reactionId) {
    return repo.getDocData('insight_reactions', reactionId);
  }

  return {
    createInsightReaction,
    getInsightReaction,
    assertInsightReactionShape
  };
}

module.exports = { createInsightReactionStore, assertInsightReactionShape };
