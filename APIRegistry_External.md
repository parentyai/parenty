## APIRegistry_External（Parenty 外部API台帳：仕様・規約・監視対象 / SSOT準拠）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: 外部APIの「根拠URL（仕様/規約/ポリシー/価格）」「扱い（公式/準公式/参考）」「監視対象」を台帳として固定し、規約変更による事故（法務/UX/運用/監査）を予防する。
- **想定読者**: Engineer(Cursor) / CTO(GPT) / Ops / Admin
- **依存SSoT**:
  - `PARENTY_SSOT.md` 付録F（External API 共通原則 + API台帳）
  - `PARENTY_SSOT.md` 付録B（reasonCodes）/ 付録C（テンプレ）
  - `PARENTY_SSOT.md` 7-2-1（incident対応）/ 7-3-3（保存期間）
  - `APIRegistry.md`（API面の共通契約：policyDecision/nextAction/log）
- **生成物**: 外部APIごとの「仕様URL/規約URL/監視対象URL」と、SSOT未確定事項の隔離
- **編集禁止領域**:
  - URL/価格/制約を“推測”で断定すること（未検証は必ず `[仮説]`）
  - SSOTに無い reasonCode を例示として追加すること
- **更新ルール**:
  - URLは **公式根拠**が確認できたもののみを `確定` とし、それ以外は `[仮説]`（候補）で隔離する
  - 規約/仕様/価格の変更は **常に破壊的影響**の前提で扱い、検知時は `Todo.md` 起票＋`incident_records`（[7-2-1]）へ接続する
- **変更履歴**:
  - 2026-01-08: 初版（外部API台帳を派生として追加。URLは未検証は `[仮説]`）

---

## 背景

外部APIは価値を増やすが、Parentyの責任を代替しない。  
よって **外部API=情報源**として扱い、判断・表現・停止・監査は常に Parenty 側で担う。

---

## 説明

## 本ファイルの位置づけ（固定）

- 本ファイルは **`PARENTY_SSOT.md` に従属**（矛盾した場合は本ファイルが誤り）
- 外部APIは「情報源」であり「判断主体ではない」
- **仕様変更・規約変更は常に破壊的影響**を持つ前提で扱う
- Cursor は本ファイルを **定期検査対象**として扱う（検知→停止→人間承認）

## 共通運用ルール（全外部API共通）

SSOT参照: 付録F / 付録B / 7-2-1

| 項目 | ルール（SSOT準拠） |
|---|---|
| 判断 | すべて Policy Engine が行う |
| 表示 | 外部API由来でも DEGRADED/DENY あり得る（テンプレは付録C参照のみ） |
| 保存 | 生データは保存しない（原則。例外はSSOT変更＋承認が必要） |
| 監査 | `sourceRef` / `fetchedAt` を必須付与（※保存する場合。未実装は `[仮説]` として隔離） |
| 規約 | 利用規約URL/ポリシーURL/価格URLを **必ず台帳管理** |
| 変更検知 | 規約・API仕様・価格ページの定期差分監視（SSOT 付録F-6） |

## 外部API URL台帳（完全版 / 2026-01時点）

SSOT参照: 付録F-0 / F-5 / F-6

### 前提（固定）

- **Docs / Terms / Privacy / Pricing** を分離する（列として保持）
- **開発者向け公式トップ（Developer Top）から辿れるURLのみ採用**する
  - ページがJS/ナビで構築され、機械的に“辿れる”確認が困難な場合は `[仮説]` として隔離メモを残す
- **機械巡回不能（403等）は URL自体は正**として明示する（監視手段を手動へ落とす判断が必要）
- **非公式・スクレイピング前提のURLは除外**（必要なら隔離へ）

### 列の意味（固定）

- **Docs**: 技術仕様・APIリファレンス（導線）
- **Terms**: API利用規約（開発者向け）
- **Privacy**: 個人情報・データ取扱
- **Pricing**: 料金体系（無料枠含む）

### 台帳（URL）

| apiId（SSOT） | category | Developer Top | Docs | Terms | Privacy | Pricing | monitoringTargets（固定） | 備考 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| google_maps_platform | 地図 | `https://developers.google.com/maps` | `https://developers.google.com/maps/documentation` | `https://cloud.google.com/maps-platform/terms` | `https://policies.google.com/privacy` | `https://developers.google.com/maps/billing-and-pricing` | Docs/Terms/Privacy/Pricing を週次監視 | 商用・キャッシュ/再配布制約は要確認（条項抽出は別タスク） |
| yelp_fusion | レビュー | `https://docs.developer.yelp.com/` | `https://docs.developer.yelp.com/docs/places-intro` | `https://www.yelp.com/developers/api_terms` | `https://www.yelp.com/tos/privacy_policy` | `https://www.yelp.com/developers` | Docs/Terms/Privacy/Pricing を週次監視 | 事実: 旧API Overview（`yelp.com/developers/documentation/v3`）は404（除外）。Termsは terms.yelp.com 配下へ遷移し、UA無しだと取得不能になる場合あり（監視実装でUA固定が必要） |
| zocdoc | 医療 | `https://developers.zocdoc.com/` | `https://developers.zocdoc.com/` | `https://www.zocdoc.com/about/terms` | `https://www.zocdoc.com/about/privacy` | （非公開） | Docs/Terms/Privacy を週次監視（Terms/Privacyは手動監視に固定） | 事実: zocdoc.com は機械巡回で 403 になりやすい（URLは正だが監視手段が課題）。手動確認で到達可（2026-01-15）。参考: 旧Docs候補（`zocdoc.com/about/api`）は機械巡回で403 |
| openweathermap | 天気 | `https://openweathermap.org/api` | `https://openweathermap.org/api` | `https://openweathermap.org/terms` | `https://openweathermap.org/privacy-policy` | `https://openweathermap.org/price` | Docs/Terms/Privacy/Pricing を週次監視 | 取得手段（TLS等）で失敗し得るため監視ツール側の安定化が必要 |
| eventbrite | イベント | `https://www.eventbrite.com/platform/api` | `https://www.eventbrite.com/platform/api#/` | `https://www.eventbrite.com/platform/terms-of-service` | `https://www.eventbrite.com/help/en-us/articles/460838` | `https://www.eventbrite.com/pricing` | Docs/Terms/Privacy/Pricing を週次監視 | Docsの導線とAPI Referenceが別URLになる点に注意 |
| fema_openfema | 災害 | `https://www.fema.gov/about/openfema` | `https://www.fema.gov/about/openfema/api` | `https://www.fema.gov/about/openfema/terms-conditions` | `https://www.fema.gov/privacy-policy` | （無料） | Docs/Terms/Privacy + DataSets を週次監視 | 事実: 旧Terms（`fema.gov/about/openfema/terms`）は404（除外）。カタログ相当は `https://www.fema.gov/about/openfema/data-sets`（別途監視対象）。機械巡回で到達可（UA指定、2026-01-15）。 |
| noaa_nws | 天気/警報 | `https://www.weather.gov/documentation/services-web-api` | `https://api.weather.gov` | `https://www.weather.gov/disclaimer` | `https://www.noaa.gov/privacy-policy` | （無料） | Docs/Endpoint/Terms/Privacy を週次監視（Privacyは手動監視に固定） | 事実: `noaa.gov/privacy-policy` は機械巡回で 403（手動確認で到達可、2026-01-15）。 |
| usgs | 地質/災害 | `https://earthquake.usgs.gov/fdsnws/event/1/` | `https://earthquake.usgs.gov/fdsnws/event/1/` | `https://www.usgs.gov/information-policies-and-instructions` | `https://www.usgs.gov/privacy` | （無料） | Docs/Terms/Privacy を週次監視 | 事実: 旧API Root（`earthquake.usgs.gov/fdsnws/`）は404（除外）。 |
| cdc | 医療/統計 | `https://data.cdc.gov/` | `https://data.cdc.gov/` | `https://www.cdc.gov/Other/policies.html` | `https://www.cdc.gov/Other/privacy.html` | （無料） | Docs/Terms/Privacy + Platform を週次監視 | 事実: 旧Docs候補（`data.cdc.gov/developers`）は404（除外）。APIプラットフォームの仕様は `https://dev.socrata.com/`（Socrata公式）も監視対象に含める |
| usps_address_api | 住所 | `https://developers.usps.com/` | `https://developers.usps.com/apis` | `https://developers.usps.com/terms-and-conditions` | `https://www.usps.com/privacypolicy/` | （無料/登録制） | Docs/Terms/Privacy + API Reference を週次監視 | 事実: 旧Terms候補（`about.usps.com/terms-of-use.htm`）は404（除外）。API Reference は `https://registration.shippingapis.com/` |
| nyc_doe_portal | 教育 | `https://opendata.cityofnewyork.us/` | `https://data.cityofnewyork.us/browse?category=Education` | `https://www.nyc.gov/main/terms-of-use` | `https://www.nyc.gov/main/nyc-gov-privacy-policy` | （無料） | Portal/Datasets/Terms/Privacy を週次監視 | 事実: 旧Terms候補（`nyc.gov/site/opendata/terms-of-use*`）は到達性NG/特殊応答。Socrataポータルのフッターが指す `www1.nyc.gov/...` 経由で公式Terms/Privacyへ到達できる |

#### OpenFEMAの追加監視対象（カタログ相当）

- `https://www.fema.gov/about/openfema/data-sets`
- `https://www.fema.gov/about/openfema/developer-resources`

## reasonCode（外部API起因：SSOT正規化）

SSOT参照: 付録F-4（正規化マップ）/ 付録B

- **許可される例示（SSOTに存在するもののみ）**:
  - `RISK_POLICY_PROHIBITED`
  - `CONTEXT_PROVIDER_OUTAGE`
  - `CONTEXT_RATE_LIMIT`
  - `SOURCE_UNVERIFIED`
  - `SOURCE_OUTDATED`
  - `RISK_SOURCE_LOW_CONFIDENCE`
  - `LLM_MEDICAL_GUARD`（医療ドメインのガード）

※ 本ファイルで SSOTに無い reasonCode（例：`CONTEXT_WEATHER_ALERT` 等）を新設/例示しない。必要なら SSOTの変更手順に従う。

## 規約・仕様変更の監視ルール（Cursor必須タスク）

SSOT参照: 付録F-6（監視要件）

- **対象**: 本台帳の `monitoringTargets`（規約/仕様/価格URL）
- **頻度**: 週次（固定）
- **検知時（自動更新禁止）**:
  - `Todo.md` に起票（対象apiId/変更URL/検知日）
  - `incident_records` を作成（[7-2-1]、severity=low を推奨）
  - 人間承認があるまで SSOT/実装を更新しない

### 巡回履歴（派生 / 監査用メモ）

- 巡回結果（最新）:
  - スナップショット: `docs/api_watch/snapshot.json`（常に上書き。履歴はgitで追跡）
  - レポート: `docs/api_watch/report.md`（常に上書き。履歴はgitで追跡）

- 2026-01-08（URL再探索・台帳更新）:
  - 事実: 旧URLの到達性NG（404/403）を確認し、Developer Top から辿れるURLへ差し替え
  - 事実: 403/404/特殊応答（Zocdoc/NOAA/NYC OpenData等）は「URLは正、機械巡回は困難」として明示（手動監視へ落とす判断が必要）

---

## 結論

- 外部APIは **価値を増やすが、責任を持たない**
- 判断・表現・停止は **常に Parenty 側**
- 本台帳が **外部世界との正規接点**である

---

## 補足

### 矛盾候補（隔離）

- URL/価格/制約の未検証箇所は、SSOT 付録F-0 により **実装禁止**の扱い（本台帳では `[仮説]` を維持）
- 「Parentyでの扱い（優先順位/表現）」は SSOTでの確定が必要（未確定は方針として断定しない）
