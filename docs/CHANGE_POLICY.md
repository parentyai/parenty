# 変更統制（Change Policy）

## 背景
- 変更の波及を可視化し、参照漏れを減らす。

## 説明

### メタ
- Scope（責務）: 変更トリガーと影響範囲の一覧
- Non-goals（やらないこと）: 実装や手順の決定
- Definitions（用語）: SSOT の用語に準拠
- Assumptions（前提）: 変更は SSOT 起点
- Dependencies（依存）: `PARENTY_SSOT.md` / `PolicyUxAdminMatrix.md`
- Invariants（不変条件）: 権威構造を変更しない
- Change Impact（変更波及）: 本表に集約
- Open Questions（未決）: TODO
- Acceptance（受入条件）: 主要トリガーが網羅される
- 参照元: `docs/SPEC_INDEX.md`
- 参照先: 各仕様ファイル

### 変更トリガー一覧
| 変更トリガー | 影響ファイル | 必須確認項目 |
|---|---|---|
| reasonCode 追加/変更 | `docs/matrix/policy_x_ux_x_adminui.md` / `docs/ops/reasoncode_driven_runbook.md` / `docs/policy_engine/reason_codes.md` | 参照導線の整合 / 影響範囲の記録 |
| Policy 判定条件の変更 | `docs/policy_engine/decision_model.md` / `docs/matrix/policy_x_ux_x_adminui.md` | 入出力の参照 / 影響範囲 |
| データ辞書変更（UX） | `docs/data_dictionary/ux/README.md` / `docs/security/firestore_rules.md` | 読み書き境界 / 監査導線 |
| データ辞書変更（管理） | `docs/data_dictionary/admin/README.md` / `docs/security/firestore_rules.md` | 権限境界 / 監査導線 |
| UX状態の追加/変更 | `docs/ux_spec/state_based/README.md` / `docs/matrix/policy_x_ux_x_adminui.md` | 状態別導線 / 参照整合 |
| Runbook 構成の変更 | `docs/ops/reasoncode_driven_runbook.md` / `docs/matrix/policy_x_ux_x_adminui.md` | reasonCode 接続 / 監査導線 |
| Firestore Rules 方針変更 | `docs/security/firestore_rules.md` / `docs/data_dictionary/ux/README.md` / `docs/data_dictionary/admin/README.md` | 読み書き分離 / 参照導線 |

## 結論
- 変更の影響範囲は本表に集約する。

## 補足
- TODO: 実運用の変更例を記録する。
