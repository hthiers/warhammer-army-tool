# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies (first time)
npm run dev       # dev server at http://localhost:5173
npm run build     # tsc + vite build → dist/
npm run preview   # serve the dist/ build locally
```

There are no tests or linter configured.

## Architecture

Single-page React 18 + TypeScript app built with Vite. No external UI library — all styles via CSS Modules (one `.module.css` per component).

**Data flow:** All game data lives as static TypeScript arrays in `src/data/`. `App.tsx` holds all state (selected faction, unit, detachment, active tab, ability panel toggle) and passes everything down as props — there is no global state manager. Selected faction is persisted in `localStorage` under the key `wh40k-faccion`.

**Key relationships:**

- `FACCIONES` in `src/data/facciones.ts` is the top-level registry. Each `DatosFaccion` bundles units, detachments, doctrines, and stratagems for one faction. `App.tsx` reads the faction from `localStorage` and looks it up in `FACCIONES_MAP`.
- Each faction's data lives in its own subdirectory: `src/data/spacemarines/` and `src/data/necrones/`, each with `unidades.ts`, `doctrinas.ts`, and `estratagemas.ts`.
- Doctrines and stratagems are keyed by detachment id (`Record<string, Doctrina[]>` / `Record<string, Estratagema[]>`).
- Each `Unidad` carries `estratagemasRelacionadas` (array of stratagem ids). `App.tsx` filters the active detachment's stratagems by this list and passes the result to `DataSheet`, which renders them via `AbilitiesPanel` when toggled.
- The `Pestana` union type (`'ficha' | 'doctrinas' | 'estratagemas'`) drives the main tab view.

**Component roles:**

- `FactionPicker` — full-screen overlay shown when no faction is saved in localStorage
- `Topbar` — shows current faction badge (color from `DatosFaccion.color`) + detachment selector + "Cambiar facción" button
- `Sidebar` — unit list
- `DataSheet` — unit stat block (stats, ranged weapons, melee weapons, unit abilities) + triggers the `AbilitiesPanel`
- `AbilitiesPanel` — slide-in panel showing the unit's related stratagems
- `DoctrineList` / `StratagemList` — detachment-level doctrine and stratagem views

## Adding content

**New unit:** add an object to `UNIDADES` in the relevant faction's `unidades.ts` following the `Unidad` interface in `src/types/index.ts`. List related stratagem ids in `estratagemasRelacionadas`.

**New detachment:** add it to `DESTACAMENTOS` in the faction's `doctrinas.ts`, add its `Doctrina[]` under the same key in `DOCTRINAS`, and add its `Estratagema[]` under the same key in `ESTRATAGEMAS` in the faction's `estratagemas.ts`.

**New faction:** create a `src/data/<faccion>/` subdirectory with `unidades.ts`, `doctrinas.ts`, and `estratagemas.ts`, then add an entry to `FACCIONES` in `src/data/facciones.ts`.

## Language note

All in-game terminology (unit names, abilities, stats, UI labels) is in Spanish — this is intentional.
