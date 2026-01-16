const fs = require('fs');
const path = require('path');
const { assertPolicyDecisionShape } = require('../src/policy/decision_shape');

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('[policy.decision.validate] missing input file');
    process.exit(1);
  }

  const resolved = path.resolve(process.cwd(), inputPath);
  const decision = loadJson(resolved);
  assertPolicyDecisionShape(decision);
  console.log('[policy.decision.validate] ok', { file: path.basename(resolved) });
}

main();
