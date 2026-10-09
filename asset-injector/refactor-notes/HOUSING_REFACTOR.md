# SDO Housing Dashboard Refactor: Architectural Learnings & API Rules

This document outlines critical differences between the standard Population APIs and the Housing Profile API discovered during the decoupled ECharts refactor. 

When building dashboards that query `https://gis.dola.colorado.gov/lookups/profile`, developers must strictly adhere to the following rules to prevent backend SQL crashes and downstream Drupal Bootstrap collapses.

## 1. The Profile API: Strict Region Explosion Requirement
Unlike the Population SYA endpoint, the Housing Profile endpoint **does not support pre-aggregated state totals or the "Zero-Intercept" rule**.

*   **The Issue:** Passing `county=0` to the `/lookups/profile` endpoint results in a missing parameter error.
*   **The Rule:** All regional queries, including the State Total (Region 0), must explicitly explode into a comma-separated string of their component county FIPS codes.
*   **The Implementation:** Always use the `sdoGetRegionCounties()` global utility to flatten the region before fetching:

```javascript
// WRONG (Works for Population, Fails for Housing):
let fips_list = (geotype === "region" && fips === "0") ? "0" : explode(fips);

// CORRECT (Mandatory for Housing Profile API):
let fips_list;
if(geotype === "region") {
    // Explodes all regions, including State Total (0), into 64 counties
    fips_list = sdoGetRegionCounties(parseInt(fips)).map(d => parseInt(d)).join(",");
} else {
    fips_list = parseInt(fips);
}
```
## 2. The Profile API: Strict Historical Estimate Boundary (No Forecasts)
The SDO component year dictionary (/lookups/componentYRS) returns an array of years extending out to 2050. While population datasets contain forecast models for these future years, the Housing Profile database only contains historical estimates.

The Issue: Querying the profile endpoint for years beyond the latest estimate year (e.g., querying 2024–2050) causes the backend SQL query to fail. Instead of returning an empty JSON array, the DOLA GIS server returns a plain-text HTML error ("one of your parameters is missing or incorrect").

The Rule: You must restrict the ECharts timeline generation logic to the latestEstimateYear.

The Implementation: Leverage the sdoGetLatestEstimateYear utility to calculate the maximum ceiling:

```javascript
// WRONG (Fails if yeardata includes Forecast years out to 2050):
let max_year = d3.max(yeardata.map(d => d.year)); 

// CORRECT (Prevents SQL crashes by stopping at the latest estimate):
SDO_STATE.latestEstimateYear = sdoGetLatestEstimateYear(yeardata);
let max_year = SDO_STATE.latestEstimateYear;
```
## 3. Unhandled API Rejections and Drupal Bridge Collapses
A crucial lesson regarding the Drupal "Hybrid-Bubble" Asset Injector architecture is how it handles failed API promises.

* The Issue: If d3.json() receives the plain-text HTML error described above, it throws a SyntaxError: Unexpected token 'o', "one of you"... is not valid JSON.

* The Cascade: If this promise rejection is not caught and handled cleanly, it bubbles up to Drupal's aggregated theme layers. This interrupts the execution thread, causing asynchronous theme dependencies (like Bootstrap's tooltip/popover engine) to fail, resulting in the fatal Uncaught TypeError: Cannot set properties of undefined (setting 'Bridge') console error.

* The Rule: Every d3.json() fetch must conclude with a robust .catch() block that at minimum hides the ECharts loading spinners and securely logs the error without halting the main JavaScript thread.

```javascript
d3.json(url).then(data => {
    // ... render logic ...
}).catch(e => {
    console.error("SDO API Error: Target endpoint failed to return valid JSON.", e);
    // Mandatory: Hide UI loaders to prevent infinite spinning states
    myChart.hideLoading(); 
});
```