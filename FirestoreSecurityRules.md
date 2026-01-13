## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: Firestore Security Rules の“要求仕様”をSSOT参照で固定する（実装コードはここに書かない）。
- **想定読者**: Engineer(Cursor) / Security Reviewer / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（2章/4章/7-3）
- **生成物**: UX/管理の読み書き分離・PII保護・append-onlyログの要件
- **編集禁止領域**:
  - 実際のRules実装（code）を本文に貼り付けること
  - SSOTに無い読み書き権限の付与
- **更新トリガー**: SSOT 4章（コレクション/権限）/ 7-3（監査/保存期間）更新
- **関連ID体系（固定）**: householdId / guardianId / childId / adminUserId（SSOT命名規約）
- **変更履歴**:
  - 2026-01-07: 初版
- **関連リンク**: `SSOT_INDEX.md` / `Glossary.md` / `FirestoreDataDictionary.md` / `Guides.md`

---

## 背景

- Security Rules は“最後の砦”であり、UX/管理/システムの分離を強制する必要がある（SSOT 2-2）。
- Rules要件が文書化されていないと、実装時に暗黙の権限が生まれ事故る。

---

## 説明

### 参照の正（SSOT）

- `PARENTY_SSOT.md`
  - 2-2（レイヤー責務分離：UXは判断しない／Opsは統治）
  - 4章（データモデル、R/W規約）
  - 7-3（監査ログ/保存期間/PII）

### Rules 要件（参照導線：本文は要件のみ）

※ 具体のコレクション別R/WはSSOT 4章へ戻る。本ファイルは **Rulesに落とすべき要件カテゴリ**を固定する。

- **スコープ分離（固定）**
  - UX（guardian等）と Admin（admin_users等）の読み書きを分離する
  - “管理UIで見えるから”という理由でUX側へ権限を広げない

- **家庭境界（固定）**
  - guardian は自分の householdId 範囲外を読めない/書けない
  - child は最重要保護対象として最小権限（SSOT 1-3/1-4）

- **append-only（固定）**
  - logs/audit_logs 等の監査一次情報は更新/削除を禁止する（append-only）

- **system write（固定）**
  - global_flags / templates 等の統治データは system の正規経路（API/監査）以外で書けない

- **PII最小化（固定）**
  - Rulesは“保存してはいけない”を代替しない（PIIはそもそも保存しない）
  - ただし、保管庫へのアクセス制御として最小権限を強制する

---

## 結論

- Security Rules はSSOTのデータ/RW規約を強制するための実装層であり、要件はSSOT参照で固定する。

---

## 補足

### 変更差分（本ファイル）

- **追加**: `FirestoreSecurityRules.md`（要求仕様のみ）
- **影響範囲**:
  - `ImplementationPlan.md`（Phase 1 の“完了条件”にRules要件の参照導線が追加可能）
  - `tools/validate_docs.js`（Lint対象へ追加が必要）

---

## 矛盾候補（隔離）

- （現時点なし）


