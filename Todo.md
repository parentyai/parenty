## Todo（判断待ち事項のみ）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: “判断待ち事項のみ”を集約する。実装タスクは書かない。
- **想定読者**: CEO / CTO(GPT) / Engineer(Cursor) / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（該当節）
- **生成物**: 未解決（要承認）リスト + 解決済み（記録）
- **編集禁止領域**:
  - 実装タスクの混入
  - 仕様にない補完・推測の本文化
- **更新ルール**: 判断が必要になったらここに追記して作業を止める。合意済みは `Progress.md` に転記する。
- **変更履歴**:
  - 2026-01-07: 形式統一（メタを追加）

---

## 背景

判断を先送りしたまま実装に入ると、後戻り不能の矛盾が増殖するため、ここで止める。

---

## 説明

## ルール（固定）

- ここには **判断が必要な事項のみ**を書く
- 実装タスクは書かない
- 仕様にない補完・推測は禁止
- 判断が必要になったら、ここに追記して作業を止める

---

## 未解決（要承認）

### T-API-001: 外部APIの公式根拠URL確定（API台帳の前提ゲート）

- 背景: SSOT 付録F（External API）で **公式根拠URL未確定のAPIは実装禁止**としてゲートした
- SSOT参照: 付録F / 付録B（reasonCodes）/ 6-2X（運用導線）/ 7-3（監査）
- 必須（TODO＝未確定のままでは実装不可）:
  - Google Maps Platform（Docs/ToS/Attribution/Cache）
  - Yelp Fusion（Docs/ToS/Display/Attribution）
  - Eventbrite（Docs/ToS/Rate limits）
  - Zocdoc（公式API提供有無/Docs/ToS）
  - OpenWeatherMap（Docs/ToS/再配布・キャッシュ）
  - FEMA（OpenFEMA: Docs/利用条件）
  - NOAA/NWS（Docs/利用条件/Attribution）
  - USGS（Docs/利用条件/Attribution）
  - USPS Address API（Docs/ToS）
  - CDC API（Docs/利用条件）
  - NYC DOE / 各州教育局（州別/ポータル別の公式URL）
- 状態:
  - **解決済み（公式根拠URLの到達確認完了）**
  - 確認済み: Google Maps / Yelp / Zocdoc / Eventbrite / OpenWeatherMap / Weather.gov / FEMA / NOAA / USGS / CDC / USPS / NYC OpenData

### T-API-001A: 外部API台帳（`APIRegistry_External.md`）の候補URLを公式根拠として検証

- 背景: `APIRegistry_External.md` にURL候補を置いたが、未検証のため `[仮説]` 扱い。確定には公式根拠の検証が必要。
- SSOT参照: `PARENTY_SSOT.md` 付録F-0 / F-5 / F-6
- 決めること:
  - 各URLが「公式Docs/ToS/Policy/Pricing」に該当するか
  - pricing/利用制限/再配布/キャッシュ条項の根拠URLを `monitoringTargets` に確定できるか
- 状態:
  - **解決済み（公式根拠URLの到達確認完了）**

### T-TERM-001: trustScore の用途導線の確認

- 背景: SSOT に定義はあるが、下位文書での参照が見当たらない。
- TODO: [仮説] Glossary に用途導線を1行追加するか、不要なら隔離するか判断待ち。
- 状態:
  - **解決済み（Glossary に用途導線を追記）**

### T-API-WATCH-2026-01-08-001: 監視失敗URL（404/403/TLS）の公式根拠再確定

- 背景: 初回巡回（`docs/api_watch/snapshot.json`）で、台帳URLの一部が取得不能だった（監視不能＝SSOT F-0 ゲート未達）。履歴はgitで追跡する。
- SSOT参照: 付録F-0 / F-5 / F-6 / 7-2-1
- 優先度: **P1**
- 担当: **Ops（人手確認）**
- 期限: **2026-01-15**
- 対象（事実: 取得結果）:
  - **解消（URL差し替え済み）**:
    - Yelp Docs: `https://www.yelp.com/developers/documentation/v3`（404）→ `https://docs.developer.yelp.com/docs/getting-started`
    - CDC Docs: `https://data.cdc.gov/developers`（404）→ `https://data.cdc.gov/`（+ `[仮説]` `https://dev.socrata.com/foundry/data.cdc.gov`）
    - USPS Terms: `https://www.usps.com/business/web-tools-terms-of-use.htm`（404）→ `https://developers.usps.com/terms-and-conditions`
    - FEMA Terms: `https://www.fema.gov/about/openfema/terms`（404）→ `https://www.fema.gov/about/openfema/terms-conditions`
    - OpenWeatherMap: 旧スナップショットでTLS失敗（取得手段の問題）→ curlで到達可能を確認（URLは維持）
  - **未解決（監視手段/公式根拠の確定が必要）**:
    - Zocdoc: `https://www.zocdoc.com/about/api` / `https://www.zocdoc.com/about/terms`（HTTP 403：機械巡回不能）
    - Yelp Terms: `https://www.yelp.com/developers/api_terms` が UA無しだと取得不能になる場合あり（監視実装にUA固定が必要）
- 追記（2026-01-08）:
  - 台帳のURL分離（Docs/Terms/Privacy/Pricing）を反映し、監視対象URLの到達性を大幅改善（`docs/api_watch/snapshot.json` を参照）
  - 残課題（事実）:
    - Zocdoc Terms/Privacy は 403（機械巡回不能）
    - NOAA Privacy `https://www.noaa.gov/privacy-policy` は 404（[仮説] HOLD）。TODO: 代替URLを再特定。
- 追記（2026-01-15）:
    - NOAA Privacy は機械巡回で 403（手動確認で到達可）
    - FEMA系URLは機械巡回で到達不能（curl_fail）だが手動確認で到達可
- 期待成果物:
  - `APIRegistry_External.md` のURLを **公式根拠として確定**（または、監視不能として手動運用へ移す判断）
  - 監視対象URL（pricing/policy/attribution等）の追加（SSOT 付録F-5 の `monitoringTargets` を満たす）

### T-API-002: API Path/Operation のSSOT確定（OpenAPIのpaths）

- 背景: `APIRegistry.md` 草案に具体Pathが含まれるが、現SSOTは `/admin/v1/*` のような参照導線のみで、**paths一覧が未定義**
- SSOT参照: 3-3-1（OpenAPI拘束）/ 6-2Z（nextAction schema）/ 付録D（参照優先順位）
- 決めること:
  - `/ux/v1/*` / `/admin/v1/*` / `/internal/*` / `/line/webhook` 等を SSOTのどこ（OpenAPI章）で確定するか
  - “Health check” 等の例外APIを SSOTで許容するか
- 状態:
  - **解決済み（SSOT 3-3-1A で固定）**
  - 確定: `GET /health` / `POST /line/webhook` / `/ux/v1/*` / `/admin/v1/*`

### T-API-003: guardian操作の監査ログ方針（audit_logsとの整合）

- 背景: 草案ではUX設定更新を `audit_logs` に記録としているが、SSOTの `audit_logs.actorType` が `admin/system` 固定のため、整合が必要
- SSOT参照: 4️⃣ audit_logs（actorType定義）/ 7-3（監査）/ DataContract（ログ契約）
- 決めること:
  - guardian操作の“監査”を `audit_logs` に入れるのか、別ログ（SSOT定義が必要）で扱うのか
- 状態:
  - **解決済み（audit_logs.actorType に guardian を追加）**

### T-API-004: API台帳と実装差分の自動検査を導入するか（fail-fast）

- 背景: `APIRegistry.md`（台帳）と実装（routes/handlers）の差分を、CI前に fail-fast で検知したい
- SSOT参照: 3-3-1（OpenAPI拘束）/ `docs/INTEGRITY_CHECKLIST.md` / `tools/validate_docs.js`
- 決めること:
  - `tools/validate_api_registry.js` を導入するか（思想は validate_docs と同型）
  - 導入する場合の入力元（OpenAPIが正か、台帳が正か）と失敗条件（nextAction欠落等）
- 状態:
  - **解決済み（validate_api_registry を導入）**

### T-007: LLM品質向上の方式をSSOTに固定する範囲の確定

- 背景: LLMをフル活用して品質/体験を上げたい
- SSOT参照: 2-1（LLMはComposerの一部）/ 3章（Policy外に出ない）/ 付録B/C（拘束）
- 決めること:
  - 回答構造の強制（結論→根拠→補足→確認手順）を拘束条項にするか
  - 根拠（sourceId等）の表示/ログ方針（管理UIのみ or UXも）

- 状態:
  - **解決済み（回答構造を「結論→根拠→補足」に固定。選択肢列挙＋注意点は補足に含める）**

### T-008: 品質改善ループ（ログ→集計→改善）をv1に入れる範囲の確定

- SSOT参照: 4-3（admin_views例）/ 7章（運用）/ 6-2X（nextAction）
- 決めること:
  - admin_views をv1に入れるか（dashboard_daily / alerts_active 等）
  - どのreasonCodeをアラート対象に固定するか（付録Bの範囲で）
- 状態:
  - **解決済み（admin_views をv1に導入、アラート対象reasonCodeを RISK_* / LLM_* / SOURCE_* / SYSTEM_* / DELIVERY_FAILURE_* に固定）**

---

### T-009: Vendorマッチング統合（SSOTと9資料の整合に必要な決定）

- 確定（ユーザー入力）:
  - Vendor Tier: L1 Exposure / L2 Inquiry / L3 Feedback / L4 Outcome（任意・限定）
  - フロー: Inquiry → Selection → Outcome（判断は常にユーザー）
  - 新規 reasonCode: `VENDOR_EXPOSURE` / `VENDOR_INQUIRY` / `VENDOR_FEEDBACK`
- 決めること（SSOT化が必要）:
  - `VENDOR_*` を **Policy reasonCode** として扱うか（ALLOWでも付与するか）
  - `VENDOR_*` の **category**（付録B）と primaryReason への影響（6-2X必須になるか）
  - Vendor Tier（L1-L4）を **どのデータで管理**するか（vendorエンティティ/停止/審査/更新主体）
  - inquiry/selection/outcome の **保存方針（PII/マスキング/保存期間）**
  - Vendor関連トラブル時の運用導線（runbookLabel追加の要否、nextAction追加の要否）

---

### T-010: Experience Source（体験情報源）統合（SSOTと全レイヤーの整合に必要な決定）

- 確定（ユーザー入力 / Non-Negotiable）:
  - Experience Source は Vendor ではない（Inquiry/送客/成約/広告導線を持たせない）
  - 個人名・人格をUXに出さない
  - 単独ソースを断定表現で使わない
  - 必ず Parenty が再編集した「傾向・注意点」形式にする
- SSOTへ反映済み（今回）:
  - Firestore（管理系）: `experience_sources` / `experience_fragments` / `experience_usage_logs`
  - reasonCode（付録B）: `EXPERIENCE_SOURCE_*` を追加
  - 運用導線: [7-2-4] を追加、6-2Xで `OPEN_SOURCE` に接続
- 決めること（残り）:
  - `region.city` をUXに出す条件（粒度の線引き）
  - フラグメント `text` の「個人特定リスク」判定の運用基準（管理UIでのレビュー観点）
  - `rawLinks` をどこまで保持するか（保存期間/削除要求との整合）

---

### T-011: RAES（Review Aggregated Experience Source）統合（残りの決定）

- 確定（ユーザー入力）:
  - 広告・送客・収益を目的にしない（UX専用の判断補助/注意喚起）
  - 店名/医師名/会社名はUX非表示
  - 星評価/順位/人気表現は禁止
  - 医療は特別制約（医師名非表示、公式確認＋保険確認の観点提示、判断はユーザー）
- 決めること（残り）:
  - （解決）「星評価/順位」を **保存も禁止**にするか → **しない**（保存は可、UX非表示）
  - （解決）`REVIEW_SOURCE_BIAS_SUSPECT` の運用トリガ拡張 → **しない**（commercialFlagのみ）

- 状態:
  - **解決済み（SSOTへ反映済み）**

---

### T-012: IRS（Insight Reaction Signal）統合（残りの決定）

- 確定（ユーザー入力）:
  - insight_reactions に vendorId / businessId / rating を保存しない
  - 管理UIは個票非表示、集計のみ
  - 広告/送客/成約分析に使わない（UX改善のみ）
- 決めること（残り）:
  - （解決）`insightKind` / `userAction` を **SSOTで固定する**（ユーザー回答: 固定する）

- 状態:
  - **解決済み（SSOTへ反映済み）**

---

### T-013: データ製品化/外部提供（販売含む）検討（SSOT衝突）

- 決定（ユーザー入力）:
  - SSOT 1-4-3（外部への販売・共有禁止）は **維持する**
  - ただし **Derived Insight（派生インサイト）** を「データとは別枠」でSSOTに新設し、条件付きで外部提供を検討する
- 引き続き全面禁止（SSOT 1-4-3の範囲として固定）:
  - 個別ログ（event / inquiry / selection / outcome）
  - 匿名化済みでも再集計可能な数値データ
  - ベンダーが自由に分析できる生データ
  - ユーザー行動を再構成できる粒度の情報
- SSOT追記案（TODO化：承認が必要）:
  - （完了）PARENTY_SSOT.md に「#### 3-A. Derived Insight（編集済み知見）」節を新設し、禁止（1-4-3）を緩めないことを明文化
  - （完了）付録A用語集に Derived Insight を追記し 1-4-3-A を参照
  - （完了）Productization（外部提供）は “検討中（Derived Insight前提）” のまま、SSOT 1-4-3-A を参照する形で整合（参照導線は `Guides.md` に統合）

- 状態:
  - **解決済み（SSOTへ反映済み）**

---

## 解決済み（記録のみ）

- T-006: DB拡張（`sources` / `reviews` / `ops_configs`）v1導入＋更新主体systemのみ（SSOT 4-2-b反映済み、Changelog追記済み）

---

## 結論

- 判断が必要になったらここに集約し、合意が取れない限り実装を進めない。

---

## 補足

- （特になし）
