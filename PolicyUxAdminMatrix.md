## メタ（固定）

- **SSoT責務**: Policy Engine × UX × 管理UI の接続（マトリクス）を“真ん中”に置き、参照の正をSSOTへ固定する。
- **想定読者**: Engineer(Cursor) / Ops / QA
- **依存SSoT**: `PARENTY_SSOT.md`（6-0/6-2X/6-2Y/付録B/付録C/7章）
- **生成物**: 接続点の参照導線（複製マトリクスを作らない）
- **編集禁止領域**:
  - reasonCodes/nextAction/templateId の全文表をここに複製すること
  - SSOTにない接続（例：独自UX状態、独自運用アクション）を本文へ追加すること
- **更新トリガー**:
  - SSOT 付録B（reasonCodes）変更
  - SSOT 6-2X/6-2Y/6-2Z（nextAction/RunbookLabel）変更
  - SSOT 付録C（DEGRADED/DENYテンプレ）変更
- **関連ID体系（固定）**:
  - reasonCode（SSOT 付録B）
  - primaryReason（SSOT 3章 / B-1-1）
  - nextAction.action（SSOT 6-2Z）
  - runbookLabel（SSOT 7章見出し、6-2Y埋め込み）
  - templateId（付録C）
- **変更履歴**:
  - 2026-01-07: 初版
- **関連リンク**: `SSOT_INDEX.md` / `Glossary.md` / `Guides.md` / `Runbook.md`

---

## 背景

- reasonCode→UX→管理UI→運用が1対1で辿れないと、現場で“人間判断”が発生し、SSOTが崩壊する。
- SSOT上の接続点（6-0/6-2X/付録B/C/7章）を“真ん中”に据え、派生資料の参照体系を固定する。

---

## 説明

### マトリクスの正（固定）

本リポジトリにおける **マトリクスの唯一の正**は、以下である（派生側で複製しない）：

- **reasonCodes**: SSOT 付録B
- **Policy結果×カテゴリの扱い**: SSOT 6-0
- **primaryReason→nextAction**: SSOT 6-2X（RowIdを主キーとして採番）
- **nextActionのUI埋め込み/RunbookLabel**: SSOT 6-2Y
- **nextAction enum / schema拘束**: SSOT 6-2Z
- **UX文言テンプレ**: SSOT 付録C
- **Runbook本文**: SSOT 7章
UX_STATE_MAP_7 は Policy判定結果を「どう見せるか／どう伝えるか」を規定するUX層の仕様であり、判定ロジック・reasonCode・権限モデルには影響しない。

### 派生ドキュメント側の責務（固定）

- `Guides.md`: 派生ガイド統合（reasonCode/UX/Admin/DecisionFlow/DataContract/PolicyEngine/Roadmap/Productization の参照導線）
- `Runbook.md`: runbookLabel一覧と埋め込み規約の参照導線

### Cross-Reference Contract（強制）

以下の参照が **常に成立**しなければならない（成立しない場合は「矛盾候補」へ隔離し、実装を止める）：

1. **全reasonCode** は SSOT 付録Bに存在する（参照: [`PARENTY_SSOT.md`](PARENTY_SSOT.md)）
2. reasonCode は **category** を持ち、SSOT 6-0 のカテゴリ体系に接続できる（参照: [`PARENTY_SSOT.md`](PARENTY_SSOT.md)）
3. 全ログの `policyDecision` は `result + reasonCodes[] + primaryReason` を持つ（SSOT B-1-1）（参照: [`Observability.md`](Observability.md)）
4. `primaryReason` は SSOT 6-2X で **nextAction** に接続できる（RowIdで追跡できる）（参照: [`Runbook.md`](Runbook.md)）
5. `nextAction` は SSOT 6-2Z の enum に含まれる（参照: [`Guides.md`](Guides.md)）
6. DEGRADED/DENY の UX 文言は SSOT 付録Cのみ（テンプレ参照以外禁止）（参照: [`UX_STATE_MAP_7.md`](UX_STATE_MAP_7.md)）
7. 未定義値は FAIL-SAFE（UNKNOWN_REASON → DENY + CREATE_INCIDENT + [7-2-1]）（参照: [`PARENTY_SSOT.md`](PARENTY_SSOT.md)）

### 接続サマリ（最小可視化）

| 接続点 | Policy | UX | Delivery / Logs | Admin | SSOT参照 |
| --- | --- | --- | --- | --- | --- |
| A) Policy → UX → Delivery | result / reasonCodes / primaryReason | 付録Cテンプレ参照 | `notification_deliveries` に policyDecision | 監査で追跡 | 6-0 / 付録C / 7章 |
| B) Content → Delivery → Logs | contentId / templateId | 文言はテンプレ経由のみ | `templates` → `notification_deliveries` | template 登録/承認/停止 | 1-6 / 4-2-b / 7-3 |
| C) Admin → 影響範囲 | 承認・停止の前提 | UX文面は更新可否のみ | 配送ログで影響追跡 | `audit_logs` 参照 | 1-6 / 6-2X / 7章 |

---

## 結論

- マトリクスの正はSSOTに固定し、派生側は参照導線と検査可能な契約だけを持つ。
- 接続が1つでも切れたら“矛盾候補”として隔離し、実装を進めない。

---

## 補足

### 変更差分（本ファイル）

- **追加**: `PolicyUxAdminMatrix.md`
- **影響範囲**:
  - `SSOT_INDEX.md`（中心ドキュメントとしてリンク追加済み）
  - `tools/validate_docs.js`（Lint対象へ追加が必要）

---

## 矛盾候補（隔離）

- （自動点検の結果で追記する：例：付録Bにあるが6-2Xに無い primaryReason 等）
