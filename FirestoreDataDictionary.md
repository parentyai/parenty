## FirestoreDataDictionary（参照導線：UX/管理 統合）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: Firestoreのデータ辞書の正はSSOT（`PARENTY_SSOT.md` 4-2-a/4-2-b）に固定し、本ファイルは **参照導線（入口）**のみを提供する。
- **想定読者**: Engineer(Cursor) / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（4-2-a / 4-2-b / 7-3）
- **生成物**: UX系/管理系コレクションの入口一覧（フィールドの複製は禁止）
- **編集禁止領域**:
  - コレクション/フィールドの新規定義（SSOTへ戻す）
  - SSOT 4-2-a/4-2-b の全文複製
- **更新トリガー**: SSOT 4-2-a/4-2-b/7-3 更新
- **関連リンク**: `SSOT_INDEX.md` / `Glossary.md` / `Guides.md` / `FirestoreSecurityRules.md`
- **変更履歴**:
  - 2026-01-08: Firestoreの参照導線を本ファイルへ統合（ファイル数最小化）

---

## 背景

- データ辞書を派生側で複製すると、綴り揺れ・参照切れ・運用事故が起きる。
- CTO役AIの閲覧制約（同時に開けるタブ数）を考慮し、参照導線は **最小ファイル数**に集約する。

---

## 説明

### 参照の正（SSOT）

- **UX系データ辞書（正）**: `PARENTY_SSOT.md` 4-2-a
- **管理系データ辞書（正）**: `PARENTY_SSOT.md` 4-2-b
- **監査/保存期間（正）**: `PARENTY_SSOT.md` 7-3
- **契約（埋め込み/nullable等）**: `Guides.md`（SSOT 3-3-1 / 付録B-1）

### 参照導線（入口一覧）

※ 下記は **コレクション名の“入口”**のみ。フィールド/権限/保持期間は必ずSSOTへ戻る。

#### UX系（代表）

| コレクション | 参照（正） | 備考 |
| --- | --- | --- |
| households | SSOT 4-2-a | 家庭単位の最上位スコープ |
| guardians | SSOT 4-2-a | guardian情報（PII最小化） |
| children | SSOT 4-2-a | 高PII（最重要保護） |
| consents | SSOT 4-2-a | 同意の唯一の正 |
| subscriptions | SSOT 4-2-a | 課金の真実（SoT） |
| notifications | SSOT 4-2-a | 通知生成ログ（policyDecision必須） |
| notification_deliveries | SSOT 4-2-a | 配送結果ログ（policyDecision必須） |
| faq_logs | SSOT 4-2-a | FAQログ（マスキング後のみ保存） |
| scenario_states | SSOT 4-2-a | シナリオ状態ログ |
| roadmaps | SSOT 4-2-a | 家庭年間ロードマップ |

#### 管理系（代表）

| コレクション | 参照（正） | 備考 |
| --- | --- | --- |
| admin_users | SSOT 4-2-b | RBAC（viewer/editor/operator/admin） |
| global_flags | SSOT 4-2-b | 全体停止/feature stop（最優先） |
| templates | SSOT 4-2-b | テンプレ管理（公開/停止は監査必須） |
| data_requests | SSOT 4-2-b | 権利行使 |
| sources | SSOT 4-2-b | 管理系辞書（更新主体はsystem 等） |
| reviews | SSOT 4-2-b | 管理系辞書（更新主体はsystem 等） |
| ops_configs | SSOT 4-2-b | 運用設定（systemのみ） |
| experience_sources | SSOT 7-1 / 4-2-b | 体験情報源 |
| experience_fragments | SSOT 7-1 / 4-2-b | 体験フラグメント |
| experience_usage_logs | SSOT 7-3 / 4-2-b | 体験利用ログ（監査） |
| review_sources | SSOT 7-1 / 4-2-b | RAES情報源 |
| review_fragments | SSOT 7-1 / 4-2-b | RAESフラグメント |
| review_usage_logs | SSOT 7-3 / 4-2-b | RAES利用ログ（監査） |
| insight_reactions | SSOT 7-3 / 4-2-b | IRS反応ログ（監査） |
| audit_logs | SSOT 4-2-b / 7-3 | 監査一次情報（append-only） |
| incident_records | SSOT 4-2-b / 7-2 | インシデント記録 |
| admin_views/* | SSOT 4-3 | 派生ビュー（意思決定に使わない） |

---

## 結論

- Firestoreの辞書の正はSSOTに固定し、派生側は参照導線（入口）のみに限定する。
- 本ファイルへ統合することで、実装者/監査者が開くファイル数を最小化する。

---

## 補足

### 差分サマリ（本ファイル）

- **追加**: `FirestoreDataDictionary.md`（参照導線の統合）
- **削除**: 旧参照導線ファイルを統合・削除（本ファイルに集約）

---

## 矛盾候補（隔離）

- （現時点なし）
