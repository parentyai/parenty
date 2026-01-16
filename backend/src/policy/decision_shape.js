const ALLOWED_RESULTS = new Set(['ALLOW', 'DEGRADED', 'DENY']);

function assertArray(value, name) {
  if (!Array.isArray(value)) {
    const error = new Error(`[policy] ${name} must be an array`);
    error.code = 'POLICY_DECISION_INVALID';
    throw error;
  }
}

function assertNonEmptyString(value, name) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    const error = new Error(`[policy] ${name} must be a non-empty string`);
    error.code = 'POLICY_DECISION_INVALID';
    throw error;
  }
}

function assertPolicyDecisionShape(decision) {
  if (!decision || typeof decision !== 'object') {
    const error = new Error('[policy] decision must be an object');
    error.code = 'POLICY_DECISION_INVALID';
    throw error;
  }

  assertNonEmptyString(decision.result, 'result');
  if (!ALLOWED_RESULTS.has(decision.result)) {
    const error = new Error(`[policy] result not allowed: ${decision.result}`);
    error.code = 'POLICY_DECISION_INVALID';
    throw error;
  }

  assertArray(decision.reasonCodes, 'reasonCodes');
  if (decision.reasonCodes.length === 0) {
    const error = new Error('[policy] reasonCodes must include at least one item');
    error.code = 'POLICY_DECISION_INVALID';
    throw error;
  }
  decision.reasonCodes.forEach((code, index) => {
    assertNonEmptyString(code, `reasonCodes[${index}]`);
  });

  assertNonEmptyString(decision.primaryReason, 'primaryReason');
  if (!decision.reasonCodes.includes(decision.primaryReason)) {
    const error = new Error('[policy] primaryReason must be included in reasonCodes');
    error.code = 'POLICY_DECISION_INVALID';
    throw error;
  }

  if (decision.result === 'DEGRADED' || decision.result === 'DENY') {
    assertNonEmptyString(decision.templateId, 'templateId');
  } else if (decision.templateId !== undefined && decision.templateId !== null) {
    assertNonEmptyString(decision.templateId, 'templateId');
  }

  if (decision.nextAction !== undefined && decision.nextAction !== null) {
    if (typeof decision.nextAction !== 'object') {
      const error = new Error('[policy] nextAction must be an object');
      error.code = 'POLICY_DECISION_INVALID';
      throw error;
    }
    if (decision.nextAction.action !== undefined) {
      assertNonEmptyString(decision.nextAction.action, 'nextAction.action');
    }
  }

  if (decision.policyTrace !== undefined && decision.policyTrace !== null) {
    if (typeof decision.policyTrace !== 'object') {
      const error = new Error('[policy] policyTrace must be an object');
      error.code = 'POLICY_DECISION_INVALID';
      throw error;
    }
  }

  return decision;
}

module.exports = { assertPolicyDecisionShape };
