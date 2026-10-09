# SDO Lookup Table Refactoring Rules & Standards
## Workspace Context: Drupal Decoupled Migration Framework

This document outlines the strict architectural standards, API constraints, and boilerplate templates required to refactor legacy SDO client-side data query tools into modern, decoupled Drupal assets. All automated agents and human developers must follow these constraints to ensure stability inside aggregated production CMS environments.

---

## 🏗️ 1. Architectural Philosophy: The Hybrid-Bubble

Every lookup application must be cleanly separated into two distinct components:
1. **The HTML Snippet (`index.html`):** A pure, minimalist layout fragment. It must contain zero boilerplate layout definitions (`<html>`, `<head>`, `<body>`) and no embedded `<script>` or `<style>` tags. It maps 1:1 into a Drupal Custom Block container.
2. **The JavaScript Director (`app.js`):** A sandboxed operation file containing only page-specific form listeners and UI state logic. It shifts formatting, data transformations, and geography resolution directly onto `Global_SDO_Utilities.js`. It maps into a Drupal Asset Injector instance.

All application views must adhere to a single unified global stylesheet (`Global_SDO_Lookups.css`) to maintain visual consistency and limit payload sizes.

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
| `sdoPopulateGeographies(ddId, tier)` | Renders standard multi-select layouts dynamically, generating nested HTML `<optgroup>` wrappers for regional tiers. |
| `sdoResolveTiersToFips(tier, codes)` | Explodes regions/counties into a clean, unified FIPS array and map tracking index. |
| `sdoAggregateAgeData(...)` | Unified client-side D3 engine processing data into structured category buckets. |

### D. Region Naming & HTML Grouping Hierarchy
* **Do not flatten or hardcode region options lists locally.** The system query engine enforces exact padded string parameters (e.g., `"000"`, `"01"`, `"15"`).
* All regional view options must inherit from the central `SDO_REGIONS_STRUCTURE` array map via `sdoPopulateGeographies()` to guarantee consistent grouping hierarchies across tools.

### E. Form Layouts & Fluid Responsive Grids
* **Do not use HTML `<table>` elements for input layout alignment.** Global CMS styles and DataTables style sheets aggressively target generic tabular tags, causing layout degradation and style bleeding.
* **Responsive Breakpoint Matrix:** All lookup layout systems must leverage standard CSS Grid rules using a mobile-first approach:
    * *Mobile:* 1-column layout stack.
    * *Tablet:* 2-column layout stack.
    * *Desktop (1024px+):* Strict 5-column layout grid to maintain application consistency.
* **Text Truncation Defense:** To prevent long regional planning names from clipping, apply the `.sdo-col-span-2` rule to location selection boxes on desktop views.
* **Dynamic Drawer Pattern:** Options generated dynamically by form actions (e.g., custom range text boxes) must be built inside standard block dividers (`<div>`) styled via CSS Flexbox or Grid utilities and limited to a `max-width: 480px` layout boundary.

### F. Typography & Theme Coexistence
* **Never declare hardcoded `font-family` parameters or absolute font sizes within tool assets.** Components must rely completely on native font inheritance to cleanly match the overarching typography and styling of the active Drupal subtheme automatically.

---

## 📝 3. Standardization Scaffolds

### Standard HTML Form Snippet (`index.html`)
```html
<div class="sdo-lookup-container">
    <h2>INSTRUCTIONS:</h2>
    <p class="lookup_p">Application summary instructions go here...</p>
    <hr class="sdo-hr">
    <form id="sdo-lookup-form" onsubmit="return false;">
        <div class="sdo-form-grid">
            <div class="form-group">
                <label for="tier-dropdown"><strong>1. Select Tier:</strong></label>
                <select class="form-control" id="tier-dropdown" size="2">
                    <option value="alpha" selected>Option A</option>
                    <option value="beta">Option B</option>
                </select>
            </div>
            
            <div class="form-group sdo-col-span-2">
                <label for="location-dropdown">
                    <strong>2. Select Location(s):</strong>
                    <span class="sdo-input-helper">(Hold Ctrl / ⌘ to select multiple)</span>
                </label> 
                <select class="form-control" id="location-dropdown" size="6" multiple role="listbox"></select>
            </div>
            
            <div class="form-group">
                <label for="year-dropdown">
                    <strong>3. Select Year(s):</strong>
                    <span class="sdo-input-helper">(Hold Ctrl / ⌘ to select multiple)</span>
                </label> 
                <select class="form-control" id="year-dropdown" size="6" multiple role="listbox"></select>
            </div>
            
            <fieldset class="form-group sdo-fieldset">
                <legend><strong>4. Configure Age Filters:</strong></legend>
                <div class="radio-wrap">
                    <input type="radio" id="opt_default" name="ui_grouping" value="5yr" checked> 
                    <label for="opt_default">Standard Filter Option</label>
                </div>
            </fieldset>
            
            <div class="form-group sdo-drawer-fullwidth" id="ageselect" aria-live="polite"></div>
        </div>

        <hr class="sdo-hr">

        <div class="sdo-actions-row">
            <button class="button button--primary" type="button" id="gentable">Generate Table</button> 
            <button class="button button--secondary" type="button" id="cleartable">Reset Selections</button>
        </div>
    </form>
    <hr class="sdo-hr">
    <div id="tbl_output" aria-live="polite">&nbsp;</div>
</div>

Standard JS Operational Script (app.js)

JavaScript

window.addEventListener("load", () => {
    
    // Attach Required DataTables Asset Styling
    var dtCss = document.createElement("link");
    dtCss.rel = "stylesheet";
    dtCss.href = "[https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.css](https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.css)";
    document.head.appendChild(dtCss);
    
    // Isolated Sandbox Asset Bootloader Chain
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function() { if (callback) callback(); };
        script.src = url;
        document.head.appendChild(script);
    }

    // Sequence: Private jQuery -> DataTables Extensions Script -> D3 Core -> Execute Runtime
    loadScript("[https://code.jquery.com/jquery-3.7.0.js](https://code.jquery.com/jquery-3.7.0.js)", function() {
        loadScript("[https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.js](https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.js)", function() {
            loadScript("[https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js](https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js)", function() {
                initSdoApplication(); 
            });
        });
    });

    function initSdoApplication() {
        // 1. Establish button event bindings and target tier context hooks
        
        // 2. Formulate parameters, execute validations, and invoke global utility pipelines
        
        // 3. Render and initialize output DataTables structures using semantic class mappings
    }
});