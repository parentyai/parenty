# Editorial Engine Spec（巡回・編集再発信 / SSOT従属）

## メタ（固定）

- **SSoT責務**: 編集再発信の運用導線を固定し、SSOTの定義を上書きしない。
- **想定読者**: Engineer / Ops / Admin
- **依存SSoT**: `PARENTY_SSOT.md`（1-6 / 4-2-b / 7章）
- **参照導線**: `SSOT_INDEX.md` / `docs/ops/content_registry_spec.md`
- **更新ルール**: 例外は本文に混ぜず、運用ログで判断履歴を残す。

---

## 背景
- 巡回情報の再発信は、誤読・規約違反・責任不明化のリスクが高い。
- すべてのユーザー可視物を承認ゲートと監査ログで統制する必要がある。
- SSOT 1-6（Content Artifact / Content Lifecycle）と 7-3（監査）に従属する導線を固定する。

## 説明

**対象**
- SNS/外部向けの「編集再発信」を対象とする。
- 個別会話（LLM即時応答）は対象外。

**編集再発信の固定フォーマット**
1) 事実（出典URL明記）
2) Parenty要約（原文コピー禁止）
3) 対象条件（年齢/地域などの条件ラベル）
4) 行動を命令しない一文

**承認ゲート**
- `draft → review → approved → active → retired` を固定する。
- `killFlag` による即時無効化を必須とする。
- 送信・投稿は `contentId` 経由のみで行う（SSOT 1-6）。

**禁止事項（固定）**
- 単純RT/転載/画像再利用の前提。
- community_sense（Reddit/Meetup等）の再発信。
- 児童データ/PIIの混入。

**監査ログ（固定）**
- `content_publication_logs` と `audit_logs` に必ず記録する。
- 最低限: `contentId / channel / sourceUrl / postedAt / decision`。
- 監査ログは個人情報を含めない。

**失敗時の扱い**
- 出典が消失/規約到達不能の場合は再発信しない。
- 代替ソースが無い場合は沈黙を選ぶ。

## 結論
- 編集再発信は `contentId` と承認ゲートで統制し、監査ログで追跡可能にする。

## 補足
- `content_registry` の定義は SSOT 4-2-b を参照する。
- City Pack 由来の再発信は `docs/ops/city_pack_auto_generation_spec.md` を参照する。
