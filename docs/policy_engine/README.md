# Policy Engine 入口

## 背景
- Policy Engine の仕様を分割し、参照点を固定する。

## 説明

### メタ
- Scope（責務）: Policy Engine 仕様の入口と参照導線
- Non-goals（やらないこと）: 実装詳細の記述
- Definitions（用語）: SSOT に準拠
- Assumptions（前提）: SSOT が正である
- Dependencies（依存）: `PARENTY_SSOT.md` / `PolicyUxAdminMatrix.md`
- Invariants（不変条件）: SSOT の定義を置き換えない
- Change Impact（変更波及）: decision_model / reason_codes / matrix / ops
- Open Questions（未決）: なし
- Acceptance（受入条件）: 参照導線がリンク切れなし
- 参照元: `docs/SPEC_INDEX.md`
- 参照先: `decision_model.md` / `reason_codes.md` / `watch_rules.md`

### 本文
- Policy Engine の判断モデルは `decision_model.md` に集約する。
- reasonCode の再整形は `reason_codes.md` に集約する。
- reasonCodeIndex の導線は `reason_code_index.md` に集約する。
- runPolicy context の導線は `run_policy_context.md` に集約する。
- Watch Rules の導線は `watch_rules.md` に集約する。

## 結論
- Policy Engine の仕様入口は本ファイルに固定する。

## 補足
- 参照粒度は `decision_model.md` / `reason_codes.md` に固定する。
