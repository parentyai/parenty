# 教育データ公式ソース台帳 スキーマ（master.schema.md）

## トップ構造
- type: object
- keys:
  - version: string
  - updatedAt: string（YYYY-MM-DD）
  - notes: string
  - records: array

## レコード（records[]）

### 必須キー
- id: string（一意ID、例: "us-k12-ny-seda-calendar"）
- name: string（ソース名）
- stateCode: string（2文字州コード）
- authority: string（公式性の主体）
- sourceType: string（ソース分類）
- officialScore: integer（0-3）
- scope: array（対象範囲）
- baseUrl: string（起点URL）
- terms: object（規約情報）
- auth: object（認証情報）
- status: string（稼働状態）

### 任意キー
- description: string
- districts: array（学区IDまたは名称）
- coverageNote: string
- update: object（更新情報）
- evidence: object（公式性根拠）
- linkChecks: array（リンク検証記録）
- tags: array

## enum 定義
- authority:
  - state_education_agency
  - state_government
  - district
  - other_public
- sourceType:
  - api
  - web_only
  - portal_only
  - file_download
- status:
  - active
  - deprecated
  - unknown
- scope（配列要素）:
  - k12
  - calendar
  - closure
  - meals
  - boundary
  - announcements

## terms（規約情報）
- 必須キー:
  - termsUrl: string or null
  - licenseUrl: string or null
  - commercialUse: string（allow/deny/unknown）
  - redistribution: string（allow/deny/unknown）
  - scraping: string（allow/deny/unknown）
  - rateLimit: string（記述）
  - notes: string
- 記入ルール:
  - termsUrl が null の場合は terms.notes に "terms_missing" を入れる
  - termsUrl が不明な場合は status を unknown にする

## auth（認証情報）
- 必須キー:
  - method: string（none/api_key/oauth/other）
  - notes: string

## update（更新情報）
- 任意キー:
  - frequency: string（例: monthly/weekly/unknown）
  - observedAt: string（YYYY-MM-DD）
  - lastChangedAt: string（YYYY-MM-DD or null）

## evidence（公式性根拠）
- 任意キー:
  - officialDocsUrl: string or null
  - officialListUrl: string or null
  - notes: string

## linkChecks（リンク検証記録）
- 配列要素の必須キー:
  - url: string
  - lastCheckedAt: string（YYYY-MM-DD）
  - status: string（ok/redirect/dead/unknown）
  - note: string
- 概念定義:
  - linkChecks は将来の検証記録用の枠であり、現時点では記録形式のみを固定する

## APIではない公的ソースの扱い
- sourceType が web_only / portal_only / file_download の場合も台帳に登録する
- 取得手段はここで決めない（仕様・実装判断は別途）
