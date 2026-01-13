# Policy × UX × 管理UI マトリクス（中核）

## 背景
- Policy / UX / 管理UI の接続点を一箇所に集約する。

## 説明

### メタ
- Scope（責務）: 接続点の参照導線と空マトリクス
- Non-goals（やらないこと）: SSOTの内容複製
- Definitions（用語）: SSOT と `PolicyUxAdminMatrix.md` に準拠
- Assumptions（前提）: SSOT が正である
- Dependencies（依存）: `PARENTY_SSOT.md` / `PolicyUxAdminMatrix.md`
- Invariants（不変条件）: reasonCode / nextAction / policyDecision を再定義しない
- Change Impact（変更波及）: ops / templates / data_dictionary
- Open Questions（未決）: TODO
- Acceptance（受入条件）: 列定義が揃う
- 参照元: `docs/SPEC_INDEX.md`
- 参照先: `PolicyUxAdminMatrix.md`

### マトリクス（空欄可）
| reasonCode | Policy判定（何を満たすと発火か） | UX状態 | ユーザー接点（通知/FAQ/シナリオ/ロードマップ） | 管理UI操作（テンプレ/停止/監査/データ要求/事故対応） | 参照データ（Firestoreコレクション/フィールド） | ログ/監査（audit_logs 等） | リスク（誤配信・誤判定・法務/倫理） | テスト観点（最小テストケース名） |
|---|---|---|---|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

## 結論
- 接続点の正は SSOT / PolicyUxAdminMatrix に固定する。

## 補足
- TODO: SSOT 6-2X/6-2Y との接続を確認する。
