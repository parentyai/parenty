/**
 * Derived Insight Integrity Rules
 *
 * Goal: Minimize false negatives (misses). False positives are acceptable.
 *
 * IMPORTANT:
 * - We forbid quantitative/segment-like expressions in Derived Insight content.
 * - We intentionally do NOT treat SSOT section numbers like "1-4-3-A" as quantitative values.
 */

const DEFAULT_RULESET_VERSION = "v1";

/**
 * Patterns that must NEVER appear in Derived Insight (content, templates, outputs).
 * We avoid matching SSOT section references by not treating hyphenated section ids as numbers.
 */
const FORBIDDEN_REGEXES = [
  // Percent / ratios
  { id: "percent_ascii", re: /%/g, message: "Percent sign (%) is forbidden." },
  { id: "percent_fullwidth", re: /％/g, message: "Fullwidth percent sign (％) is forbidden." },
  { id: "ratio_words", re: /(割合|比率|パーセント|率)/g, message: "Ratio-related words are forbidden." },

  // Counts
  { id: "count_units", re: /(\d+|[０-９]+)\s*(件|人|名|社|店|医院|病院)/g, message: "Count-like expressions are forbidden." },
  { id: "n_equals", re: /\b[nN]\s*=\s*(\d+|[０-９]+)\b/g, message: "n= / N= is forbidden." },

  // Plain numbers (strict): forbid standalone numbers, but allow SSOT section ids that contain hyphens like 1-4-3-A.
  // This catches "10", "２０" and also "1)" etc. It does NOT catch "1-4-3".
  { id: "standalone_ascii_number", re: /(^|[^0-9-])(\d+)([^0-9-]|$)/g, message: "Standalone numbers are forbidden." },
  { id: "standalone_fullwidth_number", re: /(^|[^０-９-])([０-９]+)([^０-９-]|$)/g, message: "Standalone fullwidth numbers are forbidden." },

  // Segment / cohort / time-series hints
  { id: "segment_words", re: /(セグメント|属性別|層|年代別|学年別|国別|州別|都市別|時系列|週次|月次|前年比|前年差)/g, message: "Segmentation/time-series terms are forbidden." },

  // Comparative implication that often encodes quantification
  { id: "comparative_more_less", re: /(より多い|より少ない|一番|ランキング|順位|上位|下位|トップ|ワースト)/g, message: "Comparative/ranking expressions are forbidden." },
];

/**
 * Find forbidden patterns in a Derived Insight string.
 * @param {string} text
 * @returns {Array<{ruleId: string, index: number, match: string, message: string}>}
 */
function findForbidden(text) {
  const results = [];
  if (!text) return results;

  for (const rule of FORBIDDEN_REGEXES) {
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text)) !== null) {
      // For standalone number rules, capture group 2 is the number.
      const match = m[0];
      const index = m.index;
      results.push({ ruleId: rule.id, index, match, message: rule.message });
      // Avoid infinite loops on zero-length matches
      if (rule.re.lastIndex === m.index) rule.re.lastIndex++;
    }
  }
  return results;
}

/**
 * Assert that a Derived Insight content is safe.
 * Throws Error on violation.
 * @param {string} text
 * @param {{context?: string}} [opts]
 */
function assertDerivedInsightSafe(text, opts = {}) {
  const violations = findForbidden(text);
  if (violations.length === 0) return;

  const context = opts.context ? `Context: ${opts.context}\n` : "";
  const details = violations
    .slice(0, 20)
    .map((v) => `- [${v.ruleId}] "${v.match}" @${v.index}: ${v.message}`)
    .join("\n");
  const more = violations.length > 20 ? `\n...and ${violations.length - 20} more` : "";
  const err = new Error(
    `${context}Derived Insight policy violation(s) detected:\n${details}${more}`
  );
  err.name = "DerivedInsightPolicyError";
  err.violations = violations;
  throw err;
}

module.exports = {
  DEFAULT_RULESET_VERSION,
  FORBIDDEN_REGEXES,
  findForbidden,
  assertDerivedInsightSafe,
};


