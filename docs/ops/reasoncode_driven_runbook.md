# 運用フロー（reasonCode駆動）

## 背景
- 運用フローを reasonCode 駆動で参照できる形にする。

## 説明

### メタ
- Scope（責務）: reasonCode 駆動の運用導線
- Non-goals（やらないこと）: 具体的な運用手順の追加
- Definitions（用語）: SSOT と Runbook に準拠
- Assumptions（前提）: SSOT 7章が正である
- Dependencies（依存）: `PARENTY_SSOT.md` / `Runbook.md`
- Invariants（不変条件）: runbookLabel を変更しない
- Change Impact（変更波及）: matrix / policy_engine / templates
- Open Questions（未決）: なし
- Acceptance（受入条件）: 参照導線が明示される
- 参照元: `docs/SPEC_INDEX.md`
- 参照先: `Runbook.md`

### 本文
- reasonCode から runbookLabel への導線は SSOT 6-2X/6-2Y に固定されている。
- 参照導線:
  - `PARENTY_SSOT.md` 6-2X / 6-2Y
  - `PolicyUxAdminMatrix.md`
  - `Runbook.md`

## 結論
- 運用フローは reasonCode 駆動の導線のみを持つ。

## 補足
- 既存 Runbook との整合は `Runbook.md` を正とする。
