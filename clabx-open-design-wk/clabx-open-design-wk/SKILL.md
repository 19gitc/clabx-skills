---
name: clabx-open-design-wk
description: >
  Use when Codex needs the Open Design creative skill workspace: HTML PPT
  decks, landing pages, dashboards, web prototypes, posters, live artifacts,
  design-system references, prompt templates, example outputs, and bundled
  templates adapted from nexu-io/open-design. Use for requests mentioning Open
  Design, design skills, design systems, HTML presentations, PPT/slides/decks,
  landing pages, UI prototypes, dashboards, social/media templates, or needing
  a broad visual-production skill library without the Open Design client app.
---

# clabx-open-design-wk

Use this as a focused Open Design workspace skill. It vendors the upstream
`nexu-io/open-design` creative resources needed by agents: original nested
skills, examples, templates, design systems, craft references, prompt
templates, and protocol docs.

The Open Design product/client source, packaging pipeline, CI, and E2E tests
are intentionally excluded from this skill package. A complete upstream clone
is kept at `/opt/ppts/open-design` for recovery or future re-sync.

## Retention Policy

- Treat `skills/`, `design-systems/`, `craft/`, and prompt JSON as the core
  skill payload.
- Do not filter, prune, delete, rename, or flatten nested skill
  examples/templates.
- Prefer copying resources into the user's output workspace before editing them.
- When a nested skill has its own `SKILL.md`, treat that file as authoritative
  for the task-specific workflow.
- Keep upstream paths stable in explanations so another agent can find the same
  resource later.
- Do not expect Open Design's client app, daemon, packages, CI, or E2E tooling
  to exist in this package.

## Orientation

Key directories:

- `skills/` - 74 Open Design skills. Each `skills/<name>/SKILL.md` is a
  task-specific workflow; many include `assets/`, `references/`, examples, or
  templates.
- `skills/html-ppt/` - the main HTML presentation studio with themes, layouts,
  animations, full-deck templates, and rendering helpers.
- `design-systems/` - brand and product style references as `DESIGN.md` files.
- `craft/` - universal design quality references such as typography, color,
  accessibility, and anti-slop guidance.
- `templates/` and `assets/` - root-level reusable frames, deck shells, prompt
  preview assets, and visual references.
- `prompt-templates/` - image, video, and artifact prompt JSON examples.
- `docs/` - Open Design skill protocol, modes, references, adapter notes, and
  a sample `DESIGN.md`.

## Workflow

1. Identify the user's requested surface: deck, prototype, landing page,
   dashboard, poster, live artifact, social asset, design brief, or another
   bundled skill.
2. Inspect the matching nested skill first. For example:
   - deck/PPT/slides: read `skills/html-ppt/SKILL.md`.
   - Open Design editorial landing page: read `skills/open-design-landing/SKILL.md`.
   - simple deck: read `skills/simple-deck/SKILL.md`.
   - dashboard: read `skills/dashboard/SKILL.md` or `skills/live-dashboard/SKILL.md`.
   - design critique: read `skills/critique/SKILL.md`.
3. Load only the nested references needed for the current request, but leave
   every bundled file intact on disk.
4. Use `design-systems/<name>/DESIGN.md` and `craft/*.md` when the user asks for
   a style, brand system, or higher visual quality.
5. Start from the closest bundled example or template instead of creating from
   scratch when one exists.
6. Put generated work in the user's project/output directory. Avoid modifying
   this skill's vendored source unless the user explicitly asks to update the
   skill itself.

## PPTX Output Contract

When the user asks for "PPT", "PPTX", "PowerPoint", or a classroom / business
deck without explicitly saying "HTML-only", decide the output target before
authoring:

- **Editable PPTX is the default for `.pptx` deliverables.** Build slides with
  native PowerPoint objects (text boxes, shapes, lines, tables, charts, and
  grouped vector-like diagrams) using local tooling such as `pptxgenjs` or an
  equivalent available library. Text must remain selectable/editable in
  PowerPoint/WPS.
- **HTML PPT is the default for live browser presentations.** Use
  `skills/html-ppt/` when the user wants keyboard navigation, presenter mode,
  web animation, or an HTML artifact.
- **Image-based PPTX is only a fallback or explicit request.** Rendering HTML
  slides to PNG and inserting one full-slide image per page preserves visual
  fidelity but is not editable. State this tradeoff before using it.
- If both quality and editability are important, produce a native editable PPTX
  first, then optionally create an HTML/PNG preview for visual QA.
- `baoyu-slide-deck` is useful as a reference for PPT deck discipline and,
  when its available implementation/output uses native PowerPoint objects, for
  editable PPTX construction patterns. Inspect the actual script or sample
  output before assuming whether a PPTX path is editable or image-based.

## Useful Discovery Commands

Run these from the skill root when choosing resources:

```bash
find skills -maxdepth 2 -name SKILL.md | sort
find design-systems -name DESIGN.md | sort
find skills/html-ppt/templates -maxdepth 3 -type f | sort
find prompt-templates -maxdepth 2 -type f | sort
```

## Excluded Upstream Product Files

This package intentionally omits upstream `apps/`, `packages/`, `tools/`,
`e2e/`, `.github/`, workspace package files, release scripts, product specs,
community-pet built-ins, local video preview MP4s, and generated verification
screenshots. Restore them from `/opt/ppts/open-design` only if the user asks
to work on the Open Design product itself rather than use the skill library.

## Provenance

Source: `https://github.com/nexu-io/open-design`  
Snapshot branch: `main`  
Snapshot commit: `294fe94c67cda95b65c92eb11ed0b5ce51536932`
