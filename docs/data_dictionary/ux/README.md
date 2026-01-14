# データ辞書（UX系）入口

## 背景
- UX系コレクションの参照導線を固定する。

## 説明

### メタ
- Scope（責務）: UX系コレクションの入口と参照導線
- Non-goals（やらないこと）: フィールド仕様の記述
- Definitions（用語）: SSOT の用語に準拠
- Assumptions（前提）: SSOT 4章が正である
- Dependencies（依存）: `PARENTY_SSOT.md`
- Invariants（不変条件）: コレクション名を変更しない
- Change Impact（変更波及）: security / ops / matrix
- Open Questions（未決）: なし
- Acceptance（受入条件）: 参照導線がリンク切れなし
- 参照元: `docs/SPEC_INDEX.md`
- 参照先: `PARENTY_SSOT.md` 4-2-a

### 対象コレクション（入口のみ）
- households
- guardians
- children
- consents
- subscriptions
- notifications
- notification_deliveries
- faq_logs
- scenario_states
- roadmaps

## 結論
- UX系データ辞書は参照導線のみを持つ。

## 補足
- SSOT 4-2-a のコレクション一覧と一致させる。
