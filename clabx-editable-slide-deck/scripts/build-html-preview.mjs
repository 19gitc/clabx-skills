#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [, , specArg, outArg] = process.argv;

if (!specArg || !outArg) {
  console.error("Usage: node build-html-preview.mjs deck-spec.json preview/index.html");
  process.exit(1);
}

const specPath = path.resolve(specArg);
const outPath = path.resolve(outArg);
const specDir = path.dirname(specPath);
const outDir = path.dirname(outPath);
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
const theme = normalizeTheme(spec.theme || {});
const slides = Array.isArray(spec.slides) ? spec.slides : [];

if (slides.length === 0) {
  throw new Error("deck-spec.json must contain at least one slide in slides[].");
}

const html = `<!doctype html>
<html lang="${escapeAttr(spec.meta?.language || "en")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(spec.meta?.title || "Editable Slide Deck")}</title>
<style>
:root {
  --bg: #${theme.background};
  --surface: #${theme.surface};
  --surface-alt: #${theme.surfaceAlt};
  --text: #${theme.text};
  --muted: #${theme.muted};
  --accent: #${theme.accent};
  --accent-2: #${theme.accent2};
  --border: #${theme.border};
  --font-body: ${fontStack(theme.fontFace)};
  --font-display: ${fontStack(theme.displayFontFace)};
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); }
body { overflow: hidden; }
.deck { width: 100vw; height: 100vh; position: relative; }
.slide {
  position: absolute;
  inset: 0;
  padding: clamp(28px, 5vw, 72px);
  display: none;
  background: var(--bg);
}
.slide.active { display: grid; }
.topbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 6px;
  background: linear-gradient(90deg, var(--accent) var(--progress), transparent 0);
  z-index: 20;
}
.chrome {
  position: absolute;
  top: 20px;
  left: clamp(28px, 5vw, 72px);
  right: clamp(28px, 5vw, 72px);
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 12px;
}
h1, h2 { font-family: var(--font-display); letter-spacing: -0.02em; margin: 0; line-height: 1.02; }
h1 { font-size: clamp(44px, 7vw, 88px); max-width: 11ch; }
h2 { font-size: clamp(32px, 5vw, 58px); max-width: 18ch; }
p { font-size: clamp(16px, 1.8vw, 22px); line-height: 1.45; color: var(--muted); max-width: 66ch; }
.kicker { color: var(--accent); font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
.cover { grid-template-columns: minmax(0, 1fr) 30vw; gap: 7vw; align-items: center; }
.cover-art, .panel, .card, .stat, .cell { background: var(--surface); border: 1px solid var(--border); }
.cover-art { height: 62vh; background: linear-gradient(145deg, var(--surface-alt), var(--surface)); display: grid; place-items: center; color: var(--accent); font-weight: 800; }
.section { place-items: center start; }
.bullets { align-content: center; gap: 22px; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 16px; }
.card, .stat { padding: 22px; min-height: 120px; }
.card strong { display: block; color: var(--accent); margin-bottom: 8px; }
.columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; align-items: stretch; margin-top: 24px; }
.panel { padding: 28px; }
.panel h3 { margin: 0 0 16px; font-size: 22px; }
.panel li { margin: 10px 0; font-size: 18px; line-height: 1.35; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-top: 30px; }
.stat .value { font-family: var(--font-display); font-size: clamp(42px, 6vw, 76px); font-weight: 800; color: var(--accent); line-height: 1; }
.stat .label { font-weight: 800; margin-top: 14px; }
.quote-text { font-family: var(--font-display); font-size: clamp(34px, 5vw, 66px); line-height: 1.08; max-width: 920px; }
.timeline-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-top: 32px; }
.table { display: grid; margin-top: 24px; border-top: 1px solid var(--border); border-left: 1px solid var(--border); }
.cell { padding: 14px; border-top: 0; border-left: 0; min-height: 54px; }
.cell.header { background: var(--surface-alt); font-weight: 800; color: var(--text); }
.image-layout { grid-template-columns: 58% 1fr; gap: 36px; align-items: center; }
.image-box { width: 100%; height: 56vh; object-fit: contain; background: var(--surface-alt); border: 1px solid var(--border); }
.caption, .citation { font-size: 12px; color: var(--muted); }
.citation { position: absolute; left: clamp(28px, 5vw, 72px); bottom: 24px; }
.notes { display: none; }
.notes-open .notes-panel { transform: translateY(0); }
.notes-panel {
  position: fixed;
  left: 24px;
  right: 24px;
  bottom: 24px;
  max-height: 36vh;
  overflow: auto;
  transform: translateY(calc(100% + 32px));
  transition: transform 160ms ease;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: 0 24px 80px rgba(0,0,0,.18);
  padding: 20px;
  z-index: 40;
}
.overview-open .overview { display: grid; }
.overview {
  position: fixed;
  inset: 0;
  display: none;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  padding: 34px;
  background: rgba(0,0,0,.72);
  z-index: 50;
  overflow: auto;
}
.thumb { background: var(--bg); color: var(--text); border: 1px solid var(--border); padding: 18px; min-height: 150px; cursor: pointer; }
.thumb strong { display: block; margin-bottom: 10px; color: var(--accent); }
@media (max-width: 760px) {
  .cover, .columns, .image-layout { grid-template-columns: 1fr; }
  .cover-art, .image-box { height: 32vh; }
  h1 { max-width: none; }
}
</style>
</head>
<body>
<div class="topbar" style="--progress:0%"></div>
<main class="deck">
${slides.map((slide, index) => renderSlide(slide, index, slides.length)).join("\n")}
</main>
<div class="notes-panel" aria-live="polite"></div>
<div class="overview"></div>
<script>
const slides = Array.from(document.querySelectorAll('.slide'));
const overview = document.querySelector('.overview');
const notesPanel = document.querySelector('.notes-panel');
let current = Math.max(0, Math.min(slides.length - 1, Number(location.hash.slice(1)) - 1 || 0));
function go(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
  document.querySelector('.topbar').style.setProperty('--progress', slides.length === 1 ? '100%' : ((current) / (slides.length - 1) * 100) + '%');
  location.hash = String(current + 1);
  const notes = slides[current].querySelector('.notes');
  notesPanel.textContent = notes ? notes.textContent.trim() : '';
}
function buildOverview() {
  overview.innerHTML = slides.map((slide, i) => '<button class="thumb" data-i="' + i + '"><strong>' + String(i + 1).padStart(2, '0') + '</strong>' + (slide.dataset.title || 'Untitled') + '</button>').join('');
  overview.querySelectorAll('.thumb').forEach(btn => btn.addEventListener('click', () => { document.body.classList.remove('overview-open'); go(Number(btn.dataset.i)); }));
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') go(current + 1);
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') go(current - 1);
  if (event.key === 'Home') go(0);
  if (event.key === 'End') go(slides.length - 1);
  if (event.key.toLowerCase() === 'f') document.documentElement.requestFullscreen?.();
  if (event.key.toLowerCase() === 's') document.body.classList.toggle('notes-open');
  if (event.key.toLowerCase() === 'o') document.body.classList.toggle('overview-open');
  if (event.key === 'Escape') document.body.classList.remove('notes-open', 'overview-open');
});
window.addEventListener('hashchange', () => go(Number(location.hash.slice(1)) - 1 || 0));
buildOverview();
go(current);
</script>
</body>
</html>`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, html, "utf8");
console.log(`Wrote ${outPath}`);

function normalizeTheme(input) {
  return {
    background: hex(input.background, "F7F5EF"),
    surface: hex(input.surface, "FFFFFF"),
    surfaceAlt: hex(input.surfaceAlt, "ECE7DC"),
    text: hex(input.text, "111827"),
    muted: hex(input.muted, "667085"),
    accent: hex(input.accent, "B5402B"),
    accent2: hex(input.accent2, "0B6477"),
    border: hex(input.border, "D9D3C7"),
    fontFace: input.fontFace || "Aptos",
    displayFontFace: input.displayFontFace || input.fontFace || "Georgia"
  };
}

function hex(value, fallback) {
  const cleaned = String(value || "").replace(/^#/, "").trim();
  return /^[0-9a-fA-F]{6}$/.test(cleaned) ? cleaned.toUpperCase() : fallback;
}

function fontStack(name) {
  return `"${String(name).replace(/"/g, "")}", Aptos, Arial, sans-serif`;
}

function renderSlide(slide, index, total) {
  const type = String(slide.type || "bullets").toLowerCase();
  const content = renderContent(type, slide, index);
  const citation = slide.citation ? `<div class="citation">${escapeHtml(slide.citation)}</div>` : "";
  const notes = slide.notes ? `<aside class="notes">${escapeHtml(slide.notes)}</aside>` : "";
  return `<section class="slide ${classFor(type)}" data-title="${escapeAttr(slide.title || slide.kicker || `Slide ${index + 1}`)}">
  <div class="chrome"><span>${escapeHtml(slide.kicker || spec.meta?.title || "")}</span><span>${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span></div>
  ${content}
  ${citation}
  ${notes}
</section>`;
}

function renderContent(type, slide, index) {
  if (type === "cover") {
    return `<div><div class="kicker">${escapeHtml(slide.kicker || spec.meta?.subtitle || "")}</div><h1>${escapeHtml(slide.title || spec.meta?.title || "")}</h1><p>${escapeHtml(slide.subtitle || spec.meta?.subtitle || "")}</p></div><div class="cover-art">${escapeHtml(slide.tagline || "Editable PPTX")}</div>`;
  }
  if (type === "section") {
    return `<div><div class="kicker">${escapeHtml(slide.kicker || `Section ${index + 1}`)}</div><h2>${escapeHtml(slide.title || "")}</h2><p>${escapeHtml(slide.subtitle || "")}</p></div>`;
  }
  if (type === "two-column" || type === "compare") {
    return heading(slide) + `<div class="columns">${renderPanel(slide.left)}${renderPanel(slide.right)}</div>`;
  }
  if (type === "stats") {
    return heading(slide) + `<div class="stats-grid">${(slide.stats || []).map(stat => `<div class="stat"><div class="value">${escapeHtml(stat.value || "")}</div><div class="label">${escapeHtml(stat.label || "")}</div><p>${escapeHtml(stat.caption || "")}</p></div>`).join("")}</div>`;
  }
  if (type === "quote") {
    return `<div><div class="kicker">${escapeHtml(slide.kicker || "Quote")}</div><div class="quote-text">${escapeHtml(slide.quote || slide.title || "")}</div><p>${escapeHtml(slide.attribution || slide.subtitle || "")}</p></div>`;
  }
  if (type === "timeline") {
    return heading(slide) + `<div class="timeline-row">${(slide.items || []).map(item => `<div class="card"><strong>${escapeHtml(item.label || "")}</strong><b>${escapeHtml(item.title || "")}</b><p>${escapeHtml(item.text || "")}</p></div>`).join("")}</div>`;
  }
  if (type === "table") {
    const cols = slide.columns || [];
    const rows = slide.rows || [];
    const cells = cols.map(col => `<div class="cell header">${escapeHtml(col)}</div>`).join("") + rows.flatMap(row => cols.map((_, i) => `<div class="cell">${escapeHtml(row[i] || "")}</div>`)).join("");
    return heading(slide) + `<div class="table" style="grid-template-columns: repeat(${Math.max(cols.length, 1)}, minmax(0, 1fr));">${cells}</div>`;
  }
  if (type === "image") {
    const img = slide.image || {};
    const src = img.path ? path.relative(outDir, path.resolve(specDir, img.path)).split(path.sep).join("/") : "";
    return `<div>${heading(slide)}${renderCards(slide)}</div><div>${src ? `<img class="image-box" src="${escapeAttr(src)}" alt="">` : `<div class="image-box"></div>`}<div class="caption">${escapeHtml(img.caption || "")}</div></div>`;
  }
  return heading(slide) + renderCards(slide);
}

function heading(slide) {
  return `<div><div class="kicker">${escapeHtml(slide.kicker || "")}</div><h2>${escapeHtml(slide.title || "")}</h2><p>${escapeHtml(slide.subtitle || "")}</p></div>`;
}

function renderPanel(panel = {}) {
  return `<div class="panel"><h3>${escapeHtml(panel.heading || panel.title || "")}</h3><ul>${normalizeList(panel.items || panel.bullets || panel.body).map(item => `<li>${escapeHtml(item.text || item.label || item)}</li>`).join("")}</ul></div>`;
}

function renderCards(slide) {
  return `<div class="cards">${normalizeList(slide.bullets || slide.items || slide.body).map(item => `<div class="card"><strong>${escapeHtml(item.label || "")}</strong>${escapeHtml(item.text || item.label || item)}</div>`).join("")}</div>`;
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/\n+/).filter(Boolean);
  return [];
}

function classFor(type) {
  if (type === "cover") return "cover";
  if (type === "section") return "section";
  if (type === "image") return "image-layout";
  return "bullets";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
