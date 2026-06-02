/**
 * Global_SDO_Utilities.js
 * Master Centralized Utilities & Geography Whitelists for the State Demography Office.
 * Central System Production Build - Decoupled Drupal Visibility Architecture.
 */

// --- CENTRAL APPLICATION CONFIGURATIONS ---
const SDO_CONFIG = {
    CENSUS_API_KEY: "08fe07c2a7bf781b7771d7cccb264fe7ff8965ce"
};

// --- SYSTEM GEOGRAPHY MASTER DICTIONARIES ---
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

const SDO_REGION_NAMES = {
    0: "Colorado (State Total)",
    1: "Region 1: Northern Eastern Plains",
    2: "Region 2: Northern Front Range",
    3: "Region 3: Denver Metropolitan Area",
    4: "Region 4: Southern Front Range",
    5: "Region 5: Central Eastern Plains",
    6: "Region 6: Southern Eastern Plains",
    7: "Region 7: Pueblo County",
    8: "Region 8: San Luis Valley",
    9: "Region 9: Southern Western Slope",
    10: "Region 10: Central Western Slope",
    11: "Region 11: Northern Western Slope",
    12: "Region 12: Northern Mountains",
    13: "Region 13: Central Mountains",
    14: "Region 14: Southern Mountains",
    15: "Region 15 (Geographic Central Mountains)",
    16: "Region 16 (Geographic Eastern Plains)",
    17: "Region 17 (Geographic Front Range)",
    18: "Region 18 (Geographic San Luis Valley)",
    19: "Region 19 (Geographic Western Slope)",
    20: "Region 20 (Denver PMSA)",
    21: "Region 21 (Denver-Boulder Metro)",
    22: "Region 22 (Denver-Boulder-Greeley CMSA)",
    23: "Region 23 (Denver Metro 10-County)",
    24: "Region 24 (Boulder MSA)",
    25: "Region 25 (Colorado Springs MSA)",
    26: "Region 26 (Denver-Aurora-Lakewood MSA)",
    27: "Region 27 (Fort Collins MSA)",
    28: "Region 28 (Grand Junction MSA)",
    29: "Region 29 (Greeley MSA)",
    30: "Region 30 (Pueblo MSA)",
    31: "Region 31 (Breckenridge Micro)",
    32: "Region 32 (Cañon City Micro)",
    33: "Region 33 (Craig Micro)",
    34: "Region 34 (Durango Micro)",
    35: "Region 35 (Edwards Micro)",
    36: "Region 36 (Fort Morgan Micro)",
    37: "Region 37 (Glenwood Springs Micro)",
    38: "Region 38 (Montrose Micro)",
    39: "Region 39 (Steamboat Springs Micro)",
    40: "Region 40 (Sterling Micro)"
};

// --- GEOGRAPHY MAP INDEX ACCESSORS ---

/**
 * Maps a numeric FIPS code directly to an official SDO County Name string
 */
function sdoGetCountyName(ctyFips) {
    var cleanFips = parseInt(ctyFips, 10);
    return SDO_COUNTY_NAMES[cleanFips] || "County " + ctyFips;
}

/**
 * Maps a numeric Code directly to an official SDO Region Name string
 */
function sdoGetRegionName(regCode) {
    var cleanReg = parseInt(regCode, 10);
    return SDO_REGION_NAMES[cleanReg] || "Region " + regCode;
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
        19: ['007', '029', '033', '037', '045', '049', '051', '053', '057', '067', '077', '081', '083', '085', '091', '097', '103', '107', '111', '113', '117'],
        20: ['001', '005', '014', '031', '035', '059'],
        21: ['001', '005', '013', '014', '031', '035', '059'],
        22: ['001', '005', '013', '014', '031', '035', '059', '123'],
        23: ['001', '003', '014', '019', '031', '035', '039', '047', '059', '093'],
        24: ['013'],
        25: ['041','119'],
        26: ['001','005','014','019','031','035','039','047','059','093'],
        27: ['069'],
        28: ['077'],
        29: ['123'],
        30: ['101'],
        31: ['117'],
        32: ['043'],
        33: ['081'],
        34: ['067'],
        35: ['037'],
        36: ['087'],
        37: ['045','097'],
        38: ['085','091'],
        39: ['107'],
        40: ['075']
    };
    return regions[reg] || [];
}

// --- UNIVERSAL DATA FORMATTING ---

/**
 * Standard SDO Number Formatter using native Intl optimization
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