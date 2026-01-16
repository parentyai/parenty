# POLICY_DECISION_VALIDATE（Policy Decision 形状検証）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。

## メタ（固定）

- **SSoT責務**: policyDecision の形状確認の導線を固定する（新仕様は追加しない）。
- **想定読者**: Engineer / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（3-0-1 / 付録B / 6-2X / 6-2Z）
- **参照実装**: `backend/src/policy/decision_shape.js`

---

## 背景

Phase 2 で policyDecision の形状がSSOTと一致していることを確認するため、検証導線を固定する。

---

## 説明

### 検証対象

- `policyDecision` の形状
- 必須項目: result / reasonCodes / primaryReason
- 条件必須: result が DEGRADED / DENY の場合は templateId を必須とする。
- 参照条件: SSOT 3-0-1 / 付録B / 6-2X / 6-2Z

### 実行コマンド

- `backend` ディレクトリで実行する。

```bash
npm run policy:decision-validate -- <path/to/decision.json>
```

### 成功条件

- `[policy.decision.validate] ok` が出力される。

### 実行ログ（確認済み）

- `backend/tools/policy_decision_sample.json` で検証済み（出力: ok）。

### 失敗条件

- `POLICY_DECISION_INVALID` が返る。
- SSOT 3-0-1 の必須項目が欠けている。

---

## 結論

- 形状検証は本ファイルの導線で実施し、正は SSOT に固定する。

---

## 補足

- 検証用サンプルは `backend/tools/policy_decision_sample.json` に限定し、正の定義には使用しない。
