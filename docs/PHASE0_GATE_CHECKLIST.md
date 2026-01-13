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
| STG/PRODの境界が崩れていない（ENV_NAME等） | Yes | `/health` で `envName=stg` を確認済み |
