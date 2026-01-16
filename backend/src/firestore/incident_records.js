const { createRepository } = require('./repository');
const { assertNoRawText } = require('../logging/pii_guard');

function requireString(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    const error = new Error(`[incident_records] ${fieldName} is required`);
    error.code = 'INCIDENT_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireValue(value, fieldName) {
  if (value === null || value === undefined) {
    const error = new Error(`[incident_records] ${fieldName} is required`);
    error.code = 'INCIDENT_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function assertIncidentRecordShape(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('[incident_records] payload is required');
    error.code = 'INCIDENT_INVALID_PAYLOAD';
    throw error;
  }

  assertNoRawText(payload, 'incident_records');

  requireString(payload.incidentId, 'incidentId');
  requireString(payload.severity, 'severity');
  requireString(payload.triggerReasonCode, 'triggerReasonCode');
  requireString(payload.summary, 'summary');
  requireString(payload.runbookLabel, 'runbookLabel');
  requireValue(payload.startedAt, 'startedAt');

  return payload;
}

function createIncidentRecordStore(db) {
  const repo = createRepository(db);

  async function createIncidentRecord(payload) {
    return repo.addDoc('incident_records', assertIncidentRecordShape(payload));
  }

  async function getIncidentRecord(incidentId) {
    return repo.getDocData('incident_records', incidentId);
  }

  return {
    createIncidentRecord,
    getIncidentRecord,
    assertIncidentRecordShape
  };
}

module.exports = { createIncidentRecordStore, assertIncidentRecordShape };
