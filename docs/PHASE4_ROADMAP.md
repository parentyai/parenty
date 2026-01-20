# PHASE4_ROADMAP（Admin UI / Admin API）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。

## メタ（固定）

- **SSoT責務**: Phase 4 の実装順序を、SSOT参照で固定する（新仕様は追加しない）。
- **想定読者**: Engineer / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（6-0 / 6-2X / 6-2Y / 6-2Z / 7章）
- **参照導線**: `PolicyUxAdminMatrix.md` / `ADMIN_UX_API_DECISION_MAP_7.md` / `Runbook.md`
- **更新ルール**: 判断が必要なら `Todo.md` に記録して停止する。

---

## 背景

Phase 4 は Admin UI / Admin API の運用可能化を、SSOTの判断モデルと監査導線に固定する工程である。

---

## 説明

### 1) 対象スコープ（固定）

- **Admin UI / Admin API**: SSOT 6-0
- **nextAction の正**: SSOT 6-2Z
- **nextAction マッピング**: SSOT 6-2X / 6-2Y
- **Content Artifact / Content Registry**: SSOT 1-6 / 4-2-b
- **編集再発信（Editorial Engine）**: SSOT 1-6 / 4-2-b / 7-3
- **City Pack 承認ログ**: SSOT 4-2-b / 7-3
- **City Pack Watch State**: SSOT 5-8 / 4-2-b
- **監査ログ**: SSOT 7章（append-only）
- **参照導線**: `PolicyUxAdminMatrix.md` / `ADMIN_UX_API_DECISION_MAP_7.md`

### 2) 作業順序（参照導線）

1. **Admin 操作の接続点を固定**
   - 参照: `PolicyUxAdminMatrix.md`
   - 6-2X / 6-2Y の RowId と整合していることを確認する。
2. **nextAction の常時返却を固定**
   - 参照: `PARENTY_SSOT.md` 6-2Z
   - UI側で解釈しない前提で接続する。
3. **audit_logs の append-only を固定**
   - 参照: `PARENTY_SSOT.md` 7章 / `Runbook.md`
   - 管理操作は必ず監査に残す導線のみを持つ。
4. **Content Registry の承認ゲート接続**
   - 参照: `PARENTY_SSOT.md` 1-6 / 4-2-b
   - `contentId` と `killFlag` の参照導線を固定する。
5. **編集再発信 / City Pack の監査導線**
   - 参照: `PARENTY_SSOT.md` 4-2-b / 7-3
   - `content_publication_logs` / `city_pack_generation_logs` を監査導線に接続する。
6. **City Pack Watch State の参照導線**
   - 参照: `PARENTY_SSOT.md` 5-8 / 4-2-b
   - `city_pack_watch_states` を管理UIの参照導線に接続する。

### 3) Phase4 v1（City Pack / Editorial / Delivery 最小成立）

**City Pack v1（1都市・3項目）**
- 都市: NYC（検証導線が明確で運用確認しやすい）
- 項目（contentId / templateId / 本文）
  1) `cp_nyc_school_calendar_v1` / `tpl_cp_nyc_school_calendar_v1`  
     本文: 「NYCの学校カレンダーに更新があるかを確認し、必要時は公式導線を案内します。」
  2) `cp_nyc_emergency_alert_v1` / `tpl_cp_nyc_emergency_alert_v1`  
     本文: 「NYCの緊急情報に変更があるかを確認し、必要時は公式導線を案内します。」
  3) `cp_nyc_admin_update_v1` / `tpl_cp_nyc_admin_update_v1`  
     本文: 「NYCの行政手続きに関する更新があるかを確認し、必要時は公式導線を案内します。」
- [仮説] 参照元URLは管理UIで登録し、本文には混在させない。

**Editorial v1（下書き→承認→配信）**
- 下書きテンプレ例（承認前）
  - `tpl_editorial_nyc_update_v1`  
    本文: 「NYCで確認された更新を短く整理しました。公式導線のみを案内します。」
- 送信は `contentId` 経由のみ、承認後に Delivery Engine へ渡す。

**Delivery / UX（最小接続）**
- Opt-in 文面（contentId / templateId）
  - `cp_nyc_optin_prompt_v1` / `tpl_cp_nyc_optin_prompt_v1`  
    本文: 「NYCの都市パックを受け取りますか？」
- 変更ログ（1行表示）
  - `cp_nyc_update_digest_v1` / `tpl_cp_nyc_update_digest_v1`  
    本文: 「最近追加された情報があります。」

### 4) Derived Insight 非実装方針（固定）

- Phase4では Derived Insight を保存しない。
- スキーマ追加 / Firestore保存 / 実装は行わない。
- `tools/schema_check.js` の WARN は意図的に維持する（SSOT汚染回避 / 価値線非該当）。
- 着手フェーズは Phase5 とし、SSOT定義と監査導線確定後にHARD化を検討する。

### 5) ブロッカー（判断待ち）

- `Todo.md` の未解決事項が残る場合は作業を停止する。

---

## 進捗メモ（非仕様）

- 完了確認: Admin API の最小入口（`/admin/v1/views/:viewId`）
- 完了確認: audit_logs の追加入口（`/admin/v1/audit-logs`）
- 完了確認: incident_records + audit_logs 同時記録入口（`/admin/v1/incidents`）
- 完了確認: nextAction 生成の決定的マッピング（6-2X / 6-2Y 準拠）
- 残り: UI接続（表示・操作導線の接続）
- 残り: Content Registry / 編集再発信 / City Pack 承認ログの導線固定
- 残り: City Pack Watch State の表示導線固定
- 注意: nextAction マッピングは一旦撤回し、現状は action=NONE の返却のみ。

---

## 結論

Phase 4 は SSOT 6章 / 7章を正とし、Admin UI / Admin API の運用導線を固定する。

---

## 補足

- 完了条件は `ImplementationPlan.md` の Phase 4 に従う。
