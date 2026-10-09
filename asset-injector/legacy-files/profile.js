//Website functions for State Demography Office Demographic Profile
//A. Bickford 9/2021

//list of lookup statements  https://github.com/ColoradoDemography/MS_Demog_Lookups/tree/master/doc
// profilesql syntax https://gis.dola.colorado.gov/lookups/profilesql?table=estimates.firm_count&year=2011&geo=1
//String FIPS codes need to be quoted e.g. '001'

//Profile functions
//Progress Bar https://www.w3schools.com/howto/howto_js_progressbar.asp

//clr_scrn

//cat Utility Functions

function select_title(inArr,sel){
//select_title selection of elements in header array

 var out_arr = [];
 sel.forEach(arr => {
  var tmp = inArr[arr].title;
  out_arr.push(tmp);
 })
 return(out_arr);
} 
// select_title


function select_elements(inArr,sel){
//select_elements selection of elements in array
 var out_arr = [];
 sel.forEach(arr => {
  var tmp = inArr[arr];
  out_arr.push(tmp.toString());
 })
 return(out_arr);
} 
// select_elements


function selValsSing(inData, selArr){
// selValsSing Picks out data values from a list -- Single record for Plotly
 
var inMap = { ...inData }

 var outData = [];

 Object.keys(inMap[0]).forEach((key) => {
  if(selArr.includes(key)) {
   outData.push(inData[0][key]);
  }
    })
return(outData);
} 
// SelValsSing


function selValsMulti(inData, selArr, nRows,nPanel,dir) {
// selValsMulti Picks out data values from a list -- Multiple records for Plotly

var dkeys = Object.keys(inData[0]);
for(i = 0 ; i < inData.length; i++){
	for(j = 0; j < dkeys.length; j++){
		var chkval = inData[i][dkeys[j]];
		inData[i][dkeys[j]] = Number.isNaN(chkval) ? " " : chkval;
	}
}

var inMap = { ...inData }

var outData = [];
//Create 2d aray for outData
 // creating two dimensional array
    for (i = 0; i< inData.length; i++) {
        for(j = 0; j< selArr[0].length; j++) {
            outData[i] = [];
        }
    }

for(i = 0; i < inData.length; i++){
  var tmp2 = Object.keys(inMap[i]).
  filter((key) => selArr[0].includes(key)).
  reduce((cur, key) => { return Object.assign(cur, { [key]: inMap[i][key] })}, {});

  for(j = 0; j < selArr[0].length;j++){
   if(selArr[1][j] == "comma"){
   outData[i][j] = fixNUMFMT(Math.round(tmp2[selArr[0][j]]),"num");
  }
   if(selArr[1][j] == "percent"){
   outData[i][j] = fixNUMFMT(tmp2[selArr[0][j]],"pct");
  }
   if(selArr[1][j] == "dollar"){
   outData[i][j] = Math.round(tmp2[selArr[0][j]]) == 0 ? "" : fixNUMFMT(tmp2[selArr[0][j]],"cur");
  }
   if(selArr[1][j] == ""){
     outData[i][j] = tmp2[selArr[0][j]];
  }
  }
}

//restructuring outData 
if(dir == "horiz"){
var outData2 = []
for(i = 0; i < nRows; i++){
 
 var startCol = (i * 4) + 1;
 var endCol = startCol + nPanel;
 var row_data = [];
for(j = 0;j < outData.length;j++){
   row_data = row_data.concat(outData[j].slice(startCol,endCol))
 }
 outData2.push(row_data);
}
 return(outData2)
} else {
 return(outData);
}

} 
// SelVarsMulti


function join(lookupTable, mainTable, lookupKey, mainKey, select) {
//Join function from http://learnjsdata.com/combine_data.html
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    for (var i = 0; i < l; i++) { // loop through l ds
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m ds
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    return output;
};
// join


function mergeArrayObjects(arr1,arr2){
//MergeArrays from https://reactgo.com/javascript-merge-array-objects-key/

  return arr1.map((item,i)=>{
     if(item.label === arr2[i].label){
         //merging two objects
       return Object.assign({},item,arr2[i])
     }
  })
}
// MergeArrays


function range(start, end, step) {
//range geneates string array of values between start and stop

  let output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(Number(i.toFixed(2)));
  }
  return output;
}; 
// range

function extend (target) {
// extend builds a wide array, ised in long_to_wide function
    for(var i=1; i<arguments.length; ++i) {
        var from = arguments[i];
        if(typeof from !== 'object') continue;
        for(var j in from) {
            if(from.hasOwnProperty(j)) {
                target[j] = typeof from[j]==='object'
                ? extend({}, target[j], from[j])
                : from[j];
            }
        }
    }
    return target;
}
// extend

function long_to_wide(inData, idVal, idName, keyVar, valVar, fmt){
//long_to_wide creates a wide output from long Data

var outDat = [{"fips" : idVal, "name" : idName}];

for(i = 0; i < keyVar.length; i++){
	var nameVal = keyVar[i].toString()
	if(fmt == "pct") {
	  var outVal = fixNUMFMT(inData[i][valVar],"pct")
	} else {
	  var outVal = fixNUMFMT(inData[i][valVar],"num")
   }
	var tmp = [{[nameVal] : outVal}];

	var merged = extend({}, outDat, tmp)
	var outDat = merged
}

var tmpDat = Object.assign({}, ...function _flatten(o) { return [].concat(...Object.keys(o).map(k => typeof o[k] === 'object' ? _flatten(o[k]) : ({[k]: o[k]})))}(outDat));

return tmpDat;
}
// long_to_wide

function fixNUMFMT(invalue,fmt){
//fixNUMFMT fixes formatting issue for negative numbers in word tables  based on fmt type (pct, num, cur) returns formatted value 

 const fmt_pct = d3.format(".1%")
 const fmt_comma = d3.format(",");
 const fmt_dollar = d3.format("$,.0f");
 const fmt_decimal = d3.format(".2f")

var tmp_val = invalue;

 if(tmp_val < 0) {
   tmp_val = tmp_val * -1;
   if(fmt == 'pct') { fin_val = tmp_val === 999999999 ? " " : "-" + fmt_pct(tmp_val);};
   if(fmt == 'num') { fin_val = tmp_val === 999999999 ? " " :"-" + fmt_comma(tmp_val);};
   if(fmt == 'cur') { fin_val = tmp_val === 999999999 ? " " : "-" + fmt_dollar(tmp_val);};
   if(fmt == 'dec') { fin_val = tmp_val === 999999999 ? " " :"-" + fmt_decimal(tmp_val);};
 } else {
   if(fmt == 'pct') { fin_val = tmp_val === 999999999 ? "-" : fmt_pct(tmp_val);};
   if(fmt == 'num') { fin_val = tmp_val === 999999999 ? "-" : fmt_comma(tmp_val);};
   if(fmt == 'cur') { fin_val = tmp_val === 999999999 ? "-" : fmt_dollar(tmp_val);};
   if(fmt == 'dec') { fin_val = tmp_val === 999999999 ? "-" : fmt_decimal(tmp_val);};
    }

   return(fin_val);
}; 
// fixNUMFMT


function restructureACS(inData,vars) {
//restructureACS data from wide to long 

  var inMap = { ...inData}
 var keyList = Object.keys(inMap[0])
 var estList = [];
 var moeList = [];
 var estpctList = [];
 var moepctList = [];
 
 for(i = 0; i < keyList.length; i ++){
  if(keyList[i].includes("_M_PCT")){
   moepctList.push(keyList[i]);
  } 
  if(keyList[i].includes("_E_PCT")){
   estpctList.push(keyList[i]);
  } 
   if(keyList[i].includes("_M") && !keyList[i].includes("_PCT")){
   moeList.push(keyList[i]);
   }
   if(keyList[i].includes("_E") && !keyList[i].includes("_PCT")){
   estList.push(keyList[i]);
    }
 }
 

 var outData = [];
 for(i = 0; i < vars.length; i++){
  vars[i] = vars[i].replaceAll("<br>"," ");
 }
 vars.unshift("Total");
    estpctList.unshift("");
 moepctList.unshift("");
 
    for(i = 0; i < inData.length; i++){
  var fips = inMap[i].FIPS;
  var name = inMap[i].NAME;
  var est = "";
  var moe = "";
  var est_pct = "";
  var moe_pct = "";
  for(j= 0; j < vars.length; j++){
      var est = fixNUMFMT(inMap[i][estList[j]],"num");;
      var moe = fixNUMFMT(inMap[i][moeList[j]],"num");
      var est_pct = fixNUMFMT(inMap[i][estpctList[j]],"pct");
      var moe_pct = fixNUMFMT(inMap[i][moepctList[j]],"pct");
      if(est_pct == 'NaN%') {est_pct = "100.00%"}
      if(moe_pct == 'NaN%'){moe_pct = "*****"}
      
      outData.push({"FIPS" : fips, "NAME" : name, "CATEGORY" : vars[j], "ESTIMATE" : est, "MOE" : moe, "ESTIMATE PCT" : est_pct, "ESTIMATE MOE" : moe_pct})
  } //j
 } //i

return(outData);
} 
// restructireACS


function selGeo(fipsArr,ctyData,type){
//selGeo selects Municipalities and CDPs formatting in sel1 of profile

  const regList = ['Region', 'Regional Comparison'];
  const ctyList = ['County', 'County Comparison'] 

  if(ctyList.includes(type) || regList.includes(type)) {
  var chkval =  ctyData.properties.COUNTYFP;
  } else {
     var ckkval = ctyData.placefp; 
  };
 if (regList.includes(type)) {
  var regFips = regionCOL(fipsArr);
  return (regFips[0].fips.includes(chkval));
   } else {
      return (fipsArr.includes(chkval));
   }
}
// selGeo


function selColor(fipsArr,names,ctyData,type){
//selColor  Sets fill color for counties and regions
 var outColor = '#FFFFFF';
 var chkval =  ctyData.properties.COUNTYFP;
var regList = ['Region', 'Regional Comparison'];

if(regList.includes(type)){
 for(i = 0; i < fipsArr.length; i ++){
   var regionSel = regionCOL(fipsArr[i]);
    var regFips = regionSel[0].fips;
    var regColor = regionSel[0].color;
    if(regFips.includes(chkval)) {outColor = regColor;};
   }
} else {
 if(fipsArr.includes(chkval)){
  outColor = '#008000';
 };
};
return outColor;
};
// selColor



function calcpopGR(inData,fipsArr,type, yrVal) {
//calcpopGR calculates population table entries for profile  dat

   var outtab = []; //This array contains all entries for all years
   var geog, name, year1, est1, year2, est2, popch, gr;
   
    var regList = ['Region', 'Regional Comparison']; 
   var ctyList = ['County', 'County Comparison'];
    var muniList = ['Municipality', 'Municipal Comparison'];

    if(type == 'state'){
	   for(i = 0; i < inData.length; i++){
        outtab.push({'fips' : 8, 'name' : 'Colorado', 'year' : inData[i].year,  'estimate' : parseInt(inData[i].estimate)});
       };
   };
   
   if(regList.includes(type)){
   
   for(i = 0; i < fipsArr.length; i++) {
      var tmp_l = regionCOL(parseInt(fipsArr[i]));
   var tmp_list = [];
   for(j = 0; j < tmp_l[0].fips.length; j++) {
    tmp_list.push(parseInt(tmp_l[0].fips[j]));
   }
      var cty_filt = inData.filter(function(d) {return (tmp_list.includes(d.countyfips));});
      var cty_data  = [];
   for(k = 0; k < cty_filt.length; k++){
    cty_data.push({'fips' : cty_filt[k].countyfips, 'name' : countyName(cty_filt[k].countyfips), 'year' : cty_filt[k].year, 'estimate' : parseInt(cty_filt[k].estimate)});
   }
   //Rollup
         var reg_sum = d3.rollup(cty_data, v => d3.sum(v, d => d.estimate), d => d.year);   
   
   //Flatten
   var region_data = [];
  for (let [key, value] of reg_sum) {
    region_data.push({ fips: -100 - parseInt(fipsArr[i]), 'name' : regionName(parseInt(fipsArr[i])), 'year' : key, 'estimate' : value});
   };

   var reg_cty = region_data.concat(cty_data);
   outtab = outtab.concat(reg_cty);
   }
   };
  
    if(ctyList.includes(type)){
      for(i = 0; i < inData.length; i++){
     outtab.push({'fips' : inData[i].countyfips, 'name' : countyName(inData[i].countyfips), 'year' : inData[i].year, 'estimate' : parseInt(inData[i].estimate)});
   };
   };
   if(muniList.includes(type)){
   if(inData.length > 2){
    //extracting Multi County Places
    var tmpData = inData.filter(function(d) {return d.municipalityname.includes('(Total)');});
    if(tmpData.length != 0){
        var remData = inData.filter(function(d) {return d.placefips != tmpData[0].placefips;});
     tmpData = tmpData.concat(remData);
    } else {
     var tmpData = inData;
    };
   } else {    
      var tmpData = inData; 
   };
      for(i = 0; i < tmpData.length; i++){
     outtab.push({'fips' : tmpData[i].placefips, 'name' : muniName(tmpData[i].placefips), 'year' : tmpData[i].year,  'estimate' : parseInt(tmpData[i].totalpopulation)});
   };

   };   
 
 //Selecting out geographies  

//Creating output table  This works for two years need to define a solution for multiple years....

var output = [];
var uniqyr = [...new Set(outtab.map(d => d.year))];
var yr1 = uniqyr[0];
var yr2 = uniqyr[1];
var uniqids = [...new Set(outtab.map(d => d.fips))];
for(i = 0; i < uniqids.length; i++) {
 var id = outtab.filter(d => d.fips == uniqids[i]);
 var est1 = id[0].estimate;
 var est2 = id[1].estimate;
 var numdiff = est2 - est1;
 var pctdiff = numdiff/est1;
    output.push({'fips' : id[0].fips, 'name' : id[0].name, 'yr1' : est1, 'yr2' : est2, 'popch' : numdiff, 'growth' : pctdiff});
}


 return output;
}; 
//  calcpopGR

function procMedian(inData,fipsArr,est, moe, names){
//procMedian  Gathers and calculates regional median income or house value from ACS records in genSel1Tab returns regiion and county table


var fipsnum;
var medvalue = [];

//prepping data
for(i = 0; i < inData.length; i++) {
 
 if(est == 'B19013_001E'){  //Median income
     medvalue.push({'fips' : inData[i].GEO2, 'name' : inData[i].NAME, 'est' : inData[i].B19013_001E, 'moe' : inData[i].B19013_001M});
 };
 if(est == 'B25077_001E'){  //Median home value
     medvalue.push({'fips' : inData[i].GEO2, 'name' : inData[i].NAME, 'est' : inData[i].B25077_001E, 'moe' : inData[i].B25077_001M});
 };
 };  //i loop

//Calculating regional median and adding to output data set...

 var med_out = [];
 var regionDat = [];
   var estArr = [];
  var moeArr = [];
  for(l = 0; l < medvalue.length; l++){
     estArr.push(medvalue[l].est);
	 moeArr.push(medvalue[l].moe);
   };    
  var estrange = d3.extent(estArr);
  var medestVal = (estrange[1] + estrange[0])/2;
  var moerange = d3.extent(moeArr);
  var medmoeVal = (moerange[1] + moerange[0])/2;
  var regionNumber = -101;
  var regionNam = regionName(fipsArr[0]);
  regionDat.push({'fips' : regionNumber, 'name' : regionNam, 'est' : medestVal, 'moe' : medmoeVal});
    
  var med_out = regionDat.concat(medvalue);
 
  return med_out;
}; 
// procMedian


function procPCT(inData,fipsArr, stub,geog,names){
//procPCT Generates percentages from ACS data

var rawvalue = [];
 const regList = ['Region', 'Regional Comparison'];
 

for(i = 0; i < inData.length; i++) {
 if(stub == 'B17001'){  //Poverty
     rawvalue.push({'fips' : geog == 'state' ? inData[i].GEO1 : inData[i].GEO2, 
	                'name' : inData[i].NAME, 
					'num_est' : inData[i].B17001_002E,
					'num_moe' : Math.pow(inData[i].B17001_002M,2),
					'dem_est' :inData[i].B17001_001E,
					'dem_moe' : Math.pow(inData[i].B17001_001M,2)
	              })
 };
 if(stub == 'B05002'){  //Native Colorado
 
    rawvalue.push({'fips' : geog == 'state' ? inData[i].GEO1 : inData[i].GEO2, 
	                'name' : inData[i].NAME, 
					'num_est' : inData[i].B05002_003E,
					'num_moe' : Math.pow(inData[i].B05002_003M,2),
					'dem_est' :inData[i].B05002_001E,
					'dem_moe' : Math.pow(inData[i].B05002_001M,2)
	              })
 };
}; //i

 
if(regList.includes(geog)){
 var reg_sum = [] 
 var columnsToSum = ['num_est', 'num_moe', 'dem_est','dem_moe']
 var reg_tmp =  d3.rollup(rawvalue, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => d[col])])))
 reg_sum.push({'fips' : -101, 'name' : names[0], 'num_est' : reg_tmp.num_est, 'num_moe' : reg_tmp.num_moe, 'dem_est' : reg_tmp.dem_est, 'dem_moe' : reg_tmp.dem_moe})

  rawvalue = reg_sum.concat(rawvalue)
};

var pct_out = [];
for(i = 0; i < rawvalue.length; i++){
	pct_out.push({
	    'fips' : rawvalue[i].fips, 
		'name' : rawvalue[i].name,
		'num_est' : rawvalue[i].num_est,
		'num_moe' : Math.sqrt(rawvalue[i].num_moe),
		'dem_est' : rawvalue[i].dem_est,
		'dem_moe' :Math.sqrt(rawvalue[i].dem_moe),
		'pct_est' :  rawvalue[i].num_est/rawvalue[i].dem_est,
		'pct_moe' : acsPctMOE(rawvalue[i].dem_est,Math.sqrt(rawvalue[i].dem_moe),(rawvalue[i].num_est/rawvalue[i].dem_est),Math.sqrt(rawvalue[i].num_moe))
	})
} //i

return(pct_out);
    }; 
// procPCT


function regCombine(regData,ctyData) {
//regCombine Combines regional comparisons data

 var outData = [];
 for(i = 0; i < regData.length; i++){
  var seldata = regData[i];
  if(regData[i].name == 'Colorado') {   
   outData.push(seldata);
  } else {
   outData.push(seldata);
   var selRegion = regionCOL(seldata.name);
   var regFips = selRegion[0].fips;
   for(j = 0; j < regFips.length;j++){
     regFips[j] = parseInt(regFips[j]);
   };
   var tmpData = ctyData.filter(function(d) {return regFips.includes(d.geography);});
   for(k = 0; k < tmpData.length; k++){
    outData.push(tmpData[k]);
   };
  }; 
 };
return outData;
};
// regCombine

function bin_age5(inData){
//bin_age5 created 5-year age bins and summarizes data by fips code, year and age_cat

//Preliminaries

 var age_min = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95];
 var age_max = [4,9,14,19,24,29,34,39,44,49,54,59,64,69,74,79,84,89,94,100];
 var age_labs = [];
 for(i = 0; i < age_min.length;i++) {
  age_labs.push(age_min[i] + ' to ' + age_max[i]);
 }

var fipsList = [...new Set(inData.map(d => d.fips))];
var yearList = [...new Set(inData.map(d => d.year))];

var binraw = []
for(i = 0; i < fipsList.length; i++){
 for(j = 0; j < yearList.length; j++){
  var tmpdat = inData.filter(d => (d.fips == fipsList[i]&& d.year == yearList[j]));
        var binVal = 0;
  for(k = 0; k < tmpdat.length;k++){
   if(tmpdat[k].age != 0) {
    if(tmpdat[k].age % 5 == 0) {binVal = binVal + 1};
   };
   if(binVal == 20){
    binVal = 19;
   } 
   tmpdat[k].bin = binVal;
  }; //k
  binraw = binraw.concat(tmpdat);
 } //j
} //i

binraw.forEach( d => {d.age_cat = age_labs[d.bin]})


//binraw has the binning variable  binsum is the rolled up file; bindata containes the flattened data records
var columnsToSum = ['malepopulation_e', 'femalepopulation_e', 'totalpopulation_e'];

//Rolling up data for table
var binroll =  d3.rollup(binraw, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year, d => d.fips, d => d.name, d => d.bin, d => d.age_cat)

var bindata = [];
for (let [key1, value] of binroll) {
for (let[key2, value2] of value) {
for (let [key3, value3] of value2) {
for (let [key4, value4] of value3) {
for (let [key5, value5] of value4){
   bindata.push({'fips' : key2, 'name' : key3, 'year' : key1, 'age_cat_no' : key4, 'age_cat' : key5,
     'malepopulation_e' : value5.malepopulation_e, 'femalepopulation_e' : value5.femalepopulation_e, 'totalpopulation_e' : value5.totalpopulation_e});
}
};
};
};
};


//Calculating age base

//Need to calculate percentages...
var pct_base = d3.rollup(bindata, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.fips, d => d.year)
var age_base = [];
for (let [key1, value] of pct_base) {
for (let[key2, value2] of value) {
   age_base.push({'fips' : key1, 'year' : key2, 
     'tot_malepopulation_e' : value2.malepopulation_e, 'tot_femalepopulation_e' : value2.femalepopulation_e, 'tot_totalpopulation_e' : value2.totalpopulation_e});
}
};
  
//Base totals for percentages

var bindatafin = [];
for(i = 0 ; i < fipsList.length; i++){
 for(j = 0; j < yearList.length;j++){
 tmp_base = age_base.filter( d => (d.fips == fipsList[i] && d.year == yearList[j])); 
    tmp_age = bindata.filter( d => (d.fips == fipsList[i] && d.year == yearList[j]));

    for(k = 0; k < tmp_age.length;k++){
        bindatafin.push({'fips' : tmp_age[k].fips, 'name' : tmp_age[k].name, 'year' : tmp_age[k].year, 'age_cat' : tmp_age[k].age_cat,
             'malepopulation_e' : tmp_age[k].malepopulation_e, 'pct_malepopulation_e' :  tmp_age[k].malepopulation_e/tmp_base[0].tot_malepopulation_e, 
             'femalepopulation_e' : tmp_age[k].femalepopulation_e, 'pct_femalepopulation_e' :  tmp_age[k].femalepopulation_e/tmp_base[0].tot_femalepopulation_e,
             'totalpopulation_e' : tmp_age[k].totalpopulation_e, 'pct_totalpopulation_e' :  tmp_age[k].totalpopulation_e/tmp_base[0].tot_totalpopulation_e
  })
 }
 }
}

return (bindatafin);
}; 
// bin_age5

//cat Basic UI functions

function genUI(level, sidepanel){
//genUI creates the profile header list and panel display buttons in screen Banner 

	const tblArr = ["Basic Statistics", "Population Trends", "Population Characteristics: Age", "Population Characteristics: Income, Education and Race",
			"Housing and Households", "Commuting and Job Growth", "Employment by Industry", "Employment Forecast and Wage Information"]

 	var nrows = (level == "Region") ? 5 : 8;
		
	var tbl = document.createElement("table");
      tbl.style.width = "90%";
      tbl.style.border = "0px solid black";
   
  var tblbody = document.createElement("tbody");
  for(i = 0; i < nrows; i++){
      var tblrow = document.createElement("tr");
	  var tblcell1 = document.createElement("td")
	  //Check box
	  var selval = "sel" + (i + 1);
	  var ckbx = document.createElement("input");
          ckbx.setAttribute("type", "checkbox");
		  ckbx.className = 'proInput';
		  ckbx.id = selval;
		  ckbx.name = selval;
		  ckbx.value = selval;
		  ckbx.setAttribute("checked", "true")
		  tblcell1.appendChild(ckbx)
		  
	  var tblcell2 = document.createElement("td");
	  var cklbl = document.createElement('label');
		  cklbl.className = 'prolabel'
		  cklbl.setAttribute('for',selval);
		  cklbl.innerHTML = tblArr[i]
	  tblcell2.appendChild(cklbl)
	  
	  tblrow.appendChild(tblcell1)
	  tblrow.appendChild(tblcell2)
	  tblbody.appendChild(tblrow)
  }
  tbl.appendChild(tblbody)

  
  //Assemble final table
  var outDiv = document.getElementById(sidepanel);
  outDiv.appendChild(tbl)
 
}
// genUI

//cat UI Functions 


function profileContent(invalue) {
//profileContent provides descriptive names for checked profile boxes...
 var outname;
 switch(invalue) {
 case "sel1" :
   outname = "Basic Statistics";
   break;
 case "sel2":
    outname = "Population Trends";
    break;
 case "sel3" :
    outname = "Population Characteristics: Age";
    break;
 case "sel4" :
    outname = "Population Characteristics: Income, Education and Race";
    break;
 case "sel5" :
    outname = "Housing and Households";
    break;
 case "sel6" : 
  outname = "Commuting and Job Growth";
  break;
 case "sel7" :
  outname = "Employment by Industry";
  break;
 case "sel8" :
  outname = "Employment Forecast and Wage Information";
  break;
 }
 return(outname);
}; 
// profileContent


function insertBkmark(inArr){
// insertBkmark  Insert bookmarks on main page

//Check if sectLink exists
   if(!!document.getElementById("sectLink")) {
	  bkDiv = document.getElementById('sectLink');
	  bkDiv.innerHTML = "";
   } else {
	  var proList = document.getElementById('pro-list');
      var bkDiv = document.createElement("div");
      bkDiv.setAttribute('id', 'sectLink');
	  proList.after(bkDiv)
}
   
inArr.forEach(bklink =>{
	var a = document.createElement('a');
      var linkText = document.createTextNode(" | " + bklink.title);
      a.appendChild(linkText);
      a.title = bklink.title;
      a.href = "#" + bklink.id;
      bkDiv.appendChild(a);
})
} 
// insertBkmark


function dlContent(outtype, idxval, mark){
//dlContent  Generates the contents of the file dropdown list

	var dlDiv = document.createElement("div");
	var dlUl= document.createElement('ul');
	dlDiv.setAttribute("class","dropdown-content")
	dlUl.setAttribute("class", "dd-list")
if(outtype == "chart") {
	for(i = 0; i <= 2;i++){
		var dlLi = document.createElement('li'); 
		if(i == 0){
		  var linktxt = document.createTextNode("Download Data (CSV)");
		  var linkid = "profileDat" + idxval;
		  var linkref = "#";
		 }
		if(i == 1){
		  var linktxt = document.createTextNode("Download Image (PNG)");
		  var linkid = "profileImg" + idxval;
		  var linkref = "#";
		}
		if(i == 2){
		  var linktxt = document.createTextNode(mark.srctxt);
		  var linkid = "profileSRC" + idxval;
		  var linkref = mark.srclink;
		}
		
		var dlLink = document.createElement('a');
		dlLink.href = linkref
		if(linkref != "#"){
		dlLink.target = '_blank';
		}
		dlLink.id = linkid;
		dlLink.appendChild(linktxt);
		
		dlLi.appendChild(dlLink); 
		dlUl.appendChild(dlLi); 
	}
} // chart
if(outtype == "table"){
	var dlLi = document.createElement('li'); 
	var linktxt = document.createTextNode(mark.srctxt);
	var linkid = "profileSRC" + idxval;
	var linkref = mark.srclink;
	var dlLink = document.createElement('a');
	dlLink.href = linkref
	if(linkref != "#"){
		dlLink.target = '_blank';
	}
	dlLink.id = linkid;
	dlLink.appendChild(linktxt);
}
    dlLi.appendChild(dlLink); 
    dlUl.appendChild(dlLi); 
    dlDiv.appendChild(dlUl);
	
return(dlDiv);
}
// dlContent

function pgSetupPro(level, type, gridPanel, bkMark, multi, pctTable, ctyFips,ctyName, yrvalue) {
//pgSetupPro  adds download buttons and dropdowns to Plot and Table  divs
//create header 
//type == "map" Page Header, table with download button for image
//type == "table" Page Header, table stats table with download button for sources,  dropdown for statistics and increment buttons
//type="chart" Page Header, table with download button, geography selection button for regions, statistics selection dropdown, plot generation button for regions

  var idxval = gridPanel.charAt(gridPanel.length - 1);
  
  const row1List = ["age01", "popest", "inc01", "educ", "raceeth", "house01"];
  
//Creating strFips

if(level == "County"){
 var sFips = ctyFips.map(i => i.toString().padStart(3,'0'));
 var strFips = sFips.map(i => "08" + i) 
if(strFips[0] === "08008" || strFips[0] === "08000"){
   strFips[0] = "08";
}
}

if(level == 'Municipality') {
  var sFips = ctyFips.map(i => i.toString().padStart(5,'0'));
 var strFips = sFips.map(i => "08" + i) 
if(strFips[0] === "0800008" || strFips[0] === "08000"){
   strFips[0] = "08";
}

}  

var src_txt = document.createTextNode('');

//Defining table and table row
var tbl = document.createElement("table");
      tbl.style.width = "90%";
      tbl.style.border = "0px solid black";
var tblrow = document.createElement("tr");

//Building Generic Download button
   var dlbtn = document.createElement('button');
    dlbtn.id = 'profileDL' + idxval;
    dlbtn.className = 'dropbtn';
    dlbtn.innerHTML = '<i class="fas fas fa-download fa-2x" style="color: black;">';
	


//Building Table elements
if(level == "Region"){
//Geography Selection Dropdown
	 var geotxt = document.createElement('p');
     geotxt.id = 'geotext' + idxval;
     geotxt.className = 'entry_text';
	 geotxt.innerHTML = '<b>Select one or more geographies</b><br>';

if(!Array.isArray(ctyFips)){ 
	var ctyList = regionCOL(parseInt(ctyFips));
	var listType = [{'id' : "08", 'name' :'Colorado'},
					{'id' : "-101" , 'name' : ctyName[0]}];
	var sellist = ctyList[0].fips;
	for(i = 0; i < sellist.length; i++){
		listType.push({'id' : sellist[i], 'name' : countyName(parseInt(sellist[i]))});
	}
} else {
	var listType = [];
	for(i = 0; i < ctyFips.length; i++){
		listType.push({'id' : ctyFips[i], 'name' : ctyName[i]});
	}
}

	 var geolist = document.createElement('select');
	   geolist.id = 'geoSelect'+ idxval;
	   geolist.multiple = true;
       geolist.setAttribute('geo','name');
	   for(j = 0; j < listType.length; j++){
		  var opt = document.createElement('option');
		  opt.innerHTML = listType[j].name;
		  opt.value = listType[j].id;
		  geolist.appendChild(opt);
	   }
	   
//Statistic Select dropdown
if(pctTable){
	//Type selection
	var stattxt = document.createElement('p');
         stattxt.id = 'stattext' + idxval;
         stattxt.className = 'entry_text';
		 stattxt.innerHTML = '<b>Select Statistic</b><br>';
		 switch(bkMark.title) {  //this is the table type selectotor
		 case "Population Growth Table" :   
			var seriesType = ['Growth Rate', 'Numeric Growth'];
			break;
		case "Household Forecast" :
			var seriesType = ['Number of Households', 'Household Change','Household Change Rate'];
			break;
        case "Housing Type Table" :
			var seriesType = ['Number of Housing Units', 'People in Housing Units'];
		    break;
		default :
	 		var seriesType = ['Percentage', 'Number'];  
		}
	   var statlist = document.createElement('select');
	   statlist.id = 'statSelect'+ idxval;
       statlist.setAttribute('stat','name');
	   for(j = 0; j < seriesType.length; j++){
		  var opt = document.createElement('option');
		  opt.innerHTML = seriesType[j];
		  opt.value = j;
		  statlist.appendChild(opt);
	   }
 }

//Plot Button
var plotbtn = document.createElement('button');
    plotbtn.id = 'plotBtn' + idxval;
	plotbtn.className = 'databutton';
    plotbtn.innerHTML = 'Update Plot';
	
	
//Increment buttons
	var scrollbtn1 = document.createElement('button');
    scrollbtn1.id = 'increment1' + idxval;
    scrollbtn1.innerHTML = '<i class="fa-solid fa-square-caret-left fa-2x" style="color: black;">';
	
	var scrollbtn2 = document.createElement('button')
	scrollbtn2.id = 'increment2' + idxval;
    scrollbtn2.innerHTML = '<i class="fa-solid fa-square-caret-right fa-2x" style="color: black;">';
	


  //Page heading 
  var pgHead = document.createElement("H3");
     var pgText = document.createTextNode(bkMark.title)
   pgHead.setAttribute('id', bkMark.id)
   pgHead.appendChild(pgText);
   
//PlotDiv

var plotDiv = document.createElement("div");
if(type == "table"){
    plotDiv.setAttribute('id', "TabDiv" + idxval);
} else {
	plotDiv.setAttribute('id', "PlotDiv" + idxval)
}

	   
//Building Table
  if(type == "map"){
	  //Build Contents of Download Button  -- map is only download
	   
	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tabcell1.appendChild(dlbtn)
	   tblrow.appendChild(tabcell1);
	   
	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
	   
	   var tabcell3 = document.createElement("td");
	   tabcell3.style.border = "0px solid black";
	   tabcell3.style.verticalAlign = "top";
	   tabcell3.style.align = 'left';
	   tabcell3.style.width = "20%";
	   tblrow.appendChild(tabcell3);
	  
	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   tblrow.appendChild(tabcell4);
  }  
  if(type == "chart"){
	  //Build Contents of download button nned image DL, data dl and source dl
	  var outDL = dlContent(type, idxval, bkMark)
	  var acDiv = document.createElement("div")
	  acDiv.setAttribute("class", "dropdown AClass");
	  acDiv.appendChild(dlbtn);
	  acDiv.appendChild(outDL);
	  
	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tabcell1.appendChild(acDiv);
	   tblrow.appendChild(tabcell1);
	  
    if(pctTable){
	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tabcell2.appendChild(stattxt);
	   tabcell2.appendChild(statlist);
	   tblrow.appendChild(tabcell2);
  } else {
	  var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
  }
   var tabcell3 = document.createElement("td");
	   tabcell3.style.border = "0px solid black";
	   tabcell3.style.verticalAlign = "top";
	   tabcell3.style.align = 'left';
	   tabcell3.style.width = "20%";
	   if(row1List.includes(bkMark.id)){
	      tabcell3.appendChild(geolist);
	   }
	   tblrow.appendChild(tabcell3);
	   
  	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   if(row1List.includes(bkMark.id)){
	      tabcell4.appendChild(plotbtn);
	   }
	   tblrow.appendChild(tabcell4);
  } //chart
  if(type == "table"){

	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tblrow.appendChild(tabcell1);
	  
   if(pctTable){
	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tabcell2.appendChild(stattxt);
	   tabcell2.appendChild(statlist);
	   tblrow.appendChild(tabcell2);
  } else {
	  var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
  }
       var tabcell3 = document.createElement("td");
	   tabcell3.style.border = "0px solid black";
	   tabcell3.style.verticalAlign = "top";
	   tabcell3.style.align = 'left';
	   tabcell3.style.width = "20%";
	   tabcell3.appendChild(scrollbtn1);
	   tabcell3.appendChild(scrollbtn2);
	   tblrow.appendChild(tabcell3);
	   
  	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   tblrow.appendChild(tabcell4);
  } //table
} //Region

if(level == "County"){

//Statistic Select dropdown
if(pctTable){
	//Type selection
	var stattxt = document.createElement('p');
         stattxt.id = 'stattext' + idxval;
         stattxt.className = 'entry_text';
		 stattxt.innerHTML = '<b>Select Statistic</b><br>';
		 switch(bkMark.title) {  //this is the table type selectotor
		 case "Population Growth Table" :   
			var seriesType = ['Growth Rate', 'Numeric Growth'];
			break;
		case "Household Forecast" :
			var seriesType = ['Number of Households', 'Household Change','Household Change Rate'];
			break;
        case "Housing Type Table" :
			var seriesType = ['Number of Housing Units', 'People in Housing Units'];
		    break;
		default :
	 		var seriesType = ['Percentage', 'Number'];  
		}
	   var statlist = document.createElement('select');
	   statlist.id = 'statSelect'+ idxval;
       statlist.setAttribute('stat','name');
	   for(j = 0; j < seriesType.length; j++){
		  var opt = document.createElement('option');
		  opt.innerHTML = seriesType[j];
		  opt.value = j;
		  statlist.appendChild(opt);
	   }
 }
 
   //Page heading 
  var pgHead = document.createElement("H3");
     var pgText = document.createTextNode(bkMark.title)
   pgHead.setAttribute('id', bkMark.id)
   pgHead.appendChild(pgText);
   
//PlotDiv

var plotDiv = document.createElement("div");
if(type == "table"){
    plotDiv.setAttribute('id', "TabDiv" + idxval);
} else {
	plotDiv.setAttribute('id', "PlotDiv" + idxval)
}
	
//Building Table
  if(type == "map"){
	  	  //Build Contents of Download Button  -- map is only download
	  
	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tabcell1.appendChild(dlbtn)
	   tblrow.appendChild(tabcell1);
	   
	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
	   
	   var tabcell3 = document.createElement("td");
	   tabcell3.style.border = "0px solid black";
	   tabcell3.style.verticalAlign = "top";
	   tabcell3.style.align = 'left';
	   tabcell3.style.width = "20%";
	   tblrow.appendChild(tabcell3);
	  
	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   tblrow.appendChild(tabcell4);
  }  
  if(type == "chart"){
	  	  	  //Build Contents of Download Button  -- Chart is Img DL, data DL, and Source
	  var outDL = dlContent(type, idxval, bkMark)
	  var acDiv = document.createElement("div")
	  acDiv.setAttribute("class", "dropdown AClass");
	  acDiv.appendChild(dlbtn);
	  acDiv.appendChild(outDL);
	  
	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tabcell1.appendChild(acDiv);
	   tblrow.appendChild(tabcell1);

    if(pctTable){
	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tabcell2.appendChild(stattxt);
	   tabcell2.appendChild(statlist);
	   tblrow.appendChild(tabcell2);
  } else {
	  var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
  }
  	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   tblrow.appendChild(tabcell4);
  } //chart
  if(type == "table"){
	  	//No DL Button for tables
	  
	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tblrow.appendChild(tabcell1);

   if(pctTable){
	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tabcell2.appendChild(stattxt);
	   tabcell2.appendChild(statlist);
	   tblrow.appendChild(tabcell2);
  } else {
	  var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
  }
       var tabcell3 = document.createElement("td");
	   tabcell3.style.border = "0px solid black";
	   tabcell3.style.verticalAlign = "top";
	   tabcell3.style.align = 'left';
	   tabcell3.style.width = "20%";
	   tblrow.appendChild(tabcell3);
	   
  	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   tblrow.appendChild(tabcell4);
  } //table
} //County

if(level == "Municipality"){
//Statistic Select dropdown
if(pctTable){
	//Type selection
	var stattxt = document.createElement('p');
         stattxt.id = 'stattext' + idxval;
         stattxt.className = 'entry_text';
		 stattxt.innerHTML = '<b>Select Statistic</b><br>';
		 switch(bkMark.title) {  //this is the table type selectotor
		 case "Population Growth Table" :   
			var seriesType = ['Growth Rate', 'Numeric Growth'];
			break;
		case "Household Forecast" :
			var seriesType = ['Number of Households', 'Household Change','Household Change Rate'];
			break;
        case "Housing Type Table" :
			var seriesType = ['Number of Housing Units', 'People in Housing Units'];
		    break;
		default :
	 		var seriesType = ['Percentage', 'Number'];  
		}
	   var statlist = document.createElement('select');
	   statlist.id = 'statSelect'+ idxval;
       statlist.setAttribute('stat','name');
	   for(j = 0; j < seriesType.length; j++){
		  var opt = document.createElement('option');
		  opt.innerHTML = seriesType[j];
		  opt.value = j;
		  statlist.appendChild(opt);
	   }
 }
 
   //Page heading 
  var pgHead = document.createElement("H3");
     var pgText = document.createTextNode(bkMark.title)
   pgHead.setAttribute('id', bkMark.id)
   pgHead.appendChild(pgText);
   
//PlotDiv

var plotDiv = document.createElement("div");
if(type == "table"){
    plotDiv.setAttribute('id', "TabDiv" + idxval);
} else {
	plotDiv.setAttribute('id', "PlotDiv" + idxval)
}
//Building Table
  if(type == "map"){
	  	  	  //Build Contents of Download Button  -- map is only download
	  
	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tabcell1.appendChild(dlbtn)
	   tblrow.appendChild(tabcell1);

	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
	   
	   var tabcell3 = document.createElement("td");
	   tabcell3.style.border = "0px solid black";
	   tabcell3.style.verticalAlign = "top";
	   tabcell3.style.align = 'left';
	   tabcell3.style.width = "20%";
	   tblrow.appendChild(tabcell3);
	  
	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   tblrow.appendChild(tabcell4);
  }  
  if(type == "chart"){
	  	  	  //Build Contents of Download Button  -- Chart is Img DL, data DL, and Source
	  var outDL = dlContent(type, idxval, bkMark)
	  var acDiv = document.createElement("div")
	  acDiv.setAttribute("class", "dropdown AClass");
	  acDiv.appendChild(dlbtn);
	  acDiv.appendChild(outDL);
	  
	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tabcell1.appendChild(acDiv);
	   tblrow.appendChild(tabcell1);

    if(pctTable){
	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tabcell2.appendChild(stattxt);
	   tabcell2.appendChild(statlist);
	   tblrow.appendChild(tabcell2);
  } else {
	  var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
  }
       var tabcell3 = document.createElement("td");
	   tabcell3.style.border = "0px solid black";
	   tabcell3.style.verticalAlign = "top";
	   tabcell3.style.align = 'left';
	   tabcell3.style.width = "20%";
	   tblrow.appendChild(tabcell3);
	   
  	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   tblrow.appendChild(tabcell4);
  } //chart
  if(type == "table"){
	   //No DL Button for tables
	  
	   var tabcell1 = document.createElement("td");
	   tabcell1.style.border = "0px solid black";
	   tabcell1.style.verticalAlign = "top";
	   tabcell1.style.align = 'left';
	   tabcell1.style.width = "20%";
	   tblrow.appendChild(tabcell1);

	  
   if(pctTable){
	   var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tabcell2.appendChild(stattxt);
	   tabcell2.appendChild(statlist);
	   tblrow.appendChild(tabcell2);
  } else {
	  var tabcell2 = document.createElement("td");
	   tabcell2.style.border = "0px solid black";
	   tabcell2.style.verticalAlign = "top";
	   tabcell2.style.align = 'left';
	   tabcell2.style.width = "20%";
	   tblrow.appendChild(tabcell2);
  }
       var tabcell3 = document.createElement("td");
	   tabcell3.style.border = "0px solid black";
	   tabcell3.style.verticalAlign = "top";
	   tabcell3.style.align = 'left';
	   tabcell3.style.width = "20%";
	   tblrow.appendChild(tabcell3);
	   
  	   var tabcell4 = document.createElement("td");
	   tabcell4.style.border = "0px solid black";
	   tabcell4.style.verticalAlign = "top";
	   tabcell4.style.align = 'left';
	   tabcell4.style.width = "20%";
	   tblrow.appendChild(tabcell4);
  } //table
} //Municipality

tbl.appendChild(tblrow);

//writing to DOM
    var outDiv = document.getElementById(gridPanel);
    outDiv.appendChild(pgHead);
    outDiv.appendChild(tbl);
    outDiv.appendChild(plotDiv);
} 
// pgSetupPro


//cat Data Table Functions

function getHeaders(dt){
//getHeaders exttracts multi line headers from data table

    var thRows = dt.nTHead.rows;
    var numRows = thRows.length;
    var matrix = [];
 
    // Iterate over each row of the header and add information to matrix.
    for ( var rowIdx = 0;  rowIdx < numRows;  rowIdx++ ) {
        var $row = $(thRows[rowIdx]);
 
        // Iterate over actual columns specified in this row.
        var $ths = $row.children("th");
        for ( var colIdx = 0;  colIdx < $ths.length;  colIdx++ )
        {
            var $th = $($ths.get(colIdx));
            var colspan = $th.attr("colspan") || 1;
            var rowspan = $th.attr("rowspan") || 1;
            var colCount = 0;
          
            // ----- add this cell's title to the matrix
            if (matrix[rowIdx] === undefined) {
                matrix[rowIdx] = [];  // create array for this row
            }
            // find 1st empty cell
            for ( var j = 0;  j < (matrix[rowIdx]).length;  j++, colCount++ ) {
                if ( matrix[rowIdx][j] === "PLACEHOLDER" ) {
                    break;
                }
            }
            var myColCount = colCount;
            matrix[rowIdx][colCount++] = $th.text();
         
            // ----- If title cell has colspan, add empty titles for extra cell width.
            for ( var j = 1;  j < colspan;  j++ ) {
                matrix[rowIdx][colCount++] = "";
            }
          
            // ----- If title cell has rowspan, add empty titles for extra cell height.
            for ( var i = 1;  i < rowspan;  i++ ) {
                var thisRow = rowIdx+i;
                if ( matrix[thisRow] === undefined ) {
                    matrix[thisRow] = [];
                }
                // First add placeholder text for any previous columns.                
                for ( var j = (matrix[thisRow]).length;  j < myColCount;  j++ ) {
                    matrix[thisRow][j] = "PLACEHOLDER";
                }
                for ( var j = 0;  j < colspan;  j++ ) {  // and empty for my columns
                    matrix[thisRow][myColCount+j] = "";
                }
            }
        }
    }
   
   return matrix;
};
// getHeaders

//cat Datatable support functions

function export2Word(intab, filename = ''){
//export2Word  converts DL Table to Word format for downloadfrom https://www.codexworld.com/export-html-to-word-doc-docx-using-javascript/

 filename = filename.replace(".docx","");

 var preHtml = "<html xmlns:office='urn:schemas-microsoft-com:office:office,  xmlns:word='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
                  "<head><style> " +       
                  "@page Section1 {size:841.7pt 595.45pt;mso-page-orientation:landscape;margin:0.25in 0.25in 0.5in 0.5in;mso-header-margin:.5in;mso-footer-margin:.5in;mso-paper-source:0;} " +
                  "div.Section1 {page:Section1;} " +
                  "</style> </head> <body><div class=Section1>";

    var postHtml = "</div></body></html>";
    var html = preHtml+intab+postHtml;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
	    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    
    // Specify file name
    filename = filename ? filename+'.doc':'document.doc';
    
    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob ){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = url;
        
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
 };
// export2Word


function generateTab(header, body, footer, tabTitle, fileName) {
//generateTab creates html table and the passes table to the export2Word function
 const fmt_date = d3.timeFormat("%B %d, %Y");
    const fmt_yr = d3.format("00");


//Header
var table = "<table border= '1' width= 100%><thead><tr align='center'>";
for(i = 1; i < header[0].length; i++){
 table = table + '<th>' + header[0][i] + '</th>';
}
table = table + "</tr></thead>";

//body

table = table + "<tbody><tr>";
for(i = 0; i < body.length; i++){
 for(j = 1; j < body[i].length;j++){
  if(j == 1){
    table = table + "<td>" + body[i][j] + "</td>"; //This is the place name,...
  } else {
    var fmt_val = ""
    if(tabTitle.includes("Basic Statistics")) {
    if(body[i].length == 10){
     if(j == 2) {fmt_val = fixNUMFMT(body[i][j],'num')};
     if(j == 3) {fmt_val = fixNUMFMT(body[i][j],'num')};
     if(j == 4) {fmt_val = fixNUMFMT(body[i][j],'pct')};
     if(j == 5) {fmt_val = fixNUMFMT(body[i][j],'num')};
     if(j == 6) {fmt_val = fixNUMFMT(body[i][j],'cur')};
     if(j == 7) {fmt_val = fixNUMFMT(body[i][j],'cur')};
     if(j == 8) {fmt_val = fixNUMFMT(body[i][j],'pct')};
     if(j == 9) {fmt_val = fixNUMFMT(body[i][j],'pct')};
     } else {
     if(j == 2) {fmt_val = fixNUMFMT(body[i][j],'num')};
     if(j == 3) {fmt_val = fixNUMFMT(body[i][j],'num')};
     if(j == 4) {fmt_val = fixNUMFMT(body[i][j],'pct')};
     if(j == 5) {fmt_val = fixNUMFMT(body[i][j],'cur')};
     if(j == 6) {fmt_val = fixNUMFMT(body[i][j],'cur')};
     if(j == 7) {fmt_val = fixNUMFMT(body[i][j],'pct')};
     if(j == 8) {fmt_val = fixNUMFMT(body[i][j],'pct')};
    } 
    } //Basc Stats
  if(tabTitle.includes("Population Growth")) {
   if(body[i][2] === '-') {  //This is the pct growth table
     if(j > 2) {
        fmt_val = fixNUMFMT(body[i][j],'pct')
         } else {
            fmt_val = body[i][j];
        }
          } else {
    fmt_val = fixNUMFMT(body[i][j],'num')
   };
  };  //Pop Growth
    table = table + "<td align='right'>" + fmt_val + "</td>";
   };
  } // j loop
 table = table + '</tr>';
 } //i loop
table = table + '</tbody>';

table = table.replaceAll("NaN%","-");
table = table.replaceAll("NaN","-");
//footer

table = table + "<tfoot>";
for(a = 0; a < footer.length; a++){
 table = table + '<tr><td colspan = ' + body[0].length + '>' + footer[a] + '</td></tr>';
}
table = table + "</tfoot></table>";

export2Word(table, filename = fileName);

 }; 
 // generateTab


$.fn.dataTable.ext.buttons.word = {
 //Data Table WordButton creator  Simple Word file
 
    className: 'buttons-word',
 
   action: function ( e, dt, node, config ) {
                 var colhd = dt.columns().header().toArray().map(x => x.innerText);
    var colft = dt.footer().toArray().map(x => x.innerText);
    var table = dt.rows().data();
    var tabTitle = config.titleAttr;
    var fileName = tabTitle + ".docx";
   
   //flattening the table componets
            var colHead =[];
   colHead[0] = colhd;
    
   
   var colFoot = colft.toString().split("\t");

   generateTab(colHead,table,colFoot,tabTitle,fileName);
   } //action function....
   };
// Data Table WordButton creator



function plextabWord(inData,hdrArr,ftrArr,fName,tabType) {
//plextabWord processes datatable elements and produces a word doc
	var wordtab = HTMLtoArray(inData,hdrArr,"WORD",tabType)

 var tabinfo = [{tabName : 'Summary Statistics Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']},
			{tabName : 'Population Growth Table', ncols : 1, hdrCols : ['Estimate']},
			{tabName : 'Income Sources Table', ncols : 4, hdrCols : ['Households', 'Margin of Error','Average Income','Margin of Error']},
			{tabName : 'Race and Ethnicity Table', ncols : 4, hdrCols : ['Estimate', 'Margin of Error', 'Percent','Margin of Error']},
			{tabName : 'Housing Occupancy and Vacancy Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']},
			{tabName : 'Housing Type Table', ncols : 4, hdrCols : ['Estimate', 'Margin of Error', 'Percent', 'Margin of Error']},
			{tabName : 'Housing Cost and Affordability Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']}
		  ];
		  
//extracting the number of 
var tabInfo = tabinfo.filter(d => tabType.includes(d.tabName));

//This applies the styles (alignment) to the cells of the body array
var bodyArr = []
for(a = 0; a < wordtab.length; a++){
	var tmpbody = []
	 for(b = 0; b < wordtab[a].length; b++) {
		 var dataRow = "";
		 for(c = 0; c < wordtab[a][b].length; c++){

			 switch(b) {
				case 0: 
					if(tabType == "Population Growth Table"){
						dataRow = dataRow +"<th align='center'>" + wordtab[a][b][c] + "</th>";
					} else {
						if(c == 0){
							dataRow = dataRow +"<th align='center'>" + wordtab[a][b][c] + "</th>";
						}
						if(wordtab[a][b][c] != ""){
							dataRow = dataRow +"<th align='center' colspan ='" + tabInfo[0].ncols + "'>" + wordtab[a][b][c] + "</th>";
						}
					};
				    break;
				case 1 :
					dataRow = dataRow +"<th align='center'>" + wordtab[a][b][c] + "</th>"
					break;
				default :
					if(c == 0) {
						if(tabType == "Housing Type Table"){
							if([3,12,21].includes(b)){ //These are the housing tenure lines
								dataRow = dataRow +"<td align='left' colspan='" + wordtab[a][b].length + "'>" +  wordtab[a][b][c] + "</td>";
							} else {
						      dataRow = dataRow +"<td align='left'>" + wordtab[a][b][c] + "</td>";
							}
						}  else {
							dataRow = dataRow +"<td align='left'>" + wordtab[a][b][c] + "</td>";
						}
					} else {
						dataRow = dataRow +"<td align='right'>" + wordtab[a][b][c] +"</td>";
					}
					break
				}; //switch
		 } //c
		 //These are the housing tenure lines
		 if([3,12,21].includes(b)){
		 dataRow = dataRow.replaceAll("<td align='right'></td>","");
		 }
		 dataRow = "<tr>" + dataRow + "</tr>"
		 tmpbody.push(dataRow)
	 } //b
	bodyArr.push(tmpbody);
} //a


if(tabType == "Housing Type Table"){
    var nHdr = 2;
} else {
	var nHdr = 1;
}

//Adding thead
for(x = 0; x < bodyArr.length; x++){
	for(y = 0; y < bodyArr[x].length; y++){
		if(y == 0) {
			bodyArr[x][y] = "<thead>" + bodyArr[x][y];
		}
		if(y == nHdr) {
			bodyArr[x][y] = bodyArr[x][y] + "</thead>";
		}
	}
}

//Assembling Final Table
 var tblStart = "<table border= '1' width= 100%>";
 var tblEnd = "</table>"
 var pgbreak = '<br style="page-break-before: always">'

var stackTab = "";

for(i = 0; i < bodyArr.length; i++){ 
//Add Table footer

colspanVal = wordtab[i][0].length

var ftrString = "<tfoot>";

for(j = 0; j < ftrArr.length; j++){
		ftrString = ftrString + "<tr><td colspan='" + colspanVal + "'>" + ftrArr[j] + "</td></tr>";
 }; 
ftrString = ftrString + "</tr></tfoot>";

	if(i < bodyArr.length - 1){
		stackTab = stackTab + tblStart + bodyArr[i] + ftrString + tblEnd + pgbreak;
	} else {
		stackTab = stackTab + tblStart + bodyArr[i] + ftrString + tblEnd;
	}
 } 
 
 var stackTab2 = stackTab.replace(/−/g,"  -").replace(/<\/tr>\,/g,"</tr>").replace(/<\/thead>\,/g,"</thead>");

 export2Word(stackTab2, fName);
} 
// plextabWord
 
//cat pdfMake support functions...

function pdfFmt(elem, numcol, currec, hdrrows){
//pdfFmt  Applies page format to PDF output tables
	var outtxt = (typeof elem === 'undefined') ? ' ' : elem;
	if(currec < hdrrows){
		var outstyle = 'headsty';
	} else {
		if(numcol){
		var outstyle =  'lnright' ;
		} else {
		var outstyle = 'lnleft';
		}
	}
   
	
	return([outtxt, outstyle]);
} 

function genPDFTable(data, hdrRows) {
 var outarr = [];
 data.forEach( dd => {
  var indTab =  {
   table: {
   headerRows: hdrRows,
   dontBreakRows: true, 
            body: dd},
   pageBreak: "after" }
  outarr.push(indTab);
 })

    return (outarr)
}  //genPDFTable

function chkEmpty(str) {
	var nstr = 0;
	for(i = 0; i < str.length; i++){
		if (typeof str[i] === 'string' || str[i] instanceof String) {
			nstr++
		}
	}
	var notstr = str.length - nstr;
    return (notstr);
}
// pdfFmt


function plextabPDF(inData,hdrArr,ftrArr,fName,tabType) {
//plextabPDF processes datatable elements and produces a PDF doc
//http://pdfmake.org/#/
//Header Formatting  https://pdfmake.github.io/docs/0.1/document-definition-object/styling/

 var pdfTab = HTMLtoArray(inData,hdrArr,"PDF",tabType)
  var tabinfo = [{tabName : 'Summary Statistics Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']},
			{tabName : 'Population Growth Table', ncols : 1, hdrCols : ['Estimate']},
			{tabName : 'Income Sources Table', ncols : 4, hdrCols : ['Households', 'Margin of Error','Average Income','Margin of Error']},
			{tabName : 'Race and Ethnicity Table', ncols : 4, hdrCols : ['Estimate', 'Margin of Error', 'Percent','Margin of Error']},
			{tabName : 'Housing Occupancy and Vacancy Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']},
			{tabName : 'Housing Type Table', ncols : 4, hdrCols : ['Estimate', 'Margin of Error', 'Percent', 'Margin of Error']},
			{tabName : 'Housing Cost and Affordability Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']}
		  ];
		  
//extracting the number of 
var tabInfo = tabinfo.filter(d => tabType.includes(d.tabName));

//This applies the styles (alignment) to the cells of the body array
var bodyArr = []
for(a = 0; a < pdfTab.length; a++){
	var tmpbody = []
	 for(b = 0; b < pdfTab[a].length; b++) {
		 var dataRow = [];
		 for(c = 0; c < pdfTab[a][b].length; c++){
			 switch(b) {
				case 0: 
					if(tabType == "Population Growth Table"){
						dataRow.push({'text': pdfTab[a][b][c], 'style': 'headsty'});
					} else {
						if(pdfTab[a][b][c] != ""){
							dataRow.push({'text': pdfTab[a][b][c], 'style': 'headsty', 'colSpan': tabInfo[0].ncols});
						} else {
							dataRow.push({'text': pdfTab[a][b][c], 'style': 'headsty'});
						}
					};
				    break;
				case 1 :
					dataRow.push({'text': pdfTab[a][b][c], 'style': 'headsty'})
					break;
				default :
					if(c == 0) {
						if(tabType == "Housing Type Table"){
							if([3,12,21].includes(b)){
								dataRow.push({'text': pdfTab[a][b][c], 'style': 'lnleft', 'colSpan' : pdfTab[a][b].length});
							} else {
						      dataRow.push({'text': pdfTab[a][b][c], 'style': 'lnleft'});
							}
						}  else {
							dataRow.push({'text': pdfTab[a][b][c], 'style': 'lnleft'});
						}
					} else {
						dataRow.push({'text': pdfTab[a][b][c], 'style': 'lnright' });
					}
					break
				}; //switch
		 } //c
	  tmpbody.push(dataRow);
	 } //b
	bodyArr.push(tmpbody);
} //a

if(tabType == "Housing Type Table"){
    var nHdr = 3;
} else {
	var nHdr = 2;
}

 //Process footer

var footout = ""
for(x = 0; x < ftrArr.length; x++){
footout = footout + "\u200B\t" + ftrArr[x] + "\n";
}

var btmmargin = ftrArr.length * 15;
//Document output
var dd = {
  pageOrientation : 'landscape',
   pageMargins: [30, 20, 20, btmmargin],
    header: function(currentPage, pageCount, pageSize) {
    return [
      { text: "\u200B\t" + fName, alignment: 'left', fontSize: 11},
    ]
	},
      footer: function(currentPage, pageCount, pageSize) {
    return [
      { text: footout, alignment: 'left', fontSize: 9 },
    ]
  },
    content: [
       genPDFTable(bodyArr,nHdr),
    ],
//styleSheets
defaultStyle: {
    fontSize: 10
  },
  styles: {
    headsty: {
     alignment : 'center',
     fillColor: '#4f5250',
     color: 'white'
   },
  lnright: { alignment :'right'},
  lnleft : { alignment : 'left'}
   }
   
};
 
 pdfMake.createPdf(dd).download(fName + ".pdf");
} 
// plextabPDF

//cat Table preparation functions

function procHHForecast(inData){
//procHHForecast Processes Household Forecast data

	var outData = [];
	var grFips = [...new Set(inData.map(d => d.fips))]
	var age_arr = ["Total", "18 to 24", "25 to 44", "45 to 64", "65 and Older"]
	grFips.forEach(fp =>{
		for(i = 0; i < 5; i++){ //age_group_id
			var tmpFore = inData.filter(d => d.fips == fp).filter(d2 => d2.age_group_id == i)
			for(j = 0; j < tmpFore.length; j++){
				outData.push({
					'fips' : tmpFore[j].fips,
				   'name' : tmpFore[j].name,
				   'year' : tmpFore[j].year,
				   'age_group_id' : age_arr[tmpFore[j].age_group_id],
				   'household_type_id' : 0,
				   'total_households' : tmpFore[j].total_households,
				   'grlabel' : j == 0 ? "" :tmpFore[j-1].year + "-" + tmpFore[j].year,
				   'growth'  : j == 0 ? 0 : tmpFore[j].total_households - tmpFore[j-1].total_households,
				   'cagr' : j == 0 ? '-' : (Math.pow((tmpFore[j].total_households/tmpFore[j-1].total_households),(1/(tmpFore[j].year - tmpFore[j-1].year)))-1)
				})
		} //j
	} //i
});
return(outData)
} 
// procHHForecast


function aggPPH(pphdata, hhdata,regid) {
//aggPPH Calculates PPH for Regions

	var tmpdata = join(pphdata,hhdata,"GEO2","GEO2",function(dat,col){
		return{
			GEO2 : col.GEO2,
			pershh_est : col.B25010_001E * dat.B25032_001E,
			pershh_moe : Math.pow((col.B25010_001M * dat.B25032_001E),2),
			persoo_est : col.B25010_002E * dat.B25032_002E,
			persoo_moe : Math.pow((col.B25010_002M * dat.B25032_002E),2),
			persrt_est : col.B25010_003E * dat.B25032_013E,
			persrt_moe : Math.pow((col.B25010_003M * dat.B25032_013E),2),
			tothh_est : dat.B25032_001E,
			tothh_moe : Math.pow(dat.B25032_001M,2),
			totoo_est : dat.B25032_002E,
			totoo_moe : Math.pow(dat.B25032_002M,2),
			totrt_est : dat.B25032_013E,
			totrt_moe : Math.pow(dat.B25032_013M,2)
		};
	});


	var columnsToSum = ["pershh_est", "pershh_moe", "persoo_est", "persoo_moe", "persrt_est", "persrt_moe", 
						"tothh_est", "tothh_moe", "totoo_est", "totoo_moe", "totrt_est", "totrt_moe"]
	var sumdata = d3.rollup(tmpdata, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])))

    sumdata.NAME = regid.NAME;
	sumdata.GEO1 = 8;
	sumdata.GEO2 = regid.FIPS;
	sumdata.B25010_001E = sumdata.pershh_est/sumdata.tothh_est;
	sumdata.B25010_001M = Math.sqrt(sumdata.pershh_moe/sumdata.tothh_est);
	sumdata.B25010_002E = sumdata.persoo_est/sumdata.totoo_est;
	sumdata.B25010_002M = Math.sqrt(sumdata.persoo_moe/sumdata.totoo_est);
	sumdata.B25010_003E = sumdata.persrt_est/sumdata.totrt_est;
	sumdata.B25010_003M = Math.sqrt(sumdata.persrt_moe/sumdata.totrt_est);
	delete sumdata.pershh_est;
	delete sumdata.pershh_moe;
	delete sumdata.tothh_est;
	delete sumdata.tothh_moe;
	delete sumdata.persoo_est;
	delete sumdata.persoo_moe;
	delete sumdata.totoo_est;
	delete sumdata.totoo_moe;
	delete sumdata.persrt_est;
	delete sumdata.persrt_moe;
	delete sumdata.totrt_est;
	delete sumdata.totrt_moe;
	var outdata = [];
	outdata.push(sumdata)
return(outdata);
}
// aggPPH


function growth_tab(level, inData,bkMark, fileName, outDiv_id){
// growth_tab Calculate 5-year growth rate table 

 const fmt_date = d3.timeFormat("%B %d, %Y");
 const regList = ['Region', 'Regional Comparison'];
 const tabtitle = bkMark.title;


var geomap = [...new Set(inData.map(d => d.fips))];
var geonames = [...new Set(inData.map(d => d.name))];
var yrvalues = [...new Set(inData.map(d => d.year))];
var maxyear = Math.max(...yrvalues);



var outDataPop = [];
var outDataGr = [];

for(i = 0; i < geomap.length; i++) {
 var tmp_dat = inData.filter(d => d.fips == geomap[i]);

   outDataPop.push({'fips' : tmp_dat[0].fips, 'name' : tmp_dat[0].name, 'year' : tmp_dat[0].year, 'totalpopulation' : tmp_dat[0].totalpopulation});
   outDataGr.push({'fips' : tmp_dat[0].fips, 'name' : tmp_dat[0].name, 'year' : tmp_dat[0].year, 'growthrate' : 999999999});

 for(j = 1; j < tmp_dat.length; j++) {
  if( tmp_dat[j].totalpopulation == 0 || tmp_dat[j-1].totalpopulation == 0) {
   gr_rate = "-";
  } else {
  var pop_ratio = tmp_dat[j].totalpopulation/tmp_dat[j-1].totalpopulation;
  var yr_ratio = 1/(tmp_dat[j].year - tmp_dat[j-1].year);
  var gr_rate = (Math.pow(pop_ratio,yr_ratio)-1);
  }
  var tmp_pop = [];
  var tmp_gr = [];
   tmp_pop.push({'fips' : tmp_dat[j].fips, 'name' : tmp_dat[j].name, 'year' : tmp_dat[j].year, 'totalpopulation' : tmp_dat[j].totalpopulation});
   tmp_gr.push({'fips' : tmp_dat[j].fips, 'name' : tmp_dat[j].name, 'year' : tmp_dat[j].year, 'growthrate' : gr_rate});
   outDataPop = outDataPop.concat(tmp_pop);
   outDataGr = outDataGr.concat(tmp_gr);
     } //j
   } //i 
   

//Processing wide File
var outDataPopWide = [];
var outDataGrWide = [];

for(a = 0; a < geomap.length; a++){
	 var filtPop = outDataPop.filter(d => d.fips == geomap[a])
	 var filtGr = outDataGr.filter(d => d.fips == geomap[a])
	 var outPop = long_to_wide(filtPop, filtPop[0].fips, filtPop[0].name,yrvalues,"totalpopulation","num")
	 var outGr = long_to_wide(filtGr, filtGr[0].fips, filtGr[0].name,yrvalues,"growthrate","pct")
	 outDataPopWide = outDataPopWide.concat(outPop);
	 outDataGrWide = outDataGrWide.concat(outGr);
}


 if(level == "Region"){
	var src_link = 'https://demography.dola.colorado.gov/assets/lookups/region_totpop_lookup.html';
}
if(level == "County") {
	var src_link = 'https://demography.dola.colorado.gov/assets/lookups/county_totpop_lookup.html'
}
if(level == "Municipality") {
	var src_link = 'https://demography.dola.colorado.gov/assets/lookups/ctymuni_pop_lookup.html'
}
var row_labels = []

for(i = 0; i < yrvalues.length;i++) {
 row_labels.push({'title' : yrvalues[i].toString() , 'URL_link' : src_link});
}

//Buiding Table


var tab_pop = genSubjTab(level, outDataPopWide, bkMark.id,row_labels,false);
var tab_gr = genSubjTab(level,outDataGrWide, bkMark.id, row_labels,false);


//footer
//Creating Footer
var ftrMsg = "Source: Colorado State Demography Office Print Date : " + fmt_date(new Date);
if(level == "Municipality"){
	var ftrString = "<tfoot><tr><td colspan = '4'>"+ ftrMsg + "</td></tr></tfoot>";
} else {
	var ftrString = "<tfoot><tr><td colspan = '3'>"+ ftrMsg + "</td></tr></tfoot>";
}
var tblfoot = [ "Source: Colorado State Demography Office Print Date : " + fmt_date(new Date)];

//Producing  datatables...

pgSetupPro(level, "table", outDiv_id, bkMark, false, true, geomap,geonames, maxyear)

var tabVal = 0;

	//selecting initial dropdown values

if(level == "Region"){
	var dd1 = document.getElementById("statSelect1");
   dd1.value = "0";
   var btndown = document.getElementById("increment11");
   var btnup = document.getElementById("increment21");

DTtab("TabDiv1",tab_gr,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle) 

   
  dd1.addEventListener('change', function() {
	   if(dd1.value == "0") {
		   DTtab("TabDiv1",tab_gr,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv1",tab_pop,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle);
	   }
   });

   btndown.addEventListener('click', function() {
     tabVal = tabVal - 1;
	 if(tabVal < 0) {
		tabVal = 5
	 }
	 if(dd1.value == "0") {
		   DTtab("TabDiv1",tab_gr,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv1",tab_pop,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle);
	  }
   });
  btnup.addEventListener('click', function() {
     tabVal = tabVal + 1;
	 if(tabVal > 5) {
		tabVal = 0
	 }
	 if(dd1.value == "0") {
		   DTtab("TabDiv1",tab_gr,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv1",tab_pop,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle);
	  }
    });
}  else {
	var dd1 = document.getElementById("statSelect1");
   dd1.value = "0";
	DTtab("TabDiv1",tab_gr,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle) 

  dd1.addEventListener('change', function() {
	   if(dd1.value == "0") {
		   DTtab("TabDiv1",tab_gr,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv1",tab_pop,tabVal,row_labels,ftrString,tblfoot,"popgrowth",fileName,tabtitle);
	   }
   });
}
 }; 
 //growth_tab
 

function genSubjTab(level,inData,section, row_topics,pctTab) {
//genSubjTab Generates substantive table with topics in the rows and geographies in the columns. a n rows *5 column array of tables
// section refers to the output section.  For section > 2, need to go through steps and format table.
// for section <= 2, the table is already formatted and the tables have a different column layout

//Fix for section 2
if(section == 'popgr') {
	if(row_topics[0].title == 'location'){
	  row_topics.shift()
	}
}

var nRows = row_topics.length + 2;
//The idea is to create a 3D array:  array[panel][row_topic][6 column table string (2 cols for index and row_topic and 2 * 2 geography))]
	var row_tab = [];
	for(i = 0 ; i < nRows; i++){
		if( i < 2){
			row_tab.push("<th></th>");
		} else {
		 row_tab.push("<td><a href='" + row_topics[i-2].URL_link + "' target='_blank' title = '" + row_topics[i-2].title + "' aria-label = '" + row_topics[i-2].title + "'>" + row_topics[i-2].title + "</a></td>");
		}
	}
	
 //Creating the output objects
 var ntopics = row_tab.length ;

if(level == "Municipality") {
   var npanels = 1;
 } else {
   var npanels = Math.round((inData.length)/2); //This is the number of panels
 }
 

  var out_count = new Array(npanels);
  if(pctTab){
  var out_pct = new Array(npanels);
  }
  for(i = 0 ; i < npanels; i++) {
	  out_count[i] = new Array(ntopics);
	if(pctTab){
	  out_pct[i] = new Array(ntopics);
	}
	  for(j = 0 ; j < ntopics;j++){
		  if(section == 'popgr') {
			  if(level == "Municipality"){
				 out_count[i][j] = new Array(7);
			  } else {
			  out_count[i][j] = new Array(3);
			  }
		  } else {
			if(level == "Municipality"){
				 out_count[i][j] = new Array(7);
			  } else {
				out_count[i][j] = new Array(5);
			}
		  }
			if(pctTab){
			 if(section == 2) {
				 if(level == "Municipality"){
					 out_pct[i][j] = new Array(7);
				 } else {
					out_pct[i][j] = new Array(3);
				 }
			} else {
				out_pct[i][j] = new Array(5);
			}
			if(level == "Municipality"){
				 out_count[i][j] = new Array(7);
			  } else {
				out_count[i][j] = new Array(5);
			}			}
	  }
  }

  //Filling in the row labels
  for(i = 0; i < npanels; i++){
   for(j = 0; j < ntopics;j++){
	if(pctTab){
	  out_pct[i][j][0] = row_tab[j];
	} else {
	  out_count[i][j][0] = row_tab[j];
	}
   } //j
  } //i
 
  //Generate List of Keys

  
  var tmp_data_keys = Object.keys(inData[0]);
  var tgtrow = 0
  
   //Generate Tables by section 
if(section == 'summtab') { //this is for the summary table
for(a = 0; a < npanels;a++) {// panels
  var tmp_data = [];

  if(tgtrow == (inData.length - 1)){
	  tmp_data.push(inData[tgtrow]);
  } else {
	  if(level == "Municipality"){
		tmp_data = inData;
	  } else {
		tmp_data.push(inData[tgtrow], inData[tgtrow+1]);
	  }
  };
  tgtrow = tgtrow + 2
  
 
 //Populate the output tables

 	var col_pos = 1
	  for(i = 0; i < tmp_data.length;i++){  
	        var col_pos2 = col_pos + 1;
			 out_count[a][0][col_pos] = "<th align='center' colspan='2'>" + tmp_data[i][tmp_data_keys[1]] + "</th>";
			 out_count[a][1][col_pos] = "<th align='center'>Estimate</th>";
			 out_count[a][1][col_pos2] = "<th align='center'>Margin of Error</th>";
		 var j_offset = 0;
		 for(j = 0; j < tmp_data_keys.length; j++){
				if(j >= 2 & j <= 5){
					var val_est = tmp_data[i][tmp_data_keys[j]];
					out_count[a][j][col_pos] = "<td align='right'>" + val_est.toString() + "</td>";
					out_count[a][j][col_pos2] = "<td align='right'>" + " " + "</td>";
					} 
				if(j >= 6 & j <= 12) {
					if(j % 2 == 0){
						var rowpos = j - j_offset
						var val_est = tmp_data[i][tmp_data_keys[j]];
						var val_moe = tmp_data[i][tmp_data_keys[j+1]]
						out_count[a][rowpos][col_pos] = "<td align='right'>" + val_est + "</td>";
						out_count[a][rowpos][col_pos2] = "<td align='right'>" + val_moe + "</td>";
						j_offset++;
					}
				}
		 } //j
	 col_pos = col_pos + 2;
	  } //i
  } //a
   } //section == 1

 if(section == 'popgr') { //this is for the population growth rate tables --want to have a number and a rate panel similar to section > 2
for(a = 0; a < npanels;a++) {// panels
  var tmp_data = [];

  if(tgtrow == (inData.length - 1)){
	  tmp_data.push(inData[tgtrow]);
  } else {
	  	  if(level == "Municipality"){
		  tmp_data.push(inData[tgtrow], inData[tgtrow+1], inData[tgtrow+2]);
			} else {
			tmp_data.push(inData[tgtrow], inData[tgtrow+1]);
	  }
  };
  tgtrow = tgtrow + 2
 //Populate the output tables
  
 	var col_pos = 1

	
	  for(i = 0; i < tmp_data.length;i++){  //data rows
		 for(j = 0; j < tmp_data_keys.length; j++){
			  if(tmp_data_keys[j] == 'name'){
				  	out_count[a][0][col_pos] = "<th align='center'>" + tmp_data[i][tmp_data_keys[j]] + "</th>";
			        out_count[a][1][col_pos] = "<th align='center'>Estimate</th>";
				} else {
					if(tmp_data_keys[j] != "fips" && tmp_data_keys[j] != "name"){
						var val_est = tmp_data[i][tmp_data_keys[j]]
						out_count[a][j+2][col_pos] = "<td align='right'>" + val_est + "</td>";
					}
				} //else
		 } //j
	 col_pos = col_pos + 1;
	  } //i
  } //a
  
  } //section  == 2
 
 //the  table array for housing tables
 
 if(section == 'house02'){
  for(a = 0; a < npanels;a++) {// panels
  var tmp_data = [];
	if(level == "Municipality"){
		tmp_data = inData;
	} else {
	  if(tgtrow == (inData.length - 1)){
		  tmp_data.push(inData[tgtrow]);
	  } else {
		  tmp_data.push(inData[tgtrow], inData[tgtrow+1]);
	  };
	}
  tgtrow = tgtrow + 2
 //Populate the output tables

 	var col_pos = 1
	  for(i = 0; i < tmp_data.length;i++){  
	        var col_pos2 = col_pos + 1;
			 out_count[a][0][col_pos] = "<th align='center' colspan='2'>" + tmp_data[i][tmp_data_keys[1]] + "</th>";
			 out_count[a][1][col_pos] = "<th align='center'>Estimate</th>";
			 out_count[a][1][col_pos2] = "<th align='center'>Margin of Error</th>";
			 if(pctTab){
			 out_pct[a][0][col_pos] = "<th align='center' colspan='2'>" + tmp_data[i][tmp_data_keys[1]] + "</th>";
			 out_pct[a][1][col_pos] = "<th align='center'>Estimate</th>";
			 out_pct[a][1][col_pos2] = "<th align='center'>Margin of Error</th>";
			 } //pctTab
			 var tot_est = tmp_data[i][tmp_data_keys[2]];
			 var tot_moe = tmp_data[i][tmp_data_keys[3]];
			 for(j = 0; j < tmp_data_keys.length; j++){
				if(j % 2 == 0 && j > 0) {
					var row_pos = ((j/2) - 1) + 2;
					var val_est = tmp_data[i][tmp_data_keys[j]];
					var val_moe = tmp_data[i][tmp_data_keys[j+1]]
				if(pctTab){
					var pct_est = val_est/tot_est;
					var pct_moe = acsPctMOE(tot_est, tot_moe,pct_est,val_moe);
				}
					out_count[a][row_pos][col_pos] = "<td align='right'>" + fixNUMFMT(val_est,"num") + "</td>";
					out_count[a][row_pos][col_pos2] = "<td align='right'>" + fixNUMFMT(Math.round(val_moe),"num") + "</td>";
				if(pctTab){
					if(j == 2) {
					   out_pct[a][row_pos][col_pos] = "<td align='right'>" + fixNUMFMT(val_est,"num") + "</td>";
					   out_pct[a][row_pos][col_pos2] = "<td align='right'>" + fixNUMFMT(Math.round(val_moe),"num") + "</td>";
					} else {
					  out_pct[a][row_pos][col_pos] = "<td align='right'>" + fixNUMFMT(pct_est,"pct") + "</td>";
					  out_pct[a][row_pos][col_pos2] = "<td align='right'>" + fixNUMFMT(pct_moe,"pct") + "</td>";
					}
				} //pctTab
				} //j % 2
		 } //j
	 col_pos = col_pos + 2;
	  } //i
  } //a
  
 } //Housing Occupancy Table 
 
 if(section == 'house03'){  //Housing Type Table -- never get to this
 //create table shell
 var houseType = ["All Housing Units", "Owner-Occupied Housing Units", "Rental Housing Units"]
 var geoNames =  [...new Set(inData.map(d => d.NAME))];
 //row_topics
 var n_cols = (geoNames.length * 4) + 1;
 var n_rows = (row_topics.length * houseType.length); 
 

 var out_count = new Array[npanels];
 var out_pct = new Array[npanels];

 for(a = 0; a < npanels;a++) { //Panels
     out_count[a] = new Array[n_rows, n_cols];
	 out_pct[a] = new Array[n_rows, n_cols];
 }
 //for(b = 0; b < houseType.length; b++){ //rows

  for(a = 0; a < npanels;a++) {// panels
  var tmp_data = [];
	if(level == "Municipality"){
		tmp_data = inData;
	} else {
	  if(tgtrow == (inData.length - 1)){
		  tmp_data.push(inData[tgtrow]);
	  } else {
		  tmp_data.push(inData[tgtrow], inData[tgtrow+1]);
	  };
	}
  tgtrow = tgtrow + 2
 //Populate the output tables

 	var col_pos = 1
	  for(i = 0; i < tmp_data.length;i++){  
	        var col_pos2 = col_pos + 1;
			 out_count[a][0][col_pos] = "<th align='center' colspan='2'>" + tmp_data[i][tmp_data_keys[1]] + "</th>";
			 out_count[a][1][col_pos] = "<th align='center'>Estimate</th>";
			 out_count[a][1][col_pos2] = "<th align='center'>Margin of Error</th>";
			 if(pctTab){
			 out_pct[a][0][col_pos] = "<th align='center' colspan='2'>" + tmp_data[i][tmp_data_keys[1]] + "</th>";
			 out_pct[a][1][col_pos] = "<th align='center'>Estimate</th>";
			 out_pct[a][1][col_pos2] = "<th align='center'>Margin of Error</th>";
			 } //pctTab
			 
			 var tot_est = tmp_data[i][tmp_data_keys[2]];
			 var tot_moe = tmp_data[i][tmp_data_keys[3]];
			 for(j = 0; j < tmp_data_keys.length; j++){
				if(j % 2 == 0 && j > 0) {
					var row_pos = ((j/2) - 1) + 2;
					var val_est = tmp_data[i][tmp_data_keys[j]];
					var val_moe = tmp_data[i][tmp_data_keys[j+1]]
				if(pctTab){
					var pct_est = val_est/tot_est;
					var pct_moe = acsPctMOE(tot_est, tot_moe,pct_est,val_moe);
				}
					out_count[a][row_pos][col_pos] = "<td align='right'>" + fixNUMFMT(val_est,"num") + "</td>";
					out_count[a][row_pos][col_pos2] = "<td align='right'>" + fixNUMFMT(Math.round(val_moe),"num") + "</td>";
				if(pctTab){
					if(j == 2) {
					   out_pct[a][row_pos][col_pos] = "<td align='right'>" + fixNUMFMT(val_est,"num") + "</td>";
					   out_pct[a][row_pos][col_pos2] = "<td align='right'>" + fixNUMFMT(Math.round(val_moe),"num") + "</td>";
					} else {
					  out_pct[a][row_pos][col_pos] = "<td align='right'>" + fixNUMFMT(pct_est,"pct") + "</td>";
					  out_pct[a][row_pos][col_pos2] = "<td align='right'>" + fixNUMFMT(pct_moe,"pct") + "</td>";
					}
				} //pctTab
				} //j % 2
		 } //j
	 col_pos = col_pos + 2;
	  } //i
  } //a
  
 } //Housing Type Table 
 
  //Income Source Table
if(section == 'inc02'){
for(pnl = 0; pnl < npanels;pnl++) {// panels
  var tmp_data = [];

  if(tgtrow == (inData.length - 1)){
	  tmp_data.push(inData[tgtrow]);
  } else {
	  if(level == "Municipality") {
		  tmp_data = inData;
	  } else {
		tmp_data.push(inData[tgtrow], inData[tgtrow+1]);
	  }
  };
  tgtrow = tgtrow + 2
 //Populate the output tables
var colpos = 1

for(h = 0; h < tmp_data.length; h++){ //Number of rows in tmp_data
	  for(j = 0; j < row_tab.length; j++){  //Loop through rows 
			  if(j == 0){
			  out_count[pnl][j][colpos] = "<th colspan='4' align='center'>" + tmp_data[h][1] +"</th>";
			  }
			  if(j == 1){
			  out_count[pnl][j][0] = "<th></th>";
			  out_count[pnl][j][colpos] = "<th>Households</th>";
			  out_count[pnl][j][colpos+1] = "<th>Margin of Error</th>";
			  out_count[pnl][j][colpos+2] = "<th>Average Income</th>";
			  out_count[pnl][j][colpos+3] = "<th>Margin of Error</th>";
			  }
	          if(j > 1){
				var offset = 0;
			   for(k = row_topics[j-2].stpos; k <= row_topics[j-2].endpos; k++){ //loop through columns
				   out_count[pnl][j][colpos + offset] = "<td align='right'>" + tmp_data[h][k] + "</td>"
				   offset = offset + 1
				 }  //k
			  } //j > 1
   } //j loop
   colpos = colpos + 4
} //h
}  //pnl
} //section

//Race Ethnicity Table
 if(section == 'raceeth'){

for(pnl = 0; pnl < npanels;pnl++) {// panels
  var tmp_data = [];
  if(level == "Municipality"){
		  tmp_data = inData;
  } else {
  if(tgtrow == (inData.length - 1)){
	  tmp_data.push(inData[tgtrow]);
  } else {
	     tmp_data.push(inData[tgtrow], inData[tgtrow+1]);
  }
  };
  
  tgtrow = tgtrow + 2
 //Populate the output tables
var colpos = 1

for(h = 0; h < tmp_data.length; h++){ //Number of rows in tmp_data
	  for(j = 0; j < row_tab.length; j++){  //Loop through rows 
			  if(j == 0){
			  out_count[pnl][j][colpos] = "<th colspan='4' align='center'>" + tmp_data[h][1] +"</th>";
			  }
			  if(j == 1){
			  out_count[pnl][j][colpos] = "<th>Estimate</th>";
			  out_count[pnl][j][colpos+1] = "<th>Margin of Error</th>";
			  out_count[pnl][j][colpos+2] = "<th>Percentage</th>";
			  out_count[pnl][j][colpos+3] = "<th>Margin of Error</th>";
			  }
			   if(j > 1){
				   var offset = 0
				   for(k = row_topics[j-2].stpos; k <= row_topics[j-2].endpos; k++){ //loop through columns
					   out_count[pnl][j][colpos + offset] = "<td align='right'>" + tmp_data[h][k] + "</td>"
					   offset = offset + 1
				   }  //k
			} //j > 1
	   } //j loop
	colpos = colpos + 4;
} //h
}  //pnl
} //section

  //convert to html array, one row per panel
  //for each panel, 0 and 1 are the header, 2 to n is the table body
  var count_html = [];
  if(pctTab){
	  var pct_html = [];
  }
   for(a = 0; a < out_count.length; a++){ //panels
	   var strhtml_count = "<thead>"
	   for(b = 0; b < out_count[a].length; b++) {  //geo
		   strhtml_count = strhtml_count + "<tr>"
		   for(c = 0; c < out_count[a][b].length; c++){ //item
			     strhtml_count = strhtml_count + out_count[a][b][c]
		   } //c
		  strhtml_count = strhtml_count + "</tr>";
		if(b == 1) {strhtml_count = strhtml_count + "</thead>"	}
	   } //b
	   
	 count_html.push(strhtml_count.replaceAll('undefined',''));
	 if(pctTab){
		 	   var strhtml_pct = "<thead>"
	   for(b = 0; b < out_pct[a].length; b++) {  //geo
		   strhtml_pct = strhtml_pct + "<tr>"
		   for(c = 0; c < out_pct[a][b].length; c++){ //item
			     strhtml_pct = strhtml_pct + out_pct[a][b][c]
		   } //c
		  strhtml_pct = strhtml_pct + "</tr>";
		if(b == 1) {strhtml_pct = strhtml_pct + "</thead>"	}
	   } //b
	 pct_html.push(strhtml_pct.replaceAll('undefined',''));
	 }
   } //a

if(pctTab) {
  return([count_html, pct_html]);
} else {
  return(count_html);
}
} 
//genSubjTab

function genUnitArray(level,row_topics,NameList){
//genUnitArray created empty array with row and column header information for housing unit table

var unit_arr = new Array(30)

if(level == "Municipality") {
  var row_span = 12
  for(i = 0; i < 30; i++){
	  unit_arr[i] = new Array(13)
  }
} else {
    var row_span = 8
  for(i = 0; i < 30; i++){
	  unit_arr[i] = new Array(9)
  }
}
  //Filling rows
  for(i = 0; i < 30; i++){
	  if(i < 3){
		  unit_arr[0][i] = "<th align='center'> </th>";
	  } else if(i == 3){
		unit_arr[i][0] = "<td colspan='"+row_span +"'>All Housing Units</td>"
		for(k = 1; k < row_span + 1;k++){
			unit_arr[i][k] = "<td style='display: none;'>";
		}
	  var row_offset = 4;
	  } else if(i == 12){
		unit_arr[i][0] = "<td colspan='"+row_span +"'>Owner-Occupied Housing Units</td>"
		for(k = 1; k < row_span + 1;k++){
			unit_arr[i][k] = "<td style='display: none;'>";
		}
		var row_offset = 13;
	  } else if(i == 21) {
		unit_arr[i][0] = "<td colspan='"+row_span +"'>Rental Housing Units</td>"
		for(k = 1; k < row_span + 1;k++){
			unit_arr[i][k] = "<td style='display: none;'>";
		}
	  var row_offset = 22;
	  } else {
		 for(k = 0; k < row_topics.length;k++){
			 unit_arr[k+row_offset][0] = "<td><a href='"+row_topics[k].URL_link+"' target='_blank' title='"+row_topics[k].title+"' aria-label ='"+row_topics[k].title+"'>"+row_topics[k].title+"</a></td>";
		 }
	  }
  } //i

  //Building Header
  	if(level == "Municipality"){
		unit_arr[0][1] = "<th align='center' colspan='4'>" + NameList[0][0] + "</th>";
		unit_arr[0][5] = "<th align='center' colspan='4'>" + NameList[0][1] + "</th>";
		unit_arr[0][9] = "<th align='center' colspan='4'>" + NameList[0][2]+ "</th>";
	} else {
		unit_arr[0][1] = "<th align='center' colspan='4'>" + NameList[0] + "</th>";
		unit_arr[0][5] = "<th align='center' colspan='4'>" + NameList[1] + "</th>";
	}

	var term = "Counts"
	unit_arr[1][0] = "<th></th>"
	unit_arr[2][0] = "<th></th>"
	for(j = 1; j < row_span + 1; j++){
		if(j % 2 != 0) {
           	unit_arr[1][j] = "<th align='center' colspan='2'>"+ term + "</th>";
			unit_arr[2][j] = "<th align='center'>Estimate</th>"
			if(term  == "Counts"){
				var term = "Percent"
			} else {
			    var term = "Counts"
			}
		} else {
			unit_arr[2][j] = "<th align='center'>Margin of Error</th>"
		}
	}

return(unit_arr)
} 
//genUnitArray


function genTenTab(level,inData,row_topics,pctTab) {
//genTenTab Generates Housing Unit Tables


 var geoNames =  [...new Set(inData.map(d => d.NAME))];
 
 var unit_out = [];
 var pop_out = [];


if(level == "Municipality"){
   var npanels = 1;
} else {
   var npanels = Math.round((geoNames.length)/2); //This is the number of panels
}
   var unit_data = new Array(npanels);
   var pop_data = new Array(npanels);
   var nameArr = [];
if(level == "Municipality"){
	nameArr = [geoNames];
	unit_data[0] = genUnitArray(level, row_topics, nameArr);
	pop_data[0] =  genUnitArray(level, row_topics, nameArr);
} else {
 //Build Array of names that match the panels
	for(x = 0; x < geoNames.length; x++){
		if(x % 2 == 0){
			nameArr.push([geoNames[x], geoNames[x+1]]);
	    } else {
			if(x == geoNames.length){
				nameArr.push([geoNames[x]]);
			}
	}
	} //x
 
   for(x = 0; x < npanels; x++){
	unit_data[x] = genUnitArray(level, row_topics, nameArr[x])
	pop_data[x] = genUnitArray(level, row_topics, nameArr[x])
  } //x
} //Municipalities

 //Column Addresses
   var unitRows = [
				{vars : 'ALLHU_E', row : 4},
				{vars : 'ALLSFU_E', row : 5},
				{vars : 'ALL24_E', row : 6},
				{vars : 'ALL550_E', row : 7},
				{vars : 'ALLMOB_E', row : 8},
				{vars : 'ALLOTH_E', row : 9},
				{vars : 'ALLMEDYR_E', row : 10},
				{vars : 'ALL_PPH_E', row : 11},
				{vars : 'OOHU_E', row : 13},
				{vars : 'OOSFU_E', row : 14},
				{vars : 'OO24_E', row : 15},
				{vars : 'OO550_E', row : 16},
				{vars : 'OOMOB_E', row : 17},
				{vars : 'OOOTH_E', row : 18},
				{vars : 'OOMEDYR_E', row : 19},
				{vars : 'OO_PPH_E', row : 20},
				{vars : 'RTHU_E', row : 22},
				{vars : 'RTSFU_E', row : 23},
				{vars : 'RT24_E', row : 24},
				{vars : 'RT550_E', row : 25},
				{vars : 'RTMOB_E', row : 26},
				{vars : 'RTOTH_E', row : 27},
				{vars : 'RTMEDYR_E', row : 28},
				{vars : 'RT_PPH_E', row : 29}
				]


for(a = 0; a < npanels; a++) {
if(npanels == 1) {
       var selData = inData;
} else {
       var selData = inData.filter(d => nameArr[a].includes(d.NAME));
}

for(b = 0; b < unitRows.length; b++){
	    var filtvar_u = selData.filter(d => unitRows[b].vars.includes(d.VAR));
	    var tgt_row = unitRows[b].row;

for(c = 0; c < filtvar_u.length; c++){
	var unit_data_sel = [];
    var pop_data_sel = [];
	unit_data_sel.push(filtvar_u[c].UNIT_EST, filtvar_u[c].UNIT_MOE, filtvar_u[c].UNIT_PCT_EST, filtvar_u[c].UNIT_PCT_MOE);
	pop_data_sel.push(filtvar_u[c].POP_EST, filtvar_u[c].POP_MOE, filtvar_u[c].POP_PCT_EST, filtvar_u[c].POP_PCT_MOE);

if(level == "Municipality"){
switch(c){
	case 0 :
		unit_data[a][tgt_row][1] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[0]),"num") + "</td>";
		unit_data[a][tgt_row][2] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[1]),"num") + "</td>";
		unit_data[a][tgt_row][3] = "<td align='right'>" + fixNUMFMT(unit_data_sel[2],"pct") + "</td>";
		unit_data[a][tgt_row][4] = "<td align='right'>" + fixNUMFMT(unit_data_sel[3],"pct") + "</td>";

		pop_data[a][tgt_row][1] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[0]),"num") + "</td>";
		pop_data[a][tgt_row][2] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[1]),"num") + "</td>";
		pop_data[a][tgt_row][3] = "<td align='right'>" + fixNUMFMT(pop_data_sel[2],"pct") + "</td>";
		pop_data[a][tgt_row][4] = "<td align='right'>" + fixNUMFMT(pop_data_sel[3],"pct") + "</td>";

		if(['ALLMEDYR_E', 'OOMEDYR_E', 'RTMEDYR_E'].includes(unitRows[b].vars)){
			unit_data[a][tgt_row][1] = "<td align='right'>" + unit_data_sel[0] + "</td>";
			unit_data[a][tgt_row][2] = "<td align='right'>" + unit_data_sel[1] + "</td>";
			unit_data[a][tgt_row][3] = "<td align='right'></td>";
			unit_data[a][tgt_row][4] = "<td align='right'></td>";
		
			pop_data[a][tgt_row][1] = "<td align='right'></td>";
			pop_data[a][tgt_row][2] = "<td align='right'></td>";
			pop_data[a][tgt_row][3] = "<td align='right'></td>";
			pop_data[a][tgt_row][4] = "<td align='right'></td>";
		}
		if(['ALL_PPH_E', 'OO_PPH_E', 'RT_PPH_E'].includes(unitRows[b].vars)){
			unit_data[a][tgt_row][1] = "<td align='right'></td>";
			unit_data[a][tgt_row][2] = "<td align='right'></td>";
			unit_data[a][tgt_row][3] = "<td align='right'></td>";
			unit_data[a][tgt_row][4] = "<td align='right'></td>";
		
			pop_data[a][tgt_row][1] = "<td align='right'>" + fixNUMFMT(pop_data_sel[0].toFixed(2),"dec") + "</td>";
			pop_data[a][tgt_row][2] = "<td align='right'>" + fixNUMFMT(pop_data_sel[1].toFixed(2),"dec") + "</td>";
			pop_data[a][tgt_row][3] = "<td align='right'></td>";
			pop_data[a][tgt_row][4] = "<td align='right'></td>";
		}
	break;
	case 1:
				unit_data[a][tgt_row][5] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[0]),"num") + "</td>";
				unit_data[a][tgt_row][6] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[1]),"num") + "</td>";
				unit_data[a][tgt_row][7] = "<td align='right'>" + fixNUMFMT(unit_data_sel[2],"pct") + "</td>";
				unit_data[a][tgt_row][8] = "<td align='right'>" + fixNUMFMT(unit_data_sel[3],"pct") + "</td>";

				pop_data[a][tgt_row][5] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[0]),"num") + "</td>";
				pop_data[a][tgt_row][6] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[1]),"num") + "</td>";
				pop_data[a][tgt_row][7] = "<td align='right'>" + fixNUMFMT(pop_data_sel[2],"pct") + "</td>";
				pop_data[a][tgt_row][8] = "<td align='right'>" + fixNUMFMT(pop_data_sel[3],"pct") + "</td>";
				
				if(['ALLMEDYR_E', 'OOMEDYR_E', 'RTMEDYR_E'].includes(unitRows[b].vars)){
					unit_data[a][tgt_row][5] = "<td align='right'>" + unit_data_sel[0] + "</td>";
					unit_data[a][tgt_row][6] = "<td align='right'>" + unit_data_sel[1] + "</td>";
					unit_data[a][tgt_row][7] = "<td align='right'></td>";
					unit_data[a][tgt_row][8] = "<td align='right'></td>";
				
					pop_data[a][tgt_row][5] = "<td align='right'></td>";
					pop_data[a][tgt_row][6] = "<td align='right'></td>";
					pop_data[a][tgt_row][7] = "<td align='right'></td>";
					pop_data[a][tgt_row][8] = "<td align='right'></td>";
				}
				if(['ALL_PPH_E', 'OO_PPH_E', 'RT_PPH_E'].includes(unitRows[b].vars)){
					unit_data[a][tgt_row][5] = "<td align='right'></td>";
					unit_data[a][tgt_row][6] = "<td align='right'></td>";
					unit_data[a][tgt_row][7] = "<td align='right'></td>";
					unit_data[a][tgt_row][8] = "<td align='right'></td>";
				
					pop_data[a][tgt_row][5] = "<td align='right'>" + fixNUMFMT(pop_data_sel[0].toFixed(2),"dec") + "</td>";
					pop_data[a][tgt_row][6] = "<td align='right'>" + fixNUMFMT(pop_data_sel[1].toFixed(2),"dec") + "</td>";
					pop_data[a][tgt_row][7] = "<td align='right'></td>";
					pop_data[a][tgt_row][8] = "<td align='right'></td>";
				}
	break;
	case 2 :
			unit_data[a][tgt_row][9] = "<td align='right'>" +  fixNUMFMT(Math.round(unit_data_sel[0]),"num") + "</td>";
			unit_data[a][tgt_row][10] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[1]),"num") + "</td>";
			unit_data[a][tgt_row][11] = "<td align='right'>" + fixNUMFMT(unit_data_sel[2],"pct") + "</td>";
			unit_data[a][tgt_row][12] = "<td align='right'>" + fixNUMFMT(unit_data_sel[3],"pct") + "</td>";

			pop_data[a][tgt_row][9] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[0]),"num") + "</td>";
			pop_data[a][tgt_row][10] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[1]),"num") + "</td>";
			pop_data[a][tgt_row][11] = "<td align='right'>" + fixNUMFMT(pop_data_sel[2],"pct") + "</td>";
			pop_data[a][tgt_row][12] = "<td align='right'>" + fixNUMFMT(pop_data_sel[3],"pct") + "</td>";
			
			if(['ALLMEDYR_E', 'OOMEDYR_E', 'RTMEDYR_E'].includes(unitRows[b].vars)){
				unit_data[a][tgt_row][9] = "<td align='right'>" + unit_data_sel[0] + "</td>";
				unit_data[a][tgt_row][10] = "<td align='right'>" + unit_data_sel[1] + "</td>";
				unit_data[a][tgt_row][11] = "<td align='right'></td>";
				unit_data[a][tgt_row][12] = "<td align='right'></td>";
			
				pop_data[a][tgt_row][9] = "<td align='right'></td>";
				pop_data[a][tgt_row][10] = "<td align='right'></td>";
				pop_data[a][tgt_row][11] = "<td align='right'></td>";
				pop_data[a][tgt_row][12] = "<td align='right'></td>";
			}
			if(['ALL_PPH_E', 'OO_PPH_E', 'RT_PPH_E'].includes(unitRows[b].vars)){
				unit_data[a][tgt_row][9] = "<td align='right'></td>";
				unit_data[a][tgt_row][10] = "<td align='right'></td>";
				unit_data[a][tgt_row][11] = "<td align='right'></td>";
				unit_data[a][tgt_row][12] = "<td align='right'></td>";
			
				pop_data[a][tgt_row][9] = "<td align='right'>" + fixNUMFMT(pop_data_sel[0].toFixed(2),"dec") + "</td>";
				pop_data[a][tgt_row][10] = "<td align='right'>" + fixNUMFMT(pop_data_sel[1].toFixed(2),"dec") + "</td>";
				pop_data[a][tgt_row][11] = "<td align='right'></td>";
				pop_data[a][tgt_row][12] = "<td align='right'></td>";
			}
	break;
	} //switch 
	} else {
	if(c == 0){
		unit_data[a][tgt_row][1] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[0]),"num") + "</td>";
		unit_data[a][tgt_row][2] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[1]),"num") + "</td>";
		unit_data[a][tgt_row][3] = "<td align='right'>" + fixNUMFMT(unit_data_sel[2],"pct") + "</td>";
		unit_data[a][tgt_row][4] = "<td align='right'>" + fixNUMFMT(unit_data_sel[3],"pct") + "</td>";

		pop_data[a][tgt_row][1] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[0]),"num") + "</td>";
		pop_data[a][tgt_row][2] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[1]),"num") + "</td>";
		pop_data[a][tgt_row][3] = "<td align='right'>" + fixNUMFMT(pop_data_sel[2],"pct") + "</td>";
		pop_data[a][tgt_row][4] = "<td align='right'>" + fixNUMFMT(pop_data_sel[3],"pct") + "</td>";
		
		if(['ALLMEDYR_E', 'OOMEDYR_E', 'RTMEDYR_E'].includes(unitRows[b].vars)){
			unit_data[a][tgt_row][1] = "<td align='right'>" + unit_data_sel[0] + "</td>";
			unit_data[a][tgt_row][2] = "<td align='right'>" + unit_data_sel[1] + "</td>";
			unit_data[a][tgt_row][3] = "<td align='right'></td>";
			unit_data[a][tgt_row][4] = "<td align='right'></td>";
		
			pop_data[a][tgt_row][1] = "<td align='right'></td>";
			pop_data[a][tgt_row][2] = "<td align='right'></td>";
			pop_data[a][tgt_row][3] = "<td align='right'></td>";
			pop_data[a][tgt_row][4] = "<td align='right'></td>";
		}
		if(['ALL_PPH_E', 'OO_PPH_E', 'RT_PPH_E'].includes(unitRows[b].vars)){
			unit_data[a][tgt_row][1] = "<td align='right'></td>";
			unit_data[a][tgt_row][2] = "<td align='right'></td>";
			unit_data[a][tgt_row][3] = "<td align='right'></td>";
			unit_data[a][tgt_row][4] = "<td align='right'></td>";
		
			pop_data[a][tgt_row][1] = "<td align='right'>" + fixNUMFMT(pop_data_sel[0].toFixed(2),"dec") + "</td>";
			pop_data[a][tgt_row][2] = "<td align='right'>" + fixNUMFMT(pop_data_sel[1].toFixed(2),"dec") + "</td>";
			pop_data[a][tgt_row][3] = "<td align='right'></td>";
			pop_data[a][tgt_row][4] = "<td align='right'></td>";
				}
	} else {
		unit_data[a][tgt_row][5] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[0]),"num") + "</td>";
		unit_data[a][tgt_row][6] = "<td align='right'>" + fixNUMFMT(Math.round(unit_data_sel[1]),"num") + "</td>";
		unit_data[a][tgt_row][7] = "<td align='right'>" + fixNUMFMT(unit_data_sel[2],"pct") + "</td>";
		unit_data[a][tgt_row][8] = "<td align='right'>" + fixNUMFMT(unit_data_sel[3],"pct") + "</td>";

		pop_data[a][tgt_row][5] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[0]),"num") + "</td>";
		pop_data[a][tgt_row][6] = "<td align='right'>" + fixNUMFMT(Math.round(pop_data_sel[1]),"num") + "</td>";
		pop_data[a][tgt_row][7] = "<td align='right'>" + fixNUMFMT(pop_data_sel[2],"pct") + "</td>";
		pop_data[a][tgt_row][8] = "<td align='right'>" + fixNUMFMT(pop_data_sel[3],"pct") + "</td>";
		
		if(['ALLMEDYR_E', 'OOMEDYR_E', 'RTMEDYR_E'].includes(unitRows[b].vars)){
			unit_data[a][tgt_row][5] = "<td align='right'>" + unit_data_sel[0] + "</td>";
			unit_data[a][tgt_row][6] = "<td align='right'>" + unit_data_sel[1] + "</td>";
			unit_data[a][tgt_row][7] = "<td align='right'></td>";
			unit_data[a][tgt_row][8] = "<td align='right'></td>";
		
			pop_data[a][tgt_row][5] = "<td align='right'></td>";
			pop_data[a][tgt_row][6] = "<td align='right'></td>";
			pop_data[a][tgt_row][7] = "<td align='right'></td>";
			pop_data[a][tgt_row][8] = "<td align='right'></td>";
		}
		if(['ALL_PPH_E', 'OO_PPH_E', 'RT_PPH_E'].includes(unitRows[b].vars)){
			unit_data[a][tgt_row][5] = "<td align='right'></td>";
			unit_data[a][tgt_row][6] = "<td align='right'></td>";
			unit_data[a][tgt_row][7] = "<td align='right'></td>";
			unit_data[a][tgt_row][8] = "<td align='right'></td>";
		
			pop_data[a][tgt_row][5] = "<td align='right'>" + fixNUMFMT(pop_data_sel[0].toFixed(2),"dec") + "</td>";
			pop_data[a][tgt_row][6] = "<td align='right'>" + fixNUMFMT(pop_data_sel[1].toFixed(2),"dec") + "</td>";
			pop_data[a][tgt_row][7] = "<td align='right'></td>";
			pop_data[a][tgt_row][8] = "<td align='right'></td>";
				}
	} //c value
	} //Municipality selection
	} //c loop

} //b
 } //a

//convert to html array, one row per panel
//for each panel, 0 and 1 are the header, 2 to n is the table body
  var unit_html = [];
  var pop_html = [];

   for(a = 0; a < npanels; a++){ //panels
	   var strhtml_count = "<thead>"
	   for(b = 0; b < unit_data[a].length; b++) {  //geo
		   strhtml_count = strhtml_count + "<tr>"
		   for(c = 0; c < unit_data[a][b].length; c++){ //item
			     strhtml_count = strhtml_count + unit_data[a][b][c]
		   } //c
		  strhtml_count = strhtml_count + "</tr>";
		if(b ==2) {strhtml_count = strhtml_count + "</thead>"	}
	   } //b
	   
	 unit_html.push(strhtml_count.replaceAll('undefined',''));
   } //a
 
   
 for(a = 0; a < npanels; a++){ //panels
	   var strhtml_pop = "<thead>"
	   for(b = 0; b < pop_data[a].length; b++) {  //geo
		   strhtml_pop = strhtml_pop + "<tr>"
		   for(c = 0; c < pop_data[a][b].length; c++){ //item
			     strhtml_pop = strhtml_pop + pop_data[a][b][c]
		   } //c
		  strhtml_pop = strhtml_pop + "</tr>";
		if(b == 2) {strhtml_pop = strhtml_pop + "</thead>"	}
	   } //b
	   
	 pop_html.push(strhtml_pop.replaceAll('undefined',''));
   } //a

return([unit_html, pop_html]);
} 
// genTenTab


function HHIncTab(level,MedData, PctData,section, row_topics,pctTab) {
//HHIncTab Generates Household Income table


//Setup panels
var nRows = row_topics.length + 2;
//The idea is to create a 3D array:  array[panel][row_topic][6 column table string (2 cols for index and row_topic and 2 * 2 geography))]
	var row_tab = [];
	for(i = 0 ; i < nRows; i++){
		if( i < 2){
			row_tab.push("<th></th>");
		} else {
		 row_tab.push("<td><a href='" + row_topics[i-2].URL_link + "' target='_blank' title='"+ row_topics[i-2].title + "' aria-label ='"+ row_topics[i-2].title + "'>" + row_topics[i-2].title + "</a></td>");
		}
	}
	
 //Creating the output objects
 var ntopics = row_tab.length ;
 var nCols = 13;

if(level == "Municipality") {
   var npanels = 1;
   var Nfips = [...new Set(PctData.map(d => d.FIPS))];
   var selfips = [Nfips];
 } else {
   var Nfips = [...new Set(PctData.map(d => d.FIPS))];
   var npanels = Math.round((Nfips.length)/2); //This is the number of panels
   
   var selfips = [];  //This is the contents of each panel
   for(i = 0; i < Nfips.length; i++){
	 var fipsrec = []
	 if(i % 2 == 0){
			 fipsrec.push(Nfips[i], Nfips[i+1]);
			 selfips.push(fipsrec)
		  } else {
			  if(i == Nfips.length) {
			fipsrec.push(Nfips[i])
			selfips.push(fipsrec)
			  }
		  }
    } //i
 }
 
 //Building Raw tables
var count_tab = new Array(npanels);
var pct_tab = new Array(npanels);

for(a = 0; a < npanels;a++) {// panels  Need to make a 3d array, panels , 10 rows, 5 or 7 cols
   count_tab[a] = new Array(row_tab.length);
   pct_tab[a] = new Array(row_tab.length);
  for(x  = 0; x < row_tab.length; x++){
	  if(level == "Municipality") {
		count_tab[a][x] = new Array(7)
		pct_tab[a][x] = new Array(7)
	  } else {
	  count_tab[a][x] = new Array(5)
	  pct_tab[a][x] = new Array(5)
	  }
  } //x
} //a  

//Populate Tables
for(a = 0; a < npanels;a++) {
  	var selmedian = MedData.filter(d => selfips[a].includes(d.FIPS))
	var selpct = PctData.filter(d => selfips[a].includes(d.FIPS));


	for(i = 0; i < row_tab.length; i++){
		count_tab[a][i][0] = row_tab[i];
		pct_tab[a][i][0] = row_tab[i];
	} //i
	

	var tgtcol = 1;
	for(b = 0; b < selmedian.length; b++){
	 if(typeof selmedian[b].NAME !== undefined){
		count_tab[a][0][tgtcol] = "<th align='center' colspan='2'>" + selmedian[b].NAME + "</th>";
		count_tab[a][1][tgtcol] = "<th align='center'>Estimate</th>"
		count_tab[a][1][tgtcol+1] = "<th align='center'>Margin of Error</th>"
        count_tab[a][2][tgtcol] = "<td align='right'>"+ fixNUMFMT(selmedian[b].OO_EST,"cur") + "</td>"
        count_tab[a][2][tgtcol+1] = "<td align='right'>"+ fixNUMFMT(selmedian[b].OO_MOE.toFixed(2),"cur") + "</td>"
		count_tab[a][3][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].TOTAL_OO_E,"num") + "</td>"
		count_tab[a][3][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].TOTAL_OO_M.toFixed(2),"num") + "</td>"
		count_tab[a][4][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].PCTGE30_OO_E,"num") + "</td>"
		count_tab[a][4][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].PCTGE30_OO_M.toFixed(2),"num") + "</td>"
		count_tab[a][5][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].PCT3039_OO_E,"num") + "</td>"
		count_tab[a][5][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].PCT3039_OO_M.toFixed(2),"num") + "</td>"
		count_tab[a][6][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].PCT4049_OO_E,"num") + "</td>"
		count_tab[a][6][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].PCT4049_OO_M.toFixed(2),"num") + "</td>"
		count_tab[a][7][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].PCTGE50_OO_E,"num") + "</td>"
		count_tab[a][7][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].PCTGE50_OO_M.toFixed(2),"num") + "</td>"
        count_tab[a][8][tgtcol] = "<td align='right'>"+ fixNUMFMT(selmedian[b].RT_EST,"cur") + "</td>"
        count_tab[a][8][tgtcol+1] = "<td align='right'>"+ fixNUMFMT(selmedian[b].RT_MOE.toFixed(2),"cur") + "</td>"
		count_tab[a][9][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].TOTAL_RT_E,"num") + "</td>"
		count_tab[a][9][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].TOTAL_RT_M.toFixed(2),"num") + "</td>"
		count_tab[a][10][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].PCTGE30_RT_E,"num") + "</td>"
		count_tab[a][10][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].PCTGE30_RT_M.toFixed(2),"num") + "</td>"
		count_tab[a][11][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].PCT3039_RT_E,"num") + "</td>"
		count_tab[a][11][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].PCT3039_RT_M.toFixed(2),"num") + "</td>"
		count_tab[a][12][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].PCT4049_RT_E,"num") + "</td>"
		count_tab[a][12][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].PCT4049_RT_M.toFixed(2),"num") + "</td>"
		count_tab[a][13][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].PCTGE50_RT_E,"num") + "</td>"
		count_tab[a][13][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].PCTGE50_RT_M.toFixed(2),"num") + "</td>"
		
		pct_tab[a][0][tgtcol] = "<th align='center' colspan='2'>" + selmedian[b].NAME + "</th>";
		pct_tab[a][1][tgtcol] = "<th align='center'>Estimate</th>"
		pct_tab[a][1][tgtcol+1] = "<th align='center'>Margin of Error</th>"
        pct_tab[a][2][tgtcol] = "<td align='right'>"+ fixNUMFMT(selmedian[b].OO_EST,"cur") + "</td>"
        pct_tab[a][2][tgtcol+1] = "<td align='right'>"+ fixNUMFMT(selmedian[b].OO_MOE.toFixed(2),"cur") + "</td>"
		pct_tab[a][3][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].TOTAL_OO_E,"num") + "</td>"
		pct_tab[a][3][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].TOTAL_OO_M.toFixed(2),"num") + "</td>"
		pct_tab[a][4][tgtcol] = "<td align='right'>"+ fixNUMFMT((selpct[b].PCTGE30_OO_E/selpct[b].TOTAL_OO_E),"pct") + "</td>"
		pct_tab[a][4][tgtcol+1] = "<td align='right'>" + fixNUMFMT(acsPctMOE(selpct[b].TOTAL_OO_E,selpct[b].TOTAL_OO_M,(selpct[b].PCTGE30_OO_E/selpct[b].TOTAL_OO_E), selpct[b].PCTGE30_OO_M),"pct") + "</td>"
		pct_tab[a][5][tgtcol] = "<td align='right'>"+ fixNUMFMT((selpct[b].PCT3039_OO_E/selpct[b].TOTAL_OO_E),"pct") + "</td>"
		pct_tab[a][5][tgtcol+1] = "<td align='right'>" + fixNUMFMT(acsPctMOE(selpct[b].TOTAL_OO_E,selpct[b].TOTAL_OO_M,(selpct[b].PCT3039_OO_E/selpct[b].TOTAL_OO_E), selpct[b].PCT3039_OO_M),"pct") + "</td>"
		pct_tab[a][6][tgtcol] = "<td align='right'>"+ fixNUMFMT((selpct[b].PCT4049_OO_E/selpct[b].TOTAL_OO_E),"pct") + "</td>"
		pct_tab[a][6][tgtcol+1] = "<td align='right'>" + fixNUMFMT(acsPctMOE(selpct[b].TOTAL_OO_E,selpct[b].TOTAL_OO_M,(selpct[b].PCT4049_OO_E/selpct[b].TOTAL_OO_E), selpct[b].PCT4049_OO_M),"pct") + "</td>"
		pct_tab[a][7][tgtcol] = "<td align='right'>"+ fixNUMFMT((selpct[b].PCTGE50_OO_E/selpct[b].TOTAL_OO_E),"pct") + "</td>"
		pct_tab[a][7][tgtcol+1] = "<td align='right'>" + fixNUMFMT(acsPctMOE(selpct[b].TOTAL_OO_E,selpct[b].TOTAL_OO_M,(selpct[b].PCTGE50_OO_E/selpct[b].TOTAL_OO_E), selpct[b].PCTGE50_OO_M),"pct") + "</td>"
        pct_tab[a][8][tgtcol] = "<td align='right'>"+ fixNUMFMT(selmedian[b].RT_EST,"cur") + "</td>"
        pct_tab[a][8][tgtcol+1] = "<td align='right'>"+ fixNUMFMT(selmedian[b].RT_MOE.toFixed(2),"cur") + "</td>"
		pct_tab[a][9][tgtcol] = "<td align='right'>"+ fixNUMFMT(selpct[b].TOTAL_RT_E,"num") + "</td>"
		pct_tab[a][9][tgtcol+1] = "<td align='right'>" + fixNUMFMT(selpct[b].TOTAL_RT_M.toFixed(2),"num") + "</td>"
		pct_tab[a][10][tgtcol] = "<td align='right'>"+ fixNUMFMT((selpct[b].PCTGE30_RT_E/selpct[b].TOTAL_RT_E),"pct") + "</td>"
		pct_tab[a][10][tgtcol+1] = "<td align='right'>" + fixNUMFMT(acsPctMOE(selpct[b].TOTAL_RT_E,selpct[b].TOTAL_RT_M,(selpct[b].PCTGE30_RT_E/selpct[b].TOTAL_RT_E), selpct[b].PCTGE30_RT_M),"pct") + "</td>"
		pct_tab[a][11][tgtcol] = "<td align='right'>"+ fixNUMFMT((selpct[b].PCT3039_RT_E/selpct[b].TOTAL_RT_E),"pct") + "</td>"
		pct_tab[a][11][tgtcol+1] = "<td align='right'>" + fixNUMFMT(acsPctMOE(selpct[b].TOTAL_RT_E,selpct[b].TOTAL_RT_M,(selpct[b].PCT3039_RT_E/selpct[b].TOTAL_RT_E), selpct[b].PCT3039_RT_M),"pct") + "</td>"
		pct_tab[a][12][tgtcol] = "<td align='right'>"+ fixNUMFMT((selpct[b].PCT4049_RT_E/selpct[b].TOTAL_RT_E),"pct") + "</td>"
		pct_tab[a][12][tgtcol+1] = "<td align='right'>" + fixNUMFMT(acsPctMOE(selpct[b].TOTAL_RT_E,selpct[b].TOTAL_RT_M,(selpct[b].PCT4049_RT_E/selpct[b].TOTAL_RT_E), selpct[b].PCT4049_RT_M),"pct") + "</td>"
		pct_tab[a][13][tgtcol] = "<td align='right'>"+ fixNUMFMT((selpct[b].PCTGE50_RT_E/selpct[b].TOTAL_RT_E),"pct") + "</td>"
		pct_tab[a][13][tgtcol+1] = "<td align='right'>" + fixNUMFMT(acsPctMOE(selpct[b].TOTAL_RT_E,selpct[b].TOTAL_RT_M,(selpct[b].PCTGE50_RT_E/selpct[b].TOTAL_RT_E), selpct[b].PCTGE50_RT_M),"pct") + "</td>"
		tgtcol = tgtcol + 2;
	 } //undefined
	} //b
} //a

  //convert to html array, one row per panel
  //for each panel, 0 and 1 are the header, 2 to n is the table body
  var count_html = [];
  var pct_html = [];

   for(a = 0; a < npanels; a++){ //panels
	   var strhtml_count = "<thead>"
	   for(b = 0; b < count_tab[a].length; b++) {  //geo
		   strhtml_count = strhtml_count + "<tr>"
		   for(c = 0; c < count_tab[a][b].length; c++){ //item
			     strhtml_count = strhtml_count + count_tab[a][b][c]
		   } //c
		  strhtml_count = strhtml_count + "</tr>";
		if(b ==1) {strhtml_count = strhtml_count + "</thead>"	}
	   } //b
	   
	 count_html.push(strhtml_count.replaceAll('undefined','')); 
   } //a
 
 for(a = 0; a < npanels; a++){ //panels
	   var strhtml_pop = "<thead>"
	   for(b = 0; b < pct_tab[a].length; b++) {  //geo
		   strhtml_pop = strhtml_pop + "<tr>"
		   for(c = 0; c < pct_tab[a][b].length; c++){ //item
			     strhtml_pop = strhtml_pop + pct_tab[a][b][c]
		   } //c
		  strhtml_pop = strhtml_pop + "</tr>";
		if(b == 1) {strhtml_pop = strhtml_pop + "</thead>"	}
	   } //b
	   
	 pct_html.push(strhtml_pop.replaceAll('undefined',''));
   } //a
   
   
return([count_html, pct_html]);
} 
// HHIncTab


function DTtab(TabDiv,tab_data,panelN,row_labels,footer,footArr,tabName, fileName, tabTitle){
//DTtab produces generic DT tables 

if(tabName == "houstype") {
	var pgLength = 29;
} else {
	var pgLength = row_labels.length + 2;
}

var labels = [];
row_labels.forEach(x =>{
	 labels.push(x.title)
});

var tab_data2 = tab_data[panelN] + footer;

var TabDivOut = document.getElementById(TabDiv);
//Clear div
TabDivOut.innerHTML = "";

var tabObj = "#" + tabName;
$(TabDivOut).append("<table id= '"+ tabName + "' class='DTTable' width='90%'></table>");
$(tabObj).append(tab_data2); //this has to be a html table

$(tabObj).DataTable({
       "pageLength" : pgLength,
	   "ordering": false,
		"fixedHeader":   true,
 dom: 'Bfrtip',
       buttons: [
		{ text : 'Word',    action: function ( e, dt, node, config ) { genplexTab(tab_data,labels,footArr,fileName,'word',tabTitle)} },
        { text : 'Excel',  action: function ( e, dt, node, config ) { genplexTab(tab_data,labels,footArr,fileName,'xlsx',tabTitle)} },
        { text : 'CSV',    action: function ( e, dt, node, config ) { genplexTab(tab_data,labels,footArr,fileName,'csv',tabTitle)} } //,
 //       { text : 'PDF',    action: function ( e, dt, node, config ) { genplexTab(tab_data,labels,footArr,fileName,'pdf',tabTitle)} }
		]  //buttons
 } );

 } 
// DTtab
 

function stripHTML(inData){
//stripHTML Removes HTML codes from HTML table array Outputs

	var tArrt = []
	
//Stripping out html tags and filling in empty fields

    inData.forEach(x => {
	 y = x.replaceAll("<td align='right'></td>","<td align='right'>empty</td>")
     y2 = y.replace(/(<([^>]+)>)/gi, "|")
	 var x2 = y2.split("|")
	 tArrt.push(x2);
	});


//remove empty fields
var tArr = [];
for(i = 0; i < tArrt.length; i++){
	 var tmpar = "";
	 for(j = 0; j < tArrt[i].length; j++) {
		 if(tArrt[i][j].length !== 0){
			 tmpar = tmpar + tArrt[i][j] + "|";
		 }
	 }
    tmpar = tmpar.substr(0,(tmpar.length - 1))
	tArr.push(tmpar.split("|"))
}

for(x = 0; x < tArr.length; x++){
	for(y = 0; y < tArr[x].length; y++){
		if(tArr[x][y] == "empty"){
			tArr[x][y] = "";
		}
	}
}

return(tArr);
} 
// stripHTML


function checkHash(val,arr){
	//checkHash HTMLtoArray support function for table PDF Production
	var outval = 0;
	for(i = 0; i < arr.length; i++){
		if(val == arr[i].label) {
		var outval = arr[i].outrow;
		}
	}
 return(outval)
} 
// checkHash



function HTMLtoArray(inData,row_labels,level,tabName) {
//HTMLtoArray converts HTML strings to an array  From https://stackoverflow.com/questions/9579721/convert-html-table-to-array-in-javascript

var tabinfo = [{tabName : 'Summary Statistics Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']},
			{tabName : 'Population Growth Table', ncols : 1, hdrCols : ['Estimate']},
			{tabName : 'Income Sources Table', ncols : 4, hdrCols : ['Households', 'Margin of Error','Average Income','Margin of Error']},
			{tabName : 'Race and Ethnicity Table', ncols : 4, hdrCols : ['Estimate', 'Margin of Error', 'Percent','Margin of Error']},
			{tabName : 'Housing Occupancy and Vacancy Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']},
			{tabName : 'Housing Type Table', ncols : 4, hdrCols : ['Estimate', 'Margin of Error', 'Percent', 'Margin of Error']},
			{tabName : 'Housing Cost and Affordability Table', ncols : 2, hdrCols : ['Estimate', 'Margin of Error']}
		  ];
		  
//extracting the number of 
var tabInfo = tabinfo.filter(d => tabName.includes(d.tabName));


var tblArray = stripHTML(inData);

var scantab = [];
scantab[0] = tblArray[0].slice()
//checking the length of rows; if all rows are equal than there are even numbers of elements
if(tblArray.length > 1){
	lenStart = tblArray[0].length;
	lenEnd = tblArray[tblArray.length - 1].length
	if(lenStart != lenEnd){
		scantab[1] = tblArray[tblArray.length - 1].slice()
	}
}

//building output array

//number of geographies
var nameArr = [];
switch(tabInfo[0].tabName){
case 'Income Sources Table' :
for(a = 0; a < tblArray.length; a++){
	   if((tblArray[a][0] != "Households") && (tblArray[a][0] != "Margin of Error")){
		   nameArr.push({"Name" : tblArray[a][0], "dataRow" : a});
	   }
	   if((tblArray[a][1] != "Households") && (tblArray[a][1] != "Margin of Error")) {
		   nameArr.push({"Name" : tblArray[a][1], "dataRow" : a});
	   }
	   if((tblArray[a][2] != "Households") && (tblArray[a][2] != "Margin of Error")) {
		   nameArr.push({"Name" : tblArray[a][2], "dataRow" : a});
	   }
}
break;
case 'Housing Type Table' :
	for(a = 0; a < tblArray.length; a++){
	   if((tblArray[a][1] != "Counts") && (tblArray[a][1] != "Percent") && (tblArray[a][1] != "Estimate")) {
		   nameArr.push({"Name" : tblArray[a][1], "dataRow" : a});
	   }
	   if((tblArray[a][3] != "Counts") && (tblArray[a][3] != "Percent") && (tblArray[a][3] != "Estimate")) {
		   nameArr.push({"Name" : tblArray[a][3], "dataRow" : a});
	   }
	   if((tblArray[a][4] != "Counts") && (tblArray[a][4] != "Percent") && (tblArray[a][4] != "Estimate")) {
		   nameArr.push({"Name" : tblArray[a][4], "dataRow" : a});
	   }
}
break;
default :
	for(a = 0; a < tblArray.length; a++){
	   if((tblArray[a][0] != "Estimate") && (tblArray[a][0] != "Margin of Error")){
		   nameArr.push({"Name" : tblArray[a][0], "dataRow" : a});
	   }
	   if((tblArray[a][1] != "Estimate") && (tblArray[a][1] != "Margin of Error")) {
		   nameArr.push({"Name" : tblArray[a][1], "dataRow" : a});
	   }
	   if((tblArray[a][2] != "Estimate") && (tblArray[a][2] != "Margin of Error")) {
		   nameArr.push({"Name" : tblArray[a][2], "dataRow" : a});
	   }
}
break;
}

//figuring out level
if(inData.length > 1) {
	var level = "Region"
} else {
	if(nameArr[0].Name.includes("County")) {
	  var level = "County"
	} else {
	  var level = "Municipality"
	}
}

if(tabInfo[0].tabName == "Population Growth Table"){
  var nameArrx = nameArr.filter(d => d.Name != '1990');
  nameArr = nameArrx;
}


//Restructuring Creating the number of pages
if(tabInfo[0].tabName == 'Population Growth Table'){
	var npages = Math.ceil((tabInfo[0].ncols * nameArr.length)/7);
	var nrows = row_labels.length + 2;
	var ncols = 8;
	var geospanel = 7;
} else {
	if(tabInfo[0].ncols == 2){
	var npages = Math.ceil((tabInfo[0].ncols * nameArr.length)/8);
	var ncols = 9;
	var geospanel = 4;
	}
	if(tabInfo[0].ncols == 4){
	var npages = Math.ceil((tabInfo[0].ncols * nameArr.length)/12);
	var ncols = 13;
	var geospanel = 3
	}
	if(tabInfo[0].tabName == 'Housing Type Table'){
		var nrows = ((row_labels.length + 1) * 3) + 3;
		var ncols = 13;
		var geospanel = 3;
	} else {
		var nrows = row_labels.length + 2;
	}
}

const outArr = Array(npages).fill('').map(() => new Array(nrows).fill('').map(() => new Array(ncols).fill('')))

// augumenting nameArr -- nameArr2 will be recreated for the Housing Type Table

var nameArr2 = [];
var pgval = 0;
var outStart = 1;
var outEnd = outStart + (tabInfo[0].ncols - 1)

for(x = 0; x < nameArr.length; x++){
	   //Page Updates
   if(x > 0 && x % geospanel == 0) {
	   pgval++
	   var outStart = 1
	   var outEnd = outStart + (tabInfo[0].ncols - 1)
   }
	
		if((scantab.length == 2) && (x == (nameArr.length - 1))) { //The last one in the series
			   for(y = 0; y < row_labels.length;y++){
			   //Creating instart and inend values
					 for(c = 0; c < scantab[1].length; c++){
						if(scantab[1][c] == row_labels[y]){
							inStart = c + 1;
							inEnd = inStart + (tabInfo[0].ncols - 1);
						}
					 } //c
				nameArr2.push({"name" : nameArr[x].Name, "dataName" : row_labels[y], "dataRow" : nameArr[x].dataRow,
					"inStart" : inStart, "inEnd" : inEnd,
				"outPg" : pgval, "outRow" : y + 2, "outStart" : outStart, "outEnd" : outEnd});
		   } //y
		} else {
		   for(y = 0; y < row_labels.length;y++){
			   //Creating instart and inend values
					 for(c = 0; c < scantab[0].length; c++){
						if(scantab[0][c] == row_labels[y]){
							inStart = c + 1;
							inEnd = inStart + (tabInfo[0].ncols - 1);
						}
					 } //c
				nameArr2.push({"name" : nameArr[x].Name, "dataName" : row_labels[y], "dataRow" : nameArr[x].dataRow,
					"inStart" : inStart, "inEnd" : inEnd,
					"outPg" : pgval, "outRow" : y + 2, "outStart" : outStart, "outEnd" : outEnd});
		   } //y
		}

   var outStart = outStart + tabInfo[0].ncols 
   var outEnd = outStart + (tabInfo[0].ncols - 1)

}  //x

//Fixing inStart and inEnd

var rowVar = 0;
var curRow = 0;
for(a = 0; a < nameArr2.length; a++){
	if(nameArr2[a].dataRow == rowVar){
		if(curRow > (row_labels.length - 1)){
			var stval = nameArr2[a].inStart + tabInfo[0].ncols;
			var endval = nameArr2[a].inEnd + tabInfo[0].ncols
			nameArr2[a].inStart = stval;
			nameArr2[a].inEnd = endval;
		}
		curRow++
	} else {
	rowVar++
	var curRow = 1;
	}
}

//Populate Array
//Rowlabels

if(tabInfo[0].tabName == "Housing Type Table"){
	var housingtype = ["All Housing Units", "Owner-Occupied Housing Units", "Rental Housing Units"]
	for(x = 0; x < npages; x++){
		var rowchk = 3
		for(y = 0; y < housingtype.length; y++) {
			outArr[x][rowchk][0] = housingtype[y];
			rowchk++
			for(z = 0; z < row_labels.length; z++){
				outArr[x][rowchk][0] = row_labels[z];
				rowchk++
			}
		}
	}
} else {
for(x = 0; x < npages; x++){
	for(y = 2; y < nrows;y ++){
     outArr[x][y][0] = row_labels[y-2]
	} //y
} //x
}

//Place header
var arridx = 0;
var hdrArr = [];
hdrArr.push({'name' : nameArr2[arridx].name, 'outPg' : nameArr2[arridx].outPg, 'outStart' : nameArr2[arridx].outStart});

for(x = 0; x < nameArr2.length;x++){
	if(hdrArr[arridx].name != nameArr2[x].name) {
		hdrArr.push({'name' : nameArr2[x].name, 'outPg' : nameArr2[x].outPg, 'outStart' : nameArr2[x].outStart});
		arridx++;
    }
}

var colval = 1
for(x = 0; x < hdrArr.length; x++){
     outArr[hdrArr[x].outPg][0][hdrArr[x].outStart] = hdrArr[x].name;
     if(tabInfo[0].tabName == 'Housing Type Table'){
		  outArr[hdrArr[x].outPg][1][hdrArr[x].outStart] = "Counts"
		  outArr[hdrArr[x].outPg][1][hdrArr[x].outStart + 2] = "Percent"
		  var outrow = 2
	 } else {
		 var outrow = 1;
	 }
	switch(tabInfo[0].ncols){
	   case 1 :
		outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart] = "Estimate";
	   break;
      case 2: 
	  for(y = 1; y < ncols;y ++){
	  if(y % 2 != 0){
		outArr[hdrArr[x].outPg][outrow][y] = "Estimate";
	 } else {
		 outArr[hdrArr[x].outPg][outrow][y] = "Margin of Error";
	 }
	  }
    break;
	case 4: 
		if(tabInfo[0].tabName == 'Income Sources Table'){
		  outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart] = "Households";
		  outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart+1] = "Margin of Error";
		  outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart+2] = "Average Income";
		  outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart+3] = "Margin of Error";
        } else {
		  outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart] = "Estimate";
		  outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart+1] = "Margin of Error";
		  outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart+2] = "Percentage";
		  outArr[hdrArr[x].outPg][outrow][hdrArr[x].outStart+3] = "Margin of Error";
        }
	  break;
   } //switch
} //x


//Special creaton of nameArr2 for Housing Type Table
//Redoing nameArr2 for Housing Type Table
if(tabInfo[0].tabName == 'Housing Type Table'){
	var housingtype = ["All Housing Units", "Owner-Occupied Housing Units", "Rental Housing Units"]
	var nameArr2 = [];

if(level == "Municipality"){ //The length of a municipal data pull
	for(a = 0; a < housingtype.length; a++){
	switch(a){
		case 0:
		var outRow = 4;
		var inStart = 25;
		break;
		case 1:
		var outRow = 13;
		var inStart = 130;
		break;
		case 2:
		var outRow = 22;
		var inStart = 235;
		break;
	}
	var outEnd = outStart + (tabInfo[0].ncols - 1)
	for(b = 0; b < row_labels.length; b++){
		for(c = 0; c < hdrArr.length; c++){
			switch(c) {
				case 0:
				var outStart = 1;
				break;
				case 1:
				var outStart = 5;
				break;
				case 2:
				var outStart = 9
				break;
			}
			var outEnd = outStart + (tabInfo[0].ncols - 1)
			var inEnd = inStart + (tabInfo[0].ncols - 1)
			
			nameArr2.push({"name" : hdrArr[c].name, "dataName" : row_labels[b], "dataRow" : 0,
						"inStart" : inStart, "inEnd" : inEnd,
						"outPg" : hdrArr[c].outPg, "outRow" : outRow, "outStart" : outStart, "outEnd" : outEnd});
			inStart = inStart + tabInfo[0].ncols;
		} //c
		inStart++
		outRow++
	} //b
	} //a
	} else {
	for(a = 0; a < hdrArr.length; a++){
	for(b = 0; b < housingtype.length; b++){
		if(scantab.length == 2 && a == hdrArr.length - 1){
			switch(b){  //the short record
				case 0:
				var outRow = 4;
				var inStart = 17;
				break;
				case 1:
				var outRow = 13;
				var inStart = 58;
				break;
				case 2:
				var outRow = 22;
				var inStart = 99
				break;
			}
		} else {
			switch(b){
				case 0:
				var outRow = 4;
				var inStart = 18;
				break;
				case 1:
				var outRow = 13;
				var inStart = 91;
				break;
				case 2:
				var outRow = 22;
				var inStart = 164;
				break;
			}
		if(hdrArr[a].outStart == 5) {
			inStart = 22;
		}
		}
		for(c = 0; c < row_labels.length; c++){
			var inEnd = inStart + (tabInfo[0].ncols - 1)
			var outEnd = hdrArr[a].outStart + (tabInfo[0].ncols - 1)
			nameArr2.push({"name" : hdrArr[a].name, "dataName" : row_labels[c], "dataRow" : nameArr[a].dataRow,
						"inStart" : inStart, "inEnd" : inEnd,
						"outPg" : hdrArr[a].outPg, "outRow" : outRow, "outStart" : hdrArr[a].outStart, "outEnd" : outEnd});
			if(scantab.length == 2 && a == hdrArr.length - 1){
				inStart = inStart + (tabInfo[0].ncols + 1);
			} else {
				inStart = inStart + (tabInfo[0].ncols * 2) + 1;
			}
			outRow++;
	} //c
	} //b
} //a
}
	}

//Filling outArr with data
for(x = 0; x < nameArr2.length; x++){
	var iRow = nameArr2[x].dataRow;
	var iStart = nameArr2[x].inStart;
	var iEnd = nameArr2[x].inEnd;
	var oPg = nameArr2[x].outPg;
	var oRow = nameArr2[x].outRow;
	var oSt = nameArr2[x].outStart;
	var oEnd = nameArr2[x].outEnd;
	var nIncrement = 0;
	if(tabInfo[0].ncols == 1){
		 outArr[oPg][oRow][oSt] = tblArray[iRow][iStart];
	} else {
	for(y = iStart; y <= iEnd; y++){
	  outArr[oPg][oRow][oSt + nIncrement] = tblArray[iRow][y]; 
	  nIncrement++
	}
	}
}

//Slicing out the empty columns in the last page of the array

	var lastpg = npages - 1;
	var emptycell = 0;
	//Counting empty cells, cells without [A-Z,a-z,0-9]
	var empReg = new RegExp("[A-Z,a-z,0-9]");
	switch(tabInfo[0].tabName) {
	case 'Housing Type Table'  :
		var rowsel = 4;
		break;
	case 'Summary Statistics Table' :
	    var rowsel = 6;
		break;
	case 'Population Growth Table' :
	    var rowsel = 4;
		break;
	default :
		var rowsel = 3;
		break;
	}
	for(x = 0; x < outArr[lastpg][rowsel].length;x++){
			if(!empReg.test(outArr[lastpg][rowsel][x])){
				emptycell++
			}
	}
	var nonempty = outArr[lastpg][rowsel].length - emptycell;
	
	var tmpArray = [];
	for(a = 0; a < outArr[lastpg].length; a++){
		var tmpRow = [];
		for(b = 0; b < nonempty; b++){
			tmpRow.push(outArr[lastpg][a][b]);
		} //b
			tmpArray.push(tmpRow);
	} //a
    //Splicing out the last page and adding the new array
	outArr.splice(lastpg,1);
	outArr.splice(lastpg,0,tmpArray);

return(outArr)
} 
//HTMLtoArray

//cat Household Table Functions

function sumhouseholds(year,inData,incVal){
// sumhouseholds summs census data SF1 files for househoild projections
	var outval = 0;
	  if(year == 1990){
		  if(incVal == 0) {
			 var outval = inData["h12001"] + inData["h12002"] + inData["h12003"] + inData["h12004"] + inData["h12005"] + 
							inData["h12006"] + inData["h12007"] + inData["h12008"] + inData["h12009"] + inData["h12010"] + inData["h12011"] + 
							inData["h12012"] + inData["h12013"] + inData["h12014"];
		  }
	   if(incVal == 1) {
		   var outval = inData["h12001"] + inData["h12008"];
	   }
	   if(incVal == 2) {
		   var outval = inData["h12002"] + inData["h12003"] + inData["h12009"] + inData["h12010"];
	   }
	   if(incVal == 3) {
		   var outval = inData["h12004"] + inData["h12005"] + inData["h12011"] + inData["h12012"];
	   }
	   if(incVal == 4) {
		   var outval = inData["h12006"] + inData["h12007"] + inData["h12013"] + inData["h12014"];
	   }
	  } //1990

	  if(year == 2000){
		  if(incVal == 0) {
			 var outval = inData["h16001"];
		  }
	   if(incVal == 1) {
		   var outval = inData["h16003"] + inData["h16012"];
	   }
	   if(incVal == 2) {
		   var outval = inData["h16004"] + inData["h16005"] + inData["h16013"] + inData["h16014"];
	   }
	   if(incVal == 3) {
		   var outval = inData["h16006"] + inData["h16007"] + inData["h16015"] + inData["h16016"];
	   }
	   if(incVal == 4) {
		   var outval = inData["h16008"] + inData["h16009"] + inData["h16010"] + inData["h16017"] + inData["h16018"] + inData["h16019"];
	   }
	  } //2000

	  if(year == 2010){
		  if(incVal == 0) {
			 var outval = inData["h17001"];
		  }
	   if(incVal == 1) {
		   var outval = inData["h17003"] + inData["h17013"];
	   }
	   if(incVal == 2) {
		   var outval = inData["h17004"] + inData["h17005"] + inData["h17014"] + inData["h17015"];
	   }
	   if(incVal == 3) {
		   var outval = inData["h17006"] + inData["h17007"] + inData["h17008"] + inData["h17016"] + inData["h17017"] + inData["h17018"];
	   }
	   if(incVal == 4) {
		   var outval = inData["h17009"] + inData["h17010"] + inData["h17011"] + inData["h17019"] + inData["h17020"] + inData["h17021"];
	   }
	  } //2010
return(outval);
}
// sumhouseholds


function housingSum(c1990, c2000, c2010, SDOForecast,geotype){
//housingSum  processes household project data  The order of the inputs is important. 1990, 2000, 2010, and SDO data

	//Census 1990
	var c1990data = [];
	c1990.data.forEach(el => {
		for(i = 0; i < 5; i++) {
			c1990data.push({
			   'fips' : geotype == 'state' ? parseInt(el.state) : parseInt(el.county),
			   'name' : geotype == 'state' ? 'Colorado' : countyName(parseInt(el.county)),
			    'age_group_id' : i,
			   'household_type_id' : 0,
			   'total_households' : sumhouseholds(1990, el,i),
			   "year" : 1990
			});
		}
	});		

	
	//Census 2000
	var c2000data = [];
	c2000.data.forEach(el => {
		for(i = 0; i < 5; i++) {
			c2000data.push({
			   'fips' : geotype == 'state' ? parseInt(el.state) : parseInt(el.county),
			    'name' : geotype == 'state' ? 'Colorado' : countyName(parseInt(el.county)),
			   'age_group_id' : i,
			   'household_type_id' : 0,
			   'total_households' : sumhouseholds(2000, el,i),
			   "year" : 2000
			});
		}
	});		
	
	//Census 2010
	var c2010data = [];
	c2010.data.forEach(el => {
		for(i = 0; i < 5; i++) {
			c2010data.push({
			   'fips' : geotype == 'state' ? parseInt(el.state) : parseInt(el.county),
			   'name' : geotype == 'state' ? 'Colorado' : countyName(parseInt(el.county)),
			    'age_group_id' : i,
			   'household_type_id' : 0,
			   'total_households' : sumhouseholds(2010, el,i),
			   "year" : 2010
			});
		}
	});		

	
	var SDOdata = [];
	SDOForecast.forEach(el => {
		SDOdata.push({
			   'fips' :  geotype == 'state' ? 8 : el.area_code,
			   'name' : geotype == 'state' ? 'Colorado' : countyName(el.area_code),
			   'age_group_id' : el.age_group_id,
			   'household_type_id' : el.household_type_id,
			   'total_households' : Math.round(parseFloat(el.total_households)),
			   "year" : el.year
		});
	})

	
var outData = c1990data.concat(c2000data, c2010data,SDOdata);

return(outData)
} 
//housingSum

//cat Regional Plot Support Functions


function genRegEst(inData,DDsel,estDiv) {
//genRegEst Generates estimate plot for regions...
	
    const fmt_date = d3.timeFormat("%B %d, %Y");
var config = {responsive: true,
              displayModeBar: false};

//Generates the list of selected places
  var fipsList = [], opt;
  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
    }
  }

var pltSort = inData.sort(function(a, b){ return d3.ascending(a['year'], b['year']); })
  .sort(function(a, b){ return d3.ascending(a['fips'], b['fips']); });
 

var pltData = pltSort.filter(d => fipsList.includes(d.fips));

 var est_data = [];
 var ctyNames;
 for(i = 0; i < fipsList.length; i++) {
  var filtPlot = pltData.filter(d => d.fips == fipsList[i]);
  var year_est_arr = filtPlot.map(d => d.year);
  var pop_est_arr = filtPlot.map(d => d.totalpopulation);
  est_data.push({x : year_est_arr,
                 y : pop_est_arr,
     name : filtPlot[0].name,
                 mode : 'lines+markers'});
  if(i == 0) {
   ctyNames = filtPlot[0].name;
  } else {
   if(i%4 == 0){
   ctyNames = ctyNames + ",<br>" + filtPlot[0].name; 
   } else {
   ctyNames = ctyNames + ", " + filtPlot[0].name;
   }
  }

 } //i

 var est_layout = {
  title: "Population Estimates " + year_est_arr[0] + " to " + year_est_arr[(year_est_arr.length - 1)] + ", " + ctyNames,
    autosize: false,
    width: 1200,
    height: 400, 
    xaxis: {
   title : 'Year',
   showgrid: true,
   zeroline: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2
    },
    yaxis: {
   title : 'Total Population',
   automargin : true,
   showgrid: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2,
    tickformat: ','
    },
   annotations : [annot('Data and Visualization by the Colorado State Demography Office.')]
  };
  
Plotly.newPlot(estDiv, est_data, est_layout,config);
//Download Events


var profileDat2 = document.getElementById('profileDat2');
var profileImg2 = document.getElementById('profileImg2');
profileDat2.onclick = function() {exportToCsv(ctyNames, 'estimate', pltData,0)};
profileImg2.onclick = function() {exportToPng(ctyNames, 'estimate', estDiv,0)};
 
}; 
//genRegEst   

function genRegFore(inData,DDsel,forecDiv) {
//genRegFore Generates forecast plot for regions...

    const fmt_date = d3.timeFormat("%B %d, %Y");
var config = {responsive: true,
              displayModeBar: false};
     

//Generates the list of selected places
  var fipsList = [], opt;
  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
    }
  }

var pltSort = inData.sort(function(a, b){ return d3.ascending(a['year'], b['year']); })
  .sort(function(a, b){ return d3.ascending(a['fips'], b['fips']); });
 

var pltData = pltSort.filter(d => fipsList.includes(d.fips));

 var forec_data = [];
 var ctyNames;
 for(i = 0; i < fipsList.length; i++) {
  var filtPlot = pltData.filter(d => d.fips == fipsList[i]);
  var year_forec_arr = filtPlot.map(d => d.year);
  var pop_forec_arr = filtPlot.map(d => d.totalpopulation);
  forec_data.push({x : year_forec_arr,
                 y : pop_forec_arr,
     name : filtPlot[0].name,
                 mode : 'lines+markers'});
  if(i == 0) {
   ctyNames = filtPlot[0].name;
  } else {
   if(i%4 == 0){
   ctyNames = ctyNames + ",<br>" + filtPlot[0].name; 
   } else {
   ctyNames = ctyNames + ", " + filtPlot[0].name;
   }
  }

 } //i

 var forec_layout = {
  title: "Population Forecast " + year_forec_arr[0] + " to " + year_forec_arr[(year_forec_arr.length - 1)] + ", " + ctyNames,
    autosize: false,
    width: 1200,
    height: 400, 
    xaxis: {
   title : 'Year',
   showgrid: true,
   zeroline: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2
    },
    yaxis: {
   title : 'Total Population',
   automargin : true,
   showgrid: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2,
    tickformat: ','
    },
   annotations : [annot('Data and Visualization by the Colorado State Demography Office.')]
  };
  
Plotly.newPlot(forecDiv, forec_data, forec_layout,config);
//Download Events

var profileDat3 = document.getElementById('profileDat3');
var profileImg3 = document.getElementById('profileImg3');
profileDat3.onclick = function() {exportToCsv(ctyNames, 'forecast', pltData,0)};
profileImg3.onclick = function() {exportToPng(ctyNames, 'forecast', forecDiv,0)};
  
}; 
//genRegFore   


function genRegForeSetup(level, inData, fore_div, bkMark, fipsList, ctyNameList) {
//genRegForeSetup sets up the regional forecast plot
	
pgSetupPro(level,"chart", fore_div,bkMark,true, false,fipsList, ctyNameList, 0)
 
   //Initial Plot
    var dd = document.getElementById("geoSelect3");
   var btn = document.getElementById("plotBtn3");
   dd.selectedIndex = 1;
   var selvalue = [];
   selvalue.push(+dd.value);

   genRegFore(inData,dd, "PlotDiv3");

   btn.addEventListener('click', function() {
    genRegFore(inData,dd, "PlotDiv3")
       });
    
};  
// genRegForeSetup


function genRegcoc(inData,DDsel,cocDiv) {
//genRegcoc Generates coccast plot for regions...

    const fmt_date = d3.timeFormat("%B %d, %Y");
var config = {responsive: true,
              displayModeBar: false};
     
//Calculating Total Popuolation Change

 
//Generates the list of selected places
  var fipsList = [], opt;
  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
    }
  }

var pltSort = inData.sort(function(a, b){ return d3.ascending(a['year'], b['year']); })
  .sort(function(a, b){ return d3.ascending(a['fips'], b['fips']); });
 

var pltData = pltSort.filter(d => fipsList.includes(d.fips));

//Components of Change


 var ctyNames;
 for(i = 0; i < fipsList.length; i++) {
  var filtPlot = pltData.filter(d => d.fips == fipsList[i]);
  //Fix for popchng
  for(j = 1; j < filtPlot.length; j++) {
    filtPlot[j].popchng = filtPlot[j].totalpopulation - filtPlot[j-1].totalpopulation;
  }
  var year_coc_arr = filtPlot.map(d => d.year);
  var pop_coc_arr = pltData.map(d => d.popchng);
        var birth_coc_arr = pltData.map(d => d.births);
        var death_coc_arr = pltData.map(d => d.deaths);
        var incr_coc_arr = pltData.map(d => d.naturalincrease);
        var migr_coc_arr = pltData.map(d => d.netmigration);

var coc_trace1 = { 
               x: year_coc_arr,
               y : pop_coc_arr,
      name : 'Total Population Change',
      mode : 'lines+markers',
       marker: {
                  color: 'black',
      symbol: 'circle',
                  size: 6
  },
  line: {
    color: 'black',
    width: 1
  }
   };
   
var coc_trace2 = { 
               x: year_coc_arr,
               y : birth_coc_arr,
      name : 'Births',
      mode : 'lines+markers',
       marker: {
                  color: 'blue',
      symbol: 'square',
                  size: 4
  },
  line: {
    color: 'plue',
 dash: 'dashdot',
    width: 1
  }
 };

var coc_trace3 = { 
               x: year_coc_arr,
               y : death_coc_arr,
      name : 'Deaths',
      mode : 'lines+markers',
       marker: {
                  color: 'purple',
      symbol: 'diamond',
                  size: 4
  },
  line: {
    color: 'purple',
 dash: 'dashdot',
    width: 1
  }
};

var coc_trace4 = { 
               x: year_coc_arr,
               y : migr_coc_arr,
      name : 'Net Migration',
      mode : 'lines+markers',
       marker: {
                  color: 'green',
      symbol: 'diamond',
                  size: 4
  },
  line: {
    color: 'green',
 dash: 'dashdot',
    width: 1
  }
  };
 
var coc_trace = [coc_trace1, coc_trace2, coc_trace3, coc_trace4]
  if(i == 0) {
   ctyNames = filtPlot[0].name;
  } else {
   if(i%4 == 0){
   ctyNames = ctyNames + ",<br>" + filtPlot[0].name; 
   } else {
   ctyNames = ctyNames + ", " + filtPlot[0].name;
   }
  }

 } //i

var yrvalue = year_coc_arr[year_coc_arr.length - 1];

var coc_layout = {
  title: "Births, Deaths and Net Migration 1985 to " + yrvalue + ", " + ctyNames,
    autosize: false,
    width: 1200,
    height: 400,
    xaxis: {
   title : 'Year',
   showgrid: true,
   zeroline: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2
    },
    yaxis: {
   title : 'Population Change',
   automargin : true,
   showgrid: true,
   showline: true,
   zeroline : true,
   zerolinewidth: 4,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2,
    tickformat: ','
    },
   annotations : [annot('Data and Visualization by the Colorado State Demography Office.')]
  };
  
Plotly.newPlot(cocDiv, coc_trace, coc_layout,config);
//Download Events

var profileDat4 = document.getElementById('profileDat4');
var profileImg4 = document.getElementById('profileImg4');
profileDat4.onclick = function() {exportToCsv(ctyNames, 'coc', pltData,0)};
profileImg4.onclick = function() {exportToPng(ctyNames, 'coc', cocDiv,0)};
  
}; 
// genRegcoc   


function genRegPopSetup(level, EstData, ForeData, CocData, divArr, bkMark, fipsList, ctyNameList) {
//genRegPopSetup sets up the regional population plots
	
  pgSetupPro(level,"chart", divArr[0],bkMark[1],true, false,fipsList, ctyNameList, 0)
  pgSetupPro(level,"chart", divArr[1],bkMark[2],true, false,fipsList, ctyNameList, 0)
  pgSetupPro(level,"chart", divArr[2],bkMark[3],true, false,fipsList, ctyNameList, 0)
   //Initial Plot
    var dd = document.getElementById("geoSelect2");
   var btn = document.getElementById("plotBtn2");  
     dd.selectedIndex = 1;
   var selvalue = [];
   selvalue.push(+dd.value)

   genRegEst(EstData,dd, "PlotDiv2");
   genRegFore(ForeData,dd,"PlotDiv3")
   genRegcoc(CocData,dd,"PlotDiv4");

   btn.addEventListener('click', function() {
   genRegEst(EstData,dd, "PlotDiv2");
   genRegFore(ForeData,dd,"PlotDiv3")
   genRegcoc(CocData,dd,"PlotDiv4");
       });
    
};  
// genRegPopSetup

//cat Plot Functions multiple geographies

function genAgeEst(inData,level, DDsel,ageDiv,yrvalue) {
//genAgeEst Generates Age plot for all geographies

 const fmt_date = d3.timeFormat("%B %d, %Y");

var config = {responsive: true,
              displayModeBar: false};
     
//Generates the list of selected places  

var fipsList = [], opt;
if(level == "Region") {
  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
    }
  }
} else {
 fipsList = DDsel;
}

var year_data = [...new Set(inData.map(d => d.year))]; 
var pltData = inData.filter(d => fipsList.includes(d.fips) && d.year == year_data[0]);
var PlaceNames = [...new Set(pltData.map(d => d.name))];

    var ctyNames = [];
 var age_data = [];
 for(i = 0; i < PlaceNames.length; i++) {
  var filtPlot = pltData.filter(d => d.name == PlaceNames[i]);
  var age_est_arr = filtPlot.map(d => d.age_cat);
  var pct_est_arr = filtPlot.map(d => d.pct_totalpopulation_e);
   
     ctyNames = PlaceNames[i];

  // Mouseover description

  var pct_est_0d = filtPlot.map(d => PlaceNames[i] + " " + d.age_cat + '<br>Percent: ' + fixNUMFMT(d.pct_totalpopulation_e,"pct") + '<br>Persons: ' + fixNUMFMT(d.totalpopulation_e,"num"));

  if(level == "Municipality") {
   var pct_est_moe = filtPlot.map(d => d.pct_totalpopulation_m);
   var pct_est_0d = filtPlot.map(d => PlaceNames[i] + ' ' + d.age_cat + '<br>Percent: ' + fixNUMFMT(d.pct_totalpopulation_e,"pct") + ' ±' + fixNUMFMT(d.pct_totalpopulation_m,"num") + '<br>Persons: ' + fixNUMFMT(d.totalpopulation_e,"num") + ' ±' + fixNUMFMT(Math.ceil(d.totalpopulation_m),"num"));
   age_data.push({x : age_est_arr,
                 y : pct_est_arr,
     error_y: {
      type: 'data',
      array: pct_est_moe,
      color: 'black',
      thickness: 0.75,
      visible: true
     },
     customdata : pct_est_0d,
     hovertemplate : '%{customdata}',
     hoverlabel : {namelength :0},
     name : PlaceNames[i],
                 type : 'bar'
     });
  } else {
     age_data.push({x : age_est_arr,
                 y : pct_est_arr,
     customdata : pct_est_0d,
     hovertemplate : '%{customdata}',
     hoverlabel : {namelength :0},
     name : PlaceNames[i],
                 type : 'bar'
     }); 
  }


 } //i

//Creating Source citation
if(level == "Municipality"){
 var yrrange = (yrvalue - 4) + "-"+ yrvalue;
 var citation = 'U.S. Census Bureau. ' + yrrange + ' American Community Survey, 5-year data file. Table B01001.'; 
} else {
 var citation = 'Data and Visualization by the Colorado State Demography Office.';
}
 debugger;
 console.log(citation)

if(PlaceNames.length == 1){
  var PltTitle = "Age Estimates, " + year_data[0] + ": " + PlaceNames[0];
} else {
  var PltTitle = "Age Estimates: " + year_data[0];
}  
 var age_layout = {
  title: PltTitle,
    width: 1200,
    height: 400, 
    barmode : 'group',
    xaxis: {
   title : 'Age Group',
   showgrid: true,
   zeroline: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2
    },
    yaxis: {
   title : 'Percent',
   automargin : true,
   showgrid: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2,
    tickformat:  '.1%'
    },
   annotations : [ annot(citation)]
  };
 Plotly.newPlot(ageDiv, age_data, age_layout,config);

//Download Events

var profileDat2 = document.getElementById('profileDat2');
var profileImg2 = document.getElementById('profileImg2');
profileDat2.onclick = function() {exportToCsv(ctyNames, 'ageest', pltData,0)};
profileImg2.onclick = function() {exportToPng(ctyNames, 'ageest', ageDiv,0)};
 
}; 
// genAgeEst   


function genAgeFor(inData,level, DDsel,ageDiv) {
//genAgeFor Generates Age plot for counties and regions...

 const fmt_date = d3.timeFormat("%B %d, %Y");
 
var config = {responsive: true,
              displayModeBar: false};
     
var fipsList = [], opt;
if(level == "Region") {
  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
    }
  }
} else {
 fipsList = DDsel;
}
var year_data = [...new Set(inData.map(d => d.year))]; 
var pltData = inData.filter(d => fipsList.includes(d.fips) && d.year == year_data[1]);
var PlaceNames = [...new Set(pltData.map(d => d.name))];

    var ctyNames = [];
 var age_data = [];

 for(i = 0; i < PlaceNames.length; i++) {
  var filtPlot = pltData.filter(d => d.name == PlaceNames[i]);
  var age_for_arr = filtPlot.map(d => d.age_cat);
  var pct_for_arr = filtPlot.map(d => d.pct_totalpopulation_e);
  var pct_for_0d = filtPlot.map(d => PlaceNames[i] + " " + d.age_cat + '<br>Percent: ' + fixNUMFMT(d.pct_totalpopulation_e,"pct") + '<br>Persons: ' + fixNUMFMT(d.totalpopulation_e,"num"));
   ctyNames = PlaceNames[i];
 

  age_data.push({x : age_for_arr,
                 y : pct_for_arr,
     customdata : pct_for_0d,
     hovertemplate : '%{customdata}',
     hoverlabel : {namelength :0},
     name : PlaceNames[i],
                 type : 'bar'
     });
 } //i

 
if(PlaceNames.length == 1){
  var PltTitle = "Age Forecast, " + year_data[1] + ": " + PlaceNames[0];
} else {
  var PltTitle = "Age Forecast: " + year_data[1];
}  
 var age_layout = {
  title: PltTitle,
    autosize: false,
    width: 1200,
    height: 400, 
    barmode : 'group',
    xaxis: {
   title : 'Age Group',
   showgrid: true,
   zeroline: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2
    },
    yaxis: {
   title : 'Percent',
   range :[0, 0.75],
   automargin : true,
   showgrid: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2,
    tickformat:  '.1%'
    },
   annotations : [annot('Data and Visualization by the Colorado State Demography Office.')]
  };
 Plotly.newPlot(ageDiv, age_data, age_layout,config);

//Download Events

var profileDat3 = document.getElementById('profileDat3');
var profileImg3 = document.getElementById('profileImg3');
profileDat3.onclick = function() {exportToCsv(ctyNames, 'agefor', pltData,0)};
profileImg3.onclick = function() {exportToPng(ctyNames, 'agefor', ageDiv,0)};
 
}; 
// genAgeFor


function genAgePyr(inData,level,DDsel,ageDiv, yrvalue){
//genAgePyr  Generates age Pyramids for all geographies
const fmt_date = d3.timeFormat("%B %d, %Y");


var config = {responsive: false,
              displayModeBar: false};
     
var fipsList = [], ctyNames= [], opt;
if(level == "Region") {

  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
	  ctyNames.push(opt.label)
    }
  }
} else {
 fipsList = DDsel;
 var ctyNames = [...new Set(inData.map(d => d.name))];
}

var year_data = [...new Set(inData.map(d => d.year))]; 
var age_arr = [...new Set(inData.map(d => d.age_cat))];


//assigning main div


  
     //Creating plotdivs this is based on the number of places selected

var nrows = Math.ceil(fipsList.length/2)
var nameArr = new Array(nrows)
for(i = 0; i < nrows; i++){
	nameArr[i] = new Array(2)
}

var rowassn = 0;
var colassn = 0;
for(i = 0.; i < fipsList.length; i++){
	nameArr[rowassn][colassn] = ctyNames[i];
	colassn = colassn + 1
	if(i > 0 && i % 2 == 1){
	 rowassn = rowassn + 1
	 colassn = 0
	}
}

 var plotdiv = document.createElement('div');
 
 var plot_array = [];  
 for(i= 0; i < nameArr.length; i++){
	 var rowval = i + 1
	 for(j = 0; j < nameArr[i].length; j++){
	  if(nameArr[i][j] != null){
	  var colval = j + 1
	  var plotName = nameArr[i][j]
	  
	  //Write to plot_array
		 plot_array.push({'loc' : plotName,
						  'fName' : plotName + " Age Pyramid.png",
						  'plot' : "plotGrid_" + rowval + "_" + colval
						});
						
	 //Write to DOM
	  var plot_grid = document.createElement('div');
	  plot_grid.id = "plotGrid_"+ rowval + "_" + colval;
	  plot_grid.className = "grid-item pyramid_"+ rowval + "_"+ colval;
	  plotdiv.appendChild(plot_grid);
     } //nameArr[i][j].length > 0
	 } //j
 } //i
 
 plotdiv.id = 'pyramid-container';
 plotdiv.className = 'pyramid-container';
 var outdiv = document.getElementById(ageDiv);
 outdiv.innerHTML = "";    
  outdiv.appendChild(plotdiv);
 
var outData = [];
 if(level == "Municipality"){
 var yrrange = (yrvalue - 4) + "-"+ yrvalue;
 
 for(i = 0; i < fipsList.length; i++) {
 var outPlot = plot_array[i].plot;
 var pltData = inData.filter(d => d.fips == fipsList[i]);
 var year0 = pltData.filter(d => d.year == year_data[0]);
 outData = outData.concat(pltData);
//Determine number of ticks

var male_pct = year0.map(d => d.pct_malepopulation_e);
var male_pct_moe = year0.map(d => d.pct_malepopulation_m);
var male_sum = [];
for(j = 0; j < male_pct.length; j++){
    male_sum.push( male_pct[j] + male_pct_moe[j] );
 }

var female_pct = year0.map(d => d.pct_femalepopulation_e);
var female_pct_moe = year0.map(d => d.pct_femalepopulation_m);
var female_sum = [];
for(j = 0; j < female_pct.length; j++){
    female_sum.push( female_pct[j] + female_pct_moe[j] );
 }

var pct = male_sum.concat(female_sum);
var max_pct = Math.max(...pct);
var adj_pct = Math.ceil(max_pct/0.05)*0.05;
var rnd_pct = Number(adj_pct.toFixed(2));

var tick_range = [(rnd_pct * -1), rnd_pct];
if(rnd_pct >0.3) {
 var tick_neg = range((rnd_pct * -1),0,.10)
 var tick_pos = range(0,rnd_pct, .10)
} else {
 var tick_neg = range((rnd_pct * -1),0,.05)
 var tick_pos = range(0,rnd_pct, .05)
}

if(tick_neg.includes(-0)) {tick_neg.pop()};

if(!tick_neg.includes(tick_range[0])) {tick_neg.unshift((rnd_pct * -1))}
if(!tick_pos.includes(tick_range[1])) {tick_pos.push(rnd_pct)}

var tick_val = tick_neg.concat(tick_pos);
var tick_text = [];
for(j = 0; j < tick_val.length; j++){
   tick_text.push(fixNUMFMT(Math.abs(tick_val[j]),"pct"));
}

 var pct_male_0 = year0.map(d => d.pct_malepopulation_e * -1);
 var pct_male_moe = year0.map(d => d.pct_malepopulation_m * -1);
 var pct_male_0d = year0.map(d => 'Men' + ' ' + year_data[0] + " " + d.age_cat + '<br>Percent: ' + fixNUMFMT(d.pct_malepopulation_e,"pct") + ' ±' + fixNUMFMT(d.pct_malepopulation_m,"pct") + '<br>Persons: ' + fixNUMFMT(d.malepopulation_e,"num") + ' ±' + fixNUMFMT(Math.ceil(d.malepopulation_m),"num"));
 var pct_female_0 = year0.map(d => d.pct_femalepopulation_e);
 var pct_female_moe = year0.map(d => d.pct_femalepopulation_m);
 var pct_female_0d = year0.map(d => 'Women' + ' ' + year_data[0] + " " + d.age_cat + '<br>Percent: ' + fixNUMFMT(d.pct_femalepopulation_e,"pct") + ' ±' + fixNUMFMT(d.pct_femalepopulation_m,"pct") + '<br>Persons: ' + fixNUMFMT(d.femalepopulation_e,"num") + ' ±' + fixNUMFMT(Math.ceil(d.femalepopulation_m),"num"));
  
 trace1 = {
   name: year_data[0], 
   showlegend : false,
   type: 'bar', 
   x: pct_male_0,
   y: age_arr, 
   error_x: {
  type: 'data',
  array: pct_male_moe,
  color: 'black',
        thickness: 0.75,
  visible: true
     },
   customdata : pct_male_0d,
   hovertemplate : '%{customdata}',
   hoverlabel : {namelength :0},
   marker: {
  color : 'lightblue',
  opacity : 0.5,
  line: {
    opacity : 1,
    color: 'black',
    width: 2
   } }, 
   orientation: 'h'
 };
 trace2 = {
   name: year_data[0], 
   type: 'bar', 
   showlegend : false, 
   x: pct_female_0,
   y: age_arr,
   error_x: {
   type: 'data',
   array: pct_female_moe,
   color: 'black',
   thickness: 0.75,
   visible: true
  },
   customdata : pct_female_0d,
   hovertemplate : '%{customdata}',
   hoverlabel : {namelength :0},
   marker: {
  color : 'lightblue',
  opacity : 0.5,
  line: {
    opacity : 1,
    color: 'black',
    width: 2
   } }, 
   orientation: 'h'
 };

 
 var pyr_data = [trace1, trace2];
 
 var pyr_layout = {
 title: "Age by Sex, " + year_data[0] + '<br>' + ctyNames[i],
   width: 600,
   height: 400, 
   barmode :'overlay',
   bargap : 0.0,
   xaxis: {
  range : tick_range,
  tickvals : tick_val,
  ticktext : tick_text,
  showgrid: true,
  zeroline: true,
  showline: true,
  mirror: 'ticks',
  gridcolor: '#bdbdbd',
  gridwidth: 2,
  linecolor: 'black',
  linewidth: 2,
  tickformat:  '.1%',
    },
   yaxis: {
  title : 'Age Group',
  automargin : true,
  showgrid: false,
  showline: false,
  tickvals : age_arr,
  mirror: 'ticks',
  gridcolor: '#bdbdbd',
  gridwidth: 2,
  linecolor: 'black',
  linewidth: 2,
   },
  annotations : [
  {text :  'Men          Women' , 
    font: {
    size : 7,
    color: 'black'
      },
     xref : 'paper',  
     x : 0.5, 
     yref : 'paper', 
     y : -0.20, 
     align : 'center', 
     font : { size : 14},
     showarrow : false},
     {text :  'U.S. Census Bureau. ' + yrrange + ' American Community Survey, 5-year data file.<br>Table B01001. Print Date: ' +  fmt_date(new Date),
     xref : 'paper', 
     x : 0, 
     yref : 'paper', 
     y : -0.37, 
     align : 'left', 
     showarrow : false}]
 };
 Plotly.newPlot(outPlot, pyr_data, pyr_layout,config);

  } //i
  
 var profileDat4 = document.getElementById('profileDat4');
 var profileImg4 = document.getElementById('profileImg4');
 profileDat4.onclick = function() {exportToCsv(ctyNames, 'agepyr', outData,0)};
 profileImg4.onclick = function() {exportToPng(ctyNames, 'agepyr', plot_array,0)}; 
 
} else {

 for(i = 0; i < plot_array.length; i ++ ){

 var outPlot = plot_array[i].plot; 
    
  var pltData = inData.filter(d => d.fips == fipsList[i]);
  
  outData = outData.concat(pltData);

  var ctyNames = [...new Set(pltData.map(d => d.name))]; 
 
 var year0 = pltData.filter(d => d.year == year_data[0]);
 var year1 = pltData.filter(d => d.year == year_data[1]); 

 var pct_male_0 = year0.map(d => d.pct_malepopulation_e * -1);
 var pct_male_0d = year0.map(d => 'Men ' + d.age_cat + ' ' + year_data[0] + '<br>Percent: ' + fixNUMFMT(d.pct_malepopulation_e,"pct") + '<br>Persons: ' + fixNUMFMT(d.malepopulation_e,"num"));
 var pct_female_0 = year0.map(d => d.pct_femalepopulation_e);
 var pct_female_0d = year0.map(d => 'Women ' + d.age_cat + ' ' + year_data[0] + '<br>Percent: ' + fixNUMFMT(d.pct_femalepopulation_e,"pct") + '<br>Persons: ' + fixNUMFMT(d.femalepopulation_e,"num"));
  
 var pct_male_1 = year1.map(d => d.pct_malepopulation_e * -1);
 var pct_male_1d = year1.map(d => 'Men ' + d.age_cat + ' ' + year_data[1] + '<br>Percent: ' + fixNUMFMT(d.pct_malepopulation_e,"pct") + '<br>Persons: ' + fixNUMFMT(d.malepopulation_e,"num"));
 var pct_female_1 = year1.map(d => d.pct_femalepopulation_e);
 var pct_female_1d = year1.map(d => 'Women ' + d.age_cat + ' ' + year_data[1] + '<br>Percent: ' + fixNUMFMT(d.pct_femalepopulation_e,"pct") + '<br>Persons: ' + fixNUMFMT(d.femalepopulation_e,"num"));
    
 trace1 = {
   name: year_data[0], 
   showlegend : false,
   type: 'bar', 
   x: pct_male_0,
   y: age_arr, 
   customdata : pct_male_0d,
   hovertemplate : '%{customdata}',
   hoverlabel : {namelength :0},
   marker: {
  color : 'lightblue',
  line: {
    opacity : 1,
    color: 'black',
    width: 2
   } }, 
   orientation: 'h'
 };
 trace2 = {
   name: year_data[0], 
   type: 'bar', 
   showlegend : false, 
   x: pct_female_0,
   y: age_arr, 
   customdata : pct_female_0d,
   hovertemplate : '%{customdata}',
   hoverlabel : {namelength :0},
   marker: {
  color : 'lightblue',
  line: {
    opacity : 1,
    color: 'black',
    width: 2
   } }, 
   orientation: 'h'
 };
 /*
 trace3 = {
   name: year_data[1], 
   showlegend : true,
   type: 'bar', 
   x: pct_male_1, 
   y: age_arr, 
   customdata : pct_male_1d,
   hovertemplate : '%{customdata}',
   hoverlabel : {namelength :0},
    marker: {
     color : 'lightblue',
     opacity : 0.5,
  line: {
    opacity : 1,
    color: 'black',
    width: 2
    } }, 
   orientation: 'h'
 };
 trace4 = {
   name: year_data[1], 
   type: 'bar', 
   showlegend : false,
   x: pct_female_1, 
   y: age_arr, 
   customdata : pct_female_1d,
   hovertemplate : '%{customdata}',
   hoverlabel : {namelength :0},
    marker: {
     color : 'lightblue',
     opacity : 0.5,
  line: {
    opacity : 1,
    color: 'black',
    width: 2
    } }, 
   orientation: 'h'
 };
*/ 
 var pyr_data = [trace1, trace2];
 
 var pyr_layout = {
 title: "Age by Sex, " + year_data[0]  + '<br>' + ctyNames[0],
   width: 600,
   height: 400, 
   barmode :'overlay',
   bargap : 0.0,
   xaxis: {
  range :[-0.15, 0.15],
  tickvals : [-.15, -.10, -.05,0, .05,.10,.15],
  ticktext : ['15%','10%', '5%', '0%', '5%','10%','15%'],
  showgrid: true,
  zeroline: true,
  showline: true,
  mirror: 'ticks',
  gridcolor: '#bdbdbd',
  gridwidth: 2,
  linecolor: 'black',
  linewidth: 2,
  tickformat:  '.1%'
   },
   yaxis: {
  title : 'Age Group',
  automargin : true,
  showgrid: false,
  showline: false,
  tickvals : age_arr,
  mirror: 'ticks',
  gridcolor: '#bdbdbd',
  gridwidth: 2,
  linecolor: 'black',
  linewidth: 2,
   },
  annotations : [
  {text :  'Men          Women' , 
   xref : 'paper',  
     x : 0.5, 
     yref : 'paper', 
     y : -0.20, 
     align : 'center', 
     font : { size : 14},
     showarrow : false},
     {text :  'Data and Visualization by the Colorado State Demography Office.Print Date: ' +  fmt_date(new Date) , 
         font: {
    size : 7,
    color: 'black'
      },
   xref : 'paper', 
     x : 0, 
     yref : 'paper', 
     y : -0.30, 
     align : 'left', 
     showarrow : false}]
 };
 Plotly.newPlot(outPlot, pyr_data, pyr_layout,config);
 } //i

 var profileDat4 = document.getElementById('profileDat4');
 var profileImg4 = document.getElementById('profileImg4');
 profileDat4.onclick = function() {exportToCsv(ctyNames, 'agepyr', outData,0)};
 profileImg4.onclick = function() {exportToPng(ctyNames, 'agepyr', plot_array,0)};
} //region and county
} 
// genAgePyr 


function genAgeSetup(level, inData, pyrData, age_div0, age_div1, age_div2, age_div3, fipsList, ctyNameList, yrvalue) {
//genAgeSetup sets up Age UI for all geographies

 document.getElementById(age_div0).innerHTML = "";
 document.getElementById(age_div1).innerHTML = "";
 document.getElementById(age_div2).innerHTML = "";
 document.getElementById(age_div3).innerHTML = "";
 
 if(level == "Region") { 
var bkMarkArr = [{title : 'Population Estimates by Age', id : 'age01', srctxt : "State and Regional Single Year of Age Lookup", srclink : "https://coloradodemography.github.io/population/data/sya-regions/"},
	{title: 'Population Forecasts by Age', id : 'age02', srctxt : "State and Regional Single Year of Age Lookup", srclink : "https://coloradodemography.github.io/population/data/sya-regions/"},
	{title : 'Population Age Pyramids', id : 'age03', srctxt : "State and Regional Single Year of Age Lookup", srclink : "https://coloradodemography.github.io/population/data/sya-regions/"}
 ]

insertBkmark(bkMarkArr)
  //Add a second chart div here
  pgSetupPro(level,"chart",age_div1,bkMarkArr[0],true,false,fipsList, ctyNameList, 0);
  var chartdiv_1 = document.createElement('div')
  chartdiv_1.id = 'AgeChart1'
  var chdiv_a = document.getElementById(age_div1)
  chdiv_a.appendChild(chartdiv_1)
  
  pgSetupPro(level,"chart",age_div2,bkMarkArr[1],true,false,fipsList, ctyNameList, 0);
  var chartdiv_2 = document.createElement('div')
  chartdiv_2.id = 'AgeChart2'
  var chdiv_b = document.getElementById(age_div2)
  chdiv_b.appendChild(chartdiv_2)
  
  pgSetupPro(level,"chart",age_div3,bkMarkArr[2],true,false,fipsList, ctyNameList, 0);
  var chartdiv_3 = document.createElement('div')
  chartdiv_3.id = 'AgeChart3'
  var chdiv_c = document.getElementById(age_div3)
  chdiv_c.appendChild(chartdiv_3)
} 

if(level == 'County'){  
var bkMarkArr = [{title : 'Population Estimates by Age', id : 'age01', srctxt : "County Single Year of Age Lookup",srclink : "https://coloradodemography.github.io/population/data/sya-county/#county-population-by-single-year-of-age"},
	{title: 'Population Forecasts by Age', id : 'age02', srctxt : "County Single Year of Age Lookup",srclink : "https://coloradodemography.github.io/population/data/sya-county/#county-population-by-single-year-of-age"},
	{title : 'Population Age Pyramids', id : 'age03', srctxt : "County Single Year of Age Lookup",srclink : "https://coloradodemography.github.io/population/data/sya-county/#county-population-by-single-year-of-age"}
 ]

insertBkmark(bkMarkArr)
 pgSetupPro(level,"chart",age_div1,bkMarkArr[0],true,false, fipsList, ctyNameList,0 )
  //Add a second chart div here
  var chartdiv_1 = document.createElement('div')
  chartdiv_1.id = 'AgeChart1'
  var chdiv_a = document.getElementById(age_div1)
  chdiv_a.appendChild(chartdiv_1)
  
  pgSetupPro(level,"chart",age_div2,bkMarkArr[1],true,false,fipsList, ctyNameList, 0);
  var chartdiv_2 = document.createElement('div')
  chartdiv_2.id = 'AgeChart2'
  var chdiv_b = document.getElementById(age_div2)
  chdiv_b.appendChild(chartdiv_2)
  
  pgSetupPro(level,"chart",age_div3,bkMarkArr[2],true,false,fipsList, ctyNameList, 0);
  var chartdiv_3 = document.createElement('div')
  chartdiv_3.id = 'AgeChart3'
  var chdiv_c = document.getElementById(age_div3)
  chdiv_c.appendChild(chartdiv_3)
}

if(level == "Municipality"){
	var fullfips  = "08" + fipsList;
	var bkMarkArr = [{title : 'Population Estimates by Age', id : 'age01', srctxt : "ACS Age Estimates", srclink : genCEDSCIUrl(level,"B01001",yrvalue, fullfips)},
	{title : 'Population Age Pyramids', id : 'age03', srctxt : "ACS Age Eatimates", srclink : genCEDSCIUrl(level,"B01001",yrvalue, fullfips)}
 ]
	insertBkmark(bkMarkArr)
pgSetupPro(level,"chart",age_div1,bkMarkArr[0],true,false,fipsList, ctyNameList, yrvalue)
  //Add a second chart div here
  var chartdiv_1 = document.createElement('div')
  chartdiv_1.id = 'AgeChart1'
  var chdiv_a = document.getElementById(age_div1)
  chdiv_a.appendChild(chartdiv_1)
  
  pgSetupPro(level,"chart",age_div3,bkMarkArr[1],true,false,fipsList, ctyNameList,yrvalue);
  var chartdiv_3 = document.createElement('div')
  chartdiv_3.id = 'AgeChart3'
  var chdiv_c = document.getElementById(age_div3)
  chdiv_c.appendChild(chartdiv_3)
}

   

  if(level == "Region"){
   var dd0 = document.getElementById("geoSelect2");
   var btn0 = document.getElementById("plotBtn2");
   var selopts = "0,-101";
   $.each(selopts.split(","), function(i,e){
          $("#geoSelect2 option[value='" + e + "']").prop("selected", true);
       }); 
    
   genAgeEst(inData,level,dd0, chartdiv_1.id,0);
   genAgeFor(inData,level,dd0, chartdiv_2.id,0);
   genAgePyr(pyrData,level,dd0, chartdiv_3.id,0);
   
   btn0.addEventListener('click', function() {
    genAgeEst(inData,level, dd0, chartdiv_1.id,0)
    genAgeFor(inData,level,dd0, chartdiv_2.id,0);
    genAgePyr(pyrData,level,dd0, chartdiv_3.id,0);
       });
  
  } 
 if(level == "County"){ 
   genAgeEst(inData,level,fipsList, chartdiv_1.id,0);
   genAgeFor(inData,level, fipsList, chartdiv_2.id,0);
   genAgePyr(pyrData,level,fipsList, chartdiv_3.id,0);
  };

if(level == "Municipality"){ 
   genAgeEst(inData,level,fipsList, chartdiv_1.id,yrvalue);
   genAgePyr(pyrData,level,fipsList, chartdiv_3.id,yrvalue);
  };
    
};  
// genAgeSetup

//cat Community Profile Functions

function dlMap(){
//dlMap Downloads the  sel 1 Map

   var descript = document.getElementById('profile-content1')
   var descriptTxt = descript.childNodes[1].textContent;
   var fnTxt = descriptTxt.replace("Basic", " Basic");
   var outFileName = fnTxt + ".png";

    var count_node = d3.select(descript).select("svg").node();
 count_node.setAttribute("viewBox", "0 0 925 500");
 saveSvgAsPng(count_node, outFileName);
};
//AddProfileBtns  Adds the download buttons and images to the DOM
function AddProfileBtns(divname,btnprefix) {

var btnDiv = divname;
var newDiv = document.createElement('div');
 newDiv.className = 'dropdown AClass';
var dlBtn = document.createElement('button');
 dlBtn.setAttribute('id', btnprefix);
 dlBtn.className = 'dropbtn';
var btnImg = document.createElement('i');
 btnImg.className = 'fas fas fa-download fa-2x'
 btnImg.style.color = 'black';
var btnDiv2 = document.createElement('div');
 btnDiv2.className = 'dropdown-content';

var linkpng = document.createElement('a');
 linkpng.setAttribute('href','#');
 linkpng.setAttribute('id', btnprefix + '_png');
 linkpng.setAttribute('onclick','dlMap();');
 linkpng.innerHTML = 'Download Image (PNG)';
 
var linkpdf = document.createElement('a');
 linkpdf.setAttribute('href','#');
 linkpdf.setAttribute('id', btnprefix + '_pdf');
 linkpdf.innerHTML = 'Download Full Report (pdf)';



dlBtn.appendChild(btnImg);

btnDiv2.appendChild(linkpng);

newDiv.appendChild(dlBtn);
newDiv.appendChild(btnDiv2);

btnDiv.appendChild(newDiv);

};
// dlMap

//cat Output and Download Functions

function getSVGString( svgNode ) {
//Functions to export d3 SVG to PNG for eventual download  http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )

 svgNode.setAttribute('xmlns','http://www.w3.org/2000/svg');
 svgNode.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
 var cssStyleText = getCSSStyles( svgNode );
 appendCSS( cssStyleText, svgNode );

 var serializer = new XMLSerializer();
 var svgString = serializer.serializeToString(svgNode);
 svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
 svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

 return svgString;

 function getCSSStyles( parentElement ) {
  var selectorTextArr = [];

  // Add Parent element Id and Classes to the list
  selectorTextArr.push( '#'+parentElement.id );
  for (var c = 0; c < parentElement.classList.length; c++)
    if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
     selectorTextArr.push( '.'+parentElement.classList[c] );

  // Add Children element Ids and Classes to the list
  var nodes = parentElement.getElementsByTagName("*");
  for (var i = 0; i < nodes.length; i++) {
   var id = nodes[i].id;
   if ( !contains('#'+id, selectorTextArr) )
    selectorTextArr.push( '#'+id );

   var classes = nodes[i].classList;
   for (var c = 0; c < classes.length; c++)
    if ( !contains('.'+classes[c], selectorTextArr) )
     selectorTextArr.push( '.'+classes[c] );
  }

  // Extract CSS Rules
  var extractedCSSText = "";
  for (var i = 0; i < document.styleSheets.length; i++) {
   var s = document.styleSheets[i];
   
   try {
       if(!s.cssRules) continue;
   } catch( e ) {
        if(e.name !== 'SecurityError') throw e; // for Firefox
        continue;
       }

   var cssRules = s.cssRules;
   for (var r = 0; r < cssRules.length; r++) {
    if ( contains( cssRules[r].selectorText, selectorTextArr ) )
     extractedCSSText += cssRules[r].cssText;
   }
  }
  

  return extractedCSSText;

  function contains(str,arr) {
   return arr.indexOf( str ) === -1 ? false : true;
  }

 }

 function appendCSS( cssText, element ) {
  var styleElement = document.createElement("style");
  styleElement.setAttribute("type","text/css"); 
  styleElement.innerHTML = cssText;
  var refNode = element.hasChildNodes() ? element.children[0] : null;
  element.insertBefore( styleElement, refNode );
 }
}
// getSVGString


function svgString2Image( svgString, width, height, format, callback ) {
// Convert SVG string to data URL for download
 var format = format ? format : 'png';

 var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

 var canvas = document.createElement("canvas");
 var context = canvas.getContext("2d");

 canvas.width = width;
 canvas.height = height;

 var image = new Image();
 image.onload = function() {
  context.clearRect ( 0, 0, width, height );
  context.drawImage(image, 0, 0, width, height);

  canvas.toBlob( function(blob) {
   var filesize = Math.round( blob.length/1024 ) + ' KB';
   if ( callback ) callback( blob, filesize );
  });

  
 };

 image.src = imgsrc;
}  
// svgString2Image


function saveSVG(svgdiv) {
//saveSVG  Serializes and outputr SVG in current div (i.e., created by genSel1Map)

   //Serialize svg...
   var svgNode = svgdiv.node();
   var outSVG = getSVGString(svgNode);

return outSVG;
};
// saveSVG

function popGrowthCSV(inData) {
//popGrowthCSV  Generates CSV File for Population Growth Table
		var tblArray = stripHTML(inData);
	//Creating the header
	var newHdr = [""];
	for(i = 0; i < tblArray.length; i++){
		for(j = 0; j < 2; j++){
			 if(tblArray[i][j] != "Estimate") {
				 newHdr.push(tblArray[i][j]);
			 }
		}
	}

	var nelements = tblArray[0].length
	var outtab = [];
	for(a = 0; a < hdrArr.length; a++){
		var outrow = Array(newHdr.length);
	    outrow[0] = hdrArr[a];
		var rowpos = 1;
	for(i = 0; i < tblArray.length; i++){
		for(j = 0; j < tblArray[i].length; j++){
			if(tblArray[i][j] == hdrArr[a]) {
				if(tblArray[i].length == nelements){
					var val1 = tblArray[i][j+1].replace(/\,/g,"")
					var val2 = tblArray[i][j+2].replace(/\,/g,"")
				    outrow[rowpos] = val1;
					rowpos = rowpos + 1;
					outrow[rowpos] = val2;
					rowpos = rowpos + 1;
				} else {
					var val1 = tblArray[i][j+1].replace(/\,/g,"")
				    outrow[rowpos] = val1;
					rowpos = rowpos + 1;
					outrow[rowpos] = " ";
					rowpos = rowpos + 1;
				}
			}
		} //j
	} //i
	outtab.push(outrow)
	} //a
	
	if(newHdr.length != outtab[0].length){
		newHdr.push("");
	}
	outtab.unshift(newHdr);
	
	var finFtr = [];
	for(i = 0; i < outtab[1].length; i++){
		if(i == 0) {
			finFtr.push(ftrArr[0].replace(/\,/g," "));
		} else {
			finFtr.push("");
		}
	}
	outtab.push(finFtr);

   
	
	//Download code 

	var csvContent = "data:text/csv;charset=utf-8," 
    + outtab.map(e => e.join(",")).join("\n");
	
	var csvContent2 = csvContent.replace(/−/g, ' -')
	
	    if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(csvContent2, fileName);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = encodeURI(csvContent2);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
		}
} 
// popGrowthCSV		


function housingTypeCSV(inData,hdrArr) {
//housingTypeCSV  Processes the housing Type CSV Table
		var tblArray = stripHTML(inData)
		var outarr = [];
		var plnames = [];
		for(a = 0; a < tblArray.length; a++){
			//extracting the place names
			var dataStr = tblArray[a]
			for(b = 0; b < 3; b++) {
				if(dataStr[b] != ' ')
				plnames.push(dataStr[b])
			    plnames.push("")
			}
		}
		//Column Names
		var colnames = []
 		for(b = 0; b < plnames.length; b++){
			colnames.push("Estimate")
			colnames.push("Margin of Error");
		}
		
	//processing data records

var tabdata = []
	for(a = 0; a < tblArray.length; a++){
		var tmpdata = new Array(hdrArr.length-1);
		for(b = 0; b <= hdrArr.length; b++){
			tmpdata[b] = new Array(9);
		}
		var datstr = tblArray[a];
		var ALLPOS = datstr.indexOf("All Housing Units");
		var OOPOS = datstr.indexOf("Owner Occupied Housing Units");
		var RENTPOS = datstr.indexOf("Renter Occupied Housing Units");

		var allarr = []
		rowpos = 0
		colpos = 0
		for(c = ALLPOS; c < OOPOS; c++){
			
			if(c == ALLPOS) {
				tmpdata[rowpos][colpos] = datstr[c]
				rowpos = rowpos + 1;
				} else {
//			if(c < ALLPOS + 9) {
//		}

	}
	} //c
	} //a
}
// housingTypeCSV


function plextabCSV(inData,row_labels,ftrArr,fName,tabName) {
//plextabCSV processes datatable elements and produces a CSV File -- used for both Excel and CSV files 

var tabinfo = [{tabName : 'Summary Statistics Table', tabcat: "summary", ncols : 2, hdrCols : ['Estimate', 'Margin of Error']},
			{tabName : 'Population Growth Table', tabcat: "popgrowth",ncols : 1, hdrCols : ['Estimate']},
			{tabName : 'Income Sources Table', tabcat: "incomesrc",ncols : 4, hdrCols : ['Households', 'Margin of Error','Average Income','Margin of Error']},
			{tabName : 'Race and Ethnicity Table', tabcat: "raceeth",ncols : 4, hdrCols : ['Estimate', 'Margin of Error', 'Percent','Margin of Error']},
			{tabName : 'Housing Occupancy and Vacancy Table', tabcat: "houseocc", ncols : 2, hdrCols : ['Estimate', 'Margin of Error']},
			{tabName : 'Housing Type Table', tabcat: "housetype", ncols : 4, hdrCols : ['Estimate', 'Margin of Error', 'Percent', 'Margin of Error']},
			{tabName : 'Housing Cost and Affordability Table', tabcat: "houseecon",ncols : 2, hdrCols : ['Estimate', 'Margin of Error']}
		  ];
		  
//extracting the number of 
var tabInfo = tabinfo.filter(d => tabName.includes(d.tabName));
var tblArray = stripHTML(inData);


var scantab = [];
scantab[0] = tblArray[0].slice()
//checking the length of rows; if all rows are equal than there are even numbers of elements
if(tblArray.length > 1){
	lenStart = tblArray[0].length;
	lenEnd = tblArray[tblArray.length - 1].length
	if(lenStart != lenEnd){
		scantab[1] = tblArray[tblArray.length - 1].slice()
	}
}

//building output array

//number of geographies
var nameArr = [];
switch(tabInfo[0].tabName){
case 'Income Sources Table' :
for(a = 0; a < tblArray.length; a++){
	   if((tblArray[a][0] != "Households") && (tblArray[a][0] != "Margin of Error")){
		   nameArr.push({"Name" : tblArray[a][0], "dataRow" : a});
	   }
	   if((tblArray[a][1] != "Households") && (tblArray[a][1] != "Margin of Error")) {
		   nameArr.push({"Name" : tblArray[a][1], "dataRow" : a});
	   }
	   if((tblArray[a][2] != "Households") && (tblArray[a][2] != "Margin of Error")) {
		   nameArr.push({"Name" : tblArray[a][2], "dataRow" : a});
	   }
}
break;
case 'Housing Type Table' :
	for(a = 0; a < tblArray.length; a++){
	   if((tblArray[a][1] != "Counts") && (tblArray[a][1] != "Percent") && (tblArray[a][1] != "Estimate")) {
		   nameArr.push({"Name" : tblArray[a][1], "dataRow" : a});
	   }
	   if((tblArray[a][3] != "Counts") && (tblArray[a][3] != "Percent") && (tblArray[a][3] != "Estimate")) {
		   nameArr.push({"Name" : tblArray[a][3], "dataRow" : a});
	   }
	   if((tblArray[a][4] != "Counts") && (tblArray[a][4] != "Percent") && (tblArray[a][4] != "Estimate")) {
		   nameArr.push({"Name" : tblArray[a][4], "dataRow" : a});
	   }
}
break;
default :
	for(a = 0; a < tblArray.length; a++){
	   if((tblArray[a][0] != "Estimate") && (tblArray[a][0] != "Margin of Error")){
		   nameArr.push({"Name" : tblArray[a][0], "dataRow" : a});
	   }
	   if((tblArray[a][1] != "Estimate") && (tblArray[a][1] != "Margin of Error")) {
		   nameArr.push({"Name" : tblArray[a][1], "dataRow" : a});
	   }
	   if((tblArray[a][2] != "Estimate") && (tblArray[a][2] != "Margin of Error")) {
		   nameArr.push({"Name" : tblArray[a][2], "dataRow" : a});
	   }
}
break;
}

//figuring out level
if(inData.length > 1) {
	var level = "Region"
	var plName = nameArr[1].Name
} else {
	if(nameArr[0].Name.includes("County")) {
	  var level = "County"
	  var plName = nameArr[0].Name
	} else {
	  var level = "Municipality"
	  var plName = nameArr[0].Name
	}
	
}

if(tabInfo[0].tabName == "Population Growth Table"){
  var nameArrx = nameArr.filter(d => d.Name != '1990');
  nameArr = nameArrx;
}

//Restructuring Creating the number of pages
if(tabInfo[0].tabName == 'Population Growth Table'){
	var npages = Math.ceil((tabInfo[0].ncols * nameArr.length)/7);
	var nrows = row_labels.length + 2;
	var ncols = 8;
} else {
	if(tabInfo[0].ncols == 2){
	var npages = Math.ceil((tabInfo[0].ncols * nameArr.length)/8);
	var ncols = 9;
	}
	if(tabInfo[0].ncols == 4){
	var npages = Math.ceil((tabInfo[0].ncols * nameArr.length)/12);
	var ncols = 13;
	}
	if(tabInfo[0].tabName == 'Housing Type Table'){
		var nrows = ((row_labels.length + 1) * 3) + 3;
	} else {
		var nrows = row_labels.length + 2;
	}
}

// augumenting nameArr -- nameArr2 will be recreated for the Housing Type Table

var nameArr2 = [];
var pgval = 0;
var outStart = 1;
var outEnd = outStart + (tabInfo[0].ncols - 1)

for(x = 0; x < nameArr.length; x++){
		if((scantab.length == 2) && (x == (nameArr.length - 1))) { //The last one in the series
			   for(y = 0; y < row_labels.length;y++){
			   //Creating instart and inend values
					 for(c = 0; c < scantab[1].length; c++){
						if(scantab[1][c] == row_labels[y]){
							inStart = c + 1;
							inEnd = inStart + (tabInfo[0].ncols - 1);
						}
					 } //c
				nameArr2.push({"name" : nameArr[x].Name, "dataName" : row_labels[y], "dataRow" : nameArr[x].dataRow,
					"inStart" : inStart, "inEnd" : inEnd,
				"outPg" : pgval, "outRow" : y + 2, "outStart" : outStart, "outEnd" : outEnd});
		   } //y
		} else {
		   for(y = 0; y < row_labels.length;y++){
			   //Creating instart and inend values
					 for(c = 0; c < scantab[0].length; c++){
						if(scantab[0][c] == row_labels[y]){
							inStart = c + 1;
							inEnd = inStart + (tabInfo[0].ncols - 1);
						}
					 } //c
				nameArr2.push({"name" : nameArr[x].Name, "dataName" : row_labels[y], "dataRow" : nameArr[x].dataRow,
					"inStart" : inStart, "inEnd" : inEnd,
					"outPg" : pgval, "outRow" : y + 2, "outStart" : outStart, "outEnd" : outEnd});
		   } //y
		}

   var outStart = outStart + tabInfo[0].ncols 
   var outEnd = outStart + (tabInfo[0].ncols - 1)
   //Page Updates
   switch(tabInfo[0].ncols){
	   case 1 :
	   if((x > 0) && (x % 7 == 0)) {
		 pgval++
	    var outStart = 1
	    var outEnd = outStart + (tabInfo[0].ncols - 1)
	   }
	   break;
      case 2: 
	  if((x == 3) || (x == 7)) {
	   pgval++
	   var outStart = 1
	   var outEnd = outStart + (tabInfo[0].ncols - 1)
      }
    break;
	case 4: 
	if(outStart > 12) {
	   pgval++
	   var outStart = 1
	   var outEnd = outStart + (tabInfo[0].ncols - 1)
      }
	  break;
   } //switch
}  //x

//Fixing inStart and inEnd

var rowVar = 0;
var curRow = 0;
for(a = 0; a < nameArr2.length; a++){
	if(nameArr2[a].dataRow == rowVar){
		if(curRow > (row_labels.length - 1)){
			var stval = nameArr2[a].inStart + tabInfo[0].ncols;
			var endval = nameArr2[a].inEnd + tabInfo[0].ncols
			nameArr2[a].inStart = stval;
			nameArr2[a].inEnd = endval;
		}
		curRow++
	} else {
	rowVar++
	var curRow = 1;
	}
}

//Place header
var arridx = 0;
var hdrArr = [];
hdrArr.push({'name' : nameArr2[arridx].name, 'outPg' : nameArr2[arridx].outPg, 'outStart' : nameArr2[arridx].outStart});

for(x = 0; x < nameArr2.length;x++){
	if(hdrArr[arridx].name != nameArr2[x].name) {
		hdrArr.push({'name' : nameArr2[x].name, 'outPg' : nameArr2[x].outPg, 'outStart' : nameArr2[x].outStart});
		arridx++;
    }
}


//Special creaton of nameArr2 for Housing Type Table
//Redoing nameArr2 for Housing Type Table
if(tabInfo[0].tabName == 'Housing Type Table'){
	var housingtype = ["All Housing Units", "Owner-Occupied Housing Units", "Rental Housing Units"]
	var nameArr2 = [];

if(level == "Municipality"){ //The length of a municipal data pull
	for(a = 0; a < housingtype.length; a++){
	switch(a){
		case 0:
		var outRow = 4;
		var inStart = 25;
		break;
		case 1:
		var outRow = 13;
		var inStart = 130;
		break;
		case 2:
		var outRow = 22;
		var inStart = 235;
		break;
	}
	var outEnd = outStart + (tabInfo[0].ncols - 1)
	for(b = 0; b < row_labels.length; b++){
		for(c = 0; c < hdrArr.length; c++){
			switch(c) {
				case 0:
				var outStart = 1;
				break;
				case 1:
				var outStart = 5;
				break;
				case 2:
				var outStart = 9
				break;
			}
			var outEnd = outStart + (tabInfo[0].ncols - 1)
			var inEnd = inStart + (tabInfo[0].ncols - 1)
			
			nameArr2.push({"name" : hdrArr[c].name, "housetype" : housingtype[a], "dataName" : row_labels[b], "dataRow" : 0,
						"inStart" : inStart, "inEnd" : inEnd,
						"outPg" : hdrArr[c].outPg, "outRow" : outRow, "outStart" : outStart, "outEnd" : outEnd});
			inStart = inStart + tabInfo[0].ncols;
		} //c
		inStart++
		outRow++
	} //b
	} //a
	} else {
	for(a = 0; a < hdrArr.length; a++){
	for(b = 0; b < housingtype.length; b++){
		if(scantab.length == 2 && a == hdrArr.length - 1){
			switch(b){  //the short record
				case 0:
				var outRow = 4;
				var inStart = 17;
				break;
				case 1:
				var outRow = 13;
				var inStart = 58;
				break;
				case 2:
				var outRow = 22;
				var inStart = 99
				break;
			}
		} else {
			switch(b){
				case 0:
				var outRow = 4;
				var inStart = 18;
				break;
				case 1:
				var outRow = 13;
				var inStart = 91;
				break;
				case 2:
				var outRow = 22;
				var inStart = 164;
				break;
			}
		if(hdrArr[a].outStart == 5) {
			inStart = 22;
		}
		}
		for(c = 0; c < row_labels.length; c++){
			var inEnd = inStart + (tabInfo[0].ncols - 1)
			var outEnd = hdrArr[a].outStart + (tabInfo[0].ncols - 1)
			nameArr2.push({"name" : hdrArr[a].name, "housetype" : housingtype[b], "dataName" : row_labels[c], "dataRow" : nameArr[a].dataRow,
						"inStart" : inStart, "inEnd" : inEnd,
						"outPg" : hdrArr[a].outPg, "outRow" : outRow, "outStart" : hdrArr[a].outStart, "outEnd" : outEnd});
			if(scantab.length == 2 && a == hdrArr.length - 1){
				inStart = inStart + (tabInfo[0].ncols + 1);
			} else {
				inStart = inStart + (tabInfo[0].ncols * 2) + 1;
			}
			outRow++;
	} //c
	} //b
} //a
}
	}

//Output

var outArr = [];
switch(tabInfo[0].tabName){
 case "Housing Type Table" :
    nameArr2.forEach(d => {
	 outArr.push({ "NAME" : d.name, "HOUSING_TYPE" : d.housetype, "CATEGORY" : d.dataName, "COUNTS" : tblArray[d.dataRow][d.inStart], "MARGIN_OF_ERROR" : tblArray[d.dataRow][d.inStart+1],
	               "PERCENT" : tblArray[d.dataRow][d.inStart+2], "MARGIN_OF_ERROR " : tblArray[d.dataRow][d.inStart+3]})
})
break;
case "Population Growth Table" :
nameArr2.forEach(d => { 
        var outval = tblArray[d.dataRow][d.inStart].replace(/−/g, ' -')
		outArr.push({ "NAME" : d.name, "CATEGORY" : d.dataName, "ESTIMATE" : outval})
})			

break;
case "Income Sources Table" :
for(x = 0; x < nameArr2.length; x++){
		outArr.push({ "NAME" : nameArr2[x].name, "CATEGORY" : nameArr2[x].dataName, "HOUSEHOLDS" : tblArray[nameArr2[x].dataRow][nameArr2[x].inStart], "MARGIN_OF_ERROR" :tblArray[nameArr2[x].dataRow][nameArr2[x].inStart+1], 
		              "AVERAGE_INCOME" : tblArray[nameArr2[x].dataRow][nameArr2[x].inStart+2], "MARGIN_OF_ERROR " :tblArray[nameArr2[x].dataRow][nameArr2[x].inStart+3]})
}			
break;
case "Race and Ethnicity Table" :
for(x = 0; x < nameArr2.length; x++){
		outArr.push({ "NAME" : nameArr2[x].name, "CATEGORY" : nameArr2[x].dataName, "ESTIMATE" : tblArray[nameArr2[x].dataRow][nameArr2[x].inStart], "MARGIN_OF_ERROR" :tblArray[nameArr2[x].dataRow][nameArr2[x].inStart+1], 
		              "PERCENTAGE" : tblArray[nameArr2[x].dataRow][nameArr2[x].inStart+2], "MARGIN_OF_ERROR " :tblArray[nameArr2[x].dataRow][nameArr2[x].inStart+3]})
}			
break;
default :
    nameArr2.forEach(d => {
	 outArr.push({ "NAME" : d.name, "CATEGORY" : d.dataName, "ESTIMATE" : tblArray[d.dataRow][d.inStart], "MARGIN_OF_ERROR" : tblArray[d.dataRow][d.inEnd]})
})
break;
} //switch

exportToCsv(plName, tabInfo[0].tabcat, outArr,0);
} 
// plextabCSV


function genplexTab(inData,hdrArr,ftrArr,fName,fmt,tabType) {
//genplexTab is a wrapper function that sends datatable elements out to file download functions plextabWord, plextabPDF, plextabCSV 
   switch(fmt) {
    case "word":
	debugger
       plextabWord(inData,hdrArr,ftrArr,fName,tabType);
    break;
    case "pdf" :
       plextabPDF(inData,hdrArr,ftrArr,fName,tabType);
    break;
   case "xlsx" :
      plextabCSV(inData,hdrArr,ftrArr,fName,tabType);
    break;
   case "csv" :
      plextabCSV(inData,hdrArr,ftrArr,fName,tabType);
    break;
   };
} 
// genplexTab

//cat Main UI Functions
function genProfile(lvl,fipsArr,valSec, names, acsyr) {
//genProfile is the main UI Generation function, calls each panel function
var descript = "Colorado Demographic Profile "+ lvl + ": ";
 descript = descript + names[0];

for(i = 1; i < names.length; i++){
   descript = descript + ", " + names[i];
};

const regList = ['Region', 'Regional Comparison'];
const ctyList = ['County', 'County Comparison'];
const muniList = ['Municipality', 'Municipal Comparison'];
const placeList = ['Census Designated Place', 'Census Designated Place Comparison'];


//Defining the output p[anels
var PROFILE_1 = document.getElementById('profile-content1');
var PROFILE_2 = document.getElementById('profile-content2');
var PROFILE_3 = document.getElementById('profile-content3');
var PROFILE_4 = document.getElementById('profile-content4');
  

//Selecting Maximum Year and acsyr
var yrstr = "https://gis.dola.colorado.gov/lookups/componentYRS";
d3.json(yrstr).then(function(yeardata){
    var maxest = yeardata.filter(function(d){return d.datatype == 'Estimate'});
 var yrsList = maxest.map(function(d){return d.year;});
    var curyear = d3.max(yrsList);


//Triggering the first button  Expand these for each button...
var firstbtn = valSec[0];
if(firstbtn == 'sel1') {
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel1display(lvl, fipsArr, names, curyear, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
};

 //Need to export final description, svg and datatable here
  
//Population Trends Button
if(firstbtn == 'sel2') { 
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel2display(lvl, fipsArr, names, curyear, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
}

//Age Panel button
if(firstbtn == 'sel3') { 
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   if(muniList.includes(lvl)) {
         genSel3display(lvl, fipsArr, names, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
   } else {
      genSel3display(lvl, fipsArr, names, curyear, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
   }
}

//Income, Educ, Race Panel button
if(firstbtn == 'sel4') { 
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel4display(lvl, fipsArr, names, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
}

//Housing and Households button
if(firstbtn == 'sel5') { 
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel5display(lvl, fipsArr, names, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
}

//Commuting button
if(firstbtn == 'sel6') { 
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel6display(lvl, fipsArr, names, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
}

//Setting Event Listeners  For a click on a section button...
document.getElementById("sel1btn").addEventListener("click", function() {
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel1display(lvl, fipsArr, names, curyear, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
     }); //end of sel1btn listener
  
document.getElementById("sel2btn").addEventListener("click", function() {
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel2display(lvl, fipsArr, names, curyear, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
}); //end of sel2btn listener

document.getElementById("sel3btn").addEventListener("click", function() {
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   if(muniList.includes(lvl)) {
         genSel3display(lvl, fipsArr, names, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
   } else {
      genSel3display(lvl, fipsArr, names, curyear, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
   }
}); //end of sel3btn listener

//Income, Educ, Race Panel button
document.getElementById("sel4btn").addEventListener("click", function() {
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel4display(lvl, fipsArr, names, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
}); //end of sel4btn listener

//Housing and Households Panel button
document.getElementById("sel5btn").addEventListener("click", function() {
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel5display(lvl, fipsArr, names, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
}); //end of sel5btn listener

//Commuting Panel button
document.getElementById("sel6btn").addEventListener("click", function() {
   PROFILE_1.innerHTML = "";
   PROFILE_2.innerHTML = "";
   PROFILE_3.innerHTML = "";
   PROFILE_4.innerHTML = "";
   genSel6display(lvl, fipsArr, names, acsyr, PROFILE_1, PROFILE_2, PROFILE_3, PROFILE_4);
}); //end of sel6btn listener


}); //End of Promise 
}; 
// genProfile
 
 
//cat ACS Table Functions

 function gen_occ_tab(occ_tab, vac_tab, vacelse_tab, geotype){
//gen_occ_tab Combines Variables for  ACS Housing Occupancy Table
	 
     var out_tab = []
	 for(i = 0; i< occ_tab.length;i++){
		 out_tab.push({
			"FIPS" : geotype == 'state' ? occ_tab[i].GEO1 : occ_tab[i].GEO2,
			"NAME" : occ_tab[i].NAME,
			"TOTALHU_E" : 	occ_tab[i].B25002_001E,
			"TOTALHU_M" : 	geotype == 'Region' ? Math.pow(occ_tab[i].B25002_001M,2) : occ_tab[i].B25002_001M,
			"OCCHU_E" : 	occ_tab[i].B25002_002E,
			"OCCHU_M" : 	geotype == 'Region' ? Math.pow(occ_tab[i].B25002_002M,2) : occ_tab[i].B25002_002M,
			"VACHU_E" : 	occ_tab[i].B25002_003E,
			"VACHU_M" : 	geotype == 'Region' ? Math.pow(occ_tab[i].B25002_003M,2) : occ_tab[i].B25002_003M,
			"VAC_SALERENT_E" : 	vac_tab[i].B25004_002E + vac_tab[i].B25004_004E,
			"VAC_SALERENT_M" : 	geotype == 'Region' ? Math.pow(vac_tab[i].B25004_002M,2) + Math.pow(vac_tab[i].B25004_004M,2) : Math.sqrt(Math.pow(vac_tab[i].B25004_002M,2) + Math.pow(vac_tab[i].B25004_004M,2)),
			"VAC_SOLDRENTED_E" : 	vac_tab[i].B25004_003E + vac_tab[i].B25004_005E,
			"VAC_SOLDRENTED_M" : geotype == 'Region' ? Math.pow(vac_tab[i].B25004_003M,2) + Math.pow(vac_tab[i].B25004_005M,2) : Math.sqrt(Math.pow(vac_tab[i].B25004_003M,2) + Math.pow(vac_tab[i].B25004_005M,2)),
			"VAC_SEASONAL_E" : 	vac_tab[i]. B25004_006E,
			"VAC_SEASONAL_M" : 	geotype == 'Region' ? Math.pow(vac_tab[i]. B25004_006M,2) : vac_tab[i]. B25004_006M,	
			"VAC_ELSEWHERE_E" : 	vacelse_tab[i].B25005_002E	,
			"VAC_ELSEWHERE_M" : geotype == 'Region' ? Math.pow(vacelse_tab[i].B25005_002M,2) : vacelse_tab[i].B25005_002M,
			"VAC_MIGRANT_E" : 	vac_tab[i].B25004_007E,
			"VAC_MIGRANT_M" : 	geotype == 'Region' ? Math.pow(vac_tab[i].B25004_007M,2) : vac_tab[i].B25004_007M,
			"VAC_OTHER_E" : 	vac_tab[i].B25004_008E,
			"VAC_OTHER_M" : 	geotype == 'Region' ? Math.pow(vac_tab[i].B25004_008M,2) : vac_tab[i].B25004_008M
		 })
	 }

return(out_tab)
 } 
//gen_occ_tab
 

function gen_str_unit(str_tab,geotype){
 //gen_str_unit Combines Housing Unit Variables for  ACS Units and Population by Tenure tab
	 var out_tab = []
	 for(i = 0; i< str_tab.length;i++){
		OOHU_E = str_tab[i].B25032_002E;
		OOHU_M =  Math.pow(str_tab[i].B25032_002M,2);
		OOSFU_E = str_tab[i].B25032_003E + str_tab[i].B25032_004E;
		OOSFU_M = Math.pow(str_tab[i].B25032_003M,2) + Math.pow(str_tab[i].B25032_004M,2);
		OO24_E = str_tab[i].B25032_005E + str_tab[i].B25032_006E;
		OO24_M = Math.pow(str_tab[i].B25032_005M,2) + Math.pow(str_tab[i].B25032_006M,2);
		OO550_E = str_tab[i].B25032_007E + str_tab[i].B25032_008E + str_tab[i].B25032_009E + str_tab[i].B25032_010E;
		OO550_M = Math.pow(str_tab[i].B25032_007M,2) + Math.pow(str_tab[i].B25032_008M,2) + Math.pow(str_tab[i].B25032_009M,2) + Math.pow(str_tab[i].B25032_010M,2);
		OOMOB_E = str_tab[i].B25032_011E;
		OOMOB_M = Math.pow(str_tab[i].B25032_011M,2);
		OOOTH_E = str_tab[i].B25032_012E;
		OOOTH_M = Math.pow(str_tab[i].B25032_012M,2);

		RTHU_E = str_tab[i].B25032_013E;
		RTHU_M = Math.pow(str_tab[i].B25032_013M,2);
		RTSFU_E = str_tab[i].B25032_014E + str_tab[i].B25032_015E;
		RTSFU_M = Math.pow(str_tab[i].B25032_014M,2) + Math.pow(str_tab[i].B25032_015M,2);
		RT24_E = str_tab[i].B25032_016E + str_tab[i].B25032_017E;
		RT24_M = Math.pow(str_tab[i].B25032_016M,2) + Math.pow(str_tab[i].B25032_017M,2);
		RT550_E = str_tab[i].B25032_018E + str_tab[i].B25032_019E + str_tab[i].B25032_020E + str_tab[i].B25032_021E;
		RT550_M = Math.pow(str_tab[i].B25032_018M,2) + Math.pow(str_tab[i].B25032_019M,2) + Math.pow(str_tab[i].B25032_020M,2) + Math.pow(str_tab[i].B25032_021M,2);
		RTMOB_E = str_tab[i].B25032_022E;
		RTMOB_M = Math.pow(str_tab[i].B25032_022M,2);
		RTOTH_E = str_tab[i].B25032_023E;
		RTOTH_M = Math.pow(str_tab[i].B25032_023M,2);

		ALLHU_E = OOHU_E + RTHU_E;
		ALLHU_M = Math.pow(str_tab[i].B25032_001M,2);
		ALLSFU_E = OOSFU_E + RTSFU_E;
		ALLSFU_M = OOSFU_M + RTSFU_M;
		ALL24_E = OO24_E + RT24_E;
		ALL24_M = OO24_M + RT24_M;
		ALL550_E = OO550_E + RT550_E;
		ALL550_M = OO550_M + RT550_M;
		ALLMOB_E = OOMOB_E + RTMOB_E;
		ALLMOB_M = OOMOB_M + RTMOB_M;
		ALLOTH_E = OOOTH_E + RTOTH_E;
		ALLOTH_M = OOOTH_M + RTOTH_M;
		
		if(geotype == "Region"){
			out_tab.push({
				"FIPS" : str_tab[i].GEO2,
			    "NAME" : str_tab[i].NAME,
				"ALLHU_E" : ALLHU_E ,
				"ALLHU_M" : ALLHU_M ,
				"ALLSFU_E" : ALLSFU_E ,
				"ALLSFU_M" : ALLSFU_M ,
				"ALL24_E" : ALL24_E ,
				"ALL24_M" : ALL24_M ,
				"ALL550_E" : ALL550_E ,
				"ALL550_M" : ALL550_M ,
				"ALLMOB_E" : ALLMOB_E ,
				"ALLMOB_M" : ALLMOB_M ,
				"ALLOTH_E" : ALLOTH_E ,
				"ALLOTH_M" : ALLOTH_M ,
				"OOHU_E" : OOHU_E ,
				"OOHU_M" : OOHU_M ,
				"OOSFU_E" : OOSFU_E ,
				"OOSFU_M" : OOSFU_M ,
				"OO24_E" : OO24_E ,
				"OO24_M" : OO24_M ,
				"OO550_E" : OO550_E ,
				"OO550_M" : OO550_M ,
				"OOMOB_E" : OOMOB_E ,
				"OOMOB_M" : OOMOB_M ,
				"OOOTH_E" : OOOTH_E ,
				"OOOTH_M" : OOOTH_M ,
				"RTHU_E" : RTHU_E ,
				"RTHU_M" : RTHU_M ,
				"RTSFU_E" : RTSFU_E ,
				"RTSFU_M" : RTSFU_M ,
				"RT24_E" : RT24_E ,
				"RT24_M" : RT24_M ,
				"RT550_E" : RT550_E ,
				"RT550_M" : RT550_M ,
				"RTMOB_E" : RTMOB_E ,
				"RTMOB_M" : RTMOB_M ,
				"RTOTH_E" : RTOTH_E ,
				"RTOTH_M" : RTOTH_M });
		} else {
			out_tab.push({
				"FIPS" : geotype == "state" ? str_tab[i].GEO1 : str_tab[i].GEO2,
			    "NAME" : str_tab[i].NAME,
				"ALLHU_E" : ALLHU_E ,
				"ALLHU_M" :  ALLHU_M,
				"ALLSFU_E" : ALLSFU_E ,
				"ALLSFU_M" : ALLSFU_M,
				"ALL24_E" : ALL24_E ,
				"ALL24_M" :  ALL24_M,
				"ALL550_E" : ALL550_E ,
				"ALL550_M" :  ALL550_M,
				"ALLMOB_E" : ALLMOB_E ,
				"ALLMOB_M" :  ALLMOB_M,
				"ALLOTH_E" : ALLOTH_E ,
				"ALLOTH_M" :  ALLOTH_M,
				"OOHU_E" : OOHU_E ,
				"OOHU_M" :  OOHU_M,
				"OOSFU_E" : OOSFU_E ,
				"OOSFU_M" :  OOSFU_M,
				"OO24_E" : OO24_E ,
				"OO24_M" :  OO24_M,
				"OO550_E" : OO550_E ,
				"OO550_M" :  OO550_M,
				"OOMOB_E" : OOMOB_E ,
				"OOMOB_M" : OOMOB_M,
				"OOOTH_E" : OOOTH_E ,
				"OOOTH_M" :  OOOTH_M,
				"RTHU_E" : RTHU_E ,
				"RTHU_M" :  RTHU_M,
				"RTSFU_E" : RTSFU_E ,
				"RTSFU_M" : RTSFU_M,
				"RT24_E" : RT24_E ,
				"RT24_M" :  RT24_M,
				"RT550_E" : RT550_E ,
				"RT550_M" :  RT550_M,
				"RTMOB_E" : RTMOB_E ,
				"RTMOB_M" : RTMOB_M,
				"RTOTH_E" : RTOTH_E ,
				"RTOTH_M" :  RTOTH_M
				})
		}
	 } //I
return(out_tab)
 } 
//gen_str_unit
 
  
function gen_str_pop(str_tab,geotype){
//gen_str_pop Combines population Variables for  ACS Units and Population by Tenure tab
	 var out_tab = []
	 for(i = 0; i< str_tab.length;i++){
		OOHU_E = str_tab[i].B25033_002E;
		OOHU_M =  Math.pow(str_tab[i].B25033_002M,2);
		OOSFU_E = str_tab[i].B25033_003E 
		OOSFU_M = Math.pow(str_tab[i].B25033_003M,2);
		OO24_E = str_tab[i].B25033_004E;
		OO24_M = Math.pow(str_tab[i].B25033_004M,2);
		OO550_E = str_tab[i].B25033_005E 
		OO550_M = Math.pow(str_tab[i].B25033_005M,2);
		OOMOB_E = str_tab[i].B25033_006E;
		OOMOB_M = Math.pow(str_tab[i].B25033_006M,2);
		OOOTH_E = str_tab[i].B25033_007E;
		OOOTH_M = Math.pow(str_tab[i].B25033_007M,2);

		RTHU_E = str_tab[i].B25033_008E;
		RTHU_M = Math.pow(str_tab[i].B25033_008M,2);
		RTSFU_E = str_tab[i].B25033_009E;
		RTSFU_M = Math.pow(str_tab[i].B25033_009M,2);
		RT24_E = str_tab[i].B25033_010E;
		RT24_M = Math.pow(str_tab[i].B25033_010M,2);
		RT550_E = str_tab[i].B25033_011E;
		RT550_M = Math.pow(str_tab[i].B25033_011M,2);
		RTMOB_E = str_tab[i].B25033_012E;
		RTMOB_M = Math.pow(str_tab[i].B25033_012M,2);
		RTOTH_E = str_tab[i].B25033_013E;
		RTOTH_M = Math.pow(str_tab[i].B25033_013M,2);

		ALLHU_E = OOHU_E + RTHU_E;
		ALLHU_M = Math.pow(str_tab[i].B25033_001M,2);
		ALLSFU_E = OOSFU_E + RTSFU_E;
		ALLSFU_M = OOSFU_M + RTSFU_M;
		ALL24_E = OO24_E + RT24_E;
		ALL24_M = OO24_M + RT24_M;
		ALL550_E = OO550_E + RT550_E;
		ALL550_M = OO550_M + RT550_M;
		ALLMOB_E = OOMOB_E + RTMOB_E;
		ALLMOB_M = OOMOB_M + RTMOB_M;
		ALLOTH_E = OOOTH_E + RTOTH_E;
		ALLOTH_M = OOOTH_M + RTOTH_M;
		
		if(geotype == "Region"){
			out_tab.push({
				"FIPS" : str_tab[i].GEO2,
			    "NAME" : str_tab[i].NAME,
				"ALLHU_E" : ALLHU_E ,
				"ALLHU_M" : ALLHU_M ,
				"ALLSFU_E" : ALLSFU_E ,
				"ALLSFU_M" : ALLSFU_M ,
				"ALL24_E" : ALL24_E ,
				"ALL24_M" : ALL24_M ,
				"ALL550_E" : ALL550_E ,
				"ALL550_M" : ALL550_M ,
				"ALLMOB_E" : ALLMOB_E ,
				"ALLMOB_M" : ALLMOB_M ,
				"ALLOTH_E" : ALLOTH_E ,
				"ALLOTH_M" : ALLOTH_M ,
				"OOHU_E" : OOHU_E ,
				"OOHU_M" : OOHU_M ,
				"OOSFU_E" : OOSFU_E ,
				"OOSFU_M" : OOSFU_M ,
				"OO24_E" : OO24_E ,
				"OO24_M" : OO24_M ,
				"OO550_E" : OO550_E ,
				"OO550_M" : OO550_M ,
				"OOMOB_E" : OOMOB_E ,
				"OOMOB_M" : OOMOB_M ,
				"OOOTH_E" : OOOTH_E ,
				"OOOTH_M" : OOOTH_M ,
				"RTHU_E" : RTHU_E ,
				"RTHU_M" : RTHU_M ,
				"RTSFU_E" : RTSFU_E ,
				"RTSFU_M" : RTSFU_M ,
				"RT24_E" : RT24_E ,
				"RT24_M" : RT24_M ,
				"RT550_E" : RT550_E ,
				"RT550_M" : RT550_M ,
				"RTMOB_E" : RTMOB_E ,
				"RTMOB_M" : RTMOB_M ,
				"RTOTH_E" : RTOTH_E ,
				"RTOTH_M" : RTOTH_M });
		} else {
			out_tab.push({
				"FIPS" : geotype == "state" ? str_tab[i].GEO1 : str_tab[i].GEO2,
			    "NAME" : str_tab[i].NAME,
				"ALLHU_E" : ALLHU_E ,
				"ALLHU_M" :  ALLHU_M,
				"ALLSFU_E" : ALLSFU_E ,
				"ALLSFU_M" :  ALLSFU_M,
				"ALL24_E" : ALL24_E ,
				"ALL24_M" :  ALL24_M,
				"ALL550_E" : ALL550_E ,
				"ALL550_M" :  ALL550_M,
				"ALLMOB_E" : ALLMOB_E ,
				"ALLMOB_M" :  ALLMOB_M,
				"ALLOTH_E" : ALLOTH_E ,
				"ALLOTH_M" :  ALLOTH_M,
				"OOHU_E" : OOHU_E ,
				"OOHU_M" :  OOHU_M,
				"OOSFU_E" : OOSFU_E ,
				"OOSFU_M" :  OOSFU_M,
				"OO24_E" : OO24_E ,
				"OO24_M" :  OO24_M,
				"OO550_E" : OO550_E ,
				"OO550_M" :  OO550_M,
				"OOMOB_E" : OOMOB_E ,
				"OOMOB_M" :  OOMOB_M,
				"OOOTH_E" : OOOTH_E ,
				"OOOTH_M" :  OOOTH_M,
				"RTHU_E" : RTHU_E ,
				"RTHU_M" :  RTHU_M,
				"RTSFU_E" : RTSFU_E ,
				"RTSFU_M" :  RTSFU_M,
				"RT24_E" : RT24_E ,
				"RT24_M" :  RT24_M,
				"RT550_E" : RT550_E ,
				"RT550_M" :  RT550_M,
				"RTMOB_E" : RTMOB_E ,
				"RTMOB_M" :  RTMOB_M,
				"RTOTH_E" : RTOTH_E ,
				"RTOTH_M" :  RTOTH_M
			})
		}
	 } //I
return(out_tab)
 } //gen_str_pop
 

 function genTenureTab(unitTab,yrTab,popTab,pphTab){
 //genTenureTab  Generates the final Tenure tab data 
 
 var varname = Object.keys(unitTab[0]);
 varname.splice(0,2);

 var outData = [];

 for(i = 0; i < unitTab.length; i++){
	  var unitdata  = unitTab[i];
	  var popdata = popTab[i];
	  //Values for median year of construction and pph
		var  ALL_MEDYR_E =  "";
		var  ALL_MEDYR_M =  "";
		var  OO_MEDYR_E =  "";
		var  OO_MEDYR_M =  "";
		var  RT_MEDYR_E =  "";
		var  RT_MEDYR_M =  "";
		  
		var  ALL_PPH_E =  "";
		var  ALL_PPH_M =  "";
		var  OO_PPH_E =  "";
		var  OO_PPH_M =  "";
		var  RT_PPH_E =  "";
		var  RT_PPH_M =  "";
		  if(unitdata.FIPS == 8){
			  ALL_MEDYR_E =  yrTab[0].B25037_001E;
			  ALL_MEDYR_M =  yrTab[0].B25037_001M;
			  OO_MEDYR_E =  yrTab[0].B25037_002E;
			  OO_MEDYR_M =  yrTab[0].B25037_002M;
			  RT_MEDYR_E =  yrTab[0].B25037_003E;
			  RT_MEDYR_M =  yrTab[0].B25037_003M;
			  
			  ALL_PPH_E =  pphTab[0].B25010_001E;
			  ALL_PPH_M =  pphTab[0].B25010_001M;
			  OO_PPH_E =  pphTab[0].B25010_002E;
			  OO_PPH_M =  pphTab[0].B25010_002M;
			  RT_PPH_E =  pphTab[0].B25010_003E;
			  RT_PPH_M =  pphTab[0].B25010_003M;
		  } else {
			  var medyrfilt = yrTab.filter(d => d.GEO2 == unitdata.FIPS);
			  var pphfilt = pphTab.filter(d => d.GEO2 == unitdata.FIPS);

			  ALL_MEDYR_E =  medyrfilt[0].B25037_001E;
			  ALL_MEDYR_M =  medyrfilt[0].B25037_001M;
			  OO_MEDYR_E =  medyrfilt[0].B25037_002E;
			  OO_MEDYR_M =  medyrfilt[0].B25037_002M;
			  RT_MEDYR_E =  medyrfilt[0].B25037_003E;
			  RT_MEDYR_M =  medyrfilt[0].B25037_003M;
			  
			  ALL_PPH_E =  pphfilt[0].B25010_001E;
			  ALL_PPH_M =  pphfilt[0].B25010_001M;
			  OO_PPH_E =  pphfilt[0].B25010_002E;
			  OO_PPH_M =  pphfilt[0].B25010_002M;
			  RT_PPH_E =  pphfilt[0].B25010_003E;
			  RT_PPH_M =  pphfilt[0].B25010_003M;
		  }

	  var ALL_UNIT_E = unitdata.ALLHU_E;
	  var ALL_UNIT_M = unitdata.ALLHU_M;
	  var ALL_POP_E = popdata.ALLHU_E;
	  var ALL_POP_M = popdata.ALLHU_M;
	  	  
	  var OO_UNIT_E = unitdata.OOHU_E;
	  var OO_UNIT_M = unitdata.OOHU_M;
	  var OO_POP_E = popdata.OOHU_E;
	  var OO_POP_M = popdata.OOHU_M;
	  	  
	  var RT_UNIT_E = unitdata.RTHU_E;
	  var RT_UNIT_M = unitdata.RTHU_M;
	  var RT_POP_E = popdata.RTHU_E;
	  var RT_POP_M = popdata.RTHU_M;
	  
	  for (j = 0; j < varname.length;j += 2){
		  if(j <= 10){
		  	   var UNIT_EST = unitdata[varname[j]]
			   var UNIT_MOE = unitdata[varname[j+1]];
			   var UNIT_PCT_EST = unitdata[varname[j]]/ALL_UNIT_E;
			   var UNIT_PCT_MOE = acsPctMOE(ALL_UNIT_E,ALL_UNIT_M,UNIT_PCT_EST,UNIT_MOE);
 			   var POP_EST = popdata[varname[j]];
			   var POP_MOE = popdata[varname[j+1]];
			   var POP_PCT_EST = popdata[varname[j]]/ALL_POP_E;
			   var POP_PCT_MOE = acsPctMOE(ALL_POP_E,ALL_POP_M,POP_PCT_EST,POP_MOE);
		  } 
		  if(j > 10 && j <= 22){
		  	   var UNIT_EST = unitdata[varname[j]]
			   var UNIT_MOE = unitdata[varname[j+1]];
			   var UNIT_PCT_EST = unitdata[varname[j]]/OO_UNIT_E;
			   var UNIT_PCT_MOE = acsPctMOE(OO_UNIT_E,OO_UNIT_M,UNIT_PCT_EST,UNIT_MOE);
 			   var POP_EST = popdata[varname[j]];
			   var POP_MOE = popdata[varname[j+1]];
			   var POP_PCT_EST = popdata[varname[j]]/OO_POP_E;
			   var POP_PCT_MOE = acsPctMOE(OO_POP_E,OO_POP_M,POP_PCT_EST,POP_MOE);
		  } 
		  if(j > 22){
		  	   var UNIT_EST = unitdata[varname[j]]
			   var UNIT_MOE = unitdata[varname[j+1]];
			   var UNIT_PCT_EST = unitdata[varname[j]]/RT_UNIT_E;
			   var UNIT_PCT_MOE = acsPctMOE(RT_UNIT_E,RT_UNIT_M,UNIT_PCT_EST,UNIT_MOE);
 			   var POP_EST = popdata[varname[j]];
			   var POP_MOE = popdata[varname[j+1]];
			   var POP_PCT_EST = popdata[varname[j]]/RT_POP_E;
			   var POP_PCT_MOE = acsPctMOE(RT_POP_E,RT_POP_M,POP_PCT_EST,POP_MOE);
		  } 
		  //Creating output
          switch(j) {
			case 10: {
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : varname[j],
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
			 //Output Median year of construction
			   var UNIT_EST = ALL_MEDYR_E;
			   var UNIT_MOE = ALL_MEDYR_M; 
			   var UNIT_PCT_EST = ""
			   var UNIT_PCT_MOE = "";
 			   var POP_EST = ""
			   var POP_MOE = "";
			   var POP_PCT_EST = "";
			   var POP_PCT_MOE = "";
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : "ALLMEDYR_E",
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
			 //Output persons per household
			   var UNIT_EST = ""
			   var UNIT_MOE = ""; 
			   var UNIT_PCT_EST = ""
			   var UNIT_PCT_MOE = "";
 			   var POP_EST = ALL_PPH_E
			   var POP_MOE = ALL_PPH_M;
			   var POP_PCT_EST = "";
			   var POP_PCT_MOE = "";
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : "ALL_PPH_E",
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
		  } // Case 10
		  break;
		  case 22: {
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : varname[j],
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
			 //Output Median year of construction
			   var UNIT_EST = OO_MEDYR_E;
			   var UNIT_MOE = OO_MEDYR_M; 
			   var UNIT_PCT_EST = ""
			   var UNIT_PCT_MOE = "";
 			   var POP_EST = ""
			   var POP_MOE = "";
			   var POP_PCT_EST = "";
			   var POP_PCT_MOE = "";
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : "OOMEDYR_E",
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
			 //Output persons per household
			   var UNIT_EST = ""
			   var UNIT_MOE = ""; 
			   var UNIT_PCT_EST = ""
			   var UNIT_PCT_MOE = "";
 			   var POP_EST = OO_PPH_E
			   var POP_MOE = OO_PPH_M;
			   var POP_PCT_EST = "";
			   var POP_PCT_MOE = "";
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : "OO_PPH_E",
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
		  } // Case 22
		  break;
		  case 34: {
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : varname[j],
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
			 //Output Median year of construction
			   var UNIT_EST = RT_MEDYR_E;
			   var UNIT_MOE = RT_MEDYR_M; 
			   var UNIT_PCT_EST = ""
			   var UNIT_PCT_MOE = "";
 			   var POP_EST = ""
			   var POP_MOE = "";
			   var POP_PCT_EST = "";
			   var POP_PCT_MOE = "";
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : "RTMEDYR_E",
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
			 //Output persons per household
			   var UNIT_EST = ""
			   var UNIT_MOE = ""; 
			   var UNIT_PCT_EST = ""
			   var UNIT_PCT_MOE = "";
 			   var POP_EST = RT_PPH_E
			   var POP_MOE = RT_PPH_M;
			   var POP_PCT_EST = "";
			   var POP_PCT_MOE = "";
             outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : "RT_PPH_E",
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
		  } // Case 34
		  break;
		 default : {
			outData.push({
				 'FIPS' : unitdata.FIPS,
				 'NAME' : unitdata.NAME,
				 "VAR" : varname[j],
				 'UNIT_EST' : UNIT_EST,
				 'UNIT_MOE' : UNIT_MOE,
				 'UNIT_PCT_EST' : UNIT_PCT_EST,
				 'UNIT_PCT_MOE' : UNIT_PCT_MOE,
				 'POP_EST' : POP_EST,
				 'POP_MOE' : POP_MOE,
				 'POP_PCT_EST' : POP_PCT_EST,
				 'POP_PCT_MOE' : POP_PCT_MOE
			 });
		 }
		 } //switch
	  } //j
 } //i
 
  return(outData);
 } 
 // genTenureTab 
 

 function genhousIncome(OO,RT,geotype) {
 //genhousIncome Geneates Percentage Income spent on housing tab
 
	 var OO_dat = [];
	 for(i = 0; i < OO.length;i++) {
		 OO_dat.push({
			"FIPS" : geotype == 'state' ? 8 : OO[i].GEO2,
			"NAME" : OO[i].NAME,
			"OO_TOTAL_E" :	OO[i].B25095_001E,
			"OO_TOTAL_M" :	OO[i].B25095_001M,
						"OO_GE30_E" :	OO[i].B25095_006E + OO[i].B25095_007E + OO[i].B25095_015E + OO[i].B25095_016E + OO[i].B25095_024E + OO[i].B25095_025E + OO[i].B25095_033E + OO[i].B25095_034E + OO[i].B25095_042E + OO[i].B25095_043E + OO[i].B25095_051E + OO[i].B25095_052E + OO[i].B25095_060E + OO[i].B25095_061E + OO[i].B25095_069E + OO[i].B25095_070E + 
				OO[i].B25095_008E + OO[i].B25095_017E + OO[i].B25095_026E + OO[i].B25095_035E + OO[i].B25095_044E + OO[i].B25095_053E + OO[i].B25095_062E + OO[i].B25095_071E + 
				OO[i].B25095_009E + OO[i].B25095_018E + OO[i].B25095_027E + OO[i].B25095_036E + OO[i].B25095_045E + OO[i].B25095_054E + OO[i].B25095_063E + OO[i].B25095_072E,
			"OO_GE30_M" :	Math.pow(OO[i].B25095_006M,2) + Math.pow(OO[i].B25095_007M,2) + Math.pow(OO[i].B25095_015M,2) + Math.pow(OO[i].B25095_016M,2) + Math.pow(OO[i].B25095_024M,2) + Math.pow(OO[i].B25095_025M,2) + Math.pow(OO[i].B25095_033M,2) + Math.pow(OO[i].B25095_034M,2) + Math.pow(OO[i].B25095_042M,2) + Math.pow(OO[i].B25095_043M,2) + Math.pow(OO[i].B25095_051M,2) + Math.pow(OO[i].B25095_052M,2) + Math.pow(OO[i].B25095_060M,2) + Math.pow(OO[i].B25095_061M,2) + Math.pow(OO[i].B25095_069M,2) + Math.pow(OO[i].B25095_070M,2) + 
				Math.pow(OO[i].B25095_008M,2) + Math.pow(OO[i].B25095_017M,2) + Math.pow(OO[i].B25095_026M,2) + Math.pow(OO[i].B25095_035M,2) + Math.pow(OO[i].B25095_044M,2) + Math.pow(OO[i].B25095_053M,2) + Math.pow(OO[i].B25095_062M,2) + Math.pow(OO[i].B25095_071M,2) + 
				Math.pow(OO[i].B25095_009M,2) + Math.pow(OO[i].B25095_018M,2) + Math.pow(OO[i].B25095_027M,2) + Math.pow(OO[i].B25095_036M,2) + Math.pow(OO[i].B25095_045M,2) + Math.pow(OO[i].B25095_054M,2) + Math.pow(OO[i].B25095_063M,2) + Math.pow(OO[i].B25095_072M,2),
			"OO_3039_E" :	OO[i].B25095_006E + OO[i].B25095_007E + OO[i].B25095_015E + OO[i].B25095_016E + OO[i].B25095_024E + OO[i].B25095_025E + OO[i].B25095_033E + OO[i].B25095_034E + OO[i].B25095_042E + OO[i].B25095_043E + OO[i].B25095_051E + OO[i].B25095_052E + OO[i].B25095_060E + OO[i].B25095_061E + OO[i].B25095_069E + OO[i].B25095_070E,
			"OO_3039_M" : 	Math.pow(OO[i].B25095_006M,2) + Math.pow(OO[i].B25095_007M,2) + Math.pow(OO[i].B25095_015M,2) + Math.pow(OO[i].B25095_016M,2) + Math.pow(OO[i].B25095_024M,2) + Math.pow(OO[i].B25095_025M,2) + Math.pow(OO[i].B25095_033M,2) + Math.pow(OO[i].B25095_034M,2) + Math.pow(OO[i].B25095_042M,2) + Math.pow(OO[i].B25095_043M,2) + Math.pow(OO[i].B25095_051M,2) + Math.pow(OO[i].B25095_052M,2) + Math.pow(OO[i].B25095_060M,2) + Math.pow(OO[i].B25095_061M,2) + Math.pow(OO[i].B25095_069M,2) + Math.pow(OO[i].B25095_070M,2),
			"OO_4049_E" :	OO[i].B25095_008E + OO[i].B25095_017E + OO[i].B25095_026E + OO[i].B25095_035E + OO[i].B25095_044E + OO[i].B25095_053E + OO[i].B25095_062E + OO[i].B25095_071E,
			"OO_4049_M" :	Math.pow(OO[i].B25095_008M,2) + Math.pow(OO[i].B25095_017M,2) + Math.pow(OO[i].B25095_026M,2) + Math.pow(OO[i].B25095_035M,2) + Math.pow(OO[i].B25095_044M,2) + Math.pow(OO[i].B25095_053M,2) + Math.pow(OO[i].B25095_062M,2) + Math.pow(OO[i].B25095_071M,2),
			"OO_GE50_E" :	OO[i].B25095_009E + OO[i].B25095_018E + OO[i].B25095_027E + OO[i].B25095_036E + OO[i].B25095_045E + OO[i].B25095_054E + OO[i].B25095_063E + OO[i].B25095_072E,
			"OO_GE50_M" :	Math.pow(OO[i].B25095_009M,2) + Math.pow(OO[i].B25095_018M,2) + Math.pow(OO[i].B25095_027M,2) + Math.pow(OO[i].B25095_036M,2) + Math.pow(OO[i].B25095_045M,2) + Math.pow(OO[i].B25095_054M,2) + Math.pow(OO[i].B25095_063M,2) + Math.pow(OO[i].B25095_072M,2)
		 });			
	 };
	 
	 var RT_dat = [];
	 for(i = 0; i < RT.length;i++){
		 RT_dat.push({
			"FIPS" : geotype == 'state' ? 8 : RT[i].GEO2,
			"NAME" : RT[i].NAME,
			"RT_TOTAL_E" :	RT[i].B25074_001E,
			"RT_TOTAL_M" :	RT[i].B25074_001M,
			"RT_GE30_E" :	RT[i].B25074_006E + RT[i].B25074_007E + RT[i].B25074_015E + RT[i].B25074_016E + RT[i].B25074_024E + RT[i].B25074_025E + RT[i].B25074_033E + RT[i].B25074_034E + RT[i].B25074_042E + RT[i].B25074_043E + RT[i].B25074_051E + RT[i].B25074_052E + RT[i].B25074_060E + RT[i].B25074_061E + 
				RT[i].B25074_008E + RT[i].B25074_017E + RT[i].B25074_026E + RT[i].B25074_035E + RT[i].B25074_044E + RT[i].B25074_053E + RT[i].B25074_062E + 
				RT[i].B25074_009E + RT[i].B25074_018E + RT[i].B25074_027E + RT[i].B25074_036E + RT[i].B25074_045E + RT[i].B25074_054E + RT[i].B25074_063E ,
			"RT_GE30_M" :	Math.pow(RT[i].B25074_006M,2) + Math.pow(RT[i].B25074_007M,2) + Math.pow(RT[i].B25074_015M,2) + Math.pow(RT[i].B25074_016M,2) + Math.pow(RT[i].B25074_024M,2) + Math.pow(RT[i].B25074_025M,2) + Math.pow(RT[i].B25074_033M,2) + Math.pow(RT[i].B25074_034M,2) + Math.pow(RT[i].B25074_042M,2) + Math.pow(RT[i].B25074_043M,2) + Math.pow(RT[i].B25074_051M,2) + Math.pow(RT[i].B25074_052M,2) + Math.pow(RT[i].B25074_060M,2) + Math.pow(RT[i].B25074_061M,2) + 
				Math.pow(RT[i].B25074_008M,2) + Math.pow(RT[i].B25074_017M,2) + Math.pow(RT[i].B25074_026M,2) + Math.pow(RT[i].B25074_035M,2) + Math.pow(RT[i].B25074_044M,2) + Math.pow(RT[i].B25074_053M,2) + Math.pow(RT[i].B25074_062M,2) + 
				Math.pow(RT[i].B25074_009M,2) + Math.pow(RT[i].B25074_018M,2) + Math.pow(RT[i].B25074_027M,2) + Math.pow(RT[i].B25074_036M,2) + Math.pow(RT[i].B25074_045M,2) + Math.pow(RT[i].B25074_054M,2) + Math.pow(RT[i].B25074_063M,2), 
			"RT_3039_E" :	RT[i].B25074_006E + RT[i].B25074_007E + RT[i].B25074_015E + RT[i].B25074_016E + RT[i].B25074_024E + RT[i].B25074_025E + RT[i].B25074_033E + RT[i].B25074_034E + RT[i].B25074_042E + RT[i].B25074_043E + RT[i].B25074_051E + RT[i].B25074_052E + RT[i].B25074_060E + RT[i].B25074_061E,
			"RT_3039_M" : 	Math.pow(RT[i].B25074_006M,2) + Math.pow(RT[i].B25074_007M,2) + Math.pow(RT[i].B25074_015M,2) + Math.pow(RT[i].B25074_016M,2) + Math.pow(RT[i].B25074_024M,2) + Math.pow(RT[i].B25074_025M,2) + Math.pow(RT[i].B25074_033M,2) + Math.pow(RT[i].B25074_034M,2) + Math.pow(RT[i].B25074_042M,2) + Math.pow(RT[i].B25074_043M,2) + Math.pow(RT[i].B25074_051M,2) + Math.pow(RT[i].B25074_052M,2) + Math.pow(RT[i].B25074_060M,2) + Math.pow(RT[i].B25074_061M,2) ,
			"RT_4049_E" :	RT[i].B25074_008E + RT[i].B25074_017E + RT[i].B25074_026E + RT[i].B25074_035E + RT[i].B25074_044E + RT[i].B25074_053E + RT[i].B25074_062E,
			"RT_4049_M" :	Math.pow(RT[i].B25074_008M,2) + Math.pow(RT[i].B25074_017M,2) + Math.pow(RT[i].B25074_026M,2) + Math.pow(RT[i].B25074_035M,2) + Math.pow(RT[i].B25074_044M,2) + Math.pow(RT[i].B25074_053M,2) + Math.pow(RT[i].B25074_062M,2) ,
			"RT_GE50_E" :	RT[i].B25074_009E + RT[i].B25074_018E + RT[i].B25074_027E + RT[i].B25074_036E + RT[i].B25074_045E + RT[i].B25074_054E + RT[i].B25074_063E,
			"RT_GE50_M" :	Math.pow(RT[i].B25074_009M,2) + Math.pow(RT[i].B25074_018M,2) + Math.pow(RT[i].B25074_027M,2) + Math.pow(RT[i].B25074_036M,2) + Math.pow(RT[i].B25074_045M,2) + Math.pow(RT[i].B25074_054M,2) + Math.pow(RT[i].B25074_063M,2)
		 });	
	 };

	var fin_data = [];
	for(i = 0; i < OO_dat.length; i++){
		fin_data.push({
			'FIPS' : OO_dat[i].FIPS,
			'NAME' : OO_dat[i].NAME,
			'VAR' : 'IncomePct',
			'TOTAL_OO_E' : OO_dat[i].OO_TOTAL_E,
			'TOTAL_OO_M' : OO_dat[i].OO_TOTAL_M,
			'PCTGE30_OO_E' : OO_dat[i].OO_GE30_E,
			'PCTGE30_OO_M' : OO_dat[i].OO_GE30_M,
			'PCT3039_OO_E' : OO_dat[i].OO_3039_E,
			'PCT3039_OO_M' : OO_dat[i].OO_3039_M,
			'PCT4049_OO_E' : OO_dat[i].OO_4049_E,
			'PCT4049_OO_M' : OO_dat[i].OO_4049_M,
			'PCTGE50_OO_E' : OO_dat[i].OO_GE50_E,
			'PCTGE50_OO_M' : OO_dat[i].OO_GE50_M,
			'TOTAL_RT_E' : RT_dat[i].RT_TOTAL_E,
			'TOTAL_RT_M' : RT_dat[i].RT_TOTAL_M,
			'PCTGE30_RT_E' : RT_dat[i].RT_GE30_E,
			'PCTGE30_RT_M' : RT_dat[i].RT_GE30_M,
			'PCT3039_RT_E' : RT_dat[i].RT_3039_E,
			'PCT3039_RT_M' : RT_dat[i].RT_3039_M,
			'PCT4049_RT_E' : RT_dat[i].RT_4049_E,
			'PCT4049_RT_M' : RT_dat[i].RT_4049_M,
			'PCTGE50_RT_E' : RT_dat[i].RT_GE50_E,
			'PCTGE50_RT_M' : RT_dat[i].RT_GE50_M
		});
	}; //i

return(fin_data);
 } 
// genhousIncome
 
 

function genHHForecast(level, inData,DDsel, outDiv) {
//genHHForecast generating Household Forecast Chart

const fmt_date = d3.timeFormat("%B %d, %Y");
  
var config = {responsive: true,
   displayModeBar: false};


if(level == "Region") {
//Generates the list of selected places
var fipsList = [];
var  opt, statVal;

  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
    }
  }
}  else {
 var fipsList = [...new Set(inData.map(d => d.fips))];
}
var selData = inData.filter(d => fipsList.includes(d.fips));
var selNames = [...new Set(selData.map(d => d.name))];

//Building Divs

 // Modifying outDiv to plot multiple selections

 var outdiv = document.getElementById(outDiv);
 outdiv.innerHTML = "";      
  var plotdiv = document.createElement('div');
   plotdiv.id = 'multi-container';
 //  plotdiv.className = 'multi-container';
  outdiv.appendChild(plotdiv);
  
 var plot_array = [];  
  for(i = 0; i < fipsList.length; i++) {
  var plot_grid = document.createElement('div');
  plot_grid.id = 'multiPlot'+i;
 // plot_grid.className = "multi_plot";
  plotdiv.appendChild(plot_grid);
  
  
 plot_array.push({'loc' : selNames[i],
 'fName' : selNames[i] + " Household Forecast.png",
 'plot' : 'multiPlot'+i});

  } //i

var age_cats = [...new Set(inData.map(d => d.age_group_id))];
age_cats.shift();

var ctyNames;

for(i = 0; i < fipsList.length; i++) {

var outPlot = plot_array[i].plot; //destination plot
 var hh_data = [];
  for(j = 0; j < age_cats.length;j++){
	    var filtPlot = inData.filter(d => (d.fips == fipsList[i]) && (d.age_group_id == age_cats[j])); 
		var PlaceNames = [...new Set(filtPlot.map(d => d.name))];

		var x_labs = [...new Set(filtPlot.map(d => d.year))];
	    var y_est = [...new Set(filtPlot.map(d => d.total_households))];
		var chtitle = "Household Forecast by Year, Number of Households: " + PlaceNames[0];
		var y_lab = "Number of Households"
		hh_data.push({x : x_labs,
                y : y_est,
				name : age_cats[j],
                type : 'bar'});

  } //j
  
 
var ftrStr = 'Data Sources: U.S. Census Bureau (1990-2010) and Colorado State Demography Office (2020-2050).  Print Date: ' +  fmt_date(new Date)

 var hh_layout = {
	showlegend : true,
  title: chtitle,
    autosize: false,
    width: 1200,
    height : 400,
    xaxis: {
   title : 'Year',
   font: {
    size: 8,
    color: 'black'
   },
   showgrid: true,
   zeroline: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2
    },
    yaxis: {
   title : y_lab,
   automargin : true,
   showgrid: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2,
    tickformat: statVal == 2 ? '%' : ','
    },
  annotations : [{text :  ftrStr , 
                font: {
    size : 9,
    color: 'black'
      },
      xref : 'paper', 
      x : 0, 
      yref : 'paper', 
      y : -0.37,
      align : 'left', 
      showarrow : false}]
  };
 

Plotly.newPlot(outPlot, hh_data, hh_layout,config);

 } //i
 
//Download Events
var dat_labs = x_labs;
var profileDat1 = document.getElementById('profileDat1');
var profileImg1 = document.getElementById('profileImg1');
profileDat1.onclick = function() {exportToCsv(selNames, 'hhforecast', selData,0)};
profileImg1.onclick = function() {exportToPng(selNames, 'hhforecast', plot_array,0)};
	 
 } 
// genHHForecast
 
//cat Output Wrapper functions

function genHHForecastChart(inData,outDiv, bkMark, geotype) {
//genHHForecastChart  Wrapper for  Household Forecast Chart
 
	var fipsList =  [... new Set(inData.map(tag => tag.fips))]; 
	var ctyNameList =  [... new Set(inData.map(tag => tag.name))]; 	

	pgSetupPro(geotype, "chart", outDiv, bkMark, true,false,fipsList, ctyNameList,0);

	//selecting initial dropdown values
if(geotype == "Region"){
   var selopts = "8,-101";
   $.each(selopts.split(","), function(i,e){
          $("#geoSelect1 option[value='" + e + "']").prop("selected", true);
       }); 
  
    $("#geoSelect1 option[value='0']").prop("selected", true);
 
   var dd0 = document.getElementById("geoSelect1");
   var btn0 = document.getElementById("plotBtn1");

  genHHForecast(geotype, inData,dd0,"PlotDiv1")

   btn0.addEventListener('click', function() {
    genHHForecast(geotype, inData,dd0,"PlotDiv1")
       });
} else {
    genHHForecast(geotype, inData,"","PlotDiv1")
}
} 
// genHHForecastChart
 

function genOccupancyTab(inData,outDiv,bkMark,level,curYr,fipsArr) {
//genOccupancyTab Wrapper for Occupancy Table

	const fmt_date = d3.timeFormat("%B %d, %Y");
    const fmt_yr = d3.format("0000");	
	const tabtitle = bkMark.title;
   
 if(level == "Region") {
	 var tmpFips = regionCOL(fipsArr);
     var strFips = tmpFips[0].fips.map(i => i);
	 var fileName = regionName(parseInt(fipsArr)) + " " + bkMark.title
}  
if(level == "County"){
	var fileName = countyName(parseInt(fipsArr)) + " " + bkMark.title
	var strFips =  fipsArr;
}
if(level == "Municipality"){
	var fileName = muniName(parseInt(fipsArr)) + " " + bkMark.title
	var strFips =  fipsArr;
}
	
  	var row_labels = [
   {'title' : 'Total Housing Units', 'URL_link' : genCEDSCIUrl(level,'B25002',curYr,strFips)},
   {'title' : 'Occupied Housing Units', 'URL_link' : genCEDSCIUrl(level,'B25002',curYr,strFips)},
   {'title' : 'Vacant Housing Units', 'URL_link' : genCEDSCIUrl(level,'B25002',curYr,strFips)},
   {'title' : 'Vacant Housing Units for Sale or Rent', 'URL_link' : genCEDSCIUrl(level,'B25004',curYr,strFips)},
   {'title' : 'Vacant Housing Units Sold or Rented but not Occupied', 'URL_link' : genCEDSCIUrl(level,'B25004',curYr,strFips)},
   {'title' : 'Seasonal, Recreational, or Occasional Vacancy', 'URL_link' : genCEDSCIUrl(level,'B25004',curYr,strFips)},
   {'title' : 'Vacant - current residence elsewhere', 'URL_link' : genCEDSCIUrl(level,'B25005',curYr,strFips)},
   {'title' : 'Housing for Migrant Workers', 'URL_link' : genCEDSCIUrl(level,'B25004',curYr,strFips)},
   {'title' : 'Other Vacancy', 'URL_link' : genCEDSCIUrl(level,'B25004',curYr,strFips)}
	];
	

var tab_obj = genSubjTab(level,inData, bkMark.id,row_labels,true);

var count_obj = tab_obj[0];
var pct_obj = tab_obj[1];

pgSetupPro(level,"table",outDiv,bkMark,false,true,fipsArr, "", 0)

//footer
var tblfoot = [
               ['Source: U.S. Census Bureau  ('+fmt_yr(curYr) + ') ' + fmt_yr(curYr - 4) + '-' + fmt_yr(curYr) +' American Community Survey, Tables B25002, B25004, and B25005'],
			   ["Compiled by the Colorado State Demography Office"],
               ['Print Date : ' + fmt_date(new Date)]
      ];

var ftrString = "<tfoot>"
for(i = 0 ;i < tblfoot.length; i++){
	if(level == "Municipality"){
		ftrString = ftrString + "<tr><td colspan='7'>" + tblfoot[i] + "</td></tr>";
	} else {
		ftrString = ftrString + "<tr><td colspan='5'>" + tblfoot[i] + "</td></tr>";
	}
}
ftrString = ftrString + "</tfoot>"

//Initial Table
var tabVal = 0;


	//selecting initial dropdown values
  $("#statSelect2 option[value='0']").prop("selected", true);

   var dd0 = document.getElementById("statSelect2");
 if(level == "Region"){
   var btndown = document.getElementById("increment12");
   var btnup = document.getElementById("increment22");
 }
 
DTtab("TabDiv2",pct_obj,tabVal,row_labels,ftrString,tblfoot,"occupancy",fileName,tabtitle) 

   
  dd0.addEventListener('change', (event) => {
	   if(event.target.value == "0") {
		   DTtab("TabDiv2",pct_obj,tabVal,row_labels,ftrString,tblfoot,"occupancy",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv2",count_obj,tabVal,row_labels,ftrString,tblfoot,"occupancy",fileName,tabtitle);
	   }
   });

if(level == "Region"){
   btndown.addEventListener('click', function() {
     tabVal = tabVal - 1;
	 if(tabVal < 0) {
		tabVal = 5
	 }
	 if(dd0.value == "0") {
		   DTtab("TabDiv2",pct_obj,tabVal,row_labels,ftrString,tblfoot,"occupancy",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv2",count_obj,tabVal,row_labels,ftrString,tblfoot,"occupancy",fileName,tabtitle);
	  }
   });
  btnup.addEventListener('click', function() {
     tabVal = tabVal + 1;
	 if(tabVal > 5) {
		tabVal = 0
	 }
	 if(dd0.value == "0") {
		   DTtab("TabDiv2",pct_obj,tabVal,row_labels,ftrString,tblfoot,"occupancy",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv2",count_obj,tabVal,row_labels,ftrString,tblfoot,"occupancy",fileName,tabtitle);
	  }
    });
}
} 
// genOccupancyTab



function genHousingTenureTab(inData,outDiv,bkMark,level,curYr,fipsArr) {
//genHousingTenureTab Wrapper for Housing Tenure Table

	const fmt_date = d3.timeFormat("%B %d, %Y");
    const fmt_yr = d3.format("0000");	
	const tabtitle = bkMark.title;
	


   
 if(level == "Region") {
	 var tmpFips = regionCOL(fipsArr);
     var strFips = tmpFips[0].fips.map(i => i);
	 var fileName = regionName(parseInt(fipsArr)) + " " + bkMark.title
	 var nPanels = Math.round((inData.length)/2); //This is the number of panels
}  
if(level == "County"){
	var fileName = countyName(parseInt(fipsArr)) + " " + bkMark.title
	var strFips =  fipsArr;
}
if(level == "Municipality"){
	var fileName = muniName(parseInt(fipsArr)) + " " + bkMark.title
	var strFips =  fipsArr;
}

  	var row_labels = [
		{'title' : 'Occupied Housing Units', 'URL_link' : genCEDSCIUrl(level,'B25032',curYr,strFips)},
		{'title' : 'Single Family Buildings', 'URL_link' : genCEDSCIUrl(level,'B25032',curYr,strFips)},
		{'title' : '2 to 4 Unit Buildings', 'URL_link' : genCEDSCIUrl(level,'B25032',curYr,strFips)},
		{'title' : '5 or More Unit Buildings', 'URL_link' : genCEDSCIUrl(level,'B25032',curYr,strFips)},
		{'title' : 'Mobile Homes', 'URL_link' : genCEDSCIUrl(level,'B25032',curYr,strFips)},
		{'title' : 'Boat, RV, Van, etc. ', 'URL_link' : genCEDSCIUrl(level,'B25032',curYr,strFips)},
		{'title' : 'Median Year of Construction', 'URL_link' : genCEDSCIUrl(level,'B25037',curYr,strFips)},
		{'title' : 'Average Persons Per Household', 'URL_link' : genCEDSCIUrl(level,'B25010',curYr,strFips)}
	];
	
var tab_obj = genTenTab(level,inData,row_labels,true);

var unit_obj = tab_obj[0];
var pop_obj = tab_obj[1];

pgSetupPro(level,"table",outDiv,bkMark,false,true,fipsArr, "", 0)

//footer
var tblfoot = [
               ['Source: U.S. Census Bureau  ('+fmt_yr(curYr) + ') ' + fmt_yr(curYr - 4) + '-' + fmt_yr(curYr) +' American Community Survey, Tables B25010, B25032, B25033, and B25037'],
			   ["Compiled by the Colorado State Demography Office"],
               ['Print Date : ' + fmt_date(new Date)]
      ];

var ftrString = "<tfoot>"
for(i = 0 ;i < tblfoot.length; i++){
	if(level == "Municipality"){
		ftrString = ftrString + "<tr><td colspan='13'>" + tblfoot[i] + "</td></tr>";
	} else {
		ftrString = ftrString + "<tr><td colspan='9'>" + tblfoot[i] + "</td></tr>";
	}
}
ftrString = ftrString + "</tfoot>"

//Initial Table
var tabVal = 0;

	//selecting initial dropdown values
  $("#statSelect3 option[value='0']").prop("selected", true);

   var dd3 = document.getElementById("statSelect3");
 if(level == "Region"){
   var btndown3 = document.getElementById("increment13");
   var btnup3 = document.getElementById("increment23");
 }

DTtab("TabDiv3",unit_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle) 

  dd3.addEventListener('change', (event) => {
	   if(event.target.value == "0") {
		   DTtab("TabDiv3",unit_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle) 
	   } else {
		   DTtab("TabDiv3",pop_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle);
	   }
   });

if(level == "Region"){
   btndown3.addEventListener('click', function() {
     tabVal = tabVal - 1;
	 if(tabVal < 0) {
		tabVal = nPanels
	 }
	 if(dd3.value == "0") {
		   DTtab("TabDiv3",unit_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv3",pop_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle);
	  }
   });
  btnup3.addEventListener('click', function() {
     tabVal = tabVal + 1;
	 if(tabVal > nPanels) {
		tabVal = 0
	 }
	 if(dd3.value == "0") {
		   DTtab("TabDiv3",unit_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv3",pop_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle);
	  }
    });
} else {
	  dd3.addEventListener('change', (event) => {
	   if(event.target.value == "0") {
		   DTtab("TabDiv3",unit_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle) 
	   } else {
		   DTtab("TabDiv3",pop_obj,tabVal,row_labels,ftrString,tblfoot,"houstype",fileName,tabtitle);
	   }
   });
} 
} 
// genHousingTenureTab



function genHHIncomeTab(inDatamed, inDatapct,outDiv,bkMark,level,curYr,fipsArr) {
//genHHIncomeTab Wrapper for Housing Income Table

	const fmt_date = d3.timeFormat("%B %d, %Y");
    const fmt_yr = d3.format("0000");	
	const tabtitle = bkMark.title;
	
 if(level == "Region") {
	 var tmpFips = regionCOL(fipsArr);
     var strFips = tmpFips[0].fips.map(i => i);
	 var fileName = regionName(parseInt(fipsArr)) + " " + bkMark.title
}  
if(level == "County"){
	var fileName = countyName(parseInt(fipsArr)) + " " + bkMark.title
	var strFips =  fipsArr;
}
if(level == "Municipality"){
	var fileName = muniName(parseInt(fipsArr)) + " " + bkMark.title
	var strFips =  fipsArr;
}
  	var row_labels = [
		{'title' : 'Median Value of Owner-Occupied Households (Current Dollars)', 'URL_link' : genCEDSCIUrl(level,'B25077',curYr,strFips)},
		{'title' : 'Total Owner-Occupied Households', 'URL_link' : genCEDSCIUrl(level,'B25095',curYr,strFips)},
		{'title' : 'Owner-Occupied Households paying 30% or more of income on housing', 'URL_link' : genCEDSCIUrl(level,'B25095',curYr,strFips)},
		{'title' : 'Owner-Occupied Households paying 30-39% of income on housing', 'URL_link' : genCEDSCIUrl(level,'B25095',curYr,strFips)},
		{'title' : 'Owner-Occupied Households paying 40-49% of ncome on housing', 'URL_link' : genCEDSCIUrl(level,'B25095',curYr,strFips)},
		{'title' : 'Owner-Occupied Households paying 50% or more of income on housing', 'URL_link' : genCEDSCIUrl(level,'B25095',curYr,strFips)},
		{'title' : 'Median Gross Rent of Rental Households (Current Dollars)', 'URL_link' : genCEDSCIUrl(level,'B25064',curYr,strFips)},
		{'title' : 'Total Rental Households', 'URL_link' : genCEDSCIUrl(level,'B25074',curYr,strFips)},
		{'title' : 'Rental Households paying 30% or more of income on housing', 'URL_link' : genCEDSCIUrl(level,'B25074',curYr,strFips)},
		{'title' : 'Rental Households paying 30-39% of income on housing', 'URL_link' : genCEDSCIUrl(level,'B25074',curYr,strFips)},
		{'title' : 'Rental Households paying 40-49% of income on housing', 'URL_link' : genCEDSCIUrl(level,'B25074',curYr,strFips)},
		{'title' : 'Rental Households paying 50% or more of income on housing', 'URL_link' : genCEDSCIUrl(level,'B25074',curYr,strFips)}
	];
	
var tab_obj = HHIncTab(level,inDatamed, inDatapct, 6,row_labels,true);

var unit_obj = tab_obj[0];
var pop_obj = tab_obj[1];

pgSetupPro(level,"table",outDiv,bkMark,false,true,fipsArr, "", 0)

//footer
var tblfoot = [
               ['Source: U.S. Census Bureau  ('+fmt_yr(curYr) + ') ' + fmt_yr(curYr - 4) + '-' + fmt_yr(curYr) +' American Community Survey, Tables B25077, B25064, B25095, and B25074'],
			   ["Compiled by the Colorado State Demography Office"],
               ['Print Date : ' + fmt_date(new Date)]
      ];

var ftrString = "<tfoot>"
for(i = 0 ;i < tblfoot.length; i++){ 
    if(level == "Municipality"){
		ftrString = ftrString + "<tr><td colspan='7'>" + tblfoot[i] + "</td></tr>";
	} else {
		ftrString = ftrString + "<tr><td colspan='5'>" + tblfoot[i] + "</td></tr>";
	}
}

ftrString = ftrString + "</tfoot>"

//Initial Table
var tabVal = 0;

	//selecting initial dropdown values
  $("#statSelect4 option[value='0']").prop("selected", true);

   var dd4 = document.getElementById("statSelect4");
 if(level == "Region"){
   var btndown4 = document.getElementById("increment14");
   var btnup4 = document.getElementById("increment24");
 }

DTtab("TabDiv4",pop_obj,tabVal,row_labels,ftrString,tblfoot,"housincome",fileName,tabtitle) 

  dd4.addEventListener('change', (event) => {
	   if(event.target.value == "0") {
		   DTtab("TabDiv4",pop_obj,tabVal,row_labels,ftrString,tblfoot,"housincome",fileName,tabtitle) 
	   } else {
		   DTtab("TabDiv4",unit_obj,tabVal,row_labels,ftrString,tblfoot,"housincome",fileName,tabtitle);
	   }
   });

if(level == "Region"){
   btndown4.addEventListener('click', function() {
     tabVal = tabVal - 1;
	 if(tabVal < 0) {
		tabVal = 5
	 }
	 if(dd4.value == "0") {
		   DTtab("TabDiv4",pop_obj,tabVal,row_labels,ftrString,tblfoot,"housincome",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv4",unit_obj,tabVal,row_labels,ftrString,tblfoot,"housincome",fileName,tabtitle);
	  }
   });
  btnup4.addEventListener('click', function() {
     tabVal = tabVal + 1;
	 if(tabVal > 5) {
		tabVal = 0
	 }
	 if(dd4.value == "0") {
		   DTtab("TabDiv4",pop_obj,tabVal,row_labels,ftrString,tblfoot,"housincome",fileName,tabtitle);
	   } else {
		   DTtab("TabDiv4",unit_obj,tabVal,row_labels,ftrString,tblfoot,"housincome",fileName,tabtitle);
	  }
    });
}
} 
// genHHIncomeTab


function genCommutingDiag(inData,outDivd,bkMark,level,fipsArr){
//genCommutingDiag generates a sankey flows diagram from the LODES data
   var chartData1 = [];
   var chartData2 = [];
   
   inData.forEach(d => {
	   if(d.type == 1){
	     chartData1.push({ "type" : d.type, "source" : d.place, "target" : d.location, "value" : d.number, "percent" : parseFloat(d.percent)});
	   } else {
	     chartData2.push({ "type" : d.type, "source" : d.place, "target" : d.location, "value" : d.number, "percent" : parseFloat(d.percent)});
	   }
   })
  //populating data objects
  var label1 = [];
  var label2 = [];
  var color1 = [];
  var color2 = [];
  var source1 = [];
  var source2 = [];
  var target1 = [];
  var target2 = [];
  var value1 = [];
  var value2 = [];
  
 	label1.push(chartData1[i].source);
	color1.push("blue");
	source1.push(0) 
	target1.push(0)
	value1.push(0)
  
  for(i = 0; i < chartData1.length;i++){
	  label1.push(chartData1[i].target);
	  color1.push("blue");
	  source1.push(0)
	  target1.push(i+1)
	  value1.push(chartData1[i].percent);
  }
}  
// genCommutingDiag

//cat Plotting and Tabulation Functions

function genIncomePlot(level, inData,DDsel,outDiv, acsYear, acsTab) {
//genIncomePlot  Generates ACS Income Plot

const fmt_date = d3.timeFormat("%B %d, %Y");

  
var config = {responsive: true,
   displayModeBar: false};

if(level == "Region") {
//Generates the list of selected places
  var fipsList = [], opt;
  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
    }
  }
}  else {
 var fipsList = [...new Set(inData.map(d => d.FIPS))];
}


var x_labs = ["Less<br>than<br>$10,000", "$10,000<br>to<br>$19,999", "$20,000<br>to<br>$29,999", "$30,000<br>to<br>$39,999", "$40,000<br>to<br>$49,999", "$50,000<br>to<br>$59,999", 
    "$60,000<br>to<br>$75,999", "$75,000<br>to<br>$99,999", "$100,000<br>to<br>$124,000", "$125,000<br>to<br>$149,999", "$150,000<br>to<br>$199,999", "Greater<br>than<br>$200,000"];

var y_estvars = ["LT10K_E_PCT", "K10K19_E_PCT", "K20K29_E_PCT", "K30K39_E_PCT", "K40K49_E_PCT", "K50K59_E_PCT", 
    "K60K74_E_PCT", "K75K99_E_PCT", "K100K124_E_PCT", "K125K149_E_PCT", "K150K199_E_PCT", "GE200K_E_PCT"]
var y_moevars = ["LT10K_M_PCT", "K10K19_M_PCT", "K20K29_M_PCT", "K30K39_M_PCT", "K40K49_M_PCT", "K50K59_M_PCT", 
    "K60K74_M_PCT", "K75K99_M_PCT", "K100K124_M_PCT", "K125K149_M_PCT", "K150K199_M_PCT", "GE200K_M_PCT"]


var income_data = [];
var ctyNames;

var pltData = inData.filter(d => fipsList.includes(d.FIPS));

var PlaceNames = [...new Set(pltData.map(d => d.NAME))];

 for(i = 0; i < fipsList.length; i++) {
  var filtPlot = pltData.filter(d => d.FIPS == fipsList[i]);
  var y_est = selValsSing(filtPlot,y_estvars);
  var y_moe = selValsSing(filtPlot,y_moevars);
  var pct_est_label = []
  for(j = 0; j < y_est.length; j++) {
	  pct_est_label.push(PlaceNames[i] + "<br>" + x_labs[j].replaceAll("<br>"," ") + "<br>Percent: "+ fixNUMFMT(y_est[j],"pct") + "<br>Margin of Error: "+ fixNUMFMT(y_moe[j],"pct"))
  }
  income_data.push({x : x_labs,
                 y : y_est,
     error_y: {
      type: 'data',
      array: y_moe,
      thickness: 0.75,
      visible: true
     },
      customdata : pct_est_label,
      hovertemplate : '%{customdata}',

     name : filtPlot[0].NAME,
                 type : 'bar'});
  
    ctyNames = PlaceNames[i];
   } //i
 

var ftrStr = 'U.S. Census Bureau ('+ acsYear + '). ' + (acsYear - 4) + '-' + acsYear + ' American Community Survey Table: ' + acsTab +' Print Date: ' +  fmt_date(new Date)

 var income_layout = {
  title: "Household Income, " + acsYear,
    autosize: false,
    width: 1200,
    height : 400,
    xaxis: {
   title : 'Household Income',
   font: {
    size: 8,
    color: 'black'
   },
   showgrid: true,
   zeroline: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2
    },
    yaxis: {
   title : 'Percent',
   automargin : true,
   showgrid: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2,
    tickformat: '0.0%'
    },
  annotations : [{text :  ftrStr , 
                font: {
    size : 9,
    color: 'black'
      },
      xref : 'paper', 
      x : 0, 
      yref : 'paper', 
      y : -0.37,
      align : 'left', 
      showarrow : false}]
  };
  
Plotly.newPlot(outDiv, income_data, income_layout,config);
//Download Events
var dat_labs = x_labs;
var profileDat1 = document.getElementById('profileDat1');
var profileImg1 = document.getElementById('profileImg1');
profileDat1.onclick = function() {exportToCsv(ctyNames, 'income', restructureACS(pltData,dat_labs),0)};
profileImg1.onclick = function() {exportToPng(ctyNames, 'income', outDiv,0)};
} //End of genIncomePlot


function genIncomeTab(level, DataIn, TabDiv, bkMark, curYr, fipsArr) {
//genIncomeTab  Creates ACS Income Source Tab

  const fmt_date = d3.timeFormat("%B %d, %Y");
    const fmt_yr = d3.format("00");

var prevYr = curYr - 4;

//varOrder contains both the range of names and the formatting   
var varOrder = [["NAME", "HH_TOTAL_E", "HH_TOTAL_M", "AVG_INCOME_E", "AVG_INCOME_M",
    "RAT_EARNINGS_E", "RAT_EARNINGS_M", "AVG_EARNINGS_E", "AVG_EARNINGS_M",
    "RAT_SALARY_E", "RAT_SALARY_M", "AVG_SALARY_E", "AVG_SALARY_M",
    "RAT_SELF_E", "RAT_SELF_M", "AVG_SELF_E", "AVG_SELF_M",
    "RAT_INTEREST_E", "RAT_INTEREST_M", "AVG_INTEREST_E", "AVG_INTEREST_M",
    "RAT_RETIRE_E", "RAT_RETIRE_M", "AVG_RETIRE_E", "AVG_RETIRE_M",
    "RAT_SOCSEC_E", "RAT_SOCSEC_M", "AVG_SOCSEC_E", "AVG_SOCSEC_M",
    "RAT_SSI_E", "RAT_SSI_M", "AVG_SSI_E", "AVG_SSI_M",
    "RAT_PUBASST_E", "RAT_PUBASST_M", "AVG_PUBASST_E", "AVG_PUBASST_M",
    "RAT_SNAP_E", "RAT_SNAP_M", "AVG_SNAP_E", "AVG_SNAP_M",
    "RAT_OTHER_E", "RAT_OTHER_M", "AVG_OTHER_E", "AVG_OTHER_M"],
  ["", "comma","comma", "dollar", "dollar",
     "percent", "percent", "dollar", "dollar",
     "percent", "percent", "dollar", "dollar",
  "percent", "percent", "dollar", "dollar",
  "percent", "percent", "dollar", "dollar",
  "percent", "percent", "dollar", "dollar",
  "percent", "percent", "dollar", "dollar",
  "percent", "percent", "dollar", "dollar",
  "percent", "percent", "dollar", "dollar",
  "percent", "percent", "dollar", "dollar",
  "percent", "percent", "dollar", "dollar"]];


var plWidth = 4;
var DataTab = selValsMulti(DataIn,varOrder,11,plWidth,"vert"); //DataTab is the formatted data 

if(level == "Municipality") {
   var npanels = 1;
 } else {
   var npanels = Math.round((DataIn.length)/2); //This is the number of panels
 }

for(i = 0; i < DataTab.length;i++){
   DataTab[i].unshift(i + 1);
 }

//Labels and urls for output
  var row_labels = [
   {'title' : 'Total Households', 'URL_link' : genCEDSCIUrl(level,'B19051',curYr,fipsArr), 'stpos' : 2, 'endpos' : 5},
   {'title' : 'Households with earnings', 'URL_link' : genCEDSCIUrl(level,'B19051',curYr,fipsArr), 'stpos' : 6, 'endpos' : 9},
   {'title' : 'Households with wage or salary income', 'URL_link' : genCEDSCIUrl(level,'B19052',curYr,fipsArr), 'stpos' : 10, 'endpos' : 13},
   {'title' : 'Households with self-employment income ', 'URL_link' : genCEDSCIUrl(level,'B19053',curYr,fipsArr), 'stpos' : 14, 'endpos' : 17},
   {'title' : 'Households with interest, dividends, or net rental income', 'URL_link' : genCEDSCIUrl(level,'B19054',curYr,fipsArr), 'stpos' : 18, 'endpos' : 21},
   {'title' : 'Households with retirement income', 'URL_link' : genCEDSCIUrl(level,'B19059',curYr,fipsArr), 'stpos' : 22, 'endpos' : 25},
   {'title' : 'Households with Social Security income', 'URL_link' : genCEDSCIUrl(level,'B19055',curYr,fipsArr), 'stpos' : 26, 'endpos' : 29},
   {'title' : 'Households with Supplemental Security Income (SSI)', 'URL_link' : genCEDSCIUrl(level,'B19056',curYr,fipsArr), 'stpos' : 30, 'endpos' : 33},
   {'title' : 'Households with public assistance income', 'URL_link' : genCEDSCIUrl(level,'B19057',curYr,fipsArr), 'stpos' : 34, 'endpos' : 37},
   {'title' : 'Households with cash public assistance or Food Stamps/SNAP', 'URL_link' : genCEDSCIUrl(level,'B19058',curYr,fipsArr), 'stpos' : 38, 'endpos' : 41},
   {'title' : 'Households with other types of income', 'URL_link' : genCEDSCIUrl(level,'B19060',curYr,fipsArr), 'stpos' : 42, 'endpos' : 45}
      ];
	  

//Table Footer
var tblfoot = [
               ["Source: U.S. Census Bureau ("+ fmt_yr(curYr) +"), "+ fmt_yr(prevYr) + '-' + fmt_yr(curYr) +' American Community Survey Tables B19051 to B20003'],
               ["Compiled by the Colorado State Demography Office"],
               ['Print Date : ' + fmt_date(new Date)]
      ];
      

var ftrString = "<tfoot><tr>";
for(i = 0; i < tblfoot.length; i++){
	if(level == "Municipality"){
	 ftrString = ftrString + "<tr><td colspan='13'>" + tblfoot[i] + "</td></tr>";
	} else {
     ftrString = ftrString + "<tr><td colspan='9'>" + tblfoot[i] + "</td></tr>";
	}
 }; 
ftrString = ftrString + "</tfoot>";

 var income_tab = genSubjTab(level, DataTab, bkMark.id,row_labels,false);


var nameArr = [...new Set(DataIn.map(d => d.NAME))];
var fipsArr2 = [...new Set(DataIn.map(d => d.FIPS))];
var fileName = nameArr[1] + " ACS Income Sources Table ";

pgSetupPro(level,"table",TabDiv,bkMark,true,false,fipsArr2, nameArr, curYr)

//Initial Table
var tabVal = 0;

if(level == "Region"){
   var btndown = document.getElementById("increment12");
   var btnup = document.getElementById("increment22");

DTtab("TabDiv2",income_tab,tabVal,row_labels,ftrString,tblfoot,"incometabDT",fileName,bkMark.title) 

   btndown.addEventListener('click', function() {
     tabVal = tabVal - 1;
	 if(tabVal < 0) {
		tabVal = 5
	 }
		   DTtab("TabDiv2",income_tab,tabVal,row_labels,ftrString,tblfoot,"incometabDT",fileName,bkMark.title) 
   });
  btnup.addEventListener('click', function() {
     tabVal = tabVal + 1;
	 if(tabVal > 5) {
		tabVal = 0
	 }
		   DTtab("TabDiv2",income_tab,tabVal,row_labels,ftrString,tblfoot,"incometabDT",fileName,bkMark.title) 
    });
} else {
	DTtab("TabDiv2",income_tab,tabVal,row_labels,ftrString,tblfoot,"incometabDT",fileName,bkMark.title);
}
//DTTable
};  
// genIncomeTab


function genEducPlot(level, inData,DDsel,outDiv, acsYear, acsTab) {
//genEducPlot  Generates ACS Educational attainment Plot

const fmt_date = d3.timeFormat("%B %d, %Y");
  
var config = {responsive: true,
   displayModeBar: false};
   

if(level == "Region") {
//Generates the list of selected places
  var fipsList = [], opt;
  var len = DDsel.options.length;
  for (var i = 0; i < len; i++) {
    opt = DDsel.options[i];
    if (opt.selected) {
      fipsList.push(+opt.value);
    }
  }
}  else {
 var fipsList = [...new Set(inData.map(d => d.FIPS))];
}

var x_labs = ["Less than<br>High School", "High School<br>Graduate (or GED)", "Some College","Associate's Degree", "Bachelor's Degree", "Graduate or<br>Professional Degree"];

var y_estvars = ["LTHS_E_PCT",  "HSGED_E_PCT", "SOMECOLL_E_PCT", "AADEG_E_PCT", "BADEG_E_PCT", "GRADDEG_E_PCT"]
var y_moevars = ["LTHS_M_PCT", "HSGED_M_PCT", "SOMECOLL_M_PCT", "AADEG_M_PCT", "BADEG_M_PCT", "GRADDEG_M_PCT"]

var educ_data = [];
var ctyNames;

var pltData = inData.filter(d => fipsList.includes(d.FIPS));

var PlaceNames = [...new Set(pltData.map(d => d.NAME))];
//Adding break to placename label
for(i = 0; i < PlaceNames.length; i++){
	PlaceNames[i] = PlaceNames[i].replace(":",":<br>");
}

 for(i = 0; i < fipsList.length; i++) {
  var filtPlot = pltData.filter(d => d.FIPS == fipsList[i]);
  var y_est = selValsSing(filtPlot,y_estvars);
  var y_moe = selValsSing(filtPlot,y_moevars);
 var pct_est_label = []
  for(j = 0; j < y_est.length; j++) {
	  pct_est_label.push(PlaceNames[i] + "<br>" + x_labs[j].replaceAll("<br>"," ") + "<br>Percent: "+ fixNUMFMT(y_est[j],"pct") + "<br>Margin of Error: "+ fixNUMFMT(y_moe[j],"pct"))
  }

  educ_data.push({x : x_labs,
                 y : y_est,
     error_y: {
      type: 'data',
      array: y_moe,
      thickness: 0.75,
      visible: true
     },
    customdata : pct_est_label,
    hovertemplate : '%{customdata}',

     name : filtPlot[0].NAME,
                 type : 'bar'});
  
    ctyNames = PlaceNames[i];
 
 } //i
 
 
var ftrStr = 'U.S. Census Bureau ('+ acsYear + '). ' + (acsYear - 4) + '-' + acsYear + ' American Community Survey Table: ' + acsTab +' Print Date: ' +  fmt_date(new Date)

 var educ_layout = {
  title: "Educational Attainment, Persons Age 25+, " + acsYear,
    autosize: false,
    width: 1200,
    height : 400,
    xaxis: {
   title : 'Educational Attainment',
   font: {
    size: 8,
    color: 'black'
   },
   showgrid: true,
   zeroline: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2
    },
     yaxis: {
   title : 'Percent',
   automargin : true,
   showgrid: true,
   showline: true,
   mirror: 'ticks',
   gridcolor: '#bdbdbd',
   gridwidth: 2,
   linecolor: 'black',
   linewidth: 2,
    tickformat: '0.0%'
    },
  annotations : [{text :  ftrStr , 
                font: {
    size : 9,
    color: 'black'
      },
      xref : 'paper', 
      x : 0, 
      yref : 'paper', 
      y : -0.37,
      align : 'left', 
      showarrow : false}]
  };
  
Plotly.newPlot(outDiv, educ_data, educ_layout,config);
//Download Events
var dat_labs = x_labs;
var profileDat3 = document.getElementById('profileDat3');
var profileImg3 = document.getElementById('profileImg3');
profileDat3.onclick = function() {exportToCsv(ctyNames, 'educatt', restructureACS(pltData,dat_labs),0)};
profileImg3.onclick = function() {exportToPng(ctyNames, 'educatt', outDiv,0)};
} 
//End of genEducPlot



function genRaceTab(level, inData, TabDiv, bkMark, curYr, fipsArr) {
//genRaceTab Geneerates ACS race tab 

 const fmt_date = d3.timeFormat("%B %d, %Y");
 const fmt_yr = d3.format("00");

var prevYr = curYr - 4;


//varOrder contains both the range of names and the formatting   
var varOrder = [["NAME", "HISP_E", "HISP_M", "HISP_E_PCT", "HISP_M_PCT", 
				"WHITENH_E", "WHITENH_M", "WHITENH_E_PCT", "WHITENH_M_PCT", 
				"BLACKNH_E", "BLACKNH_M", "BLACKNH_E_PCT", "BLACKNH_M_PCT", 
				"AIANNH_E", "AIANNH_M", "AIANNH_E_PCT", "AIANNH_M_PCT", 
				"ASIANNH_E", "ASIANNH_M", "ASIANNH_E_PCT", "ASIANNH_M_PCT", 
				"NHPACNH_E", "NHPACNH_M", "NHPACNH_E_PCT", "NHPACNH_M_PCT", 
				"OTHERNH_E", "OTHERNH_M", "OTHERNH_E_PCT", "OTHERNH_M_PCT", 
				"TWONH_E", "TWONH_M", "TWONH_E_PCT", "TWONH_M_PCT"],
				["", "comma", "comma", "percent", "percent", 
				"comma", "comma", "percent", "percent", 
				"comma", "comma", "percent", "percent", 
				"comma", "comma", "percent", "percent", 
				"comma", "comma", "percent", "percent", 
				"comma", "comma", "percent", "percent", 
				"comma", "comma", "percent", "percent", 
				"comma", "comma", "percent", "percent"]];

var plWidth = 4;

if(level == "Municipality") {
   var npanels = 1;
 } else {
   var npanels = Math.round((inData.length)/2); //This is the number of panels
 }

//Labels and urls for output
var tab_data = selValsMulti(inData,varOrder,8,plWidth,"vert");
for(i = 0; i < tab_data.length;i++){
   tab_data[i].unshift(i + 1);
 }

//Labels and urls for output
  var row_labels = [
		{'title' : 'Hispanic', 'URL_link' : genCEDSCIUrl(level,'B03002',curYr,fipsArr),'stpos' : 2, 'endpos' : 5},
		{'title' : 'White, NH', 'URL_link' : genCEDSCIUrl(level,'B03002',curYr,fipsArr),'stpos' : 6, 'endpos' : 9},
		{'title' : 'Black/ African American, NH', 'URL_link' : genCEDSCIUrl(level,'B03002',curYr,fipsArr),'stpos' : 10, 'endpos' : 13},
		{'title' : 'Native American/ Alaska Native, NH', 'URL_link' : genCEDSCIUrl(level,'B03002',curYr,fipsArr),'stpos' : 14, 'endpos' : 17},
		{'title' : 'Asian, NH', 'URL_link' : genCEDSCIUrl(level,'B03002',curYr,fipsArr),'stpos' : 18, 'endpos' : 21},
		{'title' : 'Native Hawaiian/ Pacific Islander, NH', 'URL_link' : genCEDSCIUrl(level,'B03002',curYr,fipsArr),'stpos' : 22, 'endpos' : 25},
		{'title' : 'Other, NH', 'URL_link' : genCEDSCIUrl(level,'B03002',curYr,fipsArr),'stpos' : 26, 'endpos' : 29},
		{'title' : 'Two of More Races, NH', 'URL_link' : genCEDSCIUrl(level,'B03002',curYr,fipsArr),'stpos' : 30, 'endpos' : 33}
      ];
//Table Footer
var tblfoot = [
      ["Source: U.S. Census Bureau ("+ fmt_yr(curYr) +"), "+ fmt_yr(prevYr) + '-' + fmt_yr(curYr) +' American Community Survey Table B03002'],
      ["Compiled by the Colorado State Demography Office"],
      ['Print Date : ' + fmt_date(new Date)]
      ];
      

var ftrString = "<tfoot><tr>";
for(i = 0; i < tblfoot.length; i++){
	if(level == "Municipality") {
		ftrString = ftrString + "<tr><td colspan='13'>" + tblfoot[i] + "</td></tr>";
	} else {
     ftrString = ftrString + "<tr><td colspan='9'>" + tblfoot[i] + "</td></tr>";
	}
 }; 
ftrString = ftrString + "</tr></tfoot>";
 
var race_tab = genSubjTab(level, tab_data, bkMark.id,row_labels,false);

var nameArr = [...new Set(inData.map(d => d.NAME))];
var fipsArr2 = [...new Set(inData.map(d => d.FIPS))];
var fileName = nameArr[1] + " ACS Race and Ethnicity Table";

pgSetupPro(level,"table",TabDiv,bkMark,true,false,fipsArr2, nameArr, curYr)


//Initial Table
var tabVal = 0;

if(level == "Region"){
   var btndown4 = document.getElementById("increment14");
   var btnup4 = document.getElementById("increment24");

DTtab("TabDiv4",race_tab,tabVal,row_labels,ftrString,tblfoot,"racetabDT",fileName,bkMark.title) 

   btndown4.addEventListener('click', function() {
     tabVal = tabVal - 1;
	 if(tabVal < 0) {
		tabVal = 5
	 }
		   DTtab("TabDiv4",race_tab,tabVal,row_labels,ftrString,tblfoot,"racetabDT",fileName,bkMark.title) 
   });
  btnup4.addEventListener('click', function() {
     tabVal = tabVal + 1;
	 if(tabVal > 5) {
		tabVal = 0
	 }
		   DTtab("TabDiv4",race_tab,tabVal,row_labels,ftrString,tblfoot,"racetabDT",fileName,bkMark.title) 
    });
} else {
	DTtab("TabDiv4",race_tab,tabVal,row_labels,ftrString,tblfoot,"racetabDT",fileName,bkMark.title) 
}

//DTTable

} 
// genRaceTab



function income_plot(level,inData,outDiv, bkMark, acsYear, acsTab) {
//income_plot  ACS Income Plot Wrapper
const fmt_date = d3.timeFormat("%B %d, %Y");

	var fipsArr = [...new Set(inData.map(d => d.FIPS))];
	var nameArr = [...new Set(inData.map(d => d.NAME))];


if(level == "Region") {
 pgSetupPro(level,"chart",outDiv,bkMark,true,false,fipsArr, nameArr, acsYear)

   var selopts = "8,-101";
   $.each(selopts.split(","), function(i,e){
          $("#geoSelect1 option[value='" + e + "']").prop("selected", true);
       }); 
  
   var dd0 = document.getElementById("geoSelect1");
   var btn0 = document.getElementById("plotBtn1");

  genIncomePlot(level, inData,dd0, "PlotDiv1",acsYear,acsTab);

   btn0.addEventListener('click', function() {
    genIncomePlot(level, inData,dd0, "PlotDiv1",acsYear, acsTab)
       });
    
} else {
 pgSetupPro(level,"chart",outDiv,bkMark,true,false,fipsArr, nameArr, acsYear);
 genIncomePlot(level, inData,dd0, "PlotDiv1",acsYear, acsTab)

}
} 
// income_plot


function educ_plot(level,inData,outDiv, bkmark, acsYear, acsTab) {
//educ_plot  Educational Attainment Plot wrapper
const fmt_date = d3.timeFormat("%B %d, %Y");

if(inData.length === 1) {
	var fipsArr = inData.FIPS;
	var nameArr = inData.NAME;
} else {
	var fipsArr = [];
	var nameArr = [];
	for(i = 0; i < inData.length; i++){
		fipsArr.push(inData[i].FIPS);
		nameArr.push(inData[i].NAME);
	}
}

if(level == "Region") {
 pgSetupPro(level,"chart",outDiv,bkmark,true,false,fipsArr, nameArr, acsYear)
 
   var selopts = "8,-101";
   $.each(selopts.split(","), function(i,e){
          $("#geoSelect3 option[value='" + e + "']").prop("selected", true);
       }); 
  
   var dd0 = document.getElementById("geoSelect3");
   var btn0 = document.getElementById("plotBtn3");

  genEducPlot(level, inData,dd0, "PlotDiv3",acsYear,acsTab);

   btn0.addEventListener('click', function() {
    genEducPlot(level, inData,dd0, "PlotDiv3",acsYear, acsTab)
       });
    
} else {
 pgSetupPro(level,"chart",outDiv,bkmark,true,false,fipsArr, nameArr, acsYear)
 genEducPlot(level, inData,dd0, "PlotDiv3",acsYear, acsTab)

} 
} 
// educ_plot

//cat Functions for each Profile output panel 


function genSel1map(level, fipsArr,nameArr,outDiv,bkMarkArr){
//genSel1map The first tab, map

 const fmt_date = d3.timeFormat("%B %d, %Y");
 const fmt_yr = d3.format("00");

  
 const ctyList = ['Region', 'County', 'Regional Comparison', 'County Comparison'] 
    const muniList = ['Municipality', 'Municipal Comparison'];
 const placeList = ['Census Designated Place', 'Census Designated Place Comparison'];
 const ctyPath = '../data/County_GEN_2014.geojson';
 const placecentroid = '../data/place_centroids.csv';
 
 //Set up projections and other mappy stuff
 var width = 600;
    var height = 300;
//Prep dom

 pgSetupPro(level,"map",outDiv,bkMarkArr,true,false,fipsArr, nameArr, 0)

 //Generating output div
 var outDiv2 = document.getElementById("PlotDiv1");
 
//Create a list of counties from the region lists

var prom = [d3.json(ctyPath),d3.csv(placecentroid)]

Promise.all(prom).then(data =>{

 let projection = d3.geoMercator();
    projection.fitSize([width, height], data[0]);
    let geoGenerator = d3.geoPath().projection(projection);
 

var centData = []
for(i = 0; i < data[1].length; i++){
if(fipsArr.includes(data[1][i].placefp)){
 centData.push({'placefp' : data[1][i].placefp, 'name' : data[1][i].namelsad, 'long' : +data[1][i].x, 'lat' :+data[1][i].y});
 };
}


//Appending the svg
var div = d3.select(outDiv2).append("div").attr("class","tooltip").style("opacity",0);
var coMap = d3.select(outDiv2).append('svg').attr('width', width).attr('height', height);
     

if(ctyList.includes(level)) {

  //Plotting County Map
 coMap.append("g")
      .selectAll("path")
   .data(data[0].features)
   .enter()
      .append("path")
   .attr('class','cty')
   .attr('d', geoGenerator) 
   .attr('stroke', '#000')
   .attr('fill',function(d){ return selColor(fipsArr,nameArr,d,level);})
      .on("mouseover", function(event,d,i) {  
            div.transition()        
                .duration(200)      
                .style("opacity", function() {return selGeo(fipsArr,d,level) ? 1 : 0;}); 
            div.text(function() {return selGeo(fipsArr,d,level) ? d.properties.NAMELSAD : "";}) 
                .style("left", (event.pageX) + "px")     
                .style("top", (event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function() {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
} else { //Muni and CDP map
   coMap.append("g")
     .selectAll("path")
     .data(data[0].features)
     .enter()
     .append("path")
     .attr('class','cty')
     .attr('d', geoGenerator) 
     .attr('stroke', '#000')
     .attr('fill','#FFFFFF');
     
 coMap.selectAll("myCircles")
    .data(centData)
    .enter()
    .append("circle")
   .attr("cx", function(d){ return projection([d.long, d.lat])[0];})
   .attr("cy", function(d){ return projection([d.long, d.lat])[1];})
   .attr("r", 5)
   .style("fill", '#008000')
   .attr("stroke",  '#000000')
   .attr('stroke-width', 2)
   .style("opacity", 1 ) 
   .on("mouseover", function(event,d,i) {
     div.transition()        
      .duration(200)      
      .style("opacity", 1 ); 
     div.text(d.name) 
      .style("left", (event.pageX) + "px")     
      .style("top", (event.pageY - 28) + "px");    
   })                  
           .on("mouseout", function(d) {       
     div.transition(d)        
      .duration(500)      
      .style("opacity", 0);     
            }); 
};

}); //end of Promise
 
//Buttons and image download  Check the elements and modify export to png...

var profileDL1 = document.getElementById('profileDL1');
profileDL1.onclick = function() {exportToPng(nameArr, 'map', outDiv2,0)};
}; //end of genSel1map

function genSel1tab(level, fipsArr, nameArr, bkMark, outputPro, curYr, acsYr) {
// genSel1tab produces the "Basic Stateistics DataTabls for the first panel

  const fmt_date = d3.timeFormat("%B %d, %Y");
  const fmt_yr = d3.format("0000");


/*
Table Contents and Sources
 Current Year Population, SDO
 10 year Population Change, SDO
 10 year Percentage Change, SDO 
Current Year Total Employment, SDO 
Current ACS Median Household Income
Current ACS Median Home Value
Current ACS Percentage of Population with incomes below poverty line.
Current ACS Percentage of Population born in Colorado
*/

 const yrlist = [curYr - 10, curYr];
 
 const regList = ['Region', 'Regional Comparison'];
 const ctyList = ['County', 'County Comparison'];
 const muniList = ['Municipality', 'Municipal Comparison'];
 

if(regList.includes(level)) {
//Building fips Lists
  for(i = 0; i < fipsArr.length; i++) {
    var regNum = parseInt(fipsArr[i]);
    var tmplist = regionCOL(regNum);
    var fips_list =  tmplist[0].fips.map(function (x) { 
     return parseInt(x, 10); 
   });
  }
  
//Generating Urls 
 var fipsACS = [];

 for(i = 0; i < fips_list.length; i++){
   fipsACS.push(fips_list[i].toString().padStart(3,'0'));
    };
  //Population
  var popST =  'https://gis.dola.colorado.gov/lookups/components_region?reg_num=0&year=' + yrlist;
  var popCTY = 'https://gis.dola.colorado.gov/lookups/components?county=' + fips_list + '&year=' + yrlist;
  //Jobs
  var jobsST = 'https://gis.dola.colorado.gov/lookups/jobs?county=0&year='+ curYr +'&sector=0';
  var jobsCTY = 'https://gis.dola.colorado.gov/lookups/jobs?county='+fips_list+'&year='+ curYr +'&sector=0';
  

  //median Income ACS  B19013  
  var incST = genACSUrl("profile",acsYr,'B19013',1,1,'state',fipsACS)
  var incCTY = genACSUrl("profile",acsYr,'B19013',1,1,level,fipsACS)
    
	
  //median house value ACS B25077
  var hvalST = genACSUrl("profile",acsYr,'B25077',1,1,'state',fipsACS)
  var hvalCTY = genACSUrl("profile",acsYr,'B25077',1,1,level,fipsACS)
  
  //pct poverty ACS B17001
  var povST = genACSUrl("profile",acsYr,'B17001',1,59,'state',fipsACS);
  var povCTY = genACSUrl("profile",acsYr,'B17001',1,59,level,fipsACS);
  
  //pct native CO ACS B05002
  var natST = genACSUrl("profile",acsYr,'B05002',1,27,'state',fipsACS);
  var natCTY = genACSUrl("profile",acsYr,'B05002',1,27,level,fipsACS);

  var prom = [d3.json(popST), d3.json(jobsST), d3.json(incST), d3.json(hvalST), d3.json(povST), d3.json(natST),
			  d3.json(popCTY), d3.json(jobsCTY), d3.json(incCTY), d3.json(hvalCTY), d3.json(povCTY), d3.json(natCTY)
     ];
 } //Region
 
if(ctyList.includes(level)) {
    var fips_list = [];
 var fipsACS = [];
  for(i = 0; i < fipsArr.length; i++) {
    fips_list.push(parseInt(fipsArr[i]));
    fipsACS.push(fipsArr[i]);
 }
 
  //Population
  var popST =  'https://gis.dola.colorado.gov/lookups/components_region?reg_num=0&year=' + yrlist;
  var popCTY = 'https://gis.dola.colorado.gov/lookups/components?county=' + fips_list + '&year=' + yrlist;
  //Jobs
  var jobsST = 'https://gis.dola.colorado.gov/lookups/jobs?county=0&year='+ acsYr +'&sector=0';
  var jobsCTY = 'https://gis.dola.colorado.gov/lookups/jobs?county='+fips_list+'&year='+ acsYr +'&sector=0';
  

  //median Income ACS  B19013  
  var incST = genACSUrl("profile",acsYr,'B19013',1,1,'state',fipsACS)
  var incCTY = genACSUrl("profile",acsYr,'B19013',1,1,level,fipsACS)
  
  //median house value ACS B25077
  var hvalST = genACSUrl("profile",acsYr,'B25077',1,1,'state',fipsACS)
  var hvalCTY = genACSUrl("profile",acsYr,'B25077',1,1,level,fipsACS)
  
  //pct poverty ACS B17001
  var povST = genACSUrl("profile",acsYr,'B17001',1,59,'state',fipsACS);
  var povCTY = genACSUrl("profile",acsYr,'B17001',1,59,level,fipsACS);
  
  //pct native CO ACS B05002
  var natST = genACSUrl("profile",acsYr,'B05002',1,27,'state',fipsACS);
  var natCTY = genACSUrl("profile",acsYr,'B05002',1,27,level,fipsACS);


   var prom = [d3.json(popST), d3.json(jobsST), d3.json(incST), d3.json(hvalST), d3.json(povST), d3.json(natST),
			  d3.json(popCTY), d3.json(jobsCTY), d3.json(incCTY), d3.json(hvalCTY), d3.json(povCTY), d3.json(natCTY)
     ];
} //County

 if(muniList.includes(level)) {

  var fips_list =[];
  var muni_cty = [];
   var muni_cty_acs = [];
  var fipsACS = [];
  for(i = 0; i < fipsArr.length; i++){
   fips_list.push(parseInt(fipsArr[i]));
   var ctyVal = muni_county(fipsArr[i]);
   muni_cty.push(parseInt(ctyVal));
   muni_cty_acs.push(ctyVal);
   fipsACS.push(fipsArr[i]);
  };
  
  var popST =  'https://gis.dola.colorado.gov/lookups/components_region?reg_num=0&year=' + yrlist;
  var popCTY = 'https://gis.dola.colorado.gov/lookups/components?county=' + muni_cty + '&year=' + yrlist;
  var popMUNI = 'https://gis.dola.colorado.gov/lookups/munipophousing?year=' + yrlist + '&placefips=' + fips_list + '&compressed=no';
   
  // Jobs
  var jobsST = 'https://gis.dola.colorado.gov/lookups/jobs?county=0&year='+ acsYr +'&sector=0';
  var jobsCTY = 'https://gis.dola.colorado.gov/lookups/jobs?county='+ muni_cty+'&year='+ acsYr +'&sector=0';
  var jobsMUNI = 'https://gis.dola.colorado.gov/lookups/profilesql?table=estimates.muni_jobs_long&year='+ (acsYr - 1) + '&geo='+ fips_list;
 

 //median Income ACS  b19013001
  var incST = genACSUrl("profile",acsYr,'B19013',1,1,'state',fipsACS)
  var incCTY = genACSUrl("profile",acsYr,'B19013',1,1,'county',muni_cty_acs);
  var incMUNI = genACSUrl("profile",acsYr,'B19013',1,1,level,fipsACS);
    
 //median house value ACS B25077
  var hvalST = genACSUrl("profile",acsYr,'B25077',1,1,'state',fipsACS)
  var hvalCTY = genACSUrl("profile",acsYr,'B25077',1,1,'county',muni_cty_acs)
  var hvalMUNI = genACSUrl("profile",acsYr,'B25077',1,1,level,fipsACS)
  
 //pct poverty ACS B17001
  var povST = genACSUrl("profile",acsYr,'B17001',1,59,'state',fipsACS);
  var povCTY = genACSUrl("profile",acsYr,'B17001',1,59,'county',muni_cty_acs);
  var povMUNI = genACSUrl("profile",acsYr,'B17001',1,59,level,fipsACS);
  
  //pct native CO ACS B05002
  var natST = genACSUrl("profile",acsYr,'B05002',1,27,'state',fipsACS);
  var natCTY = genACSUrl("profile",acsYr,'B05002',1,27,'county',muni_cty_acs);
  var natMUNI = genACSUrl("profile",acsYr,'B05002',1,27,level,fipsACS);

   var prom = [d3.json(popST), d3.json(jobsST), d3.json(incST), d3.json(hvalST), d3.json(povST), d3.json(natST),
              d3.json(popCTY), d3.json(jobsCTY), d3.json(incCTY), d3.json(hvalCTY), d3.json(povCTY), d3.json(natCTY),
			  d3.json(popMUNI), d3.json(jobsMUNI), d3.json(incMUNI), d3.json(hvalMUNI), d3.json(povMUNI), d3.json(natMUNI)
     ];
  }  //Muni
  

Promise.all(prom).then(data =>{
 
   if(regList.includes(level)){
    //Extracting State data records
    var popSTdata = data[0];
    var jobsSTdata = data[1];
    var incSTdata = acsPrep(data[2]);
    var hvalSTdata = acsPrep(data[3]);
    var povSTdata = acsPrep(data[4]);
    var natSTdata = acsPrep(data[5]);
 	
	var popCTYdata = data[6].sort(function(a, b){ return d3.ascending(a['year'], b['year']); }).sort(function(a, b){ return d3.ascending(a['countyfips'], b['countyfips']); });;
    var jobsCTYdata = data[7].sort(function(a, b){ return d3.ascending(a['area_code'], b['area_code']); });
    var incCTYdata = acsPrep(data[8]).sort(function(a, b){ return d3.ascending(a['GEO2'], b['GEO2']); });
    var hvalCTYdata = acsPrep(data[9]).sort(function(a, b){ return d3.ascending(a['GEO2'], b['GEO2']); });
    var povCTYdata = acsPrep(data[10]).sort(function(a, b){ return d3.ascending(a['GEO2'], b['GEO2']); });
    var natCTYdata = acsPrep(data[11]).sort(function(a, b){ return d3.ascending(a['GEO2'], b['GEO2']); });
     
	//Generating data sets 
   //Population Growth
   var tabgrST = calcpopGR(popSTdata,fipsArr,'state',yrlist);
   var tabgrREG = calcpopGR(popCTYdata,fipsArr,level,yrlist);
   var tabgrFIN =  tabgrST.concat(tabgrREG);
	

   //Jobs
   
   var state_jobs = [];
    state_jobs.push({'area_code' : jobsSTdata[0].area_code, 'name' : 'Colorado', 'population_year' : jobsSTdata[0].population_year, 'total_jobs' : +jobsSTdata[0].total_jobs});

   var cty_jobs = [];

    for(j = 0; j < jobsCTYdata.length; j++){
     cty_jobs.push({'area_code' : jobsCTYdata[j].area_code, 'name' : countyName(jobsCTYdata[j].area_code), 'population_year' : jobsCTYdata[j].population_year, 'total_jobs' : +jobsCTYdata[j].total_jobs});
    }; //J loop
 
    var reg_jobs = [];
    var pop_year = cty_jobs[0].population_year;
    var reg_val = -100 - parseInt(fipsArr[0])
    var jobs_reg = d3.rollup(cty_jobs, v => d3.sum(v, d => d.total_jobs));
    reg_jobs.push({'area_code' : reg_val, 'name' : nameArr[0], 'population_year' : pop_year, 'total_jobs' : jobs_reg});
    
	var jobsFIN = state_jobs.concat(reg_jobs, cty_jobs);
	
	//Median Income ACS
   var state_income = [];
   state_income.push({'fips' : incSTdata[0].GEO1, 'name' : incSTdata[0].NAME, 'est' : incSTdata[0].B19013_001E, 'moe' : incSTdata[0].B19013_001M});
   var median_income1 = procMedian(incCTYdata,fipsArr,'B19013_001E','B19013_001M',nameArr);
   var median_income = state_income.concat(median_income1);
   

   //Median House Value
   var state_home = [];
   state_home.push({'fips' : hvalSTdata[0].GEO1, 'name' : hvalSTdata[0].NAME, 'est' : hvalSTdata[0].B25077_001E, 'moe' : hvalSTdata[0].B25077_001M});
   var median_home1 = procMedian(hvalCTYdata,fipsArr,'B25077_001E','B25077_001M',nameArr);
   var median_home = state_home.concat(median_home1);


   //pct poverty
   var pov_state = procPCT(povSTdata,0,'B17001','state',nameArr);
   var pov_reg = procPCT(povCTYdata,fipsArr,'B17001',level,nameArr);
   var poverty = pov_state.concat(pov_reg);
   
   //pct native
   var coNat_state = procPCT(natSTdata,0,'B05002','state',nameArr);
   var coNat_reg = procPCT(natCTYdata,fipsArr,'B05002',level,nameArr);
   var coNative = coNat_state.concat(coNat_reg);
   }; //level = region

if(ctyList.includes(level)){
    var popSTdata = data[0];
    var jobsSTdata = data[1];
    var incSTdata = acsPrep(data[2]);
    var hvalSTdata = acsPrep(data[3]);
    var povSTdata = acsPrep(data[4]);
    var natSTdata = acsPrep(data[5]);
    
	var popCTYdata = data[6];
    var jobsCTYdata = data[7];
    var incCTYdata = acsPrep(data[8]);
    var hvalCTYdata = acsPrep(data[9]);
    var povCTYdata = acsPrep(data[10]);
    var natCTYdata = acsPrep(data[11]);
	 

   //Population Growth 
   var tabgrST = calcpopGR(popSTdata,fips_list,'state',yrlist);
   var tabgrCTY = calcpopGR(popCTYdata,fips_list,level,yrlist);
   var tabgrFIN =  tabgrCTY.concat(tabgrST);
   
   //Jobs
  var state_jobs = [];
    state_jobs.push({'area_code' : jobsSTdata[0].area_code, 'name' : 'Colorado', 'population_year' : jobsSTdata[0].population_year, 'total_jobs' : +jobsSTdata[0].total_jobs});

   var cty_jobs = [];
     cty_jobs.push({'area_code' : jobsCTYdata[0].area_code, 'name' : countyName(jobsCTYdata[0].area_code), 'population_year' : jobsCTYdata[0].population_year, 'total_jobs' : +jobsCTYdata[0].total_jobs});

	var jobsFIN = cty_jobs.concat(state_jobs);

   //Median Income -- 
    var state_income = [];
   state_income.push({'fips' : incSTdata[0].GEO1, 'name' : incSTdata[0].NAME, 'est' : incSTdata[0].B19013_001E, 'moe' : incSTdata[0].B19013_001M});

   var county_income = [];
   county_income.push({'fips' : incCTYdata[0].GEO2, 'name' : incCTYdata[0].NAME, 'est' : incCTYdata[0].B19013_001E, 'moe' : incCTYdata[0].B19013_001M});
   var median_income = county_income.concat(state_income); 
   
   //Median House Value
   var state_home = [];
   state_home.push({'fips' : hvalSTdata[0].GEO1, 'name' : hvalSTdata[0].NAME, 'est' : hvalSTdata[0].B25077_001E, 'moe' : hvalSTdata[0].B25077_001M});

   var county_home = [];
   county_home.push({'fips' : hvalCTYdata[0].GEO2, 'name' : hvalCTYdata[0].NAME, 'est' : hvalCTYdata[0].B25077_001E, 'moe' : hvalCTYdata[0].B25077_001M});
   var median_home = county_home.concat(state_home);
 
   //pct poverty
   var povertyST = procPCT(povSTdata,fipsArr,'B17001','state',nameArr);
   var povertyCTY = procPCT(povCTYdata,fipsArr,'B17001',level,nameArr);
   var poverty  = povertyCTY.concat(povertyST);
   
   //pct native
   var coNativeST = procPCT(natSTdata,fipsArr,'B05002','county',nameArr);
   var coNativeCTY = procPCT(natCTYdata,fipsArr,'B05002',level,nameArr);
   var coNative = coNativeCTY.concat(coNativeST);
}; //level = county   

if(muniList.includes(level)){
    var popSTdata = data[0];
    var jobsSTdata = data[1];
    var incSTdata = acsPrep(data[2]);
    var hvalSTdata = acsPrep(data[3]);
    var povSTdata = acsPrep(data[4]);
    var natSTdata = acsPrep(data[5]);
	
    var popCTYdata = data[6];
    var jobsCTYdata = data[7];
    var incCTYdata = acsPrep(data[8]);
    var hvalCTYdata = acsPrep(data[9]);
    var povCTYdata = acsPrep(data[10]);
    var natCTYdata = acsPrep(data[11]);
    
	var popMUNIdata = data[12];
    var jobsMUNIdata = data[13];
    var incMUNIdata = acsPrep(data[14]);
    var hvalMUNIdata = acsPrep(data[15]);
    var povMUNIdata = acsPrep(data[16]);
    var natMUNIdata = acsPrep(data[17]);
     

//removing multi-county 
if(popMUNIdata.length > 2){
	var tmppop = popMUNIdata.filter(function(d) {return d.countyfips == 999});
	var popMUNIdata = tmppop;
	};

    //Population Growth 
   var tabgrST = calcpopGR(popSTdata,fips_list,'state',yrlist);
   var tabgrCTY = calcpopGR(popCTYdata,fips_list,'County',yrlist);
   var tabgrMUNI = calcpopGR(popMUNIdata,fips_list,level,yrlist);
   var tabgrFIN =  tabgrMUNI.concat(tabgrCTY, tabgrST);

   //Jobs
  var st_jobs = [];
    st_jobs.push({'area_code' : jobsSTdata[0].area_code, 'name' : 'Colorado', 'population_year' : jobsSTdata[0].population_year, 'total_jobs' : +jobsSTdata[0].total_jobs});

  var cty_jobs = [];
    cty_jobs.push({'area_code' : jobsCTYdata[0].area_code, 'name' : countyName(jobsCTYdata.area_code), 'population_year' : jobsCTYdata[0].population_year, 'total_jobs' : +jobsCTYdata[0].total_jobs});

   var muni_jobs = [];
     muni_jobs.push({'area_code' : +jobsMUNIdata[0].placefips, 'name' : muniName(jobsMUNIdata[0].placefips), 'population_year' : +jobsMUNIdata[0].year, 'total_jobs' : +jobsMUNIdata[0].jobs});

	var jobsFIN = muni_jobs.concat(cty_jobs,st_jobs);
    
   //Median Income
   var st_income = [];
   st_income.push({'fips' : incSTdata[0].GEO2, 'name' : incSTdata[0].NAME, 'est' : incSTdata[0].B19013_001E, 'moe' : incSTdata[0].B19013_001M});

   var county_income = [];
   county_income.push({'fips' : incCTYdata[0].GEO2, 'name' : incCTYdata[0].NAME, 'est' : incCTYdata[0].B19013_001E, 'moe' : incCTYdata[0].B19013_001M});

   var muni_income = [];
   muni_income.push({'fips' : incMUNIdata[0].GEO2, 'name' : incMUNIdata[0].NAME, 'est' : incMUNIdata[0].B19013_001E, 'moe' : incMUNIdata[0].B19013_001M});
   var median_income = muni_income.concat(county_income,st_income);
      
   //Median House Value
   var st_home = [];
   st_home.push({'fips' : hvalSTdata[0].GEO2, 'name' : hvalSTdata[0].NAME, 'est' : hvalSTdata[0].B25077_001E, 'moe' : hvalSTdata[0].B25077_001M});

   var county_home = [];
   county_home.push({'fips' : hvalCTYdata[0].GEO2, 'name' : hvalCTYdata[0].NAME, 'est' : hvalCTYdata[0].B25077_001E, 'moe' : hvalCTYdata[0].B25077_001M});

   var muni_home = [];
   muni_home.push({'fips' : hvalMUNIdata[0].GEO2, 'name' : hvalMUNIdata[0].NAME, 'est' : hvalMUNIdata[0].B25077_001E, 'moe' : hvalMUNIdata[0].B25077_001M});
   var median_home = muni_home.concat(county_home, st_home);
   
   //pct poverty
   var povertyST = procPCT(povSTdata,fipsArr,'B17001','state',nameArr);
   var povertyCTY = procPCT(povCTYdata,fipsArr,'B17001','county',nameArr);
   var povertyMUNI = procPCT(povMUNIdata,fipsArr,'B17001',level,nameArr);
   var poverty  = povertyMUNI.concat(povertyCTY,povertyST);
   
   //pct native
   var coNativeST = procPCT(natSTdata,fipsArr,'B05002','state',nameArr);
   var coNativeCTY = procPCT(natCTYdata,fipsArr,'B05002','county',nameArr);
   var coNativeMUNI = procPCT(natMUNIdata,fipsArr,'B05002',level,nameArr);
   var coNative = coNativeMUNI.concat(coNativeCTY,coNativeST);


}; //level = municipality   


//Prepping output table
//Building table data	

var outData = [];
for(i = 0; i < tabgrFIN.length; i++){
		outData.push({
			fips : tabgrFIN[i].fips,
			name : tabgrFIN[i].name,
			pop: fixNUMFMT(tabgrFIN[i].yr2,"num"),
			pop_change : fixNUMFMT(tabgrFIN[i].popch,"num"),
			pop_growth : fixNUMFMT(tabgrFIN[i].growth,"pct"),
			total_jobs : fixNUMFMT(jobsFIN[i].total_jobs,"num"),
			income_est : fixNUMFMT(median_income[i].est,"cur"),
			income_moe : fixNUMFMT(median_income[i].moe,"cur"),
			home_est : fixNUMFMT(median_home[i].est,"cur"),
			home_moe : fixNUMFMT(median_home[i].moe,"cur"),
			pov_est : fixNUMFMT(poverty[i].pct_est,"pct"),
			pov_moe : fixNUMFMT(poverty[i].pct_moe,"pct"),
			co_est : fixNUMFMT(coNative[i].pct_est,"pct"),
			co_moe : fixNUMFMT(coNative[i].pct_moe,"pct")
})
};

var curyr = yrlist[1];
var prevyr = yrlist[0];


var row_labels = [
       {'title': 'Population ('+curyr+')*', 'URL_link' : muniList.includes(level) ? 'https://demography.dola.colorado.gov/assets/lookups/muni_pop_lookup.html' : 'https://demography.dola.colorado.gov/assets/lookups/county_totpop_lookup.html'},
       {'title': 'Population Change (' + prevyr + ' to ' + curyr + ')*', 'URL_link' : muniList.includes(level) ? 'https://demography.dola.colorado.gov/assets/lookups/muni_pop_lookup.html' : 'https://demography.dola.colorado.gov/assets/lookups/county_totpop_lookup.html'},
       {'title': 'Percentage Change (' + prevyr + ' to ' + curyr + ')*', 'URL_link' : muniList.includes(level) ? 'https://demography.dola.colorado.gov/assets/lookups/muni_pop_lookup.html' : 'https://demography.dola.colorado.gov/assets/lookups/county_totpop_lookup.html/'},
       {'title': 'Total Employment (' + curyr + ')*', 'URL_link': 'https://demography.dola.colorado.gov/assets/lookups/county_jobsfore_lookup.html'},
       {'title': 'Median Household Income^', 'URL_link' :  genCEDSCIUrl(level,'B19013',acsYr,fipsACS)},
       {'title': 'Median Home Value^', 'URL_link' : genCEDSCIUrl(level,'B25077',acsYr,fipsACS)},
       {'title': 'Percentage of Population with incomes below poverty line.^', 'URL_link' : genCEDSCIUrl(level,'B17001',acsYr,fipsACS)},
       {'title': 'Percentage of Population born in Colorado^', 'URL_link' : genCEDSCIUrl(level,'B05002',acsYr,fipsACS)}
    ];

var tab_obj = genSubjTab(level, outData,bkMark.id,row_labels,false);

var fileName = nameArr[0] + " Basic Statistics";
pgSetupPro(level,"table",outputPro,bkMark,false,false,fipsArr, nameArr, 0)
//Table Footer

var acsyr1 = acsYr - 4;

var tblfoot = [
               ["Sources: * Colorado State Demography Office"],
               ['^U.S. Census Bureau (' + fmt_yr(curyr) + '). '+fmt_yr(acsyr1) + '-' + fmt_yr(acsYr) +' American Community Survey 5-year data set.'],
               ['Print Date : ' + fmt_date(new Date)]
      ];
	  

var ftrString = "<tfoot><tr>";
for(i = 0; i < tblfoot.length; i++){
	if(muniList.includes(level)) {
     ftrString = ftrString + "<tr><td colspan='7'>" + tblfoot[i] + "</td></tr>";
	} else {
	 ftrString = ftrString + "<tr><td colspan='5'>" + tblfoot[i] + "</td></tr>";
	}
 }; 
ftrString = ftrString + "</tr></tfoot>";

var ftrMsg = "Sources: * Colorado State Demography Office " + '^U.S. Census Bureau (' + fmt_yr(curyr) + '). '+fmt_yr(acsyr1) + '-' + fmt_yr(acsYr) +' American Community Survey 5-year data set.' +
   "Print Date : " + fmt_date(new Date);

//Initial Table
var tabVal = 0;

if(regList.includes(level)){
   var btndown = document.getElementById("increment12");
   var btnup = document.getElementById("increment22");

DTtab("TabDiv2",tab_obj,tabVal,row_labels,ftrString,tblfoot,"summtabDT",fileName,bkMark.title) 


   btndown.addEventListener('click', function() {
     tabVal = tabVal - 1;
	 if(tabVal < 0) {
		tabVal = 5
	 }
		   DTtab("TabDiv2",tab_obj,tabVal,row_labels,ftrString,tblfoot,"summtabDT",fileName,bkMark.title);
   });
  btnup.addEventListener('click', function() {
     tabVal = tabVal + 1;
	 if(tabVal > 5) {
		tabVal = 0
	 }
		   DTtab("TabDiv2",tab_obj,tabVal,row_labels,ftrString,tblfoot,"summtabDT",fileName,bkMark.title);
    });
} else {
	DTtab("TabDiv2",tab_obj,tabVal,row_labels,ftrString,tblfoot,"summtabDT",fileName,bkMark.title);
}
  }); //End of Promise
  
};  
// genSel1Tab


function genSel1display(geotype, fipsArr, names, curyear, acsyr, PRO_1, PRO_2, PRO_3, PRO_4) {
//genSel1display outputs objects for the first panel of the profile display
   PRO_1.innerHTML = "";
   PRO_2.innerHTML = "";
   PRO_3.innerHTML = "";
   PRO_4.innerHTML = "";
   
 
//Generate Bookmark array
var bkMarkArr = [{title : names[0] + " Basic Statistics", id : "map", srctxt : "Selection Map", srclink : ""},
	{title: "Summary Statistics Table", id : "summtab", srctxt : "Summary Statistics Table", srclink : ""}
	]

insertBkmark(bkMarkArr);

  genSel1map(geotype, fipsArr, names, PRO_1.id, bkMarkArr[0]);
  genSel1tab(geotype, fipsArr, names, bkMarkArr[1], PRO_2.id,curyear, acsyr);
 };
// genSel1display


function genSel2display(geotype, fipsArr, names, curyear, PRO_1, PRO_2, PRO_3, PRO_4) {
//genSel2display  Outputs objects for the Population Trends panel of the profile... 

  const fmt_date = d3.timeFormat("%B %d, %Y");
  const fmt_yr = d3.format("00");
  const regList = ['Region', 'Regional Comparison'];
  const ctyList = ['County', 'County Comparison'];
  const muniList = ['Municipality', 'Municipal Comparison'];
  const placeList = ['Census Designated Place', 'Census Designated Place Comparison'];
  const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

//prepping general values 
 var yr_list = range(1985,curyear); 
 var forc_yrs = range(curyear,2050); 
 var state_list = [1,3,5,7,9,11,13,14,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125];
 var esturl_state = "https://gis.dola.colorado.gov/lookups/profile?county=" + state_list + "&year=" + yr_list + "&vars=totalpopulation,births,deaths,netmigration";
  var forcurl_state = "https://gis.dola.colorado.gov/lookups/sya?county=" + state_list + "&year=" + forc_yrs + "&choice=single&group=3" 
  
//Clear out Divs

  PRO_1.innerHTML = "";
  PRO_2.innerHTML = "";
  PRO_3.innerHTML = "";
  PRO_4.innerHTML = "";

//Regions
if(regList.includes(geotype)){
	//Generate Bookmark array
var bkMarkArr = [{title : 'Population Growth Table', id : 'popgr', srctxt : "Population Growth Table", srclink : "https://demography.dola.colorado.gov/assets/lookups/region_totpop_lookup.html"},
		{title : 'Regional Population Estimates', id : 'popest', srctxt : "Regional Population Estimates", srclink : "https://demography.dola.colorado.gov/assets/lookups/region_totpop_lookup.html"},
		{title : 'Regional Population Forecasts', id : 'popfor', srctxt : "Regional Population Forecasts", srclink : "https://demography.dola.colorado.gov/assets/lookups/region_sya_lookup.html"},
		{title : 'Regional Components of Change',	id : 'popcoc', srctxt : "Regional Components of Change", srclink : "https://demography.dola.colorado.gov/assets/lookups/region_coc_lookup.html"}
	]

insertBkmark(bkMarkArr);

   var fips_tmp = regionCOL(parseInt(fipsArr));
     var fips_list =  fips_tmp[0].fips.map(x => parseInt(x, 10));
  var ctyurl = "https://gis.dola.colorado.gov/lookups/profile?county=" + fips_list + "&year=" + yr_list + "&vars=totalpopulation,births,deaths,netmigration";
        var forcurl = "https://gis.dola.colorado.gov/lookups/sya?county=" + fips_list + "&year=" + forc_yrs + "&choice=single&group=3"
 
  var regionNum = -101;
  var prom = [d3.json(ctyurl),d3.json(forcurl),d3.json(esturl_state), d3.json(forcurl_state)];
  };


//Counties
if(ctyList.includes(geotype)) {
var bkMarkArr = [{title : 'Population Growth Table', id : 'popgr', srctxt : "County Population Estimates", srclink : "https://demography.dola.colorado.gov/assets/lookups/county_totpop_lookup.html"},
		{title : 'County Population Estimates', id : 'popest', srctxt : "County Population Estimates", srclink : "https://demography.dola.colorado.gov/assets/lookups/county_totpop_lookup.html"},
		{title : 'County Population Forecasts', id : 'popfor', srctxt : "County Population Forecasts", srclink : "https://demography.dola.colorado.gov/assets/lookups/county_sya_lookup.html"},
		{title : 'County Components of Change',	id : 'popcoc', srctxt : "County Components of Change", srclink : "https://demography.dola.colorado.gov/assets/lookups/county_coc_lookup.html"}
	]

insertBkmark(bkMarkArr);	

 if(fipsArr == "000") {
      fips_list = [1,3,5,7,9,11,13,14,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125];
    } else {
  fips_list = [parseInt(fipsArr)];
 }; 

 var ctyurl = "https://gis.dola.colorado.gov/lookups/profile?county=" + fips_list + "&year=" + yr_list + "&vars=totalpopulation,births,deaths,netmigration";
    var forcurl = "https://gis.dola.colorado.gov/lookups/sya?county=" + fips_list + "&year=" + forc_yrs + "&choice=single&group=3" 
 var prom = [d3.json(ctyurl),d3.json(forcurl),d3.json(esturl_state), d3.json(forcurl_state)];
}; 

//Municipalities -- Only for the growth table  
if(muniList.includes(geotype)){
var bkMarkArr = [{title : 'Population Growth Table', id : 'popgr', srctxt : "Municipal Population Estimates", srclink : "https://demography.dola.colorado.gov/assets/lookups/ctymuni_pop_lookup.html"},
		{title : 'Municipal Population Estimates', id : 'popest', srctxt : "Municipal Population Estimates", srclink : "https://demography.dola.colorado.gov/assets/lookups/ctymuni_pop_lookup.html"},
	]

insertBkmark(bkMarkArr);	
    var munifips = parseInt(fipsArr);   
    var ctyfips = parseInt(muni_county(fipsArr));
    var muniurl = 'https://gis.dola.colorado.gov/lookups/countymuni?placefips='+ munifips + '&year=' + yr_list +'&compressed=no';
 var ctyurl = "https://gis.dola.colorado.gov/lookups/profile?county=" + ctyfips + "&year=" + yr_list + "&vars=totalpopulation,births,deaths,netmigration";
    var forcurl = "https://gis.dola.colorado.gov/lookups/sya?county=" + ctyfips + "&year=" + forc_yrs + "&choice=single&group=3" 
 var prom = [d3.json(ctyurl),d3.json(forcurl),d3.json(esturl_state),d3.json(muniurl)];
};


Promise.all(prom).then(data =>{

// Processing State Table
var columnsToSum = ['births', 'deaths', 'netmigration', 'totalpopulation'];

//Rolling up data for table
var estsum_state =  d3.rollup(data[2], v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year)

//Flatten Arrays for output
var state_est = [];
var state_coc = [];
var state_gr_data = [];
for (let [key, value] of estsum_state) {
  state_est.push({'fips' : 0, 'name' : 'Colorado', 'year' : key, 'totalpopulation' : value.totalpopulation});
  state_coc.push({'fips' : 0, 'name' : 'Colorado', 'year' : key, 'totalpopulation' : value.totalpopulation, 
                  'births' : value.births, 'deaths' : value.deaths, 'netmigrarion' : value.netmigration});
     };
 
// Processing State forecast
var columnsToSum = ['totalpopulation'];

//Rolling up data for table
var foresum_state =  d3.rollup(data[3], v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year)

//Flatten Arrays for output
var state_fore = [];

for (let [key, value] of foresum_state) {
  state_fore.push({'fips' : 0, 'name' : 'Colorado', 'year' : key, 'totalpopulation' : value.totalpopulation});
     };
 

//Growth Table
// Generate data set for output Table

var sel_yr = range(1990,curyear);
var sel_yr5 = [];
for(i = 0; i < sel_yr.length;i++){
 if(sel_yr[i] % 5 == 0) {
  sel_yr5.push(sel_yr[i]);
 }
};


if(sel_yr5[sel_yr5.length] != curyear) {
	var val5 = sel_yr5.pop();
	 for(i = val5; i <= curyear;i++){
		 sel_yr5.push(i);
	 }
};

var cty_gr_data = data[0].filter(function(d) {return sel_yr5.includes(d.year)});
var state_gr_data = state_est.filter(function(d) {return sel_yr5.includes(d.year)});

var tab_cty_data = []
for(i = 0; i< cty_gr_data.length; i++){
  tab_cty_data.push({ 'fips' : cty_gr_data[i].countyfips, 'name' : countyName(cty_gr_data[i].countyfips), 'year' : cty_gr_data[i].year, 'totalpopulation' : +cty_gr_data[i].totalpopulation})
}

var fipsList = cty_gr_data[0].countyfips
var ctyNameList = countyName(cty_gr_data[0].countyfips)

//Regional Table
if(regList.includes(geotype)) {
var fileName = regionName(fipsArr) + " Population Growth Table"

//Rolling up data for table
var tab_reg_sum = d3.rollup(tab_cty_data, v => d3.sum(v, d => d.totalpopulation), d => d.year);

//Flatten Arrays for output

var tab_reg_data = [];
for (let [key, value] of tab_reg_sum) {
  tab_reg_data.push({'fips' : regionNum, 'name' : regionName(fipsArr), 'year' : key, 'totalpopulation' : value});
    };

var tab_gr = state_gr_data.concat(tab_reg_data,tab_cty_data) //This is 5 year data

//Estimates data
//Creating Single year data for the places and counties

var est_cty_data = []
for(i = 0; i< data[0].length; i++){
  est_cty_data.push({ 'fips' : data[0][i].countyfips, 'name' : countyName(data[0][i].countyfips), 'year' : data[0][i].year, 'totalpopulation' : +data[0][i].totalpopulation})
}

//Rolling up data for table
var est_reg_sum = d3.rollup(est_cty_data, v => d3.sum(v, d => d.totalpopulation), d => d.year);

//Flatten Arrays for output
var est_reg_data = [];
for (let [key, value] of est_reg_sum) {
  est_reg_data.push({'fips' : regionNum, 'name' : regionName(fipsArr), 'year' : key, 'totalpopulation' : value});
    };

var est_data = state_est.concat(est_reg_data,est_cty_data) //This is single year data


var fipsList = [...new Set(est_data.map(d => d.fips))];
var ctyNameList = [...new Set(est_data.map(d => d.name))];

//Generating Forecast data   
//This is Forecast by SYA

var forec_data = [];
for(i = 0; i< data[1].length; i++){
  forec_data.push({ 'fips' : data[1][i].countyfips, 'name' : countyName(data[1][i].countyfips), 'year' : data[1][i].year, 'age' : +data[1][i].age, 'totalpopulation' : +data[1][i].totalpopulation})
}

//rolling up for counties and region
var forec_reg_sum = d3.rollup(forec_data, v => d3.sum(v, d => d.totalpopulation), d => d.year);
var forec_cty_sum = d3.rollup(forec_data, v => d3.sum(v, d => d.totalpopulation), d => d.year, d => d.fips);
//Flatten Arrays for output
var forec_reg_data = [];
for (let [key, value] of forec_reg_sum) {
  forec_reg_data.push({'fips' : regionNum, 'name' : regionName(fipsArr), 'year' : key, 'totalpopulation' : value});
    };
 

var forec_cty_data = [];
for (let [key1, value] of forec_cty_sum) {
for (let[key2, value2] of value) {
   forec_cty_data.push({'fips' : key2, 'name' : countyName(key2), 'year' : key1, 'totalpopulation' : value2});
}
};

var forec_data = state_fore.concat(forec_reg_data, forec_cty_data);

//Components of Change
var columnsToSum = ['births', 'deaths', 'netmigration', 'totalpopulation'];
var coc_cty_data = []
for(i = 0; i< data[0].length; i++){
  coc_cty_data.push({ 'fips' : data[0][i].countyfips, 'name' : countyName(data[0][i].countyfips), 'year' : data[0][i].year, 
  'births' : +data[0][i].births, 'deaths' : +data[0][i].deaths, 'netmigration' : +data[0][i].netmigration, 'totalpopulation' : +data[0][i].totalpopulation})
}

//Rolling up data for table
var coc_reg_sum =  d3.rollup(data[0], v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year)

//Flatten Arrays for output
var coc_reg_data = [];
for (let [key, value] of coc_reg_sum) {
  coc_reg_data.push({'fips' : regionNum, 'name' : regionName(fipsArr), 'year' : key, 'births' : value.births, 'deaths' : value.deaths, 
               'netmigration' : value.netmigration, 'totalpopulation' : value.totalpopulation});
    };

var coc_data = state_coc.concat(coc_reg_data,coc_cty_data) //This is single year data

//Output
growth_tab(geotype, tab_gr,bkMarkArr[0],fileName, PRO_1.id);  
//Plots
//Add Colorado to fipsList and ctyNameList

var divArr = [PRO_2.id, PRO_3.id, PRO_4.id];
genRegPopSetup(geotype,est_data, forec_data, coc_data, divArr,bkMarkArr, fipsList, ctyNameList);
} //Regional

//County -- Need Growth Tab, Estimates, Forecasts, COC
if(ctyList.includes(geotype)) {
 var fileName =  countyName(parseInt(fipsArr)) + " Population Growth Table";

var tab_gr = tab_cty_data.concat(state_gr_data) //This is 5 year data

//Estimates data
//Creating Single year data for the places and counties
var est_cty_data = []
for(i = 0; i< data[0].length; i++){
  est_cty_data.push({ 'fips' : data[0][i].countyfips, 'name' : countyName(data[0][i].countyfips), 'year' : data[0][i].year, 'totalpopulation' : +data[0][i].totalpopulation})
}


var est_data = est_cty_data; //This is single year data
var fipsList = [...new Set(est_data.map(d => d.fips))];
var ctyNameList = [...new Set(est_data.map(d => d.name))];

//Generating Forecast data   
//This is Forecast by SYA
var forec_data = [];
for(i = 0; i< data[1].length; i++){
  forec_data.push({ 'fips' : data[1][i].countyfips, 'name' : countyName(data[1][i].countyfips), 'year' : data[1][i].year, 'age' : +data[1][i].age, 'totalpopulation' : +data[1][i].totalpopulation})
}

//rolling up for counties 
var forec_cty_sum = d3.rollup(forec_data, v => d3.sum(v, d => d.totalpopulation), d => d.year, d => d.fips);
//Flatten Arrays for output
var forec_cty_data = [];
for (let [key, value] of forec_cty_sum) {
  forec_cty_data.push({'fips' : fipsArr, 'name' : countyName(fipsArr), 'year' : key, 'totalpopulation' : value});
    };

var forec_data = forec_cty_data;

//Components of Change
var columnsToSum = ['births', 'deaths', 'netmigration'];
var coc_cty_data = []
for(i = 0; i< data[0].length; i++){
  coc_cty_data.push({ 'fips' : data[0][i].countyfips, 'name' : countyName(data[0][i].countyfips), 'year' : data[0][i].year, 
  'births' : +data[0][i].births, 'deaths' : +data[0][i].deaths, 'netmigration' : +data[0][i].netmigration})
}


var coc_data = coc_cty_data; //This is single year data
 growth_tab(geotype, tab_gr,bkMarkArr[0],fileName, PRO_1.id);  
 estPlot(est_data, "profile", geotype, PRO_2.id, bkMarkArr[1], curyear, fipsList, ctyNameList);
 var fore_Data = forecastPlot(data[1], "profile", geotype, PRO_3.id, bkMarkArr[2], curyear, fipsList, ctyNameList);
 cocPlot(data[0],"profile", geotype, PRO_4.id, bkMarkArr[3], curyear, fipsList, ctyNameList);
 }; //County


//Municipalities
if(muniList.includes(geotype)) {

//Checking for multi places
var muni_data = data[3].filter(d => d.countyfips != 999);
 
var muni_sum = d3.rollup(muni_data, v => d3.sum(v, d => d.totalpopulation), d => d.year);
var muni_raw_data = [];
for (let [key, value] of muni_sum) {
  muni_raw_data.push({'fips' : fipsArr, 'name' : muniName(fipsArr), 'year' : key, 'totalpopulation' : value});
    };
 

var tab_muni_data = muni_raw_data.filter(function(d) {return sel_yr5.includes(d.year)});
var fileName = muniName(parseInt(fipsArr)) + "Population Growth Table" ;


var tab_gr = tab_muni_data.concat(tab_cty_data, state_gr_data) //This is 5 year data

//Estimates data
//Creating Single year data for the places and counties
var est_cty_data = []
for(i = 0; i< data[0].length; i++){
  est_cty_data.push({ 'fips' : data[0][i].countyfips, 'name' : countyName(data[0][i].countyfips), 'year' : data[0][i].year, 'totalpopulation' : +data[0][i].totalpopulation})
}


var est_data = tab_muni_data; //This is single year data
var fipsList = [...new Set(est_data.map(d => d.fips))];
var ctyNameList = [...new Set(est_data.map(d => d.name))];
 growth_tab(geotype, tab_gr,bkMarkArr[0],fileName, PRO_1.id);  
 estPlot(est_data, "profile", geotype, PRO_2.id, bkMarkArr[1],curyear, fipsList, ctyNameList);
}; //Municipality
}); //End of Promise

}; 
// genSel2display



function genSel3display(geotype, fipsArr, names, curyear, PRO_1, PRO_2, PRO_3, PRO_4) {
//genSel3display  Produces age panel charts, Age estimates and forecasts facet chart, and Age Pyramid

    const fmt_date = d3.timeFormat("%B %d, %Y");
    const fmt_yr = d3.format("00");

    const regList = ['Region', 'Regional Comparison'];
    const ctyList = ['County', 'County Comparison'];
    const muniList = ['Municipality', 'Municipal Comparison'];
    const placeList = ['Census Designated Place', 'Census Designated Place Comparison'];
    const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);
	


//Clear out Divs

  PRO_1.innerHTML = "";
  PRO_2.innerHTML = "";
  PRO_3.innerHTML = "";
  PRO_4.innerHTML = "";

//This code Generates data for regions and counties...
if(regList.includes(geotype)){
  var fips_tmp = regionCOL(parseInt(fipsArr));
     var fips_list =  fips_tmp[0].fips.map(function (x) { 
     return parseInt(x, 10); 
   });
 } else {
  fips_list = [parseInt(fipsArr)];
 };  

//Estimates  --For muniipalities, take  from the ACS No forecast
if(muniList.includes(geotype)){
 var ctynum = muni_county(fipsArr);
 var forcurlCty = genACSUrl("profile",curyear,'B01001',1,49,'County',ctynum);
 var forcurlMuni = genACSUrl("profile",curyear,'B01001',1,49,geotype,fipsArr);
 var prom = [d3.json(forcurlCty), d3.json(forcurlMuni)];
} else {
  var forc_yrs = curyear + "," + (curyear+ 10); 
  var forcurlCO = "https://gis.dola.colorado.gov/lookups/sya_regions?reg_num=0&year=" + forc_yrs + "&choice=single"
  var forcurlCtySDO = "https://gis.dola.colorado.gov/lookups/sya?county=" + fips_list + "&year=" + forc_yrs + "&choice=single&group=3"
  var prom = [d3.json(forcurlCO), d3.json(forcurlCtySDO)];
}

Promise.all(prom).then(data =>{
//Selecting year range
if(muniList.includes(geotype)){
  var cty_age_pct = acsAgePct(data[0],ctynum, curyear, 'county');
  var cty_age_pyr = acsAgePyr(data[0],ctynum,curyear,'county');
  var muni_age_pct = acsAgePct(data[1],fipsArr[0], curyear, 'muni');
  var muni_age_pyr = acsAgePyr(data[1],fipsArr[0], curyear,'muni');
  var fin_age_pct = muni_age_pct.concat(cty_age_pct);
  var fin_age_pyr = muni_age_pyr.concat(cty_age_pyr);
} else { //County and Region data files
//State data

 var CO_age_raw = [];
 var CO_age_data = [];
 for(i = 0; i < data[0].length; i++){
    CO_age_raw.push({ fips : data[0][i].reg_num,
       geo_name : data[0][i].region,
       year : data[0][i].year,
       age : data[0][i].age,
       malepopulation_e : +data[0][i].malepopulation,
       femalepopulation_e : +data[0][i].femalepopulation, 
       totalpopulation_e : +data[0][i].totalpopulation });
 };
 
//Assigning age categories
  CO_age_raw.forEach(function(obj) {
    if(obj.age >=  0 && obj.age <= 4) {obj.age_cat = "0 to 4"; obj.agecatno = 1;}
    if(obj.age >= 5 && obj.age <= 17) {obj.age_cat = "5 to 17"; obj.agecatno = 2;}
    if(obj.age >= 18 && obj.age <= 24) {obj.age_cat = "18 to 24"; obj.agecatno = 3;}
    if(obj.age >= 25 && obj.age <= 54) {obj.age_cat = "25 to 54"; obj.agecatno = 4;}
    if(obj.age >= 55 && obj.age <= 64) {obj.age_cat = "55 to 64"; obj.agecatno = 5;}
    if(obj.age >= 65 && obj.age <= 74) {obj.age_cat = "65 to 74"; obj.agecatno = 6;}
    if(obj.age >= 75 && obj.age <= 84) {obj.age_cat = "75 to 84"; obj.agecatno = 7;}
    if(obj.age >= 85) {obj.age_cat = "85 +"; obj.agecatno = 8;}
    CO_age_data.push({'fips' : obj.fips, 'year' : obj.year, 'age' : obj.age, 'age_cat_no' : obj.agecatno, 'age_cat' : obj.age_cat, 
        'malepopulation_e' : obj.malepopulation_e, 'femalepopulation_e' : obj.femalepopulation_e, 'totalpopulation_e' : obj.totalpopulation_e});
 });

//County data

 var cty_age_raw = [];
 var cty_age_data = [];
 for(i = 0; i < data[1].length; i++){
    cty_age_raw.push({ fips : data[1][i].countyfips,
       name : data[1][i].county,
       year : data[1][i].year,
       age : data[1][i].age,
       malepopulation_e : +data[1][i].malepopulation,
       femalepopulation_e : +data[1][i].femalepopulation, 
       totalpopulation_e : +data[1][i].totalpopulation });
 };

//Assigning age categories
  cty_age_raw.forEach(function(obj) {
    if(obj.age >=  0 && obj.age <= 4) {obj.age_cat = "0 to 4"; obj.agecatno = 1;}
    if(obj.age >= 5 && obj.age <= 17) {obj.age_cat = "5 to 17"; obj.agecatno = 2;}
    if(obj.age >= 18 && obj.age <= 24) {obj.age_cat = "18 to 24"; obj.agecatno = 3;}
    if(obj.age >= 25 && obj.age <= 54) {obj.age_cat = "25 to 54"; obj.agecatno = 4;}
    if(obj.age >= 55 && obj.age <= 64) {obj.age_cat = "55 to 64"; obj.agecatno = 5;}
    if(obj.age >= 65 && obj.age <= 74) {obj.age_cat = "65 to 74"; obj.agecatno = 6;}
    if(obj.age >= 75 && obj.age <= 84) {obj.age_cat = "75 to 84"; obj.agecatno = 7;}
    if(obj.age >= 85) {obj.age_cat = "85 +"; obj.agecatno = 8;}
    cty_age_data.push({'fips' : obj.fips, 'year' : obj.year, 'age' : obj.age, 'age_cat_no' : obj.agecatno, 'age_cat' : obj.age_cat, 
        'malepopulation_e' : obj.malepopulation_e, 'femalepopulation_e' : obj.femalepopulation_e, 'totalpopulation_e' : obj.totalpopulation_e});
 });
 
 
 //Rolling up State and County data

 
 var columnsToSum = ['malepopulation_e', 'femalepopulation_e', 'totalpopulation_e'];
 var age_CO_data = [];
 var CO_age_sum =  d3.rollup(CO_age_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year,  d => d.age_cat_no, d => d.age_cat)
 //Flatten 
for (let [key1, value] of CO_age_sum) {
for (let[key2, value2] of value) {
for (let [key3, value3] of value2) {
   age_CO_data.push({'fips' : 0, 'name' : 'Colorado', 'year' : key1, 'age_cat_no' : key2, 'age_cat' : key3,
     'malepopulation_e' : value3.malepopulation_e, 'femalepopulation_e' : value3.femalepopulation_e, 'totalpopulation_e' : value3.totalpopulation_e});
}
};
};


 var age_cty_data = [];
 var cty_age_sum =  d3.rollup(cty_age_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.fips, d => d.year, d => d.age_cat_no, d => d.age_cat);
 
  //Flatten 
for (let [key1, value1] of cty_age_sum) {
for (let [key2, value2] of value1) {
for (let [key3, value3] of value2) {
for (let [key4, value4] of value3) {
   age_cty_data.push({'fips' : key1, 'name' : countyName(key1), 'year' : key2, 'age_cat_no' : key3, 'age_cat' : key4,
     'malepopulation_e' : value4.malepopulation_e, 'femalepopulation_e' : value4.femalepopulation_e, 'totalpopulation_e' : value4.totalpopulation_e});
}
}
};
};
var age_cty_data_s = age_cty_data.sort(function(a, b){ return d3.ascending(a['age_cat_no'], b['age_cat_no']); })
  .sort(function(a, b){ return d3.ascending(a['year'], b['year']); })
  .sort(function(a, b){ return d3.ascending(a['fips'], b['fips']); });

var age_cty_data = age_cty_data_s;

 //Generating regional total
if(regList.includes(geotype)) {

//Rolling up regional data for table
var age_reg_sum =  d3.rollup(cty_age_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year, d => d.age_cat_no, d => d.age_cat)

//Flatten Arrays for output
var age_reg_data = [];
var regionNum = -101;

for (let [key1, value] of age_reg_sum) {
for (let[key2, value2] of value) {
for (let[key3, value3] of value2) {
   age_reg_data.push({'fips' : regionNum, 'name' : regionName(fipsArr), 'year' : key1, 'age_cat_no' : key2, 'age_cat' : key3,
     'malepopulation_e' : value3.malepopulation_e, 'femalepopulation_e' : value3.femalepopulation_e, 'totalpopulation_e' : value3.totalpopulation_e});
}
};
};

var age_reg_data_s = age_reg_data.sort(function(a, b){ return d3.ascending(a['age_cat_no'], b['age_cat_no']); })
  .sort(function(a, b){ return d3.ascending(a['year'], b['year']); });

var age_regdata = age_reg_data_s;

var fin_age_data = age_CO_data.concat(age_reg_data).concat(age_cty_data) //This is grouped age data

//Need to calculate percentages...
var pct_base = d3.rollup(fin_age_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.fips, d => d.year)
var age_base = [];
for (let [key1, value] of pct_base) {
for (let[key2, value2] of value) {
   age_base.push({'fips' : key1, 'year' : key2, 
     'tot_malepopulation_e' : value2.malepopulation_e, 'tot_femalepopulation_e' : value2.femalepopulation_e, 'tot_totalpopulation_e' : value2.totalpopulation_e});
}
};

var fin_age_pct = [];
for(i = 0; i < age_base.length;i++){
 var selfips = age_base[i].fips;
 var selyear = age_base[i].year;
 var selmale = age_base[i].tot_malepopulation_e;
 var selfemale = age_base[i].tot_femalepopulation_e;
 var seltotal = age_base[i].tot_totalpopulation_e;
 var age_tmp = fin_age_data.filter(d => (d.fips == selfips && d.year == selyear));

 for(j = 0; j < age_tmp.length; j++){
    fin_age_pct.push({'fips' : age_tmp[j].fips, 'name' : age_tmp[j].name, 'year' : age_tmp[j].year, 'age_cat_no' : age_tmp[j].age_cat_no, 'age_cat' : age_tmp[j].age_cat,
              'malepopulation_e' : age_tmp[j].malepopulation_e, 'femalepopulation_e' : age_tmp[j].femalepopulation_e, 
     'totalpopulation_e' : age_tmp[j].totalpopulation_e,
     'pct_malepopulation_e' : age_tmp[j].malepopulation_e/selmale, 'pct_femalepopulation_e' : age_tmp[j].femalepopulation_e/selfemale,
     'pct_totalpopulation_e' : age_tmp[j].totalpopulation_e/seltotal});
 }; //j

}; //i

//Creating dataset for age Pyramids 
//Colorado

// Convert data to numbers
var CO_age_tmp = []
data[0].forEach( item => {
 CO_age_tmp.push({'fips' : item.reg_num,
                 'name' : item.region,
     'year' : item.year,
     'age' : item.age,
     'malepopulation_e' : parseInt(item.malepopulation),
     'femalepopulation_e' : parseInt(item.femalepopulation),
     'totalpopulation_e' : parseInt(item.totalpopulation)
 })})
      
var CO_age_SYA = CO_age_tmp.sort(function(a, b){ return d3.ascending(a['age'], b['age']); })
  .sort(function(a, b){ return d3.ascending(a['year'], b['year']); });
     
var cty_age_tmp = []
data[1].forEach( item => {
 cty_age_tmp.push({'fips' : item.countyfips,
                 'name' : countyName(item.countyfips),
     'year' : item.year,
     'age' : item.age,
     'malepopulation_e' : parseInt(item.malepopulation),
     'femalepopulation_e' : parseInt(item.femalepopulation),
     'totalpopulation_e' : parseInt(item.totalpopulation)
 })})
 
 
var cty_age_SYA = cty_age_tmp.sort(function(a, b){ return d3.ascending(a['age'], b['age']); })
        .sort(function(a, b){ return d3.ascending(a['fips'], b['fips']); }) 
  .sort(function(a, b){ return d3.ascending(a['year'], b['year']); });     

//Region 
//Rolling up regional data for table
var reg_age_tmp =  d3.rollup(cty_age_SYA, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.year, d => d.age)

//Flatten Arrays for output
var reg_age_temp_s = [];
var regionNum = -101;

for (let [key, value] of reg_age_tmp) {
for (let[key2, value2] of value) {
   reg_age_temp_s.push({'fips' : regionNum, 'name' : regionName(fipsArr), 'year' : key, 'age' : key2, 
     'malepopulation_e' : value2.malepopulation_e, 'femalepopulation_e' : value2.femalepopulation_e, 'totalpopulation_e' : value2.totalpopulation_e});
}
};

var reg_age_SYA = reg_age_temp_s.sort(function(a, b){ return d3.ascending(a['age'], b['age']); })
  .sort(function(a, b){ return d3.ascending(a['year'], b['year']); });

var fin_age_pyr = bin_age5(CO_age_SYA.concat(reg_age_SYA).concat(cty_age_SYA));

};  //Region

//County charts and pyramids -- State and County data are already rolled up.  age_cty_data 
if(ctyList.includes(geotype)) {
//Calclating Percentage Data
var fin_age_data = age_CO_data.concat(age_cty_data); //This is grouped age data

//Need to calculate percentages...
var pct_base = d3.rollup(fin_age_data, v => Object.fromEntries(columnsToSum.map(col => [col, d3.sum(v, d => +d[col])])), d => d.fips, d => d.year)
var age_base = [];
for (let [key1, value] of pct_base) {
for (let[key2, value2] of value) {
   age_base.push({'fips' : key1, 'year' : key2, 
     'tot_malepopulation_e' : value2.malepopulation_e, 'tot_femalepopulation_e' : value2.femalepopulation_e, 'tot_totalpopulation_e' : value2.totalpopulation_e});
}
};

var fin_age_pct = [];
for(i = 0; i < age_base.length;i++){
 var selfips = age_base[i].fips;
 var selyear = age_base[i].year;
 var selmale = age_base[i].tot_malepopulation_e;
 var selfemale = age_base[i].tot_femalepopulation_e;
 var seltotal = age_base[i].tot_totalpopulation_e;
 var age_tmp = fin_age_data.filter(d => (d.fips == selfips && d.year == selyear));

 for(j = 0; j < age_tmp.length; j++){
    fin_age_pct.push({'fips' : age_tmp[j].fips, 'name' : age_tmp[j].name, 'year' : age_tmp[j].year, 'age_cat_no' : age_tmp[j].age_cat_no, 'age_cat' : age_tmp[j].age_cat,
              'malepopulation_e' : age_tmp[j].malepopulation_e, 'femalepopulation_e' : age_tmp[j].femalepopulation_e, 
     'totalpopulation_e' : age_tmp[j].totalpopulation_e,
     'pct_malepopulation_e' : age_tmp[j].malepopulation_e/selmale, 'pct_femalepopulation_e' : age_tmp[j].femalepopulation_e/selfemale,
     'pct_totalpopulation_e' : age_tmp[j].totalpopulation_e/seltotal});
 }; //j
}; //i


//Build data for Pyramid
//Colorado

// Convert data to numbers
var CO_age_tmp = []
data[0].forEach( item => {
 CO_age_tmp.push({'fips' : item.reg_num,
                 'name' : item.region,
     'year' : item.year,
     'age' : item.age,
     'malepopulation_e' : parseInt(item.malepopulation),
     'femalepopulation_e' : parseInt(item.femalepopulation),
     'totalpopulation_e' : parseInt(item.totalpopulation)
 })})
      
var CO_age_SYA = CO_age_tmp.sort(function(a, b){ return d3.ascending(a['age'], b['age']); })
  .sort(function(a, b){ return d3.ascending(a['year'], b['year']); });
  
var cty_age_tmp = []
data[1].forEach( item => {
 cty_age_tmp.push({'fips' : item.countyfips,
                 'name' : countyName(item.countyfips),
     'year' : item.year,
     'age' : item.age,
     'malepopulation_e' : parseInt(item.malepopulation),
     'femalepopulation_e' : parseInt(item.femalepopulation),
     'totalpopulation_e' : parseInt(item.totalpopulation)
 })
 })
 
var cty_age_SYA = cty_age_tmp.sort(function(a, b){ return d3.ascending(a['age'], b['age']); })
        .sort(function(a, b){ return d3.ascending(a['fips'], b['fips']); }) 
  .sort(function(a, b){ return d3.ascending(a['year'], b['year']); });     

var fin_age_pyr = bin_age5(CO_age_SYA.concat(cty_age_SYA));


}; //County
}; //! Muni..

var fipsList = [...new Set(fin_age_pct.map(d => d.fips))];
var ctyNameList = [...new Set(fin_age_pct.map(d => d.name))];

genAgeSetup(geotype,fin_age_pct,fin_age_pyr,PRO_1.id, PRO_2.id, PRO_3.id, PRO_4.id, fipsList, ctyNameList,curyear);
}); //End of Promise
}; 
//  selGen3display


function genSel4display(geotype, fipsArr, names, curyear, PRO_1, PRO_2, PRO_3, PRO_4) {
//genSel4Display  Produces Income, Educ and Race panel charts
 const fmt_date = d3.timeFormat("%B %d, %Y");
 const fmt_yr = d3.format("00");

 const regList = ['Region', 'Regional Comparison'];
 const ctyList = ['County', 'County Comparison'];
    const muniList = ['Municipality', 'Municipal Comparison'];
 const placeList = ['Census Designated Place', 'Census Designated Place Comparison'];
    const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

//Clear out Divs

  PRO_1.innerHTML = "";
  PRO_2.innerHTML = "";
  PRO_3.innerHTML = "";
  PRO_4.innerHTML = "";
  /*
  What hh_tab contains: 
      Estimate  MOE
 Total Households B19051_001E B19051_001M
 Total Households With earnings B19051_002E B19051_002M
 Total Households With wage or salary income B19052_002E B19052_002M
 Total Households With self-employment income B19053_002E B19053_002M
 Total Households With interest, dividends, or net rental income B19054_002E B19054_002M
 Total Households With retirement income B19059_002E B19059_002M
 Total Households With Social Security income B19055_002E B19055_002M
 Total Households With Supplemental Security Income (SSI) B19056_002E B19056_002M
 Total Households With public assistance income B19057_002E B19057_002M
 Total Households With cash public assistance or Food Stamps/SNAP B19058_002E B19058_002M
  Total Households With other types of income B19060_002E B19060_002M
 Total Household Income B20003_001E B20003_001M
 Total Earnings B19061_001E B19061_001M
 Total Wage and Salary Income B19062_001E B19062_001M
 Total Self Employment Income B19063_001E B19063_001M
 Total Interest Income B19064_001E B19064_001M
 Total Retirement Income B19069_001E B19069_001M
 Total  Social Security Income B19065_001E B19065_001M
 Total SSI Income B19066_001E B19066_001M
 Total Public Assistance Income B19067_001E B19067_001M
 Total Other Income B19070_001E B19070_001M
*/
  
  var hh_tab = ["B19051_001E", "B19051_001M", "B19051_002E", "B19051_002M", "B19052_002E", "B19052_002M",
		"B19053_002E", "B19053_002M", "B19054_002E", "B19054_002M", "B19059_002E", "B19059_002M", "B19055_002E", "B19055_002M", 
     "B19056_002E", "B19056_002M", "B19057_002E", "B19057_002M", "B19058_002E", "B19058_002M",  "B19060_002E", "B19060_002M",
     "B20003_001E", "B20003_001M","B19061_001E", "B19061_001M", "B19062_001E", "B19062_001M", "B19063_001E", "B19063_001M", 
     "B19064_001E", "B19064_001M", "B19069_001E", "B19069_001M", "B19065_001E", "B19065_001M", "B19066_001E", "B19066_001M", 
     "B19067_001E", "B19067_001M",  "B19070_001E", "B19070_001M"]
  

  // Generating list of fips codes by geotype

 if(regList.includes(geotype)){
  var fips_tmp = regionCOL(parseInt(fipsArr));
     var fips_str =  fips_tmp[0].fips.map(function (x) { 
     return x; 
   });
        var fips_list = fips_str.toString();
     
  var inc_cty_url = genACSUrl("profile",curyear,'B19001',1,17,geotype,fips_list);
  var hhinc_cty_url = genACSUrl("profile",curyear,hh_tab,1,1,geotype,fips_list);
  var educ_cty_url = genACSUrl("profile",curyear,'B15003',1,25,geotype,fips_list);
  var race_cty_url = genACSUrl("profile",curyear,'B03002',1,12,geotype,fips_list);
  var inc_st_url = genACSUrl("profile",curyear,'B19001',1,17,'state',fips_list);
  var hhinc_st_url = genACSUrl("profile",curyear,hh_tab,1,1,'state',fips_list);
  var educ_st_url = genACSUrl("profile",curyear,'B15003',1,25,'state',fips_list);
  var race_st_url = genACSUrl("profile",curyear,'B03002',1,12,'state',fips_list);
     var prom = [d3.json(inc_cty_url),d3.json(hhinc_cty_url), d3.json(educ_cty_url), d3.json(race_cty_url),
              d3.json(inc_st_url),d3.json(hhinc_st_url), d3.json(educ_st_url), d3.json(race_st_url)]
  
 };
 
 
 if(ctyList.includes(geotype)){
  var fips_str =  fipsArr.map(function (x) { 
     return x; 
   });
       
  
  var inc_cty_url = genACSUrl("profile",curyear,'B19001',1,17,geotype,fipsArr);
  var hhinc_cty_url = genACSUrl("profile",curyear,hh_tab,1,1,geotype,fipsArr);
  var educ_cty_url = genACSUrl("profile",curyear,'B15003',1,25,geotype,fipsArr);
  var race_cty_url = genACSUrl("profile",curyear,'B03002',1,12,geotype,fipsArr);
  var inc_st_url = genACSUrl("profile",curyear,'B19001',1,17,'state',fipsArr);
  var hhinc_st_url = genACSUrl("profile",curyear,hh_tab,1,1,'state',fipsArr);
  var educ_st_url = genACSUrl("profile",curyear,'B15003',1,25,'state',fipsArr);
  var race_st_url = genACSUrl("profile",curyear,'B03002',1,12,'state',fipsArr);
     var prom = [d3.json(inc_cty_url),d3.json(hhinc_cty_url), d3.json(educ_cty_url), d3.json(race_cty_url),
              d3.json(inc_st_url),d3.json(hhinc_st_url), d3.json(educ_st_url), d3.json(race_st_url)]
 }
 
 if(muniList.includes(geotype)){ 
 var ctynum = muni_county(fipsArr);

  var fips_str =  fipsArr.map(function (x) { 
     return x; 
   });
  

  var inc_muni_url = genACSUrl("profile",curyear,'B19001',1,17,geotype,fipsArr);
  var hhinc_muni_url = genACSUrl("profile",curyear,hh_tab,1,1,geotype,fipsArr);
  var educ_muni_url = genACSUrl("profile",curyear,'B15003',1,25,geotype,fipsArr);
  var race_muni_url = genACSUrl("profile",curyear,'B03002',1,12,geotype,fipsArr);
  var inc_cty_url = genACSUrl("profile",curyear,'B19001',1,17,'county',ctynum);
  var hhinc_cty_url = genACSUrl("profile",curyear,hh_tab,1,1,'county',ctynum);
  var educ_cty_url = genACSUrl("profile",curyear,'B15003',1,25,'county',ctynum);
  var race_cty_url = genACSUrl("profile",curyear,'B03002',1,12,'county',ctynum);
  var inc_st_url = genACSUrl("profile",curyear,'B19001',1,17,'state',fipsArr);
  var hhinc_st_url = genACSUrl("profile",curyear,hh_tab,1,1,'state',fipsArr);
  var educ_st_url = genACSUrl("profile",curyear,'B15003',1,25,'state',fipsArr);
  var race_st_url = genACSUrl("profile",curyear,'B03002',1,12,'state',fipsArr);
  
     var prom = [d3.json(inc_muni_url),d3.json(hhinc_muni_url), d3.json(educ_muni_url), d3.json(race_muni_url),
              d3.json(inc_cty_url),d3.json(hhinc_cty_url), d3.json(educ_cty_url), d3.json(race_cty_url),
			  d3.json(inc_st_url),d3.json(hhinc_st_url), d3.json(educ_st_url), d3.json(race_st_url)];
 }

Promise.all(prom).then(data =>{
 //Creating associative arrays from raw data  acsPrep creates the associative array, genACS... creates the combined data
    if(muniList.includes(geotype)){
	var inc_muni_data = genACSIncome(acsPrep(data[0]),'muni');
	var hhinc_muni_data = genACSHHIncome(acsPrep(data[1]),'muni');
    var educ_muni_data = genACSEducation(acsPrep(data[2]),'muni');
	var race_muni_data = genACSRace(acsPrep(data[3]),'muni');
	var inc_cty_data = genACSIncome(acsPrep(data[4]),'cty');
	var hhinc_cty_data = genACSHHIncome(acsPrep(data[5]),'cty');
    var educ_cty_data = genACSEducation(acsPrep(data[6]),'cty');
	var race_cty_data = genACSRace(acsPrep(data[7]),'cty');
	var inc_st_data = genACSIncome(acsPrep(data[8]),'st');
	var hhinc_st_data = genACSHHIncome(acsPrep(data[9]),'st');
    var educ_st_data = genACSEducation(acsPrep(data[10]),'st');
	var race_st_data = genACSRace(acsPrep(data[11]),'st');
   } else {
	var inc_cty_data = genACSIncome(acsPrep(data[0]),'cty');
	var hhinc_cty_data = genACSHHIncome(acsPrep(data[1]),'cty');
    var educ_cty_data = genACSEducation(acsPrep(data[2]),'cty');
	var race_cty_data = genACSRace(acsPrep(data[3]),'cty');
	var inc_st_data = genACSIncome(acsPrep(data[4]),'st');
	var hhinc_st_data = genACSHHIncome(acsPrep(data[5]),'st');
    var educ_st_data = genACSEducation(acsPrep(data[6]),'st');
	var race_st_data = genACSRace(acsPrep(data[7]),'st');
   } 
  
//Regional data -- combine and rollup records
if(regList.includes(geotype)){
//Creating Columns to Sum Array

var inc_cty_keys = Object.keys(inc_cty_data[0])
var hhinc_cty_keys = Object.keys(hhinc_cty_data[0]);
var educ_cty_keys = Object.keys(educ_cty_data[0]);
var race_cty_keys = Object.keys(race_cty_data[0]);

inc_cty_keys.splice(0,2);
hhinc_cty_keys.splice(0,2);
educ_cty_keys.splice(0,2);
race_cty_keys.splice(0,2);

var inc_reg_sum =  d3.rollup(inc_cty_data, v => Object.fromEntries(inc_cty_keys.map(col => [col, d3.sum(v, d => +d[col])])));
var hhinc_reg_sum =  d3.rollup(hhinc_cty_data, v => Object.fromEntries(hhinc_cty_keys.map(col => [col, d3.sum(v, d => +d[col])])));
var educ_reg_sum =  d3.rollup(educ_cty_data, v => Object.fromEntries(educ_cty_keys.map(col => [col, d3.sum(v, d => +d[col])])));
var race_reg_sum =  d3.rollup(race_cty_data, v => Object.fromEntries(race_cty_keys.map(col => [col, d3.sum(v, d => +d[col])])));


//Adding Region id and Name
var regid = {};
regid.FIPS = -101
regid.NAME = names[0];

var inc_reg_sum_full = [{...regid,  ...inc_reg_sum}];
var hhinc_reg_sum_full = [{...regid, ...hhinc_reg_sum}];
var educ_reg_sum_full = [{...regid, ...educ_reg_sum}];
var race_reg_sum_full = [{...regid, ...race_reg_sum}];

var inc_reg_2 = acsMOE(inc_reg_sum_full);
var inc_cty_2 = acsMOE(inc_cty_data).sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
var inc_st_2 = acsMOE(inc_st_data);
var inc_data = inc_st_2.concat(inc_reg_2,inc_cty_2);


//Calculating the average income level
var hhinc_reg_2 = hhincAVG(hhinc_reg_sum_full);
var hhinc_cty_2 = hhincAVG(hhinc_cty_data).sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); });
var hhinc_st_2 = hhincAVG(hhinc_st_data);
var hhinc_data = hhinc_st_2.concat(hhinc_reg_2,hhinc_cty_2);

var educ_reg_2 = acsMOE(educ_reg_sum_full);
var educ_cty_2 = acsMOE(educ_cty_data).sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
var educ_st_2 = acsMOE(educ_st_data);
var educ_data = educ_st_2.concat(educ_reg_2,educ_cty_2);

var race_reg_2 = acsMOE(race_reg_sum_full);
var race_cty_2 = acsMOE(race_cty_data).sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
var race_st_2 = acsMOE(race_st_data);
var race_data = race_st_2.concat(race_reg_2,race_cty_2);
} //Region

if(ctyList.includes(geotype)) {
var inc_cty_2 = acsMOE(inc_cty_data);
var inc_st_2 = acsMOE(inc_st_data);
var inc_data = inc_cty_2.concat(inc_st_2);

var hhinc_cty_2 = hhincAVG(hhinc_cty_data);
var hhinc_st_2 = hhincAVG(hhinc_st_data);
var hhinc_data = hhinc_cty_2.concat(hhinc_st_2);

var educ_cty_2 = acsMOE(educ_cty_data);
var educ_st_2 = acsMOE(educ_st_data);
var educ_data = educ_cty_2.concat(educ_st_2);

var race_cty_2 = acsMOE(race_cty_data);
var race_st_2 = acsMOE(race_st_data);
var race_data = race_cty_2.concat(race_st_2);
}
if(muniList.includes(geotype)) {
var inc_muni_2 = acsMOE(inc_muni_data);
var inc_cty_2 = acsMOE(inc_cty_data);
var inc_st_2 = acsMOE(inc_st_data);
var inc_data = inc_muni_2.concat(inc_cty_2, inc_st_2);

var hhinc_muni_2 = hhincAVG(hhinc_muni_data);
var hhinc_cty_2 = hhincAVG(hhinc_cty_data);
var hhinc_st_2 = hhincAVG(hhinc_st_data);
var hhinc_data = hhinc_muni_2.concat(hhinc_cty_2, hhinc_st_2);

var educ_muni_2 = acsMOE(educ_muni_data);
var educ_cty_2 = acsMOE(educ_cty_data);
var educ_st_2 = acsMOE(educ_st_data);
var educ_data = educ_muni_2.concat(educ_cty_2, educ_st_2);

var race_muni_2 = acsMOE(race_muni_data);
var race_cty_2 = acsMOE(race_cty_data);
var race_st_2 = acsMOE(race_st_data);
var race_data = race_muni_2.concat(race_cty_2, race_st_2);
} 
//Calculating percentages

var inc_data_pct = genACSPct(inc_data)
var educ_data_pct = genACSPct(educ_data)
var race_data_pct = genACSPct(race_data)


//Table and Output production
var bkMarkArr = [{title : 'Household Income Chart', id :'inc01', srctxt : "ACS Household Income Estimates",srclink : genCEDSCIUrl(geotype,"B19001",curyear, fipsArr)},
	{title : 'Income Sources Table', id : 'inc02', srctxt : "ACS Household Income Estimates",srclink : genCEDSCIUrl(geotype,"B19001",curyear, fipsArr)},
	{title : 'Educational Attainment Chart', id : 'educ',srctxt : "ACS Educational Attainment Estimates",srclink : genCEDSCIUrl(geotype,"B15003",curyear, fipsArr)},
	{title : 'Race and Ethnicity Table', id : 'raceeth',srctxt : "ACS Race and ethnicity Estimates",srclink : genCEDSCIUrl(geotype,"B03002",curyear, fipsArr)}]

insertBkmark(bkMarkArr)

income_plot(geotype,inc_data_pct, PRO_1.id,bkMarkArr[0], curyear,'B19001');
genIncomeTab(geotype, hhinc_data, PRO_2.id, bkMarkArr[1], curyear,fips_str)
educ_plot(geotype, educ_data_pct,PRO_3.id,bkMarkArr[2], curyear,'B15003');
genRaceTab(geotype, race_data_pct,PRO_4.id,bkMarkArr[3],curyear,fips_str)

}); //end of Promise
}; 
// genSel4Display


function genSel5display(geotype, fipsArr, names, curyear, PRO_1, PRO_2, PRO_3, PRO_4) {
//genSel5Display  Produces Housing and Household displays
 const fmt_date = d3.timeFormat("%B %d, %Y");
 const fmt_yr = d3.format("00");

 const regList = ['Region', 'Regional Comparison'];
 const ctyList = ['County', 'County Comparison'];
 const muniList = ['Municipality', 'Municipal Comparison'];
 const placeList = ['Census Designated Place', 'Census Designated Place Comparison'];
 const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

var maxYR = 2050;

//Clear out Divs

  PRO_1.innerHTML = "";
  PRO_2.innerHTML = "";
  PRO_3.innerHTML = "";
  PRO_4.innerHTML = "";

//The displays are limited by geography
//Households by Age chart is only counties and regions
//Housing Occupancy, Housing unit type. and Housing econ is available for all geographies

 
 if(regList.includes(geotype)){
	var fips_tmp1 = regionCOL(parseInt(fipsArr));
    var fips_tmp =  fips_tmp1[0].fips.map(function (x) { 
     return parseInt(x); 
   });
   var fips_num = fips_tmp.toString();
   var fips_arr = fips_tmp1[0].fips;
  };

if(ctyList.includes(geotype)) {
	var fips_num = parseInt(fipsArr);
	var fips_arr = fipsArr;
}	

 if(muniList.includes(geotype)){
	var fips_arr = muni_county(fipsArr)
    var fips_num = parseInt(fips_arr);
    } 
	
 	var yr_list = 2021;
	for(i = 2022; i <= maxYR; i++){
		if(i % 10 == 0){
		yr_list = yr_list + "," + i;
		}
	};
	
	

//List of All URLS
//Households projections 
var hhage_90_cty = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c1990&schema=sf1&table=h12&sumlev=50&type=json&state=8&county=" + fips_num;
var hhage_00_cty = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c2000&schema=sf1&table=h16&sumlev=50&type=json&state=8&county=" + fips_num;
var hhage_10_cty = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c2010&schema=data&table=h17&sumlev=50&type=json&state=8&county=" + fips_num;
var hhage_for_cty = "https://gis.dola.colorado.gov/lookups/household?county="+ fips_num + "&year=" + yr_list + "&age=0,1,2,3,4&household=0&group=opt08";

var hhage_90_reg = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c1990&schema=sf1&table=h12&sumlev=50&type=json&state=8&county=" + fips_num;
var hhage_00_reg = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c2000&schema=sf1&table=h16&sumlev=50&type=json&state=8&county=" + fips_num;
var hhage_10_reg = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c2010&schema=data&table=h17&sumlev=50&type=json&state=8&county=" + fips_num;
var hhage_for_reg = "https://gis.dola.colorado.gov/lookups/household?county="+ fips_num + "&year=" + yr_list + "&age=0,1,2,3,4&household=0&group=opt08";


var hhage_90_st = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c1990&schema=sf1&table=h12&sumlev=40&type=json&state=8";
var hhage_00_st = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c2000&schema=sf1&table=h16&sumlev=40&type=json&state=8";
var hhage_10_st = "https://gis.dola.colorado.gov/capi/demog?limit=99999&db=c2010&schema=data&table=h17&sumlev=40&type=json&state=8";
var hhage_for_st = "https://gis.dola.colorado.gov/lookups/household?county=0&year=" + yr_list + "&age=0,1,2,3,4&household=0&group=opt08";

//ACS Calls	
//B25002	OCCUPANCY STATUS
//B25004	VACANCY STATUS
//B25005	VACANCY STATS CURRENT RESIDENCY ELSEWHERE
//B25010	AVERAGE HOUSEHOLD SIZE OF OCCUPIED HOUSING UNITS BY TENURE
//B25032	TENURE BY UNITS IN STRUCTURE
//B25033	TOTAL POPULATION IN OCCUPIED HOUSING UNITS BY TENURE BY UNITS IN STRUCTURE
//B25037	MEDIAN YEAR STRUCTURE BUILT BY TENURE
//B25064	MEDIAN GROSS RENT (DOLLARS)
//B25074	HOUSEHOLD INCOME BY GROSS RENT AS A PERCENTAGE OF HOUSEHOLD INCOME IN THE PAST 12 MONTHS
//B25077	MEDIAN VALUE (DOLLARS)  OWNER OCCUPIED
//B25095	HOUSEHOLD INCOME BY SELECTED MONTHLY OWNER COSTS AS A PERCENTAGE OF HOUSEHOLD INCOME IN THE PAST 12 MONTHS


//State Calls
var B25002_st_url = genACSUrl("profile",curyear,'B25002',1,3,'state',fips_arr);
var B25004_st_url = genACSUrl("profile",curyear,'B25004',1,8,'state',fips_arr);
var B25005_st_url = genACSUrl("profile",curyear,'B25005',1,3,'state',fips_arr);
var B25010_st_url = genACSUrl("profile",curyear,'B25010',1,3,'state',fips_arr);
var B25032_st_url = genACSUrl("profile",curyear,'B25032',1,23,'state',fips_arr);
var B25033_st_url = genACSUrl("profile",curyear,'B25033',1,13,'state',fips_arr);
var B25037_st_url = genACSUrl("profile",curyear,'B25037',1,3,'state',fips_arr);
var B25064_st_url = genACSUrl("profile",curyear,'B25064',1,1,'state',fips_arr);
var B25074_st_url = genACSUrl("profile",curyear,'B25074',1,64,'state',fips_arr);
var B25077_st_url = genACSUrl("profile",curyear,'B25077',1,1,'state',fips_arr);
var B25095_st_url =  genACSUrl("profile",curyear,'B25095',1,73,'state',fips_arr);

// County Calls

var B25002_cty_url = genACSUrl("profile",curyear,'B25002',1,3,'county',fips_arr);
var B25004_cty_url = genACSUrl("profile",curyear,'B25004',1,8,'county',fips_arr);
var B25005_cty_url = genACSUrl("profile",curyear,'B25005',1,3,'county',fips_arr);
var B25010_cty_url = genACSUrl("profile",curyear,'B25010',1,3,'county',fips_arr);
var B25032_cty_url = genACSUrl("profile",curyear,'B25032',1,23,'county',fips_arr);
var B25033_cty_url = genACSUrl("profile",curyear,'B25033',1,13,'county',fips_arr);
var B25037_cty_url = genACSUrl("profile",curyear,'B25037',1,3,'county',fips_arr);
var B25064_cty_url = genACSUrl("profile",curyear,'B25064',1,1,'county',fips_arr);
var B25074_cty_url = genACSUrl("profile",curyear,'B25074',1,64,'county',fips_arr);
var B25077_cty_url = genACSUrl("profile",curyear,'B25077',1,1,'county',fips_arr);
var B25095_cty_url = genACSUrl("profile",curyear,'B25095',1,73,'county',fips_arr);

if(ctyList.includes(geotype)) {
	var prom = [d3.json(hhage_90_st), d3.json(hhage_00_st), d3.json(hhage_10_st), d3.json(hhage_for_st), d3.json(B25002_st_url), 
   d3.json(B25004_st_url), d3.json(B25005_st_url), d3.json(B25010_st_url), d3.json(B25032_st_url), d3.json(B25033_st_url), 
   d3.json(B25037_st_url), d3.json(B25064_st_url), d3.json(B25074_st_url), d3.json(B25077_st_url), d3.json(B25095_st_url), 
   d3.json(hhage_90_cty), d3.json(hhage_00_cty), d3.json(hhage_10_cty), d3.json(hhage_for_cty), d3.json(B25002_cty_url), 
   d3.json(B25004_cty_url), d3.json(B25005_cty_url), d3.json(B25010_cty_url), d3.json(B25032_cty_url), d3.json(B25033_cty_url), 
   d3.json(B25037_cty_url), d3.json(B25064_cty_url), d3.json(B25074_cty_url), d3.json(B25077_cty_url), d3.json(B25095_cty_url)]
};

//Regional Calls
if(regList.includes(geotype)){
	var B25002_reg_url = genACSUrl("profile",curyear,'B25002',1,3,'county',fips_arr);
	var B25004_reg_url = genACSUrl("profile",curyear,'B25004',1,8,'county',fips_arr);
	var B25005_reg_url = genACSUrl("profile",curyear,'B25005',1,3,'county',fips_arr);
	var B25010_reg_url = genACSUrl("profile",curyear,'B25010',1,3,'county',fips_arr);
	var B25032_reg_url = genACSUrl("profile",curyear,'B25032',1,23,'county',fips_arr);
	var B25033_reg_url = genACSUrl("profile",curyear,'B25033',1,13,'county',fips_arr);
	var B25037_reg_url = genACSUrl("profile",curyear,'B25037',1,3,'county',fips_arr);
	var B25064_reg_url = genACSUrl("profile",curyear,'B25064',1,1,'county',fips_arr);
	var B25074_reg_url = genACSUrl("profile",curyear,'B25074',1,64,'county',fips_arr);
	var B25077_reg_url = genACSUrl("profile",curyear,'B25077',1,1,'county',fips_arr);
	var B25095_reg_url = genACSUrl("profile",curyear,'B25095',1,73,'county',fips_arr);
	 
	var prom = [d3.json(hhage_90_st), d3.json(hhage_00_st), d3.json(hhage_10_st), d3.json(hhage_for_st), d3.json(B25002_st_url), 
	   d3.json(B25004_st_url), d3.json(B25005_st_url), d3.json(B25010_st_url), d3.json(B25032_st_url), d3.json(B25033_st_url), 
	   d3.json(B25037_st_url), d3.json(B25064_st_url), d3.json(B25074_st_url), d3.json(B25077_st_url), d3.json(B25095_st_url), 
	   d3.json(hhage_90_reg), d3.json(hhage_00_reg), d3.json(hhage_10_reg), d3.json(hhage_for_reg), d3.json(B25002_reg_url), 
	   d3.json(B25004_reg_url), d3.json(B25005_reg_url), d3.json(B25010_reg_url), d3.json(B25032_reg_url), d3.json(B25033_reg_url), 
	   d3.json(B25037_reg_url), d3.json(B25064_reg_url), d3.json(B25074_reg_url), d3.json(B25077_reg_url), d3.json(B25095_reg_url)]
  };


//Municipal Calls
if(muniList.includes(geotype)){
	var B25002_muni_url = genACSUrl("profile",curyear,'B25002',1,3,geotype,fipsArr);
	var B25004_muni_url = genACSUrl("profile",curyear,'B25004',1,8,geotype,fipsArr);
	var B25005_muni_url = genACSUrl("profile",curyear,'B25005',1,3,geotype,fipsArr);
	var B25010_muni_url = genACSUrl("profile",curyear,'B25010',1,3,geotype,fipsArr);
	var B25032_muni_url = genACSUrl("profile",curyear,'B25032',1,23,geotype,fipsArr);
	var B25033_muni_url = genACSUrl("profile",curyear,'B25033',1,13,geotype,fipsArr);
	var B25037_muni_url = genACSUrl("profile",curyear,'B25037',1,3,geotype,fipsArr);
	var B25064_muni_url = genACSUrl("profile",curyear,'B25064',1,1,geotype,fipsArr);
	var B25074_muni_url = genACSUrl("profile",curyear,'B25074',1,64,geotype,fipsArr);
	var B25077_muni_url = genACSUrl("profile",curyear,'B25077',1,1,geotype,fipsArr);
	var B25095_muni_url = genACSUrl("profile",curyear,'B25095',1,73,geotype,fipsArr);

	 var prom = [d3.json(hhage_90_st),  d3.json(hhage_00_st),  d3.json(hhage_10_st),  d3.json(hhage_for_st),  d3.json(B25002_st_url),  
	   d3.json(B25004_st_url),  d3.json(B25005_st_url),  d3.json(B25010_st_url),  d3.json(B25032_st_url),  d3.json(B25033_st_url),  
	   d3.json(B25037_st_url),  d3.json(B25064_st_url),  d3.json(B25074_st_url),  d3.json(B25077_st_url),  d3.json(B25095_st_url),  
	   d3.json(hhage_90_cty),  d3.json(hhage_00_cty),  d3.json(hhage_10_cty),  d3.json(hhage_for_cty),  d3.json(B25002_cty_url),  
	   d3.json(B25004_cty_url),  d3.json(B25005_cty_url),  d3.json(B25010_cty_url),  d3.json(B25032_cty_url),  d3.json(B25033_cty_url),  
	   d3.json(B25037_cty_url),  d3.json(B25064_cty_url),  d3.json(B25074_cty_url),  d3.json(B25077_cty_url),  d3.json(B25095_cty_url),  
	   d3.json(B25002_muni_url),  d3.json(B25004_muni_url),  d3.json(B25005_muni_url),  d3.json(B25010_muni_url),  d3.json(B25032_muni_url),  
	   d3.json(B25033_muni_url),  d3.json(B25037_muni_url),  d3.json(B25064_muni_url),  d3.json(B25074_muni_url),  d3.json(B25077_muni_url),  
	   d3.json(B25095_muni_url)] 
 }

Promise.all(prom).then(data =>{

if(regList.includes(geotype)){
	var cty_forecast = housingSum(data[15], data[16], data[17],data[18],'county');
    var st_forecast = housingSum(data[0],data[1],data[2],data[3],'state');

	var reg_forecast = [];
	 var reg_sum = d3.rollup(cty_forecast, v => d3.sum(v, d => d.total_households), d => d.year, d => d.age_group_id);   
	 for (let [key, value] of reg_sum) {
		 for(let [key2, value2] of value) {
	         reg_forecast.push({ 
			 	'fips' : -101,
			   'name' : names.toString(),
			   'year' : key,
			   'age_group_id' : key2,
			   'household_type_id' : 0,
			   'total_households' : value2
			 })
		 }
	 }
  var hh_forecast = st_forecast.concat(reg_forecast, cty_forecast);

var hhforecast_fin = procHHForecast(hh_forecast);

//processing the ACS Housing Tables

	//Region Data
	var regid = {};
   regid.FIPS = -101
   regid.NAME = names[0];

//ACS Tables

var B25002_st = acsPrep(data[4]);
var B25004_st = acsPrep(data[5]);
var B25005_st = acsPrep(data[6]);
var B25010_st = acsPrep(data[7]);
var B25032_st = acsPrep(data[8]);
var B25033_st = acsPrep(data[9]);
var B25037_st = acsPrep(data[10]);
var B25064_st = acsPrep(data[11]);
var B25074_st = acsPrep(data[12]);
var B25077_st = acsPrep(data[13]);
var B25095_st = acsPrep(data[14]);
var B25002_reg = acsPrep(data[19]);
var B25004_reg = acsPrep(data[20]);
var B25005_reg = acsPrep(data[21]);
var B25010_reg = acsPrep(data[22]);
var B25032_reg = acsPrep(data[23]);
var B25033_reg = acsPrep(data[24]);
var B25037_reg = acsPrep(data[25]);
var B25064_reg = acsPrep(data[26]);
var B25074_reg = acsPrep(data[27]);
var B25077_reg = acsPrep(data[28]);
var B25095_reg = acsPrep(data[29]);

//processing Occupancy Table
	var occ_tab_reg1 = gen_occ_tab(B25002_reg,B25004_reg,B25005_reg,geotype);
	//Rolling up regional total
	var occ_tab_keys = Object.keys(occ_tab_reg1[0])
	occ_tab_keys.splice(0,2);
		
    var occ_reg_sum =  d3.rollup(occ_tab_reg1, v => Object.fromEntries(occ_tab_keys.map(col => [col, d3.sum(v, d => +d[col])])));
	var occ_reg_tmp = [{...regid, ...occ_reg_sum}];
    var occ_tab_reg = acsMOE(occ_reg_tmp);
   
    //County Data
	var occ_tab_cty = gen_occ_tab(B25002_reg,B25004_reg,B25005_reg,'county') 
	               .sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
	//State Data
	var occ_tab_st = gen_occ_tab(B25002_st,B25004_st,B25005_st,'state');
	
	
	//Final data
	var occ_tab_fin = occ_tab_st.concat(occ_tab_reg, occ_tab_cty);
	
	//processing the Housing Type table
	//Regional Data
	
	var tenure_unit_reg1 = gen_str_unit(B25032_reg ,geotype);
	var tenure_unit_keys = Object.keys(tenure_unit_reg1[0])
	tenure_unit_keys.splice(0,2);
	var tenure_unit_sum =  d3.rollup(tenure_unit_reg1, v => Object.fromEntries(tenure_unit_keys.map(col => [col, d3.sum(v, d => +d[col])])));
	var tenure_unit_tmp = [{...regid, ...tenure_unit_sum}];
    var tenure_unit_reg = acsMOE(tenure_unit_tmp);
	
	
	var tenure_pop_reg1 = gen_str_pop(B25033_reg ,geotype);
	var tenure_pop_keys = Object.keys(tenure_pop_reg1[0])
	tenure_pop_keys.splice(0,2);
	var tenure_pop_sum =  d3.rollup(tenure_pop_reg1, v => Object.fromEntries(tenure_pop_keys.map(col => [col, d3.sum(v, d => +d[col])])));
	var tenure_pop_tmp = [{...regid, ...tenure_pop_sum}];
    var tenure_pop_reg = acsMOE(tenure_pop_tmp);

   //County Data
   	var pph_cty = B25010_reg;
	var medyr_cty = B25037_reg;
	
	var tenure_unit_cty = acsMOE(gen_str_unit(B25032_reg,'county')) 
	               .sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 

	var tenure_pop_cty = acsMOE(gen_str_pop(B25033_reg,'county')) 
	               .sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
				   
	//Average PPH and Median Construction year for regions  -- create data with squared moe, sum,process
	var pph_reg = aggPPH(B25010_reg, B25032_reg,regid);
	//Median Year
	var medyr_reg = [];
	var medyr_tmp = [];
	var medyrall_est = [];
	var medyrall_moe = [];
	var medyroo_est = [];
	var medyroo_moe = [];
	var medyrrt_est = [];
	var medyrrt_moe = [];
	B25037_reg.forEach( d => {
		  medyrall_est.push(+d.B25037_001E);
		  medyrall_moe.push(+d.B25037_001M);
		  medyroo_est.push(+d.B25037_002E);
		  medyroo_moe.push(+d.B25037_002M);
		  medyrrt_est.push(+d.B25037_003E);
		  medyrrt_moe.push(+d.B25037_003M);
	})
	
	var medyrall_est_range = d3.extent(medyrall_est);
	var medyrall_moe_range = d3.extent(medyrall_moe);
	var medyroo_est_range = d3.extent(medyroo_est);
	var medyroo_moe_range = d3.extent(medyroo_moe);
	var medyrrt_est_range = d3.extent(medyrrt_est);
	var medyrrt_moe_range = d3.extent(medyrrt_moe)

	medyr_tmp.NAME = regid.NAME;
	medyr_tmp.GEO1 = 8;
	medyr_tmp.GEO2 = regid.FIPS;
	medyr_tmp.B25037_001E = Math.round((medyrall_est_range[0] + medyrall_est_range[1])/2);
	medyr_tmp.B25037_001M = Math.round((medyrall_moe_range[0] + medyrall_moe_range[1])/2);
	medyr_tmp.B25037_002E = Math.round((medyroo_est_range[0] + medyroo_est_range[1])/2);
	medyr_tmp.B25037_002M = Math.round((medyroo_moe_range[0] + medyroo_moe_range[1])/2);
	medyr_tmp.B25037_003E = Math.round((medyrrt_est_range[0] + medyrrt_est_range[1])/2);
	medyr_tmp.B25037_003M = Math.round((medyrrt_moe_range[0] + medyrrt_moe_range[1])/2);
	
	medyr_reg.push(medyr_tmp)
	
	//State Data
  	var pph_st = B25010_st;
	var medyr_st = B25037_st;
	var tenure_unit_st = acsMOE(gen_str_unit(B25032_st,'state')); 
	var tenure_pop_st = acsMOE(gen_str_pop(B25033_st,'state'));
	
	//Final data
	var tenure_unit_fin = tenure_unit_st.concat(tenure_unit_reg, tenure_unit_cty);
	var tenure_pop_fin = tenure_pop_st.concat(tenure_pop_reg, tenure_pop_cty);
	var medyr_fin = medyr_st.concat(medyr_reg, medyr_cty)
	var pph_fin = pph_st.concat(pph_reg, pph_cty);
	var fin_tenure_tab = genTenureTab(tenure_unit_fin, medyr_fin,tenure_pop_fin,pph_fin);
	

//Housing Economics Table  
//Calculating the housing cost value for region
//Region
var reg_Med = []
var OOMed_cty = B25077_reg
var OOMed_st = B25077_st;

var OOMed_EST = [];
var OOMed_MOE = [];
for(i = 0; i < OOMed_cty.length; i++){
	  OOMed_EST.push(OOMed_cty[i].B25077_001E);
	  OOMed_MOE.push(OOMed_cty[i].B25077_001M);
	  };


var OOMed_EST_range = d3.extent(OOMed_EST);
var OOMed_MOE_range = d3.extent(OOMed_MOE);
var OOMed_EST_Value = (OOMed_EST_range[1] + OOMed_EST_range[0])/2;
var OOMed_MOE_Value = (OOMed_MOE_range[1] + OOMed_MOE_range[0])/2;
  
var RTMed_cty = B25064_reg;
var RTMed_st = B25064_st;

var RTMed_EST = [];
var RTMed_MOE = [];
for(i = 0; i < RTMed_cty.length; i++){
	  RTMed_EST.push(RTMed_cty[i].B25064_001E);
	  RTMed_MOE.push(RTMed_cty[i].B25064_001M);
	  };
	  

var RTMed_EST_range = d3.extent(RTMed_EST);
var RTMed_MOE_range = d3.extent(RTMed_MOE);
var RTMed_EST_Value = (RTMed_EST_range[1] + RTMed_EST_range[0])/2;
var RTMed_MOE_Value = (RTMed_MOE_range[1] + RTMed_MOE_range[0])/2;

//Assembling final tabs
var reg_Med = [];
reg_Med.push({'FIPS' : -101, 'NAME' : regionName(+fipsArr), 'VAR' : 'Median Cost', 
				'OO_EST' : OOMed_EST_Value, 'OO_MOE' : OOMed_MOE_Value, 
				'RT_EST' : RTMed_EST_Value, 'RT_MOE' : RTMed_MOE_Value});
				
var st_Med = [];
st_Med.push({'FIPS' : OOMed_st[0].GEO1, 'NAME' : OOMed_st[0].NAME, 'VAR' : 'Median Cost', 
				'OO_EST' : OOMed_st[0].B25077_001E, 'OO_MOE' : OOMed_st[0].B25077_001M, 
				'RT_EST' : RTMed_st[0].B25064_001E, 'RT_MOE' : RTMed_st[0].B25064_001M});
				
var cty_Med = [];
for(i = 0; i < OOMed_cty.length; i++){
	  cty_Med.push({'FIPS' : OOMed_cty[i].GEO2, 'NAME' : OOMed_cty[i].NAME, 'VAR' : 'Median Cost', 
	                'OO_EST' : OOMed_cty[i].B25077_001E, 'OO_MOE' : OOMed_cty[i].B25077_001M, 
					'RT_EST' : RTMed_cty[i].B25064_001E, 'RT_MOE' : RTMed_cty[i].B25064_001M})
}

var med_fin = st_Med.concat(reg_Med,cty_Med);


// Percent of home owners at 30% or more, 31-49% or more, 50% or more on housing

var housingIncome = genhousIncome(B25095_reg,B25074_reg,geotype);

var housingIncome_keys = Object.keys(housingIncome[0])

housingIncome_keys.splice(0,2);

	var housingIncome_sum =  d3.rollup(housingIncome, v => Object.fromEntries(housingIncome_keys.map(col => [col, d3.sum(v, d => +d[col])])));
	var housingIncome_tmp = [{...regid, ...housingIncome_sum}];
    var housingIncome_reg = acsMOE(housingIncome_tmp);

//County data
	var housingIncome_cty = acsMOE(housingIncome,'county') 
	               .sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
//State Data
var housingIncome_st = acsMOE(genhousIncome(B25095_st,B25074_st,'state'),'state');

//Final data
 var housingIncome_fin = housingIncome_st.concat(housingIncome_reg, housingIncome_cty);
 
} //Region

if(ctyList.includes(geotype)){
	var cty_forecast = housingSum(data[15], data[16], data[17],data[18],'county');
    var st_forecast = housingSum(data[0],data[1],data[2],data[3],'state');
    var hh_forecast = st_forecast.concat(cty_forecast);
	
	var hhforecast_fin = procHHForecast(hh_forecast);

	
	//ACS Tables
	var B25002_st = acsPrep(data[4]);
	var B25004_st = acsPrep(data[5]);
	var B25005_st = acsPrep(data[6]);
	var B25010_st = acsPrep(data[7]);
	var B25032_st = acsPrep(data[8]);
	var B25033_st = acsPrep(data[9]);
	var B25037_st = acsPrep(data[10]);
	var B25064_st = acsPrep(data[11]);
	var B25074_st = acsPrep(data[12]);
	var B25077_st = acsPrep(data[13]);
	var B25095_st = acsPrep(data[14]);
	var B25002_cty = acsPrep(data[19]);
	var B25004_cty = acsPrep(data[20]);
	var B25005_cty = acsPrep(data[21]);
	var B25010_cty = acsPrep(data[22]);
	var B25032_cty = acsPrep(data[23]);
	var B25033_cty = acsPrep(data[24]);
	var B25037_cty = acsPrep(data[25]);
	var B25064_cty = acsPrep(data[26]);
	var B25074_cty = acsPrep(data[27]);
	var B25077_cty = acsPrep(data[28]);
	var B25095_cty = acsPrep(data[29]);

//processing Occupancy Table
   
    //County Data
	var occ_tab_cty = gen_occ_tab(B25002_cty,B25004_cty,B25005_cty,'county') 

	//State Data
	var occ_tab_st = gen_occ_tab(B25002_st,B25004_st,B25005_st,'state');
	
	
	//Final data
	var occ_tab_fin = occ_tab_cty.concat(occ_tab_st);
	
	//processing the Housing Type table

   //County Data
   	var pph_cty = B25010_cty
	var medyr_cty = B25037_cty;
	var tenure_unit_cty = acsMOE(gen_str_unit(B25032_cty,'county'))

	var tenure_pop_cty = acsMOE(gen_str_pop(B25033_cty,'county')) 

	//State Data
  	var pph_st = B25010_st;
	var medyr_st = B25037_st;
	var tenure_unit_st = acsMOE(gen_str_unit(B25032_st,'state')); 
	var tenure_pop_st = acsMOE(gen_str_pop(B25033_st,'state'));
	
	
	//Final data
	var tenure_unit_fin = tenure_unit_cty.concat(tenure_unit_st);
	var tenure_pop_fin = tenure_pop_cty.concat(tenure_pop_st);
	var medyr_fin = medyr_cty.concat(medyr_st)
	var pph_fin = pph_cty.concat(pph_st);
	
    var fin_tenure_tab = genTenureTab(tenure_unit_fin,medyr_fin,tenure_pop_fin,pph_fin);

//Housing Economics Table  
//Calculating the housing cost value for County and State

var OOMed_cty = B25077_cty
var OOMed_st = B25077_st;

var OOMed_EST = [];
var OOMed_MOE = [];
for(i = 0; i < OOMed_cty.length; i++){
	  OOMed_EST.push(OOMed_cty[i].B25077_001E);
	  OOMed_MOE.push(OOMed_cty[i].B25077_001M);
	  };

var RTMed_cty = B25064_cty;
var RTMed_st = B25064_st;

var RTMed_EST = [];
var RTMed_MOE = [];
for(i = 0; i < RTMed_cty.length; i++){
	  RTMed_EST.push(RTMed_cty[i].B25064_001E);
	  RTMed_MOE.push(RTMed_cty[i].B25064_001M);
	  };
	  


//Assembling final tabs

var st_Med = [];
st_Med.push({'FIPS' : OOMed_st[0].GEO1, 'NAME' : OOMed_st[0].NAME, 'VAR' : 'Median Cost', 
				'OO_EST' : OOMed_st[0].B25077_001E, 'OO_MOE' : OOMed_st[0].B25077_001M, 
				'RT_EST' : RTMed_st[0].B25064_001E, 'RT_MOE' : RTMed_st[0].B25064_001M});
				
var cty_Med = [];
for(i = 0; i < OOMed_cty.length; i++){
	  cty_Med.push({'FIPS' : OOMed_cty[i].GEO2, 'NAME' : OOMed_cty[i].NAME, 'VAR' : 'Median Cost', 
	                'OO_EST' : OOMed_cty[i].B25077_001E, 'OO_MOE' : OOMed_cty[i].B25077_001M, 
					'RT_EST' : RTMed_cty[i].B25064_001E, 'RT_MOE' : RTMed_cty[i].B25064_001M})
}

var med_fin = cty_Med.concat(st_Med);

// Percent of home owners at 30% or more, 31-49% or more, 50% or more on housing

var housingIncome = genhousIncome(B25095_cty,B25074_cty,geotype);

//County data
	var housingIncome_cty = acsMOE(housingIncome,'county') 
	               .sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
//State Data
var housingIncome_st = acsMOE(genhousIncome(B25095_st,B25074_st,'state'),'state');

//Final data
 var housingIncome_fin = housingIncome_cty.concat(housingIncome_st);
} // county

if(muniList.includes(geotype)){
	var cty_forecast = housingSum(data[15], data[16], data[17],data[18],'county');
    var st_forecast = housingSum(data[0],data[1],data[2],data[3],'state');
    var hh_forecast = st_forecast.concat(cty_forecast);
	var hhforecast_fin = procHHForecast(hh_forecast);


	//ACS Data Calls

	var B25002_st = acsPrep(data[4]);
	var B25004_st = acsPrep(data[5]);
	var B25005_st = acsPrep(data[6]);
	var B25010_st = acsPrep(data[7]);
	var B25032_st = acsPrep(data[8]);
	var B25033_st = acsPrep(data[9]);
	var B25037_st = acsPrep(data[10]);
	var B25064_st = acsPrep(data[11]);
	var B25074_st = acsPrep(data[12]);
	var B25077_st = acsPrep(data[13]);
	var B25095_st = acsPrep(data[14]);
	var B25002_cty = acsPrep(data[19]);
	var B25004_cty = acsPrep(data[20]);
	var B25005_cty = acsPrep(data[21]);
	var B25010_cty = acsPrep(data[22]);
	var B25032_cty = acsPrep(data[23]);
	var B25033_cty = acsPrep(data[24]);
	var B25037_cty = acsPrep(data[25]);
	var B25064_cty = acsPrep(data[26]);
	var B25074_cty = acsPrep(data[27]);
	var B25077_cty = acsPrep(data[28]);
	var B25095_cty = acsPrep(data[29]);
	var B25002_muni = acsPrep(data[30]);
	var B25004_muni = acsPrep(data[31]);
	var B25005_muni = acsPrep(data[32]);
	var B25010_muni = acsPrep(data[33]);
	var B25032_muni = acsPrep(data[34]);
	var B25033_muni = acsPrep(data[35]);
	var B25037_muni = acsPrep(data[36]);
	var B25064_muni = acsPrep(data[37]);
	var B25074_muni = acsPrep(data[38]);
	var B25077_muni = acsPrep(data[39]);
	var B25095_muni = acsPrep(data[40]);

//processing Occupancy Table
    //Muni Data
	var occ_tab_muni = gen_occ_tab(B25002_muni,B25004_muni,B25005_muni,'muni')   
    //County Data
	var occ_tab_cty = gen_occ_tab(B25002_cty,B25004_cty,B25005_cty,'county') 

	//State Data
	var occ_tab_st = gen_occ_tab(B25002_st,B25004_st,B25005_st,'state');
	
	
	//Final data
	var occ_tab_fin = occ_tab_muni.concat(occ_tab_cty,occ_tab_st);
	
	//processing the Housing Type table
   //Muni Data
   	var pph_muni = B25010_muni
	var medyr_muni = B25037_muni;
	var tenure_unit_muni = acsMOE(gen_str_unit(B25032_muni,'muni'))
	var tenure_pop_muni = acsMOE(gen_str_pop(B25033_muni,'muni')) 
	
   //County Data
   	var pph_cty = B25010_cty
	var medyr_cty = B25037_cty;
	var tenure_unit_cty = acsMOE(gen_str_unit(B25032_cty,'county'))
	var tenure_pop_cty = acsMOE(gen_str_pop(B25033_cty,'county')) 

	//State Data
  	var pph_st = B25010_st;
	var medyr_st = B25037_st;
	var tenure_unit_st = acsMOE(gen_str_unit(B25032_st,'state')); 
	var tenure_pop_st = acsMOE(gen_str_pop(B25033_st,'state'));
	
	
	//Final data
	var tenure_unit_fin = tenure_unit_muni.concat(tenure_unit_cty,tenure_unit_st);
	var tenure_pop_fin = tenure_pop_muni.concat(tenure_pop_cty,tenure_pop_st);
	var medyr_fin = medyr_muni.concat(medyr_cty, medyr_st)
	var pph_fin = pph_muni.concat(pph_cty,pph_st);
	
    var fin_tenure_tab = genTenureTab(tenure_unit_fin,medyr_fin,tenure_pop_fin,pph_fin);


//Housing Economics Table  
//Calculating the housing cost value for region

var OOMed_muni = B25077_muni
var OOMed_cty = B25077_cty
var OOMed_st = B25077_st;

var RTMed_muni = B25064_muni
var RTMed_cty = B25064_cty
var RTMed_st = B25064_st;

				
var st_Med = [];
st_Med.push({'FIPS' : OOMed_st[0].GEO1, 'NAME' : OOMed_st[0].NAME, 'VAR' : 'Median Cost', 
				'OO_EST' : OOMed_st[0].B25077_001E, 'OO_MOE' : OOMed_st[0].B25077_001M, 
				'RT_EST' : RTMed_st[0].B25064_001E, 'RT_MOE' : RTMed_st[0].B25064_001M});
				

var cty_Med = [];
cty_Med.push({'FIPS' : OOMed_cty[0].GEO2, 'NAME' : OOMed_cty[0].NAME, 'VAR' : 'Median Cost', 
	                'OO_EST' : OOMed_cty[0].B25077_001E, 'OO_MOE' : OOMed_cty[0].B25077_001M, 
					'RT_EST' : RTMed_cty[0].B25064_001E, 'RT_MOE' : RTMed_cty[0].B25064_001M})

var muni_Med = [];
muni_Med.push({'FIPS' : OOMed_muni[0].GEO2, 'NAME' : OOMed_muni[0].NAME, 'VAR' : 'Median Cost', 
	                'OO_EST' : OOMed_muni[0].B25077_001E, 'OO_MOE' : OOMed_muni[0].B25077_001M, 
					'RT_EST' : RTMed_muni[0].B25064_001E, 'RT_MOE' : RTMed_muni[0].B25064_001M})

var med_fin = muni_Med.concat(cty_Med, st_Med);

// Percent of home owners at 30% or more, 31-49% or more, 50% or more on housing
var housingIncomemuni = genhousIncome(B25095_muni,B25074_muni,geotype);

//Muni data
	var housingIncome_muni = acsMOE(housingIncomemuni,'muni') 
	               .sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
				   

//County data
var housingIncomecty = genhousIncome(B25095_cty,B25074_cty,geotype);
var housingIncome_cty = acsMOE(housingIncomecty,'county') 
	               .sort(function(a, b){ return d3.ascending(a['FIPS'], b['FIPS']); }); 
//State Data
var housingIncome_st = acsMOE(genhousIncome(B25095_st,B25074_st,'state'),'state');

//Final data
 var housingIncome_fin = housingIncome_muni.concat(housingIncome_cty, housingIncome_st);
} // muni

var bkMarkArr = [{title : 'Household Forecast', id :'house01', srctxt : "Household Forecast", srclink : "https://coloradodemography.github.io/housing-and-households/data/household-projections/"},
	{title : 'Housing Occupancy and Vacancy Table', id : 'house02', srctxt : "ACS Housing Unit Occupancy Estimates",srclink : genCEDSCIUrl(geotype,"B25002",curyear, fipsArr)},
	{title : 'Housing Type Table', id : 'house03', srctxt : "ACS Housing Type Estimates",srclink : genCEDSCIUrl(geotype,"B25033",curyear, fipsArr)},
	{title : 'Housing Cost and Affordability Table', id : 'house04', srctxt : "ACS Housing Cost and Affordability Estimates",srclink : genCEDSCIUrl(geotype,"B25095",curyear, fipsArr)}]
//Outputs
insertBkmark(bkMarkArr)

genHHForecastChart(hhforecast_fin,PRO_1.id,bkMarkArr[0], geotype);
genOccupancyTab(occ_tab_fin,PRO_2.id,bkMarkArr[1],geotype,curyear,fipsArr);
genHousingTenureTab(fin_tenure_tab,PRO_3.id,bkMarkArr[2],geotype,curyear,fipsArr);
genHHIncomeTab(med_fin, housingIncome_fin,PRO_4.id,bkMarkArr[3],geotype,curyear,fipsArr);

	}); //end of Promise
}; 
// genSel5Display


function genSel6display(geotype, fipsArr, names, curyear, PRO_1, PRO_2, PRO_3, PRO_4) {
//genSel6display  Commuting/LODES displays and jobs displays
 const fmt_date = d3.timeFormat("%B %d, %Y");
 const fmt_yr = d3.format("00");

  
//Clear out Divs

  PRO_1.innerHTML = "";
  PRO_2.innerHTML = "";
  PRO_3.innerHTML = "";
  PRO_4.innerHTML = "";

//The displays are limited by geography -- not available for Region
 
if(geotype == "County") {
	var fips_arr =  "08" + fipsArr;
	var fips_num = parseInt(fipsArr);
}	

 if(geotype == "Municipality"){
	var fips_arr = muni_county(fipsArr)
    var fips_num = parseInt(fips_arr);
    } 

//Reading preliminary data for counties  UPDATE THIS TO API CALL....
var ctySummary = "../data/OTM_County_Summary.csv"
var ctyPlace = "../data/OTM_County_Place.csv"

var prom = [d3.csv(ctySummary), d3.csv(ctyPlace)];

Promise.all(prom).then(data =>{

var PlaceData =  data[1].filter(d => d.fips == fips_arr);

var bkMarkArr = [{title : 'Commuter Venn Diagram', id :'lodes01', srctxt : "Venn Diagram", srclink : "https://onthemap.ces.census.gov/"},
	{title : 'Commuting Table', id : 'lodes02', srctxt : "Communting Table",srclink : "https://onthemap.ces.census.gov/"},
	{title : 'Detailed Commuting Diagram', id : 'lodes03', srctxt : "Detailed Commuting Diagram",srclink : "https://onthemap.ces.census.gov/"}]
//Outputs
insertBkmark(bkMarkArr)

//genVennDiagram(data[0],PRO_1.id,bkMarkArr[0], geotype,fipsArr);
//genCommutingTab(data[0],PRO_2.id,bkMarkArr[1],geotype,fipsArr);
genCommutingDiag(PlaceData,PRO_3.id,bkMarkArr[2],geotype,fipsArr);


	}); 
 }  
// genSel6Display

