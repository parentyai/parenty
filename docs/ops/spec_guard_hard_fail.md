# Spec Guard HARD FAIL 仕様（SSOT従属・非仕様）

## 背景
- 仕様の「重大事故」だけを確実に止め、軽微な文言揺れで開発を止めない。
- City Pack が情報DB化する誤読、LLMの暴走、誇大表現による法務/運用事故を防ぐ。
- SSOT の正を維持するため、PR時点で HARDS FAIL を発火させる。

## 説明

**適用条件（最小）**
- 対象: 仕様・規程・ドキュメントのみ。
- 実行: GitHub Actions で PR時に自動実行。
- トリガー: `docs/` 変更を含むPRのみ。
- 結果: いずれかの条件に該当したら **HARD FAIL**（merge不可）。

**対象ファイル（固定）**
- HARD FAIL #1: `docs/**/*.md`（例外なし）
- HARD FAIL #2/ #3: `PARENTY_SSOT.md`, `docs/ops/city_pack_auto_generation_spec.md`

**HARD FAIL #1: 誇大表現・網羅幻想の検出**
- 目的: City Pack/Watchが「網羅・完全」だと誤読される事故の防止。
- NG条件: 誇大語が「把握/確認/カバー/管理/監視」等の動詞と同一文脈で出現。
- 誇大語: `完全 / すべて / 網羅 / 包括 / 全部 / 全学校 / 全イベント`
- 動詞: `把握 / 確認 / カバー / 管理 / 監視`
- 除外ルール: 同一行に `禁止 / NG / 禁止表現 / 使用禁止 / MUST NOT` を含む場合は除外。
- 実装想定: 1行単位の正規表現チェック（文脈推論は不要）。

**HARD FAIL #2: City Pack 中核仕様の欠落**
- 目的: City Pack が情報DBに戻ることを防ぐ。
- 必須概念（全て必要）:
  1. City Pack は Failure Mode Watch である。
  2. Watch State は `ok / risk / unknown` を持つ。
  3. UNKNOWN は正式な正常状態である。
  4. rawデータ本文は恒久保存しない。
- 判定: 対象ファイルに上記の意味が明確に読めない場合は FAIL。

**HARD FAIL #3: LLM自由探索・網羅クロールの禁止違反**
- 目的: コスト/規約/誤情報リスクを防ぐ。
- NG判定語（許可的文脈で出現したら FAIL）:
  - `自由に検索` / `網羅的に調査` / `常時クロール` / `全情報を集める`
- 除外ルール: 同一行に `禁止 / NG / 禁止表現 / 使用禁止 / MUST NOT` を含む場合は除外。
- OKとされる限定用途（明示必須）:
  - `差分有無の要約`
  - `Failure Mode へのマッピング`
  - `状態判定補助（ok/risk/unknown）`
- 判定: 対象ファイルに上記OK用途が明示されない場合は FAIL。

**Spec Guard ルール一覧（要点のみ）**
- ルール1: 誇大語 + 動詞の同一文脈を検出（禁止行は除外）。
- ルール2: City Pack 中核4概念の欠落を検出（SSOT/City Pack spec限定）。
- ルール3: LLM自由探索表現の検出 + 許可用途3点の明示確認。

**FAILメッセージ定型文（日本語）**
- HARD FAIL #1:
  - `{{file}}:{{line}} 誇大表現の検出（City PackはWatch Listであり網羅DBではない）。`
  - `代替表現例:「重要な変更があるかを定期的にチェックしています」`
- HARD FAIL #2:
  - `{{file}} City Pack 中核仕様の欠落: {{missing_concept}}`
  - `City Pack が情報DBに誤解されるリスクがあります。`
  - `追記テンプレ:「City Pack は Failure Mode Watch であり、状態は ok/risk/unknown のみ、UNKNOWN は正常状態、raw本文は保存しない。」`
- HARD FAIL #3:
  - `{{file}} LLMの役割逸脱（自由探索/網羅クロールの許可表現）。`
  - `実害: コスト暴発/規約違反/誤情報混入/SSOT破壊。`
  - `許可された役割: 差分要約 / Failure Mode マッピング / 状態判定補助。`

## 結論
- Spec Guard は HARD FAIL 3点セットのみを扱い、警告化しない。
- 仕様の重大事故を止め、通常の仕様更新は止めない。
- SSOT を正として、派生文書の暴走をPR時点で遮断する。

## 補足
- 実装は Node.js スクリプト + GitHub Actions を前提とする。
- 例外は作らない（検出対象の拡張は TODO に記録し、別フェーズで定義する）。

**TODO（将来拡張）**
- [TODO] City Pack の用語定義ぶれ（cityCode/failureCode等）の自動検出。
- [TODO] contentId 直書き禁止の強制チェック。
- [TODO] PII混入禁止の簡易パターン検知。
