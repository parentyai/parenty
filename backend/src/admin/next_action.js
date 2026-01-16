const DEFAULT_PRIMARY_REASON = 'CONTEXT_DEDUPE_SUPPRESSED';
const DEFAULT_RUNBOOK = '7-1-0';

function normalizeRunbookLabel(label) {
  if (!label || typeof label !== 'string') {
    return null;
  }
  return label.replace(/^\[/, '').replace(/\]$/, '').trim();
}

function buildNextActionNone({ primaryReason, reasonCodes, runbookLabel } = {}) {
  const reason = primaryReason || DEFAULT_PRIMARY_REASON;
  const codes = Array.isArray(reasonCodes) && reasonCodes.length > 0 ? reasonCodes : [reason];
  const runbook = normalizeRunbookLabel(runbookLabel) || DEFAULT_RUNBOOK;

  return {
    action: 'NONE',
    runbook,
    uiLabel: `[${runbook}]`,
    severity: 'low',
    primaryReason: reason,
    reasonCodes: codes,
    targets: {
      householdId: null,
      templateId: null,
      notificationId: null,
      incidentId: null,
      runId: null
    },
    constraints: {
      requiresRole: [],
      requiresReason: false,
      auditRequired: false,
      cooldownSeconds: 0
    },
    links: {
      uiPath: null,
      api: null
    }
  };
}

module.exports = { buildNextActionNone };
