/**
 * Global_SDO_Utilities.js
 * Master Centralized Utilities & Geography Whitelists for the State Demography Office.
 * Derived directly from production legacy source systems.
 */

// --- CENTRAL APPLICATION CONFIGURATIONS ---
const SDO_CONFIG = {
    // Centralized access point for Census queries if required by future tools
    CENSUS_API_KEY: "08fe07c2a7bf781b7771d7cccb264fe7ff8965ce"
};

// --- CORE GEOGRAPHY TRANSLATION DICTIONARIES ---
const SDO_COUNTY_NAMES = {
    0: "Colorado", 1: "Adams County", 3: "Alamosa County", 5: "Arapahoe County", 
    7: "Archuleta County", 9: "Baca County", 11: "Bent County", 13: "Boulder County", 
    14: "Broomfield County", 15: "Chaffee County", 17: "Cheyenne County", 19: "Clear Creek County", 
    21: "Conejos County", 23: "Costilla County", 25: "Crowley County", 27: "Custer County", 
    29: "Delta County", 31: "Denver County", 33: "Dolores County", 35: "Douglas County", 
    37: "Eagle County", 39: "Elbert County", 41: "El Paso County", 43: "Fremont County", 
    45: "Garfield County", 47: "Gilpin County", 49: "Grand County", 51: "Gunnison County", 
    53: "Hinsdale County", 55: "Huerfano County", 57: "Jackson County", 59: "Jefferson County", 
    61: "Kiowa County", 63: "Kit Carson County", 65: "Lake County", 67: "La Plata County", 
    69: "Larimer County", 71: "Las Animas County", 73: "Lincoln County", 75: "Logan County", 
    77: "Mesa County", 79: "Mineral County", 81: "Moffat County", 83: "Montezuma County", 
    85: "Montrose County", 87: "Morgan County", 89: "Otero County", 91: "Ouray County", 
    93: "Park County", 95: "Phillips County", 97: "Pitkin County", 99: "Prowers County", 
    101: "Pueblo County", 103: "Rio Blanco County", 105: "Rio Grande County", 107: "Routt County", 
    109: "Saguache County", 111: "San Juan County", 113: "San Miguel County", 115: "Sedgwick County", 
    117: "Summit County", 119: "Teller County", 121: "Washington County", 123: "Weld County", 
    125: "Yuma County", 500: "Denver-Boulder Metro Area"
};

// --- CORE GEOGRAPHY LOOKUP HELPER FUNCTIONS ---

/**
 * Maps a numeric FIPS code directly to an official SDO County Name string
 */
function sdoGetCountyName(ctyFips) {
    var cleanFips = parseInt(ctyFips, 10);
    return SDO_COUNTY_NAMES[cleanFips] || "County " + ctyFips;
}

/**
 * Returns the production county FIPS mapping array for an input SDO Region Number
 */
function sdoGetRegionCounties(regnum) {
    var reg = parseInt(regnum, 10);
    const regions = {
        0: ['001', '003', '005', '007', '009', '011', '013', '014', '015', '017', '019', '021', '023', '025', '027', '029', '031', '033', '035', '037', '039', '041', '043', '045', '047', '049', '051', '053', '055', '057', '059', '061', '063', '065', '067', '069', '071', '073', '075', '077', '079', '081', '083', '085', '087', '089', '091', '093', '095', '097', '099', '101', '103', '105', '107', '109', '111', '113', '115', '117', '119', '121', '123', '125'],
        1: ['075','087','095','115','121','125'],
        2: ['069','123'],
        3: ['001','005','013','014','019','031','035','047','059'],
        4: ['041','093','119'],
        5: ['017','039','063','073'],
        6: ['009','011','025','061','089','099'],
        7: ['101'],
        8: ['003','021','023','079','105','109'],
        9: ['007','033','067','083','111'],
        10: ['029','051','053','085','091','113'],
        11: ['045','077','081','103'],
        12: ['037','049','057','097','107','117'],
        13: ['015','027','043','065'],
        14: ['055','071'],
        15: ['015', '019', '027', '043', '047', '055', '065', '071', '093'],
        16: ['009', '011', '017', '025', '039', '061', '063', '073', '075', '087', '089', '095', '099', '115', '121', '125'],
        17: ['001', '005', '013', '014', '031', '035', '041', '059', '069', '101','119','123'],
        18: ['003', '021', '023', '079', '105', '109'],
        19: ['007', '029', '033', '037', '045', '049', '051', '053', '057', '067', '077', '081', '083', '085', '091', '097', '103', '107', '111', '113', '117']
    };
    return regions[reg] || [];
}

// --- UNIVERSAL DATA FORMATTING & UI AGENTS ---

/**
 * Standard SDO Number and Percentage Formatter using native Intl optimization
 */
function formatSDO(val, type = 'num') {
    if (val === null || isNaN(val) || val === "") return "";
    switch (type) {
        case 'pct': return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val / 100);
        case 'dec': return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
        default: return new Intl.NumberFormat('en-US').format(val);
    }
}

/**
 * Extracts selected values from multiple selector dropdown fields
 */
function sdoGetSelectValues(selectElement) {
    if (!selectElement) return [];
    var result = [];
    var options = selectElement.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
            result.push(options[i].value);
        }
    }
    return result;
}

/**
 * Populates and formats year selector dropdown fields, styling Forecast targets in deep red
 */
function sdoPopulateYears(dropdownId, yeardata) {
    var sel = document.getElementById(dropdownId);
    if (!sel) return;
    sel.innerHTML = "";
    
    yeardata.forEach(j => {
        var el = document.createElement("option");
        el.value = j.year;
        el.textContent = j.year;
        
        if (j.datatype === "Estimate") {
            el.style.color = "black";
        } else {
            el.style.color = "#A51C30";
            el.style.fontWeight = "bold";
        }
        sel.appendChild(el);
    });
}