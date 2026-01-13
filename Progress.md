## Progress（進捗の集約記録）

## メタ（固定）

- **SSoT責務**: 進捗の集約記録（他ファイルへ分散させない）。
- **想定読者**: 全員
- **依存SSoT**: `PARENTY_SSOT.md`（工程の前提はSSOT準拠）
- **生成物**: Phaseステータス + 合意済み判断ログ
- **編集禁止領域**:
  - “進捗”を他ファイルへ分散すること
  - 未承認の仕様変更を“決定ログ”として確定させること
- **更新ルール**:
  - 判断待ちは `Todo.md`、合意済みは本ファイルへ記録する
  - PhaseのStatus更新はここだけ
- **変更履歴**:
  - 2026-01-07: 形式統一（メタを追加）
  - 2026-01-08: API活用仕様（付録F）追加に伴い更新ログを追記

---

## 背景

進捗を一箇所に固定し、意思決定と実装開始の境界を明確にする。

---

## 説明

## 0. ステータス定義（固定）

- NOT_STARTED
- IN_PROGRESS
- BLOCKED
- DONE

---

## 1. Phase ステータス

| Phase | 内容 | Status |
| --- | --- | --- |
| Phase 0 | 設計固定・ドキュメント整備 | DONE |
| Phase 1 | 基盤（Auth / Firestore / Security Rules） | NOT_STARTED |
| Phase 2 | Policy Engine | NOT_STARTED |
| Phase 3 | Delivery / UX（LINE導線・送信口一本化） | NOT_STARTED |
| Phase 4 | Admin UI / Admin API | NOT_STARTED |
| Phase 5 | 監査・障害対応・ローンチ手順 | NOT_STARTED |

---

## 2. 未解決質問（Todoへのリンク）

- `Todo.md` を参照（未解決あり）

---

## 3. 合意済み（判断ログ）

- T-001: 6-2X RowId（MappingRowId）を **導入**（RowId採番して主キー化）
- T-002: 7章 runbookLabel を **全文列挙**（SSOTに存在する7章の全見出しを列挙）
- T-005: 子ども属性は **年齢帯までに固定**（追加しない）
- T-003: **[仮説] 法務レビューは未実施。TODO: 判断待ちとして記録。**（ドグマは当面SSOTの現状維持）

- T-006/T-007/T-008: 「v1では導入しない」を撤回（追加拡張の検討に戻す）
- T-006: v1で **`sources + reviews + ops_configs` を導入**（ユーザー回答: C）
- T-006: 更新主体は **system のみ**（adminは提案→system反映、audit_logs必須）（ユーザー回答: a）
- T-011: RAESは星評価/順位の **保存は許可（UX非表示）**、BIAS_SUSPECT の運用トリガ拡張は **しない（commercialFlagのみ）**
- T-012: IRSは vendorId/businessId/rating を保存せず、管理UIは個票非表示（集計のみ）、広告/送客/成約分析に使わない
- T-012: `insightKind` / `userAction` は **SSOTでenum固定（allowlist）**し、未定義値は保存禁止
- T-013: SSOT 1-4-3（外部への販売・共有禁止）は **維持**し、外部提供は「Derived Insight（データではない）」の新カテゴリとして **SSOT追記案をTODO化**して検討
- T-013: Derived Insight を **SSOT 1-4配下（1-4-3-A）に新設**（禁止は維持、例外ではなく別カテゴリ）。付録Aへ定義転載し参照導線を固定

---

## 5. Vendorマッチング統合（状態）

- 状態: **BLOCKED**
- ブロッカー: `Todo.md` の **T-009**（`VENDOR_*` の扱い（category/primaryReason/ALLOW時付与）と、PII/保存方針/運用導線の確定）

---

## 4. v1（Phase 1〜5）に入れる最適化の確定

### v1 MUST（ローンチ条件）

- M-001: fail-safe の完全統一（全経路で UNKNOWN_REASON → DENY + nextAction.action=CREATE_INCIDENT + [7-2-1]）
- M-002: テンプレ運用の最短導線（RISK_TEMPLATE_HIGH 等→DISABLE_TEMPLATE、操作は audit_logs 追記専用）
- M-003: FAQログのマスキング品質（生PII保存禁止を“守り切る”ための処理・監査）
- M-004: nextAction 駆動の運用（管理UI/運用者は 6-2X/6-2Y/6-2Z 以外で判断しない）
- M-005: DEGRADED/DENY UXの構造統一（文言は付録Cテンプレ参照のみ、沈黙禁止）
- M-006: FAQ/回答の末尾を「次にできること」固定で接続（公式確認手順/問い合わせテンプレ/設定導線）
- M-007: FAQ/通知→ロードマップ要素への接続を実装（家庭SSOT体験の幹を太くする）

### v1 SHOULD（余力があれば）

- S-001: admin_views の最小実装（dashboard_daily / alerts_active のみ、意思決定には使わない）

### POST（ローンチ後）

- P-001: household_health 等の派生ビュー強化（運用が回った後に段階導入）

---

## 結論

- PhaseのStatusと合意済み判断ログは本ファイルに集約する。

---

## 補足

### 更新ログ（設計固定フェーズ）

- 2026-01-08:
  - SSOTに付録F（External API 共通原則 + API台帳）を追加し、**公式根拠URL未確定のAPIは実装禁止**を明文化
  - 付録B/6-2Xの整合修正（RISK_POLICY_PROHIBITED追加、INSIGHTカテゴリ整合、templateId=null許容ルール）
  - `Todo.md` に T-API-001（公式根拠URL確定）を追加

- 2026-01-09:
  - SSOT_INDEX に基盤6原則を追加（責務・失敗・権限・データ・外部依存・将来予約）
