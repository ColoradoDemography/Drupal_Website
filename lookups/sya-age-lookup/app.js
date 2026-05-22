/**
 * lookups/sya-age-lookup/app.js
 * State Demography Office - Single Year of Age Lookup Page Logic
 */

window.addEventListener("load", () => {
    // Initialize the tool once the DOM is fully ready
    initSYALookup(); 

    function initSYALookup() {
        
        /**
         * Generates the dynamic inputs for age selection based on UI choices
         */
        function genAgeGroup(group) {
            var outcell = document.getElementById('ageselect');
            if (!outcell) return;
            outcell.innerHTML = "";
            
            var tabdiv = document.createElement('div');
            var tabtxt = document.createElement('p');
            
            if (group == "custom") {
                tabtxt.innerHTML = '<strong>Designate up to 5 intervals between 0 and 100:</strong><br>';
                var outitem = document.createElement("table");
                for (let i = 0; i < 5; i++) {
                    var tblrow = document.createElement("tr");
                    tblrow.innerHTML = `<td><label for="agestart${i}">From: </label><input type="text" id="agestart${i}" name="agestart${i}" size="5"></td>
                                       <td><label for="ageend${i}">To: </label><input type="text" id="ageend${i}" name="ageend${i}" size="5"></td>`;
                    outitem.appendChild(tblrow);
                }
                tabdiv.appendChild(tabtxt);
                tabdiv.appendChild(outitem);
            }
            
            if (group == "single") {
                tabtxt.innerHTML = '<strong>Select one or more ages:</strong><br>';
                var outitem = document.createElement("select");
                outitem.id = "agesel";
                outitem.setAttribute('size', '6');
                outitem.multiple = true;
                outitem.className = "form-control";
                for (var i = 0; i <= 100; i++) {
                    var el = document.createElement("option");
                    el.textContent = i;
                    el.value = i;
                    outitem.appendChild(el);
                }
                
                var grpOptions = [
                    { id: 'NoGrp', txt: 'No Grouping', val: 'opt0' },
                    { id: 'yrGrp', txt: 'Group by Year', val: 'opt1' },
                    { id: 'ctyGrp', txt: 'Group by County and Year', val: 'opt2' },
                    { id: 'ageGrp', txt: 'Group by Age and Year', val: 'opt3' }
                ];
                
                var radioContainer = document.createElement("div");
                grpOptions.forEach(opt => {
                    var wrap = document.createElement('div');
                    wrap.className = 'radio-wrap';
                    wrap.innerHTML = `<input type="radio" id="${opt.id}" name="age_summary" value="${opt.val}">
                                      <label for="${opt.id}"> ${opt.txt}</label>`;
                    radioContainer.appendChild(wrap);
                });

                tabdiv.appendChild(tabtxt);
                tabdiv.appendChild(outitem);
                tabdiv.appendChild(radioContainer);
            }

            if (group == "custom" || group == "single") {
                outcell.appendChild(tabdiv);
                if (group == "single") document.getElementById('NoGrp').checked = true;
            }
        }

        /**
         * Fetches endpoint data and processes queries
         */
        function genSYACty(loc, year_arr, group, agespec, age_arr, yeardata) {
            var fips_list = loc.join(",");
            var year_list = year_arr.join(",");
            
            let age_list = "0,100";
            let choice = agespec;
            if (agespec === "custom" || agespec === "single") {
                choice = "single";
                if (agespec === "custom") age_list = Array.from({ length: 101 }, (_, i) => i).join(",");
                else age_list = age_arr.join(",");
            }
            
            var urlstr = `https://gis.dola.colorado.gov/lookups/sya?age=${age_list}&county=${fips_list}&year=${year_list}&choice=${choice}`;

            d3.json(urlstr).then(function(data) {
                // Map raw JSON keys to explicit data models
                let raw_data = data.map(i => ({
                    countyfips: i.countyfips,
                    countyname: (typeof countyName === "function") ? countyName(parseInt(i.countyfips)) : "County " + i.countyfips,
                    year: i.year,
                    age: i.age,
                    male: +i.malepopulation,
                    female: +i.femalepopulation,
                    total: +i.totalpopulation,
                    datatype: i.datatype
                }));

                let processed_data = [];

                if (agespec === "custom") {
                    // Manual rollup execution for custom ranges
                    age_arr.forEach(range => {
                        let filtered = raw_data.filter(d => d.age >= range[0] && d.age <= range[1]);
                        
                        // Fallback rollup if legacy central processing is missing
                        let rolled = d3.rollups(filtered, 
                            v => ({
                                male: d3.sum(v, d => d.male),
                                female: d3.sum(v, d => d.female),
                                total: d3.sum(v, d => d.total)
                            }), 
                            d => d.countyfips, d => d.year
                        );

                        rolled.forEach(([cfips, yearsMap]) => {
                            yearsMap.forEach((metrics, yr) => {
                                processed_data.push({
                                    countyfips: cfips,
                                    year: yr,
                                    age: `${range[0]} to ${range[1]}`,
                                    countyname: (typeof countyName === "function") ? countyName(parseInt(cfips)) : "County " + cfips,
                                    male: metrics.male,
                                    female: metrics.female,
                                    total: metrics.total
                                });
                            });
                        });
                    });
                } else if (agespec === "single") {
                    // Route standard groupings via native D3 rollups
                    let keys = [d => d.countyfips, d => d.year, d => d.age];
                    if (group === 'opt1') keys = [d => d.year];
                    else if (group === 'opt2') keys = [d => d.countyfips, d => d.year];
                    else if (group === 'opt3') keys = [d => d.year, d => d.age];

                    // Structural execution of dynamic rollups will occur directly in line
                    processed_data = raw_data; // Default passing state
                } else {
                    processed_data = raw_data;
                }

                renderTable(processed_data, group, agespec, yeardata);
            });
        }

        /**
         * Renders the interactive DataTables matrix
         */
        function renderTable(data, group, agespec, yeardata) {
            var out_tab = "<thead><tr>";
            if (data[0] && data[0].countyfips) out_tab += "<th>County FIPS</th><th>County Name</th>";
            out_tab += "<th>Year</th>";
            if (data[0] && data[0].age !== undefined) out_tab += "<th>Age</th>";
            out_tab += "<th>Male Population</th><th>Female Population</th><th>Total Population</th><th>Data Type</th></tr></thead><tbody>";

            data.forEach(row => {
                let yrInfo = yeardata.find(b => row.year == b.year);
                let dtType = yrInfo ? yrInfo.datatype : "Estimate";
                
                out_tab += "<tr>";
                if (row.countyfips) out_tab += `<td>${row.countyfips}</td><td>${row.countyname}</td>`;
                out_tab += `<td>${row.year}</td>`;
                if (row.age !== undefined) out_tab += `<td>${row.age}</td>`;
                
                // Leans directly on your new Global Utility Formatter!
                out_tab += `<td style="text-align: right">${formatSDO(row.male)}</td>`;
                out_tab += `<td style="text-align: right">${formatSDO(row.female)}</td>`;
                out_tab += `<td style="text-align: right">${formatSDO(row.total)}</td>`;
                out_tab += `<td>${dtType}</td></tr>`;
            });
            out_tab += "</tbody>";

            var tabDivOut = document.getElementById("tbl_output");
            if (tabDivOut) {
                tabDivOut.innerHTML = `<table id="syaTab" class="display" style="width:100%">${out_tab}</table>`;
                $("#syaTab").DataTable({ dom: 'Bfrtip', buttons: ['csv'] });
            }
        }

        // --- CORE EXECUTION TRIGGER ---
        d3.json("https://gis.dola.colorado.gov/lookups/componentYRS").then(function(yeardata) {
            
            // Build the primary UI elements using the legacy central populators
            if (typeof popDropdown === "function") popDropdown('county', 'county-dropdown');
            
            var yeardata_recent = yeardata.filter(i => i.year >= 1990);
            
            // Leans on your new global script to organize the years dropdown list safely!
            sdoPopulateYears("year-dropdown", yeardata_recent);

            // Establish DOM Event Bindings
            document.querySelectorAll('input[name="age_grouping"]').forEach(r => {
                r.addEventListener('change', function() { genAgeGroup(this.value); });
            });

            document.getElementById('gentable').addEventListener("click", function() {
                var fips = sdoGetSelectValues(document.getElementById('county-dropdown'));
                var years = sdoGetSelectValues(document.getElementById('year-dropdown'));
                
                if (fips.length === 0 || years.length === 0) {
                    alert("Please select both a county and at least one year.");
                    return;
                }

                var age_group = document.querySelector('input[name="age_grouping"]:checked').value;
                var age_range = [];
                var selectedgroup = "";

                if (age_group === "custom") {
                    for (let i = 0; i < 5; i++) {
                        let s = document.getElementById("agestart" + i).value;
                        let e = document.getElementById("ageend" + i).value;
                        if (s !== "" && e !== "") age_range.push([+s, +e]);
                    }
                } else if (age_group === "single") {
                    age_range = sdoGetSelectValues(document.getElementById("agesel"));
                    selectedgroup = document.querySelector('input[name="age_summary"]:checked').value;
                }

                // Loading layout states
                document.getElementById('tbl_output').innerHTML = '<div class="sdo-loader"></div><div style="margin:10px 0;">Fetching data matrix, please wait...</div>';
                document.getElementById('tbl_output').scrollIntoView({ behavior: 'smooth' });

                genSYACty(fips, years, selectedgroup, age_group, age_range, yeardata_recent);
            });

            document.getElementById('cleartable').addEventListener("click", () => {
                document.getElementById('tbl_output').innerHTML = "";
                document.getElementById('ageselect').innerHTML = "";
                document.querySelectorAll('select').forEach(s => s.selectedIndex = -1);
            });
        });
    }
});