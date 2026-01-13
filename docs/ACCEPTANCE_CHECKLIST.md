# 受入条件（Definition of Done）

## 背景
- 実装前の準備完了状態を固定する。

## 説明

### メタ
- Scope（責務）: 準備完了の確認項目
- Non-goals（やらないこと）: 実装の可否判断
- Definitions（用語）: SSOT の用語に準拠
- Assumptions（前提）: 参照導線が正しく張られる
- Dependencies（依存）: `docs/SPEC_INDEX.md`
- Invariants（不変条件）: 権威構造を変更しない
- Change Impact（変更波及）: チェックリストに反映
- Open Questions（未決）: TODO
- Acceptance（受入条件）: 全項目の確認完了
- 参照元: `docs/SPEC_INDEX.md`
- 参照先: 各仕様

### チェックリスト
1. SPEC_INDEX から全仕様ファイルへ到達できる
2. 仕様テンプレに準拠した構成がある
3. 各仕様に Scope と Non-goals がある
4. 各仕様に Definitions がある
5. 各仕様に Dependencies がある
6. 各仕様に Invariants がある
7. 各仕様に Change Impact がある
8. 各仕様に Open Questions がある
9. 各仕様に Acceptance がある
10. UX仕様が状態別入口として整理されている
11. Policy Engine 入口が分離されている
12. reasonCode 整形先が明示されている
13. UX系データ辞書の入口がある
14. 管理系データ辞書の入口がある
15. Firestore Rules の参照導線がある
16. 中核マトリクスの列定義が揃っている
17. reasonCode 駆動の運用導線がある
18. Change Policy の表が存在する
19. 参照元/参照先のリンクが欠落していない
20. 未確定事項が TODO と [仮説] に分離されている
21. 仕様の正が SSOT から逸脱していない

## 結論
- 上記項目の確認完了を準備完了とみなす。

## 補足
- TODO: チェックの記録方法を定義する。
