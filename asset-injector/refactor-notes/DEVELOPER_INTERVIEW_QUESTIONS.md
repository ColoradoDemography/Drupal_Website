# Developer Interview: Annual Update & Legacy System Audit

This document contains targeted questions for the current developer to help bridge the gap between the legacy system and the new automated architecture.

## 1. The "Breaking Point" (Estimate vs. Forecast)
*   "In the legacy code, I see the breaking point between Estimates and Forecasts is sometimes hardcoded (e.g., `var yr_list = 2021`). **When new data is released, how many different files do you currently have to manually edit to move that line forward?**"
*   "Are there any datasets where a year could be *both* an Estimate and a Forecast simultaneously (like a 'Preliminary Estimate') that might need a third color/style in the dropdowns?"

## 2. API Consistency
*   "We are now using the `datatype` field ('Estimate' or 'Forecast') from the API to drive the UI automatically. **Does every SDO API endpoint (Race, Jobs, Ethnicity, etc.) consistently return this `datatype` field, or are there some older ones we need to watch out for?**"
*   "I noticed the **LODES API call** (for commuting data) seems hardcoded to 2021 in the legacy files. Does that API follow the same year-listing pattern as the others?"

## 3. "Vintage" vs. "Data Year"
*   "I see a `vintage` variable used in several citations. **Is the 'Vintage' always the same as the 'Latest Estimate Year,' or does it refer to the year the Census released the data?** (We want to make sure the automated citations in the footer are accurate)."

## 4. Table Headers & Hardcoding
*   "In some legacy tables, I found hardcoded headers like `'2030 Forecast'`. **When the forecast is eventually extended to 2050, how do those table headers get updated?** Is that a manual 'find and replace' task currently?"

## 5. Offset Logic
*   "Are there any applications that rely on **year offsets**? For example: 'Always show the current estimate minus 5 years' or 'Compare the latest estimate to the 2010 Census baseline'?"

## 6. The "Update Day" Workflow
*   "Walk me through a typical 'Update Day.' Once the database team says the 2022 Estimates are live, **what is the very first thing you do to the website code?**"

---
**Goal of this interview:** To confirm if the new `SDO_STATE` and global dynamic logic can truly handle 100% of the update work, or if we still need to build in special "exception handling" for specific apps like the LODES or Jobs lookups.
