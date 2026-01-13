## ImplementationPlan（工程固定）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: 実装工程（Phase 0〜5）と順序固定を定義する。仕様内容はSSOTへ戻す。
- **想定読者**: Engineer(Cursor) / CTO(GPT)
- **依存SSoT**: `PARENTY_SSOT.md`
- **生成物**: Phase順序固定 + 各Phaseの開始/完了条件
- **編集禁止領域**:
  - Phase順序の入れ替え
  - SSOTにない工程要件の本文追加
- **更新ルール**: 判断が必要になったら `Todo.md` に記録して停止。進捗は `Progress.md` に反映。
- **変更履歴**:
  - 2026-01-07: 形式統一（メタを追加）
  - 2026-01-08: Firestore辞書の参照導線を `FirestoreDataDictionary.md` に統合（ファイル数最小化）

---

## 背景

工程を固定しないまま実装を始めると、SSOT整合より先にコードが増え、後戻り不能になる。

---

## 説明

## 0. 絶対ルール

- 実装は **Phase 0〜Phase 5 の順序固定**（入れ替え禁止）
- 仕様の正は `PARENTY_SSOT.md`
- 判断が必要になったら **Todo.md に記録して停止**
- 進捗は **Progress.md を唯一の記録**とする

---

## Phase 0: 設計固定・ドキュメント整備

### 開始条件

- `PARENTY_SSOT.md` が最新で、矛盾が解消されている

### 完了条件

- `Guides.md / Runbook.md / ImplementationPlan.md / Progress.md / Todo.md / README.md` が揃っている
- Vendor等の拡張は `Guides.md`（派生ガイド統合）と `Todo.md` の判断待ちで影響と未決事項が固定されている
- Firestore辞書の参照導線は `FirestoreDataDictionary.md` に統合して固定されている（SSOT 4-2-a/4-2-b）

---

## Phase 1: 基盤（Auth / Firestore / Security Rules）

SSOT参照: 4章（データ/Rules）

### 開始条件

- Phase 0 DONE

### 完了条件

- Firestore構造がSSOTに一致（collection/権限/append-only）
- PII保護（ログのマスキング方針）が実装に落ちる見通しが立つ

---

## Phase 2: Policy Engine（最優先）

SSOT参照: 3章 / 付録B / 6-0 / 6-2X / 6-2Z

### 開始条件

- Phase 1 DONE

### 完了条件

- `policyDecision` 正規形が全経路で生成できる
- fail-safe（UNKNOWN_REASON→DENY+CREATE_INCIDENT）が全経路で成立

---

## Phase 3: Delivery / UX（LINE入口・送信口一本化）

SSOT参照: 2章（レイヤー）/ 5章（UX）/ 付録C

### 開始条件

- Phase 2 DONE

### 完了条件

- 送信口が1つに固定（dedupeKey/traceId）
- DEGRADED/DENY文言が付録Cテンプレ参照のみで出せる

---

## Phase 4: Admin UI / Admin API（運用可能化）

SSOT参照: 6-0 / 6-2X / 6-2Y / 6-2Z / 7章

### 開始条件

- Phase 3 DONE

### 完了条件

- nextActionが常時返却され、UIが解釈せずに動ける
- 操作が audit_logs（append-only）に必ず残る

---

## Phase 5: 監査・障害対応・ローンチ手順

SSOT参照: 7章 / 8章

### 開始条件

- Phase 4 DONE

### 完了条件

- 日次運用（7-1）が回せる
- 障害対応（7-2）が runbookLabel で再現可能
- 保存期間/監査（7-3）が定義どおり

---

## 結論

- 実装はPhase順序固定で進め、SSOT整合が崩れたら止める。

---

## 補足

- （特になし）
