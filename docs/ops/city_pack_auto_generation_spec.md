# City Pack Auto-Generation Spec（厳密版 / SSOT従属）

## メタ（固定）

- **SSoT責務**: City Pack 自動生成の運用導線を固定し、SSOTの定義を上書きしない。
- **想定読者**: Engineer / Ops / Admin
- **依存SSoT**: `PARENTY_SSOT.md`（5-8 / 5-7 / 7章 / 8-4-2B）
- **参照導線**: `SSOT_INDEX.md` / `docs/policy_engine/watch_rules.md`
- **更新ルール**: 不確実な項目は本文に混ぜず `[仮説]` として隔離し、`Todo.md` に記録して停止する。

---

## 背景
- 都市追加をコード変更ではなくデータ定義として扱い、都市差分は City Pack に集約する。
- 自動化は 80% / 人間承認 20% を固定し、承認なしで本番に影響させない。
- 児童データ/PIIを生成・収集プロセスに混入させない前提を明示する。

## 説明

**A) City Pack の定義**
- City Pack は「都市追加のためのデータ定義パッケージ」とする。
- 共通ロジック（巡回/分類/再編集/配信）は都市非依存とし、都市差分は City Pack のみで表現する。
- City Pack は **管理UI承認済みのみ**が本番参照対象となる。
- City Pack は Failure Mode Watch Set として扱い、都市情報の集約は対象外とする。

**B) City Pack 標準構造（ファイル/スキーマ）**
- 配置: `city_pack/<city_code>/`
- 命名: `city_code` は `^[A-Z]{2}_[A-Z0-9]{2,8}$` に固定（例: US_NYC, US_SF, SG_SIN）。衝突禁止。
- 各JSONは監視設定のみを持ち、raw本文は保持しない。

**meta.json**
| キー | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| cityCode | string | 必須 | 命名規則に一致 |
| country | string | 必須 | ISO 3166-1 alpha-2 推奨 |
| region | string | 必須 | 州/県/行政区名 |
| city | string | 必須 | 都市名 |
| timezone | string | 必須 | IANA TZ（例: America/New_York） |
| languages | array | 必須 | ISO 639-1（例: ["en"]） |
| jurisdictionCategory | array | 必須 | education / safety / health / transport などラベル |
| status | string | 必須 | draft / validated / approved / activated / rejected / rolled_back |

**sources.json**
| キー | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| cityCode | string | 必須 | meta.json と一致 |
| sources | array | 必須 | 0件禁止 |
| sources[].sourceId | string | 必須 | 不変ID |
| sources[].category | string | 必須 | government / education / family_events / infrastructure / sns_official / community_sense |
| sources[].tier | string | 必須 | primary / secondary |
| sources[].method | string | 必須 | rss / api / crawl |
| sources[].url | string | 必須 | HTTPSのみ |
| sources[].officiality | string | 必須 | official / semi_official / community |
| sources[].maxFetchPerDay | number | 必須 | 1以上 |
| sources[].notes | string | 任意 | 200文字以内、転載禁止表現を含めない |
| limits.maxSourcesPerDomain | number | 必須 | 1以上 |
| limits.maxRequestsPerDay | number | 必須 | 1以上 |

**rules.json**
| キー | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| cityCode | string | 必須 | meta.json と一致 |
| priorityWeights | map | 必須 | category別の係数（0.1〜5.0） |
| suppressionRules | array | 必須 | 沈黙条件の配列 |
| suppressionRules[].ruleId | string | 必須 | 不変ID |
| suppressionRules[].reason | string | 必須 | 断定/命令/煽りを含めない |
| suppressionRules[].action | string | 必須 | silence / downgrade / hold |
| dedupe.windowHours | number | 必須 | 1以上 |

**tone.json**
| キー | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| cityCode | string | 必須 | meta.json と一致 |
| toneLevel | string | 必須 | calm / neutral / cautious |
| emergencyTone | string | 必須 | calm / neutral / cautious |
| mustAvoid | array | 必須 | 「断定/命令/煽り」ラベルのみ |
| mustInclude | array | 必須 | 「公式導線/参照時点」ラベルのみ |

**calendar.json**
| キー | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| cityCode | string | 必須 | meta.json と一致 |
| referenceUrls | array | 必須 | 公式URLのみ |
| overrides | array | 任意 | 必要最小の例外のみ |
| overrides[].label | string | 必須 | 例外ラベル |
| overrides[].startDate | string | 必須 | YYYY-MM-DD |
| overrides[].endDate | string | 必須 | YYYY-MM-DD |

- overrides は監視窓の制御のみで使用し、詳細本文は保持しない。

**qa_seed.json**
| キー | 型 | 必須 | 制約 |
| --- | --- | --- | --- |
| cityCode | string | 必須 | meta.json と一致 |
| seedTopics | array | 必須 | 論点ラベルのみ（原文引用禁止） |
| sourceTags | array | 任意 | government / education / family_events 等 |

**C) 生成フロー（状態機械）**
| State | 入力 | 出力 | 必須ログ | エラー時の次状態 |
| --- | --- | --- | --- | --- |
| REQUESTED | 管理UIの都市追加要求 | discoveryキック | requestId, cityCode | DISCOVERY |
| DISCOVERY | 公開ソース収集 | sources候補 | discoverySources | REJECTED |
| DRAFT_BUILT | LLM生成 | city_pack draft | llm_model, prompt_version | REJECTED |
| VALIDATED | 機械検証 | diff/リスク/提案 | validationResults | REJECTED |
| HUMAN_REVIEW | 管理UIレビュー | 承認/却下 | approver, decision | REJECTED |
| APPROVED | 承認済み | 有効化待ち | approval_reason | ROLLED_BACK |
| ACTIVATED | 本番参照 | 有効化ログ | activation | ROLLED_BACK |
| REJECTED | 却下 | 再提案待ち | reject_reason | REQUESTED |
| ROLLED_BACK | 無効化 | 停止ログ | rollback_reason | REQUESTED |

**D) DISCOVERY ルール**
- 対象は公開情報のみ。ログイン必須/閉鎖コミュニティは対象外。
- カテゴリ: Government / Education / Family Events / Infrastructure / SNS Official / Community Sense。
- 収集優先順位: RSS → 公開API → 低頻度クロール。
- 収集頻度は City Pack で上限を定義し、上限超えは検証失敗とする。

**E) LLM DRAFT 生成制約**
- 児童データ/PII/個別学校の内部情報を入力に含めない。
- 生成物は **sources_provenance** を必須保持する（URLのみ）。
- 原文コピー禁止。説明は要約/ラベル化に限定する。
- SNSは公式/準公式のみ候補とし、個人アカウントは除外する。
- community_sense は「検知目的のみ」、再配信対象に含めない。
- LLM の役割は 差分有無の要約 / Failure Mode へのマッピング / 状態判定補助 に限定する。

**F) VALIDATED（機械検証ゲート）**
1) JSONスキーマ検証（必須キー/型/制約）
2) 禁止対象検出（closed group / 個人SNS / 画像転載前提 / 医療断定誘発）
3) 重複・衝突（city_code重複、同一ドメイン過多、頻度上限超過）
4) 必須最小セット（government + family_events + infrastructure のいずれか欠落はNG）
5) リスクスコア（規約/誤情報/運用負荷の3軸）閾値超過は要修正
- VALIDATED の出力は diff / 要約 / リスク指摘 / 修正提案のみ。

**G) HUMAN_REVIEW（管理UI承認）**
- レビュー項目: 都市メタ / 巡回先の公式性 / SNS公式性 / 再発信禁止ソースの有無 / community_sense再配信禁止 / tone/rules / リスクスコア。
- 承認必須入力: 承認者ID / 承認理由 / 有効化開始日（即時/予約）。
- 却下必須入力: reasonCode / 修正指示（次のDRAFTへ引継）。

**H) ACTIVATION とロールバック**
- 有効化は staging → production の二段階とする。
- 昇格条件: 監視OK / 規約到達性 / 主要ソースの健全性。
- ロールバック条件: 出典消失・規約違反懸念・誤情報連発・運用過多。
- ロールバック理由は監査ログに必ず記録する（停止導線は SSOT 7章に従う）。

**I) 監査ログ要件**
- 対象ログ: `city_pack_generation_logs`。
- 最小項目: requestId / cityCode / state / timestamps / discoverySources / llmModel / promptVersion / safetyFlags / validationResults / humanReview / activation。
- 監査ログは個人情報を含めない。
- 保存先は SSOT 7章の監査ログ方針に従い、**新規collectionの追加は SSOT 改定が必要**とする。

**J) Fail-safe（UX）**
- City Pack が欠落/未承認/検証失敗の場合、本番は既存都市のみ稼働する。
- 巡回先が落ちた場合は secondary にフォールバックし、必要なら沈黙を選ぶ。

**K) Failure Mode Watch Model（参照）**
- 監視対象は失敗型のみで、保持するのは状態と再確認時刻のみ。
- Watch State は `cityCode / failureCode / state / confidence / lastCheckedAt / provenance / expiresAt` を最小とする。
- state は `ok / risk / unknown` の3値のみを許容する。
- raw本文は保存しない。provenance は抽象名のみを扱う。
- UNKNOWN は失敗でもエラーでもなく、責任範囲外/確認不能の正常状態として扱う。
- LLM の役割は 差分有無の要約 / Failure Mode へのマッピング / 状態判定補助 に限定する。

## 結論
- City Pack は「都市差分の唯一の定義単位」とし、承認なしの本番反映を禁止する。
- 生成/検証/承認/有効化/停止の全工程を監査ログで追跡可能にする。

## 補足
- 本仕様は SSOT に従属する運用仕様であり、SSOTを上書きしない。
- 不確実な項目は [仮説] として隔離し、承認フローで確定する。
