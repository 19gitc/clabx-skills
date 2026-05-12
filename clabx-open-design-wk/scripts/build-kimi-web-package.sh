#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
source_skill_name="clabx-open-design-wk"
kimi_skill_name="clabx-open-design-wk-kimi"
skill_dir="$repo_root/$source_skill_name"
dist_dir="$repo_root/dist"
package_root="$dist_dir/$kimi_skill_name-package"
package_dir="$package_root/$kimi_skill_name"
package_path="$dist_dir/$kimi_skill_name.skill"
verify_script="$repo_root/scripts/verify-kimi-web-package.sh"

if [ ! -f "$skill_dir/SKILL.md" ]; then
  echo "missing skill root: $skill_dir/SKILL.md" >&2
  exit 1
fi

mkdir -p "$dist_dir"
rm -rf \
  "$package_root" \
  "$package_path" \
  "$dist_dir/$source_skill_name-kimi-web" \
  "$dist_dir/$source_skill_name-kimi-web.skill" \
  "$dist_dir/$source_skill_name-kimi-web.zip"
mkdir -p "$package_dir"

rsync -a \
  --exclude '.DS_Store' \
  --exclude '__MACOSX' \
  "$skill_dir"/ "$package_dir"/

mkdir -p "$package_dir/assets"
mv "$package_dir/skills" "$package_dir/assets/skills"
mv "$package_dir/templates" "$package_dir/assets/templates"

python3 - "$package_dir/SKILL.md" "$source_skill_name" "$kimi_skill_name" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
source_skill_name = sys.argv[2]
kimi_skill_name = sys.argv[3]
text = path.read_text()
text = text.replace(f"name: {source_skill_name}", f"name: {kimi_skill_name}", 1)
text = text.replace(f"# {source_skill_name}", f"# {kimi_skill_name}", 1)
replacements = {
    "`skills/`": "`assets/skills/`",
    "`skills/<name>/SKILL.md`": "`assets/skills/<name>/SKILL.md`",
    "`skills/html-ppt/`": "`assets/skills/html-ppt/`",
    "`templates/` and `assets/`": "`assets/templates/` and `assets/`",
    "`skills/html-ppt/SKILL.md`": "`assets/skills/html-ppt/SKILL.md`",
    "`skills/open-design-landing/SKILL.md`": "`assets/skills/open-design-landing/SKILL.md`",
    "`skills/simple-deck/SKILL.md`": "`assets/skills/simple-deck/SKILL.md`",
    "`skills/dashboard/SKILL.md`": "`assets/skills/dashboard/SKILL.md`",
    "`skills/live-dashboard/SKILL.md`": "`assets/skills/live-dashboard/SKILL.md`",
    "`skills/critique/SKILL.md`": "`assets/skills/critique/SKILL.md`",
    "find skills -maxdepth 2 -name SKILL.md | sort": "find assets/skills -maxdepth 2 -name SKILL.md | sort",
    "find skills/html-ppt/templates -maxdepth 3 -type f | sort": "find assets/skills/html-ppt/templates -maxdepth 3 -type f | sort",
}

for old, new in replacements.items():
    text = text.replace(old, new)

text = text.replace(
    "preview assets, and visual references.",
    "preview assets, and visual references, including `assets/templates/deck-framework.html` and `assets/templates/kami-deck.html`.",
)

path.write_text(text)
PY

bash "$verify_script" "$package_dir" >/dev/null

if command -v zip >/dev/null 2>&1; then
  (cd "$package_root" && zip -qr "$package_path" "$kimi_skill_name")
else
  (cd "$package_root" && python3 -m zipfile -c "$package_path" "$kimi_skill_name" >/dev/null)
fi

bash "$verify_script" "$package_path"
echo "Wrote $package_path"
echo "Upload this package in Kimi web skill creation; it contains $kimi_skill_name/SKILL.md."
