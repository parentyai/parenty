const fs = require('fs');
const path = require('path');
const { loadEnv } = require('../src/config/env');
const { createFirestoreClient } = require('../src/firestore/client');
const {
  createIncidentRecordStore,
  createAuditLogStore,
  createIncidentWithAudit
} = require('../src/firestore');

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function coerceTimestamp(value, fieldName) {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      const error = new Error(`[incident.audit] invalid ${fieldName}`);
      error.code = 'INCIDENT_AUDIT_INVALID_TIMESTAMP';
      throw error;
    }
    return parsed;
  }
  return value;
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('[incident.audit] usage: node tools/incident_with_audit.js <json>');
    process.exit(2);
  }

  let payload;
  try {
    payload = readJson(path.resolve(inputPath));
  } catch (error) {
    console.error('[incident.audit] invalid json', { message: error.message });
    process.exit(2);
  }

  if (!payload || typeof payload !== 'object') {
    console.error('[incident.audit] payload is required');
    process.exit(2);
  }

  const incidentRecord = payload.incidentRecord;
  const auditLog = payload.auditLog;
  if (!incidentRecord || !auditLog) {
    console.error('[incident.audit] incidentRecord and auditLog are required');
    process.exit(2);
  }

  incidentRecord.startedAt = coerceTimestamp(incidentRecord.startedAt, 'incidentRecord.startedAt');
  auditLog.createdAt = coerceTimestamp(auditLog.createdAt, 'auditLog.createdAt');

  let env;
  try {
    env = loadEnv();
  } catch (error) {
    console.error('[incident.audit] env error', { message: error.message });
    process.exit(2);
  }

  const firestore = createFirestoreClient(env);
  const incidentStore = createIncidentRecordStore(firestore);
  const auditStore = createAuditLogStore(firestore);

  try {
    const { incidentRef, auditRef } = await createIncidentWithAudit({
      auditStore,
      incidentStore,
      auditLog,
      incidentRecord
    });
    console.log('[incident.audit] ok', {
      incidentId: incidentRef.id,
      auditId: auditRef.id
    });
  } catch (error) {
    console.error('[incident.audit] failed', { message: error.message, code: error.code || 'unknown' });
    process.exit(1);
  }
}

main();
