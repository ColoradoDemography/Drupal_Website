/**
 * Global_SDO_Utilities.js
 * Centralized business logic and utilities for the State Demography Office.
 */

// --- BRAND ASSETS ---
const sdoColors = [
    '#001970', '#007ADE', '#5BB5FF', '#000000', '#808080', 
    '#BFBFBF', '#35647E', '#5D99BD', '#245D38', '#7A853B', 
    '#E1D100', '#C3002F', '#FF8199', '#6D3A5D', '#9F7FB3'
];

// --- GEOGRAPHY LOOKUPS ---
function regionCOL(regnum) {
    const regions = {
        15: ['015', '019', '027', '043', '047', '055', '065', '071', '093'],
        16: ['009', '011', '017', '025', '039', '061', '063', '073', '075', '087', '089', '095', '099', '115', '121', '125'],
        17: ['001', '005', '013', '014', '031', '035', '041', '059', '069', '101','119','123'],
        18: ['003', '021', '023', '079', '105', '109'],
        19: ['007', '029', '033', '037', '045', '049', '051', '053', '057', '067', '077', '081', '083', '085', '091', '097', '103', '107', '111', '113', '117']
    };
    return regions[regnum] || [];
}

// --- CORE UTILITY HELPERS ---

/**
 * Performs a relational join between two data tables based on key matching
 */
function sdoJoinTables(lookupTable, mainTable, lookupKey, mainKey, selectFn) {
    const l = lookupTable.length;
    const m = mainTable.length;
    const lookupIndex = [];
    const output = [];
    
    for (let i = 0; i < l; i++) {
        let row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row;
    }
	
    for (let j = 0; j < m; j++) {
        let y = mainTable[j];
        let x = lookupIndex[y[mainKey]];
        output.push(selectFn(y, x));
    }
    return output;
}

/**
 * Extracts checked array values from standard multi-select dropdown fields
 */
function sdoGetSelectValues(selectElement) {
    if (!selectElement) return [];
    const result = [];
    const options = selectElement.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            result.push(options[i].value);
        }
    }
    return result;
}

/**
 * Populates standard year selector dropdown fields and highlights Forecast targets
 */
function sdoPopulateYears(dropdownId, yeardata) {
    const sel = document.getElementById(dropdownId);
    if (!sel) return;
    sel.innerHTML = "";
    
    yeardata.forEach(j => {
        const el = document.createElement("option");
        el.value = j.year;
        el.textContent = j.year;
        
        if (j.datatype === "Estimate") {
            el.style.color = "black";
        } else {
            // Emphasize non-estimate forecast variants
            el.style.color = "#A51C30";
            el.style.fontWeight = "bold";
        }
        sel.appendChild(el);
    });
}

/**
 * Standard SDO Number Formatter
 */
function formatSDO(val, type = 'num') {
    if (val === null || isNaN(val)) return '-';
    switch (type) {
        case 'pct': return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(val / 100);
        case 'dec': return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
        default: return new Intl.NumberFormat('en-US').format(val);
    }
}