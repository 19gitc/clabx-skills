# Style Presets

These presets are self-contained. Copy the token values into
`deck-spec.json.theme`, then adjust only when the user gives a brand system.

## Theme Token Contract

```json
{
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
}
```

Use hex colors without `#` in the spec. Keep contrast at 4.5:1 for body text.
Limit accent usage to one or two visible moments per slide.

## Presets

### `blueprint`

Use for system architecture, APIs, technical plans, engineering diagrams.

```json
{
  "name": "blueprint",
  "background": "EAF1F8",
  "surface": "FFFFFF",
  "surfaceAlt": "D9E7F3",
  "text": "102033",
  "muted": "52677A",
  "accent": "1C5D99",
  "accent2": "D96C2C",
  "border": "AFC7DA",
  "fontFace": "Aptos",
  "displayFontFace": "Aptos Display"
}
```

Traits: cool grid logic, structured diagrams, thin rules, precise labels.

### `minimal-exec`

Use for board decks, strategy reviews, decision memos.

```json
{
  "name": "minimal-exec",
  "background": "FAFAF8",
  "surface": "FFFFFF",
  "surfaceAlt": "F0F1F2",
  "text": "111111",
  "muted": "5E6670",
  "accent": "1F4E79",
  "accent2": "8A6A2F",
  "border": "D8DADD",
  "fontFace": "Aptos",
  "displayFontFace": "Georgia"
}
```

Traits: low density, strong hierarchy, clear implication on every slide.

### `venture-clean`

Use for investor pitches, market sizing, business model, traction.

```json
{
  "name": "venture-clean",
  "background": "F6F8FB",
  "surface": "FFFFFF",
  "surfaceAlt": "E9EEF7",
  "text": "101828",
  "muted": "667085",
  "accent": "2454D6",
  "accent2": "14A38B",
  "border": "D0D7E2",
  "fontFace": "Aptos",
  "displayFontFace": "Aptos Display"
}
```

Traits: big numbers, whitespace, traction charts, direct claims.

### `product-studio`

Use for SaaS, product demos, roadmap, onboarding, feature launches.

```json
{
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
}
```

Traits: warm neutral base, product cards, restrained editorial tone.

### `academic`

Use for research findings, literature review, technical papers.

```json
{
  "name": "academic",
  "background": "FBFAF7",
  "surface": "FFFFFF",
  "surfaceAlt": "F0EEE8",
  "text": "1F2933",
  "muted": "606A75",
  "accent": "2F5D8C",
  "accent2": "7A4E2D",
  "border": "D8D2C6",
  "fontFace": "Aptos",
  "displayFontFace": "Georgia"
}
```

Traits: citations, table clarity, measured contrast, serif-like display.

### `teaching-light`

Use for explainers, lessons, workshops, beginner material.

```json
{
  "name": "teaching-light",
  "background": "FFF8EC",
  "surface": "FFFFFF",
  "surfaceAlt": "F7E8CB",
  "text": "2A2118",
  "muted": "71665A",
  "accent": "C55A11",
  "accent2": "2E7D6B",
  "border": "E5D0AF",
  "fontFace": "Aptos",
  "displayFontFace": "Georgia"
}
```

Traits: friendly structure, step numbers, generous whitespace, examples.

### `alert-review`

Use for risk, safety, incidents, compliance, policy, red-team output.

```json
{
  "name": "alert-review",
  "background": "141414",
  "surface": "232323",
  "surfaceAlt": "301B1B",
  "text": "F4F4F4",
  "muted": "C7C7C7",
  "accent": "D92D20",
  "accent2": "F0B429",
  "border": "5A3A3A",
  "fontFace": "Aptos",
  "displayFontFace": "Aptos Display"
}
```

Traits: serious contrast, incident labels, risk tiers, no playful elements.

### `editorial-bold`

Use for keynote, product reveal, thought leadership, brand story.

```json
{
  "name": "editorial-bold",
  "background": "F3EDE2",
  "surface": "FFFDF8",
  "surfaceAlt": "E3D5C5",
  "text": "17130F",
  "muted": "655C52",
  "accent": "D4482A",
  "accent2": "273E47",
  "border": "CDBEAE",
  "fontFace": "Aptos",
  "displayFontFace": "Georgia"
}
```

Traits: large typography, magazine rhythm, asymmetry, bold section breaks.

### `social-editorial`

Use for carousel-like decks, consumer education, lifestyle, creator posts.

```json
{
  "name": "social-editorial",
  "background": "FFF7F2",
  "surface": "FFFFFF",
  "surfaceAlt": "FFE7DB",
  "text": "2B1B14",
  "muted": "7A6258",
  "accent": "D85C45",
  "accent2": "3E8C84",
  "border": "F0C7B8",
  "fontFace": "Aptos",
  "displayFontFace": "Georgia"
}
```

Traits: short copy, high readability, clear card rhythm, warm accents.

## Typography Rules

- Use at most two font families: body and display.
- Body text: 15-18 pt in PPTX.
- Slide titles: 28-44 pt, depending on density.
- Cover titles: 46-64 pt.
- Captions and citations: 8-11 pt.
- Avoid all caps unless letter spacing is visibly loose.

## Density Rules

| Density | Body copy target |
| --- | --- |
| minimal | one claim, 0-3 support points |
| balanced | one claim, 3-5 support points |
| dense | one claim, table/chart plus annotations |

If content does not fit, split the slide. Do not shrink below readable type.
