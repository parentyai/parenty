const DEFAULT_PRIMARY_REASON = 'CONTEXT_DEDUPE_SUPPRESSED';
const DEFAULT_RUNBOOK = '7-1-0';
const DEFAULT_LINKS = {
  uiPath: '/admin/...',
  api: '/admin/v1/...'
};
const DEFAULT_TARGETS = {
  householdId: null,
  guardianId: null,
  notificationId: null,
  runId: null,
  templateId: null,
  sourceId: null,
  scenarioId: null,
  stepId: null,
  faqId: null,
  policyId: null,
  auditId: null,
  dataRequestId: null,
  featureKey: null,
  incidentId: null
};
function normalizeRunbookLabel(label) {
  if (!label || typeof label !== 'string') {
    return null;
  }
  return label.replace(/^\[/, '').replace(/\]$/, '').trim();
}

function normalizeReasonCodes(reasonCodes, primaryReason) {
  const codes = Array.isArray(reasonCodes)
    ? reasonCodes.filter((code) => typeof code === 'string' && code.trim() !== '')
    : [];
  if (primaryReason && !codes.includes(primaryReason)) {
    codes.unshift(primaryReason);
  }
  return codes.length > 0 ? codes : primaryReason ? [primaryReason] : [];
}

function buildNextActionNone({ primaryReason, reasonCodes, runbookLabel, targets, links, severity } = {}) {
  const reason = primaryReason || DEFAULT_PRIMARY_REASON;
  const codes = normalizeReasonCodes(reasonCodes, reason);
  const runbook = normalizeRunbookLabel(runbookLabel) || DEFAULT_RUNBOOK;

  return {
    action: 'NONE',
    runbook,
    uiLabel: `[${runbook}]`,
    severity: severity || 'low',
    primaryReason: reason,
    reasonCodes: codes,
    targets: { ...DEFAULT_TARGETS, ...(targets || {}) },
    constraints: {
      requiresRole: ['viewer', 'editor', 'operator', 'admin'],
      requiresReason: false,
      auditRequired: false
    },
    links: { ...DEFAULT_LINKS, ...(links || {}) }
  };
}

module.exports = {
  buildNextActionNone
};
