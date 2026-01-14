# PHASE1_ROADMAP（基盤：Auth / Firestore / Security Rules）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。

## メタ（固定）

- **SSoT責務**: Phase 1 の実装順序を、SSOT参照で固定する（新仕様は追加しない）。
- **想定読者**: Engineer / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（2章 / 4章 / 6-4 / 7-3）
- **参照導線**: `ImplementationPlan.md` / `FirestoreDataDictionary.md` / `FirestoreSecurityRules.md`
- **更新ルール**: 判断が必要なら `Todo.md` に記録して停止する。

---

## 背景

Phase 1 はデータ層と権限制御の基盤を固める工程であり、SSOTの拘束を最初に実装へ移す。

---

## 説明

### 1) 対象スコープ（固定）

- **Auth / 責任主体**: SSOT 2章 / 6-4
- **Firestore データ辞書**: SSOT 4-2-a / 4-2-b
- **Firestore Index**: SSOT 4-3
- **Security Rules**: SSOT 4-4
- **監査・保持・PII**: SSOT 7-3 / 4-2-a（ログはマスキング）
- **実装成果物**: `firestore.rules` / `firestore.indexes.json` / `firebase.json` / `.firebaserc`

### 2) 作業順序（参照導線）

1. **コレクション入口の確定**
   - 参照: `FirestoreDataDictionary.md` / `docs/data_dictionary/*/README.md`
   - SSOT 4-2-a / 4-2-b と一致することを確認する。
2. **データ層の実装**
   - SSOT 4-2-a / 4-2-b の定義に沿って、読み書きの対象を固定する。
3. **Security Rules 実装**
   - 参照: `FirestoreSecurityRules.md`
   - SSOT 4-4 の要求仕様を強制する。
4. **Index 実装**
   - SSOT 4-3 の索引定義に一致させる。
5. **保持・監査の実装**
   - SSOT 7-3 の保存期間と append-only 要件に一致させる。
6. **PII保護の実装**
   - SSOT 4-2-a / 7-3 のマスキング要件を適用する。
7. **健全性チェック**
   - `/health` と preflight の結果が想定どおりであることを確認する。
8. **Firestore クライアント整備**
   - `backend/src/firestore/client.js` を起点に接続を統一する。
9. **Auth 骨格の整備**
   - `backend/src/auth/*` を追加し、SSOT 4-4 のロールモデルに一致させる。
10. **データ層の入口整備**
   - `backend/src/firestore/refs.js` でコレクション名を固定する。

### 3) ブロッカー（判断待ち）

- `Todo.md` の未解決事項が残る場合は作業を停止する。

---

## 結論

Phase 1 の実装は、SSOT 4章と 7-3 の要求仕様を順番どおりに移植することが目的である。

---

## 補足

- 完了条件は `ImplementationPlan.md` の Phase 1 に従う。
