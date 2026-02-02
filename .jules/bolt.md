## 2024-05-22 - [Optimizing PipelineBoard Rendering]
**Learning:** React `useMemo` and `memo` are critical for drag-and-drop lists where parent state (active drag ID) updates frequently. Without them, every small drag movement or state change causes the entire board and all cards to re-render.
**Action:** Always memoize the grouping logic of large lists and wrap list item components in `React.memo` when using `dnd-kit` or similar libraries.
