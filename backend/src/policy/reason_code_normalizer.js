const UNKNOWN_REASON = 'UNKNOWN_REASON';

function normalizeReasonCodes(reasonCodes, reasonCodeIndex) {
  if (!Array.isArray(reasonCodes)) {
    return [UNKNOWN_REASON];
  }
  const normalized = [];
  for (const code of reasonCodes) {
    if (!code || typeof code !== 'string') {
      continue;
    }
    if (reasonCodeIndex && typeof reasonCodeIndex === 'object') {
      if (!reasonCodeIndex[code]) {
        continue;
      }
    }
    normalized.push(code);
  }
  if (normalized.length === 0) {
    return [UNKNOWN_REASON];
  }
  return normalized;
}

module.exports = { UNKNOWN_REASON, normalizeReasonCodes };
