# 教育データ公式ソース台帳 ポリシー（非実装）

## 公式性判定ルール（スコア 0-3）
- 3: 州教育局の公式ソースで、公式性の根拠URLが確認できる
- 2: 州政府または州教育局が提示する一覧に含まれる
- 1: 学区の公式ソースで、責任範囲が明確
- 0: その他の公的機関だが公式性の根拠が弱い

## 規約判定ルール（分類）
- commercialUse: allow / deny / unknown
- redistribution: allow / deny / unknown
- scraping: allow / deny / unknown
- rateLimit: 数値または不明を記述
- termsUrl: 規約URLの有無を記録

## 赤信号条件（利用しない判断の基準）
- termsUrl が不明または確認不能
- scraping が deny
- commercialUse が deny
- 公式性の根拠URLが確認できない
- 更新停止または終了が明記されている

## 監査ログ（台帳更新レビュー）テンプレ
- 日付:
- 変更種別: 追加 / 削除 / 変更
- 変更対象ID:
- 公式性根拠URL:
- 規約URL:
- 影響範囲:
- 判定メモ:
