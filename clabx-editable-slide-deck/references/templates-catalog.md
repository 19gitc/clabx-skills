# Templates Catalog

The skill ships with reusable starters under `templates/specs/` and matching
outline starters under `templates/outlines/`. Use them to avoid blank-page
authoring, then replace all sample claims and numbers with the user's real
content.

## How To Scaffold

```bash
node /path/to/clabx-editable-slide-deck/scripts/new-deck.mjs --list
node /path/to/clabx-editable-slide-deck/scripts/new-deck.mjs product-review editable-slide-deck/product-review
```

The scaffold creates:

```text
deck-spec.json
outline.md
source.md
package.json
preview/
```

## Available Templates

| Template | Slides | Preset | Use for |
| --- | ---: | --- | --- |
| `product-review` | 8 | `product-studio` | Product readouts, roadmap reviews, adoption/retention narratives |
| `venture-pitch` | 10 | `venture-clean` | Seed/Series A pitch decks, business plans, investor updates |
| `tech-sharing` | 8 | `blueprint` | Engineering talks, architecture reviews, internal technical sharing |
| `weekly-report` | 7 | `minimal-exec` | Team weekly, status review, operating rhythm update |
| `course-module` | 7 | `teaching-light` | Lessons, workshops, training modules, beginner explainers |

## Template Selection

- Use `product-review` when the deck needs product metrics, adoption insights,
  roadmap tradeoffs, or launch learnings.
- Use `venture-pitch` when the story is market, problem, solution, traction,
  business model, and ask.
- Use `tech-sharing` when the audience needs architecture, tradeoffs, risks,
  migration steps, or operational guidance.
- Use `weekly-report` when the output should be concise and repeatable.
- Use `course-module` when the deck should teach a concept with examples and
  recap questions.

## Editing Rules

- Replace all sample numbers with real numbers or remove the metric.
- Keep citations in `citation` fields for any data slide.
- Keep speaker guidance in `notes`, not visible slide text.
- Do not change the generator scripts for one-off copy edits; edit
  `deck-spec.json`.
- If the template includes too many slides, delete complete slide objects. Do
  not leave hidden placeholders.
