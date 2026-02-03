## 2025-02-03 - Pipeline Rendering
**Learning:** Kanban board was filtering deals O(N) per column per render.
**Action:** Use `useMemo` to group items once per render pass.
