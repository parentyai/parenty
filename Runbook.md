## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: RunbookLabel と nextAction の接続を、SSOT参照で固定する（運用導線の唯一の参照導線）。
- **想定読者**: Ops / Engineer(Cursor)
- **依存SSoT**: `PARENTY_SSOT.md`（6-2X/6-2Y/6-2Z/7章）
- **生成物**: RunbookLabel一覧と、6-2X（RowId）との対応導線
- **編集禁止領域**:
  - runbookLabelの独自追加（SSOT 7章の変更なしで増やさない）
  - nextAction（6-2Z）外の操作の本文追加
- **更新ルール**: 未確定・衝突は本文に入れず「矛盾候補（隔離）」へ。判断が必要なら `Todo.md` へ記録して停止。
- **変更履歴**:
  - 2026-01-07: 形式統一（メタ/背景/説明/結論/補足/隔離）
  - 2026-01-08: External API Compliance Watch（付録F-6）をRunbookに接続
- **関連リンク**: `SSOT_INDEX.md` / `Glossary.md` / `Guides.md`

---

## 背景

- Runbookは運用者の判断を“迷わせない”ための固定導線であり、SSOT 6-2Y/7章に従う必要がある。

---

## 説明

### 参照の正（SSOT）

- `PARENTY_SSOT.md`
  - 6-2X（primaryReason→nextAction）
  - 6-2Y（RunbookLabel/UI埋め込み/返却ルール）
  - 6-2Z（nextAction schema + enum）
  - 7-1 / 7-2 / 7-3（運用/障害/監査）

---

## 1. RunbookLabel 一覧（全文：SSOTに存在する7章の全見出し）

SSOT: 6-2Y / 7章

- **[7-1-0]**: 前提思想（Non-Negotiable）
- **[7-1-2]**: 日次運用・統一チェックリスト（唯一の運用表）
- **[7-2-1]**: インシデント作成（CREATE_INCIDENT）
- **[7-2-2]**: 配送失敗（RETRY_DELIVERY）
- **[7-2-3]**: 即時停止フェーズ（最優先）
- **[7-2-4]**: 体験情報源の誤解・炎上・虚偽対応（Experience Source）
- **[7-2-5]**: RAES（Review Aggregated Experience Source）対応
- **[7-3-3]**: 保存期間ポリシー（固定）

---

## 2. 6-2X RowId との対応

SSOT: 6-2X / 6-2Y

本リポジトリでは **6-2X-1の行が唯一の対応表**であり、RowId（MappingRowId）は **主キー**として採番済み。

### 2-1. RowId→RunbookLabel（例）

- `M6-2X-0006`（SYSTEM_ERROR）→ `[7-2-1]`（CREATE_INCIDENT）
- `M6-2X-0010`（DELIVERY_FAILURE）→ `[7-2-2]`（RETRY_DELIVERY）
- `M6-2X-0001`（GLOBAL_STOP_ACTIVE）→ `[7-2-3]`（STOP）

---

## 3. UI / API / audit_logs への埋め込みルール

SSOT: 6-2Y / 6-2Z / 7-3

### 3-1. UI表示（禁止事項含む）

- 管理UIは [7-x-y] を **常時表示**（隠す/折りたたむ/コピー不可は禁止）

### 3-2. API返却

- 管理UI系APIは **常に nextAction を返却**（NONEを含む）

### 3-3. audit_logs

- `auditRequired=true` の操作は **必ず audit_logs 記録**
- `requiresReason=true` の操作は **理由必須**
- audit_logs は append-only（更新/削除禁止）

---

## 4. 運用の停止条件

- SSOTと矛盾する運用判断が必要になった場合 → **Todo.md に記録して停止**

---

## 5. External API Compliance Watch（規約/仕様/価格変更の監視）

SSOT: 付録F-6 / 7-2-1

- **監視対象**: `APIRegistry_External.md` の `monitoringTargets`
- **頻度**: 週次（固定）
- **検知時（自動更新禁止）**:
  - `incident_records` を作成（RunbookLabel=[7-2-1]）
  - `Todo.md` に起票（対象apiId / URL / 検知日 / 影響）
  - 人間承認があるまで SSOT/実装を更新しない
- **スナップショット/レポート格納**:
  - `docs/api_watch/snapshot.json`（常に上書き）
  - `docs/api_watch/report.md`（常に上書き）

---

## 結論

- RunbookLabel は SSOT 7章の見出しを正とし、nextAction は 6-2X/6-2Z に従って運用導線を固定する。

---

## 補足

### 変更差分（本ファイル）

- **変更**: External API Compliance Watch（付録F-6）をRunbookへ接続（監視→incident→todo を固定）

---

## 矛盾候補（隔離）

### Vendorマッチング（未確定）

参照: `Todo.md`（T-009）- 追加が必要になる可能性が高いRunbook領域（未確定）:
  - 虚偽・誤掲載・不正（Vendor情報の停止/修正）
  - 問い合わせ導線の不具合（配送失敗/重複送信）
  - 苦情/紛争（監査ログの確保・停止判断）
- 現行SSOTとの整合性チェック（記述）:
  - vendor関連 reasonCode が付録Bに無い状態で実装すると fail-safe で incident 化される
  - runbookLabelを増やす場合は 6-2Y の表示/埋め込み規約にも影響する

