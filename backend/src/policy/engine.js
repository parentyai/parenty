const path = require('path');
const { assertPolicyDecisionShape } = require('./decision_shape');
const { evaluatePolicy } = require('./evaluator');
const { normalizePolicyInputs } = require('./input_normalizer');
const { enforceNextActionConstraints } = require('./next_action_enforcer');
const {
  loadReasonCodeIndexFromFile,
  normalizeReasonCodeIndex
} = require('./reason_code_index');

const DEFAULT_REASON_CODE_INDEX_PATH = path.resolve(__dirname, '../../reason_code_index.json');

function finalizePolicyDecision(decision) {
  return assertPolicyDecisionShape(decision);
}

function resolveReasonCodeIndex(context) {
  if (context.reasonCodeIndex && typeof context.reasonCodeIndex === 'object') {
    return context.reasonCodeIndex;
  }
  const reasonCodeIndexPath = context.reasonCodeIndexPath
    || process.env.POLICY_REASON_CODE_INDEX_PATH
    || DEFAULT_REASON_CODE_INDEX_PATH;
  const index = normalizeReasonCodeIndex(loadReasonCodeIndexFromFile(reasonCodeIndexPath));
  if (!index || Object.keys(index).length === 0) {
    const error = new Error('[policy] reasonCodeIndex is required');
    error.code = 'POLICY_REASON_CODE_INDEX_MISSING';
    throw error;
  }
  return index;
}

function runPolicy(inputs, context = {}) {
  const normalizedInputs = normalizePolicyInputs(inputs);
  const reasonCodeIndex = resolveReasonCodeIndex(context);
  const decision = evaluatePolicy(normalizedInputs, {
    ...context,
    reasonCodeIndex
  });
  const finalized = finalizePolicyDecision(decision);
  if (context.enforceNextAction === true) {
    enforceNextActionConstraints(finalized.nextAction, {
      role: context.role,
      roles: context.roles,
      hasReason: context.hasReason,
      auditLogged: context.auditLogged
    });
  }
  return finalized;
}

module.exports = { finalizePolicyDecision, runPolicy };
