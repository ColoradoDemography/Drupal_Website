# Handoff: Population Dashboard Refactor (Phase 3)

## 1. Context Summary
We have completed the **Compatibility Scan** for \`SDO_Web_Migration/charts/drupal-population-prototype/app.js\`. This dashboard is currently a "Monolith" that needs to be decoupled and integrated with \`Global_SDO_Utilities_v2_combined.js\`.

## 2. Compatibility Scan Results
### Redundant (Remove & Replace)
*   **Geography Metadata:** Remove \`countyArr\` and \`regionArr\` (Lines 31-81). Use global \`SDO_COUNTY_NAMES\`.
*   **Geography Mapping:** Remove \`regionCOL(regnum)\`. Use global \`sdoGetRegionCounties(regnum)\`.
*   **UI Helpers:** Remove \`popDropdown\`. Use global \`sdoPopulateGeographies\`.
*   **Formatters:** Replace all \`d3.format\` instances with global \`formatSDO(val, 'num')\`.

### Unique (Keep & Modularize)
*   **Growth Logic:** Preserve absolute change and annual growth rate calculations (Lines 226-258).
*   **ECharts Visuals:** Preserve the "Estimate vs. Forecast" trend logic and the historical recession bands.
*   **Small Multiples:** Preserve the synchronized multi-chart grid logic.

## 3. Immediate Next Steps for Next Session
1.  **Surgical Strip:** Open \`app.js\` and delete the redundant code identified above.
2.  **Global Integration:** Replace local function calls with their \`sdo*\` global counterparts.
3.  **HTML Update:** Update \`index.html\` to load the global utilities script tag before the dashboard's \`app.js\`.
4.  **Validation:** Verify that the dashboard still correctly calculates growth rates and displays the ECharts timeline correctly.

## 4. Technical Notes
*   **Charting Library:** Confirmed as **Apache ECharts (v5.5.0)**.
*   **Dependencies:** D3.js (v7.8.5) and Global Utilities.
*   **Breaking Point:** The dashboard should now consume the dynamic breaking point from `SDO_STATE.latestEstimateYear` (initialized by `sdoPopulateYears`).

