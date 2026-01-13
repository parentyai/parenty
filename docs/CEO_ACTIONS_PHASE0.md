# CEO_ACTIONS_PHASE0（非エンジニア向け / Phase 0）

本書は仕様ではない。
本書は定義・権威・判断の正を持たない。
本書は SSOT / PolicyUxAdminMatrix / 下位仕様を変更・補完・再定義しない。
矛盾がある場合は、常に SSOT / PolicyUxAdminMatrix が優先される。
本書を根拠に実装・仕様変更・運用判断を行ってはならない。

---

## 1. Google Cloud Run / IAM / Secret Manager（WIF含む）

- 何をするか: 実行基盤と最小権限を確定し、Secretsを登録する。
- どこでやるか: Google Cloud Console（Cloud Run / IAM / Secret Manager / Workload Identity）
- 手順:
  1. 対象プロジェクトを選択する。
  2. Cloud Run サービスの対象リージョンを確認する。
  3. 実行用サービスアカウントを作成する。
  4. 最小権限のIAMロールを付与する。
  5. Secret Manager を開く。
  6. 必要なSecret名を作成する（値は空欄のまま記録のみ）。
  7. Cloud Run と Secret の紐付け範囲を確認する。
  8. WIF を使う場合は信頼元と対象サービスアカウントを記録する。
- 入力するもの:
  - <SERVICE_ACCOUNT_NAME>
  - <SECRET_NAME_LIST>
  - <WIF_PROVIDER_ID>（利用する場合のみ）
- できたか確認:
  - Cloud Run サービスに実行アカウントが設定されている。
  - Secret 名が一覧に表示される。
- よくある失敗と対処:
  - プロジェクト選択ミス: 対象プロジェクトを再確認する。
  - 権限過多: 付与ロールを最小化して再設定する。
  - Secret 名の誤記: 一覧に存在するか確認し、必要なら作成し直す。

---

## 2. GitHub（Actions Secrets/Variables、branch protection）

- 何をするか: CIの実行環境とブランチ保護を固定する。
- どこでやるか: GitHub Repository Settings
- 手順:
  1. Settings → Actions を開く。
  2. Secrets and variables を開く。
  3. Phase 0 の必須Secret名を登録する（値は空欄のまま記録のみ）。
  4. Branch protection を開く。
  5. main への直push禁止を有効化する。
  6. Required status checks に integrity を追加する。
  7. Pull request review を必須に設定する。
- 入力するもの:
  - GITHUB_ACTIONS_SECRET_NAMES:
    - GCP_PROJECT_ID
    - GCP_REGION
    - CLOUD_RUN_SERVICE
    - GCP_SA_KEY
  - REQUIRED_STATUS_CHECKS:
    - integrity
- できたか確認:
  - main への直接pushがブロックされる。
  - PRで integrity が必須チェックになる。
- よくある失敗と対処:
  - Required checksの選択漏れ: integrity を追加する。
  - Secrets名の誤記: CIログで参照名を確認し修正する。
  - ブランチ保護が無効: ルール保存を再確認する。

---

## 3. LINE Developers / Messaging API

- 何をするか: LINEチャネルを作成し、Webhookの責務を固定する。
- どこでやるか: LINE Developers Console
- 手順:
  1. Provider を選択または作成する。
  2. Messaging API チャネルを作成する。
  3. Webhook URL を登録する（値は空欄のまま記録のみ）。
  4. Webhook 有効化を確認する。
  5. チャネル基本情報を記録する。
  6. チャネルシークレットとアクセストークンの保存先を決める。
- 入力するもの:
  - <WEBHOOK_URL>
  - <CHANNEL_SECRET>
  - <CHANNEL_ACCESS_TOKEN>
- できたか確認:
  - Webhook が有効状態で表示される。
  - チャネル情報が一覧に表示される。
- よくある失敗と対処:
  - Webhook URL の誤記: URLを再入力する。
  - チャネル種別の誤選択: Messaging API であることを確認する。
  - Token保存漏れ: Secret Manager に記録する。

---

## 4. Stripe（API keys, webhook, product/price, customer portal）

- 何をするか: StripeのAPIキーとWebhook、商品/価格、ポータル設定を固定する。
- どこでやるか: Stripe Dashboard
- 手順:
  1. API keys を開く。
  2. 公開鍵/秘密鍵の保存先を決める。
  3. Webhook endpoints を開く。
  4. Webhook URL を登録する（値は空欄のまま記録のみ）。
  5. 受信イベント種別を記録する。
  6. Products/Prices を開く。
  7. 商品と価格の識別子を記録する。
  8. Customer Portal を有効化し、対象の設定を記録する。
- 入力するもの:
  - <STRIPE_SECRET_KEY>
  - <STRIPE_PUBLISHABLE_KEY>
  - <STRIPE_WEBHOOK_URL>
  - <PRODUCT_ID_LIST>
  - <PRICE_ID_LIST>
- できたか確認:
  - Webhook endpoint が有効状態で表示される。
  - 商品/価格IDが一覧に表示される。
- よくある失敗と対処:
  - Test/Live の混同: 環境を確認して作成する。
  - Webhookイベントの過不足: 必要イベントのみ選択する。
  - 価格IDの記録漏れ: 価格一覧から再確認する。

---

## 5. OpenAI（API key、使用モデル/レート/コスト注意）

- 何をするか: OpenAIのAPIキーと利用上限を固定する。
- どこでやるか: OpenAI Dashboard
- 手順:
  1. API Keys を開く。
  2. 新しいキーを作成し、保存先を決める。
  3. Usage/Limit を確認する。
  4. 上限値（予算/レート）を記録する。
  5. 利用するモデル名を記録する。
- 入力するもの:
  - <OPENAI_API_KEY>
  - <MODEL_NAME>
  - <USAGE_LIMIT>
- できたか確認:
  - APIキーが一覧に表示される。
  - 上限値とモデル名が記録できている。
- よくある失敗と対処:
  - キーの保存漏れ: Secret Manager に記録する。
  - 上限値未設定: Usage/Limit で再設定する。
  - モデル名の誤記: Dashboardの表記を確認する。
