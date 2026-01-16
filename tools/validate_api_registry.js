const fs = require('fs');
const path = require('path');

const ALLOWED_PATHS = new Set(['/health', '/line/webhook']);

function readLines(filePath) {
  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
}

function extractPath(rawCell) {
  if (!rawCell) {
    return null;
  }
  const match = rawCell.match(/\/[^`\s|]+/);
  return match ? match[0] : null;
}

function isSeparatorRow(cells) {
  return cells.every((cell) => cell.startsWith('---'));
}

function main() {
  const registryPath = path.resolve(__dirname, '..', 'APIRegistry.md');
  const lines = readLines(registryPath);
  const errors = [];
  const seen = {
    '/health': false,
    '/line/webhook': false
  };

  let pathIndex = -1;
  let inPathTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
      inPathTable = false;
      pathIndex = -1;
      continue;
    }

    const cells = trimmed.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length === 0) {
      continue;
    }

    if (cells.includes('Path')) {
      pathIndex = cells.indexOf('Path');
      inPathTable = true;
      continue;
    }

    if (!inPathTable || pathIndex < 0) {
      continue;
    }

    if (isSeparatorRow(cells)) {
      continue;
    }

    const rawCell = cells[pathIndex];
    const hasHypothesis = rawCell.includes('[仮説]');
    const actualPath = extractPath(rawCell);
    if (!actualPath) {
      continue;
    }

    if (ALLOWED_PATHS.has(actualPath)) {
      seen[actualPath] = true;
      if (hasHypothesis) {
        errors.push(`Path ${actualPath} must not be marked as [仮説].`);
      }
      continue;
    }

    if (!hasHypothesis) {
      errors.push(`Path ${actualPath} must be marked as [仮説] until SSOT fixes it.`);
    }
  }

  for (const requiredPath of ALLOWED_PATHS) {
    if (!seen[requiredPath]) {
      errors.push(`Path ${requiredPath} is missing in APIRegistry.md.`);
    }
  }

  if (errors.length > 0) {
    console.error('[api.registry.validate] failed');
    errors.forEach((message) => console.error(`- ${message}`));
    process.exit(1);
  }

  console.log('[api.registry.validate] ok');
}

main();
