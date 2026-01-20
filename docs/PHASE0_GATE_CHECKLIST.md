# PHASE0_GATE_CHECKLIST

記入ルール
- Yes/No を記入する。
- Yes が揃うまで Phase 1 へ進まない。

| 項目 | Yes/No | 備考 |
|---|---|---|
| Repoがクリーン | Yes | 初回コミット完了 |
| ENV一覧が完成 | Yes | `docs/ENVIRONMENT_VARIABLES.md` |
| CEO作業手順書が完成 | Yes | `docs/CEO_ACTIONS_PHASE0.md` |
| Smoke testsが文章化済み | Yes | `docs/SMOKE_TESTS.md` |
| Secretsがコード/ログに出ない（grepで確認） | Yes | `.env` を除外して検索済み（値の混入なし） |
| single-env の環境識別が一意（ENV_NAME=prod） | No | `/health` で `envName=prod` を確認する |
