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
| Phase 1 | 基盤（Auth / Firestore / Security Rules） | DONE |
| Phase 2 | Policy Engine | IN_PROGRESS |
| Phase 3 | Delivery / UX（LINE導線・送信口一本化） | DONE |
| Phase 4 | Admin UI / Admin API | IN_PROGRESS |
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
- M-008: admin_views の最小実装（dashboard_daily / alerts_active のみ、意思決定には使わない）

### v1 SHOULD（余力があれば）

- なし

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

- 2026-01-14:
  - Firestore Rules / Index の参照導線を実装成果物に接続（`firestore.rules` / `firestore.indexes.json`）
  - LINE webhook ログのPIIをマスキング（hash + text length）
  - Firestore Rules / Index を Firebase へ反映（default database）
  - Firestore Index 監査：Firebase 上の定義が `firestore.indexes.json` と一致
  - Auth 適用開始：非公開エンドポイントは Firebase ID Token 必須
  - Firestore Rules 監査（dry-run）：`firestore.rules` のコンパイル成功を確認
  - Firestore コレクション入口の照合完了（`docs/data_dictionary/*/README.md` と `backend/src/firestore/collections.js`）
  - Firestore 参照導線を SSOT に再同期（`roadmaps` / `review_fragments` / `review_usage_logs`）
  - Firestore Rules に review_fragments / review_usage_logs を追加
  - Firestore の最小リポジトリ骨格を追加（`backend/src/firestore/repository.js`）
  - Firestore preflight でリポジトリ経由の参照入口を確認
  - 保持・PII運用チェックの対象コレクションをRunbookに明記
  - audit_logs の最小データ層入口を追加（`backend/src/firestore/audit_logs.js`）
  - audit_logs の必須項目をデータ層で形状検証（`backend/src/firestore/audit_logs.js`）
  - TTL運用チェックの導線をRunbookに追加（SSOT 7-3-3 参照）
  - FAQログのマスキング入口を追加（`backend/src/firestore/faq_logs.js`）
  - ログ本文のマスキング関数を追加（`backend/src/logging/text_masker.js`）
  - notifications の必須項目をデータ層で形状検証（`backend/src/firestore/notifications.js`）
  - notification_deliveries の必須項目をデータ層で形状検証（`backend/src/firestore/notification_deliveries.js`）
  - TTL運用の実手順をRunbookに追記
  - insight_reactions の参照導線をSSOTに再同期（辞書/Rules/refs）
  - Firestore TTLポリシーを設定（audit_logs / notification_deliveries / faq_logs / experience_usage_logs / review_usage_logs / insight_reactions / incident_records）
  - incident_records の必須項目をデータ層で形状検証（`backend/src/firestore/incident_records.js`）
  - incident_records と audit_logs の最小連動入口を追加（`backend/src/firestore/system_ops.js`）
  - incident_records と audit_logs の実運用入口を追加（`backend/tools/incident_with_audit.js`）
  - incident/audit 実行スクリプトを追加（`backend/package.json`）
  - incident/audit 実行サンプルを追加（`backend/tools/incident_with_audit.sample.json`）
  - incident/audit の同時記録を実行確認（Firestore への書き込み成功）
  - ログ系のrawText/rawPrompt混入をデータ層で拒否（`backend/src/logging/pii_guard.js`）
  - Runbook に audit_logs の最小確認導線を追加（`Runbook.md`）
  - Phase 1 ロードマップに進捗メモと次フェーズ導線を追加（`docs/PHASE1_ROADMAP.md`）
  - Phase 2 ロードマップに進捗メモを追加（`docs/PHASE2_ROADMAP.md`）
  - ImplementationPlan に Phase 1 完了メモを追加（`ImplementationPlan.md`）
  - Policy Engine の RunbookLabel 参照固定を追加（`docs/policy_engine/decision_model.md`）
  - experience_usage_logs / review_usage_logs / insight_reactions のデータ層ガードを追加（`backend/src/firestore/*.js`）
  - Policy Engine が reasonCodeIndex 必須で動作するように固定（`backend/src/policy/engine.js`）
  - 中核マトリクスの参照導線を SSOT 起点に固定（`docs/matrix/policy_x_ux_x_adminui.md`）
  - 状態別UX導線を SSOT 参照に固定（`docs/ux_spec/state_based/README.md`）
  - reasonCode→Runbook 導線を SSOT 参照に固定（`docs/ops/reasoncode_driven_runbook.md`）
  - Phase 3 ロードマップを追加（`docs/PHASE3_ROADMAP.md`）
  - 送信口の一本化として sendLine 入口を追加（`backend/src/delivery/send_line.js`）
  - LINE reply を sendLine 経由に統一（`backend/src/line/reply.js`）
  - UX状態と文言の参照導線を SSOTに固定（`docs/ux_spec/state_based/README.md` / `docs/PHASE3_ROADMAP.md`）
  - Phase 3 接続点の参照導線を固定（`docs/matrix/policy_x_ux_x_adminui.md`）
  - 配送ログの必須項目を SSOTに合わせて固定（`backend/src/firestore/notification_deliveries.js`）
  - Firestore データ層の入口集約を追加（`backend/src/firestore/index.js`）
  - Policy Engine 参照導線を確定（`docs/policy_engine/decision_model.md` / `docs/policy_engine/reason_codes.md`）
  - PIIマスキング処理をログ入口へ集約（`backend/src/logging/line_sanitizer.js`）
  - Policy Decision の入力形状ガードを追加（`backend/src/policy/decision_shape.js`）
  - 保持/PIIの運用チェック導線を追加（`Runbook.md` 6章）
  - Policy Decision の最終化入口を追加（`backend/src/policy/engine.js`）
  - Firestore preflight 成功（projectId=parenty / databaseId=(default)）
  - Phase 2 ロードマップを追加（`docs/PHASE2_ROADMAP.md`）
  - Policy Decision 形状の検証ツールを追加（`backend/tools/policy_decision_validate.js`）
  - Policy Engine の最小実行入口を追加（`backend/src/policy/evaluator.js` / `backend/src/policy/engine.js`）
  - Policy Decision 形状検証を実施（`backend/tools/policy_decision_sample.json` で ok）
  - DENY/DEGRADED は templateId 必須で固定（`backend/src/policy/decision_shape.js`）
  - templateId を reasonCodeIndex 参照で固定（`backend/src/policy/evaluator.js`）
  - policyDecision サンプルの templateId を付録C参照に更新（`backend/tools/policy_decision_sample.json`）
  - Policy Engine 入力境界を整備（`backend/src/policy/input_normalizer.js`）
  - Policy Engine 入力参照導線を追加（`backend/src/policy/input_sources.js`）
  - Policy Engine 評価順の骨格を追加（`backend/src/policy/evaluator.js`）
  - Policy Trace 生成を追加（`backend/src/policy/policy_trace.js`）
  - STOP短絡を付録B category=STOP に限定（`backend/src/policy/reason_code_classifier.js`）
  - policyTrace の inputsDigest を「入力キー＋件数」で固定（`backend/src/policy/policy_trace.js`）
  - STOP短絡の入力を reasonCodes 配列に限定（`backend/src/policy/evaluator.js`）
  - ruleVersion の表記を `pe:vX.Y.Z` 形式に固定（`backend/src/policy/policy_trace.js`）
  - reasonCodes の正規化を追加（`backend/src/policy/reason_code_normalizer.js`）
  - primaryReason の決定規則を追加（`backend/src/policy/primary_reason.js`）
  - reasonCodeIndex の参照導線を追加（`backend/src/policy/reason_code_index.js`）
  - nextAction 制約の検証入口を追加（`backend/src/policy/next_action_enforcer.js`）
  - reasonCodeIndex の参照パスを追加（`POLICY_REASON_CODE_INDEX_PATH`）
  - nextAction 制約の任意適用を追加（`backend/src/policy/engine.js`）
  - reasonCodeIndex 生成導線を追加（`docs/policy_engine/reason_code_index.md`）
  - runPolicy context の導線を追加（`docs/policy_engine/run_policy_context.md`）
  - reasonCodeIndex の配置を固定（`backend/reason_code_index.json`）
  - enforceNextAction の運用条件を固定（`docs/policy_engine/run_policy_context.md`）
  - reasonCodeIndex 生成手順を固定（`docs/policy_engine/reason_code_index.md`）
  - Cloud Run 環境変数に reasonCodeIndex 参照パスを追加（`docs/DEPLOY_CLOUD_RUN.md`）
  - Phase 2 着手：Policy Engine 骨格の参照導線を整備（decision_shape / engine）

- 2026-01-15:
  - Phase 3 の断定防止を固定（`backend/src/policy/decision_shape.js` / `backend/src/policy/evaluator.js`）
  - Phase 4 ロードマップを追加（`docs/PHASE4_ROADMAP.md`）
  - OpenAPI の最小エンドポイントを SSOT に固定（`PARENTY_SSOT.md` 3-3-1A）
  - audit_logs の actorType に guardian を追加（`PARENTY_SSOT.md` 4️⃣ audit_logs）
  - trustScore の用途導線を Glossary に追加（`Glossary.md`）
  - API Registry の Path 検証を追加（`tools/validate_api_registry.js` / `docs/INTEGRITY_CHECKLIST.md`）
  - LLM出力構造を「結論→根拠→補足」に固定（`PARENTY_SSOT.md`）
  - v1に admin_views 最小実装を含める決定（`Progress.md` v1 MUST）
  - 管理UIアラート対象 reasonCode を固定（`PARENTY_SSOT.md` 6-0M1-1）
  - 外部APIの公式根拠URLを確定（403等は手動監視へ移行）
