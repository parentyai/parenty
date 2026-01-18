# ADMIN_UX_API_DECISION_MAP_7（非仕様・判断補助）

本書は仕様ではない。
本書は定義・権威・判断の正を持たない。
本書は SSOT / PolicyUxAdminMatrix / 下位仕様を変更・補完・再定義しない。
矛盾がある場合は、常に SSOT / PolicyUxAdminMatrix が優先される。
本書を根拠に実装・仕様変更・運用判断を行ってはならない。
本書の7状態は管理UI内の判断地図ラベルであり、SSOTの状態定義ではない。判断主体は人間に固定する。

---

## Section 1：管理UI UX状態マップ（7状態）

### 1. READ_ONLY
- 状態の意味: 管理者が状況確認のみを行う局面。操作の可否判断は人間側に留まる。
- 検知されうるシグナル（例示のみ）: 表示モード固定 / 操作系UIの無効化 / 参照専用の導線
- 最優先UX目的: 誤操作の抑止
- MUST:
  - 変更操作の導線が見えない
  - 参照情報の根拠が追跡できる
  - 判断主体の明記がある
- MUST NOT:
  - 変更行為の誘導
  - 例外操作の示唆
  - 自動判断に見える表現
- 誤判定時の事故例: 編集可能と誤解され、監査上の不整合が生じる

### 2. DRAFT_EDIT
- 状態の意味: 草案の編集が中心の局面。最終判断は人間側に留まる。
- 検知されうるシグナル（例示のみ）: 下書き編集領域 / 保存前の表示 / 変更点の可視化
- 最優先UX目的: 変更内容の明確化
- MUST:
  - 変更点の見える化
  - 影響範囲の視認性
  - 取り消し導線の明示
- MUST NOT:
  - 公開確定に見える文言
  - 権限外の操作誘導
  - 自動確定に見える表現
- 誤判定時の事故例: 草案が確定扱いとなり、誤公開と誤認が発生する

### 3. PUBLISH_GATED
- 状態の意味: 公開判断の直前で停止している局面。判断は人間側に留まる。
- 検知されうるシグナル（例示のみ）: 承認待ち表示 / 公開前チェック表示 / 影響範囲の確認
- 最優先UX目的: 公開判断の慎重化
- MUST:
  - 承認主体の明示
  - 影響範囲の再確認
  - 監査対象の明示
- MUST NOT:
  - 公開確定に見える表示
  - 例外導線の提示
  - 自動承認に見える表現
- 誤判定時の事故例: 公開判断の省略が起き、修正不能な影響が出る

### 4. EMERGENCY_STOP
- 状態の意味: 緊急停止に関わる局面。判断は人間側に留まる。
- 検知されうるシグナル（例示のみ）: 停止状態の可視化 / 再開確認の導線 / 影響対象の明示
- 最優先UX目的: 影響範囲の明示
- MUST:
  - 停止理由の可視化
  - 影響対象の明示
  - 復帰判断の導線
- MUST NOT:
  - 自動復帰に見える表現
  - 軽視を誘発する表現
  - 例外操作の示唆
- 誤判定時の事故例: 解除判断の誤解で安全性が損なわれる

### 5. INCIDENT_MODE
- 状態の意味: 事象記録と対応が中心の局面。判断は人間側に留まる。
- 検知されうるシグナル（例示のみ）: 事象記録の導線 / 記録の参照 / 追跡の可視化
- 最優先UX目的: 追跡可能性の確保
- MUST:
  - 事象の記録導線
  - 根拠の追跡性
  - 状況の可視化
- MUST NOT:
  - 事象の過小表現
  - 自動解決に見える表現
  - 記録不要の示唆
- 誤判定時の事故例: 記録不足により原因追跡が不能となる

### 6. POLICY_CONFLICT
- 状態の意味: 方針の整合に迷いが生じる局面。判断は人間側に留まる。
- 検知されうるシグナル（例示のみ）: 矛盾表示 / 判定保留の表示 / 参照導線の提示
- 最優先UX目的: 判断の保留と参照導線
- MUST:
  - 矛盾の可視化
  - 参照導線の提示
  - 判断保留の明示
- MUST NOT:
  - 自動解消に見える表現
  - 任意判断の誘導
  - 例外運用の示唆
- 誤判定時の事故例: 判断主体の混乱により誤用が拡大する

### 7. SYSTEM_DEGRADED
- 状態の意味: 信頼性が揺らいでいる局面。判断は人間側に留まる。
- 検知されうるシグナル（例示のみ）: 部分的な欠落表示 / 更新遅延の表示 / 参照先の明示
- 最優先UX目的: 信頼性の明示
- MUST:
  - 不確実性の可視化
  - 参照先の明示
  - 判断主体の明記
- MUST NOT:
  - 正常化の断定
  - 不確実性の隠蔽
  - 自動判断に見える表現
- 誤判定時の事故例: 信頼性の誤認で判断ミスが拡大する

---

## Section 2：管理UI Operation × API 判断カード（地図）

### admin.dashboard.view
- opId: admin.dashboard.view
- UI Entry: 管理ダッシュボードの閲覧導線
- links/uiPath: /admin/dashboard
- 関連しうるAPI観点: 取得頻度 / 更新遅延 / 表示一貫性
- 要求されるRole: viewer / editor / operator / admin
- 事前に満たされているべき前提: SSOT の監査・可視化原則 / PolicyUxAdminMatrix の参照導線
- UX上の注意（表示・文言・誘導）: 根拠の追跡性 / 判断主体の明記
- 事故パターン（1行）: 断定的表示により判断の責任が曖昧になる

### admin.template.createOrEditDraft
- opId: admin.template.createOrEditDraft
- UI Entry: テンプレ草案の作成・編集導線
- links/uiPath: /admin/templates/draft
- 関連しうるAPI観点: 保存整合性 / 差分追跡 / 競合の可視化
- 要求されるRole: editor / operator / admin
- 事前に満たされているべき前提: SSOT のテンプレ関連規約 / PolicyUxAdminMatrix の接続点
- UX上の注意（表示・文言・誘導）: 草案と確定の区別 / 影響範囲の可視化
- 事故パターン（1行）: 草案が確定扱いに見え、誤運用が起きる

### admin.template.publish
- opId: admin.template.publish
- UI Entry: 公開判断の導線
- links/uiPath: /admin/templates/publish
- 関連しうるAPI観点: 公開状態の同期 / 反映遅延 / 監査追跡
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT の公開規約 / PolicyUxAdminMatrix の運用導線
- UX上の注意（表示・文言・誘導）: 影響範囲の再確認 / 判断主体の明記
- 事故パターン（1行）: 公開の確定に見え、手続きの省略が起きる

### admin.template.disable
- opId: admin.template.disable
- UI Entry: テンプレ無効化の導線
- links/uiPath: /admin/templates/disable
- 関連しうるAPI観点: 影響対象の特定 / 状態反映の遅延
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT の停止規約 / PolicyUxAdminMatrix の運用導線
- UX上の注意（表示・文言・誘導）: 影響対象の明示 / 解除判断の導線
- 事故パターン（1行）: 無効化の影響が見えず混乱が起きる

### admin.globalStop.enable
- opId: admin.globalStop.enable
- UI Entry: 全体停止の導線
- links/uiPath: /admin/ops/global-stop/enable
- 関連しうるAPI観点: 即時反映 / 影響範囲の整合 / 監査記録
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT の停止原則 / PolicyUxAdminMatrix の運用導線
- UX上の注意（表示・文言・誘導）: 影響範囲の可視化 / 判断主体の明記
- 事故パターン（1行）: 停止範囲の誤認で過剰停止が起きる

### admin.globalStop.disable
- opId: admin.globalStop.disable
- UI Entry: 全体停止解除の導線
- links/uiPath: /admin/ops/global-stop/disable
- 関連しうるAPI観点: 復帰状態の同期 / 反映遅延
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT の停止原則 / PolicyUxAdminMatrix の運用導線
- UX上の注意（表示・文言・誘導）: 復帰判断の明示 / 影響確認の可視化
- 事故パターン（1行）: 解除の判断が曖昧になり混乱が起きる

### admin.auditLogs.query
- opId: admin.auditLogs.query
- UI Entry: 監査ログの閲覧導線
- links/uiPath: /admin/audit-logs
- 関連しうるAPI観点: 検索性 / 追跡性 / 表示一貫性
- 要求されるRole: viewer / editor / operator / admin
- 事前に満たされているべき前提: SSOT の監査規約 / PolicyUxAdminMatrix の参照導線
- UX上の注意（表示・文言・誘導）: 追跡可能性の明示 / 判断主体の明記
- 事故パターン（1行）: 参照根拠の欠落で判断がぶれる

### admin.incident.create
- opId: admin.incident.create
- UI Entry: 事象記録の作成導線
- links/uiPath: /admin/incidents/new
- 関連しうるAPI観点: 記録一貫性 / 参照性 / 追跡性
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT の事象記録規約 / PolicyUxAdminMatrix の運用導線
- UX上の注意（表示・文言・誘導）: 根拠の明示 / 記録の可視化
- 事故パターン（1行）: 記録不足により原因追跡が不能となる

### admin.contentRegistry.review
- opId: admin.contentRegistry.review
- UI Entry: Content Registry のレビュー導線
- links/uiPath: /admin/content-registry/review
- 関連しうるAPI観点: 承認状態の同期 / 差分可視化 / 監査追跡
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT 1-6 / 4-2-b の承認ゲート / PolicyUxAdminMatrix の参照導線
- UX上の注意（表示・文言・誘導）: contentId と status の明示 / 承認主体の明記
- 事故パターン（1行）: 承認抜けで公開され、訂正導線が失われる

### admin.contentRegistry.activate
- opId: admin.contentRegistry.activate
- UI Entry: Content の有効化導線
- links/uiPath: /admin/content-registry/activate
- 関連しうるAPI観点: 有効化時刻の整合 / 反映遅延 / 監査記録
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT 1-6 の lifecycle / audit_logs 導線
- UX上の注意（表示・文言・誘導）: 有効化開始時刻の明示 / killFlag の可視化
- 事故パターン（1行）: 有効化時刻の誤認で誤配信が起きる

### admin.contentRegistry.retire
- opId: admin.contentRegistry.retire
- UI Entry: Content の終了/停止導線
- links/uiPath: /admin/content-registry/retire
- 関連しうるAPI観点: 停止の即時反映 / 影響範囲の特定
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT 1-6 の killFlag / audit_logs 導線
- UX上の注意（表示・文言・誘導）: 停止理由の明示 / 影響対象の可視化
- 事故パターン（1行）: 停止漏れで誤表示が継続する

### admin.cityPack.review
- opId: admin.cityPack.review
- UI Entry: City Pack のレビュー導線
- links/uiPath: /admin/city-pack/review
- 関連しうるAPI観点: Failure Mode の妥当性 / 差分可視化 / 監査追跡
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT 5-8 / 4-2-b の承認導線
- UX上の注意（表示・文言・誘導）: state の意味と UNKNOWN の位置づけ明示
- 事故パターン（1行）: UNKNOWN を失敗扱いにして誤停止が発生する

### admin.cityPack.activate
- opId: admin.cityPack.activate
- UI Entry: City Pack の有効化導線
- links/uiPath: /admin/city-pack/activate
- 関連しうるAPI観点: activation 環境の切替 / 反映遅延 / 監査記録
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT 5-8 の watch state / audit_logs 導線
- UX上の注意（表示・文言・誘導）: 有効化開始時刻の明示 / 影響範囲の可視化
- 事故パターン（1行）: 反映範囲の誤解で誤配信が起きる

### admin.cityPack.rollback
- opId: admin.cityPack.rollback
- UI Entry: City Pack の停止/ロールバック導線
- links/uiPath: /admin/city-pack/rollback
- 関連しうるAPI観点: 即時停止 / 影響範囲 / 監査追跡
- 要求されるRole: operator / admin
- 事前に満たされているべき前提: SSOT 5-8 / docs/ops/city_pack_auto_generation_spec.md の rollback 条件 / audit_logs 導線
- UX上の注意（表示・文言・誘導）: 停止理由の明示 / 復旧条件の可視化
- 事故パターン（1行）: 停止理由が曖昧で再発防止ができない

---

## Section 3：統一レスポンス観点（概念レベル）

管理UI API の外形が結果にかかわらず揃っていると、UXの揺れが起きにくいという設計観点がある。nextAction は既存概念としての参照に留まり、再定義は行わない。

---

## Section 4：誤読防止・安全ピン（必須）

- 本書を根拠に API を追加しない。
- 本書を根拠に UI を設計しない。
- 実装・仕様変更が必要な場合は SSOT 改定プロセスに戻す。
- 本書は「判断の順序」を助けるための地図にすぎない。
