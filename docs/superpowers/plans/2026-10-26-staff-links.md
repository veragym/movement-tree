# Staff workspace links implementation plan

Goal: Keep the existing main address and create independent basic/quest pairs for employees.

Architecture: Existing cloud RPCs store each copy under a new UUID. Pair metadata travels in both documents. A directory on the original basic document keeps names and links; it is never copied into staff documents. Quest templates retain criteria/bindings but start with a blank learner and no member records. Existing source data is untouched except the new directory.

Tech stack: React, existing Supabase RPC, node:test, Playwright.

- [x] Test copy isolation, record reset, paired navigation, source protection and partial-creation retry.
- [x] Implement workspace helpers and two-document copy service; UUID keys remain independent.
- [x] Add employee link manager to original basic page; preserve paired navigation and isolate theme/local caches.
- [x] Test browser creation, cross-page navigation, independent editing, original main URL and mobile layout.
- [x] Run tests/build, publish, verify deployed assets without creating unwanted employee workspaces.

This is link-based separation, not authentication. Anyone holding a workspace link can edit that copy. Source updates do not overwrite existing copies.

Validation: 44 unit tests passed; browser tests with an in-memory cloud confirmed two staff pairs, independent edits, empty member records, paired navigation, desktop/mobile layout, and canonical main routing. Production verification follows deployment with mocked cloud writes.
