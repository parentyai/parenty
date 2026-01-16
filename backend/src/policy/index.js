const { assertPolicyDecisionShape } = require('./decision_shape');
const { finalizePolicyDecision, runPolicy } = require('./engine');
const { evaluatePolicy } = require('./evaluator');
const {
  POLICY_INPUT_ORDER,
  normalizePolicyInputs,
  orderedPolicyInputs
} = require('./input_normalizer');
const {
  POLICY_INPUT_SOURCES,
  listPolicyInputSources
} = require('./input_sources');
const {
  buildPolicyTrace,
  digestInputs,
  normalizeRuleVersion,
  DEFAULT_RULE_VERSION
} = require('./policy_trace');
const {
  CATEGORY_PRIORITY,
  resolvePrimaryReason
} = require('./primary_reason');
const {
  UNKNOWN_REASON,
  normalizeReasonCodes
} = require('./reason_code_normalizer');
const {
  loadReasonCodeIndexFromFile,
  normalizeReasonCodeIndex
} = require('./reason_code_index');
const { enforceNextActionConstraints } = require('./next_action_enforcer');
const {
  STOP_CATEGORY,
  isStopCategory,
  hasStopCategory
} = require('./reason_code_classifier');

module.exports = {
  assertPolicyDecisionShape,
  finalizePolicyDecision,
  evaluatePolicy,
  runPolicy,
  POLICY_INPUT_ORDER,
  normalizePolicyInputs,
  orderedPolicyInputs,
  POLICY_INPUT_SOURCES,
  listPolicyInputSources,
  buildPolicyTrace,
  digestInputs,
  normalizeRuleVersion,
  DEFAULT_RULE_VERSION,
  CATEGORY_PRIORITY,
  resolvePrimaryReason,
  UNKNOWN_REASON,
  normalizeReasonCodes,
  loadReasonCodeIndexFromFile,
  normalizeReasonCodeIndex,
  enforceNextActionConstraints,
  STOP_CATEGORY,
  isStopCategory,
  hasStopCategory
};
