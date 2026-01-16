const CATEGORY_PRIORITY = Object.freeze([
  'STOP',
  'INCIDENT',
  'SYSTEM',
  'RISK',
  'REVIEW_SOURCE',
  'EXPERIENCE_SOURCE',
  'SOURCE',
  'CONSENT',
  'PLAN',
  'CONTEXT',
  'TEMPLATE',
  'DATA',
  'VENDOR',
  'CATCHALL'
]);

function resolveCategoryPriority(category) {
  const index = CATEGORY_PRIORITY.indexOf(category);
  return index === -1 ? CATEGORY_PRIORITY.length : index;
}

function resolvePrimaryReason(reasonCodes, reasonCodeIndex) {
  if (!Array.isArray(reasonCodes) || reasonCodes.length === 0) {
    return null;
  }
  if (!reasonCodeIndex || typeof reasonCodeIndex !== 'object') {
    return reasonCodes[0];
  }

  let best = null;
  let bestPriority = CATEGORY_PRIORITY.length + 1;
  for (const code of reasonCodes) {
    if (!code || typeof code !== 'string') {
      continue;
    }
    const entry = reasonCodeIndex[code];
    const category = entry ? entry.category : null;
    const priority = resolveCategoryPriority(category);
    if (priority < bestPriority) {
      bestPriority = priority;
      best = code;
    }
  }

  return best || reasonCodes[0];
}

module.exports = { CATEGORY_PRIORITY, resolvePrimaryReason };
