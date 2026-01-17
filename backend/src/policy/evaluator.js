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

function buildFailSafeDecision(inputs, reasonCodeIndex, traceOverrides = {}) {
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
    policyTrace: buildPolicyTrace(inputs, traceOverrides)
  };
}

function extractRawReasonCodes(stepValue) {
  if (!stepValue || typeof stepValue !== 'object') {
    return null;
  }
  const candidate = stepValue.__shortCircuitDecision;
  if (candidate && Array.isArray(candidate.reasonCodes)) {
    return candidate.reasonCodes;
  }
  if (Array.isArray(stepValue.reasonCodes)) {
    return stepValue.reasonCodes;
  }
  return null;
}

function normalizeStepReasonCodes(stepValue, reasonCodeIndex) {
  const raw = extractRawReasonCodes(stepValue);
  if (!raw || raw.length === 0) {
    return [];
  }
  return normalizeReasonCodes(raw, reasonCodeIndex);
}

function shouldShortCircuit(stepValue, reasonCodes, reasonCodeIndex) {
  if (!stepValue || typeof stepValue !== 'object') {
    return false;
  }
  const candidate = stepValue.__shortCircuitDecision;
  if (!candidate || candidate.__shortCircuitStop !== true) {
    return false;
  }
  if (!reasonCodes || reasonCodes.length === 0) {
    return false;
  }
  return hasStopCategory(reasonCodes, reasonCodeIndex);
}

function dedupeReasonCodes(reasonCodes) {
  const seen = new Set();
  const unique = [];
  for (const code of reasonCodes) {
    if (!code || typeof code !== 'string') {
      continue;
    }
    if (seen.has(code)) {
      continue;
    }
    seen.add(code);
    unique.push(code);
  }
  return unique;
}

function resolveDecisionResult(primaryReason, reasonCodeIndex) {
  if (!primaryReason || !reasonCodeIndex || typeof reasonCodeIndex !== 'object') {
    return 'DENY';
  }
  const entry = reasonCodeIndex[primaryReason];
  if (entry && entry.defaultResult) {
    return entry.defaultResult;
  }
  return 'DENY';
}

function buildDecision({ reasonCodes, inputs, context, traceOverrides, nextAction }) {
  const normalized = normalizeReasonCodes(reasonCodes, context.reasonCodeIndex);
  const unique = dedupeReasonCodes(normalized);
  const primaryReason = resolvePrimaryReason(unique, context.reasonCodeIndex) || UNKNOWN_REASON;
  const result = resolveDecisionResult(primaryReason, context.reasonCodeIndex);
  const decision = {
    result,
    reasonCodes: unique,
    primaryReason,
    templateId: null,
    nextAction: nextAction || null,
    policyTrace: buildPolicyTrace(inputs, traceOverrides)
  };
  return enforceTemplateId(decision, context.reasonCodeIndex);
}

function evaluatePolicy(inputs, context = {}) {
  const steps = orderedPolicyInputs(inputs);
  const reasonCodeIndex = context.reasonCodeIndex;
  const traceOverrides = {
    traceId: context.traceId,
    ruleVersion: context.ruleVersion,
    inputsDigest: context.inputsDigest,
    evaluatedAt: context.evaluatedAt
  };
  const collected = [];

  for (const step of steps) {
    const reasonCodes = normalizeStepReasonCodes(step.value, reasonCodeIndex);
    if (reasonCodes.length) {
      collected.push(...reasonCodes);
    }
    if (shouldShortCircuit(step.value, reasonCodes, reasonCodeIndex)) {
      return buildDecision({
        reasonCodes,
        inputs,
        context,
        traceOverrides,
        nextAction: step.value.__shortCircuitDecision && step.value.__shortCircuitDecision.nextAction
      });
    }
  }

  if (collected.length === 0) {
    return enforceTemplateId(
      buildFailSafeDecision(inputs, reasonCodeIndex, traceOverrides),
      reasonCodeIndex
    );
  }

  return buildDecision({
    reasonCodes: collected,
    inputs,
    context,
    traceOverrides
  });
}

module.exports = { evaluatePolicy };
