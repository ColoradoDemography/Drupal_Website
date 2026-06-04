/* =====================================================================
   State Demography Office - County Single Year of Age Lookup Logic
   ===================================================================== */

window.addEventListener("load", () => {
    
    // --- LOAD DATATABLES CORE CSS ---
    var dtCss = document.createElement("link");
    dtCss.rel = "stylesheet";
    dtCss.href = "https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.css";
    document.head.appendChild(dtCss);
    
    // 1. DYNAMICALLY LOAD DEPENDENCIES SEQUENTIALLY
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function() { if (callback) callback(); };
        script.src = url;
        document.head.appendChild(script);
    }

    // Load jQuery -> DataTables -> D3 -> Run App
    loadScript("https://code.jquery.com/jquery-3.7.0.js", function() {
        loadScript("https://cdn.datatables.net/v/dt/jszip-3.10.1/dt-1.13.5/b-2.4.1/b-html5-2.4.1/datatables.min.js", function() {
            loadScript("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js", function() {
                initSYALookup(); 
            });
        });
    });


    // 2. MAIN APPLICATION FUNCTION
    function initSYALookup() {
        
        // --- UTILITY FUNCTIONS ---
        
        // Polyfill for missing number formatter
        function fixNUMFMT(val, type) {
            if(isNaN(val) || val === null || val === "") return "";
            if(type === "num") return d3.format(",.0f")(val);
            if(type === "dec") return d3.format(",.2f")(val);
            if(type === "pct") return d3.format(".1%")(val);
            return val;
        }

        function getSelectValues(select) {
          var result = [];
          var options = select && select.options;
          for (var i = 0; i < options.length; i++) {
            if (options[i].selected) { result.push(options[i].value); }
          }
          return result;
        }

               function popDropdown(level, ddid, callpg) {
            var county = [
                {'location':'Colorado', 'fips': '000'}, {'location':'Adams County', 'fips': '001'},
                {'location':'Alamosa County', 'fips': '003'},{'location':'Arapahoe County', 'fips': '005'},
                {'location':'Archuleta County', 'fips': '007'},{'location':'Baca County', 'fips': '009'},
                {'location':'Bent County', 'fips': '011'},{'location':'Boulder County', 'fips': '013'},
                {'location':'Broomfield County', 'fips': '014'},{'location':'Chaffee County', 'fips': '015'},
                {'location':'Cheyenne County', 'fips': '017'},{'location':'Clear Creek County', 'fips': '019'},
                {'location':'Conejos County', 'fips': '021'},{'location':'Costilla County', 'fips': '023'},
                {'location':'Crowley County', 'fips': '025'},{'location':'Custer County', 'fips': '027'},
                {'location':'Delta County', 'fips': '029'},{'location':'Denver County', 'fips': '031'},
                {'location':'Dolores County', 'fips': '033'},{'location':'Douglas County', 'fips': '035'},
                {'location':'Eagle County', 'fips': '037'},{'location':'Elbert County', 'fips': '039'},
                {'location':'El Paso County', 'fips': '041'},{'location':'Fremont County', 'fips': '043'},
                {'location':'Garfield County', 'fips': '045'},{'location':'Gilpin County', 'fips': '047'},
                {'location':'Grand County', 'fips': '049'},{'location':'Gunnison County', 'fips': '051'},
                {'location':'Hinsdale County', 'fips': '053'},{'location':'Huerfano County', 'fips': '055'},
                {'location':'Jackson County', 'fips': '057'},{'location':'Jefferson County', 'fips': '059'},
                {'location':'Kiowa County', 'fips': '061'},{'location':'Kit Carson County', 'fips': '063'},
                {'location':'Lake County', 'fips': '065'},{'location':'La Plata County', 'fips': '067'},
                {'location':'Larimer County', 'fips': '069'},{'location':'Las Animas County', 'fips': '071'},
                {'location':'Lincoln County', 'fips': '073'},{'location':'Logan County', 'fips': '075'},
                {'location':'Mesa County', 'fips': '077'},{'location':'Mineral County', 'fips': '079'},
                {'location':'Moffat County', 'fips': '081'},{'location':'Montezuma County', 'fips': '083'},
                {'location':'Montrose County', 'fips': '085'},{'location':'Morgan County', 'fips': '087'},
                {'location':'Otero County', 'fips': '089'},{'location':'Ouray County', 'fips': '091'},
                {'location':'Park County', 'fips': '093'},{'location':'Phillips County', 'fips': '095'},
                {'location':'Pitkin County', 'fips': '097'},{'location':'Prowers County', 'fips': '099'},
                {'location':'Pueblo County', 'fips': '101'},{'location':'Rio Blanco County', 'fips': '103'},
                {'location':'Rio Grande County', 'fips': '105'},{'location':'Routt County', 'fips': '107'},
                {'location':'Saguache County', 'fips': '109'},{'location':'San Juan County', 'fips': '111'},
                {'location':'San Miguel County', 'fips': '113'},{'location':'Sedgwick County', 'fips': '115'},
                {'location':'Summit County', 'fips': '117'},{'location':'Teller County', 'fips': '119'},
                {'location':'Washington County', 'fips': '121'},{'location':'Weld County', 'fips': '123'},
                {'location':'Yuma County', 'fips': '125'}
            ];
            var sel = document.getElementById(ddid);
            sel.innerHTML = "";
            for (var i = 0; i < county.length; i++) {
                var el = document.createElement("option");
                el.textContent = county[i].location;
                el.value = county[i].fips;
                sel.appendChild(el);
            }
        }

        function popYrdd(ddid, yeardata) {
            var sel = document.getElementById(ddid);
            sel.innerHTML = "";
            yeardata.forEach(j => {
                var el = document.createElement("option");
                if (j.datatype == "Estimate") {
                    el.style.color = "black";
                    el.textContent = j.year;
                } else {
                    el.style.color = "#A51C30";
                    el.style.fontWeight = "bold";
                    el.textContent = j.year;
                }
                el.value = j.year;
                sel.appendChild(el);
            });
        }

        function genAgeGroup(group, type) {
            var outcell = document.getElementById('ageselect');
            outcell.innerHTML = "";
            var tabdiv = document.createElement('div');
            var tabtxt = document.createElement('p');
            if (group == "custom") {
                tabtxt.innerHTML = '<strong>Designate up to 5 intervals between 0 and 100:</strong><br>';
                var outitem = document.createElement("table");
                for (let i = 0; i < 5; i++) {
                    var tblrow = document.createElement("tr");
                    var cella = document.createElement("td");
                    var labela = document.createElement("label");
                    labela.htmlFor = "agestart" + i;
                    labela.innerHTML = "From: ";
                    var inputa = document.createElement("input");
                    inputa.type = "text";
                    inputa.id = "agestart" + i;
                    inputa.name = "agestart" + i;
                    cella.appendChild(labela);
                    cella.appendChild(inputa);

                    var cellb = document.createElement("td");
                    var labelb = document.createElement("label");
                    labelb.htmlFor = "ageend" + i;
                    labelb.innerHTML = "To: ";
                    var inputb = document.createElement("input");
                    inputb.type = "text";
                    inputb.id = "ageend" + i;
                    inputb.name = "ageend" + i;
                    cellb.appendChild(labelb);
                    cellb.appendChild(inputb);

                    tblrow.appendChild(cella);
                    tblrow.appendChild(cellb);
                    outitem.appendChild(tblrow);
                }
                tabdiv.appendChild(tabtxt);
                tabdiv.appendChild(outitem);
            }
            if (group == "single") {
                tabtxt.innerHTML = '<strong>Select one or more ages:</strong><br>';
                var outdiv = document.createElement("div");
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
                
                var grparr = [
                    {'id': 'NoGrp', 'txt': 'No Grouping', 'optval': 'opt0'},
                    {'id': 'yrGrp', 'txt': 'Group by Year', 'optval': 'opt1'},
                    {'id': 'ctyGrp', 'txt': 'Group by County and Year', 'optval': 'opt2'},
                    {'id': 'ageGrp', 'txt': 'Group by Age and Year', 'optval': 'opt3'}
                ];
                
                for (let i = 0; i < grparr.length; i++) {
                    var wrap = document.createElement('div');
                    wrap.className = 'radio-wrap';
                    var radioInput = document.createElement('input');
                    var radioLabel = document.createElement('label');
                    radioInput.type = "radio";
                    radioInput.id = grparr[i].id;
                    radioInput.name = "age_summary";
                    radioInput.value = grparr[i].optval;
                    radioLabel.htmlFor = grparr[i].id;
                    radioLabel.innerHTML = " " + grparr[i].txt;
                    wrap.appendChild(radioInput);
                    wrap.appendChild(radioLabel);
                    outdiv.appendChild(wrap);
                }
                tabdiv.appendChild(tabtxt);
                tabdiv.appendChild(outitem);
                tabdiv.appendChild(outdiv);
            }

            if (group == "custom" || group == "single") {
                outcell.appendChild(tabdiv);
                if (group == "single") {
                    document.getElementById('NoGrp').checked = true;
                }
            }
        }

        function sumSYA(in_data, spec, grp, type) {
            var out_data = [];
            var columnsToSum = ["male", "female", "total"];
            switch (spec) {
                case "custom":
                    if (type == "county") {
                        var binroll = d3.rollup(in_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.countyfips, d => d.year);
                        for (let [key, value] of binroll) {
                            for (let [key1, value1] of value) {
                                out_data.push({
                                    'countyfips': key,
                                    'countyname': countyName(key),
                                    'year': key1,
                                    'age': grp,
                                    'male': value1.male,
                                    'female': value1.female,
                                    'total': value1.total
                                });
                            }
                        }
                    }
                    break;
                case "single":
                    switch (grp) {
                        case "opt0":
                            out_data = in_data;
                            break;
                        case "opt1":
                            var binroll = d3.rollup(in_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year);
                            for (let [key, value] of binroll) {
                                out_data.push({'year': key, 'male': value.male, 'female': value.female, 'total': value.total});
                            }
                            break;
                        case "opt2":
                            var binroll = d3.rollup(in_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.countyfips, d => d.year);
                            for (let [key, value] of binroll) {
                                for (let [key1, value1] of value) {
                                    out_data.push({'countyfips': key, 'countyname': countyName(key), 'year': key1, 'male': value1.male, 'female': value1.female, 'total': value1.total});
                                }
                            }
                            break;
                        case "opt3":
                            var binroll = d3.rollup(in_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year, d => d.age);
                            for (let [key, value] of binroll) {
                                for (let [key1, value1] of value) {
                                    out_data.push({'year': key, 'age': key1, 'male': value1.male, 'female': value1.female, 'total': value1.total});
                                }
                            }
                            break;
                    }
                    break;
            }
            return out_data;
        }

        function genSYACty(loc, year_arr, group, agespec, age_arr, yeardata) {
            var fips_arr2 = [];
            for (var j = 0; j < loc.length; j++) {
                fips_arr2.push(parseInt(loc[j]));
            }

            var age_arr2 = [];
            var age_range = [];
            switch (agespec) {
                case "custom":
                    for (var i = 0; i < age_arr.length; i++) {
                        age_range.push({'age_start': age_arr[i][0], 'age_end': age_arr[i][1], "age_str": age_arr[i][0] + " to " + age_arr[i][1]});
                    }
                    break;
                case "single":
                    age_arr2 = age_arr;
                    break;
            }

            var fips_list = fips_arr2.join(",");
            var year_list = year_arr.join(",");
            var urlstr = "";

            switch (agespec) {
                case "custom":
                    var age_arr2 = [];
                    for (var a = 0; a <= 100; a++) { age_arr2.push(a); }
                    var age_list = age_arr2.join(",");
                    urlstr = "https://gis.dola.colorado.gov/lookups/sya?age=" + age_list + "&county=" + fips_list + "&year=" + year_list + "&choice=single";
                    break;
                case "single":
                    var age_list = age_arr2.join(",");
                    urlstr = "https://gis.dola.colorado.gov/lookups/sya?age=" + age_list + "&county=" + fips_list + "&year=" + year_list + "&choice=single";
                    break;
                default:
                    urlstr = "https://gis.dola.colorado.gov/lookups/sya?age=0,100&county=" + fips_list + "&year=" + year_list + "&choice=" + agespec;
                    break;
            }

            // Fetch data
            d3.json(urlstr).then(function(data) {
                var raw_data = [];
                data.forEach(i => {
                    raw_data.push({
                        "countyfips": i.countyfips,
                        "countyname": countyName(i.countyfips),
                        "year": i.year,
                        "age": i.age,
                        "male": +i.malepopulation,
                        "female": +i.femalepopulation,
                        "total": +i.totalpopulation,
                        "datatype": i.datatype
                    });
                });

                var tab_data = [];
                switch (agespec) {
                    case "custom":
                        for (var j = 0; j < age_range.length; j++) {
                            var rng_data = raw_data.filter(d => ((d.age >= age_range[j].age_start) && (d.age <= age_range[j].age_end)));
                            var sum_data = sumSYA(rng_data, agespec, age_range[j].age_str, "county");
                            tab_data = tab_data.concat(sum_data);
                        }
                        break;
                    case "single":
                        tab_data = sumSYA(raw_data, agespec, group, "county");
                        break;
                    default:
                        tab_data = raw_data;
                }

                // Generate Table HTML
                var out_tab = "<thead><tr>";
                if (agespec == "single") {
                    switch (group) {
                        case "opt0": out_tab += "<th>County FIPS</th><th>County Name</th><th>Year</th><th>Age</th><th>Male Population</th><th>Female Population</th><th>Total Population</th><th>Data Type</th>"; break;
                        case "opt1": out_tab += "<th>Year</th><th>Male Population</th><th>Female Population</th><th>Total Population</th><th>Data Type</th>"; break;
                        case "opt2": out_tab += "<th>County FIPS</th><th>County Name</th><th>Year</th><th>Male Population</th><th>Female Population</th><th>Total Population</th><th>Data Type</th>"; break;
                        case "opt3": out_tab += "<th>Year</th><th>Age</th><th>Male Population</th><th>Female Population</th><th>Total Population</th><th>Data Type</th>"; break;
                    }
                } else {
                    out_tab += "<th>County FIPS</th><th>County Name</th><th>Year</th><th>Age</th><th>Male Population</th><th>Female Population</th><th>Total Population</th><th>Data Type</th>";
                }
                out_tab += "</tr></thead><tbody>";

                for (var i = 0; i < tab_data.length; i++) {
                    var filtData = yeardata.filter(b => tab_data[i].year == b.year);
                    var dtType = filtData.length > 0 ? filtData[0].datatype : "Estimate";
                    
                    var tmp_row = "<tr>";
                    if (agespec == "single") {
                        switch (group) {
                            case "opt0":
                                tmp_row += "<td>" + tab_data[i].countyfips + "</td><td>" + tab_data[i].countyname + "</td><td>" + tab_data[i].year + "</td><td>" + tab_data[i].age + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].male, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].female, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].total, "num") + "</td><td>" + dtType + "</td>";
                                break;
                            case "opt1":
                                tmp_row += "<td>" + tab_data[i].year + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].male, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].female, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].total, "num") + "</td><td>" + dtType + "</td>";
                                break;
                            case "opt2":
                                tmp_row += "<td>" + tab_data[i].countyfips + "</td><td>" + tab_data[i].countyname + "</td><td>" + tab_data[i].year + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].male, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].female, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].total, "num") + "</td><td>" + dtType + "</td>";
                                break;
                            case "opt3":
                                tmp_row += "<td>" + tab_data[i].year + "</td><td>" + tab_data[i].age + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].male, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].female, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].total, "num") + "</td><td>" + dtType + "</td>";
                                break;
                        }
                    } else {
                        tmp_row += "<td>" + tab_data[i].countyfips + "</td><td>" + tab_data[i].countyname + "</td><td>" + tab_data[i].year + "</td><td>" + tab_data[i].age + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].male, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].female, "num") + "</td><td style='text-align: right'>" + fixNUMFMT(tab_data[i].total, "num") + "</td><td>" + dtType + "</td>";
                    }
                    tmp_row += "</tr>";
                    out_tab += tmp_row;
                }
                out_tab += "</tbody>";

                // Render Output table
                var tabDivOut = document.getElementById("tbl_output");
                tabDivOut.innerHTML = "";
                var tabName = "syaTab";
                $(tabDivOut).append("<table id=" + tabName + " class='display' style='width:100%'></table>");
                $("#" + tabName).append(out_tab);

                $("#" + tabName).DataTable({
                    dom: 'Bfrtip',
                    buttons: ['csv']
                });
            });
        }

        
        // --- MAIN INITIALIZATION & EVENT BINDING ---
        
        // Fetch base year data and populate dropdowns
        var urlstr = "https://gis.dola.colorado.gov/lookups/componentYRS";
        var globalYearData = [];

        d3.json(urlstr).then(function(yeardata) {
            globalYearData = yeardata;
            popDropdown('county', 'county-dropdown', '');
            var yeardata2 = yeardata.filter(i => i.year >= 1990);
            popYrdd("year-dropdown", yeardata2);

            // Bind logic to the modern radio buttons
            var radios = document.querySelectorAll('input[name="age_grouping"]');
            radios.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    genAgeGroup(this.value, 'county');
                });
            });

            // Bind Generate button
            document.getElementById('gentable').addEventListener("click", function() {
                var complete = true;
                var outputmsg = "";
                document.getElementById('tbl_output').innerHTML = "";

                var fipsdd = document.getElementById('county-dropdown');
                var selectedfips = getSelectValues(fipsdd);

                if (selectedfips.length == 0) {
                    outputmsg += " > Please select one or more counties.\n";
                    complete = false;
                }

                var yrdd = document.getElementById('year-dropdown');
                var selectedyr = getSelectValues(yrdd);

                if (selectedyr.length == 0) {
                    outputmsg += " > Please select one or more years.\n";
                    complete = false;
                }

                var selectedgroup = "";
                var age_range = [];
                var age_group = document.querySelector('input[name="age_grouping"]:checked').value;

                switch (age_group) {
                    case "custom":
                        for (var i = 0; i < 5; i++) {
                            var box_val1 = "agestart" + i;
                            var box_val2 = "ageend" + i;
                            var startval = 0;
                            var endval = 0;
                            
                            var el1 = document.getElementById(box_val1);
                            var el2 = document.getElementById(box_val2);
                            
                            if (el1 && el1.value !== "") {
                                startval = el1.value;
                                if (isNaN(startval)) {
                                    outputmsg += " > One of the age entries is not numeric. Please check the inputs.\n";
                                    complete = false;
                                }
                            }
                            if (el2 && el2.value !== "") {
                                endval = el2.value;
                                if (isNaN(endval)) {
                                    outputmsg += " > One of the age entries is not numeric. Please check the inputs.\n";
                                    complete = false;
                                }
                            }
                            if (+startval > +endval) {
                                outputmsg += " > One of the age ranges is incorrect. Please check the inputs.\n";
                                complete = false;
                            }
                            if (complete) {
                                if (!((+startval == 0) && (+endval == 0))) {
                                    age_range.push([+startval, +endval]);
                                }
                            }
                        } 
                        break;
                    case "single":
                        var agesel = document.getElementById("agesel");
                        age_range = getSelectValues(agesel);
                        if (age_range.length == 0) {
                            outputmsg += " > Please select a range of ages.\n";
                            complete = false;
                        }
                        var grp_check = document.querySelector('input[name="age_summary"]:checked');
                        selectedgroup = grp_check ? grp_check.value : "opt0";
                        break;
                }

if (complete) {
                // 1. Show the spinner
                var loadingHTML = '<div class="sdo-loader"></div><div class="sdo-loading-text">Fetching data, please wait...</div>';
                var outputDiv = document.getElementById('tbl_output');
                outputDiv.innerHTML = loadingHTML;

                // 2. NEW: Smoothly scroll the screen down to the spinner!
                outputDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // 3. Call the API function
                genSYACty(selectedfips, selectedyr, selectedgroup, age_group, age_range, yeardata2);
            } else {
                window.alert(outputmsg);
            }
            });

            // Bind Reset button
            document.getElementById('cleartable').addEventListener("click", function() {
                document.getElementById('tbl_output').innerHTML = "";
                document.getElementById('ageselect').innerHTML = "";

                var elements = document.getElementsByTagName('select');
                for (var i = 0; i < elements.length; i++) {
                    elements[i].selectedIndex = -1;
                }
                var ele = document.getElementsByName("age_grouping");
                for (var i = 0; i < ele.length; i++) {
                    ele[i].checked = false;
                }
                ele[0].checked = true;
            });

        }); 
    }
});