const { NEXT_ACTION_BY_REASON, CATEGORY_FALLBACK } = require('./next_action_map');

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
const ROLE_EXPANSION = {
  viewer: ['viewer', 'editor', 'operator', 'admin'],
  editor: ['editor', 'admin'],
  operator: ['operator', 'admin'],
  admin: ['admin']
};

function normalizeRunbookLabel(label) {
  if (!label || typeof label !== 'string') {
    return null;
  }
  return label.replace(/^\[/, '').replace(/\]$/, '').trim();
}

function resolvePrimaryReason(primaryReason, reasonCodes) {
  if (typeof primaryReason === 'string' && primaryReason.trim() !== '') {
    return primaryReason;
  }
  if (Array.isArray(reasonCodes)) {
    const fallback = reasonCodes.find((code) => typeof code === 'string' && code.trim() !== '');
    if (fallback) {
      return fallback;
    }
  }
  return null;
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

function inferCategory(primaryReason) {
  if (!primaryReason || typeof primaryReason !== 'string') {
    return null;
  }
  if (primaryReason.startsWith('GLOBAL_STOP_') || primaryReason.startsWith('FEATURE_DISABLED_') || primaryReason.startsWith('HOUSEHOLD_STOP_')) {
    return 'STOP';
  }
  if (primaryReason.startsWith('INCIDENT_')) {
    return 'INCIDENT';
  }
  if (primaryReason.startsWith('SYSTEM_') || primaryReason.startsWith('INTERNAL_')) {
    return 'SYSTEM';
  }
  if (primaryReason.startsWith('RISK_') || primaryReason.startsWith('LLM_')) {
    return 'RISK';
  }
  if (primaryReason.startsWith('REVIEW_SOURCE_')) {
    return 'REVIEW_SOURCE';
  }
  if (primaryReason.startsWith('EXPERIENCE_SOURCE_')) {
    return 'EXPERIENCE_SOURCE';
  }
  if (primaryReason.startsWith('SOURCE_') || primaryReason.startsWith('RISK_SOURCE_')) {
    return 'SOURCE';
  }
  if (primaryReason.startsWith('CONSENT_')) {
    return 'CONSENT';
  }
  if (primaryReason.startsWith('PLAN_')) {
    return 'PLAN';
  }
  if (primaryReason.startsWith('CONTEXT_')) {
    return 'CONTEXT';
  }
  if (primaryReason.startsWith('VENDOR_')) {
    return 'VENDOR';
  }
  return null;
}

function resolveMapping(primaryReason) {
  if (!primaryReason) {
    return null;
  }
  const direct = NEXT_ACTION_BY_REASON[primaryReason];
  if (direct) {
    return direct;
  }
  const category = inferCategory(primaryReason);
  if (category && CATEGORY_FALLBACK[category]) {
    const fallback = NEXT_ACTION_BY_REASON[CATEGORY_FALLBACK[category]];
    if (fallback) {
      return fallback;
    }
  }
  return NEXT_ACTION_BY_REASON.UNKNOWN_REASON || null;
}

function resolveRequiresRole(role) {
  if (!role) {
    return [];
  }
  return ROLE_EXPANSION[role] || [role];
}

function buildNextActionFromReason({ primaryReason, reasonCodes, runbookLabel, targets, links, severity } = {}) {
  const resolvedPrimaryReason = resolvePrimaryReason(primaryReason, reasonCodes);
  if (!resolvedPrimaryReason) {
    return buildNextActionNone({ runbookLabel, targets, links, severity });
  }
  const mapping = resolveNextActionMapping(resolvedPrimaryReason);
  const runbook = normalizeRunbookLabel(runbookLabel || (mapping && mapping.runbookLabel)) || DEFAULT_RUNBOOK;
  const codes = normalizeReasonCodes(reasonCodes, resolvedPrimaryReason);
  const constraints = {
    requiresRole: resolveRequiresRole(mapping && mapping.requiresRole),
    requiresReason: Boolean(mapping && mapping.requiresReason),
    auditRequired: Boolean(mapping && mapping.auditRequired),
    cooldownSeconds: 0
  };

  return {
    action: mapping && mapping.action ? mapping.action : 'CREATE_INCIDENT',
    runbook,
    uiLabel: `[${runbook}]`,
    severity: severity || 'low',
    primaryReason: resolvedPrimaryReason,
    reasonCodes: codes,
    targets: { ...DEFAULT_TARGETS, ...(targets || {}) },
    constraints,
    links: { ...DEFAULT_LINKS, ...(links || {}) }
  };
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
      requiresRole: resolveRequiresRole('viewer'),
      requiresReason: false,
      auditRequired: false,
      cooldownSeconds: 0
    },
    links: { ...DEFAULT_LINKS, ...(links || {}) }
  };
}

function resolveNextActionMapping(primaryReason) {
  return resolveMapping(primaryReason);
}

module.exports = {
  buildNextActionFromReason,
  buildNextActionNone
};
