# False Positives

## deslop/unused-file

- `src/lib/utils.js` — The `cn()` utility is imported by 14 UI components (button.tsx, badge.tsx, card.tsx, select.tsx, input.tsx, skeleton.tsx, tabs.tsx, accordion.tsx, avatar.tsx, separator.tsx, label.tsx, progress.tsx, alert-dialog.tsx, Sidebar.jsx). The rule's static analysis can't trace through barrel re-exports from the entry point.

## no-layout-property-animation

- `src/pages/Cart.jsx:79` — `<m.div>` is a framer-motion LazyMotion element (imported `m` from `framer-motion`). Exit animation inside `<AnimatePresence>` with the `layout` prop is the FLIP-optimized pattern — motion measures once and runs on the compositor. The rule can't recognize `m.div` as a motion element name.
