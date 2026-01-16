const { orderedPolicyInputs } = require('./input_normalizer');
const { buildPolicyTrace } = require('./policy_trace');
const { hasStopCategory } = require('./reason_code_classifier');
const { normalizeReasonCodes, UNKNOWN_REASON } = require('./reason_code_normalizer');
const { resolvePrimaryReason } = require('./primary_reason');

function resolveTemplateId(reasonCodes, primaryReason, reasonCodeIndex) {
  if (!reasonCodeIndex || typeof reasonCodeIndex !== 'object') {
    return null;
  }
  if (primaryReason && reasonCodeIndex[primaryReason] && reasonCodeIndex[primaryReason].templateId) {
    return reasonCodeIndex[primaryReason].templateId;
  }
  for (const code of reasonCodes) {
    const entry = reasonCodeIndex[code];
    if (entry && entry.templateId) {
      return entry.templateId;
    }
  }
  return null;
}

function enforceTemplateId(decision, reasonCodeIndex) {
  if (!decision || decision.result === 'ALLOW') {
    return decision;
  }
  const reasonCodes = Array.isArray(decision.reasonCodes) ? decision.reasonCodes : [];
  const expected = resolveTemplateId(reasonCodes, decision.primaryReason, reasonCodeIndex);
  if (!expected) {
    const error = new Error('[policy] templateId required for DENY/DEGRADED');
    error.code = 'POLICY_TEMPLATE_REQUIRED';
    throw error;
  }
  if (decision.templateId && decision.templateId !== expected) {
    const error = new Error('[policy] templateId mismatch with reasonCodeIndex');
    error.code = 'POLICY_TEMPLATE_MISMATCH';
    throw error;
  }
  return {
    ...decision,
    templateId: expected
  };
}

function buildFailSafeDecision(inputs, reasonCodeIndex) {
  const reasonCodes = normalizeReasonCodes([UNKNOWN_REASON], reasonCodeIndex);
  return {
    result: 'DENY',
    reasonCodes,
    primaryReason: resolvePrimaryReason(reasonCodes, reasonCodeIndex) || UNKNOWN_REASON,
    templateId: null,
    nextAction: {
      action: 'CREATE_INCIDENT',
      severity: 'high',
      targets: {},
      constraints: {
        requiresRole: [],
        requiresReason: true,
        auditRequired: true
      },
      links: {}
    },
    policyTrace: buildPolicyTrace(inputs)
  };
}

function applyPolicyStep(step, reasonCodeIndex) {
  if (!step || !step.value || typeof step.value !== 'object') {
    return null;
  }
  const candidate = step.value.__shortCircuitDecision;
  if (!candidate) {
    return null;
  }
  if (candidate.__shortCircuitStop !== true) {
    return null;
  }
  if (!Array.isArray(candidate.reasonCodes) || candidate.reasonCodes.length === 0) {
    return null;
  }
  if (candidate.reasonCodes.some((code) => !code || typeof code !== 'string')) {
    return null;
  }
  if (!hasStopCategory(candidate.reasonCodes, reasonCodeIndex)) {
    return null;
  }
  return candidate;
}

function evaluatePolicy(inputs, context = {}) {
  const steps = orderedPolicyInputs(inputs);
  for (const step of steps) {
    const decision = applyPolicyStep(step, context.reasonCodeIndex);
    if (decision) {
      const reasonCodes = normalizeReasonCodes(decision.reasonCodes, context.reasonCodeIndex);
      return enforceTemplateId({
        ...decision,
        reasonCodes,
        primaryReason: resolvePrimaryReason(reasonCodes, context.reasonCodeIndex)
      }, context.reasonCodeIndex);
    }
  }
  return enforceTemplateId(buildFailSafeDecision(inputs, context.reasonCodeIndex), context.reasonCodeIndex);
}

module.exports = { evaluatePolicy };
