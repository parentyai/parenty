## INTEGRITY_CHECKLIST（fail-fast監査）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: SSOT/派生/検査の整合性を機械的に保証するためのチェック項目を固定する（仕様追加をしない）。
- **想定読者**: Engineer(Cursor) / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（参照体系/付録/運用）
- **生成物**: Lintの目的・失敗原因・直し方
- **更新ルール**: 新しい概念を導入する場合は先にSSOTへ追記し、チェックリストは参照導線として更新。
- **変更履歴**:
  - 2026-01-07: 形式統一（メタを追加）

---

## 背景

“読んだ気”を排除し、SSOT逸脱を自動で止めるために fail-fast の検査を置く。

---

## 説明

目的：SSOT/ドキュメント/送信口/保存処理が矛盾せず、実装後にポリシー逸脱が起きない状態を **自動検査＋CI**で保証する。

---

### 参照導線

- `docs/implementation_entry_gate_semi_automation.md`

---

### 実行コマンド

- `npm run lint:docs`
- `npm run lint:api-registry`
- `npm run lint:policy`
- `npm run lint:schema`
- `npm run lint:all`

---

### 実装チケット必須添付

- `docs/ops/logs_preference_decision_db_spec.md`（Status: FROZEN）
- 第19章「仕様フリーズ条件チェックリスト（All Yes）」

---

### 実装開始ゲート（CI/PR Block）

- 保存禁止Lint
  - rawText / child PII / 推定値を検知したら ビルド失敗
- TTL自動削除
  - 全該当コレクションで TTL 設定が存在
- 同意ガード
  - consentStatus = OFF 時の read/write 拒否が有効

---

### 何を検査しているか（最小）

- **docs整合**（`tools/validate_docs.js`）
  - ローカルリンク切れ
  - SSOT節番号参照の整合（例：`1-4-3-A`）
  - Derived Insight の参照導線（付録A→`SSOT 1-4-3-A`）

- **Derived Insight 禁止表現**（`tools/policy_lint.js`）
  - 数値/割合/件数/n数/セグメント別/ランキング等の混入をfail-fast
  - docs（```derived_insight フェンス）＋ tools内の「DERIVED_INSIGHT_BLOCK_*」マーカー範囲を全探索（docs-onlyフェーズ）

- **スキーマ雛形**（`tools/schema_check.js`）
  - Derived Insight保存スキーマが導入された場合の必須フィールド検証
  - Phase4ではWARN維持の方針を `docs/PHASE4_ROADMAP.md` に固定（Derived Insight 非実装）

- **External API Compliance Watch（監視の基盤）**（`tools/api_watch.js`）
  - `APIRegistry_External.md` の backtick URL を巡回し、`docs/api_watch/snapshot.json` を生成（常に上書き）
  - 監視結果（ok/fail）と `Last-Modified/ETag/Content-Type` を最小限保存（自動更新は禁止）

- **API Registry Path検証**（`tools/validate_api_registry.js`）
  - `/health` と `/line/webhook` が SSOT確定パスとして明示されていることを確認
  - その他の Path が `[仮説]` なしで確定されていないことを検出

---

### 失敗の典型原因

- SSOT節番号が変わったのに参照側が更新されていない
- Derived Insight の文面に「%」「n=」「件」「より多い」等が混入
- 送信口/保存口の二重チェックが片側だけになっている

---

### 最短の直し方

1. CIログで落ちたファイルと行番号を確認
2. Derived Insight の違反は **削除（数字/比較/セグメント）**で修正（置換で“数字を残す”修正は禁止）
3. SSOT参照ズレは SSOT側ではなく参照側を更新（SSOTの節番号は極力動かさない）


---

## 結論

Lintを通さない変更は“仕様逸脱の可能性がある”として差し戻す。

---

## 補足

- （特になし）
