# ENVIRONMENT_VARIABLES（backend）

## 方針
- 値は一切記載しない。
- ENV名と投入場所のみを固定する。
- 本ファイルは backend の起動に必要な最小セットを示す。

## 必須（起動に必要）

| var_name | required_in | source | purpose | risk | validation | owner |
|---|---|---|---|---|---|---|
| PORT | local / stg / prod | ローカル: `.env` / Cloud Run: 自動付与 | 起動ポート | 起動失敗・疎通不可 | 起動ログと `/health` | EngAI |
| ENV_NAME | local / stg / prod | ローカル: `.env` / Cloud Run: env | 環境識別 | 誤運用 | `/health` の envName | EngAI |
| PUBLIC_BASE_URL | local / stg / prod | ローカル: `.env` / Cloud Run: env | Webhook/外部導線の基準URL | Webhook不一致 | `/health` の baseUrl | EngAI |
| LINE_CHANNEL_SECRET | local / stg / prod | ローカル: `.env` / Cloud Run: Secret Manager | LINE署名検証用 | 401固定・誤受信 | Webhook署名テスト | Owner |
| LINE_CHANNEL_ACCESS_TOKEN | local / stg / prod | ローカル: `.env` / Cloud Run: Secret Manager | 将来の返信/Push用 | 返信不能 | 未使用（Phase0） | Owner |

## 追加（Firestore導入時）

| var_name | required_in | source | purpose | risk | validation | owner |
|---|---|---|---|---|---|---|
| GCP_PROJECT_ID | stg / prod | Cloud Run: env | GCPプロジェクト識別 | 誤プロジェクトアクセス | Cloud Run env | Owner |
| FIRESTORE_DATABASE_ID | stg / prod | Cloud Run: env | Firestore DB識別 | 読み書き失敗 | 実装後に確認 | Owner |
| GOOGLE_APPLICATION_CREDENTIALS | local | ローカル: ファイルパス | ローカル認証 | 認証失敗 | 実装後に確認 | Owner |

## 将来候補（雛形で未使用）

| var_name | required_in | source | purpose | risk | validation | owner |
|---|---|---|---|---|---|---|
| OPENAI_API_KEY | stg / prod | Secret Manager | LLM利用 | 課金/漏洩 | 実装後に確認 | Owner |
| STRIPE_SECRET_KEY | stg / prod | Secret Manager | 決済 | 課金/漏洩 | 実装後に確認 | Owner |
| STRIPE_WEBHOOK_SECRET | stg / prod | Secret Manager | Webhook検証 | 401固定・誤受信 | 実装後に確認 | Owner |
| STRIPE_PRICE_SOLO_MONTHLY | stg / prod | Stripe dashboard | 価格ID | 誤課金 | 実装後に確認 | Owner |
