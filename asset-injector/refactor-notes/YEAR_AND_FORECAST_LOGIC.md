# Technical Audit: "Current Year" & Forecast Breaking Point

## 1. Overview
In the SDO data tools, the "Current Year" serves as the critical pivot point between **Demographic Estimates** (historical data) and **Demographic Forecasts** (future projections). Accurate handling of this point is vital for:
*   Visualizing historical vs. projected trends.
*   Automating data ingestion when the database is updated annually.
*   Applying correct styling in user interfaces (e.g., highlighting future years in red/bold).

## 2. Legacy Implementation Analysis
Based on an audit of `legacy-files/profile.js`, `funct.js`, and `lookup.js`:
*   **Hardcoded Constants:** The breaking point was frequently hardcoded (e.g., `var yr_list = 2021;` in `profile.js`). This required manual developer intervention across multiple files every year.
*   **Inconsistent Logic:** Different applications sometimes had different breaking points depending on when they were last updated, leading to potential data misalignment across the site.
*   **Visual Distinction:** The legacy `popYrdd` function used a hardcoded check on `j.datatype == "Estimate"` to toggle CSS styles (black for estimates, red/bold for forecasts).

## 3. New Global Utilities Analysis
Current state of `Global_SDO_Utilities_v2_combined.js`:
*   **Infrastructure Ready:** The new architecture already consumes the `https://gis.dola.colorado.gov/lookups/componentYRS` endpoint.
*   **UI-Only Logic:** The `sdoPopulateYears` function correctly styles the dropdowns based on the `datatype` field from the API, but it does **not** yet store or export the "Latest Estimate Year" for use in data processing logic.

## 4. Findings & Recommendations
To ensure the new modular architecture is more resilient and easier to maintain than the legacy system, we recommend the following:

### Recommendation A: Dynamic Breaking Point
Instead of hardcoding the current year, implement a utility function that calculates it dynamically from the API response.
```javascript
/**
 * Finds the latest year in the dataset marked as an 'Estimate'.
 * This defines the breaking point between history and forecast.
 */
function sdoGetLatestEstimateYear(yeardata) {
    const estimates = yeardata.filter(d => d.datatype === "Estimate");
    if (estimates.length === 0) return null;
    return Math.max(...estimates.map(d => parseInt(d.year, 10)));
}
```

### Recommendation B: Centralized State Config
Store the calculated breaking point in a global configuration object after the initial data load. This allows application-specific logic (like `validateAndProcessExecution`) to instantly know the "Current Year" without redundant calculations.

### Recommendation C: Automated Data Ingestion
By using a dynamic breaking point, future database updates (adding a new year of estimates) will automatically ripple through all 40 applications. The UI will update the "Estimate" vs. "Forecast" styling and the "Current Year" logic will advance forward without a single line of code changing in the individual `app.js` modules.

## 5. Implementation Status (June 2026)
As of June 4, 2026, **Recommendations A and B** have been fully implemented in `global/Global_SDO_Utilities_v2_combined.js`:

*   **`SDO_STATE`:** A global runtime configuration object is now available to store the `latestEstimateYear`.
*   **`sdoGetLatestEstimateYear()`:** This utility function is now available to dynamically determine the breaking point from API metadata.
*   **Auto-Initialization:** The `sdoPopulateYears()` function has been updated to automatically calculate and store the latest estimate year in `SDO_STATE` upon the first data load.

## 6. Next Steps for Developer Review
*   Confirm if any legacy applications rely on "Current Year" offsets (e.g., `currentYear - 1`) that might need special handling.
*   Verify that the `datatype` string ("Estimate") is consistent across all SDO API endpoints.
