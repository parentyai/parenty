# Phase4.1 Trigger Spec（City Pack / Editorial 発火導線 / SSOT従属）

## メタ（固定）

- **SSoT責務**: 送信発火導線を最小のAdmin操作として固定し、SSOTの定義を上書きしない。
- **想定読者**: Engineer / Ops / Admin
- **依存SSoT**: `PARENTY_SSOT.md`（1-6 / 4-2-b / 7章）
- **参照導線**: `docs/PHASE4_ROADMAP.md` / `docs/ops/content_registry_spec.md`
- **更新ルール**: 送信経路は `sendLine` のみとし、承認ゲートと監査ログを必須にする。

---

## 背景
- Phase4.1 は、LINE返信テスト導線に依存せず、Adminが明示的に発火できる導線を1本に固定する。
- 送信ゲート（policyDecision強制 / 監査ログ必須 / contentId導線）は既に成立している。
- 新しい概念やスキーマは追加せず、既存構成に接続する。

## 説明

**導線の選択（最小・監査容易）**
- Admin API を唯一の発火口とする。
- Admin UI はボタン操作で Admin API を呼び出すだけの構成とする。

**エンドポイント（Admin API）**
- [仮説] `POST /admin/v1/city-pack/trigger`
- 入力: `contentId` / `householdId`
- 送信: `sendLine` 経由のみ
- 承認条件: `templates.status = active` のみ送信対象

**権限（固定）**
- 既存の Admin 認可（Firebase ID Token + Admin権限）に従う。
- UIからの発火は Admin 権限が必須。

**監査（必須）**
- `notification_deliveries` に `contentId / templateId / policyDecision` を必ず記録する。
- 監査ログは既存方針に従い、個人情報を含めない。

**失敗時UX（固定）**
- `templates.status != active` の場合は送信しない。
- `policyDecision` が `DENY/DEGRADED` の場合でも沈黙しない（既存テンプレで返信）。

## 結論
- Phase4.1 の発火導線は Admin API 1本に固定し、Admin UI はその操作導線のみを提供する。

## 補足
- エンドポイント名は実装時に確定するが、責務・入力・監査は本仕様に従う。
