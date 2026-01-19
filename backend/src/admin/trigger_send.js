const { runPolicy } = require('../policy');
const { sendLinePushWithPolicy } = require('../line/delivery');

const ADMIN_TRIGGER_TIMEOUT_MS = 12000;

function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error(`[admin.trigger] timeout after ${timeoutMs}ms`);
      error.code = 'ADMIN_TRIGGER_TIMEOUT';
      reject(error);
    }, timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function getTraceId(req) {
  const header = req && req.headers && req.headers['x-cloud-trace-context'];
  if (!header || typeof header !== 'string') {
    return undefined;
  }
  return header.split('/')[0];
}

function makeLogger({ traceId, startedAt }) {
  return (stage, detail) => {
    const payload = Object.assign({
      stage,
      traceId,
      elapsedMs: Date.now() - startedAt
    }, detail || {});
    console.log('[admin.trigger]', payload);
  };
}

function requireString(value, fieldName) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    const error = new Error(`[admin.trigger] ${fieldName} is required`);
    error.code = 'ADMIN_TRIGGER_INVALID';
    throw error;
  }
  return value;
}

function requireObject(value, fieldName) {
  if (!value || typeof value !== 'object') {
    const error = new Error(`[admin.trigger] ${fieldName} is required`);
    error.code = 'ADMIN_TRIGGER_INVALID';
    throw error;
  }
  return value;
}

function resolveTargetId(targetScope) {
  const scope = requireObject(targetScope, 'targetScope');
  if (typeof scope.userId === 'string' && scope.userId.trim()) {
    return scope.userId;
  }
  if (typeof scope.householdId === 'string' && scope.householdId.trim()) {
    return scope.householdId;
  }
  if (typeof scope.segmentId === 'string' && scope.segmentId.trim()) {
    const error = new Error('[admin.trigger] segmentId is not supported in Phase4.1');
    error.code = 'ADMIN_TRIGGER_UNSUPPORTED';
    throw error;
  }
  const error = new Error('[admin.trigger] targetScope must include userId or householdId');
  error.code = 'ADMIN_TRIGGER_INVALID';
  throw error;
}

function buildPolicyDecision(env, reasonCode) {
  return runPolicy({
    'context/ops': {
      feature: 'admin_trigger',
      channel: 'line',
      reasonCodes: [reasonCode]
    }
  }, {
    reasonCodeIndexPath: env.POLICY_REASON_CODE_INDEX_PATH
  });
}

async function handleAdminTriggerSend({ env, getStores, req, res }) {
  const payload = req.body || {};
  let contentId = null;
  let targetId = null;
  let auditStore = null;
  const traceId = getTraceId(req);
  const startedAt = Date.now();
  const log = makeLogger({ traceId, startedAt });
  try {
    log('start', { targetKeys: Object.keys(payload.targetScope || {}) });
    contentId = requireString(payload.contentId, 'contentId');
    targetId = resolveTargetId(payload.targetScope);
    const timeoutMs = Number.isFinite(Number(env.ADMIN_TRIGGER_TIMEOUT_MS))
      ? Number(env.ADMIN_TRIGGER_TIMEOUT_MS)
      : ADMIN_TRIGGER_TIMEOUT_MS;

    const output = await withTimeout((async () => {
      const stores = getStores();
      const { firestore, repo } = stores;
      auditStore = stores.auditStore;

      let templateId = contentId;
      let template = await repo.getDocData('templates', templateId);
      if (!template) {
        templateId = `tpl_${contentId}`;
        template = await repo.getDocData('templates', templateId);
      }

      const status = template && template.data ? template.data.status : null;
      const hasBody = template && template.data && typeof template.data.body === 'string';
      log('template.resolved', { contentId, templateId, status, hasBody });

      const reasonCode = status === 'active' && hasBody
        ? 'INSIGHT_PRESENTED'
        : 'CONTEXT_PROVIDER_OUTAGE';
      const decision = buildPolicyDecision(env, reasonCode);
      log('policy.resolved', { result: decision.result, reasonCodes: decision.reasonCodes });

      const sendStartedAt = Date.now();
      const result = await sendLinePushWithPolicy({
        targetId,
        contentId,
        templateIdOverride: templateId,
        policyDecision: decision,
        env,
        firestore
      });
      log('send.done', { durationMs: Date.now() - sendStartedAt, deliveryOk: result && result.ok });

      const now = new Date();
      await auditStore.createAuditLog({
        actorType: 'admin',
        actorId: req.auth.uid,
        action: 'ADMIN_TRIGGER_SEND',
        runbookLabel: 'phase4_1_trigger',
        target: {
          kind: 'content',
          id: contentId
        },
        reasonCodes: decision.reasonCodes,
        summary: payload.reason || 'admin trigger send',
        createdAt: now
      });

      return {
        result,
        decision,
        templateId
      };
    })(), timeoutMs);

    log('done', { contentId, templateId: output.templateId, decisionResult: output.decision.result });
    return res.status(200).json({
      ok: true,
      contentId,
      targetId,
      decision: output.decision,
      delivery: output.result
    });
  } catch (error) {
    if (error && error.code === 'ADMIN_TRIGGER_TIMEOUT') {
      log('timeout', { message: error.message });
      return res.status(504).json({ ok: false, error: 'timeout' });
    }
    if (error && (error.code === 'ADMIN_TRIGGER_INVALID' || error.code === 'ADMIN_TRIGGER_UNSUPPORTED')) {
      return res.status(400).json({ ok: false, error: error.message });
    }
    if (error && error.code === 'POLICY_TEMPLATE_REQUIRED') {
      return res.status(409).json({ ok: false, error: 'template required for policy decision' });
    }
    if (auditStore && contentId) {
      try {
        await auditStore.createAuditLog({
          actorType: 'admin',
          actorId: req.auth.uid,
          action: 'ADMIN_TRIGGER_SEND_FAILED',
          runbookLabel: 'phase4_1_trigger',
          target: {
            kind: 'content',
            id: contentId
          },
          summary: payload.reason || 'admin trigger failed',
          createdAt: new Date()
        });
      } catch (logError) {
        console.error('[admin.trigger] audit log error', { message: logError.message });
      }
    }
    console.error('[admin.trigger] error', { message: error.message, code: error.code });
    return res.status(500).json({ ok: false, error: 'internal error' });
  }
}

module.exports = { handleAdminTriggerSend };
