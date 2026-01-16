const { assertAuditLogShape } = require('./audit_logs');
const { assertIncidentRecordShape } = require('./incident_records');

function requireStore(store, name, method) {
  if (!store || typeof store[method] !== 'function') {
    const error = new Error(`[firestore.ops] ${name}.${method} is required`);
    error.code = 'FIRESTORE_OPS_INVALID';
    throw error;
  }
}

async function createIncidentWithAudit({ auditStore, incidentStore, auditLog, incidentRecord }) {
  requireStore(auditStore, 'auditStore', 'createAuditLog');
  requireStore(incidentStore, 'incidentStore', 'createIncidentRecord');

  assertIncidentRecordShape(incidentRecord);
  assertAuditLogShape(auditLog);

  const incidentRef = await incidentStore.createIncidentRecord(incidentRecord);
  const auditRef = await auditStore.createAuditLog(auditLog);

  return { incidentRef, auditRef };
}

module.exports = { createIncidentWithAudit };
