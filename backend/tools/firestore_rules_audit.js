const { execSync } = require('child_process');
const path = require('path');

function resolveRoot() {
  return path.resolve(__dirname, '..', '..');
}

function main() {
  const root = resolveRoot();
  execSync('firebase deploy --only firestore:rules --dry-run', {
    cwd: root,
    stdio: 'inherit'
  });
  console.log('[firestore.rules.audit] ok');
}

main();
