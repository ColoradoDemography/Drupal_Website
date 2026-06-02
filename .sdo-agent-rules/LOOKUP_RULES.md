# SDO Lookup Table Refactoring Rules & Standards
## Workspace Context: Drupal Decoupled Migration Framework

This document outlines the strict architectural standards, API constraints, and boilerplate templates required to refactor legacy SDO client-side data query tools into modern, decoupled Drupal assets. All automated agents and human developers must follow these constraints to ensure stability inside aggregated production CMS environments.

---

## 🏗️ 1. Architectural Philosophy: The Hybrid-Bubble

Every lookup application must be cleanly separated into two distinct components:
1. **The HTML Snippet (`index.html`):** A pure, minimalist layout fragment. It must contain zero boilerplate layout definitions (`<html>`, `<head>`, `<body>`) and no embedded `<script>` or `<style>` tags. It maps 1:1 into a Drupal Custom Block container.
2. **The JavaScript Director (`app.js`):** A sandboxed operation file containing only page-specific form listeners and UI state logic. It shifts formatting, data transformations, and geography resolution directly onto `Global_SDO_Utilities.js`. It maps into a Drupal Asset Injector instance.

All application views must adhere to a single unified global stylesheet (`Global_SDO_Lookups.css`) to maintain a standardized user experience and control payload sizes.

---

## 🚫 2. Strict Constraints & Guardrails

### A. Namespace Isolation & Bootloading
To prevent script aggregation crashes or property overwrite errors with CMS theme layouts, developers must **never** write un-sandboxed global code or rely on site-wide jQuery sharing. 
* Every lookup script must build its own isolated sandbox environment using an explicit, sequential `loadScript` nesting chain to attach its localized dependencies (jQuery, DataTables, D3) safely outside platform asset-aggregation pipelines.

### B. Backend API Parameter & Comma-Separated List Exploding
Input element parameters must precisely match the raw strings expected by the backend endpoints (`5yr`, `census`, `custom`, `single`). Furthermore:
* **The API does not parse abstract ranges.** Query strings formatted as `age=0,100` are evaluated strictly as literal Age 0 and literal Age 100.
* **The Exploding Rule:** The page director must dynamically explode ranges into explicit comma-separated lists of step-integers (e.g., `age=10,11,12,13,14`) before firing the AJAX request.

### C. Maintenance Centralization (Zero-Hardcoding Guardrail)
* **Never** hardcode geographic indices, text translation dictionaries, or arithmetic aggregation loops inside individual lookup apps.
* All lookups must route interface operations through the unified global core utilities array:

| Global Method Utility | Operational Responsibility |
| :--- | :--- |
| `formatSDO(val, type)` | Formats outputs cleanly as numbers (`num`), decimals (`dec`), or percentages (`pct`). |
| `sdoPopulateGeographies(ddId, tier)` | Renders standard multi-select layouts dynamically for `county` or `region` views. |
| `sdoResolveTiersToFips(tier, codes)` | Explodes regions/counties into a clean, unified FIPS array and map tracking index. |
| `sdoAggregateAgeData(...)` | Unified client-side D3 engine processing data into structured category buckets. |

### D. CSS Collision Defense
Drupal theme architectures often corrupt DataTables layout components (such as pagination buttons, filter search fields, and clear floats). 
* All output tables must explicitly declare standard layout classes (`display lookup_tab stripe cell-border`).
* Style overrides must be safely scoped under the main container selector (`.sdo-lookup-container`) inside the global stylesheet to prevent style bleeding.

---

## 📝 3. Standardization Scaffolds

### Standard HTML Form Snippet (`index.html`)
```html
<div class="sdo-lookup-container">
    <h2>INSTRUCTIONS:</h2>
    <p class="lookup_p">Application summary instructions go here...</p>
    <hr>
    <form class="sdo-form-grid" id="sdo-lookup-form" onsubmit="return false;">
        <div class="form-group">
            <label for="location-dropdown"><strong>Select Location(s):</strong></label> 
            <select class="form-control" id="location-dropdown" size="6" multiple="" aria-label="Select Locations"></select>
        </div>
        <div class="form-group">
            <label for="year-dropdown"><strong>Select Year(s):</strong></label> 
            <select class="form-control" id="year-dropdown" size="6" multiple="" aria-label="Select Years"></select>
        </div>
        
        <fieldset class="form-group sdo-fieldset">
            <legend><strong>Configuration Options:</strong></legend>
            <div class="radio-wrap">
                <input type="radio" id="opt_default" name="ui_grouping" value="default" checked=""> 
                <label for="opt_default">Standard Option</label>
            </div>
        </fieldset>
        
        <div class="form-group" id="ageselect" aria-live="polite">&nbsp;</div>
        
        <div class="form-group sdo-actions">
            <button class="button button--primary" type="button" id="gentable">Generate Table</button> 
            <button class="button button--secondary" type="button" id="cleartable">Reset Selections</button>
        </div>
    </form>
    <hr>
    <div id="tbl_output" aria-live="polite">&nbsp;</div>
</div>