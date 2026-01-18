# Content Registry Spec（全発信物統制 / SSOT従属）

## メタ（固定）

- **SSoT責務**: Content Registry の運用導線を固定し、SSOTの定義を上書きしない。
- **想定読者**: Engineer / Ops / Admin
- **依存SSoT**: `PARENTY_SSOT.md`（1-6 / 4-2-b / 7章）
- **参照導線**: `SSOT_INDEX.md` / `docs/ops/editorial_engine_spec.md`
- **更新ルール**: 変更は SSOT の参照導線に限定し、独自状態/独自承認は追加しない。

---

## 背景
- ユーザー可視物が分散すると、文言揺れ・承認漏れ・監査欠落が発生する。
- 個別会話（LLM即時応答）以外の発信物は、統制台帳で一元管理する必要がある。
- SSOT 1-6（Content Artifact / Content Lifecycle）を運用導線に落とす。

## 説明

**位置づけ**
- 本仕様は SSOT 1-6 / 4-2-b / 7-3 に従属し、定義の追加はしない。
- `content_registry` は全発信物の台帳であり、`contentId` を唯一の参照点とする。

**対象（Content Artifact）**
- LINE通知 / シナリオ配信 / ブロードキャスト / 固定メッセージ / リッチメニュー / 編集再発信 / LP・告知。
- 個別会話（LLM即時応答）は対象外。

**Content Lifecycle**
- `draft → review → approved → active → retired`
- 全 artifact は `killFlag` を持ち、即時無効化は `killFlag` のみで行う。

**content_registry 必須項目（参照導線）**
- `contentId / type / status / locale / city / plan / version`
- `approvals / startAt / endAt / killFlag / lastUpdatedBy`
- フィールドの正は SSOT 4-2-b に戻す。

**承認ゲートと監査**
- 状態遷移は `audit_logs` に必ず記録する（target.kind=content）。
- 承認なしに `active` へ進めない。

**送信/再発信の参照ルール**
- 送信・表示・再発信は `contentId` 経由のみで行う。
- 送信ログは `contentId` で追跡可能にする（SSOT 6-0M5 参照）。

**禁止事項**
- 文言のコード直書き。
- 児童データ/PIIの混入。
- SSOT外の独自状態・独自承認の追加。

## 結論
- `content_registry` は全発信物の唯一の台帳とし、承認ゲート・kill-switch・監査ログの三点で統制する。

## 補足
- 編集再発信の詳細は `docs/ops/editorial_engine_spec.md` を参照する。
- City Pack 起点の発信は `docs/ops/city_pack_auto_generation_spec.md` を参照する。
