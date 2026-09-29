# Movement tree implementation plan

Goal: Deliver the agreed tablet consultation tree independently of the member app.
Spec: ../specs/2026-09-29-movement-tree-design.md
Execution: inline in this chat, as requested; no new implementation approval round.

## Tasks
- [ ] Model: node identity/parent/order; safe move/delete; computed breadcrumbs; visible tree; backup validation. Node tests first: cycles, orphan parents, descendants, hidden branches, invalid imports.
- [ ] React Flow canvas: vertical layout, themed white cards, expand/collapse, fit on topology changes only, touch navigation, focus selection.
- [ ] Editing and catalog: name/image/word meanings, optional custom fields, show/hide, new/move/delete/undo, search input candidates independently of their source hierarchy.
- [ ] Persistence: IndexedDB local checkpoint, versioned Supabase RPC with conflict detection, workspace capability link, images in dedicated storage. Do not embed privileged keys. Offline must not overwrite remote state.
- [ ] Settings/backup: seven themes, ZIP export with assets, validated restore, mobile dialogs.
- [ ] Verify build, model tests, browser workflows, viewport screenshots; deploy separate GitHub Pages app; verify remote bundle.

## Review focus
Cycles/orphans: model rejects invalid topology. Long Korean labels: wrap, panel scroll. Concurrent edits: CAS conflict preserves local work. Offline creation: no false saved state. Backup images: missing assets abort export/import rather than silently omit.

## Rulings
- Existing user approvals and repeated explicit requests to build authorize implementation; preserve scope already agreed in chat.
- Input folder supplies only 57 exercise id/name records; never import parent_id, ordering, type, or source tree design.
- Shared database performance: event-driven refresh plus at most 60s visible polling; debounce writes; no mass image fetch.
- SQL schema deployment needs database management authority, absent from provided service API key. Supply a self-contained migration for user execution if no existing configured access is available. Complete and test all independent UI work meanwhile.
