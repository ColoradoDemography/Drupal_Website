// 1. Initialize using Global Utilities
includeHTML();

var urlstr = "https://gis.dola.colorado.gov/lookups/componentYRS";

d3.json(urlstr).then(function(yeardata) {
    var yeardata2 = yeardata.filter(d => d.year >= 1980 && d.datatype == 'Estimate');
    
    // Using Global Helpers instead of local definitions
    sdoPopDropdown('county', 'county-dropdown', '');
    sdoPopDropdown('ctymuni', 'muni-dropdown', '');
    sdoPopYearDropdown("year-dropdown", yeardata2);

    // Button Event
    document.getElementById('gentable').addEventListener("click", chkInputs);
    document.getElementById('cleartable').addEventListener("click", clearInputs);

    function chkInputs() {
        var complete = true;
        var outputmsg = "";
        document.getElementById('tbl_output').innerHTML = "";

        // Use the Global Helper to get values
        var selectedfips = sdoGetSelectValues(document.getElementById('county-dropdown'));
        var selectedmuni = sdoGetSelectValues(document.getElementById('muni-dropdown'));
        var selectedyr = sdoGetSelectValues(document.getElementById('year-dropdown'));

        if ((selectedfips.length == 0) && (selectedmuni.length == 0)) {
            outputmsg += " > Please select one or more Counties or Municipalities.\n";
            complete = false;
        }

        if (selectedyr.length == 0) {
            outputmsg += " > Please select one or more years.\n";
            complete = false;
        }

        var selectedgroup = document.querySelector('input[name="sum_grouping"]:checked').value;

        if (complete) {
            // This function remains in your profile.js/lookup.js legacy files
            genCtyMuni(selectedfips, selectedmuni, selectedyr, selectedgroup);
        } else {
            window.alert(outputmsg);
        }
    };
});