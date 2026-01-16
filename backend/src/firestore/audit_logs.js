const { createRepository } = require('./repository');
const { assertNoRawText } = require('../logging/pii_guard');

function requireString(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    const error = new Error(`[audit_logs] ${fieldName} is required`);
    error.code = 'AUDIT_LOG_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireObject(value, fieldName) {
  if (!value || typeof value !== 'object') {
    const error = new Error(`[audit_logs] ${fieldName} is required`);
    error.code = 'AUDIT_LOG_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireValue(value, fieldName) {
  if (value === null || value === undefined) {
    const error = new Error(`[audit_logs] ${fieldName} is required`);
    error.code = 'AUDIT_LOG_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function assertAuditLogShape(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('[audit_logs] payload is required');
    error.code = 'AUDIT_LOG_INVALID_PAYLOAD';
    throw error;
  }

  assertNoRawText(payload, 'audit_logs');

  requireString(payload.actorType, 'actorType');
  requireString(payload.actorId, 'actorId');
  requireString(payload.action, 'action');
  requireString(payload.runbookLabel, 'runbookLabel');
  const target = requireObject(payload.target, 'target');
  requireString(target.kind, 'target.kind');
  requireValue(payload.createdAt, 'createdAt');

  return payload;
}

function createAuditLogStore(db) {
  const repo = createRepository(db);

  async function createAuditLog(payload) {
    return repo.addDoc('audit_logs', assertAuditLogShape(payload));
  }

  async function getAuditLog(auditId) {
    return repo.getDocData('audit_logs', auditId);
  }

  return {
    createAuditLog,
    getAuditLog,
    assertAuditLogShape
  };
}

module.exports = { createAuditLogStore, assertAuditLogShape };
