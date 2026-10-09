# SDO Web Migration: Refactoring Roadmap

This document outlines the phased plan for transitioning 40+ SDO data applications from legacy monolithic files to a modern, decoupled **Core + Module** architecture.

## Phase 1: Solidify the Global Core (The Foundation) - ✅ COMPLETED
**Goal:** Lock in the shared functions and data dictionaries to ensure all 40 applications pull from a single source of truth.

1.  **Dynamic breaking point:** ✅ Updated Global_SDO_Utilities_v2_combined.js with `sdoGetLatestEstimateYear` and `SDO_STATE`.
2.  **Standardize Geographies:** ✅ Dictionaries are centralized and "Steamboat Springs" syntax fixed.
3.  **UI Utility Migration:** ✅ Centralized `formatSDO`, `sdoPopulateYears`, and `sdoPopulateGeographies`.

## Phase 2: The "Lookup Table" Batch (20 Applications)
**Goal:** Modularize and combine the lookup tools into unified Regional + County interfaces.

1.  **Pattern Lockdown:** ✅ lookups/sya-age-combined-lookup is refactored as the "Gold Standard" template (using `SDO_STATE`).
2.  **Feature Parity:** Identify the ~20 legacy lookup types (e.g., Race, Ethnicity, Jobs, Households).
3.  **The "Surgical Extraction" (Agent-Led):** 
    *   For each legacy tool, use a Gemini Sub-Agent to extract the specific D3 processing and API URL logic.
    *   Discard legacy UI and Geography hardcoding.
    *   Wrap extracted logic into a lean app.js using the global template.

## Phase 3: The "Chart Dashboard" Batch (20 Applications) - 🚀 NEXT UP
**Goal:** Transition dashboards to the modular model and migrate visualizations from Plotly to Apache ECharts.

1.  **Decouple Population Prototype:** Refactor charts/drupal-population-prototype as the first dashboard blueprint.
    *   Extract chart configuration logic from app.js.
    *   Integrate with Global_SDO_Utilities_v2_combined.js.
2.  **ECharts Standardization:** Establish a global charting utility (e.g., sdo-ui-charts.js) to handle shared SDO color palettes and responsiveness.
3.  **Batch Conversion:** Iteratively refactor the remaining 19 dashboards, replacing Plotly calls with standardized ECharts modules.

## Phase 4: Scaling & Validation (Batch Processing)
**Goal:** Use Gemini CLI Sub-Agents to accelerate the refactor of the remaining apps.

1.  **The "Migration Script" Approach:** Create a meta-instruction for the generalist sub-agent that defines the "Source" (legacy JS) and "Target" (Modular app.js).
2.  **Automated Validation:** Use the agent to run syntax checks and verify that all loadScript dependencies are correctly defined in each new index.html.
3.  **Sanity Check:** Final audit of the 40 apps to ensure no hardcoded years or local geography dictionaries remain.

## Next Immediate Step
*   **Decouple SDO_Web_Migration/charts/drupal-population-prototype/app.js**: 
    1. Identify functions in this monolith that overlap with the new Global Utilities.
    2. Strip the monolith and create a modular app.js.
    3. Update the index.html to load global dependencies first.
