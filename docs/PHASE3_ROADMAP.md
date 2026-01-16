# PHASE3_ROADMAP（Delivery / UX）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。

## メタ（固定）

- **SSoT責務**: Phase 3 の実装順序を、SSOT参照で固定する（新仕様は追加しない）。
- **想定読者**: Engineer / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（2章 / 5章 / 付録C / 7-3）/ `UX_STATE_MAP_7.md`
- **参照導線**: `PolicyUxAdminMatrix.md` / `UX_STATE_MAP_7.md` / `Runbook.md`
- **更新ルール**: 判断が必要なら `Todo.md` に記録して停止する。

---

## 背景

Phase 3 は Delivery と UX の接続点を SSOT に固定し、誤送信・断定・二重送信の事故を防ぐ工程である。

---

## 説明

### 1) 対象スコープ（固定）

- **送信口の一本化**: SSOTの送信口/冪等性（dedupeKey / traceId）を正とする。
- **UX状態と文言**: `UX_STATE_MAP_7.md` と 付録C を正とする。
- **通知/FAQ/ロードマップ**: `PolicyUxAdminMatrix.md` の接続点に従う。
- **ログ/監査**: `notification_deliveries` と 7-3 を正とする。

### 2) 作業順序（参照導線）

1. **送信口の一本化**
   - 参照: `PARENTY_SSOT.md`（sendLine / dedupeKey / traceId）
2. **UX状態と文言の固定**
   - 参照: `UX_STATE_MAP_7.md` / `PARENTY_SSOT.md` 付録C
3. **接続点の確認**
   - 参照: `PolicyUxAdminMatrix.md`
4. **配送ログの整合**
   - 参照: `PARENTY_SSOT.md` 7-3 / `Runbook.md`
5. **断定・誤誘導の防止**
   - 参照: `PARENTY_SSOT.md` 5章 / 付録C

### 3) ブロッカー（判断待ち）

- `Todo.md` の未解決事項が残る場合は作業を停止する。

---

## 進捗メモ（非仕様）

- 完了確認: 送信口の一本化（`backend/src/delivery/send_line.js` / `backend/src/line/reply.js`）
- 完了確認: UX状態と文言の参照固定（`docs/ux_spec/state_based/README.md` / `UX_STATE_MAP_7.md` / `PARENTY_SSOT.md` 付録C）
- 完了確認: 接続点の参照導線を固定（`docs/matrix/policy_x_ux_x_adminui.md` / `PolicyUxAdminMatrix.md`）
- 完了確認: 配送ログの整合（`backend/src/firestore/notification_deliveries.js`）

- 完了確認: 断定防止（`backend/src/policy/evaluator.js` / `backend/src/policy/decision_shape.js` / `backend/tools/policy_decision_sample.json`）

---

## 結論

Phase 3 は SSOT 5章 / 付録C / UX_STATE_MAP_7 を正とし、Delivery と UX の接続点を固定する。

---

## 補足

- 完了条件は `ImplementationPlan.md` の Phase 3 に従う。
