# PHASE1_AUTH_SCOPE（Auth適用範囲 / 派生）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。

---

## 背景

Phase 1 で Auth を導入するため、公開範囲と認証必須範囲を固定する。

---

## 説明

### 参照の正（SSOT）

- `PARENTY_SSOT.md` 4-4（ロール / Rules 原則）

### 公開エンドポイント（認証不要）

- `GET /health`
- `POST /line/webhook`

### 認証必須エンドポイント（共通）

- 上記以外のすべて
- Firebase ID Token（Bearer）を要求する

### ロール（SSOTに準拠）

- `guardian`
- `admin`
- `system`

### 参照実装

- `backend/src/auth/middleware.js`
- `backend/index.js`（公開パスの明示とAuth適用）

---

## 結論

公開は `/health` と `/line/webhook` のみとし、それ以外は Firebase ID Token を必須とする。

---

## 補足

- 役割の詳細定義は SSOT 4-4 に従属する。
