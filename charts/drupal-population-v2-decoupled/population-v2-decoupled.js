/* =====================================================================
   State Demography Office - Demographic Dashboard Logic (Apache ECharts)
   DECOUPLED PRODUCTION BUILD
   ===================================================================== */

window.addEventListener("load", () => {
    
    // --- 1. DYNAMIC DEPENDENCY LOADER (The Sandbox) ---
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function() { if (callback) callback(); };
        script.src = url;
        document.head.appendChild(script);
    }

    // Load D3 -> Load ECharts -> Run App
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js", function() {
        loadScript("https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js", function() {
            initDashboard(); 
        });
    });

    // --- 2. MAIN APPLICATION FUNCTION ---
    function initDashboard() {
        
        const sdoColors = ['#001970', '#007ADE', '#5BB5FF', '#000000', '#808080', '#BFBFBF', '#35647E', '#5D99BD', '#245D38', '#7A853B', '#E1D100', '#C3002F', '#FF8199', '#6D3A5D', '#9F7FB3'];
        let currentRenderId = 0; // Prevents asynchronous race conditions

        // --- ECHARTS RENDERER: CHART 1 (TOTAL POPULATION) ---
        function renderEstPlot(est_flat, maxYr, ctyName, yrvalue) {
            var chartDom = document.getElementById('est_output');
            var myChart = echarts.getInstanceByDom(chartDom);

            var pop_est_data = est_flat.filter(d => d.type == "Estimate");
            var pop_for_data = est_flat.filter(d => d.type == "Forecast");
            
            // Connect lines seamlessly
            var lastEst = pop_est_data[pop_est_data.length - 1];
            var estSeriesData = pop_est_data.map(d => d.totalpopulation).concat(Array(pop_for_data.length).fill('-'));
            var forPad = Array(pop_est_data.length - 1).fill('-');
            // FIX: Pass 'symbol: none' to the overlapping anchor point so the grey diamond doesn't hide the blue dot
						var forSeriesData = forPad.concat(
						    [{ value: lastEst.totalpopulation, symbol: 'none' }], 
						    pop_for_data.map(d => d.totalpopulation)
						);

            var option = {
                title: {
                    text: 'Estimates & Forecasts (1990-' + maxYr + ')', 
                    subtext: ctyName + ' (Vintage ' + yrvalue + ')',
                    left: 0
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        let tooltipText = `<strong>${params[0].axisValue}</strong><br/>`;
                        let seenValues = new Set(); 
                        params.forEach(param => {
                            if (param.value !== '-' && param.value !== undefined && !isNaN(param.value)) {
                                if (!seenValues.has(param.value)) {
                                    tooltipText += `${param.marker} ${param.seriesName}: ${formatSDO(param.value, "num")}<br/>`;
                                    seenValues.add(param.value);
                                }
                            }
                        });
                        return tooltipText;
                    }
                },
                legend: { bottom: 0 },
                grid: { left: '5%', right: '5%', bottom: '15%', top: 80, containLabel: true },
                toolbox: {
                    top: 25, 
                    feature: {
                        myDownloadCsv: {
                            show: true,
                            title: 'Download CSV',
                            icon: 'path://M14,2H6C4.9,2 4,2.9 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V8L14,2M12,18V14H8V12H12V8L16,13L12,18Z',
                            onclick: function () {
                                let csvContent = "data:text/csv;charset=utf-8,Geography Type,FIPS,Location,Year,Population,Data Type\n";
                                est_flat.forEach(row => {
                                    csvContent += `${row.geo},${row.fips},"${row.name}",${row.year},${row.totalpopulation},${row.type}\n`;
                                });
                                let encodedUri = encodeURI(csvContent);
                                let link = document.createElement("a");
                                link.setAttribute("href", encodedUri);
                                link.setAttribute("download", ctyName.replace(/ /g, "_") + "_Pop_Estimates.csv");
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        },
                        saveAsImage: { title: 'Download PNG' },
                        dataView: { 
                            title: 'View Data', 
                            readOnly: true,
                            optionToContent: function(opt) {
                                var table = '<table style="width:100%;text-align:left;border-collapse:collapse;font-size:14px;"><tbody>'
                                     + '<tr style="border-bottom:2px solid #ccc; background-color:#f4f6f8;">'
                                     + '<th style="padding:8px;">Geo Type</th>'
                                     + '<th style="padding:8px;">FIPS</th>'
                                     + '<th style="padding:8px;">Location</th>'
                                     + '<th style="padding:8px;">Year</th>'
                                     + '<th style="padding:8px;">Estimate</th>'
                                     + '<th style="padding:8px;">Forecast</th>'
                                     + '</tr>';
                                
                                est_flat.forEach(row => {
                                    let estVal = row.type === 'Estimate' ? formatSDO(row.totalpopulation, "num") : '';
                                    let forVal = row.type === 'Forecast' ? formatSDO(row.totalpopulation, "num") : '';
                                    table += '<tr style="border-bottom:1px solid #eee;">'
                                         + '<td style="padding:8px;">' + row.geo + '</td>'
                                         + '<td style="padding:8px;">' + row.fips + '</td>'
                                         + '<td style="padding:8px;">' + row.name + '</td>'
                                         + '<td style="padding:8px;">' + row.year + '</td>'
                                         + '<td style="padding:8px;">' + estVal + '</td>'
                                         + '<td style="padding:8px;">' + forVal + '</td>'
                                         + '</tr>';
                                });
                                table += '</tbody></table>';
                                return '<div style="height:100%;overflow-y:auto;padding:10px;">' + table + '</div>';
                            }
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    name: 'Year',
                    data: est_flat.map(d => d.year)
                },
                yAxis: {
                    type: 'value',
                    name: 'Total Population',
                    axisLabel: { formatter: '{value}' }
                },
                series: [
                    {
                        name: 'Estimate',
                        type: 'line',
                        data: estSeriesData,
                        itemStyle: { color: sdoColors[1] },
                        symbol: 'circle',
                        symbolSize: 6
                    },
                    {
                        name: 'Forecast',
                        type: 'line',
                        data: forSeriesData,
                        itemStyle: { color: sdoColors[4] },
                        lineStyle: { type: 'dashed' },
                        symbol: 'diamond',
                        symbolSize: 8
                    }
                ]
            };

            myChart.setOption(option, true);
            myChart.hideLoading();

            window.addEventListener('resize', function() {
                myChart.resize();
            });
        }

        // --- ECHARTS RENDERER: CHART 2 (GROWTH STORY) ---
        function renderGrowthPlot(est_flat, maxYr, ctyName, yrvalue) {
            var chartDom = document.getElementById('growth_story_output');
            var myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
            
            var xAxisYears = [];
            var estGrowthData = [];
            var forGrowthData = [];

            for (let i = 0; i < est_flat.length; i++) {
                xAxisYears.push(est_flat[i].year);
                
                let type = est_flat[i].type;
                let dataPoint = '-';

                if (i > 0) {
                    let currentPop = est_flat[i].totalpopulation;
                    let prevPop = est_flat[i - 1].totalpopulation;
                    let absChange = currentPop - prevPop;
                    let growthPct = ((absChange) / prevPop) * 100;
                    
                    dataPoint = {
                        value: growthPct.toFixed(2),
                        absChange: absChange,
                        type: type
                    };
                }

                if (type === 'Estimate') {
                    estGrowthData.push(dataPoint);
                    forGrowthData.push('-');
                } else {
                    estGrowthData.push('-');
                    forGrowthData.push(dataPoint);
                }
            }

            var option = {
                title: {
                    text: 'Annual Population Growth Rate',
                    subtext: ctyName,
                    left: 0
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function(params) {
                        let tooltipText = `<strong>${params[0].axisValue}</strong><br/>`;
                        let activeParam = params.find(p => p.value !== '-' && p.value !== undefined);
                        
                        if (activeParam && activeParam.data && activeParam.data.value !== '-') {
                            let pct = activeParam.data.value;
                            let abs = activeParam.data.absChange;
                            let action = abs >= 0 ? "Added" : "Lost";
                            let absFormatted = formatSDO(Math.abs(abs), "num");
                            
                            tooltipText += `${activeParam.marker} ${activeParam.seriesName}<br/>`;
                            tooltipText += `Growth Rate: <strong>${pct}%</strong><br/>`;
                            tooltipText += `<em>(${action} ${absFormatted} people)</em>`;
                        } else {
                            tooltipText += `<em>Base year (no previous data to calculate growth)</em>`;
                        }
                        
                        return tooltipText;
                    }
                },
                legend: { bottom: 0 },
                grid: { left: '5%', right: '5%', bottom: '15%', top: 80, containLabel: true },
                toolbox: {
                    top: 25, 
                    feature: {
                        myDownloadCsv: {
                            show: true,
                            title: 'Download CSV',
                            icon: 'path://M14,2H6C4.9,2 4,2.9 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V8L14,2M12,18V14H8V12H12V8L16,13L12,18Z',
                            onclick: function () {
                                let csvContent = "data:text/csv;charset=utf-8,Geography Type,FIPS,Location,Year,Data Type,Absolute Change,Growth Rate (%)\n";
                                for (let i = 0; i < est_flat.length; i++) {
                                    let row = est_flat[i];
                                    let absChange = '';
                                    let growthPct = '';
                                    if (i > 0) {
                                        let prevPop = est_flat[i - 1].totalpopulation;
                                        absChange = row.totalpopulation - prevPop;
                                        growthPct = ((absChange / prevPop) * 100).toFixed(2);
                                    }
                                    csvContent += `${row.geo},${row.fips},"${row.name}",${row.year},${row.type},${absChange},${growthPct}\n`;
                                }
                                let encodedUri = encodeURI(csvContent);
                                let link = document.createElement("a");
                                link.setAttribute("href", encodedUri);
                                link.setAttribute("download", ctyName.replace(/ /g, "_") + "_Pop_Growth.csv");
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        },
                        saveAsImage: { title: 'Download PNG' },
                        dataView: { 
                            title: 'View Data', 
                            readOnly: true,
                            optionToContent: function(opt) {
                                var table = '<table style="width:100%;text-align:left;border-collapse:collapse;font-size:14px;"><tbody>'
                                     + '<tr style="border-bottom:2px solid #ccc; background-color:#f4f6f8;">'
                                     + '<th style="padding:8px;">Geo Type</th>'
                                     + '<th style="padding:8px;">FIPS</th>'
                                     + '<th style="padding:8px;">Location</th>'
                                     + '<th style="padding:8px;">Year</th>'
                                     + '<th style="padding:8px;">Type</th>'
                                     + '<th style="padding:8px;">Abs. Change</th>'
                                     + '<th style="padding:8px;">Growth Rate</th>'
                                     + '</tr>';
                                
                                for (let i = 0; i < est_flat.length; i++) {
                                    let row = est_flat[i];
                                    let absChange = '-';
                                    let growthPct = '-';
                                    if (i > 0) {
                                        let prevPop = est_flat[i - 1].totalpopulation;
                                        let rawChange = row.totalpopulation - prevPop;
                                        absChange = formatSDO(rawChange, "num");
                                        growthPct = ((rawChange / prevPop) * 100).toFixed(2) + '%';
                                    }

                                    table += '<tr style="border-bottom:1px solid #eee;">'
                                         + '<td style="padding:8px;">' + row.geo + '</td>'
                                         + '<td style="padding:8px;">' + row.fips + '</td>'
                                         + '<td style="padding:8px;">' + row.name + '</td>'
                                         + '<td style="padding:8px;">' + row.year + '</td>'
                                         + '<td style="padding:8px;">' + row.type + '</td>'
                                         + '<td style="padding:8px;">' + absChange + '</td>'
                                         + '<td style="padding:8px;">' + growthPct + '</td>'
                                         + '</tr>';
                                }
                                table += '</tbody></table>';
                                return '<div style="height:100%;overflow-y:auto;padding:10px;">' + table + '</div>';
                            }
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    name: 'Year',
                    data: xAxisYears
                },
                yAxis: {
                    type: 'value',
                    name: 'Growth Rate (%)',
                    axisLabel: { formatter: '{value} %' }
                },
                series: [
                    {
                        name: 'Estimate',
                        type: 'bar',
                        stack: 'growth', 
                        data: estGrowthData,
                        itemStyle: { color: sdoColors[1] },
                        markLine: {
                            data: [ { type: 'average', name: 'Historical Avg' } ],
                            lineStyle: { color: '#888', type: 'dashed', width: 1.5 }, 
                            label: { 
                                formatter: 'Historical Avg: {c}%', 
                                position: 'insideEndTop',
                                fontSize: 12,
                                fontWeight: 'bold',
                                padding: [0, 0, 5, 0],
                                color: '#555' 
                            },
                            tooltip: { show: false } 
                        },
                        markArea: {
                            itemStyle: { color: 'rgba(0, 0, 0, 0.06)' }, 
                            label: { position: 'insideTop', color: '#666', fontSize: 10, paddingTop: 5 },
                            data: [
                                [ { name: '90s', xAxis: '1990' }, { xAxis: '1991' } ],
                                [ { name: 'Dot-Com', xAxis: '2001' }, { xAxis: '2002' } ],
                                [ { name: 'Great\nRecession', xAxis: '2007' }, { xAxis: '2009' } ],
                                [ { name: 'COVID-19', xAxis: '2020' }, { xAxis: '2021' } ]
                            ]
                        }
                    },
                    {
                        name: 'Forecast',
                        type: 'bar',
                        stack: 'growth',
                        data: forGrowthData,
                        itemStyle: { color: sdoColors[4] } 
                    }
                ]
            };

            myChart.setOption(option, true);
            myChart.hideLoading(); 

            window.addEventListener('resize', function() {
                myChart.resize();
            });
        }
        
        // --- ECHARTS RENDERER: REGIONAL SMALL MULTIPLES ---
        function renderSmallMultiples(maxYr) {
            const regions = [
                { id: 0, name: 'Colorado (Statewide)' },
                { id: 17, name: 'Front Range' },
                { id: 19, name: 'Western Slope' },
                { id: 15, name: 'Central Mountains' },
                { id: 16, name: 'Eastern Plains' },
                { id: 18, name: 'San Luis Valley' }
            ];

            let charts = [];
            let processedRegionsData = [];

            regions.forEach(r => {
                let dom = document.getElementById('sm_region_' + r.id);
                let myChart = echarts.getInstanceByDom(dom) || echarts.init(dom);
                myChart.showLoading({ color: '#004b79', text: 'Loading...' });
                myChart.group = 'regional_sync'; 
                charts.push(myChart);
            });

            let promises = regions.map(r => {
                let fips_list = r.id === 0 ? "0" : sdoGetRegionCounties(r.id).map(d => parseInt(d)).join(",");
                let yr_list = 1990;
                for(let i = 1991; i <= maxYr; i++) { yr_list += "," + i; }
                let url = "https://gis.dola.colorado.gov/lookups/sya?county=" + fips_list + "&year=" + yr_list + "&choice=single&group=3";
                return d3.json(url);
            });

            Promise.all(promises).then(results => {
                results.forEach((data, index) => {
                    let r = regions[index];
                    let columnsEst = ['totalpopulation'];
                    let est_sum = d3.rollup(data, v => d3.sum(v, d => +d[columnsEst[0]]), d => d.year);
                    
                    let est_data = [];
                    for (let [key, value] of est_sum) {
                        est_data.push({ 'year': parseInt(key), 'totalpopulation': value });
                    }
                    est_data.sort((a, b) => a.year - b.year);

                    for (let i = 0; i < est_data.length; i++) {
                        if (i === 0) {
                            est_data[i].growth = null;
                            est_data[i].absChange = null;
                        } else {
                            let currentPop = est_data[i].totalpopulation;
                            let prevPop = est_data[i-1].totalpopulation;
                            let absChange = currentPop - prevPop;
                            
                            est_data[i].absChange = absChange;
                            est_data[i].growth = (absChange / prevPop) * 100;
                        }
                    }
                    processedRegionsData.push({ region: r, data: est_data });
                });

                function updateCharts(metric) {
                    let isPop = metric === 'pop';

                    processedRegionsData.forEach((item, index) => {
                        let myChart = charts[index];
                        let r = item.region;
                        
                        let yData = isPop ? item.data.map(d => d.totalpopulation) : item.data.map(d => d.growth);
                        let lineColor = r.id === 0 ? '#004b79' : sdoColors[1];
                        
                        let option = {
                            title: { text: r.name, textStyle: { fontSize: 14 }, left: 'center' },
                            tooltip: { 
                                trigger: 'axis',
                                formatter: function(params) {
                                    let dataIndex = params[0].dataIndex;
                                    let row = item.data[dataIndex];
                                    
                                    let tooltipText = `<strong>${r.name}</strong><br/>${row.year}<br/>`;
                                    
                                    if (isPop) {
                                        tooltipText += `${params[0].marker} Population: <strong>${formatSDO(row.totalpopulation, "num")}</strong>`;
                                    } else {
                                        if (row.growth === null) {
                                            tooltipText += `<em>Base year (no previous data)</em>`;
                                        } else {
                                            let pct = row.growth.toFixed(2);
                                            let abs = row.absChange;
                                            let action = abs >= 0 ? "Added" : "Lost";
                                            let absFormatted = formatSDO(Math.abs(abs), "num");
                                            
                                            tooltipText += `${params[0].marker} Growth Rate: <strong>${pct}%</strong><br/>`;
                                            tooltipText += `<em>(${action} ${absFormatted} people)</em>`;
                                        }
                                    }
                                    return tooltipText;
                                }
                            },
                            grid: { left: '15%', right: '5%', bottom: '15%', top: '25%' },
                            xAxis: { type: 'category', data: item.data.map(d => d.year) },
                            yAxis: { 
                                type: 'value', 
                                axisLabel: { formatter: isPop ? (val) => d3.format(".2s")(val) : (val) => val + '%' } 
                            },
                            series: [{
                                type: 'line', 
                                data: yData,
                                itemStyle: { color: lineColor },
                                symbol: 'none', 
                                areaStyle: { opacity: 0.2, color: lineColor } 
                            }]
                        };

                        myChart.setOption(option, false); 
                        myChart.hideLoading();
                    });
                }

                updateCharts('pop');

                document.getElementById('btn_sm_pop').addEventListener('click', function() {
                    this.classList.add('active');
                    document.getElementById('btn_sm_growth').classList.remove('active');
                    updateCharts('pop');
                });

                document.getElementById('btn_sm_growth').addEventListener('click', function() {
                    this.classList.add('active');
                    document.getElementById('btn_sm_pop').classList.remove('active');
                    updateCharts('growth');
                });

                echarts.connect('regional_sync');
                
                if (window.ResizeObserver) {
                    const resizeObserver = new ResizeObserver(() => { charts.forEach(c => c.resize()); });
                    const gridDom = document.querySelector('.sdo-3col-grid');
                    if (gridDom) resizeObserver.observe(gridDom);
                }
                
                window.addEventListener('resize', function() { charts.forEach(c => c.resize()); });

            }).catch(err => {
                console.error("Small Multiples API Error:", err);
                charts.forEach(c => c.hideLoading());
            });
        }
        
        // --- API FETCH LOGIC ---
        function genDEMO(geotype, fips, ctyName, yrvalue, maxYr) {
            
            currentRenderId++;
            let myRenderId = currentRenderId;

            // Spin up Chart 1 Loader
            var chartDom = document.getElementById('est_output');
            var myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
            myChart.showLoading({ text: 'Crunching data for ' + ctyName + '...', color: '#004b79', textColor: '#004b79' });

            // Spin up Chart 2 Loader
            var growthChartDom = document.getElementById('growth_story_output');
            var myGrowthChart = echarts.getInstanceByDom(growthChartDom) || echarts.init(growthChartDom);
            myGrowthChart.showLoading({ text: 'Calculating growth rates...', color: '#004b79', textColor: '#004b79' });

            // --- Determine the correct API parameter ---
            var fips_list;

            // THE ZERO-INTERCEPT: Treat Region "000" exactly like a County to use fast pre-aggregated data
            if(geotype === "region" && fips !== "000" && fips !== "0") {
                // Standard Region: Explode into component counties
                var rawRegion = sdoGetRegionCounties(parseInt(fips));
                fips_list = rawRegion.map(d => parseInt(d)).join(",");
            } else {
                // County (or State Total): Query the FIPS code directly
                fips_list = parseInt(fips);
            }

            var yr_list = 1990;
            for(let i = 1991; i <= maxYr; i++) { yr_list += "," + i; }
            
            var esturl = "https://gis.dola.colorado.gov/lookups/sya?county=" + fips_list + "&year=" + yr_list + "&choice=single&group=3";
            
            d3.json(esturl).then(function(data) {
                
                if (myRenderId !== currentRenderId) return;

                var columnsEst = ['totalpopulation'];
                var est_sum = d3.rollup(data, v => Object.fromEntries(columnsEst.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year);
                
                var est_data = [];
                for (let [key, value] of est_sum) {
                    est_data.push({
                        'geo': geotype,
                        'fips': fips,
                        'name': ctyName,
                        'year': parseInt(key), 
                        'totalpopulation': value.totalpopulation, 
                        'type': parseInt(key) <= yrvalue ? "Estimate" : "Forecast"
                    });
                }
                
                est_data.sort((a, b) => a.year - b.year);
                
                renderEstPlot(est_data, maxYr, ctyName, yrvalue);
                renderGrowthPlot(est_data, maxYr, ctyName, yrvalue);
                
            }).catch(function(error) {
                console.error("SDO API Error:", error);
                if(myChart) myChart.hideLoading();
                if(myGrowthChart) myGrowthChart.hideLoading();
                alert("Failed to fetch data for this region. Please check the Developer Console for details.");
            });
        }
        
        // --- INITIALIZATION ---
        var urlstr = "https://gis.dola.colorado.gov/lookups/componentYRS";
        d3.json(urlstr).then(function(yeardata) {
            
            // Central SDO Global Helper: Calculates breaking point
            SDO_STATE.latestEstimateYear = sdoGetLatestEstimateYear(yeardata);

            var allyrs = yeardata.map(d => d.year);
            var max_year = d3.max(allyrs);
            var yrvalue = SDO_STATE.latestEstimateYear;

            // Route UI population to Global Utility (Init as Region)
            sdoPopulateGeographies('location-dropdown', 'region');
            
            genDEMO("region", "000", "Colorado", yrvalue, max_year);
            renderSmallMultiples(max_year);

            document.getElementById("geo-dropdown").addEventListener("change", function() {
                sdoPopulateGeographies('location-dropdown', this.value);
                var locDrop = document.getElementById("location-dropdown");
                var newFips = locDrop.value;
                var newName = locDrop.options[locDrop.selectedIndex].text;
                genDEMO(this.value, newFips, newName, yrvalue, max_year);
            });

            document.getElementById("location-dropdown").addEventListener("change", function() {
                var selectedGeo = document.getElementById("geo-dropdown").value;
                var selectedFips = this.value;
                var selectedName = this.options[this.selectedIndex].text;
                genDEMO(selectedGeo, selectedFips, selectedName, yrvalue, max_year);
            });
        });
    }
});