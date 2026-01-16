## SSOT_LINK_MAP（SSOT参照強制：影響範囲マップ）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: SSOT条番号 → 影響範囲（実装/運用/検査/派生ドキュメント）への参照導線を固定し、SSOT違反の発生源（参照漏れ/責任分裂）を潰す。
- **想定読者**: CTO(GPT) / Engineer(Cursor) / Ops
- **依存SSoT**: `PARENTY_SSOT.md`
- **生成物**: SSOT条番号ごとの影響範囲マップ（参照のみ）
- **編集禁止領域**:
  - SSOT条文の要約・再定義
  - 新しい概念語の導入
- **更新ルール**: SSOT条番号が増減した場合のみ、参照導線として追記する（既存行の再解釈は禁止）。
- **関連リンク**: `SSOT_INDEX.md` / `PARENTY_SSOT.md` / `Guides.md` / `PolicyUxAdminMatrix.md` / `Runbook.md` / `docs/INTEGRITY_CHECKLIST.md`
- **変更履歴**:
  - 2026-01-09: 初版（SSOT参照強制レイヤー）

---

## 背景

- SSOTが参照されない変更は、実装/運用/CIのどこかで必ず逸脱を生む。

---

## 説明

### SSOT: 1-5. 実行主体と責務境界（Authority & Responsibility）

- **Affects**:
  - Policy Engine: `policyDecision`（result/reasonCodes/primaryReason/templateId/nextAction）
  - Admin UI / Ops: override/停止/復旧/公開の責務境界（SSOT参照必須）
  - CI/PR: 判断主体（Human/System/AI）に関する変更の参照強制
- **Forbidden**:
  - （参照）SSOT 1-5（MUST NOT）

---

### SSOT: 3-3-1. OpenAPI / Firestore への焼き込み規則（拘束条項）

- **Affects**:
  - API/Schema: `policyDecision` / `nextAction` / `UNKNOWN_REASON` fail-safe
  - logs: `reasonCodes[]` min 1 / `primaryReason` 必須
  - docs lint: SSOT節番号参照の整合
- **Forbidden**:
  - （参照）SSOT 3-3-1

---

### SSOT: 3-4. 失敗時の既定動作（Fail-safe / Fail-open / Fail-close）

- **Affects**:
  - Policy Engine: 失敗の正規化（reasonCode）と `nextAction` 接続
  - Ops: `incident_records` / Runbook（7-2）
  - UX: 沈黙禁止（付録C参照）
- **Forbidden**:
  - （参照）SSOT 3-4

---

### SSOT: 5-7. 外部依存UX原則（API劣化・停止時）

- **Affects**:
  - UX: 付録Cテンプレ参照、公式導線、断定禁止
  - External API: 付録F / `APIRegistry_External.md`
  - Ops: 6-2X（CREATE_INCIDENT 等）
- **Forbidden**:
  - （参照）SSOT 5-7 / 付録C / 付録F

---

### SSOT: 5-8. City Pack Failure Mode Watch（Watch Set）

- **Affects**:
  - Data: `city_pack_watch_states` / `city_pack_generation_logs`
  - Admin UI: City Pack review/activate/rollback の導線
  - UX: watch 結果表示（結果＋最終確認日）
  - Docs: `docs/ops/city_pack_auto_generation_spec.md` / `docs/policy_engine/watch_rules.md`
- **Forbidden**:
  - （参照）SSOT 5-8

---

### SSOT: 6-0 / 6-2X / 6-2Z（Policy×UX×管理UI / nextAction拘束）

- **Affects**:
  - Admin UI: `primaryReason` → `nextAction`（決定的）
  - API: nextAction enum/schema（6-2Z）
  - Ops: runbookLabel（7章）
- **Forbidden**:
  - （参照）SSOT 6-0 / 6-2X / 6-2Z

---

### SSOT: 6-4. 権限モデル（RBAC：運用拘束）

- **Affects**:
  - Admin UI/API: requiresRole の強制、audit_logs の必須記録
  - Ops: 二者承認（運用手順）
  - PR/CI: role追加禁止の参照強制
- **Forbidden**:
  - （参照）SSOT 6-4 / 6-3-3

---

### SSOT: 7-2-1 / 7-3-3（インシデント / 保存期間）

- **Affects**:
  - Ops: incident_records / audit_logs / 保存期間
  - Policy: fail-safe 接続（CREATE_INCIDENT）
- **Forbidden**:
  - （参照）SSOT 7-2-1 / 7-3-3

---

### SSOT: 8-5. データ保持・破棄・匿名化原則（Retention & Anonymization）

- **Affects**:
  - Data model: Raw/Operational/Derived Insight 区分
  - Erasure: 8-4-3（削除権）との接続
  - CI/Policy lint: Derived Insight の禁止表現（数値等）
- **Forbidden**:
  - （参照）SSOT 8-5 / 1-4-3 / 1-4-3-A

---

### SSOT: Appendix B / Appendix C（reasonCodes / テンプレ）

- **Affects**:
  - Policy Engine: reasonCodes 正規一覧
  - UX: templateId → 表示文言参照（直書き禁止）
  - Admin UI: nextAction 接続
- **Forbidden**:
  - （参照）SSOT 付録B / 付録C

---

### SSOT: Appendix G（将来機能の予約地）

- **Affects**:
  - PR/CI: 予約機能の実装禁止
  - Docs: RESERVED_FEATURES_GATE の参照導線
- **Forbidden**:
  - （参照）SSOT 付録G

---

## 結論

- SSOT条番号の参照が無い変更は、SSOT違反の芽として検知されるべきであり、本マップはその導線を固定する。

---

## 補足

- （特になし）
