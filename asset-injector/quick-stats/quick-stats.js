(function ($, Drupal) {

  // Dynamic helper to load D3 if not already present
  function loadD3(callback) {
    if (window.d3) {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  Drupal.behaviors.sdoDataDashboard = {
    attach: function (context, settings) {
      var selectElem = document.getElementById('county-dropdown');

      if (!selectElem || selectElem.getAttribute('data-sdo-init')) {
        return;
      }
      selectElem.setAttribute('data-sdo-init', 'true');

      loadD3(function () {
        var acsYear = 2024; // ACS 5-Year Vintage (2020-2024)

        populateCountySelect(selectElem);

        // Resolve latest SDO estimate year (2025) from componentYRS with safe 2025 fallback
        d3.json("https://gis.dola.colorado.gov/lookups/componentYRS")
          .then(function (yeardata) {
            var detectedYear = (typeof sdoGetLatestEstimateYear === "function" && Array.isArray(yeardata) && yeardata.length)
              ? sdoGetLatestEstimateYear(yeardata)
              : 2025;
            var currentYear = detectedYear >= 2025 ? detectedYear : 2025;

            if (typeof SDO_STATE !== "undefined") {
              SDO_STATE.latestEstimateYear = currentYear;
            }
            initQuickStats(currentYear);
          })
          .catch(function (err) {
            console.warn("componentYRS lookup failed, defaulting to 2025:", err);
            initQuickStats(2025);
          });

        function initQuickStats(currentYear) {
          function updateDashboard(fips) {
            var geoName = getGeoName(fips);

            genSYA(fips, currentYear, geoName);
            genHousing(fips, currentYear, geoName);
            genCOC(fips, currentYear, geoName);
            genRaceEth(fips, currentYear, geoName);
            genTenure(fips, acsYear, geoName);
            genACS(fips, acsYear, geoName);
          }

          var initialFips = selectElem.value || '000';
          updateDashboard(initialFips);

          $(selectElem).on('change', function () {
            updateDashboard($(this).val());
          });
        }
      });
    }
  };

  // --- GEOGRAPHY NAME RESOLUTION HELPER --- //
  function getGeoName(fips) {
    if (fips === "000" || fips === 0 || fips === "0") {
      return "Colorado";
    }
    if (typeof sdoGetCountyName === "function") {
      return sdoGetCountyName(fips);
    }
    if (typeof SDO_COUNTY_NAMES !== "undefined") {
      var cleanFips = parseInt(fips, 10);
      return SDO_COUNTY_NAMES[cleanFips] || "County " + fips;
    }
    var $opt = $('#county-dropdown option:selected');
    return $opt.length ? $opt.text() : "County " + fips;
  }

  // --- DROPDOWN POPULATOR --- //
  function populateCountySelect(selectElem) {
    selectElem.innerHTML = "";
    
    var stateOpt = document.createElement("option");
    stateOpt.value = "000";
    stateOpt.textContent = "Colorado";
    selectElem.appendChild(stateOpt);

    if (typeof sdoPopulateGeographies === "function") {
      sdoPopulateGeographies('county-dropdown', 'county');
      if (selectElem.options[0].value !== "000") {
        selectElem.insertBefore(stateOpt, selectElem.options[0]);
      }
      selectElem.value = "000";
    } else if (typeof SDO_COUNTY_NAMES !== "undefined") {
      Object.keys(SDO_COUNTY_NAMES).forEach(function (fips) {
        if (fips !== "0" && fips !== "500") {
          var formattedFips = ("000" + fips).slice(-3);
          var opt = document.createElement("option");
          opt.value = formattedFips;
          opt.textContent = SDO_COUNTY_NAMES[fips];
          selectElem.appendChild(opt);
        }
      });
      selectElem.value = "000";
    }
  }

  function getFipsList(fips) {
    if (fips === "000" || fips === 0 || fips === "0") {
      if (typeof sdoGetRegionCounties === "function") {
        return sdoGetRegionCounties(0).map(function (d) { return parseInt(d, 10); }).join(",");
      }
      return "1,3,5,7,9,11,13,14,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125";
    }
    return parseInt(fips, 10);
  }

  function transpose(data) {
    let result = {};
    for (let row of data) {
      for (let [key, value] of Object.entries(row)) {
        result[key] = result[key] || [];
        result[key].push([{ name: key, value: value }]);
      }
    }
    return result;
  }

  // --- CPI LOOKUP TABLE & HELPERS --- //
  var SDO_CPI_TABLE = {
    2010: 320.3, 2011: 330.4, 2012: 337.5, 2013: 342.5, 2014: 347.8,
    2015: 348.3, 2016: 352.2, 2017: 360.2, 2018: 368.0, 2019: 376.5,
    2020: 381.2, 2021: 399.0, 2022: 429.7, 2023: 447.2, 2024: 460.0
  };

  function getCPIAdj(curyr, prevyr) {
    var curCPI = SDO_CPI_TABLE[curyr] || 1;
    var prevCPI = SDO_CPI_TABLE[prevyr] || 1;
    return curCPI / prevCPI;
  }

  function acsChkDiff(curpct, curmoe, prevpct, prevmoe) {
    var outcome = "equal";
    var se_cur = curmoe / 1.645;
    var se_prev = prevmoe / 1.645;
    var se_sum = Math.pow(se_cur, 2) + Math.pow(se_prev, 2);
    var se_sqrt = Math.sqrt(se_sum);
    var est_diff = Math.abs(curpct - prevpct);
    var diff_crit = se_sqrt > 0 ? est_diff / se_sqrt : 0;
    if (diff_crit > 1.645) {
      outcome = (curpct > prevpct) ? 'increase' : 'decrease';
    }
    return outcome;
  }

  function returnRank(indata, fips, key) {
    var sorted = indata.slice().sort((a, b) => d3.descending(a[key], b[key]));
    if (fips === "000") {
      sorted = sorted.filter(d => d.state != 11 && d.state != 72); // Filter DC & PR
    }
    for (var i = 0; i < sorted.length; i++) {
      if (fips === "000") {
        if (sorted[i].state == 8) return i + 1;
      } else {
        if (sorted[i].county == parseInt(fips, 10)) return i + 1;
      }
    }
    return "-";
  }

  function acsPctMOE(totest, totmoe, varpct, varmoe) {
    if (!totest) return 0;
    var fractionY = 1 / totest;
    var moeYsq = Math.pow(totmoe, 2);
    var moeXsq = Math.pow(varmoe, 2);
    var Psq = Math.pow(varpct, 2);
    var moePsq = moeXsq - (Psq * moeYsq);
    return Math.sqrt(Math.abs(moePsq)) * fractionY;
  }

  // --- SECTION STATUS HELPERS --- //
  // Each section gets a "ticket" so a slow response for a previously selected
  // geography cannot overwrite the section after the user has changed geography.
  var sectionTickets = {};

  function beginSection(selector, geoName) {
    var id = (sectionTickets[selector] = (sectionTickets[selector] || 0) + 1);
    $(selector).empty().append(
      $("<p class='sdo-status sdo-loading' role='status'></p>").text("Loading data for " + geoName + "…")
    );
    return function () { return sectionTickets[selector] === id; };
  }

  function showSectionMessage(selector, isCurrent, kind) {
    if (!isCurrent()) return;
    var msg = (kind === "empty")
      ? "No data is available for this selection."
      : "This data could not be loaded right now. Please try again later.";
    $(selector).empty().append(
      $("<p class='sdo-status sdo-" + kind + "' role='status'></p>").text(msg)
    );
  }

  // --- DASHBOARD TABLE GENERATORS --- //

  function genSYA(fips, yrvalue, geoName) {
    // Zero-Intercept Rule: use pre-aggregated county=0 for Statewide Colorado
    var fips_list = (fips === "000" || fips === 0 || fips === "0") ? 0 : parseInt(fips, 10);
    var prevyear = yrvalue - 1;
    var year10 = 2030;
    var yr_list = prevyear + "," + yrvalue + "," + year10;
    var urlstr = "https://gis.dola.colorado.gov/lookups/sya?county=" + fips_list + "&year=" + yr_list + "&choice=single&group=3";
    var totaldata = [];

    function fmtNum(val) {
      var rounded = Math.round(val);
      return typeof formatSDO === "function" ? formatSDO(rounded, "num") : d3.format(",")(rounded);
    }

    var isCurrent = beginSection('#PopTab', geoName);

    d3.json(urlstr).then(function (data) {
      if (!isCurrent()) return;
      if (!data || !data.length) { showSectionMessage('#PopTab', isCurrent, "empty"); return; }
      data.forEach(function (obj) {
        if (obj.age >= 0 && obj.age <= 17) obj.age_cat = "0 to 17";
        else if (obj.age >= 18 && obj.age <= 24) obj.age_cat = "18 to 24";
        else if (obj.age >= 25 && obj.age <= 44) obj.age_cat = "25 to 44";
        else if (obj.age >= 45 && obj.age <= 64) obj.age_cat = "45 to 64";
        else if (obj.age >= 65) obj.age_cat = "65 +";
        // Sum unrounded floats; round only at display time to match SYA Lookup
        totaldata.push({ year: +obj.year, age_cat: obj.age_cat, totalpopulation: +obj.totalpopulation });
      });

      var total_ann = d3.rollup(totaldata, v => d3.sum(v, d => d.totalpopulation), d => d.year);
      var total_age = d3.rollup(totaldata, v => d3.sum(v, d => d.totalpopulation), d => d.year, d => d.age_cat);

      var total_ann_tmp = [];
      for (let [key, value] of total_ann) {
        total_ann_tmp.push({ year: key, totalpopulation: value });
      }
      var total_ann_flat = total_ann_tmp.sort((a, b) => d3.ascending(a.year, b.year));

      var total_age_tmp = [];
      for (let [key1, value] of total_age) {
        for (let [key2, value2] of value) {
          total_age_tmp.push({ year: key1, age_cat: key2, totalpopulation: value2 });
        }
      }
      var total_age_flat = total_age_tmp
        .sort((a, b) => d3.ascending(a.age_cat, b.age_cat))
        .sort((a, b) => d3.ascending(a.year, b.year));

      var tbl_arr = [];
      if (total_ann_flat.length >= 3) {
        tbl_arr.push({
          age_cat: '<b>Total</b>',
          prevval: "<b>" + fmtNum(total_ann_flat[0].totalpopulation) + "</b>",
          curval: "<b>" + fmtNum(total_ann_flat[1].totalpopulation) + "</b>",
          forval: "<b>" + fmtNum(total_ann_flat[2].totalpopulation) + "</b>"
        });
      }

      var ages = [...new Set(total_age_flat.map(tag => tag.age_cat))];
      for (var i = 0; i < ages.length; i++) {
        var filt = total_age_flat.filter(d => d.age_cat == ages[i]);
        if (filt.length >= 3) {
          tbl_arr.push({
            age_cat: ages[i],
            prevval: fmtNum(filt[0].totalpopulation),
            curval: fmtNum(filt[1].totalpopulation),
            forval: fmtNum(filt[2].totalpopulation)
          });
        }
      }

      d3.select('#PopTab').html("");
      $("#PopTab").append("<h2 class='h2_style'>Population Estimates by Age — " + geoName + "</h2>");
      $("#PopTab").append("<a href='https://demography.colorado.gov/county-single-year-of-age-lookup' target='_blank'>Single Year of Age Lookup</a><p></p>");

      var tblcolumns2 = ['Ages', 'Number, ' + prevyear, 'Number, ' + yrvalue, '2030 Forecast'];
      var syatab = d3.select('#PopTab').append('table').style('table-layout', 'fixed');
      var thead = syatab.append('thead');
      var tbody = syatab.append('tbody');

      thead.append('tr').selectAll('th').data(tblcolumns2).enter().append('th')
        .text(d => d).style("border", "1px black solid").style("width", "25%").style("text-align", "center").style("font-weight", "bold");

      var rows = tbody.selectAll('tr').data(tbl_arr).enter().append('tr').style("color", "black");

      rows.append('td').style("text-align", "left").style('font-size', '10pt').html(m => m.age_cat);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.prevval);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.curval);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.forval);
    }).catch(function (err) {
      console.error("SYA Fetch Error:", err);
      showSectionMessage('#PopTab', isCurrent, "error");
    });
  }

  function genCOC(fips, yrvalue, geoName) {
    var fmt_pct = d3.format(".2%");
    var fmt_comma = d3.format(",");
    var fips_list = getFipsList(fips);
    var prevyear = yrvalue - 1;
    var yr_list = prevyear + "," + yrvalue;
    var urlstr = "https://gis.dola.colorado.gov/lookups/components?county=" + fips_list + "&year=" + yr_list;

    var isCurrent = beginSection('#COCTab', geoName);

    d3.json(urlstr).then(function (data) {
      if (!isCurrent()) return;
      if (!data || !data.length) { showSectionMessage('#COCTab', isCurrent, "empty"); return; }

      // Roll up rows by year so multi-county queries (Colorado total) sum correctly
      var columnsToSum = ['estimate', 'births', 'deaths', 'netmig', 'change'];
      var coc_sum = d3.rollup(data, 
        v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), 
        d => d.year
      );

      var COCdata = [];
      for (let [yearKey, obj] of coc_sum) {
        COCdata.push({
          year: yearKey,
          estimate: obj.estimate,
          Births: obj.births,
          Deaths: obj.deaths,
          'Net Migration': obj.netmig,
          natincr: obj.change
        });
      }
      COCdata.sort((a, b) => d3.ascending(a.year, b.year));

      var COC_T = transpose(COCdata);
      var COC_fint = Object.values(COC_T);
      var tbl_arr = [];

      for (var i = 2; i <= 4; i++) {
        if (COC_fint[i] && COC_fint[i][0] && COC_fint[i][1]) {
          var outname = COC_fint[i][0][0]['name'];
          var prevVal = COC_fint[i][0][0]['value'];
          var curVal = COC_fint[i][1][0]['value'];
          var pctchg = prevVal === 0 ? 0 : (curVal - prevVal) / prevVal;
          tbl_arr.push({ coc_name: outname, prevval: fmt_comma(prevVal), curval: fmt_comma(curVal), pct_chg: fmt_pct(pctchg) });
        }
      }

      d3.select('#COCTab').html("");
      $("#COCTab").append("<h2 class='h2_style'>Births, Deaths, and Migration — " + geoName + "</h2>");
      $("#COCTab").append("<a href='https://demography.colorado.gov/county-births-deaths-migration-lookup' target='_blank'>Components of Change Lookup</a><p></p>");

      var tblcolumns2 = ['Component', 'Number, ' + prevyear, 'Number, ' + yrvalue, 'Change'];
      var syatab = d3.select('#COCTab').append('table').style('table-layout', 'fixed');
      var thead = syatab.append('thead');
      var tbody = syatab.append('tbody');

      thead.append('tr').selectAll('th').data(tblcolumns2).enter().append('th')
        .text(d => d).style("border", "1px black solid").style("width", "25%").style("text-align", "center").style("font-weight", "bold");

      var rows = tbody.selectAll('tr').data(tbl_arr).enter().append('tr').style("color", "black");

      rows.append('td').style("text-align", "left").style('font-size', '10pt').html(m => m.coc_name);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.prevval);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.curval);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.pct_chg);
    }).catch(function (err) {
      console.error("COC Fetch Error:", err);
      showSectionMessage('#COCTab', isCurrent, "error");
    });
  }

  function genRaceEth(fips, yrvalue, geoName) {
    var fmt_pct = d3.format(".2%");
    var fips_list = getFipsList(fips);

    function fmtNum(val) {
      var rounded = Math.round(val);
      return typeof formatSDO === "function" ? formatSDO(rounded, "num") : d3.format(",")(rounded);
    }

    var age_list = "0";
    for (var i = 1; i <= 100; i++) { age_list += "," + i; }

    var urlstr_hispest = "https://gis.dola.colorado.gov/lookups/county_sya_race_estimates_current?age=" + age_list + "&county=" + fips_list + "&year=" + yrvalue + "&race=1,2,3,4,5,6&ethnicity=1&group=opt7";
    var urlstr_nonhispest = "https://gis.dola.colorado.gov/lookups/county_sya_race_estimates_current?age=" + age_list + "&county=" + fips_list + "&year=" + yrvalue + "&race=1,2,3,4,5,6&ethnicity=2&group=opt7";

    var isCurrent = beginSection('#RaceTab', geoName);

    Promise.all([d3.json(urlstr_hispest), d3.json(urlstr_nonhispest)]).then(function (data) {
      if (!isCurrent()) return;
      if (!data[0] || !data[1] || !data[0].length || !data[1].length) { showSectionMessage('#RaceTab', isCurrent, "empty"); return; }
      var hisp_est = [];
      var nonhisp_est = [];

      data[0].forEach(obj => hisp_est.push({ year: obj.year, sex: obj.sex, population: Math.round(+obj.count) }));
      data[1].forEach(obj => nonhisp_est.push({ year: obj.year, sex: obj.sex, race: obj.race, population: Math.round(+obj.count) }));

      var hisp_total = d3.rollup(hisp_est, v => d3.sum(v, d => d.population), d => d.year);
      var nonhisp_total = d3.rollup(nonhisp_est, v => d3.sum(v, d => d.population), d => d.year, d => d.race);

      var hisp_flat = [];
      for (let [key, value] of hisp_total) {
        hisp_flat.push({ year: key, race_eth: 'Hispanic', population: Math.round(value) });
      }

      var nonhisp_flat = [];
      for (let [key1, value] of nonhisp_total) {
        for (let [key2, value2] of value) {
          nonhisp_flat.push({ year: key1, race_eth: key2 + ' NH', population: Math.round(value2) });
        }
      }

      var raceeth_est = hisp_flat.concat(nonhisp_flat);
      var tbl_arr = [];
      var race_eth_sum = d3.sum(raceeth_est, d => d.population);
      var raceth = [
        'Hispanic',
        'White alone NH',
        'Black or African American alone NH',
        'Asian alone NH',
        'Native Hawaiian and Other Pacific Islander alone NH',
        'American Indian and Alaska Native alone NH',
        'Two or More NH'
      ];

      for (var i = 0; i < raceth.length; i++) {
        var targetLabel = raceth[i].toLowerCase();
        var filt = raceeth_est.filter(d => d.race_eth && d.race_eth.toLowerCase() === targetLabel);
        if (filt.length > 0) {
          tbl_arr.push({
            race_eth: raceth[i],
            percent: fmt_pct(race_eth_sum ? filt[0].population / race_eth_sum : 0),
            curval: fmtNum(filt[0].population)
          });
        }
      }

      d3.select('#RaceTab').html("");
      $("#RaceTab").append("<h2 class='h2_style'>Race/Ethnicity — " + geoName + "</h2>");
      $("#RaceTab").append("<a href='https://demography.colorado.gov/county-race-and-hispanic-origin-by-age-estimates-lookup' target='_blank'>Race/Ethnicity by Single Year of Age</a><p></p>");

      var tblcolumns2 = ['Race/ Ethnicity', 'Percentage, ' + yrvalue, 'Number, ' + yrvalue];
      var syatab = d3.select('#RaceTab').append('table').style('table-layout', 'fixed');
      var thead = syatab.append('thead');
      var tbody = syatab.append('tbody');

      thead.append('tr').selectAll('th').data(tblcolumns2).enter().append('th')
        .text(d => d).style("border", "1px black solid").style("text-align", "center").style("font-weight", "bold");

      var rows = tbody.selectAll('tr').data(tbl_arr).enter().append('tr').style("color", "black");

      rows.append('td').style("text-align", "left").style('font-size', '10pt').style('width', '60%').html(m => m.race_eth);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').style('width', '20%').html(m => m.percent);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').style('width', '20%').html(m => m.curval);
    }).catch(function (err) {
      console.error("Race/Eth Fetch Error:", err);
      showSectionMessage('#RaceTab', isCurrent, "error");
    });
  }

  function genHousing(fips, yrvalue, geoName) {
    var fmt_pct = d3.format(".2%");
    var fmt_comma = d3.format(",");
    var fmt_dec = d3.format(".2f");
    var fips_list = getFipsList(fips);

    var prevyear = yrvalue - 1;
    var yr_list = prevyear + "," + yrvalue;

    var urlstr = "https://gis.dola.colorado.gov/lookups/profile?county=" + fips_list + "&year=" + yr_list + "&vars=totalhousingunits,householdpopulation,groupquarterspopulation,censusbuildingpermits,hhldpoptothuratio";
    var hous_tmp = [];

    var isCurrent = beginSection('#HousTab', geoName);

    d3.json(urlstr).then(function (data) {
      if (!isCurrent()) return;
      if (!data || !data.length) { showSectionMessage('#HousTab', isCurrent, "empty"); return; }
      data.forEach(function (obj) {
        hous_tmp.push({
          year: obj.year,
          county: obj.county,
          totalhousingunits: parseInt(obj.totalhousingunits, 10),
          householdpopulation: parseInt(obj.householdpopulation, 10),
          groupquarterspopulation: parseInt(obj.groupquarterspopulation, 10),
          censusbuildingpermits: parseInt(obj.censusbuildingpermits, 10),
          hhldpoptothuratio: parseInt(obj.hhldpoptothuratio, 10)
        });
      });

      var columnsToSum = ['totalhousingunits', 'householdpopulation', 'groupquarterspopulation', 'censusbuildingpermits'];
      var housing_temp = d3.rollup(hous_tmp, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year);

      var housing_fin = [];
      for (let [key, obj] of housing_temp) {
        housing_fin.push({
          year: key,
          totalhousingunits: obj.totalhousingunits,
          householdpopulation: obj.householdpopulation,
          groupquarterspopulation: obj.groupquarterspopulation,
          censusbuildingpermits: obj.censusbuildingpermits,
          hhldpoptothuratio: obj.householdpopulation / obj.totalhousingunits
        });
      }
      housing_fin.sort((a, b) => d3.ascending(+a.year, +b.year));

      var housing_T = transpose(housing_fin);
      var housing_fint = Object.values(housing_T);
      var tbl_arr = [];

      for (var i = 1; i < housing_fint.length; i++) {
        if (housing_fint[i][0] && housing_fint[i][1]) {
          var currentVal = housing_fint[i][1][0]['value'];
          var prevVal = housing_fint[i][0][0]['value'];
          var out_name = "";
          var cVal = 0;
          var pctVal = 0;

          if (housing_fint[i][0][0].name == 'totalhousingunits') {
            out_name = "Total Housing Units";
            cVal = fmt_comma(currentVal);
            pctVal = fmt_pct((currentVal - prevVal) / prevVal);
          }
          if (housing_fint[i][0][0].name == 'householdpopulation') {
            out_name = "Household Population";
            cVal = fmt_comma(currentVal);
            pctVal = fmt_pct((currentVal - prevVal) / prevVal);
          }
          if (housing_fint[i][0][0].name == 'groupquarterspopulation') {
            out_name = "Group Quarters Population";
            cVal = fmt_comma(currentVal);
            pctVal = fmt_pct((currentVal - prevVal) / prevVal);
          }
          if (housing_fint[i][0][0].name == 'censusbuildingpermits') {
            out_name = "Annual Building Permits";
            cVal = fmt_comma(currentVal);
            pctVal = prevVal != 0 ? fmt_pct((currentVal - prevVal) / prevVal) : " ";
          }
          if (housing_fint[i][0][0].name == 'hhldpoptothuratio') {
            out_name = "Household Population to Housing Unit Ratio";
            cVal = fmt_dec(currentVal);
            pctVal = " ";
          }

          tbl_arr.push({ row_name: out_name, curval: cVal, pct_chg: pctVal });
        }
      }

      d3.select('#HousTab').html("");
      $("#HousTab").append("<h2 class='h2_style'>Housing Characteristics, " + yrvalue + " — " + geoName + "</h2>");
      $("#HousTab").append("<a href='https://demography.colorado.gov/county-population-and-housing-data-lookup' target='_blank'>County Population and Housing Lookup</a><p></p>");

      var tblcolumns2 = ['Housing Type', 'Number', 'Change from ' + prevyear];
      var syatab = d3.select('#HousTab').append('table').style('table-layout', 'fixed');
      var thead = syatab.append('thead');
      var tbody = syatab.append('tbody');

      thead.append('tr').selectAll('th').data(tblcolumns2).enter().append('th')
        .text(d => d).style("border", "1px black solid").style("width", "33%").style("text-align", "center").style("font-weight", "bold");

      var rows = tbody.selectAll('tr').data(tbl_arr).enter().append('tr').style("color", "black");

      rows.append('td').style("text-align", "left").style('font-size', '10pt').html(m => m.row_name);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.curval);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.pct_chg);
    }).catch(function (err) {
      console.error("Housing Fetch Error:", err);
      showSectionMessage('#HousTab', isCurrent, "error");
    });
  }

  function genTenure(fips, ACSYR, geoName) {
    var fmt_pct = d3.format(".2%");
    var fmt_count = d3.format(",");
    var apiKey = (typeof SDO_CONFIG !== "undefined" && SDO_CONFIG.CENSUS_API_KEY) ? SDO_CONFIG.CENSUS_API_KEY : "08fe07c2a7bf781b7771d7cccb264fe7ff8965ce";

    var tenurestr_cur = (fips === "000")
      ? 'https://api.census.gov/data/' + ACSYR + '/acs/acs5?get=NAME,B25003_001E,B25003_001M,B25003_002E,B25003_002M,B25003_003E,B25003_003M&for=state:08&key=' + apiKey
      : 'https://api.census.gov/data/' + ACSYR + '/acs/acs5?get=NAME,B25003_001E,B25003_001M,B25003_002E,B25003_002M,B25003_003E,B25003_003M&for=county:' + ("000" + parseInt(fips, 10)).slice(-3) + '&in=state:08&key=' + apiKey;

    var isCurrent = beginSection('#TenureTab', geoName);

    d3.json(tenurestr_cur).then(function (data) {
      if (!isCurrent()) return;
      if (!data || data.length < 2) { showSectionMessage('#TenureTab', isCurrent, "empty"); return; }
      var row = data[1];
      var total = +row[1];
      var oo = +row[3];
      var rent = +row[5];

      var tbl_arr = [
        { topic: "Owner Occupied Housing Units", count: fmt_count(oo), percent: fmt_pct(total ? oo / total : 0) },
        { topic: "Rental Housing Units", count: fmt_count(rent), percent: fmt_pct(total ? rent / total : 0) }
      ];

      var curyr4 = ACSYR - 4;
      d3.select('#TenureTab').html("");
      $("#TenureTab").append("<h2 class='h2_style'>Housing Tenure, " + ACSYR + " — " + geoName + "</h2>");
      $("#TenureTab").append("<a href='https://data.census.gov/' target='_blank'>American Community Survey " + curyr4 + "-" + ACSYR + " 5-year data</a><p></p>");

      var tblcolumns2 = ['Housing Units', 'Number', 'Percentage'];
      var tenuretab = d3.select('#TenureTab').append('table').style('table-layout', 'fixed');
      var thead = tenuretab.append('thead');
      var tbody = tenuretab.append('tbody');

      thead.append('tr').selectAll('th').data(tblcolumns2).enter().append('th')
        .text(d => d).style("border", "1px black solid").style("width", "20%").style("text-align", "center").style("font-weight", "bold");

      var rows = tbody.selectAll('tr').data(tbl_arr).enter().append('tr').style("color", "black");

      rows.append('td').style("text-align", "left").style('font-size', '10pt').html(m => m.topic);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.count);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.percent);
    }).catch(function (err) {
      console.error("Tenure Fetch Error:", err);
      showSectionMessage('#TenureTab', isCurrent, "error");
    });
  }

  function genACS(fips, curyr, geoName) {
    var fmt_pct = d3.format(".2%");
    var fmt_dollar = d3.format("$,");
    var prevyr = curyr - 5;
    var apiKey = (typeof SDO_CONFIG !== "undefined" && SDO_CONFIG.CENSUS_API_KEY) ? SDO_CONFIG.CENSUS_API_KEY : "08fe07c2a7bf781b7771d7cccb264fe7ff8965ce";

    var cpiAdj = getCPIAdj(curyr, prevyr);
    var geoScope = (fips === "000") ? "for=state:*" : "for=county:*&in=state:08";

    var pov_cur_url = 'https://api.census.gov/data/' + curyr + '/acs/acs5?get=NAME,B06012_001E,B06012_001M,B06012_002E,B06012_002M&' + geoScope + '&key=' + apiKey;
    var pov_prev_url = 'https://api.census.gov/data/' + prevyr + '/acs/acs5?get=NAME,B06012_001E,B06012_001M,B06012_002E,B06012_002M&' + geoScope + '&key=' + apiKey;

    var educ_cur_url = 'https://api.census.gov/data/' + curyr + '/acs/acs5?get=NAME,B15003_001E,B15003_001M,B15003_022E,B15003_022M,B15003_023E,B15003_023M,B15003_024E,B15003_024M,B15003_025E,B15003_025M&' + geoScope + '&key=' + apiKey;
    var educ_prev_url = 'https://api.census.gov/data/' + prevyr + '/acs/acs5?get=NAME,B15003_001E,B15003_001M,B15003_022E,B15003_022M,B15003_023E,B15003_023M,B15003_024E,B15003_024M,B15003_025E,B15003_025M&' + geoScope + '&key=' + apiKey;

    var inc_cur_url = 'https://api.census.gov/data/' + curyr + '/acs/acs5?get=NAME,B19013_001E,B19013_001M&' + geoScope + '&key=' + apiKey;
    var inc_prev_url = 'https://api.census.gov/data/' + prevyr + '/acs/acs5?get=NAME,B19013_001E,B19013_001M&' + geoScope + '&key=' + apiKey;

    var home_cur_url = 'https://api.census.gov/data/' + curyr + '/acs/acs5?get=NAME,B25097_001E,B25097_001M&' + geoScope + '&key=' + apiKey;
    var home_prev_url = 'https://api.census.gov/data/' + prevyr + '/acs/acs5?get=NAME,B25097_001E,B25097_001M&' + geoScope + '&key=' + apiKey;

    var rent_cur_url = 'https://api.census.gov/data/' + curyr + '/acs/acs5?get=NAME,B25064_001E,B25064_001M&' + geoScope + '&key=' + apiKey;
    var rent_prev_url = 'https://api.census.gov/data/' + prevyr + '/acs/acs5?get=NAME,B25064_001E,B25064_001M&' + geoScope + '&key=' + apiKey;

    var requests = [
      d3.json(pov_cur_url), d3.json(pov_prev_url),
      d3.json(educ_cur_url), d3.json(educ_prev_url),
      d3.json(inc_cur_url), d3.json(inc_prev_url),
      d3.json(home_cur_url), d3.json(home_prev_url),
      d3.json(rent_cur_url), d3.json(rent_prev_url)
    ];

    var isCurrent = beginSection('#ACSTab', geoName);

    Promise.all(requests).then(function (res) {
      if (!isCurrent()) return;
      function parseRes(arr, mapFn) {
        if (!arr || arr.length < 2) return [];
        var headers = arr[0];
        var out = [];
        for (var i = 1; i < arr.length; i++) {
          var row = arr[i];
          var obj = {};
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
          }
          out.push(mapFn(obj));
        }
        return out;
      }

      var pov_cur = parseRes(res[0], d => ({
        state: d.state, county: d.county,
        pct: +d.B06012_001E ? +d.B06012_002E / +d.B06012_001E : 0,
        pct_moe: acsPctMOE(+d.B06012_001E, +d.B06012_001M, (+d.B06012_001E ? +d.B06012_002E / +d.B06012_001E : 0), +d.B06012_002M)
      }));

      var pov_prev = parseRes(res[1], d => ({
        state: d.state, county: d.county,
        pct: +d.B06012_001E ? +d.B06012_002E / +d.B06012_001E : 0,
        pct_moe: acsPctMOE(+d.B06012_001E, +d.B06012_001M, (+d.B06012_001E ? +d.B06012_002E / +d.B06012_001E : 0), +d.B06012_002M)
      }));

      var educ_cur = parseRes(res[2], d => {
        var baSum = (+d.B15003_022E || 0) + (+d.B15003_023E || 0) + (+d.B15003_024E || 0) + (+d.B15003_025E || 0);
        var baMoe = Math.sqrt(Math.pow(+d.B15003_022M || 0, 2) + Math.pow(+d.B15003_023M || 0, 2) + Math.pow(+d.B15003_024M || 0, 2) + Math.pow(+d.B15003_025M || 0, 2));
        var pct = +d.B15003_001E ? baSum / +d.B15003_001E : 0;
        return {
          state: d.state, county: d.county,
          pct: pct,
          pct_moe: acsPctMOE(+d.B15003_001E, +d.B15003_001M, pct, baMoe)
        };
      });

      var educ_prev = parseRes(res[3], d => {
        var baSum = (+d.B15003_022E || 0) + (+d.B15003_023E || 0) + (+d.B15003_024E || 0) + (+d.B15003_025E || 0);
        var baMoe = Math.sqrt(Math.pow(+d.B15003_022M || 0, 2) + Math.pow(+d.B15003_023M || 0, 2) + Math.pow(+d.B15003_024M || 0, 2) + Math.pow(+d.B15003_025M || 0, 2));
        var pct = +d.B15003_001E ? baSum / +d.B15003_001E : 0;
        return {
          state: d.state, county: d.county,
          pct: pct,
          pct_moe: acsPctMOE(+d.B15003_001E, +d.B15003_001M, pct, baMoe)
        };
      });

      var inc_cur = parseRes(res[4], d => ({ state: d.state, county: d.county, val: +d.B19013_001E, moe: +d.B19013_001M }));
      var inc_prev = parseRes(res[5], d => ({ state: d.state, county: d.county, val: +d.B19013_001E, moe: +d.B19013_001M }));

      var home_cur = parseRes(res[6], d => ({ state: d.state, county: d.county, val: +d.B25097_001E, moe: +d.B25097_001M }));
      var home_prev = parseRes(res[7], d => ({ state: d.state, county: d.county, val: +d.B25097_001E, moe: +d.B25097_001M }));

      var rent_cur = parseRes(res[8], d => ({ state: d.state, county: d.county, val: +d.B25064_001E, moe: +d.B25064_001M }));
      var rent_prev = parseRes(res[9], d => ({ state: d.state, county: d.county, val: +d.B25064_001E, moe: +d.B25064_001M }));

      var filterFn = (fips === "000") ? d => d.state == 8 : d => d.county == parseInt(fips, 10);

      var pov_c = pov_cur.find(filterFn) || {};
      var pov_p = pov_prev.find(filterFn) || {};
      var educ_c = educ_cur.find(filterFn) || {};
      var educ_p = educ_prev.find(filterFn) || {};
      var inc_c = inc_cur.find(filterFn) || {};
      var inc_p = inc_prev.find(filterFn) || {};
      var home_c = home_cur.find(filterFn) || {};
      var home_p = home_prev.find(filterFn) || {};
      var rent_c = rent_cur.find(filterFn) || {};
      var rent_p = rent_prev.find(filterFn) || {};

      var povRank = returnRank(pov_cur, fips, 'pct');
      var educRank = returnRank(educ_cur, fips, 'pct');
      var incRank = returnRank(inc_cur, fips, 'val');
      var homeRank = returnRank(home_cur, fips, 'val');
      var rentRank = returnRank(rent_cur, fips, 'val');

      function getDiffIcon(diff, isPoverty) {
        if (diff === "increase") return isPoverty ? "<i class='fas fa-arrow-up' style='color: red;'></i>" : "<i class='fas fa-arrow-up' style='color: green;'></i>";
        if (diff === "decrease") return isPoverty ? "<i class='fas fa-arrow-down' style='color: green;'></i>" : "<i class='fas fa-arrow-down' style='color: red;'></i>";
        return "<i class='fas fa-equals' style='color: grey;'></i>";
      }

      var povDiff = acsChkDiff(pov_c.pct || 0, pov_c.pct_moe || 0, pov_p.pct || 0, pov_p.pct_moe || 0);
      var educDiff = acsChkDiff(educ_c.pct || 0, educ_c.pct_moe || 0, educ_p.pct || 0, educ_p.pct_moe || 0);
      var incDiff = acsChkDiff(inc_c.val || 0, inc_c.moe || 0, (inc_p.val || 0) * cpiAdj, (inc_p.moe || 0) * cpiAdj);
      var homeDiff = acsChkDiff(home_c.val || 0, home_c.moe || 0, (home_p.val || 0) * cpiAdj, (home_p.moe || 0) * cpiAdj);
      var rentDiff = acsChkDiff(rent_c.val || 0, rent_c.moe || 0, (rent_p.val || 0) * cpiAdj, (rent_p.moe || 0) * cpiAdj);

      var censstub = "https://data.census.gov/table?q=";
      var censgeo = (fips === "000") ? "&g=0400000US08&tid=ACSDT5Y" + curyr + "." : "&g=050XX00US08" + ("000" + parseInt(fips, 10)).slice(-3) + "&tid=ACSDT5Y" + curyr + ".";

      var tbl_arr = [
        {
          topic: "<a href='" + censstub + "B06012" + censgeo + "B06012' target='_blank'>% living in Poverty</a>",
          value: fmt_pct(pov_c.pct || 0),
          diff: getDiffIcon(povDiff, true),
          rank: povRank
        },
        {
          topic: "<a href='" + censstub + "B15003" + censgeo + "B15003' target='_blank'>% with Bachelor's Degree+</a>",
          value: fmt_pct(educ_c.pct || 0),
          diff: getDiffIcon(educDiff, false),
          rank: educRank
        },
        {
          topic: "<a href='" + censstub + "B19013" + censgeo + "B19013' target='_blank'>Median Household Income</a>",
          value: fmt_dollar(inc_c.val || 0),
          diff: getDiffIcon(incDiff, false),
          rank: incRank
        },
        {
          topic: "<a href='" + censstub + "B25097" + censgeo + "B25097' target='_blank'>Median Home Value</a>",
          value: fmt_dollar(home_c.val || 0),
          diff: getDiffIcon(homeDiff, false),
          rank: homeRank
        },
        {
          topic: "<a href='" + censstub + "B25064" + censgeo + "B25064' target='_blank'>Median Gross Rent</a>",
          value: fmt_dollar(rent_c.val || 0),
          diff: getDiffIcon(rentDiff, false),
          rank: rentRank
        }
      ];

      var curyr4 = curyr - 4;
      var prevyr4 = prevyr - 4;

      d3.select('#ACSTab').html("");
      $("#ACSTab").append("<h2 class='h2_style'>Selected Statistics, " + curyr + " — " + geoName + "</h2>");
      $("#ACSTab").append("<a href='https://data.census.gov/' target='_blank'>American Community Survey " + curyr4 + "-" + curyr + " 5-year data</a><p></p>");

      var rankHeader = (fips === "000") ? "U. S. Rank" : "County Rank";
      var tblcolumns2 = ['Topic', 'Number', 'Change from ' + prevyr4 + "-" + prevyr + " ACS", rankHeader];

      var syatab = d3.select('#ACSTab').append('table').style('table-layout', 'fixed');
      var thead = syatab.append('thead');
      var tbody = syatab.append('tbody');

      thead.append('tr').selectAll('th').data(tblcolumns2).enter().append('th')
        .text(d => d).style("border", "1px black solid").style("text-align", "center").style("font-weight", "bold");

      var rows = tbody.selectAll('tr').data(tbl_arr).enter().append('tr').style("color", "black");

      rows.append('td').style("text-align", "left").style('font-size', '10pt').html(m => m.topic);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.value);
      rows.append('td').style("text-align", "center").style('font-size', '10pt').html(m => m.diff);
      rows.append('td').style("text-align", "right").style('font-size', '10pt').html(m => m.rank);
    }).catch(function (err) {
      console.error("ACS Selected Statistics Error:", err);
      showSectionMessage('#ACSTab', isCurrent, "error");
    });
  }

})(jQuery, Drupal);