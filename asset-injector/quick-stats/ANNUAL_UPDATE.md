# Quick Stats: Annual Update Steps

Quick Stats reads most of its data live from the SDO and Census APIs, but a few values must be reviewed by hand each year. All of them are in the **"Settings to review each year"** block at the top of `quick-stats.js`, plus the CPI table lower in the same file.

## When new SDO population estimates are published (usually once a year)

Mostly automatic. The latest estimate year is read from the `componentYRS` API, and the forecast column is "latest estimate year + 5".

1. Load the page and confirm the table headings show the new year (e.g. "Number, 2026") and the forecast column moves to year + 5.
2. Update `FALLBACK_ESTIMATE_YEAR` to the new estimate year. It is used only when the `componentYRS` API cannot be read, so it should not lag behind.
3. Spot check statewide, one county, and Broomfield (FIPS 14, a combined city/county) against the SDO lookup tools.

## When a new ACS 5-year vintage is released (typically each December)

Not automatic. Until you update it, the Census-based sections (Housing Tenure and Selected Statistics) keep showing the older vintage.

1. Confirm the new ACS 5-year data is available from the Census API for the new year, for example:
   `https://api.census.gov/data/<year>/acs/acs5?get=NAME,B25003_002E&for=state:08`
2. Set `ACS_YEAR` to the new vintage year (e.g. `2025` for the 2021-2025 ACS).
3. Add the new year to `SDO_CPI_TABLE` (and the comparison year if missing; the comparison year is `ACS_YEAR - 5`). Use the same CPI series as the existing entries. If a needed year is missing, the Selected Statistics section shows an error and logs "SDO_CPI_TABLE is missing ..." in the browser console, rather than showing wrong numbers.
4. Check that the table codes used still exist and mean the same thing: B25003 (tenure), B06012 (poverty), B15003 (education), B19013 (income), B25097 (home value), B25064 (rent).
5. Run the checks below, then update Drupal (see `DEPLOYMENT.md`).

Open question to record here: which CPI series and source the existing `SDO_CPI_TABLE` values come from.

## Checks after any annual update

- Test locally with `dev-harness.html` (see `LAUNCH_PLAN.md`, step 4): statewide, a typical county, Broomfield, and a small county such as Hinsdale (FIPS 53).
- Browser console shows no errors.
- No "NaN", "Infinity", or empty sections in the tables.
- Compare at least the population totals and one Census value with the source API.
- Paste the updated `quick-stats.js` into the Drupal JS injector and record the commit in `DEPLOYMENT.md`.
