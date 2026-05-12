#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specsDir = path.join(skillDir, "templates", "specs");
const outlinesDir = path.join(skillDir, "templates", "outlines");
const args = process.argv.slice(2);

if (args.includes("--help") || args.length === 0) {
  printHelp();
  process.exit(0);
}

if (args.includes("--list")) {
  listTemplates();
  process.exit(0);
}

const force = args.includes("--force");
const positional = args.filter((arg) => !arg.startsWith("--"));
const templateName = positional[0];
const outDir = positional[1] ? path.resolve(positional[1]) : path.resolve(`editable-slide-deck/${templateName}`);

if (!templateName) {
  printHelp();
  process.exit(1);
}

const specPath = path.join(specsDir, `${templateName}.json`);
const outlinePath = path.join(outlinesDir, `${templateName}.md`);

if (!fs.existsSync(specPath)) {
  console.error(`Unknown template: ${templateName}`);
  listTemplates();
  process.exit(1);
}

if (fs.existsSync(outDir) && !force && fs.readdirSync(outDir).length > 0) {
  console.error(`Output directory is not empty: ${outDir}`);
  console.error("Pass --force to write missing files and overwrite deck-spec.json/source.md/outline.md.");
  process.exit(1);
}

fs.mkdirSync(path.join(outDir, "preview"), { recursive: true });
copyFile(specPath, path.join(outDir, "deck-spec.json"), force);
if (fs.existsSync(outlinePath)) copyFile(outlinePath, path.join(outDir, "outline.md"), force);
writeFile(path.join(outDir, "source.md"), sourceTemplate(templateName), force);
writeFile(path.join(outDir, "package.json"), packageTemplate(templateName), false);

console.log(`Created ${outDir}`);
console.log("");
console.log("Next commands:");
console.log(`  cd ${outDir}`);
console.log("  npm install  # recommended; the skill also has a bundled pptxgenjs fallback");
console.log(`  node ${path.join(skillDir, "scripts", "build-editable-pptx.mjs")} deck-spec.json ${templateName}.pptx`);
console.log(`  node ${path.join(skillDir, "scripts", "build-html-preview.mjs")} deck-spec.json preview/index.html`);

function printHelp() {
  console.log("Usage:");
  console.log("  node scripts/new-deck.mjs --list");
  console.log("  node scripts/new-deck.mjs <template> [out-dir] [--force]");
  console.log("");
  listTemplates();
}

function listTemplates() {
  const templates = fs.readdirSync(specsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.basename(name, ".json"))
    .sort();
  console.log("Templates:");
  for (const name of templates) console.log(`  - ${name}`);
}

function copyFile(from, to, overwrite) {
  if (fs.existsSync(to) && !overwrite) return;
  fs.copyFileSync(from, to);
}

function writeFile(to, content, overwrite) {
  if (fs.existsSync(to) && !overwrite) return;
  fs.writeFileSync(to, content, "utf8");
}

function sourceTemplate(name) {
  return `# Source Notes

Template: ${name}

Replace this file with the user's source material, notes, transcript, brief,
data points, and citations. Keep raw facts here so deck-spec.json can stay
focused on slide-ready content.
`;
}

function packageTemplate(name) {
  return JSON.stringify({
    private: true,
    type: "module",
    scripts: {
      pptx: `node ${path.join(skillDir, "scripts", "build-editable-pptx.mjs")} deck-spec.json ${name}.pptx`,
      preview: `node ${path.join(skillDir, "scripts", "build-html-preview.mjs")} deck-spec.json preview/index.html`
    },
    dependencies: {
      pptxgenjs: "^4.0.1"
    }
  }, null, 2) + "\n";
}
