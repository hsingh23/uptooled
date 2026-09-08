# 008 — Related tools computed in the generator, not the client

- **Date:** 2025-06-10
- **Commits:** `3603938`/`1eed463` (feature + layout rework, PR #22),
  `2f71759` (revert, PR #26), `2627e91` (clean re-land, PR #23)
- **Status:** Accepted

## Context

"Similar tools" links were wanted for discovery. The first landing bundled
the scoring with a responsive layout rework of the viewer. The combined
diff was risky; the layout half was unwanted, so the entire PR was reverted
and the feature re-landed alone — with scoring moved into `generate.js`.

## Decision

`generate.js` scores pairwise keyword-token overlap between tools and
stores the top 3 matches per tool in `tools.json` as `related`. The front
end only renders what the catalog provides.

## Alternatives

- Client-side scoring at runtime — rejected: duplicates work per visitor
  and was part of the reverted bundle's complexity.
- Manual curation — rejected: maintenance burden.

## Consequences

- Related links update automatically when tools or keywords change (on
  regenerate).
- Quality is bounded by keyword quality; weak keywords yield weak links.
- The revert/re-land pair is the repo's cautionary tale about bundling
  features with refactors.
