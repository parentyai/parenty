const POLICY_INPUT_ORDER = Object.freeze([
  'global_flags',
  'households.flags',
  'feature switches',
  'plan',
  'consents',
  'risk',
  'context/ops'
]);

function normalizePolicyInputs(inputs) {
  const payload = inputs && typeof inputs === 'object' ? inputs : {};
  const normalized = {};

  for (const key of POLICY_INPUT_ORDER) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      normalized[key] = payload[key];
    }
  }

  return normalized;
}

function orderedPolicyInputs(inputs) {
  const payload = normalizePolicyInputs(inputs);
  return POLICY_INPUT_ORDER.map((key) => ({ key, value: payload[key] }));
}

module.exports = {
  POLICY_INPUT_ORDER,
  normalizePolicyInputs,
  orderedPolicyInputs
};
