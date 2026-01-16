const crypto = require('crypto');
const { POLICY_INPUT_ORDER } = require('./input_normalizer');

const DEFAULT_RULE_VERSION = 'pe:v0.0.0';

function digestInputs(inputs) {
  const payload = inputs && typeof inputs === 'object' ? inputs : {};
  const keys = [];
  const counts = {};
  for (const key of POLICY_INPUT_ORDER) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      keys.push(key);
      const value = payload[key];
      if (Array.isArray(value)) {
        counts[key] = value.length;
      } else if (value && typeof value === 'object') {
        counts[key] = Object.keys(value).length;
      } else if (value === undefined || value === null) {
        counts[key] = 0;
      } else {
        counts[key] = 1;
      }
    }
  }
  const fingerprint = JSON.stringify({ keys, counts });
  const hash = crypto.createHash('sha256').update(fingerprint).digest('hex');
  return `sha256:${hash}`;
}

function normalizeRuleVersion(value) {
  if (!value || typeof value !== 'string') {
    return DEFAULT_RULE_VERSION;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith('pe:v')) {
    return DEFAULT_RULE_VERSION;
  }
  return trimmed;
}

function buildPolicyTrace(inputs, overrides = {}) {
  return {
    traceId: overrides.traceId || crypto.randomUUID(),
    ruleVersion: normalizeRuleVersion(overrides.ruleVersion),
    inputsDigest: overrides.inputsDigest || digestInputs(inputs),
    evaluatedAt: overrides.evaluatedAt || new Date().toISOString()
  };
}

module.exports = { buildPolicyTrace, digestInputs, normalizeRuleVersion, DEFAULT_RULE_VERSION };
