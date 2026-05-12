---
name: clabx-editable-slide-deck
description: Create complete, editable PowerPoint slide decks from source content. Use when the user asks for PPT, PPTX, PowerPoint, editable slides, slide deck, presentation, keynote, pitch deck, report deck, tech sharing deck, "可编辑 PPT", "幻灯片", or "演示文稿", especially when text, shapes, tables, charts, and speaker notes must remain editable instead of flattened into images.
---

# Clabx Editable Slide Deck

Build a finished deck with an editable `.pptx` as the primary deliverable and
an optional standalone HTML preview for review. The PPTX must use native slide
objects: text boxes, shapes, lines, tables made from cells, simple charts made
from shapes, and real speaker notes. Use full-slide raster images only when the
user explicitly asks for image slides.

## Operating Principles

- **Editable PPTX first.** The PowerPoint file is the source of truth. HTML is
  a preview or companion artifact, not the route to a rasterized PPTX.
- **Confirm before production.** Do not generate the full deck until the user
  confirms style, audience, slide count, language, and review gates, unless the
  current request explicitly says to skip confirmation.
- **One reproducible spec.** Write `deck-spec.json` before generating files.
  Both scripts read the same spec, so later edits can be made in one place.
- **Narrative over decoration.** Every slide needs one main idea, a narrative
  headline, and visible hierarchy. Avoid filler copy and invented metrics.
- **Standalone by default.** Use only this skill's scripts and references. Do
  not require another slide, design, or HTML deck skill to complete the work.

## Resource Map

Load only the references needed for the current request.

| File | Use |
| --- | --- |
| `references/analysis-and-confirmation.md` | Content analysis, confirmation prompts, slide-count heuristic |
| `references/style-presets.md` | Built-in visual presets and token rules |
| `references/deck-spec.md` | `deck-spec.json` schema and example |
| `references/editable-layouts.md` | Native PPTX layout patterns and editability rules |
| `references/html-preview.md` | Standalone HTML preview behavior and authoring rules |
| `references/quality-checklist.md` | Final verification checklist |
| `references/templates-catalog.md` | Built-in deck templates and when to use each |
| `references/vendor-resources.md` | Vendored Open Design payload and selection rules |
| `templates/specs/*.json` | Ready-to-copy `deck-spec.json` starters |
| `templates/outlines/*.md` | Matching outline starters |
| `examples/product-review/` | Complete example source, outline, and spec |
| `scripts/new-deck.mjs` | Scaffold a workspace from a built-in template |
| `scripts/build-editable-pptx.mjs` | Generate editable `.pptx` from `deck-spec.json` |
| `scripts/build-html-preview.mjs` | Generate standalone `preview/index.html` from `deck-spec.json` |
| `vendor/node/` | Bundled Node fallback dependencies, including `pptxgenjs` |
| `vendor/baoyu-slide-deck/` | Vendored baoyu slide-deck workflow, style dimensions, prompt discipline, merge scripts |
| `vendor/open-design/skills/html-ppt/` | Vendored HTML PPT themes, layouts, animations, and full-deck examples |
| `vendor/open-design/craft/` | Vendored design quality rules |
| `vendor/open-design/design-systems/` | Vendored brand/style design systems |
| `vendor/open-design/prompt-templates/` | Vendored prompt templates for future visual generation |
| `vendor/open-design/assets/` | Vendored visual/frame/prompt assets |
| `vendor/open-design/templates/` | Vendored general Open Design templates |

## Quick Start From A Template

For common deck types, start from a bundled template instead of writing the
spec from scratch:

```bash
node /path/to/clabx-editable-slide-deck/scripts/new-deck.mjs product-review editable-slide-deck/product-review
cd editable-slide-deck/product-review
npm install # recommended primary dependency path; bundled fallback also exists
node /path/to/clabx-editable-slide-deck/scripts/build-editable-pptx.mjs deck-spec.json product-review.pptx
node /path/to/clabx-editable-slide-deck/scripts/build-html-preview.mjs deck-spec.json preview/index.html
```

Run this to list templates:

```bash
node /path/to/clabx-editable-slide-deck/scripts/new-deck.mjs --list
```

Use `references/templates-catalog.md` to choose a starter. Templates are
starting points: replace sample claims, sources, metrics, and notes with the
user's real content before generating final deliverables.

## Vendored Open Design Resources

This skill vendors the useful Open Design payload under `vendor/open-design/`
so it remains standalone. Do not require the external `open-design` project at
runtime.

Read `references/vendor-resources.md` when the user asks for:

- an HTML preview that should borrow richer deck themes, animations, keyboard
  navigation, presenter mode, or layout ideas
- a specific design-system style or brand feel
- higher visual polish, critique, accessibility, typography, or color QA
- image or cover prompt generation

These resources are inspiration and raw material for this skill. The default
deliverable remains an editable PPTX generated from `deck-spec.json`; do not
replace it with an image-only or HTML-only deck unless the user explicitly asks
for that tradeoff.

## Vendored Baoyu Slide Deck Resources

This skill also vendors the latest baoyu slide-deck workflow under
`vendor/baoyu-slide-deck/`. Read `references/vendor-resources.md` when the deck
needs baoyu's stronger analysis, confirmation, style-dimension, outline, prompt,
or image-deck modification discipline.

Use baoyu resources primarily for:

- content analysis and slide-count heuristics
- confirmation wording and review gates
- preset/dimension style thinking
- prompt reproducibility when optional image generation is requested
- image-based deck workflows when explicitly requested

The baoyu workflow is image-deck oriented. For normal `.pptx` requests, translate
its outline and style decisions into this skill's editable `deck-spec.json`
instead of producing full-slide PNGs.

## Workflow

Copy this checklist and update it as work progresses:

```text
- [ ] Step 1: Analyze source and create workspace
- [ ] Step 2: Confirm deck choices
- [ ] Step 3: Write outline
- [ ] Step 4: Review outline if requested
- [ ] Step 5: Write deck-spec.json
- [ ] Step 6: Generate editable PPTX
- [ ] Step 7: Generate HTML preview if useful
- [ ] Step 8: QA editability, content, and visual fit
- [ ] Step 9: Summarize output paths
```

### Step 1: Analyze Source

Read `references/analysis-and-confirmation.md`. Detect the source language,
topic, audience, content type, likely slide count, data that needs citations,
and recommended style preset.

If the request matches a bundled deck type, scaffold from `scripts/new-deck.mjs`
and then replace the sample content. If no template fits, create the workspace
manually using the file layout below.

Create this workspace in the user's current project unless they specify
another output path:

```text
editable-slide-deck/<topic-slug>/
├── source.md
├── analysis.md
├── outline.md
├── deck-spec.json
├── <topic-slug>.pptx
└── preview/index.html
```

Before writing over an existing workspace, ask whether to reuse, back up, or
create a new slug.

### Step 2: Confirm Deck Choices

Ask or confirm these five choices in one batch when the runtime supports it:

1. Style preset
2. Audience
3. Slide count
4. Output language
5. Review gates: outline review, preview review, or direct generation

Skip this only when the current request says "directly generate", "skip
confirmation", "不用确认", "直接生成", or equivalent.

### Step 3: Write Outline

Use `references/style-presets.md` and `references/editable-layouts.md`.
Write `outline.md` with:

- deck metadata: topic, audience, language, style preset, slide count
- slide-by-slide narrative arc
- layout type per slide
- key content and any required citation/source notes
- notes/script intent when the deck is for live presenting

Prefer 6-15 slides for most decks. Split long source material instead of
creating a dense 30-slide file by default.

### Step 4: Review Outline

If the user requested review, show a compact table:

```text
# | Title | Type | Layout | Main job
```

Ask whether to proceed, edit `outline.md`, or regenerate the outline.

### Step 5: Write `deck-spec.json`

Read `references/deck-spec.md`. Convert the outline to `deck-spec.json`.
Keep content complete and specific. Do not leave placeholders.

The spec should include:

- `meta`: title, author, language, aspect ratio
- `theme`: colors and fonts from a built-in preset or user-provided brand
- `slides`: typed slide objects with title, subtitle, body, stats, table rows,
  image paths, and speaker notes as needed

### Step 6: Generate Editable PPTX

Dependency strategy:

1. **Primary:** install `pptxgenjs` in the deck workspace so the project has
   its own locked dependency.
2. **Backup:** if the workspace has no local install, the generator falls back
   to this skill's bundled dependency at `vendor/node/node_modules/pptxgenjs`.

Install locally when you want project-level reproducibility:

```bash
npm init -y
npm install pptxgenjs
```

Then run the bundled generator from the deck workspace:

```bash
node /path/to/clabx-editable-slide-deck/scripts/build-editable-pptx.mjs deck-spec.json <topic-slug>.pptx
```

The script resolves `pptxgenjs` from the current workspace first, so local
project dependency versions are respected, then falls back to the bundled copy
inside the skill.

### Step 7: Generate HTML Preview

Generate a browser preview when the user wants review, keyboard navigation,
speaker notes, or a shareable static artifact:

```bash
node /path/to/clabx-editable-slide-deck/scripts/build-html-preview.mjs deck-spec.json preview/index.html
```

The preview is self-contained CSS/JS and supports arrow keys, fullscreen,
overview, notes, and hash deep links. It must not replace PPTX QA.

### Step 8: QA

Run the checks in `references/quality-checklist.md`.

Minimum acceptance:

- Text on the PPTX is selectable/editable.
- Shapes, diagrams, simple charts, and table cells are native objects.
- Speaker notes are present when requested.
- No visible placeholders remain.
- The HTML preview opens locally and keyboard navigation works.
- Slide text fits at 16:9 without overlap.

### Step 9: Summary

Report the output directory and key files:

```text
Deck complete
PPTX: editable-slide-deck/<topic-slug>/<topic-slug>.pptx
Spec: editable-slide-deck/<topic-slug>/deck-spec.json
Outline: editable-slide-deck/<topic-slug>/outline.md
Preview: editable-slide-deck/<topic-slug>/preview/index.html
```

Mention any caveats, such as missing citation data, images that remain raster
because they are photos, or skipped QA.

## Modification Workflow

- **Edit a slide:** update `deck-spec.json`, rerun PPTX and preview scripts,
  then recheck that text still fits.
- **Add a slide:** add a typed object to `slides`, update slide numbers and
  outline, regenerate.
- **Delete a slide:** remove the object from `slides`, update outline,
  regenerate.
- **Change style:** update `theme` tokens or select a new preset, regenerate,
  then visually inspect at least cover, a dense body slide, a data slide, and
  the closing slide.

Never edit generated PPTX manually and then claim the spec is current. If the
user makes manual PowerPoint edits, either preserve the PPTX as final or port
the changes back into `deck-spec.json` before regenerating.
