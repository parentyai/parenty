## APIRegistry.md（Parenty API 台帳：完全版 / SSOT準拠）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: APIを「入口/層」が増えてもズレないように、**判断（Policy）・真実（Data）・ログ（監査）を一本化**するための“台帳（唯一の棚卸し表）”を提供する。
- **想定読者**: Engineer(Cursor) / CTO(GPT) / Ops
- **依存SSoT**:
  - `PARENTY_SSOT.md` 2章（責務分離 / 入口が複数でも一本）
  - `PARENTY_SSOT.md` 3章（Policy Engine）
  - `PARENTY_SSOT.md` 3-3-1（OpenAPI/Firestore拘束条項）
  - `PARENTY_SSOT.md` 4️⃣ audit_logs（append-only / actorType）
  - `PARENTY_SSOT.md` B-1-1（policyDecision 埋め込み）
  - `PARENTY_SSOT.md` B-1-2（policyTrace 埋め込み）
  - `PARENTY_SSOT.md` 6-2X/6-2Y/6-2Z（nextAction）
  - `PARENTY_SSOT.md` 7-3（監査/保存期間/品質監査）
- **生成物**:
  - API面の“共通契約”（判断/ログ/フェイルセーフ）
  - v1のAPI台帳テーブル（SSOT未確定は **`[仮説]`** 明示）
  - SSOT未定義/矛盾の隔離（隔離→`Todo.md` 連動）
- **編集禁止領域**:
  - SSOTにない path/endpoint/ログ種別を **確定仕様として固定**すること
  - Policy判断を API/UX/Admin 側に分散する記述
  - reasonCode / nextAction enum の即興追加
- **更新ルール**:
  - `Path/Method/OperationId` を“確定仕様”にするには、SSOT（OpenAPI章）側の追記が必要
  - SSOTに未記載の要素は本文で固定せず、`[仮説]` とし、必要に応じて **「矛盾候補（隔離）」**と `Todo.md` に集約して停止する
- **変更履歴**:
  - 2026-01-08: 初版（SSOT準拠で“完全版”の台帳形式を導入。未確定は `[仮説]`）
- **関連リンク**: `SSOT_INDEX.md` / `Glossary.md` / `Guides.md` / `PolicyUxAdminMatrix.md` / `Todo.md`

---

## 背景

Parentyは「入口が複数でも、判断（Policy）・真実（Data）・ログ（監査）は一本」という憲法で動く。  
そのため API も **台帳（唯一の棚卸し表）**がないと、UX / Admin / Internal の境界が混ざって事故る。

---

## 説明

## 原則（固定）

SSOT参照: 2章 / 3章 / B-1 / 6-2Z / 7-3

- UXは判断しない / Adminも判断しない（Policyが唯一の判断主体）
- 全経路で `policyDecision` を生成し、DENYでもログを残す
- Admin系APIは `nextAction` を常時返却（NONE含む）
- 送信・保存は「送信口一本化」＋「保存側でも同制約を二重化」（裏口禁止）

---

## 1) 共通：コンベンション（台帳の前提）

| 項目 | 固定ルール |
|---|---|
| Base | `/ux/v1/*` と `/admin/v1/*` で系統分離（SSOT 3-3-1A/6-3）。`/health` と `/line/webhook` は公開 |
| Auth | UX: LINE user/household 紐付け / Admin: `admin_users`（SSOT準拠） |
| Policy | すべて `policyDecision` を生成（SSOT 付録B-1-1）。`policyTrace` を埋め込み（SSOT 付録B-1-2） |
| policyDecision | `{ result, reasonCodes[], primaryReason, templateId, nextAction?, policyTrace }`（DEGRADED/DENYはtemplateId必須、SSOT B-1-1/B-1-2） |
| Logs | `notifications` / `notification_deliveries` / `faq_logs` / `scenario_states` / `audit_logs` / `incident_records`（SSOT B-2） |
| Error | 未定義 reason → `UNKNOWN_REASON` に正規化し `DENY` + `nextAction.action=CREATE_INCIDENT`（SSOT fail-safe） |

注記:

- `policyTrace` は **ログコレクション名ではなく**、各ログへ埋め込む「再現性メタ」（PII禁止）である（SSOT B-1-2）。
- `audit_logs` は **append-only** かつ `actorType=admin/system/guardian`（SSOT 4️⃣ audit_logs）。

---

## 2) UX（ユーザー側）API 台帳（v1案）

※ `/health` と `/line/webhook` は SSOT 3-3-1A で確定。その他の `Path` は **`[仮説]`** として扱う。

| ID | 種別 | Method | Path | 目的 | Policy対象 | 主ログ | 備考 |
|---|---|---|---|---|---|---|---|
| UX-001 | Health | GET | `/health` | 稼働確認 | なし | なし | 既存運用（Cloud Run/CI） |
| UX-010 | Webhook入口 | POST | `/line/webhook` | LINEイベント受信 | 必須 | `faq_logs` / `notifications` | 入口はUX、判断はPolicyへ委譲 |
| UX-020 | FAQ要求 | POST | `[仮説]` `/ux/v1/faq` | メッセージ→回答生成 | 必須 | `faq_logs` | LLMはComposer内、Policy外出禁止（SSOT 3章） |
| UX-030 | 通知購読/設定 | POST/PUT | `[仮説]` `/ux/v1/settings` | 地域/子ども年齢帯/希望の更新 | 必須 | `audit_logs` | 監査は actorType=guardian を使用（SSOT 5-6G / 4️⃣ audit_logs） |
| UX-040 | ロードマップ取得 | GET | `[仮説]` `/ux/v1/roadmap` | 家庭の年間俯瞰 | 必須 | `[仮説]` 参照ログ | 表示もPolicyを通す（沈黙禁止UXと整合） |

---

## 3) Policy（内部）API 台帳（中枢 / v1案）

| ID | Method | Path | 目的 | 入力 | 出力 | ログ | 備考 |
|---|---|---|---|---|---|---|---|
| PE-001 | POST | `[仮説]` `/internal/policy/evaluate` | 判定（唯一の判断） | Context（`global_flags`/`household`/`plan`/`consent`/`requestType`等） | `policyDecision` | `policyTrace`（埋め込み）/（必要時）`audit_logs` | 実装形は内部モジュールでも可。**責務が重要** |

注記:

- `policy_logs` という独立コレクションはSSOT上で確定していないため、本台帳では **`[仮説]` 扱い**にし、基本は `policyTrace` の埋め込みで担保する（SSOT B-1-2）。

---

## 4) Delivery（送信/配送）API 台帳（“決定を変えない” / v1案）

| ID | Method | Path | 目的 | Policy必須 | ログ | 備考 |
|---|---|---|---|---|---|---|
| DL-001 | POST | `[仮説]` `/internal/delivery/send` | reply/push送信 | ALLOW/DEGRADEDのみ | `notifications` / `notification_deliveries` | 送信口は `sendLine` に一本化（既存） |
| DL-010 | POST | `[仮説]` `/internal/delivery/scenario/run` | シナリオ実行 | 必須 | `scenario_states` | `dedupeKey` / `traceId` 必須（SSOT方針） |

注記:

- `audit_logs` は admin/system 操作が対象（SSOT 4️⃣ audit_logs）。Deliveryが自動で `audit_logs` を書く前提は **本台帳では固定しない**。

---

## 5) Admin（管理UI/管理API）台帳（運用可能化 / v1案）

SSOT参照: 6-2Z（nextActionは常時返却）/ 6-2Y（RunbookLabel表示）/ 4️⃣ audit_logs

| ID | Method | Path | 目的 | 権限 | 返却の固定 | 主ログ | 備考 |
|---|---|---|---|---|---|---|---|
| AD-001 | POST | `[仮説]` `/admin/v1/auth/login` | 管理ログイン | admin | `[仮説]` nextAction含む | `audit_logs` | 認証方式はSSOT準拠に寄せる |
| AD-010 | GET | `[仮説]` `/admin/v1/dashboard` | ダッシュボード | admin | nextAction常時 | `admin_views/*`（派生） | 派生ビューは意思決定に使わない（SSOT方針） |
| AD-020 | GET/POST/PUT | `[仮説]` `/admin/v1/templates` | テンプレ管理 | admin | nextAction常時 | `audit_logs` | 断定・恐怖煽り等は管理UIで警告対象（SSOT方針） |
| AD-030 | POST | `[仮説]` `/admin/v1/stop` | 即時停止（GLOBAL/feature/tenant） | admin | nextAction常時 | `audit_logs` | 監査必須・理由必須（SSOT 7章導線） |
| AD-040 | GET | `[仮説]` `/admin/v1/audit-logs` | 監査閲覧 | admin | nextAction常時 | なし（参照） | UIはRunbookLabel常時表示（SSOT 6-2Y） |
| AD-050 | POST/PUT | `[仮説]` `/admin/v1/incidents` | インシデント作成/更新 | admin | nextAction常時 | `incident_records` | fail-safeの受け皿（CREATE_INCIDENT） |

---

## CI / 自動検査ルール（必須）

以下を満たさない場合、CIで失敗させる（思想は `tools/validate_docs.js` と同型）。

- APIが `policyDecision`（+ `policyTrace`）を生成していない
- Admin APIが `nextAction` を返していない（NONE含む）
- 未定義 reasonCode を保存しようとした
- `auditRequired=true` なのに `audit_logs` が無い（SSOT 6-2Y/6-2Z）

※ `tools/validate_api_registry.js` の導入可否は **`Todo.md`（T-API-004）**で判断する（本ドキュメントでは確定しない）。

---

## 結論

この API 台帳は、実装の自由度を **意図的に下げ**、運用の再現性を **最大化**し、AI実装（Cursor）と人間実装の **差を消す**ための設計制約装置である。  
仕様を足したい場合は、**APIを増やす前に本台帳（およびSSOT）を修正**すること。

---

## 補足

### 変更差分（本ファイル）

- **変更**: ユーザー提示の「完全版台帳」を本文へ採用し、SSOT未確定の箇所は **`[仮説]`** として明示
- **影響範囲**:
  - `Todo.md`（SSOT未確定/整合が必要な事項の起票が必須）
  - SSOTのOpenAPI章（paths/operationsを確定する場合）

---

## 矛盾候補（隔離）

### A) Path/Methodの確定（SSOT未定義）

- `/ux/v1/*` / `/admin/v1/*` / `/internal/*` / `/line/webhook` / `/health` 等のPathは **SSOTでpaths未確定**のため、本台帳では `[仮説]` 扱い
- 対応: `Todo.md` **T-API-002**

### B) 未定義のログ種別名

- `access_log` / `admin_view_log` 等のログ名は、現SSOTの正規ログ一覧（B-2）に無いため、採用するにはSSOTへ定義が必要
- 対応: SSOT追記（必要なら）＋命名/保存期間/PII制約の確定

### C) guardian操作の監査ログ（audit_logs）整合

- UX設定更新を `audit_logs` に書くかは、`audit_logs.actorType=admin/system` 固定（SSOT）と整合が必要
- 対応: `Todo.md` **T-API-003**
