# Watch Rules（City Pack Failure Mode / 参照導線）

## メタ（固定）

- **SSoT責務**: Watch Rules は SSOT 5-8 の参照導線のみを持ち、定義を追加しない。
- **想定読者**: Engineer / Ops
- **依存SSoT**: `PARENTY_SSOT.md`（5-8 / 3章）
- **参照導線**: `SSOT_INDEX.md` / `docs/ops/city_pack_auto_generation_spec.md`
- **更新ルール**: 追加定義が必要な場合は SSOT 改定に戻す。

---

## 背景
- City Pack の監視は失敗型のWatchであり、Policy Engine の判断主体を増やさない。
- Watch Rules は SSOT 5-8 の参照導線に限定する。

## 説明
- 本書は SSOT 5-8 の Failure Mode 辞書と Watch State を参照する入口である。
- Watch Rules が扱うのは `failureCode` / `defaultWatchFrequency` / `riskDefinition` のみ。
- Policy Decision へ直接影響させない。必要時は SSOT 3章/付録Bの導線に戻す。
- raw本文は保存しない。provenance は抽象名のみを扱う。
- LLM の役割は差分要約と failureCode マッピングに限定する。

## 結論
- Watch Rules の正は SSOT 5-8 に固定し、本書は参照導線のみを持つ。

## 補足
- City Pack 自動生成の運用は `docs/ops/city_pack_auto_generation_spec.md` を参照する。
