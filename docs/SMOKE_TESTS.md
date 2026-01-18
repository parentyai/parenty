# SMOKE_TESTS（backend）

## 前提
- 作業ディレクトリは `parenty/backend`。
- `.env` はローカルでのみ使用し、Gitに含めない。

---

## ローカル

### 1) 起動

```bash
cd backend
npm install
npm run dev
```

期待結果
- コンソールに `listening` が表示される。

### 2) /health が 200

```bash
curl -sS http://localhost:3000/health
```

期待結果
- HTTP 200
- `status: ok` / `envName` / `ts` / `baseUrl` を含む JSON
- Firestore 用ENVが入っていれば `firestore.configured: true`

### 2.5) Firestore preflight（任意 / 読み書きなし）

```bash
npm run firestore:preflight
```

期待結果
- `firestore.preflight` が `ok` で終わる
- 失敗時は `not configured` または `failed` が出る
- `ENV_NAME=local` の場合は `GOOGLE_APPLICATION_CREDENTIALS` が必要

### 3) 署名不正 webhook が 401

```bash
curl -sS -X POST http://localhost:3000/line/webhook \
  -H 'Content-Type: application/json' \
  -H 'X-Line-Signature: invalid' \
  -d '{"events":[]}'
```

期待結果
- HTTP 401

### 4) 署名正 webhook が 200

```bash
BODY='{"events":[{"type":"message","timestamp":1700000000000,"source":{"type":"user","userId":"Uxxxx"},"message":{"type":"text","text":"ping"}}]}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$LINE_CHANNEL_SECRET" -binary | openssl base64 -A)

curl -sS -X POST http://localhost:3000/line/webhook \
  -H 'Content-Type: application/json' \
  -H "X-Line-Signature: $SIG" \
  -d "$BODY"
```

期待結果
- HTTP 200
- コンソールにイベント要約が出力される
- Firestore が未設定の場合は 503（LINE返信の監査ログが必須のため）

---

## Cloud Run

### stg /health が 200

```bash
curl -sS https://parenty-backend-920294176726.us-east1.run.app/health
```

期待結果
- HTTP 200
- `envName: "stg"`

### prod /health が 200

```bash
curl -sS https://parenty-backend-prod-920294176726.us-east1.run.app/health
```

期待結果
- HTTP 200
- `envName: "prod"`

### LINE 実メッセージ疎通（返信あり）

1) LINEアプリからボットに `ping` を送信  
2) ボットから返信が返ることを確認  
3) `templates` に `LINE_REPLY_CONTENT_ID` の本文が存在することを確認

期待結果
- 返信が `LINE_REPLY_CONTENT_ID` のテンプレ本文である
- Cloud Run ログに `line.webhook` の記録が出る
- ログ内の userId はハッシュ化され、message.text は長さのみ表示される

---

## Phase4 v1 Ops-Ready（テンプレ運用/監査）

### 1) templates 状態の初期確認（一覧）

対象 templateId（6件）
- tpl_cp_nyc_school_calendar_v1
- tpl_cp_nyc_emergency_alert_v1
- tpl_cp_nyc_admin_update_v1
- tpl_editorial_nyc_update_v1
- tpl_cp_nyc_optin_prompt_v1
- tpl_cp_nyc_update_digest_v1

期待結果
- 初期は `draft`

### 2) 承認＝active の切替（1件のみ）

Firestore Console で対象 templateId の `status` を `active` に変更する。
推奨: `tpl_cp_nyc_optin_prompt_v1`（Opt-in 文面）

期待結果
- `status=active` のみが配信対象になる

### 3) ロールバック確認（停止/復帰）

同一 templateId を `active → disabled → active` の順で切り替える。

期待結果
- `disabled` では配信されない
- `active` で配信が復帰する

### 4) 配信・監査ログ確認（1回だけ）

1) STG もしくは自分のみの限定ユーザーで送信を1回実行  
2) Firestore の `notification_deliveries` を確認

期待結果（必須）
- contentId
- templateId
- policyDecision（ALLOW/DENY/DEGRADED）
- timestamps（createdAt / sentAt）
- 宛先識別（householdId など）

失敗時
- `status=draft/disabled` のまま配信しようとしていないか確認
- templates に `body` が存在するか確認

---

## Phase4.1 Trigger（Admin API）

### 1) Admin Trigger（active）

```
POST /admin/v1/trigger/send
{
  "contentId": "cp_nyc_optin_prompt_v1",
  "targetScope": { "userId": "Uxxxx" },
  "reason": "phase4_1 smoke"
}
```

期待結果
- HTTP 200
- `notification_deliveries` に `contentId/templateId/policyDecision` が残る

### 2) Admin Trigger（draft/disabled）

```
POST /admin/v1/trigger/send
{
  "contentId": "cp_nyc_optin_prompt_v1",
  "targetScope": { "userId": "Uxxxx" }
}
```

期待結果
- 対象テンプレは配信されず、DEGRADED/DENY テンプレで返信される
- `notification_deliveries` に必須3点が残る

実施記録（prod）
- 2026-01-18: `tpl_cp_nyc_optin_prompt_v1` の `active → disabled → active` を確認し、`notification_deliveries` に `contentId/templateId/policyDecision` が記録されることを確認。

---

## 追加（任意）

`tools/smoke_http.sh` で /health のみ確認可能。

```bash
./tools/smoke_http.sh http://localhost:3000
```
