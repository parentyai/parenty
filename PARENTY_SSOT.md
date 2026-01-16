## Parenty｜統合仕様書（Single Source of Truth）

### このページの役割

- Parenty に関する唯一の正仕様（SSOT）
- UX / 管理UI / 実装 / 運用 / 法務 の起点
- ここからすべての派生ドキュメントを生成する

### 冒頭固定セクション（本文）

- 本仕様書の位置づけ
- 適用範囲
- 用語・記号ルール
- 更新ルール（version / 変更履歴）

---

## 1️⃣ サービス定義・思想

### 1-1. サービス概要

#### Parentyとは何か

Parenty は、海外在住の日本語話者家庭に向けて

- 子ども・保護者・家庭単位で分断された情報を整理・統合し、先回りして提示する「家庭情報インフラ」である。

Parentyは以下のいずれにも完全には該当しない。

- 通知アプリ
- FAQボット
- AI相談サービス
- 行政・学校の代替窓口

これらの機能を**断片的に提供するのではなく**、

家庭という単位に紐づけて「意思決定が壊れない状態」を維持することを目的とする。

Parentyの本質的な役割は、

家庭が日常的に抱える「考え続けなければならない状態」を、構造によって軽減すること**である。

---

#### 何を提供するか（Provide）

Parentyが提供するのは「答え」ではなく、以下の価値である。

##### 1. 判断材料の整理と構造化

- 国・州・学区・年齢・時期ごとに分断された情報を整理
- 情報を「結論 → 根拠 → 補足」の形で提示
- 判断が分かれる点を明示し、**選択肢列挙＋注意点は「補足」に含める**

##### 2. 時間軸を持った情報提示

- 「今すぐ必要」「数か月後に影響」「逃した場合の代替策」を区別
- 単発通知ではなく、**時間フェーズ（予告／対応期／事後）を持った情報提供**
- 家庭年間ロードマップによる全体可視化

##### 3. 家庭単位での情報統合

- 子ども単位ではなく**家庭単位を最上位スコープ**として管理
- 兄弟・保護者・家庭全体の予定や影響関係を考慮
- 課金・同意・停止・監査も家庭単位で完結

##### 4. 失敗確率を下げるための安全設計

- 断定しない
- 専門判断を代替しない
- 不確実性やリスクを明示
- 異常時（同意不足・停止・制限）でも黙らないUX

---

#### 何を提供しないか（Do Not Provide）

Parentyは、意図的に以下を**提供しない**。

##### 1. 行動の断定・指示

- 「必ず〇〇してください」
- 「今すぐ申請が必要です」
- 「この手続きを行うべきです」

##### 2. 専門判断の代替

- 医療・法務・教育における最終判断
- 専門家相談を不要にする表現

Parentyは「専門家の代わり」ではなく

**専門家に相談すべきかどうかを判断するための材料**を提供する。

##### 3. 子どもデータを用いた商業最適化

- 子ども情報を用いた広告配信
- 行動ログは集計ベースの表現改善に限定（個別最適化は禁止、8-4-2A 参照）。
- 不安や恐怖を起点とした課金誘導

##### 4. 停止できない自動化

- 人間が介入できない配信
- 理由の分からない制限・拒否
- 誰が判断したのか分からない状態

---

#### 「家庭の認知負荷を外注する」とは何か

##### 認知負荷とは何か

ここでいう認知負荷とは、以下の状態を指す。

- 何が重要か分からない
- いつ決めるべきか分からない
- 自分の判断が正しいか分からない
- 誰に相談すべきか分からない

海外子育てにおける最大の負担は、

**情報の不足ではなく「考え続けなければならない状態」そのもの**である。

---

#### Parentyが外注するもの／しないもの

| 項目 | Parentyが担う | 保護者が担う |
| --- | --- | --- |
| 情報収集 | ○ | − |
| 情報整理 | ○ | − |
| 判断構造の提示 | ○ | − |
| 時間軸の設計 | ○ | − |
| 最終判断 | − | ○ |
| 行動決定 | − | ○ |
| 責任 | − | ○ |

Parentyは、

**「考えるための下準備」を外注するが、「決めること」は外注しない。**

---

#### UXとしての具体的意味

- 通知は「やれ」ではなく「多くの家庭はこう判断する」
- FAQは「答え」ではなく「判断の整理」
- 制限時は「できない」ではなく「なぜ制限され、何はできるか」

この設計により、Parentyは

**家庭の主体性を奪わずに、失敗確率だけを下げるUX**を実現する。

---

#### 本セクションの拘束力（重要）

本ページに定義された思想は、以下すべてに**優先**される。

- UX表現
- LLMプロンプト
- 通知文面
- 管理UIの操作設計
- Firestoreデータ設計
- 課金・制限・停止ロジック

この定義と矛盾する機能・文言・実装は

**仕様違反として修正対象**とする。

---

### 1-2. 解決する本質的課題

Parentyが解決しようとしているのは、

「情報が足りない」問題ではない。

海外で子育てを行う家庭が直面しているのは、

**情報が存在していても、正しく扱えない構造そのもの**である。

以下に、その本質的課題を分解する。

---

#### 1. 情報分断問題

##### 現状の構造

海外子育てに関わる情報は、以下のように**構造的に分断**されている。

- 国／州／市／学区で制度が異なる
- 学校・行政・医療・保険・ビザが別系統
- 言語が英語前提（一次情報は日本語で存在しない）
- 更新頻度・有効期間が不明確

結果として保護者は、

- 「どれが自分の家庭に関係あるのか」
- 「今の情報が最新か」
- 「例外があるのか」

を**毎回ゼロから判断**しなければならない。

##### 問題の本質

これは単なる翻訳不足ではない。

> 情報が「家庭文脈に接続されていない」こと
> 
> ＝ 情報は存在するが、使えない

という構造的問題である。

##### Parentyの介入点

- 家庭単位・子ども単位での情報スコーピング
- 地域・年齢・時期をキーにした再構成
- 一次情報そのものではなく「関係性」を提示

---

#### 2. 管理不能問題（家庭運用の崩壊）

##### 現状の構造

海外子育て家庭では、以下が同時進行する。

- 複数の子どもの年齢・学年・行事
- 親自身のビザ・就労・手続き
- 学校・行政・医療の別スケジュール
- 家庭内の役割分担（どちらが何を把握しているか）

これらは通常、

- カレンダー
- メモ
- メール
- LINEの履歴
- 頭の中

に**分散して存在**している。

##### 問題の本質

管理不能の原因は「量」ではない。

> 家庭内に「単一の真実（Single Source of Truth）」が存在しないこと

である。

結果として、

- 片方の親しか知らない
- 後から知って手遅れになる
- 「聞いてない」「言った」の摩擦が生じる

##### Parentyの介入点

- 家庭単位を最上位スコープとした情報集約
- 年間ロードマップによる俯瞰
- 通知・FAQ・履歴の一貫した接続

---

#### 3. 見落としリスク（Silent Failure）

##### 現状の構造

海外子育てでは、以下の特徴がある。

- 期限を過ぎるまで「問題が見えない」
- 見逃しても誰も教えてくれない
- 事後救済が困難、または高コスト

例：

- 学校申請期限
- 予防接種要件
- 行政手続きの更新
- 同意書・提出物

##### 問題の本質

最大のリスクは、

> 失敗したことに「気づけない」こと

である。

これは恐怖を煽るべき問題ではないが、

**設計上、無視してはいけない問題**である。

##### Parentyの介入点

- 「今すぐ」ではなく「予告→本番→事後」の三段構え
- 失敗時の代替策・影響範囲の提示
- 通知ログ・履歴による可視化

---

#### 4. 海外 × 子育て特有の構造的困難

##### 言語の壁

- 情報理解に余計な認知コストがかかる
- ニュアンス・例外・前提条件を読み落としやすい

##### 文化・制度の非対称性

- 「知っていて当然」という前提が存在する
- 日本では不要だった判断が突然求められる

##### 孤立性

- 正解を確認できる相手がいない
- 失敗体験が共有されにくい
- 家庭内で抱え込む構造になりやすい

##### 心理的負荷

- 「自分の判断で子どもに影響が出る」プレッシャー
- 不安が蓄積しやすい
- 過剰反応 or 思考停止に陥りやすい

---

#### Parentyが目指す状態

Parentyが解決したいのは、

これらの課題を**個別に解消すること**ではない。

目指す状態は以下である。

- 情報が家庭文脈で自然につながっている
- 重要な判断が「突然」発生しない
- 見落としても、完全な失敗にならない
- 親が「考え続けなくていい時間」が増える

つまり、

> 家庭が“普通に運用できる状態”を、構造として提供すること

である。

---

#### 本セクションの位置づけ

本ページは、

**なぜParentyがUX・LLM・通知・データ設計に強い制約を課すのか**

その理由を定義する。

ここで挙げた課題に対して効果を持たない機能は、

Parentyにおいては**存在意義を持たない**。

---

### 1-3. 基本思想（Non-Negotiable）

本ページに記載される原則は、

Parenty における **UX・LLM・通知・データ設計・管理UI・課金・運用**のすべてに優先する。

これらは「方針」ではなく、

- 守られなければ機能が成立しない前提条件（Non-Negotiable）である。

---

#### 1. 子どもの最善の利益を最優先する

##### 定義

Parentyにおいて最優先されるのは、

**短期的な利便性・収益・効率ではなく、子どもの長期的な利益**である。

ここでいう「最善の利益」とは、

- 安全が確保されていること
- 不必要な不安やプレッシャーに晒されないこと
- 大人の判断ミスの影響が最小化されること

を指す。

##### 設計への影響

- 子どもデータは**最重要保護対象（High PII）**として扱う
- 子ども情報を直接用いた広告・最適化は一切行わない
- 子どもに直接行動を促すUXは設計しない
- 子ども情報は「必要最小限・目的限定」で取得する

##### 実装上の拘束

- Firestore設計では children を最も厳しい権限で保護
- LLMログに子ども固有情報を不用意に残さない
- 管理UIでも子どもデータは最小表示が原則

---

#### 2. 不安を増幅させない（Fear-Free Design）

##### 定義

Parentyは、

**不安をトリガーに行動や課金を誘導しない。**

海外子育てにおける不安は、

- 情報不足ではなく
- 不確実性と見通しの欠如

から生じる。

##### 禁止事項

- 「今すぐやらないと危険」
- 「知らないと損をする」
- 「多くの家庭が失敗している」

といった**恐怖喚起表現**は原則禁止とする。

##### 設計への影響

- 通知は「警告」ではなく「予告と整理」
- FAQは「答え」ではなく「判断材料」
- 制限・停止時も理由と影響範囲を必ず説明

##### 実装上の拘束

- 通知テンプレには guard（禁止表現・注意表現）を必須化
- LLM出力は riskLevel に応じて文調を制御
- DEGRADED時でも沈黙しない（説明責任を果たす）

---

#### 3. 判断を代替しない原則（Decision Support Only）

##### 定義

Parentyは、

**保護者の判断を代替しない。**

Parentyが行うのは、

- 判断を構造化すること
- 判断材料を整理すること
- 判断の抜け漏れを防ぐこと

であり、

**最終判断と責任は常に利用者にある。**

##### 禁止事項

- 行動の断定・指示
- 専門判断の代替（医療・法務・教育）
- 個別事情を無視した結論提示

##### 設計への影響

- FAQは「Yes/No」では終わらせない
- 判断が分かれる点を明示する
- 専門家相談が必要な場合は明確に示す

##### 実装上の拘束

- LLMプロンプトに「断定回避」「選択肢提示」を必須化
- 管理UIで「断定的テンプレ」はリスク警告対象
- ポリシーエンジンで高リスク領域は自動DEGRADED

---

#### 4. 信頼を最優先する設計（Trust Over Correctness）

##### 定義

Parentyは、

**一度の正解より、長期的に信頼され続けること**を優先する。

情報が完全に正しいことよりも重要なのは、

- どこまで分かっていて
- どこから不確実か
- 誰が判断したのか

が明確であること。

##### 設計思想

- 分からないことは「分からない」と言う
- 不確実性は隠さず明示する
- 誤りがあれば訂正し、履歴を残す

##### 実装上の拘束

- 通知・FAQ・シナリオは必ずログに残す
- 誤通知時は訂正通知＋監査ログをセットで残す
- 管理UIは「止められること」を最優先設計

---

#### Non-Negotiable が意味するもの

これらの原則は、

- UXの一貫性
- LLMの安全性
- データ設計の保守性
- 運用事故時の信頼回復

を成立させるための**最低条件**である。

この原則に反する機能・表現・実装は、

- 技術的に可能であっても
- 事業的に魅力的であっても

**Parentyには実装しない。**

---

### 1-4. やらないこと（禁止事項）

本ページは、Parentyが

**「できるが、やらない」ことを明確に定義するためのページ**である。

ここに記載される禁止事項は、

UX・LLM・通知・データ設計・管理UI・収益モデルのすべてに適用される。

違反は**仕様違反**として扱い、修正対象とする。

---

#### 1. 行動指示の禁止

##### 禁止内容

Parentyは、利用者に対して

**行動を断定・指示する表現を用いない。**

以下はすべて禁止とする。

- 「必ず〇〇してください」
- 「今すぐ申請が必要です」
- 「この手続きを行うべきです」

##### 理由

- 家庭事情・子どもの状況は千差万別
- 一律指示は誤判断のリスクを高める
- 判断責任の所在が不明確になる

##### 許容される表現

- 「多くの家庭では〇〇を検討します」
- 「一般的には次の選択肢があります」
- 「判断に影響するポイントは以下です」

##### 実装上の拘束

- 通知テンプレートに **断定表現ガード** を必須化
- LLM出力は「結論 → 根拠 → 補足」形式を基本とし、選択肢列挙＋注意点は補足に含める
- 管理UIで断定的文言を自動検知し警告表示

---

#### 2. 専門判断の代替禁止

##### 禁止内容

Parentyは、以下の分野において

**専門家の判断を代替しない。**

- 医療（診断・治療・接種判断）
- 法務（法的助言・権利義務の確定）
- 教育（進路・適性の最終判断）

##### 理由

- 情報提供と専門判断は本質的に異なる
- 誤った代替は子どもの利益を損なう
- 法的・倫理的リスクが高い

##### 許容される役割

- 判断に必要な情報の整理
- 一般的な制度・手続きの説明
- 専門家相談が必要な判断点の明示

##### 実装上の拘束

- 高リスク分野は自動で **DEGRADED** 出力
- FAQに免責・注意喚起文を必須挿入
- 管理UIで医療・法務系テンプレは常時警告

---

#### 3. 子どもデータの商用利用禁止（1-4-3）

##### 禁止内容

Parentyは、

**子どもに関するデータを商業目的で利用しない。**

以下は明確に禁止する。

- 広告配信・ターゲティング
- 行動ログに基づく個別推薦は行わない（集計のみ）。
- 外部への販売・共有（匿名化含む）

##### 理由

- 子どもは意思決定主体ではない
- 長期的なプライバシー侵害リスク
- サービスへの信頼を根底から損なう

##### 許容される利用

- 安全・品質向上のための最小限分析
- 家庭内表示・通知生成のための利用

##### 実装上の拘束

- children コレクションは広告系処理から完全遮断
- consent.scopes.marketing は子どもと非接続
- 管理UIで子どもデータ参照は最小化

---

#### 3-A. Derived Insight（編集済み知見）（1-4-3-A）

定義  
Derived Insight とは、Parenty 内で発生したユーザー行動・反応・選択・運用ログ等を「データ」として外部提供せず、LLM等により抽象化・一般化した再識別不能な編集済み知見を指す。  
Derived Insight は「データ」ではなく「編集済み知見」であり、SSOT 1-4-3 の禁止（データ販売・外部提供禁止）を緩めるものではない。

禁止は維持（重要）  
以下は引き続き禁止：  
	•	個別ログ・イベント・数値データの外部提供（匿名化を含む）  
	•	匿名化データを含む「データそのもの」の販売・共有  
	•	第三者が再分析可能な形式での提供（例：生ログ、集計表、時系列、セグメント別比率、サンプル数、ダッシュボード共有）  

Derived Insight としても禁止（逆算防止）  
Derived Insight であっても以下は禁止：  
	•	特定家庭・個人・地域・学校・ベンダー等を逆算可能な内容  
	•	定量値（割合・件数・増減率・n数）の提示、またはそれに準ずる表現  
	•	外部が恣意的に再利用・再分析できる粒度（セグメント別・属性別・時系列比較 等）  

許容される形（境界の例）  
	•	一般化された傾向・示唆（例：オンボーディングで詰まりやすい“種類”がある、通知文面で誤解が起きやすい“型”がある）  
	•	プロダクト改善に資する“編集済み示唆”の箇条書き（データ・数値・根拠の出典を含めない）  

---

#### 4. 不安を煽る課金UXの禁止

##### 禁止内容

Parentyは、

**不安・恐怖・焦りを起点とした課金誘導を行わない。**

以下はすべて禁止とする。

- 「このままだと危険です」
- 「有料にしないと分かりません」
- 「今すぐアップグレードが必要」

##### 理由

- 海外子育ては構造的に不安が高い
- 不安誘導は判断品質を下げる
- 長期的信頼を破壊する

##### 許容される課金導線

- 機能差分の静的・明示的提示
- 無料でも最低限の安全情報は提供
- 有料は「整理・深掘り・拡張」に限定

##### 実装上の拘束

- プラン差分は管理UIで明文化
- 同意不足・制限時でも沈黙しない
- 課金前後で情報の正確性は変えない

---

#### 禁止事項の運用ルール

- 禁止事項に該当する出力は **修正・差し戻し**
- LLM応答・通知テンプレは定期監査対象
- 例外を設けない（例外は事故の入口）

---

#### 本ページの位置づけ

本ページは、

Parentyが **「何者にならないか」** を定義する。

この禁止事項を守ることでのみ、

- 子どもの最善の利益
- 長期的な信頼
- 安全なスケール

が成立する。

---

### 1-5. 実行主体と責務境界（Authority & Responsibility）

目的：誰が何を“決める/実行する”かを固定し、事故時の責任分裂と実装の揺れを防ぐ。

用語（固定）：

- **Human（Ops/Admin）**：人間の運用者。承認・例外処理・停止/復旧など、責任を伴う判断主体。
- **AI（LLM/Policy補助）**：提案・分類・警告・要約を行うが、最終決定・状態変更は行わない。
- **System（Deterministic）**：条件一致に基づく機械処理（ルール/状態遷移/送信/保存）。裁量は持たない。

原則（MUST）：

1. **状態（state）を変更できる主体は Human または System のみ**。AI は状態変更の提案（recommendation）まで。
2. **送信（push/reply）前の検査は必須**。Policy Engine（3章）を通し、`policyDecision` を生成してから System が分岐する（6-0/付録B/C）。
3. **例外（override）は必ず Human 介入**を要する。System は override を自動実行しない。
4. **重要分岐は必ず reasonCode を残す**（付録B）。未定義は `UNKNOWN_REASON` を許容し、fail-safe（DENY + `nextAction.action=CREATE_INCIDENT`）へ接続する（3章/6-2X/7-2）。

AI の許可範囲（SHOULD）：

- 禁止表現・誤解可能性・州差異・年齢配慮等のリスク指摘（1-3/1-4/5章）
- テンプレ案の生成、要約、候補提示、問い合わせ分類（ただし文言の正は付録C）
- 送信対象の推定・優先度提案（最終確定は System/Human）

禁止（MUST NOT）：

- AI が単独でユーザー属性を確定し、保存・配信方針を決める
- AI が権限を超える操作（停止解除、テンプレ公開、ログ削除等）を実行する
- reasonCode を出さずに裁量分岐する

実装接続（仕様）：

- Policy Engine は常に `policyDecision` を返す（3章/3-3-1）：
  - `result`（ALLOW/DEGRADED/DENY）
  - `reasonCodes[]`（min 1）
  - `primaryReason`（必須）
  - `templateId`（任意、付録C参照キー）
  - `nextAction`（任意、6-2Z準拠。実行は constraints を強制）

## 2️⃣ 全体アーキテクチャ

### 2-1. システム全体像（概念）

本章は、Parenty における **全機能・全実装・全運用の共通前提**を示す

**思想レイヤーの Single Source of Truth** である。

個別仕様・実装詳細は扱わない。

- 「どこで判断し、どこで判断してはいけないか」のみを明確にする。

---

#### 1. 全体コンポーネント（5層構造）

Parenty は、以下の **5層構造**で設計される。

##### A. UX（入口）

- LINE Bot 対話（通常メッセージ / ポストバック）
- 通知受信（push）
- カードUI / リッチメニュー

役割：

- ユーザー入力・表示の最適化
- 情報の受け渡しと表示に専念する

重要原則：

- **UXは判断しない**
- 可否・安全性・制限判断は一切行わない

---

##### B. Policy Engine（中枢）

- 送信可否判定
  - **ALLOW / DEGRADED / DENY**
- **reasonCodes[]（必須）**
- 出力制約（patch）
  - 免責
  - 注意喚起
  - マスキング
  - 粒度制限
  - 参照誘導

役割：

- 安全性・一貫性・再現性を担保
- **全出力の「憲法」**

重要原則：

- すべての機能は **必ず Policy Engine を通過**
- reasonCodes は **付録Bで定義された正式コードのみ使用**
- 独自解釈・独自補完は禁止

---

##### C. Delivery（配送）

- LINE reply / push
- シナリオ配信
- バッチ通知

責務：

- 冪等性（dedupeKey）
- 再送制御
- レート制限
- 暴走・二重送信防止

重要原則：

- Delivery は **決定を変えない**
- Policy結果をそのまま実行するだけ

---

##### D. Data（真実の保管庫）

- Firestore
  - households
  - guardians
  - children
  - consents
  - subscriptions
- Logs
  - notifications
  - faq_logs
  - scenario_states
  - audit_logs
  - incident_records

役割：

- 事実・同意・停止・課金・根拠・履歴の保持
- **監査可能性の担保**

重要原則：

- ログは副産物ではない
- **再現性のための一次情報**

---

##### E. Admin（統治）

- 管理UI
  - テンプレ管理
  - 即時停止
  - 監査
  - 品質改善
- Admin API
  - 集計
  - 変更
  - 強制パッチ

役割：

- 事故時の止血
- 復旧判断
- 継続的な品質改善

重要原則：

- 管理UIは **Policy結果を見るだけ**
- 独自判断は禁止

---

#### 2. 概念フロー（1本の幹）

Parenty のすべての機能は、**以下の1本の幹**を必ず通過する。

```
[UX入口]
  LINE対話 / 通知 / シナリオ
        |
        v
[Context Builder]
  household / guardian / child / plan / consent / flags / region を集約
        |
        v
[Policy Engine] ★中枢
  result（ALLOW / DEGRADED / DENY）
  + reasonCodes[]
  + patch
        |
        v
[Composer]
  テキスト / カード / ボタン整形
  （LLMを使う場合もここで拘束）
        |
        v
[Delivery]
  送信 / dedupe / 記録
        |
        v
[Logs]
  notifications / faq / scenario / audit を必ず記録
        |
        v
[Admin]
  可視化 / 停止 / 訂正 / 再発防止
```

##### LLMの位置づけ（重要）

- LLMは **Composerの一部（文章生成部品）**
- **Policy Engine の外に出てはいけない**
- 判断・可否・制限を行う権限は一切持たない

---

#### 3. なぜ Policy Engine が中枢なのか

Policy Engine は「安全の関所」ではない。

全機能の一貫性を作る“統治レイヤー”である。

理由：

- 事故の根は共通（同意/停止/プラン/地域差/子ども保護/誤情報リスク）
- 出力経路が複数（通知/FAQ/シナリオ/管理UI操作）
- 判断責任を統一しないと例外が増殖する
- **ALLOW / DEGRADED / DENY + reasonCodes** を残せば説明できる
- 管理UIは「見る・止める・直す」だけで回る

---

#### 4. Policy Engine が担う最小責務（MVP）

入力：

- global_flags
- households.flags
- plan
- consent
- region
- requestType（notify / faq / scenario）

出力：

- result（ALLOW / DEGRADED / DENY）
- **reasonCodes[]（付録Bの正式定義のみ）**
- patch
  - マスキング
  - 注意喚起
  - 短文化
  - 参照誘導

副作用：

- 判定ログを必ず残す（policy_logs または audit_logs に統合）

---

#### 5. よくある設計ミス（必ず避ける）

- 「通知だけ別ルール」
- 「FAQだけ例外」
- PolicyをUX側に分散
- DEGRADEDを曖昧にする

これらはすべて、

> 説明不能・再現不能・運用不能

に直結する。

---

#### 結論

Parenty は、

- **判断を一箇所に集約し**
- **人とAIの役割を分離し**
- **後から説明できること**

を最優先に設計されている。

この全体像を破る実装は、

**どれほど便利でも不正解**である。

---

### 2-2. レイヤー責務分離

本章は、Parenty における **設計・実装・運用すべての前提となる責務分離**を定義する。

ここに書かれた分離は **思想ではなく規約**である。

いかなる理由があっても、各レイヤーの責務を越境してはならない。

---

#### A) UX Layer（入口・表示）

役割：

ユーザーとの **入出力を整形するだけ** の層。  
**判断・可否決定・制限付与は一切行わない。**

含むもの：

- LINE Bot 会話（message / postback / リッチメニュー / カードUI）
- 入力の正規化（intent 抽出 / 選択肢のID化）
- 表示都合の調整（短文化 / ボタン提示 / 確認導線）

やってよいこと：

- 入力の整形・検証（表記ゆれ補正 / 必須項目確認）
- 追加情報の要求（例：「州が未指定のため確認」）
- Policy が返した reasonCodes を使った説明表示（文言は付録C準拠）

やってはいけないこと（厳禁）：

- 送信可否の判断（同意/停止/プラン/地域差）
- Policy Engine を通さない直送
- 監査ログを残さない送信
- 独自理由による表現変更

成果物（出力）：

```
UXRequest {
  type: faq | notify | scenario
  householdId
  guardianId
  payload
}
```

---

#### B) Policy Layer（中枢・統治）

役割：

Parenty 全出力の **唯一の判断主体**。  
「送るか／送らないか」「どう丸めるか」を決める。

含むもの：

- 判定結果：ALLOW / DEGRADED / DENY
- reasonCodes[]（付録Bの正式定義のみ）
- DEGRADED パッチ（マスキング / 免責 / 短文化 / 参照誘導）
- プラン制御（機能ON/OFF / 回数・粒度制限）
- 安全・コンプラ制約（医療/法務/教育の断定回避）

やってよいこと：

- データ参照（consent / plan / flags / region）
- 出力仕様の制約（プラン別表現差）
- DENY時の安全な代替提示（問い合わせ / 一般情報）

やってはいけないこと（厳禁）：

- 実送信（Deliveryに触れない）
- UI都合の表示調整
- データの直接更新（変更は Ops 経由＋監査必須）

成果物（出力）：

```
PolicyDecision {
  result: ALLOW | DEGRADED | DENY
  reasonCodes: string[]
  patch
  obligations {
    requiredLogs
    requiredDisclaimers
  }
}
```

---

#### C) Execution Layer（実行・配送）

役割：

Policy の決定を **忠実かつ確実に実行する**層。判断を加えない。

含むもの：

- LINE reply / push
- シナリオ配信 / バッチ通知
- 冪等性（dedupeKey）
- 再送/リトライ/レート制限
- LLM呼び出し（必ず Policy 制約下）

やってよいこと：

- Policy が ALLOW / DEGRADED の場合のみ実行
- 送信失敗時の再試行
- 実行結果ログの記録

やってはいけないこと（厳禁）：

- Policy の上書き
- 裏口LLM呼び出し
- ログ無し送信

成果物（出力）：

```
ExecutionResult {
  success: boolean
  messageId
  latency
  dedupeKey
  traceId
}
```

---

#### D) Data Layer（真実・監査）

役割：

状態・根拠・履歴を保持し、**再現性と説明責任を担保する層**。

含むもの：

- households / guardians / children / consents / subscriptions
- templates / global_flags / admin_users
- logs（notifications / faq_logs / scenario_states / audit_logs / incident_records）

やってよいこと：

- 参照最適化（二重化）
- diff / actor / trace の保持
- PII保護（マスキング/最小化/アクセス制御）

やってはいけないこと（厳禁）：

- ログが溜まるだけの設計
- 子どもPIIの無制限保存

---

#### E) Ops / Admin Layer（運用・統治）

役割：

人が介入する **唯一の正規レイヤー**。停止・訂正・再発防止を担う。

含むもの：

- 管理UI（ダッシュボード/テンプレ管理/即時停止/監査）
- 運用フロー（7-1/7-2/7-3）
- 品質監査 / 変更管理

やってよいこと：

- global / feature stop 操作（監査必須）
- テンプレ修正・公開
- reasonCode / 閾値の改定（履歴必須）

やってはいけないこと（厳禁）：

- 管理UIから直接送信
- 監査ログを残さない変更

---

#### 結論（固定ルール）

> UXは整形  
> Policyは決定  
> Executionは実行  
> Dataは証跡  
> Opsは統治

この分離を破る実装・運用は、**SSOT 違反として不採用**とする。

---

#### 補足：レイヤー間インターフェース（最小）

- UX → Policy：UXRequest
- Policy → Execution：PolicyDecision
- Execution → Data：logs
- Data → Ops：aggregates / audit
- Ops → Policy/Data：rule / template / flags 更新（監査付き）

---

#### 実装上の鉄則（事故防止）

- 送信口は必ず1つ（sendLine等）
- DENYでも必ずログを残す
- DEGRADEDは **付録Cテンプレのみ使用**

---

### 2-3. Single Source of Truth 設計

本章は Parenty における **Single Source of Truth（唯一の正規情報源）** の設計原則を定義する。

ここで定義する SSOT は「便利な設計思想」ではなく、**事故を防ぐための強制構造**である。

---

#### A) UX と 管理UI を分けない理由（SSOT観点）

結論：

UI の入口は複数あってもよいが、**参照する真実・判定ロジック・ログ経路は必ず一つでなければならない。**

UX と 管理UI を分けると事故るのではない。**“真実と判定を分ける”と事故る。**

---

分けたときに実際に起きる事故：

1. 停止の不整合（GLOBAL_STOP_ACTIVE=true でも送る）
2. 同意の不整合（UIはDENYだがFAQはALLOW）
3. プランの不整合（past_dueでも経路により実行）
4. 監査の欠落（片方だけauditに残る）

SSOTとしての原則：

- **Policy Engine と Data Layer を完全共通化**
- UX も 管理UI も **「同じAPI」「同じ判定」「同じログ」** を通る
- 管理UIは「強いUI」ではない（同じ仕組みを可視化し操作できるだけ）

---

#### B) データ二重化禁止原則（SSOTの核心）

SSOTの本質は **「同じ意味の事実を2箇所に持たない」**こと。

ただし、性能・UX・運用のために、二重化は「派生（Read Model）」としてのみ許可する。

禁止する二重化（SSOT違反）：

- 同じ概念を独立に更新できる複製
- 真実がどちらか不明
- 更新経路が複数

許可する二重化（派生としてのみ）：

1. Source（真実）を明示
2. Derivation（派生）を明示（再生成可能）
3. Write Path を一本化（UI直書き禁止）

---

#### C) 派生ビュー（Read Model / Materialized View）設計

派生ビューは「速さ」のために存在し、「真実」ではない。

派生ビュー設計ルール（固定）：

1. 再生成可能（Backfill可）
2. TTLを定義（永続化しない）
3. 意思決定に使わない（送信可否は必ず Policy → SoT）
4. イベント駆動更新（通知/FAQ/操作/停止）

---

#### D) SSOT と Policy / 運用の接続

- 判定の唯一正規：6-0
- 運用アクションの唯一正規：6-2X
- 人間介入フロー：7-1 / 7-2 / 7-3

派生ビュー・UI表示は **必ずこれらに戻れる構造**でなければならない。

---

#### 結論（固定宣言）

- UX と 管理UI は別アプリでもよい
- ただし **真実・判定・ログは必ず共有**
- 二重化は **真実は禁止、派生のみ許可**
- 管理の快適さは派生ビューで作り、**意思決定は必ず SoT＋Policy に戻す**

---

#### 補足：最小SSOT宣言（実装向け）

- 課金：subscriptions
- 同意：consents
- 停止：global_flags / households.flags
- 判定：Policy Engine
- 履歴：notifications / faq_logs / scenario_states / audit_logs / incident_records

---

## 3️⃣ 共通ポリシーエンジン（最重要）

> この章は、付録B（reasonCodes完全一覧）を唯一の正として参照し、6-0/6-2X/7章と矛盾しない形に正規化されている。  
> 本章内に「付録Bと異なる名称のreasonCode」を定義してはならない。

### 3-0. Policy Engine 概要

Policy Engine は、Parenty において「出してよいか／止めるべきか」を唯一・一貫・説明可能に判断する中枢である。

#### 対象機能（固定）

- 通知（Notification）
- FAQ（LLM 応答）
- シナリオ配信（Scenario）
- カード表示（UXコンポーネント）

#### 中核責務

- **安全性・同意・信頼性を UX より優先**
- **判定理由を reasonCode として必ず残す**
- **結果の再現性・説明可能性を保証**

---

### 3-0-1. 出力形式（固定・SSOT）

Policy Engine の出力（論理出力）は必ず以下を含む。

- result：ALLOW / DEGRADED / DENY（大文字固定）
- reasonCodes：配列、1つ以上必須
- primaryReason：必須、reasonCodes[] の中のいずれか1つ
- templateId：任意（DEGRADED/DENY のUX表示に使用した付録CテンプレID）
- nextAction：任意（管理UI向け。`nextAction.action` の正規一覧は **6-2Z（NextActionType）** を唯一の正とする）
- policyTrace：再現性のためのメタ（PII禁止）

```json
{
  "result": "ALLOW | DEGRADED | DENY",
  "reasonCodes": ["REASON_CODE"],
  "primaryReason": "REASON_CODE",
  "templateId": "tpl_xxx_or_null",
  "nextAction": {
    "action": "NONE",
    "severity": "low",
    "targets": {},
    "constraints": {
      "requiresRole": [],
      "requiresReason": false,
      "auditRequired": false
    },
    "links": {
      "uiPath": "/admin/...",
      "api": "GET /admin/v1/..."
    }
  },
  "policyTrace": {
    "traceId": "trc_xxx",
    "ruleVersion": "pe:vX.Y.Z",
    "inputsDigest": "sha256:...",
    "evaluatedAt": "ISO-8601"
  }
}
```

固定ルール：

- result は必ず1つ
- reasonCodes は必ず1つ以上
- primaryReason は必ず1つ（裁量決定禁止）
- 未定義 reasonCode は UNKNOWN_REASON に正規化し、fail-safe（DENY + CREATE_INCIDENT）に倒す（付録B/6-2X/7-2に従う）
- UXは reasonCode を表示しない（付録Cテンプレのみ表示可能）

---

### 3-A. 判定モデル仕様（ALLOW / DEGRADED / DENY）

#### ALLOW

- 制約なく情報提供可能
- ただし reasonCodes は必須（1つ以上）

#### DEGRADED

- 情報の粒度・範囲・表現を制限
- 子ども個別情報は原則非表示
- UX文言は付録C以外禁止

#### DENY

- 情報提供不可
- UXは沈黙禁止（付録CのDENY/STOPテンプレで説明）
- 管理UI・ログには reasonCodes を完全に記録

---

### 3-B. 判定入力と評価順序（絶対順・変更不可）

Policy Engine は以下を上から順に評価する。

1. global_flags
2. households.flags
3. feature switches
4. plan
5. consents
6. risk
7. context / ops

短絡（early return）ルール：

- STOP系（付録B: category=STOP）の確定時のみ、即時 DENY として短絡してよい
- それ以外は評価順序を固定し、primaryReason決定規則（3-C）に従う

---

### 3-C. reasonCodes 体系（要点）

#### 原則

- reasonCodes は配列（複数原因を保持）
- PrimaryReason は必ず1つ（評価順序カテゴリで最上位）
- reasonCode の正式名称・分類・既定result・templateIdは付録Bが唯一の正

#### PrimaryReason 決定ルール（必須）

PrimaryReason は、付録Bに定義された category の優先順で最上位のものを採用する。

優先順（固定）：

STOP > INCIDENT > SYSTEM > RISK > REVIEW_SOURCE > EXPERIENCE_SOURCE > SOURCE > CONSENT > PLAN > CONTEXT > TEMPLATE > DATA > VENDOR > CATCHALL

- 裁量決定は禁止
- 同一category内で複数ある場合は「評価順序で先に確定したもの」を primaryReason とする

---

### 3-D. DEGRADED 設計と責務分離

- 子ども個別情報 → 原則非表示
- 一般的手続き・確認手順 → 可（検証可能・安全側のみ）
- 断定・推測 → 禁止
- 文言は付録Cのみ

---

### 3-E. 実装参照（擬似コード）

```js
function evaluatePolicy(input) {
  // ① STOP (short-circuit allowed)
  if (global.stopAll) return deny(["GLOBAL_STOP_ACTIVE"]);

  // ② Household safety
  if (household.flags.stopAllNotifications && input.feature === "notification")
    return deny(["HOUSEHOLD_STOP_NOTIFICATIONS"]);

  // ③ Feature stops
  if (featureDisabled(input.feature))
    return deny([featureDisabledReasonCode(input.feature)]);

  // ④ Plan (must not DENY by plan alone)
  // Plan constraints must be expressed as DEGRADED per §8-1/8-2
  if (planLimits(input)) return degraded(["PLAN_FEATURE_LOCKED"]);

  // ⑤ Consent (missing required scope => DENY)
  if (missingConsent(input)) return deny([consentReasonCode(input)]);

  // ⑥ Risk => usually DEGRADED, prohibited => DENY (Appendix B)
  if (prohibitedByPolicy(input)) return deny(["RISK_POLICY_PROHIBITED"]);
  if (highRisk(input)) return degraded(["RISK_TEMPLATE_HIGH"]);

  // ⑦ Context/ops
  if (quietHours(input)) return degraded(["CONTEXT_QUIET_HOURS_DELAYED"]);

  return allow(["ALLOW_STANDARD"]);
}
```

実装ルール（必須）：

- 6-0の入力要件に従い、reasonCodesは常に min 1
- primaryReason は規則で決定し、reasonCodes[]に含める
- 判定ログ（policyTrace）必須（PII禁止）

---

### 3-F. 違反例（アンチパターン）

- UX側で if 分岐して判定する
- 管理UIが独自判断で可否を決める
- reasonCodes を省略する
- 付録C以外の文言をDEGRADED/DENYで表示する

---

### 3-G. 上位・下位仕様との接続

- 判定結果の正規定義：6-0
- nextAction / Runbook接続：6-2X / 6-2Z / 7章
- reasonCodes唯一の正：付録B
- 文言唯一の正：付録C

---

## 3-3-1. OpenAPI / Firestore への焼き込み規則（拘束条項）

本項に反する実装は、UX・管理UI・運用仕様よりも優先的に誤りとみなす。

### OpenAPI への焼き込み（必須）

- result は 3値固定：ALLOW / DEGRADED / DENY
- reasonCodes は enum（付録Bの reasonCode のみ + UNKNOWN_REASON）
- 未定義 reasonCode を受け取った場合：
  - エラーにしない
  - UNKNOWN_REASON に正規化
  - result = DENY
  - nextAction.action = CREATE_INCIDENT

---

### 3-3-1A. ランタイム最小エンドポイント（Cloud Run / v1固定）

- 公開（認証不要）
  - `GET /health`
  - `POST /line/webhook`（LINE署名検証必須）
- UX API
  - Base Path: `/ux/v1/*`（Firebase ID Token 必須）
- 管理UI API
  - Base Path: `/admin/v1/*`（RBAC/監査は 6-3 に従う）

### Firestore への焼き込み（必須）

- reasonCodes：必須、配列、min 1
- primaryReason：必須、reasonCodes[] の中から必ず1つ
- templateId：必須（DEGRADED/DENYは付録Cテンプレ参照のため必須）
- nextAction：任意（管理UI用途。6-2Zに一致）

---

### 参照の正（Single Source of Truth）

1. 付録B：reasonCodes 完全一覧
2. 付録C：DEGRADED / DENY 文言テンプレ
3. 6-0 / 6-2X / 7章：運用と導線の一意接続

---

---

## 3-4. 失敗時の既定動作（Fail-safe / Fail-open / Fail-close）

目的：外部依存や不整合が発生しても、UXと安全性が破綻しない既定動作を定義する。

失敗分類（固定）：

- **External Failure**：外部API/外部サイトの応答失敗・遅延・到達不能（付録F含む）
- **LLM Failure**：LLM呼び出し失敗/タイムアウト/拒否（運用判断が必要）
- **Policy Failure**：Policy Engine の例外・設定不整合
- **Data Failure**：Firestore 読み書き失敗・参照欠落・スキーマ不整合
- **Send Failure**：送信失敗（配送/再送/急増）

共通原則（MUST）：

1. **沈黙して壊れない**：失敗は必ず reasonCode を残し（付録B）、必要なら `incident_records` に接続する（7-2-1）。
2. **ユーザーに内部事情を過剰露出しない**：UX文言は付録C参照のみ（直書き禁止）。ベンダー名/障害詳細を不用意に出さない。
3. **誤配信より抑制を優先**：判断不能時は “送らない/止める” を基本とする（fail-close）。ただし UX は沈黙禁止の原則に従い、付録Cの説明カードで最低限の案内を行う。
4. **再試行は上限を持つ**：無限再試行は禁止。上限超過は `CONTEXT_RETRY_EXCEEDED` に正規化し incident へ接続する。

既定動作（正規化マップ：SSOT固定）：

| 失敗種別 | 正規化reasonCode（付録B） | result（既定） | templateId（付録C） | nextAction（6-2X） |
| --- | --- | --- | --- | --- |
| External Failure | CONTEXT_PROVIDER_OUTAGE | DEGRADED | tpl_deg_provider_outage | CREATE_INCIDENT |
| LLM Failure（拒否/高リスク/判断不能） | LLM_REFUSAL_TRIGGERED または INTERNAL_ERROR | DENY | tpl_deny_unknown_reason または tpl_deny_internal_error | CREATE_INCIDENT |
| Policy Failure | SYSTEM_ERROR / INTERNAL_ERROR | DENY | tpl_deny_internal_error | CREATE_INCIDENT |
| Data Failure | INTERNAL_ERROR | DENY | tpl_deny_internal_error | CREATE_INCIDENT |
| Send Failure（単発） | DELIVERY_FAILURE | DEGRADED | tpl_deg_retry_exceeded | RETRY_DELIVERY |
| Send Failure（急増/上限超過） | DELIVERY_FAILURE_SPIKE / CONTEXT_RETRY_EXCEEDED | DEGRADED または DENY（付録B既定） | tpl_deg_retry_exceeded または tpl_deny_internal_error | CREATE_INCIDENT |

補足（固定）：

- 上表は “新規 reasonCode / nextAction を増やさず” SSOTの接続（付録B/6-2X/付録C/7章）を壊さないための正規化である。

## 4️⃣ データモデル（統合）

### 4-1. データ設計原則

本章は、Parenty における **すべてのデータ設計の上位原則**を定義する。

以降の **Firestore データ辞書（4-2）／Index（4-3）／Security Rules（4-4）／Policy Engine（3章）／管理UI（6章）／運用（7章）**は、**本章に必ず従属**する。

> 本章に反する設計・実装は不可

---

#### 4-1-1. 家庭単位最上位（Household as Root）

##### 原則

Parenty における **価値・責任・契約・判断・通知**の最上位単位は **家庭（household）**である。

##### 背景

- 子どもは契約主体にならない
- 保護者個人は最終責任主体ではない（共同責任・家庭判断）
- 通知／FAQ／ロードマップは **家庭文脈**に依存する

##### 設計ルール（拘束）

- Firestore の論理的ルートは **常に** households/{householdId}
- 以下は **必ず** householdId に紐づく
  - guardians / children / consents / subscriptions
  - notifications / faq_logs / scenario_states
- guardian / child 起点で処理しても、**必ず household を参照してから判定**する

##### 禁止事項

- guardian 単体を最上位にした設計
- child 単体を直接参照して送信・判断する処理
- household を経由しない plan / consent / flags 判定

---

#### 4-1-2. 子ども最重要保護（Child-First Data Protection）

##### 原則

子どもデータは **最重要保護対象**。

利便性・分析・収益より **安全・最小化・誤用防止**を常に優先する。

##### 背景

- 法令：COPPA / GDPR / 各国児童保護
- 倫理：本人が同意不能
- 信頼：**1件の事故が致命傷**

##### 設計ルール（拘束）

- **最小取得**：MVP では birthDate（年/月丸め可） + **学区レベル**まで
- **目的限定**：通知／ロードマップ／安全確認のみ
- **広告・最適化利用の禁止**
- 直接識別情報は極力保持しない
  - 本名非推奨（nickname 前提）
  - 写真・健康詳細・成績・評価は **保持禁止**
- LLM/通知ログに **子ども固有情報を直書きしない**
  - **ID参照＋マスキング**前提

##### DEGRADED 連動ルール

- DEGRADED 時は **子ども個別 → 家庭一般**へ退避
- 子ども固有の **断定／期限／判断を出さない**

---

#### 4-1-3. 停止二重化（Global × Household Safety Stop）

##### 原則

「送らない判断」は **単一箇所に依存しない**。

**全体停止**と**家庭停止**を **必ず二重化**する。

##### 背景

- 人為ミス・実装漏れ・想定外経路は起きる
- **止められない**は最悪の障害

##### 停止レイヤー

1. **global_flags**
2. **households.flags**

##### 設計ルール（拘束）

- 送信・応答の **最初の関所**で **両方を評価**
- global または household の **どちらかが STOP → 原則 DENY**
- 管理UIから **即時操作可能**
- 停止／解除は **必ず audit_logs に記録**

##### 禁止事項

- 停止フラグの一元化
- フロントUXだけで止める設計
- **ログに残らない**停止操作

---

#### 4-1-4. 監査可能性（Auditability by Design）

##### 原則

すべての重要判断は **後から説明・再現可能**でなければならない。

##### 監査対象（MVP必須）

- 通知送信（sent / degraded / denied）
- FAQ 応答（ALLOW / DEGRADED / DENY）
- シナリオ配信
- 停止／解除
- テンプレ変更
- 同意／プラン変更

##### 設計ルール（拘束）

- すべての判断に **必須保存**
  - result（ALLOW/DEGRADED/DENY）
  - primaryReason + reasonCodes[]
  - ruleVersion
  - traceId / runId
- **人間操作は必ず audit_logs**
- audit_logs は **追記専用（immutable）**

##### ログと PII の分離

- 監査ログに個人情報を直書きしない
- 内容が必要な場合は **ID参照 or マスキング済み要約**

---

### 4-2. Firestore データ辞書（統合）

本ページは **構造俯瞰およびリンク集（Index）**である。

**フィールド定義の唯一の正（SSOT）は下記の子ページ**に従う。

---

#### 正規定義ページへのリンク（唯一の正）

**本ページはインデックスであり、詳細定義は上記の子ページを参照すること。**

**本ページにフィールド定義を追加してはならない。**

追加・変更は必ず 4-2-a / 4-2-b に反映し、本ページはリンクと俯瞰のみ更新する。

---

#### 本章の構成（読み方）

- **UX系（4-2-a）**：ユーザー体験・通知・FAQ・シナリオのためのデータ
- **管理系（4-2-b）**：統治・監査・停止・テンプレ・インシデントのためのデータ
- **本ページ（4-2）**：上記の **参照導線**と **表記ルール**のみ

---

#### 表記ルール（全ページ共通）

- 型：`string | number | boolean | timestamp | map | array`
- 必須：`必須 | 推奨 | 任意（MVP 기준）`
- R/W：`guardian | admin | system`（system=サーバ/バッチ/worker）
- PII：`High（子ども含む）| Med（保護者/家庭）| Low（ログ/運用）`
- 参照：`{collection}/{docId}` は Firestore のコレクション/ドキュメント
- **SSOT原則**：同じ意味の“真実”は1箇所のみ
  - 派生は `admin_views/*` 等に隔離（別章で定義）
- **Policy連動**：送信/回答/配信の判断ログは `policyDecision.result + policyDecision.primaryReason + policyDecision.reasonCodes[]` を必須とする（6-0 / 7-3）

---

#### コレクション一覧（どこが正か）

> 目的：実装者が迷ったら この表で「正規定義ページ」を即決できるようにする。

##### UX系（正：4-2-a）

- `households`
- `guardians`
- `children`
- `consents`
- `subscriptions`
- `notifications`
- `notification_deliveries`
- `faq_logs`
- `scenario_states`
- `roadmaps`

##### 管理系（正：4-2-b）

- `admin_users`
- `templates`
- `global_flags`
- `audit_logs`
- `data_requests`
- `incident_records`
- （必要に応じて）`sources` / `reviews` / `ops_configs` ※追加は 4-2-b 側でSSOT化してから

---

#### 重要な接続（SSOTの衝突を防ぐ）

- **Policy / UX / 管理UI 対応の唯一の正**：`6-0. Policy Engine × UX × 管理UI の対応マトリクス`
- **reasonCodes の唯一の正**：`付録B：reasonCodes 完全一覧`
- **DEGRADED 文言の唯一の正**：`付録C：DEGRADED文言テンプレ`
- **ログ・監査の唯一の正**：`7-3. ログ・監査`

---

### 4-2-a. Firestore データ辞書（UX系 / SSOT）

## このページの役割（Non-Negotiable）

本ページは **ユーザー体験（UX）に直接影響する Firestore データの唯一の正（SSOT）**を定義する。

- LINE Bot / 通知 / FAQ / シナリオ / ロードマップの **正規データ定義**
- **管理UI・運用都合の派生データは一切含めない**
- 監査・停止・分析向けの派生は **admin_views / logs 系に隔離**（別章）

> 本ページに定義されたフィールド以外を
> 
> **UX処理・LLM入力・ユーザー表示に使ってはならない。**

---

## 設計原則（UX系 共通）

1. **家庭（household）単位を最上位スコープ**とする
2. **子ども情報は最重要保護対象（PII High）**
3. UX表示に不要な **管理メタ・運用フラグは持たない**
4. **書き込み主体は原則 system**（サーバ/worker）
5. guardian は **自分の household に限定して read / 最小 write**
6. すべての判断結果は **Policy Engine を通過した後**に記録する
7. 同じ意味の真実は **1コレクション1定義（SSOT）**

---

## 共通フィールド規約（全UX系）

### Policy 判定（必須セット）

UXに影響する生成・送信・回答・進行には以下を必ず持つ。

- `policyDecision.result`：`ALLOW | DEGRADED | DENY`
- `policyDecision.primaryReason`：string（1つ）
- `policyDecision.reasonCodes[]`：array（1つ以上）
- `policyDecision.ruleVersion`：string（推奨）

> 表示文言は 付録C（DEGRADED文言テンプレ）以外禁止

---

## 1️⃣ households（家庭 / UX最上位）

### 目的

すべてのUX判断・通知・FAQ・ロードマップの**起点**。

| フィールド | 型 | 必須 | 説明 | R/W | PII |
| --- | --- | --- | --- | --- | --- |
| status | string | 必須 | active / suspended / deleted | system | Low |
| locale | string | 必須 | ja-JP 等 | guardian/system | Low |
| tz | string | 必須 | America/New_York 等 | guardian/system | Low |
| region | map | 必須 | 国・州・市 | guardian/system | Med |
| plan.tier | string | 必須 | free / solo / family / extended | system | Low |
| flags.stopAllNotifications | boolean | 必須 | 家庭単位の即時停止 | system/admin | Low |

**禁止**

- 子ども個別属性の保持
- 運用・分析フラグの追加

---

## 2️⃣ guardians（保護者 / 認証主体）

### 目的

UXの語り手・同意主体。

| フィールド | 型 | 必須 | 説明 | R/W | PII |
| --- | --- | --- | --- | --- | --- |
| householdId | string | 必須 | 所属家庭 | system | Low |
| roles | array | 必須 | owner / member | system | Low |
| displayName | string | 任意 | 表示名 | guardian/system | Med |
| line.userId | string | 必須 | LINE userId | system | **High** |
| notificationPrefs.enabled | boolean | 必須 | 個人通知ON/OFF | guardian/system | Low |
| lastSeenAt | timestamp | 推奨 | 最終利用 | system | Low |

**注意**

- line.userId は **ログ保存時は必ずハッシュ化**
- 連絡先・外部IDの直書き禁止

---

## 3️⃣ children（子ども / PII High）

### 目的

通知・ロードマップ生成の中心。**広告・二次利用禁止**。

| フィールド | 型 | 必須 | 説明 | R/W | PII |
| --- | --- | --- | --- | --- | --- |
| householdId | string | 必須 | 所属家庭 | system | Low |
| profile.nickname | string | 必須 | 呼称 | guardian/system | **High** |
| profile.birthDate | string | 推奨 | YYYY-MM-DD | guardian/system | **High** |
| school.district | string | 任意 | 学区 | guardian/system | **High** |
| health.vaccineTrackEnabled | boolean | 推奨 | 追跡ON/OFF | guardian/system | **High** |

**絶対禁止**

- 実名・医療詳細・診断情報
- ログへの未加工保存

---

## 4️⃣ notifications（通知メタ / 送信事実）

### 目的

送信・失敗・訂正の**事実記録**（文言の正当性は別章）。

| フィールド | 型 | 必須 | 説明 | R/W | PII |
| --- | --- | --- | --- | --- | --- |
| householdId | string | 必須 | 対象家庭 | system | Low |
| childId | string | 任意 | 子起点通知 | system | Low |
| type | string | 必須 | birthday / school_event 等 | system | Low |
| templateId | string | 必須 | 使用テンプレ | system | Low |
| status | string | 必須 | scheduled / sent / failed / canceled | system | Low |
| policyDecision | map | 必須 | 判定結果 | system | Low |
| sentAt | timestamp | 任意 | 送信時刻 | system | Low |
| correction | map | 任意 | 訂正情報 | admin/system | Low |

---

## 5️⃣ faq_logs（FAQ応答ログ / 監査）

### 目的

UX品質・再現性・監査。

| フィールド | 型 | 必須 | 説明 | R/W | PII |
| --- | --- | --- | --- | --- | --- |
| householdId | string | 必須 | 対象家庭 | system | Low |
| question | string | 必須 | 入力（**保存前マスキング**） | system | Med |
| answer | string | 必須 | 出力（**保存前マスキング**） | system | Med |
| policyDecision | map | 必須 | 判定（result/primaryReason/reasonCodes） | system | Low |
| model | string | 必須 | 使用モデル | system | Low |
| trace.requestId | string | 必須 | 再現用ID | system | Low |
| createdAt | timestamp | 必須 | 作成日時 | system | Low |

---

## 6️⃣ scenario_states（シナリオ進行）

### 目的

オンボーディング／再活性化のUX制御。

| フィールド | 型 | 必須 | 説明 | R/W | PII |
| --- | --- | --- | --- | --- | --- |
| householdId | string | 必須 | 対象家庭 | system | Low |
| scenarioId | string | 必須 | シナリオID | system | Low |
| stepId | string | 必須 | 現在ステップ | system | Low |
| status | string | 必須 | active / paused / completed | system | Low |
| policyDecision | map | 必須 | 判定結果 | system | Low |

---

## 7️⃣ roadmaps（家庭年間ロードマップ）

### 目的

「先回り体験」の可視化（**個別判断は持たない**）。

| フィールド | 型 | 必須 | 説明 | R/W | PII |
| --- | --- | --- | --- | --- | --- |
| householdId | string | 必須 | 対象家庭 | system | Low |
| year | number | 必須 | 対象年 | system | Low |
| items | array | 必須 | 予定一覧 | system | Med |
| generatedAt | timestamp | 必須 | 生成日時 | system | Low |

---

## ログ・派生の分離（重要）

- 本ページのデータは **UX用途のみ**
- 集計・監査・運用表示は
→ `notification_deliveries / audit_logs / incident_records / admin_views/*`
- **UX系コレクションを管理UI都合で拡張しない**

---

## 参照（必須）

- **6-0**：Policy Engine × UX × 管理UI 対応マトリクス（唯一の正）
- **付録B**：reasonCodes 完全一覧（唯一の正）
- **付録C**：DEGRADED 文言テンプレ（唯一の正）
- **7-3**：ログ・監査ポリシー

---

## 結論

4-2-a は **UXに必要な最小完全セット**のみを定義する。

運用・統治・分析の都合で **このSSOTを汚してはならない**。

---

### 4-2-b. Firestore データ辞書（管理系 / SSOT）

## このページの役割（Non-Negotiable）

本ページは **Parenty の統治・運用・監査を成立させる管理系データの唯一の正（SSOT）**を定義する。

- 障害対応（7-2）
- ログ・監査（7-3）
- 即時停止・解除
- 説明責任・再発防止

を **人の記憶に頼らず再現可能にするためのデータ**である。

> UX系（4-2-a）から直接参照・JOIN・更新してはならない。
> 
> 管理UI / system worker / batch のみが利用する。

---

## 設計原則（管理系 共通）

1. **UXデータを直接編集しない**
2. **すべての操作は audit_logs に痕跡を残す**
3. **削除・上書き禁止（追記のみ）**
4. **Operation（6-2X）と必ず対応づける**
5. **reasonCode / runbook 行番号（7-2 / 7-3）を失わない**
6. 「迷ったら止める」ではなく**「止めた理由を残す」ことを最優先**

---

## 1️⃣ admin_users（管理者）

### 目的

管理UIにおける **権限・責務の明示**。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| email | string | 必須 | 管理者識別子 |
| roles | array | 必須 | viewer / editor / operator / admin |
| status | string | 必須 | active / suspended |
| createdAt | timestamp | 必須 | 登録日時 |
| lastActiveAt | timestamp | 任意 | 最終操作 |

**備考**

- 個別操作の可否は **6-2X.constraints.requiresRole** に従う
- admin_users 自体の変更も audit_logs 対象

---

## 2️⃣ templates（管理用テンプレ）

### 目的

通知・カード・FAQで使用される **文言の「管理版」**を保持する。

> UXで実際に使われる文言は
> 
> **常に Policy Engine + 付録C を通して生成される**。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| templateId | string | 必須 | 不変ID |
| type | string | 必須 | notification / card / faq |
| body | string | 必須 | 原文 |
| riskLevel | string | 推奨 | low / med / high |
| status | string | 必須 | draft / active / disabled |
| sourceRefs | array | 任意 | 情報源ID |
| updatedAt | timestamp | 必須 | 更新時刻 |

**運用ルール**

- status 変更は **必ず audit_logs**
- high risk は **6-2X（DISABLE_TEMPLATE）必須導線**

---

## 3️⃣ global_flags（全体・機能停止）

### 目的

**即時停止の単一真実点（SSOT）**。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| stopAll | boolean | 必須 | 全体停止 |
| featureStops | map | 任意 | notification / faq / scenario |
| reason | string | 任意 | 停止理由 |
| updatedBy | string | 必須 | adminUser |
| updatedAt | timestamp | 必須 | 操作時刻 |

**重要**

- 操作は **必ず audit_logs**
- UX系は **参照のみ**（判断は Policy Engine）

---

## 4️⃣ audit_logs（監査ログ / 不変）

### 目的

**すべての判断・操作・介入の証拠**。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| actorType | string | 必須 | admin / system / guardian |
| actorId | string | 必須 | admin email / service |
| action | string | 必須 | STOP_ALL / DISABLE_TEMPLATE 等 |
| operation | string | 任意 | 6-2X.Operation |
| runbookLabel | string | 必須 | [7-2-x] / [7-3-x] |
| target.kind | string | 必須 | household / template / source |
| target.id | string | 任意 | 対象ID |
| diff | map | 任意 | 変更差分 |
| reason | string | 任意 | 操作理由 |
| createdAt | timestamp | 必須 | 実行時刻 |

**絶対ルール**

- 編集・削除不可
- UI表示も **read-only**

---

## 5️⃣ data_requests（権利行使）

### 目的

GDPR/CCPA 等の **説明責任を担保**。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| dataRequestId | string | 必須 | ID |
| householdId | string | 必須 | 対象家庭 |
| type | string | 必須 | access / delete |
| status | string | 必須 | open / in_progress / completed |
| requestedAt | timestamp | 必須 | 受付 |
| resolvedAt | timestamp | 任意 | 完了 |
| handledBy | string | 任意 | admin |

**対応**

- すべて **7-3（ログ・監査）行番号を付与**
- 削除処理は **incident_records と連動可**

---

## 6️⃣ incident_records（障害・誤通知）

### 目的

**7-2 障害対応フローの実体**。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| incidentId | string | 必須 | ID |
| startedAt | timestamp | 必須 | 開始 |
| severity | string | 必須 | low / med / high |
| triggerReasonCode | string | 必須 | 起点 reasonCode |
| summary | string | 必須 | 概要 |
| affectedScope | map | 任意 | households / notifications |
| actionsTaken | array | 任意 | STOP / 訂正 等 |
| runbookLabel | string | 必須 | [7-2-x] |
| closedAt | timestamp | 任意 | 終了 |

**原則**

- UNKNOWN_REASON は **必ず incident 化**
- 再発防止が書かれない incident は「未完了」

---

## 7️⃣ sources（情報源 / SSOT拡張：v1導入）

### 目的

通知・FAQ・テンプレの根拠となる **情報源** を管理し、鮮度・検証状態・停止（無効化）を運用できるようにする。

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| sourceId | string | 必須 | 不変ID |
| kind | string | 必須 | official / partner / manual / external_api（SSOT: sourceKind） |
| url | string | 必須 | 参照先URL |
| status | string | 必須 | active / disabled |
| verified | boolean | 推奨 | 運用で検証済みか |
| freshnessAt | timestamp | 推奨 | 最終確認日（鮮度の基点） |
| updatedAt | timestamp | 必須 | 更新時刻 |

### R/W（固定）

- read: admin
- write: **systemのみ**（adminは提案→systemが反映、audit_logs必須）

---

## 7️⃣ experience_sources（体験情報源 / SSOT拡張：v1導入）

### 目的（Non-Negotiable）

海外在住者の体験談ベース情報を **Vendorと完全分離**して取り込み、Parentyが **中立に再編集した「傾向・注意点」**としてのみ利用するための情報源を管理する。

**絶対禁止**

- Inquiry / 送客 / 成約 / 広告導線を持たせる（Vendor化）
- 個人名・人格・SNSハンドル等を UX に出す
- 単独ソースを断定表現で用いる

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| sourceId | string | 必須 | 不変ID（NextActionTargets.sourceIdと共通） |
| status | string | 必須 | active / disabled |
| region.country | string | 推奨 | 居住国（粒度制御） |
| region.city | string | 任意 | 都市（**UX非表示、管理UIのみ**） |
| genres | array | 推奨 | 生活 / 教育 / 医療体験 等（分類） |
| commercialFlag | boolean | 必須 | 商業関係の可能性（UX非表示、運用判断用） |
| trustScore | number | 任意 | 内部スコア（UX非表示） |
| incidentNotes | array | 任意 | 炎上・注意履歴（PII禁止、UX非表示） |
| lastReviewedAt | timestamp | 推奨 | 最終レビュー日 |
| updatedAt | timestamp | 必須 | 更新時刻 |

### R/W（固定）

- read: admin
- write: **systemのみ**（adminは提案→systemが反映、audit_logs必須）

---

## 7️⃣ experience_fragments（知見フラグメント / SSOT拡張：v1導入）

### 目的（Non-Negotiable）

投稿単位ではなく **「知見フラグメント」**単位で保持し、UXには必ず **「傾向・注意点」形式**として出すための素材を管理する。

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| fragmentId | string | 必須 | 不変ID |
| sourceId | string | 必須 | experience_sources.sourceId |
| status | string | 必須 | active / disabled |
| topic | string | 推奨 | テーマ（例: 学校/医療/生活） |
| region.country | string | 推奨 | 居住国（粒度制御） |
| region.city | string | 任意 | 都市（**UX非表示、管理UIのみ**） |
| text | string | 必須 | 素材（個人名/特定可能情報の除去を前提） |
| extractedAt | timestamp | 推奨 | 抽出日時 |
| freshnessAt | timestamp | 推奨 | 鮮度の基点 |
| rawLinks | array | 任意 | アフィリエイトURL・SNS誘導等（**保存可だがUX非表示**） |
| updatedAt | timestamp | 必須 | 更新時刻 |

### 運用規約（固定）

- text に **個人名 / 連絡先 / 具体住所 / 子ども固有情報**が含まれる場合、UX利用は禁止する。
- 上記に該当する場合は **DISABLE_SOURCE**（7-2-4）へ接続し、管理UIでレビュー必須とする。
- rawLinks は **source/fragment の無効化時に削除対象**とする（audit_logs で記録）。

### R/W（固定）

- read: admin
- write: **systemのみ**（adminは提案→systemが反映、audit_logs必須）

---

## 7️⃣ experience_usage_logs（体験情報利用ログ / SSOT拡張：v1導入）

### 目的

Experience Source を利用した出力（FAQ/通知/ロードマップ等）を **監査可能に追跡**する。

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| usageId | string | 必須 | 不変ID |
| householdId | string | 必須 | 家庭 |
| feature | string | 必須 | faq / notification / scenario / roadmap |
| fragmentIds | array | 推奨 | 使用した fragmentId（複数可） |
| policyDecision | object | 必須 | SSOT B-1-1（共通埋め込み） |
| policyTrace | object | 必須 | SSOT B-1-2（共通埋め込み） |
| createdAt | timestamp | 必須 | 作成時刻 |

### R/W（固定）

- read: admin
- write: system

---

## 7️⃣ review_sources（RAES: Review Aggregated Experience Source / SSOT拡張：v1導入）

### 目的（Non-Negotiable）

TripAdvisor / Yelp / Zocdoc 等のレビューを **広告・送客・収益のために使わず**、UX専用の「判断補助・注意喚起レイヤー（RAES）」として扱う。

**絶対禁止**

- Vendor化（Inquiry/送客/成約/広告導線を持たせる）
- 店名・医師名・会社名をUXに出す
- 星評価・順位・人気・ランキング表現をUXに出す
- 単独レビュー（単独ソース）を断定表現で使う

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| sourceId | string | 必須 | 不変ID（NextActionTargets.sourceIdと共通） |
| platform | string | 必須 | tripadvisor / yelp / zocdoc / other |
| status | string | 必須 | active / disabled |
| region.country | string | 推奨 | 国（粒度制御） |
| region.city | string | 任意 | 都市（粒度制御、UXでの露出は別途規約） |
| genres | array | 推奨 | 生活 / 教育 / 医療 等 |
| commercialFlag | boolean | 必須 | 商業関係の可能性（UX非表示） |
| trustScore | number | 任意 | 内部スコア（UX非表示） |
| lastReviewedAt | timestamp | 推奨 | 最終レビュー日 |
| updatedAt | timestamp | 必須 | 更新時刻 |

### R/W（固定）

- read: admin
- write: **systemのみ**（adminは提案→systemが反映、audit_logs必須）

---

## 7️⃣ review_fragments（RAES知見フラグメント / SSOT拡張：v1導入）

### 目的（Non-Negotiable）

投稿単位ではなく **「知見フラグメント」**単位で保持し、UXには必ず **「注意点・傾向・誤解されやすい点」**としてのみ提示する。

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| fragmentId | string | 必須 | 不変ID |
| sourceId | string | 必須 | review_sources.sourceId |
| status | string | 必須 | active / disabled |
| topic | string | 推奨 | テーマ（例: 医療/学校/生活） |
| region.country | string | 推奨 | 国（粒度制御） |
| region.city | string | 任意 | 都市（粒度制御） |
| text | string | 必須 | フラグメント本文（固有名詞を含めない/除去を前提） |
| entityNames | array | 任意 | 店名/医師名/会社名等（**保存可だがUX非表示**） |
| ratingRankRaw | map | 任意 | 星評価/順位等（**保存は可だがUX非表示**、集計/ランキング用途禁止） |
| extractedAt | timestamp | 推奨 | 抽出日時 |
| freshnessAt | timestamp | 推奨 | 鮮度の基点 |
| rawLinks | array | 任意 | レビューURL等（**保存可だがUX非表示**） |
| updatedAt | timestamp | 必須 | 更新時刻 |

### R/W（固定）

- read: admin
- write: **systemのみ**（adminは提案→systemが反映、audit_logs必須）

---

## 7️⃣ review_usage_logs（RAES利用ログ / SSOT拡張：v1導入）

### 目的

RAESを利用した出力（FAQ/通知/ロードマップ等）を **監査可能に追跡**する。

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| usageId | string | 必須 | 不変ID |
| householdId | string | 必須 | 家庭 |
| feature | string | 必須 | faq / notification / scenario / roadmap |
| fragmentIds | array | 推奨 | 使用した fragmentId（複数可） |
| policyDecision | object | 必須 | SSOT B-1-1（共通埋め込み） |
| policyTrace | object | 必須 | SSOT B-1-2（共通埋め込み） |
| createdAt | timestamp | 必須 | 作成時刻 |

### R/W（固定）

- read: admin
- write: system

---

## 🔟 insight_reactions（IRS: Insight Reaction Signal / SSOT拡張：v1導入）

### 目的（前提固定）

UXの「注意喚起・判断補助（Insight）」に対する反応のみを記録し、**UX信頼の維持と判断補助価値の改善**に使う。  
**Vendor評価・成約・満足度・広告・送客**のためには一切使わない。

### 絶対禁止（Non-Negotiable）

- vendorId / businessId / rating（星評価）など、商業評価・送客・成約に接続できるフィールドの保存
- 個票（1家庭/1人）の追跡を目的とした運用（管理UIは集計のみ）

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| reactionId | string | 必須 | 不変ID |
| householdId | string | 必須 | 家庭（監査/再現性のため。意思決定には使わない） |
| feature | string | 必須 | faq / notification / scenario / roadmap |
| insightKind | string | 必須 | 示唆の種類（SSOTで定義されたキーのみ。未定義は保存禁止） |
| userAction | string | 必須 | ユーザー行動（SSOTで定義されたキーのみ。未定義は保存禁止） |
| flowChanged | boolean | 任意 | 示唆によりフロー変化が起きたか（例：設定画面へ移動） |
| policyDecision | object | 必須 | SSOT B-1-1（共通埋め込み） |
| policyTrace | object | 必須 | SSOT B-1-2（共通埋め込み） |
| createdAt | timestamp | 必須 | 作成時刻 |

### enum（固定：MVP）

`insightKind` と `userAction` は **allowlist（SSOT固定）**とし、未定義値は **保存禁止**。  
追加・変更は必ず **本SSOTの変更履歴（E. Changelog）に記録**してから行う。

#### insightKind（固定）

- `CAUTION`（注意喚起）
- `MISUNDERSTANDING_GUARD`（誤解防止）
- `DECISION_SUPPORT`（判断補助）

#### userAction（固定）

- `DISMISSED`（閉じた/無視した）
- `ACKNOWLEDGED`（確認した）
- `OPENED_MORE_INFO`（詳細を開いた）
- `OPENED_SETTINGS`（設定を開いた）
- `ASKED_FOLLOWUP`（追加質問した）

**禁止（固定）**

- vendorId / businessId / rating 等へ接続できる行動キー
- 満足度・成約・購買を直接表す行動キー

### R/W（固定）

- read: admin（**個票非表示**。集計ビューのみ参照）
- write: system

---

## 8️⃣ reviews（品質レビュー / SSOT拡張：v1導入）

### 目的

テンプレ/情報源/FAQの品質課題を **運用タスクとして明示**し、再発防止を運用で回せるようにする。

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| reviewId | string | 必須 | 不変ID |
| status | string | 必須 | open / resolved |
| target.kind | string | 必須 | template / source / faq |
| target.id | string | 必須 | 対象ID |
| reasonCodes | array | 推奨 | 付録BのreasonCode（複数可） |
| summary | string | 推奨 | PII禁止の短い要約 |
| createdAt | timestamp | 必須 | 作成時刻 |
| updatedAt | timestamp | 必須 | 更新時刻 |

### R/W（固定）

- read: admin
- write: **systemのみ**（adminは提案→systemが反映、audit_logs必須）

---

## 9️⃣ ops_configs（運用設定 / SSOT拡張：v1導入）

### 目的

運用上の閾値・ガード等の設定を、コード直書きではなく **運用設定として管理**する。

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| configKey | string | 必須 | 不変キー（例: alert_thresholds / vendor_tiers） |
| scope | string | 必須 | global / feature |
| featureKey | string | 任意 | notification / faq / scenario（scope=featureの場合） |
| payload | map | 必須 | 設定値（PII禁止） |
| status | string | 必須 | active / disabled |
| updatedAt | timestamp | 必須 | 更新時刻 |

### R/W（固定）

- read: admin
- write: **systemのみ**（adminは提案→systemが反映、audit_logs必須）

---

## 🔟 admin_views（派生ビュー / SSOT拡張：v1導入）

### 目的（固定）

管理UIの**表示専用**の派生ビューを保持する。意思決定に使わない。

### フィールド（最小）

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| viewId | string | 必須 | `dashboard_daily` / `alerts_active` |
| generatedAt | timestamp | 必須 | 生成時刻 |
| payload | map | 必須 | view固有のデータ（PII禁止） |
| payload.byPrimaryReason | map | 任意 | `dashboard_daily` 用（key=primaryReason, value=count） |
| payload.items | array | 任意 | `alerts_active` 用 |
| payload.items[].nextAction | map | 必須 | SSOT 6-2Z（UIは解釈禁止） |
| payload.items[].count | number | 必須 | 件数 |
| payload.items[].lastSeenAt | timestamp | 必須 | 最終発生 |

### R/W（固定）

- read: admin
- write: **systemのみ**（adminは提案→systemが反映、audit_logs必須）

---

## 管理系データと運用章の対応

| データ | 主対応章 |
| --- | --- |
| admin_users | 6-2X / 7-3 |
| templates | 6-2X / 7-1 |
| global_flags | 7-2 |
| audit_logs | 7-3 |
| data_requests | 7-3 |
| incident_records | 7-2 |
| sources | 7-1 / 6-2X |
| experience_sources | 7-1 / 7-2 / 6-2X |
| experience_fragments | 7-1 / 7-2 |
| experience_usage_logs | 7-3 |
| review_sources | 7-1 / 7-2 / 6-2X |
| review_fragments | 7-1 / 7-2 |
| review_usage_logs | 7-3 |
| insight_reactions | 7-1 / 7-3 |
| reviews | 7-1 / 7-3 |
| ops_configs | 7-1 |

---

## 結論

4-2-b は **「管理UIのため」ではなく
Parenty が壊れなかった理由を未来に説明するためのSSOT**である。

- UXに触らない
- 判断を消さない
- 理由を残す

これを破る設計変更は **禁止**。

---

### 4-3. Firestore Index 定義

本ページは、Parenty における **Firestore Index の唯一の正規定義**である。

Index はパフォーマンス最適化のためだけに存在するものではない。

本定義は、以下の構造を **破壊せずに成立させるための前提条件**として設計されている。

- 6-0 Policy Engine × UX × 管理UI 対応マトリクス
- 6-2X 管理UIオペレーション（nextAction 駆動）
- 7-1〜7-3 reasonCode 駆動運用・監査フロー

Index は「速くする」ためではなく、

**判断・説明・再現を迷わず行うための構造部品**である。

---

#### 4-3-1. クエリ前提（Index 方針）

##### 4-3-1-A. 代表的なクエリ型

**型1：家庭スコープ × 時系列一覧**

```
where householdId == X
orderBy createdAt desc
```

**型2：通知・配送の状態監視**

```
where status == S
orderBy scheduleAt asc
```

または

```
where status == S
orderBy sentAt desc
```

**型3：判断結果（DENY / DEGRADED）ドリルダウン**

```
where policyDecision.result == DENY
orderBy createdAt desc
```

**型4：重複防止・再現**

```
where dedupeKey == K
```

```
where trace.runId == R
orderBy createdAt desc
```

**型5：テンプレ / Run 単位の追跡**

```
where trace.templateId == T
orderBy createdAt desc
```

---

##### 4-3-1-B. Index 設計ルール（SSOT）

1. ログ系コレクションは必ず createdAt / sentAt を持つ
2. householdId はすべてのログに必須
3. policyDecision.result / policyDecision.primaryReason は必須
4. reasonCodes 配列を直接検索しない
5. in / array-contains-any は MVP では原則禁止

reasonCode は検索軸ではなく、**判断の結果として読むもの**である。

---

#### 4-3-2. MVP 必須 Index（最小完全セット）

##### A. notifications

家庭別通知一覧

```
where householdId == X
orderBy scheduleAt desc
```

Index：

```
householdId ASC, scheduleAt DESC
```

状態別（送信待ち・失敗など）

```
where status == S
orderBy scheduleAt asc
```

Index：

```
status ASC, scheduleAt ASC
```

重複防止チェック

```
where dedupeKey == K
```

run 単位追跡

```
where trace.runId == R
orderBy scheduleAt desc
```

Index：

```
trace.runId ASC, scheduleAt DESC
```

##### B. notification_deliveries（監査の核）

家庭別配送履歴

```
where householdId == X
orderBy sentAt desc
```

Index：

```
householdId ASC, sentAt DESC
```

状態別監視

```
where status == S
orderBy sentAt desc
```

Index：

```
status ASC, sentAt DESC
```

判断結果別（DENY / DEGRADED）

```
where policyDecision.result == D
orderBy sentAt desc
```

Index：

```
policyDecision.result ASC, sentAt DESC
```

run 単位追跡

```
where trace.runId == R
orderBy sentAt desc
```

Index：

```
trace.runId ASC, sentAt DESC
```

##### C. faq_logs

家庭別

```
where householdId == X
orderBy createdAt desc
```

Index：

```
householdId ASC, createdAt DESC
```

判断結果別

```
where policyDecision.result == D
orderBy createdAt desc
```

Index：

```
policyDecision.result ASC, createdAt DESC
```

request 再現

```
where trace.requestId == Q
orderBy createdAt desc
```

Index：

```
trace.requestId ASC, createdAt DESC
```

##### D. audit_logs

操作種別別

```
where action == A
orderBy createdAt desc
```

Index：

```
action ASC, createdAt DESC
```

操作対象別

```
where target.kind == K
orderBy createdAt desc
```

Index：

```
target.kind ASC, createdAt DESC
```

##### E. scenario_states

家庭別状態

```
where householdId == X
orderBy updatedAt desc
```

Index：

```
householdId ASC, updatedAt DESC
```

実行中スキャン

```
where status == "active"
orderBy updatedAt asc
```

Index：

```
status ASC, updatedAt ASC
```

##### F. roadmaps

```
where householdId == X
orderBy year desc
```

Index：

```
householdId ASC, year DESC
```

##### G. subscriptions（課金の真実）

```
where householdId == X
orderBy updatedAt desc
```

Index：

```
householdId ASC, updatedAt DESC
```

---

#### 4-3-3. 拡張 Index（運用安定後）

reasonCodes 検索について：

MVP では **直接検索しない**。

必要な場合は以下のいずれかで対応する。

- policy.primaryReason に正規化
- admin_views 派生コレクションで日次集計

---

### 4-4. Firestore Security Rules

Firestore Security Rules は、**Parenty の思想・運用・安全設計を「強制力」に変換する最後の防波堤**である。

- UX が誤って暴走しないため
- 管理UIが万能権限にならないため
- 実装AI（Cursor / Copilot / Codex）が誤実装しても事故らないため

本章は、

- 実装コード
- 管理UI仕様
- UX仕様

**すべてより上位**に置かれる。

Rules に反する実装は、

たとえ便利でも「仕様違反」とする。

---

#### 4-4-0. 基本原則（Non-Negotiable）

以下は **一切の例外を認めない**。

1. **最小権限（Least Privilege）**
2. **UX系と管理系データの完全分離**
3. **子どもデータは Guardian でも制限**
4. **audit_logs は append-only（不変）**
5. **すべての書き込みは system 起点を前提**

Rules は「信頼」ではなく **誤りを前提**に設計する。

---

#### 4-4-1. ロール定義（論理）

| ロール | 説明 |
| --- | --- |
| guardian | 認証済み保護者（Firebase Auth） |
| admin | 管理者（Custom Claims / admin_users） |
| system | Cloud Functions / Backend（Service Account） |

---

#### 4-4-2. 共通ヘルパー（概念定義）

※ 実装方法は Custom Claims / 参照コレクションいずれでもよい  
※ **意味論は固定**

```
function isSignedIn() {
  return request.auth != null;
}

function isGuardian() {
  return isSignedIn() && request.auth.token.role == "guardian";
}

function isAdmin() {
  return isSignedIn() && request.auth.token.isAdmin == true;
}

function belongsToHousehold(householdId) {
  return request.auth.token.householdId == householdId;
}
```

---

### 4-4-A. UXコアデータ（家庭・人）

#### households

| 操作 | 許可 |
| --- | --- |
| read | guardian（自 household のみ） / admin |
| write | ❌（system のみ） |

理由：

- plan / flags / status は UX から変更不可
- 変更は必ず Policy Engine + audit を伴う

---

#### guardians

| 操作 | 許可 |
| --- | --- |
| read | guardian（自分のみ） / admin |
| write | guardian（displayName / prefs のみ） |

禁止事項：

- householdId / roles / status の変更
- 他 guardian の編集

---

#### children（最重要データ）

| 操作 | 許可 |
| --- | --- |
| read | guardian（自 household） |
| write | guardian（最小フィールドのみ） |

制限：

- 削除は禁止 → **論理削除（status = deleted）**

---

### 4-4-B. 同意・課金（UX参照可／書込不可）

#### consents

| 操作 | 許可 |
| --- | --- |
| read | guardian（自 household） / admin |
| write | system のみ |

#### subscriptions

| 操作 | 許可 |
| --- | --- |
| read | admin / system |
| write | system のみ |

重要：

- UX は **絶対に参照しない**
- UX は households.plan のみを見る

---

### 4-4-C. UXログ・状態データ

対象：

- notifications
- notification_deliveries
- faq_logs
- scenario_states
- roadmaps

| 操作 | 許可 |
| --- | --- |
| read | guardian（自 household） / admin |
| write | system のみ |

理由：

- UX がログを書かない
- 改ざん・消去を不可能にする

---

### 4-4-D. 管理・監査データ（最重要）

#### audit_logs

| 操作 | 許可 |
| --- | --- |
| read | admin |
| write | system のみ |
| update / delete | ❌ |

append-only 原則：

- create のみ許可
- diff は最小限
- PII を含めない

---

#### data_requests（権利請求）

| 操作 | 許可 |
| --- | --- |
| read | admin / guardian（自 household） |
| write | guardian（create のみ） |

---

### 4-4-E. 管理UI専用データ

対象：

- admin_users
- templates
- global_flags

| 操作 | 許可 |
| --- | --- |
| read | admin |
| write | admin |
| UX access | ❌ |

補足：

- templates の publish / disable → **必ず audit_logs**
- Cloud Functions で強制

---

### 4-4-F. 明示的に禁止すること

- guardian が admin 系コレクションに触る
- UX が直接 audit_logs を書く
- client から plan / flags / status を更新
- 子どもデータをログに直書きする

---

### 4-4-G. FAIL SAFE 原則

Rules で判断に迷った場合：

**deny が正解**

- 例外は作らない
- UX は DEGRADED / DENY を受け入れる前提

---

## 5️⃣ UX仕様（派生ビュー）

### 5-0. UX基本原則（全状態共通）

本章は、Parenty における **すべてのUX設計の最上位原則**を定義する。

以下に示す原則は、

- 機能
- プラン
- 状態（ALLOW / DEGRADED / DENY）
- チャネル（通知 / FAQ / カード / リッチメニュー）

のいずれにも **例外なく適用**される。

UXは独立した判断主体ではない。

**Policy Engine の結果に完全に従属する。**

---

#### 5-0-1. 絶対原則（Non-Negotiable）

すべての状態で、以下は絶対に変えてはならない。

- **子どもを主語にしない**
  - 子どもは判断主体でも責任主体でもない
- **不安を増幅させない**
  - 危機感・警告色・エラー表現を乱用しない
- **判断を代替しない**
  - 行動を強制せず、選択肢を整理して提示する
- **理由は説明するが、詳細は出しすぎない**
  - 内部ロジック・リスク評価の露出は禁止
- **UXは Policy Engine の結果に従属**
  - UX側で if / 例外判定を持たない

---

#### 5-0-2. 状態モデルとUXの関係

UXは以下の **3状態のみ**を前提に設計する。

| 状態 | 定義 |
| --- | --- |
| **ALLOW** | Policy Engine が安全・妥当と判断 |
| **DEGRADED** | 条件付きで提供可能（安全側に制限） |
| **DENY** | 提供不可（ただし沈黙は禁止） |

※ この3状態以外の表現（例：「半許可」「軽度制限」等）は禁止。

---

### 5-A. 通常時UX（ALLOW）

#### 定義

Policy Engine が **ALLOW** を返した状態。

#### 振る舞い原則

- 情報は **最適粒度**で提示
- 子ども個別情報の使用可（同意が前提）
- 通知・FAQ・カードは **通常表現**

---

### 5-B. 制限時UX（DEGRADED）

#### 定義

Policy Engine が **DEGRADED** を返した状態。

#### 中核原則

- **情報を隠すが、存在は隠さない**
- 子ども固有情報は原則非表示
- 表現は **付録C：DEGRADED文言テンプレのみ使用可**

独自文言・即興表現は禁止。

---

### 5-C. 停止時UX（DENY）

#### 定義

Policy Engine が **DENY** を返した状態。

#### 中核原則

- **沈黙しない**
- 技術的理由を出さない
- 代替行動を必ず提示

---

### 5-1. UX全体像

本章では、Parenty のUXを

「機能一覧」ではなく「体験の構造」として定義する。

---

### 5-2. 通知UX

本章では、Parenty における「通知」を

**最も価値が高く、同時に最も危険なUX**として定義する。

通知は「便利なリマインド」ではない。

家庭の見落としリスクを下げるために、意図的に制御された介入である。

---

### 5-3. FAQ（LLM）UX

本章では、Parenty における FAQ（LLM）を

「質問に答えるAI」ではなく、「誤解と事故を起こさないための制御点」として定義する。

#### 5-3-0. FAQ UXの位置づけ（最重要）

- 利用者は不安な状態で入力してくる
- 前提条件は欠落している
- LLMは判断主体ではない

よって FAQ は、

「正解を出す装置」ではなく

「誤った判断をしないための緩衝材」

として設計される。

#### 5-3-2. Policy Engine 前提（必須）

FAQ のすべての出力は、

**必ず Policy Engine の評価結果を前提**とする。

#### 5-3-4. 専門領域ガード（RISK系）

高リスク領域（必ずガード）：

- 医療
- 法務
- 教育（資格・進路）
- 移民・ビザ

ガード原則：

- 判断・助言・指示は禁止
- 制度構造・一般論まで
- 専門家相談を **命令せず示唆**

ログ必須項目：

- reasonCodes（RISK系）
- refusal / partial_answer 区別

**答えないこと自体が品質である。**

---

---

## 5️⃣ UX仕様（派生ビュー）— 続き

### 5-4. 家庭年間ロードマップUX

家庭年間ロードマップは、通知・FAQ・個別データの上位に立つ「構造可視化UX」である。

ロードマップは予定表でもToDoでもない。  
「この家庭において、今年どの“種類の判断”が発生しうるか」を俯瞰させる装置である。

---

#### 5-4-1. 生成・再生成ルール（Policy前提）

ロードマップは常時更新型だが、生成・再生成トリガーは厳密に制御する。

- 初期生成（必須）
  - 家庭登録完了時
  - 子ども初回登録時
- 差分再生成（最重要）
  - 子どもの年齢進級（誕生日）
  - 学年・学校・学区変更
  - 居住地域変更（州・市）
  - プラン変更
  - 同意スコープ変更
- 定期リフレッシュ（推奨）
  - 月1回 または 四半期1回（制度更新の反映）

非トリガー：

- FAQ閲覧ごと
- 通知送信ごと
- 管理UI操作ごと（明示操作を除く）

---

#### 5-4-2. Policy Engine による生成制御

ロードマップ生成・更新は必ず Policy Engine を通過する。

- ALLOW：通常生成（種別・月・注意ポイント）
- DEGRADED：抽象化した項目のみ（個別名・日付は伏せる／付録Cのみ）
- DENY：生成しない。既存項目がある場合は非表示化（痕跡ログは保持）

---

#### 5-4-3. 表示粒度（3層構造）

- Layer 1：年間俯瞰（必須）
  - 月単位
  - 種別アイコンのみ
- Layer 2：月詳細（オンデマンド）
  - その月に発生しうる事項の一覧
  - 優先度タグ（高/中/低）
- Layer 3：詳細（リンクアウト）
  - 通知履歴
  - 関連FAQ
  - 公式サイトURL
  - 管理UI上の根拠データ（admin）

表示しないもの：

- 行動指示
- 締切断定
- 成否・可否判断

---

#### 5-4-4. 通知との関係（従属構造）

- ロードマップ：構造
- 通知：トリガー

通知は必ずロードマップ上の要素に紐づく。

- 既存項目がある場合：ハイライト、状態更新（未確認→通知済）
- 新規イベントの場合：Policy通過必須、許可時のみ追加（追加理由・情報源をtraceに保存）

通知抑制・OFF時：

- 通知OFFでもロードマップは維持
- 「見に行けば全体像がある」状態を保証

誤通知・訂正時：

- 項目は削除しない
- 状態を「訂正済」に変更
- 誤情報だった事実を履歴として保持

---

#### 5-4-5. ログ・監査との関係

ロードマップ生成・更新・抑制はログ対象。

必須ログ（7-3で検証）：

- householdId
- childId（該当時）
- policyDecision（result/reasonCodes/primaryReason/templateId）
- sourceRef（該当時）
- patchType（initial/diff/refresh）

---

### 5-5. 異常時UX

異常時UXとは、「うまくいかなかったことを隠す」ためではない。  
「制御された状態である」ことを静かに伝えるUXである。

---

#### 5-5-0. 異常時UXの基本思想（固定）

異常時に Parenty が守る原則：

1. 沈黙しない
2. 理由を作らない（内部詳細を語らない）
3. 次に取れる行動を奪わない

---

#### 5-5-1. 異常時UXの発火条件（唯一）

以下の場合のみ発火する：

- Policy Engine の result が DEGRADED
- Policy Engine の result が DENY
- STOP系 reasonCode が有効（付録B category=STOP）

UX側の独自判断は禁止。

---

#### 5-5-2. Result別：表示制御の原則

##### A. DENY（出してはいけない）

- 沈黙禁止
- 情報内容は出さない
- 表示構造（固定）
  1. 状況の説明（短文・中立）
  2. 現在の状態（できないこと）
  3. 次に取れる行動（設定／確認／待機）

文言：

- **付録Cのテンプレのみ使用可**（手打ち禁止）

---

##### B. DEGRADED（制限付きで出せる）

- 出せる範囲だけ出す
- 出せない理由は語らない（内部詳細禁止）
- 概要情報のみ、個別名・確定情報は伏せる

文言：

- **付録Cのテンプレのみ使用可**

---

##### C. STOP（強制停止）

- DENYと同一
- ただし「止まっている」事実は隠さない
- 復旧“予定”ではなく復旧“条件”のみ（断定禁止）

---

#### 5-5-3. reasonCode別：UXの責務

UXは reasonCode を翻訳しない。

UXがやること：

- resultに応じた表示制御
- templateId選択（付録C）
- 次アクションの種類提示（付録Cの範囲）

reasonCodeの意味解釈・運用判断は管理UI（6章）と運用（7章）の責務。

---

#### 5-5-4. 同意不足時UX（CONSENT系）

- DENY：機能・情報を非表示、同意更新導線のみ提示（付録C）
- DEGRADED：概要のみ、詳細は同意後（圧力・煽り禁止、付録C）

---

#### 5-5-5. プラン制限時UX（PLAN系）

- 課金誘導禁止（営業文言禁止）
- 表示方針：現在のプランでは概要のみ／代替（一般論）提示
- アップグレードは設定導線の結果として起こる（異常時に混ぜない）

---

#### 5-5-6. システム・運用異常時UX（SYSTEM/OPS系）

- 内部エラー名を出さない
- 復旧時刻を断定しない
- 影響範囲のみ伝える
- 文言は付録Cのみ

---

#### 5-5-8. ログ・監査との接続

異常時UXが発火した場合、必ず以下を残す：

- policyDecision.result
- policyDecision.reasonCodes[]
- policyDecision.templateId（付録Cテンプレ）
- 発火コンテキスト（通知/FAQ/シナリオ）

---

### 5-6. 設定UX（SSOT）

設定UXは「カスタマイズ機能」ではない。  
**Policy Engine に渡す入力を、人間が唯一変更できる場所**である。

---

#### 5-6-0. 設定UXの位置づけ（固定）

- UX上は地味
- 機能上は最重要
- 事故時は唯一の責任起点

---

#### 5-6-1. 設定UXで変更できるもの（限定）

ユーザーが変更できるのは以下のみ：

1. 通知のON/OFF（機能単位）
2. 通知時間帯（quiet hours）
3. 同意の更新（再同意フローの起動）
4. 家庭・子ども情報の登録・修正
5. プランに紐づく範囲設定（表示のみ）

---

#### 5-6-2. 設定UXで変更できないもの（禁止）

- Policy result（ALLOW/DEGRADED/DENY）
- reasonCode
- リスク判定
- テンプレ内容
- 例外許可

---

#### 5-6-3. 設定変更の基本原則

- 変更前/変更後が分かる
- 影響範囲を断定しない
- 即時反映を保証しない（「すぐ反映されます」禁止）

---

## 5-6. 設定UX × Firestore フィールド対応表（SSOT）

> **注意**：同意のSSOTは `consents` コレクション。`households` に同意の真実を書かない。

---

### 5-6A. 通知ON / OFF 設定

| 項目 | Firestore |
| --- | --- |
| コレクション | households |
| ドキュメントID | householdId |
| フィールド | notificationSettings |
| 型 | map<string, boolean> |

例：

```json
{
  "notificationSettings": {
    "school": true,
    "admin": false,
    "reminder": true
  }
}
```

備考：

- false は該当機能のDENY/DEGRADED要因になり得る（判定はPolicy Engine）
- UXで reasonCode を生成しない

---

### 5-6B. quiet hours（通知時間帯）

| 項目 | Firestore |
| --- | --- |
| コレクション | households |
| ドキュメントID | householdId |
| フィールド | quietHours |
| 型 | map |

構造：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "21:00",
    "end": "07:00",
    "timezone": "America/New_York"
  }
}
```

運用ルール：

- enabled=true は DEGRADED 要因
- quiet hours を DENY 要因にしてはならない

---

### 5-6C. 同意（Consent）設定

| 項目 | Firestore |
| --- | --- |
| コレクション | consents |
| ドキュメントID | consentId（付録A） |
| フィールド | scopes / version / grantedAt / revokedAt |
| 型 | map |

例（概念）：

```json
{
  "householdId": "hh_xxx",
  "version": "v1.2",
  "scopes": {
    "notification": { "granted": true, "grantedAt": "timestamp" },
    "faq": { "granted": false },
    "childScopedNotification": { "granted": true }
  }
}
```

補足：

- version 不一致 → `CONSENT_VERSION_OUTDATED`（付録B）
- granted=false → `CONSENT_MISSING_NOTIFY` / `CONSENT_MISSING_FAQ`（付録B）
- UXは状態表示のみ（書き込みはsystem経由）

---

### 5-6D. 家庭情報設定

| 項目 | Firestore |
| --- | --- |
| コレクション | households |
| フィールド | profile |
| 型 | map |

例：

```json
{
  "profile": {
    "country": "US",
    "state": "NY",
    "city": "New York",
    "language": "ja"
  }
}
```

注意：

- 未設定は DEGRADED 要因になり得るが、DENYは禁止

---

### 5-6E. 子ども情報設定

| 項目 | Firestore |
| --- | --- |
| コレクション | children |
| ドキュメントID | childId |
| フィールド | profile / school / health / status |

例：

```json
{
  "profile": { "birthYear": 2016, "nickname": "..." },
  "school": { "district": "..." },
  "health": { "vaccineTrackEnabled": true },
  "status": "active"
}
```

運用ルール：

- 実名保存禁止
- 未登録は DEGRADED 要因

---

### 5-6F. プラン状態（参照専用）

| 項目 | Firestore |
| --- | --- |
| コレクション | households |
| フィールド | plan |
| 型 | map |

例：

```json
{
  "plan": {
    "tier": "free",
    "status": "active",
    "validUntil": "timestamp"
  }
}
```

重要：

- UXから変更不可
- 真実（SoT）は subscriptions（管理系）

---

### 5-6G. 設定変更ログ（必須）

対象：

- 5-6A〜F のすべて

| 項目 | Firestore |
| --- | --- |
| コレクション | audit_logs |
| actorType | guardian |
| action | UPDATE_SETTING |
| target.kind | household |
| diff | before/after（最小、PII禁止） |
| createdAt | serverTimestamp |

UX制約：

- ログON/OFF選択不可
- 保存失敗時は設定変更を失敗扱い

---

---

### 5-7. 外部依存UX原則（API劣化・停止時）

目的：外部APIが増える前提で、劣化・停止時のUXを一貫させる。

原則（MUST）：

1. **ユーザーに“できること”を提示する**：単なる謝罪や内部事情説明で終わらない（付録Cの構造に従う）。
2. **ベンダー名・障害詳細は原則出さない**：セキュリティ/信頼/炎上回避のため、必要最低限の中立表現に留める。
3. **公式情報への導線を常備**：取得失敗時は公式URL（または公式への到達手順）を提示する（付録F-5/`APIRegistry_External.md` 参照導線）。
4. **断定禁止**：推定・未確定情報は推定として扱い、断定しない（1-3/1-4/付録C）。

劣化モード（SHOULD）：

- `policyDecision.result=DEGRADED` の場合、重要度の高い案内（安全/期限/公式確認手順）を優先し、任意情報は抑制する。
- 外部API障害/到達不能は `CONTEXT_PROVIDER_OUTAGE` に正規化し、付録Cの `tpl_deg_provider_outage` を使用する（3-4/付録F-4）。

実装接続（仕様）：

- 外部依存の可用性は **独自状態を増やさず**、reasonCode（付録B）に正規化して扱う。
  - 例：DOWN 相当 → `CONTEXT_PROVIDER_OUTAGE`
  - 例：DEGRADED 相当（制限/不確実性）→ `CONTEXT_RATE_LIMIT` / `SOURCE_UNVERIFIED` / `SOURCE_OUTDATED`
- `CONTEXT_PROVIDER_OUTAGE` の場合、運用導線は 6-2X により `nextAction.action=CREATE_INCIDENT` に接続する。

## 6️⃣ 管理UI仕様

## 6-0. Policy Engine × UX × 管理UI マトリクス（SSOT）

本章は、Policy Engine の出力（result / reasonCodes / primaryReason / templateId）を、UX・管理UI・ログへ一意に接続する唯一の正規定義である。

---

### 6-0M0. マトリクスの読み方（共通）

- 入力：Policy Engine の出力（必須）
  - result：ALLOW / DEGRADED / DENY
  - reasonCodes[]：必須（1つ以上）
  - primaryReason：必須（1つ）
  - templateId：任意（DEGRADED/DENYで付録Cテンプレを使用した場合のみ）
- UX：LINE Bot / 通知 / カード / リッチメニュー の振る舞い
- 管理UI：表示・アラート・推奨アクション・ワンクリック導線
- ログ：必須記録先  
  `notifications / notification_deliveries / faq_logs / scenario_states / audit_logs / incident_records`

---

### 重要（Non-Negotiable）

1. **DEGRADED / DENY 表示文言は付録C以外禁止**
2. **reasonCodeの正式名称・category・defaultResult・templateIdは付録Bが唯一の正**
   - 6-0 / 6-2X は付録Bの参照であり独自命名は禁止
   - alias を受ける場合は ingestion 層で canonical（付録B）に正規化し、保存・集計は canonical のみ
3. 迷ったら FAIL SAFE（DENY または DEGRADED）。沈黙禁止（DENYでも説明カード/短文）

---

### 6-0M1. 結果別：基本対応（最上位）

| Policy Result | UXの基本挙動 | 管理UIの基本挙動 | ログ必須 |
| --- | --- | --- | --- |
| ALLOW | 通常表現。個別情報OK（同意前提）。 | 監視のみ。閾値でアラート。 | featureログ（必須） |
| DEGRADED | 付録Cテンプレのみ。粒度制限。子ども個別は原則省略。 | 理由可視化＋件数集計＋改善導線。 | featureログ＋reasonCodes（必須） |
| DENY | 出力しない/拒否。ただし沈黙禁止（説明カード/短文）。 | 即時対応対象。停止/訂正/同意導線。 | featureログ＋必要時audit（必須） |

---

### 6-0M1-1. 管理UIアラート対象 reasonCode 範囲（MVP固定）

管理UIのアラート表示対象は、付録Bの reasonCode のうち以下の接頭辞に固定する。

- RISK_*
- LLM_*
- SOURCE_*
- SYSTEM_*
- DELIVERY_FAILURE_*

上記以外は監視・集計のみとし、アラート行には載せない。

---

### 6-0M2. reasonCodeカテゴリ別：対応マトリクス

> category は付録Bの分類を正とする。

#### A) STOP（停止）

- 代表：GLOBAL_STOP_ACTIVE / FEATURE_DISABLED_* / HOUSEHOLD_STOP_NOTIFICATIONS

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 適用機能 | 通知/FAQ/シナリオ | 全画面（最優先表示） | 全ログ |
| 期待結果 | 原則DENY（説明は付録C） | “今止まっている”を最上部表示＋解除導線 | featureログ＋停止操作はaudit |
| 次アクション | 復旧待ち／設定確認 | STOP解除（権限＋理由必須） | 解除もaudit |

#### B) CONSENT（同意）

- 代表：CONSENT_MISSING_NOTIFY / CONSENT_MISSING_FAQ / CONSENT_VERSION_OUTDATED / CONSENT_CHILD_SCOPE_MISSING

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 期待結果 | scope不足→DENY／範囲不足→DEGRADED | 不足scope・同意version表示 | featureログ |
| 表現 | 付録C（同意系） | 不足scope一覧＋最短導線 | reasonCodes必須 |
| 次アクション | 同意更新導線 | 再同意フロー改善 | data_requests連携可 |

#### C) PLAN（プラン）

- 代表：PLAN_FEATURE_LOCKED / PLAN_STATUS_PAST_DUE / PLAN_STATUS_CANCELED

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 期待結果 | **原則DEGRADED（課金誘導禁止）** | 影響機能の明示＋復旧導線 | featureログ |
| 表現 | 付録C（プラン系） | subscriptions同期状態の可視化 | プラン変更介入はaudit |

#### D) RISK / SOURCE（リスク・根拠）

- 代表：RISK_TEMPLATE_HIGH / RISK_LLM_* / LLM_*_GUARD / SOURCE_* / RISK_SOURCE_*

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 期待結果 | 多くはDEGRADED（安全側に丸める） | 影響テンプレ/情報源の特定 | trace.templateId/sourceId |
| 表現 | 付録C（リスク系） | 高リスクを上位表示 | 修正はaudit必須 |

#### E) CONTEXT / SYSTEM / INCIDENT（運用・異常）

- 代表：CONTEXT_QUIET_HOURS_DELAYED / CONTEXT_PROVIDER_OUTAGE / DELIVERY_FAILURE_SPIKE / SYSTEM_ERROR / INCIDENT_UNDER_INVESTIGATION

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 期待結果 | quietHours→DEGRADED／障害→DENY or DEGRADED（fail-safe） | アラート＋停止導線＋incident連携 | incident_records必須（条件は7-2） |
| 表現 | 付録C（運用系） | 重大度で色分け | 操作時audit |

#### F) VENDOR（Vendorフロー）

- 代表：VENDOR_EXPOSURE / VENDOR_INQUIRY / VENDOR_FEEDBACK

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 期待結果 | 原則ALLOW（推奨/広告/成約誘導ではなく「橋渡し」） | 件数・偏りの可視化（判断はしない） | 既存ログの reasonCodes で追跡 |
| 表現 | “推奨/広告”に見えないUI構造（文言は別途定義しない） | 監査可能に可視化 | 監査/保存期間は7-3に従う |

- VENDOR_* は **追跡用reasonCodes** として保持する（vendor専用ログは作らない）。
- primaryReason は **VENDOR以外が存在する場合はそちらを採用**する（VENDORは最後）。
- Vendor Tier は `ops_configs.configKey=vendor_tiers` で管理する（systemのみ更新、audit必須）。

#### G) EXPERIENCE_SOURCE（体験情報源）

- 代表：EXPERIENCE_SOURCE_USED / EXPERIENCE_SOURCE_LOW_CONFIDENCE / EXPERIENCE_SOURCE_CONFLICT / EXPERIENCE_SOURCE_OUTDATED

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 期待結果 | **必ず「傾向・注意点」形式**で提示（断定禁止、個人名/人格禁止） | Experience Source Hub で source/fragment を確認・停止 | experience_usage_logs（利用追跡） |
| 表現 | 単独体験を「一般化」しない。複数フラグメント前提。 | commercialFlag/trustScore はUX非表示 | audit_logs と連動（停止/無効化） |

#### H) REVIEW_SOURCE（RAES: Review Aggregated Experience Source）

- 代表：REVIEW_SOURCE_USED / REVIEW_SOURCE_BIAS_SUSPECT / REVIEW_SOURCE_LOW_CONFIDENCE / REVIEW_SOURCE_OUTDATED / REVIEW_SOURCE_MEDICAL_CAUTION

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 期待結果 | 注意点・傾向・誤解されやすい点のみ提示（星評価/順位/人気/比較/おすすめ禁止、店名/医師名/会社名禁止） | Review Source Hub（RAES）で source/fragment を確認・停止 | review_usage_logs（利用追跡） |
| 表現 | 医療は必ず REVIEW_SOURCE_MEDICAL_CAUTION で縮退（公式/保険確認の観点提示） | entityNames/rawLinks はUX非表示 | audit_logs と連動（停止/無効化） |

#### I) INSIGHT（IRS: Insight Reaction Signal）

- 代表：INSIGHT_PRESENTED / INSIGHT_REACTION_CAPTURED / INSIGHT_CAUSED_FLOW_CHANGE

| 観点 | UX | 管理UI | ログ |
| --- | --- | --- | --- |
| 期待結果 | 反応の取得は **判断補助（安心・誤解防止）の改善**に限定 | **個票非表示**（集計・傾向のみ） | insight_reactions（イベント記録） |
| 表現 | Vendor評価/成約/満足度に接続しない | 「人がどこで不安になるか」のみ | 広告・送客・成約分析は禁止 |

---

### 6-0M3. 機能別：Result × UIコンポーネント対応

#### 通知（Notification）

| Result | LINE Push | カード | 管理UI |
| --- | --- | --- | --- |
| ALLOW | 送信 | 通常カード | 監視 |
| DEGRADED | 送信（短文化/粒度制限） | 概要カード（付録C） | reason別件数＋改善導線 |
| DENY | 送らない | 説明カード（付録C） | 即時対応（停止/同意/訂正） |

#### FAQ（LLM）

| Result | UX表示 | 返信 | 管理UI |
| --- | --- | --- | --- |
| ALLOW | 通常表示 | 通常回答 | 監査（サンプリング可） |
| DEGRADED | 制限表示 | 短く保守（付録C） | 集計＋改善導線 |
| DENY | 拒否表示（沈黙禁止） | 代替提示（付録C） | 即時対応 |

#### シナリオ（Scenario）

| Result | 配信 | カード | 管理UI |
| --- | --- | --- | --- |
| ALLOW | 継続 | 通常 | 進行率監視 |
| DEGRADED | 継続（短縮/省略可） | 概要（付録C） | ステップ別原因可視化 |
| DENY | 中断 | 説明（付録C） | 即時停止/再開/訂正導線 |

---

### 6-0M5. ログ必須マップ（監査の骨）

| イベント | 保存先 | 必須フィールド |
| --- | --- | --- |
| 通知判定 | notifications / notification_deliveries | result, primaryReason, reasonCodes, dedupeKey, runId, templateId |
| FAQ判定 | faq_logs | result, primaryReason, reasonCodes, model, requestId |
| シナリオ判定 | scenario_states | result, primaryReason, reasonCodes, scenarioId, stepId, runId |
| 停止操作 | audit_logs | actorId, actorType, action, target, diff, reason, runbookLabel |
| 訂正 | notification_deliveries + audit_logs | correctionId, correctedAt, correctionReason |

---

## 6-2X. 管理UIオペレーション対応表（SSOT）

本章は、Policy Engine の `policyDecision.primaryReason` を入力として、管理UI / 管理APIが返す `nextAction` を **決定的に生成**するための **唯一の正**である。

### 6-2X-0. 固定ルール（Non-Negotiable）

- 入力は `policyDecision.primaryReason`（単一）を正とする
- `primaryReason` が一致しない場合は、付録Bの category によるフォールバックを許可する（6-2Y-5）
- それでも一致しない場合：`nextAction.action = CREATE_INCIDENT`（fail-safe）
- `constraints.requiresRole` は `admin_users.roles`（viewer/editor/operator/admin）のみ使用可能

---

### 6-2X-1. マッピング表（MVP）

| rowId | primaryReason | default nextAction.action | runbookLabel | requiresRole | requiresReason | auditRequired | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| M6-2X-0001 | GLOBAL_STOP_ACTIVE | OPEN_AUDIT_LOG | [7-2-3] | operator | false | false | 停止理由・変更履歴確認 |
| M6-2X-0002 | FEATURE_DISABLED_NOTIFICATION | OPEN_AUDIT_LOG | [7-2-3] | operator | false | false | 機能停止の確認 |
| M6-2X-0003 | FEATURE_DISABLED_FAQ | OPEN_AUDIT_LOG | [7-2-3] | operator | false | false | 機能停止の確認 |
| M6-2X-0004 | FEATURE_DISABLED_SCENARIO | OPEN_AUDIT_LOG | [7-2-3] | operator | false | false | 機能停止の確認 |
| M6-2X-0005 | HOUSEHOLD_STOP_NOTIFICATIONS | OPEN_AUDIT_LOG | [7-1-2] | operator | false | false | 家庭停止の確認 |
| M6-2X-0006 | SYSTEM_ERROR | CREATE_INCIDENT | [7-2-1] | operator | true | true | fail-safe |
| M6-2X-0007 | INTERNAL_ERROR | CREATE_INCIDENT | [7-2-1] | operator | true | true | fail-safe |
| M6-2X-0008 | CONTEXT_SYSTEM_HEALTH_RED | CREATE_INCIDENT | [7-2-1] | operator | true | true | fail-safe |
| M6-2X-0009 | UNKNOWN_REASON | CREATE_INCIDENT | [7-2-1] | operator | true | true | fail-safe |
| M6-2X-0010 | DELIVERY_FAILURE | RETRY_DELIVERY | [7-2-2] | operator | true | true | 再送・影響確認 |
| M6-2X-0011 | DELIVERY_FAILURE_SPIKE | CREATE_INCIDENT | [7-2-1] | operator | true | true | 急増はincident優先 |
| M6-2X-0012 | INCIDENT_UNDER_INVESTIGATION | OPEN_INCIDENT | [7-2-1] | operator | false | false | 調査中表示 |
| M6-2X-0013 | CONSENT_MISSING_NOTIFY | TRIGGER_RECONSENT_FLOW | [7-1-2] | operator | false | false | 同意導線 |
| M6-2X-0014 | CONSENT_MISSING_FAQ | TRIGGER_RECONSENT_FLOW | [7-1-2] | operator | false | false | 同意導線 |
| M6-2X-0015 | CONSENT_VERSION_OUTDATED | TRIGGER_RECONSENT_FLOW | [7-1-2] | operator | false | false | 再同意 |
| M6-2X-0016 | CONSENT_SCOPE_LIMITED | OPEN_CONSENT_AUDIT | [7-1-2] | operator | false | false | 範囲確認 |
| M6-2X-0017 | CONSENT_CHILD_SCOPE_MISSING | TRIGGER_RECONSENT_FLOW | [7-1-2] | operator | false | false | 子スコープ |
| M6-2X-0018 | PLAN_STATUS_PAST_DUE | OPEN_BILLING_RECONCILIATION | [7-1-2] | operator | false | false | 請求確認 |
| M6-2X-0019 | PLAN_STATUS_CANCELED | OPEN_BILLING_RECONCILIATION | [7-1-2] | operator | false | false | 状態確認 |
| M6-2X-0020 | PLAN_FEATURE_LOCKED | NONE | [7-1-2] | viewer | false | false | 運用アクション不要 |
| M6-2X-0021 | PLAN_LIMITED_DEPTH | NONE | [7-1-2] | viewer | false | false | 運用アクション不要 |
| M6-2X-0022 | PLAN_RATE_LIMIT | NONE | [7-1-2] | viewer | false | false | 運用アクション不要 |
| M6-2X-0023 | RISK_TEMPLATE_HIGH | DISABLE_TEMPLATE | [7-1-2] | editor | true | true | テンプレ停止 |
| M6-2X-0024 | RISK_LLM_HIGH | FLAG_FAQ_FOR_REVIEW | [7-1-2] | operator | false | false | FAQ監査 |
| M6-2X-0025 | RISK_LLM_HALLUCINATION_SUSPECT | FLAG_FAQ_FOR_REVIEW | [7-1-2] | operator | false | false | FAQ監査 |
| M6-2X-0026 | LLM_MEDICAL_GUARD | FLAG_FAQ_FOR_REVIEW | [7-1-2] | operator | false | false | FAQ監査 |
| M6-2X-0027 | LLM_LEGAL_GUARD | FLAG_FAQ_FOR_REVIEW | [7-1-2] | operator | false | false | FAQ監査 |
| M6-2X-0028 | LLM_LOW_CONFIDENCE | FLAG_FAQ_FOR_REVIEW | [7-1-2] | operator | false | false | FAQ監査 |
| M6-2X-0029 | LLM_REFUSAL_TRIGGERED | CREATE_INCIDENT | [7-2-1] | operator | true | true | 拒否はincident化 |
| M6-2X-0030 | LLM_HIGH_RISK_QUERY | FLAG_FAQ_FOR_REVIEW | [7-1-2] | operator | false | false | FAQ監査 |
| M6-2X-0031 | SOURCE_UNVERIFIED | OPEN_SOURCE | [7-1-2] | editor | false | false | 情報源確認 |
| M6-2X-0032 | SOURCE_OUTDATED | OPEN_SOURCE | [7-1-2] | editor | false | false | 情報源確認 |
| M6-2X-0033 | SOURCE_CONFLICT | OPEN_SOURCE | [7-1-2] | editor | false | false | 情報源確認 |
| M6-2X-0034 | RISK_SOURCE_LOW_CONFIDENCE | OPEN_SOURCE | [7-1-2] | editor | false | false | 情報源確認 |
| M6-2X-0036 | CONTEXT_QUIET_HOURS_DELAYED | NONE | [7-1-2] | viewer | false | false | 運用アクション不要 |
| M6-2X-0037 | CONTEXT_RATE_LIMIT | NONE | [7-1-2] | viewer | false | false | 運用アクション不要 |
| M6-2X-0038 | CONTEXT_DEDUPE_SUPPRESSED | NONE | [7-1-2] | viewer | false | false | UX無表示 |
| M6-2X-0039 | CONTEXT_PROVIDER_OUTAGE | CREATE_INCIDENT | [7-2-1] | operator | true | true | 外部障害 |
| M6-2X-0040 | CONTEXT_RETRY_EXCEEDED | CREATE_INCIDENT | [7-2-1] | operator | true | true | 再送超過 |
| M6-2X-0041 | EVENT_TOO_SOON | NONE | [7-1-2] | viewer | false | false | 運用アクション不要 |
| M6-2X-0042 | TEMPLATE_DISABLED | OPEN_TEMPLATE_REVIEW | [7-1-2] | editor | false | false | テンプレ確認 |
| M6-2X-0043 | TEMPLATE_DEPRECATED | OPEN_TEMPLATE_REVIEW | [7-1-2] | editor | false | false | テンプレ確認 |
| M6-2X-0044 | DATA_REQUEST_OPEN | OPEN_DATA_REQUEST | [7-1-2] | operator | false | false | 権利請求 |
| M6-2X-0045 | HOUSEHOLD_DELETION_IN_PROGRESS | OPEN_DATA_REQUEST | [7-1-2] | operator | false | false | 削除対応 |
| M6-2X-0046 | VENDOR_EXPOSURE | NONE | [7-1-2] | viewer | false | false | Vendorフロー（追跡/監査） |
| M6-2X-0047 | VENDOR_INQUIRY | NONE | [7-1-2] | viewer | false | false | Vendorフロー（追跡/監査） |
| M6-2X-0048 | VENDOR_FEEDBACK | NONE | [7-1-2] | viewer | false | false | Vendorフロー（追跡/監査） |
| M6-2X-0049 | EXPERIENCE_SOURCE_USED | NONE | [7-1-2] | viewer | false | false | 体験情報の利用（追跡） |
| M6-2X-0050 | EXPERIENCE_SOURCE_LOW_CONFIDENCE | OPEN_SOURCE | [7-2-4] | editor | false | false | 体験情報源/フラグメント確認 |
| M6-2X-0051 | EXPERIENCE_SOURCE_CONFLICT | OPEN_SOURCE | [7-2-4] | editor | false | false | 体験情報源/フラグメント確認 |
| M6-2X-0052 | EXPERIENCE_SOURCE_OUTDATED | OPEN_SOURCE | [7-2-4] | editor | false | false | 体験情報源/フラグメント確認 |
| M6-2X-0053 | REVIEW_SOURCE_USED | NONE | [7-1-2] | viewer | false | false | RAESの利用（追跡） |
| M6-2X-0054 | REVIEW_SOURCE_BIAS_SUSPECT | OPEN_SOURCE | [7-2-5] | editor | false | false | RAESの偏り疑い（確認/停止） |
| M6-2X-0055 | REVIEW_SOURCE_LOW_CONFIDENCE | OPEN_SOURCE | [7-2-5] | editor | false | false | RAES根拠弱（確認/停止） |
| M6-2X-0056 | REVIEW_SOURCE_OUTDATED | OPEN_SOURCE | [7-2-5] | editor | false | false | RAES古い（確認/停止） |
| M6-2X-0057 | REVIEW_SOURCE_MEDICAL_CAUTION | OPEN_SOURCE | [7-2-5] | editor | false | false | 医療RAES（確認/停止） |
| M6-2X-0058 | INSIGHT_PRESENTED | NONE | [7-1-2] | viewer | false | false | IRS（提示） |
| M6-2X-0059 | INSIGHT_REACTION_CAPTURED | NONE | [7-1-2] | viewer | false | false | IRS（反応記録） |
| M6-2X-0060 | INSIGHT_CAUSED_FLOW_CHANGE | NONE | [7-1-2] | viewer | false | false | IRS（フロー変化） |
| M6-2X-0061 | PLAN_LIMIT_FREE | NONE | [7-1-2] | viewer | false | false | プラン制限（free） |
| M6-2X-0062 | PLAN_LIMIT_SOLO | NONE | [7-1-2] | viewer | false | false | プラン制限（solo） |
| M6-2X-0063 | PLAN_LIMIT_FAMILY | NONE | [7-1-2] | viewer | false | false | プラン制限（family） |
| M6-2X-0064 | RISK_POLICY_PROHIBITED | FLAG_FAQ_FOR_REVIEW | [7-1-2] | operator | false | false | ポリシー禁止（運用レビュー） |

---

## 6-2Y. UIラベル / API nextAction 焼き込み仕様

## 6-2Y-1. 用語とID体系（固定）

### RunbookLabel（UI表示ラベル）

- 形式：[7-1-x] / [7-2-x] / [7-3-x]
- 表示先：管理UIの**アラート・バッジ・ボタン・詳細パネル**
- 目的：運用担当が「読む→探す」を不要にし、**押すだけ**にする

### MappingRowId（内部の不変ID）

- 形式：M6-2X-0001 のような連番（推奨）
- UIラベルは変わる可能性があるが、RowIdは不変にする（将来の変更耐性）

### NextActionOperation（実行すべき操作）

- 形式：英大文字スネーク
- UIのボタン名・APIがやること・監査ログ action を統一

---

## 6-2Y-2. nextAction スキーマ（API共通）

### 返却必須ルール

- **管理UI系APIは全レスポンスで nextAction を返す**
  - 一覧でも、詳細でも、集計でも
- 次アクションが不要な場合も返す（action=NONE）

### JSON Schema（共通）

```
{
  "nextAction": {
    "action": "NONE",
    "runbook": "7-1-0",
    "uiLabel": "[7-1-0]",
    "severity": "low",
    "primaryReason": "CONTEXT_DEDUPE_SUPPRESSED",
    "reasonCodes": ["CONTEXT_DEDUPE_SUPPRESSED"],
    "targets": {
      "householdId": null,
      "templateId": null,
      "notificationId": null,
      "incidentId": null,
      "runId": null
    },
    "constraints": {
      "requiresRole": ["operator"],
      "requiresReason": true,
      "auditRequired": true,
      "cooldownSeconds": 0
    },
    "links": {
      "uiPath": "/admin/incidents/...",
      "api": "/admin/v1/..."
    }
  }
}
```

### フィールド定義（必須）

- action：必須。UIが押すボタンの意味（6-2Z enum）
- runbook：必須。7章の行番号（例：7-2-2）
- uiLabel：必須。UI表示用（例：[7-2-2]）
- severity：必須。UI色/並び替え用（low/medium/high）
- primaryReason：必須。単一（表示・集計安定のため）
- reasonCodes：必須。配列（多値保持）
- targets：必須。関連ID（null可）
- constraints：必須。実行制約（RBAC/監査/理由入力）
- links：推奨。UI遷移と実行APIへの導線

---

## 6-2Y-3. NextActionOperation enum（完全版・MVP）

### STOP/制御

- SET_GLOBAL_STOP_ON
- SET_GLOBAL_STOP_OFF
- SET_FEATURE_STOP_ON（notification/faq/scenario）
- SET_FEATURE_STOP_OFF
- SET_HOUSEHOLD_STOP_ON
- SET_HOUSEHOLD_STOP_OFF
- DISABLE_SOURCE

### テンプレ/リスク

- DISABLE_TEMPLATE
- PUBLISH_TEMPLATE
- ROLLBACK_TEMPLATE
- OPEN_TEMPLATE_REVIEW（編集画面へ）
- SET_TEMPLATE_RISK_LEVEL（low/med/high）

### 訂正/通知

- CREATE_CORRECTION_NOTIFICATION
- CANCEL_SCHEDULED_NOTIFICATION
- RETRY_DELIVERY（再送）
- OPEN_NOTIFICATION_DETAIL

### 同意/データ権利

- TRIGGER_RECONSENT_FLOW
- OPEN_CONSENT_AUDIT
- OPEN_AUDIT_LOG
- OPEN_DATA_REQUEST
- MARK_DATA_REQUEST_RESOLVED
- OPEN_BILLING_RECONCILIATION

### インシデント

- CREATE_INCIDENT
- LINK_TO_INCIDENT
- SET_INCIDENT_STATUS（open/resolved）
- ADD_INCIDENT_NOTE
- OPEN_INCIDENT

### FAQ/LLM

- OPEN_FAQ_DETAIL
- FLAG_FAQ_FOR_REVIEW
- UPDATE_PROMPT_POLICY（管理側ポリシー更新）
- DISABLE_LLM_FOR_HOUSEHOLD

### 何もしない（必須）

- NONE

---

## 6-2Y-4. UIラベル埋め込み規約（画面共通）

### 表示場所（必須）

1. ダッシュボードのアラート行：タイトル + [7-2-x]
2. 画面内の主要ボタン：ボタン文言 + [7-2-x]
3. 詳細パネルの“推奨アクション”：action名 + [7-2-x]
4. テーブルの行（reasonCode表示部）：reasonCode + [7-1-x]

### 表示の禁止

- UIラベルを隠す/折りたたむ
- 「内部用」扱いにする
- コピー不可にする

> UIラベルは“運用の背骨”。邪魔なら設計が負けてる。

---

## 6-2Y-5. 6-2X（完全対応表）→ nextAction 生成ルール

### 生成アルゴリズム（決定的）

入力：

- policyDecision.result
- policyDecision.primaryReason
- policyDecision.reasonCodes[]
- context（画面種別、対象ID）

処理：

1. 6-2X から primaryReason で一致行を検索
2. 一致なしならカテゴリ（STOP/INCIDENT/SYSTEM/RISK/REVIEW_SOURCE/EXPERIENCE_SOURCE/SOURCE/CONSENT/PLAN/CONTEXT/VENDOR）でフォールバック
3. それでも無ければ action=CREATE_INCIDENT とし runbook=7-2-1 に落とす（fail-safe）

出力：

- nextAction を必ず返す

### 優先順位

- STOP > INCIDENT > SYSTEM > RISK > REVIEW_SOURCE > EXPERIENCE_SOURCE > SOURCE > CONSENT > PLAN > CONTEXT > VENDOR

---

## 6-2Y-6. audit_logs 連動（必須）

nextActionで「操作」を伴うものは、**必ず audit_logs を生成**。

### audit action 命名規約

- SET_GLOBAL_STOP_ON → audit action="STOP_GLOBAL_ON"
- DISABLE_TEMPLATE → audit action="TEMPLATE_DISABLE"
- CREATE_CORRECTION_NOTIFICATION → audit action="NOTIFICATION_CORRECTION_CREATE"

### 強制項目

- actorType/adminId
- action
- target(kind/id)
- diff（最小）
- createdAt
- linkedRunbook（例：7-2-2）
- linkedUiLabel（例：[7-2-2]）
- reason（必須：constraints.requiresReason=true の場合）

---

## 6-2Y-7. 画面別の nextAction 表示ルール（MVP）

### 画面1 ダッシュボード

- アラート行ごとに nextAction を表示
- 1クリックで該当画面へ遷移（links.uiPath）

### 画面2 即時停止

- STOP系は常に nextAction が出る
- 解除/停止ボタンは requiresReason=true

### 画面3 テンプレ管理

- RISK_TEMPLATE_HIGH は DISABLE_TEMPLATE [7-2-3] を最優先表示
- publish/rollback は requiresRole=["admin"]

### 画面6 通知監査

- DELIVERY_FAILURE → RETRY_DELIVERY [7-2-2]
- DEGRADED → OPEN_TEMPLATE_REVIEW [7-1-2]（日次監査へ繋ぐ）

### 画面8 インシデント管理

- すべてのインシデントに runbook を紐付け表示
- close時は SET_INCIDENT_STATUS(resolved) + audit必須

---

## 結論

次フェーズの詳細仕様は **6-2Y**として、

- UIに [7-x-y] を**常時表示**
- APIに nextAction を**常時返却**
- 操作は audit_logs に **runbook/uiLabel付きで必ず記録**

これで「誰でも・いつでも・同じ動き」が成立する。

---

## 6-2Z. nextAction スキーマ（OpenAPI定義 / SSOT）

---

## 6-2Z-1. nextAction 概要

nextAction は、reasonCode 判定後に

管理UI / API クライアントが「次に取るべき操作」を

**解釈せずにそのまま実行するための機械定義**である。

- nextAction は **常に返却**（NONE を含む）
- UI / API は **解釈禁止**
- 実行可否は **constraints のみ**で制御する

---

## 6-2Z-2. OpenAPI Schema（nextAction）

```yaml
components:
  schemas:
    NextAction:
      type: object
      required:
        - action
        - severity
        - targets
        - constraints
        - links
      properties:
        action:
          $ref: "#/components/schemas/NextActionType"
        severity:
          type: string
          enum:
            - low
            - medium
            - high
            - critical
        targets:
          $ref: "#/components/schemas/NextActionTargets"
        constraints:
          $ref: "#/components/schemas/NextActionConstraints"
        links:
          $ref: "#/components/schemas/NextActionLinks"
```

---

## 6-2Z-3. action enum（完全拘束）

```yaml
components:
  schemas:
    NextActionType:
      type: string
      enum:
        - NONE
        - SET_GLOBAL_STOP_ON
        - SET_GLOBAL_STOP_OFF
        - SET_FEATURE_STOP_ON
        - SET_FEATURE_STOP_OFF
        - SET_HOUSEHOLD_STOP_OFF
        - CREATE_INCIDENT
        - OPEN_INCIDENT
        - RETRY_DELIVERY
        - DISABLE_TEMPLATE
        - OPEN_TEMPLATE_REVIEW
        - DISABLE_SOURCE
        - OPEN_SOURCE
        - FLAG_FAQ_FOR_REVIEW
        - UPDATE_PROMPT_POLICY
        - TRIGGER_RECONSENT_FLOW
        - OPEN_BILLING_RECONCILIATION
        - OPEN_AUDIT_LOG
        - OPEN_DATA_REQUEST
        - MARK_DATA_REQUEST_RESOLVED
```

---

## 6-2Z-4. targets 定義

```
components:
  schemas:
    NextActionTargets:
      type: object
      additionalProperties: false
      properties:
        householdId:
          type: string
        guardianId:
          type: string
        notificationId:
          type: string
        runId:
          type: string
        templateId:
          type: string
        sourceId:
          type: string
        scenarioId:
          type: string
        stepId:
          type: string
        faqId:
          type: string
        policyId:
          type: string
        auditId:
          type: string
        dataRequestId:
          type: string
        featureKey:
          type: string
```

---

## 6-2Z-5. constraints 定義

```yaml
components:
  schemas:
    NextActionConstraints:
      type: object
      required:
        - requiresRole
        - requiresReason
        - auditRequired
      properties:
        requiresRole:
          type: array
          items:
            type: string
        requiresReason:
          type: boolean
        auditRequired:
          type: boolean
```

---

## 6-2Z-6. links 定義

```yaml
components:
  schemas:
    NextActionLinks:
      type: object
      required:
        - uiPath
        - api
      properties:
        uiPath:
          type: string
        api:
          type: string
```

---

## 6-2Z-7. 強制ルール

- enum に存在しない action は **使用禁止**
- auditRequired = true の場合、**audit_logs 記録必須**
- requiresReason = true の場合、**理由なし実行禁止**
- 未定義 reasonCode は **DENY + CREATE_INCIDENT**

---

## 6-3. 管理UI API 共通仕様（SSOT）

管理UI API は「便利な裏口」ではなく、監査・権限・安全性・運用判断を強制する唯一の正面玄関である。

### 6-3-1. Base Path

- `/admin/v1/*`

### 6-3-3. RBAC（ロール）

ロール定義（SSOT）：

- viewer：読み取り専用
- editor：テンプレ/ポリシー編集
- operator：停止/再開/運用操作
- admin：全権限

---

---

## 6-4. 権限モデル（RBAC：運用拘束）

目的：管理UI/API の操作権限を固定し、誤操作・内部不正・責任不明を防ぐ。

前提（MUST）：

- RBACロールは **`viewer/editor/operator/admin` のみ**（別ロール追加禁止）。
- すべての管理APIは `nextAction.constraints.requiresRole` を持ち、**UI表示制御とAPI拒否の両方で強制**する（6-2Z/6-3）。
- 監査ログ（audit_logs）は **追記専用**。削除・改ざんは禁止（4章/7-3）。

権限マトリクス（MUST）：

| 操作 | 許可ロール（最小） | 監査（audit_logs） |
| --- | --- | --- |
| テンプレ作成/編集（下書き） | editor / admin | 必須 |
| テンプレ公開（公開状態の変更） | admin | 必須 |
| 即時停止（kill-switch ON） | operator / admin | 必須 |
| 即時停止解除（kill-switch OFF） | admin | 必須（運用上は二者承認推奨） |
| 監査ログ閲覧 | viewer / editor / operator / admin | 参照は記録不要（ただし運用上の閲覧ログは任意） |
| 監査ログ削除/改ざん | （禁止） | 禁止 |
| global_flags 変更 | admin | 必須 |

二者承認（SHOULD：運用手順）：

以下は誤爆リスクが高いため、運用手順（Runbook）として二者承認を推奨する（SSOTのロール追加はしない）。

- kill-switch 解除
- 大規模配信（閾値は運用で定義）
- 重大インシデントのクローズ（severity=high）

監査ログの必須項目（MUST）：

- `actorType` / `actorId`（誰が）
- `action`（何を）
- `target`（対象）
- `reason`（理由。`requiresReason=true` の場合は必須）
- `runbookLabel`（7章の見出し）
- 変更差分（diff：before/after、PII禁止）

## 7️⃣ 運用・監査・障害対応

## 7-1. 日次運用フロー

日次運用は「監視」ではない。  
**reasonCode を唯一の起点として再現可能に回す**ための運用である。

### 7-1-0. 前提思想（Non-Negotiable）

- 人は見落とす
- 人は慣れる
- 人は都合よく解釈する

### 7-1-2. 日次運用・統一チェックリスト（唯一の運用表）

| category | 代表 reasonCode（付録B） | 誰が確認 | 何を確認するか | どこを止めるか（即止め条件） |
| --- | --- | --- | --- | --- |
| STOP | GLOBAL_STOP_ACTIVE / HOUSEHOLD_STOP_NOTIFICATIONS | Ops責任者 | 停止理由・想定内か | 想定外停止 → 全体 or 該当機能 |
| CONSENT | CONSENT_MISSING_NOTIFY / CONSENT_MISSING_FAQ / CONSENT_VERSION_OUTDATED | Ops | 付録C文言・同意導線 | 誤DENY → 該当機能 |
| PLAN | PLAN_* | Ops | 表現に課金誘導が混ざっていないか | 課金誘導混入 → 該当機能 |
| RISK/SOURCE | RISK_TEMPLATE_HIGH / SOURCE_* / RISK_SOURCE_* | 管理者 | 情報源・テンプレ妥当性 | 誤情報疑い → テンプレ/ソース |
| EXPERIENCE_SOURCE | EXPERIENCE_SOURCE_* | 管理者 | 体験情報が断定/個人特定/送客に近づいていないか | 誤解・炎上兆候 → experience_sources/fragment 停止 |
| REVIEW_SOURCE | REVIEW_SOURCE_* | 管理者 | 星評価/順位/人気/比較/おすすめが混入していないか、固有名詞（店名/医師名/会社名）がUXに出ていないか | 医療/炎上/虚偽兆候 → review_sources/fragment 停止 |
| DATA/INSIGHT | INSIGHT_* | 管理者 | 示唆に対する反応が「不安増幅」や「送客/成約」へ誤接続していないか | 目的逸脱疑い → 集計停止/記録停止（ops_configs等） |
| SYSTEM/INCIDENT | SYSTEM_ERROR / DELIVERY_FAILURE_SPIKE / INCIDENT_UNDER_INVESTIGATION | Eng/Ops | 連続性・範囲 | 継続発生 → 全体 or 機能 |

---

## 7-2. 障害・誤通知対応フロー

障害対応とは「火消し」ではない。  
**被害を最小化し、説明可能な形で収束させ、再発を封じる行為**である。

### 7-2-1. インシデント作成（CREATE_INCIDENT）

発火条件（固定）：

- UNKNOWN_REASON
- SYSTEM_ERROR / INTERNAL_ERROR / CONTEXT_SYSTEM_HEALTH_RED
- DELIVERY_FAILURE_SPIKE
- LLM_REFUSAL_TRIGGERED（運用判断が必要な場合）

必須操作（固定）：

- `incident_records` を status=open で作成
- 必ず `audit_logs` に記録（runbookLabel=[7-2-1]）
- 必要に応じて global_flags / feature stop をON（停止操作もaudit必須）

---

### 7-2-2. 配送失敗（RETRY_DELIVERY）

対象：

- DELIVERY_FAILURE

必須操作（固定）：

- 影響範囲（runId / notificationId / householdId）を特定
- リトライは `dedupeKey` を前提に冪等で実行
- リトライ操作は必ず `audit_logs` に記録（runbookLabel=[7-2-2]）

### 7-2-3. 即時停止フェーズ（最優先）

- global_flags または feature stop を即時ON
- 停止理由を audit_logs に必ず記録
- incident_records を open として作成

---

### 7-2-4. 体験情報源の誤解・炎上・虚偽対応（Experience Source）

対象（例）：

- EXPERIENCE_SOURCE_LOW_CONFIDENCE / EXPERIENCE_SOURCE_CONFLICT / EXPERIENCE_SOURCE_OUTDATED
- 体験情報が断定表現・個人特定・送客に近づいた疑い

必須操作（固定）：

- 影響範囲（usage_logs / fragmentIds / householdId）を特定
- 必要に応じて `DISABLE_SOURCE`（experience_sources / experience_fragments を停止）
- 操作は必ず `audit_logs` に記録（runbookLabel=[7-2-4]）
- 重大な炎上/虚偽が疑われる場合は `incident_records` を作成（[7-2-1]）

---

### 7-2-5. RAES（Review Aggregated Experience Source）対応

対象（例）：

- REVIEW_SOURCE_BIAS_SUSPECT / REVIEW_SOURCE_LOW_CONFIDENCE / REVIEW_SOURCE_OUTDATED / REVIEW_SOURCE_MEDICAL_CAUTION
- 星評価/順位/人気/比較/おすすめが混入した疑い
- 店名/医師名/会社名がUXへ漏れた疑い

必須操作（固定）：

- 影響範囲（review_usage_logs / fragmentIds / householdId）を特定
- 必要に応じて `DISABLE_SOURCE`（review_sources / review_fragments を停止）
- 操作は必ず `audit_logs` に記録（runbookLabel=[7-2-5]）
- 医療領域で誤解が重大な場合は `incident_records` を作成（[7-2-1]）

## 7-3. 品質監査フロー（reasonCode観点）

ログは保険ではない。  
**運用判断を後から否定・検証・改善できる唯一の証拠**である。
詳細な設計資料は、FROZEN設計資料 `docs/ops/logs_preference_decision_db_spec.md` を参照。

### 7-3-3. 保存期間ポリシー（固定）

| ログ種別 | 保存期間 | 理由 |
| --- | --- | --- |
| audit_logs | 7年 | 説明責任・紛争 |
| notification_deliveries | 2年 | 誤通知訂正 |
| faq_logs | 1年 | 品質検証 |
| experience_usage_logs | 1年 | 体験情報の利用追跡・監査 |
| review_usage_logs | 1年 | RAESの利用追跡・監査 |
| insight_reactions | 1年 | 示唆（判断補助）への反応追跡・UX改善 |
| policyTrace | 1年 | 判断再現 |
| incident_records | 7年 | 事故履歴 |

---

## 8️⃣ 課金・契約・法務

## 8-1. 課金思想

課金は「収益化の仕組み」ではなく、  
**信頼と安全を壊さずに事業を成立させるための設計拘束**である。

### 8-1-4. 課金思想とPolicy Engineの関係（拘束）

- プラン不足による結果は **原則DEGRADED**
- **プラン単独でDENYを発生させてはならない**

---

## 8-4. プライバシー・データ権利

### 8-4-1. プライバシー・同意の基本原則（確定）

- 同意主体は常に保護者とする。子ども本人の同意のみで有効としない。
- 同意は目的・範囲・保存期間を明示した上で取得する。
- 同意の撤回は即時に反映し、以後の取得・利用を停止する。
- 子どもデータは特別保護対象とし、最小取得・最小保持に限定する。
- 同意履歴は監査可能な形で保存する。
- 同意の不存在・不明は利用禁止とする。

### 8-4-2. 行動ログの取得・利用範囲（確定）

- 取得対象は通知開封・FAQ閲覧・シナリオ遷移・設定操作に限定する。
- 利用目的はUX改善・品質向上のための集計とする。
- 個人追跡、子どもプロファイリング、行動の個別最適化は一切禁止する。
- ログは匿名化・集計した形でのみ評価に用いる。
- 同意撤回後は新規取得を停止し、既存ログは非利用扱いにする。

### 8-4-2A. 「マーケティング最適化」の定義と制限（確定）

- 本仕様の「マーケティング最適化」は、集計ベースでの表現改善に限定する。
- 許可される行為は、匿名集計の傾向を用いた全体最適化のみとする。
- 広告目的の個別最適化、行動に基づく個別誘導、評価スコアの提示は全面禁止とする。
- 第三者提供・共有・販売は原則禁止とする。
- 子どもデータを用いたマーケティング最適化は全面禁止とする。

### 8-4-2B. 外部API・AI（LLM）利用時の境界（確定）

- 外部APIは断定情報を生成しない。取得結果は要点整理と差分提示のみとする。
- Terms/Privacy URLが到達可能であることを利用の前提条件とする。到達不能は利用禁止とする。
- AI（LLM）は判断主体にならない。判断は常に人間が行う。
- 同意不明・URL不達・規約不明の場合は縮退し、公式リンク案内のみを表示する。
詳細な設計資料は、FROZEN設計資料 `docs/ops/logs_preference_decision_db_spec.md` を参照。

### 8-4-3. 削除権（Right to Erasure / Deletion）

削除方式（固定）：

| データ種別 | 処理 |
| --- | --- |
| children / guardians / households（レコード） | **論理削除（status=deleted）** |
| PIIフィールド（実名/連絡先/LINE userId 等） | **不可逆マスキング/消去（復元不能）** |
| ログ本文（FAQ/通知） | **マスキング済みのみ保持**（生入力禁止） |
| audit_logs | **保持（追記専用）**、必要に応じて不可逆匿名化 |

---

## 8-5. データ保持・破棄・匿名化原則（Retention & Anonymization）

目的：データガバナンスをSSOTで固定し、後から直せない設計負債（保持しすぎ/削除不能/監査不能）を防ぐ。
詳細な設計資料は、FROZEN設計資料 `docs/ops/logs_preference_decision_db_spec.md` を参照。

データ区分（MUST）：

- **Raw Data**：入力そのもの（ユーザー文、生の外部取得、添付等）
- **Operational Data**：運用に必要な状態・証跡（scenario_states、通知ログ、テンプレ状態、監査ログ 等）
- **Derived Insight**：編集済み知見（SSOT 1-4-3-A）。数値/割合/比較/セグメント/時系列/逆算可能を含まない。

保持原則（MUST）：

1. **Raw Data は最小化**：目的達成に不要なら保存しない。保存する場合は期間を定義し、マスキング後のみ保持する（7-3-3/1-4）。
2. **Operational Data は説明可能性のために保持**：監査・再現に必要な最小限を保持する（7章）。
3. **Derived Insight は匿名化前提**：再識別可能性がある形は生成/保存/外部提供すべて禁止（1-4-3-A、policy_lint対象）。
4. **削除要求に応答可能**：ユーザー/世帯単位で消去できる設計（8-4-3）を守る。

推奨保持期間（SHOULD：値の正は運用で確定しSSOTへ反映）：

- Raw Data：短期（例：30〜90日）
- Operational Data：中期（例：1〜2年）
- audit_logs / incident_records：長期（7-3-3を正）

匿名化要件（MUST）：

- 直接識別子（氏名、連絡先、外部ID等）を除去/不可逆マスキング
- 準識別子（地域・年齢帯・学校等）は少数セルを抑制し、逆算可能性が出ない粒度で扱う
- 外部共有・販売・第三者提供は SSOT の許可なく禁止（1-4-3）

実装接続（仕様）：

- **“Firestroeの新フィールド追加”ではなく**、SSOT 4章（データ辞書）の各コレクション定義に「区分（raw/operational/derived）」と「保持ポリシー参照（retentionPolicyId）」を **仕様メタとして付与**する。
- 破棄（削除/匿名化）は運用手順（7章）として実施し、実施記録は audit_logs に残す（追記専用）。

# 🔚 付録

## A. 用語集・ID命名規約

本付録は、Parenty 統合仕様書における **概念の揺れ・解釈差・実装事故を防ぐための唯一の共通定義集**である。

ここに記載された用語・ID規約は、**UX／管理UI／バックエンド／運用／法務**のすべてに **最優先で適用**される。

不整合が見つかった場合、**本付録を更新してから実装・運用を行うこと**。

---

## A-1. 用語集（Glossary）

### 基本概念

**Parenty**

海外在住の日本語話者家庭に対し、**家庭単位**で情報を整理・先回り提示する **LINEベースの家庭情報インフラ**。

**家庭（Household）**

Parentyにおける**最上位の契約・判断・停止単位**。

子ども・保護者・通知・同意・課金・停止はすべて家庭に紐づく。

**保護者（Guardian）**

契約主体かつ操作主体。

**子ども（Child）**

Parentyが扱う**最重要保護対象データ**。

---

**Derived Insight（編集済み知見）**：
Parenty 内データを直接外部提供せず、抽象化・一般化された再識別不能な知見。データ販売・共有には該当しないが、SSOT 1-4-3-A の制約に厳密に従う。

## A-2. ID命名規約（ID Naming Rules）

### 共通原則

- UUID v7 以上を推奨（時系列ソート可能）
- **意味を含めない**
- 外部公開・ログ流出を前提に**推測可能な情報を含めない**
- IDから **PIIを復元できてはならない**

---

## B. reasonCodes 完全一覧

本付録は、Parenty における **すべての reasonCode の唯一の正規定義**である。

各 reasonCode は **templateId を持つ**（UX表示が禁止のコードは `templateId=null` を許容し、UXには表示しない）。

- 参照先
  - **6-0** Policy Engine × UX × 管理UI
  - **6-2X** 管理UI → nextAction
  - **付録C** DEGRADED / DENY 文言テンプレ

---

### B-0. 設計ルール（再掲・拘束力あり）

- reasonCode は **削除禁止**（廃止は deprecated=true）
- 同義コードは禁止（alias は明示）
- templateId は **直書き文言ではなく参照キー**
- UX 表示は **templateId 経由のみ**
- 未登録 reasonCode は **UNKNOWN_REASON → インシデント化**

---

### B-1. STOP（停止系）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| GLOBAL_STOP_ACTIVE | STOP | DENY | tpl_deny_stop_global | 全体停止 |
| FEATURE_DISABLED_NOTIFICATION | STOP | DENY | tpl_deny_stop_feature | 機能停止 |
| FEATURE_DISABLED_FAQ | STOP | DENY | tpl_deny_stop_feature | 機能停止 |
| FEATURE_DISABLED_SCENARIO | STOP | DENY | tpl_deny_stop_feature | 機能停止 |
| HOUSEHOLD_STOP_NOTIFICATIONS | STOP | DENY | tpl_deny_stop_household_notifications | 家庭単位停止 |

---

### B-2. INCIDENT / SYSTEM（障害・異常）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| INCIDENT_UNDER_INVESTIGATION | INCIDENT | DEGRADED | tpl_deg_provider_outage | 調査中 |
| SYSTEM_ERROR | SYSTEM | DENY | tpl_deny_internal_error | システム異常 |
| INTERNAL_ERROR | SYSTEM | DENY | tpl_deny_internal_error | 内部例外 |
| CONTEXT_SYSTEM_HEALTH_RED | SYSTEM | DENY | tpl_deny_system_health_red | Health RED |
| DELIVERY_FAILURE | SYSTEM | DEGRADED | tpl_deg_retry_exceeded | 送信失敗 |
| DELIVERY_FAILURE_SPIKE | SYSTEM | DEGRADED | tpl_deg_retry_exceeded | 急増 |

---

### B-3. CONSENT（同意）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| CONSENT_MISSING_NOTIFY | CONSENT | DENY | tpl_deny_consent_missing_notify | 通知 |
| CONSENT_MISSING_FAQ | CONSENT | DENY | tpl_deny_consent_missing_faq | FAQ |
| CONSENT_SCOPE_LIMITED | CONSENT | DEGRADED | tpl_deg_consent_scope_limited | 範囲不足 |
| CONSENT_VERSION_OUTDATED | CONSENT | DEGRADED | tpl_deg_consent_outdated | 版不一致 |
| CONSENT_CHILD_SCOPE_MISSING | CONSENT | DENY | tpl_deny_consent_child_scope_missing | 子起点 |

---

### B-4. PLAN（プラン）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| PLAN_LIMIT_FREE | PLAN | DEGRADED | tpl_deg_plan_feature_locked | 機能制限 |
| PLAN_LIMIT_SOLO | PLAN | DEGRADED | tpl_deg_plan_feature_locked | 機能制限 |
| PLAN_LIMIT_FAMILY | PLAN | DEGRADED | tpl_deg_plan_feature_locked | 機能制限 |
| PLAN_FEATURE_LOCKED | PLAN | DEGRADED | tpl_deg_plan_feature_locked | ロック |
| PLAN_LIMITED_DEPTH | PLAN | DEGRADED | tpl_deg_plan_limited_depth | 詳細省略 |
| PLAN_RATE_LIMIT | PLAN | DEGRADED | tpl_deg_plan_rate_limited | 頻度/負荷制限 |
| PLAN_STATUS_PAST_DUE | PLAN | DEGRADED | tpl_deg_plan_past_due | 未払い |
| PLAN_STATUS_CANCELED | PLAN | DEGRADED | tpl_deg_plan_canceled | 解約 |

---

### B-5. RISK（内容・根拠）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| RISK_TEMPLATE_HIGH | RISK | DEGRADED | tpl_deg_risk_template_high | 高リスク |
| RISK_LLM_HIGH | RISK | DEGRADED | tpl_deg_llm_high_risk | LLM高 |
| RISK_LLM_HALLUCINATION_SUSPECT | RISK | DEGRADED | tpl_deg_llm_hallucination_suspect | 幻覚疑 |
| RISK_POLICY_PROHIBITED | RISK | DEGRADED | tpl_deg_risk_policy_prohibited | ポリシー上、具体案内が禁止 |
| LLM_MEDICAL_GUARD | RISK | DEGRADED | tpl_deg_llm_medical_guard | 医療 |
| LLM_LEGAL_GUARD | RISK | DEGRADED | tpl_deg_llm_legal_guard | 法務 |
| LLM_LOW_CONFIDENCE | RISK | DEGRADED | tpl_deg_llm_hallucination_suspect | 低確度 |
| LLM_REFUSAL_TRIGGERED | RISK | DENY | tpl_deny_unknown_reason | 拒否 |
| LLM_HIGH_RISK_QUERY | RISK | DEGRADED | tpl_deg_llm_high_risk | 高危 |

---

### B-6. SOURCE（情報源）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| SOURCE_UNVERIFIED | SOURCE | DEGRADED | tpl_deg_risk_source_low_conf | 未検証 |
| SOURCE_OUTDATED | SOURCE | DEGRADED | tpl_deg_risk_source_stale | 古い |
| SOURCE_CONFLICT | SOURCE | DEGRADED | tpl_deg_risk_source_low_conf | 競合 |
| RISK_SOURCE_LOW_CONFIDENCE | SOURCE | DEGRADED | tpl_deg_risk_source_low_conf | 低信頼 |

---

### B-6A. EXPERIENCE_SOURCE（体験情報源）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| EXPERIENCE_SOURCE_USED | EXPERIENCE_SOURCE | ALLOW | null | 体験情報源を素材として利用（UXに個人名/人格を出さない） |
| EXPERIENCE_SOURCE_LOW_CONFIDENCE | EXPERIENCE_SOURCE | DEGRADED | tpl_deg_risk_source_low_conf | 根拠が弱い/単独体験の可能性（断定禁止） |
| EXPERIENCE_SOURCE_CONFLICT | EXPERIENCE_SOURCE | DEGRADED | tpl_deg_risk_source_low_conf | 体験同士/公式情報と矛盾（断定禁止） |
| EXPERIENCE_SOURCE_OUTDATED | EXPERIENCE_SOURCE | DEGRADED | tpl_deg_risk_source_stale | 古い体験（現状不一致の可能性） |

---

### B-6B. REVIEW_SOURCE（RAES: Review Aggregated Experience Source）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| REVIEW_SOURCE_USED | REVIEW_SOURCE | ALLOW | null | RAESを素材として利用（店名/医師名/会社名、星評価/順位/人気はUX非表示） |
| REVIEW_SOURCE_BIAS_SUSPECT | REVIEW_SOURCE | DEGRADED | tpl_deg_risk_source_low_conf | 偏り/宣伝的表現が疑われる（**運用トリガは commercialFlag のみ**。断定・比較・おすすめ禁止） |
| REVIEW_SOURCE_LOW_CONFIDENCE | REVIEW_SOURCE | DEGRADED | tpl_deg_risk_source_low_conf | 根拠が弱い/単独レビューの可能性（断定禁止） |
| REVIEW_SOURCE_OUTDATED | REVIEW_SOURCE | DEGRADED | tpl_deg_risk_source_stale | 古いレビュー（現状不一致の可能性） |
| REVIEW_SOURCE_MEDICAL_CAUTION | REVIEW_SOURCE | DEGRADED | tpl_deg_review_medical_caution | 医療領域（医師名非表示、公式/保険確認の観点提示） |

---

### B-7. CONTEXT（運用文脈）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| CONTEXT_QUIET_HOURS_DELAYED | CONTEXT | DEGRADED | tpl_deg_quiet_hours | 静穏 |
| CONTEXT_RATE_LIMIT | CONTEXT | DEGRADED | tpl_deg_rate_limit | 制限 |
| CONTEXT_DEDUPE_SUPPRESSED | CONTEXT | ALLOW | null | 黙抑止（UX無表示） |
| CONTEXT_PROVIDER_OUTAGE | CONTEXT | DEGRADED | tpl_deg_provider_outage | 外部障害 |
| CONTEXT_RETRY_EXCEEDED | CONTEXT | DENY | tpl_deny_internal_error | 再送超過 |
| EVENT_TOO_SOON | CONTEXT | DEGRADED | tpl_deg_quiet_hours | 早期 |

---

### B-8. TEMPLATE / DATA（運用）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| TEMPLATE_DISABLED | TEMPLATE | DENY | tpl_deny_stop_feature | 無効 |
| TEMPLATE_DEPRECATED | TEMPLATE | ALLOW | null | 廃止予定（UX無表示） |
| DATA_REQUEST_OPEN | DATA | ALLOW | null | 権利（UX無表示） |
| HOUSEHOLD_DELETION_IN_PROGRESS | DATA | DEGRADED | tpl_deg_provider_outage | 削除中 |

---

### B-8A. VENDOR（Vendorフロー）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| VENDOR_EXPOSURE | VENDOR | ALLOW | null | 掲載/比較（追跡用。UXにcode/文言は出さない） |
| VENDOR_INQUIRY | VENDOR | ALLOW | null | 問い合わせ（追跡用。UXにcode/文言は出さない） |
| VENDOR_FEEDBACK | VENDOR | ALLOW | null | 選択傾向分析（追跡用。UXにcode/文言は出さない） |

---

### B-8B. INSIGHT（IRS: Insight Reaction Signal / 内部用）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| INSIGHT_PRESENTED | INSIGHT | ALLOW | null | 示唆（注意喚起/判断補助）を提示した（内部記録。UXにcode/文言は出さない） |
| INSIGHT_REACTION_CAPTURED | INSIGHT | ALLOW | null | 反応を記録した（内部記録。広告/送客/成約分析は禁止） |
| INSIGHT_CAUSED_FLOW_CHANGE | INSIGHT | ALLOW | null | 示唆によりフローが変化した（内部記録。個票追跡は禁止） |

---

### B-9. CATCHALL（フェイルセーフ）

| reasonCode | category | defaultResult | templateId | 備考 |
| --- | --- | --- | --- | --- |
| UNKNOWN_REASON | CATCHALL | DENY | tpl_deny_unknown_reason | 即インシデント |

---

### B-10. 最終チェック（合格条件）

- すべての reasonCode に **templateId が存在**
- 付録Cに **未定義 templateId なし**
- 6-2X の primaryReason と **完全一致**
- ALLOW / DEGRADED / DENY の既定が **6-0 と一致**

---

## C. DEGRADED 文言テンプレ

本付録に記載された文言のみが、**DEGRADED / DENY 時にUXへ表示可能**である。

**個別の即興生成は禁止。**（実装AI・人間運用ともに同じ拘束）

---

### C-0. 使い方（固定ルール）

- **表示は templateId で選ぶ**（文言の手打ち禁止）
- **DEGRADED**：原則「案内はするが粒度を落とす」
- **DENY**：原則「沈黙禁止」＝短文＋次アクション（可能なら）
- 変数は {} スロットのみ使用可（例：{featureName}）
- **課金誘導の文言禁止**（PLAN系は“制限の事実”のみ）

---

### C-1. テンプレ一覧（完全）

> 形式：templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション（任意）

#### C-1A. STOP（停止）

| templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション |
| --- | --- | --- | --- | --- |
| tpl_deg_stop_global | DEGRADED | GLOBAL_STOP_ACTIVE | 現在、安全確認のため一部機能を制限しています。 | 復旧後にお届けします。 |
| tpl_deny_stop_global | DENY | GLOBAL_STOP_ACTIVE | 現在、機能を一時停止しています。 | 復旧後にお届けします。 |
| tpl_deny_stop_feature | DENY | FEATURE_DISABLED_* | 現在、この機能は一時停止しています。 | 復旧後にお届けします。 |
| tpl_deny_stop_household_notifications | DENY | HOUSEHOLD_STOP_NOTIFICATIONS | この家庭では通知が停止されています。 | 設定から再開できます。 |

#### C-1B. CONSENT（同意）

| templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション |
| --- | --- | --- | --- | --- |
| tpl_deny_consent_missing_notify | DENY | CONSENT_MISSING_NOTIFY | 通知を受け取る設定が未完了です。 | 設定を更新すると有効になります。 |
| tpl_deny_consent_missing_faq | DENY | CONSENT_MISSING_FAQ | この内容は設定が未完了のため回答できません。 | 設定を更新すると有効になります。 |
| tpl_deg_consent_scope_limited | DEGRADED | CONSENT_SCOPE_LIMITED | 登録内容の一部に制限がかかっています。 | 必要なら設定を更新してください。 |
| tpl_deg_consent_outdated | DEGRADED | CONSENT_VERSION_OUTDATED | 設定の更新が必要です。 | 更新後に通常どおり利用できます。 |
| tpl_deny_consent_child_scope_missing | DENY | CONSENT_CHILD_SCOPE_MISSING | 子どもに関する案内は設定が未完了のため制限されています。 | 設定を更新してください。 |

#### C-1C. PLAN（プラン）

| templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション |
| --- | --- | --- | --- | --- |
| tpl_deg_plan_feature_locked | DEGRADED | PLAN_FEATURE_LOCKED | 現在のプランでは内容を簡略化しています。 | 必要なら設定を確認してください。 |
| tpl_deg_plan_limited_depth | DEGRADED | PLAN_LIMITED_DEPTH | 現在のプランでは詳細を省略しています。 | — |
| tpl_deg_plan_rate_limited | DEGRADED | PLAN_RATE_LIMIT | 一時的に利用が集中しています。 | 少し時間をおいて再度お試しください。 |
| tpl_deg_plan_past_due | DEGRADED | PLAN_STATUS_PAST_DUE | 現在、一部の機能が制限されています。 | 状態を確認してください。 |
| tpl_deg_plan_canceled | DEGRADED | PLAN_STATUS_CANCELED | 現在、一部の機能が制限されています。 | 状態を確認してください。 |

#### C-1D. RISK（リスク／根拠不足）

| templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション |
| --- | --- | --- | --- | --- |
| tpl_deg_risk_template_high | DEGRADED | RISK_TEMPLATE_HIGH | 安全のため、ここでは一般的な目安のみご案内します。 | 公式情報もあわせて確認してください。 |
| tpl_deg_risk_source_low_conf | DEGRADED | RISK_SOURCE_LOW_CONFIDENCE | 確実な根拠が確認できないため、断定を避けてご案内します。 | 公式情報を確認してください。 |
| tpl_deg_risk_source_stale | DEGRADED | RISK_SOURCE_STALE | 情報の鮮度が十分でないため、一般的な案内にとどめます。 | 公式情報を確認してください。 |
| tpl_deg_risk_policy_prohibited | DEGRADED | RISK_POLICY_PROHIBITED | この内容は安全上の理由で具体的に案内できません。 | 代替の確認方法をご案内します。 |

#### C-1E. LLM GUARD（専門領域ガード）

| templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション |
| --- | --- | --- | --- | --- |
| tpl_deg_llm_medical_guard | DEGRADED | LLM_MEDICAL_GUARD | 医療の判断はここではできません。一般的な情報のみご案内します。 | 必要なら医療専門家へ相談してください。 |
| tpl_deg_llm_legal_guard | DEGRADED | LLM_LEGAL_GUARD | 法務の判断はここではできません。一般的な情報のみご案内します。 | 必要なら専門家へ相談してください。 |
| tpl_deg_llm_high_risk | DEGRADED | RISK_LLM_HIGH | 安全のため、断定を避けて一般論のみでご案内します。 | 公式情報を確認してください。 |
| tpl_deg_llm_hallucination_suspect | DEGRADED | RISK_LLM_HALLUCINATION_SUSPECT | 確認できない点があるため、断定を避けてご案内します。 | 公式情報を確認してください。 |

#### C-1E-2. REVIEW_SOURCE（RAES）

| templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション |
| --- | --- | --- | --- | --- |
| tpl_deg_review_medical_caution | DEGRADED | REVIEW_SOURCE_MEDICAL_CAUTION | 医療に関する判断はここではできません。体験情報は断定せず、注意点のみを整理してご案内します。 | 公式情報と保険の適用範囲を確認してください。 |

#### C-1F. CONTEXT / OPS（時間帯・障害・運用）

| templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション |
| --- | --- | --- | --- | --- |
| tpl_deg_quiet_hours | DEGRADED | CONTEXT_QUIET_HOURS_DELAYED | 今は通知を控える時間帯です。 | 後でまとめてお届けします。 |
| tpl_deg_rate_limit | DEGRADED | PLAN_RATE_LIMIT / CONTEXT_RATE_LIMIT | 利用が集中しています。 | 少し時間をおいて再度お試しください。 |
| tpl_deg_provider_outage | DEGRADED | CONTEXT_PROVIDER_OUTAGE | 現在、一部機能が不安定です。 | 復旧後にお届けします。 |
| tpl_deny_system_health_red | DENY | CONTEXT_SYSTEM_HEALTH_RED | 現在、一時的に利用を制限しています。 | 復旧後にお届けします。 |
| tpl_deny_internal_error | DENY | INTERNAL_ERROR | 現在、処理を完了できませんでした。 | 時間をおいて再度お試しください。 |
| tpl_deg_retry_exceeded | DEGRADED | CONTEXT_RETRY_EXCEEDED | 現在、送信を完了できませんでした。 | 復旧後にお届けします。 |

#### C-1G. DENY共通（最終フォールバック）

| templateId | state | 対応primaryReason（代表） | 表示文言（最短・中立） | 次アクション |
| --- | --- | --- | --- | --- |
| tpl_deny_unknown_reason | DENY | UNKNOWN_REASON | 現在、この操作を完了できません。 | 時間をおいて再度お試しください。 |

---

### C-2. 実装拘束（再掲）

- DEGRADED / DENY は **必ず templateId をログに残す**（policyDecision.templateId）
- UXに表示する文言は **templateId → 文言の参照**のみ
- 迷ったら tpl_deny_unknown_reason（沈黙禁止）

---

## D. Cursor / 実装AI向け参照ガイド

本付録は、**CEO / GPT(CTO) / Cursor(Engineer)** の3者で、仕様違反と実装事故を最小化しながら v1 Safety First MVP をローンチするための、実装AI向け強制ルールである。

---

### D-0. 参照優先順位（固定）

実装判断に迷った場合の参照順序は固定：

1. **付録B**：reasonCodes 完全一覧（code/category/defaultResult/templateId）
2. **付録C**：DEGRADED / DENY 文言テンプレ（templateId→表示文言）
3. **6-0**：Policy Engine × UX × 管理UI マトリクス
4. **6-2X / 6-2Y / 6-2Z**：nextAction（運用導線とOpenAPI拘束）
5. **4-2 / 4-4**：Firestore辞書 / Security Rules（R/W・PII）
6. **7章**：運用・監査・障害対応（runbookLabel）

---

### D-1. 実装AIの鉄則（Top 12）

- **[SSOT]** 仕様に無い enum / フィールド / reasonCode / nextAction.action を増やさない
- **[POLICY]** すべての出力（通知/FAQ/シナリオ/カード）は必ず Policy Engine を通す（例外を作らない）
- **[RESULT]** `policyDecision.result` は 3値固定（ALLOW/DEGRADED/DENY）。4値目禁止
- **[REASON]** `policyDecision.reasonCodes[]` は min1、`primaryReason` は必須で配列内に含める
- **[TEMPLATE]** DEGRADED/DENY のUX表示文言は `policyDecision.templateId` → 付録C参照のみ（直書き禁止）
- **[FAILSAFE]** 未定義 reasonCode は `UNKNOWN_REASON` に正規化し、DENY + CREATE_INCIDENT へ倒す
- **[AUDIT]** 重要操作は必ず `audit_logs`（append-only）。更新/削除は禁止
- **[PII]** FAQログ/通知ログに生の個人情報を保存しない（必ずマスキング後のみ）
- **[STOP]** global_flags / households.flags の STOP は最優先で評価し、送信経路の裏口を作らない
- **[ROLE]** RBACは `viewer/editor/operator/admin` のみ。別ロール追加禁止
- **[NEXTACTION]** `nextAction.action` は 6-2Z enum 以外禁止。実行は constraints を強制
- **[ONESHOT]** 送信口は1つ（sendLine等）。二重送信防止（dedupeKey）を必須化

---

### D-2. コードに埋め込むコメント指針（そのままコピペ用）

```txt
// [SSOT] follow PARENTY_SSOT.md (no local rules)
// [POLICY] must call Policy Engine (no shortcut)
// [RESULT] result must be ALLOW|DEGRADED|DENY (no extra states)
// [REASON] always attach primaryReason + reasonCodes[] (min 1)
// [TEMPLATE] DEGRADED/DENY UX must use templateId -> Appendix C only
// [FAILSAFE] unknown reason -> UNKNOWN_REASON + DENY + nextAction.action=CREATE_INCIDENT
// [AUDIT] admin ops must write audit_logs (append-only)
// [PII] never store raw PII in logs (mask before persist)
```

---

### D-3. チケット分割テンプレ（Cursor効率最大化）

原則：**1チケット=1経路**（例：Policy判定→ログ→UX表示までを1本で閉じる）

#### D-3A. チケット本文テンプレ

```
Title:
Goal:
Scope (in/out):

SSOT references (must):
- PARENTY_SSOT.md: (relevant sections)

Implementation notes:
- Data: collections/fields
- Policy: inputs -> outputs (reasonCodes/templateId/nextAction)
- Delivery: dedupeKey/traceId

Acceptance criteria (must):
- PolicyDecision persisted (result/primaryReason/reasonCodes/templateId/nextAction)
- Logs written (notifications/faq_logs/scenario_states + audit_logs if admin op)
- DEGRADED/DENY UX uses Appendix C templateId mapping only
- Fail-safe: unknown reason -> UNKNOWN_REASON + CREATE_INCIDENT
```

---

### D-4. 受入基準（v1 Safety First MVP）

v1で「完成」と言う条件（最小）：

- **Policy Engine**：ALLOW/DEGRADED/DENY + reasonCodes + primaryReason + templateId + nextAction が一貫
- **ログ/監査**：送信/拒否/縮退の全件ログ（audit_logsは追記専用）
- **停止**：global_flags / households.flags による即時停止が全経路で効く
- **文言**：DEGRADED/DENY は付録Cのみ（直書き禁止）
- **運用導線**：管理UIは 6-2X/6-2Y/6-2Z の nextAction で動ける

---

### D-5. 仕様変更フロー（CEO/GPT/Engineer）

- **仕様変更は必ず `E. 変更履歴` に追記 → その後に実装**
- 仕様変更PRには必ず「影響範囲（Policy/UX/Admin/Data/Runbook）」を明記
- 実装PRには必ず「参照したSSOT節」を貼る（リンク/章番号）

---

## F. External API 活用仕様（共通原則 + API台帳）

本付録は、外部API（第三者提供のAPI/データポータル）を Parenty が利用する際の **共通原則**と、各APIの **台帳（API Registry）**をSSOTとして固定する。

### F-0. Non-Negotiable（最優先）

- SSOT 1-3/1-4（Non-Negotiable/禁止事項）を一切緩めない
- **規約・仕様が公式URLで確認できないAPIは、実装/運用に取り込まない**
  - 公式URL未確定の間は **実行DENY（RISK_POLICY_PROHIBITED）** または **縮退（CONTEXT_PROVIDER_OUTAGE 等）**で止める
- 子どもPII・家庭PIIを **外部APIへ送らない**（必要がある場合は SSOT 変更 + 承認が必須）
- UXは **推奨/広告/ランキング**を行わない（Vendor/Reviewソースは特に厳守）

### F-1. 情報源の位置づけ（分類）

外部APIの情報源は、SSOTの情報源管理（`sources`）において `kind=external_api` として管理し、同時に以下の分類を台帳に持つ。

- **Official**: 公的機関/一次情報の公式API・公式データポータル
- **Quasi-Official**: 公的機関が委託/提供するが一次ではないもの（※該当判定は公式根拠が必要）
- **Reference**: 商業・レビュー・地図等（SSOTの禁止事項と衝突しやすいため、台帳で利用制限を明文化）

※分類の確定は **必ず公式根拠URL**をもって行う。根拠が無い分類は TODO。

### F-2. UXでの扱い（断定禁止/縮退条件）

- 外部APIの取得結果は、SSOT 3章（Policy Engine）と 付録C（DEGRADED/DENYテンプレ）に従って表示する
- **単一ソースの断定禁止**（特に医療/法務/教育）
- API障害/不確実性/規約制約がある場合は、以下のreasonCodeに正規化して縮退する（F-4参照）

### F-3. キャッシュ・保存・再利用（原則）

- **原則: 生レスポンスの永続保存は禁止（SSOT優先）**
- 保存が必要な場合は、以下を満たす必要がある（満たせない場合はDENY）：
  - SSOTのPII制約（子どもPII最優先保護、ログのマスキング、再現性）
  - API規約（ToS/ポリシー/再配布/キャッシュ制限）
  - 監査（policyDecision/policyTrace、audit_logs）
- “Derived Insight”との関係：
  - 外部提供・販売・再配布は SSOT 1-4-3 を維持
  - 編集済み知見（SSOT 1-4-3-A）は **数値/割合/セグメント/時系列/逆算可能**を含まない（既存Lint対象）

### F-4. Policy Engine / reasonCode との接続（API起因の正規化マップ）

外部API起因の事象は、新規reasonCodeを増やさず、まず既存reasonCodeへ正規化する（SSOT 付録B/6-2Xの接続を壊さないため）。

| API事象 | 正規化reasonCode（SSOT付録B） | result（既定） | templateId（付録C） | nextAction（6-2X） |
| --- | --- | --- | --- | --- |
| ToS/表示要件がSSOTと衝突（例：ランキング必須等） | RISK_POLICY_PROHIBITED | DEGRADED | tpl_deg_risk_policy_prohibited | FLAG_FAQ_FOR_REVIEW |
| 外部APIの障害/到達不能 | CONTEXT_PROVIDER_OUTAGE | DEGRADED | tpl_deg_provider_outage | CREATE_INCIDENT |
| 外部APIのレート/クォータ制限 | CONTEXT_RATE_LIMIT | DEGRADED | tpl_deg_rate_limit | NONE |
| 情報源が未検証（根拠URL未登録等） | SOURCE_UNVERIFIED | DEGRADED | tpl_deg_risk_source_low_conf | OPEN_SOURCE |
| 情報源が古い（鮮度切れ） | SOURCE_OUTDATED | DEGRADED | tpl_deg_risk_source_stale | OPEN_SOURCE |

### F-5. API台帳（API Registry / SSOT配下）

#### 必須フィールド（固定）

各APIは以下の項目を **必ず**持つ。未確定は TODO とし、確定まで実装/運用に取り込まない。

- apiId
- category（地図 / レビュー / 医療 / 災害 / 天気 / 教育 / 住所 等）
- officialDocsUrl（TODO可、ただし未確定は実装禁止）
- termsOfServiceUrl（TODO可、ただし未確定は実装禁止）
- policyUrl（表示・キャッシュ・再配布等。TODO可、ただし未確定は実装禁止）
- authMethod（TODO可）
- rateLimit（公式値URL + 運用想定（TODO可））
- dataRetentionRule（SSOT優先 + ToS根拠URLが必須。未確定は TODO）
- attributionRequired（根拠URL必須。未確定は TODO）
- allowedUse / prohibitedUse（SSOTの禁止事項 + ToS根拠。未確定は TODO）
- monitoringTargets（規約/仕様/価格URL。未確定は TODO）
- failureMode（F-4の正規化マップ）
- relatedReasonCodes（付録B）
- relatedTemplateIds（付録C）

#### 台帳（実装前提：URL未確定はTODO）

| apiId | category | officialDocsUrl | termsOfServiceUrl | policyUrl | authMethod | rateLimit | dataRetentionRule | attributionRequired | monitoringTargets |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| google_maps_platform | 地図 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/価格/仕様URL) |
| yelp_fusion | レビュー | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/価格/仕様URL) |
| eventbrite | イベント | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/価格/仕様URL) |
| zocdoc | 医療 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/価格/仕様URL) |
| openweathermap | 天気 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/価格/仕様URL) |
| fema_openfema | 災害 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/仕様URL) |
| noaa_nws | 天気/警報 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/仕様URL) |
| usgs | 地質/災害 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/仕様URL) |
| usps_address_api | 住所 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/仕様URL) |
| cdc | 医療/統計 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/仕様URL) |
| nyc_doe_portal | 教育 | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式) | TODO(公式根拠+SSOT優先) | TODO(公式根拠) | TODO(規約/仕様URL) |
| state_edu_portal | 教育 | TODO(州別に公式) | TODO(州別に公式) | TODO(州別に公式) | TODO(州別) | TODO(州別) | TODO(州別根拠+SSOT優先) | TODO(州別根拠) | TODO(州別規約/仕様URL) |

#### 共通（関連reasonCode / templateId）

- relatedReasonCodes（固定）:
  - RISK_POLICY_PROHIBITED / CONTEXT_PROVIDER_OUTAGE / CONTEXT_RATE_LIMIT / SOURCE_UNVERIFIED / SOURCE_OUTDATED
- relatedTemplateIds（固定）:
  - tpl_deg_risk_policy_prohibited / tpl_deg_provider_outage / tpl_deg_rate_limit / tpl_deg_risk_source_low_conf / tpl_deg_risk_source_stale

### F-6. 規約・仕様・価格変更の監視（運用設計 / 固定）

目的：外部APIの規約/仕様/価格の変更を **早期に検知**し、SSOT逸脱・法務違反・UX破綻を未然に止める。

#### 監視対象（固定）

- 監視対象URLは **F-5 の `monitoringTargets`** に集約する（SSOTの単一真実点）
- 派生台帳として `APIRegistry_External.md` は **URL一覧の参照導線**を提供してよい（SSOT優先）

#### 監視頻度（固定）

- **週次**（7日に1回）
- 例外：重大インシデント/外部変更が疑われる場合は、運用判断で即時実行してよい

#### 変更検知時の処理（固定 / 自動更新禁止）

- **自動でSSOT/実装を更新してはならない**
- 検知したら必ず以下を行う：
  - `incident_records` を作成（runbookLabel=[7-2-1]、severity=low 推奨）
    - `triggerReasonCode`: `RISK_POLICY_PROHIBITED`（規約変更は利用制約の可能性があるため）
    - `summary`: 変更対象 apiId / URL / 検知日 を含める
  - `Todo.md` に判断待ちを起票（対象apiId、差分要約、影響範囲）
  - 人間承認があるまで、当該APIの利用可否/表現/保存方針を **確定させない**

---

## G. 将来機能の予約地（Non-Implemented / Reserved）

目的：将来機能を“今は実装しない”と明示しつつ、設計のねじれ・勝手実装を防ぐための予約地を確保する。

原則（MUST）：

- ここに列挙された項目は **未実装**。仕様に載っていても “実装済み” を意味しない。
- 実装する場合は、SSOTの基盤（責務境界/失敗既定/RBAC/保持/監査/運用）に適合しなければならない。
- 実装開始時は **要件確定→データ影響→UX影響→Policy→監査→運用** の順で SSOT を更新する（逆順禁止）。

予約機能（例・未実装）：

- コミュニティ機能（近接ユーザー／ママ友マッチング）
- 旅行・週末計画支援（予約/チケット/保険連携）
- ベンダー連携拡張（提携枠、キャンペーン、クーポン）
- Google Calendar 同期の双方向化（現時点は片方向/限定運用）
- ユーザー自己申告プロフィールの拡張（学校・習い事・渡航履歴 等）

実装時の必須チェック（MUST）：

- PII増加の有無と最小化策（1-4/4章/8-5）
- 送信誤爆の新規経路と kill-switch 対応（6-4/7章）
- 管理UIでの可視化と監査ログ（6-0/6-2X/6-4/7-3）
- 失敗時の既定動作（3-4/5-7）

## E. 変更履歴（Changelog）

（※変更は必ずここに記録。記録前の実装変更は禁止）

---

### 2026-01-07

- 4-2-b（管理系 / SSOT）に `sources` / `reviews` / `ops_configs` を **v1導入**として追記
- `sources` / `reviews` / `ops_configs` の更新主体を **system のみ（adminは提案→system反映）**に固定（audit_logs必須）
- Vendorマッチング統合（DRAFT）として、`VENDOR_*` を付録B/6-0/6-2Xへ追記（nextActionは NONE、UX文言追加は無し）
- Experience Source 統合（DRAFT）として、`experience_*` コレクションと `EXPERIENCE_SOURCE_*` reasonCode、運用導線（[7-2-4]）をSSOTへ追記
- RAES（Review Aggregated Experience Source）統合（DRAFT）として、`review_*` コレクションと `REVIEW_SOURCE_*` reasonCode、運用導線（[7-2-5]）をSSOTへ追記
- RAES: 星評価/順位は **保存は可だがUX非表示**、BIAS_SUSPECT の運用トリガは **commercialFlagのみ**に固定
- IRS（Insight Reaction Signal）統合（DRAFT）として、`insight_reactions` と `INSIGHT_*` reasonCode、管理UIの集計専用ルールをSSOTへ追記

### 2026-01-08

- 付録Bの `templateId必須` 文言を修正し、**UX非表示コードは templateId=null を許容**するルールを明文化（矛盾解消）
- 付録Bに `RISK_POLICY_PROHIBITED` を追加し、6-2X にもマッピングを追加（付録Cとの接続を整合）
- 付録Bの INSIGHT（IRS）の category を `INSIGHT` に統一（見出しとの不一致解消）
- `sources.kind` に `external_api` を追記（外部APIの情報源管理の差し込み口）
- 付録F「External API 活用仕様（共通原則 + API台帳）」を新設（公式URL未確定はTODOでゲート、実装禁止を明文化）
 - 付録Fに **F-6（規約/仕様/価格変更の監視要件）**を追加（週次監視・自動更新禁止・incident/todo起票を固定）
- 3-3-1A（ランタイム最小エンドポイント）を **予約枠（Extension Point）**として追加（pathsの確定は T-API-002 で合意後）

### 2026-01-09

- SSOT基盤原則を追記：1-5（実行主体と責務境界）、3-4（失敗時既定動作）、5-7（外部依存UX原則）、6-4（RBAC運用拘束）、8-5（保持/匿名化原則）、付録G（将来機能の予約地）
