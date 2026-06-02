/* =====================================================================
   State Demography Office - Combined Single Year of Age Lookup Logic
   Production Build - Optimized for Strict Comma-Separated Age APIs
   ===================================================================== */

window.addEventListener("load", () => {
    
    // Inject DataTables Core CSS onto Page View Header
    var dtCss = document.createElement("link");
    dtCss.rel = "stylesheet";
    dtCss.href = "https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.css";
    document.head.appendChild(dtCss);
    
    // Sequential load bootloader to prevent platform theme framework clashes
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function() { if (callback) callback(); };
        script.src = url;
        document.head.appendChild(script);
    }

    // Sequence load: jQuery -> DataTables -> D3 -> Initializer Engine
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
            
            popTierLocations("region");
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
                popTierLocations(tier);
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

        function popTierLocations(tier) {
            const dropdown = document.getElementById('location-dropdown');
            dropdown.innerHTML = "";
            
            if (tier === "county") {
                const counties = sdoGetRegionCounties(0); 
                counties.forEach(fips => {
                    if (fips !== '000') {
                        let opt = document.createElement("option");
                        opt.value = fips;
                        opt.textContent = sdoGetCountyName(fips);
                        dropdown.appendChild(opt);
                    }
                });
            } else if (tier === "region") {
                let stateOpt = document.createElement("option");
                stateOpt.value = "0";
                stateOpt.textContent = sdoGetRegionName(0);
                dropdown.appendChild(stateOpt);
                
                for (let i = 1; i <= 40; i++) {
                    let opt = document.createElement("option");
                    opt.value = i.toString();
                    opt.textContent = sdoGetRegionName(i);
                    dropdown.appendChild(opt);
                }
            }
        }

        function renderAgeInterfaceStructure(mode) {
            const container = document.getElementById('ageselect');
            container.innerHTML = "";
            
            if (mode === "custom") {
                let txt = document.createElement('p');
                txt.innerHTML = "<strong>Designate up to 5 custom layout intervals (0 - 100):</strong>";
                let tbl = document.createElement("table");
                tbl.style.width = "100%";
                for (let i = 0; i < 5; i++) {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `<td><label for="agestart${i}">From: </label><input type="text" id="agestart${i}" size="5" class="form-control" style="display:inline; width:60px;"></td>
                                    <td><label for="ageend${i}">To: </label><input type="text" id="ageend${i}" size="5" class="form-control" style="display:inline; width:60px;"></td>`;
                    tbl.appendChild(tr);
                }
                container.appendChild(txt);
                container.appendChild(tbl);
            } else if (mode === "single") {
                let txt = document.createElement('p');
                txt.innerHTML = "<strong>Hold Ctrl/Cmd to select targeted custom ages:</strong>";
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
                container.appendChild(txt);
                container.appendChild(select);
                
                let grpDiv = document.createElement("div");
                grpDiv.style.marginTop = "10px";
                const filters = [
                    {id: 'NoGrp', txt: 'No Summary Grouping', val: 'opt0'},
                    {id: 'yrGrp', txt: 'Group across Years', val: 'opt1'},
                    {id: 'ctyGrp', txt: 'Group across Location Profiles', val: 'opt2'},
                    {id: 'ageGrp', txt: 'Group across Custom Ages', val: 'opt3'}
                ];
                grpDiv.innerHTML += "<strong>Single Year Grouping Rule:</strong><br>";
                filters.forEach(f => {
                    grpDiv.innerHTML += `<label style="margin-right:15px;"><input type="radio" name="age_summary" value="${f.val}" ${f.id==='NoGrp'?'checked':''}>${f.txt}</label>`;
                });
                container.appendChild(grpDiv);
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

            document.getElementById('tbl_output').innerHTML = '<div style="padding:40px; text-align:center;"><strong>Fetching production microdata records...</strong></div>';
            const showComponentToggled = document.getElementById("comp").checked ? "comp" : "";

            genSYAComb(tier, targetLocations, targetYears, showComponentToggled, aggregateGroupingStrategy, ageGroupMode, finalAgeParameters);
        }

        function genSYAComb(tier, locationCodes, yearCodes, componentsToggle, summaryStrategy, groupingMode, ageRanges) {
            let processedFipsArray = [];
            let crossTierMapReference = [];

            if (tier === "region") {
                locationCodes.forEach(regId => {
                    let mapArray = sdoGetRegionCounties(regId);
                    mapArray.forEach(fips => {
                        processedFipsArray.push(parseInt(fips, 10));
                        crossTierMapReference.push({ countyFips: parseInt(fips, 10), regionId: parseInt(regId, 10) });
                    });
                });
            } else {
                locationCodes.forEach(fips => { processedFipsArray.push(parseInt(fips, 10)); });
            }

            const cleanUniqueFipsList = [...new Set(processedFipsArray)].join(",");
            const targetYearsList = yearCodes.join(",");
            
            // --- FIX: DYNAMIC AGE LIST GENERATION ENGINE ---
            let ageQueryArr = [];
            if (groupingMode === "5yr" || groupingMode === "census") {
                // Must explicitly request every sub-year to compute group ranges accurately
                for (let i = 0; i <= 100; i++) { ageQueryArr.push(i); }
            } else if (groupingMode === "custom") {
                // Payload Optimization: Only request the discrete integers spanned by bounds
                let uniqueAges = new Set();
                ageRanges.forEach(range => {
                    for (let i = range[0]; i <= range[1]; i++) { uniqueAges.add(i); }
                });
                ageQueryArr = Array.from(uniqueAges).sort((a, b) => a - b);
            } else if (groupingMode === "single") {
                ageQueryArr = ageRanges;
            }
            const ageQueryParameter = ageQueryArr.join(",");

            let endpointUrl = `https://gis.dola.colorado.gov/lookups/sya?age=${ageQueryParameter}&county=${cleanUniqueFipsList}&year=${targetYearsList}&choice=single`;

            d3.json(endpointUrl).then(function(apiPayload) {
                let baseDataRows = [];
                
                apiPayload.forEach(record => {
                    let calcRegId = (tier === "region") ? crossTierMapReference.find(m => m.countyFips === parseInt(record.countyfips))?.regionId : null;
                    baseDataRows.push({
                        regionCode: calcRegId,
                        regionName: calcRegId !== null ? sdoGetRegionName(calcRegId) : "",
                        countyFips: parseInt(record.countyfips, 10),
                        countyName: sdoGetCountyName(record.countyfips),
                        year: parseInt(record.year, 10),
                        age: parseInt(record.age, 10),
                        male: parseInt(record.malepopulation, 10),
                        female: parseInt(record.femalepopulation, 10),
                        total: parseInt(record.totalpopulation, 10),
                        dataType: record.datatype || "Estimate"
                    });
                });

                let transformedRows = [];

                if (groupingMode === "5yr") {
                    transformedRows = executeAgeAggregationPipeline(baseDataRows, tier, '5yr', null);
                } else if (groupingMode === "census") {
                    transformedRows = executeAgeAggregationPipeline(baseDataRows, tier, 'census', null);
                } else if (groupingMode === "custom") {
                    transformedRows = executeAgeAggregationPipeline(baseDataRows, tier, 'custom', ageRanges);
                } else {
                    transformedRows = executeSingleAgeFilters(baseDataRows, tier, summaryStrategy, ageRanges);
                }

                compileAndRenderTargetDataTable(tier, transformedRows, componentsToggle, groupingMode);
            });
        }

        function executeAgeAggregationPipeline(data, tier, strategy, customRanges) {
            let result = [];
            let buckets = [];

            if (strategy === '5yr') {
                for (let i = 0; i < 85; i += 5) {
                    buckets.push({ label: `${i} to ${i+4}`, min: i, max: i+4 });
                }
                buckets.push({ label: "85 +", min: 85, max: 100 });
            } else if (strategy === 'census') {
                buckets = [
                    { label: "0 to 17", min: 0, max: 17 },
                    { label: "18 to 24", min: 18, max: 24 },
                    { label: "25 to 44", min: 25, max: 44 },
                    { label: "45 to 64", min: 45, max: 64 },
                    { label: "65 +", min: 65, max: 100 }
                ];
            } else if (strategy === 'custom') {
                customRanges.forEach(r => {
                    buckets.push({ label: `${r[0]} to ${r[1]}`, min: r[0], max: r[1] });
                });
            }

            buckets.forEach(b => {
                let sliced = data.filter(r => r.age >= b.min && r.age <= b.max);
                let grouped = d3.rollup(sliced, v => ({
                    male: d3.sum(v, d => d.male),
                    female: d3.sum(v, d => d.female),
                    total: d3.sum(v, d => d.total),
                    dataType: v[0]?.dataType || "Estimate"
                }), d => d.regionCode, d => d.countyFips, d => d.year);

                for (let [regKey, regVal] of grouped) {
                    for (let [ctyKey, ctyVal] of regVal) {
                        for (let [yrKey, yrVal] of ctyVal) {
                            result.push({
                                regionCode: regKey !== "null" ? regKey : null,
                                regionName: regKey !== "null" ? sdoGetRegionName(regKey) : "",
                                countyFips: ctyKey,
                                countyName: sdoGetCountyName(ctyKey),
                                year: yrKey,
                                ageLabel: b.label, // Retain explicit data-string format
                                male: yrVal.male,
                                female: yrVal.female,
                                total: yrVal.total,
                                dataType: yrVal.dataType
                            });
                        }
                    }
                }
            });
            return result;
        }

        function executeSingleAgeFilters(data, tier, strategy, allowedAges) {
            let numAges = allowedAges.map(Number);
            let subset = data.filter(r => numAges.includes(r.age));
            let result = [];

            if (strategy === "opt0") {
                subset.forEach(r => { r.ageLabel = r.age.toString(); result.push(r); });
            } else if (strategy === "opt1") {
                let rolled = d3.rollup(subset, v => ({
                    male: d3.sum(v, d => d.male),
                    female: d3.sum(v, d => d.female),
                    total: d3.sum(v, d => d.total)
                }), d => d.year);
                for (let [k, v] of rolled) {
                    result.push({ year: k, ageLabel: "Total Selected", male: v.male, female: v.female, total: v.total, dataType: "Summary" });
                }
            } else if (strategy === "opt2") {
                let rolled = d3.rollup(subset, v => ({
                    male: d3.sum(v, d => d.male),
                    female: d3.sum(v, d => d.female),
                    total: d3.sum(v, d => d.total)
                }), d => d.regionCode, d => d.countyFips, d => d.year);
                for (let [regK, regV] of rolled) {
                    for (let [ctyK, ctyV] of regV) {
                        for (let [yrK, yrV] of ctyV) {
                            result.push({ regionCode: regK!=="null"?regK:null, regionName: regK!=="null"?sdoGetRegionName(regK):"", countyFips: ctyK, countyName: sdoGetCountyName(ctyK), year: yrK, ageLabel: "Total Selected", male: yrV.male, female: yrV.close, total: yrV.total, dataType: "Summary" });
                        }
                    }
                }
            } else if (strategy === "opt3") {
                let rolled = d3.rollup(subset, v => ({
                    male: d3.sum(v, d => d.male),
                    female: d3.sum(v, d => d.female),
                    total: d3.sum(v, d => d.total)
                }), d => d.year, d => d.age);
                for (let [yrK, yrV] of rolled) {
                    for (let [ageK, ageV] of yrV) {
                        result.push({ year: yrK, ageLabel: ageK.toString(), male: ageV.male, female: ageV.female, total: ageV.total, dataType: "Summary" });
                    }
                }
            }
            return result;
        }

        // Output UI compilation mapping engine
        function compileAndRenderTargetDataTable(tier, rows, componentsToggle, groupingMode) {
            let columnsConfiguration = [];
            let processedTableRows = [];

            // FIX: Remapped column strings to match exactly with legacy production specs
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

            let generatedHtml = "<thead><tr>";
            columnsConfiguration.forEach(col => { generatedHtml += `<th>${col}</th>`; });
            generatedHtml += "</tr></thead><tbody>";

            processedTableRows.forEach(row => {
                generatedHtml += "<tr>";
                row.forEach((cell, idx) => {
                    // Apply explicit column numeric right-alignments safely to index values
                    let alignment = (idx >= columnsConfiguration.length - 4 && idx <= columnsConfiguration.length - 2) ? "style='text-align:right;'" : "";
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
            popTierLocations("region");
            document.getElementById('comp-wrapper').style.display = "block";
            document.getElementById('comp').checked = false;
            sdoPopulateYears("year-dropdown", localYearData);
            document.getElementById('age5').checked = true;
        }
    }
});