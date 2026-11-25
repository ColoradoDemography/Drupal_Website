# Quick Stats Launch Plan

Goal: a stable, traceable Quick Stats release, isolated from prototype work. This is not a refactor of every prototype or of the lookup architecture.

Live preview page: https://demography.colorado.gov/quick-stats (the whole site is currently a public draft/preview site).

Working branch: `quick-stats-fixes`. Merge via pull request, reviewed by the other developer.

## Roles and constraints

- Drupal pastes (embed block, CSS injector, JS injector) are done manually by: _TBD_
- Reviewer for the launch PR: _TBD_
- We cannot clear the Drupal cache ourselves. Ask the site admin if stale assets are suspected.
- Asset Injector rules apply by path, not draft status. Pasting over an existing injector changes the live page immediately.
- `asset-injector/` is documentation/source only. Nothing deploys from `main` automatically.

## Definition of done

Quick Stats is launch-ready when every P0 and P1 item below is checked, the acceptance tests pass on the Drupal preview page, and the deployed commit is recorded in `DEPLOYMENT.md`.

## Steps

### 1. Baseline

- [ ] Confirm `main` matches what is pasted in Drupal: copy each live snippet to a temp file and run `git diff --no-index <temp> <repo file>`.
- [ ] Save the current Drupal HTML, CSS and JS snippets outside Git (rollback copies).
- [ ] Record the shared utility currently loaded and which injectors load it.
- [ ] Record every page path where each Quick Stats injector is scoped.
- [x] Create working branch `quick-stats-fixes`.

### 2. Fix Quick Stats defects (Quick Stats only)

P0
- [x] Race/ethnicity label mapping: verified, no fix needed. `genRaceEth` uses `county_sya_race_estimates_current`, which returns "White alone", "Two or More", etc.; appending " NH" matches the code's list. Statewide Hispanic + non-Hispanic = 5,987,128 for 2024, identical whether queried as `county=0` or as the 64-county list. (An earlier review wrongly flagged this after testing a different endpoint.)
- [x] Fix the `#demo-section` jump link: the heading already existed in Drupal and was missing from the repo; synced into `quick-stats.html`.
- [x] Add visible loading, empty and API-failure states for every table, including Census API calls. Also prevents a slow response for a previous geography from overwriting the current one. Tested with `dev-harness.html` (`?fail=gis`, `?fail=census`, `?empty=gis`).

P1
- [ ] Remove the duplicate Census API key fallbacks; keep the key in one place.
- [ ] Review the hardcoded 2025 fallback year (`componentYRS` failure behavior).
- [ ] Decide and document 2030 forecast handling (derive from API, or keep fixed with a documented update step).
- [ ] Decide how `acsYear` (2024) and the CPI table (2010-2024) are updated each year, and document it.
- [ ] Verify statewide, county and Broomfield (FIPS 14, combined city/county) calculations.
- [ ] Verify mobile layout.

Do not redesign the shared utility in this step.

### 3. Shared utility decision

- [ ] List which utility functions Quick Stats actually uses.
- [ ] Decide: (a) inline them into `quick-stats.js`, or (b) create a small versioned file (`sdo-core-v1.js`).
- [ ] Do not modify `Global_SDO_Utilities_v2_combined.js`; other apps depend on it.

### 4. Test outside Drupal

Use a local harness served over HTTP, then browser DevTools overrides on the real page.

- [ ] Colorado statewide, Adams, Broomfield, a rural county, a low-population county
- [ ] Mobile and desktop viewports
- [ ] Slow API and failed API (DevTools throttling / Block request URL)
- [ ] Failed Census API
- [ ] Repeated geography changes, and returning to statewide
- [ ] Behavior does not initialize twice
- [ ] Missing or negative API values, Census rankings, statewide rollups
- [ ] No JavaScript errors in the console
- [ ] Basic accessibility: keyboard use of the dropdown, table headers

### 5. Deploy to Drupal preview

Prefer creating a new injector scoped to a test path, or confirm the preview-only status of the page before overwriting.

1. [ ] Paste HTML into the Drupal block.
2. [ ] Paste CSS into its injector.
3. [ ] Paste JS into its injector.
4. [ ] Paste the required shared utility (if any).
5. [ ] Confirm the injector path scope.
6. [ ] Test the page (hard refresh; ask the admin about cache if stale).
7. [ ] Record the commit and page in `DEPLOYMENT.md`.

### 6. Dependency checks

- [ ] External CDN URLs resolve, all over HTTPS.
- [ ] GIS API endpoints return expected content.
- [ ] Census API key works (it is public in client JS by nature; keep it in one place).
- [ ] No debug output left in the code.
- [ ] Acceptance checklist completed.

### 7. Review and merge

- [ ] Open a pull request from `quick-stats-fixes`.
- [ ] Other developer reviews the diff.
- [ ] Merge only after Drupal preview testing passes.

### 8. Public launch

- [ ] Rollback copies of existing Drupal snippets saved and findable.
- [ ] Update production HTML block, CSS injector, JS injector, and any shared utility.
- [ ] Confirm production path scope.
- [ ] Run the acceptance checklist; monitor the console and API errors.
- [ ] Tag the commit that was actually deployed:
  `git tag -a quick-stats-launch -m "Quick Stats public launch"` then `git push origin quick-stats-launch`
- [ ] Record the deployed commit in `DEPLOYMENT.md`.

GitHub alone does not indicate a successful launch.

### 9. Freeze, then resume prototypes

- [ ] Change Quick Stats files only to fix launch defects.
- [ ] Mark prototype folders clearly as non-production.
- [ ] Split the global utility only when the first new lookup domain needs it.

## Priorities

| Priority | Work |
|---|---|
| P0 | Race label fix, broken jump link |
| P0 | API and Census failure handling |
| P0 | Drupal preview deployment and test |
| P1 | County/statewide calculation verification |
| P1 | Mobile verification |
| P1 | Deployment record and release commit |
| P2 | Utility module splitting |
| P2 | Combined lookup framework |
| P2 | Other lookup conversions |

## Git posture

- Launch PR and shared utility changes: reviewed.
- Small prototype or documentation changes: feature branch, PR optional.
- Public Drupal deployment is a separate acceptance step.
- After launch, do not change `main` without a branch and review.
