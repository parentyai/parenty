# Firestore Security Rules（UX/管理分離設計）

## 背景
- UX系と管理系の読み書きを分離し、参照の正を固定する。

## 説明

### メタ
- Scope（責務）: UX/管理分離の参照導線
- Non-goals（やらないこと）: ルールの実装
- Definitions（用語）: SSOT の用語に準拠
- Assumptions（前提）: SSOT 4章が正である
- Dependencies（依存）: `PARENTY_SSOT.md` / `FirestoreSecurityRules.md`
- Invariants（不変条件）: 権限モデルを変更しない
- Change Impact（変更波及）: data_dictionary / matrix / ops
- Open Questions（未決）: なし
- Acceptance（受入条件）: 参照導線が明記される
- 参照元: `docs/SPEC_INDEX.md`
- 参照先: `FirestoreSecurityRules.md`

### 本文
- UX/管理の分離・append-only・家庭境界の要件は `FirestoreSecurityRules.md` と SSOT 4-4 に固定する。
- 本ファイルは参照導線のみを持ち、Rules の本文を複製しない。

## 結論
- Rules の正は既存ドキュメントに固定する。

## 補足
- 参照導線は `FirestoreSecurityRules.md` に統一する。
