# SDO Lookup Table Refactoring Rules & Standards
## Workspace Context: Drupal Migration Framework

This document outlines the strict architectural standards and boilerplate configurations required to refactor legacy SDO client-side data query scripts into modern, decoupled Drupal assets. All automated agents and human developers must follow these constraints to ensure stability inside aggregated production CMS environments.

---

## 🏗️ 1. Architectural Philosophy: The Hybrid-Bubble

Every lookup application must be cleanly separated into two distinct components:
1. **The HTML Snippet (`index.html`):** A pure, minimalist layout fragment. It must contain zero boilerplate (`<html>`, `<head>`, `<body>`) and no embedded script tags. It maps 1:1 into a Drupal Custom Block container.
2. **The JavaScript Director (`app.js`):** A sandboxed operation file containing only page-specific form listeners and API configurations. It leverages `Global_SDO_Utilities.js` for formatting, geography maps, and select field parsing. It maps into a Drupal Asset Injector instance.

---

## 🚫 2. Strict Constraints & Guardrails

### A. Namespace Integrity (No Global jQuery Sharing)
To prevent script aggregation crashes or property overwrite errors with CMS theme layouts (e.g., Bootstrap `Bridge` exceptions), **never** write raw global code or rely on sharing site-wide jQuery objects. 
* Every lookup script must build its own isolated sandbox environment using an explicit, sequential `loadScript` nesting chain to attach its localized dependencies (jQuery, DataTables, D3).

### B. Backend API Parameter Alignment
The state GIS query server firewalls drop or redirect invalid query configurations, resulting in apparent CORS failures. 
* Input element parameters (`<input value="...">`) must precisely match the strings expected by the backend endpoints (`5yr`, `census`, `custom`, `single`). Do not modernize or change form element values unless a backend API change is officially documented.

### C. Maintenance Centralization
* **Never** hardcode localized number-formatting routines or text translation dictionaries inside individual lookup apps.
* All FIPS translations, regional index mappings, and numbers formatting must be routed directly to the universal `sdoGetCountyName()`, `sdoGetRegionCounties()`, and `formatSDO()` methods hosted inside `Global_SDO_Utilities.js`.

---

## 📝 3. Standardization Scaffolds

### Standard HTML Form Snippet (`index.html`)
```html
<div class="sdo-lookup-container">
    <h2>INSTRUCTIONS:</h2>
    <p>Application summary instructions go here...</p>
    <hr>
    <form class="sdo-form-grid" id="sdo-lookup-form" onsubmit="return false;">
        <div class="form-group">
            <label for="county-dropdown"><strong>Select Counties:</strong></label> 
            <select class="form-control" id="county-dropdown" size="6" multiple="" aria-label="Select Counties"></select>
        </div>
        <div class="form-group">
            <label for="year-dropdown"><strong>Select Years:</strong></label> 
            <select class="form-control" id="year-dropdown" size="6" multiple="" aria-label="Select Years"></select>
        </div>
        
        <fieldset class="form-group sdo-fieldset">
            <legend><strong>Configuration Options:</strong></legend>
            <div class="radio-wrap">
                <input type="radio" id="opt_default" name="ui_grouping" value="5yr" checked=""> 
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

Standard JS Operational Script (app.js)

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

    // Sequence: Private jQuery -> DataTables Extensions -> D3 Core -> Execute Runtime
    loadScript("[https://code.jquery.com/jquery-3.7.0.js](https://code.jquery.com/jquery-3.7.0.js)", function() {
        loadScript("[https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.css](https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.css)", function() {
            loadScript("[https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js](https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js)", function() {
                initSdoApplication(); 
            });
        });
    });

    function initSdoApplication() {
        // 1. Page Specific Local Interface Layout Methods Go Here
        
        // 2. Data API Query & Rollup Process Loops Go Here
        // NOTE: Must always route formatting to formatSDO() 
        // and names queries to sdoGetCountyName()
        
        // 3. Main Init Pipeline and Action Button Event Listeners Go Here
        // NOTE: Multi-select collection must route to sdoGetSelectValues()
    }
});