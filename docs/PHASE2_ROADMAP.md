# PHASE2_ROADMAP（Policy Engine）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。

## メタ（固定）

- **SSoT責務**: Phase 2 の実装順序を、SSOT参照で固定する（新仕様は追加しない）。
- **想定読者**: Engineer / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（3章 / 6-2X / 6-2Z / 7章 / 付録B / 付録C）
- **参照導線**: `PolicyUxAdminMatrix.md` / `docs/policy_engine/decision_model.md` / `docs/policy_engine/reason_codes.md`
- **更新ルール**: 判断が必要なら `Todo.md` に記録して停止する。

---

## 背景

Phase 2 は Policy Engine の判断モデルと出力整合を SSOT に固定し、後続のUX/運用に誤読が出ない状態を作る工程である。

---

## 説明

### 1) 対象スコープ（固定）

- **Policy Engine 中核**: SSOT 3章
- **reasonCodes 正**: 付録B
- **nextAction 正**: 6-2Z
- **nextAction マッピング**: 6-2X
- **Runbook 接続**: 7章
- **policyTrace / PII**: SSOT 3-0-1 / 7-3
- **参照実装**: `backend/src/policy/decision_shape.js` / `backend/src/policy/engine.js`

### 2) 作業順序（参照導線）

1. **入力境界の固定**
   - SSOT 3-B の評価順（global_flags / households.flags / feature switches / plan / consents / risk / context/ops）に限定する。
   - 参照実装: `backend/src/policy/input_normalizer.js`
   - 参照導線: `backend/src/policy/input_sources.js`
2. **出力形状の固定**
   - SSOT 3-0-1 の必須項目（result / reasonCodes / primaryReason / nextAction / policyTrace）を形状ガードで固定する。
3. **reasonCodes 正規化**
   - 付録Bの正式コードのみを保存する（UNKNOWN_REASON への正規化を許容）。
   - 参照実装: `backend/src/policy/reason_code_normalizer.js`
   - 参照導線: `backend/src/policy/reason_code_index.js`
   - 参照パスは `POLICY_REASON_CODE_INDEX_PATH` を使用する。
   - 参照ドキュメント: `docs/policy_engine/reason_code_index.md`
   - 配置例: `backend/reason_code_index.json`
4. **nextAction の接続**
   - 6-2X の RowId と 6-2Z の enum に一致させる。
   - 参照実装: `backend/src/policy/next_action_enforcer.js`
   - 実行時に `enforceNextAction` を明示的に有効化する。
   - 参照ドキュメント: `docs/policy_engine/run_policy_context.md`
5. **policyTrace のPII禁止**
   - PIIを含めず、再現性メタのみを保持する（SSOT 3-0-1 / 7-3）。
   - 参照実装: `backend/src/policy/policy_trace.js`
   - inputsDigest は「入力キー＋件数」のみで構成する。
6. **RunbookLabel の参照**
   - 7章の見出しを正とし、独自追加はしない。
7. **形状検証の実行**
   - `policy:decision-validate` により `policyDecision` の形状を確認する。
8. **最小実行の着手（Phase2実装開始）**
   - SSOT 3-0-1 に従い、decision の出力が形状ガードを通過することを確認する。
   - 参照実装: `backend/src/policy/evaluator.js` / `backend/src/policy/engine.js`
   - STOP系のみ短絡可（SSOT 3-B / 付録B）
   - ruleVersion は `pe:vX.Y.Z` 形式に固定（SSOT 3-0-1 の表記に従う）
9. **primaryReason 決定規則の固定**
   - 付録Bの category 優先順に従う（SSOT 3-C）。
   - 参照実装: `backend/src/policy/primary_reason.js`

### 3) ブロッカー（判断待ち）

- `Todo.md` の未解決事項が残る場合は作業を停止する。
- APIパス確定は `Todo.md` の T-API-002 に従う（SSOT 3-3-1A 予約枠）。

---

## 進捗メモ（非仕様）

- 完了確認: 入力境界の固定（`backend/src/policy/input_normalizer.js` / `backend/src/policy/input_sources.js`）
- 完了確認: 出力形状の固定（`backend/src/policy/decision_shape.js`）
- 完了確認: reasonCodes 正規化と参照導線（`backend/src/policy/reason_code_normalizer.js` / `backend/src/policy/reason_code_index.js` / `backend/reason_code_index.json`）
- 完了確認: nextAction 接続の入口と導線（`backend/src/policy/next_action_enforcer.js` / `docs/policy_engine/run_policy_context.md`）
- 完了確認: policyTrace のPII禁止方針（`backend/src/policy/policy_trace.js`）
- 完了確認: 形状検証の実行（`backend/tools/policy_decision_validate.js`）
- 完了確認: 最小実行入口（`backend/src/policy/evaluator.js` / `backend/src/policy/engine.js`）
- 完了確認: primaryReason 決定規則（`backend/src/policy/primary_reason.js`）

- 完了確認: RunbookLabel 参照の固定（`docs/policy_engine/decision_model.md`）

- 残り: なし

---

## 結論

Phase 2 は SSOT 3章と付録B/付録C/6-2X/6-2Z/7章に従属させ、判断モデルの正を固定する。

---

## 補足

- 完了条件は `ImplementationPlan.md` の Phase 2 に従う。
- 形状検証は `backend/tools/policy_decision_validate.js` を使う。
