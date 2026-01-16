# reasonCodeIndex 生成（参照導線）

## 背景
- Policy Engine が reasonCodes を正規化するため、付録B由来の参照データを固定する。

## 説明

### メタ
- Scope（責務）: 付録B由来の reasonCodeIndex 生成導線
- Non-goals（やらないこと）: reasonCode の新規定義 / 付録Bの複製
- Definitions（用語）: SSOT 付録Bの用語に準拠
- Assumptions（前提）: 付録Bが唯一の正である
- Dependencies（依存）: `PARENTY_SSOT.md` 付録B
- Invariants（不変条件）: 付録Bと一致しない値を生成しない
- Change Impact（変更波及）: policy / matrix / ops
- Open Questions（未決）: なし
- Acceptance（受入条件）: 付録B参照が明示される
- 参照元: `docs/policy_engine/README.md`
- 参照先: `docs/policy_engine/decision_model.md`

### 生成ルール（固定）

- reasonCodeIndex は **付録Bの参照導線**であり正ではない。
- 生成対象フィールドは以下に限定する。
  - reasonCode
  - category
  - defaultResult
  - templateId
- 付録Bに存在しない reasonCode は出力しない。
- 付録Bの改定があれば必ず再生成する。

### 生成手順（固定）

1. `PARENTY_SSOT.md` 付録Bから対象フィールドを抽出する。
2. `backend/reason_code_index.json` に JSON として保存する。
3. `POLICY_REASON_CODE_INDEX_PATH` に配置パスを設定する。

### 出力形式（参照形）

- JSON（キー=reasonCode）

```json
{
  "REASON_CODE": {
    "category": "CATEGORY",
    "defaultResult": "ALLOW|DEGRADED|DENY",
    "templateId": "tpl_xxx_or_null"
  }
}
```

### 配置と参照

- 参照パスは `POLICY_REASON_CODE_INDEX_PATH` で指定する。
- ロード実装は `backend/src/policy/reason_code_index.js` を用いる。
- 配置例: `backend/reason_code_index.json`

## 結論
- reasonCodeIndex は付録Bの参照導線としてのみ使う。

## 補足
- 本ファイルは導線であり、reasonCodeの正は常に付録Bに固定する。
