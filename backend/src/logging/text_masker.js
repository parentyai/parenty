function maskText(value) {
  if (value === null || value === undefined) {
    return null;
  }
  const text = String(value);
  if (text.length === 0) {
    return '';
  }
  return `[MASKED:${text.length}]`;
}

function requireText(value, fieldName) {
  if (typeof value !== 'string') {
    const error = new Error(`[mask] ${fieldName} must be a string`);
    error.code = 'MASK_INVALID_TEXT';
    throw error;
  }
  return value;
}

module.exports = { maskText, requireText };
