## RESERVED_FEATURES_GATE（Appendix G 着手ゲート）

## 派生文書共通宣言（固定）

- 本書は定義文書ではない。
- 本書は仕様の正・権威を持たない。
- Policy / UX / 権限 / 判定の正は SSOT および `PolicyUxAdminMatrix.md` にのみ存在する。
- 本書の記述が SSOT / Matrix と矛盾した場合、常に SSOT / Matrix が優先される。
- 本書の「例」「列挙」「手順」は実装・仕様のテンプレではない。
- 本書を根拠に Policy / UX / 権限 / 判定を変更してはならない。

本書単体で仕様判断してはならず、判断起点は PolicyUxAdminMatrix にあり、SSOT/Matrix が常に優先される。
## メタ（固定）

- **SSoT責務**: SSOT 付録G（将来機能の予約地）に列挙された機能を “未実装（Reserved）” として固定し、着手前ゲート（SSOT条番号）を強制する。
- **想定読者**: CTO(GPT) / Engineer(Cursor) / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（付録G）
- **生成物**: Reserved機能の一覧と SSOT Gate（参照のみ）
- **編集禁止領域**:
  - 機能の要約・再定義
  - 実装済みを示唆する記述
- **更新ルール**: SSOT 付録G の変更に追従して追記する（既存行の再解釈は禁止）。
- **関連リンク**: `SSOT_INDEX.md` / `PARENTY_SSOT.md` / `SSOT_LINK_MAP.md`
- **変更履歴**:
  - 2026-01-09: 初版

---

## 背景

- 予約機能は “場所はあるが今は触れない” を機械的に固定しないと、勝手実装が起きる。

---

## 説明

以下はすべて **Reserved (Non-Implemented)**。SSOT Gate を全て満たすまで実装は禁止。

### Feature: コミュニティ機能（近接ユーザー／ママ友マッチング）

- Status: Reserved (Non-Implemented)
- SSOT Gate:
  - SSOT 1-5
  - SSOT 3-4
  - SSOT 5-7
  - SSOT 6-4
  - SSOT 8-5
- Implementation is forbidden until all gates are checked.

---

### Feature: 旅行・週末計画支援（予約/チケット/保険連携）

- Status: Reserved (Non-Implemented)
- SSOT Gate:
  - SSOT 1-5
  - SSOT 3-4
  - SSOT 5-7
  - SSOT 6-4
  - SSOT 8-5
- Implementation is forbidden until all gates are checked.

---

### Feature: ベンダー連携拡張（提携枠、キャンペーン、クーポン）

- Status: Reserved (Non-Implemented)
- SSOT Gate:
  - SSOT 1-5
  - SSOT 3-4
  - SSOT 5-7
  - SSOT 6-4
  - SSOT 8-5
- Implementation is forbidden until all gates are checked.

---

### Feature: Google Calendar 同期の双方向化（現時点は片方向/限定運用）

- Status: Reserved (Non-Implemented)
- SSOT Gate:
  - SSOT 1-5
  - SSOT 3-4
  - SSOT 5-7
  - SSOT 6-4
  - SSOT 8-5
- Implementation is forbidden until all gates are checked.

---

### Feature: ユーザー自己申告プロフィールの拡張（学校・習い事・渡航履歴 等）

- Status: Reserved (Non-Implemented)
- SSOT Gate:
  - SSOT 1-5
  - SSOT 3-4
  - SSOT 5-7
  - SSOT 6-4
  - SSOT 8-5
- Implementation is forbidden until all gates are checked.

---

## 結論

- SSOT 付録Gの対象機能は Reserved として扱い、SSOT Gate を満たすまで実装を開始しない。

---

## 補足

- （特になし）

