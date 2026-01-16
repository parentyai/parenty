const FORBIDDEN_KEYS = new Set(['rawText', 'rawPrompt']);

function assertNoRawText(payload, context) {
  if (!payload || typeof payload !== 'object') {
    return;
  }
  for (const key of FORBIDDEN_KEYS) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const error = new Error(`[pii.guard] ${context} must not include ${key}`);
      error.code = 'PII_RAW_TEXT_FORBIDDEN';
      throw error;
    }
  }
}

module.exports = { assertNoRawText };
