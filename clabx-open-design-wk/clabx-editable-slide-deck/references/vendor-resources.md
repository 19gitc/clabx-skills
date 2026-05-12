# Vendored Resources

This skill includes local vendored resources for slide-deck production. They
should be treated as bundled resources, not external dependencies.

## Directory Map

| Path | Use |
| --- | --- |
| `vendor/baoyu-slide-deck/` | Baoyu slide-deck workflow, confirmation rules, style dimensions, prompt discipline, image-deck merge scripts |
| `vendor/open-design/skills/html-ppt/` | HTML deck themes, layouts, animations, runtime, presenter mode, full-deck examples |
| `vendor/open-design/craft/` | Typography, color, accessibility, animation, anti-slop, and design QA rules |
| `vendor/open-design/design-systems/` | Brand and visual system references as `DESIGN.md` files |
| `vendor/open-design/prompt-templates/` | Prompt templates for image/video/artifact generation |
| `vendor/open-design/assets/` | Frames, prompt assets, and visual resources |
| `vendor/open-design/templates/` | General Open Design templates |

## How To Use These Resources

Keep the editable PPTX pipeline as the default:

1. Use `deck-spec.json` as the source of truth.
2. Use this skill's `scripts/build-editable-pptx.mjs` for PPTX output.
3. Use vendored Open Design resources to improve style decisions, preview
   behavior, speaker notes, and visual QA.
4. Use HTML PPT templates as references or optional companion previews, not as
   the default PPTX production path.

## Baoyu Slide Deck Resource Selection

Source: `https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-slide-deck`
at `main` commit `dea9322d0db848b46af0e5a43df303537904a679`.

Start with:

- `vendor/baoyu-slide-deck/SKILL.md` for the full workflow and confirmation policy
- `vendor/baoyu-slide-deck/references/analysis-framework.md` for source analysis
- `vendor/baoyu-slide-deck/references/confirmation.md` for review and choice wording
- `vendor/baoyu-slide-deck/references/outline-template.md` for slide outline structure
- `vendor/baoyu-slide-deck/references/design-guidelines.md` and
  `vendor/baoyu-slide-deck/references/content-rules.md` for content quality
- `vendor/baoyu-slide-deck/references/styles/*.md` and
  `vendor/baoyu-slide-deck/references/dimensions/*.md` for visual presets

Use baoyu's image prompt and merge scripts only when the user explicitly wants
image-based slides. For normal editable PPTX work, translate baoyu's outline,
style, and content decisions into this skill's `deck-spec.json`.

## HTML PPT Resource Selection

Start with:

- `vendor/open-design/skills/html-ppt/references/themes.md` for theme choice
- `vendor/open-design/skills/html-ppt/references/layouts.md` for slide layout ideas
- `vendor/open-design/skills/html-ppt/references/full-decks.md` for full-deck structure
- `vendor/open-design/skills/html-ppt/references/presenter-mode.md` when the user asks for speaker notes or a live talk

Useful implementation assets:

- `vendor/open-design/skills/html-ppt/assets/themes/*.css`
- `vendor/open-design/skills/html-ppt/assets/runtime.js`
- `vendor/open-design/skills/html-ppt/assets/animations/`
- `vendor/open-design/skills/html-ppt/templates/single-page/*.html`
- `vendor/open-design/skills/html-ppt/templates/full-decks/`

When borrowing from HTML templates, translate the concept into editable PPTX
objects where possible: text boxes, shapes, native tables, native stat cards,
lines, and diagrams.

## Craft Rules

Use `vendor/open-design/craft/` for final QA. The most relevant files for decks
are:

- `typography.md`
- `color.md`
- `accessibility-baseline.md`
- `animation-discipline.md`
- `anti-ai-slop.md`

Apply them to both the PPTX and HTML preview.

## Design Systems

Use `vendor/open-design/design-systems/<name>/DESIGN.md` when the user asks for
a specific brand, product feel, or named visual style. Convert the design system
into `deck-spec.json.theme` tokens. Do not hard-code dozens of brand colors into
individual slides.

Recommended generic systems:

- `default`
- `minimal`
- `editorial`
- `corporate`
- `dashboard`
- `github`
- `notion`
- `linear-app`
- `openai`
- `atelier-zero`

## Prompt Templates And Assets

Use `vendor/open-design/prompt-templates/` and
`vendor/open-design/assets/prompt-templates/` only when the user asks for image,
cover, poster, or visual-generation support. Record generated prompt text in the
deck workspace so the output remains reproducible.

Use `vendor/open-design/assets/frames/` when a slide needs device or browser
framing in the HTML preview. For PPTX, prefer native rectangles and lines unless
the frame asset is explicitly needed.

## Boundaries

- Do not run baoyu's image-generation path unless the user accepts image-based
  slides or asks for generated slide images.
- Do not import the Open Design desktop app, daemon, packages, E2E tests, or
  product build pipeline.
- Do not require a running Open Design app.
- Do not flatten editable PPTX slides into full-slide images just because an
  HTML template is visually richer.
- Do not bulk-load every vendored file into context. Open only the specific
  catalog, design system, or template needed for the current deck.
