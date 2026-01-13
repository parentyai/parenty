## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: リポジトリの入口。SSOTインデックスへ誘導し、仕様の正を固定する。
- **想定読者**: 全員
- **依存SSoT**: `PARENTY_SSOT.md`
- **生成物**: “最初に読むべき順序”と運用ルールの最小提示
- **更新ルール**: 参照体系やルールは `SSOT_INDEX.md` を正とし、矛盾が出たら `Todo.md` に記録して停止。
- **変更履歴**:
  - 2026-01-07: `SSOT_INDEX.md` / `Glossary.md` を先頭導線へ追加
  - 2026-01-08: `APIRegistry.md` を追加

---

## 背景

Parenty は、海外在住の日本語話者家庭に向けた「家庭情報インフラ」です。  
本リポジトリは **実装前に設計・判断・工程を固定し、合意内容をファイルとして永続化する**ことを最優先に運用します。

---

## 説明

### 最初に読むべきファイル（固定）

1. `SSOT_INDEX.md`（最上位：参照体系/更新規約の唯一の正）
2. `PARENTY_SSOT.md`（Single Source of Truth）
3. `Glossary.md`（用語辞書：表記揺れを固定）
4. `Guides.md`（派生ガイド統合：参照導線のみ）
6. `APIRegistry.md`（API台帳：SSOT派生。共通契約＋未確定の隔離）
7. `PolicyUxAdminMatrix.md`（Policy×UX×管理UIの中心）
8. `FirestoreDataDictionary.md`（データ辞書：参照導線）
9. `FirestoreSecurityRules.md`（Rules要件）
10. `Observability.md`（観測ログ/メトリクス）
12. `Runbook.md`（RunbookLabel/運用導線）
13. `ImplementationPlan.md`（Phase 0〜5 の工程固定）
14. `Progress.md`（進捗の唯一の記録）
15. `Todo.md`（判断待ち事項のみ）
16. （補足）派生ガイドの統合元（参照用の過去ファイル名）は `Guides.md` に集約

### 運用ルール（抜粋）

- 仕様の正は `PARENTY_SSOT.md`
- 参照体系/更新規約の正は `SSOT_INDEX.md`
- 判断が必要になった場合は `Todo.md` に記録して停止
- 作業進捗は `Progress.md` に必ず反映
- 人間承認があるまで、Phase 1以降には進まない

### Appendix G（将来機能）の実装禁止（固定）

- `PARENTY_SSOT.md` の **付録G** に列挙された機能は **実装禁止（Reserved / Non-Implemented）**。
- 例外ルールなし。

## SSOT as a Living System

- Violation Registry: `SSOT_VIOLATION_REGISTRY.md`
- Guard Promotion: `SSOT_GUARD_PROMOTION_RULES.md`
- Appendix G Gate: `RESERVED_FEATURES_GATE.md`

## SSOT Change Control Flow

1. Change Declaration: `SSOT_CHANGE_DECLARATION.md`
2. Violation Registry: `SSOT_VIOLATION_REGISTRY.md`
3. Guard Promotion: `SSOT_GUARD_PROMOTION_RULES.md`

## SSOT Change Decision Flow

1. PR declares SSOT change (Yes / No)
2. validate_docs checks declaration vs diff
3. Warnings surface in CI
4. Violations may be recorded
5. Guards may be promoted

---

## 結論

迷ったら `SSOT_INDEX.md` を起点に SSOT へ戻る。

---

## 補足

- （特になし）

