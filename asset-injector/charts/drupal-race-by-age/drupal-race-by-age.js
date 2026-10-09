/* =====================================================================
   State Demography Office - Race by Age Dashboard (Apache ECharts)
   DECOUPLED PRODUCTION BUILD
   ===================================================================== */

window.addEventListener("load", () => {
    
    // --- DYNAMIC DEPENDENCY LOADER ---
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function() { if (callback) callback(); };
        script.src = url;
        document.head.appendChild(script);
    }

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js", function() {
        loadScript("https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js", function() {
            initRaceDashboard();
        });
    });

    // --- MAIN APPLICATION FUNCTION ---
    function initRaceDashboard() {
        const sdoColors = ['#001970', '#007ADE', '#5BB5FF', '#000000', '#808080', '#BFBFBF', '#35647E', '#5D99BD', '#245D38', '#7A853B', '#E1D100', '#C3002F', '#FF8199', '#6D3A5D', '#9F7FB3'];
        let currentRenderId = 0;

        const RACE_MAPPINGS = [
            { id: 'white', label: 'White alone NH', display: 'White, NH', color: sdoColors[1], dom: 'white_bar_output' },
            { id: 'hisp', label: 'Hispanic', display: 'Hispanic', color: sdoColors[9], dom: 'hisp_bar_output' },
            { id: 'black', label: 'Black or African American alone NH', display: 'Black or African American, NH', color: sdoColors[4], dom: 'black_bar_output' },
            { id: 'asian', label: 'Asian alone NH', display: 'Asian, NH', color: sdoColors[13], dom: 'asian_bar_output' },
            { id: 'amind', label: 'American Indian and Alaska Native alone NH', display: 'American Indian and Alaska Native, NH', color: sdoColors[2], dom: 'amind_bar_output' },
            { id: 'nhpi', label: 'Native Hawaiian and Other Pacific Islander alone NH', display: 'Native Hawaiian and Other Pacific Islander, NH', color: sdoColors[14], dom: 'nhpi_bar_output' },
            { id: 'multi', label: 'Two or more NH', display: 'Two or More Races, NH', color: sdoColors[5], dom: 'multi_bar_output' }
        ];

        function getSDOToolbox(title, filename, data, generateCsvFunc, tableHeaders, tableRowFunc) {
            return {
                top: 0,
                feature: {
                    myDownloadCsv: {
                        show: true,
                        title: 'Download CSV',
                        icon: 'path://M14,2H6C4.9,2 4,2.9 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V8L14,2M12,18V14H8V12H12V8L16,13L12,18Z',
                        onclick: function () { generateCsvFunc(filename, data); }
                    },
                    saveAsImage: { title: 'Download PNG' },
                    dataView: {
                        title: 'View Data',
                        readOnly: true,
                        optionToContent: function(opt) {
                            var table = '<table style="width:100%;text-align:left;border-collapse:collapse;font-size:14px;"><tbody>';
                            table += '<tr style="border-bottom:2px solid #ccc; background-color:#f4f6f8;">';
                            tableHeaders.forEach(th => table += `<th style="padding:8px;">${th}</th>`);
                            table += '</tr>';
                            data.forEach(row => {
                                table += '<tr style="border-bottom:1px solid #eee;">' + tableRowFunc(row) + '</tr>';
                            });
                            return '<div style="height:100%;overflow-y:auto;padding:10px;">' + table + '</tbody></table></div>';
                        }
                    }
                }
            };
        }

        function downloadCSV(filename, csvContent) {
            let encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function renderCompositeLine(flatData, ctyName, year, vintageYr) {
            let chartDom = document.getElementById('composite_line_output');
            let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
            
            let ages = Array.from({length: 85}, (_, i) => i); 
            
            let seriesData = RACE_MAPPINGS.map(rm => {
                let raceData = flatData.filter(d => d.race_eth === rm.label);
                let popArray = ages.map(a => {
                    let match = raceData.find(d => d.age === a);
                    return match ? match.count : 0;
                });
                return {
                    name: rm.display,
                    type: 'line',
                    data: popArray,
                    itemStyle: { color: rm.color },
                    symbol: 'none',
                    lineStyle: { width: 2.5 }
                };
            });

            let option = {
                baseOption: {
                    title: { 
                        text: `Single Year of Age by Race/Ethnicity: ${ctyName}, ${year}`,
                        left: 'center',
                        textStyle: { fontSize: 18, color: '#333' }
                    },
                    tooltip: { trigger: 'axis' },
                    graphic: {
                        type: 'text',
                        left: '5%',
                        bottom: 0,
                        style: {
                            text: `Source: Colorado State Demography Office, Vintage ${vintageYr} Estimates`,
                            font: '12px sans-serif',
                            fill: '#000'
                        }
                    },
                    toolbox: getSDOToolbox(
                        'Race By Age', `${ctyName.replace(/ /g, "_")}_RaceByAge_${year}.csv`, flatData,
                        (fname, d) => {
                            let csv = "Location,Year,Age,Race/Ethnicity,Population\n";
                            d.forEach(r => csv += `"${ctyName}",${year},${r.age === 85 ? "85+" : r.age},"${r.race_eth}",${r.count}\n`);
                            downloadCSV(fname, csv);
                        },
                        ['Age', 'Race/Ethnicity', 'Population'],
                        (r) => `<td style="padding:8px;">${r.age === 85 ? "85+" : r.age}</td><td style="padding:8px;">${r.race_eth}</td><td style="padding:8px;">${formatSDO(r.count, 'num')}</td>`
                    ),
                    xAxis: { 
                        type: 'category', 
                        name: 'Age', 
                        nameLocation: 'middle', 
                        nameGap: 30, 
                        data: ages,
                        axisLabel: { interval: function (index, value) { return index % 20 === 0; } },
                        axisTick: { interval: function (index, value) { return index % 20 === 0; } }
                    },
                    yAxis: { type: 'value', name: 'Total Population', nameLocation: 'middle', nameGap: 50, axisLabel: { formatter: '{value}' } },
                    series: seriesData
                },
                media: [
                    {
                        // MOBILE RESPONSIVE LAYOUT FIXES
                        query: { maxWidth: 768 },
                        option: {
                            title: { 
                                text: `Single Year of Age by Race/Ethnicity:\n${ctyName}, ${year}`,
                                textStyle: { fontSize: 14, lineHeight: 20 }
                            },
                            legend: { 
                                orient: 'horizontal',
                                right: 'center',
                                top: 'auto',
                                bottom: 25, // Bumped slightly up to avoid source text collision
                                type: 'plain', 
                                textStyle: { fontSize: 11 }
                            },
                            // Expanded bottom space massively (to 200) to clear the multi-line wrapped legend
                            grid: { left: '5%', right: '5%', bottom: 200, top: 70, containLabel: true }
                        }
                    },
                    {
                        // DESKTOP RESPONSIVE LAYOUT
                        query: { minWidth: 769 },
                        option: {
                            title: { 
                                text: `Single Year of Age by Race/Ethnicity: ${ctyName}, ${year}`,
                                textStyle: { fontSize: 18 }
                            },
                            legend: { 
                                orient: 'vertical',
                                right: 0,
                                top: 'center',
                                type: 'scroll',
                                textStyle: { fontSize: 12 }
                            },
                            grid: { left: '5%', right: '35%', bottom: '15%', top: 60, containLabel: true }
                        }
                    }
                ]
            };
            myChart.setOption(option, true);
            myChart.hideLoading();
            window.addEventListener('resize', () => myChart.resize());
        }

        function renderIndividualBars(flatData, ctyName, year) {
            let ages = Array.from({length: 85}, (_, i) => i);
            
            RACE_MAPPINGS.forEach(rm => {
                let chartDom = document.getElementById(rm.dom);
                let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
                
                let raceData = flatData.filter(d => d.race_eth === rm.label);
                let popArray = ages.map(a => {
                    let match = raceData.find(d => d.age === a);
                    return match ? match.count : 0;
                });

                let option = {
                    title: {
                        text: rm.display,
                        subtext: `${ctyName}, ${year}`,
                        left: 'center',
                        textStyle: { fontSize: 14, color: '#333' }
                    },
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                    grid: { left: '5%', right: '5%', bottom: '10%', top: 60, containLabel: true },
                    toolbox: { 
                        top: 0, 
                        feature: { 
                            saveAsImage: { 
                                name: `${ctyName.replace(/ /g, "_")}_${rm.display.replace(/,/g, '').replace(/ /g, "_")}_${year}`,
                                title: 'Download PNG' 
                            } 
                        } 
                    },
                    xAxis: { 
                        type: 'category', 
                        data: ages,
                        axisLabel: { interval: function (index, value) { return index % 10 === 0; } },
                        axisTick: { interval: function (index, value) { return index % 10 === 0; } }
                    },
                    yAxis: { type: 'value', axisLabel: { formatter: (val) => d3.format(".2s")(val) } },
                    series: [{
                        name: rm.display,
                        type: 'bar',
                        data: popArray,
                        itemStyle: { color: rm.color }
                    }]
                };
                myChart.setOption(option, true);
                myChart.hideLoading();
                window.addEventListener('resize', () => myChart.resize());
            });
        }

        function fetchRaceData(geotype, fips, ctyName, year, vintageYr) {
            currentRenderId++;
            let myRenderId = currentRenderId;

            let domIds = ['composite_line_output'].concat(RACE_MAPPINGS.map(rm => rm.dom));
            let charts = domIds.map(id => {
                let dom = document.getElementById(id);
                let chart = echarts.getInstanceByDom(dom) || echarts.init(dom);
                chart.showLoading({ color: '#004b79' });
                return chart;
            });

            let fips_list;
            if(geotype === "region") {
                fips_list = sdoGetRegionCounties(parseInt(fips)).map(d => parseInt(d)).join(",");
            } else if (fips === "000" || fips === "0") {
                fips_list = sdoGetRegionCounties(0).map(d => parseInt(d)).join(",");
            } else {
                fips_list = parseInt(fips);
            }

            let ageList = Array.from({length: 101}, (_, i) => i).join(",");

            let urlHisp = `https://gis.dola.colorado.gov/lookups/county_sya_race_estimates_current?age=${ageList}&county=${fips_list}&year=${year}&race=1,2,3,4,5,6&ethnicity=1&sex=b&group=opt0`;
            let urlNonHisp = `https://gis.dola.colorado.gov/lookups/county_sya_race_estimates_current?age=${ageList}&county=${fips_list}&year=${year}&race=1,2,3,4,5,6&ethnicity=2&sex=b&group=opt0`;

            Promise.all([d3.json(urlHisp), d3.json(urlNonHisp)]).then(results => {
                if (myRenderId !== currentRenderId) return;

                let hispData = results[0].map(d => ({ age: parseInt(d.age), race_eth: 'Hispanic', count: parseInt(d.count) }));
                let nonHispData = results[1].map(d => ({ age: parseInt(d.age), race_eth: d.race + ' NH', count: parseInt(d.count) }));
                
                let combinedRaw = hispData.concat(nonHispData);

                let rolled = d3.rollup(combinedRaw, v => d3.sum(v, d => d.count), d => d.age, d => d.race_eth);
                
                let flatData = [];
                for (let [age, races] of rolled) {
                    let displayAge = age >= 85 ? 85 : age; 
                    for (let [race_eth, count] of races) {
                        flatData.push({ age: displayAge, race_eth: race_eth, count: count });
                    }
                }

                let finalRolled = d3.rollup(flatData, v => d3.sum(v, d => d.count), d => d.age, d => d.race_eth);
                let finalFlatData = [];
                for (let [age, races] of finalRolled) {
                    for (let [race_eth, count] of races) {
                        finalFlatData.push({ age: age, race_eth: race_eth, count: count });
                    }
                }
                finalFlatData.sort((a,b) => a.age - b.age);

                renderCompositeLine(finalFlatData, ctyName, year, vintageYr);
                renderIndividualBars(finalFlatData, ctyName, year);

            }).catch(err => {
                console.error("SDO Race API Error:", err);
                charts.forEach(c => c.hideLoading());
            });
        }

        d3.json("https://gis.dola.colorado.gov/lookups/componentYRS").then(function(yeardata) {
            
            let estYears = yeardata.filter(d => d.datatype === "Estimate" && d.year >= 2020);
            let latestYear = d3.max(estYears, d => parseInt(d.year));
            let vintageYr = SDO_STATE.latestEstimateYear = sdoGetLatestEstimateYear(yeardata);
            
            sdoPopulateYears('year-dropdown', estYears.sort((a,b) => b.year - a.year)); 
            sdoPopulateGeographies('location-dropdown', 'region'); 
            
            fetchRaceData("region", "000", "Colorado", latestYear, vintageYr);

            document.getElementById("geo-dropdown").addEventListener("change", function() {
                sdoPopulateGeographies('location-dropdown', this.value);
                let locDrop = document.getElementById("location-dropdown");
                let yearDrop = document.getElementById("year-dropdown");
                fetchRaceData(this.value, locDrop.value, locDrop.options[locDrop.selectedIndex].text, yearDrop.value, vintageYr);
            });

            document.getElementById("location-dropdown").addEventListener("change", function() {
                let selectedGeo = document.getElementById("geo-dropdown").value;
                let yearDrop = document.getElementById("year-dropdown");
                fetchRaceData(selectedGeo, this.value, this.options[this.selectedIndex].text, yearDrop.value, vintageYr);
            });

            document.getElementById("year-dropdown").addEventListener("change", function() {
                let selectedGeo = document.getElementById("geo-dropdown").value;
                let locDrop = document.getElementById("location-dropdown");
                fetchRaceData(selectedGeo, locDrop.value, locDrop.options[locDrop.selectedIndex].text, this.value, vintageYr);
            });
        });
    }
});