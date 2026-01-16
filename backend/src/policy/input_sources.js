const { POLICY_INPUT_ORDER } = require('./input_normalizer');

const POLICY_INPUT_SOURCES = Object.freeze({
  'global_flags': { ssotRef: 'PARENTY_SSOT.md 3-B' },
  'households.flags': { ssotRef: 'PARENTY_SSOT.md 3-B' },
  'feature switches': { ssotRef: 'PARENTY_SSOT.md 3-B' },
  plan: { ssotRef: 'PARENTY_SSOT.md 3-B' },
  consents: { ssotRef: 'PARENTY_SSOT.md 3-B' },
  risk: { ssotRef: 'PARENTY_SSOT.md 3-B' },
  'context/ops': { ssotRef: 'PARENTY_SSOT.md 3-B' }
});

function listPolicyInputSources() {
  return POLICY_INPUT_ORDER.map((key) => ({
    key,
    ssotRef: POLICY_INPUT_SOURCES[key].ssotRef
  }));
}

module.exports = {
  POLICY_INPUT_SOURCES,
  listPolicyInputSources
};
