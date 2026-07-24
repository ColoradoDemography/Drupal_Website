/* =====================================================================
   State Demography Office - Housing Dashboard Logic (Apache ECharts)
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
            initHousingDashboard();
        });
    });

    // --- 2. MAIN APPLICATION FUNCTION ---
    function initHousingDashboard() {
        const sdoColors = ['#001970', '#007ADE', '#5BB5FF', '#000000', '#808080', '#BFBFBF', '#35647E', '#5D99BD', '#245D38', '#7A853B', '#E1D100', '#C3002F', '#FF8199', '#6D3A5D', '#9F7FB3'];
        let currentRenderId = 0; // Network race condition prevention

        // Standard CSV Downloader config generator
        function getSDOToolbox(title, filename, data, generateCsvFunc, tableHeaders, tableRowFunc) {
            return {
                top: 25,
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

        // CSV Helper
        function downloadCSV(filename, csvContent) {
            let encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // --- CHART 1: TOTAL & OCCUPIED HOUSING UNITS ---
        function renderHULinePlot(hu_data, ctyName) {
            var chartDom = document.getElementById('hu_line_output');
            var myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
            
            var option = {
                title: { text: 'Total and Occupied Housing Units', subtext: ctyName, left: 0 },
                tooltip: { trigger: 'axis' },
                legend: { bottom: 0 },
                grid: { left: '5%', right: '5%', bottom: '15%', top: 80, containLabel: true },
                toolbox: getSDOToolbox(
                    'Housing Units', ctyName.replace(/ /g, "_") + "_Housing_Units.csv", hu_data,
                    (fname, d) => {
                        let csv = "Geography Type,FIPS,Location,Year,Total Housing Units,Occupied Housing Units,Vacant Housing Units\n";
                        d.forEach(r => csv += `${r.geo},${r.fips},"${r.name}",${r.year},${r.totalhu},${r.occupiedhu},${r.vacanthu}\n`);
                        downloadCSV(fname, csv);
                    },
                    ['Year', 'Total HU', 'Occupied HU', 'Vacant HU'],
                    (r) => `<td style="padding:8px;">${r.year}</td><td style="padding:8px;">${formatSDO(r.totalhu, 'num')}</td><td style="padding:8px;">${formatSDO(r.occupiedhu, 'num')}</td><td style="padding:8px;">${formatSDO(r.vacanthu, 'num')}</td>`
                ),
                xAxis: { type: 'category', data: hu_data.map(d => d.year) },
                yAxis: { type: 'value', axisLabel: { formatter: '{value}' } },
                series: [
                    {
                        name: 'Total Housing Units',
                        type: 'line',
                        data: hu_data.map(d => d.totalhu),
                        itemStyle: { color: sdoColors[1] },
                        symbol: 'circle', symbolSize: 6
                    },
                    {
                        name: 'Occupied Housing Units',
                        type: 'line',
                        data: hu_data.map(d => d.occupiedhu),
                        itemStyle: { color: sdoColors[6] },
                        symbol: 'square', symbolSize: 6
                    }
                ]
            };
            myChart.setOption(option, true);
            myChart.hideLoading();
            window.addEventListener('resize', () => myChart.resize());
        }

        // --- CHART 2: YEAR-OVER-YEAR DIFFERENCE ---
        function renderYoYPlot(hu_data, ctyName) {
            var chartDom = document.getElementById('yoy_line_output');
            var myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
            
            let yoy_data = [];
            for (let i = 1; i < hu_data.length; i++) {
                yoy_data.push({
                    year: hu_data[i].year,
                    tot_diff: hu_data[i].totalhu - hu_data[i-1].totalhu,
                    occ_diff: hu_data[i].occupiedhu - hu_data[i-1].occupiedhu
                });
            }

            var option = {
                title: { text: 'Year-over-Year Housing Unit Difference', subtext: ctyName, left: 0 },
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                legend: { bottom: 0 },
                grid: { left: '5%', right: '5%', bottom: '15%', top: 80, containLabel: true },
                toolbox: getSDOToolbox(
                    'YoY Diff', ctyName.replace(/ /g, "_") + "_YoY_Diff.csv", yoy_data,
                    (fname, d) => {
                        let csv = "Year,Total HU Difference,Occupied HU Difference\n";
                        d.forEach(r => csv += `${r.year},${r.tot_diff},${r.occ_diff}\n`);
                        downloadCSV(fname, csv);
                    },
                    ['Year', 'Total HU Diff', 'Occupied HU Diff'],
                    (r) => `<td style="padding:8px;">${r.year}</td><td style="padding:8px;">${formatSDO(r.tot_diff, 'num')}</td><td style="padding:8px;">${formatSDO(r.occ_diff, 'num')}</td>`
                ),
                xAxis: { type: 'category', data: yoy_data.map(d => d.year) },
                yAxis: { type: 'value', axisLabel: { formatter: '{value}' } },
                series: [
                    {
                        name: 'Total HU Added/Lost',
                        type: 'line',
                        data: yoy_data.map(d => d.tot_diff),
                        itemStyle: { color: sdoColors[1] },
                        symbol: 'circle'
                    },
                    {
                        name: 'Occupied HU Added/Lost',
                        type: 'line',
                        data: yoy_data.map(d => d.occ_diff),
                        itemStyle: { color: sdoColors[6] },
                        symbol: 'square'
                    }
                ]
            };
            myChart.setOption(option, true);
            myChart.hideLoading();
            window.addEventListener('resize', () => myChart.resize());
        }

        // --- CHART 3: OCCUPIED VS VACANT (STACKED BAR) ---
        function renderVacantBar(hu_data, ctyName) {
            var chartDom = document.getElementById('vacant_bar_output');
            var myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
            
            var option = {
                title: { text: 'Occupied vs. Vacant Housing Units', subtext: ctyName, left: 0 },
                tooltip: { 
                    trigger: 'axis', 
                    axisPointer: { type: 'shadow' },
                    formatter: function(params) {
                        let tooltip = `<strong>${params[0].axisValue}</strong><br/>`;
                        let total = 0;
                        params.forEach(p => total += p.value);
                        params.forEach(p => {
                            let pct = ((p.value / total) * 100).toFixed(1);
                            tooltip += `${p.marker} ${p.seriesName}: ${formatSDO(p.value, "num")} (${pct}%)<br/>`;
                        });
                        return tooltip;
                    }
                },
                legend: { bottom: 0 },
                grid: { left: '5%', right: '5%', bottom: '15%', top: 80, containLabel: true },
                toolbox: { top: 25, feature: { saveAsImage: { title: 'Download PNG' } } },
                xAxis: { type: 'category', data: hu_data.map(d => d.year) },
                yAxis: { type: 'value' },
                series: [
                    {
                        name: 'Occupied',
                        type: 'bar',
                        stack: 'total',
                        data: hu_data.map(d => d.occupiedhu),
                        itemStyle: { color: sdoColors[1] }
                    },
                    {
                        name: 'Vacant',
                        type: 'bar',
                        stack: 'total',
                        data: hu_data.map(d => d.vacanthu),
                        itemStyle: { color: sdoColors[10] }
                    }
                ]
            };
            myChart.setOption(option, true);
            myChart.hideLoading();
            window.addEventListener('resize', () => myChart.resize());
        }

        // --- REGIONAL SMALL MULTIPLES ---
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
            let processedData = [];

            regions.forEach(r => {
                let dom = document.getElementById('sm_region_' + r.id);
                let myChart = echarts.getInstanceByDom(dom) || echarts.init(dom);
                myChart.showLoading({ color: '#004b79' });
                myChart.group = 'housing_sync';
                charts.push(myChart);
            });

            let promises = regions.map(r => {
                // FIX: Explode all regions correctly using the internal mapping utility
                let fips_list = sdoGetRegionCounties(r.id).map(d => parseInt(d)).join(",");
                let yr_list = Array.from({length: maxYr - 2010 + 1}, (_, i) => 2010 + i).join(",");
                let url = `https://gis.dola.colorado.gov/lookups/profile?county=${fips_list}&year=${yr_list}&vars=totalhousingunits,vacanthousingunits`;
                return d3.json(url);
            });

            Promise.all(promises).then(results => {
                results.forEach((data, index) => {
                    let r = regions[index];
                    let rolled = d3.rollup(data, v => {
                        let tot = d3.sum(v, d => +(d.totalhousingunits || 0));
                        let vac = d3.sum(v, d => +(d.vacanthousingunits || 0));
                        return { totalhu: tot, vacrate: tot > 0 ? (vac / tot) * 100 : 0 };
                    }, d => d.year);
                    
                    let est_data = Array.from(rolled, ([year, values]) => ({ year: parseInt(year), ...values })).sort((a,b) => a.year - b.year);
                    processedData.push({ region: r, data: est_data });
                });

                function updateCharts(metric) {
                    let isTotal = metric === 'hu';
                    processedData.forEach((item, index) => {
                        let myChart = charts[index];
                        let yData = isTotal ? item.data.map(d => d.totalhu) : item.data.map(d => d.vacrate);
                        let lineColor = item.region.id === 0 ? '#004b79' : sdoColors[1];
                        
                        myChart.setOption({
                            title: { text: item.region.name, textStyle: { fontSize: 13 }, left: 'center' },
                            tooltip: { trigger: 'axis', formatter: p => `<strong>${p[0].axisValue}</strong><br/>${p[0].marker} ${isTotal ? formatSDO(p[0].value, 'num') : p[0].value.toFixed(1) + '%'}` },
                            grid: { left: '20%', right: '5%', bottom: '15%', top: '25%' },
                            xAxis: { type: 'category', data: item.data.map(d => d.year) },
                            yAxis: { type: 'value', axisLabel: { formatter: isTotal ? (v) => d3.format(".2s")(v) : '{value}%' } },
                            series: [{ type: 'line', data: yData, itemStyle: { color: lineColor }, symbol: 'none', areaStyle: { opacity: 0.2, color: lineColor } }]
                        }, true);
                        myChart.hideLoading();
                    });
                }

                updateCharts('hu');
                document.getElementById('btn_sm_hu').addEventListener('click', function() {
                    this.classList.add('active'); document.getElementById('btn_sm_vac').classList.remove('active');
                    updateCharts('hu');
                });
                document.getElementById('btn_sm_vac').addEventListener('click', function() {
                    this.classList.add('active'); document.getElementById('btn_sm_hu').classList.remove('active');
                    updateCharts('vac');
                });
                echarts.connect('housing_sync');
                window.addEventListener('resize', () => charts.forEach(c => c.resize()));
            });
        }

        // --- MAIN FETCH AND CONTROLLER ---
        function fetchHousingData(geotype, fips, ctyName, maxYr) {
            currentRenderId++;
            let myRenderId = currentRenderId;

            let loaders = ['hu_line_output', 'yoy_line_output', 'vacant_bar_output'].map(id => {
                let dom = document.getElementById(id);
                let chart = echarts.getInstanceByDom(dom) || echarts.init(dom);
                chart.showLoading({ color: '#004b79' });
                return chart;
            });

            // FIX: Explicitly explode the FIPS list for the Profile API endpoint
            let fips_list;
            if(geotype === "region") {
                fips_list = sdoGetRegionCounties(parseInt(fips)).map(d => parseInt(d)).join(",");
            } else {
                fips_list = parseInt(fips);
            }

            let yr_list = Array.from({length: maxYr - 2010 + 1}, (_, i) => 2010 + i).join(",");
            let url = `https://gis.dola.colorado.gov/lookups/profile?county=${fips_list}&year=${yr_list}&vars=totalhousingunits,vacanthousingunits`;

            d3.json(url).then(data => {
                if (myRenderId !== currentRenderId) return;

                let cols = ['totalhousingunits', 'vacanthousingunits'];
                let rolled = d3.rollup(data, v => Object.fromEntries(cols.map(c => [c, d3.sum(v, d => +(d[c] || 0))])), d => d.year);
                
                let hu_data = [];
                for (let [year, vals] of rolled) {
                    let th = vals.totalhousingunits;
                    let vh = vals.vacanthousingunits;
                    hu_data.push({
                        geo: geotype, fips: fips, name: ctyName, year: parseInt(year),
                        totalhu: th, vacanthu: vh, occupiedhu: th - vh
                    });
                }
                hu_data.sort((a, b) => a.year - b.year);

                renderHULinePlot(hu_data, ctyName);
                renderYoYPlot(hu_data, ctyName);
                renderVacantBar(hu_data, ctyName);
            }).catch(e => {
                console.error("SDO Housing API Error:", e);
                loaders.forEach(c => c.hideLoading());
            });
        }

        // --- INITIALIZATION ---
        d3.json("https://gis.dola.colorado.gov/lookups/componentYRS").then(function(yeardata) {
            
            // Central SDO Global Helper: Calculates breaking point based on Estimate availability
            SDO_STATE.latestEstimateYear = sdoGetLatestEstimateYear(yeardata);
            
            // THE FIX: The Profile API does not support Forecast years (e.g., 2050).
            // We must strictly bind the maximum year to the latest Estimate year.
            let max_year = SDO_STATE.latestEstimateYear; 
            
            sdoPopulateGeographies('location-dropdown', 'region');
            fetchHousingData("region", "000", "Colorado", max_year);
            renderSmallMultiples(max_year);

            document.getElementById("geo-dropdown").addEventListener("change", function() {
                sdoPopulateGeographies('location-dropdown', this.value);
                let locDrop = document.getElementById("location-dropdown");
                fetchHousingData(this.value, locDrop.value, locDrop.options[locDrop.selectedIndex].text, max_year);
            });

            document.getElementById("location-dropdown").addEventListener("change", function() {
                let selectedGeo = document.getElementById("geo-dropdown").value;
                fetchHousingData(selectedGeo, this.value, this.options[this.selectedIndex].text, max_year);
            });
        });
    }
});