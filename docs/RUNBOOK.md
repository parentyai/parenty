# RUNBOOK（backend最小運用）

本書は backend 最小運用の補助資料であり、運用の正本は `Runbook.md` に固定する。

## 背景
- backend は最小の疎通確認を目的とした雛形であり、機能拡張は後続フェーズで行う。

## 運用方針
- Secret は必ず Secret Manager に保管し、Cloud Run には参照のみを設定する。
- ローカルは `.env` を使用するが、値は共有しない。
- ログはイベント要約のみを出力し、秘密情報や署名値は出力しない。
- 公開エンドポイントは `/health` と `/line/webhook` のみ。その他は Firebase ID Token が必要。

## Secret の置き場所
- LINE_CHANNEL_SECRET: Secret Manager
- LINE_CHANNEL_ACCESS_TOKEN: Secret Manager
- 追加予定の Secret も同一方針に揃える

## Service URL（single-env）
- https://<CLOUD_RUN_URL>

## ローテーション
- Secret 変更時は Cloud Run の参照先を最新版に切り替える。
- 切替後は `/health` と署名テストで確認する。

## 障害切り分け
- /health が 200 でない: 環境変数・起動ログを確認する。
- /line/webhook が 401: LINE_CHANNEL_SECRET の不一致を確認する。
- 200 だがイベントが出力されない: LINE webhook の到達と署名を確認する。
- Firestore 事前確認: `npm run firestore:preflight` を実行し、`ok`/`failed`/`not configured` を確認する。

## ログ
- 署名不正: 401 を返し、イベント内容は記録しない。
- 署名正当: イベント要約のみをログ出力する。
- line.userId はハッシュ化し、message.text は長さのみを記録する。

## Cloud Run ログ監視フィルタ（例）

Cloud Logging（クエリ）
```
resource.type="cloud_run_revision"
resource.labels.service_name="parenty-backend"
jsonPayload.message:"[line.webhook]"
```

`gcloud` で直近ログ確認
```
gcloud logging read \
  'resource.type="cloud_run_revision" AND resource.labels.service_name="parenty-backend" AND jsonPayload.message:"[line.webhook]"' \
  --limit 50
```

## Firestore Rules / Indexes 反映

前提
- `firebase.json` / `.firebaserc` がリポジトリに存在すること

反映コマンド
```
firebase deploy --only firestore:rules,firestore:indexes
```

整合チェック（任意）
```
cd backend
npm run firestore:index-audit
```

Rulesチェック（dry-run）
```
cd backend
npm run firestore:rules-audit
```

## 実作業ログ（運用記録）

- 2026-01-13: Cloud Run 環境変数を整理（LINE_REPLY_CONTENT_ID / GCP_PROJECT_ID / FIRESTORE_DATABASE_ID / PUBLIC_BASE_URL）、/health で `firestore.configured: true` を確認。
- 2026-01-18: Phase4 v1 テンプレ運用（prod）を確認。`tpl_cp_nyc_optin_prompt_v1` の `active → disabled → active` を実施し、`notification_deliveries` に `contentId/templateId/policyDecision` が記録されることを確認。
