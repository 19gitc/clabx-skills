# Deck Spec

`deck-spec.json` is the source of truth. The PPTX and HTML scripts read this
file and produce artifacts from it.

## Top-Level Shape

```json
{
  "meta": {
    "title": "Quarterly Product Review",
    "subtitle": "Where adoption grew and where focus is needed",
    "author": "Clabx",
    "language": "en-US",
    "aspect": "16:9"
  },
  "theme": {
    "name": "product-studio",
    "background": "F7F5EF",
    "surface": "FFFFFF",
    "surfaceAlt": "ECE7DC",
    "text": "111827",
    "muted": "667085",
    "accent": "B5402B",
    "accent2": "0B6477",
    "border": "D9D3C7",
    "fontFace": "Aptos",
    "displayFontFace": "Georgia"
  },
  "slides": []
}
```

## Shared Slide Fields

Every slide may include:

```json
{
  "type": "bullets",
  "title": "Activation improved after onboarding was simplified",
  "subtitle": "Three changes explain most of the lift.",
  "kicker": "Product Review",
  "notes": "Speaker-facing notes. Not visible on the slide.",
  "citation": "Source: internal analytics, 2026-04 cohort"
}
```

Supported `type` values:

| Type | Best for |
| --- | --- |
| `cover` | title slide |
| `section` | chapter break |
| `bullets` | one claim plus support points |
| `two-column` | comparison, problem/solution, before/after |
| `stats` | 2-4 metrics |
| `quote` | real quote or principle |
| `timeline` | roadmap, process, sequence |
| `table` | structured comparison |
| `image` | photo or screenshot with editable text beside it |
| `closing` | call to action or final takeaway |

## Slide Examples

### Cover

```json
{
  "type": "cover",
  "kicker": "2026 Product Review",
  "title": "Activation improved when the first run became shorter",
  "subtitle": "A concise readout on adoption, retention, and the next product bets.",
  "notes": "Open by framing this as a decision deck, not a status tour."
}
```

### Bullets

```json
{
  "type": "bullets",
  "title": "The main friction moved from setup to team rollout",
  "subtitle": "Individual users now reach value faster, but collaboration setup lags.",
  "bullets": [
    { "label": "First value", "text": "Median time to first useful output fell from 18 minutes to 7 minutes." },
    { "label": "Team setup", "text": "Only 31% of new workspaces invite a second user in the first week." },
    { "label": "Next bet", "text": "Prompt admins to invite a teammate after the first successful workflow." }
  ],
  "citation": "Source: product analytics, March-April 2026"
}
```

### Two Column

```json
{
  "type": "two-column",
  "title": "The old onboarding optimized for completeness, not momentum",
  "left": {
    "heading": "Before",
    "items": ["Four required setup screens", "Configuration before first output", "No sample workspace"]
  },
  "right": {
    "heading": "After",
    "items": ["One required decision", "First output before configuration", "Sample workspace preloaded"]
  }
}
```

### Stats

```json
{
  "type": "stats",
  "title": "Three measures moved in the right direction",
  "stats": [
    { "value": "61%", "label": "activation", "caption": "+14 points quarter over quarter" },
    { "value": "7 min", "label": "time to first value", "caption": "down from 18 minutes" },
    { "value": "31%", "label": "team invite rate", "caption": "still below target" }
  ],
  "citation": "Source: product analytics, Q1-Q2 2026"
}
```

### Table

```json
{
  "type": "table",
  "title": "The expansion path is clear but uneven",
  "columns": ["Segment", "Signal", "Decision"],
  "rows": [
    ["Self-serve", "High activation", "Keep setup short"],
    ["Team", "Low invite rate", "Add collaboration prompt"],
    ["Enterprise", "Long security review", "Package trust material"]
  ]
}
```

### Image

```json
{
  "type": "image",
  "title": "The new setup screen removes three decisions",
  "subtitle": "Use screenshots only where the visual surface itself matters.",
  "image": {
    "path": "assets/setup-screen.png",
    "caption": "New setup flow, April 2026"
  },
  "bullets": [
    { "label": "One choice", "text": "The user picks a goal before seeing configuration." },
    { "label": "Immediate output", "text": "A sample result appears before advanced settings." }
  ]
}
```

## Notes

- Keep image paths relative to `deck-spec.json`.
- Use real data only. If data is missing, write the slide as qualitative or ask
  the user for the missing metric.
- Put speaker-only guidance in `notes`, not in visible slide fields.
- Keep citations short enough to fit in the lower-left corner.
