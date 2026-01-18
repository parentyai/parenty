## メタ（固定）

- **SSoT責務**: このリポジトリ内ドキュメントの「参照体系」と「更新規約」を唯一の正として固定し、SSOT逸脱・参照切れ・表記揺れを防ぐ。
- **想定読者**: CEO / CTO(GPT) / Engineer(Cursor) / Ops（運用者）
- **依存SSoT**: `PARENTY_SSOT.md`（本文 + 付録 + Changelog）
- **生成物**: “開発可能な実装書類セット”（本インデックスを起点に全資料へ辿れる状態）
- **編集禁止領域**:
  - `PARENTY_SSOT.md` の意味変更（新概念/新enum/新collection/新reasonCodeの即興追加）
  - 付録C（DEGRADED/DENY文言テンプレ）の創作/改変（SSOT変更手順なしの変更）
  - 6-2Z（OpenAPI拘束）に反する独自拡張
- **更新ルール**:
  - **矛盾が出たら確定しない**。本文に混ぜず、各ファイルの「矛盾候補（隔離）」へ集約し、`Todo.md` に判断待ちとして記録して停止する。
  - 派生ドキュメントは **SSOTの複製を作らない**。本文は原則「参照導線（SSOTのどこが正か）」のみ。
  - 追加/変更/削除は必ず「差分サマリ」に記録し、影響範囲（参照先ファイル/セクション）を併記する。
- **変更履歴**:
  - 2026-01-07: 初版（SSOTインデックスを最上位に追加）
- **関連リンク（本リポジトリ内）**:
  - `PARENTY_SSOT.md`
  - `Glossary.md`
  - `APIRegistry.md`
  - `APIRegistry_External.md`
  - `PolicyUxAdminMatrix.md`
  - `FirestoreDataDictionary.md`
  - `FirestoreSecurityRules.md`
  - `Observability.md`
  - `Guides.md`
  - `SSOT_LINK_MAP.md`
- `RESERVED_FEATURES_GATE.md`
- `UX_STATE_MAP_7.md`
- `DOCUMENT_AUTHORITY_MODEL.md`
- `ImplementationPlan.md`
  - `Progress.md`
  - `Todo.md`
- `docs/INTEGRITY_CHECKLIST.md`
- `Runbook.md`
- `docs/ops/logs_preference_decision_db_spec.md`
- `docs/ops/city_pack_auto_generation_spec.md`
- `docs/ops/content_registry_spec.md`
- `docs/ops/editorial_engine_spec.md`
- `docs/policy_engine/watch_rules.md`

---

## 背景

- Parenty は **SSOT（`PARENTY_SSOT.md`）がコードより優先**である。
- 派生ドキュメントが増えるほど、参照切れ・表記揺れ・DRAFT混入で **“SSOT逸脱”が起きやすくなる**。
- よって、文書群の正規構造（どれが何を決め、どれが何を決めないか）を最上位で固定する必要がある。

---

## 説明

### 0) 参照体系（固定）

- **最上位の正**: `PARENTY_SSOT.md`
- **派生の目的**: SSOTの要約ではなく、実装・運用が迷わないための **参照導線**と **検査可能な契約**の固定
- **不確実性の扱い**: “本文”に入れない。各ファイルの **「矛盾候補（隔離）」**へ集約し、`Todo.md` で承認待ちにする。
- 正の定義元は `PARENTY_SSOT.md` のみである。
- `PolicyUxAdminMatrix.md` はドメイン横断確認の唯一の起点である。
- 派生文書は定義しない。
- 派生文書は権威を持たない。
- 派生文書は SSOT/Matrix の写し・要約・導線に過ぎない。
- 派生文書の記述が SSOT/Matrix と矛盾した場合は常に SSOT/Matrix が優先される。
- 派生文書を根拠に Policy / UX / 権限 / 判定を変更してはならない。
- 下位→上位参照は許可し、上位→下位依存は禁止し、派生文書間の相互参照は説明目的に限定され権威を持たない。

### 1) 対象ドキュメント（整合対象）

| 種別 | ファイル | 役割（SSoT責務） | 参照先（正） |
| --- | --- | --- | --- |
| 0 | `SSOT_INDEX.md` | 文書群の参照体系/更新規約の唯一の正 | `PARENTY_SSOT.md` |
| 1 | `FirestoreDataDictionary.md` | UX/管理の参照導線（入口一覧。辞書複製禁止） | SSOT 4-2-a / 4-2-b |
| 2 | `Guides.md` | 派生ガイドの統合（参照導線のみ） | SSOT 2章/3章/4章/5章/6章/7章 |
| 5 | `FirestoreSecurityRules.md` | 読み書き分離（UX/管理）と禁止事項の契約 | SSOT 4章 / 7-3 |
| 6 | `PolicyUxAdminMatrix.md` | **Policy×UX×管理UIの中心マトリクス（参照導線）** | SSOT 6-0 / 6-2X / 付録B/C / 7章 |
| 7 | `Observability.md` | 観測ログ/メトリクス（差し込み口のみ） | SSOT 7-3 / Guides |
| 8 | `SSOT_LINK_MAP.md` | SSOT条番号→影響範囲（参照強制レイヤー） | SSOT 1-5 / 3-3-1 / 3-4 / 5-7 / 6-4 / 8-5 / 付録B/C/F/G |
| 9 | `RESERVED_FEATURES_GATE.md` | 付録G（予約機能）の着手ゲート（Reserved固定） | SSOT 付録G |
| 10 | `UX_STATE_MAP_7.md` | UX文面モード（7状態）契約書（Policy結果3値は置き換えない） | SSOT 5章 / 付録C / 1-5 / 3-4 / 5-7 |
| 11 | `docs/ops/city_pack_auto_generation_spec.md` | City Pack 自動生成運用仕様（承認ゲート含む） | SSOT 5-8 / 5-7 / 7章 / 8-4-2B |
| 12 | `docs/ops/content_registry_spec.md` | 全発信物統制の運用導線（contentId / 承認ゲート） | SSOT 1-6 / 4-2-b / 7章 |
| 13 | `docs/ops/editorial_engine_spec.md` | 巡回・編集再発信の運用導線（監査必須） | SSOT 1-6 / 4-2-b / 7章 |
| 14 | `docs/policy_engine/watch_rules.md` | City Pack Failure Mode Watch の参照導線 | SSOT 5-8 / 3章 |
| 15 | `docs/ops/spec_guard_hard_fail.md` | Spec Guard（HARD FAIL）仕様 | SSOT 1-6 / 5-8 / 7章 |
| 16 | `docs/ops/logs_preference_decision_db_spec.md` | ログ/嗜好/判断DB設計（FROZEN参照） | SSOT 4-2-a / 4-2-b / 7章 / 8-5 |

`PolicyUxAdminMatrix.md` は Policy / UX / 管理UI を横断する統合参照点である。ドメイン横断の仕様確認は必ず `PolicyUxAdminMatrix.md` を起点とする。
`UX_STATE_MAP_7.md` は UX レイヤの使用仕様である。`policyDecision.result` / `reasonCode` / `nextAction` を参照はするが、定義・追加・変更はしない。Policy / reasonCode 側から 7状態を追加・変更することは禁止する。

### 2) “編集禁止領域”の定義（固定）

- **SSOTの複製**（reasonCodesの全文、データ辞書の全文、テンプレ文言の全文）を派生側で作らない。
- **DRAFT/追記案**は本文に入れない（隔離へ）。
- **SSOTに無い要素（enum/field/collection/state）**を本文へ追加しない。

### 3) SSOT強化（基盤6原則：参照導線）

以下は **SSOT（`PARENTY_SSOT.md`）本文に追記された基盤原則**であり、派生ドキュメントは本項を起点に該当SSOT節へ戻る。

#### 1-5. 実行主体と責務境界（Authority & Responsibility）

- **MUST**: 状態（state）変更・例外（override）・公開/停止などの決定は **Human または System** のみが行う（AIは提案まで）。
- **詳細（正）**: SSOT `PARENTY_SSOT.md` **1-5**

#### 1-6. Content Artifact / Content Lifecycle（全発信物統制）

- **MUST**: 個別会話を除く全発信物は contentId で統制し、承認ゲートと kill-switch を必須とする。
- **詳細（正）**: SSOT `PARENTY_SSOT.md` **1-6**

#### 3-4. 失敗時の既定動作（Fail-safe / Fail-open / Fail-close）

- **MUST**: 沈黙せず、失敗は reasonCode に正規化し、必要なら `incident_records` に接続する。誤配信より抑制（fail-close）を優先する。
- **詳細（正）**: SSOT `PARENTY_SSOT.md` **3-4**

#### 5-7. 外部依存UX原則（API劣化・停止時）

- **MUST**: ベンダー名/内部事情の露出を避けつつ、ユーザーに「できること」と公式導線を提示する。断定禁止、縮退は付録C参照のみ。
- **詳細（正）**: SSOT `PARENTY_SSOT.md` **5-7** / 付録F

#### 5-8. City Pack Failure Mode Watch（Watch Set）

- **MUST**: City Pack は Failure Mode Watch Set とし、状態のみを保持する。
- **詳細（正）**: SSOT `PARENTY_SSOT.md` **5-8**

#### 6-4. 権限モデル（RBAC）

- **MUST**: 管理操作は RBAC（`viewer/editor/operator/admin`）と `nextAction.constraints.requiresRole` の両方で強制し、監査ログを必須化する。
- **詳細（正）**: SSOT `PARENTY_SSOT.md` **6-4**（ロール定義は 6-3-3）

#### 8-5. データ保持・破棄・匿名化原則（Retention & Anonymization）

- **MUST**: Raw/Operational/Derived Insight を区分し、保持最小化・削除要求対応・逆算防止（Derived Insight の数値/比較禁止）を固定する。
- **詳細（正）**: SSOT `PARENTY_SSOT.md` **8-5**（保存期間は 7-3-3）

#### Appendix G. 将来機能の予約地（Non-Implemented / Reserved）

- **MUST**: 予約地は未実装であり、実装開始には SSOTの「責務境界／RBAC／保持／失敗既定」適合が必要。
- **詳細（正）**: SSOT `PARENTY_SSOT.md` **G**

---

## 結論

- 本リポジトリは、`SSOT_INDEX.md` を起点に全資料へ辿れることを **完了条件（DoD）**とする。
- 派生ドキュメントは **参照導線 + 契約 + 検査可能性**を担い、仕様内容の増殖を禁止する。

---

## 補足

### 差分サマリ（本ファイル）

- **追加**: `SSOT_INDEX.md`（最上位インデックス）
- **影響範囲**:
  - `README.md`（「最初に読むべきファイル」先頭に本ファイルを追加する必要がある）
  - `tools/validate_docs.js`（Lint対象に本ファイルを追加する必要がある）

### CTOタブ20枚用：読むべき最小セット（推奨タブ順）

以下の順で開けば、**仕様の正（SSOT）→参照体系→接続点→運用→未決**までを20枚以内で往復できる。

1. `SSOT_INDEX.md`（入口・参照体系）
2. `PARENTY_SSOT.md`（Single Source of Truth）
3. `Glossary.md`（用語の正）
4. `Guides.md`（派生ガイド統合：判断/UX/Admin/契約/ロードマップ等の参照導線）
5. `PolicyUxAdminMatrix.md`（Policy×UX×管理UIの接続点）
6. `APIRegistry.md`（内部API台帳：SSOT派生）
7. `APIRegistry_External.md`（外部API台帳：SSOT付録F準拠）
8. `FirestoreDataDictionary.md`（Firestore参照導線：入口のみ）
9. `FirestoreSecurityRules.md`（Rules要件）
10. `Observability.md`（観測導線）
11. `Runbook.md`（運用導線）
12. `ImplementationPlan.md`（工程固定）
13. `Progress.md`（進捗の唯一の記録）
14. `Todo.md`（判断待ちの唯一の記録）
15. `docs/INTEGRITY_CHECKLIST.md`（fail-fast検査の読み方）
16. `docs/api_watch/report.md`（外部API監視：最新レポート）
17. `docs/api_watch/snapshot.json`（外部API監視：最新スナップショット）

---

## 矛盾候補（隔離）

- （現時点なし）
