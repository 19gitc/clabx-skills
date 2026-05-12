#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <package-dir-or-zip>" >&2
  exit 2
fi

input=$1
skill_name=clabx-open-design-wk-kimi
tmp=

cleanup() {
  if [ -n "${tmp:-}" ] && [ -d "$tmp" ]; then
    rm -rf "$tmp"
  fi
}
trap cleanup EXIT

if [ -d "$input" ]; then
  if [ -f "$input/SKILL.md" ]; then
    root=$input
  elif [ -f "$input/$skill_name/SKILL.md" ]; then
    root="$input/$skill_name"
  else
    echo "missing required file: SKILL.md or $skill_name/SKILL.md" >&2
    exit 1
  fi
elif [ -f "$input" ]; then
  case "$input" in
    *.zip|*.skill)
      tmp=$(mktemp -d)
      unzip -q "$input" -d "$tmp"
      root="$tmp/$skill_name"
      if [ ! -f "$root/SKILL.md" ]; then
        echo "zip must contain $skill_name/SKILL.md" >&2
        exit 1
      fi
      ;;
    *)
      echo "unsupported package file: $input" >&2
      exit 2
      ;;
  esac
else
  echo "package not found: $input" >&2
  exit 1
fi

require_file() {
  local file=$1
  if [ ! -f "$root/$file" ]; then
    echo "missing required file: $file" >&2
    exit 1
  fi
}

require_file "SKILL.md"
require_file "assets/skills/html-ppt/SKILL.md"
require_file "assets/skills/simple-deck/SKILL.md"
require_file "assets/templates/deck-framework.html"
require_file "assets/templates/kami-deck.html"
require_file "assets/frames/browser-chrome.html"
require_file "craft/anti-ai-slop.md"

if ! grep -q "^name: $skill_name$" "$root/SKILL.md"; then
  echo "SKILL.md frontmatter must use name: $skill_name" >&2
  exit 1
fi

if [ -f "$root/$skill_name/SKILL.md" ]; then
  echo "package has an extra $skill_name wrapper directory" >&2
  exit 1
fi

if [ -d "$root/skills" ] || [ -d "$root/templates" ]; then
  echo "Kimi package should place nested skills/templates under assets/" >&2
  exit 1
fi

if ! grep -q "assets/skills/html-ppt/SKILL.md" "$root/SKILL.md"; then
  echo "SKILL.md must reference assets/skills paths" >&2
  exit 1
fi

if ! grep -q "assets/templates/deck-framework.html" "$root/SKILL.md"; then
  echo "SKILL.md must reference assets/templates paths" >&2
  exit 1
fi

skill_count=$(find "$root/assets/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')
if [ "$skill_count" -lt 70 ]; then
  echo "expected at least 70 nested skills, found $skill_count" >&2
  exit 1
fi

design_system_count=$(find "$root/design-systems" -mindepth 2 -maxdepth 2 -name DESIGN.md | wc -l | tr -d ' ')
if [ "$design_system_count" -lt 70 ]; then
  echo "expected at least 70 design systems, found $design_system_count" >&2
  exit 1
fi

echo "Kimi web package verified: $skill_count nested skills, $design_system_count design systems"
