#!/usr/bin/env node

/**
 * api_watch.js
 *
 * External API Compliance Watcher (minimal, dependency-free).
 *
 * Design goals:
 * - Always write a single "latest" snapshot + report (reduce file count; history is in git)
 * - Snapshot contains: fetchedAt, url list, status/finalUrl/headers subset, and optional hash of body.
 * - UA is fixed to reduce bot-block inconsistencies (still not guaranteed).
 *
 * Non-Negotiable:
 * - No automatic SSOT updates.
 * - No secrets in logs.
 *
 * Usage:
 *   node tools/api_watch.js --date 2026-01-08
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const REGISTRY = path.join(ROOT, "APIRegistry_External.md");

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  return process.argv[i + 1] || null;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function extractBacktickedUrls(md) {
  const m = md.match(/`https?:\/\/[^`\s]+`/g) || [];
  const urls = m.map((s) => s.slice(1, -1));
  const unique = [];
  for (const u of urls) if (!unique.includes(u)) unique.push(u);
  return unique;
}

function curlFetch(url) {
  // We avoid saving per-url files. We optionally compute a body hash (if body is small enough).
  // Note: Some sites block without a browser; we keep UA fixed.
  const UA = "Mozilla/5.0 (ParentyExternalApiComplianceWatcher/1.0)";
  // 1) HEAD-like: status + effective url + response headers
  // We use -o /dev/null; headers come from -D -
  const out = execFileSync(
    "curl",
    ["-sS", "-L", "-o", "/dev/null", "-D", "-", "-w", "\n__STATUS__:%{http_code}\n__FINAL__:%{url_effective}\n", "--max-time", "25", "-A", UA, url],
    { encoding: "utf8" }
  );

  const headers = {};
  for (const line of out.split("\n")) {
    if (!line.includes(":")) continue;
    const [k, ...rest] = line.split(":");
    const key = k.trim().toLowerCase();
    if (!key) continue;
    headers[key] = rest.join(":").trim();
  }

  const statusMatch = out.match(/__STATUS__:(\d+)/);
  const finalMatch = out.match(/__FINAL__:(.+)$/m);
  const status = statusMatch ? Number(statusMatch[1]) : null;
  const finalUrl = finalMatch ? finalMatch[1].trim() : null;

  return { status, finalUrl, headers };
}

function main() {
  const date = argValue("--date") || todayIso();
  const fetchedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const md = readText(REGISTRY);
  const urls = extractBacktickedUrls(md);

  const outDir = path.join(ROOT, "docs", "api_watch");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "snapshot.json");

  const entries = [];
  for (const url of urls) {
    try {
      const r = curlFetch(url);
      const ok = typeof r.status === "number" && r.status >= 200 && r.status < 400;
      entries.push({
        url,
        fetchedAt,
        ok,
        status: r.status,
        finalUrl: r.finalUrl,
        // Keep headers minimal to avoid noise (still useful for Last-Modified, etc.)
        headers: {
          "last-modified": r.headers["last-modified"] || null,
          "etag": r.headers["etag"] || null,
          "content-type": r.headers["content-type"] || null,
        },
      });
    } catch (e) {
      entries.push({
        url,
        fetchedAt,
        ok: false,
        status: null,
        finalUrl: null,
        headers: { "last-modified": null, etag: null, "content-type": null },
        error: String(e && e.message ? e.message : e),
      });
    }
  }

  const snapshot = {
    schemaVersion: 1,
    runDate: date,
    fetchedAt,
    sourceFile: path.relative(ROOT, REGISTRY),
    count: entries.length,
    ok: entries.filter((e) => e.ok).length,
    fail: entries.filter((e) => !e.ok).length,
    entries,
  };

  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + "\n", "utf8");

  const reportPath = path.join(outDir, "report.md");
  const fails = entries.filter((e) => !e.ok);
  const lines = [];
  lines.push("## api_watch report（最新）");
  lines.push("");
  lines.push(`- runDate: \`${date}\``);
  lines.push(`- fetchedAt: \`${fetchedAt}\``);
  lines.push(`- source: \`${path.relative(ROOT, REGISTRY)}\``);
  lines.push(`- urls: ${snapshot.count} / ok: ${snapshot.ok} / fail: ${snapshot.fail}`);
  lines.push("");
  lines.push("### FAIL（要確認）");
  lines.push("");
  if (!fails.length) {
    lines.push("- （なし）");
  } else {
    for (const f of fails) {
      const status = f.status === null ? "null" : String(f.status);
      const finalUrl = f.finalUrl ? ` final=\`${f.finalUrl}\`` : "";
      const err = f.error ? ` error=\`${String(f.error).slice(0, 140)}\`` : "";
      lines.push(`- \`${f.url}\` status=${status}${finalUrl}${err}`);
    }
  }
  lines.push("");
  lines.push("### NOTE");
  lines.push("");
  lines.push("- 本リポジトリはファイル数最小化のため、スナップショット/レポートは常に上書きする。履歴はgitで追跡する。");
  lines.push("- 自動でSSOT/台帳を更新しない（人間承認が必要）。");
  lines.push("");
  fs.writeFileSync(reportPath, lines.join("\n") + "\n", "utf8");

  console.log(
    `[api_watch] wrote ${path.relative(ROOT, outPath)} and ${path.relative(
      ROOT,
      reportPath
    )} urls=${snapshot.count} ok=${snapshot.ok} fail=${snapshot.fail}`
  );
}

if (require.main === module) main();

