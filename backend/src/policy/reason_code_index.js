const fs = require('fs');
const path = require('path');

function loadReasonCodeIndexFromFile(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return {};
  }
  try {
    const resolved = path.resolve(process.cwd(), filePath);
    const raw = fs.readFileSync(resolved, 'utf8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') {
      return {};
    }
    return data;
  } catch (error) {
    return {};
  }
}

function normalizeReasonCodeIndex(index) {
  if (!index || typeof index !== 'object') {
    return {};
  }
  const normalized = {};
  for (const [code, entry] of Object.entries(index)) {
    if (!code || typeof code !== 'string') {
      continue;
    }
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    if (!entry.category || typeof entry.category !== 'string') {
      continue;
    }
    normalized[code] = {
      category: entry.category,
      defaultResult: entry.defaultResult,
      templateId: entry.templateId
    };
  }
  return normalized;
}

module.exports = {
  loadReasonCodeIndexFromFile,
  normalizeReasonCodeIndex
};
