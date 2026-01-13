# PHASE0_REPO_SNAPSHOT

## 1. Git 状態

- git rev-parse --show-toplevel: `/Users/parentyai.com/Projects/Parenty 1.0/parenty`
- git status -sb: `## No commits yet on main...origin/main [gone]`（全ファイル未追跡）
- git branch -vv: 出力なし（コミット未作成）
- git log -n 20 --oneline: 失敗（no commits yet）

備考
- `.git` は `/Users/parentyai.com/Projects/Parenty 1.0/parenty/.git` に存在。
- 上位ディレクトリ（`/Users/parentyai.com/Projects/Parenty 1.0`）は非Git。

---

## 2. ディレクトリ構造（深さ2・repoルート基準）

```
.
./.github
./.github/workflows
./backend
./backend/src
./backend/tools
./docs
./docs/_templates
./docs/api_watch
./docs/data-sources
./docs/data_dictionary
./docs/matrix
./docs/ops
./docs/policy_engine
./docs/security
./docs/ux_spec
./tools
./tools/lib
./tools/tests
```

---

## 3. ドキュメント一覧とSSOT候補の短評

SSOT候補（正の所在）
- `PARENTY_SSOT.md`: SSOT本体（唯一の正）
- `SSOT_INDEX.md`: SSOTの参照入口
- `PolicyUxAdminMatrix.md`: 横断マトリクス（SSOTに従属）

下位仕様/補助（SSOT従属）
- `UX_STATE_MAP_7.md`: UX状態仕様
- `FirestoreDataDictionary.md`: データ辞書（派生）
- `FirestoreSecurityRules.md`: ルール設計（派生）
- `APIRegistry.md` / `APIRegistry_External.md`: API台帳（派生）
- `Runbook.md` / `Observability.md`: 運用・監視（派生）
- `Guides.md` / `README.md`: 説明・導線
- `Progress.md` / `Todo.md`: 進捗・判断待ち
- `DOCUMENT_AUTHORITY_MODEL.md`: 権威モデル
- `ADMIN_UX_API_DECISION_MAP_7.md` / `ADMIN_API_READINESS_MAP.md`: 管理系判断地図（非仕様）
- `docs/INTEGRITY_CHECKLIST.md`: Lint/検査の入口
- `docs/ops/logs_preference_decision_db_spec.md`: FROZEN設計資料（非仕様）
- `docs/implementation_entry_gate_semi_automation.md`: 実装開始ゲート（非仕様）

backend（実装雛形）
- `backend/index.js`: Express起動・/health・/line/webhook
- `backend/src/config/env.js`: 環境変数読み込みと必須チェック
- `backend/src/line/*`: LINE署名検証とイベント整形
- `backend/.env.example`: 変数名のみ

備考
- ARCHITECTURE / VERSION_HISTORY 相当の専用ファイルは確認できない。
