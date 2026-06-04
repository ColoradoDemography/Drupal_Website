//Website functions for State Demography Office webpage
//A. Bickford 5/2021

//list of lookup statements  https://github.com/ColoradoDemography/MS_Demog_Lookups/tree/master/doc
// profilesql syntax https://gis.dola.colorado.gov/lookups/profilesql?table=estimates.firm_count&year=2011&geo=1
//String FIPS codes need to be quoted e.g. '001'

//cat Utility Functions

function getSelectValues(select) {
//getSelectValues Works with multiple selection boxes from Stack Overflow https://stackoverflow.com/questions/5866169/how-to-get-all-selected-values-of-a-multiple-select-box

  var result = [];
  var options = select && select.options;
  var opt;

  for (i = 0; i < options.length; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push({'id' : opt.value, 'name' : opt.text});
    }
  }
  return result;
}
// getSelectValues

function hideButtons() {
//hideButtons  selects and hides all "dropbtn" class buttons in DOM
	btn = document.getElementsByClassName("dropbtn"); 
	for(i = 0; i < btn.length; i++){
		btn[i].style.display = "none";
	};
}
// hideButtons

function showButtons() {
//showButtons  selects and shows all "dropbtn" class buttons in DOM
	btn = document.getElementsByClassName("dropbtn"); 
	for(i = 0; i < btn.length; i++){
		if(btn[i].style.display = "none") {
		btn[i].style.display = "block";
		}
	};
}
// showButtons

function accordionFun() {
//accordionFun  manages the accordion  panels in the DOM
var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
// Toggle between adding and removing the "active" class,
// to highlight the button that controls the panel 
    this.classList.toggle("active");

    // Toggle between hiding and showing the active panel 
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
} 
// accordionFun

function includeHTML() {
//includeHTML Manages inclusion of secondary pages. Taken from W3  https://www.w3schools.com/howto/howto_html_include.asp'
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
} 
// includeHTML


function muni_county(muni){
//muni_county provides county designation for municipalities (based on largest population for multi-county munis
var cty_n;
if(muni == '00760'){cty_n = '071'};
if(muni == '00925'){cty_n = '121'};
if(muni == '01090'){cty_n = '003'};
if(muni == '01530'){cty_n = '093'};
if(muni == '02355'){cty_n = '021'};
if(muni == '03235'){cty_n = '073'};
if(muni == '03455'){cty_n = '059'};
if(muni == '03620'){cty_n = '097'};
if(muni == '03950'){cty_n = '123'};
if(muni == '04000'){cty_n = '005'};
if(muni == '04110'){cty_n = '037'};
if(muni == '04935'){cty_n = '037'};
if(muni == '05265'){cty_n = '067'};
if(muni == '06090'){cty_n = '001'};
if(muni == '06255'){cty_n = '069'};
if(muni == '06530'){cty_n = '063'};
if(muni == '07025'){cty_n = '047'};
if(muni == '07190'){cty_n = '023'};
if(muni == '07410'){cty_n = '117'};
if(muni == '07571'){cty_n = '109'};
if(muni == '07795'){cty_n = '101'};
if(muni == '07850'){cty_n = '013'};
if(muni == '08070'){cty_n = '005'};
if(muni == '08345'){cty_n = '071'};
if(muni == '08400'){cty_n = '117'};
if(muni == '08675'){cty_n = '001'};
if(muni == '09115'){cty_n = '043'};
if(muni == '09280'){cty_n = '014'};
if(muni == '09555'){cty_n = '087'};
if(muni == '10105'){cty_n = '015'};
if(muni == '10600'){cty_n = '063'};
if(muni == '11260'){cty_n = '041'};
if(muni == '11645'){cty_n = '009'};
if(muni == '11810'){cty_n = '043'};
if(muni == '12045'){cty_n = '045'};
if(muni == '12080'){cty_n = '045'};
if(muni == '12387'){cty_n = '035'};
if(muni == '12415'){cty_n = '035'};
if(muni == '12635'){cty_n = '029'};
if(muni == '12815'){cty_n = '005'};
if(muni == '12855'){cty_n = '109'};
if(muni == '12910'){cty_n = '047'};
if(muni == '13460'){cty_n = '089'};
if(muni == '13845'){cty_n = '005'};
if(muni == '14175'){cty_n = '017'};
if(muni == '14765'){cty_n = '079'};
if(muni == '15330'){cty_n = '043'};
if(muni == '15550'){cty_n = '071'};
if(muni == '15605'){cty_n = '077'};
if(muni == '16000'){cty_n = '041'};
if(muni == '16385'){cty_n = '005'};
if(muni == '16495'){cty_n = '001'};
if(muni == '17375'){cty_n = '083'};
if(muni == '17760'){cty_n = '081'};
if(muni == '17925'){cty_n = '029'};
if(muni == '18310'){cty_n = '051'};
if(muni == '18420'){cty_n = '109'};
if(muni == '18530'){cty_n = '119'};
if(muni == '18640'){cty_n = '075'};
if(muni == '18750'){cty_n = '025'};
if(muni == '19080'){cty_n = '123'};
if(muni == '19355'){cty_n = '077'};
if(muni == '19630'){cty_n = '005'};
if(muni == '19795'){cty_n = '105'};
if(muni == '19850'){cty_n = '029'};
if(muni == '20000'){cty_n = '031'};
if(muni == '20440'){cty_n = '117'};
if(muni == '20495'){cty_n = '081'};
if(muni == '20770'){cty_n = '083'};
if(muni == '21265'){cty_n = '033'};
if(muni == '22035'){cty_n = '067'};
if(muni == '22145'){cty_n = '061'};
if(muni == '22200'){cty_n = '037'};
if(muni == '22860'){cty_n = '123'};
if(muni == '23025'){cty_n = '125'};
if(muni == '23135'){cty_n = '059'};
if(muni == '23740'){cty_n = '039'};
if(muni == '24620'){cty_n = '019'};
if(muni == '24785'){cty_n = '005'};
if(muni == '24950'){cty_n = '123'};
if(muni == '25115'){cty_n = '069'};
if(muni == '25280'){cty_n = '123'};
if(muni == '25610'){cty_n = '093'};
if(muni == '26270'){cty_n = '001'};
if(muni == '26600'){cty_n = '123'};
if(muni == '26765'){cty_n = '063'};
if(muni == '26875'){cty_n = '075'};
if(muni == '27040'){cty_n = '043'};
if(muni == '27425'){cty_n = '069'};
if(muni == '27700'){cty_n = '123'};
if(muni == '27810'){cty_n = '087'};
if(muni == '27865'){cty_n = '041'};
if(muni == '27975'){cty_n = '089'};
if(muni == '28105'){cty_n = '005'};
if(muni == '28305'){cty_n = '049'};
if(muni == '28360'){cty_n = '123'};
if(muni == '28690'){cty_n = '117'};
if(muni == '28745'){cty_n = '077'};
if(muni == '29185'){cty_n = '123'};
if(muni == '29680'){cty_n = '073'};
if(muni == '29735'){cty_n = '019'};
if(muni == '29955'){cty_n = '123'};
if(muni == '30340'){cty_n = '005'};
if(muni == '30780'){cty_n = '045'};
if(muni == '30835'){cty_n = '059'};
if(muni == '31550'){cty_n = '099'};
if(muni == '31605'){cty_n = '049'};
if(muni == '31660'){cty_n = '077'};
if(muni == '31715'){cty_n = '049'};
if(muni == '32155'){cty_n = '123'};
if(muni == '32650'){cty_n = '041'};
if(muni == '33035'){cty_n = '005'};
if(muni == '33310'){cty_n = '123'};
if(muni == '33640'){cty_n = '051'};
if(muni == '33695'){cty_n = '037'};
if(muni == '34520'){cty_n = '099'};
if(muni == '34740'){cty_n = '061'};
if(muni == '34960'){cty_n = '095'};
if(muni == '35070'){cty_n = '107'};
if(muni == '36610'){cty_n = '087'};
if(muni == '37215'){cty_n = '099'};
if(muni == '37270'){cty_n = '095'};
if(muni == '37380'){cty_n = '003'};
if(muni == '37545'){cty_n = '029'};
if(muni == '37600'){cty_n = '049'};
if(muni == '37820'){cty_n = '123'};
if(muni == '37875'){cty_n = '073'};
if(muni == '38370'){cty_n = '019'};
if(muni == '38535'){cty_n = '067'};
if(muni == '38590'){cty_n = '075'};
if(muni == '39195'){cty_n = '013'};
if(muni == '39855'){cty_n = '123'};
if(muni == '39965'){cty_n = '115'};
if(muni == '40185'){cty_n = '123'};
if(muni == '40515'){cty_n = '123'};
if(muni == '40570'){cty_n = '071'};
if(muni == '40790'){cty_n = '039'};
if(muni == '41010'){cty_n = '017'};
if(muni == '41560'){cty_n = '049'};
if(muni == '41835'){cty_n = '013'};
if(muni == '42055'){cty_n = '021'};
if(muni == '42110'){cty_n = '089'};
if(muni == '42330'){cty_n = '053'};
if(muni == '42495'){cty_n = '059'};
if(muni == '43000'){cty_n = '059'};
if(muni == '43110'){cty_n = '099'};
if(muni == '43550'){cty_n = '035'};
if(muni == '43605'){cty_n = '123'};
if(muni == '43660'){cty_n = '011'};
if(muni == '44100'){cty_n = '055'};
if(muni == '44320'){cty_n = '065'};
if(muni == '44980'){cty_n = '073'};
if(muni == '45255'){cty_n = '005'};
if(muni == '45530'){cty_n = '123'};
if(muni == '45695'){cty_n = '087'};
if(muni == '45955'){cty_n = '035'};
if(muni == '45970'){cty_n = '013'};
if(muni == '46355'){cty_n = '013'};
if(muni == '46465'){cty_n = '069'};
if(muni == '47070'){cty_n = '013'};
if(muni == '48060'){cty_n = '021'};
if(muni == '48115'){cty_n = '083'};
if(muni == '48445'){cty_n = '041'};
if(muni == '48500'){cty_n = '089'};
if(muni == '48555'){cty_n = '051'};
if(muni == '49600'){cty_n = '123'};
if(muni == '49875'){cty_n = '103'};
if(muni == '50040'){cty_n = '075'};
if(muni == '50480'){cty_n = '123'};
if(muni == '50920'){cty_n = '037'};
if(muni == '51250'){cty_n = '109'};
if(muni == '51635'){cty_n = '105'};
if(muni == '51690'){cty_n = '117'};
if(muni == '51745'){cty_n = '085'};
if(muni == '51800'){cty_n = '041'};
if(muni == '52075'){cty_n = '059'};
if(muni == '52350'){cty_n = '059'};
if(muni == '52550'){cty_n = '113'};
if(muni == '52570'){cty_n = '051'};
if(muni == '53120'){cty_n = '085'};
if(muni == '53175'){cty_n = '013'};
if(muni == '53395'){cty_n = '045'};
if(muni == '54330'){cty_n = '001'};
if(muni == '54880'){cty_n = '113'};
if(muni == '54935'){cty_n = '085'};
if(muni == '55045'){cty_n = '123'};
if(muni == '55155'){cty_n = '107'};
if(muni == '55540'){cty_n = '085'};
if(muni == '55705'){cty_n = '025'};
if(muni == '55870'){cty_n = '113'};
if(muni == '55980'){cty_n = '029'};
if(muni == '56145'){cty_n = '025'};
if(muni == '56365'){cty_n = '121'};
if(muni == '56420'){cty_n = '091'};
if(muni == '56475'){cty_n = '115'};
if(muni == '56860'){cty_n = '007'};
if(muni == '56970'){cty_n = '077'};
if(muni == '57025'){cty_n = '041'};
if(muni == '57245'){cty_n = '095'};
if(muni == '57300'){cty_n = '029'};
if(muni == '57400'){cty_n = '045'};
if(muni == '57630'){cty_n = '035'};
if(muni == '58235'){cty_n = '075'};
if(muni == '59005'){cty_n = '123'};
if(muni == '59830'){cty_n = '051'};
if(muni == '60160'){cty_n = '123'};
if(muni == '60600'){cty_n = '015'};
if(muni == '61315'){cty_n = '009'};
if(muni == '62000'){cty_n = '101'};
if(muni == '62660'){cty_n = '041'};
if(muni == '62880'){cty_n = '103'};
if(muni == '63045'){cty_n = '123'};
if(muni == '63265'){cty_n = '037'};
if(muni == '64090'){cty_n = '033'};
if(muni == '64200'){cty_n = '091'};
if(muni == '64255'){cty_n = '045'};
if(muni == '64970'){cty_n = '043'};
if(muni == '65190'){cty_n = '089'};
if(muni == '65740'){cty_n = '021'};
if(muni == '66895'){cty_n = '101'};
if(muni == '67005'){cty_n = '109'};
if(muni == '67280'){cty_n = '015'};
if(muni == '67830'){cty_n = '021'};
if(muni == '68105'){cty_n = '023'};
if(muni == '68655'){cty_n = '113'};
if(muni == '68930'){cty_n = '115'};
if(muni == '69040'){cty_n = '063'};
if(muni == '69150'){cty_n = '123'};
if(muni == '69645'){cty_n = '005'};
if(muni == '69700'){cty_n = '061'};
if(muni == '70195'){cty_n = '045'};
if(muni == '70250'){cty_n = '027'};
if(muni == '70360'){cty_n = '019'};
if(muni == '70525'){cty_n = '117'};
if(muni == '70580'){cty_n = '111'};
if(muni == '70635'){cty_n = '039'};
if(muni == '71755'){cty_n = '097'};
if(muni == '72395'){cty_n = '105'};
if(muni == '73330'){cty_n = '009'};
if(muni == '73715'){cty_n = '071'};
if(muni == '73825'){cty_n = '107'};
if(muni == '73935'){cty_n = '075'};
if(muni == '74485'){cty_n = '063'};
if(muni == '74815'){cty_n = '025'};
if(muni == '75640'){cty_n = '013'};
if(muni == '75970'){cty_n = '089'};
if(muni == '76795'){cty_n = '113'};
if(muni == '77290'){cty_n = '001'};
if(muni == '77510'){cty_n = '069'};
if(muni == '78610'){cty_n = '071'};
if(muni == '79270'){cty_n = '009'};
if(muni == '80040'){cty_n = '037'};
if(muni == '80865'){cty_n = '119'};
if(muni == '81030'){cty_n = '009'};
if(muni == '81690'){cty_n = '063'};
if(muni == '82130'){cty_n = '057'};
if(muni == '82350'){cty_n = '055'};
if(muni == '82460'){cty_n = '009'};
if(muni == '82735'){cty_n = '013'};
if(muni == '83230'){cty_n = '069'};
if(muni == '83450'){cty_n = '027'};
if(muni == '83835'){cty_n = '001'};
if(muni == '84440'){cty_n = '059'};
if(muni == '84770'){cty_n = '087'};
if(muni == '85045'){cty_n = '099'};
if(muni == '85155'){cty_n = '043'};
if(muni == '85485'){cty_n = '123'};
if(muni == '85705'){cty_n = '049'};
if(muni == '86090'){cty_n = '119'};
if(muni == '86310'){cty_n = '125'};
if(muni == '86475'){cty_n = '107'};
if(muni == '86750'){cty_n = '125'};
return cty_n;
} 
// muni_county
   

function cdp_county(cdp) {
//cdp_county returns county code for cdp
if(cdp == '06172'){cty = '001'};
if(cdp == '20275'){cty = '001'};
if(cdp == '54750'){cty = '001'};
if(cdp == '69480'){cty = '001'};
if(cdp == '69810'){cty = '001'};
if(cdp == '77757'){cty = '001'};
if(cdp == '79100'){cty = '001'};
if(cdp == '83120'){cty = '001'};
if(cdp == '74375'){cty = '001'};
if(cdp == '82905'){cty = '001'};
if(cdp == '01145'){cty = '003'};
if(cdp == '00620'){cty = '005'};
if(cdp == '08530'){cty = '005'};
if(cdp == '10985'){cty = '005'};
if(cdp == '13590'){cty = '005'};
if(cdp == '16465'){cty = '005'};
if(cdp == '21330'){cty = '005'};
if(cdp == '37220'){cty = '005'};
if(cdp == '38910'){cty = '005'};
if(cdp == '58510'){cty = '005'};
if(cdp == '16110'){cty = '005'};
if(cdp == '02905'){cty = '007'};
if(cdp == '34685'){cty = '011'};
if(cdp == '01420'){cty = '013'};
if(cdp == '01740'){cty = '013'};
if(cdp == '04620'){cty = '013'};
if(cdp == '07580'){cty = '013'};
if(cdp == '18585'){cty = '013'};
if(cdp == '23575'){cty = '013'};
if(cdp == '23630'){cty = '013'};
if(cdp == '30350'){cty = '013'};
if(cdp == '30945'){cty = '013'};
if(cdp == '33502'){cty = '013'};
if(cdp == '35860'){cty = '013'};
if(cdp == '44270'){cty = '013'};
if(cdp == '44695'){cty = '013'};
if(cdp == '52210'){cty = '013'};
if(cdp == '53780'){cty = '013'};
if(cdp == '57445'){cty = '013'};
if(cdp == '59240'){cty = '013'};
if(cdp == '67040'){cty = '013'};
if(cdp == '69110'){cty = '013'};
if(cdp == '74980'){cty = '013'};
if(cdp == '75585'){cty = '013'};
if(cdp == '76325'){cty = '013'};
if(cdp == '80370'){cty = '013'};
if(cdp == '15302'){cty = '013'};
if(cdp == '29295'){cty = '015'};
if(cdp == '39800'){cty = '015'};
if(cdp == '49490'){cty = '015'};
if(cdp == '71625'){cty = '015'};
if(cdp == '21390'){cty = '019'};
if(cdp == '27175'){cty = '019'};
if(cdp == '67142'){cty = '019'};
if(cdp == '79785'){cty = '019'};
if(cdp == '11975'){cty = '021'};
if(cdp == '16715'){cty = '021'};
if(cdp == '27535'){cty = '023'};
if(cdp == '67500'){cty = '023'};
if(cdp == '00320'){cty = '035'};
if(cdp == '12387'){cty = '035'};
if(cdp == '28250'){cty = '035'};
if(cdp == '31935'){cty = '035'};
if(cdp == '36410'){cty = '035'};
if(cdp == '46410'){cty = '035'};
if(cdp == '50012'){cty = '035'};
if(cdp == '58592'){cty = '035'};
if(cdp == '66197'){cty = '035'};
if(cdp == '68875'){cty = '035'};
if(cdp == '74080'){cty = '035'};
if(cdp == '77235'){cty = '035'};
if(cdp == '83500'){cty = '035'};
if(cdp == '21155'){cty = '037'};
if(cdp == '23300'){cty = '037'};
if(cdp == '23795'){cty = '037'};
if(cdp == '28830'){cty = '037'};
if(cdp == '47345'){cty = '037'};
if(cdp == '85760'){cty = '037'};
if(cdp == '00870'){cty = '041'};
if(cdp == '06970'){cty = '041'};
if(cdp == '12325'){cty = '041'};
if(cdp == '14587'){cty = '041'};
if(cdp == '24235'){cty = '041'};
if(cdp == '27370'){cty = '041'};
if(cdp == '30420'){cty = '041'};
if(cdp == '58675'){cty = '041'};
if(cdp == '64870'){cty = '041'};
if(cdp == '68847'){cty = '041'};
if(cdp == '74430'){cty = '041'};
if(cdp == '86117'){cty = '041'};
if(cdp == '23520'){cty = '039'};
if(cdp == '60655'){cty = '039'};
if(cdp == '15440'){cty = '043'};
if(cdp == '17485'){cty = '043'};
if(cdp == '37655'){cty = '043'};
if(cdp == '45145'){cty = '043'};
if(cdp == '58400'){cty = '043'};
if(cdp == '05120'){cty = '045'};
if(cdp == '12460'){cty = '045'};
if(cdp == '12470'){cty = '045'};
if(cdp == '12945'){cty = '045'};
if(cdp == '52820'){cty = '045'};
if(cdp == '53875'){cty = '045'};
if(cdp == '65685'){cty = '047'};
if(cdp == '57850'){cty = '049'};
if(cdp == '76190'){cty = '049'};
if(cdp == '12450'){cty = '053'};
if(cdp == '58960'){cty = '053'};
if(cdp == '02575'){cty = '059'};
if(cdp == '03730'){cty = '059'};
if(cdp == '19150'){cty = '059'};
if(cdp == '22575'){cty = '059'};
if(cdp == '25390'){cty = '059'};
if(cdp == '25550'){cty = '059'};
if(cdp == '29625'){cty = '059'};
if(cdp == '38480'){cty = '059'};
if(cdp == '38810'){cty = '059'};
if(cdp == '40377'){cty = '059'};
if(cdp == '41065'){cty = '059'};
if(cdp == '84042'){cty = '059'};
if(cdp == '08290'){cty = '061'};
if(cdp == '78335'){cty = '061'};
if(cdp == '72320'){cty = '067'};
if(cdp == '44375'){cty = '065'};
if(cdp == '79105'){cty = '065'};
if(cdp == '43220'){cty = '069'};
if(cdp == '63320'){cty = '069'};
if(cdp == '24290'){cty = '071'};
if(cdp == '36940'){cty = '071'};
if(cdp == '39250'){cty = '071'};
if(cdp == '47015'){cty = '071'};
if(cdp == '68985'){cty = '071'};
if(cdp == '74275'){cty = '071'};
if(cdp == '80095'){cty = '071'};
if(cdp == '84000'){cty = '071'};
if(cdp == '03840'){cty = '075'};
if(cdp == '56695'){cty = '075'};
if(cdp == '15165'){cty = '077'};
if(cdp == '28800'){cty = '077'};
if(cdp == '45750'){cty = '077'};
if(cdp == '56035'){cty = '077'};
if(cdp == '63375'){cty = '077'};
if(cdp == '49325'){cty = '081'};
if(cdp == '44595'){cty = '083'};
if(cdp == '78280'){cty = '083'};
if(cdp == '63705'){cty = '085'};
if(cdp == '07420'){cty = '087'};
if(cdp == '39160'){cty = '087'};
if(cdp == '51975'){cty = '087'};
if(cdp == '55925'){cty = '087'};
if(cdp == '66995'){cty = '087'};
if(cdp == '71790'){cty = '087'};
if(cdp == '78345'){cty = '087'};
if(cdp == '83175'){cty = '087'};
if(cdp == '42165'){cty = '089'};
if(cdp == '54495'){cty = '089'};
if(cdp == '15825'){cty = '091'};
if(cdp == '45680'){cty = '091'};
if(cdp == '60765'){cty = '091'};
if(cdp == '33420'){cty = '093'};
if(cdp == '01915'){cty = '095'};
if(cdp == '53945'){cty = '097'};
if(cdp == '63650'){cty = '097'};
if(cdp == '86200'){cty = '097'};
if(cdp == '04165'){cty = '101'};
if(cdp == '06602'){cty = '101'};
if(cdp == '07245'){cty = '101'};
if(cdp == '15935'){cty = '101'};
if(cdp == '62220'){cty = '101'};
if(cdp == '67445'){cty = '101'};
if(cdp == '81305'){cty = '101'};
if(cdp == '01640'){cty = '105'};
if(cdp == '29845'){cty = '105'};
if(cdp == '58758'){cty = '107'};
if(cdp == '17150'){cty = '117'};
if(cdp == '35400'){cty = '117'};
if(cdp == '40550'){cty = '117'};
if(cdp == '20605'){cty = '119'};
if(cdp == '27095'){cty = '119'};
if(cdp == '30890'){cty = '119'};
if(cdp == '50380'){cty = '119'};
if(cdp == '03015'){cty = '123'};
if(cdp == '38425'){cty = '125'};
if(cdp == '39745'){cty = '125'};
if(cdp == '40900'){cty = '125'};
if(cdp == '42000'){cty = '125'};
if(cdp == '80755'){cty = '125'};
return cty;
} 
// cdp_county

function RegionNum(nam) {
//RegionNum takes the names of selected regions and returns a list of region numbers
var regionNum = 0;
if(nam == 'Colorado') {regionNum = 0};
if(nam == 'Central Mountains') {regionNum = 1};
if(nam == 'Eastern Plains') {regionNum = 2};
if(nam == 'Front Range') {regionNum = 3};
if(nam == 'San Luis Valley') {regionNum = 4};
if(nam == 'Western Slope') {regionNum = 5};
if(nam == 'Region 1: Northern Eastern Plains') {regionNum = 6};
if(nam == 'Region 2: Northern Front Range') {regionNum = 7};
if(nam == 'Region 3: Denver Metropolitan Area') {regionNum = 8};
if(nam == 'Region 4: Southern Front Range') {regionNum = 9};
if(nam == 'Region 5: Central Eastern Plains') {regionNum = 10};
if(nam == 'Region 6: Southern Eastern Plains') {regionNum = 11};
if(nam == 'Region 7: Pueblo County') {regionNum = 12};
if(nam == 'Region 8: San Luis Valley') {regionNum = 13};
if(nam == 'Region 9: Southern Western Slope') {regionNum = 14};
if(nam == 'Region 10: Central Western Slope') {regionNum = 15};
if(nam == 'Region 11: Northern Western Slope') {regionNum = 16};
if(nam == 'Region 12: Northern Mountains') {regionNum = 17};
if(nam == 'Region 13: Central Mountains') {regionNum = 18};
if(nam == 'Region 14: Southern Mountains') {regionNum = 19};
if(nam == 'Boulder') {regionNum = 20};
if(nam == 'Colorado Springs') {regionNum = 21};
if(nam == 'Denver-Aurora-Lakewood') {regionNum = 22};
if(nam == 'Fort Collins') {regionNum = 23};
if(nam == 'Grand Junction') {regionNum = 24};
if(nam == 'Greeley') {regionNum = 25};
if(nam == 'Pueblo') {regionNum = 26};
if(nam == 'Breckenridge') {regionNum = 27};
if(nam == 'Ca\u00f1on City') {regionNum = 28};
if(nam == 'Craig') {regionNum = 29};
if(nam == 'Durango') {regionNum = 30};
if(nam == 'Edwards') {regionNum = 31};
if(nam == 'Fort Morgan') {regionNum = 32};
if(nam == 'Glenwood Springs') {regionNum = 33};
if(nam == 'Montrose') {regionNum = 34};
if(nam == 'Steamboat Springs') {regionNum = 35};
if(nam == 'Sterling') {regionNum = 36};
if(nam == 'Denver PMSA') {regionNum = 37};
if(nam == 'Denver-Boulder Metro Area') {regionNum = 38};
if(nam == 'Denver-Boulder-Greely CMSA') {regionNum = 39};

return(regionNum);
}; 
// RegionNum


function regionName(reg) {
//RegionName takes the region number and returns the name
if(reg == 0) {name =  'Colorado'};
if(reg == 1) {name =  'Central Mountains'};
if(reg == 2) {name =  'Eastern Plains'};
if(reg == 3) {name =  'Front Range'};
if(reg == 4) {name =  'San Luis Valley'};
if(reg == 5) {name =  'Western Slope'};
if(reg == 6) {name = 'Region 1: Northern Eastern Plains'};
if(reg == 7) {name = 'Region 2: Northern Front Range'};
if(reg == 8) {name = 'Region 3: Denver Metropolitan Area'};
if(reg == 9) {name = 'Region 4: Southern Front Range'};
if(reg == 10) {name = 'Region 5: Central Eastern Plains'};
if(reg == 11) {name = 'Region 6: Southern Eastern Plains'};
if(reg == 12) {name = 'Region 7: Pueblo County'};
if(reg == 13) {name = 'Region 8: San Luis Valley'};
if(reg == 14) {name = 'Region 9: Southern Western Slope'};
if(reg == 15) {name = 'Region 10: Central Western Slope'};
if(reg == 16) {name = 'Region 11: Northern Western Slope'};
if(reg == 17) {name = 'Region 12: Northern Mountains'};
if(reg == 18) {name = 'Region 13: Central Mountains'};
if(reg == 19) {name = 'Region 14: Southern Mountains'};
if(reg == 20) {name =  'Boulder'};
if(reg == 21) {name =  'Colorado Springs'};
if(reg == 22) {name =  'Denver-Aurora-Lakewood'};
if(reg == 23) {name =  'Fort Collins'};
if(reg == 24) {name =  'Grand Junction'};
if(reg == 25) {name =  'Greeley'};
if(reg == 26) {name =  'Pueblo'};
if(reg == 27) {name =  'Breckenridge'};
if(reg == 28) {name =  'Ca\u00f1on City'};
if(reg == 29) {name =  'Craig'};
if(reg == 30) {name =  'Durango'};
if(reg == 31) {name =  'Edwards'};
if(reg == 32) {name =  'Fort Morgan'};
if(reg == 33) {name =  'Glenwood Springs'};
if(reg == 34) {name = 'Montrose'};
if(reg == 35) {name =  'Steamboat Springs'};
if(reg == 36) {name =  'Sterling'};
if(reg == 37) {name =  'Denver PMSA'};
if(reg == 38) {name =  'Denver-Boulder Metro Area'};
if(reg == 39) {name =  'Denver-Boulder-Greely CMSA'};
return name;
}; 
// Regionname

function countyName(cty){
//countyName  Returns a county name from the numeric fips code
	if(cty == 0) {name = "Colorado"};
	if(cty == 1){name = 'Adams County'};
	if(cty == 3){name = 'Alamosa County'};
	if(cty == 5){name = 'Arapahoe County'};
	if(cty == 7){name = 'Archuleta County'};
	if(cty == 9){name = 'Baca County'};
	if(cty == 11){name = 'Bent County'};
	if(cty == 13){name = 'Boulder County'};
	if(cty == 14){name = 'Broomfield County'};
	if(cty == 15){name = 'Chaffee County'};
	if(cty == 17){name = 'Cheyenne County'};
	if(cty == 19){name = 'Clear Creek County'};
	if(cty == 21){name = 'Conejos County'};
	if(cty == 23){name = 'Costilla County'};
	if(cty == 25){name = 'Crowley County'};
	if(cty == 27){name = 'Custer County'};
	if(cty == 29){name = 'Delta County'};
	if(cty == 31){name = 'Denver County'};
	if(cty == 33){name = 'Dolores County'};
	if(cty == 35){name = 'Douglas County'};
	if(cty == 37){name = 'Eagle County'};
	if(cty == 39){name = 'Elbert County'};
	if(cty == 41){name = 'El Paso County'};
	if(cty == 43){name = 'Fremont County'};
	if(cty == 45){name = 'Garfield County'};
	if(cty == 47){name = 'Gilpin County'};
	if(cty == 49){name = 'Grand County'};
	if(cty == 51){name = 'Gunnison County'};
	if(cty == 53){name = 'Hinsdale County'};
	if(cty == 55){name = 'Huerfano County'};
	if(cty == 57){name = 'Jackson County'};
	if(cty == 59){name = 'Jefferson County'};
	if(cty == 61){name = 'Kiowa County'};
	if(cty == 63){name = 'Kit Carson County'};
	if(cty == 65){name = 'Lake County'};
	if(cty == 67){name = 'La Plata County'};
	if(cty == 69){name = 'Larimer County'};
	if(cty == 71){name = 'Las Animas County'};
	if(cty == 73){name = 'Lincoln County'};
	if(cty == 75){name = 'Logan County'};
	if(cty == 77){name = 'Mesa County'};
	if(cty == 79){name = 'Mineral County'};
	if(cty == 81){name = 'Moffat County'};
	if(cty == 83){name = 'Montezuma County'};
	if(cty == 85){name = 'Montrose County'};
	if(cty == 87){name = 'Morgan County'};
	if(cty == 89){name = 'Otero County'};
	if(cty == 91){name = 'Ouray County'};
	if(cty == 93){name = 'Park County'};
	if(cty == 95){name = 'Phillips County'};
	if(cty == 97){name = 'Pitkin County'};
	if(cty == 99){name = 'Prowers County'};
	if(cty == 101){name = 'Pueblo County'};
	if(cty == 103){name = 'Rio Blanco County'};
	if(cty == 105){name = 'Rio Grande County'};
	if(cty == 107){name = 'Routt County'};
	if(cty == 109){name = 'Saguache County'};
	if(cty == 111){name = 'San Juan County'};
	if(cty == 113){name = 'San Miguel County'};
	if(cty == 115){name = 'Sedgwick County'};
	if(cty == 117){name = 'Summit County'};
	if(cty == 119){name = 'Teller County'};
	if(cty == 121){name = 'Washington County'};
	if(cty == 123){name = 'Weld County'};
	if(cty == 125){name = 'Yuma County'};
	if(cty == 500){name = 'Denver-Boulder Metro Area'}
return name;
}; 
// countyName


function muniName(muni){
//muniName Returns Municipality name from Numeric FIPS code
	var name;
	if(muni == 0) {name = 'Colorado'};
	if(muni == 760){name = 'Aguilar'};
	if(muni == 925){name = 'Akron'};
	if(muni == 1090){name = 'Alamosa'};
	if(muni == 1530){name = 'Alma'};
	if(muni == 2355){name = 'Antonito'};
	if(muni == 3235){name = 'Arriba'};
	if(muni == 3455){name = 'Arvada'};
	if(muni == 3620){name = 'Aspen'};
	if(muni == 3950){name = 'Ault'};
	if(muni == 4000){name = 'Aurora'};
	if(muni == 4110){name = 'Avon'};
	if(muni == 4935){name = 'Basalt'};
	if(muni == 5265){name = 'Bayfield'};
	if(muni == 6090){name = 'Bennett'};
	if(muni == 6255){name = 'Berthoud'};
	if(muni == 6530){name = 'Bethune'};
	if(muni == 7025){name = 'Black Hawk'};
	if(muni == 7190){name = 'Blanca'};
	if(muni == 7410){name = 'Blue River'};
	if(muni == 7571){name = 'Bonanza'};
	if(muni == 7795){name = 'Boone'};
	if(muni == 7850){name = 'Boulder'};
	if(muni == 8070){name = 'Bow Mar'};
	if(muni == 8345){name = 'Branson'};
	if(muni == 8400){name = 'Breckenridge'};
	if(muni == 8675){name = 'Brighton'};
	if(muni == 9115){name = 'Brookside'};
	if(muni == 9280){name = 'Broomfield'};
	if(muni == 9555){name = 'Brush'};
	if(muni == 10105){name = 'Buena Vista'};
	if(muni == 10600){name = 'Burlington'};
	if(muni == 11260){name = 'Calhan'};
	if(muni == 11645){name = 'Campo'};
	if(muni == 11810){name = 'Cañon City'};
	if(muni == 12030){name = 'Carbonate'};
	if(muni == 12045){name = 'Carbondale'};
	if(muni == 12387){name = 'Castle Pines'};
	if(muni == 12415){name = 'Castle Rock'};
	if(muni == 12635){name = 'Cedaredge'};
	if(muni == 12815){name = 'Centennial'};
	if(muni == 12855){name = 'Center'};
	if(muni == 12910){name = 'Central City'};
	if(muni == 13460){name = 'Cheraw'};
	if(muni == 13845){name = 'Cherry Hills Village'};
	if(muni == 14175){name = 'Cheyenne Wells'};
	if(muni == 14765){name = 'City of Creede'};
	if(muni == 15330){name = 'Coal Creek'};
	if(muni == 15550){name = 'Cokedale'};
	if(muni == 15605){name = 'Collbran'};
	if(muni == 16000){name = 'Colorado Springs'};
	if(muni == 16385){name = 'Columbine Valley'};
	if(muni == 16495){name = 'Commerce City'};
	if(muni == 17375){name = 'Cortez'};
	if(muni == 17760){name = 'Craig'};
	if(muni == 17925){name = 'Crawford'};
	if(muni == 18310){name = 'Crested Butte'};
	if(muni == 18420){name = 'Crestone'};
	if(muni == 18530){name = 'Cripple Creek'};
	if(muni == 18640){name = 'Crook'};
	if(muni == 18750){name = 'Crowley'};
	if(muni == 19080){name = 'Dacono'};
	if(muni == 19355){name = 'De Beque'};
	if(muni == 19630){name = 'Deer Trail'};
	if(muni == 19795){name = 'Del Norte'};
	if(muni == 19850){name = 'Delta'};
	if(muni == 20000){name = 'Denver'};
	if(muni == 20440){name = 'Dillon'};
	if(muni == 20495){name = 'Dinosaur'};
	if(muni == 20770){name = 'Dolores'};
	if(muni == 21265){name = 'Dove Creek'};
	if(muni == 22035){name = 'Durango'};
	if(muni == 22145){name = 'Eads'};
	if(muni == 22200){name = 'Eagle'};
	if(muni == 22860){name = 'Eaton'};
	if(muni == 23025){name = 'Eckley'};
	if(muni == 23135){name = 'Edgewater'};
	if(muni == 23740){name = 'Elizabeth'};
	if(muni == 24620){name = 'Empire'};
	if(muni == 24785){name = 'Englewood'};
	if(muni == 24950){name = 'Erie'};
	if(muni == 25115){name = 'Estes Park'};
	if(muni == 25280){name = 'Evans'};
	if(muni == 25610){name = 'Fairplay'};
	if(muni == 26270){name = 'Federal Heights'};
	if(muni == 26600){name = 'Firestone'};
	if(muni == 26765){name = 'Flagler'};
	if(muni == 26875){name = 'Fleming'};
	if(muni == 27040){name = 'Florence'};
	if(muni == 27425){name = 'Fort Collins'};
	if(muni == 27700){name = 'Fort Lupton'};
	if(muni == 27810){name = 'Fort Morgan'};
	if(muni == 27865){name = 'Fountain'};
	if(muni == 27975){name = 'Fowler'};
	if(muni == 28105){name = 'Foxfield'};
	if(muni == 28305){name = 'Fraser'};
	if(muni == 28360){name = 'Frederick'};
	if(muni == 28690){name = 'Frisco'};
	if(muni == 28745){name = 'Fruita'};
	if(muni == 29185){name = 'Garden City'};
	if(muni == 29680){name = 'Genoa'};
	if(muni == 29735){name = 'Georgetown'};
	if(muni == 29955){name = 'Gilcrest'};
	if(muni == 30340){name = 'Glendale'};
	if(muni == 30780){name = 'Glenwood Springs'};
	if(muni == 30835){name = 'Golden'};
	if(muni == 31550){name = 'Granada'};
	if(muni == 31605){name = 'Granby'};
	if(muni == 31660){name = 'Grand Junction'};
	if(muni == 31715){name = 'Grand Lake'};
	if(muni == 32155){name = 'Greeley'};
	if(muni == 32650){name = 'Green Mountain Falls'};
	if(muni == 33035){name = 'Greenwood Village'};
	if(muni == 33310){name = 'Grover'};
	if(muni == 33640){name = 'Gunnison'};
	if(muni == 33695){name = 'Gypsum'};
	if(muni == 34520){name = 'Hartman'};
	if(muni == 34740){name = 'Haswell'};
	if(muni == 34960){name = 'Haxtun'};
	if(muni == 35070){name = 'Hayden'};
	if(muni == 36610){name = 'Hillrose'};
	if(muni == 37215){name = 'Holly'};
	if(muni == 37270){name = 'Holyoke'};
	if(muni == 37380){name = 'Hooper'};
	if(muni == 37545){name = 'Hotchkiss'};
	if(muni == 37600){name = 'Hot Sulphur Springs'};
	if(muni == 37820){name = 'Hudson'};
	if(muni == 37875){name = 'Hugo'};
	if(muni == 38370){name = 'Idaho Springs'};
	if(muni == 38535){name = 'Ignacio'};
	if(muni == 38590){name = 'Iliff'};
	if(muni == 39195){name = 'Jamestown'};
	if(muni == 39855){name = 'Johnstown'};
	if(muni == 39965){name = 'Julesburg'};
	if(muni == 40185){name = 'Keenesburg'};
	if(muni == 40515){name = 'Kersey'};
	if(muni == 40570){name = 'Kim'};
	if(muni == 40790){name = 'Kiowa'};
	if(muni == 41010){name = 'Kit Carson'};
	if(muni == 41560){name = 'Kremmling'};
	if(muni == 41835){name = 'Lafayette'};
	if(muni == 42055){name = 'La Jara'};
	if(muni == 42110){name = 'La Junta'};
	if(muni == 42330){name = 'Lake City'};
	if(muni == 42495){name = 'Lakeside'};
	if(muni == 43000){name = 'Lakewood'};
	if(muni == 43110){name = 'Lamar'};
	if(muni == 43550){name = 'Larkspur'};
	if(muni == 43605){name = 'La Salle'};
	if(muni == 43660){name = 'Las Animas'};
	if(muni == 44100){name = 'La Veta'};
	if(muni == 44320){name = 'Leadville'};
	if(muni == 44980){name = 'Limon'};
	if(muni == 45255){name = 'Littleton'};
	if(muni == 45530){name = 'Lochbuie'};
	if(muni == 45695){name = 'Log Lane Village'};
	if(muni == 45955){name = 'Lone Tree'};
	if(muni == 45970){name = 'Longmont'};
	if(muni == 46355){name = 'Louisville'};
	if(muni == 46465){name = 'Loveland'};
	if(muni == 47070){name = 'Lyons'};
	if(muni == 48060){name = 'Manassa'};
	if(muni == 48115){name = 'Mancos'};
	if(muni == 48445){name = 'Manitou Springs'};
	if(muni == 48500){name = 'Manzanola'};
	if(muni == 48555){name = 'Marble'};
	if(muni == 49600){name = 'Mead'};
	if(muni == 49875){name = 'Meeker'};
	if(muni == 50040){name = 'Merino'};
	if(muni == 50480){name = 'Milliken'};
	if(muni == 50920){name = 'Minturn'};
	if(muni == 51250){name = 'Moffat'};
	if(muni == 51635){name = 'Monte Vista'};
	if(muni == 51690){name = 'Montezuma'};
	if(muni == 51745){name = 'Montrose'};
	if(muni == 51800){name = 'Monument'};
	if(muni == 52075){name = 'Morrison'};
	if(muni == 52350){name = 'Mountain View'};
	if(muni == 52550){name = 'Mountain Village'};
	if(muni == 52570){name = 'Mount Crested Butte'};
	if(muni == 53120){name = 'Naturita'};
	if(muni == 53175){name = 'Nederland'};
	if(muni == 53395){name = 'New Castle'};
	if(muni == 54330){name = 'Northglenn'};
	if(muni == 54880){name = 'Norwood'};
	if(muni == 54935){name = 'Nucla'};
	if(muni == 55045){name = 'Nunn'};
	if(muni == 55155){name = 'Oak Creek'};
	if(muni == 55540){name = 'Olathe'};
	if(muni == 55705){name = 'Olney Springs'};
	if(muni == 55870){name = 'Ophir'};
	if(muni == 55980){name = 'Orchard City'};
	if(muni == 56145){name = 'Ordway'};
	if(muni == 56365){name = 'Otis'};
	if(muni == 56420){name = 'Ouray'};
	if(muni == 56475){name = 'Ovid'};
	if(muni == 56860){name = 'Pagosa Springs'};
	if(muni == 56970){name = 'Palisade'};
	if(muni == 57025){name = 'Palmer Lake'};
	if(muni == 57245){name = 'Paoli'};
	if(muni == 57300){name = 'Paonia'};
	if(muni == 57400){name = 'Parachute'};
	if(muni == 57630){name = 'Parker'};
	if(muni == 58235){name = 'Peetz'};
	if(muni == 59005){name = 'Pierce'};
	if(muni == 59830){name = 'Pitkin'};
	if(muni == 60160){name = 'Platteville'};
	if(muni == 60600){name = 'Poncha Springs'};
	if(muni == 61315){name = 'Pritchett'};
	if(muni == 62000){name = 'Pueblo'};
	if(muni == 62660){name = 'Ramah'};
	if(muni == 62880){name = 'Rangely'};
	if(muni == 63045){name = 'Raymer (New Raymer)'};
	if(muni == 63265){name = 'Red Cliff'};
	if(muni == 64090){name = 'Rico'};
	if(muni == 64200){name = 'Ridgway'};
	if(muni == 64255){name = 'Rifle'};
	if(muni == 64970){name = 'Rockvale'};
	if(muni == 65190){name = 'Rocky Ford'};
	if(muni == 65740){name = 'Romeo'};
	if(muni == 66895){name = 'Rye'};
	if(muni == 67005){name = 'Saguache'};
	if(muni == 67280){name = 'Salida'};
	if(muni == 67830){name = 'Sanford'};
	if(muni == 68105){name = 'San Luis'};
	if(muni == 68655){name = 'Sawpit'};
	if(muni == 68930){name = 'Sedgwick'};
	if(muni == 69040){name = 'Seibert'};
	if(muni == 69150){name = 'Severance'};
	if(muni == 69645){name = 'Sheridan'};
	if(muni == 69700){name = 'Sheridan Lake'};
	if(muni == 70195){name = 'Silt'};
	if(muni == 70250){name = 'Silver Cliff'};
	if(muni == 70360){name = 'Silver Plume'};
	if(muni == 70525){name = 'Silverthorne'};
	if(muni == 70580){name = 'Silverton'};
	if(muni == 70635){name = 'Simla'};
	if(muni == 71755){name = 'Snowmass Village'};
	if(muni == 72395){name = 'South Fork'};
	if(muni == 73330){name = 'Springfield'};
	if(muni == 73715){name = 'Starkville'};
	if(muni == 73825){name = 'Steamboat Springs'};
	if(muni == 73935){name = 'Sterling'};
	if(muni == 74485){name = 'Stratton'};
	if(muni == 74815){name = 'Sugar City'};
	if(muni == 75640){name = 'Superior'};
	if(muni == 75970){name = 'Swink'};
	if(muni == 76795){name = 'Telluride'};
	if(muni == 77290){name = 'Thornton'};
	if(muni == 77510){name = 'Timnath'};
	if(muni == 78610){name = 'Trinidad'};
	if(muni == 79270){name = 'Two Buttes'};
	if(muni == 80040){name = 'Vail'};
	if(muni == 80865){name = 'Victor'};
	if(muni == 81030){name = 'Vilas'};
	if(muni == 81690){name = 'Vona'};
	if(muni == 82130){name = 'Walden'};
	if(muni == 82350){name = 'Walsenburg'};
	if(muni == 82460){name = 'Walsh'};
	if(muni == 82735){name = 'Ward'};
	if(muni == 83230){name = 'Wellington'};
	if(muni == 83450){name = 'Westcliffe'};
	if(muni == 83835){name = 'Westminster'};
	if(muni == 84440){name = 'Wheat Ridge'};
	if(muni == 84770){name = 'Wiggins'};
	if(muni == 85045){name = 'Wiley'};
	if(muni == 85155){name = 'Williamsburg'};
	if(muni == 85485){name = 'Windsor'};
	if(muni == 85705){name = 'Winter Park'};
	if(muni == 86090){name = 'Woodland Park'};
	if(muni == 86310){name = 'Wray'};
	if(muni == 86475){name = 'Yampa'};
	if(muni == 86750){name = 'Yuma'};
return name;
};  
// muniName


function ctyNum(name) {
//ctyNum returns numeric county fips code from county Name
	var num;
	if(name == 'Colorado'){num = 0};
	if(name == 'Adams County'){num = 1};
	if(name == 'Alamosa County'){num = 3};
	if(name == 'Arapahoe County'){num = 5};
	if(name == 'Archuleta County'){num = 7};
	if(name == 'Baca County'){num = 9};
	if(name == 'Bent County'){num = 11};
	if(name == 'Boulder County'){num = 13};
	if(name == 'Broomfield County'){num = 14};
	if(name == 'Chaffee County'){num = 15};
	if(name == 'Cheyenne County'){num = 17};
	if(name == 'Clear Creek County'){num = 19};
	if(name == 'Conejos County'){num = 21};
	if(name == 'Costilla County'){num = 23};
	if(name == 'Crowley County'){num = 25};
	if(name == 'Custer County'){num = 27};
	if(name == 'Delta County'){num = 29};
	if(name == 'Denver County'){num = 31};
	if(name == 'Dolores County'){num = 33};
	if(name == 'Douglas County'){num = 35};
	if(name == 'Eagle County'){num = 37};
	if(name == 'Elbert County'){num = 39};
	if(name == 'El Paso County'){num = 41};
	if(name == 'Fremont County'){num = 43};
	if(name == 'Garfield County'){num = 45};
	if(name == 'Gilpin County'){num = 47};
	if(name == 'Grand County'){num = 49};
	if(name == 'Gunnison County'){num = 51};
	if(name == 'Hinsdale County'){num = 53};
	if(name == 'Huerfano County'){num = 55};
	if(name == 'Jackson County'){num = 57};
	if(name == 'Jefferson County'){num = 59};
	if(name == 'Kiowa County'){num = 61};
	if(name == 'Kit Carson County'){num = 63};
	if(name == 'Lake County'){num = 65};
	if(name == 'La Plata County'){num = 67};
	if(name == 'Larimer County'){num = 69};
	if(name == 'Las Animas County'){num = 71};
	if(name == 'Lincoln County'){num = 73};
	if(name == 'Logan County'){num = 75};
	if(name == 'Mesa County'){num = 77};
	if(name == 'Mineral County'){num = 79};
	if(name == 'Moffat County'){num = 81};
	if(name == 'Montezuma County'){num = 83};
	if(name == 'Montrose County'){num = 85};
	if(name == 'Morgan County'){num = 87};
	if(name == 'Otero County'){num = 89};
	if(name == 'Ouray County'){num = 91};
	if(name == 'Park County'){num = 93};
	if(name == 'Phillips County'){num = 95};
	if(name == 'Pitkin County'){num = 97};
	if(name == 'Prowers County'){num = 99};
	if(name == 'Pueblo County'){num = 101};
	if(name == 'Rio Blanco County'){num = 103};
	if(name == 'Rio Grande County'){num = 105};
	if(name == 'Routt County'){num = 107};
	if(name == 'Saguache County'){num = 109};
	if(name == 'San Juan County'){num = 111};
	if(name == 'San Miguel County'){num = 113};
	if(name == 'Sedgwick County'){num = 115};
	if(name == 'Summit County'){num = 117};
	if(name == 'Teller County'){num = 119};
	if(name == 'Washington County'){num = 121};
	if(name == 'Weld County'){num = 123};
	if(name == 'Yuma County'){num = 125};
	return(num)
} 
// ctyNum



function muniNum(name) {
//muniNum returns numeric municipality fips code from municipality Name
    var name2 = name.replace(" (Total)","").replace(" (Part)","")
	var num;
	if(name2 == 'Colorado'){num = 0};
	if(name2 == 'Aguilar'){num = 760};
	if(name2 == 'Akron'){num = 925};
	if(name2 == 'Alamosa'){num = 1090};
	if(name2 == 'Alma'){num = 1530};
	if(name2 == 'Antonito'){num = 2355};
	if(name2 == 'Arriba'){num = 3235};
	if(name2 == 'Arvada'){num = 3455};
	if(name2 == 'Aspen'){num = 3620};
	if(name2 == 'Ault'){num = 3950};
	if(name2 == 'Aurora'){num = 4000};
	if(name2 == 'Avon'){num = 4110};
	if(name2 == 'Basalt'){num = 4935};
	if(name2 == 'Bayfield'){num = 5265};
	if(name2 == 'Bennett'){num = 6090};
	if(name2 == 'Berthoud'){num = 6255};
	if(name2 == 'Bethune'){num = 6530};
	if(name2 == 'Black Hawk'){num = 7025};
	if(name2 == 'Blanca'){num = 7190};
	if(name2 == 'Blue River'){num = 7410};
	if(name2 == 'Bonanza'){num = 7571};
	if(name2 == 'Boone'){num = 7795};
	if(name2 == 'Boulder'){num = 7850};
	if(name2 == 'Bow Mar'){num = 8070};
	if(name2 == 'Branson'){num = 8345};
	if(name2 == 'Breckenridge'){num = 8400};
	if(name2 == 'Brighton'){num = 8675};
	if(name2 == 'Brookside'){num = 9115};
	if(name2 == 'Broomfield'){num = 9280};
	if(name2 == 'Brush'){num = 9555};
	if(name2 == 'Buena Vista'){num = 10105};
	if(name2 == 'Burlington'){num = 10600};
	if(name2 == 'Calhan'){num = 11260};
	if(name2 == 'Campo'){num = 11645};
	if(name2 == 'Cañon City'){num = 11810};
	if(name2 == 'Carbonate'){num = 12030};
	if(name2 == 'Carbondale'){num = 12045};
	if(name2 == 'Castle Pines'){num = 12387};
	if(name2 == 'Castle Rock'){num = 12415};
	if(name2 == 'Cedaredge'){num = 12635};
	if(name2 == 'Centennial'){num = 12815};
	if(name2 == 'Center'){num = 12855};
	if(name2 == 'Central City'){num = 12910};
	if(name2 == 'Cheraw'){num = 13460};
	if(name2 == 'Cherry Hills Village'){num = 13845};
	if(name2 == 'Cheyenne Wells'){num = 14175};
	if(name2 == 'City of Creede'){num = 14765};
	if(name2 == 'Coal Creek'){num = 15330};
	if(name2 == 'Cokedale'){num = 15550};
	if(name2 == 'Collbran'){num = 15605};
	if(name2 == 'Colorado Springs'){num = 16000};
	if(name2 == 'Columbine Valley'){num = 16385};
	if(name2 == 'Commerce City'){num = 16495};
	if(name2 == 'Cortez'){num = 17375};
	if(name2 == 'Craig'){num = 17760};
	if(name2 == 'Crawford'){num = 17925};
	if(name2 == 'Crested Butte'){num = 18310};
	if(name2 == 'Crestone'){num = 18420};
	if(name2 == 'Cripple Creek'){num = 18530};
	if(name2 == 'Crook'){num = 18640};
	if(name2 == 'Crowley'){num = 18750};
	if(name2 == 'Dacono'){num = 19080};
	if(name2 == 'De Beque'){num = 19355};
	if(name2 == 'Deer Trail'){num = 19630};
	if(name2 == 'Del Norte'){num = 19795};
	if(name2 == 'Delta'){num = 19850};
	if(name2 == 'Denver'){num = 20000};
	if(name2 == 'Dillon'){num = 20440};
	if(name2 == 'Dinosaur'){num = 20495};
	if(name2 == 'Dolores'){num = 20770};
	if(name2 == 'Dove Creek'){num = 21265};
	if(name2 == 'Durango'){num = 22035};
	if(name2 == 'Eads'){num = 22145};
	if(name2 == 'Eagle'){num = 22200};
	if(name2 == 'Eaton'){num = 22860};
	if(name2 == 'Eckley'){num = 23025};
	if(name2 == 'Edgewater'){num = 23135};
	if(name2 == 'Elizabeth'){num = 23740};
	if(name2 == 'Empire'){num = 24620};
	if(name2 == 'Englewood'){num = 24785};
	if(name2 == 'Erie'){num = 24950};
	if(name2 == 'Estes Park'){num = 25115};
	if(name2 == 'Evans'){num = 25280};
	if(name2 == 'Fairplay'){num = 25610};
	if(name2 == 'Federal Heights'){num = 26270};
	if(name2 == 'Firestone'){num = 26600};
	if(name2 == 'Flagler'){num = 26765};
	if(name2 == 'Fleming'){num = 26875};
	if(name2 == 'Florence'){num = 27040};
	if(name2 == 'Fort Collins'){num = 27425};
	if(name2 == 'Fort Lupton'){num = 27700};
	if(name2 == 'Fort Morgan'){num = 27810};
	if(name2 == 'Fountain'){num = 27865};
	if(name2 == 'Fowler'){num = 27975};
	if(name2 == 'Foxfield'){num = 28105};
	if(name2 == 'Fraser'){num = 28305};
	if(name2 == 'Frederick'){num = 28360};
	if(name2 == 'Frisco'){num = 28690};
	if(name2 == 'Fruita'){num = 28745};
	if(name2 == 'Garden City'){num = 29185};
	if(name2 == 'Genoa'){num = 29680};
	if(name2 == 'Georgetown'){num = 29735};
	if(name2 == 'Gilcrest'){num = 29955};
	if(name2 == 'Glendale'){num = 30340};
	if(name2 == 'Glenwood Springs'){num = 30780};
	if(name2 == 'Golden'){num = 30835};
	if(name2 == 'Granada'){num = 31550};
	if(name2 == 'Granby'){num = 31605};
	if(name2 == 'Grand Junction'){num = 31660};
	if(name2 == 'Grand Lake'){num = 31715};
	if(name2 == 'Greeley'){num = 32155};
	if(name2 == 'Green Mountain Falls'){num = 32650};
	if(name2 == 'Greenwood Village'){num = 33035};
	if(name2 == 'Grover'){num = 33310};
	if(name2 == 'Gunnison'){num = 33640};
	if(name2 == 'Gypsum'){num = 33695};
	if(name2 == 'Hartman'){num = 34520};
	if(name2 == 'Haswell'){num = 34740};
	if(name2 == 'Haxtun'){num = 34960};
	if(name2 == 'Hayden'){num = 35070};
	if(name2 == 'Hillrose'){num = 36610};
	if(name2 == 'Holly'){num = 37215};
	if(name2 == 'Holyoke'){num = 37270};
	if(name2 == 'Hooper'){num = 37380};
	if(name2 == 'Hotchkiss'){num = 37545};
	if(name2 == 'Hot Sulphur Springs'){num = 37600};
	if(name2 == 'Hudson'){num = 37820};
	if(name2 == 'Hugo'){num = 37875};
	if(name2 == 'Idaho Springs'){num = 38370};
	if(name2 == 'Ignacio'){num = 38535};
	if(name2 == 'Iliff'){num = 38590};
	if(name2 == 'Jamestown'){num = 39195};
	if(name2 == 'Johnstown'){num = 39855};
	if(name2 == 'Julesburg'){num = 39965};
	if(name2 == 'Keenesburg'){num = 40185};
	if(name2 == 'Kersey'){num = 40515};
	if(name2 == 'Kim'){num = 40570};
	if(name2 == 'Kiowa'){num = 40790};
	if(name2 == 'Kit Carson'){num = 41010};
	if(name2 == 'Kremmling'){num = 41560};
	if(name2 == 'Lafayette'){num = 41835};
	if(name2 == 'La Jara'){num = 42055};
	if(name2 == 'La Junta'){num = 42110};
	if(name2 == 'Lake City'){num = 42330};
	if(name2 == 'Lakeside'){num = 42495};
	if(name2 == 'Lakewood'){num = 43000};
	if(name2 == 'Lamar'){num = 43110};
	if(name2 == 'Larkspur'){num = 43550};
	if(name2 == 'La Salle'){num = 43605};
	if(name2 == 'Las Animas'){num = 43660};
	if(name2 == 'La Veta'){num = 44100};
	if(name2 == 'Leadville'){num = 44320};
	if(name2 == 'Limon'){num = 44980};
	if(name2 == 'Littleton'){num = 45255};
	if(name2 == 'Lochbuie'){num = 45530};
	if(name2 == 'Log Lane Village'){num = 45695};
	if(name2 == 'Lone Tree'){num = 45955};
	if(name2 == 'Longmont'){num = 45970};
	if(name2 == 'Louisville'){num = 46355};
	if(name2 == 'Loveland'){num = 46465};
	if(name2 == 'Lyons'){num = 47070};
	if(name2 == 'Manassa'){num = 48060};
	if(name2 == 'Mancos'){num = 48115};
	if(name2 == 'Manitou Springs'){num = 48445};
	if(name2 == 'Manzanola'){num = 48500};
	if(name2 == 'Marble'){num = 48555};
	if(name2 == 'Mead'){num = 49600};
	if(name2 == 'Meeker'){num = 49875};
	if(name2 == 'Merino'){num = 50040};
	if(name2 == 'Milliken'){num = 50480};
	if(name2 == 'Minturn'){num = 50920};
	if(name2 == 'Moffat'){num = 51250};
	if(name2 == 'Monte Vista'){num = 51635};
	if(name2 == 'Montezuma'){num = 51690};
	if(name2 == 'Montrose'){num = 51745};
	if(name2 == 'Monument'){num = 51800};
	if(name2 == 'Morrison'){num = 52075};
	if(name2 == 'Mountain View'){num = 52350};
	if(name2 == 'Mountain Village'){num = 52550};
	if(name2 == 'Mount Crested Butte'){num = 52570};
	if(name2 == 'Naturita'){num = 53120};
	if(name2 == 'Nederland'){num = 53175};
	if(name2 == 'New Castle'){num = 53395};
	if(name2 == 'Northglenn'){num = 54330};
	if(name2 == 'Norwood'){num = 54880};
	if(name2 == 'Nucla'){num = 54935};
	if(name2 == 'Nunn'){num = 55045};
	if(name2 == 'Oak Creek'){num = 55155};
	if(name2 == 'Olathe'){num = 55540};
	if(name2 == 'Olney Springs'){num = 55705};
	if(name2 == 'Ophir'){num = 55870};
	if(name2 == 'Orchard City'){num = 55980};
	if(name2 == 'Ordway'){num = 56145};
	if(name2 == 'Otis'){num = 56365};
	if(name2 == 'Ouray'){num = 56420};
	if(name2 == 'Ovid'){num = 56475};
	if(name2 == 'Pagosa Springs'){num = 56860};
	if(name2 == 'Palisade'){num = 56970};
	if(name2 == 'Palmer Lake'){num = 57025};
	if(name2 == 'Paoli'){num = 57245};
	if(name2 == 'Paonia'){num = 57300};
	if(name2 == 'Parachute'){num = 57400};
	if(name2 == 'Parker'){num = 57630};
	if(name2 == 'Peetz'){num = 58235};
	if(name2 == 'Pierce'){num = 59005};
	if(name2 == 'Pitkin'){num = 59830};
	if(name2 == 'Platteville'){num = 60160};
	if(name2 == 'Poncha Springs'){num = 60600};
	if(name2 == 'Pritchett'){num = 61315};
	if(name2 == 'Pueblo'){num = 62000};
	if(name2 == 'Ramah'){num = 62660};
	if(name2 == 'Rangely'){num = 62880};
	if(name2 == 'Raymer (New Raymer'){num = 63045};
	if(name2 == 'Red Cliff'){num = 63265};
	if(name2 == 'Rico'){num = 64090};
	if(name2 == 'Ridgway'){num = 64200};
	if(name2 == 'Rifle'){num = 64255};
	if(name2 == 'Rockvale'){num = 64970};
	if(name2 == 'Rocky Ford'){num = 65190};
	if(name2 == 'Romeo'){num = 65740};
	if(name2 == 'Rye'){num = 66895};
	if(name2 == 'Saguache'){num = 67005};
	if(name2 == 'Salida'){num = 67280};
	if(name2 == 'Sanford'){num = 67830};
	if(name2 == 'San Luis'){num = 68105};
	if(name2 == 'Sawpit'){num = 68655};
	if(name2 == 'Sedgwick'){num = 68930};
	if(name2 == 'Seibert'){num = 69040};
	if(name2 == 'Severance'){num = 69150};
	if(name2 == 'Sheridan'){num = 69645};
	if(name2 == 'Sheridan Lake'){num = 69700};
	if(name2 == 'Silt'){num = 70195};
	if(name2 == 'Silver Cliff'){num = 70250};
	if(name2 == 'Silver Plume'){num = 70360};
	if(name2 == 'Silverthorne'){num = 70525};
	if(name2 == 'Silverton'){num = 70580};
	if(name2 == 'Simla'){num = 70635};
	if(name2 == 'Snowmass Village'){num = 71755};
	if(name2 == 'South Fork'){num = 72395};
	if(name2 == 'Springfield'){num = 73330};
	if(name2 == 'Starkville'){num = 73715};
	if(name2 == 'Steamboat Springs'){num = 73825};
	if(name2 == 'Sterling'){num = 73935};
	if(name2 == 'Stratton'){num = 74485};
	if(name2 == 'Sugar City'){num = 74815};
	if(name2 == 'Superior'){num = 75640};
	if(name2 == 'Swink'){num = 75970};
	if(name2 == 'Telluride'){num = 76795};
	if(name2 == 'Thornton'){num = 77290};
	if(name2 == 'Timnath'){num = 77510};
	if(name2 == 'Trinidad'){num = 78610};
	if(name2 == 'Two Buttes'){num = 79270};
	if(name2 == 'Vail'){num = 80040};
	if(name2 == 'Victor'){num = 80865};
	if(name2 == 'Vilas'){num = 81030};
	if(name2 == 'Vona'){num = 81690};
	if(name2 == 'Walden'){num = 82130};
	if(name2 == 'Walsenburg'){num = 82350};
	if(name2 == 'Walsh'){num = 82460};
	if(name2 == 'Ward'){num = 82735};
	if(name2 == 'Wellington'){num = 83230};
	if(name2 == 'Westcliffe'){num = 83450};
	if(name2 == 'Westminster'){num = 83835};
	if(name2 == 'Wheat Ridge'){num = 84440};
	if(name2 == 'Wiggins'){num = 84770};
	if(name2 == 'Wiley'){num = 85045};
	if(name2 == 'Williamsburg'){num = 85155};
	if(name2 == 'Windsor'){num = 85485};
	if(name2 == 'Winter Park'){num = 85705};
	if(name2 == 'Woodland Park'){num = 86090};
	if(name2 == 'Wray'){num = 86310};
	if(name2 == 'Yampa'){num = 86475};
	if(name2 == 'Yuma'){num = 86750};
	if(name2.includes("Unincorporated")){num=99990}
	return(num)
} 
// muniNum


function cdpName(cdp){
//cdpName returns CDP Name from the numeric cdp fips code
	var name;
	if(cdp == 0) {name = 'Colorado'};
	if(cdp == 320){name = 'Acres Green CDP'};
	if(cdp == 620){name = 'Aetna Estates CDP'};
	if(cdp == 870){name = 'Air Force Academy CDP'};
	if(cdp == 1145){name = 'Alamosa East CDP'};
	if(cdp == 1420){name = 'Allenspark CDP'};
	if(cdp == 1640){name = 'Alpine CDP'};
	if(cdp == 1740){name = 'Altona CDP'};
	if(cdp == 1915){name = 'Amherst CDP'};
	if(cdp == 2575){name = 'Applewood CDP'};
	if(cdp == 2905){name = 'Arboles CDP'};
	if(cdp == 3015){name = 'Aristocrat Ranchettes CDP'};
	if(cdp == 3730){name = 'Aspen Park CDP'};
	if(cdp == 3840){name = 'Atwood CDP'};
	if(cdp == 4165){name = 'Avondale CDP'};
	if(cdp == 4620){name = 'Bark Ranch CDP'};
	if(cdp == 5120){name = 'Battlement Mesa CDP'};
	if(cdp == 6172){name = 'Berkley CDP'};
	if(cdp == 6602){name = 'Beulah Valley CDP'};
	if(cdp == 6970){name = 'Black Forest CDP'};
	if(cdp == 7245){name = 'Blende CDP'};
	if(cdp == 7420){name = 'Blue Sky CDP'};
	if(cdp == 7580){name = 'Bonanza Mountain Estates CDP'};
	if(cdp == 8290){name = 'Brandon CDP'};
	if(cdp == 8530){name = 'Brick Center CDP'};
	if(cdp == 10985){name = 'Byers CDP'};
	if(cdp == 11975){name = 'Capulin CDP'};
	if(cdp == 12325){name = 'Cascade-Chipita Park CDP'};
	if(cdp == 12387){name = 'Castle Pines CDP'};
	if(cdp == 12450){name = 'Cathedral CDP'};
	if(cdp == 12460){name = 'Catherine CDP'};
	if(cdp == 12470){name = 'Cattle Creek CDP'};
	if(cdp == 12945){name = 'Chacra CDP'};
	if(cdp == 13590){name = 'Cherry Creek CDP'};
	if(cdp == 14587){name = 'Cimarron Hills CDP'};
	if(cdp == 15165){name = 'Clifton CDP'};
	if(cdp == 15302){name = 'Coal Creek CDP'};
	if(cdp == 15440){name = 'Coaldale CDP'};
	if(cdp == 15825){name = 'Colona CDP'};
	if(cdp == 15935){name = 'Colorado City CDP'};
	if(cdp == 16110){name = 'Columbine CDP'};
	if(cdp == 16465){name = 'Comanche Creek CDP'};
	if(cdp == 16715){name = 'Conejos CDP'};
	if(cdp == 17150){name = 'Copper Mountain CDP'};
	if(cdp == 17485){name = 'Cotopaxi CDP'};
	if(cdp == 18585){name = 'Crisman CDP'};
	if(cdp == 19150){name = 'Dakota Ridge CDP'};
	if(cdp == 20275){name = 'Derby CDP'};
	if(cdp == 20605){name = 'Divide CDP'};
	if(cdp == 21155){name = 'Dotsero CDP'};
	if(cdp == 21330){name = 'Dove Valley CDP'};
	if(cdp == 21390){name = 'Downieville-Lawson-Dumont CDP'};
	if(cdp == 22575){name = 'East Pleasant View CDP'};
	if(cdp == 23300){name = 'Edwards CDP'};
	if(cdp == 23520){name = 'Elbert CDP'};
	if(cdp == 23575){name = 'Eldora CDP'};
	if(cdp == 23630){name = 'Eldorado Springs CDP'};
	if(cdp == 23795){name = 'El Jebel CDP'};
	if(cdp == 24235){name = 'Ellicott CDP'};
	if(cdp == 24290){name = 'El Moro CDP'};
	if(cdp == 25390){name = 'Evergreen CDP'};
	if(cdp == 25550){name = 'Fairmount CDP'};
	if(cdp == 27095){name = 'Florissant CDP'};
	if(cdp == 27175){name = 'Floyd Hill CDP'};
	if(cdp == 27370){name = 'Fort Carson CDP'};
	if(cdp == 27535){name = 'Fort Garland CDP'};
	if(cdp == 28250){name = 'Franktown CDP'};
	if(cdp == 28800){name = 'Fruitvale CDP'};
	if(cdp == 28830){name = 'Fulford CDP'};
	if(cdp == 29295){name = 'Garfield CDP'};
	if(cdp == 29625){name = 'Genesee CDP'};
	if(cdp == 29845){name = 'Gerrard CDP'};
	if(cdp == 30350){name = 'Glendale CDP'};
	if(cdp == 30420){name = 'Gleneagle CDP'};
	if(cdp == 30890){name = 'Goldfield CDP'};
	if(cdp == 30945){name = 'Gold Hill CDP'};
	if(cdp == 31935){name = 'Grand View Estates CDP'};
	if(cdp == 33420){name = 'Guffey CDP'};
	if(cdp == 33502){name = 'Gunbarrel CDP'};
	if(cdp == 34685){name = 'Hasty CDP'};
	if(cdp == 35400){name = 'Heeney CDP'};
	if(cdp == 35860){name = 'Hidden Lake CDP'};
	if(cdp == 36410){name = 'Highlands Ranch CDP'};
	if(cdp == 36940){name = 'Hoehne CDP'};
	if(cdp == 37220){name = 'Holly Hills CDP'};
	if(cdp == 37655){name = 'Howard CDP'};
	if(cdp == 38425){name = 'Idalia CDP'};
	if(cdp == 38480){name = 'Idledale CDP'};
	if(cdp == 38810){name = 'Indian Hills CDP'};
	if(cdp == 38910){name = 'Inverness CDP'};
	if(cdp == 39160){name = 'Jackson Lake CDP'};
	if(cdp == 39250){name = 'Jansen CDP'};
	if(cdp == 39745){name = 'Joes CDP'};
	if(cdp == 39800){name = 'Johnson Village CDP'};
	if(cdp == 40377){name = 'Ken Caryl CDP'};
	if(cdp == 40550){name = 'Keystone CDP'};
	if(cdp == 40900){name = 'Kirk CDP'};
	if(cdp == 41065){name = 'Kittredge CDP'};
	if(cdp == 42000){name = 'Laird CDP'};
	if(cdp == 42165){name = 'La Junta Gardens CDP'};
	if(cdp == 43220){name = 'Laporte CDP'};
	if(cdp == 44270){name = 'Lazy Acres CDP'};
	if(cdp == 44375){name = 'Leadville North CDP'};
	if(cdp == 44595){name = 'Lewis CDP'};
	if(cdp == 44695){name = 'Leyner CDP'};
	if(cdp == 45145){name = 'Lincoln Park CDP'};
	if(cdp == 45680){name = 'Loghill Village CDP'};
	if(cdp == 45750){name = 'Loma CDP'};
	if(cdp == 46410){name = 'Louviers CDP'};
	if(cdp == 47015){name = 'Lynn CDP'};
	if(cdp == 47345){name = 'McCoy CDP'};
	if(cdp == 49325){name = 'Maybell CDP'};
	if(cdp == 49490){name = 'Maysville CDP'};
	if(cdp == 50012){name = 'Meridian CDP'};
	if(cdp == 50380){name = 'Midland CDP'};
	if(cdp == 51975){name = 'Morgan Heights CDP'};
	if(cdp == 52210){name = 'Mountain Meadows CDP'};
	if(cdp == 52820){name = 'Mulford CDP'};
	if(cdp == 53780){name = 'Niwot CDP'};
	if(cdp == 53875){name = 'No Name CDP'};
	if(cdp == 53945){name = 'Norrie CDP'};
	if(cdp == 54495){name = 'North La Junta CDP'};
	if(cdp == 54750){name = 'North Washington CDP'};
	if(cdp == 55925){name = 'Orchard CDP'};
	if(cdp == 56035){name = 'Orchard Mesa CDP'};
	if(cdp == 56695){name = 'Padroni CDP'};
	if(cdp == 57445){name = 'Paragon Estates CDP'};
	if(cdp == 57850){name = 'Parshall CDP'};
	if(cdp == 58400){name = 'Penrose CDP'};
	if(cdp == 58510){name = 'Peoria CDP'};
	if(cdp == 58592){name = 'Perry Park CDP'};
	if(cdp == 58675){name = 'Peyton CDP'};
	if(cdp == 58758){name = 'Phippsburg CDP'};
	if(cdp == 58960){name = 'Piedra CDP'};
	if(cdp == 59240){name = 'Pine Brook Hill CDP'};
	if(cdp == 60655){name = 'Ponderosa Park CDP'};
	if(cdp == 60765){name = 'Portland CDP'};
	if(cdp == 62220){name = 'Pueblo West CDP'};
	if(cdp == 63320){name = 'Red Feather Lakes CDP'};
	if(cdp == 63375){name = 'Redlands CDP'};
	if(cdp == 63650){name = 'Redstone CDP'};
	if(cdp == 63705){name = 'Redvale CDP'};
	if(cdp == 64870){name = 'Rock Creek Park CDP'};
	if(cdp == 65685){name = 'Rollinsville CDP'};
	if(cdp == 66197){name = 'Roxborough Park CDP'};
	if(cdp == 66995){name = 'Saddle Ridge CDP'};
	if(cdp == 67040){name = 'St. Ann Highlands CDP'};
	if(cdp == 67142){name = "St. Mary's CDP"};
	if(cdp == 67445){name = 'Salt Creek CDP'};
	if(cdp == 67500){name = 'San Acacio CDP'};
	if(cdp == 68847){name = 'Security-Widefield CDP'};
	if(cdp == 68875){name = 'Sedalia CDP'};
	if(cdp == 68985){name = 'Segundo CDP'};
	if(cdp == 69110){name = 'Seven Hills CDP'};
	if(cdp == 69480){name = 'Shaw Heights CDP'};
	if(cdp == 69810){name = 'Sherrelwood CDP'};
	if(cdp == 71625){name = 'Smeltertown CDP'};
	if(cdp == 71790){name = 'Snyder CDP'};
	if(cdp == 72320){name = 'Southern Ute CDP'};
	if(cdp == 74080){name = 'Stonegate CDP'};
	if(cdp == 74275){name = 'Stonewall Gap CDP'};
	if(cdp == 74375){name = 'Strasburg CDP'};
	if(cdp == 74430){name = 'Stratmoor CDP'};
	if(cdp == 74980){name = 'Sugarloaf CDP'};
	if(cdp == 75585){name = 'Sunshine CDP'};
	if(cdp == 76190){name = 'Tabernash CDP'};
	if(cdp == 76325){name = 'Tall Timber CDP'};
	if(cdp == 77235){name = 'The Pinery CDP'};
	if(cdp == 77757){name = 'Todd Creek CDP'};
	if(cdp == 78280){name = 'Towaoc CDP'};
	if(cdp == 78335){name = 'Towner CDP'};
	if(cdp == 78345){name = 'Trail Side CDP'};
	if(cdp == 79100){name = 'Twin Lakes CDP'};
	if(cdp == 79105){name = 'Twin Lakes CDP'};
	if(cdp == 79785){name = 'Upper Bear Creek CDP'};
	if(cdp == 80095){name = 'Valdez CDP'};
	if(cdp == 80370){name = 'Valmont CDP'};
	if(cdp == 80755){name = 'Vernon CDP'};
	if(cdp == 81305){name = 'Vineland CDP'};
	if(cdp == 82905){name = 'Watkins CDP'};
	if(cdp == 83120){name = 'Welby CDP'};
	if(cdp == 83175){name = 'Weldona CDP'};
	if(cdp == 83500){name = 'Westcreek CDP'};
	if(cdp == 84000){name = 'Weston CDP'};
	if(cdp == 84042){name = 'West Pleasant View CDP'};
	if(cdp == 85760){name = 'Wolcott CDP'};
	if(cdp == 86117){name = 'Woodmoor CDP'};
	if(cdp == 86200){name = 'Woody Creek CDP'};
return name;
}; 
// cdpName


function popDropdown(level,ddid,callpg) {
//popDropdown populates drop down boxes based on input geography Type
   
var county = [  {'location':'Adams County', 'fips': '001'},
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
				{'location':'Yuma County', 'fips': '125'}];

//Municipalities and places

var municipality = [{'location' :  'Aguilar' , 'fips' : '00760'}, {'location' :  'Akron' , 'fips' : '00925'},
		{'location' :  'Alamosa' , 'fips' : '01090'}, {'location' :  'Alma' , 'fips' : '01530'},
		{'location' :  'Antonito' , 'fips' : '02355'}, {'location' :  'Arriba' , 'fips' : '03235'},
		{'location' :  'Arvada' , 'fips' : '03455'}, {'location' :  'Aspen' , 'fips' : '03620'},
		{'location' :  'Ault' , 'fips' : '03950'}, {'location' :  'Aurora' , 'fips' : '04000'},
		{'location' :  'Avon' , 'fips' : '04110'}, {'location' :  'Basalt' , 'fips' : '04935'},
		{'location' :  'Bayfield' , 'fips' : '05265'}, {'location' :  'Bennett' , 'fips' : '06090'},
		{'location' :  'Berthoud' , 'fips' : '06255'}, {'location' :  'Bethune' , 'fips' : '06530'},
		{'location' :  'Black Hawk' , 'fips' : '07025'}, {'location' :  'Blanca' , 'fips' : '07190'},
		{'location' :  'Blue River' , 'fips' : '07410'}, {'location' :  'Bonanza' , 'fips' : '07571'},
		{'location' :  'Boone' , 'fips' : '07795'}, {'location' :  'Boulder' , 'fips' : '07850'},
		{'location' :  'Bow Mar' , 'fips' : '08070'}, {'location' :  'Branson' , 'fips' : '08345'},
		{'location' :  'Breckenridge' , 'fips' : '08400'}, {'location' :  'Brighton' , 'fips' : '08675'},
		{'location' :  'Brookside' , 'fips' : '09115'}, {'location' :  'Broomfield' , 'fips' : '09280'},
		{'location' :  'Brush' , 'fips' : '09555'}, {'location' :  'Buena Vista' , 'fips' : '10105'},
		{'location' :  'Burlington' , 'fips' : '10600'}, {'location' :  'Calhan' , 'fips' : '11260'},
		{'location' :  'Campo' , 'fips' : '11645'}, {'location' :  'Ca\u00f1on City' , 'fips' : '11810'},
		{'location' :  'Carbonate' , 'fips' : '12030'},{'location' :  'Carbondale' , 'fips' : '12045'}, {'location' :  'Castle Pines' , 'fips' : '12387'},
		{'location' :  'Castle Rock' , 'fips' : '12415'}, {'location' :  'Cedaredge' , 'fips' : '12635'},
		{'location' :  'Centennial' , 'fips' : '12815'}, {'location' :  'Center' , 'fips' : '12855'},
		{'location' :  'Central City' , 'fips' : '12910'}, {'location' :  'Cheraw' , 'fips' : '13460'},
		{'location' :  'Cherry Hills Village' , 'fips' : '13845'}, {'location' :  'Cheyenne Wells' , 'fips' : '14175'},
		{'location' :  'City of Creede' , 'fips' : '14765'}, {'location' :  'Coal Creek' , 'fips' : '15330'},
		{'location' :  'Cokedale' , 'fips' : '15550'}, {'location' :  'Collbran' , 'fips' : '15605'},
		{'location' :  'Colorado Springs' , 'fips' : '16000'}, {'location' :  'Columbine Valley' , 'fips' : '16385'},
		{'location' :  'Commerce City' , 'fips' : '16495'}, {'location' :  'Cortez' , 'fips' : '17375'},
		{'location' :  'Craig' , 'fips' : '17760'}, {'location' :  'Crawford' , 'fips' : '17925'},
		{'location' :  'Crested Butte' , 'fips' : '18310'}, {'location' :  'Crestone' , 'fips' : '18420'},
		{'location' :  'Cripple Creek' , 'fips' : '18530'}, {'location' :  'Crook' , 'fips' : '18640'},
		{'location' :  'Crowley' , 'fips' : '18750'}, {'location' :  'Dacono' , 'fips' : '19080'},
		{'location' :  'De Beque' , 'fips' : '19355'}, {'location' :  'Deer Trail' , 'fips' : '19630'},
		{'location' :  'Del Norte' , 'fips' : '19795'}, {'location' :  'Delta' , 'fips' : '19850'},
		{'location' :  'Denver' , 'fips' : '20000'}, {'location' :  'Dillon' , 'fips' : '20440'},
		{'location' :  'Dinosaur' , 'fips' : '20495'}, {'location' :  'Dolores' , 'fips' : '20770'},
		{'location' :  'Dove Creek' , 'fips' : '21265'}, {'location' :  'Durango' , 'fips' : '22035'},
		{'location' :  'Eads' , 'fips' : '22145'}, {'location' :  'Eagle' , 'fips' : '22200'},
		{'location' :  'Eaton' , 'fips' : '22860'}, {'location' :  'Eckley' , 'fips' : '23025'},
		{'location' :  'Edgewater' , 'fips' : '23135'}, {'location' :  'Elizabeth' , 'fips' : '23740'},
		{'location' :  'Empire' , 'fips' : '24620'}, {'location' :  'Englewood' , 'fips' : '24785'},
		{'location' :  'Erie' , 'fips' : '24950'}, {'location' :  'Estes Park' , 'fips' : '25115'},
		{'location' :  'Evans' , 'fips' : '25280'}, {'location' :  'Fairplay' , 'fips' : '25610'},
		{'location' :  'Federal Heights' , 'fips' : '26270'}, {'location' :  'Firestone' , 'fips' : '26600'},
		{'location' :  'Flagler' , 'fips' : '26765'}, {'location' :  'Fleming' , 'fips' : '26875'},
		{'location' :  'Florence' , 'fips' : '27040'}, {'location' :  'Fort Collins' , 'fips' : '27425'},
		{'location' :  'Fort Lupton' , 'fips' : '27700'}, {'location' :  'Fort Morgan' , 'fips' : '27810'},
		{'location' :  'Fountain' , 'fips' : '27865'}, {'location' :  'Fowler' , 'fips' : '27975'},
		{'location' :  'Foxfield' , 'fips' : '28105'}, {'location' :  'Fraser' , 'fips' : '28305'},
		{'location' :  'Frederick' , 'fips' : '28360'}, {'location' :  'Frisco' , 'fips' : '28690'},
		{'location' :  'Fruita' , 'fips' : '28745'}, {'location' :  'Garden City' , 'fips' : '29185'},
		{'location' :  'Genoa' , 'fips' : '29680'}, {'location' :  'Georgetown' , 'fips' : '29735'},
		{'location' :  'Gilcrest' , 'fips' : '29955'}, {'location' :  'Glendale' , 'fips' : '30340'},
		{'location' :  'Glenwood Springs' , 'fips' : '30780'}, {'location' :  'Golden' , 'fips' : '30835'},
		{'location' :  'Granada' , 'fips' : '31550'}, {'location' :  'Granby' , 'fips' : '31605'},
		{'location' :  'Grand Junction' , 'fips' : '31660'}, {'location' :  'Grand Lake' , 'fips' : '31715'},
		{'location' :  'Greeley' , 'fips' : '32155'}, {'location' :  'Green Mountain Falls' , 'fips' : '32650'},
		{'location' :  'Greenwood Village' , 'fips' : '33035'}, {'location' :  'Grover' , 'fips' : '33310'},
		{'location' :  'Gunnison' , 'fips' : '33640'}, {'location' :  'Gypsum' , 'fips' : '33695'},
		{'location' :  'Hartman' , 'fips' : '34520'}, {'location' :  'Haswell' , 'fips' : '34740'},
		{'location' :  'Haxtun' , 'fips' : '34960'}, {'location' :  'Hayden' , 'fips' : '35070'},
		{'location' :  'Hillrose' , 'fips' : '36610'}, {'location' :  'Holly' , 'fips' : '37215'},
		{'location' :  'Holyoke' , 'fips' : '37270'}, {'location' :  'Hooper' , 'fips' : '37380'},
		{'location' :  'Hot Sulphur Springs' , 'fips' : '37600'}, {'location' :  'Hotchkiss' , 'fips' : '37545'},
		{'location' :  'Hudson' , 'fips' : '37820'}, {'location' :  'Hugo' , 'fips' : '37875'},
		{'location' :  'Idaho Springs' , 'fips' : '38370'}, {'location' :  'Ignacio' , 'fips' : '38535'},
		{'location' :  'Iliff' , 'fips' : '38590'}, {'location' :  'Jamestown' , 'fips' : '39195'},
		{'location' :  'Johnstown' , 'fips' : '39855'}, {'location' :  'Julesburg' , 'fips' : '39965'},
		{'location' :  'Keenesburg' , 'fips' : '40185'}, {'location' :  'Kersey' , 'fips' : '40515'}, {'location' :  'Keystone' , 'fips' : '40550'}, 
		{'location' :  'Kim' , 'fips' : '40570'}, {'location' :  'Kiowa' , 'fips' : '40790'},
		{'location' :  'Kit Carson' , 'fips' : '41010'}, {'location' :  'Kremmling' , 'fips' : '41560'},
		{'location' :  'La Jara' , 'fips' : '42055'}, {'location' :  'La Junta' , 'fips' : '42110'},
		{'location' :  'La Salle' , 'fips' : '43605'}, {'location' :  'La Veta' , 'fips' : '44100'},
		{'location' :  'Lafayette' , 'fips' : '41835'}, {'location' :  'Lake City' , 'fips' : '42330'},
		{'location' :  'Lakeside' , 'fips' : '42495'}, {'location' :  'Lakewood' , 'fips' : '43000'},
		{'location' :  'Lamar' , 'fips' : '43110'}, {'location' :  'Larkspur' , 'fips' : '43550'},
		{'location' :  'Las Animas' , 'fips' : '43660'}, {'location' :  'Leadville' , 'fips' : '44320'},
		{'location' :  'Limon' , 'fips' : '44980'}, {'location' :  'Littleton' , 'fips' : '45255'},
		{'location' :  'Lochbuie' , 'fips' : '45530'}, {'location' :  'Log Lane Village' , 'fips' : '45695'},
		{'location' :  'Lone Tree' , 'fips' : '45955'}, {'location' :  'Longmont' , 'fips' : '45970'},
		{'location' :  'Louisville' , 'fips' : '46355'}, {'location' :  'Loveland' , 'fips' : '46465'},
		{'location' :  'Lyons' , 'fips' : '47070'}, {'location' :  'Manassa' , 'fips' : '48060'},
		{'location' :  'Mancos' , 'fips' : '48115'}, {'location' :  'Manitou Springs' , 'fips' : '48445'},
		{'location' :  'Manzanola' , 'fips' : '48500'}, {'location' :  'Marble' , 'fips' : '48555'},
		{'location' :  'Mead' , 'fips' : '49600'}, {'location' :  'Meeker' , 'fips' : '49875'},
		{'location' :  'Merino' , 'fips' : '50040'}, {'location' :  'Milliken' , 'fips' : '50480'},
		{'location' :  'Minturn' , 'fips' : '50920'}, {'location' :  'Moffat' , 'fips' : '51250'},
		{'location' :  'Monte Vista' , 'fips' : '51635'}, {'location' :  'Montezuma' , 'fips' : '51690'},
		{'location' :  'Montrose' , 'fips' : '51745'}, {'location' :  'Monument' , 'fips' : '51800'},
		{'location' :  'Morrison' , 'fips' : '52075'}, {'location' :  'Mount Crested Butte' , 'fips' : '52570'},
		{'location' :  'Mountain View' , 'fips' : '52350'}, {'location' :  'Mountain Village' , 'fips' : '52550'},
		{'location' :  'Naturita' , 'fips' : '53120'}, {'location' :  'Nederland' , 'fips' : '53175'},
		{'location' :  'New Castle' , 'fips' : '53395'}, {'location' :  'Northglenn' , 'fips' : '54330'},
		{'location' :  'Norwood' , 'fips' : '54880'}, {'location' :  'Nucla' , 'fips' : '54935'},
		{'location' :  'Nunn' , 'fips' : '55045'}, {'location' :  'Oak Creek' , 'fips' : '55155'},
		{'location' :  'Olathe' , 'fips' : '55540'}, {'location' :  'Olney Springs' , 'fips' : '55705'},
		{'location' :  'Ophir' , 'fips' : '55870'}, {'location' :  'Orchard City' , 'fips' : '55980'},
		{'location' :  'Ordway' , 'fips' : '56145'}, {'location' :  'Otis' , 'fips' : '56365'},
		{'location' :  'Ouray' , 'fips' : '56420'}, {'location' :  'Ovid' , 'fips' : '56475'},
		{'location' :  'Pagosa Springs' , 'fips' : '56860'}, {'location' :  'Palisade' , 'fips' : '56970'},
		{'location' :  'Palmer Lake' , 'fips' : '57025'}, {'location' :  'Paoli' , 'fips' : '57245'},
		{'location' :  'Paonia' , 'fips' : '57300'}, {'location' :  'Parachute' , 'fips' : '57400'},
		{'location' :  'Parker' , 'fips' : '57630'}, {'location' :  'Peetz' , 'fips' : '58235'},
		{'location' :  'Pierce' , 'fips' : '59005'}, {'location' :  'Pitkin' , 'fips' : '59830'},
		{'location' :  'Platteville' , 'fips' : '60160'}, {'location' :  'Poncha Springs' , 'fips' : '60600'},
		{'location' :  'Pritchett' , 'fips' : '61315'}, {'location' :  'Pueblo' , 'fips' : '62000'},
		{'location' :  'Ramah' , 'fips' : '62660'}, {'location' :  'Rangely' , 'fips' : '62880'},
		{'location' :  'Raymer (New Raymer)' , 'fips' : '63045'}, {'location' :  'Red Cliff' , 'fips' : '63265'},
		{'location' :  'Rico' , 'fips' : '64090'}, {'location' :  'Ridgway' , 'fips' : '64200'},
		{'location' :  'Rifle' , 'fips' : '64255'}, {'location' :  'Rockvale' , 'fips' : '64970'},
		{'location' :  'Rocky Ford' , 'fips' : '65190'}, {'location' :  'Romeo' , 'fips' : '65740'},
		{'location' :  'Rye' , 'fips' : '66895'}, {'location' :  'Saguache' , 'fips' : '67005'},
		{'location' :  'Salida' , 'fips' : '67280'}, {'location' :  'San Luis' , 'fips' : '68105'},
		{'location' :  'Sanford' , 'fips' : '67830'}, {'location' :  'Sawpit' , 'fips' : '68655'},
		{'location' :  'Sedgwick' , 'fips' : '68930'}, {'location' :  'Seibert' , 'fips' : '69040'},
		{'location' :  'Severance' , 'fips' : '69150'}, {'location' :  'Sheridan' , 'fips' : '69645'},
		{'location' :  'Sheridan Lake' , 'fips' : '69700'}, {'location' :  'Silt' , 'fips' : '70195'},
		{'location' :  'Silver Cliff' , 'fips' : '70250'}, {'location' :  'Silver Plume' , 'fips' : '70360'},
		{'location' :  'Silverthorne' , 'fips' : '70525'}, {'location' :  'Silverton' , 'fips' : '70580'},
		{'location' :  'Simla' , 'fips' : '70635'}, {'location' :  'Snowmass Village' , 'fips' : '71755'},
		{'location' :  'South Fork' , 'fips' : '72395'}, {'location' :  'Springfield' , 'fips' : '73330'},
		{'location' :  'Starkville' , 'fips' : '73715'}, {'location' :  'Steamboat Springs' , 'fips' : '73825'},
		{'location' :  'Sterling' , 'fips' : '73935'}, {'location' :  'Stratton' , 'fips' : '74485'},
		{'location' :  'Sugar City' , 'fips' : '74815'}, {'location' :  'Superior' , 'fips' : '75640'},
		{'location' :  'Swink' , 'fips' : '75970'}, {'location' :  'Telluride' , 'fips' : '76795'},
		{'location' :  'Thornton' , 'fips' : '77290'}, {'location' :  'Timnath' , 'fips' : '77510'},
		{'location' :  'Trinidad' , 'fips' : '78610'}, {'location' :  'Two Buttes' , 'fips' : '79270'},
		{'location' :  'Vail' , 'fips' : '80040'}, {'location' :  'Victor' , 'fips' : '80865'},
		{'location' :  'Vilas' , 'fips' : '81030'}, {'location' :  'Vona' , 'fips' : '81690'},
		{'location' :  'Walden' , 'fips' : '82130'}, {'location' :  'Walsenburg' , 'fips' : '82350'},
		{'location' :  'Walsh' , 'fips' : '82460'}, {'location' :  'Ward' , 'fips' : '82735'},
		{'location' :  'Wellington' , 'fips' : '83230'}, {'location' :  'Westcliffe' , 'fips' : '83450'},
		{'location' :  'Westminster' , 'fips' : '83835'}, {'location' :  'Wheat Ridge' , 'fips' : '84440'},
		{'location' :  'Wiggins' , 'fips' : '84770'}, {'location' :  'Wiley' , 'fips' : '85045'},
		{'location' :  'Williamsburg' , 'fips' : '85155'}, {'location' :  'Windsor' , 'fips' : '85485'},
		{'location' :  'Winter Park' , 'fips' : '85705'}, {'location' :  'Woodland Park' , 'fips' : '86090'},
		{'location' :  'Wray' , 'fips' : '86310'}, {'location' :  'Yampa' , 'fips' : '86475'},
		{'location' : 'Yuma', 'fips' : '86750'}]

//places
var place =[{'location' :  'Acres Green CDP' , 'fips' : '00320'}, {'location' :  'Aetna Estates CDP' , 'fips' : '00620'},
		{'location' :  'Air Force Academy CDP' , 'fips' : '00870'}, {'location' :  'Alamosa East CDP' , 'fips' : '01145'},
		{'location' :  'Allenspark CDP' , 'fips' : '01420'}, {'location' :  'Alpine CDP' , 'fips' : '01640'},
		{'location' :  'Altona CDP' , 'fips' : '01740'}, {'location' :  'Amherst CDP' , 'fips' : '01915'},
		{'location' :  'Applewood CDP' , 'fips' : '02575'}, {'location' :  'Arboles CDP' , 'fips' : '02905'},
		{'location' :  'Aristocrat Ranchettes CDP' , 'fips' : '03015'}, {'location' :  'Aspen Park CDP' , 'fips' : '03730'},
		{'location' :  'Atwood CDP' , 'fips' : '03840'}, {'location' :  'Avondale CDP' , 'fips' : '04165'},
		{'location' :  'Bark Ranch CDP' , 'fips' : '04620'}, {'location' :  'Battlement Mesa CDP' , 'fips' : '05120'},
		{'location' :  'Berkley CDP' , 'fips' : '06172'}, {'location' :  'Beulah Valley CDP' , 'fips' : '06602'},
		{'location' :  'Black Forest CDP' , 'fips' : '06970'}, {'location' :  'Blende CDP' , 'fips' : '07245'},
		{'location' :  'Blue Sky CDP' , 'fips' : '07420'}, {'location' :  'Bonanza Mountain Estates CDP' , 'fips' : '07580'},
		{'location' :  'Brandon CDP' , 'fips' : '08290'}, {'location' :  'Brick Center CDP' , 'fips' : '08530'},
		{'location' :  'Byers CDP' , 'fips' : '10985'}, {'location' :  'Capulin CDP' , 'fips' : '11975'},
		{'location' :  'Cascade-Chipita Park CDP' , 'fips' : '12325'}, {'location' :  'Castle Pines CDP' , 'fips' : '12387'},
		{'location' :  'Cathedral CDP' , 'fips' : '12450'}, {'location' :  'Catherine CDP' , 'fips' : '12460'},
		{'location' :  'Cattle Creek CDP' , 'fips' : '12470'}, {'location' :  'Chacra CDP' , 'fips' : '12945'},
		{'location' :  'Cherry Creek CDP' , 'fips' : '13590'}, {'location' :  'Cimarron Hills CDP' , 'fips' : '14587'},
		{'location' :  'Clifton CDP' , 'fips' : '15165'}, {'location' :  'Coal Creek CDP' , 'fips' : '15302'},
		{'location' :  'Coaldale CDP' , 'fips' : '15440'}, {'location' :  'Colona CDP' , 'fips' : '15825'},
		{'location' :  'Colorado City CDP' , 'fips' : '15935'}, {'location' :  'Columbine CDP' , 'fips' : '16110'},
		{'location' :  'Comanche Creek CDP' , 'fips' : '16465'}, {'location' :  'Conejos CDP' , 'fips' : '16715'},
		{'location' :  'Copper Mountain CDP' , 'fips' : '17150'}, {'location' :  'Cotopaxi CDP' , 'fips' : '17485'},
		{'location' :  'Crisman CDP' , 'fips' : '18585'}, {'location' :  'Dakota Ridge CDP' , 'fips' : '19150'},
		{'location' :  'Derby CDP' , 'fips' : '20275'}, {'location' :  'Divide CDP' , 'fips' : '20605'},
		{'location' :  'Dotsero CDP' , 'fips' : '21155'}, {'location' :  'Dove Valley CDP' , 'fips' : '21330'},
		{'location' :  'Downieville-Lawson-Dumont CDP' , 'fips' : '21390'}, {'location' :  'East Pleasant View CDP' , 'fips' : '22575'},
		{'location' :  'Edwards CDP' , 'fips' : '23300'}, {'location' :  'El Jebel CDP' , 'fips' : '23795'},
		{'location' :  'El Moro CDP' , 'fips' : '24290'}, {'location' :  'Elbert CDP' , 'fips' : '23520'},
		{'location' :  'Eldora CDP' , 'fips' : '23575'}, {'location' :  'Eldorado Springs CDP' , 'fips' : '23630'},
		{'location' :  'Ellicott CDP' , 'fips' : '24235'}, {'location' :  'Evergreen CDP' , 'fips' : '25390'},
		{'location' :  'Fairmount CDP' , 'fips' : '25550'}, {'location' :  'Florissant CDP' , 'fips' : '27095'},
		{'location' :  'Floyd Hill CDP' , 'fips' : '27175'}, {'location' :  'Fort Carson CDP' , 'fips' : '27370'},
		{'location' :  'Fort Garland CDP' , 'fips' : '27535'}, {'location' :  'Franktown CDP' , 'fips' : '28250'},
		{'location' :  'Fruitvale CDP' , 'fips' : '28800'}, {'location' :  'Fulford CDP' , 'fips' : '28830'},
		{'location' :  'Garfield CDP' , 'fips' : '29295'}, {'location' :  'Genesee CDP' , 'fips' : '29625'},
		{'location' :  'Gerrard CDP' , 'fips' : '29845'}, {'location' :  'Glendale CDP' , 'fips' : '30350'},
		{'location' :  'Gleneagle CDP' , 'fips' : '30420'}, {'location' :  'Gold Hill CDP' , 'fips' : '30945'},
		{'location' :  'Goldfield CDP' , 'fips' : '30890'}, {'location' :  'Grand View Estates CDP' , 'fips' : '31935'},
		{'location' :  'Guffey CDP' , 'fips' : '33420'}, {'location' :  'Gunbarrel CDP' , 'fips' : '33502'},
		{'location' :  'Hasty CDP' , 'fips' : '34685'}, {'location' :  'Heeney CDP' , 'fips' : '35400'},
		{'location' :  'Hidden Lake CDP' , 'fips' : '35860'}, {'location' :  'Highlands Ranch CDP' , 'fips' : '36410'},
		{'location' :  'Hoehne CDP' , 'fips' : '36940'}, {'location' :  'Holly Hills CDP' , 'fips' : '37220'},
		{'location' :  'Howard CDP' , 'fips' : '37655'}, {'location' :  'Idalia CDP' , 'fips' : '38425'},
		{'location' :  'Idledale CDP' , 'fips' : '38480'}, {'location' :  'Indian Hills CDP' , 'fips' : '38810'},
		{'location' :  'Inverness CDP' , 'fips' : '38910'}, {'location' :  'Jackson Lake CDP' , 'fips' : '39160'},
		{'location' :  'Jansen CDP' , 'fips' : '39250'}, {'location' :  'Joes CDP' , 'fips' : '39745'},
		{'location' :  'Johnson Village CDP' , 'fips' : '39800'}, {'location' :  'Ken Caryl CDP' , 'fips' : '40377'},
		{'location' :  'Kirk CDP' , 'fips' : '40900'},
		{'location' :  'Kittredge CDP' , 'fips' : '41065'}, {'location' :  'La Junta Gardens CDP' , 'fips' : '42165'},
		{'location' :  'Laird CDP' , 'fips' : '42000'}, {'location' :  'Laporte CDP' , 'fips' : '43220'},
		{'location' :  'Lazy Acres CDP' , 'fips' : '44270'}, {'location' :  'Leadville North CDP' , 'fips' : '44375'},
		{'location' :  'Lewis CDP' , 'fips' : '44595'}, {'location' :  'Leyner CDP' , 'fips' : '44695'},
		{'location' :  'Lincoln Park CDP' , 'fips' : '45145'}, {'location' :  'Loghill Village CDP' , 'fips' : '45680'},
		{'location' :  'Loma CDP' , 'fips' : '45750'}, {'location' :  'Louviers CDP' , 'fips' : '46410'},
		{'location' :  'Lynn CDP' , 'fips' : '47015'}, {'location' :  'Maybell CDP' , 'fips' : '49325'},
		{'location' :  'Maysville CDP' , 'fips' : '49490'}, {'location' :  'McCoy CDP' , 'fips' : '47345'},
		{'location' :  'Meridian CDP' , 'fips' : '50012'}, {'location' :  'Midland CDP' , 'fips' : '50380'},
		{'location' :  'Morgan Heights CDP' , 'fips' : '51975'}, {'location' :  'Mountain Meadows CDP' , 'fips' : '52210'},
		{'location' :  'Mulford CDP' , 'fips' : '52820'}, {'location' :  'Niwot CDP' , 'fips' : '53780'},
		{'location' :  'No Name CDP' , 'fips' : '53875'}, {'location' :  'Norrie CDP' , 'fips' : '53945'},
		{'location' :  'North La Junta CDP' , 'fips' : '54495'}, {'location' :  'North Washington CDP' , 'fips' : '54750'},
		{'location' :  'Orchard CDP' , 'fips' : '55925'}, {'location' :  'Orchard Mesa CDP' , 'fips' : '56035'},
		{'location' :  'Padroni CDP' , 'fips' : '56695'}, {'location' :  'Paragon Estates CDP' , 'fips' : '57445'},
		{'location' :  'Parshall CDP' , 'fips' : '57850'}, {'location' :  'Penrose CDP' , 'fips' : '58400'},
		{'location' :  'Peoria CDP' , 'fips' : '58510'}, {'location' :  'Perry Park CDP' , 'fips' : '58592'},
		{'location' :  'Peyton CDP' , 'fips' : '58675'}, {'location' :  'Phippsburg CDP' , 'fips' : '58758'},
		{'location' :  'Piedra CDP' , 'fips' : '58960'}, {'location' :  'Pine Brook Hill CDP' , 'fips' : '59240'},
		{'location' :  'Ponderosa Park CDP' , 'fips' : '60655'}, {'location' :  'Portland CDP' , 'fips' : '60765'},
		{'location' :  'Pueblo West CDP' , 'fips' : '62220'}, {'location' :  'Red Feather Lakes CDP' , 'fips' : '63320'},
		{'location' :  'Redlands CDP' , 'fips' : '63375'}, {'location' :  'Redstone CDP' , 'fips' : '63650'},
		{'location' :  'Redvale CDP' , 'fips' : '63705'}, {'location' :  'Rock Creek Park CDP' , 'fips' : '64870'},
		{'location' :  'Rollinsville CDP' , 'fips' : '65685'}, {'location' :  'Roxborough Park CDP' , 'fips' : '66197'},
		{'location' :  'Saddle Ridge CDP' , 'fips' : '66995'}, {'location' :  'Salt Creek CDP' , 'fips' : '67445'},
		{'location' :  'San Acacio CDP' , 'fips' : '67500'}, {'location' :  'Security-Widefield CDP' , 'fips' : '68847'},
		{'location' :  'Sedalia CDP' , 'fips' : '68875'}, {'location' :  'Segundo CDP' , 'fips' : '68985'},
		{'location' :  'Seven Hills CDP' , 'fips' : '69110'}, {'location' :  'Shaw Heights CDP' , 'fips' : '69480'},
		{'location' :  'Sherrelwood CDP' , 'fips' : '69810'}, {'location' :  'Smeltertown CDP' , 'fips' : '71625'},
		{'location' :  'Snyder CDP' , 'fips' : '71790'}, {'location' :  'Southern Ute CDP' , 'fips' : '72320'},
		{'location' :  'St. Ann Highlands CDP' , 'fips' : '67040'}, {'location' :  'St. Mary\'s CDP' , 'fips' : '67142'},
		{'location' :  'Stonegate CDP' , 'fips' : '74080'}, {'location' :  'Stonewall Gap CDP' , 'fips' : '74275'},
		{'location' :  'Strasburg CDP' , 'fips' : '74375'}, {'location' :  'Stratmoor CDP' , 'fips' : '74430'},
		{'location' :  'Sugarloaf CDP' , 'fips' : '74980'}, {'location' :  'Sunshine CDP' , 'fips' : '75585'},
		{'location' :  'Tabernash CDP' , 'fips' : '76190'}, {'location' :  'Tall Timber CDP' , 'fips' : '76325'},
		{'location' :  'The Pinery CDP' , 'fips' : '77235'}, {'location' :  'Todd Creek CDP' , 'fips' : '77757'},
		{'location' :  'Towaoc CDP' , 'fips' : '78280'}, {'location' :  'Towner CDP' , 'fips' : '78335'},
		{'location' :  'Trail Side CDP' , 'fips' : '78345'}, {'location' :  'Twin Lakes CDP' , 'fips' : '79100'},
		{'location' :  'Twin Lakes CDP' , 'fips' : '79105'}, {'location' :  'Upper Bear Creek CDP' , 'fips' : '79785'},
		{'location' :  'Valdez CDP' , 'fips' : '80095'}, {'location' :  'Valmont CDP' , 'fips' : '80370'},
		{'location' :  'Vernon CDP' , 'fips' : '80755'}, {'location' :  'Vineland CDP' , 'fips' : '81305'},
		{'location' :  'Watkins CDP' , 'fips' : '82905'}, {'location' :  'Welby CDP' , 'fips' : '83120'},
		{'location' :  'Weldona CDP' , 'fips' : '83175'}, {'location' :  'West Pleasant View CDP' , 'fips' : '84042'},
		{'location' :  'Westcreek CDP' , 'fips' : '83500'}, {'location' :  'Weston CDP' , 'fips' : '84000'},
		{'location' :  'Wolcott CDP' , 'fips' : '85760'}, {'location' :  'Woodmoor CDP' , 'fips' : '86117'}]

// County and muni
var ctymuni = [{'location' : 'Aguilar', 'fips' : '07100760'}, {'location' : 'Akron', 'fips' : '12100925'},
		{'location' : 'Alamosa', 'fips' : '00301090'}, {'location' : 'Alma', 'fips' : '09301530'},
		{'location' : 'Antonito', 'fips' : '02102355'}, {'location' : 'Arriba', 'fips' : '07303235'},
		{'location' : 'Arvada', 'fips' : '00103455'}, {'location' : 'Aspen', 'fips' : '09703620'},
		{'location' : 'Ault', 'fips' : '12303950'}, {'location' : 'Aurora', 'fips' : '00104000'},
		{'location' : 'Avon', 'fips' : '03704110'}, {'location' : 'Basalt', 'fips' : '03704935'},
		{'location' : 'Bayfield', 'fips' : '06705265'}, {'location' : 'Bennett', 'fips' : '00106090'},
		{'location' : 'Berthoud', 'fips' : '06906255'}, {'location' : 'Bethune', 'fips' : '06306530'},
		{'location' : 'Black Hawk', 'fips' : '04707025'}, {'location' : 'Blanca', 'fips' : '02307190'},
		{'location' : 'Blue River', 'fips' : '11707410'}, {'location' : 'Bonanza', 'fips' : '10907571'},
		{'location' : 'Boone', 'fips' : '10107795'}, {'location' : 'Boulder', 'fips' : '01307850'},
		{'location' : 'Bow Mar', 'fips' : '00508070'}, {'location' : 'Branson', 'fips' : '07108345'},
		{'location' : 'Breckenridge', 'fips' : '11708400'}, {'location' : 'Brighton', 'fips' : '00108675'},
		{'location' : 'Brookside', 'fips' : '04309115'}, {'location' : 'Broomfield', 'fips' : '01409280'},
		{'location' : 'Brush', 'fips' : '08709555'}, {'location' : 'Buena Vista', 'fips' : '01510105'},
		{'location' : 'Burlington', 'fips' : '06310600'}, {'location' : 'Calhan', 'fips' : '04111260'},
		{'location' : 'Campo', 'fips' : '00911645'}, {'location' : 'Cañon City', 'fips' : '04311810'},
		{'location' : 'Carbondale', 'fips' : '04512045'}, {'location' : 'Castle Pines North', 'fips' : '03512390'},
		{'location' : 'Castle Rock', 'fips' : '03512415'}, {'location' : 'Cedaredge', 'fips' : '02912635'},
		{'location' : 'Centennial', 'fips' : '00512815'}, {'location' : 'Center', 'fips' : '10512855'},
		{'location' : 'Central City', 'fips' : '01912910'}, {'location' : 'Cheraw', 'fips' : '08913460'},
		{'location' : 'Cherry Hills Village', 'fips' : '00513845'}, {'location' : 'Cheyenne Wells', 'fips' : '01714175'},
		{'location' : 'City of Creede', 'fips' : '07914765'}, {'location' : 'Coal Creek', 'fips' : '04315330'},
		{'location' : 'Cokedale', 'fips' : '07115550'}, {'location' : 'Collbran', 'fips' : '07715605'},
		{'location' : 'Colorado Springs', 'fips' : '04116000'}, {'location' : 'Columbine Valley', 'fips' : '00516385'},
		{'location' : 'Commerce City', 'fips' : '00116495'}, {'location' : 'Cortez', 'fips' : '08317375'},
		{'location' : 'Craig', 'fips' : '08117760'}, {'location' : 'Crawford', 'fips' : '02917925'},
		{'location' : 'Crested Butte', 'fips' : '05118310'}, {'location' : 'Crestone', 'fips' : '10918420'},
		{'location' : 'Cripple Creek', 'fips' : '11918530'}, {'location' : 'Crook', 'fips' : '07518640'},
		{'location' : 'Crowley', 'fips' : '02518750'}, {'location' : 'Dacono', 'fips' : '12319080'},
		{'location' : 'De Beque', 'fips' : '07719355'}, {'location' : 'Deer Trail', 'fips' : '00519630'},
		{'location' : 'Del Norte', 'fips' : '10519795'}, {'location' : 'Delta', 'fips' : '02919850'},
		{'location' : 'Denver', 'fips' : '03120000'}, {'location' : 'Dillon', 'fips' : '11720440'},
		{'location' : 'Dinosaur', 'fips' : '08120495'}, {'location' : 'Dolores', 'fips' : '08320770'},
		{'location' : 'Dove Creek', 'fips' : '03321265'}, {'location' : 'Durango', 'fips' : '06722035'},
		{'location' : 'Eads', 'fips' : '06122145'}, {'location' : 'Eagle', 'fips' : '03722200'},
		{'location' : 'Eaton', 'fips' : '12322860'}, {'location' : 'Eckley', 'fips' : '12523025'},
		{'location' : 'Edgewater', 'fips' : '05923135'}, {'location' : 'Elizabeth', 'fips' : '03923740'},
		{'location' : 'Empire', 'fips' : '01924620'}, {'location' : 'Englewood', 'fips' : '00524785'},
		{'location' : 'Erie', 'fips' : '01324950'}, {'location' : 'Estes Park', 'fips' : '06925115'},
		{'location' : 'Evans', 'fips' : '12325280'}, {'location' : 'Fairplay', 'fips' : '09325610'},
		{'location' : 'Federal Heights', 'fips' : '00126270'}, {'location' : 'Firestone', 'fips' : '12326600'},
		{'location' : 'Flagler', 'fips' : '06326765'}, {'location' : 'Fleming', 'fips' : '07526875'},
		{'location' : 'Florence', 'fips' : '04327040'}, {'location' : 'Fort Collins', 'fips' : '06927425'},
		{'location' : 'Fort Lupton', 'fips' : '12327700'}, {'location' : 'Fort Morgan', 'fips' : '08727810'},
		{'location' : 'Fountain', 'fips' : '04127865'}, {'location' : 'Fowler', 'fips' : '08927975'},
		{'location' : 'Foxfield', 'fips' : '00528105'}, {'location' : 'Fraser', 'fips' : '04928305'},
		{'location' : 'Frederick', 'fips' : '12328360'}, {'location' : 'Frisco', 'fips' : '11728690'},
		{'location' : 'Fruita', 'fips' : '07728745'}, {'location' : 'Garden City', 'fips' : '12329185'},
		{'location' : 'Genoa', 'fips' : '07329680'}, {'location' : 'Georgetown', 'fips' : '01929735'},
		{'location' : 'Gilcrest', 'fips' : '12329955'}, {'location' : 'Glendale', 'fips' : '00530340'},
		{'location' : 'Glenwood Springs', 'fips' : '04530780'}, {'location' : 'Golden', 'fips' : '05930835'},
		{'location' : 'Granada', 'fips' : '09931550'}, {'location' : 'Granby', 'fips' : '04931605'},
		{'location' : 'Grand Junction', 'fips' : '07731660'}, {'location' : 'Grand Lake', 'fips' : '04931715'},
		{'location' : 'Greeley', 'fips' : '12332155'}, {'location' : 'Green Mountain Falls', 'fips' : '04132650'},
		{'location' : 'Greenwood Village', 'fips' : '00533035'}, {'location' : 'Grover', 'fips' : '12333310'},
		{'location' : 'Gunnison', 'fips' : '05133640'}, {'location' : 'Gypsum', 'fips' : '03733695'},
		{'location' : 'Hartman', 'fips' : '09934520'}, {'location' : 'Haswell', 'fips' : '06134740'},
		{'location' : 'Haxtun', 'fips' : '09534960'}, {'location' : 'Hayden', 'fips' : '10735070'},
		{'location' : 'Hillrose', 'fips' : '08736610'}, {'location' : 'Holly', 'fips' : '09937215'},
		{'location' : 'Holyoke', 'fips' : '09537270'}, {'location' : 'Hooper', 'fips' : '00337380'},
		{'location' : 'Hotchkiss', 'fips' : '02937545'}, {'location' : 'Hot Sulphur Springs', 'fips' : '04937600'},
		{'location' : 'Hudson', 'fips' : '12337820'}, {'location' : 'Hugo', 'fips' : '07337875'},
		{'location' : 'Idaho Springs', 'fips' : '01938370'}, {'location' : 'Ignacio', 'fips' : '06738535'},
		{'location' : 'Iliff', 'fips' : '07538590'}, {'location' : 'Jamestown', 'fips' : '01339195'},
		{'location' : 'Johnstown', 'fips' : '06939855'}, {'location' : 'Julesburg', 'fips' : '11539965'},
		{'location' : 'Keenesburg', 'fips' : '12340185'}, {'location' : 'Kersey', 'fips' : '12340515'},
		{'location' : 'Kim', 'fips' : '07140570'}, {'location' : 'Kiowa', 'fips' : '03940790'},
		{'location' : 'Kit Carson', 'fips' : '01741010'}, {'location' : 'Kremmling', 'fips' : '04941560'},
		{'location' : 'Lafayette', 'fips' : '01341835'}, {'location' : 'La Jara', 'fips' : '02142055'},
		{'location' : 'La Junta', 'fips' : '08942110'}, {'location' : 'Lake City', 'fips' : '05342330'},
		{'location' : 'Lakeside', 'fips' : '05942495'}, {'location' : 'Lakewood', 'fips' : '05943000'},
		{'location' : 'Lamar', 'fips' : '09943110'}, {'location' : 'Larkspur', 'fips' : '03543550'},
		{'location' : 'La Salle', 'fips' : '12343605'}, {'location' : 'Las Animas', 'fips' : '01143660'},
		{'location' : 'La Veta', 'fips' : '05544100'}, {'location' : 'Leadville', 'fips' : '06544320'},
		{'location' : 'Limon', 'fips' : '07344980'}, {'location' : 'Littleton', 'fips' : '00545255'},
		{'location' : 'Lochbuie', 'fips' : '00145530'}, {'location' : 'Log Lane Village', 'fips' : '08745695'},
		{'location' : 'Lone Tree', 'fips' : '03545955'}, {'location' : 'Longmont', 'fips' : '01345970'},
		{'location' : 'Louisville', 'fips' : '01346355'}, {'location' : 'Loveland', 'fips' : '06946465'},
		{'location' : 'Lyons', 'fips' : '01347070'}, {'location' : 'Manassa', 'fips' : '02148060'},
		{'location' : 'Mancos', 'fips' : '08348115'}, {'location' : 'Manitou Springs', 'fips' : '04148445'},
		{'location' : 'Manzanola', 'fips' : '08948500'}, {'location' : 'Marble', 'fips' : '05148555'},
		{'location' : 'Mead', 'fips' : '12349600'}, {'location' : 'Meeker', 'fips' : '10349875'},
		{'location' : 'Merino', 'fips' : '07550040'}, {'location' : 'Milliken', 'fips' : '12350480'},
		{'location' : 'Minturn', 'fips' : '03750920'}, {'location' : 'Moffat', 'fips' : '10951250'},
		{'location' : 'Monte Vista', 'fips' : '10551635'}, {'location' : 'Montezuma', 'fips' : '11751690'},
		{'location' : 'Montrose', 'fips' : '08551745'}, {'location' : 'Monument', 'fips' : '04151800'},
		{'location' : 'Morrison', 'fips' : '05952075'}, {'location' : 'Mountain View', 'fips' : '05952350'},
		{'location' : 'Mountain Village', 'fips' : '11352550'}, {'location' : 'Mount Crested Butte', 'fips' : '05152570'},
		{'location' : 'Naturita', 'fips' : '08553120'}, {'location' : 'Nederland', 'fips' : '01353175'},
		{'location' : 'New Castle', 'fips' : '04553395'}, {'location' : 'Northglenn', 'fips' : '00154330'},
		{'location' : 'Norwood', 'fips' : '11354880'}, {'location' : 'Nucla', 'fips' : '08554935'},
		{'location' : 'Nunn', 'fips' : '12355045'}, {'location' : 'Oak Creek', 'fips' : '10755155'},
		{'location' : 'Olathe', 'fips' : '08555540'}, {'location' : 'Olney Springs', 'fips' : '02555705'},
		{'location' : 'Ophir', 'fips' : '11355870'}, {'location' : 'Orchard City', 'fips' : '02955980'},
		{'location' : 'Ordway', 'fips' : '02556145'}, {'location' : 'Otis', 'fips' : '12156365'},
		{'location' : 'Ouray', 'fips' : '09156420'}, {'location' : 'Ovid', 'fips' : '11556475'},
		{'location' : 'Pagosa Springs', 'fips' : '00756860'}, {'location' : 'Palisade', 'fips' : '07756970'},
		{'location' : 'Palmer Lake', 'fips' : '04157025'}, {'location' : 'Paoli', 'fips' : '09557245'},
		{'location' : 'Paonia', 'fips' : '02957300'}, {'location' : 'Parachute', 'fips' : '04557400'},
		{'location' : 'Parker', 'fips' : '03557630'}, {'location' : 'Peetz', 'fips' : '07558235'},
		{'location' : 'Pierce', 'fips' : '12359005'}, {'location' : 'Pitkin', 'fips' : '05159830'},
		{'location' : 'Platteville', 'fips' : '12360160'}, {'location' : 'Poncha Springs', 'fips' : '01560600'},
		{'location' : 'Pritchett', 'fips' : '00961315'}, {'location' : 'Pueblo', 'fips' : '10162000'},
		{'location' : 'Ramah', 'fips' : '04162660'}, {'location' : 'Rangely', 'fips' : '10362880'},
		{'location' : 'Raymer (New Raymer)', 'fips' : '12363045'}, {'location' : 'Red Cliff', 'fips' : '03763265'},
		{'location' : 'Rico', 'fips' : '03364090'}, {'location' : 'Ridgway', 'fips' : '09164200'},
		{'location' : 'Rifle', 'fips' : '04564255'}, {'location' : 'Rockvale', 'fips' : '04364970'},
		{'location' : 'Rocky Ford', 'fips' : '08965190'}, {'location' : 'Romeo', 'fips' : '02165740'},
		{'location' : 'Rye', 'fips' : '10166895'}, {'location' : 'Saguache', 'fips' : '10967005'},
		{'location' : 'Salida', 'fips' : '01567280'}, {'location' : 'Sanford', 'fips' : '02167830'},
		{'location' : 'San Luis', 'fips' : '02368105'}, {'location' : 'Sawpit', 'fips' : '11368655'},
		{'location' : 'Sedgwick', 'fips' : '11568930'}, {'location' : 'Seibert', 'fips' : '06369040'},
		{'location' : 'Severance', 'fips' : '12369150'}, {'location' : 'Sheridan', 'fips' : '00569645'},
		{'location' : 'Sheridan Lake', 'fips' : '06169700'}, {'location' : 'Silt', 'fips' : '04570195'},
		{'location' : 'Silver Cliff', 'fips' : '02770250'}, {'location' : 'Silver Plume', 'fips' : '01970360'},
		{'location' : 'Silverthorne', 'fips' : '11770525'}, {'location' : 'Silverton', 'fips' : '11170580'},
		{'location' : 'Simla', 'fips' : '03970635'}, {'location' : 'Snowmass Village', 'fips' : '09771755'},
		{'location' : 'South Fork', 'fips' : '10572395'}, {'location' : 'Springfield', 'fips' : '00973330'},
		{'location' : 'Starkville', 'fips' : '07173715'}, {'location' : 'Steamboat Springs', 'fips' : '10773825'},
		{'location' : 'Sterling', 'fips' : '07573935'}, {'location' : 'Stratton', 'fips' : '06374485'},
		{'location' : 'Sugar City', 'fips' : '02574815'}, {'location' : 'Superior', 'fips' : '01375640'},
		{'location' : 'Swink', 'fips' : '08975970'}, {'location' : 'Telluride', 'fips' : '11376795'},
		{'location' : 'Thornton', 'fips' : '00177290'}, {'location' : 'Timnath', 'fips' : '06977510'},
		{'location' : 'Trinidad', 'fips' : '07178610'}, {'location' : 'Two Buttes', 'fips' : '00979270'},
		{'location' : 'Vail', 'fips' : '03780040'}, {'location' : 'Victor', 'fips' : '11980865'},
		{'location' : 'Vilas', 'fips' : '00981030'}, {'location' : 'Vona', 'fips' : '06381690'},
		{'location' : 'Walden', 'fips' : '05782130'}, {'location' : 'Walsenburg', 'fips' : '05582350'},
		{'location' : 'Walsh', 'fips' : '00982460'}, {'location' : 'Ward', 'fips' : '01382735'},
		{'location' : 'Wellington', 'fips' : '06983230'}, {'location' : 'Westcliffe', 'fips' : '02783450'},
		{'location' : 'Westminster', 'fips' : '00183835'}, {'location' : 'Wheat Ridge', 'fips' : '05984440'},
		{'location' : 'Wiggins', 'fips' : '08784770'}, {'location' : 'Wiley', 'fips' : '09985045'},
		{'location' : 'Williamsburg', 'fips' : '04385155'}, {'location' : 'Windsor', 'fips' : '06985485'},
		{'location' : 'Winter Park', 'fips' : '04985705'}, {'location' : 'Woodland Park', 'fips' : '11986090'},
		{'location' : 'Wray', 'fips' : '12586310'}, {'location' : 'Yampa', 'fips' : '10786475'},
		{'location' : 'Yuma', 'fips' : '12586750'}, {'location' : 'Unincorporated Adams County', 'fips' : '00199990'},
		{'location' : 'Unincorporated Alamosa County', 'fips' : '00399990'}, {'location' : 'Unincorporated Arapahoe County', 'fips' : '00599990'},
		{'location' : 'Unincorporated Archuleta County', 'fips' : '00799990'}, {'location' : 'Unincorporated Baca County', 'fips' : '00999990'},
		{'location' : 'Unincorporated Bent County', 'fips' : '01199990'}, {'location' : 'Unincorporated Boulder County', 'fips' : '01399990'},
		{'location' : 'Unincorporated Broomfield County', 'fips' : '01499990'}, {'location' : 'Unincorporated Chaffee County', 'fips' : '01599990'},
		{'location' : 'Unincorporated Cheyenne County', 'fips' : '01799990'}, {'location' : 'Unincorporated Clear Creek County', 'fips' : '01999990'},
		{'location' : 'Unincorporated Conejos County', 'fips' : '02199990'}, {'location' : 'Unincorporated Costilla County', 'fips' : '02399990'},
		{'location' : 'Unincorporated Crowley County', 'fips' : '02599990'}, {'location' : 'Unincorporated Custer County', 'fips' : '02799990'},
		{'location' : 'Unincorporated Delta County', 'fips' : '02999990'}, {'location' : 'Unincorporated Denver County', 'fips' : '03199990'},
		{'location' : 'Unincorporated Dolores County', 'fips' : '03399990'}, {'location' : 'Unincorporated Douglas County', 'fips' : '03599990'},
		{'location' : 'Unincorporated Eagle County', 'fips' : '03799990'}, {'location' : 'Unincorporated Elbert County', 'fips' : '03999990'},
		{'location' : 'Unincorporated El Paso County', 'fips' : '04199990'}, {'location' : 'Unincorporated Fremont County', 'fips' : '04399990'},
		{'location' : 'Unincorporated Garfield County', 'fips' : '04599990'}, {'location' : 'Unincorporated Gilpin County', 'fips' : '04799990'},
		{'location' : 'Unincorporated Grand County', 'fips' : '04999990'}, {'location' : 'Unincorporated Gunnison County', 'fips' : '05199990'},
		{'location' : 'Unincorporated Hinsdale County', 'fips' : '05399990'}, {'location' : 'Unincorporated Huerfano County', 'fips' : '05599990'},
		{'location' : 'Unincorporated Jackson County', 'fips' : '05799990'}, {'location' : 'Unincorporated Jefferson County', 'fips' : '05999990'},
		{'location' : 'Unincorporated Kiowa County', 'fips' : '06199990'}, {'location' : 'Unincorporated Kit Carson County', 'fips' : '06399990'},
		{'location' : 'Unincorporated Lake County', 'fips' : '06599990'}, {'location' : 'Unincorporated La Plata County', 'fips' : '06799990'},
		{'location' : 'Unincorporated Larimer County', 'fips' : '06999990'}, {'location' : 'Unincorporated Las Animas County', 'fips' : '07199990'},
		{'location' : 'Unincorporated Lincoln County', 'fips' : '07399990'}, {'location' : 'Unincorporated Logan County', 'fips' : '07599990'},
		{'location' : 'Unincorporated Mesa County', 'fips' : '07799990'}, {'location' : 'Unincorporated Mineral County', 'fips' : '07999990'},
		{'location' : 'Unincorporated Moffat County', 'fips' : '08199990'}, {'location' : 'Unincorporated Montezuma County', 'fips' : '08399990'},
		{'location' : 'Unincorporated Montrose County', 'fips' : '08599990'}, {'location' : 'Unincorporated Morgan County', 'fips' : '08799990'},
		{'location' : 'Unincorporated Otero County', 'fips' : '08999990'}, {'location' : 'Unincorporated Ouray County', 'fips' : '09199990'},
		{'location' : 'Unincorporated Park County', 'fips' : '09399990'}, {'location' : 'Unincorporated Phillips County', 'fips' : '09599990'},
		{'location' : 'Unincorporated Pitkin County', 'fips' : '09799990'}, {'location' : 'Unincorporated Prowers County', 'fips' : '09999990'},
		{'location' : 'Unincorporated Pueblo County', 'fips' : '10199990'}, {'location' : 'Unincorporated Rio Blanco County', 'fips' : '10399990'},
		{'location' : 'Unincorporated Rio Grande County', 'fips' : '10599990'}, {'location' : 'Unincorporated Routt County', 'fips' : '10799990'},
		{'location' : 'Unincorporated Saguache County', 'fips' : '10999990'}, {'location' : 'Unincorporated San Juan County', 'fips' : '11199990'},
		{'location' : 'Unincorporated San Miguel County', 'fips' : '11399990'}, {'location' : 'Unincorporated Sedgwick County', 'fips' : '11599990'},
		{'location' : 'Unincorporated Summit County', 'fips' : '11799990'}, {'location' : 'Unincorporated Teller County', 'fips' : '11999990'},
		{'location' : 'Unincorporated Washington County', 'fips' : '12199990'}, {'location' : 'Unincorporated Weld County', 'fips' : '12399990'},
		{'location' : 'Unincorporated Yuma County', 'fips' : '12599990'}]
		
//CSGB Agencies
var csbg = [
		{'location' :  'Adams County', 'fips' : '11riMRpReXocorCgvKeryZoC0W3uc7vAs'},
		{'location' :  'Arapahoe County', 'fips' : '1P6SNmQANJ-Wz_9mex0aeyzgXzPQ5RKlO'},
		{'location' :  'Baca County', 'fips' : '1YvKqArpPyRnYZQeOgLQGtW47upkLl3a5'},
		{'location' :  'Boulder County', 'fips' : '1yquBK1pOTYLxHrawkbkNHCrL5Kvq8rKC'},
		{'location' :  'Broomfield City and County', 'fips' : '1xLhMnJOCBnY9YmfQDJq9GoKlGyg4MGbi'},
		{'location' :  'Colorado East Community Action Agency', 'fips' : '1KjceKced0R5TQT1IEYCnbSfDIGsBSxI4'},
		{'location' :  'Delta County Health Department', 'fips' : '1foVI4Fs7KKuwsclNJt5RWFybb1XSzev1'},
		{'location' :  'Denver City and County', 'fips' : '10jkFL8KqMF5LNXNm4ySLW2uGH2vTl2iL'},
		{'location' :  'Douglas County', 'fips' : '1wxtiBRXVQJZ80mgd289azP5iwl-zwftu'},
		{'location' :  'El Paso County', 'fips' : '1tsZRYyNzW2wBv6xN0Miyk3-sYQm5jpu9'},
		{'location' :  'Garfield County Department of Human Services', 'fips' : '1oBxvwj7KckUJvxQCj06OndXd6Q20Xay_'},
		{'location' :  'Gunnison County CSBG', 'fips' : '1qScn10K_qi8IctsnGRyzZQJItfJZpmS1'},
		{'location' :  'Housing Solutions for the Southwest', 'fips' : '10VZ_aPoM9Pd7WcuFGd-vr_eRug6JBqkw'},
		{'location' :  'Jefferson County CSBG', 'fips' : '19oighKfzg41y5-Xk67P6dj02nTzdt2T0'},
		{'location' :  'Kiowa County', 'fips' : '10V8iuOBEaxFV_8PgL5ACW85Zb7tbLyCa'},
		{'location' :  'Larimer County', 'fips' : '1amGODok21BpFZLT_Ce6p3AxdPc3paVQp'},
		{'location' :  'Mesa County', 'fips' : '1XNmRhjSUxi_tzQaTRrjW5DqzkfLqjBP2'},
		{'location' :  'Mountain Family Center', 'fips' : '1nO8Mp8TOkwud0y0b9o6OEtqXSoYP8FQi'},
		{'location' :  'Northeastern Colorado Association of Local Governments', 'fips' : '119nTBwNl-Hf5mOPB_WMR2n_0fGHiOTP3'},
		{'location' :  'Otero County Department of Human Services', 'fips' : '1BmmtDCxDUkHXf2Ry3XOnxBPfeaOFF2FU'},
		{'location' :  'Prowers County', 'fips' : '1ol9CCBaQEJ27q5aPFZmIUBa4p3lKQ3n0'},
		{'location' :  'Pueblo County', 'fips' : '1kQEUAn3XybDGu5emEU8OWXgPUwpXJC4y'},
		{'location' :  'Rio Blanco County', 'fips' : '1UGtYpcy5KrOIEtb066fNI-ORaeZXIhbn'},
		{'location' :  'SLV Community Solutions', 'fips' : '1Ycvg8JV4o8JcJRpHzZhqd5wcMYsLLCCk'},
		{'location' :  'Summit County CSBG', 'fips' : '1PhtoRjnyipJKBEMACUwIA7k8C4-sJYm-'},
		{'location' :  'Upper Arkansas Area Council of Governments', 'fips' : '1liyxONR__wtITAW9JsWMz6kEnqRaEmCq'},
		{'location' :  'Weld County', 'fips' : '1g1xyfW2gZ3v4fMkpznJxaTQxMuZspQuz'},
		{'location' :  'Balance of State', 'fips' : '14eg91TU5jvi7XuYr7SnvxFIupGqT_ual'},
			]

if(level == 'CSBG') { var locarr = csbg};
if(level == 'county') { var locarr = county};
if(level == 'municipality') { var locarr = municipality};


var sel = document.getElementById(ddid);
sel.innerHTML = "";

	 var sel = document.getElementById(ddid);
		for(var i = 0; i < locarr.length; i++) {
			var el = document.createElement("option");
			el.textContent = locarr[i].location;
			el.value = locarr[i].fips;
			sel.appendChild(el);
		}
}; 
// popDropdown	

function popCCDDrop(cty,ddid){
	var ccd = [
	{'location' : 'Adams County', 'name' : 'North Aurora CCD'},
	{'location' : 'Adams County', 'name' : 'East Adams CCD'},
	{'location' : 'Adams County', 'name' : 'Commerce City CCD'},
	{'location' : 'Adams County', 'name' : 'Brighton CCD'},
	{'location' : 'Adams County', 'name' : 'West Adams CCD'},
	{'location' : 'Alamosa County', 'name' : 'Alamosa CCD'},
	{'location' : 'Alamosa County', 'name' : 'Mosca-Hooper CCD'},
	{'location' : 'Arapahoe County', 'name' : 'Southwest Arapahoe CCD'},
	{'location' : 'Arapahoe County', 'name' : 'East Arapahoe CCD'},
	{'location' : 'Arapahoe County', 'name' : 'South Aurora CCD'},
	{'location' : 'Archuleta County', 'name' : 'Pagosa Springs CCD'},
	{'location' : 'Archuleta County', 'name' : 'Campo CCD'},
	{'location' : 'Baca County', 'name' : 'Springfield CCD'},
	{'location' : 'Baca County', 'name' : 'Walsh CCD'},
	{'location' : 'Baca County', 'name' : 'Pritchett CCD'},
	{'location' : 'Bent County', 'name' : 'Las Animas CCD'},
	{'location' : 'Bent County', 'name' : 'McClave CCD'},
	{'location' : 'Bent County', 'name' : 'South Bent CCD'},
	{'location' : 'Boulder County', 'name' : 'Boulder CCD'},
	{'location' : 'Boulder County', 'name' : 'Lafayette-Louisville CCD'},
	{'location' : 'Boulder County', 'name' : 'Bald Mountain CCD'},
	{'location' : 'Boulder County', 'name' : 'Longmont CCD'},
	{'location' : 'Broomfield County', 'name' : 'Broomfield CCD'},
	{'location' : 'Chaffee County', 'name' : 'Salida CCD'},
	{'location' : 'Chaffee County', 'name' : 'Buena Vista CCD'},
	{'location' : 'Cheyenne County', 'name' : 'Kit Carson CCD'},
	{'location' : 'Cheyenne County', 'name' : 'Cheyenne Wells CCD'},
	{'location' : 'Clear Creek County', 'name' : 'Georgetown CCD'},
	{'location' : 'Clear Creek County', 'name' : 'Idaho Springs CCD'},
	{'location' : 'Conejos County', 'name' : 'La Jara CCD'},
	{'location' : 'Conejos County', 'name' : 'Manassa CCD'},
	{'location' : 'Conejos County', 'name' : 'Antonito CCD'},
	{'location' : 'Costilla County', 'name' : 'Blanca CCD'},
	{'location' : 'Costilla County', 'name' : 'San Luis CCD'},
	{'location' : 'Crowley County', 'name' : 'Sugar City CCD'},
	{'location' : 'Crowley County', 'name' : 'Ordway CCD'},
	{'location' : 'Custer County', 'name' : 'Westcliffe CCD'},
	{'location' : 'Delta County', 'name' : 'Delta CCD'},
	{'location' : 'Delta County', 'name' : 'Cedaredge CCD'},
	{'location' : 'Delta County', 'name' : 'Hotchkiss CCD'},
	{'location' : 'Delta County', 'name' : 'Paonia CCD'},
	{'location' : 'Denver County', 'name' : 'Denver CCD'},
	{'location' : 'Dolores County', 'name' : 'Rico CCD'},
	{'location' : 'Dolores County', 'name' : 'Dove Creek CCD'},
	{'location' : 'Douglas County', 'name' : 'Sedalia CCD'},
	{'location' : 'Douglas County', 'name' : 'Parker CCD'},
	{'location' : 'Douglas County', 'name' : 'Castle Rock CCD'},
	{'location' : 'Eagle County', 'name' : 'Minturn-Red Cliff CCD'},
	{'location' : 'Eagle County', 'name' : 'Eagle-Gypsum CCD'},
	{'location' : 'Eagle County', 'name' : 'Basalt CCD'},
	{'location' : 'Elbert County', 'name' : 'Elizabeth CCD'},
	{'location' : 'Elbert County', 'name' : 'Simla CCD'},
	{'location' : 'El Paso County', 'name' : 'Black Forest-Peyton CCD'},
	{'location' : 'El Paso County', 'name' : 'Southeastern El Paso CCD'},
	{'location' : 'El Paso County', 'name' : 'Cheyenne Mountain CCD'},
	{'location' : 'El Paso County', 'name' : 'Colorado Springs CCD'},
	{'location' : 'El Paso County', 'name' : 'Monument CCD'},
	{'location' : 'El Paso County', 'name' : 'Pikes Peak CCD'},
	{'location' : 'El Paso County', 'name' : 'Elsmere CCD'},
	{'location' : 'El Paso County', 'name' : 'Fountain CCD'},
	{'location' : 'Fremont County', 'name' : 'Canyon City CCD'},
	{'location' : 'Fremont County', 'name' : 'Florence CCD'},
	{'location' : 'Garfield County', 'name' : 'West Garfield CCD'},
	{'location' : 'Garfield County', 'name' : 'Glenwood Springs CCD'},
	{'location' : 'Garfield County', 'name' : 'New Castle CCD'},
	{'location' : 'Garfield County', 'name' : 'Rifle CCD'},
	{'location' : 'Gilpin County', 'name' : 'Central City CCD'},
	{'location' : 'Grand County', 'name' : 'Granby CCD'},
	{'location' : 'Grand County', 'name' : 'Kremmling CCD'},
	{'location' : 'Gunnison County', 'name' : 'Gunnison CCD'},
	{'location' : 'Gunnison County', 'name' : 'Somerset CCD'},
	{'location' : 'Gunnison County', 'name' : 'Crested Butte CCD'},
	{'location' : 'Hinsdale County', 'name' : 'Lake City CCD'},
	{'location' : 'Huerfano County', 'name' : 'La Veta CCD'},
	{'location' : 'Huerfano County', 'name' : 'Walsenburg CCD'},
	{'location' : 'Jackson County', 'name' : 'Walden CCD'},
	{'location' : 'Jefferson County', 'name' : 'Northeast Jefferson CCD'},
	{'location' : 'Jefferson County', 'name' : 'Golden CCD'},
	{'location' : 'Jefferson County', 'name' : 'South Jefferson CCD'},
	{'location' : 'Jefferson County', 'name' : 'Central Jefferson CCD'},
	{'location' : 'Kiowa County', 'name' : 'Eads CCD'},
	{'location' : 'Kiowa County', 'name' : 'Sheridan Lake CCD'},
	{'location' : 'Kiowa County', 'name' : 'Haswell CCD'},
	{'location' : 'Kit Carson County', 'name' : 'Flagler CCD'},
	{'location' : 'Kit Carson County', 'name' : 'Burlington CCD'},
	{'location' : 'Kit Carson County', 'name' : 'Stratton CCD'},
	{'location' : 'Lake County', 'name' : 'Leadville CCD'},
	{'location' : 'La Plata County', 'name' : 'Durango CCD'},
	{'location' : 'La Plata County', 'name' : 'Bayfield CCD'},
	{'location' : 'La Plata County', 'name' : 'Ignacio CCD'},
	{'location' : 'Larimer County', 'name' : 'Timnath-Wellington CCD'},
	{'location' : 'Larimer County', 'name' : 'Fort Collins CCD'},
	{'location' : 'Larimer County', 'name' : 'Loveland CCD'},
	{'location' : 'Larimer County', 'name' : 'Estes Park CCD'},
	{'location' : 'Larimer County', 'name' : 'Berthoud CCD'},
	{'location' : 'Las Animas County', 'name' : 'Trinidad CCD'},
	{'location' : 'Las Animas County', 'name' : 'Branson CCD'},
	{'location' : 'Las Animas County', 'name' : 'Kim CCD'},
	{'location' : 'Las Animas County', 'name' : 'Aguilar CCD'},
	{'location' : 'Lincoln County', 'name' : 'Limon CCD'},
	{'location' : 'Lincoln County', 'name' : 'Hugo CCD'},
	{'location' : 'Lincoln County', 'name' : 'Arriba CCD'},
	{'location' : 'Logan County', 'name' : 'Fleming CCD'},
	{'location' : 'Logan County', 'name' : 'Peetz CCD'},
	{'location' : 'Logan County', 'name' : 'Sterling CCD'},
	{'location' : 'Logan County', 'name' : 'Crook CCD'},
	{'location' : 'Logan County', 'name' : 'Merino CCD'},
	{'location' : 'Mesa County', 'name' : 'De Beque CCD'},
	{'location' : 'Mesa County', 'name' : 'Collbran CCD'},
	{'location' : 'Mesa County', 'name' : 'Glade Park-Gateway CCD'},
	{'location' : 'Mesa County', 'name' : 'Fruita CCD'},
	{'location' : 'Mesa County', 'name' : 'Grand Junction CCD'},
	{'location' : 'Mesa County', 'name' : 'Clifton CCD'},
	{'location' : 'Mesa County', 'name' : 'Whitewater-Kannah Creek CCD'},
	{'location' : 'Mineral County', 'name' : 'Creede CCD'},
	{'location' : 'Moffat County', 'name' : 'Craig CCD'},
	{'location' : 'Moffat County', 'name' : 'Dinosaur CCD'},
	{'location' : 'Montezuma County', 'name' : 'Cortez CCD'},
	{'location' : 'Montezuma County', 'name' : 'Mancos CCD'},
	{'location' : 'Montezuma County', 'name' : 'Dolores CCD'},
	{'location' : 'Montrose County', 'name' : 'Nucla CCD'},
	{'location' : 'Montrose County', 'name' : 'Olathe CCD'},
	{'location' : 'Montrose County', 'name' : 'Montrose CCD'},
	{'location' : 'Morgan County', 'name' : 'Brush CCD'},
	{'location' : 'Morgan County', 'name' : 'Fort Morgan CCD'},
	{'location' : 'Morgan County', 'name' : 'Wiggins CCD'},
	{'location' : 'Otero County', 'name' : 'Cheraw CCD'},
	{'location' : 'Otero County', 'name' : 'Manzanola CCD'},
	{'location' : 'Otero County', 'name' : 'Fowler CCD'},
	{'location' : 'Otero County', 'name' : 'Rocky Ford CCD'},
	{'location' : 'Otero County', 'name' : 'La Junta CCD'},
	{'location' : 'Ouray County', 'name' : 'Ouray CCD'},
	{'location' : 'Park County', 'name' : 'Fairplay CCD'},
	{'location' : 'Phillips County', 'name' : 'Haxtun CCD'},
	{'location' : 'Phillips County', 'name' : 'Holyoke CCD'},
	{'location' : 'Pitkin County', 'name' : 'Snowmass Village CCD'},
	{'location' : 'Pitkin County', 'name' : 'Aspen CCD'},
	{'location' : 'Prowers County', 'name' : 'Granada CCD'},
	{'location' : 'Prowers County', 'name' : 'Holly CCD'},
	{'location' : 'Prowers County', 'name' : 'Lamar CCD'},
	{'location' : 'Pueblo County', 'name' : 'St. Charles Mesa CCD'},
	{'location' : 'Pueblo County', 'name' : 'Pueblo West CCD'},
	{'location' : 'Pueblo County', 'name' : 'Pueblo CCD'},
	{'location' : 'Pueblo County', 'name' : 'Colorado City-Rye CCD'},
	{'location' : 'Pueblo County', 'name' : 'Northeast Pueblo CCD'},
	{'location' : 'Rio Blanco County', 'name' : 'Meeker CCD'},
	{'location' : 'Rio Blanco County', 'name' : 'Rangely CCD'},
	{'location' : 'Rio Grande County', 'name' : 'Sargent CCD'},
	{'location' : 'Rio Grande County', 'name' : 'Del Norte CCD'},
	{'location' : 'Rio Grande County', 'name' : 'Monte Vista CCD'},
	{'location' : 'Routt County', 'name' : 'Steamboat Springs CCD'},
	{'location' : 'Routt County', 'name' : 'Hayden CCD'},
	{'location' : 'Routt County', 'name' : 'Oak Creek CCD'},
	{'location' : 'Routt County', 'name' : 'Yampa CCD'},
	{'location' : 'Saguache County', 'name' : 'Center CCD'},
	{'location' : 'Saguache County', 'name' : 'Saguache CCD'},
	{'location' : 'San Juan County', 'name' : 'Silverton CCD'},
	{'location' : 'San Miguel County', 'name' : 'Telluride CCD'},
	{'location' : 'San Miguel County', 'name' : 'Norwood CCD'},
	{'location' : 'Sedgwick County', 'name' : 'South Sedgwick CCD'},
	{'location' : 'Sedgwick County', 'name' : 'Julesburg CCD'},
	{'location' : 'Summit County', 'name' : 'Breckenridge CCD'},
	{'location' : 'Summit County', 'name' : 'Silverthorne CCD'},
	{'location' : 'Teller County', 'name' : 'Divide CCD'},
	{'location' : 'Teller County', 'name' : 'Cripple Creek CCD'},
	{'location' : 'Washington County', 'name' : 'Otis CCD'},
	{'location' : 'Washington County', 'name' : 'Akron CCD'},
	{'location' : 'Weld County', 'name' : 'Greeley CCD'},
	{'location' : 'Weld County', 'name' : 'La Salle-Gilcrest CCD'},
	{'location' : 'Weld County', 'name' : 'Johnstown-Milliken CCD'},
	{'location' : 'Weld County', 'name' : 'Platteville CCD'},
	{'location' : 'Weld County', 'name' : 'Erie-Frederick CCD'},
	{'location' : 'Weld County', 'name' : 'Grover CCD'},
	{'location' : 'Weld County', 'name' : 'Fort Lupton CCD'},
	{'location' : 'Weld County', 'name' : 'Windsor CCD'},
	{'location' : 'Weld County', 'name' : 'Keenesburg-Hudson CCD'},
	{'location' : 'Weld County', 'name' : 'Raymer CCD'},
	{'location' : 'Weld County', 'name' : 'Kersey-Gill CCD'},
	{'location' : 'Weld County', 'name' : 'Ault CCD'},
	{'location' : 'Yuma County', 'name' : 'Wray CCD'},
	{'location' : 'Yuma County', 'name' : 'Yuma CCD'}
]
	
 locarr = ccd.filter(d => (d.location == cty))
var sel = document.getElementById(ddid);
sel.innerHTML = "";

	 var sel = document.getElementById(ddid);
		for(var i = 0; i < locarr.length; i++) {
			var el = document.createElement("option");
			el.textContent = locarr[i].name;
			el.value = locarr[i].name;
			sel.appendChild(el);
		}
}; 
// popCCDDrop

function popCtyDrop(regnum,ddid){
//popCtyDrop  Populates the region dropdown and facilitates drill down in Demogaphic Dashboard and other applications
	reg_num = parseInt(regnum);
	reg_name = regionName(reg_num);
	fips_list = regionCOL(reg_num);
	var outlist = [];
	outlist.push({'fips' : regnum, 'location' : reg_name});

	for(i = 0; i < fips_list[0].fips.length; i++){
		var cnum = parseInt(fips_list[0].fips[i]);
		outlist.push({'fips' : fips_list[0].fips[i], 'location' : countyName(cnum)});
	}

var sel = document.getElementById(ddid);
    sel.innerHTML = "";
	for(var i = 0; i < outlist.length; i++) {
		var el = document.createElement("option");
		el.textContent = outlist[i].location;
		el.value = outlist[i].fips;
		sel.appendChild(el);
	}
} 
// popCtyDrop

function regionCOL(regnum) {
//regionCOL  returns te fips codes and color codes for a input region number
//Color Pallettes
//Geographic Regions  DOLA Reds
//Management Regions DOLA Purples
//Metro Regions DOLA tree greens
//Micro Regions DOLA Left Mountain Greens
//Denver DOLA Rignh Mountain Teal
	var fips = []; 
if(regnum == 0) {fips.push({'fips' : ['001', '003', '005', '007', '009', '011', '013', '014', '015', '017', '019', '021', '023', '025', '027', 
									'029', '031', '033', '035', '037', '039', '041', '043', '045', '047', '049', '051', '053', '055', '057', 
									'059', '061', '063', '065', '067', '069', '071', '073', '075', '077', '079', '081', '083', '085', '087', 
									'089', '091', '093', '095', '097', '099', '101', '103', '105', '107', '109', '111', '113', '115', '117', 
									'119', '121', '123', '125'], 'color' : ''})};
if(regnum == 1) {fips.push({'fips' : ['015', '019', '027', '043', '047', '055', '065', '071', '093'], 'color' : '#EE6677'})};
if(regnum == 2) {fips.push({'fips' : ['009', '011', '017', '025', '039', '061', '063', '073', '075', '087', '089', '095', '099', '115', '121', '125'],  'color' : '#228833'})};
if(regnum == 3) {fips.push({'fips' : ['001', '005', '013', '014', '031', '035', '041', '059', '069', '101','119','123'],  'color' : '#4477AA'})};
if(regnum == 4) {fips.push({'fips' : ['003', '021', '023', '079', '105', '109'],  'color' : '#CCBB44'})};
if(regnum == 5) {fips.push({'fips' : ['007', '029', '033', '037', '045', '049', '051', '053', '057', '067', '077', '081', '083', '085', '091', '097', '103', '107', '111', '113', '117'],  'color' : '#66CCEE'})};
if(regnum == 6) {fips.push({'fips' : ['075','087','095','115','121','125'], 'color' : '#AA3377'})};
if(regnum == 7) {fips.push({'fips' : ['069','123'],  'color' : '#BBBBBB'})};
if(regnum == 8) {fips.push({'fips' : ['001','005','013','014','019','031','035','047','059'], 'color' : '#505050'})};
if(regnum == 9) {fips.push({'fips' : ['041','093','119'],  'color' : '#44AA99'})};
if(regnum == 10) {fips.push({'fips' : ['017','039','063','073'], 'color' : '#117733'})};
if(regnum == 11) {fips.push({'fips' : ['009','011','025','061','089','099'],  'color' : '#332288'})};
if(regnum == 12) {fips.push({'fips' : ['101'],  'color' : '#DDCC77'})};
if(regnum == 13) {fips.push({'fips' : ['003','021','023','079','105','109'],  'color' : '#999933'})};
if(regnum == 14) {fips.push({'fips' : ['007','033','067','083','111'],  'color' : '#CC6677'})};
if(regnum == 15) {fips.push({'fips' : ['029','051','053','085','091','113'], 'color' : '#F8F8F8'})};
if(regnum == 16) {fips.push({'fips' : ['045','077','081','103'],  'color' : '#AA4499'})};
if(regnum == 17) {fips.push({'fips' : ['037','049','057','097','107','117'], 'color' : '#DDDDDD'})};
if(regnum == 18) {fips.push({'fips' : ['015','027','043','065'], 'color' : '#BBCC33'})};
if(regnum == 19) {fips.push({'fips' : ['055','071'],  'color' : '#AAAA00'})};
if(regnum == 20) {fips.push({'fips' : ['013'], 'color' : '#77AADD'})};
if(regnum == 21) {fips.push({'fips' : ['041','119'], 'color' : '#EE8866'})};
if(regnum == 22) {fips.push({'fips' : ['001','005','014','019','031','035','039','047','059','093'],  'color' : '#EEDD88'})};
if(regnum == 23) {fips.push({'fips' : ['069'],  'color' : '#FFAABB'})};
if(regnum == 24) {fips.push({'fips' : ['077'],  'color' : '#99DDFF'})};
if(regnum == 25) {fips.push({'fips' : ['123'],  'color' : '#44BB99'})};
if(regnum == 26) {fips.push({'fips' : ['101'],  'color' : '#DDCC77'})};
if(regnum == 27) {fips.push({'fips' : ['117'], 'color' : '#E69F00'})};
if(regnum == 28) {fips.push({'fips' : ['043'],  'color' : '#56B4E9'})};
if(regnum == 29) {fips.push({'fips' : ['081'],  'color' : '#009E73'})};
if(regnum == 30) {fips.push({'fips' : ['067'],  'color' : '#F0E442'})};
if(regnum == 31) {fips.push({'fips' : ['037'],  'color' : '#0072B2'})};
if(regnum == 32) {fips.push({'fips' : ['087'],  'color' : '#D55E00'})};
if(regnum == 33) {fips.push({'fips' : ['045','097'],  'color' : '#CC79A7'})};
if(regnum == 34) {fips.push({'fips' : ['085','091'],  'color' : '#696969'})};
if(regnum == 35) {fips.push({'fips' : ['107'], 'color' : '#808080'})};
if(regnum == 36) {fips.push({'fips' : ['075'],  'color' : '#A9A9A9'})};
if(regnum == 37) {fips.push({'fips' : ['001', '005', '014', '031', '035', '059'],  'color' : '#505050'})};
if(regnum == 38) {fips.push({'fips' : ['001', '005', '013', '014', '031', '035', '059'], 'color' : '#C0C0C0'})};
if(regnum == 39) {fips.push({'fips' : ['001', '005', '013', '014', '031', '035', '059', '123'],  'color' : '#D3D3D3'})};

	 return fips;
	};
// regionCOL

function update_link(name) {
	//Returns list of Google Links for each selection
link_list = [
{'location' :  'Adams County', 'name' : ['Adams County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB']},
{'location' :  'Alamosa County', 'name' : ['Alamosa County'], 'id' : ['1C1kxxpLx10Pnc8ubwvdW5xNfDZJCI765']},
{'location' :  'Arapahoe County', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Archuleta County', 'name' : ['Archuleta County'], 'id' : ['1COZ7s7L7MG1SEZhYC95FB-gYejWuVsKX']},
{'location' :  'Baca County', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Bent County', 'name' : ['Bent County'], 'id' : ['1JxcT9KKBNoUbyfqllLTTC77MTmMjQuMT']},
{'location' :  'Boulder County', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Broomfield County', 'name' : ['Broomfield County'], 'id' : ['1Zh3nb5R_4C70sg-cPjIIOJtcEj-NiCux']},
{'location' :  'Chaffee County', 'name' : ['Chaffee County'], 'id' : ['1zAomW6Vt72Xq0IYLd9dzbc-fCvHADDf_']},
{'location' :  'Cheyenne County', 'name' : ['Cheyenne County'], 'id' : ['11tnoPPgawliZK0nFCjbbebQbjS1frMuz']},
{'location' :  'Clear Creek County', 'name' : ['Clear Creek County'], 'id' : ['13UlmkXwxDSuAxkEI9ZV5fh8rOGriclnb']},
{'location' :  'Conejos County', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'Costilla County', 'name' : ['Costilla County'], 'id' : ['163LoYWBRsc_HJCysJqXEq1DFilSoNOpT']},
{'location' :  'Crowley County', 'name' : ['Crowley County'], 'id' : ['1omMPZgxzpnaxlg41mwf-p0A4lRhBM6h2']},
{'location' :  'Custer County', 'name' : ['Custer County'], 'id' : ['1FCATXowaPpPszlyrFcubOx8-TR9Uq1Cj']},
{'location' :  'Delta County', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Denver County', 'name' : ['Denver County'], 'id' : ['1pbhdHu4b0OUc_sHiQep32mxF0IpioQz1']},
{'location' :  'Dolores County', 'name' : ['Dolores County'], 'id' : ['142ZruC7G5KGOWDqXXOGwaqusZBWaNi77']},
{'location' :  'Douglas County', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Eagle County', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Elbert County', 'name' : ['Elbert County'], 'id' : ['1_oLi8LIOscyDjzgb1Qxqxb55QoK4tKo-']},
{'location' :  'El Paso County', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Fremont County', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'Garfield County', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Gilpin County', 'name' : ['Gilpin County'], 'id' : ['1cHkYqYaqylisY6Wginc5DgdKD6iJgy4s']},
{'location' :  'Grand County', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'Gunnison County', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Hinsdale County', 'name' : ['Hinsdale County'], 'id' : ['1QI-4xAOHtQ5GnuJ4kfgzTp49usvdp_0r']},
{'location' :  'Huerfano County', 'name' : ['Huerfano County'], 'id' : ['1c-PS6c2F_bIu4Jn2iO76S718jjzQzeNw']},
{'location' :  'Jackson County', 'name' : ['Jackson County'], 'id' : ['176c44gmOChQqHNi35e1HNySGU4lRO03p']},
{'location' :  'Jefferson County', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Kiowa County', 'name' : ['Kiowa County'], 'id' : ['1i5CN_SJQHfdaU6cVac3lu4ogvd8oKxX-']},
{'location' :  'Kit Carson County', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Lake County', 'name' : ['Lake County'], 'id' : ['1CAJj-J94QqfpHTs8QYehSyN287TaqDwo']},
{'location' :  'La Plata County', 'name' : ['La Plata County'], 'id' : ['1dsvobTNDWG16FJxBImgItMnAHMrJD3zY']},
{'location' :  'Larimer County', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Las Animas County', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Lincoln County', 'name' : ['Lincoln County'], 'id' : ['10RDxCVgdstSTUHF0LaJ0kPAI336ubx7w']},
{'location' :  'Logan County', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Mesa County', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Mineral County', 'name' : ['Mineral County'], 'id' : ['1aimliPIlX6MBriKYvhZxtNNwvfzBzvUn']},
{'location' :  'Moffat County', 'name' : ['Moffat County'], 'id' : ['13NeZdU10joDIhde9Si-pmBAxaym15t89']},
{'location' :  'Montezuma County', 'name' : ['Montezuma County'], 'id' : ['1R9OOaVy5Ri6NaS07n2WHmq3FHIzozkHz']},
{'location' :  'Montrose County', 'name' : ['Montrose County'], 'id' : ['1LZATMj9LkQqUsuKJUIeyEvnpMIgO-Pxm']},
{'location' :  'Morgan County', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Otero County', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Ouray County', 'name' : ['Ouray County'], 'id' : ['1xkyKXPb-DnUn3hdFb8-b91xDTQWUhZTD']},
{'location' :  'Park County', 'name' : ['Park County'], 'id' : ['1uEA2l-as4O0Z16dz3ZWNnCAO7O_PsFrl']},
{'location' :  'Phillips County', 'name' : ['Phillips County'], 'id' : ['1shQk_skdlIPOn5qg3J2Zp29dAD87j76d']},
{'location' :  'Pitkin County', 'name' : ['Pitkin County'], 'id' : ['1wQwuA2OdP4X_2CUBvRkie8LEWCJZWAga']},
{'location' :  'Prowers County', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'Pueblo County', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Rio Blanco County', 'name' : ['Rio Blanco County'], 'id' : ['1PllRSNG-bPxLZtfnrm_PUr1QKs0YavEG']},
{'location' :  'Rio Grande County', 'name' : ['Rio Grande County'], 'id' : ['1Fbrx6rk1QKkJQVnr5x364rQAj8fNPt94']},
{'location' :  'Routt County', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Saguache County', 'name' : ['Saguache County'], 'id' : ['1gp5P6S24R-OxzYL2unWP_Lg7Ms7-k9If']},
{'location' :  'San Juan County', 'name' : ['San Juan County'], 'id' : ['1qmO8QKeGnimD4FH3_gXsEi24GtiW5Joo']},
{'location' :  'San Miguel County', 'name' : ['San Miguel County'], 'id' : ['12Ug-wp2YQzHtERm42HbQXji9FFUGHqsy']},
{'location' :  'Sedgwick County', 'name' : ['Sedgwick County'], 'id' : ['1OF4Vue6rmUKZWdUv8TI49CDNIBy-Wg4x']},
{'location' :  'Summit County', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Teller County', 'name' : ['Teller County'], 'id' : ['1XHAgazVcLElMD3ODCdr27jf9NN5Qgv3D']},
{'location' :  'Washington County', 'name' : ['Washington County'], 'id' : ['1A-MJZ698XW_k2CLe7_acPyiFGmiGxqk6']},
{'location' :  'Weld County', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Yuma County', 'name' : ['Yuma County'], 'id' : ['1oAs5pzHcSoKNbhinr99o6JLcYnogoO0w']},
{'location' :  'Aguilar', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Akron', 'name' : ['Washington County'], 'id' : ['1A-MJZ698XW_k2CLe7_acPyiFGmiGxqk6']},
{'location' :  'Alamosa', 'name' : ['Alamosa County'], 'id' : ['1C1kxxpLx10Pnc8ubwvdW5xNfDZJCI765']},
{'location' :  'Alma', 'name' : ['Park County'], 'id' : ['1uEA2l-as4O0Z16dz3ZWNnCAO7O_PsFrl']},
{'location' :  'Antonito', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'Arriba', 'name' : ['Lincoln County'], 'id' : ['10RDxCVgdstSTUHF0LaJ0kPAI336ubx7w']},
{'location' :  'Arvada', 'name' : ['Adams County', 'Jefferson County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB', '1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Aspen', 'name' : ['Pitkin County'], 'id' : ['1wQwuA2OdP4X_2CUBvRkie8LEWCJZWAga']},
{'location' :  'Ault', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Aurora', 'name' : ['Adams County', 'Arapahoe County', 'Douglas County',], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB', '1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH', '1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY',]},
{'location' :  'Avon', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Basalt', 'name' : ['Eagle County', 'Pitkin County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu', '1wQwuA2OdP4X_2CUBvRkie8LEWCJZWAga']},
{'location' :  'Bayfield', 'name' : ['La Plata County'], 'id' : ['1dsvobTNDWG16FJxBImgItMnAHMrJD3zY']},
{'location' :  'Bennett', 'name' : ['Adams County', 'Arapahoe County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB', '1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Berthoud', 'name' : ['Larimer County', 'Weld County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Bethune', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Black Hawk', 'name' : ['Gilpin County'], 'id' : ['1cHkYqYaqylisY6Wginc5DgdKD6iJgy4s']},
{'location' :  'Blanca', 'name' : ['Costilla County'], 'id' : ['163LoYWBRsc_HJCysJqXEq1DFilSoNOpT']},
{'location' :  'Blue River', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Bonanza', 'name' : ['Saguache County'], 'id' : ['1gp5P6S24R-OxzYL2unWP_Lg7Ms7-k9If']},
{'location' :  'Boone', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Boulder', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Bow Mar', 'name' : ['Arapahoe County', 'Jefferson County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH', '1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Branson', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Breckenridge', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Brighton', 'name' : ['Adams County', 'Weld County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Brookside', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'Broomfield', 'name' : ['Broomfield County'], 'id' : ['1Zh3nb5R_4C70sg-cPjIIOJtcEj-NiCux']},
{'location' :  'Brush', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Buena Vista', 'name' : ['Chaffee County'], 'id' : ['1zAomW6Vt72Xq0IYLd9dzbc-fCvHADDf_']},
{'location' :  'Burlington', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Calhan', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Campo', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Cañon City', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'Carbondale', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Castle Pines North', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Castle Rock', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Cedaredge', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Centennial', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Center', 'name' : ['Rio Grande County', 'Saguache County'], 'id' : ['1Fbrx6rk1QKkJQVnr5x364rQAj8fNPt94', '1gp5P6S24R-OxzYL2unWP_Lg7Ms7-k9If']},
{'location' :  'Central City', 'name' : ['Clear Creek County', 'Gilpin County'], 'id' : ['13UlmkXwxDSuAxkEI9ZV5fh8rOGriclnb', '1cHkYqYaqylisY6Wginc5DgdKD6iJgy4s']},
{'location' :  'Cheraw', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Cherry Hills Village', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Cheyenne Wells', 'name' : ['Cheyenne County'], 'id' : ['11tnoPPgawliZK0nFCjbbebQbjS1frMuz']},
{'location' :  'City of Creede', 'name' : ['Mineral County'], 'id' : ['1aimliPIlX6MBriKYvhZxtNNwvfzBzvUn']},
{'location' :  'Coal Creek', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'Cokedale', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Collbran', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Colorado Springs', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Columbine Valley', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Commerce City', 'name' : ['Adams County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB']},
{'location' :  'Cortez', 'name' : ['Montezuma County'], 'id' : ['1R9OOaVy5Ri6NaS07n2WHmq3FHIzozkHz']},
{'location' :  'Craig', 'name' : ['Moffat County'], 'id' : ['13NeZdU10joDIhde9Si-pmBAxaym15t89']},
{'location' :  'Crawford', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Crested Butte', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Crestone', 'name' : ['Saguache County'], 'id' : ['1gp5P6S24R-OxzYL2unWP_Lg7Ms7-k9If']},
{'location' :  'Cripple Creek', 'name' : ['Teller County'], 'id' : ['1XHAgazVcLElMD3ODCdr27jf9NN5Qgv3D']},
{'location' :  'Crook', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Crowley', 'name' : ['Crowley County'], 'id' : ['1omMPZgxzpnaxlg41mwf-p0A4lRhBM6h2']},
{'location' :  'Dacono', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'De Beque', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Deer Trail', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Del Norte', 'name' : ['Rio Grande County'], 'id' : ['1Fbrx6rk1QKkJQVnr5x364rQAj8fNPt94']},
{'location' :  'Delta', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Denver', 'name' : ['Denver County'], 'id' : ['1pbhdHu4b0OUc_sHiQep32mxF0IpioQz1']},
{'location' :  'Dillon', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Dinosaur', 'name' : ['Moffat County'], 'id' : ['13NeZdU10joDIhde9Si-pmBAxaym15t89']},
{'location' :  'Dolores', 'name' : ['Montezuma County'], 'id' : ['1R9OOaVy5Ri6NaS07n2WHmq3FHIzozkHz']},
{'location' :  'Dove Creek', 'name' : ['Dolores County'], 'id' : ['142ZruC7G5KGOWDqXXOGwaqusZBWaNi77']},
{'location' :  'Durango', 'name' : ['La Plata County'], 'id' : ['1dsvobTNDWG16FJxBImgItMnAHMrJD3zY']},
{'location' :  'Eads', 'name' : ['Kiowa County'], 'id' : ['1i5CN_SJQHfdaU6cVac3lu4ogvd8oKxX-']},
{'location' :  'Eagle', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Eaton', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Eckley', 'name' : ['Yuma County'], 'id' : ['1oAs5pzHcSoKNbhinr99o6JLcYnogoO0w']},
{'location' :  'Edgewater', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Elizabeth', 'name' : ['Elbert County'], 'id' : ['1_oLi8LIOscyDjzgb1Qxqxb55QoK4tKo-']},
{'location' :  'Empire', 'name' : ['Clear Creek County'], 'id' : ['13UlmkXwxDSuAxkEI9ZV5fh8rOGriclnb']},
{'location' :  'Englewood', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Erie', 'name' : ['Boulder County', 'Weld County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Estes Park', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Evans', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Fairplay', 'name' : ['Park County'], 'id' : ['1uEA2l-as4O0Z16dz3ZWNnCAO7O_PsFrl']},
{'location' :  'Federal Heights', 'name' : ['Adams County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB']},
{'location' :  'Firestone', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Flagler', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Fleming', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Florence', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'Fort Collins', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Fort Lupton', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Fort Morgan', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Fountain', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Fowler', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Foxfield', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Fraser', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'Frederick', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Frisco', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Fruita', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Garden', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Genoa', 'name' : ['Lincoln County'], 'id' : ['10RDxCVgdstSTUHF0LaJ0kPAI336ubx7w']},
{'location' :  'Georgetown', 'name' : ['Clear Creek County'], 'id' : ['13UlmkXwxDSuAxkEI9ZV5fh8rOGriclnb']},
{'location' :  'Gilcrest', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Glendale', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Glenwood Springs', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Golden', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Granada', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'Granby', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'Grand Junction', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Grand Lake', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'Greeley', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Green Mountain Falls', 'name' : ['El Paso County', 'Teller County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd', '1XHAgazVcLElMD3ODCdr27jf9NN5Qgv3D']},
{'location' :  'Greenwood Village', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Grover', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Gunnison', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Gypsum', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Hartman', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'Haswell', 'name' : ['Kiowa County'], 'id' : ['1i5CN_SJQHfdaU6cVac3lu4ogvd8oKxX-']},
{'location' :  'Haxtun', 'name' : ['Phillips County'], 'id' : ['1shQk_skdlIPOn5qg3J2Zp29dAD87j76d']},
{'location' :  'Hayden', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Hillrose', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Holly', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'Holyoke', 'name' : ['Phillips County'], 'id' : ['1shQk_skdlIPOn5qg3J2Zp29dAD87j76d']},
{'location' :  'Hooper', 'name' : ['Alamosa County'], 'id' : ['1C1kxxpLx10Pnc8ubwvdW5xNfDZJCI765']},
{'location' :  'Hot Sulphur Springs', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'Hotchkiss', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Hudson', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Hugo', 'name' : ['Lincoln County'], 'id' : ['10RDxCVgdstSTUHF0LaJ0kPAI336ubx7w']},
{'location' :  'Idaho Springs', 'name' : ['Clear Creek County'], 'id' : ['13UlmkXwxDSuAxkEI9ZV5fh8rOGriclnb']},
{'location' :  'Ignacio', 'name' : ['La Plata County'], 'id' : ['1dsvobTNDWG16FJxBImgItMnAHMrJD3zY']},
{'location' :  'Iliff', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Jamestown', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Johnstown', 'name' : ['Larimer County', 'Weld County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Julesburg', 'name' : ['Sedgwick County'], 'id' : ['1OF4Vue6rmUKZWdUv8TI49CDNIBy-Wg4x']},
{'location' :  'Keenesburg', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Kersey', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Kim', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Kiowa', 'name' : ['Elbert County'], 'id' : ['1_oLi8LIOscyDjzgb1Qxqxb55QoK4tKo-']},
{'location' :  'Kit Carson', 'name' : ['Cheyenne County'], 'id' : ['11tnoPPgawliZK0nFCjbbebQbjS1frMuz']},
{'location' :  'Kremmling', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'La Jara', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'La Junta', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'La Salle', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'La Veta', 'name' : ['Huerfano County'], 'id' : ['1c-PS6c2F_bIu4Jn2iO76S718jjzQzeNw']},
{'location' :  'Lafayette', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Lake', 'name' : ['Hinsdale County'], 'id' : ['1QI-4xAOHtQ5GnuJ4kfgzTp49usvdp_0r']},
{'location' :  'Lakeside', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Lakewood', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Lamar', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'Larkspur', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Las Animas', 'name' : ['Bent County'], 'id' : ['1JxcT9KKBNoUbyfqllLTTC77MTmMjQuMT']},
{'location' :  'Leadville', 'name' : ['Lake County'], 'id' : ['1CAJj-J94QqfpHTs8QYehSyN287TaqDwo']},
{'location' :  'Limon', 'name' : ['Lincoln County'], 'id' : ['10RDxCVgdstSTUHF0LaJ0kPAI336ubx7w']},
{'location' :  'Littleton', 'name' : ['Arapahoe County', 'Douglas County', 'Jefferson County',], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH', '1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY', '1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW',]},
{'location' :  'Lochbuie', 'name' : ['Adams County', 'Weld County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Log Lane Village', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Lone Tree', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Longmont', 'name' : ['Boulder County', 'Weld County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Louisville', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Loveland', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Lyons', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Manassa', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'Mancos', 'name' : ['Montezuma County'], 'id' : ['1R9OOaVy5Ri6NaS07n2WHmq3FHIzozkHz']},
{'location' :  'Manitou Springs', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Manzanola', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Marble', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Mead', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Meeker', 'name' : ['Rio Blanco County'], 'id' : ['1PllRSNG-bPxLZtfnrm_PUr1QKs0YavEG']},
{'location' :  'Merino', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Milliken', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Minturn', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Moffat', 'name' : ['Saguache County'], 'id' : ['1gp5P6S24R-OxzYL2unWP_Lg7Ms7-k9If']},
{'location' :  'Monte Vista', 'name' : ['Rio Grande County'], 'id' : ['1Fbrx6rk1QKkJQVnr5x364rQAj8fNPt94']},
{'location' :  'Montezuma', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Montrose', 'name' : ['Montrose County'], 'id' : ['1LZATMj9LkQqUsuKJUIeyEvnpMIgO-Pxm']},
{'location' :  'Monument', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Morrison', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Mount Crested Butte', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Mountain View', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Mountain Village', 'name' : ['San Miguel County'], 'id' : ['12Ug-wp2YQzHtERm42HbQXji9FFUGHqsy']},
{'location' :  'Naturita', 'name' : ['Montrose County'], 'id' : ['1LZATMj9LkQqUsuKJUIeyEvnpMIgO-Pxm']},
{'location' :  'Nederland', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'New Castle', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Northglenn', 'name' : ['Adams County', 'Weld County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Norwood', 'name' : ['San Miguel County'], 'id' : ['12Ug-wp2YQzHtERm42HbQXji9FFUGHqsy']},
{'location' :  'Nucla', 'name' : ['Montrose County'], 'id' : ['1LZATMj9LkQqUsuKJUIeyEvnpMIgO-Pxm']},
{'location' :  'Nunn', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Oak Creek', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Olathe', 'name' : ['Montrose County'], 'id' : ['1LZATMj9LkQqUsuKJUIeyEvnpMIgO-Pxm']},
{'location' :  'Olney Springs', 'name' : ['Crowley County'], 'id' : ['1omMPZgxzpnaxlg41mwf-p0A4lRhBM6h2']},
{'location' :  'Ophir', 'name' : ['San Miguel County'], 'id' : ['12Ug-wp2YQzHtERm42HbQXji9FFUGHqsy']},
{'location' :  'Orchard', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Ordway', 'name' : ['Crowley County'], 'id' : ['1omMPZgxzpnaxlg41mwf-p0A4lRhBM6h2']},
{'location' :  'Otis', 'name' : ['Washington County'], 'id' : ['1A-MJZ698XW_k2CLe7_acPyiFGmiGxqk6']},
{'location' :  'Ouray', 'name' : ['Ouray County'], 'id' : ['1xkyKXPb-DnUn3hdFb8-b91xDTQWUhZTD']},
{'location' :  'Ovid', 'name' : ['Sedgwick County'], 'id' : ['1OF4Vue6rmUKZWdUv8TI49CDNIBy-Wg4x']},
{'location' :  'Pagosa Springs', 'name' : ['Archuleta County'], 'id' : ['1COZ7s7L7MG1SEZhYC95FB-gYejWuVsKX']},
{'location' :  'Palisade', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Palmer Lake', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Paoli', 'name' : ['Phillips County'], 'id' : ['1shQk_skdlIPOn5qg3J2Zp29dAD87j76d']},
{'location' :  'Paonia', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Parachute', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Parker', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Peetz', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Pierce', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Pitkin', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Platteville', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Poncha Springs', 'name' : ['Chaffee County'], 'id' : ['1zAomW6Vt72Xq0IYLd9dzbc-fCvHADDf_']},
{'location' :  'Pritchett', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Pueblo', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Ramah', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Rangely', 'name' : ['Rio Blanco County'], 'id' : ['1PllRSNG-bPxLZtfnrm_PUr1QKs0YavEG']},
{'location' :  'Raymer (New Raymer)', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Red Cliff', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Rico', 'name' : ['Dolores County'], 'id' : ['142ZruC7G5KGOWDqXXOGwaqusZBWaNi77']},
{'location' :  'Ridgway', 'name' : ['Ouray County'], 'id' : ['1xkyKXPb-DnUn3hdFb8-b91xDTQWUhZTD']},
{'location' :  'Rifle', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Rockvale', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'Rocky Ford', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Romeo', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'Rye', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Saguache', 'name' : ['Saguache County'], 'id' : ['1gp5P6S24R-OxzYL2unWP_Lg7Ms7-k9If']},
{'location' :  'Salida', 'name' : ['Chaffee County'], 'id' : ['1zAomW6Vt72Xq0IYLd9dzbc-fCvHADDf_']},
{'location' :  'San Luis', 'name' : ['Costilla County'], 'id' : ['163LoYWBRsc_HJCysJqXEq1DFilSoNOpT']},
{'location' :  'Sanford', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'Sawpit', 'name' : ['San Miguel County'], 'id' : ['12Ug-wp2YQzHtERm42HbQXji9FFUGHqsy']},
{'location' :  'Sedgwick', 'name' : ['Sedgwick County'], 'id' : ['1OF4Vue6rmUKZWdUv8TI49CDNIBy-Wg4x']},
{'location' :  'Seibert', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Severance', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Sheridan', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Sheridan Lake', 'name' : ['Kiowa County'], 'id' : ['1i5CN_SJQHfdaU6cVac3lu4ogvd8oKxX-']},
{'location' :  'Silt', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Silver Cliff', 'name' : ['Custer County'], 'id' : ['1FCATXowaPpPszlyrFcubOx8-TR9Uq1Cj']},
{'location' :  'Silver Plume', 'name' : ['Clear Creek County'], 'id' : ['13UlmkXwxDSuAxkEI9ZV5fh8rOGriclnb']},
{'location' :  'Silverthorne', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Silverton', 'name' : ['San Juan County'], 'id' : ['1qmO8QKeGnimD4FH3_gXsEi24GtiW5Joo']},
{'location' :  'Simla', 'name' : ['Elbert County'], 'id' : ['1_oLi8LIOscyDjzgb1Qxqxb55QoK4tKo-']},
{'location' :  'Snowmass Village', 'name' : ['Pitkin County'], 'id' : ['1wQwuA2OdP4X_2CUBvRkie8LEWCJZWAga']},
{'location' :  'South Fork', 'name' : ['Rio Grande County'], 'id' : ['1Fbrx6rk1QKkJQVnr5x364rQAj8fNPt94']},
{'location' :  'Springfield', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Starkville', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Steamboat Springs', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Sterling', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Stratton', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Sugar', 'name' : ['Crowley County'], 'id' : ['1omMPZgxzpnaxlg41mwf-p0A4lRhBM6h2']},
{'location' :  'Superior', 'name' : ['Boulder County', 'Jefferson County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC', '1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Swink', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Telluride', 'name' : ['San Miguel County'], 'id' : ['12Ug-wp2YQzHtERm42HbQXji9FFUGHqsy']},
{'location' :  'Thornton', 'name' : ['Adams County', 'Weld County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Timnath', 'name' : ['Larimer County', 'Weld County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Trinidad', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Two Buttes', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Vail', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Victor', 'name' : ['Teller County'], 'id' : ['1XHAgazVcLElMD3ODCdr27jf9NN5Qgv3D']},
{'location' :  'Vilas', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Vona', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Walden', 'name' : ['Jackson County'], 'id' : ['176c44gmOChQqHNi35e1HNySGU4lRO03p']},
{'location' :  'Walsenburg', 'name' : ['Huerfano County'], 'id' : ['1c-PS6c2F_bIu4Jn2iO76S718jjzQzeNw']},
{'location' :  'Walsh', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Ward', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Wellington', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Westcliffe', 'name' : ['Custer County'], 'id' : ['1FCATXowaPpPszlyrFcubOx8-TR9Uq1Cj']},
{'location' :  'Westminster', 'name' : ['Adams County', 'Jefferson County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB', '1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Wheat Ridge', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Wiggins', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Wiley', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'Williamsburg', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'Windsor', 'name' : ['Larimer County', 'Weld County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw', '18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Winter Park', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'Woodland Park', 'name' : ['Teller County'], 'id' : ['1XHAgazVcLElMD3ODCdr27jf9NN5Qgv3D']},
{'location' :  'Wray', 'name' : ['Yuma County'], 'id' : ['1oAs5pzHcSoKNbhinr99o6JLcYnogoO0w']},
{'location' :  'Yampa', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Yuma', 'name' : ['Yuma County'], 'id' : ['1oAs5pzHcSoKNbhinr99o6JLcYnogoO0w']},
{'location' :  'North Aurora CCD', 'name' : ['Adams County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB']},
{'location' :  'East Adams CCD', 'name' : ['Adams County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB']},
{'location' :  'Commerce City CCD', 'name' : ['Adams County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB']},
{'location' :  'Brighton CCD', 'name' : ['Adams County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB']},
{'location' :  'West Adams CCD', 'name' : ['Adams County'], 'id' : ['1QyhNdbc7XFkCYxZH-8xb9rx4rXGVzWXB']},
{'location' :  'Alamosa CCD', 'name' : ['Alamosa County'], 'id' : ['1C1kxxpLx10Pnc8ubwvdW5xNfDZJCI765']},
{'location' :  'Mosca-Hooper CCD', 'name' : ['Alamosa County'], 'id' : ['1C1kxxpLx10Pnc8ubwvdW5xNfDZJCI765']},
{'location' :  'Southwest Arapahoe CCD', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'East Arapahoe CCD', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'South Aurora CCD', 'name' : ['Arapahoe County'], 'id' : ['1sHMAbg8jkPXNG3lkk-4pjB--xPev4BWH']},
{'location' :  'Pagosa Springs CCD', 'name' : ['Archuleta County'], 'id' : ['1COZ7s7L7MG1SEZhYC95FB-gYejWuVsKX']},
{'location' :  'Campo CCD', 'name' : ['Archuleta County'], 'id' : ['1COZ7s7L7MG1SEZhYC95FB-gYejWuVsKX']},
{'location' :  'Springfield CCD', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Walsh CCD', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Pritchett CCD', 'name' : ['Baca County'], 'id' : ['1orAhDHByvvjQtIihG2ENDs_HL2Y9F3pG']},
{'location' :  'Las Animas CCD', 'name' : ['Bent County'], 'id' : ['1JxcT9KKBNoUbyfqllLTTC77MTmMjQuMT']},
{'location' :  'McClave CCD', 'name' : ['Bent County'], 'id' : ['1JxcT9KKBNoUbyfqllLTTC77MTmMjQuMT']},
{'location' :  'South Bent CCD', 'name' : ['Bent County'], 'id' : ['1JxcT9KKBNoUbyfqllLTTC77MTmMjQuMT']},
{'location' :  'Boulder CCD', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Lafayette-Louisville CCD', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Bald Mountain CCD', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Longmont CCD', 'name' : ['Boulder County'], 'id' : ['14PoBY-qX0lWSq_S5ZqM0Op5tYHwfESMC']},
{'location' :  'Broomfield CCD', 'name' : ['Broomfield County'], 'id' : ['1Zh3nb5R_4C70sg-cPjIIOJtcEj-NiCux']},
{'location' :  'Salida CCD', 'name' : ['Chaffee County'], 'id' : ['1zAomW6Vt72Xq0IYLd9dzbc-fCvHADDf_']},
{'location' :  'Buena Vista CCD', 'name' : ['Chaffee County'], 'id' : ['1zAomW6Vt72Xq0IYLd9dzbc-fCvHADDf_']},
{'location' :  'Kit Carson CCD', 'name' : ['Cheyenne County'], 'id' : ['11tnoPPgawliZK0nFCjbbebQbjS1frMuz']},
{'location' :  'Cheyenne Wells CCD', 'name' : ['Cheyenne County'], 'id' : ['11tnoPPgawliZK0nFCjbbebQbjS1frMuz']},
{'location' :  'Georgetown CCD', 'name' : ['Clear Creek County'], 'id' : ['13UlmkXwxDSuAxkEI9ZV5fh8rOGriclnb']},
{'location' :  'Idaho Springs CCD', 'name' : ['Clear Creek County'], 'id' : ['13UlmkXwxDSuAxkEI9ZV5fh8rOGriclnb']},
{'location' :  'La Jara CCD', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'Manassa CCD', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'Antonito CCD', 'name' : ['Conejos County'], 'id' : ['1o3RK4X3-4FNSs4SUkCJ4QUHI9jYnCs6R']},
{'location' :  'Blanca CCD', 'name' : ['Costilla County'], 'id' : ['163LoYWBRsc_HJCysJqXEq1DFilSoNOpT']},
{'location' :  'San Luis CCD', 'name' : ['Costilla County'], 'id' : ['163LoYWBRsc_HJCysJqXEq1DFilSoNOpT']},
{'location' :  'Sugar City CCD', 'name' : ['Crowley County'], 'id' : ['1omMPZgxzpnaxlg41mwf-p0A4lRhBM6h2']},
{'location' :  'Ordway CCD', 'name' : ['Crowley County'], 'id' : ['1omMPZgxzpnaxlg41mwf-p0A4lRhBM6h2']},
{'location' :  'Westcliffe CCD', 'name' : ['Custer County'], 'id' : ['1FCATXowaPpPszlyrFcubOx8-TR9Uq1Cj']},
{'location' :  'Delta CCD', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Cedaredge CCD', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Hotchkiss CCD', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Paonia CCD', 'name' : ['Delta County'], 'id' : ['1P_GNTSRuZhNbdlaaU9GwLRkrRjrxQMu0']},
{'location' :  'Denver CCD', 'name' : ['Denver County'], 'id' : ['1pbhdHu4b0OUc_sHiQep32mxF0IpioQz1']},
{'location' :  'Rico CCD', 'name' : ['Dolores County'], 'id' : ['142ZruC7G5KGOWDqXXOGwaqusZBWaNi77']},
{'location' :  'Dove Creek CCD', 'name' : ['Dolores County'], 'id' : ['142ZruC7G5KGOWDqXXOGwaqusZBWaNi77']},
{'location' :  'Sedalia CCD', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Parker CCD', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Castle Rock CCD', 'name' : ['Douglas County'], 'id' : ['1Paq-DzyxFFYqBo182uwILR0RSTRaz2gY']},
{'location' :  'Minturn-Red Cliff CCD', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Eagle-Gypsum CCD', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Basalt CCD', 'name' : ['Eagle County'], 'id' : ['17Orr8AhTAHqFJw05W7yHlp6KYzCkJBSu']},
{'location' :  'Elizabeth CCD', 'name' : ['Elbert County'], 'id' : ['1_oLi8LIOscyDjzgb1Qxqxb55QoK4tKo-']},
{'location' :  'Simla CCD', 'name' : ['Elbert County'], 'id' : ['1_oLi8LIOscyDjzgb1Qxqxb55QoK4tKo-']},
{'location' :  'Black Forest-Peyton CCD', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Southeastern El Paso CCD', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Cheyenne Mountain CCD', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Colorado Springs CCD', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Monument CCD', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Pikes Peak CCD', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Elsmere CCD', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Fountain CCD', 'name' : ['El Paso County'], 'id' : ['1YiM0n8h9qNZHVdX1sxI7NKoGoins2fZd']},
{'location' :  'Canyon City CCD', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'Florence CCD', 'name' : ['Fremont County'], 'id' : ['1NeWDlMra0NDtutQsKlx4wih1j70EuZv-']},
{'location' :  'West Garfield CCD', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Glenwood Springs CCD', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'New Castle CCD', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Rifle CCD', 'name' : ['Garfield County'], 'id' : ['1p4dhb4e5OhkbBAt3ZhXyBcnDRjCeoVZo']},
{'location' :  'Central City CCD', 'name' : ['Gilpin County'], 'id' : ['1cHkYqYaqylisY6Wginc5DgdKD6iJgy4s']},
{'location' :  'Granby CCD', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'Kremmling CCD', 'name' : ['Grand County'], 'id' : ['12BNL4b-Wm7B7hGGyo8NFjIFdZtU5VNhb']},
{'location' :  'Gunnison CCD', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Somerset CCD', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Crested Butte CCD', 'name' : ['Gunnison County'], 'id' : ['1Z4-oyLAbcwS2b4EkpkeYCA-MikGZzK00']},
{'location' :  'Lake City CCD', 'name' : ['Hinsdale County'], 'id' : ['1QI-4xAOHtQ5GnuJ4kfgzTp49usvdp_0r']},
{'location' :  'La Veta CCD', 'name' : ['Huerfano County'], 'id' : ['1c-PS6c2F_bIu4Jn2iO76S718jjzQzeNw']},
{'location' :  'Walsenburg CCD', 'name' : ['Huerfano County'], 'id' : ['1c-PS6c2F_bIu4Jn2iO76S718jjzQzeNw']},
{'location' :  'Walden CCD', 'name' : ['Jackson County'], 'id' : ['176c44gmOChQqHNi35e1HNySGU4lRO03p']},
{'location' :  'Northeast Jefferson CCD', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Golden CCD', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'South Jefferson CCD', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Central Jefferson CCD', 'name' : ['Jefferson County'], 'id' : ['1ehiXhIlcb4F-d_366jXOM0Ke7pGti2kW']},
{'location' :  'Eads CCD', 'name' : ['Kiowa County'], 'id' : ['1i5CN_SJQHfdaU6cVac3lu4ogvd8oKxX-']},
{'location' :  'Sheridan Lake CCD', 'name' : ['Kiowa County'], 'id' : ['1i5CN_SJQHfdaU6cVac3lu4ogvd8oKxX-']},
{'location' :  'Haswell CCD', 'name' : ['Kiowa County'], 'id' : ['1i5CN_SJQHfdaU6cVac3lu4ogvd8oKxX-']},
{'location' :  'Flagler CCD', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Burlington CCD', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Stratton CCD', 'name' : ['Kit Carson County'], 'id' : ['1D1YWyWl87vRLXHEBoImZC2CimuMzHFzv']},
{'location' :  'Leadville CCD', 'name' : ['Lake County'], 'id' : ['1CAJj-J94QqfpHTs8QYehSyN287TaqDwo']},
{'location' :  'Durango CCD', 'name' : ['La Plata County'], 'id' : ['1dsvobTNDWG16FJxBImgItMnAHMrJD3zY']},
{'location' :  'Bayfield CCD', 'name' : ['La Plata County'], 'id' : ['1dsvobTNDWG16FJxBImgItMnAHMrJD3zY']},
{'location' :  'Ignacio CCD', 'name' : ['La Plata County'], 'id' : ['1dsvobTNDWG16FJxBImgItMnAHMrJD3zY']},
{'location' :  'Timnath-Wellington CCD', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Fort Collins CCD', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Loveland CCD', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Estes Park CCD', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Berthoud CCD', 'name' : ['Larimer County'], 'id' : ['1xPP5XTrWL1Hm3sWKm_PMujOnDUfES3qw']},
{'location' :  'Trinidad CCD', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Branson CCD', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Kim CCD', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Aguilar CCD', 'name' : ['Las Animas County'], 'id' : ['1J_mY4IJ6oFBpk1XZnTvlYPhPOOSDjAM3']},
{'location' :  'Limon CCD', 'name' : ['Lincoln County'], 'id' : ['10RDxCVgdstSTUHF0LaJ0kPAI336ubx7w']},
{'location' :  'Hugo CCD', 'name' : ['Lincoln County'], 'id' : ['10RDxCVgdstSTUHF0LaJ0kPAI336ubx7w']},
{'location' :  'Arriba CCD', 'name' : ['Lincoln County'], 'id' : ['10RDxCVgdstSTUHF0LaJ0kPAI336ubx7w']},
{'location' :  'Fleming CCD', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Peetz CCD', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Sterling CCD', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Crook CCD', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'Merino CCD', 'name' : ['Logan County'], 'id' : ['17sC6EUhTn6ek83dz6ge859csVXOhgSaV']},
{'location' :  'De Beque CCD', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Collbran CCD', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Glade Park-Gateway CCD', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Fruita CCD', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Grand Junction CCD', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Clifton CCD', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Whitewater-Kannah Creek CCD', 'name' : ['Mesa County'], 'id' : ['1aIfwjvVFn0CMgGtjeQkrpcHMwuUrADRY']},
{'location' :  'Creede CCD', 'name' : ['Mineral County'], 'id' : ['1aimliPIlX6MBriKYvhZxtNNwvfzBzvUn']},
{'location' :  'Craig CCD', 'name' : ['Moffat County'], 'id' : ['13NeZdU10joDIhde9Si-pmBAxaym15t89']},
{'location' :  'Dinosaur CCD', 'name' : ['Moffat County'], 'id' : ['13NeZdU10joDIhde9Si-pmBAxaym15t89']},
{'location' :  'Cortez CCD', 'name' : ['Montezuma County'], 'id' : ['1R9OOaVy5Ri6NaS07n2WHmq3FHIzozkHz']},
{'location' :  'Mancos CCD', 'name' : ['Montezuma County'], 'id' : ['1R9OOaVy5Ri6NaS07n2WHmq3FHIzozkHz']},
{'location' :  'Dolores CCD', 'name' : ['Montezuma County'], 'id' : ['1R9OOaVy5Ri6NaS07n2WHmq3FHIzozkHz']},
{'location' :  'Nucla CCD', 'name' : ['Montrose County'], 'id' : ['1LZATMj9LkQqUsuKJUIeyEvnpMIgO-Pxm']},
{'location' :  'Olathe CCD', 'name' : ['Montrose County'], 'id' : ['1LZATMj9LkQqUsuKJUIeyEvnpMIgO-Pxm']},
{'location' :  'Montrose CCD', 'name' : ['Montrose County'], 'id' : ['1LZATMj9LkQqUsuKJUIeyEvnpMIgO-Pxm']},
{'location' :  'Brush CCD', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Fort Morgan CCD', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Wiggins CCD', 'name' : ['Morgan County'], 'id' : ['1B_pMyiH0OcglmDx6cs2_-X9S9ttwNWOb']},
{'location' :  'Cheraw CCD', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Manzanola CCD', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Fowler CCD', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Rocky Ford CCD', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'La Junta CCD', 'name' : ['Otero County'], 'id' : ['1Ro-e3azyWBk6t7bxQ1jOBvB354mlSlmU']},
{'location' :  'Ouray CCD', 'name' : ['Ouray County'], 'id' : ['1xkyKXPb-DnUn3hdFb8-b91xDTQWUhZTD']},
{'location' :  'Fairplay CCD', 'name' : ['Park County'], 'id' : ['1uEA2l-as4O0Z16dz3ZWNnCAO7O_PsFrl']},
{'location' :  'Haxtun CCD', 'name' : ['Phillips County'], 'id' : ['1shQk_skdlIPOn5qg3J2Zp29dAD87j76d']},
{'location' :  'Holyoke CCD', 'name' : ['Phillips County'], 'id' : ['1shQk_skdlIPOn5qg3J2Zp29dAD87j76d']},
{'location' :  'Snowmass Village CCD', 'name' : ['Pitkin County'], 'id' : ['1wQwuA2OdP4X_2CUBvRkie8LEWCJZWAga']},
{'location' :  'Aspen CCD', 'name' : ['Pitkin County'], 'id' : ['1wQwuA2OdP4X_2CUBvRkie8LEWCJZWAga']},
{'location' :  'Granada CCD', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'Holly CCD', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'Lamar CCD', 'name' : ['Prowers County'], 'id' : ['1Sdh-nqvOxZjcOz30mfHw29kDNNGYaPhD']},
{'location' :  'St. Charles Mesa CCD', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Pueblo West CCD', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Pueblo CCD', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Colorado City-Rye CCD', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Northeast Pueblo CCD', 'name' : ['Pueblo County'], 'id' : ['1OV8jeHQH7xt7vDv87Tv2LGAQcJp-Wtcr']},
{'location' :  'Meeker CCD', 'name' : ['Rio Blanco County'], 'id' : ['1PllRSNG-bPxLZtfnrm_PUr1QKs0YavEG']},
{'location' :  'Rangely CCD', 'name' : ['Rio Blanco County'], 'id' : ['1PllRSNG-bPxLZtfnrm_PUr1QKs0YavEG']},
{'location' :  'Sargent CCD', 'name' : ['Rio Grande County'], 'id' : ['1Fbrx6rk1QKkJQVnr5x364rQAj8fNPt94']},
{'location' :  'Del Norte CCD', 'name' : ['Rio Grande County'], 'id' : ['1Fbrx6rk1QKkJQVnr5x364rQAj8fNPt94']},
{'location' :  'Monte Vista CCD', 'name' : ['Rio Grande County'], 'id' : ['1Fbrx6rk1QKkJQVnr5x364rQAj8fNPt94']},
{'location' :  'Steamboat Springs CCD', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Hayden CCD', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Oak Creek CCD', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Yampa CCD', 'name' : ['Routt County'], 'id' : ['1cylZcIVIlSYafoc_cB0gdVURuerm-o0U']},
{'location' :  'Center CCD', 'name' : ['Saguache County'], 'id' : ['1gp5P6S24R-OxzYL2unWP_Lg7Ms7-k9If']},
{'location' :  'Saguache CCD', 'name' : ['Saguache County'], 'id' : ['1gp5P6S24R-OxzYL2unWP_Lg7Ms7-k9If']},
{'location' :  'Silverton CCD', 'name' : ['San Juan County'], 'id' : ['1qmO8QKeGnimD4FH3_gXsEi24GtiW5Joo']},
{'location' :  'Telluride CCD', 'name' : ['San Miguel County'], 'id' : ['12Ug-wp2YQzHtERm42HbQXji9FFUGHqsy']},
{'location' :  'Norwood CCD', 'name' : ['San Miguel County'], 'id' : ['12Ug-wp2YQzHtERm42HbQXji9FFUGHqsy']},
{'location' :  'South Sedgwick CCD', 'name' : ['Sedgwick County'], 'id' : ['1OF4Vue6rmUKZWdUv8TI49CDNIBy-Wg4x']},
{'location' :  'Julesburg CCD', 'name' : ['Sedgwick County'], 'id' : ['1OF4Vue6rmUKZWdUv8TI49CDNIBy-Wg4x']},
{'location' :  'Breckenridge CCD', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Silverthorne CCD', 'name' : ['Summit County'], 'id' : ['1-Py5Xn8Bcf9QDQdXzu6MMX2fhLIcLG2Z']},
{'location' :  'Divide CCD', 'name' : ['Teller County'], 'id' : ['1XHAgazVcLElMD3ODCdr27jf9NN5Qgv3D']},
{'location' :  'Cripple Creek CCD', 'name' : ['Teller County'], 'id' : ['1XHAgazVcLElMD3ODCdr27jf9NN5Qgv3D']},
{'location' :  'Otis CCD', 'name' : ['Washington County'], 'id' : ['1A-MJZ698XW_k2CLe7_acPyiFGmiGxqk6']},
{'location' :  'Akron CCD', 'name' : ['Washington County'], 'id' : ['1A-MJZ698XW_k2CLe7_acPyiFGmiGxqk6']},
{'location' :  'Greeley CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'La Salle-Gilcrest CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Johnstown-Milliken CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Platteville CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Erie-Frederick CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Grover CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Fort Lupton CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Windsor CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Keenesburg-Hudson CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Raymer CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Kersey-Gill CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Ault CCD', 'name' : ['Weld County'], 'id' : ['18JFxRLHD7Q9N8LWoz2g70mQpBiA6Xg1m']},
{'location' :  'Wray CCD', 'name' : ['Yuma County'], 'id' : ['1oAs5pzHcSoKNbhinr99o6JLcYnogoO0w']},
{'location' :  'Yuma CCD', 'name' : ['Yuma County'], 'id' : ['1oAs5pzHcSoKNbhinr99o6JLcYnogoO0w']}
			]


outid = link_list.filter(d => (d.location == name))
return outid;
} //update_link

function downloadLinks(program, urls) {
// downloadLinks generates DOM links for selected agencies and geographies
var outDiv = document.getElementById('download_links')
outDiv.innerHTML = ""
const newParagraph = document.createElement("p");
newParagraph.innerHTML = "<u>Click on link(s) below to download bundle(s).</u>"
outDiv.appendChild(newParagraph)
 
var olist = document.createElement('ul');
if(program == "CSBG"){
urls.forEach(links => {
	var url = "https://drive.google.com/uc?export=download&id=" + links.id
	var textName = "Download " + links.name + " Data Bundle";
	var outlink = document.createElement('a');
    var li_line = document.createElement('li');
    outlink.href = url;
    outlink.innerText = textName;
	outlink.title = textName;
	outlink.ariaLabel = textName;
    li_line.appendChild(outlink);
    olist.appendChild(li_line);
	})
}  else {
	urls.forEach(links => {
		out_link = update_link(links.name)

		for(i = 0; i < out_link.length; i ++){
		nlinks = out_link[i].name.length
		for(j = 0; j < nlinks; j++){
			filelink = out_link[i].id[j]
			filename = out_link[i].name[j]
            var url = "https://drive.google.com/uc?export=download&id=" + filelink
			var textName = "Download " + filename + " Data Bundle";
			var outlink = document.createElement('a');
			var li_line = document.createElement('li');
			outlink.href = url;
			outlink.innerText = textName;
			outlink.title = textName;
			outlink.ariaLabel = textName;
			li_line.appendChild(outlink);
			olist.appendChild(li_line);
			}
		}
})
}
outDiv.appendChild(olist)
} // downloadLinks
