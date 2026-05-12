#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const [, , specArg, outArg] = process.argv;

if (!specArg || !outArg) {
  console.error("Usage: node build-editable-pptx.mjs deck-spec.json output.pptx");
  process.exit(1);
}

const specPath = path.resolve(specArg);
const outPath = path.resolve(outArg);
const specDir = path.dirname(specPath);
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
const pptxgen = loadPptxGen();

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = spec.meta?.author || "clabx-editable-slide-deck";
pptx.company = spec.meta?.company || "";
pptx.subject = spec.meta?.subtitle || "";
pptx.title = spec.meta?.title || "Editable slide deck";
pptx.lang = spec.meta?.language || "en-US";
pptx.theme = {
  headFontFace: spec.theme?.displayFontFace || "Aptos Display",
  bodyFontFace: spec.theme?.fontFace || "Aptos",
  lang: spec.meta?.language || "en-US"
};
pptx.margin = 0;

const SHAPE = pptx.ShapeType || {};
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const M = 0.58;
const theme = normalizeTheme(spec.theme || {});
const slides = Array.isArray(spec.slides) ? spec.slides : [];

if (slides.length === 0) {
  throw new Error("deck-spec.json must contain at least one slide in slides[].");
}

slides.forEach((entry, index) => {
  const slide = pptx.addSlide();
  slide.background = { color: theme.background };
  addChrome(slide, entry, index, slides.length);

  switch ((entry.type || "bullets").toLowerCase()) {
    case "cover":
      renderCover(slide, entry);
      break;
    case "section":
      renderSection(slide, entry, index);
      break;
    case "two-column":
    case "compare":
      renderTwoColumn(slide, entry);
      break;
    case "stats":
      renderStats(slide, entry);
      break;
    case "quote":
      renderQuote(slide, entry);
      break;
    case "timeline":
      renderTimeline(slide, entry);
      break;
    case "table":
      renderTable(slide, entry);
      break;
    case "image":
      renderImageSlide(slide, entry);
      break;
    case "closing":
    case "end":
      renderClosing(slide, entry);
      break;
    case "bullets":
    case "content":
    default:
      renderBullets(slide, entry);
      break;
  }

  addCitation(slide, entry);
  addSpeakerNotes(slide, entry.notes);
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
await pptx.writeFile({ fileName: outPath });
console.log(`Wrote ${outPath}`);

function loadPptxGen() {
  const cwdRequire = createRequire(path.join(process.cwd(), "package.json"));
  try {
    const mod = cwdRequire("pptxgenjs");
    return mod.default || mod;
  } catch (err) {
    const bundledRequire = createRequire(new URL("../vendor/node/package.json", import.meta.url));
    try {
      const mod = bundledRequire("pptxgenjs");
      return mod.default || mod;
    } catch {
      console.error("Cannot find pptxgenjs.");
      console.error("Primary option: run these commands in the deck workspace:");
      console.error("  npm init -y");
      console.error("  npm install pptxgenjs");
      console.error("Backup option: restore bundled dependency at:");
      console.error("  clabx-editable-slide-deck/vendor/node/node_modules/pptxgenjs");
      process.exit(1);
    }
  }
}

function normalizeTheme(input) {
  return {
    name: input.name || "product-studio",
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

function shape(name) {
  return SHAPE[name] || name;
}

function addShape(slide, name, opts) {
  slide.addShape(shape(name), opts);
}

function addText(slide, text, opts = {}) {
  if (text === undefined || text === null || String(text).trim() === "") return;
  slide.addText(String(text), {
    fontFace: theme.fontFace,
    color: theme.text,
    margin: 0.04,
    breakLine: false,
    fit: "shrink",
    ...opts
  });
}

function addTitle(slide, text, x, y, w, h, size = 34) {
  addText(slide, text, {
    x,
    y,
    w,
    h,
    fontFace: theme.displayFontFace,
    fontSize: size,
    bold: true,
    color: theme.text,
    breakLine: false,
    valign: "mid"
  });
}

function addKicker(slide, text, x, y, w) {
  addText(slide, text, {
    x,
    y,
    w,
    h: 0.24,
    fontSize: 8.5,
    bold: true,
    color: theme.accent,
    charSpace: 1.4
  });
}

function addChrome(slide, entry, index, total) {
  addShape(slide, "rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: 0.08,
    fill: { color: theme.accent },
    line: { color: theme.accent, transparency: 100 }
  });
  const label = entry.kicker || spec.meta?.title || "";
  if (label) addText(slide, label, { x: M, y: 0.22, w: 6, h: 0.22, fontSize: 8.5, color: theme.muted });
  addText(slide, `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, {
    x: SLIDE_W - 1.7,
    y: 0.22,
    w: 1.1,
    h: 0.22,
    fontSize: 8.5,
    color: theme.muted,
    align: "right"
  });
}

function addCitation(slide, entry) {
  if (!entry.citation) return;
  addText(slide, entry.citation, {
    x: M,
    y: SLIDE_H - 0.45,
    w: SLIDE_W - M * 2,
    h: 0.22,
    fontSize: 8,
    color: theme.muted
  });
}

function addSpeakerNotes(slide, notes) {
  if (!notes || typeof slide.addNotes !== "function") return;
  try {
    slide.addNotes(String(notes));
  } catch {
    try {
      slide.addNotes([String(notes)]);
    } catch {
      // Some pptxgenjs versions do not support speaker notes. Leave content visible in spec.
    }
  }
}

function renderCover(slide, entry) {
  addShape(slide, "rect", {
    x: 0.72,
    y: 0.94,
    w: 1.8,
    h: 0.12,
    fill: { color: theme.accent },
    line: { color: theme.accent, transparency: 100 }
  });
  addKicker(slide, entry.kicker || spec.meta?.subtitle, 0.72, 1.22, 8.2);
  addTitle(slide, entry.title || spec.meta?.title, 0.72, 1.72, 8.4, 2.4, 46);
  addText(slide, entry.subtitle || spec.meta?.subtitle, {
    x: 0.76,
    y: 4.38,
    w: 6.7,
    h: 0.82,
    fontSize: 16,
    color: theme.muted,
    breakLine: false
  });
  addShape(slide, "rect", {
    x: 9.2,
    y: 1.1,
    w: 2.72,
    h: 4.95,
    fill: { color: theme.surfaceAlt },
    line: { color: theme.border, width: 1.1 }
  });
  addShape(slide, "rect", {
    x: 9.58,
    y: 1.48,
    w: 2.16,
    h: 4.18,
    fill: { color: theme.surface },
    line: { color: theme.border, width: 0.8 }
  });
  addText(slide, entry.tagline || "Editable PPTX", {
    x: 9.86,
    y: 3.27,
    w: 1.6,
    h: 0.42,
    fontSize: 13,
    bold: true,
    color: theme.accent,
    align: "center"
  });
}

function renderSection(slide, entry, index) {
  addKicker(slide, entry.kicker || `Section ${index + 1}`, M, 1.46, 5);
  addTitle(slide, entry.title, M, 2.0, 9.4, 1.6, 42);
  addText(slide, entry.subtitle, { x: M, y: 3.74, w: 7.5, h: 0.72, fontSize: 16, color: theme.muted });
  addShape(slide, "line", { x: M, y: 5.08, w: 7.4, h: 0, line: { color: theme.accent, width: 2 } });
}

function renderBullets(slide, entry) {
  addTitle(slide, entry.title, M, 0.86, 9.4, 0.78, 31);
  addText(slide, entry.subtitle, { x: M, y: 1.66, w: 8.4, h: 0.48, fontSize: 13.5, color: theme.muted });
  const bullets = normalizeBullets(entry.bullets || entry.items || entry.body);
  const startY = 2.42;
  const cardH = Math.min(0.86, 3.8 / Math.max(bullets.length, 1));
  bullets.slice(0, 5).forEach((item, i) => {
    const y = startY + i * (cardH + 0.18);
    addShape(slide, "rect", {
      x: M,
      y,
      w: 11.2,
      h: cardH,
      fill: { color: i === 0 ? theme.surfaceAlt : theme.surface },
      line: { color: theme.border, width: 0.8 },
      radius: 0.12
    });
    addText(slide, item.label || String(i + 1).padStart(2, "0"), {
      x: M + 0.28,
      y: y + 0.18,
      w: 1.35,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: theme.accent
    });
    addText(slide, item.text || item.label || item, {
      x: M + 1.45,
      y: y + 0.15,
      w: 9.2,
      h: cardH - 0.22,
      fontSize: 14,
      color: theme.text,
      breakLine: false
    });
  });
}

function renderTwoColumn(slide, entry) {
  addTitle(slide, entry.title, M, 0.84, 10.4, 0.76, 30);
  addText(slide, entry.subtitle, { x: M, y: 1.58, w: 9.2, h: 0.42, fontSize: 13, color: theme.muted });
  const gap = 0.38;
  const colW = (SLIDE_W - M * 2 - gap) / 2;
  renderColumn(slide, entry.left || {}, M, 2.34, colW, 3.9, theme.surfaceAlt);
  renderColumn(slide, entry.right || {}, M + colW + gap, 2.34, colW, 3.9, theme.surface);
}

function renderColumn(slide, col, x, y, w, h, fill) {
  addShape(slide, "rect", { x, y, w, h, fill: { color: fill }, line: { color: theme.border, width: 0.9 } });
  addText(slide, col.heading || col.title, { x: x + 0.32, y: y + 0.32, w: w - 0.64, h: 0.36, fontSize: 18, bold: true });
  normalizeBullets(col.items || col.bullets || col.body).slice(0, 5).forEach((item, i) => {
    addText(slide, `${i + 1}.`, { x: x + 0.34, y: y + 1.0 + i * 0.5, w: 0.36, h: 0.25, fontSize: 10, color: theme.accent, bold: true });
    addText(slide, item.text || item.label || item, { x: x + 0.78, y: y + 0.94 + i * 0.5, w: w - 1.08, h: 0.36, fontSize: 12.8, color: theme.text });
  });
}

function renderStats(slide, entry) {
  addTitle(slide, entry.title, M, 0.84, 10.8, 0.74, 31);
  addText(slide, entry.subtitle, { x: M, y: 1.58, w: 8.8, h: 0.42, fontSize: 13, color: theme.muted });
  const stats = Array.isArray(entry.stats) ? entry.stats.slice(0, 4) : [];
  const count = Math.max(stats.length, 1);
  const gap = 0.26;
  const cardW = (SLIDE_W - M * 2 - gap * (count - 1)) / count;
  stats.forEach((stat, i) => {
    const x = M + i * (cardW + gap);
    addShape(slide, "rect", { x, y: 2.46, w: cardW, h: 3.2, fill: { color: theme.surface }, line: { color: theme.border, width: 1 } });
    addText(slide, stat.value, { x: x + 0.28, y: 2.88, w: cardW - 0.56, h: 0.72, fontFace: theme.displayFontFace, fontSize: 34, bold: true, color: i === 0 ? theme.accent : theme.text, align: "center" });
    addText(slide, stat.label, { x: x + 0.28, y: 3.76, w: cardW - 0.56, h: 0.36, fontSize: 14, bold: true, align: "center" });
    addText(slide, stat.caption, { x: x + 0.34, y: 4.38, w: cardW - 0.68, h: 0.64, fontSize: 10.5, color: theme.muted, align: "center" });
  });
}

function renderQuote(slide, entry) {
  addKicker(slide, entry.kicker || "Quote", M, 1.05, 4);
  addText(slide, entry.quote || entry.title, {
    x: M,
    y: 1.66,
    w: 9.9,
    h: 2.7,
    fontFace: theme.displayFontFace,
    fontSize: 30,
    bold: true,
    color: theme.text,
    breakLine: false
  });
  addShape(slide, "line", { x: M, y: 4.72, w: 2.2, h: 0, line: { color: theme.accent, width: 2 } });
  addText(slide, entry.attribution || entry.subtitle, { x: M, y: 4.98, w: 7.4, h: 0.42, fontSize: 13, color: theme.muted });
}

function renderTimeline(slide, entry) {
  addTitle(slide, entry.title, M, 0.84, 10.8, 0.74, 30);
  const items = Array.isArray(entry.items) ? entry.items.slice(0, 6) : [];
  const y = 3.2;
  addShape(slide, "line", { x: M + 0.4, y, w: 11.1, h: 0, line: { color: theme.border, width: 1.4 } });
  const step = 11.1 / Math.max(items.length - 1, 1);
  items.forEach((item, i) => {
    const x = M + 0.4 + step * i;
    addShape(slide, "ellipse", { x: x - 0.13, y: y - 0.13, w: 0.26, h: 0.26, fill: { color: i === 0 ? theme.accent : theme.surface }, line: { color: theme.accent, width: 1 } });
    addText(slide, item.label || String(i + 1), { x: x - 0.42, y: y - 0.72, w: 0.84, h: 0.25, fontSize: 9, color: theme.accent, bold: true, align: "center" });
    addText(slide, item.title, { x: x - 0.88, y: y + 0.38, w: 1.76, h: 0.4, fontSize: 12, bold: true, align: "center" });
    addText(slide, item.text, { x: x - 0.92, y: y + 0.9, w: 1.84, h: 0.72, fontSize: 9.2, color: theme.muted, align: "center" });
  });
}

function renderTable(slide, entry) {
  addTitle(slide, entry.title, M, 0.78, 10.9, 0.72, 29);
  const columns = Array.isArray(entry.columns) ? entry.columns : [];
  const rows = Array.isArray(entry.rows) ? entry.rows : [];
  const tableX = M;
  const tableY = 1.9;
  const tableW = SLIDE_W - M * 2;
  const colW = tableW / Math.max(columns.length, 1);
  const rowH = Math.min(0.52, 4.5 / Math.max(rows.length + 1, 1));
  columns.forEach((col, c) => {
    addCell(slide, tableX + c * colW, tableY, colW, rowH, col, true);
  });
  rows.slice(0, 8).forEach((row, r) => {
    columns.forEach((_, c) => {
      addCell(slide, tableX + c * colW, tableY + rowH * (r + 1), colW, rowH, row[c] || "", false);
    });
  });
}

function addCell(slide, x, y, w, h, text, header) {
  addShape(slide, "rect", {
    x,
    y,
    w,
    h,
    fill: { color: header ? theme.surfaceAlt : theme.surface },
    line: { color: theme.border, width: 0.6 }
  });
  addText(slide, text, { x: x + 0.08, y: y + 0.07, w: w - 0.16, h: h - 0.1, fontSize: header ? 9.5 : 9.2, bold: header, color: header ? theme.text : theme.muted });
}

function renderImageSlide(slide, entry) {
  addTitle(slide, entry.title, M, 0.78, 10.8, 0.72, 29);
  const img = entry.image || {};
  const imgPath = img.path ? path.resolve(specDir, img.path) : null;
  if (imgPath && fs.existsSync(imgPath)) {
    slide.addImage({ path: imgPath, x: M, y: 1.82, w: 6.7, h: 4.35 });
  } else {
    addShape(slide, "rect", { x: M, y: 1.82, w: 6.7, h: 4.35, fill: { color: theme.surfaceAlt }, line: { color: theme.border, width: 1 } });
    addText(slide, img.path ? `Missing image: ${img.path}` : "Image placeholder", { x: M + 0.4, y: 3.78, w: 5.9, h: 0.35, fontSize: 12, color: theme.muted, align: "center" });
  }
  addText(slide, img.caption, { x: M, y: 6.25, w: 6.7, h: 0.26, fontSize: 8.5, color: theme.muted });
  normalizeBullets(entry.bullets || entry.items).slice(0, 4).forEach((item, i) => {
    addText(slide, item.label || `Point ${i + 1}`, { x: 8.0, y: 2.0 + i * 0.82, w: 3.8, h: 0.24, fontSize: 10, bold: true, color: theme.accent });
    addText(slide, item.text || item.label || item, { x: 8.0, y: 2.28 + i * 0.82, w: 3.9, h: 0.44, fontSize: 11.2, color: theme.text });
  });
}

function renderClosing(slide, entry) {
  addKicker(slide, entry.kicker || "Next", M, 1.12, 4);
  addTitle(slide, entry.title, M, 1.62, 9.6, 1.42, 40);
  addText(slide, entry.subtitle, { x: M, y: 3.18, w: 8.4, h: 0.54, fontSize: 15, color: theme.muted });
  normalizeBullets(entry.bullets || entry.items || entry.next).slice(0, 3).forEach((item, i) => {
    addText(slide, `${i + 1}. ${item.text || item.label || item}`, { x: M, y: 4.12 + i * 0.46, w: 9.6, h: 0.32, fontSize: 13.2, color: theme.text });
  });
  addShape(slide, "rect", { x: M, y: 5.9, w: 3.0, h: 0.12, fill: { color: theme.accent }, line: { color: theme.accent, transparency: 100 } });
}

function normalizeBullets(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "string") return { text: item };
      return item || {};
    });
  }
  if (typeof value === "string") return value.split(/\n+/).filter(Boolean).map((text) => ({ text }));
  return [];
}
