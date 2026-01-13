## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: 観測ログ/メトリクスの“差し込み口”をSSOT参照で固定する（新規機能を足さない）。
- **想定読者**: Ops / Engineer(Cursor)
- **依存SSoT**: `PARENTY_SSOT.md`（7-3 / B-1-1 / B-1-2 / 4章 / 6-0）
- **生成物**: ログ/メトリクスの必須項目と、Derived Insight監査などの“拡張差し込み口”の参照導線
- **編集禁止領域**:
  - メトリクス定義の独自追加（SSOTにないKPI/成長指標を本文に持ち込まない）
  - 個人追跡（家庭/個人単位のトラッキング）を前提とする記述
- **更新トリガー**: SSOT 7-3 / DataContract / 付録B/C / 6-2X 更新
- **関連ID体系（固定）**: traceId / runId / templateId / incidentId（SSOT命名規約）
- **変更履歴**:
  - 2026-01-07: 初版
- **関連リンク**: `SSOT_INDEX.md` / `Glossary.md` / `Guides.md` / `PolicyUxAdminMatrix.md`

---

## 背景

- Parentyは“ログは副産物ではない”。再現性と説明責任のための一次情報である（SSOT 2-1/7-3）。

---

## 説明

### 参照の正（SSOT）

- `PARENTY_SSOT.md`
  - 7-3（ログ/監査）
  - B-1-1（policyDecision 埋め込み）
  - B-1-2（policyTrace 埋め込み）
  - 6-0（カテゴリ/扱い）

### 必須ログ（差し込み口）

本ファイルは“どのログに何を埋め込むか”の **参照導線**のみを持つ（フィールドの正は `Guides.md` と SSOTへ戻る）。

- **policyDecision（必須）**: result / reasonCodes[] / primaryReason / templateId / nextAction（SSOT B-1-1）
- **policyTrace（必須）**: traceId / ruleVersion / inputsDigest / evaluatedAt（SSOT B-1-2）
- **PII禁止**: inputsDigest/ログ本文に個人情報を入れない（SSOT 7-3）

### メトリクス（派生ビューの扱い）

- admin_views/* は派生（Read Model）であり、意思決定に使わない（SSOT 2-3/4-3）
- 監視/アラートの起点は primaryReason/reasonCodes と nextAction（6-2X）に戻せること

### Derived Insight 監査（差し込み口のみ）

- Derived Insight は SSOT 1-4-3-A の制約に厳密に従う
- 本文では“生成/提供”の仕様追加はしない（必要ならSSOTへ）
- 監査の差し込み口は以下に固定して参照導線を持つ:
  - policyDecision/policyTrace の同一埋め込み（DataContract/SSOT B-1）
  - 禁止表現の機械検査（`docs/INTEGRITY_CHECKLIST.md`）

---

## 結論

- 観測は SSOT 7-3 と policyDecision/policyTrace に集約し、運用導線（6-2X/Runbook）へ戻れることを必須とする。

---

## 補足

### 変更差分（本ファイル）

- **追加**: `Observability.md`
- **影響範囲**:
  - `tools/validate_docs.js`（Lint対象へ追加が必要）

---

## 矛盾候補（隔離）

- （現時点なし）


