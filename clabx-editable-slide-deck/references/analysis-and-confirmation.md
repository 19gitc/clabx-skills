# Analysis and Confirmation

Use this file before writing the deck.

## Analyze The Source

Create `analysis.md` with these fields:

```markdown
# Deck Analysis

Topic:
Source language:
Output language:
Audience:
Content type:
Recommended slide count:
Recommended style preset:
Required citations:
Likely slide types:
Risks:
```

## Content Signals

Use the first matching signal unless the user gives a stronger preference.

| Source signals | Recommended preset |
| --- | --- |
| architecture, system, API, data flow, engineering | `blueprint` |
| executive, board, decision, strategy, quarterly | `minimal-exec` |
| investor, fundraising, market, traction, revenue | `venture-clean` |
| product, SaaS, feature, roadmap, onboarding | `product-studio` |
| research, academic, paper, evidence, literature | `academic` |
| tutorial, workshop, class, beginner, explain | `teaching-light` |
| incident, risk, safety, compliance, red-team | `alert-review` |
| brand, story, launch, editorial, keynote | `editorial-bold` |
| social post, carousel, lifestyle, consumer | `social-editorial` |

Fall back to `product-studio` for general business decks and `blueprint` for
technical decks.

## Slide Count Heuristic

| Source length | Recommended slides |
| --- | --- |
| Under 800 words | 5-8 |
| 800-2000 words | 8-12 |
| 2000-4000 words | 12-18 |
| Over 4000 words | 18-24, or split into parts |

Adjust by audience:

- Executives: reduce by 20-30%; use sharper headlines.
- Beginners: add framing and transition slides.
- Experts: allow denser evidence slides, but keep one main idea per slide.
- Live talk: include speaker notes and rhythm slides every 4-5 slides.

## Confirmation Questions

Ask these before generating the full deck unless the current request explicitly
skips confirmation.

1. **Style:** "I recommend `<preset>` because `<reason>`. Use it, or choose another preset?"
2. **Audience:** "Who is this for: executives, experts, general audience, students, customers, or another group?"
3. **Length:** "Use `<N>` slides, or choose another count?"
4. **Language:** "Use `<language>`, or switch language?"
5. **Review:** "Review the outline before generation, review the HTML preview after generation, or generate directly?"

If the user already provided enough information, state the assumptions and ask
for a single confirmation.

## Existing Output Handling

If `editable-slide-deck/<topic-slug>/` exists, ask one question with these
options:

- reuse existing workspace and regenerate from `deck-spec.json`
- back up the folder and regenerate from scratch
- create a new slug
- stop

Backup folder format:

```text
<topic-slug>-backup-YYYYMMDD-HHMMSS
```

## Outline Rules

- Cover and closing slides are required.
- Narrative headlines are preferred over label headlines.
- Every statistic must have a source note in the outline and spec.
- No placeholder text, fake customer names, fake metrics, or lorem ipsum.
- Speaker notes belong in `notes`, never as visible slide text.
