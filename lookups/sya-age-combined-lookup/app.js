/* =====================================================================
   State Demography Office - Dynamic SYA Orchestration Controller
   Decoupled Edition - Consumes Centralized Global Utility Pipelines
   ===================================================================== */

window.addEventListener("load", () => {
    
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function() { if (callback) callback(); };
        script.src = url;
        document.head.appendChild(script);
    }

    // Sequence load runtime components safely inside runtime thread
    loadScript("https://code.jquery.com/jquery-3.7.0.js", function() {
        loadScript("https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.js", function() {
            loadScript("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js", function() {
                initCombinedLookup(); 
            });
        });
    });

    function initCombinedLookup() {
        const urlstr = "https://gis.dola.colorado.gov/lookups/componentYRS";
        let localYearData = [];

        d3.json(urlstr).then(function(yeardata) {
            localYearData = yeardata.filter(i => i.year >= 1990);
            
            sdoPopulateGeographies('location-dropdown', 'region');
            sdoPopulateYears("year-dropdown", localYearData);

            document.getElementById('geo-dropdown').addEventListener('change', function(e) {
                const tier = e.target.value;
                if (tier === "region") {
                    document.getElementById('location-lbl').textContent = "Select one or more Locations / Regions:";
                    document.getElementById('comp-wrapper').style.display = "block";
                } else {
                    document.getElementById('location-lbl').textContent = "Select one or more Counties:";
                    document.getElementById('comp-wrapper').style.display = "none";
                    document.getElementById('comp').checked = false;
                }
                sdoPopulateGeographies('location-dropdown', tier);
                
                // If a user swaps tiers while single age mode is active, refresh labels dynamically
                const checkedAgeMode = document.querySelector('input[name="age_grouping"]:checked').value;
                if (checkedAgeMode === "single") {
                    renderAgeInterfaceStructure("single");
                }
            });

            const ageRadios = document.querySelectorAll('input[name="age_grouping"]');
            ageRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    renderAgeInterfaceStructure(this.value);
                });
            });

            document.getElementById('gentable').addEventListener("click", validateAndProcessExecution);
            document.getElementById('cleartable').addEventListener("click", clearInterfaceSelections);
        });

        // --- MODERNIZED DRAWER RENDERING FACTORY ---
        function renderAgeInterfaceStructure(mode) {
            const container = document.getElementById('ageselect');
            container.innerHTML = "";
            const tier = document.getElementById('geo-dropdown').value;
            
            if (mode === "custom") {
                let wrapper = document.createElement('div');
                wrapper.className = "sdo-drawer-enclosure";

                let txt = document.createElement('p');
                txt.innerHTML = "<strong>Designate up to 5 custom age intervals (0 - 100):</strong>";
                wrapper.appendChild(txt);

                let flexContainer = document.createElement("div");
                flexContainer.className = "sdo-custom-intervals-container";

                for (let i = 0; i < 5; i++) {
                    let row = document.createElement("div");
                    row.className = "sdo-custom-interval-row";
                    row.innerHTML = `
                        <span class="sdo-row-index">${i + 1}.</span>
                        <div class="sdo-input-pair">
                            <label for="agestart${i}">From:</label>
                            <input type="text" id="agestart${i}" maxlength="3" autocomplete="off">
                        </div>
                        <div class="sdo-input-pair">
                            <label for="ageend${i}">To:</label>
                            <input type="text" id="ageend${i}" maxlength="3" autocomplete="off">
                        </div>
                    `;
                    flexContainer.appendChild(row);
                }
                wrapper.appendChild(flexContainer);
                container.appendChild(wrapper);

            } else if (mode === "single") {
                let wrapper = document.createElement('div');
                wrapper.className = "sdo-drawer-enclosure";

                let txt = document.createElement('p');
                txt.innerHTML = "<strong>Hold Ctrl / ⌘ to select targeted custom ages:</strong>";
                wrapper.appendChild(txt);

                let select = document.createElement("select");
                select.id = "agesel";
                select.multiple = true;
                select.size = 5;
                select.className = "form-control";
                for (let i = 0; i <= 100; i++) {
                    let opt = document.createElement("option");
                    opt.value = i;
                    opt.textContent = (i === 100) ? "100+" : i;
                    select.appendChild(opt);
                }
                wrapper.appendChild(select);
                
                let grpDiv = document.createElement("div");
                grpDiv.style.marginTop = "12px";
                
                // Match the legacy verbiage layout strings exactly
                const locationLabelText = (tier === "region") ? "Group by Region and Year" : "Group by County and Year";
                const filters = [
                    {id: 'NoGrp', txt: 'No Grouping', val: 'opt0'},
                    {id: 'yrGrp', txt: 'Group by Year', val: 'opt1'},
                    {id: 'ctyGrp', txt: locationLabelText, val: 'opt2'},
                    {id: 'ageGrp', txt: 'Group by Age and Year', val: 'opt3'}
                ];
                
                grpDiv.innerHTML += "<strong style='display:block; margin-bottom:6px;'>Single Year Grouping Rule:</strong>";
                filters.forEach(f => {
                    grpDiv.innerHTML += `<div class="radio-wrap"><input type="radio" name="age_summary" id="${f.id}" value="${f.val}" ${f.id==='NoGrp'?'checked':''}><label for="${f.id}">${f.txt}</label></div>`;
                });
                wrapper.appendChild(grpDiv);
                container.appendChild(wrapper);
            }
        }

        function validateAndProcessExecution() {
            let passed = true;
            let log = "";
            
            const tier = document.getElementById('geo-dropdown').value;
            const targetLocations = sdoGetSelectValues(document.getElementById('location-dropdown'));
            const targetYears = sdoGetSelectValues(document.getElementById('year-dropdown'));
            const ageGroupMode = document.querySelector('input[name="age_grouping"]:checked').value;
            
            if (targetLocations.length === 0) { log += " > Please select one or more locations.\n"; passed = false; }
            if (targetYears.length === 0) { log += " > Please select one or more target years.\n"; passed = false; }
            
            let finalAgeParameters = [];
            let aggregateGroupingStrategy = "opt0";
            
            if (ageGroupMode === "custom") {
                for (let i = 0; i < 5; i++) {
                    let startEl = document.getElementById("agestart" + i);
                    let endEl = document.getElementById("ageend" + i);
                    if (startEl && startEl.value !== "") {
                        let sv = parseInt(startEl.value, 10);
                        let ev = parseInt(endEl.value, 10);
                        if (isNaN(sv) || isNaN(ev) || sv > ev) {
                            log += ` > Age Interval Range Row #${i+1} configuration error.\n`;
                            passed = false;
                        } else {
                            finalAgeParameters.push([sv, ev]);
                        }
                    }
                }
            } else if (ageGroupMode === "single") {
                finalAgeParameters = sdoGetSelectValues(document.getElementById("agesel"));
                if (finalAgeParameters.length === 0) { log += " > Please select individual single ages.\n"; passed = false; }
                aggregateGroupingStrategy = document.querySelector('input[name="age_summary"]:checked').value;
            }

            if (!passed) { alert(log); return; }

            document.getElementById('tbl_output').innerHTML = '<div class="sdo-loader"></div><div class="sdo-loading-text">Processing SDO Database Matrix...</div>';
            const showComponentToggled = document.getElementById("comp").checked ? "comp" : "";
            
            const resolution = sdoResolveTiersToFips(tier, targetLocations);
            const targetYearsList = targetYears.join(",");
            
            let ageQueryArr = [];
            if (ageGroupMode === "5yr" || ageGroupMode === "census") {
                for (let i = 0; i <= 100; i++) { ageQueryArr.push(i); }
            } else if (ageGroupMode === "custom") {
                let uniqueAges = new Set();
                finalAgeParameters.forEach(range => {
                    for (let i = range[0]; i <= range[1]; i++) { uniqueAges.add(i); }
                });
                ageQueryArr = Array.from(uniqueAges).sort((a, b) => a - b);
            } else if (ageGroupMode === "single") {
                ageQueryArr = finalAgeParameters;
            }
            const ageQueryParameter = ageQueryArr.join(",");

            let endpointUrl = `https://gis.dola.colorado.gov/lookups/sya?age=${ageQueryParameter}&county=${resolution.cleanUniqueFipsString}&year=${targetYearsList}&choice=single`;

            d3.json(endpointUrl).then(function(apiPayload) {
                let processedRows = sdoAggregateAgeData(apiPayload, tier, ageGroupMode, finalAgeParameters, aggregateGroupingStrategy, resolution.mapReference);
                compileAndRenderTargetDataTable(tier, processedRows, showComponentToggled, ageGroupMode, aggregateGroupingStrategy);
            });
        }

        // Optimized datatable compiler to output exact matching data schemas dynamically
        function compileAndRenderTargetDataTable(tier, rows, componentsToggle, groupingMode, summaryStrategy) {
            let columnsConfiguration = [];
            let processedTableRows = [];

            // Execute schema validation routing branches against specific transformation strategies
            if (groupingMode === "single" && summaryStrategy === "opt1") {
                columnsConfiguration = ["Year", "Male Population", "Female Population", "Total Population", "Data Type"];
                rows.forEach(r => { processedTableRows.push([r.year, formatSDO(r.male), formatSDO(r.female), formatSDO(r.total), r.dataType]); });
            } else if (groupingMode === "single" && summaryStrategy === "opt2") {
                if (tier === "region") {
                    columnsConfiguration = ["Region Code", "Region Name", "Year", "Male Population", "Female Population", "Total Population", "Data Type"];
                    rows.forEach(r => { processedTableRows.push([r.regionCode, r.regionName, r.year, formatSDO(r.male), formatSDO(r.female), formatSDO(r.total), r.dataType]); });
                } else {
                    columnsConfiguration = ["County FIPS", "County Name", "Year", "Male Population", "Female Population", "Total Population", "Data Type"];
                    rows.forEach(r => { processedTableRows.push([r.countyFips, r.countyName, r.year, formatSDO(r.male), formatSDO(r.female), formatSDO(r.total), r.dataType]); });
                }
            } else if (groupingMode === "single" && summaryStrategy === "opt3") {
                columnsConfiguration = ["Year", "Age", "Male Population", "Female Population", "Total Population", "Data Type"];
                rows.forEach(r => { processedTableRows.push([r.year, r.ageLabel, formatSDO(r.male), formatSDO(r.female), formatSDO(r.total), r.dataType]); });
            } else {
                // Default Standardized lifespan grouping configurations
                if (tier === "region") {
                    if (componentsToggle === "comp") {
                        columnsConfiguration = ["Region Code", "Region Name", "County FIPS", "County Name", "Year", "Age", "Male Population", "Female Population", "Total Population", "Data Type"];
                        rows.forEach(r => {
                            processedTableRows.push([r.regionCode, r.regionName, r.countyFips, r.countyName, r.year, r.ageLabel, formatSDO(r.male), formatSDO(r.female), formatSDO(r.total), r.dataType]);
                        });
                    } else {
                        columnsConfiguration = ["Region Code", "Region Name", "Year", "Age", "Male Population", "Female Population", "Total Population", "Data Type"];
                        let regionRollups = d3.rollup(rows, v => ({
                            male: d3.sum(v, d => d.male),
                            female: d3.sum(v, d => d.female),
                            total: d3.sum(v, d => d.total),
                            dataType: v[0].dataType
                        }), d => d.regionCode, d => d.year, d => d.ageLabel);

                        for (let [regKey, regVal] of regionRollups) {
                            for (let [yrKey, yrVal] of regVal) {
                                for (let [ageKey, ageVal] of yrVal) {
                                    processedTableRows.push([regKey, sdoGetRegionName(regKey), yrKey, ageKey, formatSDO(ageVal.male), formatSDO(ageVal.female), formatSDO(ageVal.total), ageVal.dataType]);
                                }
                            }
                        }
                    }
                } else {
                    columnsConfiguration = ["County FIPS", "County Name", "Year", "Age", "Male Population", "Female Population", "Total Population", "Data Type"];
                    rows.forEach(r => {
                        processedTableRows.push([r.countyFips, r.countyName, r.year, r.ageLabel, formatSDO(r.male), formatSDO(r.female), formatSDO(r.total), r.dataType]);
                    });
                }
            }

            let generatedHtml = "<thead><tr>";
            columnsConfiguration.forEach(col => { generatedHtml += `<th>${col}</th>`; });
            generatedHtml += "</tr></thead><tbody>";

            processedTableRows.forEach(row => {
                generatedHtml += "<tr>";
                row.forEach((cell, idx) => {
                    // Lock math metrics fields to exact right-aligned layout parameters dynamically
                    let isMetaString = (columnsConfiguration[idx].includes("Name") || columnsConfiguration[idx].includes("Type") || columnsConfiguration[idx].includes("Age"));
                    let alignment = (!isMetaString && idx >= columnsConfiguration.length - 4) ? "style='text-align:right;'" : "";
                    generatedHtml += `<td ${alignment}>${cell || ""}</td>`;
                });
                generatedHtml += "</tr>";
            });
            generatedHtml += "</tbody>";

            var outputContainer = document.getElementById("tbl_output");
            outputContainer.innerHTML = "";
            
            var tableElement = document.createElement("table");
            tableElement.id = "sdoCombinedDataTableOutput";
            tableElement.className = "display lookup_tab stripe cell-border";
            tableElement.style.width = "100%";
            outputContainer.appendChild(tableElement);

            $("#sdoCombinedDataTableOutput").append(generatedHtml);
            $("#sdoCombinedDataTableOutput").DataTable({
                dom: 'Bfrtip',
                pageLength: 25,
                buttons: ['csv'],
                ordering: true
            });
        }

        function clearInterfaceSelections() {
            document.getElementById('tbl_output').innerHTML = "&nbsp;";
            document.getElementById('ageselect').innerHTML = "";
            document.getElementById('geo-dropdown').selectedIndex = 0;
            sdoPopulateGeographies('location-dropdown', 'region');
            document.getElementById('comp-wrapper').style.display = "block";
            document.getElementById('comp').checked = false;
            sdoPopulateYears("year-dropdown", localYearData);
            document.getElementById('age5').checked = true;
        }
    }
});