# Policy Engine 判断モデル

## 背景
- Policy Engine の判断モデルを参照可能な単位で分割する。

## 説明

### メタ
- Scope（責務）: 判断モデルの入出力と参照導線
- Non-goals（やらないこと）: 新しい判定条件の追加
- Definitions（用語）: SSOT の用語に準拠
- Assumptions（前提）: SSOT に定義済みのモデルを参照する
- Dependencies（依存）: `PARENTY_SSOT.md` / `PolicyUxAdminMatrix.md`
- Invariants（不変条件）: reasonCode / nextAction / policyDecision を再定義しない
- Change Impact（変更波及）: UX仕様 / Runbook / matrix
- Open Questions（未決）: なし
- Acceptance（受入条件）: SSOT 3章の参照リンクが明示される
- 参照元: `docs/policy_engine/README.md`
- 参照先: `docs/policy_engine/reason_codes.md` / `docs/policy_engine/reason_code_index.md` / `docs/policy_engine/run_policy_context.md` / `docs/matrix/policy_x_ux_x_adminui.md`

### 本文
- 判断モデルの正は SSOT 3章に固定する。
- 参照箇所: `PARENTY_SSOT.md` 3-0 / 3-0-1 / 3-A / 3-B / 3-3-1 / 6-2X / 6-2Z / 7-2 / 付録B / 付録C
- 参照実装（Phase2準備）: `backend/src/policy/decision_shape.js` / `backend/src/policy/engine.js` / `backend/src/policy/evaluator.js` / `backend/src/policy/input_normalizer.js` / `backend/src/policy/input_sources.js` / `backend/src/policy/policy_trace.js` / `backend/src/policy/reason_code_classifier.js` / `backend/src/policy/reason_code_normalizer.js` / `backend/src/policy/reason_code_index.js` / `backend/src/policy/primary_reason.js` / `backend/src/policy/next_action_enforcer.js`
- 入力境界の参照導線: SSOT 3-B の評価順に固定する（`backend/src/policy/input_sources.js`）
- STOP短絡は付録Bの category=STOP のみに限定する（SSOT 3-B）。
- ruleVersion は `pe:vX.Y.Z` 形式の文字列に固定する（SSOT 3-0-1 の表記に従う）。
- reasonCodes は付録Bに正規化し、未定義は UNKNOWN_REASON に正規化する。
- primaryReason は付録Bの category 優先順で決定する（SSOT 3-C）。
- reasonCodeIndex は付録Bの参照導線として読み込む（`backend/src/policy/reason_code_index.js`）。
- nextAction の制約は 6-2Z/6-2X に従って検証する（`backend/src/policy/next_action_enforcer.js`）。
- RunbookLabel は SSOT 7章の見出しを正とし、独自追加はしない。
- reasonCodeIndex の参照パスは `POLICY_REASON_CODE_INDEX_PATH` を用いる。

## 結論
- 判断モデルは SSOT への参照導線のみを持つ。

## 補足
- 入出力の一覧は SSOT 3-0-1 に準拠する。
