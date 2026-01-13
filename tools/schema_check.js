#!/usr/bin/env node

/**
 * schema_check.js
 *
 * [仮説]
 * - There is no Firestore schema code yet in this repository (docs-only repo).
 * - We still provide a skeleton that becomes strict when Derived Insight storage is introduced.
 *
 * Behavior:
 * - If no Derived Insight storage schema exists, print WARN and exit 0.
 * - If a schema file exists, validate it has the required fields.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CANDIDATE_SCHEMA_PATHS = [
  path.join(ROOT, "schemas", "derived_insight.schema.json"),
  path.join(ROOT, "schemas", "derived_insight.schema.yaml"),
];

const REQUIRED_FIELDS = [
  "id",
  "createdAt",
  "createdBy",
  "promptVersion",
  "category",
  "content",
  "rulesetVersion",
];

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function main() {
  const found = CANDIDATE_SCHEMA_PATHS.find(fileExists);
  if (!found) {
    console.log(
      "SCHEMA CHECK WARN: No Derived Insight schema file found. (OK for docs-only phase)"
    );
    process.exit(0);
  }

  if (found.endsWith(".json")) {
    const raw = fs.readFileSync(found, "utf8");
    let obj;
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      console.error(`SCHEMA CHECK FAILED: Invalid JSON: ${found}`);
      process.exit(1);
    }

    const props = obj && obj.properties ? Object.keys(obj.properties) : [];
    const missing = REQUIRED_FIELDS.filter((f) => !props.includes(f));
    if (missing.length) {
      console.error(
        `SCHEMA CHECK FAILED: Missing required fields in ${path.relative(
          ROOT,
          found
        )}: ${missing.join(", ")}`
      );
      process.exit(1);
    }

    console.log("SCHEMA CHECK OK");
    process.exit(0);
  }

  console.log(
    `SCHEMA CHECK WARN: Schema file type not validated yet: ${path.relative(
      ROOT,
      found
    )}`
  );
  process.exit(0);
}

main();


