## SSOT Checklist（追記のみ）

- [ ] 本変更が影響する SSOT 条番号をすべて記載した
- [ ] role / nextAction / 判断主体 に関する変更はない
- [ ] Appendix G に該当する場合、未実装として扱っている
- [ ] 本PRは SSOT_VIOLATION_REGISTRY を確認した
- [ ] 類似Violation（V-xxxx）が存在しない / または対策済み
- [ ] 本PRは SSOT_CHANGE_DECLARATION を必要としない変更である
- [ ] または、対応する Change-XXX が宣言済みである

## SSOT Change Declaration (Required)

- [ ] Yes, this PR involves SSOT-related changes
- [ ] No, this PR does NOT involve SSOT-related changes

If Yes, fill all below:
- Change ID (SSOT_CHANGE_DECLARATION.md): Change-XXX
- Impacted SSOT Sections:
- Affected Files:
- Explicitly NOT changed (role / nextAction / authority):

If No, confirm one:
- [ ] No SSOT-related files touched
- [ ] SSOT-related files touched, but only for tooling / docs / guards

