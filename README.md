# clabx-skills

Collection repository for CLABX skills. Each top-level directory is a standalone
skill that can be installed or symlinked independently.

## Pull Everything

```bash
git clone git@github.com:19gitc/clabx-skills.git
```

## Pull One Skill Only

Use Git sparse checkout when you only need one skill:

```bash
git clone --filter=blob:none --sparse git@github.com:19gitc/clabx-skills.git
cd clabx-skills
git sparse-checkout set clabx-open-design-wk
```

Add another skill later:

```bash
git sparse-checkout add <other-skill-name>
```

## Install for Codex

```bash
ln -s "$PWD/clabx-open-design-wk" "${CODEX_HOME:-$HOME/.codex}/skills/clabx-open-design-wk"
```

## Import into Kimi Web

Kimi web skill creation should import the generated `clabx-open-design-wk-kimi`
package, not the source skill directory. The package preserves the Kimi skill
directory name and follows the standard bundled-resource layout by moving
non-standard root resources into `assets/`:

```text
clabx-open-design-wk-kimi/
  SKILL.md
  assets/
    skills/
    templates/
    frames/
  craft/
  design-systems/
```

Build a web-upload package first:

```bash
bash scripts/build-kimi-web-package.sh
```

Then upload `dist/clabx-open-design-wk-kimi.skill` in Kimi web. In Kimi, look
for the imported skill named `clabx-open-design-wk-kimi`. Do not upload the
collection root directory directly; use the generated package so nested skills
and templates are included as standard `assets/` resources.

## Skills

- `clabx-open-design-wk` - Open Design creative skill workspace for decks,
  landing pages, dashboards, prototypes, design systems, craft references, and
  prompt templates.
