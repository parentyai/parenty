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
- Open Questions（未決）: TODO
- Acceptance（受入条件）: SSOT 参照リンクが明示される
- 参照元: `docs/policy_engine/README.md`
- 参照先: `docs/policy_engine/reason_codes.md` / `docs/matrix/policy_x_ux_x_adminui.md`

### 本文
- [仮説] 判断モデルの詳細は SSOT 3章に集約されている。
- TODO: SSOT の該当節への参照を確定する。

## 結論
- 判断モデルは SSOT への参照導線のみを持つ。

## 補足
- TODO: 入出力の一覧を SSOT 参照で整理する。
