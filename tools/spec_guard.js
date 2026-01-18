#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DOCS_GLOB = 'docs/**/*.md';
const TARGET_FILES = [
  'PARENTY_SSOT.md',
  'docs/ops/city_pack_auto_generation_spec.md'
];

const EXAGGERATION_WORDS = /(完全|すべて|網羅|包括|全部|全学校|全イベント)/;
const EXAGGERATION_VERBS = /(把握|確認|カバー|管理|監視)/;
const LLM_FORBIDDEN = /(自由に検索|網羅的に調査|常時クロール|全情報を集める)/;
const EXCLUDE_GUARD = /(禁止|NG|禁止表現|使用禁止|MUST NOT)/;

const REQUIRED_CONCEPTS = [
  { key: 'City Pack は Failure Mode Watch である', test: /Failure Mode Watch/ },
  { key: 'Watch State は ok / risk / unknown を持つ', test: /ok\s*\/\s*risk\s*\/\s*unknown/i },
  { key: 'UNKNOWN は正式な正常状態である', test: /UNKNOWN.*正常状態|正常状態.*UNKNOWN/ },
  { key: 'rawデータ本文は恒久保存しない', test: /raw.*(保存しない|保存禁止|恒久保存しない)/i }
];

const REQUIRED_LLM_OK = [
  '差分有無の要約',
  'Failure Mode へのマッピング',
  '状態判定補助'
];

function readText(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function listFilesFromGit(pattern) {
  try {
    const out = execSync(`git ls-files "${pattern}"`, {
      cwd: ROOT,
      encoding: 'utf8'
    });
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function diffFiles() {
  const baseRef = process.env.GITHUB_BASE_REF;
  const range = baseRef ? `origin/${baseRef}...HEAD` : 'HEAD~1';
  try {
    const out = execSync(`git diff --name-only ${range}`, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

function shouldRunForDocs() {
  const changed = diffFiles();
  if (!changed) return true;
  return changed.some((f) => f.startsWith('docs/'));
}

function hardFail1(files) {
  const errors = [];
  for (const file of files) {
    const text = readText(file);
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      if (!EXAGGERATION_WORDS.test(line)) return;
      if (!EXAGGERATION_VERBS.test(line)) return;
      if (EXCLUDE_GUARD.test(line)) return;
      errors.push(
        `${file}:${idx + 1} 誇大表現の検出（City PackはWatch Listであり網羅DBではない）。` +
          ' 代替表現例:「重要な変更があるかを定期的にチェックしています」'
      );
    });
  }
  return errors;
}

function hardFail2() {
  const errors = [];
  for (const file of TARGET_FILES) {
    const text = readText(file);
    for (const concept of REQUIRED_CONCEPTS) {
      if (!concept.test.test(text)) {
        errors.push(
          `${file} City Pack 中核仕様の欠落: ${concept.key}\n` +
            'City Pack が情報DBに誤解されるリスクがあります。\n' +
            '追記テンプレ:「City Pack は Failure Mode Watch であり、状態は ok/risk/unknown のみ、UNKNOWN は正常状態、raw本文は保存しない。」'
        );
      }
    }
  }
  return errors;
}

function hardFail3() {
  const errors = [];
  for (const file of TARGET_FILES) {
    const text = readText(file);
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      if (!LLM_FORBIDDEN.test(line)) return;
      if (EXCLUDE_GUARD.test(line)) return;
      errors.push(
        `${file}:${idx + 1} LLMの役割逸脱（自由探索/網羅クロールの許可表現）。\n` +
          '実害: コスト暴発/規約違反/誤情報混入/SSOT破壊。\n' +
          '許可された役割: 差分要約 / Failure Mode マッピング / 状態判定補助。'
      );
    });

    for (const phrase of REQUIRED_LLM_OK) {
      if (!text.includes(phrase)) {
        errors.push(
          `${file} LLMの役割明示不足: ${phrase}\n` +
            '実害: コスト暴発/規約違反/誤情報混入/SSOT破壊。\n' +
            '許可された役割: 差分要約 / Failure Mode マッピング / 状態判定補助。'
        );
      }
    }
  }
  return errors;
}

function main() {
  if (!shouldRunForDocs()) {
    console.log('[spec_guard] no docs changes detected; skip');
    return;
  }

  const docFiles = listFilesFromGit(DOCS_GLOB);
  const errors = [
    ...hardFail1(docFiles),
    ...hardFail2(),
    ...hardFail3()
  ];

  if (errors.length) {
    console.error('SPEC GUARD FAILED:');
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log('[spec_guard] ok');
}

main();
