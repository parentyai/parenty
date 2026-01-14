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
2) ボットから `OK` または `LINE_REPLY_TEXT` の返信が返ることを確認

期待結果
- 返信が `OK` または `LINE_REPLY_TEXT` である
- Cloud Run ログに `line.webhook` の記録が出る
- ログ内の userId はハッシュ化され、message.text は長さのみ表示される

---

## 追加（任意）

`tools/smoke_http.sh` で /health のみ確認可能。

```bash
./tools/smoke_http.sh http://localhost:3000
```
