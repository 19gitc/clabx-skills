# HTML Preview

The HTML preview is optional. Use it for review, browser sharing, keyboard
navigation, and checking visual rhythm. Do not use it to create a flattened
PPTX.

## Preview Contract

The bundled `scripts/build-html-preview.mjs` reads the same `deck-spec.json` as
the PPTX generator and writes one standalone HTML file.

Features:

- one viewport slide at a time
- left/right/space navigation
- Home/End navigation
- `F` fullscreen
- `O` overview grid
- `S` speaker notes drawer
- hash deep links: `#1`, `#2`, ...
- no external CSS or JS dependencies

## Authoring Rules

- Visible slide text must match the PPTX spec.
- Speaker notes stay hidden in `<aside class="notes">`.
- The preview may be more fluid than PPTX, but it should not introduce new
  content that is absent from `deck-spec.json`.
- Images use relative paths from the generated HTML file to the image asset.
- If a preview looks better than the PPTX, fix the PPTX layout or spec; do not
  ship a lower-quality PPTX.

## Review Steps

1. Open `preview/index.html`.
2. Press right arrow through all slides.
3. Press `O`; verify every slide appears in overview.
4. Press `S`; verify notes appear only when expected.
5. Resize to a narrow browser width; verify text remains readable.
