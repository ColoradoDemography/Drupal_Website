/* =====================================================================
   State Demography Office - Demographic Dashboard Logic (Apache ECharts)
   ===================================================================== */

window.addEventListener("load", () => {
    
    // --- 1. DYNAMIC DEPENDENCY LOADER ---
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

        // --- CORE DATA ARRAYS ---
        var countyArr = [
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

        var regionArr = [
            {'optgroup': 'Geographic Region', 'location': 'Central Mountains', 'regnum': '15'},	
            {'optgroup': 'Geographic Region', 'location': 'Eastern Plains', 'regnum': '16'},
            {'optgroup': 'Geographic Region', 'location': 'Front Range', 'regnum': '17'},
            {'optgroup': 'Geographic Region', 'location': 'San Luis Valley', 'regnum': '18'},
            {'optgroup': 'Geographic Region', 'location': 'Western Slope', 'regnum': '19'}
        ];

        function regionCOL(regnum) {
            var fips = []; 
            if(regnum == 15) fips = ['015', '019', '027', '043', '047', '055', '065', '071', '093'];
            if(regnum == 16) fips = ['009', '011', '017', '025', '039', '061', '063', '073', '075', '087', '089', '095', '099', '115', '121', '125'];
            if(regnum == 17) fips = ['001', '005', '013', '014', '031', '035', '041', '059', '069', '101','119','123'];
            if(regnum == 18) fips = ['003', '021', '023', '079', '105', '109'];
            if(regnum == 19) fips = ['007', '029', '033', '037', '045', '049', '051', '053', '057', '067', '077', '081', '083', '085', '091', '097', '103', '107', '111', '113', '117'];
            return fips;
        }

        // --- UTILITY FUNCTIONS ---
        function popDropdown(level, ddid) {
            var sel = document.getElementById(ddid);
            sel.innerHTML = "";
            if(level === 'county') {
                countyArr.forEach(c => {
                    var el = document.createElement("option");
                    el.textContent = c.location;
                    el.value = c.fips;
                    sel.appendChild(el);
                });
            } else if(level === 'region') {
                var groups = [...new Set(regionArr.map(tag => tag.optgroup))];
                groups.forEach(g => {
                    var groupfilt = regionArr.filter(d => d.optgroup == g);
                    var grp = document.createElement("optgroup");
                    grp.label = g;
                    groupfilt.forEach(c => {
                        var optTxt = document.createElement("option");
                        optTxt.textContent = c.location;
                        optTxt.value = c.regnum;
                        grp.appendChild(optTxt);
                    });
                    sel.add(grp);
                });
            }
        }

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
            var forSeriesData = forPad.concat([lastEst.totalpopulation], pop_for_data.map(d => d.totalpopulation));

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
                                    tooltipText += `${param.marker} ${param.seriesName}: ${d3.format(",")(param.value)}<br/>`;
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
                    top: 25, // Push icons down to clear title
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
                                    let estVal = row.type === 'Estimate' ? d3.format(",")(row.totalpopulation) : '';
                                    let forVal = row.type === 'Forecast' ? d3.format(",")(row.totalpopulation) : '';
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
            
            // Calculate Annual Growth Rates & Absolute Change
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
                            let absFormatted = d3.format(",")(Math.abs(abs));
                            
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
                    top: 25, // Push icons down to clear title
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
                                        absChange = d3.format(",")(rawChange);
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
                        
                        // --- HISTORICAL AVERAGE LINE ---
                        markLine: {
                            data: [ { type: 'average', name: 'Historical Avg' } ],
                            lineStyle: { color: '#888', type: 'dashed', width: 1.5 }, 
                            label: { 
                                formatter: 'Historical Avg: {c}%', 
                                position: 'insideEndTop', // Pulls the label inside the chart
                                fontSize: 12,
                                fontWeight: 'bold',
                                padding: [0, 0, 5, 0], // Adds 5px padding to lift it slightly off the dashed line
                                color: '#555' 
                            },
                            tooltip: { show: false } // Prevents the tooltip from breaking when hovering on the line
                        },

                        // --- RECESSION BANDS from FRED data ---
                        markArea: {
                            itemStyle: { color: 'rgba(0, 0, 0, 0.06)' }, 
                            label: { 
                                position: 'insideTop', 
                                color: '#666', 
                                fontSize: 10,
                                paddingTop: 5
                            },
                            data: [
                                // FRED: Jul 1990 - Mar 1991
                                [ { name: '90s', xAxis: '1990' }, { xAxis: '1991' } ],
                                
                                // FRED: Mar 2001 - Nov 2001
                                [ { name: 'Dot-Com', xAxis: '2001' }, { xAxis: '2002' } ],
                                
                                // FRED: Dec 2007 - Jun 2009
                                [ { name: 'Great\nRecession', xAxis: '2007' }, { xAxis: '2009' } ],
                                
                                // FRED: Feb 2020 - Apr 2020
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
        
        // --- ECHARTS RENDERER: REGIONAL SMALL MULTIPLES (WITH TOGGLE & ADVANCED TOOLTIP) ---
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
                let fips_list = r.id === 0 ? "0" : regionCOL(r.id).map(d => parseInt(d)).join(",");
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

                    // Calculate Growth AND Absolute Change
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
                                    // Use dataIndex to fetch the full row of data, not just the Y-axis value
                                    let dataIndex = params[0].dataIndex;
                                    let row = item.data[dataIndex];
                                    
                                    let tooltipText = `<strong>${r.name}</strong><br/>${row.year}<br/>`;
                                    
                                    if (isPop) {
                                        tooltipText += `${params[0].marker} Population: <strong>${d3.format(",")(row.totalpopulation)}</strong>`;
                                    } else {
                                        if (row.growth === null) {
                                            tooltipText += `<em>Base year (no previous data)</em>`;
                                        } else {
                                            let pct = row.growth.toFixed(2);
                                            let abs = row.absChange;
                                            let action = abs >= 0 ? "Added" : "Lost";
                                            let absFormatted = d3.format(",")(Math.abs(abs));
                                            
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
            if(geotype === "region") {
                // Regions still need to send a comma-separated list of their specific counties
                var rawRegion = regionCOL(parseInt(fips));
                var rawFipsArray = rawRegion[0].fips ? rawRegion[0].fips : rawRegion;
                fips_list = rawFipsArray.map(d => parseInt(d)).join(",");
            } else {
                // If it's a specific county (e.g., "013") OR the whole state ("000"), 
                // we can just pass that single number directly to the API
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
            var allyrs = yeardata.map(d => d.year);
            var max_year = d3.max(allyrs);
            var maxest = yeardata.filter(d => d.datatype == 'Estimate');
            var yrvalue = d3.max(maxest.map(d => d.year)); 

            popDropdown('county', 'location-dropdown');
            
            // Initial call for the top two charts
            genDEMO("county", "000", "Colorado", yrvalue, max_year);

						// Render the 5 small multiples at the bottom
            renderSmallMultiples(max_year);

            document.getElementById("geo-dropdown").addEventListener("change", function() {
                popDropdown(this.value, 'location-dropdown');
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