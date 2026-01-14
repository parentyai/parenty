# SPEC_INDEX（仕様導線）

## 背景
- 仕様の導線を一箇所に固定し、参照の分散と重複を減らす。
- 仕様の分割方針を明示し、実装前の迷いを最小化する。

## 説明
- 本ファイルは SSOT_INDEX 配下の docs 導線であり、正の起点は SSOT_INDEX に固定する。
- 仕様は機能別ではなく状態別を優先する（UX領域）。
- 参照の正は SSOT と PolicyUxAdminMatrix にある。ここは導線のみを持つ。

### 仕様リンク（導線）
- Policy Engine 導線: `policy_engine/README.md`
- Policy Engine 判断モデル: `policy_engine/decision_model.md`
- reasonCode 整形（再配置先）: `policy_engine/reason_codes.md`
- UX系データ辞書 導線: `data_dictionary/ux/README.md`
- 管理系データ辞書 導線: `data_dictionary/admin/README.md`
- UX仕様（状態別）導線: `ux_spec/state_based/README.md`
- Firestore Security Rules 設計: `security/firestore_rules.md`
- 中核マトリクス: `matrix/policy_x_ux_x_adminui.md`
- 運用フロー（reasonCode駆動）: `ops/reasoncode_driven_runbook.md`
- ログ・嗜好・判断DB仕様: `ops/logs_preference_decision_db_spec.md`
- Phase 1 ロードマップ: `PHASE1_ROADMAP.md`
- Phase 1 Auth 適用範囲: `PHASE1_AUTH_SCOPE.md`
- 変更統制: `CHANGE_POLICY.md`
- 受入条件: `ACCEPTANCE_CHECKLIST.md`
- 仕様テンプレ: `_templates/spec-template.md`

## 結論
- 仕様の導線は本ファイルで案内し、正の起点は SSOT_INDEX に固定する。
- 仕様分割はリンク単位で追跡し、複製は作らない。

## 補足
- [仮説] 既存の SSOT / PolicyUxAdminMatrix との参照整合は個別仕様で明記する。
- TODO: 各仕様の責務・参照元/参照先を精査し、差分があれば追記する。
