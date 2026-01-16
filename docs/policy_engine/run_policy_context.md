# runPolicy context（参照導線）

## 背景
- Policy Engine の実行コンテキストを固定し、判定の責任範囲を曖昧にしない。

## 説明

### メタ
- Scope（責務）: runPolicy の context 入力の参照導線
- Non-goals（やらないこと）: 権限モデルの追加 / 判定基準の新設
- Definitions（用語）: SSOT の用語に準拠
- Assumptions（前提）: SSOT が唯一の正である
- Dependencies（依存）: `PARENTY_SSOT.md` 3章 / 6-2X / 6-2Z
- Invariants（不変条件）: SSOTの定義を置き換えない
- Change Impact（変更波及）: policy / ops
- Open Questions（未決）: なし
- Acceptance（受入条件）: context の項目が明示される
- 参照元: `docs/policy_engine/README.md`
- 参照先: `docs/policy_engine/decision_model.md`

### context 項目（参照）

- `reasonCodeIndex`:
  - 付録B由来の参照データ
  - 直接注入する場合に使用
- `reasonCodeIndexPath`:
  - ファイルパス（`POLICY_REASON_CODE_INDEX_PATH` と同義）
- `enforceNextAction`:
  - `true` のとき `nextAction` の制約検証を有効化
- `role` / `roles`:
  - requiresRole 判定の参照値
- `hasReason`:
  - requiresReason 判定の参照値
- `auditLogged`:
  - auditRequired 判定の参照値

### 運用条件（固定）

- `enforceNextAction` は 6-2Z の制約検証を行う場面のみ `true` にする。
- 管理UI/運用の判断で `audit_logs` を必須とする経路では `auditLogged=true` を渡す。
- 監査不要な経路では `enforceNextAction=false` とする。

### 参照実装

- `backend/src/policy/engine.js`
- `backend/src/policy/next_action_enforcer.js`
- `backend/src/policy/reason_code_index.js`

## 結論
- context は参照導線であり、正は SSOT に固定する。

## 補足
- context の追加は SSOT 改定に従属する。
