# データ辞書（管理系）入口

## 背景
- 管理系コレクションの参照導線を固定する。

## 説明

### メタ
- Scope（責務）: 管理系コレクションの入口と参照導線
- Non-goals（やらないこと）: フィールド仕様の記述
- Definitions（用語）: SSOT の用語に準拠
- Assumptions（前提）: SSOT 4章が正である
- Dependencies（依存）: `PARENTY_SSOT.md`
- Invariants（不変条件）: コレクション名を変更しない
- Change Impact（変更波及）: security / ops / matrix
- Open Questions（未決）: TODO
- Acceptance（受入条件）: 参照導線がリンク切れなし
- 参照元: `docs/SPEC_INDEX.md`
- 参照先: SSOT 4章

### 対象コレクション（入口のみ）
- admin_users
- templates
- global_flags
- audit_logs
- data_requests
- incident_records

## 結論
- 管理系データ辞書は参照導線のみを持つ。

## 補足
- TODO: SSOT該当節へのリンクを確定する。
