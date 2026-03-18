# UI Architecture Standard (No Logic Coupling)

This project should follow a **Feature-First + Design System** architecture:

1. `src/components/ui` is the single source of truth for visual primitives.
2. `src/common` handles app shells and cross-page layout patterns.
3. `src/pages` composes sections and features, but avoids hardcoded visual tokens.
4. Feature folders (`home`, `profile`, `marketplace`, `admin`, `game`) should use tokens and primitives from shared layers.

## Recommended Layering

1. **Tokens layer**: `src/index.css`
2. **Primitive layer**: `src/components/ui/*` (`Button`, `Card`, `Input`, `Dialog`, etc.)
3. **Layout layer**: `src/common/*` and `src/components/AppBackdrop.jsx`
4. **Feature UI layer**: route/domain folders (`home`, `profile`, etc.)
5. **Page composition layer**: `src/pages/*`

## Rules for Professional UI Consistency

1. Use design tokens (`--background`, `--foreground`, `--primary`, `--border`) instead of raw hex colors in components.
2. Prefer shared primitives before custom HTML + ad-hoc Tailwind.
3. Keep spacing scale consistent (`p-3`, `p-4`, `p-6`, `gap-2`, `gap-4`, `gap-6`).
4. Use a single radius language (`rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`).
5. Keep interaction states on all controls: `hover`, `focus-visible`, `disabled`, and active feedback.
6. Keep section surfaces consistent through `app-surface` / `app-panel` utilities.
7. Use typography roles:
   - Headings: `Outfit`
   - Body/UI text: `Sora`
   - Code/editor text: mono fonts
8. Use semantic color intent only:
   - Primary action: `primary`
   - Info/emphasis: `accent`
   - Error/destructive: `destructive`
   - Neutral containers: `card`, `secondary`, `muted`

## Suggested Incremental Refactor Path

1. Replace raw color classes in feature screens with semantic token classes.
2. Move repeated section shells into `src/common` reusable wrappers.
3. Standardize status chips and metric cards through shared variants.
4. Add visual regression checks (Storybook or screenshot testing) for key screens.
