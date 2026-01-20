# DEPLOY_CLOUD_RUN（backend）

## 前提
- gcloud が利用可能であること。
- プロジェクトとリージョンは単一環境で固定する。

---

## 1) プロジェクト設定

```bash
gcloud config set project <YOUR_PROJECT_ID>
gcloud config set run/region <YOUR_REGION>
```

---

## 2) Secret Manager 登録（推奨）

```bash
gcloud services enable secretmanager.googleapis.com

gcloud secrets create LINE_CHANNEL_SECRET --replication-policy=automatic
gcloud secrets create LINE_CHANNEL_ACCESS_TOKEN --replication-policy=automatic

printf '%s' '<LINE_CHANNEL_SECRET>' | gcloud secrets versions add LINE_CHANNEL_SECRET --data-file=-
printf '%s' '<LINE_CHANNEL_ACCESS_TOKEN>' | gcloud secrets versions add LINE_CHANNEL_ACCESS_TOKEN --data-file=-
```

---

## 3) ビルド & デプロイ

```bash
gcloud services enable run.googleapis.com

gcloud builds submit --tag gcr.io/<YOUR_PROJECT_ID>/parenty-backend

gcloud run deploy parenty-backend \
  --image gcr.io/<YOUR_PROJECT_ID>/parenty-backend \
  --allow-unauthenticated \
  --set-env-vars ENV_NAME=prod,PUBLIC_BASE_URL=https://<CLOUD_RUN_URL>,GCP_PROJECT_ID=<YOUR_PROJECT_ID>,FIRESTORE_DATABASE_ID=(default),POLICY_REASON_CODE_INDEX_PATH=backend/reason_code_index.json \
  --set-secrets LINE_CHANNEL_SECRET=LINE_CHANNEL_SECRET:latest,LINE_CHANNEL_ACCESS_TOKEN=LINE_CHANNEL_ACCESS_TOKEN:latest
```

---

## 4) 動作確認

```bash
curl -sS https://<CLOUD_RUN_URL>/health
```

期待結果
- HTTP 200
- `status: ok` / `envName` / `ts` / `baseUrl`

---

## 5) 参考（Secret Manager を使わず環境変数で渡す場合）

```bash
gcloud run deploy parenty-backend \
  --image gcr.io/<YOUR_PROJECT_ID>/parenty-backend \
  --allow-unauthenticated \
  --set-env-vars ENV_NAME=prod,PUBLIC_BASE_URL=https://<CLOUD_RUN_URL>,LINE_CHANNEL_SECRET=<VALUE>,LINE_CHANNEL_ACCESS_TOKEN=<VALUE>
```

注意
- 本番では Secret Manager を優先する。
