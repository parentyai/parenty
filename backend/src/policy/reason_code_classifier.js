const STOP_CATEGORY = 'STOP';

function isStopCategory(reasonCodeEntry) {
  return reasonCodeEntry && reasonCodeEntry.category === STOP_CATEGORY;
}

function hasStopCategory(reasonCodes, reasonCodeIndex) {
  if (!Array.isArray(reasonCodes) || reasonCodes.length === 0) {
    return false;
  }
  if (!reasonCodeIndex || typeof reasonCodeIndex !== 'object') {
    return false;
  }
  return reasonCodes.some((code) => isStopCategory(reasonCodeIndex[code]));
}

module.exports = { STOP_CATEGORY, isStopCategory, hasStopCategory };
