const express = require('express');
const { createFirestoreClient } = require('../firestore/client');
const { createRepository } = require('../firestore/repository');
const { createAuditLogStore } = require('../firestore/audit_logs');
const { createIncidentRecordStore } = require('../firestore/incident_records');
const { createIncidentWithAudit } = require('../firestore/system_ops');
const { buildNextActionNone } = require('./next_action');

function createAdminRouter({ env, requireAdmin }) {
  const router = express.Router();

  let repo = null;
  let auditStore = null;
  let incidentStore = null;

  function getStores() {
    if (!repo || !auditStore || !incidentStore) {
      const firestore = createFirestoreClient(env);
      repo = createRepository(firestore);
      auditStore = createAuditLogStore(firestore);
      incidentStore = createIncidentRecordStore(firestore);
    }
    return { repo, auditStore, incidentStore };
  }

  function handleError(res, error) {
    if (error && error.code === 'FIRESTORE_NOT_CONFIGURED') {
      return res.status(503).json({ ok: false, error: 'firestore not configured' });
    }
    if (error && (error.code === 'AUDIT_LOG_INVALID_PAYLOAD' || error.code === 'INCIDENT_INVALID_PAYLOAD')) {
      return res.status(400).json({ ok: false, error: 'invalid payload' });
    }
    console.error('[admin] error', { message: error.message, code: error.code });
    return res.status(500).json({ ok: false, error: 'internal error' });
  }

  router.use(requireAdmin);

  router.get('/views/:viewId', async (req, res) => {
    const { viewId } = req.params;
    try {
      const { repo: repoStore } = getStores();
      const snapshot = await repoStore.getDocData('admin_views', viewId);
      const data = snapshot ? snapshot.data : null;
      const nextAction = data && data.nextAction
        ? data.nextAction
        : buildNextActionNone({
            primaryReason: data && data.primaryReason,
            reasonCodes: data && data.reasonCodes
          });
      return res.status(200).json({ ok: true, viewId, data, nextAction });
    } catch (error) {
      return handleError(res, error);
    }
  });

  router.post('/audit-logs', async (req, res) => {
    const payload = req.body || {};
    try {
      const { auditStore: store } = getStores();
      const now = new Date();
      const auditLog = {
        ...payload,
        actorType: 'admin',
        actorId: req.auth.uid,
        createdAt: payload.createdAt || now
      };
      const ref = await store.createAuditLog(auditLog);
      const nextAction = buildNextActionNone({
        primaryReason: payload.primaryReason,
        reasonCodes: payload.reasonCodes,
        runbookLabel: payload.runbookLabel
      });
      return res.status(201).json({ ok: true, auditId: ref.id, nextAction });
    } catch (error) {
      return handleError(res, error);
    }
  });

  router.post('/incidents', async (req, res) => {
    const payload = req.body || {};
    const incidentRecord = payload.incident || {};
    try {
      const { auditStore: store, incidentStore: incidents } = getStores();
      const now = new Date();
      const auditLog = {
        actorType: 'admin',
        actorId: req.auth.uid,
        action: payload.action || 'CREATE_INCIDENT',
        runbookLabel: incidentRecord.runbookLabel,
        target: {
          kind: 'incident',
          id: incidentRecord.incidentId
        },
        reasonCodes: incidentRecord.triggerReasonCode
          ? [incidentRecord.triggerReasonCode]
          : undefined,
        summary: incidentRecord.summary,
        createdAt: now
      };

      const result = await createIncidentWithAudit({
        auditStore: store,
        incidentStore: incidents,
        auditLog,
        incidentRecord: {
          ...incidentRecord,
          startedAt: incidentRecord.startedAt || now
        }
      });

      const nextAction = buildNextActionNone({
        primaryReason: incidentRecord.triggerReasonCode,
        reasonCodes: incidentRecord.triggerReasonCode ? [incidentRecord.triggerReasonCode] : undefined,
        runbookLabel: incidentRecord.runbookLabel
      });

      return res.status(201).json({
        ok: true,
        incidentId: incidentRecord.incidentId,
        auditId: result.auditRef.id,
        nextAction
      });
    } catch (error) {
      return handleError(res, error);
    }
  });

  return router;
}

module.exports = { createAdminRouter };
